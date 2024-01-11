const hapiJoiValidator = require("@hapi/joi")

const validatesignUp =(data) => {

    const validateFacebook = hapiJoiValidator.object({
        firstName: hapiJoiValidator.string().min(3).max(40).required().messages({   
            "string.empty":"firstName cannot be left empty",
            "string.min": "minimum of 3 characters"

        }),
        lastName: hapiJoiValidator.string().min(3).max(40).required().messages({  
            "string.empty":"surname cannot be left empty",
            "string.min": "minimum of 3 characters"
            
        }), 
        userName: hapiJoiValidator.string().min(3).max(40).required().messages({  
            "string.empty":"surname cannot be left empty",
            "string.min": "minimum of 3 characters"
            
        }), 
        email: hapiJoiValidator.string().email({ tlds: { allow: false } }).trim().min(5).pattern(new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)).required().messages({
            "string.empty":"email cannot be left empty",
            "string.pattern.base": "Invalid email format"
             
        }),  

        password: hapiJoiValidator.string().min(6).max(30).required().messages({
            "string.empty":"confirm password cannot be left empty"

            
        }), 

    
       


      
       
    })
    return validateFacebook.validate(data);


}

const validatelogIn = (data) => {  
    try{
        
  
        const validateUser= hapiJoiValidator.object({
            email: hapiJoiValidator.string().email({ tlds: { allow: false } }).trim().min(5).pattern(new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)).required(),
           password: hapiJoiValidator.string().min(6).max(30).required(),
      
     })

   return validateUser.validate(data);

     } catch (err) {
        console.log(err.message);
        }
    };

module.exports = {validatesignUp,
    validatelogIn
    
};