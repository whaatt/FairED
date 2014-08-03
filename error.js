module.exports = {
    'database' : 'A database error occurred. Please try again.',
    'invalid' : function(parameter) { return 'Your entered ' + parameter + ' parameter is invalid.'; },
    'length' : function(parameter) { return 'Your ' + parameter + ' parameter is too long or too short.'; },
    'mail' : 'An error occurred while trying to send an email.',
    'missing' : function(parameter) { return 'You must enter the ' + parameter + ' parameter.'; },
    'notAdmin' : 'You must be an administrator to perform this action.',
    'unknown' : 'An unknown error occurred. Please try again.'
}