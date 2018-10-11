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
var history = [];
var clients = [];
var colors = ['maroon', 'olive', 'teal', 'magenta', 'purple', 'DodgerBlue', 'orange' ];
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

    // index of the client - used for removind client from array when disconnect
    var index = clients.push(connection) - 1;
    var username = false;
    var userColor = false;

    console.log((new Date()) + ' Connection accepted.');

    // to send back all chat history
    if (history.length > 0) {
        connection.sendUTF(JSON.stringify({ type: 'history', data: history} ));
    }

    connection.on('message', function (message) {
        if (message.type === 'utf8') {
            if (username === false) { // first msg is username 
                username = message.utf8Data;
                userColor = colors.shift();
                console.log('Username is: ' + username + " with color: " + userColor);
            } else { // to keep msg history
                var obj = {
                    author: username,
                    text: message.utf8Data,
                    time: (new Date()).getTime(),
                    color: userColor
                };
                history.push(obj);
                console.log(obj);

                var json = JSON.stringify({ type:'message', data: obj });
                for (var i=0; i < clients.length; i++) {
                    clients[i].sendUTF(json);
                }
            }
        }
    });

    connection.on('close', function (connection) {
        if (username !== false) {
            console.log(' Peer disconnected.');
            clients.splice(index, 1);
            colors.push(userColor);
        }
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
    });

    client.send('/topic/stomp', {}, 'Hello, node.js!');
});

app.use('/api', router);
