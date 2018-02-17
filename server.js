const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express()

const apiKey = '*****************';

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
  res.render('index', {weather: null, error: null,condition:null});
})

app.post('/', function (req, res) {
  console.log('in post method');
  var city = req.body.city;
  var url = 'https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="'+city+'")&format=json';
  
  request(url, function (err, response, body) {
    if(err){
      res.render('index', {weather: null, error: 'Error, please try again',condition:null});
    } else {
      var weather = JSON.parse(body)
      console.log('logging -----');
      var results = (weather.query.results);
      if(weather.query == undefined){
        res.render('index', {weather: null, error: 'Error, please dont try again',condition:null});
      } else {
       var weatherText = `It's ${results.channel.item.condition.temp} ${results.channel.units.temperature} degrees in ${results.channel.location.city}!`;

       var conditionText = `It's ${results.channel.item.condition.text} and have a great day `;
        //var weatherText = 'Locale is ${weather.query.lang}';/*'Its ${weather.query.item.condition.temp} degrees in ${weather.query.location.city}!';*/
        res.render('index', {weather: weatherText, error: null , condition:conditionText});
      }
    }
  });
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})