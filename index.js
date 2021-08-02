const SamlStrategy = require('passport-saml').Strategy;
const express = require('express')
const bodyParser = require('body-parser')
const expressSession = require('express-session')
const passport = require('passport')
const cookieParser = require('cookie-parser')
const cookieSession = require('cookie-session');
const app = express()
//app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.bodyParser());

//app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser("*djksdjalk*="));
//app.use(cookieParser());
//app.use(express.static('public'))
app.use(expressSession({ 
  secret: '*djksdjalk*=' ,
  resave: false,
  saveUninitialized: false,
  cookie : { secure : process.env.ENV === 'PRODUCTION' }
}));

/*
app.use(express.static('public'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.urlencoded({ extended: false }))
app.use(session({ secret: '*djksdjalk*=' }));
*/
app.use(passport.initialize());
app.use(passport.session());



const fs = require('fs')
const CERT = fs.readFileSync("./config/onelogin.pem", "utf-8");
console.log(CERT);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(new SamlStrategy(
  {
    passReqToCallback: true,
    path : '/msg',
    entryPoint: 'https://octo-consulting-test-dev.onelogin.com/trust/saml2/http-post/sso/552c095f-4acb-4bed-b9f9-e5d9b5a451ee',
    issuer: 'https://app.onelogin.com/saml/metadata/552c095f-4acb-4bed-b9f9-e5d9b5a451ee',
    cert: CERT, // cert must be provided
  },
  function(profile, done) {
    return profile;
  })
);

app.use(function(req,res,next){
  res.locals.currentUser = req.user;
  next();
})



app.get('/',passport.authenticate("saml",{
  successRedirect: '/msg',
  failureRedirect : '/',
  session : true
}),function (req,res){
  console.log(req.user)
  res.send(req.user)
},)

/*
app.get('/message',passport.authenticate("saml"),function (req,res) {
    res.send(`Hello there ${req.user}`)
})
*/


app.get('/home', function(req,res) {

  if(req.isAuthenticated()){
    res.send(`we in ${req.user}`)
  }else{
    res.send('nah')
  }


})

app.post('/msg',
passport.authenticate("saml",{
  failureRedirect : '/',
  failureFlash : true,
}),
function (req,res) {
  console.log(req.user)
    res.redirect('/home');
})

  
app.listen(3002)


