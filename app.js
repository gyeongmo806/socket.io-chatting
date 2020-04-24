const express = require('express')
const app = express();
const http = require('http').createServer(app)
const io = require('socket.io')(http)
import socket from './socket'
app.use(express.static('public'))

var i = socket(io)


app.get('/',(req,res) => {
    res.sendFile(__dirname + "/index.html")
})
app.get('/getList/:id', (req,res) => {
    var userId = req.params.id
    var list = []
    i.user[userId].map(x => {
        console.log("id have room "+x)
        i.data.map(data => {
            //console.log(data.name)
            if(data.name == x){
                console.log(x)
                list.push(data)
            }
        })
        
    })
    console.log(list)
    res.send(list)
})
// io.on('connection', (socket) => {
//     socket.on('selectroom', room => {
//         if(data.some(data => {
//             if(data.name == room){
//                 console.log(socket.id + "'s room is: " + room)
//                 socket.join(room)
//                 socket.emit('room',room)
//                 io.to(room).emit('chat',socket.id + "'s enter this room")
//                 return true
//             }
//         }) != true) {
//             socket.emit('status', 404)
//         }        
//     })
//     socket.on('chat', (msg,rooms) => {
//         console.log(rooms)
//         io.to(rooms).emit('chat',socket.id + ": " +msg)
//         console.log(socket.id +"is send : "+ msg)
//     })
//     socket.on('exit', (rooms) => {
//         socket.leaveAll()
//         io.to(rooms).emit('chat',socket.id + "'s exit the room")
//         console.log(socket.id + "'s exit the room")
//     })
// })

http.listen(3000,() => {
    console.log("open server")
})