const express = require('express')
const app = express();
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const mysql = require('mysql')
const bodyParser = require('body-parser')
var session = require('express-session')
var FileStore = require('session-file-store')(session);
var fileStoreOptions = {};

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {},
    store: new FileStore(fileStoreOptions),
  }))

let user = {
    jip080620 : [
        'myroom',
        'room1'
    ],
    msmarin : [],
    jip0806 : [],
    gyeongmo: [
        'myroom'
    ]
}
var room = {
    myroom : [
        'jip080620',
        'gyeongmo'
    ],
    room1 : [
        'jip080620'
    ]
}
var soc = {

}

io.on('connection', (socket,id) => {
    socket.on('conn', userid => {
        soc[userid] = socket.id
        console.log(userid)
        console.log(soc)
    })
    //enter room after check id
    socket.on('enter', (selectRoom,userid) => {
        if(room[selectRoom].findIndex(x => x == userid) != -1){
            socket.join(selectRoom)
            socket.emit('enter', "you are enter the" + selectRoom)
            console.log(userid + " join in " + selectRoom)
        }
    })
    
    //chat to room people
    socket.on('chat', (msg,selectRoom,userid) => {
        var sql ="INSERT INTO MESSAGE (sendid, contents, room, sendTime) VALUES (?, ?, ?, now())"
        var params = [userid, msg, selectRoom]
        conn.query(sql, params, (err, rows, fields) => {
            if(err) console.log(err)
            io.to(selectRoom).emit('chat',userid , msg)
            console.log(userid + ":" + msg)
        })
    })
    // invite people into now on room
    socket.on('invite', (inviteId ,selectRoom, userid) => {
        if(user[inviteId]) {
            room[selectRoom].push(inviteId)
            user[inviteId].push(selectRoom)
            console.log("invited : "+inviteId)
            socket.emit('invite', "invited : "+inviteId,inviteId)
            console.log(soc)
            socket.broadcast.to(soc[inviteId]).emit('your invited', selectRoom, userid)
        }
    })
})

const conn = mysql.createConnection({
    host:'localhost',
    user :'root',
    password: '1q2w3e4r',
    database:'chat',
})

var authLogin = (req) => {
    if(req.session.isLogin == true) {
        return true
    } else {
        return false
    }
}
app.get('/', (req,res) => {
    console.log('home path')
    if(authLogin(req)) {
        console.log("already logined")
        var options = {
            root: __dirname + '/public',
            dotfiles: 'deny',
            headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
            
            },
            
 
        }
        res.cookie('id' , req.session.userid);
        res.sendFile('chatting.html', options)
    } else {
        res.sendFile(__dirname + "/public/login.html")
    }
    console.log(req.sessionID)
})

app.post('/login', (req,res) => {
    console.log('login path')
    var userid = req.body.userid
    var password = req.body.password
    var sql = `SELECT * FROM USER WHERE userid='${userid}'`
    console.log(typeof(userid), password)
    if(userid === '' || password === '') {
        console.log('?')
        res.sendStatus(404)
        return 0
    }
    conn.query(sql, (err, rows, fields) => {
        if(err){
            console.log(err)
            console.log('undefined')
            res.sendStatus(404)
            return 0
        }
        try {
            if(userid === rows[0].userid){
                if(password === rows[0].password){
                    req.session.isLogin = true
                    req.session.userid = userid
                    console.log('login')
                    res.redirect('/')
                } else {
                    res.sendStatus(404)
                }
                
            }
        } catch(err) {
            console.log(err)
            console.log('undefined')
            res.sendStatus(404)
        }
         
    })
})
app.get('/logout', (req,res) => {
    req.session.isLogin = false
    req.session.userid = ""
    res.redirect('/')
})
app.get('/register', (req,res) => {
    res.sendfile(__dirname + "/public/register.html")
})
app.post('/register', (req,res) => {
    var sql = "INSERT INTO user (userid, password) VALUES (?, ?)"
    var params = [req.body.userid, req.body.password]
    conn.query(sql, params,(err,rows,fields) => {
        if(err) console.log(err)
        res.redirect('/')
    })
})
app.get('/getList', (req,res) => {
    console.log('getList path')
    if(authLogin(req)){
        var list = []
        var userid = req.session.userid
        user[userid].map(rooms => {
            list.push(rooms)
        })
        res.send(list)
    }
})
app.get('/data/:room', (req,res) => {
    console.log('rooms message data path')
    var selectroom = req.params.room
    var sql = `SELECT * FROM MESSAGE WHERE room='${selectroom}'`
    conn.query(sql, (err, rows, fields) => {
        if(err) console.log(err)
        res.send({contents: rows, joinid: room[selectroom]})
    })
})

app.get('/invitelist/:selectRoom', (req,res) => {
    console.log('invite list path')
    var list = JSON.parse(JSON.stringify(user))
    var selectRoom = req.params.selectRoom
    room[selectRoom].map(id => {
        if(user[id]) {
            delete list[id]
        }
    })
    res.send(Object.keys(list))
})

http.listen(3000,() => {
    console.log("open server")
})