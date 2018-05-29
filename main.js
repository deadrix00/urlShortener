var http = require("http");
var fs = require("fs");
var url = require("url");

var http = http.createServer(function(request, response){
	response.writeHead(200);
	var shorten;
	var params = url.parse(request.url, true);
	var check;
	fs.readFile("shorts.json",function(err,data){
		shorten = data.toString();
		if(err){
			console.error(err);
		}
	});
	if("toShort" in params.query && params.query.submit == "Submit"){
		check = true;
	}
	if(check){
		var toShort = params.query.toShort;
		fs.readFile("shorts.json", function(err,data){
			shorten = JSON.parse(data.toString());
			if(toShort in shorten){
				console.log("toShort : "+shorten.toShort);
			}else{
				var randomKey = Math.random().toString(36).substring(2,7);
				shorten[toShort] = randomKey;
				fs.writeFile("shorts.json", JSON.stringify(shorten), function(err){
					console.error(err);
				});
			}
			
		});
	}
	if((params.path).replace("/","").length == 10){
		var getUrl = true;
	}
	var getJson = params.path == "/shorts.js";
	if(!check && !getUrl && !getJson){
		response.write("invalid parameters");
	}
	if(getUrl){
		var randomKeyTo = (params.path).replace("/","");
		fs.readFile("shorts.json",function(err,data){
			var shortens = JSON.parse(data.toString());
			var exist = false;
			var urlFinal;
			for(urlTo in shortens){
				if(shortens[urlTo] == randomKeyTo){
					exist = true;
					urlFinal = urlTo;
				}	
			}
			if(exist){
				console.log(urlFinal);
				if(urlFinal.slice(0,4) != "http"){
					urlFinal = "http://"+urlFinal;
				}
				response.write("<html><script>window.location = '"+urlFinal+"';</script></html>");
				response.end();
			}else{
				response.write("invalid parameters");
				response.end();
			}
		});
	
	}
	
});
http.listen(8888);