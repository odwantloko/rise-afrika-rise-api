var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
//var cors = require('cors');
const creds = require('./config');


var transport = {
    service: 'gmail',
    auth: {
      user: creds.USER,
      pass: creds.PASS
  }
}

var transporter = nodemailer.createTransport(transport)

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take messages');
  }
});

router.post('/send', (req, res, next) => {
  var name = req.body.name
  var email = req.body.email
  var content = `Hi! You have a new subscriber. \n\nThe new subscriber's details are:\n\nName:\t${name} \n\nemail address\t: ${email}`

  var mail = {
    from: name,
    to: 'ntlokodwa@gmail.com',  // Change to email address that you want to receive messages on
    subject: 'New Rise Afrika Rise subscriber',
    text: content

  }


  transporter.sendMail(mail, (err, data) => {
    if (err) {
      res.json({
        status: err
      })
    } else {
      
      res.json({
       status: 'success'
      })

      transporter.sendMail({
        from: "riseafrika@gmail.com",
        to: email,
        subject: "Subscribed to Rise Afrika Rise",
        text: `Hi there, ${name}! \n\nThank you for subscribing to Rise Afrika Rise. We'll keep you updated with the the latest news/reports on Rise Afrika Rise.\n\nStay safe, Regards\nRise Afrika Rise Team`
      }, function(error, info){
        if(error) {
          console.log(error);
        } else{
          console.log('Message sent: ' + info.response);
        }
      });
      
    }
  });
});

const app = express();
//app.use(cors());
app.use(express.json());
app.use('/', router);
app.listen(3002);