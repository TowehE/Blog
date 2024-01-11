//import express
const express = require("express")

const router = express.Router();

const{
    signUp,
    verify,
    login,
    signOut,
    
} = require("../controller/userController");

const {
    createPost,
    viewPost ,
    viewAllPost,
    postUpdate,
    deletePost,
    commentPost,
    viewAllComment,
    deleteComment,
    seeLikes,
    seeshares 
}= require("../controller/postController")

// const { authenticate } = require("../middleware/autheticate");

// endpoint to sign up
router.post("/signUp", signUp ),


//endpoint for verify 
router.get("/verify/:id/:token",  verify ),

//endpoint to logIn a user
router.post("/logIn", login),


///endpoint to create a post
router.post("/createPost", createPost),

//endpoint to view post
router.get("/view/:id",  viewPost),

//endpoint to view  allpost
router.get("/viewall", viewAllPost),
 
//endpoint to update a post
router.put("/update/:id", postUpdate),

//endpoint to delete a post
router.delete("/delete/:id", deletePost),

//endpoint to comment a post
router.post("/comment/:id", commentPost),


//endpoint to view a  comment on a post
router.get("/view/:id", viewAllComment),

//endpoint to delete a  comment on a post
router.delete("/delete/:postId/:commentId", deleteComment),

//endpoint to see like on a comment 
router.put("/like/:id", seeLikes),

//endpoint to see like on a comment 
router.post("/share/:id", seeshares),

//endpoint to sign out
router.post("/signout/:userId", signOut)

module.exports = router