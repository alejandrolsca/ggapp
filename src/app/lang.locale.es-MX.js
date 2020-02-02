module.exports = {
    "general": {
        "nav": [
            { "name": "inicio", "url": "/home" },
            {
                "name": "clientes", "url": "/client", "submenu":
                    [
                        { "name": "Agregar", "url": "/client/add" }
                    ]
            },
            {
                "name": "productos", "url": "/product", "submenu":
                    [
                        { "name": "Agregar", "url": "/product/add" }
                    ]
            },
            {
                "name": "ordenes de trabajo", "url": "/wo", "submenu":
                    [
                        { "name": "Agregar", "url": "/wo/add" }
                    ]
            },
            {
                "name": "usuarios", "url": "/user", "submenu":
                    [
                        { "name": "Agregar", "url": "/user/add" }
                    ]
            },
            { "name": "login", "url": "/" },
            {
                "name": "reportes", "url": "/reports", "submenu":
                    [
                        { "name": "sub1", "url": "../login" },
                        { "name": "sub2", "url": "../login" },
                        { "name": "sub3", "url": "../login" }
                    ]
            }
        ],
        "labels": {
            "add": "Agregar",
            "edit": "Editar",
            "duplicate": "Duplicar",
            "show": "Mostrar",
            "open": "Abrir",
            "submit": "Enviar",
            "continue": "Continuar",
            "close": "Cerrar",
            "history": "Historial",
            "cancel": "Cancelar",
        },
        "regexp": {
            "singlespaces": "sin espacios dobles ni caracteres especiales.",
            "concept": "max. 17 - sin espacios dobles ni caracteres especiales.",
            "receiptschedule": "sin espacios dobles ni caracteres especiales.",
            "materialcode": "sin espacios ni caracteres especiales",
            "inkcode": "sin espacios ni caracteres especiales",
            "machinetotalinks": "minimo 1 maximo 8",
            "time": "Tiempo 00:00:00",
            "rfc": "AAAA111111[AAA]",
            "ssntin": "11-1111111 ó 111-11-1111",
            "immex": "Numero IMMEX (1 o mas digitos)-Año IMMEX (20##)",
            "email": "por favor introduzca un email valido.",
            "decimal": "numero y de 2 a 6 decimales (#.##[####])",
            "discount": "cero mas 2 decimales (0.##)",
            "integer": "solo numeros enteros",
            "zipcode": "Solo mayusculas, numeros enteros y guíon medio.",
            "date": "aaaa-mm-dd",
            "user": "de 4 a 16 caracteres sin espacios ni caracteres especiales.",
            "auth0_user": "de 4 a 15 caracteres sin espacios, puede incluir un puntos (.) intermedios.",
            "password": "la contraseña debe contener de 8-16 caracteres, por lo menos una letra mayuscula, una letra minuscula y un digito.",
            "phone": "solo use el simbolo + al principio y numeros del 0 al 9",
            "wo_id": "Solo se aceptan numeros enteros separados por coma."
        },
        "copyright": "©2017 grupo grafico de méxico s.a. de c.v. todos los derechos reservados."
    },
    /****************************************
    404 
    ****************************************/
    "404": require('./404/lang.es-MX'),
    /****************************************
    401 
    ****************************************/
    "401": require('./401/lang.es-MX'),
    /****************************************
    HOME 
    ****************************************/
    "home": require('./home/lang.es-MX'),
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
    "product-update": require('./product/modules/product.update/lang.es-MX'),
    "productOffsetGeneral-add": require('./product/modules/productOffsetGeneral.add/lang.es-MX'),
    "productOffsetGeneral-update": require('./product/modules/productOffsetGeneral.update/lang.es-MX'),
    "productOffsetPaginated-add": require('./product/modules/productOffsetPaginated.add/lang.es-MX'),
    "productOffsetPaginated-update": require('./product/modules/productOffsetPaginated.update/lang.es-MX'),
    "productOffsetCounterfoil-add": require('./product/modules/productOffsetCounterfoil.add/lang.es-MX'),
    "productOffsetCounterfoil-update": require('./product/modules/productOffsetCounterfoil.update/lang.es-MX'),
    "productFlexoLabels-add": require('./product/modules/productFlexoLabels.add/lang.es-MX'),
    "productFlexoLabels-update": require('./product/modules/productFlexoLabels.update/lang.es-MX'),
    "productFlexoRibbons-add": require('./product/modules/productFlexoRibbons.add/lang.es-MX'),
    "productFlexoRibbons-update": require('./product/modules/productFlexoRibbons.update/lang.es-MX'),
    "productPlotterFlexibles-add": require('./product/modules/productPlotterFlexibles.add/lang.es-MX'),
    "productPlotterFlexibles-update": require('./product/modules/productPlotterFlexibles.update/lang.es-MX'),
    "productPlotterRigid-add": require('./product/modules/productPlotterRigid.add/lang.es-MX'),
    "productPlotterRigid-update": require('./product/modules/productPlotterRigid.update/lang.es-MX'),
    "productPlotterBanner-add": require('./product/modules/productPlotterBanner.add/lang.es-MX'),
    "productPlotterBanner-update": require('./product/modules/productPlotterBanner.update/lang.es-MX'),
    "productStampsGeneral-add": require('./product/modules/productStampsGeneral.add/lang.es-MX'),
    "productStampsGeneral-update": require('./product/modules/productStampsGeneral.update/lang.es-MX'),
    "productStampsInkPad-add": require('./product/modules/productStampsInkPad.add/lang.es-MX'),
    "productStampsInkPad-update": require('./product/modules/productStampsInkPad.update/lang.es-MX'),
    "productStampsInk-add": require('./product/modules/productStampsInk.add/lang.es-MX'),
    "productStampsInk-update": require('./product/modules/productStampsInk.update/lang.es-MX'),
    "productSerigraphyBanner-add": require('./product/modules/productSerigraphyBanner.add/lang.es-MX'),
    "productSerigraphyBanner-update": require('./product/modules/productSerigraphyBanner.update/lang.es-MX'),
    "productSerigraphyFlexibles-add": require('./product/modules/productSerigraphyFlexibles.add/lang.es-MX'),
    "productSerigraphyFlexibles-update": require('./product/modules/productSerigraphyFlexibles.update/lang.es-MX'),
    "productSerigraphyRigid-add": require('./product/modules/productSerigraphyRigid.add/lang.es-MX'),
    "productSerigraphyRigid-update": require('./product/modules/productSerigraphyRigid.update/lang.es-MX'),
    "productLaserGeneral-add": require('./product/modules/productLaserGeneral.add/lang.es-MX'),
    "productLaserGeneral-update": require('./product/modules/productLaserGeneral.update/lang.es-MX'),
    "productDigitalGeneral-add": require('./product/modules/productDigitalGeneral.add/lang.es-MX'),
    "productDigitalGeneral-update": require('./product/modules/productDigitalGeneral.update/lang.es-MX'),
    "productDigitalPaginated-add": require('./product/modules/productDigitalPaginated.add/lang.es-MX'),
    "productDigitalPaginated-update": require('./product/modules/productDigitalPaginated.update/lang.es-MX'),
    "productDigitalCounterfoil-add": require('./product/modules/productDigitalCounterfoil.add/lang.es-MX'),
    "productDigitalCounterfoil-add": require('./product/modules/productDigitalCounterfoil.add/lang.es-MX'),
    "productDigitalCounterfoil-update": require('./product/modules/productDigitalCounterfoil.update/lang.es-MX'),
    "productDiecuttingGeneral-add": require('./product/modules/productDiecuttingGeneral.add/lang.es-MX'),
    "productDiecuttingGeneral-update": require('./product/modules/productDiecuttingGeneral.update/lang.es-MX'),
    "productDirectSaleGeneral-add": require('./product/modules/productDirectSaleGeneral.add/lang.es-MX'),
    "productDirectSaleGeneral-update": require('./product/modules/productDirectSaleGeneral.update/lang.es-MX'),
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
    USERS 
    ****************************************/
   "users": require('./users/lang.es-MX'),
   "users-update": require('./users/modules/users.update/lang.es-MX'),
    /****************************************
    WORK ORDER 
    ****************************************/
    "wo": require('./wo/lang.es-MX'),
    "wo-add": require('./wo/modules/wo.add/lang.es-MX'),
    "wo-duplicate": require('./wo/modules/wo.duplicate/lang.es-MX'),
    "wo-update": require('./wo/modules/wo.update/lang.es-MX'),
    "wo-view": require('./wo/modules/wo.view/lang.es-MX'),
    "wo-history": require('./wo/modules/wo.history/lang.es-MX'),
    /****************************************
    ZONE 
    ****************************************/
    "zone": require('./zone/lang.es-MX'),
    "zone-add": require('./zone/modules/zone.add/lang.es-MX'),
    "zone-update": require('./zone/modules/zone.update/lang.es-MX'),
    "zone-view": require('./zone/modules/zone.view/lang.es-MX'),
    /****************************************
    WORKFLOW 
    ****************************************/
    "workflow": require('./workflow/lang.es-MX'),
    "workflow-custom": require('./workflow/lang.custom.es-MX'),
    /****************************************
   WORKFLOW2 
   ****************************************/
    "workflow2": require('./workflow2/lang.es-MX'),
    "workflow2-custom": require('./workflow2/lang.custom.es-MX'),
    /****************************************
    TRAFFIC LIGHT REPORT 
    ****************************************/
    "tlr": require('./traffic-light-report/lang.es-MX'),
    "tlr-custom": require('./traffic-light-report/lang.custom.es-MX'),
    /****************************************
    TRAFFIC LIGHT REPORT 
    ****************************************/
    "tlrAll": require('./traffic-light-report-all/lang.es-MX'),
    "tlrAll-custom": require('./traffic-light-report-all/lang.custom.es-MX'),
    /****************************************
    EXPORTATION INVOICE
    ****************************************/
    "exportationInvoice": require('./exportation-invoice/lang.es-MX'),
    "exportationInvoice-add": require('./exportation-invoice/modules/exportation-invoice.add/lang.es-MX'),
    /****************************************
   SHIPPING LIST
   ****************************************/
    "shippingList": require('./shipping-list/lang.es-MX'),
    "shippingList-add": require('./shipping-list/modules/shipping-list.add/lang.es-MX'),
    "shippingList-invoice": require('./shipping-list/modules/shipping-list.invoice/lang.es-MX'),
    /****************************************
    PRINT RUNS
    ****************************************/
    "printruns": require('./printruns/lang.es-MX'),
    /****************************************
    PRINT RUNS BY USER
    ****************************************/
    "printruns-by-user": require('./printruns-by-user/lang.es-MX'),
    /****************************************
     PRINT RUNS BY USER2
     ****************************************/
    "printruns-by-user2": require('./printruns-by-user2/lang.es-MX'),
    /****************************************
     EARNINGS BY STATUS
     ****************************************/
    "earnings-by-status": require('./earnings-by-status/lang.es-MX'),
    /****************************************
     MATERIAL COUNT
     ****************************************/
    "material-count": require('./material-count/lang.es-MX'),
    /****************************************
    PACKAGE LABELS
    ****************************************/
    "package-labels": require('./package-labels/lang.es-MX'),
    "package-labels-custom": require('./package-labels/lang.custom.es-MX'),
    /****************************************
    CARDINAL
    ****************************************/
   "cardinal-art": require('./cardinal-art/lang.es-MX')
}