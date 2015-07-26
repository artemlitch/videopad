// This file handles the configuration of the app.
// It is required by app.js

module.exports = {
    
    dbHost: function() {
        return 'localhost';
    },
    
    dbPort: function(){
        return '7894';
    },    

    cookieSecret: function() {
        return 'ourSecretCookieThatNoOneKnows';
    }
};
