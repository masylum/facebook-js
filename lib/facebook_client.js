var querystring = require('querystring'),
    crypto = require('crypto'),
    http = require('http'),
    URL = require('url'),

    // Shameless copy from oAuth module from Ciaran Jessup <ciaranj@gmail.com>
    // TODO: Move to oAuth.get/post instead as my twitter client
    doRequest = function (method, url, callback) {
      var creds = crypto.createCredentials({}),
          parsedUrl = URL.parse(url, true),
          headers = {Host: parsedUrl.host},
          httpClient = null,
          request = null,
          result = '';

      if (parsedUrl.protocol === "https:" && !parsedUrl.port) {
        parsedUrl.port = 443;
      }

      //TODO: Content length should be dynamic when dealing with POST methods....
      headers['Content-Length'] = 0;

      httpClient = http.createClient(parsedUrl.port, parsedUrl.hostname, true, creds);
      $.inspect(parsedUrl.pathname + '?' + querystring.stringify(parsedUrl.query));
      request = httpClient.request(method, parsedUrl.pathname + '?' + querystring.stringify(parsedUrl.query), headers);

      httpClient.addListener("secure", function () {
        /* // disable verification for now.
        var verified = httpClient.verifyPeer();
        if(!verified) this.end();   */
      });

      request.addListener('response', function (response) {
        response.addListener("data", function (chunk) {
          result += chunk;
        });

        response.addListener("end", function () {
          if (response.statusCode !== 200) {
            callback({statusCode: response.statusCode, data: result}, null);
          } else {
            callback(null, JSON.parse(result));
          }
        });
      });

      request.end();
    };


module.exports = function (api_key, api_secret) {
  var client = {version: '0.0.1'},
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
