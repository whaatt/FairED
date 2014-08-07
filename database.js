var Handle = require('nedb');
var here = __dirname;

module.exports = {
    users : new Handle({ filename: here + '/data/users.db', autoload: true }),
    features : new Handle({ filename: here + '/data/features.db', autoload: true }),
    
    //helpers
    filters : {
    
        //display users as tiles
        tile : function(user) {
            //TODO Later
        },
        
        //keep contact info secret
        secret : function(user) {
            //TODO Later
        },
        
        //display all user info
        full : function(user) {
            //TODO Later
        }
    
    }
}