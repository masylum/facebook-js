var querystring = require('querystring'),
    crypto = require('crypto'),
    https = require('https'),
    URL = require('url'),

    doRequest = function (method, url, callback) {
      var parsed_url = URL.parse(url, true),
          result = '',
          options, req;

      options = {
        host: parsed_url.host,
        port: 443,
        path: parsed_url.pathname + '?' + querystring.stringify(parsed_url.query),
        method: method
      };

      req = https.request(options, function (res) {

        res.on('data', function (chunk) {
          result += chunk;
        });

        res.on('end', function () {
          if (res.statusCode !== 200) {
            callback({statusCode: res.statusCode, data: result}, null);
          } else {
            callback(null, JSON.parse(result));
          }
        });
      });
      req.end();
  };

module.exports = function (api_key, api_secret) {
  var client = {},
      facebook_graph_url = 'https://graph.facebook.com';

  client.getAuthorizeUrl = function (options) {
    options = options || {};
    return facebook_graph_url + '/oauth/authorize?' + querystring.stringify(options);
  };

  client.apiCall = function (method, path, params, callback) {
    doRequest(
      method,
      facebook_graph_url + path + '?' + querystring.stringify(params),
      callback
    );
  };

  client.getAccessToken = function (options, callback) {
    var OAuth = require("oauth").OAuth2,
        oAuth = new OAuth(api_key, api_secret, facebook_graph_url);

    options = options || {};

    oAuth.getOAuthAccessToken(
      options.code,
      {redirect_uri: options.redirect_uri},
      function (error, access_token, refresh_token) {
        if (error) {
          callback(error, null);
        } else {
          callback(null, {access_token: access_token, refresh_token: refresh_token});
        }
      }
    );
  };
  return client;
};
