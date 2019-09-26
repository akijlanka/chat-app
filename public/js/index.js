var socket= io();
socket.on('connect', function() {
    console.log('Connect to server');
});

socket.on('disconnect', function() {
    console.log('Disconnect to server');
});

socket.on('newMessage', function(message){
    console.log('newMessage', message);
    var li=jQuery('<li></li>');
    li.text(`${message.from}: ${message.text}`);
    jQuery('#messages').append(li);
})

jQuery('#message-from').on('submit', function(e){
    e.preventDefault();

    socket.emit('createMessage', {
        from:'user',
        text: jQuery('[name=message]').val()
    }, function(){

    });
});

