const mqtt = require("mqtt");
const express = require("express");
const cors = require("cors");
const tls = require("tls");
const app = express();
const bodyParser = require("body-parser");
const fs = require("fs");
app.use(cors());
app.use(bodyParser.json());


const connectionOptions = {
  port: 8883,
  protocol: "mqtts",
  protocolVersion: 4,
  username: "pippo",
  password: "secret",
  ca: [fs.readFileSync("../Broker_SYMulator/key/ryans-cert.pem")],
  rejectUnauthorized: false,
  clientId:
    "pub_" +
    Math.random()
      .toString(16)
      .substr(2, 8)
};



var client = mqtt.connect(connectionOptions)



client.on("connect", function() {
  app.post("/api/datalog", (req, res) => {
    console.log(req.body);
    client.publish("sensori", JSON.stringify(req.body));
    console.log("Sensori inviato");
    res.json({ result: "ok" });
  });
});

app.listen(5001, () => console.log("In ascolto sulla porta 5001"));
