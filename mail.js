var nodemailer = require('nodemailer');
var fs = require('fs'); //read files
var mustache = require('mustache');

module.exports = {

    send : function(email, type, parameters) {
        //create reusable transporter object using SMTP
        var transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'FairEDTeam@gmail.com',
                pass: '<password>'
            }
        });
        
        var textPath = __dirname + '/templates/mail/' + type + '/text.txt';
        var richPath = __dirname + '/templates/mail/' + type + '/rich.txt';
        
        fs.readFile(textPath, 'utf8', function(error, data) {
            if (error) {
                return false;
            }
            
            //render completed email using mustache cues
            var textMail = mustache.render(data, parameters);
      
            fs.readFile(richPath, 'utf8', function(error, data) {
                if (error) {
                    return false;
                }
                
                //render completed email using mustache cues
                var richMail = mustache.render(data, parameters);

                var mailOptions = {
                    from: 'FairED Team <FairEDTeam@gmail.com>',
                    to: email,
                    subject: 'FairED Invitation',
                    text: textMail,
                    html: richMail
                };

                // send mail with the transport object defined above
                transporter.sendMail(mailOptions, function(error, info) {
                    if (error) {
                        return false;
                    }
                    
                    else {
                        return true;
                    }
                });
            }
        }
    }
    
}