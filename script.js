require('dotenv').config();

var Flickr = require('flickr-sdk');
var flickr = new Flickr(process.env.API_KEY);

var express = require('express');
var app = express();

app.use(function(req, res, next) {
    var allowedOrigins = ['http://localhost:5001', 'http://192.168.8.106:5001/', 'http://192.168.8.106:5000/', 'http://localhost:5000'];
    var origin = req.headers.origin;
    if(allowedOrigins.indexOf(origin) > -1){
         res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', true);
    return next();
  });

app.get('/fetch',function(req,res) {
    (() => flickr.photos
                .getRecent()
                .then(result => {
                    return res.send(result.body.photos.photo)
                  })
                  .catch(err => {
                    console.error('Error: ', err)
                  }))()
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))