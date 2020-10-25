const express= require('express')
const User= require('../models/user')
const router= new express.Router()
const auth = require('../middleware/auth')
const multer= require('multer')
const { remove } = require('../models/user')
const sharp= require('sharp')
const { sendWelcomeMail,sendCancelMail } = require('../emails/account')


router.get('/test',(req,res)=>{

    res.send('From a new file')
})



router.post('/users',async (req,res)=>{
    console.log(req.body)

    const user= new User(req.body)

    try{
       
       const token=  await user.generateAuthToken()
        await user.save()
        sendWelcomeMail(user.email,user.name)
      //  res.status(201).send(user)

      res.status(201).send({user,token})


    }catch(e){
res.status(400).send(e)
    }



//     user.save().then(()=>{   // old way
 
//     res.status(201).send(user)

//     }).catch((e)=>{
// res.status(400).send(e)
       

//     })


})


// User login 
router.post('/users/login',async (req,res)=>{
    //const user= new User(req.body)

try{
    const user=await User.findByCredentials(req.body.email, req.body.password)
    const token= await user.generateAuthToken()
    res.send({user: user,token})

    //await user.save()


    res.send({user,token})


}catch(e){

    res.status(400).send({error: e})

}


})

// User Logout task
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

       // console.log(token.token)

        res.send({message: 'Logout successfully'})
    } catch (e) {


        res.status(500).send({error: e})
    }
})

// User Logout task
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()

       // console.log(token.token)

        res.send({message: 'Logout successfully'})
    } catch (e) {


        res.status(500).send({error: e})
    }
})





// Reading user profile

router.get('/users/me',auth,async (req,res)=>{

  res.send(req.user)   // fetch req of only authenticated user
})

// Reading doc by id  

router.get('/users/:id',async (req,res)=>{

    const id= req.params.id
    console.log(id)


    try{
        const users =  await User.findById(id)
        res.status(201).send(users)
        if(!user){
          return  res.status(404).send()
    
          }
            res.send(user)
    

    }catch(e){
        res.status(500).send()
    }

    // User.findById(id).then((user)=>{    // old way
        
    //   if(!user){
    //     res.status(404).send()


    //   }else{
    //     res.send(user)

    //   }

    // }).catch((e)=>{

    //     res.status(500).send()
    // })
})


// Upating user

router.patch('/users/me',auth,async (req,res)=>{

    const updates= Object.keys(req.body)

    const allowedUpdates= ['name','email','password','age']

    const isValidOperation= updates.every((update)=> allowedUpdates.includes(update))
    
if(!isValidOperation){
    return res.status(400).send({error: 'invalid update elements'})
}


try{

   // const user= await User.findById(req.params.id)



updates.forEach((update)=>req.user[update]= req.body[update])  //it will take all the updated elements like name,pwd 

await req.user.save()



   // const user= await User.findByIdAndUpdate(req.params.id,req.body,{new: true, runValidators: true})

    // if(!user){
    //     return res.status(404).send()   // no need as user already comes through auth 
    // }

    res.send(req.user)

}catch(e){

res.status(400).send(e)
}

})

// Deleting endpoint 

router.delete('/users/me',auth,async (req,res)=>{
    try{
        const user= await User.findByIdAndDelete(req.user._id)   // due to auth we have access to valid user id

        // if(!user){
        //     return res.status(404).send()  // no need as we already has valid user with auth
        // }
        await req.user.remove()
        sendCancelMail(req.user.email,req.user.name)
        res.send(req.user)

    }catch(e){
        res.status(500).send(e)
    }
})

const upload= multer({
    //dest:'avatars',
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){

            return cb(new Error('please select a file of image type'))
        }

        cb(undefined,true)
    }
}



)
// Upload file using malter

router.post('/users/me/avatar',auth,upload.single('avatar'),async (req,res)=>{  // only upload if user is autheticated
const buffer= await sharp(req.file.buffer).resize({width:250 , height:250 }).png().toBuffer()

req.user.avatar=buffer

await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error: error.message})
})

 // delete image

 router.delete('/users/me/avatar',auth,async (req,res)=>{  // only upload if user is autheticated
    req.user.avatar=undefined
    await req.user.save()
        res.send()
    },(error,req,res,next)=>{
        res.status(400).send({error: error.message})
    })

    // Read the avatar of user/ without auth

    router.get('/users/:id/avatar',async (req,res)=>{  // only upload if user is autheticated

     try{
      const user= await User.findById(req.params.id)
      if(!user || !user.avatar){
 throw new Error()

      }

     res.set('Content-Type','image/png')
     res.send(user.avatar)

     }catch(e){
res.status(400).send()
     }


        req.user.avatar=undefined
        await req.user.save()
            res.send()
        },(error,req,res,next)=>{
            res.status(400).send({error: error.message})
        })
    


module.exports= router