module.exports = {
                    "title" : "Tintas",
                    "labels":{
                        "in-id": "ID tinta",
                        "su-id": "ID proveedor",
                        "in-code": "Codigo (Referencia de Guía)",
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
                            {"label":"Plotter - Inkjet agua","value":"inkjet_water"},
                            {"label":"Plotter - Inkjet solvente","value":"inkjet_solvent"},
                            {"label":"Plotter - Inkjet UV","value":"inkjet_uv"},
                            {"label":"Serigrafía","value":"serigraphy"},
                            {"label":"Digital - Toner","value":"toner"},
                            {"label":"Sellos","value":"stamps"},
                            {"label":"Otros","value":"other"},
                        ],
                        in_statusoptions : [
                            {"label":"Activo","value":"A"},
                            {"label":"Inactivo","value":"I"}
                        ]
                     }
                }