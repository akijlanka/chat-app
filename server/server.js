const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

var { genaratemsg, genaratelocationmsg } = require('./util/message');
var { isRealString } = require('./util/validation');
var { Users } = require('./util/users');


const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New User connected');


    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            callback('Name and Group Name are required');
        }
        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit('updateUserList', users.getUserList(params.room));
        socket.emit('newMessage', genaratemsg('Admin', 'Welcome Chat App'));
        socket.broadcast.to(params.room).emit('newMessage', genaratemsg('Admin', `${params.name} has joined.`));
        callback();
    });

    socket.on('createMessage', (message, callback) => {
        console.log('createMessage', message);

        var user = users.getUser(socket.id);
        if (user && isRealString(message.text)) {
            io.to(user.room).emit('newMessage', genaratemsg(user.name, message.text));
        }


        callback();
    });
    socket.on('createLocationMessage', (coords) => {
        var user=users.getUser(socket.id);
        if(user){
            io.to(user.room).emit('newLocationMessage', genaratelocationmsg(user.name, coords.latitude, coords.longitude));
        }
    });

    socket.on('disconnect', () => {
        // console.log('Disconnect from server');
        var user = users.removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', genaratemsg('Admin', `${user.name} has left.`))
        }
    });
});

server.listen(port, () => {
    console.log(`Server is up port ${port}`);
});