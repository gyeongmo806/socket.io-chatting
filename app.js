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
        i.data.map(data => {
            if(data.name == x){
                list.push(data)
            }
        })
        
    })
    res.send(list)
})
app.get('/data/:room', (req,res) => {
    var room = req.params.room
    var user = Object.keys(i.user)
    var rlist
    
    var data = i.data.map(data => {
        if(data.name == room) {
            rlist = data.userId
            console.log(rlist)
        }
    })
    console.log(user)
    console.log(rlist)
    var newlist = []
    rlist.map(aleadyId => {
        // console.log(aleadyId)
        user.map(allid => {
            if(allid != aleadyId){
                newlist.push(allid)
            }
        })
    })
    console.log(newlist)
    // console.log(alist)
    res.send(newlist)
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