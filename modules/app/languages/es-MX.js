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
                        "CL_ID":{"NAME":"ID Cliente","INVALID":"Required"},
                        "CL_CORPORATENAME":{"NAME":"Razón Social","INVALID":"Required"},
                        "CL_TIN":{"NAME":"RFC","INVALID":"Required"},
                        "CL_NAME":{"NAME":"Nombre","INVALID":"Required"},
                        "CL_FATHERSLASTNAME":{"NAME":"Apellido Paterno","INVALID":"Required"},
                        "CL_MOTHERSLASTNAME":{"NAME":"Apellido Materno","INVALID":"Required"},
                        "CL_STREET":{"NAME":"Calle","INVALID":"Required"},
                        "CL_STREETNUMBER":{"NAME":"Numero Exterior","INVALID":"Required"},
                        "CL_SUITENUMBER":{"NAME":"Numero Interior","INVALID":"Required"},
                        "CL_NEIGHBORHOOD":{"NAME":"Colonia","INVALID":"Required"},
                        "CL_ADDRESSREFERENCE":{"NAME":"Referencia","INVALID":"Required"},
                        "CL_COUNTRY":{"NAME":"País","INVALID":"Required"},
                        "CL_STATE":{"NAME":"Estado","INVALID":"Required"},
                        "CL_CITY":{"NAME":"Ciudad","INVALID":"Required"},
                        "CL_COUNTY":{"NAME":"Municipio","INVALID":"Required"},
                        "CL_ZIPCODE":{"NAME":"Codigo Postal","INVALID":"Required"},
                        "CL_EMAIL":{"NAME":"Correo Electrónico","INVALID":"Required"},
                        "CL_PHONE":{"NAME":"Teléfono","INVALID":"Required"},
                        "CL_MOBILE":{"NAME":"Móvil","INVALID":"Required"},
                        "CL_CREDITLIMIT":{"NAME":"Limite de credito","INVALID":"Required"},
                        "CL_CUSTOMERDISCOUNT":{"NAME":"Descuento","INVALID":"Required"},
                        "CL_STATUS":{"NAME":"Estatus","INVALID":"Required"},
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