const express=require('express')
const route=express.Router()

const requiredLogin = require('../Middleware/requiredLogin')

const Post=require('../models/post')

// view all posts
route.get('/allposts',requiredLogin,(req,res)=>{
    Post.find()
    .populate('postedBy','_id name')
    .populate('comments.postedBy','_id name')
    .sort('-createdAt')
    .then(posts=>{
        res.json({posts:posts})
    }).catch(err=>{
        console.log(err);
    })
})

// add or create post
route.post('/createpost', requiredLogin,(req,res)=>{
        const {title , body, pic} = req.body
        
        if(!title || !body || !pic )
        {
            // console.log('not')
            return  res.status(422).json({error:"Please fill all fields"})

        }
        else
        {
            // console.log('yes')
            req.user.password=undefined 
        
            const post = new Post({
                title,
                body,
                photo:pic,
                postedBy:req.user
            })
            post.save().then(result =>{
                res.json({post:result, message:'post created succesfully'})
            }).catch(err=>{
                console.log(err,'error');
            })
        }

})

// view all posts which are created by that user who logged in
route.get('/mypost',requiredLogin,(req,res)=>{
    Post.find({postedBy:req.user._id})
    .populate('postedBy', '_id name')
    .then(myposts=>{
        res.json({myposts})
    }).catch(err=>{
        console.log(err,'error');
    })
})

// like
route.put('/like',requiredLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            return req.status(422).json({error:err})
        }
        else{
            res.json({result})  
        }
    })
})

// unlike
route.put('/unlike',requiredLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            res.json({result})
        }
    })

})

// comments

route.put('/comment',requiredLogin,(req,res)=>{
    const comment={
        text:req.body.text,
        postedBy:req.user._id  
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true        
    })
    .populate('comments.postedBy','_id name')
    .populate('postedBy','_id name')
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            res.json({result})
        }
    })
})

// delete

route.delete('/deletepost/:postId',requiredLogin,(req,res)=>{
    Post.findOne({_id:req.params.postId}).exec((err,post)=>{
        if(err || !post){
            return res.status(422).json({error: err})
        }
        // if(post.postedBy._id.toString()==req.user._id.toString()){
            post.remove().then(result=>{
                res.json({result,message:'deleted successfully'})
            }).catch(err=>{
                console.log(err);
            })
        // }
    })
}) 

// route.delete('/deletepost/:postId',requiredLogin,(req,res)=>{

//     const deletepost = Post.findById(req.params.id)
//     if(!deletepost)
//     {
//         return res.status(404).json({
//             succees:false,
//             message:"no id for this  photo"
    
//         })

//     }
//     deletepost.remove().then(result=>{res.json({result,message:'deleted successfully'})})

// })

module.exports = route
