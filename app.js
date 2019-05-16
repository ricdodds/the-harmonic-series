var five = require('johnny-five');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

const port = 3000;
server.listen(port);
console.log(`Server listening on http://localhost:${port}`);

app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res, next) {
	res.sendFile(__dirname + '/index.html')
});

var board = new five.Board({ repl: false });
board.on("ready", function() {
	console.log('Arduino is ready.');

	var xPotentiometer = new five.Sensor({
		pin: "A0",
		freq: 25
	});

	var yPotentiometer = new five.Sensor({
		pin: "A1",
		freq: 25
	});

	// Listen to the web socket connection
	io.on('connection', function(client) {
		client.on('join', function(handshake) {
			console.log(handshake);
		});

		xPotentiometer.on("change", function() {
			client.broadcast.emit('xPotentiometer', this.value);
		});

		yPotentiometer.on("change", function() {
			client.broadcast.emit('yPotentiometer', this.value);
		});
	});

});
