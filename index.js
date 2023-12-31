const http = require('http');
const fs = require('fs');
const requests = require('requests');
const apiKey = process.env.API_KEY;
// or 
// const apiKey = require('./apikey');


const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempvalue%}", orgVal.main.temp );
    temperature = temperature.replace("{%tempMin%}", orgVal.main.temp_min);
    temperature = temperature.replace("{%tempMax%}", orgVal.main.temp_max);
    temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);
    return temperature;
};

const server = http.createServer((req, res) => {
    if (req.url == "/") {
        requests(apiKey)
            .on('data',  (chunk) => {
                const objData = JSON.parse(chunk);
                const arrData = [objData];
                const realTimeData = arrData.map((val) => replaceVal(homeFile, val)).join("");
                res.write(realTimeData);
                
            })
            .on('end',  (err) => {
                if (err) return console.log('connection closed due to errors', err);

                res.end();
            });
    }
    else {
        // res.writeHead(404, { "Content-type": "text/html" });
        res.end("<h1>Error 404. Page doesn't exist</h1>");

    }
});



server.listen(8000, "127.0.0.1");