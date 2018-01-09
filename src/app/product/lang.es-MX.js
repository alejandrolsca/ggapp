module.exports = {
                    "title" : "Productos",
                    "labels":{
                        "pr-id": "ID producto",
                        "cl-id": "ID Cliente",
                        "cl-corporatename": "Cliente",
                        "pr-partno": "No. Parte",
                        "pr-code": "Codigo",
                        "pr-name": "Nombre",
                        "pr-process": "Proceso",
                        "pr-type": "Tipo",
                        "wo-previousid": "Orden Anterior",
                        "tc-id": "Fracción",
                        "pr-weight": "Peso",
                        "pr-status": "Estatus",
                        "pr-date": "Fecha",
                    },
                    "columns":[
                        {"binding":"pr_id","type":"Number"},
                        {"binding":"wo_previousid","type":"Number"},
                        {"binding":"cl_id","type":"Number"},
                        {"binding":"cl_corporatename","type":"String"},
                        {"binding":"pr_partno","type":"String"},
                        {"binding":"pr_code","type":"String"},
                        {"binding":"pr_name","type":"String"},
                        {"binding":"pr_process","type":"String"},
                        {"binding":"pr_type","type":"String"},
                        {"binding":"pr_weight","type":"Number"},
                        {"binding":"pr_status","type":"String"},
                        {"binding":"pr_date","type":"Date"}
                    ],
                     "fields" : {
                        
                     }
                }