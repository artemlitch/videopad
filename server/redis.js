// All redis code goes here
module.exports = function(app, config){
    
    var redis = require("redis").createClient(config.dbPort());

    redis.on("connect", function () {
        console.log("DB RUNNING");
    });
    redis.on("error", function (err) {
        console.log("Error "+ err);
    });

    var db = {
        roomKey: function(id) {
            return "room:" + id;
        },
        
        roomPasswordKey: function(id) {
            return "room:" + id + ":password";
        },
        
        setRoomKey: function(id, value) {
            redis.set(this.roomKey(id), value, function(err) {
                if(err) throw err;
            });
        },

        setRoomPasswordKey: function(id, value) {
            redis.set(this.roomPasswordKey(id), value, function(err) {
                if(err) throw err;
            });
        },

        getRoomKey: function(id, callback) {
            redis.get(this.roomKey(id), callback);
        },
        getRoomPasswordKey: function(id, callback) {
            redis.get(this.roomPasswordKey(id), callback);
        }, 

        setRoomPasswordKey: function(id, key) {
            redis.set(this.roomPasswordKey(id), key, function(err) {
                if(err) throw err;
            });
        },

        getClient: function() {
            return redis;
        }
    }

    return db;
};

