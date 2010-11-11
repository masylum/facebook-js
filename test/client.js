/**
 * Module dependencies.
 */

var express = require('express'),
    connect = require('connect'),
    facebookClient = require('./../')(
      'appID',
      'appSecret'
    ),
    app = express.createServer(
      connect.bodyDecoder(),
      connect.cookieDecoder(),
      connect.session()
    );

app.set('views', __dirname);

app.get('/', function (req, res) {
  res.redirect(facebookClient.getAuthorizeUrl({
    client_id: 'appID',
    redirect_uri: 'http://localhost:3003/auth',
    scope: 'offline_access,publish_stream'
  }));
});

app.get('/auth', function (req, res) {
  facebookClient.getAccessToken({redirect_uri: 'http://localhost:3003/auth', code: req.param('code')}, function (error, token) {
    res.render('client.jade', {
      layout: false,
      locals: {
        token: token
      }
    });
  });
});

app.post('/message', function (req, res) {
  facebookClient.apiCall(
    'POST',
    '/me/feed',
    {access_token: req.param('access_token'), message: req.param('message')},
    function (error, result) {
      console.log(error);
      console.log(result);
      res.render('done.jade', {layout: false});
    }
  );
});

app.listen(3003);

