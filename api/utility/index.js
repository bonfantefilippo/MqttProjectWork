module.exports = {

    getFields:function(measure) {
        let result = "";
        let fieldsLength = measure.fields.length;

        for (let i = 0; i < fieldsLength; i++) {//ciclo tutte le misure

            let value = '"' + measure.fields[i].fldname+'":' + measure.fields[i].value;//forma valore per formato JSON
            result = result + value +",";//concatena tutti i fields della singola misura
        }

        result = result.substring(0, result.length - 1); //utile ad eliminare l'ultima virgola prima di inserire in influx

        return JSON.parse('{'+result+'}');
    },

    getTags:function(measure) {
        let result = "";
        let tagsLength = measure.tags.length;

        for (let i = 0; i < tagsLength; i++) {//ciclo tutte le misure

            let value = '"' + measure.tags[i].tagName + '":'+measure.tags[i].value; //forma valore per formato JSON
            result = result + value +",";//concatena tutti i fields della singola misura
        }

        result = result.substring(0, result.length - 1); //utile ad eliminare l'ultima virgola prima di inserire in influx

        return JSON.parse('{'+result+'}');
    },

    getName:function(measure){
         return measure.measurement;
    },

    getTimestamp(measure){
        return measure.timestamp;
    }
};