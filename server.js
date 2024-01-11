
const express = require("express");

require('./dbConfg/blogConfig')

require('dotenv').config();

const routerPost = require("./routers/router")



const app =  express();

const port = process.env.port 


app.use(express.json());
 
 app.use("/api/v1", routerPost)

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
})
