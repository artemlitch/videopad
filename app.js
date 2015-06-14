var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var users = require('./routes/users');

var http = require('http');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('port', process.env.PORT || 3000);

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

/// Socket
/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port: ' + server.address().port);
});


// Setting up IO client
var io = require('socket.io').listen(server);
io.on('connection', function(socket) {

    var user = {
        id: socket.id,
        room: '',
    };
    console.log(user.id + ' connected ');
    socket.emit('userInfo' , user);

    socket.on('createRoom', function() {
        var roomId = socket.id;
        user.room = roomId;
        socket.join(roomId);
        socket.emit('roomCreateConf', user);
        console.log(user.room + " new room ");
    });

    socket.on('joinRoom', function(roomId) {
        user.room = roomId;
        socket.join(roomId);
        socket.emit('roomJoinConf', user);
        console.log(user.room + " entered Room YO ");
    });

    socket.on('draw', function(colour, thickness, prevX, prevY, x, y) {
        if (user.room) {
            socket.broadcast.to(user.room).emit('drawReceived', colour, thickness, prevX, prevY, x, y);
        }
    });

    socket.on('erase', function(x, y) {
        if (user.room) {
            socket.broadcast.to(user.room).emit('eraseReceived', x, y);
        }
    });

    socket.on('clear', function() {
        if (user.room) {
            socket.broadcast.to(user.room).emit('clearReceived');
        }
    });

    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
});



module.exports = app;
