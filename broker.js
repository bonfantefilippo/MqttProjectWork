var mosca = require("mosca");

var SECURE_KEY = __dirname +'/key/ryans-key.pem';
var SECURE_CERT = __dirname + '/key/ryans-cert.pem';

var settings = {
 // port: 1883,
  protocol: "mqtts",
  http: {
    port: 1884,
    bundle: true,
    static: './'
  },
  //
  secure: {
    port: 8883,
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


server.on('clientConnected', function(client) {
  console.log('In connection with', client.id);
});

server.on('clientDisconnected', function(client) {
  console.log(`The client: ${client.clientId} has been disconnected.` );
  });


server.on('subscribed', function(topic, client) {
  console.log('The subscriber '+ client.id + ' has subscribed the topic ' + topic);
 });
 
 server.on('published', function(packet, client) {
   console.log(`Ricevuto messaggio nel topic: ${packet.topic} `)
 })


function setup() {
  //authenticazione via username e pwd
  server.authenticate = authenticator;
  console.log('Broker attivo on TLS; In attesa di sottoscrizioni.')
  console.log('______________________________________________________')
}
