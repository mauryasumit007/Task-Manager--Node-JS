// CRUD operations

// const mongodb= require('mongodb')
// const MongoClient= mongodb.MongoClient

const {MongoClient,ObjectID}= require('mongodb')

const connectionURL='mongodb://127.0.0.1:27017'   // use port instead of localhost to avoid any issue
const databaseName='task-manager'

const id= new ObjectID()  // initializatoin
console.log(id)
console.log(id.getTimestamp())


MongoClient.connect(connectionURL,{useNewUrlParser:true},  (error,client) => {   

if(error){
    return  console.log('Unable to connect to DB')
    
}

//console.log('connected correctly')
const db= client.db(databaseName)

// Finding 1 doc

// db.collection('users').findOne({
//     _id:new ObjectID("5f82d519e119755e8cfc6a5e")
// },(error,user)=>{

//     if(error){
//         return console.log('user not found')
//     }

//     console.log(user)
// })

// finding many doc
// db.collection('users').find({
//     age:29
// }).toArray((error,users)=>{

//     console.log(users)
// })




// Insert one and many data 

// db.collection('users').insertOne({

//    // _id: id,
//     "name": "vikky",
//     "age": 24
// },(error,result)=>{

//     if(error){

//      return   console.log('Error inserting the user')
//     }

//     console.log(result.ops)


// })

// db.collection('users').insertMany([
//     {

//     "name": "Mamta",
//     "age": 32
// },

// {

//     "name": "Ankita",
//     "age": 22
// }
// ],(error,result)=>{

//     if(error){

//      return   console.log('Error inserting the user')
//     }

//     console.log(result.ops)


// })

// db.collection('tasks').insertMany([
//     {

//     description: 'clean the house',
//     completed: true
// },

// {

//     description: 'LReview inspection',
//     completed: false
// },

// {

//     description: 'Pot plants',
//     completed: false
// }
// ],(error,result)=>{

//     if(error){

//      return   console.log('Error inserting the tasks')
//     }

//     console.log(result.ops)


// })


// UPDATING DOCUMENTS

// db.collection('users').updateOne({
//     _id: new ObjectID("5f82d519e119755e8cfc6a5e")
// },{

// // $set:{
// //     name: 'Mikka'
// // }

//  $inc:{

//     age: 2
//  }

// }

// ).then((result)=>{
// console.log(result)

// }).catch((error)=>{
// console.log(error)
// })

// UPDATE MANY

// db.collection('tasks').updateMany({
//     completed: false
// },{

// $set:{
//     completed: true
// }


// }).then((result)=>{
// console.log(result)

// }).catch((error)=>{
// console.log(error)
// })

// })


// DELETE 

db.collection('users').deleteMany({
    age: 29
}).then((result)=>{
console.log(result)

}).catch((error)=>{
console.log(error)
})

})



