var selectRoom
var userid

userid = $.cookie('id')
var socket = io()
//APPEND NODE CONTROL
toRoom = () => {
    //방 입장
    $('.toRoom').click(e => {
        selectRoom = e.target.textContent
        socket.emit('enter', selectRoom, userid)
        //방 데이터 불러오기
        fetch('/data/'+selectRoom).then(response => {
            return response.json()
        }).then(json => {
            //대화 내용
            json.contents.map(data => {
                if(data.sendId == userid){
                    $('.chat-list').append($('<li>').addClass('list-group-item text-right').text(data.contents))
                } else {
                    $('.chat-list').append($('<li>').addClass('list-group-item ').text(data.sendId + " : " + data.contents))
                }
                
            })
            //스크롤 자동 바텀
            var elem = document.getElementById('conversList')
            elem.scrollTop = elem.scrollHeight;
            //참여자
            json.joinid.map(id => {
                $('.invite').before($('<div class="dropdown-item convuser">').text(id))
            })
        
        })
    })
}
loadList = () => {
    fetch('/getList').then(response => {
        return response.json()
    }).then(json => {
        json.map(room => {
            $('.room-list').append($('<li>').addClass('list-group-item d-flex justify-content-between align-items-center').append($(`<a href='#' class='toRoom'>`).text(room)))    
        }) 
        toRoom()
    }) 
}
$(document).ready(() => {
    
    $('#room').hide()
    //대화방 가져오기
    
    loadList()
   

})
//메인화면
$('.toMain').click(e => {
    $('#room').hide()
    $('#main').show()
    $('.convuser').remove()
    
    $('#conversList').children().remove()
    $('.custom-select').children().remove()
    selectRoom = undefined
})

//방에 들어가기
socket.emit("conn", userid)
socket.on('enter', msg => {
    $('.title').text(selectRoom)
    $('#main').hide()
    $('#room').show()
    var elem = document.getElementById('conversList')
    elem.scrollTop = elem.scrollHeight;
    
})
//메세지 전송
$('.chat').submit((e) => {
    e.preventDefault()
    var msg = $('#data').val()
    socket.emit('chat',msg, selectRoom, userid)
    console.log(msg,selectRoom,userid)
    console.log("send message :"+msg)
    $('#data').val("")
})
//메세지 받기
socket.on('chat', (id, msg) => {
    console.log(msg)
    if(userid == id){
        $('.chat-list').append($('<li>').addClass('list-group-item text-right').text(msg))
    } else {
        $('.chat-list').append($('<li>').addClass('list-group-item ').text(id + " : " + msg))
    }
    //스크롤바 자동 하단
    var elem = document.getElementById('conversList')
    elem.scrollTop = elem.scrollHeight;
})

//초대하기
socket.on('invite', (msg, del) => {
    $('.invite').before($('<div class="dropdown-item convuser">').text(del))
    console.log($(`option[value=${del}]`).remove())
    console.log(msg)
})
invite = () => {    
    socket.emit('invite', $('.custom-select').val(),selectRoom,userid)
}
invitelist =() => {
    fetch('/invitelist/'+selectRoom).then(response => {
        return response.json()
    }).then(json => {
        $(`#inputGroupSelect04`).children().remove()
        json.map(user => {
            $('#inputGroupSelect04').append($(`<option value="${user}">`).text(user))
        })
    })
}
socket.on('your invited', (room, who) => {
    $('.toast-body').text(who + " 님이 " + room + " 방에 초대했습니다.")
    $('.toast').toast('show')
    $('.room-list').append($('<li>').addClass('list-group-item d-flex justify-content-between align-items-center').append($(`<a href='#' class='toRoom'>`).text(room)))
    toRoom()
})
$('.toast').toast({autohide:false})