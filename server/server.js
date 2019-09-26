const path = require('path');
const http= require('http');
const express= require('express');
const socketIO=require('socket.io');

var{genaratemsg, genaratelocationmsg} = require('./util/message');


const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server=http.createServer(app);
var io=socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) =>{
    console.log('New User connected');

    socket.emit('newMessage', genaratemsg('Admin', 'Welcome Chat App'));

    socket.broadcast.emit('newMessage', genaratemsg('Admin', 'New user joined'));
  
    socket.on('createMessage', (message, callback) =>{
     console.log('createMessage', message);
     io.emit('newMessage', genaratemsg(message.from, message.text));
     callback();
    });
    socket.on('createLocationMessage', (coords)=>{
        io.emit('newLocationMessage', genaratelocationmsg('Admin', coords.latitude, coords.longitude));
    });

    socket.on('disconnect', ()=>{
        console.log('Disconnect from server');
    });
});

server.listen(port, () =>{
console.log(`Server is up port ${port}`);
});