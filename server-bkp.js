const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

// create express app 
const app = express();

//set ejs as engine
app.set('view engine','ejs');
app.use(express.static('public'));

// parse request of content type application/encoded
app.use(bodyParser.urlencoded({extended:true}));


// parse request of content type - application/json
app.use(bodyParser.json());

// define a simple route 
app.get('/' , function( req, res){
	//res.json({"message":"Welcome to weather forecast application."});
	res.render('index',{weather: null, error: null});
});

app.post('/' , function(req,res){
	let city = req.body.city;
	let url = 'https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text={city})&format=json';
	request(url,function(err,response,body){
			if(err){
				res.sender('index',{weather:null,error:'Error! , Please try again'});
			}else{
				let weather = JSON.parse(body);

				if(weather.query == undefined){
					res.sender('index',{weather:null,error:'Error! , Please try again'});	
				}else{
					let data = weather.query;
					let weatherText = 'It\'s ${data.item.condition.temp} ${data.units.temperature} in ${data.location.city} ${data.location.country}';
					res.render('index',{weather:weatherText , error : null});
				}
			}
	});
});

app.listen(3000,function(){
	console.log("Server is listening to port 3000");
});