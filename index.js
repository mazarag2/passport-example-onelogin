const SamlStrategy = require('passport-saml').Strategy;
const express = require('express')
const app = express()
const passport = require('passport')
app.use(passport.initialize());
app.use(passport.session());
const fs = require('fs')
const CERT = fs.readFileSync("./config/onelogin.pem", "utf-8");
console.log(CERT);
passport.use(new SamlStrategy(
  {
    entryPoint: 'https://octo-consulting-test-dev.onelogin.com/trust/saml2/http-post/sso/552c095f-4acb-4bed-b9f9-e5d9b5a451ee',
    issuer: 'https://app.onelogin.com/saml/metadata/552c095f-4acb-4bed-b9f9-e5d9b5a451ee',
    callbackUrl: 'http://localhost:3002/msg',
    cert: CERT, // cert must be provided
  },
  function(profile, done) {
    findByEmail(profile.email, function(err, user) {
      if (err) {
        return done(err);
      }
      return done(null, user);
    });
  })
);

app.get('/',passport.authenticate("saml",{
  successRedirect: '/msg',
  failureRedirect : '/'
}),)

/*
app.get('/message',passport.authenticate("saml"),function (req,res) {
    res.send(`Hello there ${req.user}`)
})
*/

/*
app.post('/msg',passport.authenticate("saml"),function (req,res) {
  res.send(`hello there ${req.user}`)
})
*/
  
app.listen(3002)


