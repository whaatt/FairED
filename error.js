module.exports = {
    'alreadyAllowed' : 'You are already logged in!',
    'credentials' : 'No user with those credentials was found. Please try again.',
    'database' : 'A database error occurred. Please try again.',
    'invalid' : function(parameter) { return 'Your entered ' + parameter + ' parameter is invalid.'; },
    'length' : function(parameter) { return 'Your ' + parameter + ' parameter is too long or too short.'; },
    'mail' : 'An error occurred while trying to send an email.',
    'missing' : function(parameter) { return 'You must enter the ' + parameter + ' parameter.'; },
    'noSuchInvite' : 'No such pending invite exists. Please try again.',
    'notAdmin' : 'You must be an administrator to perform this action.',
    'notLoggedIn' : 'You must be logged in to retrieve this information.',
    'unknown' : 'An unknown error occurred. Please try again.',
    'userNotFound' : 'No user with that ID could be found.'
}