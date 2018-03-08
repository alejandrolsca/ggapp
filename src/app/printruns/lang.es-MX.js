module.exports = {
                    "title" : "Tirajes",
                    "labels":{
                        "ma-id":"ID Maquina",
                        "ma-name":"Maquina",
                        "print-runs":"Tirajes",
                        "wo-status":"Estatus"
                    },
                     "columns":[
                        { "binding": "ma_id", "type": "Number", "width": 100 ,"html": false},
                        { "binding": "ma_name", "type": "String", "width": 300 ,"html": false},
                        { "binding": "print_runs", "type": "Number", "width": 100 ,"html": false},
                        { "binding": "wo_status", "type": "String", "width": 200 ,"html": false}
                     ],
                     "fields" : {
                     }
                }