//get our various helpers
var mail = require('./mail.js');
var DB = require('./database.js');
var error = require('./error.js');
var response = require('./response.js');

//load our external node modules
var tool = require('underscore');
var validate = require('validator');

module.exports = {

    mentors : {
        
        getQueue : function(req) {
            if (req.session.state === 'admin') {
                var target = {
                    'state' : 'created',
                    'type' : 'mentor'
                };
                
                DB.users.find(target, function(err, docs) {
                    if (err) {
                        return response(false, {
                            'errors' : [error.database]
                        });
                    }
                    
                    //filter user info for a tile display
                    docs = tool.map(docs, DB.filters.tile)
                    
                    //docs is an array of mentors
                    return response(true, docs);
                });
            }
            
            else {
                return response(false, {
                    'errors' : [error.notAdmin]
                });
            }
        },
        
        //gets both mentors AND admins
        getApproved : function(req) {
            var target = {
                'state' : 'approved',
                $or : [
                    {'type' : 'mentor'},
                    {'type' : 'admin'}
                ]
            };
            
            DB.users.find(target, function(err, docs) {
                if (err) {
                    return response(false, {
                        'errors' : [error.database]
                    });
                }
                
                //filter user info for a tile display
                docs = tool.map(docs, DB.filters.tile)
                
                //docs is an array of mentors
                return response(true, docs);
            });
        }
        
    },
    
    mentees : {
        
        getQueue : function(req) {
            if (req.session.state === 'admin') {
                var target = {
                    'state' : 'created',
                    'type' : 'mentee'
                };
                
                DB.users.find(target, function(err, docs) {
                    if (err) {
                        return response(false, {
                            'errors' : [error.database]
                        });
                    }
                        
                    //filter user info for a tile display
                    docs = tool.map(docs, DB.filters.tile)
                    
                    //docs is an array of mentees
                    return response(true, docs);
                });
            }
            
            else {
                return response(false, {
                    'errors' : [error.notAdmin]
                });
            }
        },
        
        getApproved : function(req) {
            if (req.session.state !== 'unauthorized') {
                var target = {
                    'state' : 'approved',
                    'type' : 'mentee'
                };
                
                DB.users.find(target, function(err, docs) {
                    if (err) {
                        return response(false, {
                            'errors' : [error.database]
                        });
                    }
                    
                    //filter user info for a tile display
                    docs = tool.map(docs, DB.filters.tile)
                    
                    //docs is an array of mentees
                    return response(true, docs);
                });
            }
            
            else {
                return response(false, {
                    'errors' : [error.notLoggedIn]
                });
            }
        }
        
    },
    
    admins : {
    
        //admins always approved
        getAll : function(req) {
            var target = {
                'state' : 'approved',
                'type' : 'admin'
            };
            
            DB.users.find(target, function(err, docs) {
                if (err) {
                    return response(false, {
                        'errors' : [error.database]
                    });
                }
                
                //filter user info for a tile display
                docs = tool.map(docs, DB.filters.tile)
                
                //docs is an array of admins
                return response(true, docs);
            });
        }
    
    },
    
    getID : function(ID) {
        DB.users.findOne({ _id : ID}, function(err, doc) {
            if (err) {
                return response(false, {
                    'errors' : [error.database]
                });
            }
            
            if (doc === null) {
                return response(false, {
                    'errors' : [error.userNotFound]
                });
            }
            
            //get target type
            target = doc.type;
            
            //get current user type
            user = req.session.state
            
            if (doc.state !== 'approved') {
                //getting your own profile
                if (req.session.ID === ID) {
                    //do absolutely nothing
                }
                
                //only admins see unapproved users
                else if (user !== 'admin') {
                    return response(false, {
                        'errors' : [error.notAdmin]
                    });
                }
            }
            
            //mentor and admin data is partially private
            if (target === 'mentor' || target === 'admin') {
                if (user === 'unauthorized') {
                    doc = DB.filters.secret(doc);
                    return response(true, doc);
                }
                
                else {
                    doc = DB.filters.full(doc);
                    return response(true, doc);
                }
            }
            
            //mentee data is private
            if (target === 'mentee') {
                if (user !== 'unauthorized') {
                    doc = DB.filters.full(doc);
                    return response(true, doc);
                }
                
                else {
                    return response(false, {
                        'errors' : [error.notLoggedIn]
                    });
                }
            }
        });
    },
    
    editID : function(ID) {
    
    },
    
    deleteID : function(ID) {
        if (req.session.state === 'admin') {
            DB.users.remove({ _id : ID}, function(err, numDocs) {
                if (err) {
                    return response(false, {
                        'errors' : [error.database]
                    });
                }
                
                if (numDocs === 0) {
                    return response(false, {
                        'errors' : [error.userNotFound]
                    });
                }
                
                //successfully deleted user
                return response(true, {});
            });
        }
        
        else {
            return response(false, {
                'errors' : [error.notAdmin]
            });
        }
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
            req.session.ID = doc._id;
            
            return response(true, {
                'name' : doc.name,
                'username' : doc.username
            });
        });
    },
    
    logout : function(req) {
        if (req.session.state === 'unauthorized') {
            return response(false, {
                'errors' : [error.notLoggedIn]
            });
        }
        
        req.session.state = 'unauthorized';
        req.session.ID = 123456789;
        return response(true, {});
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
                
                DB.users.insert(newInvite, function(err, user) {
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
                    
                    if (!mail.send(email, 'invite', info)) {
                        return response(false, {
                            'errors' : [error.mail]
                        });
                    }
                    
                    return response(true, {
                        'user' : {'ID' : user._id}
                    });
                });
            }
            
            else {
                return response(false, {
                    'errors' : [error.notAdmin]
                });
            }
        },
        
        //invite a mentee
        mentee : function(req) {
            return this.generic(req, 'mentee', 'Mentee');
        },
        
        //invite a mentor
        mentor : function(req) {
            return this.generic(req, 'mentor', 'Mentor');
        },
        
        //invite an admin
        admin : function(req) {
            return this.generic(req, 'admin', 'Administrator');
        },
        
        getPending : function(req) {
            if (req.session.state === 'admin') {
                DB.users.find({'state' : 'pending'}, function(err, docs) {
                    if (err) {
                        return response(false, {
                            'errors' : [error.database]
                        });
                    }
                    
                    //docs is an array of invites
                    return response(true, docs);
                });
            }
            
            else {
                return response(false, {
                    'errors' : [error.notAdmin]
                });
            }
        },
        
        deleteID : function(ID) {
            if (req.session.state === 'admin') {
                var target = {
                    'state' : 'pending', 
                    '_id' : ID
                };
                
                DB.users.delete(target, function(err, numDocs) {
                    if (err) {
                        return response(false, {
                            'errors' : [error.database]
                        });
                    }
                    
                    if (numDocs === 0) {
                        return response(false, {
                            'errors' : [error.noSuchInvite]
                        });
                    }
                    
                    //empty response object
                    return response(true, {});
                });
            }
            
            else {
                return response(false, {
                    'errors' : [error.notAdmin]
                });
            }
        }
    
    }

}