const mqtt = require("mqtt");
const express = require("express");
const cors = require("cors");
const tls = require("tls");
const app = express();
const bodyParser = require("body-parser");
const fs = require("fs");

var client;

const connectionOptions = {
  protocolId: "MQTT",
  protocolVersion: 4,
  username: "pippo",
  password: "secret",
  clientId:
    "pub_" +
    Math.random()
      .toString(16)
      .substr(2, 8)
};

var optionForTLS = {
  host: "127.0.0.1",
  port: 8443,
  rejectUnauthorized: false
};

const optionsNodeSite = {
  ca: [fs.readFileSync("../Broker_SYMulator/key/ryans-cert.pem")],
  rejectUnauthorized: false
};

//const socket = tls.connect(1883, optionForTLS);
/*const socket = tls.connect(8443, optionsNodeSite, () => {
  console.log(
    "client connected",
    socket.authorized ? "authorized" : "unauthorized"
  );
  process.stdin.pipe(socket);
  process.stdin.resume();
});
        socket.setEncoding("utf8");
    socket.on("data", data => {
        console.log(data);
        });
    socket.on("end", () => {
  server.close();
});*/

client = mqtt.connect("mqtt://192.168.1.164", connectionOptions);
//client = mqtt.connect("mqtt://192.168.1.164", socket);



app.use(cors());
app.use(bodyParser.json());

client.on("connect", function() {
  app.post("/api/datalog", (req, res) => {
    console.log(req.body);
    client.publish("sensori", JSON.stringify(req.body));
    console.log("Sensori inviato");
    res.json({ result: "ok" });
  });
});

app.listen(5001, () => console.log("In ascolto sulla porta 5001"));
