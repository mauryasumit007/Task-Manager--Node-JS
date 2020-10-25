const mongoose = require('mongoose')
const validator= require('validator')
const bcrypt = require('bcryptjs')
const jwt= require('jsonwebtoken')
const Task= require('./task')

const userSchema=new  mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
       
        validate(value) {
            if (value.toLowerCase().includes('password')) {
             console.log(value.toLowerCase())
            
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a postive number')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar:{
        type: Buffer
    }

},{

    timestamps: true
})

userSchema.virtual('tasks',{  

    ref:'Task',
    localField:'_id',
    foreignField:'owner'
})

userSchema.methods.toJSON= function(){   //toJSON method will be used for editing how to send output data filter it

    const user= this
    const userObject= user.toObject()  // it will give us only that data of profile which we want to show to user

    delete userObject.password  // remove password from output response
    delete userObject.tokens    // remove tokens array from postman output response 
    delete userObject.avatar

    return userObject
}






// methods accesible with instances
userSchema.methods.generateAuthToken = async function(){

    const user= this
    const token= jwt.sign({_id: user._id.toString()},'thisismynewcourse')

    user.tokens=  user.tokens.concat({token})  // add additional object in response named tokens
     await user.save()

    return token
}

// statics only accessible within model
userSchema.statics.findByCredentials = async (email,password) => {
const user = await User.findOne({email})
if(!user){

   throw new Error('User is Invalid')
}

const isMatch = await bcrypt.compare(password,user.password)

if(!isMatch){
    throw new Error('Wrong Password , Please enter again')
}

return user

}




//Hash the plain text password  before saving to db
userSchema.pre('save',async function(next){   // user standard function in that case

const user = this

if(user.isModified('password')){

user.password= await bcrypt.hash(user.password,8)

}


next()  // for movin to next step otherwise app will hang

})

//Delete all tasks of user if user deleted his profile using middleware functionality (very good concept)

userSchema.pre('remove', async function (next){
const user= this
await Task.deleteMany({owner:user._id})
next()

})

const User= mongoose.model('User',userSchema)

// Setting the data

//   new User({

//     name: 'Raju',
//     email: 'HELLO@gmail.com',
//     password: 'Password222'
// }).save().then((result)=>{
//     console.log(result)
// }).catch((error)=>{
//     console.log('Error is: ',error)
// })

// export user

module.exports=User    // to be used in index.js for user json validation coming from client
