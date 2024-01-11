const {postModel} = require("../model/postModel");



//create a post
exports.createPost = async (req, res) =>{
    try{
      const {title, content } = req.body

        const post = await postModel.create({
            title,
            content
        })

        if(!post){
            return res.status(403).json({
                message: `Error creating post`
            })
        }

        res.status(201).json({
            message: `You have successfully created a post`,
            data: post
        })

    }catch(err){
        res.status(500).json({
            message: err.message
        })
    }
}

//view a post
exports.viewPost = async (req, res) => {
    try {

        const id = req.params.id

        const blog = await postModel.findById(id).populate('comments');

        if(!blog){
            return res.status(404).json({
                message: `Post with this ID not found`
            })
        }
        res.status(200).json({
            message: `Post fetched successfully`,
            data: blog
        })

    }catch(err){
        res.status(500).json({
            message: err.message
        })
    }
}

    
// view all post 
exports.viewAllPost = async (req, res) => {
    try {
        const blog = await postModel.find().populate('comments');

        if(blog.length === 0){
            return res.status(404).json({
                message: `There are no Posts present here`
            })
        }
        res.status(200).json({
            message: `Posts fetched successfully. There are ${blog.length} posts here`,
            data: blog
        })

    }catch(err){
        res.status(500).json({
            message: err.message
        })
    }
}
//update a post
exports.postUpdate = async (req, res) => {
    try {
        //get the post id to be updated
        const id = req.params.id

        //find the post with rhe id
        const post = await postModel.findById(id);

        //(check if the post is found
        if (!post) {
            return res.status(404).json({
                message: `post not found`,
            })
        }

        //update the post's score sheet
        const updatePost = {
            title: req.body.title || post.title,
            content: req.body.content || post.content
        }


        //update the database with the entered sheet
        const posts = await postModel.findByIdAndUpdate(
            id,
            updatePost,
            { new: true }
        )

        // return a response
        return res.status(200).json({
            message: "Post updated successfully",
            post: {
                title: posts.title,
                content: posts.content,
            }

        })
    } catch (error) {
        res.status(404).json({
            message: error.message
        })
    }
}


//delete a post
exports.deletePost = async (req, res) => {
    try{
    const postId = req.params.id;

    // Find all comments related to the post
    const commentsToDelete = await postModel.find({ post: postId });

    // Delete all related comments
    await postModel.deleteMany({ post: postId });

    // Delete the post
    const deletedBlog = await postModel.findByIdAndDelete(postId);

    if (!deletedBlog) {
        return res.status(404).json({
            message: `Post ID not found to be deleted`
        });
    }

    res.status(200).json({
        message: `Post and associated comments deleted successfully`,
        data: {
            deletedBlog,
            deletedComments: commentsToDelete,
        }
    });

} catch (err) {
    res.status(500).json({
        message: err.message
    });
}
}


// comment a post
exports.commentPost = async (req, res) => {
    try {
        const postId = req.params.id;

        const {text}=req.body
    
      const blog = await postModel.findById(postId)
        
        if(!blog){
            return res.status(404).json({
                message:`Post not found`
            })
        }
        
        const comment = {
            text,
           
        };
        blog.comments.push(comment)
        await blog.save()
    

        res.status(201).json({
            message: `${blog.userName} just commented on this post`,
            data: comment
        })

    }catch(err){
        return res.status(500).json({
            message: err.message
        })
    }
}

//view all comment
exports.viewAllComment = async (req, res) => {
    try {
        const comment = await postModel.find()

        if(comment.length === 0){
            return res.status(404).json({
                message: `There are no comments present here`
            })
        }
        res.status(200).json({
            message: `Comments fetched successfully. There are ${comment.length} Comments here`,
            data: comment
        })

    }catch(err){
        res.status(500).json({
            message: err.message
        })
    }
}


//delete a comment on a post
exports.deleteComment = async (req, res) => {
    try {
        const postId = req.params.postId;
        const commentId = req.params.commentId;

        const post = await postModel.findById(postId);

        if (!post) {
            return res.status(404).json({
                message: `No post with this ID available`,
            });
        }

        // Find the index of the comment in the array
        const commentIndex = post.comments.findIndex(comment => comment._id.toString() === commentId);

        if (commentIndex === -1) {
            return res.status(404).json({
                message: `Comment ID not found to be deleted`,
            });
        }

        // Remove the comment from the array
        const deletedComment = post.comments.splice(commentIndex, 1)[0];
        await post.save();

        res.status(200).json({
            message: `Comment deleted successfully`,
            data: deletedComment,
        });
    
        }catch(err){
            res.status(500).json({
                message: err.message
              })
        }
    }

//to see all likes
exports.seeLikes = async (req, res) => {
    try {

        const id = req.params.id
        const post = await postModel.findById(id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
          }
    
           post.likes += 1;

       
        await post.save();
        res.status(200).json({
            message: "Post liked successfully",
            post
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }

};

//to see  share post
exports.seeshares = async (req, res) => {
    try {

        const id = req.params.id
        const post = await postModel.findById(id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
          }
    
        post.shares += 1;

    
        await post.save();
        res.status(200).json({
            message: "Post shared successfully",
            post
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }

};

