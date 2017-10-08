module.exports = {
                    "title" : "Tintas",
                    "labels":{
                        "in-id": "ID tinta",
                        "su-id": "ID proveedor",
                        "in-code": "Codigo",
                        "in-type": "Tipo",
                        "in-description": "Descripcion",
                        "in-status": "Estatus",
                        "in-date": "Fecha"
                    },
                    "columns":[
                        "in_id",
                        "su_id",
                        "in_code",
                        "in_type",
                        "in_description",
                        "in_status",
                        "in_date"
                    ],
                     "fields" : {
                        in_typeoptions : [
                            {"label":"Offset","value":"offset"},
                            {"label":"Flexo","value":"flexo"},
                            {"label":"Inkjet solvente","value":"inkjet_solvent"},
                            {"label":"Inkjet UV","value":"inkjet_uv"},
                            {"label":"Serigrafía","value":"serigraphy"},
                            {"label":"Vinil","value":"vinyl"},
                            {"label":"Toner","value":"toner"},
                            {"label":"Sello","value":"seal"},
                            {"label":"Other","value":"otros"},
                        ],
                        in_statusoptions : [
                            {"label":"Activo","value":"A"},
                            {"label":"Inactivo","value":"I"}
                        ]
                     }
                }