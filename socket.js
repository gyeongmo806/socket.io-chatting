function e (io){
    let socket
    let data = [
        {
            name: 'myroom1',
            index: '0',
            userId: [
                'jip080620',
                'msmarin'
            ],
            conv : [
            ]
        },
        {
            name: 'myroom2',
            index: '1',
            userId: [
                'jip080620'
            ],
            conv : [
                {
                    time:'',
                    contents:'helloworld',
                    id:'jip080620',
                },
                {
                    time:'',
                    contents:'21',
                    id:'jip080620',
                },
                {
                    time:'',
                    contents:'hell124oworld',
                    id:'jip080620',
                }
            ]
        },
        {
            name: 'myroom3',
            index: '2',
            userId: [
                'jip080620'
            ],
            conv : [
            ]
        }
    ]
    let user = {
        jip080620: ['myroom1','myroom2', 'myroom3'],
        msmarin: ['myroom1'],
        jip0806:[],
        marin3:[]
    }
    io.on('connection', (socket) => {
        socket.on('login', inform => {
            var userList = Object.keys(user)
            console.log(userList.findIndex(x => x == inform.id))
            if(-1 != userList.findIndex(x => x == inform.id)){
                socket.emit('login', 'success')
            } else {
                socket.emit('login', 'fail')
            }
        })

        //enter room after check id
        socket.on('enter', inform => {
            if(data.findIndex(x => {x.name == inform.room && x.userId == inform.id})){       
                socket.join(inform.room)
                socket.emit('enter', "you are enter the" + inform.room)
                console.log(inform.id + " join in " + inform.room)
            }
        })
        
        //chat to room people
        socket.on('chat', (msg,inform) => {
            io.to(inform.room).emit('chat',inform.id , msg)
            var d = new Date()
            data.map(data => {
                if(inform.room == data.name){
                    data.conv.push({time: d,contents: msg,id: inform.id})
                }
            })
        })
        //invite people into now on room
        socket.on('invite', (inviteId ,inform) => {
            var i =data.findIndex((x) => x.name == inform.room)
            if(i != -1) {
                data[i].userId.push(inviteId)
                user[inviteId].push(inform.room)
                console.log(data)
                console.log(user)
                console.log("invited : "+inviteId)
                socket.emit('invite', "invited : "+inviteId,inviteId)
            }
        })
    })
    var send = (msg) => {
        if(socket != undefined)
        socket.emit('chat',msg)
    }
    
    
    return {
       send: send,
       user: user,
       data: data
    }
}



export default e