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
                    console.log(room)
                    //대화대용 가져오기
                    room.map(data => {
                        //데이터의 아이디와 지금 아이디가 같으면 우로 아니면 좌로 정렬
                        if(data.name == roomname){
                            console.log(data)
                            data.conv.map(data => {
                                if(data.id == inform.id){
                                    $('.chat-list').append($('<li>').addClass('list-group-item text-right').text(data.contents))
                                } else {
                                    console.log(data.id)
                                    $('.chat-list').append($('<li>').addClass('list-group-item').text(data.id + " : " + data.contents))
                                }
                            })
                        }
                    })
                    //초대 되있는 사람 ID
                    room.map(data => {
                        if(data.name == roomname){
                            data.userId.map(data => {
                                $('.invite').before($('<div class="dropdown-item convuser">').text(data))
                            })
                        }
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

//메세지 받기
socket.on('chat', (id, msg) => {
    console.log(msg)
    if(inform.id == id){
        $('.chat-list').append($('<li>').addClass('list-group-item text-right').text(msg))
    } else {
        $('.chat-list').append($('<li>').addClass('list-group-item ').text(id + " : " + msg))
    }
    var elem = document.getElementById('conversList')
    elem.scrollTop = elem.scrollHeight;
})
//방에 들어가기
socket.on('enter', msg => {
    $('.title').text(inform.room)
    $('#main').hide()
    $('#room').show()
    var elem = document.getElementById('conversList')
    elem.scrollTop = elem.scrollHeight;
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
    $('.convuser').remove()
    $('#conversList').children().remove()
    $('.custom-select').children().remove()
}
invitelist =() => {
    fetch('/data/'+inform.room).then(response => {
        return response.json()
    }).then(json => {
        $(`#inputGroupSelect04`).children().remove()
        json.map(user => {
            $('#inputGroupSelect04').append($(`<option value="${user}">`).text(user))
        })
        
    })
}
//초대하기
socket.on('invite', (msg, del) => {
    console.log($(`option[value=${del}]`).remove())
    console.log(msg)
})

invite = () => {    
    socket.emit('invite', $('.custom-select').val(),inform)
}

// $('#myModal').on('shown.bs.modal', function () {
//     $('#myInput').trigger('focus')
// })
