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
        
        getClient: function() {
            return redis;
        }
    }

    return db;
};

