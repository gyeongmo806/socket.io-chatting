const app = require('express')();
const http = require('http').createServer(app)
const io = require('socket.io')(http)

var data = [
    {
        name: "friends",
    },
    {
        name: "friends1",
    },
    {
        name: "friends2",
    }
]
app.get('/',(req,res) => {
    res.sendFile(__dirname + "/index.html")
})
app.get('/getList', (req,res) => {
    res.send(data)
})
io.on('connection', (socket) => {
    console.log(socket.id + "is connected")
    socket.on('selectroom', room => {
        if(data.some(data => {
            if(data.name == room){
                console.log(socket.id + "'s room is: " + room)
                socket.join(room)
                socket.emit('room',room)
                io.to(room).emit('chat',socket.id + "'s enter this room")
                return true
            }
        }) != true) {
            socket.emit('status', 404)
        }        
    })
    setInterval(()=>{
        io.to('friends').emit('chat', "hello")
    },3000)
    socket.on('chat', (msg,rooms) => {
        console.log(rooms)
        io.to(rooms).emit('chat',socket.id + ": " +msg)
        console.log(socket.id +"is send : "+ msg)
    })
    socket.on('exit', (rooms) => {
        socket.leaveAll()
        io.to(rooms).emit('chat',socket.id + "'s exit the room")
        console.log(socket.id + "'s exit the room")
    })
})

http.listen(3000,() => {
    console.log("open server")
})