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
                    "labels":{
                        "add":"Agregar",
                        "edit":"editar",
                        "duplicate":"duplicar",
                        "show":"mostrar",
                        "submit":"Enviar",
                        "close":"Cerrar",
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
                    "copyright":"©2014 grupo grafico de méxico s.a. de c.v. todos los derechos reservados."
                },
                /****************************************
                HOME 
                ****************************************/
                "home":require('../../modules/home/lang.es-MX'),
                /****************************************
                CLIENT 
                ****************************************/
                "client": require('../../modules/client/lang.es-MX'),
                "client-custom": require('../../modules/client/lang.custom.es-MX'),
                "client-add": require('../../modules/client/modules/client.add/lang.es-MX'),
                "client-update": require('../../modules/client/modules/client.update/lang.es-MX'),
                /****************************************
                PRODUCT 
                ****************************************/
                "product": require('../../modules/product/lang.es-MX'),
                "productOffsetGeneral-add": require('../../modules/product/modules/productOffsetGeneral.add/lang.es-MX'),
                "productOffsetGeneral-update": require('../../modules/product/modules/productOffsetGeneral.update/lang.es-MX'),
                "productOffsetPaginated-add": require('../../modules/product/modules/productOffsetPaginated.add/lang.es-MX'),
                "productOffsetPaginated-update":{
                    "title" : "actualizar producto",
                },
                /****************************************
                SUPPLIER 
                ****************************************/
                "supplier": require('../../modules/supplier/lang.es-MX'),
                "supplier-add": require('../../modules/supplier/modules/supplier.add/lang.es-MX'),
                "supplier-update": require('../../modules/supplier/modules/supplier.update/lang.es-MX'),
                /****************************************
                PAPER 
                ****************************************/
                "paper": require('../../modules/paper/lang.es-MX'),
                "paper-add": require('../../modules/paper/modules/paper.add/lang.es-MX'),
                "paper-update": require('../../modules/paper/modules/paper.update/lang.es-MX'),
                /****************************************
                MACHINE 
                ****************************************/
                "machine": require('../../modules/machine/lang.es-MX'),
                "machine-add": require('../../modules/machine/modules/machine.add/lang.es-MX'),
                "machine-update": require('../../modules/machine/modules/machine.update/lang.es-MX'),
                /****************************************
                MACHINE 
                ****************************************/
                "ink": require('../../modules/ink/lang.es-MX'),
                "ink-add": require('../../modules/ink/modules/ink.add/lang.es-MX'),
                "ink-update": require('../../modules/ink/modules/ink.update/lang.es-MX'),
                /****************************************
                USER 
                ****************************************/
                "user": require('../../modules/user/lang.es-MX'),
                "user-add": require('../../modules/user/modules/user.add/lang.es-MX'),
                "user-update": require('../../modules/user/modules/user.update/lang.es-MX'),
                "user-profile": require('../../modules/user/modules/user.profile/lang.es-MX'),
                /****************************************
                WORK ORDER 
                ****************************************/
                "wo": require('../../modules/wo/lang.es-MX'),
                "wo-add": require('../../modules/wo/modules/wo.add/lang.es-MX'),
                "wo-update": require('../../modules/wo/modules/wo.update/lang.es-MX'),
                /****************************************
                AUTH 
                ****************************************/
                "auth": require('../../modules/auth/lang.es-MX'),
                /****************************************
                ZONE 
                ****************************************/
                "zone": require('../../modules/zone/lang.es-MX'),
                "zone-add": require('../../modules/zone/modules/zone.add/lang.es-MX'),
                "zone-update": require('../../modules/zone/modules/zone.update/lang.es-MX'),
            }