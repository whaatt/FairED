var Handle = require('nedb');
var here = __dirname;

module.exports = {
    users : new Handle({ filename: here + '/data/users.db', autoload: true }),
    features : new Handle({ filename: here + '/data/features.db', autoload: true })
}