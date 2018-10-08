const mqtt = require("mqtt");
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(cors());
app.use(bodyParser.json());
var obj;

const connectionOptions = {
  //hostname: '7technode.ddns.net',
  port: 8883,
  protocol: "mqtts", //not mqtt because using tls
  protocolVersion: 4,
  username: "admin",
  password: "secret",
  rejectUnauthorized: false,
  clientId: "Sensori_Impianto"
  /*clientId:
    "pub_" +
    Math.random()
      .toString(16)
      .substr(2, 8)*/
};


function sendNumber() {
  var number = Math.round(Math.random() * 0xffffff);
  client.publish("mytest/digit", number.toString());
  setTimeout(sendNumber, 4000);
}

var client = mqtt.connect(connectionOptions);

client.on("connect", () => {
  sendNumber();
  console.log("Publisher connesso")
  // client.publish("mytest/digit", sendNumber());
  /*app.post("/api/datalog", (req, res) => {
    client.publish("SYMulation/DataLogger/sensori", JSON.stringify(req.body)); //provare con QoS
    res.sendStatus(204);
  });*/
});

client.on('packetsend', (packet) => {
  console.log("\x1b[37m",`Pubblicato nel topic: ${packet.topic}`);
})

client.on("offline", () => {
  console.log("Broker not found");
  app.post("/api/datalog", (req, res) => {
    res.sendStatus(500);
  });
});

app.listen(5001, () => console.log("\x1b[34m","In ascolto sulla porta 5001"));
