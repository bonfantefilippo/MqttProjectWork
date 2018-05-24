var mosca = require("mosca");

var SECURE_KEY = __dirname +'/key/ryans-key.pem';
var SECURE_CERT = __dirname + '/key/ryans-cert.pem';

var settings = {
  port: 1883,
  protocolId: 'MQTT',
 /* logger: {
    name: "secureExample", 
    level: 40
  },
  secure: {
    port: 8443,
    keyPath: SECURE_KEY,
    certPath: SECURE_CERT
  }*/
};

/*
var authenticate = (client, username, pwd, callback) => {
  var authorized = username === "pippo" && pwd.toString() === "secret";
  if (authorized) client.user = username;
  callback(null, authorized);
};

var myAuthentication = (client, topic, payload, callback) => {
  callback(null, client.user == topic.split("/")[1]);
};
var authorizeSubscribe = function(client, topic, callback) {
  //console.log(topic);
  callback(null, client.user == topic.split("/")[1]);
};*/

var server = new mosca.Server(settings);

server.on("ready", () => {
  console.log('Broker attivo in tls')
});


server.on('clientConnected', function(client) {
  console.log('In connection with ', client.id);
});


server.on('published', function(packet, client) {
 // console.log('Messaggio inviato topic', packet.topic);
});

/*
function setup() {
  server.authenticate = authenticate;
  server.authorizePublish = myAuthentication;
  server.authorizeSubscribe = authorizeSubscribe;
	console.log('Broker attivo; In attesa di sottoscrizioni.')
}*/
