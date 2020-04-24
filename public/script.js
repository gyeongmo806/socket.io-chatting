// $(document).ready(() => {
//     fetch('/getList').then(response => {
//         return response.json()
//     }).then(json => {
//         json.map(data => {
//             $('.room-list').append($('<li>').append($(`<a href='#' id='toRoom'>`).text(data.name)))
//         })
//         $('a').click(e => {
//             var room = e.target.textContent
//             if(this.roomName != undefined){
//                 socket.emit('exit',this.roomName)
//             }
//             socket.emit('selectroom', room)
//         })
//     })
    
// })

// var socket = io()
// $('.select').submit((e) => {
//     e.preventDefault()
//     var room = $('#room').val()
//     console.log(room)
//     socket.emit('selectroom', room)
// })
// $('.chat').submit((e) => {
//     e.preventDefault()
//     var msg = $('#data').val()
//     socket.emit('chat',msg,roomName)
//     console.log("send message :"+msg)
//     $('#data').val("")
// })
// socket.on('check room', msg => {
//     console.log(msg)
// })
// socket.on('status', status => {
//     console.log(404)
//     if(status == 404){
//         alert("Can't find the room")
//     }
// })
// socket.on('chat', msg => {
//     $('.chat-list').append($('<li>').text(msg))
// })
// socket.on('room', room => {
//     roomName = room
// })
// exit = () => {
//     if(confirm("이 방에서 나가시겠습니까?")){
//         socket.emit('exit',roomName)
//         $('.chat-list').text("")
//     }
// }

var inform = {
    id : '',
    room : '',
    roomIndex : undefined, 
 }
 var room
var index = {}
//login

//참여하고있는 방 리스트
$(document).ready(() => {
    $('#userid').val('jip080620')
    $('#room').hide()
    $('#main').hide()
     //$('#loginform').hide()
    $('#toMain').click(e => {
            toMain()
    })
   
})

var socket = io()
//로그인
$('#login').submit(e => {
    e.preventDefault()
    inform.id = $('#userid').val()
    socket.emit('login', inform)
})
socket.on('login', msg => {
    if(msg == 'success'){
        alert('로그인 성공!')
        
        //로그인 화면 넘어가기
        jQuery('#loginform').hide();  
        $('#main').show()
        //해당 아이디 룸 리스트 가져오기
        fetch('/getList/'+inform.id).then(response => {
            return response.json()
        }).then(json => {
            json.map(data => {
                console.log(data)
                $('.room-list').append($('<li>').addClass('list-group-item d-flex justify-content-between align-items-center').append($(`<a href='#' class='toRoom'>`).text(data.name)))
                console.log(data.index)
                index[data.name] = data.index
                console.log(index)
            })
            room = json
            //방에 들어가기
            $('.toRoom').click(e => {
                fetch('/getList/'+inform.id).then(response => {
                    return response.json()
                }).then(json => {
                    room = json
                    var roomname =e.target.textContent
                    var conv = room[index[roomname]].conv
                    inform.roomIndex = index[roomname]
                    conv.map(data => {
                        console.log(data)
                        console.log("datamapping")
                        $('.chat-list').append($('<li>').addClass('list-group-item').text(data.contents))
                    })
                    inform.room = roomname
                    console.log(inform.room)
                    socket.emit('enter', inform)
                })
            })
        })
    } else {
        alert('없는 아이디 입니다.')

    }
    
})
//초대하기
$('#invite').submit(e => {
    e.preventDefault()
    socket.emit('invite', $('#inviteId').val() ,inform)
})
socket.on('invite', msg => {
    console.log(msg)
})
//메세지 받기
socket.on('chat', msg => {
    console.log(msg)
    $('.chat-list').append($('<li>').addClass('list-group-item').text(msg))
    var elem = document.getElementById('conversList')
    elem.scrollTop = elem.scrollHeight;
})
//방에 들어가기
socket.on('enter', msg => {
    $('.title').text(inform.room)
    $('#main').hide()
    $('#room').show()

})
//메세지 전송
$('.chat').submit((e) => {
    e.preventDefault()
    var msg = $('#data').val()
    socket.emit('chat',msg,inform)
    console.log("send message :"+msg)
    $('#data').val("")
})

//메뉴화면으로
toMain = () => {
    $('#room').hide()
    $('#main').show()
    $('#conversList').children().remove()
}
socket.emit('invite', 'msmarin',inform)