// const moment = require("moment");

var socket = io();


function scrollToBottom() {
var messages=jQuery('#messages');
var newMessage=messages.children('li:last-child');

var clientHeight=messages.prop('clientHeight');
var scrollTop=messages.prop('scrollTop');
var scrollHeight=messages.prop('scrollHeight');
var newMessageHeight=newMessage.innerHeight();
var lastMessageHeight=newMessage.prev().innerHeight();

if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
// console.log('should scroll');
messages.scrollTop(scrollHeight);
}
}

socket.on('connect', function () {
    console.log('Connect to server');
});

socket.on('disconnect', function () {
    console.log('Disconnect to server');
});

socket.on('newMessage', function (message) {
    var formatedTime = moment(message.createAt).format('h:mm a');
    var template = jQuery('#message-template').html();
    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createAt: formatedTime
    });
    jQuery('#messages').append(html);
    // console.log('go');
    scrollToBottom();
});

socket.on('newLocationMessage', function (message) {
    var formatedTime = moment(message.createAt).format('h:mm a');
    var template = jQuery('#location-message-template').html();
    var html = Mustache.render(template, {
        from: message.from,
        url: message.url,
        createAt: formatedTime
    });
    jQuery('#messages').append(html);
    scrollToBottom();
});

jQuery('#message-from').on('submit', function (e) {
    e.preventDefault();

    var messageTextbox = jQuery('[name=message]');

    socket.emit('createMessage', {
        from: 'User',
        text: messageTextbox.val()
    }, function () {
        messageTextbox.val('')
    });
});

var locationButton = jQuery('#send-location');
locationButton.on('click', function () {
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by youer browser');
    }

    locationButton.attr('disabled', 'disabled').text('Sending location....');

    navigator.geolocation.getCurrentPosition(function (position) {
        // console.log(position);
        locationButton.removeAttr('disabled').text('Send location');
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, function () {
        locationButton.removeAttr('disabled');
        alert('Unable to fetch location');
    });
});

