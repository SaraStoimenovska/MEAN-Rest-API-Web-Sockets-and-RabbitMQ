var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var cors = require('cors');
var Stomp = require('@stomp/stompjs');
var WebSocketServer = require('websocket').server;

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());
app.use(cors());

app.get('/', function (req, res) {
    res.send('<h1>Hello world</h1>');
});

var router = express.Router();
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/mean', {
    useNewUrlParser: true
});

var User = require('./models/user');

router.get('/', function (req, res) {
    res.json({
        message: 'Welcome to our API!'
    })
});

// for rest services
router.route('/users')
    .get(function (req, res) {
        User.find(function (err, users) {
            if (err) {
                res.send(err);
            }
            res.json(users);
        })
    })
    .post(function (req, res) {
        var user = new User();
        user.name = req.body.name;
        user.password = req.body.password;
        user.profession = req.body.profession;
        user.save(function (err) {
            if (err) {
                res.send(err);
            }
            res.json({
                message: 'User created!'
            });
        })
    });

router.route('/users/:user_id')
    .get(function (req, res) {
        User.findById(req.params.user_id, function (err, user) {
            if (err) {
                res.send(err);
            }
            res.json(user);
        });
    })
    .put(function (req, res) {
        User.findById(req.params.user_id, function (err, user) {
            if (err) {
                res.send(err);
            }
            user.name = req.body.name;
            user.password = req.body.password;
            user.profession = req.body.profession;
            user.save(function (err) {
                if (err) {
                    res.send(err);
                }
                res.json({
                    message: 'User updated!'
                });
            })
        });
    })
    .delete(function (req, res) {
        User.remove({
            _id: req.params.user_id
        }, function (err, user) {
            if (err) {
                res.send(err);
            }
            res.json({
                message: 'Successfully deleted!'
            });
        })
    })

// for web sockets
var server = app.listen(3000, () => {
    console.log("Server running on port 3000");
})

wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

function originIsAllowed(origin) {
    return true;
}

wsServer.on('request', function (request) {
    if (!originIsAllowed(request.origin)) {
        request.reject();
        console.log('Connection from origin ' + request.origin + ' rejected.');
        return;
    }

    var connection = request.accept(null, request.origin);

    console.log('Connection accepted.');

    connection.on('message', function (message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            connection.sendUTF(message.utf8Data);
        } else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    });

    connection.on('close', function (connection) {
        console.log(' Peer disconnected.');
    });
});

// for stompMQ
var url = "ws://localhost:15674/ws";
var client = Stomp.client(url, null);
client.reconnect_delay = 5000;

client.connect('guest', 'guest', function (frame) {
    console.log('connected to Stomp');

    client.subscribe('/topic/stomp', function (message) {
        console.log("received message " + message.body);

        client.disconnect(function () {
            console.log("See you next time!");
        });
    });

    client.send('/topic/stomp', {}, 'Hello, node.js!');
});

app.use('/api', router);
