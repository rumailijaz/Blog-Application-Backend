const express=require('express')
const route=express.Router()

const User=require('../models/user')
const requiredLogin=require('../Middleware/requiredLogin')

const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')


// signup

route.post('/signup',(req,res)=>{
    
    const {name, email, password} = req.body

    if(!name || !email || !password){
        return res.status(422).json({error: "please fill all the fields"})
    }

    User.findOne({ email : email}).then((saveduser)=>{
            if(saveduser){
                return res.status(422).json({ error: "User Email already exist. please  try with another Email" })

            }
            
                bcrypt.hash(password, 12).then((hashedpassword)=>{

                    const user = new User({
                        name,
                        email,
                        password:hashedpassword
                    })
                    user.save().then(user=>{
                        res.json({ message: "User Registration Succcessful !! " })

                    }).catch(err=>{
                        console.log(err,'error');
                    })
                })
          
            }).catch(error=>{
                console.log(error,'errorrrr');
        
        
            })
    })
    

// sign in
route.post('/sign',(req,res)=>{
    const { email, password} = req.body
    if(!email || !password){
        return res.status(422).json({error:"please fill all the fields"})
    }
    User.findOne({email:email}).then((saveduser)=>{
            if(!saveduser){
                return res.status(422).json({error:"Wrong pasword and email"} )
            }
            
            bcrypt.compare(password, saveduser.password).then((domatch)=>{
                if(domatch){
                    const token = jwt.sign({_id:saveduser._id},process.env.jwtkey)
                    const {id,name,email}= saveduser
                    return res.status(200).json({message:"user logged in congrats" , token,
                        user:{id, name, email}})

                }
                {
                    return res.status(422).json({error:"Wrong pasword and email"})

                }
            }).catch(err=>{
                console.log(err);
            })
    })

})

// protected admin
route.get('/admin',requiredLogin,(req,res)=>{
    res.send('helo user')

})
module.exports = route