
const mongoose = require('mongoose')
const validator= require('validator')

const taskSchema= new mongoose.Schema({

    description:{
        type: String,
        required:true,
        trim: true
        

    },
    completed:{
type: Boolean,
default: false
},
owner:{   // without owner of task not possible to create task

type: mongoose.Schema.Types.ObjectId,
required: true,
ref: 'User'

}

    

},{

    timestamps: true
})




const Task= mongoose.model('Task',taskSchema)

// new Task({

//     description: '  Eat lunch',
    
// }).save().then((result)=>{
//     console.log(result)
// }).catch((error)=>{
//     console.log('Error is: ',error)
// })

module.exports=Task    // to be used in index.js for user json validation coming from client
