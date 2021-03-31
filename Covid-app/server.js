const express = require('express');
const path = require('path');
const fs = require('fs');
const cheerio = require('cheerio');
const csv = require('csv-parser');

const app = express(); //creates main app
app.use(express.static(path.join(__dirname, '/public')));  //allows html to get static files from public folder
const PORT = process.env.PORT || 8080; 

var totcases = 1;      //indexes for certain data points
var totdeaths = 6;
var lst7cases = 4;
var lst7deaths = 9;

//formats numbers with commas
function Commas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//calls script that gets csv file every 5 mins
setInterval(()=>{

	var date = new Date();
	console.log('[CSV FILE LOADED] ' + date);	
}, 300000);

//url path for home page
app.get('/home', function(req, res) {
	var date = new Date();
	console.log('[REQUEST] http://localhost:8080/home ' + date);

	//grabs homepage html file
	fs.readFile(path.join(__dirname, '/public/index.html'), 'utf-8', function(err, html){
		//grabs national data from csv file
		const csvdata = [];
		fs.createReadStream(path.join(__dirname, '/public/csv/covid.csv'))
		.pipe(csv())
		.on('data', (data) => {
			csvdata.push(data);
		})
		.on('end', ()=>{
			//places data within html
			var nationstats = csvdata[csvdata.length-1]; //grabs data for entire nation

			var $ = cheerio.load(html);  //parses html
			$('.totcases').text(Commas(nationstats[totcases]));
			$('.totdeaths').text(Commas(nationstats[totdeaths]));
			$('.lst7deaths').text(Commas(nationstats[lst7deaths]));
			res.send($.html());
		});
	
	});
});

//url path for state page
app.get('/state', function(req, res){
	var date = new Date();
	var targetstate = req.query['state'];
	console.log('[REQUEST] http://localhost:8080/state?state=%s', targetstate);

	fs.readFile(path.join(__dirname, '/public/states.html'), 'utf-8', function(err, html){
		//grabs data from csv file
		const csvdata = [];
		fs.createReadStream(path.join(__dirname, '/public/csv/covid.csv'))
		.pipe(csv())
		.on('data', (data) => {
			csvdata.push(data);
		})
		.on('end', ()=>{	
			//search for the right state then insert data
			for(var i=0; i<csvdata.length; i++)
			{
				var state = csvdata[i];
				if(state['0'] === targetstate) //if this is the correct state
				{
					var $ = cheerio.load(html);
					$('#totdeaths').text(state[totdeaths]);
					$('#totcases').text(state[totcases]);
					$('#lst7deaths').text(state[lst7deaths]);
					res.send($.html());
				}
			}
		});
	});
})

//listend at port 8080
app.listen(PORT, function(){
	var date = new Date();
	console.log('[SERVER RUNNING] http://localhost:8080 ' + date);
});
