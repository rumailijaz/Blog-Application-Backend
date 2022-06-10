const mongoose=require('mongoose')

const connectDB=()=>{
    try {
        const conn=mongoose.connect(process.env.DB).then(()=>{
            console.log('DB Connected');
        })
    } catch (error) {
        console.log(error, 'DB Error');
    }
}

module.exports=connectDB