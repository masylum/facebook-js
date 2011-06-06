var testosterone = require('testosterone')({title: 'models/facebook'})
  , assert = testosterone.assert
  , querystring = require('querystring')
  , facebook_client = require('../')
  , _access_token = '2227470867|2.AQCFxOjuFBkTnTM0.3600.1307314800.0-758964068|VAwjSdyKcGET3LwLWUBdAjwgZnA'
  , _id = '167896963275275'
  , _callback = 'example.com/done';

testosterone

  .add('`getAuthorizeUrl`', function (done) {
    var url = facebook_client.getAuthorizeUrl({ client_id: _id
                                              , redirect_uri: _callback
                                              , scope: 'offline_access,publish_stream'
                                              });

    assert.equal(url, 'https://graph.facebook.com/oauth/authorize?client_id='
                    + _id + '&redirect_uri=' + querystring.escape(_callback)
                    + '&scope=' + querystring.escape('offline_access,publish_stream')
    );
    done();
  })

  .add('`apiCall` error', function (done) {
    facebook_client.apiCall(
      'GET'
    , '/search'
    , { access_token: _access_token
      , type: 'place'
      , center: '35.6869444,-105.9372222'
      , distance: 5
      }
    , function (error, response, body) {
        assert.equal(error, null);
        assert.equal(response.statusCode, 400);
        done();
      }
    );
  })

  .add('`apiCall` ok', function (done) {
    facebook_client.apiCall(
      'GET'
    , '/2439131959'
    , {}
    , function (error, response, body) {
        assert.equal(error, null);
        assert.equal(response.statusCode, 200);
        assert.equal(body.name, 'Graffiti');
        done();
      }
    );
  })

  .run();
