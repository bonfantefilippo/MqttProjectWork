const mqtt = require("mqtt");
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(cors());
app.use(bodyParser.json());
var obj;

const connectionOptions = {
  port: 8883,
  protocol: "mqtts", //not mqtt because using tls
  protocolVersion: 4,
  username: "admin",
  password: "secret",
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
    res.sendStatus(204)
  });
});


app.listen(5001, () => console.log("In ascolto sulla porta 5001"));
