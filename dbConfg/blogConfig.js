const mongoose = require('mongoose')

require("dotenv").config()

const db = process.env.db

mongoose.connect(db).then(()=>{
    console.log("connected to database successfully")
}).catch( ()=>{
    console.log("error connecting to database")
})


