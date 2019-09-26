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
});

socket.on('newLocationMessage', function(message){
    
    var li=jQuery('<li></li>');
    var a=jQuery('<a target="_blank">My current location</a>');

    li.text(`${message.from}:`);
    a.attr('href', message.url);
    li.append(a);
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

var locationButton=jQuery('#send-location');
locationButton.on('click', function(){
    if(!navigator.geolocation){
        return alert('Geolocation not supported by youer browser');
    }

    navigator.geolocation.getCurrentPosition(function (position){
        console.log(position);
        socket.emit('createLocationMessage', {
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        });
    }, function(){
        alert('Unable to fetch location');
    });
});

