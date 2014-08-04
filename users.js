//get our various helpers
var mail = require('./mail.js');
var DB = require('./database.js');
var error = require('./error.js');
var response = require('./response.js');

//load our external node modules
var validate = require('validator');

module.exports = {

    mentors : {
        
        getQueue : function(req) {
        
        },
        
        getApproved : function(req) {
        
        }
        
    },
    
    mentees : {
        
        getQueue : function(req) {
        
        },
        
        getApproved : function(req) {
        
        }
        
    },
    
    admins : {
    
        getAll : function(req) {
        
        }
    
    },
    
    getID : function(ID) {
    
    },
    
    editID : function(ID) {
    
    },
    
    deleteID : function(ID) {
    
    },
    
    register : function(req, ID) {
    
    },
    
    login : function(req) {
        if (req.session.state !== 'unauthorized') {
            return response(false, {
                'errors' : [error.alreadyAllowed]
            });
        }
        
        var target = { 
            'username' : req.body.username,
            'password' : req.body.password
        }
        
        db.findOne(target, function(err, doc) {
            if (err) {
                return response(false, {
                    'errors' : [error.database]
                });
            }
            
            if (doc === null) {
                return response(false, {
                    'errors' : [error.credentials]
                });
            }
            
            //session variable to user type
            req.session.state = doc.type;
            
            return response(true, {
                'name' : doc.name
                'username' : doc.username
            });
        });
    },
    
    logout : function(req) {
    
    },
    
    forgot : function(req) {
    
    },
    
    invite : {
        
        generic : function(req, type, readable) {
            if (!req.body.email) {
                return response(false, {
                    'errors' : [error.missing('email')]
                });
            }
            
            var email = req.body.email;
            if (!validate.isEmail(email)) {
                return response(false, {
                    'errors' : [error.invalid('email')]
                });
            }
            
            //the high number is kind of arbitrary
            if (!validate.isLength(email, 6, 72)) {
                return response(false, {
                    'errors' : [error.length('email')]
                });
            }
        
            if (req.session.state === 'admin') {
                var newInvite = {
                    'state' : 'pending', 
                    'type' : type
                }
                
                DB.users.insert(newInvite, function(err, user){
                    if (err) {
                        return response(false, {
                            'errors' : [error.database]
                        });
                    }
                    
                    //parameters
                    var info = {
                        'ID' : user._id,
                        'role' : readable
                    }
                    
                    if (!mail.send(email, 'invite', info)){
                        return response(false, {
                            'errors' : [error.mail]
                        });
                    }
                    
                    return response(true, {
                        'user' : {'ID' : user._id}
                    });
                }
            }
            
            else {
                return response(false, {
                    'errors' : [error.notAdmin]
                });
            }
        },
        
        //invite a mentee
        mentee : function(req) {
            return generic(req, 'mentee', 'Mentee');
        },
        
        //invite a mentor
        mentor : function(req) {
            return generic(req, 'mentor', 'Mentor');
        },
        
        //invite an admin
        admin : function(req) {
            return generic(req, 'admin', 'Administrator');
        },
        
        getPending : function(req) {
            if (req.session.state === 'admin') {
                
            }
            
            else {
                return response(false, {
                    'errors' : [error.notAdmin]
                });
            }
        },
        
        deleteID : function(ID) {
            if (req.session.state === 'admin') {
                
            }
            
            else {
                return response(false, {
                    'errors' : [error.notAdmin]
                });
            }
        }
    
    }

}