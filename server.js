var express = require('express');
var path = require('path');
var request = require('request');

// create the express app
var app = express();

app.all('*', function(req, res, next) {
     var origin = req.get('origin'); 
     res.header('Access-Control-Allow-Origin', origin);
     res.header("Access-Control-Allow-Headers", "X-Requested-With");
     res.header('Access-Control-Allow-Headers', 'Content-Type');
     next();
})

app.get('/', function(req, res){
    var url = req.query.url
    if (!url) {
        res.json({error: 'Missing URL'})
        return
    }
    request(url, function(error, response, html){
        if(!error){
			const regex = /<script type="text\/javascript">window\._sharedData = (.*);<\/script>/g;
            var matches = html.match(regex);
            if (matches.length) {
            	var a = matches[0].replace('</script>', '')
				a = a.replace(`<script type="text/javascript">window._sharedData = `, '')
				a = a.substring(0, a.length-1)
				var j = JSON.parse(a);
				res.json(j)

            } else {
				res.json({error: 'error pulling instagram'})
            }
			/*var images = []
            var regex = /thumbnail_src": (.*?),/g;
            var matches = html.match(regex);
            for (var i = 0; i < matches.length; i++) {
            	var a = matches[i].replace(`thumbnail_src": "`, '');
            	a = a.replace(`"`, '')
            	a = a.replace(`,`, '')
            	images.push(a)
            	
            }
			res.send(html)*/
        }
    })
});


// kick of the app
var port = process.env.PORT || 5000;
app.listen(port);

console.log(`Node Env: ${process.env.NODE_ENV}`);
console.log(`server started on port: ${port}`);