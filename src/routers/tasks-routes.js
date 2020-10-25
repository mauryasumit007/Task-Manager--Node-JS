const express= require('express')
const { update } = require('../models/task')
const Task= require('../models/task')
const auth= require('../middleware/auth')
const router= new express.Router()

// 
// router.get('/test',(req,res)=>{

//     res.send('From a new file')
// })

// Create new task

router.post('/tasks',auth,async (req,res)=>{  // only authenticated user can create task
    console.log(req.body)

   // const task= new Task(req.body)

   const task= new Task({
       ...req.body,
       owner: req.user._id

   })


    try{
        const tasks=  await    task.save()
        res.status(201).send(tasks)
    

    }catch(e){
        res.status(500).send()
    }


//     task.save().then(()=>{
 
//     res.send(task)

//     }).catch((e)=>{
// res.status(400).send(e)
       

//     })
})

// GET /tasks?Completed=true
// /tasks?limit=10&skip=20
// /tasks?sortBy=createdAt:desc

router.get('/tasks',auth,async (req,res)=>{
const match={}
const sort={}

if(req.query.completed){

    match.completed = req.query.completed === 'true'
}

if(req.query.sortBy){

    const parts = req.query.sortBy.split(':')
    sort[parts[0]] = part[1] === 'desc' ? -1 : 1
}

    try{
        //const tasks=  await  Task.find({owner:req.user._id})  // yhis is also work same
        await req.user.populate({
            path: 'tasks',
            // match:{
            //     completed:false,
                
            // },
            match,
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort
            }
            
                    }).execPopulate()
        res.status(201).send(req.user.tasks)
        if(!tasks){
          return  res.status(404).send()
    
          }
            res.send(tasks)
    

    }catch(e){
        res.status(500).send()
    }




    // Task.find({
        
    // }).then((tasks)=>{
    //     res.send(tasks)
    // }).catch((e)=>{

    //     res.status(500).send()
    // })
})

// Reading doc by id

router.get('/tasks/:id',auth,async (req,res)=>{

    const _id= req.params.id
    console.log(_id)

    try{
     //   const tasks=  await   Task.findById(id)  

     const tasks= await Task.findOne({_id,owner: req.user._id})
        res.status(201).send(tasks)
        if(!tasks){
          return  res.status(404).send()
    
          }
            res.send(tasks)
    

    }catch(e){
        res.status(500).send()
    }


    // Task.findById(id).then((task)=>{
        
    //   if(!task){
    //     res.status(404).send()


    //   }else{
    //     res.send(task)

    //   }

    // }).catch((e)=>{

    //     res.status(500).send()
    // })
})




// Upating task

router.patch('/tasks/:id',auth,async (req,res)=>{

    const updates= Object.keys(req.body)

    const allowedUpdates= ['description','completed']

    const isValidOperation= updates.every((update)=> allowedUpdates.includes(update))
    
if(!isValidOperation){
    return res.status(400).send({error: 'invalid update elements'})
}


try{

    //const task = await Task.findById(req.params.id)
    const task= await Task.findOne({_id:req.params.id,owner:req.user._id})

   

  //  const task= await Task.findByIdAndUpdate(req.params.id,req.body,{new: true, runValidators: true})

    if(!task){
        return res.status(404).send()
    }

    updates.forEach((update)=>task[update]= req.body[update])
    await task.save()

    res.send(task)

}catch(e){

res.status(400).send(e)
}

})

// Delete task by id

router.delete('/tasks/:id',auth,async (req,res)=>{
    try{
        //const task= await Task.findByIdAndDelete(req.params.id)
        const task= await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id})


        if(!task){
            return res.status(404).send()
        }

        res.send(task)

    }catch(e){
        res.status(500).send(e)
    }
})

module.exports= router