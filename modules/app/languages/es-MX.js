module.exports = {
                "GENERAL":{ 
                    "NAV":[
                        {"name":"Inicio","url":"#/home"},
                        {"name":"Clientes","url":"#/client","subMenu": 
                         [
                             {"name": "Agregar","url": "#/client/add"}
                         ]
                        },
                        {"name":"Productos","url":"#/product","subMenu": 
                         [
                             {"name": "Agregar","url": "#/product/add"}
                         ]
                        },
                        {"name":"Ordenes de trabajo","url":"#/wo","subMenu": 
                         [
                             {"name": "Agregar","url": "#/wo/add"}
                         ]
                        },
                        {"name":"Usuarios","url":"#/user","subMenu": 
                         [
                             {"name": "Agregar","url": "#/user/add"}
                         ]
                        },
                        {"name":"Login","url":"#/"},
                        {"name":"Reportes","url":"#/reports","subMenu": 
                         [
                             {"name": "sub1","url": "../login"},
                             {"name": "sub2","url": "../login"},
                             {"name": "sub3","url": "../login"}
                         ]
                        }
                    ],
                    "BUTTONS":{
                        "EDIT":"Editar",
                        "DUPLICATE":"Duplicar",
                    },
                    "REGEXP":{
                        "SINGLESPACES": "Sin espacios dobles ni caracteres especiales.",
                        "RFC": "XXXX-######[-XXX]",
                        "EMAIL": "Por favor introduzca un email valido.",
                        "DECIMAL2": "Solo numeros enteros o con 2 decimales.",
                        "DISCOUNT": "El formato valido para el descuento es 0[.00]",
                        "INTEGER": "Solo numeros enteros",
                        "ZIPCODE": "El codigo postal es de 5 numeros.",
                        "DATE": "AAAA-MM-DD",
                        "USER": "De 4 a 16 caracteres sin espacios ni caracteres especiales.",
                        "PASSWORD": "la contraseña debe contener de 8-16 caracteres, por lo menos una letra mayuscula, una letra minuscula y un digito.",
                        "PHONE": "Los numeros de tel. solo aceptan los caracteres + - ( ) y numeros del 0-9"
                    },
                    "SUBMIT":"Enviar",
                    "COPYRIGHT":"©2014 Grupo Grafico de México S.A. de C.V. Todos los derechos reservados."
                },
                "HOME":{
                    "TITLE" : "Inicio",
                    "WELCOME" : "Bienvenido @@!"
                },
                 "CLIENT":{
                    "TITLE" : "Clientes",
                    "FIELDS":{
                        "CL_ID":"ID Cliente",
                        "CL_CORPORATENAME":"Razón Social",
                        "CL_TIN":"RFC",
                        "CL_NAME":"Nombre",
                        "CL_FATHERSLASTNAME":"Apellido Paterno",
                        "CL_MOTHERSLASTNAME":"Apellido Materno",
                        "CL_STREET":"Calle",
                        "CL_STREETNUMBER":"Numero Exterior",
                        "CL_SUITENUMBER":"Numero Interior",
                        "CL_NEIGHBORHOOD":"Colonia",
                        "CL_ADDRESSREFERENCE":"Referencia",
                        "CL_COUNTRY":"País",
                        "CL_STATE":"Estado",
                        "CL_CITY":"Ciudad",
                        "CL_COUNTY":"Municipio",
                        "CL_ZIPCODE":"Codigo Postal",
                        "CL_EMAIL":"Correo Electrónico",
                        "CL_PHONE":"Teléfono",
                        "CL_MOBILE":"Móvil",
                        "CL_CREDITLIMIT":"Limite de credito",
                        "CL_CUSTOMERDISCOUNT":"Descuento",
                        "CL_STATUS":"Estatus",
                    }
                },
                "CLIENT_ADD":{
                    "TITLE" : "Agregar Cliente",
                },
                "CLIENT_UPDATE":{
                    "TITLE" : "Actualizar Cliente",
                },
                "USER":{
                    "TITLE" : "Usuarios",
                    "FIELDS":{
                        "US_ID": "ID Usuario",
                        "GR_ID": "ID Grupo",
                        "US_USER": "Usuario",
                        "US_PASSWORD": "Contraseña",
                        "US_NAME": "Nombre",
                        "US_FATHERSLASTNAME": "Apellido Paterno",
                        "US_MOTHERSLASTNAME": "Apellido Materno",
                        "US_EMAIL": "Correo Electrónico",
                        "US_PHONE": "Teléfono",
                        "US_MOBILE": "Móvil",
                        "US_STATUS": "Estatus",
                        "US_DATE": "Fecha"
                    }
                },
                "USER_ADD":{
                    "TITLE" : "Agregar Usuario",
                },
                "USER_UPDATE":{
                    "TITLE" : "Actualizar Usuario",
                },
                "WO":{
                    "TITLE" : "Ordenes de Trabajo",
                    "FIELDS":{
                        "WO_ID" : "No. Orden",
                        "WO_DATE" : "Fecha",
                        "CL_ID" : "ID Cliente",
                        "ZO_ID" : "ID Zona",
                        "WO_ORDEREDBY" : "Ordenado Por",
                        "WO_ATTENTION" : "Atención",
                        "WO_RFQ" : "No. Cotizacion",
                        "WO_PROCESS" : "Proceso",
                        "WO_RELEASE" : "Release",
                        "WO_PO" : "Orden de Compra",
                        "WO_LINE" : "Linea",
                        "WO_LINETOTAL" : "Total Lineas",
                        "PRSE_ID" : "ID Producto",
                        "WO_STATUS" : "Estatus",
                        "WO_COMMITMENTDATE" : "Fecha Compromiso",
                        "WO_PREVIOUSID" : "ID Anterior",
                        "WO_PREVIOUSDATE" : "Fecha Anterior",
                        "SH_ID" : "ID Embarque",
                        "SH_DATE" : "Fecha Embarque",
                        "WO_TRACKINGNO" : "No. Guia",
                        "WO_SHIPPINGDATE" : "Fecha Envio",
                        "WO_DELIVERYDATE" : "Fecha Entrega",
                        "WO_INVOICENO" : "No. Factura",
                        "WO_INVOICEDATE" : "Fecha Factura",
                        "WO_NOTES" : "Notas"
                    }
                },
                "WO_ADD":{
                    "TITLE" : "Agregar Orden de Trabajo",
                },
                "WO_UPDATE":{
                    "TITLE" : "Actualizar Orden de Trabajo",
                },
                "AUTH":{
                    "TITLE" : "Iniciar sesión",
                    "ENTERPRISE" : "Empresa",
                    "USER" : "Usuario",
                    "PASSWORD" : "Contraseña",
                }
                
            }