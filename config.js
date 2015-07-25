// This file handles the configuration of the app.
// It is required by app.js

module.exports = function(){
    dbHost: function() {
        return '';
    },
    
    dbPort: function(){
        return '';
    },    

    cookieSecret: function() {
        return 'ourSecretCookieThatNoOneKnows';
    }
};
