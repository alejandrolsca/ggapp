module.exports = {
                    "title" : "Agregar Producto",
                    "labels":{
                        "pr-id": "ID producto",
                        "cl-id": "ID cliente",
                        "pr-process": "Proceso",
                        "pr-type": "Tipo",
                        "pr-partno": "No. parte",
                        "pr-code": "Codigo",
                        "pr-name": "Nombre",
                        "pr-description": "Descripcion",
                        "pr-finalsizewidth": "Ancho",
                        "pr-finalsizeheight": "Alto",
                        "pr-finalsizemeasure": "Medida",
                        "pr-inkfront": "Frente",
                        "pr-inkback": "Reverso",
                        "pa-id": "ID papel",
                        "pr-papersizewidth": "Ancho",
                        "pr-papersizeheight": "Alto",
                        "pr-papersizemeasure": "Medida",
                        "pr-paperformatsqty": "Formatos",
                        "pr-varnish": "Barniz",
                        "pr-varnishfinished": "Acabado",
                        "pr-laminate": "Laminado",
                        "pr-laminatefinished": "Acabado",
                        "pr-laminatecaliber": "Calibre",
                        "pr-laminatesides": "Caras",
                        "pr-folio": "Folio",
                        "pr-precut": "Precorte",
                        "pr-fold": "Doblez",
                        "pr-diecutting": "Suaje",
                        "pr-diecuttingqty": "No. Suajes",
                        "pr-reinforcement": "Refuerzo",
                        "pr-cord": "Cordón",
                        "pr-wire": "Alámbre",
                        "pr-stapling": "Grapado",
                        "pr-bound":"Encuadernado",
                        "pr-spiralbind": "Engargolado",
                        "pr-blocks": "Blocks",
                        "pr-intpages":"No. de Paginas",
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
                        "pr_name",
                        "pr_description",
                        "pr_finalsizewidth",
                        "pr_finalsizeheight",
                        "pr_finalsizemeasure",
                        "pr_inkfront",
                        "pr_inkback",
                        "pa_id",
                        "pr_papersizewidth",
                        "pr_papersizeheight",
                        "pr_papersizemeasure",
                        "pr_paperformatsqty",
                        "pr_varnish",
                        "pr_varnishfinished",
                        "pr_laminate",
                        "pr_laminatefinished",
                        "pr_laminatecaliber",
                        "pr_laminatesides",
                        "pr_folio",
                        "pr_precut",
                        "pr_fold",
                        "pr_diecutting",
                        "pr_diecuttingqty",
                        "pr_reinforcement",
                        "pr_cord",
                        "pr_wire",
                        "pr_blocks",
                        "pr_stapling",
                        "pr_bound",
                        "pr_spiralbind",
                        "pr_intpages",
                        "pr_status",
                        "pr_date",
                    ],
                     "fields" : {
                        pr_finalsizemeasureoptions : [
                            {"label":"cm","value":"cm"},
                            {"label":"pulgadas","value":"in"}
                        ],
                        pr_inkfrontoptions : [
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
                            {"label":"1 tinta","value":1},
                            {"label":"2 tintas","value":2},
                            {"label":"3 tintas","value":3},
                            {"label":"4 tintas","value":4},
                            {"label":"5 tintas","value":5},
                            {"label":"6 tintas","value":6},
                            {"label":"7 tintas","value":7},
                            {"label":"8 tintas","value":8},
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
                            {"label":"Dos caras","value":"twosides"},
                        ],
                        pr_laminatefinishedoptions : [
                            {"label":"Mate","value":"matte"},
                            {"label":"Brillante","value":"bright"}
                        ],
                        pr_laminatecaliberoptions : [
                            {"label":".2mm","value":"2mm"},
                            {"label":".4mm","value":"4mm"}
                        ],
                        pr_laminatesidesoptions : [
                            {"label":"Una cara","value":"oneside"},
                            {"label":"Dos caras","value":"twosides"}
                        ],pr_foliooptions : [
                            {"label":"Si","value":"yes"},
                            {"label":"No","value":"no"}
                        ],pr_precutoptions : [
                            {"label":"No","value":"no"},
                            {"label":"Horizontal","value":"horizontal"},
                            {"label":"Vertical","value":"vertical"},
                        ],pr_foldoptions : [
                            {"label":"Triptico","value":"tryptic"},
                        ],pr_diecuttingoptions : [
                            {"label":"Si","value":"yes"},
                            {"label":"No","value":"no"}
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
                        ],pr_staplingoptions : [
                            {"label":"No","value":"no"},
                            {"label":"Una grapa","value":"1"},
                            {"label":"Dos grapas","value":"2"},
                        ],pr_boundoptions : [
                            {"label":"No","value":"no"},
                            {"label":"Si","value":"yes"},
                        ],pr_spiralbindoptions : [
                            {"label":"Plastico","value":"plastic"},
                            {"label":"Metal","value":"metal"},
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
                        ],
                        pr_papersizemeasureoptions : [
                            {"label":"cm","value":"cm"},
                            {"label":"pulgadas","value":"in"}
                        ],
                     }
                }