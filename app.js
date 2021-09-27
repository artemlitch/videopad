// This is the main file of our chat app. It initializes a new 
// express.js instance, requires the config and routes files
// and listens on a port. Start the application by running
// 'foreman start web' in your terminal
require('dotenv').config()
var express = require('express');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var cookieParser = require('cookie-parser');

app = express();
// This is needed if the app is run on heroku:
var port = process.env.PORT || 5000;

// must use cookieParser before expressSession
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(bodyParser.json());

// Set .html as the default template extension
app.set('view engine', 'jade');

// Initialize the ejs template engine
// Tell express where it can find the templates
app.set('views', __dirname + '/views');

app.use(express.static(__dirname + '/public'));
// Make the files in the public folder available to the world


var db = require('./server/redis.js')(app);
var RedisStore = require("connect-redis")(expressSession);
var sessionMiddleware = expressSession({
        secret: process.env.COOKIE_SECRET, 
        saveUninitialized: true, 
        resave: true,
        store: new RedisStore({ host: db.hostname,  port: db.port, client: db.getClient() })
});
app.use(sessionMiddleware);
require('./server/socket.js')(app, db, sessionMiddleware);
require('./server/room')(app, db);
module.exports = app;
