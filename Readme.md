# facebook-js

Easy peasy facebook client for connect.

    npm install facebook-js

## Usage

facebook-js has three methods.

  * getAuthorizeUrl(_client_id_, _redirect_uri_, _options_) Gets the url to facebook.
  * getAccesToken(_params_, _callback_): Uses oAuth module to retrieve the access_token
  * apiCall(_http_method_, _path_, _params_, _callback_): Does a call to facebook graph API.

## Example using express.js

    var express = require('express'),
        connect = require('connect');

    var twitterClient = require('./../')('yourKey', 'yourPass', 'http://twitter-js.com:3003/'),
        app = express.createServer(
          connect.bodyDecoder(),
          connect.cookieDecoder(),
          connect.session()
        );

    app.get('/', function (req, res) {
      res.redirect(facebookClient.getAuthorizeUrl({
        client_id: 'appID',
        redirect_uri: 'http://localhost:3003/auth',
        scope: 'offline_access,publish_stream'
      }));
    });

    app.get('/auth', function (req, res) {
      facebookClient.getAccessToken({redirect_uri: 'http://localhost:3003/auth', code: req.param('code')}, function (error, token) {
        res.render('client.jade', {locals: {token: token}});
      });
    });

    app.post('/message', function (req, res) {
      facebookClient.apiCall('POST', '/me/feed',
        {access_token: req.param('access_token'), message: req.param('message')},
        function (error, result) {
          res.render('done.jade');
        }
      );
    });

    app.listen(3003);

## Test

To test and see this module working:

  * clone this repo and open the test folder
  * create a facebook app with the url pointing to http://localhost:3003/
  * set up the keys and password of your facebook app at client.js file
  * run it! _node test/client.js_
  * Open your browser at localhost:3003
