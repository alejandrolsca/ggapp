module.exports = {
                "general":{ 
                    "nav":[
                        {"name":"inicio","url":"#/home"},
                        {"name":"clientes","url":"#/client","submenu": 
                         [
                             {"name": "Agregar","url": "#/client/add"}
                         ]
                        },
                        {"name":"productos","url":"#/product","submenu": 
                         [
                             {"name": "Agregar","url": "#/product/add"}
                         ]
                        },
                        {"name":"ordenes de trabajo","url":"#/wo","submenu": 
                         [
                             {"name": "Agregar","url": "#/wo/add"}
                         ]
                        },
                        {"name":"usuarios","url":"#/user","submenu": 
                         [
                             {"name": "Agregar","url": "#/user/add"}
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
                    "labels":{
                        "add":"Agregar",
                        "edit":"editar",
                        "duplicate":"duplicar",
                        "show":"mostrar",
                        "submit":"Enviar",
                        "continue":"Continuar",
                        "close":"Cerrar",
                    },
                    "regexp":{
                        "singlespaces": "sin espacios dobles ni caracteres especiales.",
                        "receiptschedule": "sin espacios dobles ni caracteres especiales.",
                        "materialcode": "sin espacios ni caracteres especiales",
                        "inkcode": "sin espacios ni caracteres especiales",
                        "machinetotalinks": "minimo 1 maximo 8",
                        "time": "Tiempo 00:00:00",
                        "rfc": "AAAA111111[AAA]",
                        "ssntin": "11-1111111 ó 111-11-1111",
                        "immex": "Numero IMMEX (1 o mas digitos)-Año IMMEX (20##)",
                        "email": "por favor introduzca un email valido.",
                        "decimal": "numero y de 2 a 5 decimales (#.##[###])",
                        "discount": "cero mas 2 decimales (0.##)",
                        "integer": "solo numeros enteros",
                        "zipcode": "Solo mayusculas, numeros enteros y guíon medio.",
                        "date": "aaaa-mm-dd",
                        "user": "de 4 a 16 caracteres sin espacios ni caracteres especiales.",
                        "password": "la contraseña debe contener de 8-16 caracteres, por lo menos una letra mayuscula, una letra minuscula y un digito.",
                        "phone": "solo use el simbolo + al principio y numeros del 0 al 9",
                        "wo_id": "Solo se aceptan numeros enteros separados por coma."
                    },
                    "copyright":"©2017 grupo grafico de méxico s.a. de c.v. todos los derechos reservados."
                },
                /****************************************
                404 
                ****************************************/
                "404":require('./404/lang.es-MX'),
                /****************************************
                HOME 
                ****************************************/
                "home":require('./home/lang.es-MX'),
                /****************************************
                CLIENT 
                ****************************************/
                "client": require('./client/lang.es-MX'),
                "client-custom": require('./client/lang.custom.es-MX'),
                "client-add": require('./client/modules/client.add/lang.es-MX'),
                "client-update": require('./client/modules/client.update/lang.es-MX'),
                /****************************************
                PRODUCT 
                ****************************************/
                "product": require('./product/lang.es-MX'),
                "productOffsetGeneral-add": require('./product/modules/productOffsetGeneral.add/lang.es-MX'),
                "productOffsetPaginated-add": require('./product/modules/productOffsetPaginated.add/lang.es-MX'),
                "productOffsetCounterfoil-add": require('./product/modules/productOffsetCounterfoil.add/lang.es-MX'),
                "productFlexoLabels-add": require('./product/modules/productFlexoLabels.add/lang.es-MX'),
                "productFlexoRibbons-add": require('./product/modules/productFlexoRibbons.add/lang.es-MX'),
                "productPlotterFlexibles-add": require('./product/modules/productPlotterFlexibles.add/lang.es-MX'),                
                "productPlotterRigid-add": require('./product/modules/productPlotterRigid.add/lang.es-MX'),                
                "productPlotterBanner-add": require('./product/modules/productPlotterBanner.add/lang.es-MX'),            
                "productStampsGeneral-add": require('./product/modules/productStampsGeneral.add/lang.es-MX'),                
                "productStampsInkPad-add": require('./product/modules/productStampsInkPad.add/lang.es-MX'),               
                "productStampsInk-add": require('./product/modules/productStampsInk.add/lang.es-MX'),
                "productSerigraphyBanner-add": require('./product/modules/productSerigraphyBanner.add/lang.es-MX'),                            
                "productSerigraphyFlexibles-add": require('./product/modules/productSerigraphyFlexibles.add/lang.es-MX'),                            
                "productSerigraphyRigid-add": require('./product/modules/productSerigraphyRigid.add/lang.es-MX'),                            
                "productLaserGeneral-add": require('./product/modules/productLaserGeneral.add/lang.es-MX'),                          
                "productDigitalGeneral-add": require('./product/modules/productDigitalGeneral.add/lang.es-MX'),                          
                "productDigitalPaginated-add": require('./product/modules/productDigitalPaginated.add/lang.es-MX'),                          
                "productDigitalCounterfoil-add": require('./product/modules/productDigitalCounterfoil.add/lang.es-MX'),                          
                /****************************************
                SUPPLIER 
                ****************************************/
                "supplier": require('./supplier/lang.es-MX'),
                "supplier-add": require('./supplier/modules/supplier.add/lang.es-MX'),
                "supplier-update": require('./supplier/modules/supplier.update/lang.es-MX'),
                /****************************************
                MATERIAL 
                ****************************************/
                "material": require('./material/lang.es-MX'),
                "material-add": require('./material/modules/material.add/lang.es-MX'),
                "material-update": require('./material/modules/material.update/lang.es-MX'),
                /****************************************
                MACHINE 
                ****************************************/
                "machine": require('./machine/lang.es-MX'),
                "machine-add": require('./machine/modules/machine.add/lang.es-MX'),
                "machine-update": require('./machine/modules/machine.update/lang.es-MX'),
                /****************************************
                MACHINE 
                ****************************************/
                "ink": require('./ink/lang.es-MX'),
                "ink-add": require('./ink/modules/ink.add/lang.es-MX'),
                "ink-update": require('./ink/modules/ink.update/lang.es-MX'),
                /****************************************
                USER 
                ****************************************/
                "user": require('./user/lang.es-MX'),
                "user-profile": require('./user/modules/user.profile/lang.es-MX'),
                /****************************************
                WORK ORDER 
                ****************************************/
                "wo": require('./wo/lang.es-MX'),
                "wo-add": require('./wo/modules/wo.add/lang.es-MX'),
                "wo-duplicate": require('./wo/modules/wo.duplicate/lang.es-MX'),
                "wo-update": require('./wo/modules/wo.update/lang.es-MX'),
                /****************************************
                ZONE 
                ****************************************/
                "zone": require('./zone/lang.es-MX'),
                "zone-add": require('./zone/modules/zone.add/lang.es-MX'),
                "zone-update": require('./zone/modules/zone.update/lang.es-MX'),
                /****************************************
                WORKFLOW 
                ****************************************/
                "workflow": require('./workflow/lang.es-MX'),
                "workflow-custom": require('./workflow/lang.custom.es-MX'),
                /****************************************
                TRAFFIC LIGHT REPORT 
                ****************************************/
                "tlr": require('./traffic-light-report/lang.es-MX'),
                "tlr-custom": require('./traffic-light-report/lang.custom.es-MX'),
                /****************************************
                EXPORTATION INVOICE
                ****************************************/
                "exportation-invoice": require('./exportation-invoice/lang.es-MX'),
                "exportation-invoice-custom": require('./exportation-invoice/lang.custom.es-MX'),
            }