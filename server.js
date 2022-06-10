const express=require('express')
const dotenv=require('dotenv')
const connectDB = require("./config/db")

const auth =require('./route/auth')
const post =require('./route/post')
// const cors =require('cors')

dotenv.config({path:'./config/config.env'})
connectDB()

const app=express()
app.use(express.json())

// app.use(cors())
app.use(auth)
app.use(post)

const PORT=process.env.PORT


app.listen(PORT,()=>{
    console.log(`server is runing on ${PORT}`);
})