const mqtt = require("mqtt");
var express = require("express");
const influx = require("influx");

const connectionOptions= {
  protocolId: 'MQTT',
  protocolVersion: 4,
  username: 'pippo',
  password: 'secret',
  clientId: 'pub_' + Math.random().toString(16).substr(2, 8)
} 
const influxconn = new influx.InfluxDB({
  host: "7tech.ddns.net",
  database: "prova",
  port: 8086,
  username: "user1",
  password: "user1"
});

const app = express();
const utility = require("./api/utility");
var client;

client=mqtt.connect("mqtt://192.168.1.164");


client.on("connect", () => {
  client.subscribe("sensori");
});

client.on("message", (packet, message) => {
  console.log(packet)
  console.log(JSON.parse(message));
  let obj = JSON.parse(message);
  let queueLength = obj.length;

  for (let i = 0; i < queueLength; i++) {
    let myMeasurement = utility.getName(obj[i]);
    let timestamp = utility.getTimestamp(obj[i]);
    let arrayTags = utility.getTags(obj[i]);
    let arrayFields = utility.getFields(obj[i]);
    
    influxconn.writePoints([
      {
        measurement: myMeasurement,
        fields: arrayFields,
        tags: arrayTags,
        timestamp: timestamp
      }],
      {
        precision: "ms"
      });
  }
});

// message is Buffer

//console.log(message.toString())
//client.end()
