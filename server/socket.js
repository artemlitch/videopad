// All redis code goes here
module.exports = function(app, db, sessionMiddleware){
   
    var port = process.env.PORT || 5000;
    var io = require('socket.io').listen(app.listen(port));
    var redis = db.getClient();

    io.use(function(socket, next) {
        sessionMiddleware(socket.request, socket.request.res, next);
    });

    io.on('connection', function(socket) {
        var user = {
            id: socket.id,
            room: '',
        };
        
        socket.on('joinRoom', function(roomId) {
            console.log(socket.request.session)
            if(!socket.request.session) {
                return;
            }    
            var sessPass = socket.request.session.ps;
            var sessUser = socket.request.session.user;
            //when we join a room attach the user for this socket session
            //to this room
            //do a DB check to make sure this user has access to room
            redis.get(db.roomKey(roomId), function (err, response) {
                room = response;
                if(room) {
                    redis.get(db.roomPasswordKey(roomId), function (err, response) {
                        password = response;
                        if(sessPass == password) {
                            user.room = roomId; 
                            var roomClients = io.sockets.adapter.rooms[roomId];
                            console.log(roomClients)
                            for (client in roomClients) {
                                socket.to(client).emit('getRoomInfo', user.id);
                                break;
                            }
                            socket.join(roomId);
                            socket.emit('roomJoinConf', sessUser);        
                            console.log(sessUser + " entered room" + roomId);
                        } else {
                            console.log("wrong password, how could thi be!");            
                        }
                    });
                 } else {
                    console.log("strange error Occured"); 
                 }
            });
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
            console.log(user.room + " wants to play vid")
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
            console.log('user disconnected');
        });

    });
    return io;
};

