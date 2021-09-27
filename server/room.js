/* GET home page. */
var uuid = require('uuid');
var bcrypt = require('bcrypt-nodejs');

module.exports = function(app, db){
    
    app.get('/', function(req, res) {
        res.render('splash');
    });
    
	app.post('/createRoom', function(req,res){
		// Generate unique id for the room
        var roomId = uuid.v1();
        var userData = req.body;
        //Hash the password given
        var passHash = bcrypt.hashSync(roomId + userData.ps);
        try {
            db.setRoomKey(roomId, roomId);
            db.setRoomPasswordKey(roomId, passHash);
            req.session.ps = passHash;
            req.session.user = userData.user;
	    } catch(err) {
            //TODO: log errors somewhere
            console.log(err);
        }
        var body = {
            roomId: roomId
        }
        res.send(body);
	});
    
    app.post('/joinRoom', function(req,res) {
        var data = req.body;
        var roomId = data.id;
        db.getRoomKey(roomId, function (err, response) {
            var room = response;
            if(!room) {
                res.redirect('/');
            } else {
                db.getRoomPasswordKey(roomId, function (err, response) {
                    var password = response;
                    if(bcrypt.compareSync((roomId + data.ps), password)) {
                        //correct password, enter
                        req.session.ps = password;
                        req.session.user = data.user;
                        var body = {
                            password: true, 
                            redirect: '/room/'+roomId
                        }
                        res.send(body);
                    } else {
                        //wrong password
                        var body = {
                            password: false
                        }
                        res.send(body);
                   }
                });
            }
        });
    });

    app.get('/login', function(req, res) {
        res.render('password');
    });

    app.get('/room/:id', function(req, res){
        var room = null;
        var roomId = req.param('id');
        db.getRoomKey(roomId, function (err, response) {
            var room = response;
            if(!room) {
                res.redirect('/');
            } else {
                db.getRoomPasswordKey(roomId, function (err, response) {
                    var password = response;
                    if(req.session.ps == password) {
                        res.render('main');
                    } else {
                        res.redirect('/login?next='+roomId);
                    }
                });
            }
        });
    });

    app.use(function(req, res, next) {
        res.render('error');
    });
    
};    
