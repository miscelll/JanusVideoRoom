const nodemailer = require("nodemailer");
const config = require("./auth.config");
var fs = require('fs');
var handlebars = require('handlebars');
const { getMaxListeners } = require("process");
const { isPrivate } = require("ip");
var ip = require('ip');
const port = 8008;

var readHTMLFile = (path, callback) => {
    fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
      if (err) {
        console.log(err);
      }
      else {
        return callback(null, html);
      }
    });
  };

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER,
    pass: process.env.PASS
  },
});

module.exports = {

    sendConfirmationEmail : function(name, email){
    
      console.log("[MAILER] nodemailer -> sending confimation email");

      readHTMLFile(__dirname + '/email_confirmation.html', function (err, html) { //qui costruisce la email che invia
        var template = handlebars.compile(html);
        var replacements = {
          name: name,
          url: "https://" + ip.address() + ":" + port + "/confirm?email=" + email //metto questo URL dentro la mail inviata
        };
      

        var htmlToSend = template(replacements);
        var mailOptions = {
            from: process.env.USER,
            to : email,
            subject : 'Confirm your email',
            html : htmlToSend
        };
        transport.sendMail(mailOptions, function(error, info){
          
            if (err) {
              console.log('[MAILER] Error: ' + err)
          }else{
            console.log('[MAILER] EMAIL SENT!')
          }
          if (info) {
              console.log('[MAILER] ' + info.response)
          }
      
        });
      });
    },

    sendInviteEmail : function(email, room){
      console.log("[MAILER] - sending invite email");
      // console.debug("[DEBUG MAILER] Email: " + email + " Room: " + room);
  
      readHTMLFile(__dirname + '/invite.html', function (err, html) { //qui costruisce la email che invia
          var template = handlebars.compile(html);
          var replacements = {
             url: "https://" + ip.address() + ":" + port + "/videoroom?room=" + room //metto questo URL dentro la mail inviata
          };
        
          var htmlToSend = template(replacements);
          var mailOptions = {
              from: process.env.USER,
              to : email,
              subject : 'Join my call',
              html : htmlToSend
          };
          transport.sendMail(mailOptions, function(error, info){
            
              if (err) {
                console.log('[MAILER] ' + err)
            }else{
              console.log('[MAILER] EMAIL SENT!')
            }
            if (info) {
                console.log('[MAILER] ' + info.response)
            }
        
          });
        });
      }
  
}