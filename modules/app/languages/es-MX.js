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
                        "rfc": "xxxx-######[-xxx]",
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
                    "submit":"enviar",
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
                     ]
                },
                "client-add":{
                    "title" : "agregar cliente",
                },
                "client-update":{
                    "title" : "actualizar cliente",
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
                    ]
                },
                "zone-add":{
                    "title" : "agregar dirección de envio",
                }
                
            }