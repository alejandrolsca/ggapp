module.exports = {
                    "title" : "Material",
                    "labels":{
                        "mt-id":"ID Material",
                        "su-id":"ID Proveedor",
                        "su-corporatename":"Proveedor",
                        "mt-code":"Codigo",
                        "mt-type":"ID Tipo",
                        "maty-label":"Tipo",
                        "mt-description":"Descripción",
                        "mt-weight":"Peso (kg)",
                        "mt-width":"Ancho",
                        "mt-height":"Largo",
                        "mt-measure":"U. de medida",
                        "mt-thickness":"Espesor",
                        "mt-thicknessmeasure":"U. de medida",
                        "mt-status":"Estatus",
                        "mt-date":"Fecha",
                    },
                     "columns":[
                        "mt_id",
                        "mt_description",
                        "su_corporatename",
                        "mt_code",
                        "mt_type",
                        "maty_label",
                        "mt_weight",
                        "mt_width",
                        "mt_height",
                        "mt_measure",
                        "mt_thickness",
                        "mt_thicknessmeasure",
                        "mt_status",
                        "mt_date",
                     ],
                     "fields" : {
                        mt_statusoptions : [
                            {"label":"Activo","value":"A"},
                            {"label":"Inactivo","value":"I"}
                        ],
                        mt_measureoptions : [
                            {"label":"cm","value":"cm"},
                            {"label":"pulgadas","value":"in"}
                        ],
                        mt_thicknessmeasureoptions : [
                            {"label":"cm","value":"cm"},
                            {"label":"Milimetros","value":"mm"},
                            {"label":"Milesimas","value":"mil"},
                            {"label":"pulgadas","value":"in"},
                            {"label":"puntos","value":"pt"}
                        ],
                    }
                }