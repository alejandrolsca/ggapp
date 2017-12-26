module.exports = {
                    "title" : "Agregar producto",
                    "labels":{
                        "pr-id": "ID producto",
                        "cl-id": "ID cliente",
                        "pr-process": "Proceso",
                        "pr-type": "Tipo",
                        "pr-partno": "No. parte",
                        "pr-code": "Codigo",
                        "pr-language": "Lenguaje",
                        "pr-weight": "Peso (kg)",
                        "pr-name": "Nombre",
                        "pr-description": "Descripcion",
                        "pr-finalsizewidth": "Ancho",
                        "pr-finalsizeheight": "Largo",
                        "pr-finalsizemeasure": "Unidad de medida",
                        "pr-inkfront": "# Tintas frente",
                        "pr-inkback": "# Tintas reverso",
                        "pr-inksfront": "Tintas frente",                        
                        "pr-inksback": "Tintas reverso",
                        "mt-id": "ID material",
                        "pr-materialsizewidth": "Ancho",
                        "pr-materialsizeheight": "Largo",
                        "pr-materialsizemeasure": "Unidad de medida",
                        "pr-materialformatsqty": "Formatos",
                        "pr-varnish": "Barniz",
                        "pr-varnishuv": "Barniz UV",
                        "pr-varnishfinished": "Acabado",
                        "pr-laminate": "Laminado",
                        "pr-laminatefinished": "Acabado",
                        "pr-laminatecaliber": "Calibre",
                        "pr-laminatesides": "Caras",
                        "pr-folio": "Folio",
                        "pr-foldunit1": "Estación 1",
                        "pr-foldunit2": "Estación 2",
                        "pr-foldunit3": "Estación 3",
                        "pr-precut": "Precorte",                        
                        "pr-diecutting": "Suaje",
                        "pr-diecuttingqty": "No. Suajes",
                        "pr-reinforcement": "Refuerzo",
                        "pr-cord": "Cordón",
                        "pr-wire": "Alámbre",
                        "pr-drill": "Perforación",
                        "pr-blocks": "Blocks",
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
                        "pr_language",
                        "pr_weight",
                        "pr_description",
                        "pr_finalsizewidth",
                        "pr_finalsizeheight",
                        "pr_finalsizemeasure",
                        "pr_inkfront",
                        "pr_inkback",
                        "mt_id",
                        "pr_materialsizewidth",
                        "pr_materialsizeheight",
                        "pr_materialsizemeasure",
                        "pr_materialformatsqty",
                        "pr_varnish",
                        "pr_varnishuv",
                        "pr_varnishfinished",
                        "pr_laminate",
                        "pr_laminatefinished",
                        "pr_laminatecaliber",
                        "pr_laminatesides",
                        "pr_folio",
                        "pr_foldunit1",
                        "pr_foldunit2",
                        "pr_foldunit3",
                        "pr_precut",                        
                        "pr_diecutting",
                        "pr_diecuttingqty",
                        "pr_reinforcement",
                        "pr_cord",
                        "pr_wire",
                        "pr_drill",
                        "pr_blocks",
                        "pr_status",
                        "pr_date",
                    ],
                     "fields" : {
                        pr_languageoptions : [
                            {"label":"Español","value":"español"},
                            {"label":"Distintos al español","value":"distintos al español"}
                        ],
                        pr_finalsizemeasureoptions : [
                            {"label":"cm","value":"cm"},
                            {"label":"pulgadas","value":"in"}
                        ],
                        pr_inkfrontoptions : [
                            {"label":"0 tintas","value":0},
                            {"label":"1 tinta","value":1},
                            {"label":"2 tintas","value":2},
                            {"label":"3 tintas","value":3},
                            {"label":"4 tintas","value":4},
                            {"label":"5 tintas","value":5},
                            {"label":"6 tintas","value":6},
                            {"label":"7 tintas","value":7},
                            {"label":"8 tintas","value":8},
                        ],
                        pr_inkbackoptions : [
                            {"label":"0 tintas","value":0},
                            {"label":"1 tinta","value":1},
                            {"label":"2 tintas","value":2},
                            {"label":"3 tintas","value":3},
                            {"label":"4 tintas","value":4},
                            {"label":"5 tintas","value":5},
                            {"label":"6 tintas","value":6},
                            {"label":"7 tintas","value":7},
                            {"label":"8 tintas","value":8},
                        ],
                        pr_materialsizemeasureoptions : [
                            {"label":"cm","value":"cm"},
                            {"label":"pulgadas","value":"in"}
                        ],
                        pr_varnishoptions : [
                            {"label":"No","value":"no"},                            
                            {"label":"Una cara","value":"oneside"},
                            {"label":"Dos caras","value":"twosides"}
                        ],
                        pr_varnisfinishedoptions : [
                            {"label":"Mate","value":"matte"},
                            {"label":"Brillante","value":"bright"}
                        ],
                        pr_laminateoptions : [
                            {"label":"No","value":"no"},
                            {"label":"Una cara","value":"oneside"},
                            {"label":"Dos caras","value":"twosides"}
                        ],
                        pr_laminatefinishedoptions : [
                            {"label":"Mate","value":"matte"},
                            {"label":"Brillante","value":"bright"}
                        ],
                        pr_laminatecaliberoptions : [
                            {"label":".2mm","value":"2mm"},
                            {"label":".4mm","value":"4mm"}
                        ],pr_foliooptions : [
                            {"label":"Si","value":"yes"},
                            {"label":"No","value":"no"}
                        ],pr_foldunitoptions : [
                            {"label":"0","value":0},
                            {"label":"1","value":1},
                            {"label":"2","value":2},
                            {"label":"3","value":3},
                            {"label":"4","value":4},
                            {"label":"5","value":5},
                            {"label":"6","value":6}
                        ],pr_precutoptions : [
                            {"label":"No","value":"no"},
                            {"label":"Horizontal","value":"horizontal"},
                            {"label":"Vertical","value":"vertical"},
                            {"label":"Ambas","value":"both"}
                        ],pr_reinforcementoptions : [
                            {"label":"No","value":"no"},
                            {"label":"Uno","value":"one"},
                            {"label":"Dos","value":"two"},
                        ],pr_cordoptions : [
                            {"label":"No","value":"no"},
                            {"label":"Colocado","value":"allocated"},
                            {"label":"Separado","value":"separated"},
                        ],pr_wireoptions : [
                            {"label":"No","value":"no"},
                            {"label":"Colocado","value":"allocated"},
                            {"label":"Separado","value":"separated"},
                        ],pr_drilloptions : [
                            {"label":"0","value":0},
                            {"label":"1","value":1},
                            {"label":"2","value":2},
                            {"label":"3","value":3},
                            {"label":"4","value":4},
                            {"label":"5","value":5}
                        ],pr_blocksoptions : [
                            {"label":"No","value":"no"},
                            {"label":"20","value":"20"},
                            {"label":"25","value":"25"},
                            {"label":"50","value":"50"},
                            {"label":"75","value":"75"},
                            {"label":"100","value":"100"},
                        ],
                        pr_statusoptions : [
                            {"label":"Activo","value":"A"},
                            {"label":"Inactivo","value":"I"}
                        ]
                     }
                }