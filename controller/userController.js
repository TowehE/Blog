const {userModel} = require("../model/userModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validatesignUp, validatelogIn, } = require('../validator/validator');
const sendEmail = require('../email');
const { generateDynamicEmail } = require('../verifyemail');
require('dotenv').config();

const capitalizeFirstLetter = (str) => {
    return str[0].toUpperCase() + str.slice(1);
};
//Function to register a new user
exports.signUp = async (req, res) => {
    try {
        const { error } = validatesignUp(req.body);
        if (error) {
            return res.status(500).json({
                message: error.details[0].message
            })
        } else {
            const { firstName, lastName, userName, email, password } = req.body;
        
            const emailExists = await userModel.findOne({ email: email.toLowerCase() });
            if (emailExists) {
                return res.status(200).json({
                    message: 'Email already exists',
                })
            }
            const salt = bcrypt.genSaltSync(12)
            const hashpassword = bcrypt.hashSync(password, salt);
            const user = await new userModel({
                firstName: capitalizeFirstLetter(firstName),
                lastName: capitalizeFirstLetter(lastName) ,
                userName: capitalizeFirstLetter(userName),
                email: email.toLowerCase(),
                password: hashpassword,
            });
            if (!user) {
                return res.status(404).json({
                    message: 'User not found',
                })
            }
            const token = jwt.sign({
                firstName,
                lastName,
                email,
            }, process.env.secret, { expiresIn: "120s" });
            user.token = token;
            const subject = 'Email Verification'
            //jwt.verify(token, process.env.secret)
            const link = `${req.protocol}://${req.get('host')}/api/v1/verify/${user.id}/${user.token}`
            const html = generateDynamicEmail(firstName, link)
            sendEmail({
                email: user.email,
                html,
                subject
            })
            await user.save()
            return res.status(200).json({
                message: 'User profile created successfully',
                data: user,
            })

        }
    } catch (err) {
        return res.status(500).json({
            message: "Internal server error: " + err.message,
        })
    }
};


//Function to verify a new user with a link
exports.verify = async (req, res) => {
    try {
        const id = req.params.id;
        const token = req.params.token;
        const user = await userModel.findById(id);

        // Verify the token
        jwt.verify(token, process.env.secret);

        // Update the user if verification is successful
        const updatedUser = await userModel.findByIdAndUpdate(id, { isVerified: true }, { new: true });

        if (updatedUser.isVerified === true) {
            return res.status(200).send("You have been successfully verified. Kindly visit the login page.");
        }

    } catch (err) {
        if (err instanceof jwt.JsonWebTokenError) {
            // Handle token expiration
            const id = req.params.id;
            const updatedUser = await userModel.findById(id);
            const { firstName, lastName, email } = updatedUser;
            const newtoken = jwt.sign({ email, firstName, lastName }, process.env.secret, { expiresIn: "120s" });
            updatedUser.token = newtoken;
            updatedUser.save();

            const link = `${req.protocol}://${req.get('host')}/api/v1/verify/${id}/${updatedUser.token}`;
            sendEmail({
                email: email,
                html: generateDynamicEmail(firstName, link),
                subject: "RE-VERIFY YOUR ACCOUNT"
            });
            return res.status(401).send("This link is expired. Kindly check your email for another email to verify.");
        } else {
            return res.status(500).json({
                message: "Internal server error: " + err.message,
            });
        }
    }
};




//funtion to login
exports.login = async (req, res) => {
    try {
        const { error } = validatelogIn(req.body);
        if (error) {
            return res.status(500).json({
                message: error.details[0].message
            })
        } else {
   //get the user login details
   const { email, password } = req.body;

   //make sure both fiels are provided
   if (!email || !password) {
       return res.status(400).json({
           message: "please provide your email and password"
       })
   }
   //find the user in the database
   const user = await userModel.findOne({ email: email.toLowerCase() });

   //check if user is not exisiting in the darabase 
   if (!user) {
       return res.status(404).json({
           message: "user does not exist"
       })
   }


   //check for user password
   const checkPassword = bcrypt.compareSync(password, user.password)
   if (!checkPassword) {
       return res.status(400).json({
           mesage: "Password is not correct",
       })
   }

   const token = jwt.sign({
       userId: user._id,
       email: user.email,
       isAdmin: user.isAdmin
   }, process.env.secret, { expiresIn: "2d" })

   res.status(200).json({
       message: "login successfully",
       token
   })
        }
} catch (error) {
   res.status(404).json({
       message: error.message
   })
}

        }
     

//Function to signOut a user
exports.signOut = async (req, res) => {
    try {
        const userId = req.params.userId
        const user = await userModel.findById(userId)

        user.token = null;
        await user.save();
        res.status(201).json({
            message: "user has been signed out successfully"
        })
    }
    catch (error) {
        res.status(500).json({
            message: 'Internal Server Error: ' + err.message,
        })
    }
}
