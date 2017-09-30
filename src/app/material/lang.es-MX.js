module.exports = {
                    "title" : "Material",
                    "labels":{
                        "pa-id":"ID Material",
                        "su-id":"ID Proveedor",
                        "pa-code":"Codigo",
                        "pa-type":"Tipo",
                        "pa-description":"Descripción",
                        "pa-weight":"Peso (kg)",
                        "pa-width":"Ancho",
                        "pa-height":"Largo",
                        "pa-measure":"Medida",
                        "pa-price":"Precio",
                        "pa-status":"Estatus",
                        "pa-date":"Fecha",
                    },
                     "columns":[
                        "mt_id",
                        "su_id",
                        "mt_code",
                        "mt_type",
                        "mt_description",
                        "mt_weight",
                        "mt_width",
                        "mt_height",
                        "mt_measure",
                        "mt_price",
                        "mt_status",
                        "mt_date",
                     ],
                     "fields" : {
                        mt_statusoptions : [
                            {"label":"Activo","value":"A"},
                            {"label":"Inactivo","value":"I"}
                        ],
                        mt_typeoptions : [
                            {"label":"Papel","value":"paper"},
                            {"label":"Cartulina","value":"poster_board"},
                            {"label":"Papel Adhesivo","value":"adhesive_paper"},
                            {"label":"Pelicula Adhesiva","value":"adhesive_film"},
                            {"label":"Síntetico","value":"synthetic"},
                            {"label":"Plasticos","value":"plastics"},
                            {"label":"Termal Transfer","value":"termal_transfer"},
                            {"label":"Direct Termal","value":"direct_termal"},
                            {"label":"Ribbon","value":"ribbon"},
                            {"label":"Sello","value":"stamp"},
                            {"label":"Almohadilla de tinta","value":"ink_pad"},
                            {"label":"Tinta para sello","value":"stamp_ink"},
                            {"label":"Otros","value":"other"}
                        ],
                        mt_measureoptions : [
                            {"label":"cm","value":"cm"},
                            {"label":"pulgadas","value":"in"}
                        ],
                    }
                }