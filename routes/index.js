/* GET home page. */
module.exports = function(app, db){
    
    app.get('/', function(req, res) {
        res.render('splash');
    });
    
    var redis = db.getClient();

	app.post('/createRoom', function(req,res){
		// Generate unique id for the room
        var id = Math.round((Math.random() * 1000000));
		// Redirect to the random room
        var userData = req.body;
        redis.set(db.roomKey(id), id, function(err) {
            if(err) throw err;
        });
	    
	    redis.set(db.roomPasswordKey(id), id + userData.ps, function(err) {
            if(err) throw err;
        });
        req.session.ps = id + userData.ps;
        req.session.user = userData.user;
        req.body = {
            roomId: id
        }
        res.send(req.body);
	});
    
    app.post('/joinRoom', function(req,res){
        var data = req.body;
        var roomId = data.id;
        redis.get(db.roomKey(roomId), function (err, response) {
            var room = response;
            if(room) {
                redis.get(db.roomPasswordKey(roomId), function (err, response) {
                    var password = response;
                    if((roomId+data.ps) == password) {
                        //correct password, enter
                        req.session.ps = roomId + data.ps;
                        req.session.user = data.user;
                        req.body = {
                            password: true 
                        }
                        res.send(req.body);
                    } else {
                        //wrong password
                        req.body = {
                            password: false
                        }
                        res.send(req.body);
                   }
                });
             } else {
              res.redirect('/');
            }
        });
    });

    app.get('/room/:id', function(req, res){
        var room = null;
        var password = null;
        var roomId = req.param('id');
        redis.get(db.roomKey(roomId), function (err, response) {
            room = response;
            if(room) {
                redis.get(db.roomPasswordKey(roomId), function (err, response) {
                    password = response;
                    if(req.session.ps == password) {
                        res.render('main');
                    } else {
                        res.render('password', {roomId: roomId});
                    }
                });
             } else {
                //"ROOM DOESNT EXIST"
              res.redirect('/');
            }
        });
    });
};    
