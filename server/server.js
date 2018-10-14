const path = require('path')
const http = require('http')
const express = require('express')
const socketIo = require('socket.io')
const {generateMessage,generateLocationMessage} = require('./utils/message')
const {isRealString} = require('./utils/validation')
const {Users} = require('./utils/users')
const publicPath = path.join(__dirname,'../public')
//console.log(__dirname + '/../public')
//console.log(publicPath)
var app = express()
const port = process.env.port || 8080

//integrating server with websockets
var server = http.createServer(app)
var io = socketIo(server)

var users = new Users()

app.use(express.static(publicPath))

//lets you register a even listner client is connected
//here socket refers to individual user who is
//connected to the server
io.on('connection',(socket)=>{
  console.log('new user connected')
   
    socket.on('join',(params,required)=>{
      //validate the name and room not a empty
      if(!isRealString(params.name) || !isRealString(params.room)) {
       return required('please enter valid name and room')
      }
      //allowing only specific members
      socket.join(params.room)
      //if the user exists in any other room he is removed
      users.removeUser(socket.id)
      //and adds user to new room
      users.addUser(socket.id,params.name,params.room)
      //emitting the event
      io.to(params.room).emit('updateUserList',users.getUserList(params.room))
        //socket.emit from admin text welcome to the chat app
    socket.emit('newMessage',generateMessage('Admin','Welcome to the chat app'))
    //broadcasting
    socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin',`${params.name} has joined`))

      //this must be empty because we dont wanna pass any errors back
      required()
    })
      
  //emit creates an event
//   socket.emit('newEmail',
// {
//     //this data sent fro server to the client
//     from :'Bharath',
//     text :'ssup'
// })
   socket.on('createMessage',(message,callback)=>{
       console.log('createMessage',message)
       //this is created in classes
       var user =  users.getUser(socket.id)
       //only emit to certain users and generating username
       if(user && isRealString(message.text)) {
        io.to(user.room).emit('newMessage',generateMessage(user.name,message.text))
       }
        
        callback()
        
    //  socket.broadcast.emit('newMessage',{
    //     from : message.from,
    //     text : message.text,
    //     createdAt : new Date().getTime()
    // })
   })
   socket.on('createLocationMessage',(coords)=>{
   //securing location button
     var user = users.getUser(socket.id)
     if(user) { 
     io.to(user.room).emit('newLocationMessage',generateLocationMessage(user.name,coords.latitude,coords.longitude))
     }
   })
    
//socket
  socket.on('disconnect',()=>{
      //console.log('user disconnected')
      var user = users.removeUser(socket.id)
      if(user) {
          io.to(user.room).emit('updateUserList',users.getUserList(user.room))
          io.to(user.room).emit('newMessage',generateMessage('Admin', `${user.name} has left`))
      }

  })
})

server.listen(port,()=>{
    console.log(`server is up on ${port}`)
})

