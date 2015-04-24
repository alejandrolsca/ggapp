module.exports = {
                "general":{ 
                    "nav":[
                        {"name":"inicio","url":"#/home"},
                        {"name":"clientes","url":"#/client","submenu": 
                         [
                             {"name": "agregar","url": "#/client/add"}
                         ]
                        },
                        {"name":"productos","url":"#/product","submenu": 
                         [
                             {"name": "agregar","url": "#/product/add"}
                         ]
                        },
                        {"name":"ordenes de trabajo","url":"#/wo","submenu": 
                         [
                             {"name": "agregar","url": "#/wo/add"}
                         ]
                        },
                        {"name":"usuarios","url":"#/user","submenu": 
                         [
                             {"name": "agregar","url": "#/user/add"}
                         ]
                        },
                        {"name":"login","url":"#/"},
                        {"name":"reportes","url":"#/reports","submenu": 
                         [
                             {"name": "sub1","url": "../login"},
                             {"name": "sub2","url": "../login"},
                             {"name": "sub3","url": "../login"}
                         ]
                        }
                    ],
                    "buttons":{
                        "edit":"editar",
                        "duplicate":"duplicar",
                        "wo":"orden de trabajo",
                    },
                    "regexp":{
                        "singlespaces": "sin espacios dobles ni caracteres especiales.",
                        "papercode": "sin espacios ni caracteres especiales",
                        "inkcode": "sin espacios ni caracteres especiales",
                        "machinetotalinks": "minimo 1 maximo 8",
                        "rfc": "XXXX-######[-XXX]",
                        "email": "por favor introduzca un email valido.",
                        "decimal": "numero y de 2 a 5 decimales (#.##[###])",
                        "discount": "cero mas 2 decimales (0.##)",
                        "integer": "solo numeros enteros",
                        "zipcode": "el codigo postal es de 5 numeros.",
                        "date": "aaaa-mm-dd",
                        "user": "de 4 a 16 caracteres sin espacios ni caracteres especiales.",
                        "password": "la contraseña debe contener de 8-16 caracteres, por lo menos una letra mayuscula, una letra minuscula y un digito.",
                        "phone": "solo use el simbolo + al principio y numeros del 0 al 9"
                    },
                    "submit":"Enviar",
                    "close":"Cerrar",
                    "copyright":"©2014 grupo grafico de méxico s.a. de c.v. todos los derechos reservados."
                },
                "home":{
                    "title" : "inicio",
                    "welcome" : "bienvenido @@!"
                },
                 "client":{
                    "title" : "clientes",
                    "labels":{
                        "cl-id":"id cliente",
                        "cl-corporatename":"razón social",
                        "cl-tin":"rfc",
                        "cl-name":"nombre",
                        "cl-fatherslastname":"apellido paterno",
                        "cl-motherslastname":"apellido materno",
                        "cl-street":"calle",
                        "cl-streetnumber":"numero exterior",
                        "cl-suitenumber":"numero interior",
                        "cl-neighborhood":"colonia",
                        "cl-addressreference":"referencia",
                        "cl-country":"país",
                        "cl-state":"estado",
                        "cl-city":"ciudad",
                        "cl-county":"municipio",
                        "cl-zipcode":"codigo postal",
                        "cl-email":"correo electrónico",
                        "cl-phone":"teléfono",
                        "cl-mobile":"móvil",
                        "cl-creditlimit":"limite de crédito",
                        "cl-customerdiscount":"descuento",
                        "cl-status":"estatus",
                        "cl-date":"fecha",
                    },
                     "columns":[
                        "cl_id",
                        "cl_corporatename",
                        "cl_tin",
                        "cl_name",
                        "cl_fatherslastname",
                        "cl_motherslastname",
                        "cl_street",
                        "cl_streetnumber",
                        "cl_suitenumber",
                        "cl_neighborhood",
                        "cl_addressreference",
                        "cl_country",
                        "cl_state",
                        "cl_city",
                        "cl_county",
                        "cl_zipcode",
                        "cl_email",
                        "cl_phone",
                        "cl_mobile",
                        "cl_creditlimit",
                        "cl_customerdiscount",
                        "cl_status",
                        "cl_date",
                     ],
                     "fields" : {
                        cl_statusoptions : [
                            {"label":"Activo","value":"A"},
                            {"label":"Inactivo","value":"I"}
                        ],
                     }
                },
                "client-custom": {
                    "labels":{
                        "pr-title":"Seleccíone el tipo de producto",
                        "pr-process":"Processo",
                        "pr-type":"Tipo",
                    },
                     "fields" : {
                        pr_processoptions : [
                            {"label":"Offset","value":"offset",types:[
                                {"label":"General","value":"general"},   
                                {"label":"Paginados","value":"paginated"},   
                                {"label":"counterfoil","value":"counterfoil"},   
                            ]},
                            {"label":"Flexo","value":"flexo",types:[
                                {"label":"Etiquetas","value":"labels"},   
                                {"label":"Ribbons","value":"ribbons"},   
                                {"label":"counterfoil","value":"offset"},   
                            ]},
                            {"label":"Ploter","value":"plotter",types:[
                                {"label":"Etiquetas","value":"labels"},   
                                {"label":"Señalización","value":"signage"},   
                                {"label":"Banners","value":"banners"},   
                                {"label":"Articulos","value":"Articles"},   
                            ]},
                            {"label":"Sellos","value":"seals",types:[
                                {"label":"Goma","value":"rubber"},   
                                {"label":"Moldura","value":"molding"},   
                                {"label":"Autoentintable","value":"self_tintable"},   
                                {"label":"Cojin","value":"pad"},   
                                {"label":"Tinta","value":"ink"},   
                            ]},
                            {"label":"Serigrafía","value":"serigraphy",types:[
                                {"label":"Etiquetas","value":"labels"},   
                                {"label":"Señalización","value":"signage"},   
                                {"label":"Banners","value":"banners"},   
                                {"label":"Articulos","value":"Articles"},   
                            ]},
                            {"label":"Laser","value":"laser",types:[
                                {"label":"Laser","value":"laser"},     
                            ]},
                        ]
                     }
                },
                "client-add":{
                    "title" : "agregar cliente",
                },
                "client-update":{
                    "title" : "actualizar cliente",
                },
                "product":{
                    "title" : "Productos",
                    "labels":{
                        "pr-id": "ID producto",
                        "cl-id": "ID producto",
                        "pr-process": "Proceso",
                        "pr-type": "Tipo",
                        "pr-status": "Estatus",
                        "pr-date": "Fecha",
                    },
                    "columns":[
                        "pr_id",
                        "cl_id",
                        "pr_process",
                        "pr_type",
                        "pr_status",
                        "pr_date",
                    ],
                     "fields" : {
                        
                     }
                },
                "productOffsetGeneral-add":{
                    "title" : "agregar producto",
                    "labels":{
                        "pr-id": "ID producto",
                        "cl-id": "ID cliente",
                        "pr-process": "Proceso",
                        "pr-type": "Tipo",
                        "pr-partno": "No. parte",
                        "pr-code": "Codigo",
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
                        "pr-uvvarnish": "Barniz UV",
                        "pr-finished": "Acabado",
                        "pr-laminate": "Laminado",
                        "pr-laminatefinished": "Acabado",
                        "pr-laminatecaliber": "Calibre",
                        "pr-laminatesides": "Caras",
                        "pr-folio": "Folio",
                        "pr-precut": "Precorte",
                        "pr-fold": "Doblez",
                        "pr-diecutting": "Suaje",
                        "pr-diecuttingqty": "Suajes",
                        "pr-reinforcement": "Refuerzo",
                        "pr-cord": "Cordón",
                        "pr-wire": "Alámbre",
                        "pr-blocks": "Blocks",
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
                        "pr_varnishuv",
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
                            {"label":"Si","value":"yes"},
                            {"label":"No","value":"no"}
                        ],
                        pr_varnishuvhoptions : [
                            {"label":"Una cara","value":"oneside"},
                            {"label":"Dos caras","value":"twosides"}
                        ],
                        pr_varnisfinishedoptions : [
                            {"label":"Mate","value":"matte"},
                            {"label":"Brillante","value":"bright"}
                        ],
                        pr_laminateoptions : [
                            {"label":"Si","value":"yes"},
                            {"label":"No","value":"no"}
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
                },
                "productOffsetGeneral-update":{
                    "title" : "actualizar producto",
                },
                 "supplier":{
                    "title" : "Proveedores",
                    "labels":{
                        "su-id":"id proveedor",
                        "su-corporatename":"razón social",
                        "su-tin":"rfc",
                        "su-name":"nombre",
                        "su-fatherslastname":"apellido paterno",
                        "su-motherslastname":"apellido materno",
                        "su-street":"calle",
                        "su-streetnumber":"numero exterior",
                        "su-suitenumber":"numero interior",
                        "su-neighborhood":"colonia",
                        "su-addressreference":"referencia",
                        "su-country":"país",
                        "su-state":"estado",
                        "su-city":"ciudad",
                        "su-county":"municipio",
                        "su-zipcode":"codigo postal",
                        "su-email":"correo electrónico",
                        "su-phone":"teléfono",
                        "su-mobile":"móvil",
                        "su-status":"estatus",
                        "su-date":"fecha",
                    },
                     "columns":[
                        "su_id",
                        "su_corporatename",
                        "su_tin",
                        "su_name",
                        "su_fatherslastname",
                        "su_motherslastname",
                        "su_street",
                        "su_streetnumber",
                        "su_suitenumber",
                        "su_neighborhood",
                        "su_addressreference",
                        "su_country",
                        "su_state",
                        "su_city",
                        "su_county",
                        "su_zipcode",
                        "su_email",
                        "su_phone",
                        "su_mobile",
                        "su_status",
                        "su_date",
                     ],
                     "fields" : {
                        su_statusoptions : [
                            {"label":"Activo","value":"A"},
                            {"label":"Inactivo","value":"I"}
                        ],
                     }
                },
                "supplier-add":{
                    "title" : "agregar proveedor",
                },
                "supplier-update":{
                    "title" : "actualizar proveedor",
                },
                 "paper":{
                    "title" : "Papel",
                    "labels":{
                        "pa-id":"ID Papel",
                        "su-id":"ID Proveedor",
                        "pa-code":"Codigo",
                        "pa-type":"Tipo",
                        "pa-description":"Descripción",
                        "pa-weight":"Peso",
                        "pa-width":"Ancho",
                        "pa-height":"Altura",
                        "pa-price":"Precio",
                        "pa-status":"Estatus",
                        "pa-date":"Fecha",
                    },
                     "columns":[
                        "pa_id",
                        "su_id",
                        "pa_code",
                        "pa_type",
                        "pa_description",
                        "pa_weight",
                        "pa_width",
                        "pa_height",
                        "pa_price",
                        "pa_status",
                        "pa_date",
                     ],
                     "fields" : {
                        pa_statusoptions : [
                            {"label":"Activo","value":"A"},
                            {"label":"Inactivo","value":"I"}
                        ],
                        pa_typeoptions : [
                            {"label":"Papel","value":"paper"},
                            {"label":"Cartulina","value":"poster_board"},
                            {"label":"Papel Adhesivo","value":"adhesive_paper"},
                            {"label":"Pelicula Adhesiva","value":"adhesive film"},
                            {"label":"Síntetico","value":"synthetic"},
                            {"label":"Plasticos","value":"plastics"},
                            {"label":"Termal Transfer","value":"termal transfer"},
                            {"label":"Direct Termal","value":"direct_termal"},
                            {"label":"Otros","value":"other"}
                        ],
                    }
                },
                "paper-add":{
                    "title" : "agregar papel",
                },
                "paper-update":{
                    "title" : "actualizar papel",
                },
                 "machine":{
                    "title" : "maquinas",
                    "labels":{
                        "ma-id":"ID Maquina",
                        "ma-name":"Maquina",
                        "ma-maxsizewidth":"Tamaño max. ancho",
                        "ma-maxsizeheight":"Tamaño max. altura",
                        "ma-minsizewidth":"Tamaño min. ancho",
                        "ma-minsizeheight":"Tamaño max. altura",
                        "ma-sizemeasure":"Medida",
                        "ma-totalinks":"Tintas totales",
                        "ma-fullcolor":"Full color",
                        "ma-printbg":"Imprime fondos",
                        "ma-process":"Proceso",
                        "ma-status":"Estatus",
                        "ma-date":"Fecha",
                    },
                     "columns":[
                        "ma_id",
                        "ma_name",
                        "ma_maxsizewidth",
                        "ma_maxsizeheight",
                        "ma_minsizewidth",
                        "ma_minsizeheight",
                        "ma_sizemeasure",
                        "ma_totalinks",
                        "ma_fullcolor",
                        "ma_printbg",
                        "ma_process",
                        "ma_status",
                        "ma_date",
                     ],
                     "fields" : {
                        ma_sizemeasureoptions : [
                            {"label":"cm","value":"cm"},
                            {"label":"pulgadas","value":"in"}
                        ],
                        ma_fullcoloroptions : [
                            {"label":"Si","value":"yes"},
                            {"label":"No","value":"no"}
                        ],
                        ma_printbgoptions : [
                            {"label":"Si","value":"yes"},
                            {"label":"No","value":"no"}
                        ],
                        ma_processoptions : [
                            {"label":"Offset","value":"offset"},
                            {"label":"Flexo","value":"flexo"},
                            {"label":"Plóter","value":"plotter"},
                            {"label":"Sellos","value":"seals"},
                            {"label":"Serigrafía","value":"serigraphy"},
                            {"label":"Laser","value":"laser"}
                        ],
                        ma_statusoptions : [
                            {"label":"Activo","value":"A"},
                            {"label":"Inactivo","value":"I"}
                        ],

                    }
                },
                "machine-add":{
                    "title" : "agregar maquina",
                },
                "machine-update":{
                    "title" : "actualizar maquina",
                },
                "ink":{
                    "title" : "Tintas",
                    "labels":{
                        "in-id": "ID tinta",
                        "su-id": "ID proveedor",
                        "in-code": "Codigo",
                        "in-type": "Tipo",
                        "in-description": "Descripcion",
                        "in-price": "Precio",
                        "in-status": "Estatus",
                        "in-date": "Fecha"
                    },
                    "columns":[
                        "in_id",
                        "su_id",
                        "in_code",
                        "in_type",
                        "in_description",
                        "in_price",
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
                },
                "ink-add":{
                    "title" : "agregar tinta",
                },
                "ink-update":{
                    "title" : "actualizar tinta",
                },
                "user":{
                    "title" : "usuarios",
                    "labels":{
                        "us-id": "id usuario",
                        "gr-id": "id grupo",
                        "us-user": "usuario",
                        "us-password": "contraseña",
                        "us-name": "nombre",
                        "us-fatherslastname": "apellido paterno",
                        "us-motherslastname": "apellido materno",
                        "us-email": "correo electrónico",
                        "us-phone": "teléfono",
                        "us-mobile": "móvil",
                        "us-status": "estatus",
                        "us-date": "fecha"
                    },
                    "columns":[
                        "us_id",
                        "gr_id",
                        "us_user",
                        "us_password",
                        "us_name",
                        "us_fatherslastname",
                        "us_motherslastname",
                        "us_email",
                        "us_phone",
                        "us_mobile",
                        "us_status",
                        "us_date"
                    ]
                },
                "user-add":{
                    "title" : "agregar usuario",
                },
                "user-update":{
                    "title" : "actualizar usuario",
                },
                "user-profile":{
                    "title" : "perfil del usuario",
                },
                "wo":{
                    "title" : "ordenes de trabajo",
                    "labels":{
                        "wo-id" : "no. orden",
                        "wo-date" : "fecha",
                        "cl-id" : "id cliente",
                        "zo-id" : "id zona",
                        "wo-orderedby" : "ordenado por",
                        "wo-attention" : "atención",
                        "wo-rfq" : "no. cotizacion",
                        "wo-process" : "proceso",
                        "wo-release" : "release",
                        "wo-po" : "orden de compra",
                        "wo-line" : "linea",
                        "wo-linetotal" : "total lineas",
                        "pr-id" : "id producto",
                        "wo-status" : "estatus",
                        "wo-commitmentdate" : "fecha compromiso",
                        "wo-previousid" : "id anterior",
                        "wo-previousdate" : "fecha anterior",
                        "sh-id" : "id embarque",
                        "sh-date" : "fecha embarque",
                        "wo-trackingno" : "no. guia",
                        "wo-shippingdate" : "fecha envio",
                        "wo-deliverydate" : "fecha entrega",
                        "wo-invoiceno" : "no. factura",
                        "wo-invoicedate" : "fecha factura",
                        "wo-notes" : "notas"
                    }
                },
                "wo-add":{
                    "title" : "agregar orden de trabajo",
                },
                "wo-update":{
                    "title" : "actualizar orden de trabajo",
                },
                "auth":{
                    "title" : "iniciar sesión",
                    "enterprise" : "empresa",
                    "user" : "usuario",
                    "password" : "contraseña",
                },
                "zone":{
                    "title" : "direcciones de envio",
                    "labels":{
                        "zo-id" : "id zona",
                        "cl-id" : "id cliente",
                        "zo-zone" : "zona",
                        "zo-corporatename" : "razón social",
                        "zo-tin" : "rfc",
                        "zo-immex" : "immex",
                        "zo-name" : "nombre",
                        "zo-fatherslastname" : "apellido paterno",
                        "zo-motherslastname" : "apellido materno",
                        "zo-street":"calle",
                        "zo-streetnumber":"numero exterior",
                        "zo-suitenumber":"numero interior",
                        "zo-neighborhood":"colonia",
                        "zo-addressreference":"referencia",
                        "zo-country":"país",
                        "zo-state":"estado",
                        "zo-city":"ciudad",
                        "zo-county":"municipio",
                        "zo-zipcode":"codigo postal",
                        "zo-email":"correo electrónico",
                        "zo-phone":"teléfono",
                        "zo-mobile":"móvil",
                        "zo-status":"estatus",
                        "zo-date":"fecha",

                    },
                    "columns":[
                        "zo_id",
                        "cl_id",
                        "zo_zone",
                        "zo_corporatename",
                        "zo_tin",
                        "zo_immex",
                        "zo_name",
                        "zo_fatherslastname",
                        "zo_motherslastname",
                        "zo_street",
                        "zo_streetnumber",
                        "zo_suitenumber",
                        "zo_neighborhood",
                        "zo_addressreference",
                        "zo_country",
                        "zo_state",
                        "zo_city",
                        "zo_county",
                        "zo_zipcode",
                        "zo_email",
                        "zo_phone",
                        "zo_mobile",
                        "zo_status",
                        "zo_date",
                    ],
                     "fields" : {
                        zo_statusoptions : [
                            {"label":"Activo","value":"A"},
                            {"label":"Inactivo","value":"I"}
                        ],
                     }
                },
                "zone-add":{
                    "title" : "agregar dirección de envio",
                },
                "zone-update":{
                    "title" : "actualizar dirección de envio",
                }
                
            }