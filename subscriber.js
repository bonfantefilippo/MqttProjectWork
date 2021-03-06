const mqtt = require("mqtt");
const express = require("express");
const influx = require("influx");
const cors = require("cors");
let client;

const connectionOptions = {
  port: 8883,
  protocol: "mqtts",
  protocolVersion: 4,
  username: "admin",
  password: "secret",
  rejectUnauthorized: false,
 /* clientId:
    "sub_" +
    Math.random()
      .toString(16)
      .substr(2, 8)*/
  clientId: "InfluxDB"
};

const influxconn = new influx.InfluxDB({
  host: "7tech.ddns.net",
  database: "prova",
  port: 8086,
  username: "user1",
  password: "user1"
});

const utility = require("./api/utility");


client=mqtt.connect(connectionOptions);


client.on("connect", () => {
  client.subscribe("SYMulation/DataLogger/sensori");
  console.log('InfluxDB Subscriber connected to Broker and is waiting for a message...')
});

client.on('packetreceive', (packet) => {
  if(packet.topic!==null)
  console.log("\x1b[37m",`Ricevuto messaggio nel topic ${JSON.stringify(packet.topic)}`);
})

client.on('error', (packet) => {
  console.log("\x1b[31m",`Connessione rifituata; verifica credenziali.`);
})

client.on("message", (topic, packet, message) => {
 // console.log("Messaggio ricevuto");
  //let obj = JSON.parse(message);
  console.log(JSON.parse(message.payload))
  
  let obj = JSON.parse(message.payload);
  let queueLength = obj.length;

  for (let i = 0; i < queueLength; i++) {
    let myMeasurement = utility.getName(obj[i]);
    let timestamp = utility.getTimestamp(obj[i]);
    let arrayTags = utility.getTags(obj[i]);
    let arrayFields = utility.getFields(obj[i]);
    console.log(arrayFields)
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
