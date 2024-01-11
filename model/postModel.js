const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title:
   { 
    type: String,
     required: true 
    },
  content: 
  { type: String,
     required: true
     },
     likes: { 
        type: Number, 
        default: 0
     },
        
      shares: 
      { 
        type: Number,
         default: 0
         },

  comments:[{
    text: 
    { 
      type: String,
       required: true
       }

  }
  ],
  user:
   { type: mongoose.Schema.Types.ObjectId,
     ref: "user" 
    },
},{timestamps:true});



const postModel = mongoose.model("Post", postSchema);

module.exports = {postModel}
