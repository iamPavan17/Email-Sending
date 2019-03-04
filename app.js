const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
var API_KEY = '';   // your api key
var DOMAIN = '';    //your domain name
var mailgun = require('mailgun-js')({apiKey: API_KEY, domain: DOMAIN});

const app = express();

//View Engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

//Body Parser Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.render('mail');
});

app.post('/send', (req, res)=> {
    const data = {
      from: 'Excited User <me@samples.mailgun.org>',
      to: req.body.email,  //req.body.email
      subject: req.body.subject,
      text: req.body.message
    };

    mailgun.messages().send(data, (error, body) => {
        if(error) {
            console.log(error);
            res.render('mail', {msg: "Got Some Error!!!"})
        }
      console.log(body);

      res.render('mail', {msg: "Email has been sent"});
    });    
});

//listener
app.listen(3000, () => {
    console.log('Server Started...');
})

