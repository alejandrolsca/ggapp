module.exports = {
                    "title" : "Agregar producto",
                    "labels":{
                        "pr-id": "ID producto",
                        "cl-id": "ID cliente",
                        "pr-process": "Proceso",
                        "pr-type": "Tipo",
                        "pr-partno": "No. parte",
                        "pr-code": "Codigo",
                        "pr-weight": "Peso (kg)",
                        "pr-name": "Nombre",
                        "pr-description": "Descripcion",
                        "mt-id": "ID material",
                        "pr-milliliters": "Contenido Neto (ml)",
                        "tc-id": "Fracción",
                        "pr-status": "Estatus",
                        "pr-date": "Fecha",
                    },
                    "columns":[
                        "pr_id",
                        "cl_id",
                        "pr_process",
                        "pr_type",
                        "pr_partno",
                        "pr_code",
                        "pr_weight",
                        "pr_description",
                        "mt_id",
                        "pr_milliliters",
                        "pr_status",
                        "pr_date",
                    ],
                     "fields" : {
                        pr_statusoptions : [
                            {"label":"Activo","value":"A"},
                            {"label":"Inactivo","value":"I"}
                        ]
                     }
                }