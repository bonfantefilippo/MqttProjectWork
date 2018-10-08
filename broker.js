var mosca = require("mosca");
var fs = require("fs");
var SECURE_KEY = __dirname + "/key/tls/ryans-key.pem";
var SECURE_CERT = __dirname + "/key/tls/ryans-cert.pem";

var ssl_SECURE_KEY = __dirname + "/key/ssl/key.pem";
var ssl_SECURE_CERT = __dirname + "/key/ssl/cert.pem";


var settings = {
  interfaces: [
    { type: "mqtt", port: 1883 },
    {
      type: "mqtts",
      port: 8883,
      credentials: { keyPath: SECURE_KEY, certPath: SECURE_CERT }
    },
    { type: "http", port: 3000, bundle: true },
    {
      type: "https",
      port: 3001,
      bundle: true,
      credentials: { keyPath: ssl_SECURE_KEY, certPath:  ssl_SECURE_CERT }
    },
  ],
  secure: {
    keyPath: SECURE_KEY,
    certPath: SECURE_CERT
  }
};

var authenticator = (client, username, pwd, callback) => {
  var authorized = username === "admin" && pwd.toString() === "secret";
  if (authorized) client.user = username;
  callback(null, authorized);
};

var server = new mosca.Server(settings);

server.on("ready", setup);

server.on("clientConnected", function(client) {
  console.log("In connection with", client.id);
});

server.on('clientDisconnecting', function (client) {
  console.log('clientDisconnecting: ', client.id);
});
server.on("clientDisconnected", function(client) {
  console.log(`The client: ${client.clientId} has been disconnected.`);
});

server.on("subscribed", function(topic, client) {
  console.log(
    "The subscriber " + client.id + " has subscribed the topic " + topic
  );
});
server.on('unsubscribed', function (topic, client) {
  console.log( "The subscriber " + client.id + " has unsubscribed the topic " + topic);
});

server.on("published", function(packet, client) {
  console.log(`Ricevuto messaggio nel topic: ${packet.topic} `);
});

server.on("error", function (err) {
  console.log(err);
});

function setup() {
  //authenticazione via username e pwd
  server.authenticate = authenticator;
  console.log("Broker attivo on TLS; In attesa di sottoscrizioni.");
  console.log("______________________________________________________");
}

/*var settings = {
  // port: 1883,
   protocol: "mqtts",
   http: {
     port: 1884,
     bundle: true,
     static: './'
   },
   secure: {
     port: 8883,
     keyPath: SECURE_KEY,
     certPath: SECURE_CERT
   }
 };*/
