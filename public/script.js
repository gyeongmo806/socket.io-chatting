$(document).ready(() => {
    fetch('/getList').then(response => {
        return response.json()
    }).then(json => {
        json.map(data => {
            $('.room-list').append($('<li>').append($(`<a href='#' id='toRoom'>`).text(data.name)))
        })
        $('a').click(e => {
            var room = e.target.textContent
            if(this.roomName != undefined){
                socket.emit('exit',this.roomName)
            }
            socket.emit('selectroom', room)
        })
    })
    
})

var socket = io()
$('.select').submit((e) => {
    e.preventDefault()
    var room = $('#room').val()
    console.log(room)
    socket.emit('selectroom', room)
})
$('.chat').submit((e) => {
    e.preventDefault()
    var msg = $('#data').val()
    socket.emit('chat',msg,roomName)
    console.log("send message :"+msg)
    $('#data').val("")
})
socket.on('check room', msg => {
    console.log(msg)
})
socket.on('status', status => {
    console.log(404)
    if(status == 404){
        alert("Can't find the room")
    }
})
socket.on('chat', msg => {
    $('.chat-list').append($('<li>').text(msg))
})
socket.on('room', room => {
    roomName = room
})
exit = () => {
    if(confirm("이 방에서 나가시겠습니까?")){
        socket.emit('exit',roomName)
        $('.chat-list').text("")
    }
}