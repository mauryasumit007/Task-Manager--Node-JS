const express= require('express')
require('./db/mongoose')
const User= require('./models/user')
const Task= require('./models/task')
// const { ObjectID } = require('mongodb')
// const { update } = require('./models/user')

const userRouter= require('./routers/user-routes')
const taskRouter= require('./routers/tasks-routes')

const app= express()
const port = process.env.PORT
app.use(express.json())   // automatically parse the incoming json amazing
app.use(taskRouter)
app.use(userRouter)




app.listen(port,()=>{

    console.log('server is runnint on port: ',port)
})

// Rough work below no user


