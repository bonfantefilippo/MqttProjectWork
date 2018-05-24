const express = require('express');
const bodyParser = require('body-parser');
const Influx = require("influx");
const utility = require('../utility');

let router = express.Router();

const influx = new Influx.InfluxDB({
    host:'7tech.ddns.net',
    database:'prova',
    port:8086,
    username:'user1',
    password:'user1'
});

router.use(bodyParser.json());

router.get("/",(req,res)=>{
});

router.post("/write",(req,res)=> {
    let obj = req.body;
    let queueLength = obj.length;

    for(let i = 0;i < queueLength;i++) {

        let myMeasurement = utility.getName(obj[i]);
        let timestamp = utility.getTimestamp(obj[i]);
        let arrayTags = utility.writeTags(obj[i]);
        let arrayFields = utility.writeFields(obj[i]);
        /* ESEMPIO DATO DA GESTIRE
    [{"Measure":
				{"measurement":"measure1",
    			 "fields":[{"field1":"5"},{"field2":"15"}],
    			 "tags":[{"tag1":"10"}],
				 "timestamp":"123123"
    			},
    			{"measurement":"measure2",
    			 "fields":[{"field1":"88"},{"field2":"43"}],
    			 "tags":[{"tag1":"98"}],
				 "timestamp":"123456"
    			}
	 }
	]
		*/
        influx.writePoints([
            {
                measurement: myMeasurement,
                fields: arrayFields,
                tags: arrayTags,
                timestamp: timestamp
            }
        ])
            .catch(error => { //catch da testare!!!
               console.log(error);
               res.sendStatus(500);
            });

    }
    res.sendStatus(204);
});

module.exports=router;