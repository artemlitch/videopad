// All redis code goes here
var bcrypt = require('bcrypt-nodejs');
module.exports = function(app, db, sessionMiddleware){
   
    var port = process.env.PORT || 5000;
    var io = require('socket.io').listen(app.listen(port));

    io.use(function(socket, next) {
        sessionMiddleware(socket.request, socket.request.res, next);
    });

    io.on('connection', function(socket) {
        var user = {
            id: socket.id,
            room: '',
        };
        
        socket.on('joinRoom', function(roomId) {
            if(!socket.request.session) {
                return;
            }    
            var sessPass = socket.request.session.ps;
            var sessUser = socket.request.session.user;
            //when we join a room attach the user for this socket session
            //to this room
            //do a DB check to make sure this user has access to room
            console.log(sessUser +  " wants to join");
            db.getRoomKey(roomId, function (err, response) {
                var room = response;
                if(!room) {
                    socket.emit('failJoinConf', sessUser);        
                    console.log("strange error Occured"); 
                } else {
                    db.getRoomPasswordKey(roomId, function (err, response) {
                        var password = response;
                        if(sessPass == password) {
                            user.room = roomId; 
                            socket.join(roomId);
                            socket.emit('roomJoinConf', sessUser);        
                            console.log(sessUser + " entered room" + roomId);
                        } else {
                            socket.emit('failJoinConf', sessUser);        
                            console.log("wrong password, how could thi be!");            
                        }
                    });
                }
            });
        });
        socket.on('getRoomInfo', function() {
            if(user.room) {
                var roomClients = io.sockets.adapter.rooms[user.room];
                for (client in roomClients) {
                    socket.to(client).emit('sendRoomInfo', user.id);
                    break;
                }
            }
        });
        socket.on('sentRoomInfo' , function(data) {
            socket.to(data.userId).emit('enterRoomInfo', data);
        });

        socket.on('draw', function(data) {
            if (user.room) {
                socket.broadcast.to(user.room).emit('drawReceived', data);
            }
        });

        socket.on('erase', function(data) {
            if (user.room) {
                socket.broadcast.to(user.room).emit('eraseReceived', data);
            }
        });

        socket.on('clear', function() {
            if (user.room) {
                socket.broadcast.to(user.room).emit('clearReceived');
            }
        });

        //Youtube IO
        socket.on('loadVid', function(url) {
            if (user.room) {
                socket.broadcast.to(user.room).emit('vidReceived', url);
            }
        });

        socket.on('pauseVid', function() {

            if (user.room) {
                socket.broadcast.to(user.room).emit('pauseReceived');
            }
        });

        socket.on('playVid', function() {
            if (user.room) {
                socket.broadcast.to(user.room).emit('playReceived');
            }
        });

        socket.on('playFaster', function() {
            if (user.room) {
                socket.broadcast.to(user.room).emit('playFasterReceived');
            }
        });

        socket.on('playSlower', function() {
            if (user.room) {
                socket.broadcast.to(user.room).emit('playSlowerReceived');
            }
        });

        socket.on('normalPlayback', function() {
            if (user.room) {
                socket.broadcast.to(user.room).emit('normalPlaybackReceived');
            }
        });

        socket.on('syncVid', function(time, state) {
            if (user.room) {
                socket.broadcast.to(user.room).emit('syncReceived', time, state);
            }
        });

        socket.on('syncUrl', function(url) {
            if (user.room) {
                socket.broadcast.to(user.room).emit('urlReceived', url);
            }
        });
        
        //End YouTube IO
        socket.on('disconnect', function() {
            socket.leave(user.room);
        });

    });
    return io;
};

