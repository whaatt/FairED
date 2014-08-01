//grab our package file for information
var packInfo = require('./package.json');

//load the modules we want
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');

//load request handler functions
var users = require('./users.js');
//var features = require('./features.js');

//set up parameters
var app = express();
var router = express.Router();
app.use(bodyParser.json());

//create session
app.use(session({ 
    secret : 'default',
    resave : true,
    saveUninitialized : true
}));

app.use(function(req, res, next) {
    var context = req.session;
    if (!context.state) {
        //initialize state to lacking auth
        context.state = 'unauthenticated'
    }
    
    //middleware
    next();
});

//send API version on null request
router.get('/', function (req, res) {
    res.send({'version' : __dirname});
});

//get all approved mentors for displaying
router.get('/users/mentors', function(req, res) {
    res.send(users.mentors.getApproved(req));
});

//get all unapproved mentors for administrators only
router.get('/users/mentors/queue', function(req, res) {
    res.send(users.mentors.getQueue(req));
});

//get all approved mentees for displaying
router.get('/users/mentees', function(req, res) {
    res.send(users.mentees.getApproved(req));
});

//get all unapproved mentees for administrators only
router.get('/users/mentees/queue', function(req, res) {
    res.send(users.mentees.getQueue(req));
});

//get all admins for displaying
router.get('/users/admins', function(req, res) {
    res.send(users.admins.getAll(req));
});

//get individual users by their UUIDs
router.get('/users/:id', function(req, res) {
    res.send(users.getID(req.params.id));
});

//edit individual users by their UUIDs
router.put('/users/:id', function(req, res) {
    res.send(users.editID(req.params.id));
});

//edit individual users by their UUIDs
router.delete('/users/:id', function(req, res) {
    res.send(users.deleteID(req.params.id));
});

//register new user with code
router.post('/users/:id/register', function(req, res) {
    res.send(users.register(req, req.params.id));
});

//login user with provided credentials
router.post('/users/login', function(req, res) {
    res.send(users.login(req));
});

//logout the user with the current session
router.post('/users/logout', function(req, res) {
    res.send(users.logout(req));
});

//send invite to future mentees
router.post('/users/invite/mentee', function(req, res) {
    res.send(users.invite.newMentee(req));
});

//send invite to future mentors
router.post('/users/invite/mentor', function(req, res) {
    res.send(users.invite.newMentor(req));
});

//send invite to future admins
router.post('/users/invite/admin', function(req, res) {
    res.send(users.invite.newAdmin(req));
});

//get autocomplete results for a given feature type
router.get('/features/:type', function(req, res) {
    res.send(features.complete(req.params.type));
});

//handle administrative changes to regions and clusters
router.post('/features/settings', function(req, res) {
    res.send(features.settings(req));
});

app.use('/api', router); //apply router to API
app.use(express.static(__dirname + '/public'));

var port = 54345;
app.listen(port);