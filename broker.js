var mosca = require("mosca");

var SECURE_KEY = __dirname +'/key/ryans-key.pem';
var SECURE_CERT = __dirname + '/key/ryans-cert.pem';

var settings = {
  port: 1883,
  protocol: "mqtts",
  secure: {
    port: 8883,
    keyPath: SECURE_KEY,
    certPath: SECURE_CERT
  }
};

//ciaone
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



server.on('subscribed', function(topic, client) {
  console.log('Subscriber '+client.id+ ' has subscribed to topic ' + topic);
 });


function setup() {
  //authenticazione via username e pwd
  server.authenticate = authenticator;
  console.log('Broker attivo on TLS; In attesa di sottoscrizioni.')
  console.log('______________________________________________________')
}
