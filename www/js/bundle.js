(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (angular) {
    //ALEJANDRO SANCHEZ BETANCOURT
    'use strict';

    angular.module('app', [
        'ui.router',
        'ngAnimate',
        'ui.bootstrap',
        'gg-fields',
        'gg-alerts',
        'wj',
        'ja.qr',
        'auth0',
        'angular-storage',
        'angular-jwt',
        require('./modules/login').name,
        require('./modules/client').name,
        require('./modules/user').name,
        require('./modules/home').name,
        require('./modules/product').name,
        require('./modules/supplier').name,
        require('./modules/machine').name,
        require('./modules/paper').name,
        require('./modules/ink').name,
        require('./modules/wo').name,
        require('./modules/zone').name
    ])

        .config(['$stateProvider', '$urlRouterProvider', '$httpProvider', 'authProvider', 'jwtInterceptorProvider',
            function ($stateProvider, $urlRouterProvider, $httpProvider, authProvider, jwtInterceptorProvider) {
                authProvider.init({
                    domain: 'grupografico.auth0.com',
                    clientID: 'ZexVDEPlqGLMnWXnmyKSsoE8JO3ZS76y',
                    loginState: 'login' // matches login state
                });
                // We're annotating this function so that the `store` is injected correctly when this file is minified
                jwtInterceptorProvider.tokenGetter = ['store', function (store) {
                    // Return the saved token
                    return store.get('token');
                }];

                $httpProvider.interceptors.push('jwtInterceptor');
                // Batching multiple $http responses into one $digest
                $httpProvider.useApplyAsync(true);
                // when there is an empty route, redirect to /index   
                $urlRouterProvider.when('', '/home');
                // when root, redirect to /home  
                $urlRouterProvider.when('/', '/home');
            }])

        .run(['$rootScope', 'auth', 'store', 'jwtHelper', '$location',
            function ($rootScope, auth, store, jwtHelper, $location) {
                // This hooks al auth events to check everything as soon as the app starts
                auth.hookEvents();
                // This events gets triggered on refresh or URL change
                $rootScope.$on('$stateChangeStart', function () {
                    var token = store.get('token');
                    if (token) {
                        if (!jwtHelper.isTokenExpired(token)) {
                            if (!auth.isAuthenticated) {
                                auth.authenticate(store.get('profile'), token);
                            }
                        } else {
                            // Either show the login page or use the refresh token to get a new idToken
                            $location.path('/login');
                        }
                    }
                });

            }])

        .filter('i18n', require('./modules/app/lang.filter.i18n'))

        //.factory('langFac', require('./modules/app/lang.fac'))

        .controller('appCtrl', require('./modules/app/app.ctrl'))

})(angular);
},{"./modules/app/app.ctrl":2,"./modules/app/lang.filter.i18n":3,"./modules/client":9,"./modules/home":22,"./modules/ink":24,"./modules/login":36,"./modules/machine":38,"./modules/paper":50,"./modules/product":62,"./modules/supplier":78,"./modules/user":90,"./modules/wo":105,"./modules/zone":120}],2:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    angular

    return ['$scope', '$rootScope', 'i18nFilter', '$location', 'auth', 'store',
        function ($scope, $rootScope, i18nFilter, $location, auth, store) {

            $scope.logout = function () {
                auth.signout();
                store.remove('profile');
                store.remove('token');
                $location.path("/login");
            }
            /*
            langFac.getLang().then(function (promise) {
                if (promise.data.success) {
                    $rootScope.currentLanguage = promise.data.lang;
                    $scope.navItems = i18nFilter("GENERAL.NAV");
                }
            });

            for (var item in $scope.navItems) {
                if ($scope.navItems[item].subMenu) {
                    $scope.lastSubmenu = item;
                }
            }
            $scope.lang = function (lang) {
                langFac.setLang(lang).then(function (promise) {
                    if (promise.data.success) {
                        $rootScope.currentLanguage = promise.data.lang;
                        $scope.navItems = i18nFilter("GENERAL.NAV");
                    }
                });
            }
            */
        }]

})(angular);
},{}],3:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$rootScope',
        function ($rootScope) {

            return function (input, param) {
                var translations = {
                    "es-MX": require('./lang.locale.es-MX'),
                    "en-US": require('./lang.locale.en-US')
                };
                var currentLanguage = $rootScope.currentLanguage || 'es-MX',
                    keys = input.split('.'),
                    data = translations[currentLanguage],
                    value = undefined;
                try {
                    for (var key in keys) {
                        data = data[keys[key]];
                    }
                    if (!!data) {
                        return (typeof param === "undefined") ? data : data.replace('@@', param);
                    } else {
                        return input;
                    }
                }
                catch (e) {
                    console.log(e.description);
                    return input;
                }

            }
        }];
})(angular);
},{"./lang.locale.en-US":4,"./lang.locale.es-MX":5}],4:[function(require,module,exports){
module.exports = {
                "GENERAL":{
                    "NAV":[
                        {"name":"Home","url":"#/home"},
                        {"name":"Clientes","url":"#/client","subMenu": 
                         [
                             {"name": "Agregar","url": "#/client/add"}
                         ]
                        },
                        {"name":"Products","url":"#/product","subMenu": 
                         [
                             {"name": "Add","url": "#/product/add"}
                         ]
                        },
                        {"name":"Work Orders","url":"#/wo","subMenu": 
                         [
                             {"name": "Add","url": "#/wo/add"}
                         ]
                        },
                        {"name":"Users","url":"#/user","subMenu": 
                         [
                             {"name": "Add","url": "#/user/add"}
                         ]
                        },
                        {"name":"Login","url":"#/"},
                        {"name":"Reports","url":"#/reports","subMenu": 
                         [
                            {"name": "sub1","url": "../login"},
                            {"name": "sub2","url": "../login"},
                            {"name": "sub3","url": "../login"}
                         ]
                        }
                    ],
                    "BUTTONS":{
                        "EDIT":"Edit",
                        "DUPLICATE":"Duplicate",
                        "WO":"Work Order",
                    },
                    "SUBMIT":"Submit",
                    "COPYRIGHT":"©2014 Grupo Grafico de México S.A. de C.V. All rights reserved."
                },
                "HOME":{
                    "TITLE" : "Home",
                    "WELCOME" : "Welcome @@!"
                },
                "CLIENT":{
                    "TITLE" : "Clientes",
                    "FIELDS":{
                        "CL_ID":"Client ID",
                        "CL_CORPORATENAME":"Corporate Name",
                        "CL_TIN":"TIN",
                        "CL_NAME":"Name",
                        "CL_FATHERSLASTNAME":"Fathers Lastname",
                        "CL_MOTHERSLASTNAME":"Mothers Lastname",
                        "CL_STREET":"Street",
                        "CL_STREETNUMBER":"Street Number",
                        "CL_SUITENUMBER":"Suite Number",
                        "CL_NEIGHBORHOOD":"Neighborhood",
                        "CL_ADDRESSREFERENCE":"Address Reference",
                        "CL_COUNTRY":"Country",
                        "CL_STATE":"State",
                        "CL_CITY":"City",
                        "CL_COUNTY":"County",
                        "CL_ZIPCODE":"Zip Code",
                        "CL_EMAIL":"E-mail",
                        "CL_PHONE":"Phone",
                        "CL_MOBILE":"Mobile",
                        "CL_CREDITLIMIT":"Credit Limit",
                        "CL_CUSTOMERDISCOUNT":"Discount",
                        "CL_STATUS":"Status",
                    }
                },
                "CLIENT_ADD":{
                    "TITLE" : "Add Client",
                },
                "CLIENT_UPDATE":{
                    "TITLE" : "Update Client",
                },
                "USER":{
                    "TITLE" : "Users",
                    "FIELDS":{
                        "US_ID": "User ID",
                        "GR_ID": "Group ID",
                        "US_USER": "User",
                        "US_PASSWORD": "Password",
                        "US_NAME": "Name",
                        "US_FATHERSLASTNAME": "Fathers Lastname",
                        "US_MOTHERSLASTNAME": "Mothers Lastname",
                        "US_EMAIL": "E-mail",
                        "US_PHONE": "Phone",
                        "US_MOBILE": "Mobile",
                        "US_STATUS": "Status",
                        "US_DATE": "Date"
                    }
                },
                "USER_ADD":{
                    "TITLE" : "Add User",
                },
                "USER_UPDATE":{
                    "TITLE" : "Update User",
                },
                "WO":{
                    "TITLE" : "Work Orders",
                    "FIELDS":{
                        "WO_ID" : "Order No.",
                        "WO_DATE" : "Date",
                        "CL_ID" : "Client ID",
                        "ZO_ID" : "Zone ID",
                        "WO_ORDEREDBY" : "Ordered By",
                        "WO_ATTENTION" : "Attention",
                        "WO_RFQ" : "RFQ",
                        "WO_PROCESS" : "Process",
                        "WO_RELEASE" : "Release",
                        "WO_PO" : "Purchase Order",
                        "WO_LINE" : "Line",
                        "WO_LINETOTAL" : "Total Lines",
                        "PRSE_ID" : "Product ID",
                        "WO_STATUS" : "Status",
                        "WO_COMMITMENTDATE" : "Commitment Date",
                        "WO_PREVIOUSID" : "Previous ID",
                        "WO_PREVIOUSDATE" : "Previous Date",
                        "SH_ID" : "Shipment ID",
                        "SH_DATE" : "Shipment Date",
                        "WO_TRACKINGNO" : "Tracking No.",
                        "WO_SHIPPINGDATE" : "Shipping Date",
                        "WO_DELIVERYDATE" : "Delivery Date",
                        "WO_INVOICENO" : "Invoice No.",
                        "WO_INVOICEDATE" : "Invoice Date",
                        "WO_NOTES" : "Notes"
                    }
                },
                "WO_ADD":{
                    "TITLE" : "Add Work Order",
                },
                "WO_UPDATE":{
                    "TITLE" : "Update Work Order",
                },
                "AUTH":{
                    "TITLE" : "Login",
                    "ENTERPRISE" : "Enterprise",
                    "USER" : "User",
                    "PASSWORD" : "Password",
                }
            }
},{}],5:[function(require,module,exports){
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
},{"../../modules/auth/lang.es-MX":6,"../../modules/client/lang.custom.es-MX":10,"../../modules/client/lang.es-MX":11,"../../modules/client/modules/client.add/lang.es-MX":15,"../../modules/client/modules/client.update/lang.es-MX":19,"../../modules/home/lang.es-MX":23,"../../modules/ink/lang.es-MX":27,"../../modules/ink/modules/ink.add/lang.es-MX":31,"../../modules/ink/modules/ink.update/lang.es-MX":35,"../../modules/machine/lang.es-MX":39,"../../modules/machine/modules/machine.add/lang.es-MX":43,"../../modules/machine/modules/machine.update/lang.es-MX":47,"../../modules/paper/lang.es-MX":51,"../../modules/paper/modules/paper.add/lang.es-MX":53,"../../modules/paper/modules/paper.update/lang.es-MX":57,"../../modules/product/lang.es-MX":63,"../../modules/product/modules/productOffsetGeneral.add/lang.es-MX":65,"../../modules/product/modules/productOffsetGeneral.update/lang.es-MX":69,"../../modules/product/modules/productOffsetPaginated.add/lang.es-MX":73,"../../modules/supplier/lang.es-MX":79,"../../modules/supplier/modules/supplier.add/lang.es-MX":81,"../../modules/supplier/modules/supplier.update/lang.es-MX":85,"../../modules/user/lang.es-MX":91,"../../modules/user/modules/user.add/lang.es-MX":93,"../../modules/user/modules/user.profile/lang.es-MX":97,"../../modules/user/modules/user.update/lang.es-MX":100,"../../modules/wo/lang.es-MX":106,"../../modules/wo/modules/wo.add/lang.es-MX":108,"../../modules/wo/modules/wo.update/lang.es-MX":115,"../../modules/zone/lang.es-MX":121,"../../modules/zone/modules/zone.add/lang.es-MX":123,"../../modules/zone/modules/zone.update/lang.es-MX":127}],6:[function(require,module,exports){
module.exports = {
                    "title" : "iniciar sesión",
                    "enterprise" : "empresa",
                    "user" : "usuario",
                    "password" : "contraseña",
                }
},{}],7:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'clientFac', '$location', 'i18nFilter',
        function ($scope, clientFac, $location, i18nFilter) {
            $scope.fmData = {};
            $scope.labels = Object.keys(i18nFilter("client.labels"));
            $scope.columns = i18nFilter("client.columns");
        
            // formatItem event handler
            var cl_id;
            $scope.formatItem = function (s, e, cell) {

                if (e.panel.cellType == wijmo.grid.CellType.RowHeader) {
                    e.cell.textContent = e.row + 1;
                }

                s.rows.defaultSize = 30;
            
                // add Bootstrap html
                if ((e.panel.cellType == wijmo.grid.CellType.Cell) && (e.col == 0)) {
                    cl_id = e.panel.getCellData(e.row, 1, false);
                    e.cell.style.overflow = 'visible';
                    e.cell.innerHTML = '<div class="btn-group btn-group-justified" role="group" aria-label="...">\
                                        <div class="btn-group" role="group">\
                                            <a href="#/client/update/'+ cl_id + '" class="btn btn-default btn-xs" ng-click="edit($item.cl_id)">' + i18nFilter("general.labels.edit") + '</a>\
                                        </div>\
                                        <div class="btn-group">\
                                          <button type="button" class="btn btn-default  btn-xs dropdown-toggle" data-toggle="dropdown" aria-expanded="false">\
                                            '+ i18nFilter("general.labels.add") + ' <span class="caret"></span>\
                                          </button>\
                                          <ul class="dropdown-menu" role="menu">\
                                            <li><a href="#/wo/add/'+ cl_id + '"><span class="glyphicon glyphicon-th-large" aria-hidden="true"></span> Orden</a></li>\
                                            <li><a href="#/product/add/" data-toggle="modal" data-target="#myModal" data-cl_id="'+ cl_id + '"><span class="glyphicon glyphicon-barcode" aria-hidden="true"></span> Producto</a></li>\
                                            <li><a href="#/quote/add/'+ cl_id + '"><span class="glyphicon glyphicon-file" aria-hidden="true"></span> Cotizacion</a></li>\
                                            <li><a href="#/zone/add/'+ cl_id + '"><span class="glyphicon glyphicon-map-marker" aria-hidden="true"></span> Zona</a></li>\
                                            <li><a href="#/email/add/'+ cl_id + '"><span class="glyphicon glyphicon-envelope" aria-hidden="true"></span> Correo</a></li>\
                                          </ul>\
                                        </div>\
                                        <div class="btn-group">\
                                          <button type="button" class="btn btn-default  btn-xs dropdown-toggle" data-toggle="dropdown" aria-expanded="false">\
                                            '+ i18nFilter("general.labels.show") + ' <span class="caret"></span>\
                                          </button>\
                                          <ul class="dropdown-menu" role="menu">\
                                            <li><a href="#/wo/'+ cl_id + '"><span class="glyphicon glyphicon-list-alt" aria-hidden="true"></span> Ordenes</a></li>\
                                            <li><a href="#/product/'+ cl_id + '"><span class="glyphicon glyphicon-list-alt" aria-hidden="true"></span> Productos</a></li>\
                                            <li><a href="#/quote/'+ cl_id + '"><span class="glyphicon glyphicon-list-alt" aria-hidden="true"></span> Cotizaciones</a></li>\
                                            <li><a href="#/zone/'+ cl_id + '"><span class="glyphicon glyphicon-list-alt" aria-hidden="true"></span> Zonas</a></li>\
                                            <li><a href="#/email/'+ cl_id + '"><span class="glyphicon glyphicon-list-alt" aria-hidden="true"></span> Correos</a></li>\
                                          </ul>\
                                        </div>\
                                    </div>';
                }
            }
        
            // bind columns when grid is initialized
            $scope.initGrid = function (s, e) {
                for (var i = 0; i < $scope.labels.length; i++) {
                    var col = new wijmo.grid.Column();
                    col.binding = $scope.columns[i];
                    col.header = i18nFilter("client.labels." + $scope.labels[i]);
                    col.wordWrap = false;
                    col.width = 150;
                    s.columns.push(col);
                }
            };
            // create the tooltip object
            $scope.$watch('ggGrid', function () {
                if ($scope.ggGrid) {
                    
                    // store reference to grid
                    var flex = $scope.ggGrid;

                    // create tooltip
                    var tip = new wijmo.Tooltip(),
                        rng = null;

                    // monitor the mouse over the grid
                    flex.hostElement.addEventListener('mousemove', function (evt) {
                        var ht = flex.hitTest(evt);
                        if (!ht.cellRange.equals(rng)) {

                            // new cell selected, show tooltip
                            if (ht.cellType == wijmo.grid.CellType.Cell) {
                                rng = ht.cellRange;
                                var col = flex.columns[rng.col].header;
                                var cellElement = document.elementFromPoint(evt.clientX, evt.clientY),
                                    cellBounds = wijmo.Rect.fromBoundingRect(cellElement.getBoundingClientRect()),
                                    data = wijmo.escapeHtml(flex.getCellData(rng.row, rng.col, true)),
                                    tipContent = col + ': "<b>' + data + '</b>"';
                                if (cellElement.className.indexOf('wj-cell') > -1) {
                                    tip.show(flex.hostElement, tipContent, cellBounds);
                                } else {
                                    tip.hide(); // cell must be behind scroll bar...
                                }
                            }
                        }
                    });
                    flex.hostElement.addEventListener('mouseout', function () {
                        tip.hide();
                        rng = null;
                    });
                }
            });

            $('#myModal').on('show.bs.modal', function (event) {
                var button = $(event.relatedTarget); // Button that triggered the modal
                $scope.current_id = button.data('cl_id'); // Extract info from data-* attributes
                $scope.fmData.pr_process = undefined;
                $scope.fmData.pr_type = undefined;
                $scope.$apply();
            })

            $scope.redirect = function (url) {
                $('#myModal').modal('hide');
                $location.path(url);
            }

            $scope.pr_processoptions = i18nFilter("client-custom.fields.pr_processoptions");

            $scope.$watch('fmData.pr_process', function (newValue, oldValue) {
                $scope.fmData.pr_type = undefined;
                angular.forEach($scope.pr_processoptions, function (obj, key) {
                    if (newValue == obj.value) {
                        $scope.pr_typeoptions = obj.types;
                    }
                });
            });

            $scope.$on('$viewContentLoaded', function () {
                // this code is executed after the view is loaded
                $scope.loading = true;
                clientFac.data().then(function (promise) {
                    $scope.loading = false;
                    if (angular.isArray(promise.data)) {
                        $scope.data = new wijmo.collections.CollectionView(promise.data);
                    }
                });
            });
        }];
    
})(angular);
},{}],8:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q', '$alerts', function ($http, $q, $alerts) {
        var factory = {};
        factory.data = function () {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('http://localhost:3000/client/', {
                    /* POST variables here */
                    procces_id: new Date().getMilliseconds()
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    var stackError = JSON.stringify({
                        status: data.status,
                        error: data.error,
                        errorType: data.type,
                        config: config
                    }, null, 4);
                    $alerts.error('Wooops! an error has ocurred.', stackError);
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        return factory;
    }];

})(angular);
},{}],9:[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    //comment

    return angular.module('app.client',[
        require('./modules/client.add').name,
        require('./modules/client.update').name
    ])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('client', {
            url:'/client',
            templateUrl : 'modules/client/client.view.html',
            controller : 'clientCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('clientFac',require('./client.fac'))

    .controller('clientCtrl',require('./client.ctrl'))
    
})(angular);

},{"./client.ctrl":7,"./client.fac":8,"./modules/client.add":14,"./modules/client.update":18}],10:[function(require,module,exports){
module.exports = {
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
                }
},{}],11:[function(require,module,exports){
module.exports = {
                    "title" : "clientes",
                    "labels":{
                        "cl-id":"id cliente",
                        "cl-type":"Tipo de Cliente",
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
                        "cl_type",
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
                        cl_typeoptions : [
                            {"label":"Fisica","value":"natural"},
                            {"label":"Moral","value":"legal"}
                        ]
                     }
                }
},{}],12:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'clientAddFac', '$location', 'i18nFilter', '$interval',
        function ($scope, clientAddFac, $location, i18nFilter, $interval) {
            $scope.fmData = {};
            $scope.fmData = { "cl_type": "natural", "cl_tin": "SABG-830106-ACA", "cl_name": "Gaspar Alejandro", "cl_fatherslastname": "Sanchez", "cl_motherslastname": "Betancourt", "cl_country": 3996063, "cl_state": 4014336, "cl_city": 8581816, "cl_county": 8581816, "cl_street": "AV GUADALUPE", "cl_streetnumber": "6877", "cl_suitenumber": "81", "cl_neighborhood": "PLAZA GUADALUPE", "cl_zipcode": "45036", "cl_addressreference": "FRIDA KHALO Y AV GUADALUPE", "cl_email": "alejandrolsca@gmail.com", "cl_phone": "3337979135", "cl_mobile": "+5213310112576", "cl_creditlimit": "10000.00", "cl_customerdiscount": "0.10", "cl_status": "A" }

            $scope.onSubmit = function () {

                clientAddFac.add($scope.fmData).then(function (promise) {
                    if (promise.data.rowCount === 1) {
                        $location.path('/client');
                    } else {
                        $scope.updateFail = true;
                    }
                });
            };

            $scope.getStates = function () {
                $scope.cl_stateoptions = [];
                $scope.cl_cityoptions = [];
                $scope.cl_countyoptions = [];
                $interval(function () {
                    clientAddFac.getStates($scope.fmData.cl_country).then(function (promise) {
                        if (angular.isArray(promise.data.geonames)) {
                            $scope.cl_stateoptions = promise.data.geonames;
                        } else {
                            //$scope.updateFail = true;
                        }
                    });
                }, 0, 1);
            }

            $scope.getCityCounty = function () {
                $scope.cl_cityoptions = [];
                $scope.cl_countyoptions = [];
                $interval(function () {
                    clientAddFac.getStates($scope.fmData.cl_state).then(function (promise) {
                        if (angular.isArray(promise.data.geonames)) {
                            $scope.cl_cityoptions = promise.data.geonames;
                            $scope.cl_countyoptions = promise.data.geonames;
                        } else {
                            //$scope.updateFail = true;
                        }
                    });
                }, 0, 1);
            };

            $scope.cl_statusoptions = i18nFilter("client.fields.cl_statusoptions");
            $scope.cl_typeoptions = i18nFilter("client.fields.cl_typeoptions");
            
            $scope.$on('$viewContentLoaded', function () {
                // this code is executed after the view is loaded
            
                clientAddFac.getCountries().then(function (promise) {
                    if (angular.isArray(promise.data.geonames)) {
                        $scope.cl_countryoptions = promise.data.geonames;
                    } else {
                        //$scope.updateFail = true;
                    }
                });

            });
        }];

})(angular);
},{}],13:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q', '$alerts', '$stateParams', function ($http, $q, $alerts, $stateParams) {
        var factory = {};
        factory.add = function (cl_jsonb) {
            var promise = $http.post('/client/add', {
                /* POST variables here */
                cl_jsonb: cl_jsonb
            }).success(function (data, status, headers, config) {
                return data;
            }).error(function (data, status, headers, config) {
                var stackError = JSON.stringify({
                        status: data.status,
                        error: data.error,
                        errorType: data.type,
                        config: config
                    }, null, 4);
                    $alerts.error('Wooops! an error has ocurred.', stackError);
                    return { "status": false };
            });
            return promise;
        };
        factory.getCountries = function () {
            var promise = $http.jsonp('http://api.geonames.org/countryInfoJSON?username=alejandrolsca&callback=JSON_CALLBACK')
                .success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    var stackError = JSON.stringify({
                        status: data.status,
                        error: data.error,
                        errorType: data.type,
                        config: config
                    }, null, 4);
                    $alerts.error('Wooops! an error has ocurred.', stackError);
                    return { "status": false };
                });
            return promise;
        };
        factory.getStates = function (cl_country) {
            var promise = $http.jsonp('http://api.geonames.org/childrenJSON?geonameId=' + cl_country + '&username=alejandrolsca&callback=JSON_CALLBACK')
                .success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    var stackError = JSON.stringify({
                        status: data.status,
                        error: data.error,
                        errorType: data.type,
                        config: config
                    }, null, 4);
                    $alerts.error('Wooops! an error has ocurred.', stackError);
                    return { "status": false };
                });
            return promise;
        };
        factory.getCityCounty = function (cl_state) {
            var promise = $http.jsonp('http://api.geonames.org/childrenJSON?geonameId=' + cl_state + '&username=alejandrolsca&callback=JSON_CALLBACK')
                .success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    var stackError = JSON.stringify({
                        status: data.status,
                        error: data.error,
                        errorType: data.type,
                        config: config
                    }, null, 4);
                    $alerts.error('Wooops! an error has ocurred.', stackError);
                    return { "status": false };
                });
            return promise;
        };
        return factory;
    }];

})(angular);
},{}],14:[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.client.add',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('clientAdd', {
            url:'/client/add',
            templateUrl : 'modules/client/modules/client.add/client.add.view.html',
            controller : 'clientAddCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('clientAddFac',require('./client.add.fac'))

    .controller('clientAddCtrl',require('./client.add.ctrl'))

})(angular);
},{"./client.add.ctrl":12,"./client.add.fac":13}],15:[function(require,module,exports){
module.exports = {
                    "title" : "agregar cliente",
                }
},{}],16:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'clientUpdateFac', '$location', 'i18nFilter', '$interval',
        function ($scope, clientUpdateFac, $location, i18nFilter, $interval) {

            $scope.onSubmit = function () {

                clientUpdateFac.update($scope.fmData).then(function (promise) {
                    if (promise.data.rowCount === 1) {
                        $location.path('/client');
                    } else {
                        $scope.updateFail = true;
                    }
                });
            };

            $scope.getStates = function () {
                $scope.cl_stateoptions = [];
                $scope.cl_cityoptions = [];
                $scope.cl_countyoptions = [];
                $interval(function () {
                    clientUpdateFac.getStates($scope.fmData.cl_country).then(function (promise) {
                        if (angular.isArray(promise.data.geonames)) {
                            $scope.cl_stateoptions = promise.data.geonames;
                        } else {
                            //$scope.updateFail = true;
                        }
                    });
                }, 0, 1);
            }

            $scope.getCityCounty = function () {
                $scope.cl_cityoptions = [];
                $scope.cl_countyoptions = [];
                $interval(function () {
                    clientUpdateFac.getStates($scope.fmData.cl_state).then(function (promise) {
                        if (angular.isArray(promise.data.geonames)) {
                            $scope.cl_cityoptions = promise.data.geonames;
                            $scope.cl_countyoptions = promise.data.geonames;
                        } else {
                            //$scope.updateFail = true;
                        }
                    });
                }, 0, 1);
            }

            $scope.cl_statusoptions = i18nFilter("client.fields.cl_statusoptions");
            $scope.cl_typeoptions = i18nFilter("client.fields.cl_typeoptions");

            $scope.$on('$viewContentLoaded', function () {
                // this code is executed after the view is loaded
                $scope.loading = true;
                clientUpdateFac.data().then(function (promise) {
                    $scope.loading = false;
                    if (angular.isArray(promise.data) && promise.data.length === 1) {
                        $scope.fmData = promise.data[0].cl_jsonb;
                    }
                }).then(function () {
                    clientUpdateFac.getCountries().then(function (promise) {
                        if (angular.isArray(promise.data.geonames)) {
                            $scope.cl_countryoptions = promise.data.geonames;
                        } else {
                            //$scope.updateFail = true;
                        }
                    }).then(function () {
                        clientUpdateFac.getStates($scope.fmData.cl_country).then(function (promise) {
                            if (angular.isArray(promise.data.geonames)) {
                                $scope.cl_stateoptions = promise.data.geonames;
                            } else {
                                //$scope.updateFail = true;
                            }
                        })
                    }).then(function () {
                        clientUpdateFac.getCityCounty($scope.fmData.cl_state).then(function (promise) {
                            if (angular.isArray(promise.data.geonames)) {
                                $scope.cl_cityoptions = promise.data.geonames;
                                $scope.cl_countyoptions = promise.data.geonames;
                            } else {
                                //$scope.updateFail = true;
                            }
                        })
                    });
                });

            });
        }];

})(angular);
},{}],17:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q', '$alerts', '$stateParams', function ($http, $q, $alerts, $stateParams) {
        var factory = {};
        factory.data = function () {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/client/cl_id', {
                    /* POST variables here */
                    cl_id: $stateParams.cl_id
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    var stackError = JSON.stringify({
                        status: data.status,
                        error: data.error,
                        errorType: data.type,
                        config: config
                    }, null, 4);
                    $alerts.error('Wooops! an error has ocurred.', stackError);
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        factory.update = function (cl_jsonb) {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/client/update', {
                    /* POST variables here */
                    cl_id: $stateParams.cl_id,
                    cl_jsonb: cl_jsonb
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    var stackError = JSON.stringify({
                        status: data.status,
                        error: data.error,
                        errorType: data.type,
                        config: config
                    }, null, 4);
                    $alerts.error('Wooops! an error has ocurred.', stackError);
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        factory.getCountries = function () {
            var promise = $http.jsonp('http://api.geonames.org/countryInfoJSON?username=alejandrolsca&callback=JSON_CALLBACK')
                .success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    var stackError = JSON.stringify({
                        status: data.status,
                        error: data.error,
                        errorType: data.type,
                        config: config
                    }, null, 4);
                    $alerts.error('Wooops! an error has ocurred.', stackError);
                    return { "status": false };
                });
            return promise;
        };
        factory.getStates = function (cl_country) {
            var promise = $http.jsonp('http://api.geonames.org/childrenJSON?geonameId=' + cl_country + '&username=alejandrolsca&callback=JSON_CALLBACK')
                .success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    var stackError = JSON.stringify({
                        status: data.status,
                        error: data.error,
                        errorType: data.type,
                        config: config
                    }, null, 4);
                    $alerts.error('Wooops! an error has ocurred.', stackError);
                    return { "status": false };
                });
            return promise;
        };
        factory.getCityCounty = function (cl_state) {
            var promise = $http.jsonp('http://api.geonames.org/childrenJSON?geonameId=' + cl_state + '&username=alejandrolsca&callback=JSON_CALLBACK')
                .success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    var stackError = JSON.stringify({
                        status: data.status,
                        error: data.error,
                        errorType: data.type,
                        config: config
                    }, null, 4);
                    $alerts.error('Wooops! an error has ocurred.', stackError);
                    return { "status": false };
                });
            return promise;
        };
        return factory;
    }];

})(angular);
},{}],18:[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.client.update',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('clientUpdate', {
            url:'/client/update/:cl_id',
            templateUrl : 'modules/client/modules/client.update/client.update.view.html',
            controller : 'clientUpdateCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('clientUpdateFac',require('./client.update.fac'))

    .controller('clientUpdateCtrl',require('./client.update.ctrl'))

})(angular);
},{"./client.update.ctrl":16,"./client.update.fac":17}],19:[function(require,module,exports){
module.exports = {
                    "title" : "actualizar cliente",
                }
},{}],20:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'homeFac', 'auth',
        function ($scope, homeFac, auth) {
            $scope.auth = auth;
        }];

})(angular);
},{}],21:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q', '$alerts', function ($http, $q, $alerts) {
        var factory = {};
        factory.getLogin = function (user) {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('modules/home/homeModel.php', {
                    /* POST variables here */
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    var stackError = JSON.stringify({
                        status: data.status,
                        error: data.error,
                        errorType: data.type,
                        config: config
                    }, null, 4);
                    $alerts.error('Wooops! an error has ocurred.', stackError);
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        return factory;
    }];

})(angular);
},{}],22:[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.home',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('home', {
            url:'/home',
            templateUrl : 'modules/home/home.view.html',
            controller : 'homeCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('homeFac',require('./home.fac'))

    .controller('homeCtrl',require('./home.ctrl'))

})(angular);
},{"./home.ctrl":20,"./home.fac":21}],23:[function(require,module,exports){
module.exports = {
                    "title" : "inicio",
                    "welcome" : "bienvenido @@!"
                }
},{}],24:[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.ink',[
        require('./modules/ink.add').name,
        require('./modules/ink.update').name
    ])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('ink', {
            url:'/ink',
            templateUrl : 'modules/ink/ink.view.html',
            controller : 'inkCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('inkFac',require('./ink.fac'))

    .controller('inkCtrl',require('./ink.ctrl'))
    
})(angular);

},{"./ink.ctrl":25,"./ink.fac":26,"./modules/ink.add":28,"./modules/ink.update":32}],25:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'inkFac', 'i18nFilter',
        function ($scope, inkFac, i18nFilter) {

            $scope.labels = Object.keys(i18nFilter("ink.labels"));
            $scope.columns = i18nFilter("ink.columns");
        
            // formatItem event handler
            var in_id;
            $scope.formatItem = function (s, e, cell) {

                if (e.panel.cellType == wijmo.grid.CellType.RowHeader) {
                    e.cell.textContent = e.row + 1;
                }

                s.rows.defaultSize = 30;
            
                // add Bootstrap html
                if ((e.panel.cellType == wijmo.grid.CellType.Cell) && (e.col == 0)) {
                    in_id = e.panel.getCellData(e.row, 1, false);
                    e.cell.style.overflow = 'visible';
                    e.cell.innerHTML = '<div class="btn-group btn-group-justified" role="group" aria-label="...">\
                                        <div class="btn-group" role="group">\
                                            <a href="#/ink/update/'+ in_id + '" class="btn btn-default btn-xs" ng-click="edit($item.in_id)">Editar</a>\
                                        </div>\
                                    </div>';
                }
            }
        
            // bind columns when grid is initialized
            $scope.initGrid = function (s, e) {
                for (var i = 0; i < $scope.labels.length; i++) {
                    var col = new wijmo.grid.Column();
                    col.binding = $scope.columns[i];
                    col.header = i18nFilter("ink.labels." + $scope.labels[i]);
                    col.wordWrap = false;
                    col.width = 150;
                    s.columns.push(col);
                }
            };
            // create the tooltip object
            $scope.$watch('ggGrid', function () {
                if ($scope.ggGrid) {
                    
                    // store reference to grid
                    var flex = $scope.ggGrid;

                    // create tooltip
                    var tip = new wijmo.Tooltip(),
                        rng = null;

                    // monitor the mouse over the grid
                    flex.hostElement.addEventListener('mousemove', function (evt) {
                        var ht = flex.hitTest(evt);
                        if (!ht.cellRange.equals(rng)) {

                            // new cell selected, show tooltip
                            if (ht.cellType == wijmo.grid.CellType.Cell) {
                                rng = ht.cellRange;
                                var col = flex.columns[rng.col].header;
                                var cellElement = document.elementFromPoint(evt.clientX, evt.clientY),
                                    cellBounds = wijmo.Rect.fromBoundingRect(cellElement.getBoundingClientRect()),
                                    data = wijmo.escapeHtml(flex.getCellData(rng.row, rng.col, true)),
                                    tipContent = col + ': "<b>' + data + '</b>"';
                                if (cellElement.className.indexOf('wj-cell') > -1) {
                                    tip.show(flex.hostElement, tipContent, cellBounds);
                                } else {
                                    tip.hide(); // cell must be behind scroll bar...
                                }
                            }
                        }
                    });
                    flex.hostElement.addEventListener('mouseout', function () {
                        tip.hide();
                        rng = null;
                    });
                }
            });

            $scope.$on('$viewContentLoaded', function () {
                // this code is executed after the view is loaded
                $scope.loading = true;
                inkFac.data().then(function (promise) {
                    $scope.loading = false;
                    if (angular.isArray(promise.data)) {
                        $scope.data = new wijmo.collections.CollectionView(promise.data);
                    }
                });
            });
        }];

})(angular);
},{}],26:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q', '$alerts', function ($http, $q, $alerts) {
        var factory = {};
        factory.data = function () {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('modules/ink/ink.mdl.getinks.php', {
                    /* POST variables here */
                    procces_id: new Date().getMilliseconds()
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    var stackError = JSON.stringify({
                        status: data.status,
                        error: data.error,
                        errorType: data.type,
                        config: config
                    }, null, 4);
                    $alerts.error('Wooops! an error has ocurred.', stackError);
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        return factory;
    }];

})(angular);
},{}],27:[function(require,module,exports){
module.exports = {
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
                }
},{}],28:[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.ink.add',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('inkAdd', {
            url:'/ink/add',
            templateUrl : 'modules/ink/modules/ink.add/ink.add.view.html',
            controller : 'inkAddCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('inkAddFac',require('./ink.add.fac'))

    .controller('inkAddCtrl',require('./ink.add.ctrl'))

})(angular);
},{"./ink.add.ctrl":29,"./ink.add.fac":30}],29:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'inkAddFac', '$location', 'i18nFilter',
        function ($scope, inkAddFac, $location, i18nFilter) {
            $scope.fmData = {};

            $scope.onSubmit = function () {

                inkAddFac.add($scope.fmData).then(function (promise) {
                    if (promise.data == "1") {
                        $location.path('/ink');
                    } else {
                        $scope.updateFail = true;
                    }
                });
            };

            $scope.in_statusoptions = i18nFilter("ink.fields.in_statusoptions");
            $scope.in_typeoptions = i18nFilter("ink.fields.in_typeoptions");

            $scope.$on('$viewContentLoaded', function () {
                // this code is executed after the view is loaded
            
                inkAddFac.getSuppliers().then(function (promise) {
                    if (angular.isArray(promise.data)) {
                        $scope.su_idoptions = [];
                        angular.forEach(promise.data, function (value, key) {
                            this.push({ "label": value.su_corporatename, "value": value.su_id });
                        }, $scope.su_idoptions);
                    } else {
                        //$scope.updateFail = true;
                    }
                });

            });
        }];

})(angular);
},{}],30:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q', '$alerts', '$stateParams', function ($http, $q, $alerts, $stateParams) {
        var factory = {};
        factory.add = function (in_jsonb) {
            var promise = $http.post('modules/ink/modules/ink.add/ink.add.mdl.add.php', {
                /* POST variables here */
                in_jsonb: in_jsonb
            }).success(function (data, status, headers, config) {
                return data;
            }).error(function (data, status, headers, config) {
                var stackError = JSON.stringify({
                        status: data.status,
                        error: data.error,
                        errorType: data.type,
                        config: config
                    }, null, 4);
                    $alerts.error('Wooops! an error has ocurred.', stackError);
                    return { "status": false };
            });
            return promise;
        };
        factory.getSuppliers = function () {
            var promise = $http.get('modules/ink/modules/ink.add/ink.add.mdl.getSuppliers.php')
                .success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    var stackError = JSON.stringify({
                        status: data.status,
                        error: data.error,
                        errorType: data.type,
                        config: config
                    }, null, 4);
                    $alerts.error('Wooops! an error has ocurred.', stackError);
                    return { "status": false };
                });
            return promise;
        };
        return factory;
    }];

})(angular);
},{}],31:[function(require,module,exports){
module.exports = {
                    "title" : "agregar tinta",
                }
},{}],32:[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.ink.update',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('inkUpdate', {
            url:'/ink/update/:in_id',
            templateUrl : 'modules/ink/modules/ink.update/ink.update.view.html',
            controller : 'inkUpdateCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('inkUpdateFac',require('./ink.update.fac'))

    .controller('inkUpdateCtrl',require('./ink.update.ctrl'))

})(angular);
},{"./ink.update.ctrl":33,"./ink.update.fac":34}],33:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'inkUpdateFac', '$location', 'i18nFilter',
        function ($scope, inkUpdateFac, $location, i18nFilter) {

            $scope.onSubmit = function () {

                inkUpdateFac.update($scope.fmData).then(function (promise) {
                    if (promise.data == "1") {
                        $location.path('/ink');
                    } else {
                        $scope.updateFail = true;
                    }
                });
            };

            $scope.in_statusoptions = i18nFilter("ink.fields.in_statusoptions");
            $scope.in_typeoptions = i18nFilter("ink.fields.in_typeoptions");

            $scope.$on('$viewContentLoaded', function () {
                // this code is executed after the view is loaded
                $scope.loading = true;
                inkUpdateFac.data().then(function (promise) {
                    $scope.loading = false;
                    if (angular.isObject(angular.fromJson(promise.data))) {
                        $scope.fmData = angular.fromJson(promise.data);
                    }
                }).then(function () {
                    inkUpdateFac.getSuppliers().then(function (promise) {
                        if (angular.isArray(promise.data)) {
                            $scope.su_idoptions = [];
                            angular.forEach(promise.data, function (value, key) {
                                this.push({ "label": value.su_corporatename, "value": value.su_id });
                            }, $scope.su_idoptions);
                        } else {
                            //$scope.updateFail = true;
                        }
                    });
                });

            });
        }];

})(angular);
},{}],34:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q', '$alerts', '$stateParams', function ($http, $q, $alerts, $stateParams) {
        var factory = {};
        factory.data = function () {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('modules/ink/modules/ink.update/ink.update.mdl.getink.php', {
                    /* POST variables here */
                    in_id: $stateParams.in_id
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    var stackError = JSON.stringify({
                        status: data.status,
                        error: data.error,
                        errorType: data.type,
                        config: config
                    }, null, 4);
                    $alerts.error('Wooops! an error has ocurred.', stackError);
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        factory.update = function (in_jsonb) {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('modules/ink/modules/ink.update/ink.update.mdl.update.php', {
                    /* POST variables here */
                    in_id: $stateParams.in_id,
                    in_jsonb: in_jsonb
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    var stackError = JSON.stringify({
                        status: data.status,
                        error: data.error,
                        errorType: data.type,
                        config: config
                    }, null, 4);
                    $alerts.error('Wooops! an error has ocurred.', stackError);
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        factory.getSuppliers = function () {
            var promise = $http.get('modules/ink/modules/ink.add/ink.add.mdl.getSuppliers.php')
                .success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    var stackError = JSON.stringify({
                        status: data.status,
                        error: data.error,
                        errorType: data.type,
                        config: config
                    }, null, 4);
                    $alerts.error('Wooops! an error has ocurred.', stackError);
                    return { "status": false };
                });
            return promise;
        };
        return factory;
    }];

})(angular);
},{}],35:[function(require,module,exports){
module.exports = {
                    "title" : "actualizar tinta",
                }
},{}],36:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return angular.module('app.login', [])

        .config(['$stateProvider', '$urlRouterProvider',
            function ($stateProvider, $urlRouterProvider) {
                $stateProvider.state('login', {
                    url: '/login',
                    templateUrl: 'modules/login/login.view.html',
                    controller: 'loginCtrl',
                    data: {
                        requiresLogin: false
                    }
                });
            }])

        .controller('loginCtrl', require('./login.ctrl'))

})(angular);
},{"./login.ctrl":37}],37:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$scope', '$http', 'auth', 'store', '$location', 'jwtHelper',
        function ($scope, $http, auth, store, $location, jwtHelper) {

            var token = store.get('token');
            if (token) {
                if (!jwtHelper.isTokenExpired(token)) {
                    if (!auth.isAuthenticated) {
                        auth.authenticate(store.get('profile'), token);
                        $location.path('/home');
                    }
                    $location.path('/home');
                } else {
                    // Either show the login page or use the refresh token to get a new idToken
                    auth.signin({
                        dict: 'es',
                        icon: 'img/ggauth-logo.png',
                        username: $scope.username,
                        password: $scope.password,
                        connection: 'Username-Password-Authentication',
                        rememberLastLogin: false,
                        closable: false
                    }, function (profile, token) {
                        // Success callback
                        store.set('profile', profile);
                        store.set('token', token);
                        $location.path('/home');
                    }, function (error) {
                        console.log(error)
                        // Error callback
                    });
                }
            } else {
                auth.signin({
                    dict: 'es',
                    icon: 'img/ggauth-logo.png',
                    username: $scope.username,
                    password: $scope.password,
                    connection: 'Username-Password-Authentication',
                    rememberLastLogin: false,
                    closable: false
                }, function (profile, token) {
                    // Success callback
                    store.set('profile', profile);
                    store.set('token', token);
                    $location.path('/home');
                }, function (error) {
                    console.log(error)
                    // Error callback
                });
            }

        }]

})(angular);
},{}],38:[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.machine',[
        require('./modules/machine.add').name,
        require('./modules/machine.update').name
    ])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('machine', {
            url:'/machine',
            templateUrl : 'modules/machine/machine.view.html',
            controller : 'machineCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('machineFac',require('./machine.fac'))

    .controller('machineCtrl',require('./machine.ctrl'))
    
})(angular);

},{"./machine.ctrl":40,"./machine.fac":41,"./modules/machine.add":42,"./modules/machine.update":46}],39:[function(require,module,exports){
module.exports = {
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
                }
},{}],40:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'machineFac', 'i18nFilter',
        function ($scope, machineFac, i18nFilter) {

            $scope.labels = Object.keys(i18nFilter("machine.labels"));
            $scope.columns = i18nFilter("machine.columns");
        
            // formatItem event handler
            var ma_id;
            $scope.formatItem = function (s, e, cell) {

                if (e.panel.cellType == wijmo.grid.CellType.RowHeader) {
                    e.cell.textContent = e.row + 1;
                }

                s.rows.defaultSize = 30;
            
                // add Bootstrap html
                if ((e.panel.cellType == wijmo.grid.CellType.Cell) && (e.col == 0)) {
                    ma_id = e.panel.getCellData(e.row, 1, false);
                    e.cell.style.overflow = 'visible';
                    e.cell.innerHTML = '<div class="btn-group btn-group-justified" role="group" aria-label="...">\
                                        <div class="btn-group" role="group">\
                                            <a href="#/machine/update/'+ ma_id + '" class="btn btn-default btn-xs" ng-click="edit($item.ma_id)">Editar</a>\
                                        </div>\
                                    </div>';
                }
            }
        
            // bind columns when grid is initialized
            $scope.initGrid = function (s, e) {
                for (var i = 0; i < $scope.labels.length; i++) {
                    var col = new wijmo.grid.Column();
                    col.binding = $scope.columns[i];
                    col.header = i18nFilter("machine.labels." + $scope.labels[i]);
                    col.wordWrap = false;
                    col.width = 150;
                    s.columns.push(col);
                }
            };
            // create the tooltip object
            $scope.$watch('ggGrid', function () {
                if ($scope.ggGrid) {
                    
                    // store reference to grid
                    var flex = $scope.ggGrid;

                    // create tooltip
                    var tip = new wijmo.Tooltip(),
                        rng = null;

                    // monitor the mouse over the grid
                    flex.hostElement.addEventListener('mousemove', function (evt) {
                        var ht = flex.hitTest(evt);
                        if (!ht.cellRange.equals(rng)) {

                            // new cell selected, show tooltip
                            if (ht.cellType == wijmo.grid.CellType.Cell) {
                                rng = ht.cellRange;
                                var col = flex.columns[rng.col].header;
                                var cellElement = document.elementFromPoint(evt.clientX, evt.clientY),
                                    cellBounds = wijmo.Rect.fromBoundingRect(cellElement.getBoundingClientRect()),
                                    data = wijmo.escapeHtml(flex.getCellData(rng.row, rng.col, true)),
                                    tipContent = col + ': "<b>' + data + '</b>"';
                                if (cellElement.className.indexOf('wj-cell') > -1) {
                                    tip.show(flex.hostElement, tipContent, cellBounds);
                                } else {
                                    tip.hide(); // cell must be behind scroll bar...
                                }
                            }
                        }
                    });
                    flex.hostElement.addEventListener('mouseout', function () {
                        tip.hide();
                        rng = null;
                    });
                }
            });

            $scope.$on('$viewContentLoaded', function () {
                // this code is executed after the view is loaded
                $scope.loading = true;
                machineFac.data().then(function (promise) {
                    $scope.loading = false;
                    if (angular.isArray(promise.data)) {
                        $scope.data = new wijmo.collections.CollectionView(promise.data);
                    }
                });
            });
        }];

})(angular);
},{}],41:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q', '$alerts',
        function ($http, $q, $alerts) {
            var factory = {};
            factory.data = function () {
                var deferred = $q.defer();
                deferred.resolve(
                    $http.post('modules/machine/machine.mdl.getmachines.php', {
                        /* POST variables here */
                        procces_id: new Date().getMilliseconds()
                    }).success(function (data, status, headers, config) {
                        return data;
                    }).error(function (data, status, headers, config) {
                        var stackError = JSON.stringify({
                            status: data.status,
                            error: data.error,
                            errorType: data.type,
                            config: config
                        }, null, 4);
                        $alerts.error('Wooops! an error has ocurred.', stackError);
                        return { "status": false };
                    })
                );
                return deferred.promise;
            };
            return factory;
        }];

})(angular);
},{}],42:[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.machine.add',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('machineAdd', {
            url:'/machine/add',
            templateUrl : 'modules/machine/modules/machine.add/machine.add.view.html',
            controller : 'machineAddCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('machineAddFac',require('./machine.add.fac'))

    .controller('machineAddCtrl',require('./machine.add.ctrl'))

})(angular);
},{"./machine.add.ctrl":44,"./machine.add.fac":45}],43:[function(require,module,exports){
module.exports = {
                    "title" : "agregar maquina",
                }
},{}],44:[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return ['$scope', 'machineAddFac', '$location', 'i18nFilter',
    function ($scope, machineAddFac, $location, i18nFilter) {
        $scope.fmData = {};

        $scope.onSubmit = function() {

            machineAddFac.add($scope.fmData).then(function(promise){
                if(promise.data == "1") {
                    $location.path('/machine');
                } else {
                    $scope.updateFail = true;
                }
            });
        };

        $scope.ma_sizemeasureoptions = i18nFilter("machine.fields.ma_sizemeasureoptions");
        $scope.ma_fullcoloroptions = i18nFilter("machine.fields.ma_fullcoloroptions");
        $scope.ma_printbgoptions = i18nFilter("machine.fields.ma_printbgoptions");
        $scope.ma_processoptions = i18nFilter("machine.fields.ma_processoptions");
        $scope.ma_statusoptions = i18nFilter("machine.fields.ma_statusoptions");

        $scope.$on('$viewContentLoaded', function () {
            // this code is executed after the view is loaded
            
           

         });
    }];
    
})(angular);
},{}],45:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q', '$alerts', '$stateParams',
        function ($http, $q, $alerts, $stateParams) {
            var factory = {};
            factory.add = function (ma_jsonb) {
                var promise = $http.post('modules/machine/modules/machine.add/machine.add.mdl.add.php', {
                    /* POST variables here */
                    ma_jsonb: ma_jsonb
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    var stackError = JSON.stringify({
                        status: data.status,
                        error: data.error,
                        errorType: data.type,
                        config: config
                    }, null, 4);
                    $alerts.error('Wooops! an error has ocurred.', stackError);
                    return { "status": false };
                });
                return promise;
            };
            return factory;
        }];

})(angular);
},{}],46:[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.machine.update',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('machineUpdate', {
            url:'/machine/update/:ma_id',
            templateUrl : 'modules/machine/modules/machine.update/machine.update.view.html',
            controller : 'machineUpdateCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('machineUpdateFac',require('./machine.update.fac'))

    .controller('machineUpdateCtrl',require('./machine.update.ctrl'))

})(angular);
},{"./machine.update.ctrl":48,"./machine.update.fac":49}],47:[function(require,module,exports){
module.exports = {
                    "title" : "actualizar maquina",
                }
},{}],48:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'machineUpdateFac', '$location', 'i18nFilter',
        function ($scope, machineUpdateFac, $location, i18nFilter) {

            $scope.onSubmit = function () {

                machineUpdateFac.update($scope.fmData).then(function (promise) {
                    if (promise.data == "1") {
                        $location.path('/machine');
                    } else {
                        $scope.updateFail = true;
                    }
                });
            };

            $scope.ma_sizemeasureoptions = i18nFilter("machine.fields.ma_sizemeasureoptions");
            $scope.ma_fullcoloroptions = i18nFilter("machine.fields.ma_fullcoloroptions");
            $scope.ma_printbgoptions = i18nFilter("machine.fields.ma_printbgoptions");
            $scope.ma_processoptions = i18nFilter("machine.fields.ma_processoptions");
            $scope.ma_statusoptions = i18nFilter("machine.fields.ma_statusoptions");

            $scope.$on('$viewContentLoaded', function () {
                // this code is executed after the view is loaded
                $scope.loading = true;
                machineUpdateFac.data().then(function (promise) {
                    $scope.loading = false;
                    if (angular.isObject(angular.fromJson(promise.data))) {
                        $scope.fmData = angular.fromJson(promise.data);
                    }
                });
            });
        }];

})(angular);
},{}],49:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q', '$alerts', '$stateParams', function ($http, $q, $alerts, $stateParams) {
        var factory = {};
        factory.data = function () {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('modules/machine/modules/machine.update/machine.update.mdl.getmachine.php', {
                    /* POST variables here */
                    ma_id: $stateParams.ma_id
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    var stackError = JSON.stringify({
                        status: data.status,
                        error: data.error,
                        errorType: data.type,
                        config: config
                    }, null, 4);
                    $alerts.error('Wooops! an error has ocurred.', stackError);
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        factory.update = function (ma_jsonb) {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('modules/machine/modules/machine.update/machine.update.mdl.update.php', {
                    /* POST variables here */
                    ma_id: $stateParams.ma_id,
                    ma_jsonb: ma_jsonb
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    var stackError = JSON.stringify({
                        status: data.status,
                        error: data.error,
                        errorType: data.type,
                        config: config
                    }, null, 4);
                    $alerts.error('Wooops! an error has ocurred.', stackError);
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        factory.getCountries = function () {
            var promise = $http.get('http://api.geonames.org/countryInfoJSON?username=alejandrolsca')
                .success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    var stackError = JSON.stringify({
                        status: data.status,
                        error: data.error,
                        errorType: data.type,
                        config: config
                    }, null, 4);
                    $alerts.error('Wooops! an error has ocurred.', stackError);
                    return { "status": false };
                });
            return promise;
        };
        factory.getStates = function (ma_country) {
            var promise = $http.get('http://api.geonames.org/childrenJSON?geonameId=' + ma_country + '&username=alejandrolsca')
                .success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    var stackError = JSON.stringify({
                        status: data.status,
                        error: data.error,
                        errorType: data.type,
                        config: config
                    }, null, 4);
                    $alerts.error('Wooops! an error has ocurred.', stackError);
                    return { "status": false };
                });
            return promise;
        };
        factory.getCityCounty = function (ma_state) {
            var promise = $http.get('http://api.geonames.org/childrenJSON?geonameId=' + ma_state + '&username=alejandrolsca')
                .success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    var stackError = JSON.stringify({
                        status: data.status,
                        error: data.error,
                        errorType: data.type,
                        config: config
                    }, null, 4);
                    $alerts.error('Wooops! an error has ocurred.', stackError);
                    return { "status": false };
                });
            return promise;
        };
        return factory;
    }];

})(angular);
},{}],50:[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.paper',[
        require('./modules/paper.add').name,
        require('./modules/paper.update').name
    ])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('paper', {
            url:'/paper',
            templateUrl : 'modules/paper/paper.view.html',
            controller : 'paperCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('paperFac',require('./paper.fac'))

    .controller('paperCtrl',require('./paper.ctrl'))
    
})(angular);

},{"./modules/paper.add":52,"./modules/paper.update":56,"./paper.ctrl":60,"./paper.fac":61}],51:[function(require,module,exports){
module.exports = {
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
                        "pa-measure":"Medida",
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
                        "pa_measure",
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
                        pa_measureoptions : [
                            {"label":"cm","value":"cm"},
                            {"label":"pulgadas","value":"in"}
                        ],
                    }
                }
},{}],52:[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.paper.add',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('paperAdd', {
            url:'/paper/add',
            templateUrl : 'modules/paper/modules/paper.add/paper.add.view.html',
            controller : 'paperAddCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('paperAddFac',require('./paper.add.fac'))

    .controller('paperAddCtrl',require('./paper.add.ctrl'))

})(angular);
},{"./paper.add.ctrl":54,"./paper.add.fac":55}],53:[function(require,module,exports){
module.exports = {
                    "title" : "agregar papel",
                }
},{}],54:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'paperAddFac', '$location', 'i18nFilter',
        function ($scope, paperAddFac, $location, i18nFilter) {
            $scope.fmData = {};

            $scope.onSubmit = function () {

                paperAddFac.add($scope.fmData).then(function (promise) {
                    if (promise.data == "1") {
                        $location.path('/paper');
                    } else {
                        $scope.updateFail = true;
                    }
                });
            };

            $scope.pa_statusoptions = i18nFilter("paper.fields.pa_statusoptions");
            $scope.pa_typeoptions = i18nFilter("paper.fields.pa_typeoptions");
            $scope.pa_measureoptions = i18nFilter("paper.fields.pa_measureoptions");

            $scope.$on('$viewContentLoaded', function () {
                // this code is executed after the view is loaded
            
                paperAddFac.getSuppliers().then(function (promise) {
                    if (angular.isArray(promise.data)) {
                        $scope.su_idoptions = [];
                        angular.forEach(promise.data, function (value, key) {
                            this.push({ "label": value.su_corporatename, "value": value.su_id });
                        }, $scope.su_idoptions);
                    } else {
                        //$scope.updateFail = true;
                    }
                });

            });
        }];

})(angular);
},{}],55:[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return ['$http', '$q', '$alerts', '$stateParams', function($http, $q, $alerts, $stateParams){
        var factory = {};
        factory.add = function(pa_jsonb) {
            var promise = $http.post('modules/paper/modules/paper.add/paper.add.mdl.add.php', {
                    /* POST variables here */
                    pa_jsonb: pa_jsonb
            }).success(function(data, status, headers, config){
                return data;
            }).error(function (data, status, headers, config) {
                return {"status": false};
            });
            return promise;
        };
        factory.getSuppliers = function() {
            var promise = $http.get('modules/paper/modules/paper.add/paper.add.mdl.getSuppliers.php')
            .success(function(data, status, headers, config){
                return data;
            }).error(function (data, status, headers, config) {
                return {"status": false};
            });
            return promise;
        };
        return factory;
    }];
    
})(angular);
},{}],56:[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.paper.update',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('paperUpdate', {
            url:'/paper/update/:pa_id',
            templateUrl : 'modules/paper/modules/paper.update/paper.update.view.html',
            controller : 'paperUpdateCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('paperUpdateFac',require('./paper.update.fac'))

    .controller('paperUpdateCtrl',require('./paper.update.ctrl'))

})(angular);
},{"./paper.update.ctrl":58,"./paper.update.fac":59}],57:[function(require,module,exports){
module.exports = {
                    "title" : "actualizar papel",
                }
},{}],58:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'paperUpdateFac', '$location', 'i18nFilter',
        function ($scope, paperUpdateFac, $location, i18nFilter) {

            $scope.onSubmit = function () {

                paperUpdateFac.update($scope.fmData).then(function (promise) {
                    if (promise.data == "1") {
                        $location.path('/paper');
                    } else {
                        $scope.updateFail = true;
                    }
                });
            };

            $scope.pa_statusoptions = i18nFilter("paper.fields.pa_statusoptions");
            $scope.pa_typeoptions = i18nFilter("paper.fields.pa_typeoptions");
            $scope.pa_measureoptions = i18nFilter("paper.fields.pa_measureoptions");

            $scope.$on('$viewContentLoaded', function () {
                // this code is executed after the view is loaded
                $scope.loading = true;
                paperUpdateFac.data().then(function (promise) {
                    $scope.loading = false;
                    if (angular.isObject(angular.fromJson(promise.data))) {
                        $scope.fmData = angular.fromJson(promise.data);
                    }
                }).then(function () {
                    paperUpdateFac.getSuppliers().then(function (promise) {
                        if (angular.isArray(promise.data)) {
                            $scope.su_idoptions = [];
                            angular.forEach(promise.data, function (value, key) {
                                this.push({ "label": value.su_corporatename, "value": value.su_id });
                            }, $scope.su_idoptions);
                        } else {
                            //$scope.updateFail = true;
                        }
                    });
                });

            });
        }];

})(angular);
},{}],59:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q', '$alerts', '$stateParams', function ($http, $q, $alerts, $stateParams) {
        var factory = {};
        factory.data = function () {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('modules/paper/modules/paper.update/paper.update.mdl.getpaper.php', {
                    /* POST variables here */
                    pa_id: $stateParams.pa_id
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    var stackError = JSON.stringify({
                        status: data.status,
                        error: data.error,
                        errorType: data.type,
                        config: config
                    }, null, 4);
                    $alerts.error('Wooops! an error has ocurred.', stackError);
                    return { "status": false };
                })
                );
            return deferred.promise;
        };
        factory.update = function (pa_jsonb) {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('modules/paper/modules/paper.update/paper.update.mdl.update.php', {
                    /* POST variables here */
                    pa_id: $stateParams.pa_id,
                    pa_jsonb: pa_jsonb
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    var stackError = JSON.stringify({
                        status: data.status,
                        error: data.error,
                        errorType: data.type,
                        config: config
                    }, null, 4);
                    $alerts.error('Wooops! an error has ocurred.', stackError);
                    return { "status": false };
                })
                );
            return deferred.promise;
        };
        factory.getSuppliers = function () {
            var promise = $http.get('modules/paper/modules/paper.add/paper.add.mdl.getSuppliers.php')
                .success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    var stackError = JSON.stringify({
                        status: data.status,
                        error: data.error,
                        errorType: data.type,
                        config: config
                    }, null, 4);
                    $alerts.error('Wooops! an error has ocurred.', stackError);
                    return { "status": false };
                });
            return promise;
        };
        return factory;
    }];

})(angular);
},{}],60:[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return ['$scope', 'paperFac', 'i18nFilter',
    function ($scope, paperFac, i18nFilter) {
    
        $scope.labels = Object.keys(i18nFilter("paper.labels"));
        $scope.columns = i18nFilter("paper.columns");
        
        // formatItem event handler
        var pa_id;
        $scope.formatItem = function(s, e, cell) {
            
            if (e.panel.cellType == wijmo.grid.CellType.RowHeader) {
                e.cell.textContent = e.row+1;
            }
            
            s.rows.defaultSize = 30;
            
            // add Bootstrap html
            if ((e.panel.cellType == wijmo.grid.CellType.Cell) && (e.col == 0)) {
                pa_id = e.panel.getCellData(e.row,1,false);
                e.cell.style.overflow = 'visible';
                e.cell.innerHTML = '<div class="btn-group btn-group-justified" role="group" aria-label="...">\
                                        <div class="btn-group" role="group">\
                                            <a href="#/paper/update/'+pa_id+'" class="btn btn-default btn-xs" ng-click="edit($item.pa_id)">Editar</a>\
                                        </div>\
                                    </div>';
            }
        }
        
        // bind columns when grid is initialized
        $scope.initGrid = function(s, e) {
            for (var i = 0; i < $scope.labels.length; i++) {
                var col = new wijmo.grid.Column();
                col.binding = $scope.columns[i];
                col.header = i18nFilter("paper.labels." + $scope.labels[i]);
                col.wordWrap = false;
                col.width = 150;
                s.columns.push(col);
            }
        };
        // create the tooltip object
        $scope.$watch('ggGrid', function () {
            if ($scope.ggGrid) {
                    
                // store reference to grid
                var flex = $scope.ggGrid;

                // create tooltip
                var tip = new wijmo.Tooltip(),
                    rng = null;

                // monitor the mouse over the grid
                flex.hostElement.addEventListener('mousemove', function (evt) {
                    var ht = flex.hitTest(evt);
                    if (!ht.cellRange.equals(rng)) {

                        // new cell selected, show tooltip
                        if (ht.cellType == wijmo.grid.CellType.Cell) {
                            rng = ht.cellRange;
                            var col = flex.columns[rng.col].header;
                            var cellElement = document.elementFromPoint(evt.clientX, evt.clientY),
                                cellBounds = wijmo.Rect.fromBoundingRect(cellElement.getBoundingClientRect()),
                                data = wijmo.escapeHtml(flex.getCellData(rng.row, rng.col, true)),
                                tipContent = col + ': "<b>' + data + '</b>"';
                            if (cellElement.className.indexOf('wj-cell') > -1) {
                                tip.show(flex.hostElement, tipContent, cellBounds);
                            } else {
                                tip.hide(); // cell must be behind scroll bar...
                            }
                        }
                    }
                });
                flex.hostElement.addEventListener('mouseout', function () {
                    tip.hide();
                    rng = null;
                });
            }
        });

        $scope.$on('$viewContentLoaded', function () {
            // this code is executed after the view is loaded
            $scope.loading = true;
            paperFac.data().then(function(promise){
                $scope.loading = false;
                if(angular.isArray(promise.data)) {
                    $scope.data = new wijmo.collections.CollectionView(promise.data);
                }
            });
         });
    }];
    
})(angular);
},{}],61:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q', '$alerts', function ($http, $q, $alerts) {
        var factory = {};
        factory.data = function () {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('modules/paper/paper.mdl.getpapers.php', {
                    /* POST variables here */
                    procces_id: new Date().getMilliseconds()
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    var stackError = JSON.stringify({
                        status: data.status,
                        error: data.error,
                        errorType: data.type,
                        config: config
                    }, null, 4);
                    $alerts.error('Wooops! an error has ocurred.', stackError);
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        return factory;
    }];

})(angular);
},{}],62:[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.product',[
        require('./modules/productOffsetGeneral.add').name,
        require('./modules/productOffsetGeneral.update').name,
        require('./modules/productOffsetPaginated.add').name,
        //require('./modules/productOffsetPaginated.update').name
    ])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('product', {
            url:'/product/:cl_id',
            templateUrl : 'modules/product/product.view.html',
            controller : 'productCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('productFac',require('./product.fac'))

    .controller('productCtrl',require('./product.ctrl'))
    
})(angular);

},{"./modules/productOffsetGeneral.add":64,"./modules/productOffsetGeneral.update":68,"./modules/productOffsetPaginated.add":72,"./product.ctrl":76,"./product.fac":77}],63:[function(require,module,exports){
module.exports = {
                    "title" : "Productos",
                    "labels":{
                        "pr-id": "ID producto",
                        "cl-id": "ID Cliente",
                        "pr-partno": "No. Parte",
                        "pr-code": "Codigo",
                        "pr-name": "Nombre",
                        "pr-process": "Proceso",
                        "pr-type": "Tipo",
                        "pr-status": "Estatus",
                        "pr-date": "Fecha",
                    },
                    "columns":[
                        "pr_id",
                        "cl_id",
                        "pr_partno",
                        "pr_code",
                        "pr_name",
                        "pr_process",
                        "pr_type",
                        "pr_status",
                        "pr_date",
                    ],
                     "fields" : {
                        
                     }
                }
},{}],64:[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.productOffsetGeneral.add',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('productOffsetGeneralAdd', {
            url:'/product/add/offset/general/:cl_id',
            templateUrl : 'modules/product/modules/productOffsetGeneral.add/productOffsetGeneral.add.view.html',
            controller : 'productOffsetGeneralAddCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('productOffsetGeneralAddFac',require('./productOffsetGeneral.add.fac'))

    .controller('productOffsetGeneralAddCtrl',require('./productOffsetGeneral.add.ctrl'))

})(angular);
},{"./productOffsetGeneral.add.ctrl":66,"./productOffsetGeneral.add.fac":67}],65:[function(require,module,exports){
module.exports = {
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
                        "pr-varnishuv": "Barniz UV",
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
                        pr_papersizemeasureoptions : [
                            {"label":"cm","value":"cm"},
                            {"label":"pulgadas","value":"in"}
                        ],
                        pr_varnishoptions : [
                            {"label":"Si","value":"yes"},
                            {"label":"No","value":"no"}
                        ],
                        pr_varnishuvoptions : [
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
                }
},{}],66:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'productOffsetGeneralAddFac', '$location', 'i18nFilter', '$stateParams',
        function ($scope, productOffsetGeneralAddFac, $location, i18nFilter, $stateParams) {
            $scope.fmData = {};
            $scope.fmData = { "pr_process": "offset", "pr_type": "general", "cl_id": "6", "pr_partno": "TEST-ASA.asas: 23,34", "pr_description": "este es un producto de prueba", "pr_finalsizewidth": "100.00", "pr_finalsizeheight": "200.00", "pr_finalsizemeasure": "cm", "pr_inkfront": 2, "pr_inksfront": { "0": 2, "1": 2 }, "pr_inkback": 3, "pr_inksback": { "0": 2, "1": 3, "2": 3 }, "pa_id": 1, "pr_paperformatsqty": "123", "pr_papersizewidth": "100.00", "pr_papersizeheight": "200.00", "pr_papersizemeasure": "cm", "pr_varnish": "yes", "pr_varnishuv": "oneside", "pr_varnishfinished": "matte", "pr_laminate": "yes", "pr_laminatefinished": "matte", "pr_laminatecaliber": "2mm", "pr_precut": "horizontal", "pr_fold": "tryptic", "pr_diecutting": "yes", "pr_diecuttingqty": "5", "pr_reinforcement": "one", "pr_cord": "allocated", "pr_wire": "allocated", "pr_folio": "yes", "pr_blocks": "100", "pr_status": "A" };
            $scope.fmData.pr_process = 'offset';
            $scope.fmData.pr_type = 'general';
            $scope.fmData.cl_id = $stateParams.cl_id;

            $scope.onSubmit = function () {

                productOffsetGeneralAddFac.add($scope.fmData).then(function (promise) {
                    if (promise.data.rowCount === 1) {
                        $location.path('/product/'+$stateParams.cl_id);
                    } else {
                        $scope.updateFail = true;
                    }
                });
            };

            $scope.pr_finalsizemeasureoptions = i18nFilter("productOffsetGeneral-add.fields.pr_finalsizemeasureoptions");
            $scope.pr_inkfrontoptions = i18nFilter("productOffsetGeneral-add.fields.pr_inkfrontoptions");
            $scope.pr_inkbackoptions = i18nFilter("productOffsetGeneral-add.fields.pr_inkbackoptions");
            $scope.pr_papersizemeasureoptions = i18nFilter("productOffsetGeneral-add.fields.pr_papersizemeasureoptions");
            $scope.pr_varnishoptions = i18nFilter("productOffsetGeneral-add.fields.pr_varnishoptions");
            $scope.pr_varnishuvoptions = i18nFilter("productOffsetGeneral-add.fields.pr_varnishuvoptions");
            $scope.pr_varnisfinishedoptions = i18nFilter("productOffsetGeneral-add.fields.pr_varnisfinishedoptions");
            $scope.pr_laminateoptions = i18nFilter("productOffsetGeneral-add.fields.pr_laminateoptions");
            $scope.pr_laminatefinishedoptions = i18nFilter("productOffsetGeneral-add.fields.pr_laminatefinishedoptions");
            $scope.pr_laminatecaliberoptions = i18nFilter("productOffsetGeneral-add.fields.pr_laminatecaliberoptions");
            $scope.pr_laminatesidesoptions = i18nFilter("productOffsetGeneral-add.fields.pr_laminatesidesoptions");
            $scope.pr_foliooptions = i18nFilter("productOffsetGeneral-add.fields.pr_foliooptions");
            $scope.pr_precutoptions = i18nFilter("productOffsetGeneral-add.fields.pr_precutoptions");
            $scope.pr_foldoptions = i18nFilter("productOffsetGeneral-add.fields.pr_foldoptions");
            $scope.pr_diecuttingoptions = i18nFilter("productOffsetGeneral-add.fields.pr_diecuttingoptions");
            $scope.pr_reinforcementoptions = i18nFilter("productOffsetGeneral-add.fields.pr_reinforcementoptions");
            $scope.pr_cordoptions = i18nFilter("productOffsetGeneral-add.fields.pr_cordoptions");
            $scope.pr_wireoptions = i18nFilter("productOffsetGeneral-add.fields.pr_wireoptions");
            $scope.pr_blocksoptions = i18nFilter("productOffsetGeneral-add.fields.pr_blocksoptions");
            $scope.pr_statusoptions = i18nFilter("productOffsetGeneral-add.fields.pr_statusoptions");
        
            // create front ink fields
            $scope.$watch('fmData.pr_inkfront', function (newValue, oldValue) {
                if ($scope.fmData.pr_inkfront != undefined) {
                    $scope.frontInks = new Array(newValue);
                    for (var i = 0; i < oldValue; i++) {
                        $scope.fmData['pr_inksfront'][i] = undefined;
                    }
                }
            });
        
            // create back ink fields
            $scope.$watch('fmData.pr_inkback', function (newValue, oldValue) {
                if ($scope.fmData.pr_inkback != undefined) {
                    $scope.backInks = new Array(newValue);
                    for (var i = 0; i < oldValue; i++) {
                        $scope.fmData['pr_inksback'][i] = undefined;
                    }
                }
            });

            $scope.$on('$viewContentLoaded', function () {
                // this code is executed after the view is loaded
            
                productOffsetGeneralAddFac.getClient().then(function (promise) {
                    $scope.loading = false;
                    if (angular.isObject(promise.data)) {
                        $scope.client = promise.data;
                    }
                });

                productOffsetGeneralAddFac.getInks().then(function (promise) {
                    if (angular.isArray(promise.data)) {
                        $scope.pr_inkoptions = [];
                        angular.forEach(promise.data, function (value, key) {
                            this.push({ "label": value.in_code, "value": value.in_id });
                        }, $scope.pr_inkoptions);
                    } else {
                        //$scope.updateFail = true;
                    }
                });

                productOffsetGeneralAddFac.getPapers().then(function (promise) {
                    if (angular.isArray(promise.data)) {
                        $scope.pa_idoptions = [];
                        angular.forEach(promise.data, function (value, key) {
                            this.push({ "label": value.pa_code, "value": value.pa_id });
                        }, $scope.pa_idoptions);
                    } else {
                        //$scope.updateFail = true;
                    }
                });

            });
        }];

})(angular);
},{}],67:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q', '$alerts', '$stateParams', function ($http, $q, $alerts, $stateParams) {
        var factory = {};
        factory.getClient = function () {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/product/offset/general/client', {
                    /* POST variables here */
                    cl_id: $stateParams.cl_id
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    var stackError = JSON.stringify({
                        status: data.status,
                        error: data.error,
                        errorType: data.type,
                        config: config
                    }, null, 4);
                    $alerts.error('Wooops! an error has ocurred.', stackError);
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        factory.getInks = function () {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/product/offset/general/ink', {
                    /* POST variables here */
                    procces_id: new Date().getMilliseconds()
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    var stackError = JSON.stringify({
                        status: data.status,
                        error: data.error,
                        errorType: data.type,
                        config: config
                    }, null, 4);
                    $alerts.error('Wooops! an error has ocurred.', stackError);
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        factory.getPapers = function () {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/product/offset/general/paper', {
                    /* POST variables here */
                    procces_id: new Date().getMilliseconds()
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    var stackError = JSON.stringify({
                        status: data.status,
                        error: data.error,
                        errorType: data.type,
                        config: config
                    }, null, 4);
                    $alerts.error('Wooops! an error has ocurred.', stackError);
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        factory.add = function (pr_jsonb) {
            var promise = $http.post('/product/add', {
                /* POST variables here */
                pr_jsonb: pr_jsonb
            }).success(function (data, status, headers, config) {
                return data;
            }).error(function (data, status, headers, config) {
                var stackError = JSON.stringify({
                    status: data.status,
                    error: data.error,
                    errorType: data.type,
                    config: config
                }, null, 4);
                $alerts.error('Wooops! an error has ocurred.', stackError);
                return { "status": false };
            });
            return promise;
        };
        return factory;
    }];

})(angular);
},{}],68:[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.productOffsetGeneral.update',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('productOffsetGeneralUpdate', {
            url:'/product/offset/general/update/:cl_id/:pr_id',
            templateUrl : 'modules/product/modules/productOffsetGeneral.update/productOffsetGeneral.update.view.html',
            controller : 'productOffsetGeneralUpdateCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('productOffsetGeneralUpdateFac',require('./productOffsetGeneral.update.fac'))

    .controller('productOffsetGeneralUpdateCtrl',require('./productOffsetGeneral.update.ctrl'))

})(angular);
},{"./productOffsetGeneral.update.ctrl":70,"./productOffsetGeneral.update.fac":71}],69:[function(require,module,exports){
module.export = {}
},{}],70:[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return ['$scope', 'productOffsetGeneralUpdateFac', '$location', 'i18nFilter', '$stateParams', '$interval',
    function ($scope, productOffsetGeneralUpdateFac, $location, i18nFilter, $stateParams, $interval) {
        
        $scope.onSubmit = function() {

            productOffsetGeneralUpdateFac.update($scope.fmData).then(function(promise){
                if(promise.data.rowCount === 1) {
                    $location.path('/product/'+$stateParams.cl_id);
                } else {
                    $scope.updateFail = true;
                }
            });
        };
        
        $scope.getStates = function() {
            $scope.pr_stateoptions = [];
            $scope.pr_cityoptions = [];
            $scope.pr_countyoptions = [];
            $interval(function(){
                productOffsetGeneralUpdateFac.getStates($scope.fmData.pr_country).then(function(promise){
                    if(angular.isArray(promise.data.geonames)) {
                        $scope.pr_stateoptions = promise.data.geonames;
                    } else {
                        //$scope.updateFail = true;
                    }
                });
            },0,1);
        }

        $scope.getCityCounty = function() {
            $scope.pr_cityoptions = [];
            $scope.pr_countyoptions = [];
            $interval(function(){
                productOffsetGeneralUpdateFac.getStates($scope.fmData.pr_state).then(function(promise){
                    if(angular.isArray(promise.data.geonames)) {
                        $scope.pr_cityoptions = promise.data.geonames;
                        $scope.pr_countyoptions = promise.data.geonames;
                    } else {
                        //$scope.updateFail = true;
                    }
                });
            },0,1);
        }
        
        $scope.pr_statusoptions = i18nFilter("productOffsetGeneral.fields.pr_statusoptions");
        
        $scope.$on('$viewContentLoaded', function () {
            // this code is executed after the view is loaded
            $scope.loading = true;
            productOffsetGeneralUpdateFac.data().then(function(promise){
                $scope.loading = false;
                if(angular.isObject(angular.fromJson(promise.data))) {
                        $scope.fmData = angular.fromJson(promise.data);
                }
            }).then(function(){
                productOffsetGeneralUpdateFac.getCountries().then(function(promise){
                    if(angular.isArray(promise.data.geonames)) {
                        $scope.pr_countryoptions = promise.data.geonames;
                    } else {
                        //$scope.updateFail = true;
                    }
                }).then(function(){
                    productOffsetGeneralUpdateFac.getStates($scope.fmData.pr_country).then(function(promise){
                        if(angular.isArray(promise.data.geonames)) {
                            $scope.pr_stateoptions = promise.data.geonames;
                        } else {
                            //$scope.updateFail = true;
                        }
                    })
                }).then(function(){
                    productOffsetGeneralUpdateFac.getCityCounty($scope.fmData.pr_state).then(function(promise){
                        if(angular.isArray(promise.data.geonames)) {
                            $scope.pr_cityoptions = promise.data.geonames;
                            $scope.pr_countyoptions = promise.data.geonames;
                        } else {
                            //$scope.updateFail = true;
                        }
                    })
                });
            });

         });
    }];
    
})(angular);
},{}],71:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q', '$alerts', '$stateParams', function ($http, $q, $alerts, $stateParams) {
        var factory = {};
        factory.data = function () {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/product/offset/general/product', {
                    /* POST variables here */
                    pr_id: $stateParams.pr_id
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    var stackError = JSON.stringify({
                        status: data.status,
                        error: data.error,
                        errorType: data.type,
                        config: config
                    }, null, 4);
                    $alerts.error('Wooops! an error has ocurred.', stackError);
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        factory.update = function (pr_jsonb) {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/product/update', {
                    /* POST variables here */
                    pr_id: $stateParams.pr_id,
                    pr_jsonb: pr_jsonb
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    var stackError = JSON.stringify({
                        status: data.status,
                        error: data.error,
                        errorType: data.type,
                        config: config
                    }, null, 4);
                    $alerts.error('Wooops! an error has ocurred.', stackError);
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        factory.getCountries = function () {
            var promise = $http.jsonp('http://api.geonames.org/countryInfoJSON?username=alejandrolsca&callback=JSON_CALLBACK')
                .success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    var stackError = JSON.stringify({
                        status: data.status,
                        error: data.error,
                        errorType: data.type,
                        config: config
                    }, null, 4);
                    $alerts.error('Wooops! an error has ocurred.', stackError);
                    return { "status": false };
                });
            return promise;
        };
        factory.getStates = function (pr_country) {
            var promise = $http.jsonp('http://api.geonames.org/childrenJSON?geonameId=' + pr_country + '&username=alejandrolsca&callback=JSON_CALLBACK')
                .success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    var stackError = JSON.stringify({
                        status: data.status,
                        error: data.error,
                        errorType: data.type,
                        config: config
                    }, null, 4);
                    $alerts.error('Wooops! an error has ocurred.', stackError);
                    return { "status": false };
                });
            return promise;
        };
        factory.getCityCounty = function (pr_state) {
            var promise = $http.jsonp('http://api.geonames.org/childrenJSON?geonameId=' + pr_state + '&username=alejandrolsca&callback=JSON_CALLBACK')
                .success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    var stackError = JSON.stringify({
                        status: data.status,
                        error: data.error,
                        errorType: data.type,
                        config: config
                    }, null, 4);
                    $alerts.error('Wooops! an error has ocurred.', stackError);
                    return { "status": false };
                });
            return promise;
        };
        return factory;
    }];

})(angular);
},{}],72:[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.productOffsetPaginated.add',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('productOffsetPaginatedAdd', {
            url:'/product/add/offset/paginated/:cl_id',
            templateUrl : 'modules/product/modules/productOffsetPaginated.add/productOffsetPaginated.add.view.html',
            controller : 'productOffsetPaginatedAddCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('productOffsetPaginatedAddFac',require('./productOffsetPaginated.add.fac'))

    .controller('productOffsetPaginatedAddCtrl',require('./productOffsetPaginated.add.ctrl'))

})(angular);
},{"./productOffsetPaginated.add.ctrl":74,"./productOffsetPaginated.add.fac":75}],73:[function(require,module,exports){
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
                        ]
                     }
                }
},{}],74:[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return ['$scope', 'productOffsetPaginatedAddFac', '$location', 'i18nFilter', '$stateParams',
    function ($scope, productOffsetPaginatedAddFac, $location, i18nFilter, $stateParams) {
        $scope.fmData = {};
        $scope.fmData = { "pr_process": "offset", "pr_type": "paginated", "cl_id": "6", "pr_partno": "TEST-ASA.asas: 23,34", "pr_description": "este es un producto de prueba", "pr_finalsizewidth": "100.00", "pr_finalsizeheight": "200.00", "pr_finalsizemeasure": "cm", "pr_inkfront": 2, "pr_inksfront": { "0": "2", "1": "3" }, "pr_inkback": 2, "pr_inksback": { "0": "2", "1": "2" }, "pa_id": "1", "pr_paperformatsqty": "123", "pr_papersizewidth": "100.00", "pr_papersizeheight": "200.00", "pr_papersizemeasure": "cm", "pr_varnish": "oneside", "pr_varnishfinished": "matte", "pr_laminate": "twosides", "pr_laminatefinished": "matte", "pr_laminatecaliber": "2mm", "pr_precut": "horizontal", "pr_fold": "tryptic", "pr_diecutting": "yes", "pr_diecuttingqty": "5", "pr_reinforcement": "one", "pr_cord": "allocated", "pr_wire": "allocated", "pr_folio": "yes", "pr_blocks": "100", "pr_status": "A", "pr_intinkfront": 2, "pr_intinksfront": { "0": "2", "1": "3" }, "pr_intinkback": 2, "pr_intinksback": { "0": "2", "1": "3" }, "pr_intpages": "100", "pa_intid": "1", "pr_intpaperformatsqty": "500", "pr_stapling": "2", "pr_bound": "yes", "pr_spiralbind": "plastic", "pr_name": "asdasdas", "pr_code": "asdasd" };
        
        $scope.fmData.pr_process = 'offset';
        $scope.fmData.pr_type = 'paginated';
        $scope.fmData.cl_id = $stateParams.cl_id;

        $scope.onSubmit = function() {

            productOffsetPaginatedAddFac.add($scope.fmData).then(function(promise){
                if(promise.data.rowCount == 1) {
                    $location.path('/product/'+$stateParams.cl_id);
                } else {
                    $scope.updateFail = true;
                }
            });
        };
        
        $scope.pr_finalsizemeasureoptions = i18nFilter("productOffsetPaginated-add.fields.pr_finalsizemeasureoptions");
        $scope.pr_inkfrontoptions = i18nFilter("productOffsetPaginated-add.fields.pr_inkfrontoptions");
        $scope.pr_inkbackoptions = i18nFilter("productOffsetPaginated-add.fields.pr_inkbackoptions");
        $scope.pr_varnishoptions = i18nFilter("productOffsetPaginated-add.fields.pr_varnishoptions");
        $scope.pr_varnisfinishedoptions = i18nFilter("productOffsetPaginated-add.fields.pr_varnisfinishedoptions");
        $scope.pr_laminateoptions = i18nFilter("productOffsetPaginated-add.fields.pr_laminateoptions");
        $scope.pr_laminatefinishedoptions = i18nFilter("productOffsetPaginated-add.fields.pr_laminatefinishedoptions");
        $scope.pr_laminatecaliberoptions = i18nFilter("productOffsetPaginated-add.fields.pr_laminatecaliberoptions");
        $scope.pr_laminatesidesoptions = i18nFilter("productOffsetPaginated-add.fields.pr_laminatesidesoptions");
        $scope.pr_foliooptions = i18nFilter("productOffsetPaginated-add.fields.pr_foliooptions");
        $scope.pr_precutoptions = i18nFilter("productOffsetPaginated-add.fields.pr_precutoptions");
        $scope.pr_foldoptions = i18nFilter("productOffsetPaginated-add.fields.pr_foldoptions");
        $scope.pr_diecuttingoptions = i18nFilter("productOffsetPaginated-add.fields.pr_diecuttingoptions");
        $scope.pr_reinforcementoptions = i18nFilter("productOffsetPaginated-add.fields.pr_reinforcementoptions");
        $scope.pr_cordoptions = i18nFilter("productOffsetPaginated-add.fields.pr_cordoptions");
        $scope.pr_wireoptions = i18nFilter("productOffsetPaginated-add.fields.pr_wireoptions");
        $scope.pr_staplingoptions = i18nFilter("productOffsetPaginated-add.fields.pr_staplingoptions");
        $scope.pr_boundoptions = i18nFilter("productOffsetPaginated-add.fields.pr_boundoptions");
        $scope.pr_spiralbindoptions = i18nFilter("productOffsetPaginated-add.fields.pr_spiralbindoptions");
        $scope.pr_blocksoptions = i18nFilter("productOffsetPaginated-add.fields.pr_blocksoptions");
        $scope.pr_statusoptions = i18nFilter("productOffsetPaginated-add.fields.pr_statusoptions");
        
        // create front ink fields
        $scope.$watch('fmData.pr_inkfront', function(newValue, oldValue) {
            if($scope.fmData.pr_inkfront != undefined) {
                $scope.frontInks = new Array(newValue);
                for (var i=0; i<newValue; i++) {
                    if(oldValue != newValue) {
                        $scope.fmData['pr_inksfront'][i] = undefined;
                    }
                }
            }
        });
        
        // create back ink fields
        $scope.$watch('fmData.pr_inkback', function(newValue, oldValue) {
            if($scope.fmData.pr_inkback != undefined) {
                $scope.backInks = new Array(newValue);
                for (var i=0; i<oldValue; i++) {
                    if(oldValue != newValue) {
                        $scope.fmData['pr_inksback'][i] = undefined;
                    }
                }
            }
        });
        
        // create front interior ink fields
        $scope.$watch('fmData.pr_intinkfront', function(newValue, oldValue) {
            if($scope.fmData.pr_intinkfront != undefined) {
                $scope.intFrontInks = new Array(newValue);
                for (var i=0; i<newValue; i++) {
                    if(oldValue != newValue) {
                        $scope.fmData['pr_intinksfront'][i] = undefined;
                    }
                }
            }
        });
        
        // create back interior ink fields
        $scope.$watch('fmData.pr_intinkback', function(newValue, oldValue) {
            if($scope.fmData.pr_intinkback != undefined) {
                $scope.intBackInks = new Array(newValue);
                for (var i=0; i<oldValue; i++) {
                    if(oldValue != newValue) {
                        $scope.fmData['pr_intinksback'][i] = undefined;
                    }
                }
            }
        });

        $scope.$on('$viewContentLoaded', function () {
            // this code is executed after the view is loaded
            
            productOffsetPaginatedAddFac.getClient().then(function(promise){
                $scope.loading = false;
                if(angular.isObject(promise.data)) {
                    $scope.client = promise.data;
                }
            });
            
            productOffsetPaginatedAddFac.getInks().then(function(promise){
                if(angular.isArray(promise.data)) {
                    $scope.pr_inkoptions = [];
                    angular.forEach(promise.data,function(value, key){
                          this.push({"label":value.in_code,"value":value.in_id});
                    },$scope.pr_inkoptions);
                } else {
                    //$scope.updateFail = true;
                }
            });
            
            productOffsetPaginatedAddFac.getPapers().then(function(promise){
                if(angular.isArray(promise.data)) {
                    $scope.pa_idoptions = [];
                    angular.forEach(promise.data,function(value, key){
                        this.push({"label":value.pa_code,"value":value.pa_id, "width": value.pa_width, "height": value.pa_height, "measure": value.pa_measure});
                    },$scope.pa_idoptions);
                } else {
                    //$scope.updateFail = true;
                }
            });
    
         });
    }];
    
})(angular);
},{}],75:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q', '$alerts', '$stateParams', function ($http, $q, $alerts, $stateParams) {
        var factory = {};
        factory.getClient = function () {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/product/offset/general/client', {
                    /* POST variables here */
                    cl_id: $stateParams.cl_id
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    var stackError = JSON.stringify({                     status: data.status,                     error: data.error,                     errorType: data.type,                     config: config                 },null,4);                 $alerts.error('Wooops! an error has ocurred.',stackError);                 return { "status": false };
                })
                );
            return deferred.promise;
        };
        factory.getInks = function () {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/product/offset/general/ink', {
                    /* POST variables here */
                    procces_id: new Date().getMilliseconds()
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    var stackError = JSON.stringify({                     status: data.status,                     error: data.error,                     errorType: data.type,                     config: config                 },null,4);                 $alerts.error('Wooops! an error has ocurred.',stackError);                 return { "status": false };
                })
                );
            return deferred.promise;
        };
        factory.getPapers = function () {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/product/offset/general/paper', {
                    /* POST variables here */
                    procces_id: new Date().getMilliseconds()
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    var stackError = JSON.stringify({                     status: data.status,                     error: data.error,                     errorType: data.type,                     config: config                 },null,4);                 $alerts.error('Wooops! an error has ocurred.',stackError);                 return { "status": false };
                })
                );
            return deferred.promise;
        };
        factory.add = function (pr_jsonb) {
            var promise = $http.post('/product/add', {
                /* POST variables here */
                pr_jsonb: pr_jsonb
            }).success(function (data, status, headers, config) {
                return data;
            }).error(function (data, status, headers, config) {
                var stackError = JSON.stringify({                     status: data.status,                     error: data.error,                     errorType: data.type,                     config: config                 },null,4);                 $alerts.error('Wooops! an error has ocurred.',stackError);                 return { "status": false };
            });
            return promise;
        };
        return factory;
    }];

})(angular);
},{}],76:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'productFac', 'i18nFilter',
        function ($scope, productFac, i18nFilter) {

            $scope.labels = Object.keys(i18nFilter("product.labels"));
            $scope.columns = i18nFilter("product.columns");
        
            //set QR Code data defaults
            $scope.qrcodeString = 'YOUR TEXT TO ENCODE';
            $scope.size = 250;
            $scope.correctionLevel = '';
            $scope.typeNumber = 0;
            $scope.inputMode = '';
            $scope.image = true;
        
            //QR Code modal
            $('#myModal').on('show.bs.modal', function (event) {
                var button = $(event.relatedTarget); // Button that triggered the modal
                $scope.qrcodeString = button.data('code_data');// Extract info from data-* attributes
                $scope.$apply();
            })
        
            // formatItem event handler
            var pr_id;
            var cl_id;
            var pr_process;
            var pr_type;
            var code_data;
            $scope.formatItem = function (s, e, cell) {

                if (e.panel.cellType == wijmo.grid.CellType.RowHeader) {
                    e.cell.textContent = e.row + 1;
                }

                s.rows.defaultSize = 30;
            
                // add Bootstrap html
                if ((e.panel.cellType == wijmo.grid.CellType.Cell) && (e.col == 0)) {
                    pr_id = e.panel.getCellData(e.row, 1, false);
                    cl_id = e.panel.getCellData(e.row, 2, false);
                    pr_process = e.panel.getCellData(e.row, 6, false);
                    pr_type = e.panel.getCellData(e.row, 7, false);
                    code_data = (function () { //QR Code data from columns 
                        var text = '';
                        for (var i = 0; i < $scope.labels.length; i++) {
                            text += i18nFilter("product.labels." + $scope.labels[i]) + ': ' + e.panel.getCellData(e.row, (i + 1), false) + '\n'
                        }
                        return text;
                    })();
                    e.cell.style.overflow = 'visible';
                    e.cell.innerHTML = '<div class="btn-group btn-group-justified" role="group" aria-label="...">\
                                        <div class="btn-group" role="group">\
                                            <a href="#/product/'+ pr_process + '/' + pr_type + '/update/' + cl_id + '/' + pr_id + '" class="btn btn-default btn-xs" ng-click="edit($item.cl_id)">Editar</a>\
                                        </div>\
                                        <div class="btn-group" role="group">\
                                            <a data-toggle="modal" data-target="#myModal" data-code_data="'+ code_data + '" class="btn btn-default btn-xs">QR Code</a>\
                                        </div>\
                                    </div>';
                }
            }
        
            // bind columns when grid is initialized
            $scope.initGrid = function (s, e) {
                for (var i = 0; i < $scope.labels.length; i++) {
                    var col = new wijmo.grid.Column();
                    col.binding = $scope.columns[i];
                    col.header = i18nFilter("product.labels." + $scope.labels[i]);
                    col.wordWrap = false;
                    col.width = 150;
                    s.columns.push(col);
                }
            };
            // create the tooltip object
            $scope.$watch('ggGrid', function () {
                if ($scope.ggGrid) {
                    
                    // store reference to grid
                    var flex = $scope.ggGrid;

                    // create tooltip
                    var tip = new wijmo.Tooltip(),
                        rng = null;

                    // monitor the mouse over the grid
                    flex.hostElement.addEventListener('mousemove', function (evt) {
                        var ht = flex.hitTest(evt);
                        if (!ht.cellRange.equals(rng)) {

                            // new cell selected, show tooltip
                            if (ht.cellType == wijmo.grid.CellType.Cell) {
                                rng = ht.cellRange;
                                var col = flex.columns[rng.col].header;
                                var cellElement = document.elementFromPoint(evt.clientX, evt.clientY),
                                    cellBounds = wijmo.Rect.fromBoundingRect(cellElement.getBoundingClientRect()),
                                    data = wijmo.escapeHtml(flex.getCellData(rng.row, rng.col, true)),
                                    tipContent = col + ': "<b>' + data + '</b>"';
                                if (cellElement.className.indexOf('wj-cell') > -1) {
                                    tip.show(flex.hostElement, tipContent, cellBounds);
                                } else {
                                    tip.hide(); // cell must be behind scroll bar...
                                }
                            }
                        }
                    });
                    flex.hostElement.addEventListener('mouseout', function () {
                        tip.hide();
                        rng = null;
                    });
                }
            });

            $scope.$on('$viewContentLoaded', function () {
                // this code is executed after the view is loaded
                $scope.loading = true;
                productFac.data().then(function (promise) {
                    $scope.loading = false;
                    if (angular.isArray(promise.data)) {
                        $scope.data = new wijmo.collections.CollectionView(promise.data);
                    }
                });
            });
        }];

})(angular);
},{}],77:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q', '$alerts', '$stateParams', function ($http, $q, $alerts, $stateParams) {
        var factory = {};
        factory.data = function () {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('http://localhost:3000/product/cl_id', {
                    /* POST variables here */
                    procces_id: new Date().getMilliseconds(),
                    cl_id: $stateParams.cl_id,
                    pr_status: 'A'
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    return { "status":  false };
                })
                );
            return deferred.promise;
        };
        return factory;
    }];

})(angular);
},{}],78:[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.supplier',[
        require('./modules/supplier.add').name,
        require('./modules/supplier.update').name
    ])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('supplier', {
            url:'/supplier',
            templateUrl : 'modules/supplier/supplier.view.html',
            controller : 'supplierCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('supplierFac',require('./supplier.fac'))

    .controller('supplierCtrl',require('./supplier.ctrl'))
    
})(angular);

},{"./modules/supplier.add":80,"./modules/supplier.update":84,"./supplier.ctrl":88,"./supplier.fac":89}],79:[function(require,module,exports){
module.exports = {
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
                }
},{}],80:[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.supplier.add',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('supplierAdd', {
            url:'/supplier/add',
            templateUrl : 'modules/supplier/modules/supplier.add/supplier.add.view.html',
            controller : 'supplierAddCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('supplierAddFac',require('./supplier.add.fac'))

    .controller('supplierAddCtrl',require('./supplier.add.ctrl'))

})(angular);
},{"./supplier.add.ctrl":82,"./supplier.add.fac":83}],81:[function(require,module,exports){
module.exports = {
                    "title" : "agregar proveedor",
                }
},{}],82:[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return ['$scope', 'supplierAddFac', '$location', 'i18nFilter', '$interval',
    function ($scope, supplierAddFac, $location, i18nFilter, $interval) {
        $scope.fmData = {};

        $scope.onSubmit = function() {

            supplierAddFac.add($scope.fmData).then(function(promise){
                if(promise.data == "1") {
                    $location.path('/supplier');
                } else {
                    $scope.updateFail = true;
                }
            });
        };

        $scope.getStates = function() {
            $scope.su_stateoptions = [];
            $scope.su_cityoptions = [];
            $scope.su_countyoptions = [];
            $interval(function(){
                supplierAddFac.getStates($scope.fmData.su_country).then(function(promise){
                    if(angular.isArray(promise.data.geonames)) {
                        $scope.su_stateoptions = promise.data.geonames;
                    } else {
                        //$scope.updateFail = true;
                    }
                });
            },0,1);
        }

        $scope.getCityCounty = function() {
            $scope.su_cityoptions = [];
            $scope.su_countyoptions = [];
            $interval(function(){
                supplierAddFac.getStates($scope.fmData.su_state).then(function(promise){
                    if(angular.isArray(promise.data.geonames)) {
                        $scope.su_cityoptions = promise.data.geonames;
                        $scope.su_countyoptions = promise.data.geonames;
                    } else {
                        //$scope.updateFail = true;
                    }
                });
            },0,1);
        };
        
        $scope.su_statusoptions = i18nFilter("supplier.fields.su_statusoptions");

        $scope.$on('$viewContentLoaded', function () {
            // this code is executed after the view is loaded
            
            supplierAddFac.getCountries().then(function(promise){
                if(angular.isArray(promise.data.geonames)) {
                    $scope.su_countryoptions = promise.data.geonames;
                } else {
                    //$scope.updateFail = true;
                }
            });

         });
    }];
    
})(angular);
},{}],83:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q', '$alerts', '$stateParams', function ($http, $q, $alerts, $stateParams) {
        var factory = {};
        factory.add = function (su_jsonb) {
            var promise = $http.post('modules/supplier/modules/supplier.add/supplier.add.mdl.add.php', {
                /* POST variables here */
                su_jsonb: su_jsonb
            }).success(function (data, status, headers, config) {
                return data;
            }).error(function (data, status, headers, config) {
                var stackError = JSON.stringify({
                    status: data.status,
                    error: data.error,
                    errorType: data.type,
                    config: config
                }, null, 4);
                $alerts.error('Wooops! an error has ocurred.', stackError);
                return { "status": false };
            });
            return promise;
        };
        factory.getCountries = function () {
            var promise = $http.get('http://api.geonames.org/countryInfoJSON?username=alejandrolsca')
                .success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    var stackError = JSON.stringify({
                        status: data.status,
                        error: data.error,
                        errorType: data.type,
                        config: config
                    }, null, 4);
                    $alerts.error('Wooops! an error has ocurred.', stackError);
                    return { "status": false };
                });
            return promise;
        };
        factory.getStates = function (su_country) {
            var promise = $http.get('http://api.geonames.org/childrenJSON?geonameId=' + su_country + '&username=alejandrolsca')
                .success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    var stackError = JSON.stringify({
                        status: data.status,
                        error: data.error,
                        errorType: data.type,
                        config: config
                    }, null, 4);
                    $alerts.error('Wooops! an error has ocurred.', stackError);
                    return { "status": false };
                });
            return promise;
        };
        factory.getCityCounty = function (su_state) {
            var promise = $http.get('http://api.geonames.org/childrenJSON?geonameId=' + su_state + '&username=alejandrolsca')
                .success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    var stackError = JSON.stringify({
                        status: data.status,
                        error: data.error,
                        errorType: data.type,
                        config: config
                    }, null, 4);
                    $alerts.error('Wooops! an error has ocurred.', stackError);
                    return { "status": false };
                });
            return promise;
        };
        return factory;
    }];

})(angular);
},{}],84:[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.supplier.update',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('supplierUpdate', {
            url:'/supplier/update/:su_id',
            templateUrl : 'modules/supplier/modules/supplier.update/supplier.update.view.html',
            controller : 'supplierUpdateCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('supplierUpdateFac',require('./supplier.update.fac'))

    .controller('supplierUpdateCtrl',require('./supplier.update.ctrl'))

})(angular);
},{"./supplier.update.ctrl":86,"./supplier.update.fac":87}],85:[function(require,module,exports){
module.exports = {
                    "title" : "actualizar proveedor",
                }
},{}],86:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'supplierUpdateFac', '$location', 'i18nFilter', '$interval',
        function ($scope, supplierUpdateFac, $location, i18nFilter, $interval) {

            $scope.onSubmit = function () {

                supplierUpdateFac.update($scope.fmData).then(function (promise) {
                    if (promise.data == "1") {
                        $location.path('/supplier');
                    } else {
                        $scope.updateFail = true;
                    }
                });
            };

            $scope.getStates = function () {
                $scope.su_stateoptions = [];
                $scope.su_cityoptions = [];
                $scope.su_countyoptions = [];
                $interval(function () {
                    supplierUpdateFac.getStates($scope.fmData.su_country).then(function (promise) {
                        if (angular.isArray(promise.data.geonames)) {
                            $scope.su_stateoptions = promise.data.geonames;
                        } else {
                            //$scope.updateFail = true;
                        }
                    });
                }, 0, 1);
            }

            $scope.getCityCounty = function () {
                $scope.su_cityoptions = [];
                $scope.su_countyoptions = [];
                $interval(function () {
                    supplierUpdateFac.getStates($scope.fmData.su_state).then(function (promise) {
                        if (angular.isArray(promise.data.geonames)) {
                            $scope.su_cityoptions = promise.data.geonames;
                            $scope.su_countyoptions = promise.data.geonames;
                        } else {
                            //$scope.updateFail = true;
                        }
                    });
                }, 0, 1);
            }

            $scope.su_statusoptions = i18nFilter("supplier.fields.su_statusoptions");

            $scope.$on('$viewContentLoaded', function () {
                // this code is executed after the view is loaded
                $scope.loading = true;
                supplierUpdateFac.data().then(function (promise) {
                    $scope.loading = false;
                    if (angular.isObject(angular.fromJson(promise.data))) {
                        $scope.fmData = angular.fromJson(promise.data);
                    }
                }).then(function () {
                    supplierUpdateFac.getCountries().then(function (promise) {
                        if (angular.isArray(promise.data.geonames)) {
                            $scope.su_countryoptions = promise.data.geonames;
                        } else {
                            //$scope.updateFail = true;
                        }
                    }).then(function () {
                        supplierUpdateFac.getStates($scope.fmData.su_country).then(function (promise) {
                            if (angular.isArray(promise.data.geonames)) {
                                $scope.su_stateoptions = promise.data.geonames;
                            } else {
                                //$scope.updateFail = true;
                            }
                        })
                    }).then(function () {
                        supplierUpdateFac.getCityCounty($scope.fmData.su_state).then(function (promise) {
                            if (angular.isArray(promise.data.geonames)) {
                                $scope.su_cityoptions = promise.data.geonames;
                                $scope.su_countyoptions = promise.data.geonames;
                            } else {
                                //$scope.updateFail = true;
                            }
                        })
                    });
                });

            });
        }];

})(angular);
},{}],87:[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return ['$http', '$q', '$alerts', '$stateParams', function($http, $q, $alerts, $stateParams){
        var factory = {};
        factory.data = function() {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('modules/supplier/modules/supplier.update/supplier.update.mdl.getsupplier.php', {
                    /* POST variables here */
                    su_id: $stateParams.su_id
                }).success(function(data, status, headers, config){
                    return data;
                }).error(function (data, status, headers, config) {
                    return {"status": false};
                })
            );
            return deferred.promise;
        };
        factory.update = function(su_jsonb) {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('modules/supplier/modules/supplier.update/supplier.update.mdl.update.php', {
                    /* POST variables here */
                    su_id: $stateParams.su_id,
                    su_jsonb: su_jsonb
                }).success(function(data, status, headers, config){
                    return data;
                }).error(function (data, status, headers, config) {
                    return {"status": false};
                })
            );
            return deferred.promise;
        };
        factory.getCountries = function() {
            var promise = $http.get('http://api.geonames.org/countryInfoJSON?username=alejandrolsca')
            .success(function(data, status, headers, config){
                return data;
            }).error(function (data, status, headers, config) {
                return {"status": false};
            });
            return promise;
        };
        factory.getStates = function(su_country) {
            var promise = $http.get('http://api.geonames.org/childrenJSON?geonameId='+su_country+'&username=alejandrolsca')
            .success(function(data, status, headers, config){
                return data;
            }).error(function(data, status, headers, config) {
                return {"status": false};
            });
            return promise;
        };
        factory.getCityCounty = function(su_state) {
            var promise = $http.get('http://api.geonames.org/childrenJSON?geonameId='+su_state+'&username=alejandrolsca')
            .success(function(data, status, headers, config){
                return data;
            }).error(function(data, status, headers, config) {
                return {"status": false};
            });
            return promise;
        };
        return factory;
    }];
    
})(angular);
},{}],88:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'supplierFac', 'i18nFilter',
        function ($scope, supplierFac, i18nFilter) {

            $scope.labels = Object.keys(i18nFilter("supplier.labels"));
            $scope.columns = i18nFilter("supplier.columns");
        
            // formatItem event handler
            var su_id;
            $scope.formatItem = function (s, e, cell) {

                if (e.panel.cellType == wijmo.grid.CellType.RowHeader) {
                    e.cell.textContent = e.row + 1;
                }

                s.rows.defaultSize = 30;
            
                // add Bootstrap html
                if ((e.panel.cellType == wijmo.grid.CellType.Cell) && (e.col == 0)) {
                    su_id = e.panel.getCellData(e.row, 1, false);
                    e.cell.style.overflow = 'visible';
                    e.cell.innerHTML = '<div class="btn-group btn-group-justified" role="group" aria-label="...">\
                                        <div class="btn-group" role="group">\
                                            <a href="#/supplier/update/'+ su_id + '" class="btn btn-default btn-xs" ng-click="edit($item.su_id)">Editar</a>\
                                        </div>\
                                    </div>';
                }
            }
        
            // bind columns when grid is initialized
            $scope.initGrid = function (s, e) {
                for (var i = 0; i < $scope.labels.length; i++) {
                    var col = new wijmo.grid.Column();
                    col.binding = $scope.columns[i];
                    col.header = i18nFilter("supplier.labels." + $scope.labels[i]);
                    col.wordWrap = false;
                    col.width = 150;
                    s.columns.push(col);
                }
            };
            // create the tooltip object
            $scope.$watch('ggGrid', function () {
                if ($scope.ggGrid) {
                    
                    // store reference to grid
                    var flex = $scope.ggGrid;

                    // create tooltip
                    var tip = new wijmo.Tooltip(),
                        rng = null;

                    // monitor the mouse over the grid
                    flex.hostElement.addEventListener('mousemove', function (evt) {
                        var ht = flex.hitTest(evt);
                        if (!ht.cellRange.equals(rng)) {

                            // new cell selected, show tooltip
                            if (ht.cellType == wijmo.grid.CellType.Cell) {
                                rng = ht.cellRange;
                                var col = flex.columns[rng.col].header;
                                var cellElement = document.elementFromPoint(evt.clientX, evt.clientY),
                                    cellBounds = wijmo.Rect.fromBoundingRect(cellElement.getBoundingClientRect()),
                                    data = wijmo.escapeHtml(flex.getCellData(rng.row, rng.col, true)),
                                    tipContent = col + ': "<b>' + data + '</b>"';
                                if (cellElement.className.indexOf('wj-cell') > -1) {
                                    tip.show(flex.hostElement, tipContent, cellBounds);
                                } else {
                                    tip.hide(); // cell must be behind scroll bar...
                                }
                            }
                        }
                    });
                    flex.hostElement.addEventListener('mouseout', function () {
                        tip.hide();
                        rng = null;
                    });
                }
            });

            $scope.$on('$viewContentLoaded', function () {
                // this code is executed after the view is loaded
                $scope.loading = true;
                supplierFac.data().then(function (promise) {
                    $scope.loading = false;
                    if (angular.isArray(promise.data)) {
                        $scope.data = new wijmo.collections.CollectionView(promise.data);
                    }
                });
            });
        }];

})(angular);
},{}],89:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q', '$alerts', function ($http, $q, $alerts) {
        var factory = {};
        factory.data = function () {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('modules/supplier/supplier.mdl.getsuppliers.php', {
                    /* POST variables here */
                    procces_id: new Date().getMilliseconds()
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    var stackError = JSON.stringify({
                        status: data.status,
                        error: data.error,
                        errorType: data.type,
                        config: config
                    }, null, 4);
                    $alerts.error('Wooops! an error has ocurred.', stackError);
                    return { "status": false };
                })
                );
            return deferred.promise;
        };
        return factory;
    }];

})(angular);
},{}],90:[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.user',[
        require('./modules/user.add').name,
        require('./modules/user.update').name,
        require('./modules/user.profile').name
    ])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('user', {
            url:'/user',
            templateUrl : 'modules/user/user.view.html',
            controller : 'userCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('userFac',require('./user.fac'))

    .controller('userCtrl',require('./user.ctrl'))

})(angular);
},{"./modules/user.add":92,"./modules/user.profile":96,"./modules/user.update":99,"./user.ctrl":103,"./user.fac":104}],91:[function(require,module,exports){
module.exports = {
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
                }
},{}],92:[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.user.add',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('userAdd', {
            url:'/user/add',
            templateUrl : 'modules/user/modules/user.add/user.add.view.html',
            controller : 'userAddCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('userAddFac',require('./user.add.fac'))

    .controller('userAddCtrl',require('./user.add.ctrl'))
    
})(angular);

},{"./user.add.ctrl":94,"./user.add.fac":95}],93:[function(require,module,exports){
module.exports = {
                    "title" : "agregar usuario",
                }
},{}],94:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'userAddFac', '$location',
        function ($scope, userAddFac, $location) {

            $scope.onSubmit = function () {

                userAddFac.add($scope.fmData).then(function (promise) {
                    if (promise.data == "1") {
                        $location.path('/user');
                    } else {
                        $scope.updateFail = true;
                    }
                });
            };

            $scope.$on('$viewContentLoaded', function () {
                // this code is executed after the view is loaded
            });
        }];

})(angular);
},{}],95:[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return ['$http', '$q', '$alerts', '$stateParams',
    function($http, $q, $alerts, $stateParams){
        var factory = {};
        factory.add = function(us_jsonb) {
            var promise = $http.post('modules/user/modules/user.add/user.add.model.php', {
                    /* POST variables here */
                    us_jsonb: us_jsonb
            }).success(function(data, status, headers, config){
                return data;
            }).error(function (data, status, headers, config) {
                return {"status": false};
            });
            return promise;
        };
        return factory;
    }];
    
})(angular);
},{}],96:[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.user.profile',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('userProfile', {
            url:'/user/profile',
            templateUrl : 'modules/user/modules/user.profile/user.profile.view.html',
            controller : 'userProfileCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .controller('userProfileCtrl',require('./user.profile.ctrl'))
    
})(angular);

},{"./user.profile.ctrl":98}],97:[function(require,module,exports){
module.exports = {
                    "title" : "perfil del usuario",
                }
},{}],98:[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return ['$scope', '$location', 'i18nFilter', '$rootScope',
    function ($scope, $location, i18nFilter, $rootScope) {
        $scope.user = $rootScope.user;
        $scope.$on('$viewContentLoaded', function () {
            // this code is executed after the view is loaded
         });
    }];
    
})(angular);
},{}],99:[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.user.update',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('userUpdate', {
            url:'/user/update/:us_id',
            templateUrl : 'modules/user/modules/user.update/user.update.view.html',
            controller : 'userUpdateCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('userUpdateFac',require('./user.update.fac'))

    .controller('userUpdateCtrl',require('./user.update.ctrl'))

})(angular);
},{"./user.update.ctrl":101,"./user.update.fac":102}],100:[function(require,module,exports){
module.exports = {
                    "title" : "actualizar usuario",
                }
},{}],101:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'userUpdateFac', '$location',
        function ($scope, userUpdateFac, $location) {

            $scope.onSubmit = function () {

                userUpdateFac.update($scope.fmData).then(function (promise) {
                    if (promise.data == "1") {
                        $location.path('/user');
                    } else {
                        $scope.updateFail = true;
                    }
                });
            };

            $scope.$on('$viewContentLoaded', function () {
                // this code is executed after the view is loaded

                $scope.loading = true;
                userUpdateFac.data().then(function (promise) {
                    $scope.loading = false;
                    if (angular.isObject(angular.fromJson(promise.data))) {
                        $scope.fmData = angular.fromJson(promise.data);
                    }
                });



            });
        }];

})(angular);
},{}],102:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q', '$alerts', '$stateParams', function ($http, $q, $alerts, $stateParams) {
        var factory = {};
        factory.data = function () {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('modules/user/modules/user.update/user.update.mdl.getUser.php', {
                    /* POST variables here */
                    us_id: $stateParams.us_id
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    var stackError = JSON.stringify({
                        status: data.status,
                        error: data.error,
                        errorType: data.type,
                        config: config
                    }, null, 4);
                    $alerts.error('Wooops! an error has ocurred.', stackError);
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        factory.update = function (us_jsonb) {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('modules/user/modules/user.update/user.update.mdl.update.php', {
                    /* POST variables here */
                    us_id: $stateParams.us_id,
                    us_jsonb: us_jsonb
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    var stackError = JSON.stringify({
                        status: data.status,
                        error: data.error,
                        errorType: data.type,
                        config: config
                    }, null, 4);
                    $alerts.error('Wooops! an error has ocurred.', stackError);
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        return factory;
    }];

})(angular);
},{}],103:[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return ['$scope', 'userFac', 'i18nFilter',
    function ($scope, userFac, i18nFilter) {
        
        $scope.labels = Object.keys(i18nFilter("user.labels"));
        $scope.columns = i18nFilter("user.columns");

        $scope.edit = function (id) {
            if (angular.isNumber(id)) {
                    //Embed the id to the link
                    var link = "#/user/update/" + id;
                    //Open the link
                    window.location = link;
            }
        }

        $scope.duplicate = function (id) {
            if (angular.isNumber(id)) {
                    var link = "#/user/duplicate/" + id;
                    //Open the link
                    window.location = link;
            }
        }
        
        // bind columns when grid is initialized
        $scope.initGrid = function(s, e) {
            for (var i = 0; i < $scope.labels.length; i++) {
                var col = new wijmo.grid.Column();
                col.binding = $scope.columns[i];
                col.header = i18nFilter("user.labels." + $scope.labels[i]);
                s.columns.push(col);
            }
        };

        $scope.$on('$viewContentLoaded', function () {
            // this code is executed after the view is loaded
            $scope.loading = true;
            userFac.data().then(function(promise){
                $scope.loading = false;
                if(angular.isArray(promise.data)) {
                    $scope.data = new wijmo.collections.CollectionView(promise.data);
                }
            });
         });
    }];
    
})(angular);
},{}],104:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q', '$alerts', function ($http, $q, $alerts) {
        var factory = {};
        factory.data = function () {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('modules/user/user.mdl.getUsers.php', {
                    /* POST variables here */
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    var stackError = JSON.stringify({
                        status: data.status,
                        error: data.error,
                        errorType: data.type,
                        config: config
                    }, null, 4);
                    $alerts.error('Wooops! an error has ocurred.', stackError);
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        return factory;
    }];

})(angular);
},{}],105:[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.wo',[
        require('./modules/wo.add').name,
        require('./modules/wo.update').name,
        require('./modules/wo.duplicate').name
    ])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('wo', {
            url:'/wo/:cl_id',
            templateUrl : 'modules/wo/wo.view.html',
            controller : 'woController',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('woFactory',require('./wo.fac'))

    .controller('woController',require('./wo.ctrl'))

})(angular);
},{"./modules/wo.add":107,"./modules/wo.duplicate":111,"./modules/wo.update":114,"./wo.ctrl":118,"./wo.fac":119}],106:[function(require,module,exports){
module.exports = {
    "title": "Ordenes de Trabajo",
    "labels": {
        "wo-id": "No. orden",
        "cl-id": "cliente",
        "zo-id": "zona",
        "wo-orderedby": "Ordenado por",
        "wo-attention": "Atención",
        "ma-id": "Maquina",
        "wo-release": "Release",
        "wo-po": "Orden de compra",
        "wo-line": "Linea",
        "wo-linetotal": "De",
        "pr-id": "Producto",
        "wo-qty": "Cantidad",
        "wo-packageqty": "Cantidad x paquete",
        "wo-excedentqty": "Excedente",
        "wo-foliosperformat": "Folios x formato",
        "wo-foliosseries": "Serie",
        "wo-foliosfrom": "Del",
        "wo-foliosto": "Al",
        "wo-type": "Tipo",
        "wo-commitmentdate": "Fecha compromiso",
        "wo-previousid": "ID anterior",
        "wo-previousdate": "Fecha anterior",
        "wo-notes": "Notas",
        "wo-price": "Precio",
        "wo-currency": "Moneda",
        "wo-email": "Enviar Correo",
        "wo-status": "Estatus",
        "wo-date": "Fecha"
    },
    "columns": [
        "wo_id",
        "cl_id",
        "zo_id",
        "wo_orderedby",
        "wo_attention",
        "ma_id",
        "wo_release",
        "wo_po",
        "wo_line",
        "wo_linetotal",
        "pr_id",
        "wo_qty",
        "wo_packageqty",
        "wo_excedentqty",
        "wo_foliosperformat",
        "wo_foliosseries",
        "wo_foliosfrom",
        "wo_foliosto",
        "wo_type",
        "wo_commitmentdate",
        "wo_previousid",
        "wo_previousdate",
        "wo_notes",
        "wo_price",
        "wo_currency",
        "wo_email",
        "wo_status",
        "wo_date"
    ]
}
},{}],107:[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.wo.add',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('woAdd', {
            url:'/wo/add/:cl_id',
            templateUrl : 'modules/wo/modules/wo.add/wo.add.view.html',
            controller : 'woAddController',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('woAddFactory',require('./wo.add.fac'))

    .controller('woAddController',require('./wo.add.ctrl'))

})(angular);
},{"./wo.add.ctrl":109,"./wo.add.fac":110}],108:[function(require,module,exports){
module.exports = {
    "title": "Agregar Orden de Trabajo",
    "labels": {
        "cl-id": "cliente",
        "zo-id": "zona",
        "wo-orderedby": "Ordenado por",
        "wo-attention": "Atención",
        "ma-id": "Maquina",
        "wo-release": "Release",
        "wo-po": "Orden de compra",
        "wo-line": "Linea",
        "wo-linetotal": "De",
        "pr-id": "Producto",
        "pr-partno": "No. de parte",
        "pr-code": "Codigo",
        "pr-name": "Nombre",
        "wo-qty": "Cantidad",
        "wo-packageqty": "Cantidad x paquete",
        "wo-excedentqty": "Excedente",
        "wo-foliosperformat": "Folios x formato",
        "wo-foliosseries": "Serie",
        "wo-foliosfrom": "Del",
        "wo-foliosto": "Al",
        "wo-type": "Tipo",
        "wo-id": "No. orden",
        "wo-date": "Fecha",
        "wo-commitmentdate": "Fecha compromiso",
        "wo-previousid": "ID anterior",
        "wo-previousdate": "Fecha anterior",
        "wo-notes": "Notas",
        "wo-price": "Precio",
        "wo-currency": "Moneda",
        "wo-email": "Enviar Correo",
        "wo-status": "Estatus"
    },
    "columns": [
        "cl_id",
        "zo_id",
        "wo_orderedby",
        "wo_attention",
        "ma_id",
        "wo_release",
        "wo_po",
        "wo_line",
        "wo_linetotal",
        "pr_id",
        "pr_partno",
        "pr_code",
        "pr_name",
        "wo_qty",
        "wo_packageqty",
        "wo_excedentqty",
        "wo_foliosperformat",
        "wo_foliosseries",
        "wo_foliosfrom",
        "wo_foliosto",
        "wo_type",
        "wo_id",
        "wo_date",
        "wo_commitmentdate",
        "wo_previousid",
        "wo_previousdate",
        "wo_notes",
        "wo_price",
        "wo_currency",
        "wo_email",
        "wo-status"
    ],
    "fields": {
        wo_foliosperformatoptions: [
            { "label": "1", "value": 1 },
            { "label": "2", "value": 2 },
            { "label": "3", "value": 3 },
            { "label": "4", "value": 4 },
            { "label": "5", "value": 5 },
            { "label": "6", "value": 6 },
            { "label": "7", "value": 7 },
            { "label": "8", "value": 8 },
        ],
        wo_currencyoptions: [
            { "label": "MXN", "value": "MXN" },
            { "label": "DLLS", "value": "DLLS" },
        ],
        wo_emailoptions: [
            { "label": "SI", "value": "yes" },
            { "label": "NO", "value": "no" },
        ]
    }
}
},{}],109:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'woAddFactory', '$stateParams', 'i18nFilter', '$filter',
        function ($scope, woAddFactory, $stateParams, i18nFilter, $filter) {
            $scope.fmData = {};
            //$scope.fmData = {"zo_id": "2", "wo_orderedby": "Alejandro", "wo_attention": "Marco", "ma_id": 1, "wo_release": "rel001", "wo_po": "ABC001", "wo_line": "1", "wo_linetotal": "4", "pr_id": "15", "wo_qty": "100", "wo_packageqty": "10", "wo_excedentqty": "10", "wo_foliosperformat": 1, "wo_foliosseries": "A", "wo_foliosfrom": "1", "wo_foliosto": "100", "wo_commitmentdate": "2016-07-01", "wo_notes": "Esta es una orden de prueba", "wo_price": "99.99", "wo_currency": "DLLS", "wo_email": "yes" };
            $scope.fmData.wo_type = "N"; //N-new,R-rep,C-change
            $scope.fmData.wo_status = "A"; //A-Active, C-Cancelled
            $scope.fmData.cl_id = $stateParams.cl_id;

            $scope.wo_foliosperformatoptions = i18nFilter("wo-add.fields.wo_foliosperformatoptions");
            $scope.wo_currencyoptions = i18nFilter("wo-add.fields.wo_currencyoptions");
            $scope.wo_emailoptions = i18nFilter("wo-add.fields.wo_emailoptions");
            
            $scope.onSubmit = function () {

                woAddFactory.add($scope.fmData).then(function (promise) {
                    if (promise.data.rowCount == 1) {
                        $location.path('/wo/'+$stateParams.cl_id);
                    } else {
                        $scope.updateFail = true;
                    }
                });
            };

            $scope.$on('$viewContentLoaded', function () {
                // this code is executed after the view is loaded
                $scope.loading = true;
                woAddFactory.getZone().then(function (promise) {
                    $scope.zo_idoptions = [];
                    if (angular.isArray(promise.data)) {
                        var rows = promise.data;
                        angular.forEach(rows, function (value, key) {
                            this.push({ "label": rows[key]['zo_jsonb']['zo_name'], "value": rows[key]['zo_id'] });
                        }, $scope.zo_idoptions);
                    }
                });
                woAddFactory.getMachine().then(function (promise) {
                    $scope.ma_idoptions = [];
                    if (angular.isArray(promise.data)) {
                        var rows = promise.data;
                        angular.forEach(rows, function (value, key) {
                            this.push({ "label": rows[key]['ma_jsonb']['ma_name'], "value": rows[key]['ma_id'] });
                        }, $scope.ma_idoptions);
                    }
                });
                woAddFactory.getProduct().then(function (promise) {
                    $scope.pr_idoptions = [];
                    var rows = [];
                    if (angular.isArray(promise.data)) {
                        rows = promise.data;
                        angular.forEach(rows, function (value, key) {
                            this.push({ "label": rows[key]['pr_id'] + '_' + rows[key]['pr_jsonb']['pr_name'] + '_' + rows[key]['pr_jsonb']['pr_code'], "value": rows[key]['pr_id'] });
                        }, $scope.pr_idoptions);
                    }
                    
                    $scope.$watch(
                        "fmData.pr_id",
                        function prChange( newValue, oldValue ) {
                            var product = $filter('filter')(rows, { "pr_id": newValue }, true);
                            if (product.length !== 1) {
                                $scope.prinfo = false;
                                return;
                            } else {
                                $scope.prinfo = true;
                                $scope.product = product[0];
                                $scope.folio = (product[0]['pr_jsonb']['pr_folio']==='yes') ? true : false;
                            }
                        }
                    );
                });
                $scope.loading = false;
            });
        }];

})(angular);
},{}],110:[function(require,module,exports){
module.exports = (function(angular) {
    'use strict';

    return ['$http', '$q', '$alerts', '$stateParams', function($http, $q, $alerts, $stateParams) {
        var factory = {};
        factory.getZone = function() {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/zone/cl_id', {
                    /* POST variables here */
                    cl_id: $stateParams.cl_id
                }).success(function(data, status, headers, config) {
                    return data;
                }).error(function(data, status, headers, config) {
                    var stackError = JSON.stringify({
                        status: data.status,
                        error: data.error,
                        errorType: data.type,
                        config: config
                    }, null, 4);
                    $alerts.error('Wooops! an error has ocurred.', stackError);
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        factory.getMachine = function() {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/machine', {
                    /* POST variables here */
                    cl_id: $stateParams.cl_id
                }).success(function(data, status, headers, config) {
                    return data;
                }).error(function(data, status, headers, config) {
                    var stackError = JSON.stringify({
                        status: data.status,
                        error: data.error,
                        errorType: data.type,
                        config: config
                    }, null, 4);
                    $alerts.error('Wooops! an error has ocurred.', stackError);
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        factory.getProduct = function() {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/product/cl_id', {
                    /* POST variables here */
                    cl_id: $stateParams.cl_id,
                    pr_status: 'A'
                }).success(function(data, status, headers, config) {
                    return data;
                }).error(function(data, status, headers, config) {
                    var stackError = JSON.stringify({
                        status: data.status,
                        error: data.error,
                        errorType: data.type,
                        config: config
                    }, null, 4);
                    $alerts.error('Wooops! an error has ocurred.', stackError);
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        factory.add = function(wo_jsonb) {
            var promise = $http.post('/wo/add', {
                /* POST variables here */
                wo_jsonb: wo_jsonb
            }).success(function(data, status, headers, config) {
                return data;
            }).error(function(data, status, headers, config) {
                var stackError = JSON.stringify({
                        status: data.status,
                        error: data.error,
                        errorType: data.type,
                        config: config
                    }, null, 4);
                    $alerts.error('Wooops! an error has ocurred.', stackError);
                    return { "status": false };
            });
            return promise;
        };
        return factory;
    }];

})(angular);
},{}],111:[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.wo.duplicate',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('woDuplicate', {
            url:'/wo/duplicate/:cl_id/:wo_id',
            templateUrl : 'modules/wo/modules/wo.duplicate/wo.duplicate.view.html',
            controller : 'woDuplicateController',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('woDuplicateFactory',require('./wo.duplicate.fac'))

    .controller('woDuplicateController',require('./wo.duplicate.ctrl'))

})(angular);
},{"./wo.duplicate.ctrl":112,"./wo.duplicate.fac":113}],112:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'woDuplicateFactory', '$stateParams', 'i18nFilter', '$filter',
        function ($scope, woDuplicateFactory, $stateParams, i18nFilter, $filter) {

            $scope.wo_foliosperformatoptions = i18nFilter("wo-add.fields.wo_foliosperformatoptions");
            $scope.wo_currencyoptions = i18nFilter("wo-add.fields.wo_currencyoptions");
            $scope.wo_emailoptions = i18nFilter("wo-add.fields.wo_emailoptions");
            
            $scope.onSubmit = function () {

                woDuplicateFactory.add($scope.fmData).then(function (promise) {
                    if (promise.data.rowCount == 1) {
                        $location.path('/wo/'+$stateParams.cl_id);
                    } else {
                        $scope.updateFail = true;
                    }
                });
            };

            $scope.$on('$viewContentLoaded', function () {
                // this code is executed after the view is loaded
                $scope.loading = true;
                woDuplicateFactory.getData().then(function(promise){
                    $scope.loading = false;
                    if(angular.isArray(promise.data) && promise.data.length === 1) {
                            $scope.fmData = promise.data[0].wo_jsonb;
                            $scope.fmData.wo_previousid = promise.data[0].wo_id;
                            $scope.fmData.wo_previousdate = promise.data[0].wo_date.substring(0, 10);
                    }
                });
                woDuplicateFactory.getZone().then(function (promise) {
                    $scope.zo_idoptions = [];
                    if (angular.isArray(promise.data)) {
                        var rows = promise.data;
                        angular.forEach(rows, function (value, key) {
                            this.push({ "label": rows[key]['zo_jsonb']['zo_name'], "value": rows[key]['zo_id'] });
                        }, $scope.zo_idoptions);
                    }
                });
                woDuplicateFactory.getMachine().then(function (promise) {
                    $scope.ma_idoptions = [];
                    if (angular.isArray(promise.data)) {
                        var rows = promise.data;
                        angular.forEach(rows, function (value, key) {
                            this.push({ "label": rows[key]['ma_jsonb']['ma_name'], "value": rows[key]['ma_id'] });
                        }, $scope.ma_idoptions);
                    }
                });
                woDuplicateFactory.getProduct().then(function (promise) {
                    $scope.pr_idoptions = [];
                    var rows = [];
                    if (angular.isArray(promise.data)) {
                        rows = promise.data;
                        angular.forEach(rows, function (value, key) {
                            this.push({ "label": rows[key]['pr_id'] + '_' + rows[key]['pr_jsonb']['pr_name'] + '_' + rows[key]['pr_jsonb']['pr_code'], "value": rows[key]['pr_id'] });
                        }, $scope.pr_idoptions);
                    }
                    
                    $scope.$watch(
                        "fmData.pr_id",
                        function prChange( newValue, oldValue ) {
                            var product = $filter('filter')(rows, { "pr_id": newValue }, true);
                            if (product.length > 1) {
                                $scope.prinfo = false;
                                return;
                            } else {
                                $scope.prinfo = true;
                                $scope.product = product[0];
                                $scope.folio = (product[0]['pr_jsonb']['pr_folio']==='yes') ? true : false;
                            }
                        }
                    );
                });
                $scope.loading = false;
            });
        }];

})(angular);
},{}],113:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q', '$alerts', '$stateParams', function ($http, $q, $alerts, $stateParams) {
        var factory = {};
        factory.getData = function () {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/wo/wo_id', {
                    /* POST variables here */
                    cl_id: $stateParams.cl_id,
                    wo_id: $stateParams.wo_id
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    var stackError = JSON.stringify({
                        status: data.status,
                        error: data.error,
                        errorType: data.type,
                        config: config
                    }, null, 4);
                    $alerts.error('Wooops! an error has ocurred.', stackError);
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        factory.getZone = function () {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/zone/cl_id', {
                    /* POST variables here */
                    cl_id: $stateParams.cl_id
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    var stackError = JSON.stringify({
                        status: data.status,
                        error: data.error,
                        errorType: data.type,
                        config: config
                    }, null, 4);
                    $alerts.error('Wooops! an error has ocurred.', stackError);
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        factory.getMachine = function () {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/machine', {
                    /* POST variables here */
                    cl_id: $stateParams.cl_id
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    var stackError = JSON.stringify({
                        status: data.status,
                        error: data.error,
                        errorType: data.type,
                        config: config
                    }, null, 4);
                    $alerts.error('Wooops! an error has ocurred.', stackError);
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        factory.getProduct = function () {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/product/cl_id', {
                    /* POST variables here */
                    cl_id: $stateParams.cl_id,
                    pr_status: 'A'
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    var stackError = JSON.stringify({
                        status: data.status,
                        error: data.error,
                        errorType: data.type,
                        config: config
                    }, null, 4);
                    $alerts.error('Wooops! an error has ocurred.', stackError);
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        factory.add = function (wo_jsonb) {
            var promise = $http.post('/wo/add', {
                /* POST variables here */
                wo_jsonb: wo_jsonb
            }).success(function (data, status, headers, config) {
                console.log(JSON.stringify(config))
                return data;
            }).error(function (data, status, headers, config) {
                console.log(JSON.stringify(config))
                var stackError = JSON.stringify({
                    status: data.status,
                    error: data.error,
                    errorType: data.type,
                    config: config
                }, null, 4);
                $alerts.error('Wooops! an error has ocurred.', stackError);
                return { "status": false };
            });
            return promise;
        };
        return factory;
    }];

})(angular);
},{}],114:[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.wo.update',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('woUpdate', {
            url:'/wo/update/:cl_id/:wo_id',
            templateUrl : 'modules/wo/modules/wo.update/wo.update.view.html',
            controller : 'woUpdateController',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('woUpdateFactory',require('./wo.update.fac'))

    .controller('woUpdateController',require('./wo.update.ctrl'))

})(angular);
},{"./wo.update.ctrl":116,"./wo.update.fac":117}],115:[function(require,module,exports){
module.exports = {
    "title": "Actualizar Orden de Trabajo",
    "labels": {
        "cl-id": "cliente",
        "zo-id": "zona",
        "wo-orderedby": "Ordenado por",
        "wo-attention": "Atención",
        "ma-id": "Maquina",
        "wo-release": "Release",
        "wo-po": "Orden de compra",
        "wo-line": "Linea",
        "wo-linetotal": "De",
        "pr-id": "Producto",
        "pr-partno": "No. de parte",
        "pr-code": "Codigo",
        "pr-name": "Nombre",
        "wo-qty": "Cantidad",
        "wo-packageqty": "Cantidad x paquete",
        "wo-excedentqty": "Excedente",
        "wo-foliosperformat": "Folios x formato",
        "wo-foliosseries": "Serie",
        "wo-foliosfrom": "Del",
        "wo-foliosto": "Al",
        "wo-type": "Tipo",
        "wo-id": "No. orden",
        "wo-date": "Fecha",
        "wo-commitmentdate": "Fecha compromiso",
        "wo-previousid": "ID anterior",
        "wo-previousdate": "Fecha anterior",
        "wo-notes": "Notas",
        "wo-price": "Precio",
        "wo-currency": "Moneda",
        "wo-email": "Enviar Correo",
        "wo-status": "Estatus"
    },
    "columns": [
        "cl_id",
        "zo_id",
        "wo_orderedby",
        "wo_attention",
        "ma_id",
        "wo_release",
        "wo_po",
        "wo_line",
        "wo_linetotal",
        "pr_id",
        "pr_partno",
        "pr_code",
        "pr_name",
        "wo_qty",
        "wo_packageqty",
        "wo_excedentqty",
        "wo_foliosperformat",
        "wo_foliosseries",
        "wo_foliosfrom",
        "wo_foliosto",
        "wo_type",
        "wo_id",
        "wo_date",
        "wo_commitmentdate",
        "wo_previousid",
        "wo_previousdate",
        "wo_notes",
        "wo_price",
        "wo_currency",
        "wo_email",
        "wo-status"
    ],
    "fields": {
        wo_foliosperformatoptions: [
            { "label": "1", "value": 1 },
            { "label": "2", "value": 2 },
            { "label": "3", "value": 3 },
            { "label": "4", "value": 4 },
            { "label": "5", "value": 5 },
            { "label": "6", "value": 6 },
            { "label": "7", "value": 7 },
            { "label": "8", "value": 8 },
        ],
        wo_currencyoptions: [
            { "label": "MXN", "value": "MXN" },
            { "label": "DLLS", "value": "DLLS" },
        ],
        wo_emailoptions: [
            { "label": "SI", "value": "yes" },
            { "label": "NO", "value": "no" },
        ]
    }
}
},{}],116:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'woUpdateFactory', '$stateParams', 'i18nFilter', '$filter','$location',
        function ($scope, woUpdateFactory, $stateParams, i18nFilter, $filter, $location) {
            
            $scope.wo_foliosperformatoptions = i18nFilter("wo-add.fields.wo_foliosperformatoptions");
            $scope.wo_currencyoptions = i18nFilter("wo-add.fields.wo_currencyoptions");
            $scope.wo_emailoptions = i18nFilter("wo-add.fields.wo_emailoptions");
            
            $scope.onSubmit = function () {

                woUpdateFactory.update($scope.fmData).then(function (promise) {
                    if (promise.data.rowCount === 1) {
                        $location.path('/wo/'+$stateParams.cl_id);
                    } else {
                        $scope.updateFail = true;
                    }
                });
            };

            $scope.$on('$viewContentLoaded', function () {
                // this code is executed after the view is loaded
                $scope.loading = true;
                woUpdateFactory.getData().then(function(promise){
                    $scope.loading = false;
                    if(angular.isArray(promise.data) && promise.data.length === 1) {
                            $scope.fmData = promise.data[0].wo_jsonb;
                            $scope.wo_id = promise.data[0].wo_id;
                            $scope.wo_date = promise.data[0].wo_date;
                    }
                });
                woUpdateFactory.getZone().then(function (promise) {
                    $scope.zo_idoptions = [];
                    if (angular.isArray(promise.data)) {
                        var rows = promise.data;
                        angular.forEach(rows, function (value, key) {
                            this.push({ "label": rows[key]['zo_jsonb']['zo_name'], "value": rows[key]['zo_id'] });
                        }, $scope.zo_idoptions);
                    }
                });
                woUpdateFactory.getMachine().then(function (promise) {
                    $scope.ma_idoptions = [];
                    if (angular.isArray(promise.data)) {
                        var rows = promise.data;
                        angular.forEach(rows, function (value, key) {
                            this.push({ "label": rows[key]['ma_jsonb']['ma_name'], "value": rows[key]['ma_id'] });
                        }, $scope.ma_idoptions);
                    }
                });
                woUpdateFactory.getProduct().then(function (promise) {
                    $scope.pr_idoptions = [];
                    var rows = [];
                    if (angular.isArray(promise.data)) {
                        rows = promise.data;
                        angular.forEach(rows, function (value, key) {
                            this.push({ "label": rows[key]['pr_id'] + '_' + rows[key]['pr_jsonb']['pr_name'] + '_' + rows[key]['pr_jsonb']['pr_code'], "value": rows[key]['pr_id'] });
                        }, $scope.pr_idoptions);
                    }
                    
                    $scope.$watch(
                        "fmData.pr_id",
                        function prChange( newValue, oldValue ) {
                            var product = $filter('filter')(rows, { "pr_id": newValue }, true);
                            if (product.length > 1) {
                                $scope.prinfo = false;
                                return;
                            } else {
                                $scope.prinfo = true;
                                $scope.product = product[0];
                                $scope.folio = (product[0]['pr_jsonb']['pr_folio']==='yes') ? true : false;
                            }
                        }
                    );
                });
                $scope.loading = false;
            });
        }];

})(angular);
},{}],117:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q', '$alerts', '$stateParams', function ($http, $q, $alerts, $stateParams) {
        var factory = {};
        factory.getData = function () {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/wo/wo_id', {
                    /* POST variables here */
                    cl_id: $stateParams.cl_id,
                    wo_id: $stateParams.wo_id
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    var stackError = JSON.stringify({
                        status: data.status,
                        error: data.error,
                        errorType: data.type,
                        config: config
                    }, null, 4);
                    $alerts.error('Wooops! an error has ocurred.', stackError);
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        factory.getZone = function () {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/zone/cl_id', {
                    /* POST variables here */
                    cl_id: $stateParams.cl_id
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    var stackError = JSON.stringify({
                        status: data.status,
                        error: data.error,
                        errorType: data.type,
                        config: config
                    }, null, 4);
                    $alerts.error('Wooops! an error has ocurred.', stackError);
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        factory.getMachine = function () {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/machine', {
                    /* POST variables here */
                    cl_id: $stateParams.cl_id
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    var stackError = JSON.stringify({
                        status: data.status,
                        error: data.error,
                        errorType: data.type,
                        config: config
                    }, null, 4);
                    $alerts.error('Wooops! an error has ocurred.', stackError);
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        factory.getProduct = function () {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/product/cl_id', {
                    /* POST variables here */
                    cl_id: $stateParams.cl_id,
                    pr_status: 'A'
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    var stackError = JSON.stringify({
                        status: data.status,
                        error: data.error,
                        errorType: data.type,
                        config: config
                    }, null, 4);
                    $alerts.error('Wooops! an error has ocurred.', stackError);
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        factory.update = function (wo_jsonb) {
            var promise = $http.post('/wo/update', {
                /* POST variables here */
                wo_jsonb: wo_jsonb,
                wo_id: $stateParams.wo_id
            }).success(function (data, status, headers, config) {
                return data;
            }).error(function (data, status, headers, config) {
                var stackError = JSON.stringify({
                    status: data.status,
                    error: data.error,
                    errorType: data.type,
                    config: config
                }, null, 4);
                $alerts.error('Wooops! an error has ocurred.', stackError);
                return { "status": false };
            });
            return promise;
        };
        return factory;
    }];

})(angular);
},{}],118:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'woFactory', '$location', 'i18nFilter', '$stateParams',
        function ($scope, woFactory, $location, i18nFilter, $stateParams) {
            
            $scope.labels = Object.keys(i18nFilter("wo.labels"));
            $scope.columns = i18nFilter("wo.columns");

            $scope.edit = function (id) {
                if (angular.isNumber(id)) {
                    var link = "#/wo/update/" + id;
                    window.location = link;
                }
            };

            $scope.duplicate = function (id) {
                if (angular.isNumber(id)) {
                    var link = "#/wo/duplicate/" + id;
                    window.location = link;
                }
            };
            
            // formatItem event handler
            var wo_id;
            $scope.formatItem = function (s, e, cell) {

                if (e.panel.cellType == wijmo.grid.CellType.RowHeader) {
                    e.cell.textContent = e.row + 1;
                }

                s.rows.defaultSize = 30;
            
                // add Bootstrap html
                if ((e.panel.cellType == wijmo.grid.CellType.Cell) && (e.col == 0)) {
                    wo_id = e.panel.getCellData(e.row, 1, false);
                    e.cell.style.overflow = 'visible';
                    e.cell.innerHTML = '<div class="btn-group btn-group-justified" role="group" aria-label="...">\
                                            <div class="btn-group" role="group">\
                                                <a href="#/wo/update/' + $stateParams.cl_id + '/' + wo_id + '" class="btn btn-default btn-xs">' + i18nFilter("general.labels.edit") + '</a>\
                                            </div>\
                                            <div class="btn-group" role="group">\
                                                <a href="#/wo/duplicate/' + $stateParams.cl_id + '/' + wo_id + '" class="btn btn-default btn-xs">' + i18nFilter("general.labels.duplicate") + '</a>\
                                            </div>\
                                       </div>';
                }
            }
        
            // bind columns when grid is initialized
            $scope.initGrid = function (s, e) {
                for (var i = 0; i < $scope.columns.length; i++) {
                    var col = new wijmo.grid.Column();
                    col.binding = $scope.columns[i];
                    col.header = i18nFilter("wo.labels." + $scope.labels[i]);
                    s.columns.push(col);
                }
            };
        
            // create the tooltip object
            $scope.$watch('ggGrid', function () {
                if ($scope.ggGrid) {

                    // store reference to grid
                    var flex = $scope.ggGrid;

                    // create tooltip
                    var tip = new wijmo.Tooltip(),
                        rng = null;

                    // monitor the mouse over the grid
                    flex.hostElement.addEventListener('mousemove', function (evt) {
                        var ht = flex.hitTest(evt);
                        if (!ht.cellRange.equals(rng)) {

                            // new cell selected, show tooltip
                            if (ht.cellType == wijmo.grid.CellType.Cell) {
                                rng = ht.cellRange;
                                var col = flex.columns[rng.col].header;
                                var cellElement = document.elementFromPoint(evt.clientX, evt.clientY),
                                    cellBounds = wijmo.Rect.fromBoundingRect(cellElement.getBoundingClientRect()),
                                    data = wijmo.escapeHtml(flex.getCellData(rng.row, rng.col, true)),
                                    tipContent = col + ': "<b>' + data + '</b>"';
                                if (cellElement.className.indexOf('wj-cell') > -1) {
                                    tip.show(flex.hostElement, tipContent, cellBounds);
                                } else {
                                    tip.hide(); // cell must be behind scroll bar...
                                }
                            }
                        }
                    });
                    flex.hostElement.addEventListener('mouseout', function () {
                        tip.hide();
                        rng = null;
                    });
                }
            });

            $scope.$on('$viewContentLoaded', function () {
                // this code is executed after the view is loaded

                $scope.loading = true;

                woFactory.getData().then(function (promise) {

                    $scope.loading = false;

                    if (angular.isArray(promise.data)) {
                                            
                        // expose data as a CollectionView to get events
                        $scope.data = new wijmo.collections.CollectionView(promise.data);

                    }
                });
            });
        }];

})(angular);
},{}],119:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q', '$alerts', '$stateParams', function ($http, $q, $alerts, $stateParams) {
        var factory = {};
        factory.getData = function () {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('http://localhost:3000/wo/cl_id', {
                    /* POST variables here */
                    procces_id: new Date().getMilliseconds(),
                    cl_id: $stateParams.cl_id
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    var stackError = JSON.stringify({
                        status: data.status,
                        error: data.error,
                        errorType: data.type,
                        config: config
                    }, null, 4);
                    $alerts.error('Wooops! an error has ocurred.', stackError);
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        return factory;
    }];

})(angular);
},{}],120:[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.zone',[
        require('./modules/zone.add').name,
        require('./modules/zone.update').name
    ])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('zone', {
            url:'/zone/:cl_id',
            templateUrl : 'modules/zone/zone.view.html',
            controller : 'zoneCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('zoneFac',require('./zone.fac'))

    .controller('zoneCtrl',require('./zone.ctrl'))
    
})(angular);

},{"./modules/zone.add":122,"./modules/zone.update":126,"./zone.ctrl":130,"./zone.fac":131}],121:[function(require,module,exports){
module.exports = {
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
                }
},{}],122:[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.zone.add',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('zoneAdd', {
            url:'/zone/add/:cl_id',
            templateUrl : 'modules/zone/modules/zone.add/zone.add.view.html',
            controller : 'zoneAddCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('zoneAddFac',require('./zone.add.fac'))

    .controller('zoneAddCtrl',require('./zone.add.ctrl'))

})(angular);
},{"./zone.add.ctrl":124,"./zone.add.fac":125}],123:[function(require,module,exports){
module.exports = {
                    "title" : "agregar dirección de envio",
                }
},{}],124:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'zoneAddFac', '$location', 'i18nFilter', '$interval', '$stateParams',
        function ($scope, zoneAddFac, $location, i18nFilter, $interval, $stateParams) {
            $scope.fmData = {};
            $scope.fmData.cl_id = $stateParams.cl_id;

            $scope.onSubmit = function () {

                zoneAddFac.add($scope.fmData).then(function (promise) {
                    if (promise.data == "1") {
                        $location.path('/zone');
                    } else {
                        $scope.updateFail = true;
                    }
                });
            };

            $scope.getStates = function () {
                $scope.zo_stateoptions = [];
                $scope.zo_cityoptions = [];
                $scope.zo_countyoptions = [];
                $interval(function () {
                    zoneAddFac.getStates($scope.fmData.zo_country).then(function (promise) {
                        if (angular.isArray(promise.data.geonames)) {
                            $scope.zo_stateoptions = promise.data.geonames;
                        } else {
                            //$scope.updateFail = true;
                        }
                    });
                }, 0, 1);
            }

            $scope.getCityCounty = function () {
                $scope.zo_cityoptions = [];
                $scope.zo_countyoptions = [];
                $interval(function () {
                    zoneAddFac.getStates($scope.fmData.zo_state).then(function (promise) {
                        if (angular.isArray(promise.data.geonames)) {
                            $scope.zo_cityoptions = promise.data.geonames;
                            $scope.zo_countyoptions = promise.data.geonames;
                        } else {
                            //$scope.updateFail = true;
                        }
                    });
                }, 0, 1);
            };

            $scope.zo_statusoptions = i18nFilter("zone.fields.zo_statusoptions");

            $scope.$on('$viewContentLoaded', function () {
                // this code is executed after the view is loaded
            
                zoneAddFac.getClient().then(function (promise) {
                    $scope.loading = false;
                    if (angular.isObject(promise.data)) {
                        $scope.client = promise.data;
                    }
                });

                zoneAddFac.getCountries().then(function (promise) {
                    if (angular.isArray(promise.data.geonames)) {
                        $scope.zo_countryoptions = promise.data.geonames;
                    } else {
                        //$scope.updateFail = true;
                    }
                });

            });
        }];

})(angular);
},{}],125:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q', '$alerts', '$stateParams', function ($http, $q, $alerts, $stateParams) {
        var factory = {};
        factory.getClient = function () {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('modules/zone/modules/zone.add/zone.add.mdl.getClient.php', {
                    /* POST variables here */
                    cl_id: $stateParams.cl_id
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    var stackError = JSON.stringify({
                        status: data.status,
                        error: data.error,
                        errorType: data.type,
                        config: config
                    }, null, 4);
                    $alerts.error('Wooops! an error has ocurred.', stackError);
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        factory.add = function (zo_jsonb) {
            var promise = $http.post('modules/zone/modules/zone.add/zone.add.mdl.add.php', {
                /* POST variables here */
                zo_jsonb: zo_jsonb
            }).success(function (data, status, headers, config) {
                return data;
            }).error(function (data, status, headers, config) {
                var stackError = JSON.stringify({
                    status: data.status,
                    error: data.error,
                    errorType: data.type,
                    config: config
                }, null, 4);
                $alerts.error('Wooops! an error has ocurred.', stackError);
                return { "status": false };
            });
            return promise;
        };
        factory.getCountries = function () {
            var promise = $http.get('http://api.geonames.org/countryInfoJSON?username=alejandrolsca')
                .success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    var stackError = JSON.stringify({
                        status: data.status,
                        error: data.error,
                        errorType: data.type,
                        config: config
                    }, null, 4);
                    $alerts.error('Wooops! an error has ocurred.', stackError);
                    return { "status": false };
                });
            return promise;
        };
        factory.getStates = function (zo_country) {
            var promise = $http.get('http://api.geonames.org/childrenJSON?geonameId=' + zo_country + '&username=alejandrolsca')
                .success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    var stackError = JSON.stringify({
                        status: data.status,
                        error: data.error,
                        errorType: data.type,
                        config: config
                    }, null, 4);
                    $alerts.error('Wooops! an error has ocurred.', stackError);
                    return { "status": false };
                });
            return promise;
        };
        factory.getCityCounty = function (zo_state) {
            var promise = $http.get('http://api.geonames.org/childrenJSON?geonameId=' + zo_state + '&username=alejandrolsca')
                .success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    var stackError = JSON.stringify({
                        status: data.status,
                        error: data.error,
                        errorType: data.type,
                        config: config
                    }, null, 4);
                    $alerts.error('Wooops! an error has ocurred.', stackError);
                    return { "status": false };
                });
            return promise;
        };
        return factory;
    }];

})(angular);
},{}],126:[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.zone.update',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('zoneUpdate', {
            url:'/zone/update/:cl_id/:zo_id',
            templateUrl : 'modules/zone/modules/zone.update/zone.update.view.html',
            controller : 'zoneUpdateCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('zoneUpdateFac',require('./zone.update.fac'))

    .controller('zoneUpdateCtrl',require('./zone.update.ctrl'))

})(angular);
},{"./zone.update.ctrl":128,"./zone.update.fac":129}],127:[function(require,module,exports){
module.exports = {
                    "title" : "actualizar dirección de envio",
                }
},{}],128:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'zoneUpdateFac', '$location', 'i18nFilter', '$interval', '$stateParams',
        function ($scope, zoneUpdateFac, $location, i18nFilter, $interval, $stateParams) {

            $scope.onSubmit = function () {

                zoneUpdateFac.update($scope.fmData).then(function (promise) {
                    if (promise.data == "1") {
                        $location.path('/zone/' + $stateParams.cl_id);
                    } else {
                        $scope.updateFail = true;
                    }
                });
            };

            $scope.getStates = function () {
                $scope.zo_stateoptions = [];
                $scope.zo_cityoptions = [];
                $scope.zo_countyoptions = [];
                $interval(function () {
                    zoneUpdateFac.getStates($scope.fmData.zo_country).then(function (promise) {
                        if (angular.isArray(promise.data.geonames)) {
                            $scope.zo_stateoptions = promise.data.geonames;
                        } else {
                            //$scope.updateFail = true;
                        }
                    });
                }, 0, 1);
            }

            $scope.getCityCounty = function () {
                $scope.zo_cityoptions = [];
                $scope.zo_countyoptions = [];
                $interval(function () {
                    zoneUpdateFac.getStates($scope.fmData.zo_state).then(function (promise) {
                        if (angular.isArray(promise.data.geonames)) {
                            $scope.zo_cityoptions = promise.data.geonames;
                            $scope.zo_countyoptions = promise.data.geonames;
                        } else {
                            //$scope.updateFail = true;
                        }
                    });
                }, 0, 1);
            }

            $scope.zo_statusoptions = i18nFilter("zone.fields.zo_statusoptions");

            $scope.$on('$viewContentLoaded', function () {
                // this code is executed after the view is loaded
                $scope.loading = true;
                zoneUpdateFac.data().then(function (promise) {
                    $scope.loading = false;
                    if (angular.isObject(angular.fromJson(promise.data))) {
                        $scope.fmData = angular.fromJson(promise.data);
                    }
                }).then(function () {
                    zoneUpdateFac.getCountries().then(function (promise) {
                        if (angular.isArray(promise.data.geonames)) {
                            $scope.zo_countryoptions = promise.data.geonames;
                        } else {
                            //$scope.updateFail = true;
                        }
                    }).then(function () {
                        zoneUpdateFac.getStates($scope.fmData.zo_country).then(function (promise) {
                            if (angular.isArray(promise.data.geonames)) {
                                $scope.zo_stateoptions = promise.data.geonames;
                            } else {
                                //$scope.updateFail = true;
                            }
                        })
                    }).then(function () {
                        zoneUpdateFac.getCityCounty($scope.fmData.zo_state).then(function (promise) {
                            if (angular.isArray(promise.data.geonames)) {
                                $scope.zo_cityoptions = promise.data.geonames;
                                $scope.zo_countyoptions = promise.data.geonames;
                            } else {
                                //$scope.updateFail = true;
                            }
                        })
                    });
                });

            });
        }];

})(angular);
},{}],129:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q', '$alerts', '$stateParams', function ($http, $q, $alerts, $stateParams) {
        var factory = {};
        factory.data = function () {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('modules/zone/modules/zone.update/zone.update.mdl.getZone.php', {
                    /* POST variables here */
                    zo_id: $stateParams.zo_id
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    var stackError = JSON.stringify({
                        status: data.status,
                        error: data.error,
                        errorType: data.type,
                        config: config
                    }, null, 4);
                    $alerts.error('Wooops! an error has ocurred.', stackError);
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        factory.update = function (zo_jsonb) {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('modules/zone/modules/zone.update/zone.update.mdl.update.php', {
                    /* POST variables here */
                    zo_id: $stateParams.zo_id,
                    zo_jsonb: zo_jsonb
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    var stackError = JSON.stringify({
                        status: data.status,
                        error: data.error,
                        errorType: data.type,
                        config: config
                    }, null, 4);
                    $alerts.error('Wooops! an error has ocurred.', stackError);
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        factory.getCountries = function () {
            var promise = $http.get('http://api.geonames.org/countryInfoJSON?username=alejandrolsca')
                .success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    var stackError = JSON.stringify({
                        status: data.status,
                        error: data.error,
                        errorType: data.type,
                        config: config
                    }, null, 4);
                    $alerts.error('Wooops! an error has ocurred.', stackError);
                    return { "status": false };
                });
            return promise;
        };
        factory.getStates = function (zo_country) {
            var promise = $http.get('http://api.geonames.org/childrenJSON?geonameId=' + zo_country + '&username=alejandrolsca')
                .success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    var stackError = JSON.stringify({
                        status: data.status,
                        error: data.error,
                        errorType: data.type,
                        config: config
                    }, null, 4);
                    $alerts.error('Wooops! an error has ocurred.', stackError);
                    return { "status": false };
                });
            return promise;
        };
        factory.getCityCounty = function (zo_state) {
            var promise = $http.get('http://api.geonames.org/childrenJSON?geonameId=' + zo_state + '&username=alejandrolsca')
                .success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    var stackError = JSON.stringify({
                        status: data.status,
                        error: data.error,
                        errorType: data.type,
                        config: config
                    }, null, 4);
                    $alerts.error('Wooops! an error has ocurred.', stackError);
                    return { "status": false };
                });
            return promise;
        };
        return factory;
    }];

})(angular);
},{}],130:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'zoneFac', 'i18nFilter',
        function ($scope, zoneFac, i18nFilter) {

            $scope.labels = Object.keys(i18nFilter("zone.labels"));
            $scope.columns = i18nFilter("zone.columns");
        
            // formatItem event handler
            var zo_id;
            var cl_id;
            $scope.formatItem = function (s, e, cell) {

                if (e.panel.cellType == wijmo.grid.CellType.RowHeader) {
                    e.cell.textContent = e.row + 1;
                }

                s.rows.defaultSize = 30;
            
                // add Bootstrap html
                if ((e.panel.cellType == wijmo.grid.CellType.Cell) && (e.col == 0)) {
                    zo_id = e.panel.getCellData(e.row, 1, false);
                    cl_id = e.panel.getCellData(e.row, 2, false);
                    e.cell.style.overflow = 'visible';
                    e.cell.innerHTML = '<div class="btn-group btn-group-justified" role="group" aria-label="...">\
                                        <div class="btn-group" role="group">\
                                            <a href="#/zone/update/'+ cl_id + '/' + zo_id + '" class="btn btn-default btn-xs" ng-click="edit($item.cl_id)">Editar</a>\
                                        </div>\
                                    </div>';
                }
            }
        
            // bind columns when grid is initialized
            $scope.initGrid = function (s, e) {
                for (var i = 0; i < $scope.labels.length; i++) {
                    var col = new wijmo.grid.Column();
                    col.binding = $scope.columns[i];
                    col.header = i18nFilter("zone.labels." + $scope.labels[i]);
                    col.wordWrap = false;
                    col.width = 150;
                    s.columns.push(col);
                }
            };
            // create the tooltip object
            $scope.$watch('ggGrid', function () {
                if ($scope.ggGrid) {
                    
                    // store reference to grid
                    var flex = $scope.ggGrid;

                    // create tooltip
                    var tip = new wijmo.Tooltip(),
                        rng = null;

                    // monitor the mouse over the grid
                    flex.hostElement.addEventListener('mousemove', function (evt) {
                        var ht = flex.hitTest(evt);
                        if (!ht.cellRange.equals(rng)) {

                            // new cell selected, show tooltip
                            if (ht.cellType == wijmo.grid.CellType.Cell) {
                                rng = ht.cellRange;
                                var col = flex.columns[rng.col].header;
                                var cellElement = document.elementFromPoint(evt.clientX, evt.clientY),
                                    cellBounds = wijmo.Rect.fromBoundingRect(cellElement.getBoundingClientRect()),
                                    data = wijmo.escapeHtml(flex.getCellData(rng.row, rng.col, true)),
                                    tipContent = col + ': "<b>' + data + '</b>"';
                                if (cellElement.className.indexOf('wj-cell') > -1) {
                                    tip.show(flex.hostElement, tipContent, cellBounds);
                                } else {
                                    tip.hide(); // cell must be behind scroll bar...
                                }
                            }
                        }
                    });
                    flex.hostElement.addEventListener('mouseout', function () {
                        tip.hide();
                        rng = null;
                    });
                }
            });

            $scope.$on('$viewContentLoaded', function () {
                // this code is executed after the view is loaded
                $scope.loading = true;
                zoneFac.data().then(function (promise) {
                    $scope.loading = false;
                    if (angular.isArray(promise.data)) {
                        $scope.data = new wijmo.collections.CollectionView(promise.data);
                    }
                });
            });
        }];

})(angular);
},{}],131:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q', '$alerts', '$stateParams', function ($http, $q, $alerts, $stateParams) {
        var factory = {};
        factory.data = function () {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('modules/zone/zone.mdl.getZones.php', {
                    /* POST variables here */
                    procces_id: new Date().getMilliseconds(),
                    cl_id: $stateParams.cl_id
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    var stackError = JSON.stringify({
                        status: data.status,
                        error: data.error,
                        errorType: data.type,
                        config: config
                    }, null, 4);
                    $alerts.error('Wooops! an error has ocurred.', stackError);
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        return factory;
    }];

})(angular);
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAuanMiLCJtb2R1bGVzL2FwcC9hcHAuY3RybC5qcyIsIm1vZHVsZXMvYXBwL2xhbmcuZmlsdGVyLmkxOG4uanMiLCJtb2R1bGVzL2FwcC9sYW5nLmxvY2FsZS5lbi1VUy5qcyIsIm1vZHVsZXMvYXBwL2xhbmcubG9jYWxlLmVzLU1YLmpzIiwibW9kdWxlcy9hdXRoL2xhbmcuZXMtTVguanMiLCJtb2R1bGVzL2NsaWVudC9jbGllbnQuY3RybC5qcyIsIm1vZHVsZXMvY2xpZW50L2NsaWVudC5mYWMuanMiLCJtb2R1bGVzL2NsaWVudC9pbmRleC5qcyIsIm1vZHVsZXMvY2xpZW50L2xhbmcuY3VzdG9tLmVzLU1YLmpzIiwibW9kdWxlcy9jbGllbnQvbGFuZy5lcy1NWC5qcyIsIm1vZHVsZXMvY2xpZW50L21vZHVsZXMvY2xpZW50LmFkZC9jbGllbnQuYWRkLmN0cmwuanMiLCJtb2R1bGVzL2NsaWVudC9tb2R1bGVzL2NsaWVudC5hZGQvY2xpZW50LmFkZC5mYWMuanMiLCJtb2R1bGVzL2NsaWVudC9tb2R1bGVzL2NsaWVudC5hZGQvaW5kZXguanMiLCJtb2R1bGVzL2NsaWVudC9tb2R1bGVzL2NsaWVudC5hZGQvbGFuZy5lcy1NWC5qcyIsIm1vZHVsZXMvY2xpZW50L21vZHVsZXMvY2xpZW50LnVwZGF0ZS9jbGllbnQudXBkYXRlLmN0cmwuanMiLCJtb2R1bGVzL2NsaWVudC9tb2R1bGVzL2NsaWVudC51cGRhdGUvY2xpZW50LnVwZGF0ZS5mYWMuanMiLCJtb2R1bGVzL2NsaWVudC9tb2R1bGVzL2NsaWVudC51cGRhdGUvaW5kZXguanMiLCJtb2R1bGVzL2NsaWVudC9tb2R1bGVzL2NsaWVudC51cGRhdGUvbGFuZy5lcy1NWC5qcyIsIm1vZHVsZXMvaG9tZS9ob21lLmN0cmwuanMiLCJtb2R1bGVzL2hvbWUvaG9tZS5mYWMuanMiLCJtb2R1bGVzL2hvbWUvaW5kZXguanMiLCJtb2R1bGVzL2hvbWUvbGFuZy5lcy1NWC5qcyIsIm1vZHVsZXMvaW5rL2luZGV4LmpzIiwibW9kdWxlcy9pbmsvaW5rLmN0cmwuanMiLCJtb2R1bGVzL2luay9pbmsuZmFjLmpzIiwibW9kdWxlcy9pbmsvbGFuZy5lcy1NWC5qcyIsIm1vZHVsZXMvaW5rL21vZHVsZXMvaW5rLmFkZC9pbmRleC5qcyIsIm1vZHVsZXMvaW5rL21vZHVsZXMvaW5rLmFkZC9pbmsuYWRkLmN0cmwuanMiLCJtb2R1bGVzL2luay9tb2R1bGVzL2luay5hZGQvaW5rLmFkZC5mYWMuanMiLCJtb2R1bGVzL2luay9tb2R1bGVzL2luay5hZGQvbGFuZy5lcy1NWC5qcyIsIm1vZHVsZXMvaW5rL21vZHVsZXMvaW5rLnVwZGF0ZS9pbmRleC5qcyIsIm1vZHVsZXMvaW5rL21vZHVsZXMvaW5rLnVwZGF0ZS9pbmsudXBkYXRlLmN0cmwuanMiLCJtb2R1bGVzL2luay9tb2R1bGVzL2luay51cGRhdGUvaW5rLnVwZGF0ZS5mYWMuanMiLCJtb2R1bGVzL2luay9tb2R1bGVzL2luay51cGRhdGUvbGFuZy5lcy1NWC5qcyIsIm1vZHVsZXMvbG9naW4vaW5kZXguanMiLCJtb2R1bGVzL2xvZ2luL2xvZ2luLmN0cmwuanMiLCJtb2R1bGVzL21hY2hpbmUvaW5kZXguanMiLCJtb2R1bGVzL21hY2hpbmUvbGFuZy5lcy1NWC5qcyIsIm1vZHVsZXMvbWFjaGluZS9tYWNoaW5lLmN0cmwuanMiLCJtb2R1bGVzL21hY2hpbmUvbWFjaGluZS5mYWMuanMiLCJtb2R1bGVzL21hY2hpbmUvbW9kdWxlcy9tYWNoaW5lLmFkZC9pbmRleC5qcyIsIm1vZHVsZXMvbWFjaGluZS9tb2R1bGVzL21hY2hpbmUuYWRkL2xhbmcuZXMtTVguanMiLCJtb2R1bGVzL21hY2hpbmUvbW9kdWxlcy9tYWNoaW5lLmFkZC9tYWNoaW5lLmFkZC5jdHJsLmpzIiwibW9kdWxlcy9tYWNoaW5lL21vZHVsZXMvbWFjaGluZS5hZGQvbWFjaGluZS5hZGQuZmFjLmpzIiwibW9kdWxlcy9tYWNoaW5lL21vZHVsZXMvbWFjaGluZS51cGRhdGUvaW5kZXguanMiLCJtb2R1bGVzL21hY2hpbmUvbW9kdWxlcy9tYWNoaW5lLnVwZGF0ZS9sYW5nLmVzLU1YLmpzIiwibW9kdWxlcy9tYWNoaW5lL21vZHVsZXMvbWFjaGluZS51cGRhdGUvbWFjaGluZS51cGRhdGUuY3RybC5qcyIsIm1vZHVsZXMvbWFjaGluZS9tb2R1bGVzL21hY2hpbmUudXBkYXRlL21hY2hpbmUudXBkYXRlLmZhYy5qcyIsIm1vZHVsZXMvcGFwZXIvaW5kZXguanMiLCJtb2R1bGVzL3BhcGVyL2xhbmcuZXMtTVguanMiLCJtb2R1bGVzL3BhcGVyL21vZHVsZXMvcGFwZXIuYWRkL2luZGV4LmpzIiwibW9kdWxlcy9wYXBlci9tb2R1bGVzL3BhcGVyLmFkZC9sYW5nLmVzLU1YLmpzIiwibW9kdWxlcy9wYXBlci9tb2R1bGVzL3BhcGVyLmFkZC9wYXBlci5hZGQuY3RybC5qcyIsIm1vZHVsZXMvcGFwZXIvbW9kdWxlcy9wYXBlci5hZGQvcGFwZXIuYWRkLmZhYy5qcyIsIm1vZHVsZXMvcGFwZXIvbW9kdWxlcy9wYXBlci51cGRhdGUvaW5kZXguanMiLCJtb2R1bGVzL3BhcGVyL21vZHVsZXMvcGFwZXIudXBkYXRlL2xhbmcuZXMtTVguanMiLCJtb2R1bGVzL3BhcGVyL21vZHVsZXMvcGFwZXIudXBkYXRlL3BhcGVyLnVwZGF0ZS5jdHJsLmpzIiwibW9kdWxlcy9wYXBlci9tb2R1bGVzL3BhcGVyLnVwZGF0ZS9wYXBlci51cGRhdGUuZmFjLmpzIiwibW9kdWxlcy9wYXBlci9wYXBlci5jdHJsLmpzIiwibW9kdWxlcy9wYXBlci9wYXBlci5mYWMuanMiLCJtb2R1bGVzL3Byb2R1Y3QvaW5kZXguanMiLCJtb2R1bGVzL3Byb2R1Y3QvbGFuZy5lcy1NWC5qcyIsIm1vZHVsZXMvcHJvZHVjdC9tb2R1bGVzL3Byb2R1Y3RPZmZzZXRHZW5lcmFsLmFkZC9pbmRleC5qcyIsIm1vZHVsZXMvcHJvZHVjdC9tb2R1bGVzL3Byb2R1Y3RPZmZzZXRHZW5lcmFsLmFkZC9sYW5nLmVzLU1YLmpzIiwibW9kdWxlcy9wcm9kdWN0L21vZHVsZXMvcHJvZHVjdE9mZnNldEdlbmVyYWwuYWRkL3Byb2R1Y3RPZmZzZXRHZW5lcmFsLmFkZC5jdHJsLmpzIiwibW9kdWxlcy9wcm9kdWN0L21vZHVsZXMvcHJvZHVjdE9mZnNldEdlbmVyYWwuYWRkL3Byb2R1Y3RPZmZzZXRHZW5lcmFsLmFkZC5mYWMuanMiLCJtb2R1bGVzL3Byb2R1Y3QvbW9kdWxlcy9wcm9kdWN0T2Zmc2V0R2VuZXJhbC51cGRhdGUvaW5kZXguanMiLCJtb2R1bGVzL3Byb2R1Y3QvbW9kdWxlcy9wcm9kdWN0T2Zmc2V0R2VuZXJhbC51cGRhdGUvbGFuZy5lcy1NWC5qcyIsIm1vZHVsZXMvcHJvZHVjdC9tb2R1bGVzL3Byb2R1Y3RPZmZzZXRHZW5lcmFsLnVwZGF0ZS9wcm9kdWN0T2Zmc2V0R2VuZXJhbC51cGRhdGUuY3RybC5qcyIsIm1vZHVsZXMvcHJvZHVjdC9tb2R1bGVzL3Byb2R1Y3RPZmZzZXRHZW5lcmFsLnVwZGF0ZS9wcm9kdWN0T2Zmc2V0R2VuZXJhbC51cGRhdGUuZmFjLmpzIiwibW9kdWxlcy9wcm9kdWN0L21vZHVsZXMvcHJvZHVjdE9mZnNldFBhZ2luYXRlZC5hZGQvaW5kZXguanMiLCJtb2R1bGVzL3Byb2R1Y3QvbW9kdWxlcy9wcm9kdWN0T2Zmc2V0UGFnaW5hdGVkLmFkZC9sYW5nLmVzLU1YLmpzIiwibW9kdWxlcy9wcm9kdWN0L21vZHVsZXMvcHJvZHVjdE9mZnNldFBhZ2luYXRlZC5hZGQvcHJvZHVjdE9mZnNldFBhZ2luYXRlZC5hZGQuY3RybC5qcyIsIm1vZHVsZXMvcHJvZHVjdC9tb2R1bGVzL3Byb2R1Y3RPZmZzZXRQYWdpbmF0ZWQuYWRkL3Byb2R1Y3RPZmZzZXRQYWdpbmF0ZWQuYWRkLmZhYy5qcyIsIm1vZHVsZXMvcHJvZHVjdC9wcm9kdWN0LmN0cmwuanMiLCJtb2R1bGVzL3Byb2R1Y3QvcHJvZHVjdC5mYWMuanMiLCJtb2R1bGVzL3N1cHBsaWVyL2luZGV4LmpzIiwibW9kdWxlcy9zdXBwbGllci9sYW5nLmVzLU1YLmpzIiwibW9kdWxlcy9zdXBwbGllci9tb2R1bGVzL3N1cHBsaWVyLmFkZC9pbmRleC5qcyIsIm1vZHVsZXMvc3VwcGxpZXIvbW9kdWxlcy9zdXBwbGllci5hZGQvbGFuZy5lcy1NWC5qcyIsIm1vZHVsZXMvc3VwcGxpZXIvbW9kdWxlcy9zdXBwbGllci5hZGQvc3VwcGxpZXIuYWRkLmN0cmwuanMiLCJtb2R1bGVzL3N1cHBsaWVyL21vZHVsZXMvc3VwcGxpZXIuYWRkL3N1cHBsaWVyLmFkZC5mYWMuanMiLCJtb2R1bGVzL3N1cHBsaWVyL21vZHVsZXMvc3VwcGxpZXIudXBkYXRlL2luZGV4LmpzIiwibW9kdWxlcy9zdXBwbGllci9tb2R1bGVzL3N1cHBsaWVyLnVwZGF0ZS9sYW5nLmVzLU1YLmpzIiwibW9kdWxlcy9zdXBwbGllci9tb2R1bGVzL3N1cHBsaWVyLnVwZGF0ZS9zdXBwbGllci51cGRhdGUuY3RybC5qcyIsIm1vZHVsZXMvc3VwcGxpZXIvbW9kdWxlcy9zdXBwbGllci51cGRhdGUvc3VwcGxpZXIudXBkYXRlLmZhYy5qcyIsIm1vZHVsZXMvc3VwcGxpZXIvc3VwcGxpZXIuY3RybC5qcyIsIm1vZHVsZXMvc3VwcGxpZXIvc3VwcGxpZXIuZmFjLmpzIiwibW9kdWxlcy91c2VyL2luZGV4LmpzIiwibW9kdWxlcy91c2VyL2xhbmcuZXMtTVguanMiLCJtb2R1bGVzL3VzZXIvbW9kdWxlcy91c2VyLmFkZC9pbmRleC5qcyIsIm1vZHVsZXMvdXNlci9tb2R1bGVzL3VzZXIuYWRkL2xhbmcuZXMtTVguanMiLCJtb2R1bGVzL3VzZXIvbW9kdWxlcy91c2VyLmFkZC91c2VyLmFkZC5jdHJsLmpzIiwibW9kdWxlcy91c2VyL21vZHVsZXMvdXNlci5hZGQvdXNlci5hZGQuZmFjLmpzIiwibW9kdWxlcy91c2VyL21vZHVsZXMvdXNlci5wcm9maWxlL2luZGV4LmpzIiwibW9kdWxlcy91c2VyL21vZHVsZXMvdXNlci5wcm9maWxlL2xhbmcuZXMtTVguanMiLCJtb2R1bGVzL3VzZXIvbW9kdWxlcy91c2VyLnByb2ZpbGUvdXNlci5wcm9maWxlLmN0cmwuanMiLCJtb2R1bGVzL3VzZXIvbW9kdWxlcy91c2VyLnVwZGF0ZS9pbmRleC5qcyIsIm1vZHVsZXMvdXNlci9tb2R1bGVzL3VzZXIudXBkYXRlL2xhbmcuZXMtTVguanMiLCJtb2R1bGVzL3VzZXIvbW9kdWxlcy91c2VyLnVwZGF0ZS91c2VyLnVwZGF0ZS5jdHJsLmpzIiwibW9kdWxlcy91c2VyL21vZHVsZXMvdXNlci51cGRhdGUvdXNlci51cGRhdGUuZmFjLmpzIiwibW9kdWxlcy91c2VyL3VzZXIuY3RybC5qcyIsIm1vZHVsZXMvdXNlci91c2VyLmZhYy5qcyIsIm1vZHVsZXMvd28vaW5kZXguanMiLCJtb2R1bGVzL3dvL2xhbmcuZXMtTVguanMiLCJtb2R1bGVzL3dvL21vZHVsZXMvd28uYWRkL2luZGV4LmpzIiwibW9kdWxlcy93by9tb2R1bGVzL3dvLmFkZC9sYW5nLmVzLU1YLmpzIiwibW9kdWxlcy93by9tb2R1bGVzL3dvLmFkZC93by5hZGQuY3RybC5qcyIsIm1vZHVsZXMvd28vbW9kdWxlcy93by5hZGQvd28uYWRkLmZhYy5qcyIsIm1vZHVsZXMvd28vbW9kdWxlcy93by5kdXBsaWNhdGUvaW5kZXguanMiLCJtb2R1bGVzL3dvL21vZHVsZXMvd28uZHVwbGljYXRlL3dvLmR1cGxpY2F0ZS5jdHJsLmpzIiwibW9kdWxlcy93by9tb2R1bGVzL3dvLmR1cGxpY2F0ZS93by5kdXBsaWNhdGUuZmFjLmpzIiwibW9kdWxlcy93by9tb2R1bGVzL3dvLnVwZGF0ZS9pbmRleC5qcyIsIm1vZHVsZXMvd28vbW9kdWxlcy93by51cGRhdGUvbGFuZy5lcy1NWC5qcyIsIm1vZHVsZXMvd28vbW9kdWxlcy93by51cGRhdGUvd28udXBkYXRlLmN0cmwuanMiLCJtb2R1bGVzL3dvL21vZHVsZXMvd28udXBkYXRlL3dvLnVwZGF0ZS5mYWMuanMiLCJtb2R1bGVzL3dvL3dvLmN0cmwuanMiLCJtb2R1bGVzL3dvL3dvLmZhYy5qcyIsIm1vZHVsZXMvem9uZS9pbmRleC5qcyIsIm1vZHVsZXMvem9uZS9sYW5nLmVzLU1YLmpzIiwibW9kdWxlcy96b25lL21vZHVsZXMvem9uZS5hZGQvaW5kZXguanMiLCJtb2R1bGVzL3pvbmUvbW9kdWxlcy96b25lLmFkZC9sYW5nLmVzLU1YLmpzIiwibW9kdWxlcy96b25lL21vZHVsZXMvem9uZS5hZGQvem9uZS5hZGQuY3RybC5qcyIsIm1vZHVsZXMvem9uZS9tb2R1bGVzL3pvbmUuYWRkL3pvbmUuYWRkLmZhYy5qcyIsIm1vZHVsZXMvem9uZS9tb2R1bGVzL3pvbmUudXBkYXRlL2luZGV4LmpzIiwibW9kdWxlcy96b25lL21vZHVsZXMvem9uZS51cGRhdGUvbGFuZy5lcy1NWC5qcyIsIm1vZHVsZXMvem9uZS9tb2R1bGVzL3pvbmUudXBkYXRlL3pvbmUudXBkYXRlLmN0cmwuanMiLCJtb2R1bGVzL3pvbmUvbW9kdWxlcy96b25lLnVwZGF0ZS96b25lLnVwZGF0ZS5mYWMuanMiLCJtb2R1bGVzL3pvbmUvem9uZS5jdHJsLmpzIiwibW9kdWxlcy96b25lL3pvbmUuZmFjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9JQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9IQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0lBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkVBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDektBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25HQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25HQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgIC8vQUxFSkFORFJPIFNBTkNIRVogQkVUQU5DT1VSVFxuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAnLCBbXG4gICAgICAgICd1aS5yb3V0ZXInLFxuICAgICAgICAnbmdBbmltYXRlJyxcbiAgICAgICAgJ3VpLmJvb3RzdHJhcCcsXG4gICAgICAgICdnZy1maWVsZHMnLFxuICAgICAgICAnZ2ctYWxlcnRzJyxcbiAgICAgICAgJ3dqJyxcbiAgICAgICAgJ2phLnFyJyxcbiAgICAgICAgJ2F1dGgwJyxcbiAgICAgICAgJ2FuZ3VsYXItc3RvcmFnZScsXG4gICAgICAgICdhbmd1bGFyLWp3dCcsXG4gICAgICAgIHJlcXVpcmUoJy4vbW9kdWxlcy9sb2dpbicpLm5hbWUsXG4gICAgICAgIHJlcXVpcmUoJy4vbW9kdWxlcy9jbGllbnQnKS5uYW1lLFxuICAgICAgICByZXF1aXJlKCcuL21vZHVsZXMvdXNlcicpLm5hbWUsXG4gICAgICAgIHJlcXVpcmUoJy4vbW9kdWxlcy9ob21lJykubmFtZSxcbiAgICAgICAgcmVxdWlyZSgnLi9tb2R1bGVzL3Byb2R1Y3QnKS5uYW1lLFxuICAgICAgICByZXF1aXJlKCcuL21vZHVsZXMvc3VwcGxpZXInKS5uYW1lLFxuICAgICAgICByZXF1aXJlKCcuL21vZHVsZXMvbWFjaGluZScpLm5hbWUsXG4gICAgICAgIHJlcXVpcmUoJy4vbW9kdWxlcy9wYXBlcicpLm5hbWUsXG4gICAgICAgIHJlcXVpcmUoJy4vbW9kdWxlcy9pbmsnKS5uYW1lLFxuICAgICAgICByZXF1aXJlKCcuL21vZHVsZXMvd28nKS5uYW1lLFxuICAgICAgICByZXF1aXJlKCcuL21vZHVsZXMvem9uZScpLm5hbWVcbiAgICBdKVxuXG4gICAgICAgIC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLCAnJGh0dHBQcm92aWRlcicsICdhdXRoUHJvdmlkZXInLCAnand0SW50ZXJjZXB0b3JQcm92aWRlcicsXG4gICAgICAgICAgICBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlciwgJGh0dHBQcm92aWRlciwgYXV0aFByb3ZpZGVyLCBqd3RJbnRlcmNlcHRvclByb3ZpZGVyKSB7XG4gICAgICAgICAgICAgICAgYXV0aFByb3ZpZGVyLmluaXQoe1xuICAgICAgICAgICAgICAgICAgICBkb21haW46ICdncnVwb2dyYWZpY28uYXV0aDAuY29tJyxcbiAgICAgICAgICAgICAgICAgICAgY2xpZW50SUQ6ICdaZXhWREVQbHFHTE1uV1hubXlLU3NvRThKTzNaUzc2eScsXG4gICAgICAgICAgICAgICAgICAgIGxvZ2luU3RhdGU6ICdsb2dpbicgLy8gbWF0Y2hlcyBsb2dpbiBzdGF0ZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIC8vIFdlJ3JlIGFubm90YXRpbmcgdGhpcyBmdW5jdGlvbiBzbyB0aGF0IHRoZSBgc3RvcmVgIGlzIGluamVjdGVkIGNvcnJlY3RseSB3aGVuIHRoaXMgZmlsZSBpcyBtaW5pZmllZFxuICAgICAgICAgICAgICAgIGp3dEludGVyY2VwdG9yUHJvdmlkZXIudG9rZW5HZXR0ZXIgPSBbJ3N0b3JlJywgZnVuY3Rpb24gKHN0b3JlKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFJldHVybiB0aGUgc2F2ZWQgdG9rZW5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0b3JlLmdldCgndG9rZW4nKTtcbiAgICAgICAgICAgICAgICB9XTtcblxuICAgICAgICAgICAgICAgICRodHRwUHJvdmlkZXIuaW50ZXJjZXB0b3JzLnB1c2goJ2p3dEludGVyY2VwdG9yJyk7XG4gICAgICAgICAgICAgICAgLy8gQmF0Y2hpbmcgbXVsdGlwbGUgJGh0dHAgcmVzcG9uc2VzIGludG8gb25lICRkaWdlc3RcbiAgICAgICAgICAgICAgICAkaHR0cFByb3ZpZGVyLnVzZUFwcGx5QXN5bmModHJ1ZSk7XG4gICAgICAgICAgICAgICAgLy8gd2hlbiB0aGVyZSBpcyBhbiBlbXB0eSByb3V0ZSwgcmVkaXJlY3QgdG8gL2luZGV4ICAgXG4gICAgICAgICAgICAgICAgJHVybFJvdXRlclByb3ZpZGVyLndoZW4oJycsICcvaG9tZScpO1xuICAgICAgICAgICAgICAgIC8vIHdoZW4gcm9vdCwgcmVkaXJlY3QgdG8gL2hvbWUgIFxuICAgICAgICAgICAgICAgICR1cmxSb3V0ZXJQcm92aWRlci53aGVuKCcvJywgJy9ob21lJyk7XG4gICAgICAgICAgICB9XSlcblxuICAgICAgICAucnVuKFsnJHJvb3RTY29wZScsICdhdXRoJywgJ3N0b3JlJywgJ2p3dEhlbHBlcicsICckbG9jYXRpb24nLFxuICAgICAgICAgICAgZnVuY3Rpb24gKCRyb290U2NvcGUsIGF1dGgsIHN0b3JlLCBqd3RIZWxwZXIsICRsb2NhdGlvbikge1xuICAgICAgICAgICAgICAgIC8vIFRoaXMgaG9va3MgYWwgYXV0aCBldmVudHMgdG8gY2hlY2sgZXZlcnl0aGluZyBhcyBzb29uIGFzIHRoZSBhcHAgc3RhcnRzXG4gICAgICAgICAgICAgICAgYXV0aC5ob29rRXZlbnRzKCk7XG4gICAgICAgICAgICAgICAgLy8gVGhpcyBldmVudHMgZ2V0cyB0cmlnZ2VyZWQgb24gcmVmcmVzaCBvciBVUkwgY2hhbmdlXG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN0YXJ0JywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdG9rZW4gPSBzdG9yZS5nZXQoJ3Rva2VuJyk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0b2tlbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFqd3RIZWxwZXIuaXNUb2tlbkV4cGlyZWQodG9rZW4pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFhdXRoLmlzQXV0aGVudGljYXRlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdXRoLmF1dGhlbnRpY2F0ZShzdG9yZS5nZXQoJ3Byb2ZpbGUnKSwgdG9rZW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRWl0aGVyIHNob3cgdGhlIGxvZ2luIHBhZ2Ugb3IgdXNlIHRoZSByZWZyZXNoIHRva2VuIHRvIGdldCBhIG5ldyBpZFRva2VuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9sb2dpbicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH1dKVxuXG4gICAgICAgIC5maWx0ZXIoJ2kxOG4nLCByZXF1aXJlKCcuL21vZHVsZXMvYXBwL2xhbmcuZmlsdGVyLmkxOG4nKSlcblxuICAgICAgICAvLy5mYWN0b3J5KCdsYW5nRmFjJywgcmVxdWlyZSgnLi9tb2R1bGVzL2FwcC9sYW5nLmZhYycpKVxuXG4gICAgICAgIC5jb250cm9sbGVyKCdhcHBDdHJsJywgcmVxdWlyZSgnLi9tb2R1bGVzL2FwcC9hcHAuY3RybCcpKVxuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcblxuICAgIHJldHVybiBbJyRzY29wZScsICckcm9vdFNjb3BlJywgJ2kxOG5GaWx0ZXInLCAnJGxvY2F0aW9uJywgJ2F1dGgnLCAnc3RvcmUnLFxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCAkcm9vdFNjb3BlLCBpMThuRmlsdGVyLCAkbG9jYXRpb24sIGF1dGgsIHN0b3JlKSB7XG5cbiAgICAgICAgICAgICRzY29wZS5sb2dvdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgYXV0aC5zaWdub3V0KCk7XG4gICAgICAgICAgICAgICAgc3RvcmUucmVtb3ZlKCdwcm9maWxlJyk7XG4gICAgICAgICAgICAgICAgc3RvcmUucmVtb3ZlKCd0b2tlbicpO1xuICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKFwiL2xvZ2luXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgIGxhbmdGYWMuZ2V0TGFuZygpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICBpZiAocHJvbWlzZS5kYXRhLnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS5jdXJyZW50TGFuZ3VhZ2UgPSBwcm9taXNlLmRhdGEubGFuZztcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLm5hdkl0ZW1zID0gaTE4bkZpbHRlcihcIkdFTkVSQUwuTkFWXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpdGVtIGluICRzY29wZS5uYXZJdGVtcykge1xuICAgICAgICAgICAgICAgIGlmICgkc2NvcGUubmF2SXRlbXNbaXRlbV0uc3ViTWVudSkge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUubGFzdFN1Ym1lbnUgPSBpdGVtO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICRzY29wZS5sYW5nID0gZnVuY3Rpb24gKGxhbmcpIHtcbiAgICAgICAgICAgICAgICBsYW5nRmFjLnNldExhbmcobGFuZykudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocHJvbWlzZS5kYXRhLnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuY3VycmVudExhbmd1YWdlID0gcHJvbWlzZS5kYXRhLmxhbmc7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUubmF2SXRlbXMgPSBpMThuRmlsdGVyKFwiR0VORVJBTC5OQVZcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICovXG4gICAgICAgIH1dXG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgcmV0dXJuIFsnJHJvb3RTY29wZScsXG4gICAgICAgIGZ1bmN0aW9uICgkcm9vdFNjb3BlKSB7XG5cbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoaW5wdXQsIHBhcmFtKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRyYW5zbGF0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAgICAgXCJlcy1NWFwiOiByZXF1aXJlKCcuL2xhbmcubG9jYWxlLmVzLU1YJyksXG4gICAgICAgICAgICAgICAgICAgIFwiZW4tVVNcIjogcmVxdWlyZSgnLi9sYW5nLmxvY2FsZS5lbi1VUycpXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB2YXIgY3VycmVudExhbmd1YWdlID0gJHJvb3RTY29wZS5jdXJyZW50TGFuZ3VhZ2UgfHwgJ2VzLU1YJyxcbiAgICAgICAgICAgICAgICAgICAga2V5cyA9IGlucHV0LnNwbGl0KCcuJyksXG4gICAgICAgICAgICAgICAgICAgIGRhdGEgPSB0cmFuc2xhdGlvbnNbY3VycmVudExhbmd1YWdlXSxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIGtleXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEgPSBkYXRhW2tleXNba2V5XV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKCEhZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICh0eXBlb2YgcGFyYW0gPT09IFwidW5kZWZpbmVkXCIpID8gZGF0YSA6IGRhdGEucmVwbGFjZSgnQEAnLCBwYXJhbSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaW5wdXQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZS5kZXNjcmlwdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpbnB1dDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfV07XG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAgICAgICAgICAgICBcIkdFTkVSQUxcIjp7XG4gICAgICAgICAgICAgICAgICAgIFwiTkFWXCI6W1xuICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOlwiSG9tZVwiLFwidXJsXCI6XCIjL2hvbWVcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6XCJDbGllbnRlc1wiLFwidXJsXCI6XCIjL2NsaWVudFwiLFwic3ViTWVudVwiOiBcbiAgICAgICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcIm5hbWVcIjogXCJBZ3JlZ2FyXCIsXCJ1cmxcIjogXCIjL2NsaWVudC9hZGRcIn1cbiAgICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOlwiUHJvZHVjdHNcIixcInVybFwiOlwiIy9wcm9kdWN0XCIsXCJzdWJNZW51XCI6IFxuICAgICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOiBcIkFkZFwiLFwidXJsXCI6IFwiIy9wcm9kdWN0L2FkZFwifVxuICAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6XCJXb3JrIE9yZGVyc1wiLFwidXJsXCI6XCIjL3dvXCIsXCJzdWJNZW51XCI6IFxuICAgICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOiBcIkFkZFwiLFwidXJsXCI6IFwiIy93by9hZGRcIn1cbiAgICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOlwiVXNlcnNcIixcInVybFwiOlwiIy91c2VyXCIsXCJzdWJNZW51XCI6IFxuICAgICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOiBcIkFkZFwiLFwidXJsXCI6IFwiIy91c2VyL2FkZFwifVxuICAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6XCJMb2dpblwiLFwidXJsXCI6XCIjL1wifSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcIm5hbWVcIjpcIlJlcG9ydHNcIixcInVybFwiOlwiIy9yZXBvcnRzXCIsXCJzdWJNZW51XCI6IFxuICAgICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6IFwic3ViMVwiLFwidXJsXCI6IFwiLi4vbG9naW5cIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOiBcInN1YjJcIixcInVybFwiOiBcIi4uL2xvZ2luXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcIm5hbWVcIjogXCJzdWIzXCIsXCJ1cmxcIjogXCIuLi9sb2dpblwifVxuICAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgXCJCVVRUT05TXCI6e1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJFRElUXCI6XCJFZGl0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkRVUExJQ0FURVwiOlwiRHVwbGljYXRlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIldPXCI6XCJXb3JrIE9yZGVyXCIsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIFwiU1VCTUlUXCI6XCJTdWJtaXRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJDT1BZUklHSFRcIjpcIsKpMjAxNCBHcnVwbyBHcmFmaWNvIGRlIE3DqXhpY28gUy5BLiBkZSBDLlYuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwiSE9NRVwiOntcbiAgICAgICAgICAgICAgICAgICAgXCJUSVRMRVwiIDogXCJIb21lXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiV0VMQ09NRVwiIDogXCJXZWxjb21lIEBAIVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBcIkNMSUVOVFwiOntcbiAgICAgICAgICAgICAgICAgICAgXCJUSVRMRVwiIDogXCJDbGllbnRlc1wiLFxuICAgICAgICAgICAgICAgICAgICBcIkZJRUxEU1wiOntcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiQ0xfSURcIjpcIkNsaWVudCBJRFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJDTF9DT1JQT1JBVEVOQU1FXCI6XCJDb3Jwb3JhdGUgTmFtZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJDTF9USU5cIjpcIlRJTlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJDTF9OQU1FXCI6XCJOYW1lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkNMX0ZBVEhFUlNMQVNUTkFNRVwiOlwiRmF0aGVycyBMYXN0bmFtZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJDTF9NT1RIRVJTTEFTVE5BTUVcIjpcIk1vdGhlcnMgTGFzdG5hbWVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiQ0xfU1RSRUVUXCI6XCJTdHJlZXRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiQ0xfU1RSRUVUTlVNQkVSXCI6XCJTdHJlZXQgTnVtYmVyXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkNMX1NVSVRFTlVNQkVSXCI6XCJTdWl0ZSBOdW1iZXJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiQ0xfTkVJR0hCT1JIT09EXCI6XCJOZWlnaGJvcmhvb2RcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiQ0xfQUREUkVTU1JFRkVSRU5DRVwiOlwiQWRkcmVzcyBSZWZlcmVuY2VcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiQ0xfQ09VTlRSWVwiOlwiQ291bnRyeVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJDTF9TVEFURVwiOlwiU3RhdGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiQ0xfQ0lUWVwiOlwiQ2l0eVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJDTF9DT1VOVFlcIjpcIkNvdW50eVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJDTF9aSVBDT0RFXCI6XCJaaXAgQ29kZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJDTF9FTUFJTFwiOlwiRS1tYWlsXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkNMX1BIT05FXCI6XCJQaG9uZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJDTF9NT0JJTEVcIjpcIk1vYmlsZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJDTF9DUkVESVRMSU1JVFwiOlwiQ3JlZGl0IExpbWl0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkNMX0NVU1RPTUVSRElTQ09VTlRcIjpcIkRpc2NvdW50XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkNMX1NUQVRVU1wiOlwiU3RhdHVzXCIsXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwiQ0xJRU5UX0FERFwiOntcbiAgICAgICAgICAgICAgICAgICAgXCJUSVRMRVwiIDogXCJBZGQgQ2xpZW50XCIsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBcIkNMSUVOVF9VUERBVEVcIjp7XG4gICAgICAgICAgICAgICAgICAgIFwiVElUTEVcIiA6IFwiVXBkYXRlIENsaWVudFwiLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXCJVU0VSXCI6e1xuICAgICAgICAgICAgICAgICAgICBcIlRJVExFXCIgOiBcIlVzZXJzXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiRklFTERTXCI6e1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJVU19JRFwiOiBcIlVzZXIgSURcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiR1JfSURcIjogXCJHcm91cCBJRFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJVU19VU0VSXCI6IFwiVXNlclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJVU19QQVNTV09SRFwiOiBcIlBhc3N3b3JkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlVTX05BTUVcIjogXCJOYW1lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlVTX0ZBVEhFUlNMQVNUTkFNRVwiOiBcIkZhdGhlcnMgTGFzdG5hbWVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiVVNfTU9USEVSU0xBU1ROQU1FXCI6IFwiTW90aGVycyBMYXN0bmFtZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJVU19FTUFJTFwiOiBcIkUtbWFpbFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJVU19QSE9ORVwiOiBcIlBob25lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlVTX01PQklMRVwiOiBcIk1vYmlsZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJVU19TVEFUVVNcIjogXCJTdGF0dXNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiVVNfREFURVwiOiBcIkRhdGVcIlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBcIlVTRVJfQUREXCI6e1xuICAgICAgICAgICAgICAgICAgICBcIlRJVExFXCIgOiBcIkFkZCBVc2VyXCIsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBcIlVTRVJfVVBEQVRFXCI6e1xuICAgICAgICAgICAgICAgICAgICBcIlRJVExFXCIgOiBcIlVwZGF0ZSBVc2VyXCIsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBcIldPXCI6e1xuICAgICAgICAgICAgICAgICAgICBcIlRJVExFXCIgOiBcIldvcmsgT3JkZXJzXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiRklFTERTXCI6e1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJXT19JRFwiIDogXCJPcmRlciBOby5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiV09fREFURVwiIDogXCJEYXRlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkNMX0lEXCIgOiBcIkNsaWVudCBJRFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJaT19JRFwiIDogXCJab25lIElEXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIldPX09SREVSRURCWVwiIDogXCJPcmRlcmVkIEJ5XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIldPX0FUVEVOVElPTlwiIDogXCJBdHRlbnRpb25cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiV09fUkZRXCIgOiBcIlJGUVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJXT19QUk9DRVNTXCIgOiBcIlByb2Nlc3NcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiV09fUkVMRUFTRVwiIDogXCJSZWxlYXNlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIldPX1BPXCIgOiBcIlB1cmNoYXNlIE9yZGVyXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIldPX0xJTkVcIiA6IFwiTGluZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJXT19MSU5FVE9UQUxcIiA6IFwiVG90YWwgTGluZXNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiUFJTRV9JRFwiIDogXCJQcm9kdWN0IElEXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIldPX1NUQVRVU1wiIDogXCJTdGF0dXNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiV09fQ09NTUlUTUVOVERBVEVcIiA6IFwiQ29tbWl0bWVudCBEYXRlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIldPX1BSRVZJT1VTSURcIiA6IFwiUHJldmlvdXMgSURcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiV09fUFJFVklPVVNEQVRFXCIgOiBcIlByZXZpb3VzIERhdGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiU0hfSURcIiA6IFwiU2hpcG1lbnQgSURcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiU0hfREFURVwiIDogXCJTaGlwbWVudCBEYXRlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIldPX1RSQUNLSU5HTk9cIiA6IFwiVHJhY2tpbmcgTm8uXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIldPX1NISVBQSU5HREFURVwiIDogXCJTaGlwcGluZyBEYXRlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIldPX0RFTElWRVJZREFURVwiIDogXCJEZWxpdmVyeSBEYXRlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIldPX0lOVk9JQ0VOT1wiIDogXCJJbnZvaWNlIE5vLlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJXT19JTlZPSUNFREFURVwiIDogXCJJbnZvaWNlIERhdGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiV09fTk9URVNcIiA6IFwiTm90ZXNcIlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBcIldPX0FERFwiOntcbiAgICAgICAgICAgICAgICAgICAgXCJUSVRMRVwiIDogXCJBZGQgV29yayBPcmRlclwiLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXCJXT19VUERBVEVcIjp7XG4gICAgICAgICAgICAgICAgICAgIFwiVElUTEVcIiA6IFwiVXBkYXRlIFdvcmsgT3JkZXJcIixcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwiQVVUSFwiOntcbiAgICAgICAgICAgICAgICAgICAgXCJUSVRMRVwiIDogXCJMb2dpblwiLFxuICAgICAgICAgICAgICAgICAgICBcIkVOVEVSUFJJU0VcIiA6IFwiRW50ZXJwcmlzZVwiLFxuICAgICAgICAgICAgICAgICAgICBcIlVTRVJcIiA6IFwiVXNlclwiLFxuICAgICAgICAgICAgICAgICAgICBcIlBBU1NXT1JEXCIgOiBcIlBhc3N3b3JkXCIsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgICAgICAgICAgICAgIFwiZ2VuZXJhbFwiOnsgXG4gICAgICAgICAgICAgICAgICAgIFwibmF2XCI6W1xuICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOlwiaW5pY2lvXCIsXCJ1cmxcIjpcIiMvaG9tZVwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcIm5hbWVcIjpcImNsaWVudGVzXCIsXCJ1cmxcIjpcIiMvY2xpZW50XCIsXCJzdWJtZW51XCI6IFxuICAgICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOiBcImFncmVnYXJcIixcInVybFwiOiBcIiMvY2xpZW50L2FkZFwifVxuICAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6XCJwcm9kdWN0b3NcIixcInVybFwiOlwiIy9wcm9kdWN0XCIsXCJzdWJtZW51XCI6IFxuICAgICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOiBcImFncmVnYXJcIixcInVybFwiOiBcIiMvcHJvZHVjdC9hZGRcIn1cbiAgICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOlwib3JkZW5lcyBkZSB0cmFiYWpvXCIsXCJ1cmxcIjpcIiMvd29cIixcInN1Ym1lbnVcIjogXG4gICAgICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6IFwiYWdyZWdhclwiLFwidXJsXCI6IFwiIy93by9hZGRcIn1cbiAgICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOlwidXN1YXJpb3NcIixcInVybFwiOlwiIy91c2VyXCIsXCJzdWJtZW51XCI6IFxuICAgICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOiBcImFncmVnYXJcIixcInVybFwiOiBcIiMvdXNlci9hZGRcIn1cbiAgICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOlwibG9naW5cIixcInVybFwiOlwiIy9cIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6XCJyZXBvcnRlc1wiLFwidXJsXCI6XCIjL3JlcG9ydHNcIixcInN1Ym1lbnVcIjogXG4gICAgICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6IFwic3ViMVwiLFwidXJsXCI6IFwiLi4vbG9naW5cIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcIm5hbWVcIjogXCJzdWIyXCIsXCJ1cmxcIjogXCIuLi9sb2dpblwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOiBcInN1YjNcIixcInVybFwiOiBcIi4uL2xvZ2luXCJ9XG4gICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICBcImxhYmVsc1wiOntcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYWRkXCI6XCJBZ3JlZ2FyXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImVkaXRcIjpcImVkaXRhclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJkdXBsaWNhdGVcIjpcImR1cGxpY2FyXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInNob3dcIjpcIm1vc3RyYXJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3VibWl0XCI6XCJFbnZpYXJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xvc2VcIjpcIkNlcnJhclwiLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBcInJlZ2V4cFwiOntcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic2luZ2xlc3BhY2VzXCI6IFwic2luIGVzcGFjaW9zIGRvYmxlcyBuaSBjYXJhY3RlcmVzIGVzcGVjaWFsZXMuXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInBhcGVyY29kZVwiOiBcInNpbiBlc3BhY2lvcyBuaSBjYXJhY3RlcmVzIGVzcGVjaWFsZXNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaW5rY29kZVwiOiBcInNpbiBlc3BhY2lvcyBuaSBjYXJhY3RlcmVzIGVzcGVjaWFsZXNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibWFjaGluZXRvdGFsaW5rc1wiOiBcIm1pbmltbyAxIG1heGltbyA4XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJmY1wiOiBcIlhYWFgtIyMjIyMjWy1YWFhdXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImVtYWlsXCI6IFwicG9yIGZhdm9yIGludHJvZHV6Y2EgdW4gZW1haWwgdmFsaWRvLlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJkZWNpbWFsXCI6IFwibnVtZXJvIHkgZGUgMiBhIDUgZGVjaW1hbGVzICgjLiMjWyMjI10pXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImRpc2NvdW50XCI6IFwiY2VybyBtYXMgMiBkZWNpbWFsZXMgKDAuIyMpXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImludGVnZXJcIjogXCJzb2xvIG51bWVyb3MgZW50ZXJvc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ6aXBjb2RlXCI6IFwiZWwgY29kaWdvIHBvc3RhbCBlcyBkZSA1IG51bWVyb3MuXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImRhdGVcIjogXCJhYWFhLW1tLWRkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInVzZXJcIjogXCJkZSA0IGEgMTYgY2FyYWN0ZXJlcyBzaW4gZXNwYWNpb3MgbmkgY2FyYWN0ZXJlcyBlc3BlY2lhbGVzLlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwYXNzd29yZFwiOiBcImxhIGNvbnRyYXNlw7FhIGRlYmUgY29udGVuZXIgZGUgOC0xNiBjYXJhY3RlcmVzLCBwb3IgbG8gbWVub3MgdW5hIGxldHJhIG1heXVzY3VsYSwgdW5hIGxldHJhIG1pbnVzY3VsYSB5IHVuIGRpZ2l0by5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicGhvbmVcIjogXCJzb2xvIHVzZSBlbCBzaW1ib2xvICsgYWwgcHJpbmNpcGlvIHkgbnVtZXJvcyBkZWwgMCBhbCA5XCJcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgXCJjb3B5cmlnaHRcIjpcIsKpMjAxNCBncnVwbyBncmFmaWNvIGRlIG3DqXhpY28gcy5hLiBkZSBjLnYuIHRvZG9zIGxvcyBkZXJlY2hvcyByZXNlcnZhZG9zLlwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgIEhPTUUgXG4gICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbiAgICAgICAgICAgICAgICBcImhvbWVcIjpyZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2hvbWUvbGFuZy5lcy1NWCcpLFxuICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgQ0xJRU5UIFxuICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4gICAgICAgICAgICAgICAgXCJjbGllbnRcIjogcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9jbGllbnQvbGFuZy5lcy1NWCcpLFxuICAgICAgICAgICAgICAgIFwiY2xpZW50LWN1c3RvbVwiOiByZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2NsaWVudC9sYW5nLmN1c3RvbS5lcy1NWCcpLFxuICAgICAgICAgICAgICAgIFwiY2xpZW50LWFkZFwiOiByZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2NsaWVudC9tb2R1bGVzL2NsaWVudC5hZGQvbGFuZy5lcy1NWCcpLFxuICAgICAgICAgICAgICAgIFwiY2xpZW50LXVwZGF0ZVwiOiByZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2NsaWVudC9tb2R1bGVzL2NsaWVudC51cGRhdGUvbGFuZy5lcy1NWCcpLFxuICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgUFJPRFVDVCBcbiAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuICAgICAgICAgICAgICAgIFwicHJvZHVjdFwiOiByZXF1aXJlKCcuLi8uLi9tb2R1bGVzL3Byb2R1Y3QvbGFuZy5lcy1NWCcpLFxuICAgICAgICAgICAgICAgIFwicHJvZHVjdE9mZnNldEdlbmVyYWwtYWRkXCI6IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvcHJvZHVjdC9tb2R1bGVzL3Byb2R1Y3RPZmZzZXRHZW5lcmFsLmFkZC9sYW5nLmVzLU1YJyksXG4gICAgICAgICAgICAgICAgXCJwcm9kdWN0T2Zmc2V0R2VuZXJhbC11cGRhdGVcIjogcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9wcm9kdWN0L21vZHVsZXMvcHJvZHVjdE9mZnNldEdlbmVyYWwudXBkYXRlL2xhbmcuZXMtTVgnKSxcbiAgICAgICAgICAgICAgICBcInByb2R1Y3RPZmZzZXRQYWdpbmF0ZWQtYWRkXCI6IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvcHJvZHVjdC9tb2R1bGVzL3Byb2R1Y3RPZmZzZXRQYWdpbmF0ZWQuYWRkL2xhbmcuZXMtTVgnKSxcbiAgICAgICAgICAgICAgICBcInByb2R1Y3RPZmZzZXRQYWdpbmF0ZWQtdXBkYXRlXCI6e1xuICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCIgOiBcImFjdHVhbGl6YXIgcHJvZHVjdG9cIixcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgU1VQUExJRVIgXG4gICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbiAgICAgICAgICAgICAgICBcInN1cHBsaWVyXCI6IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvc3VwcGxpZXIvbGFuZy5lcy1NWCcpLFxuICAgICAgICAgICAgICAgIFwic3VwcGxpZXItYWRkXCI6IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvc3VwcGxpZXIvbW9kdWxlcy9zdXBwbGllci5hZGQvbGFuZy5lcy1NWCcpLFxuICAgICAgICAgICAgICAgIFwic3VwcGxpZXItdXBkYXRlXCI6IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvc3VwcGxpZXIvbW9kdWxlcy9zdXBwbGllci51cGRhdGUvbGFuZy5lcy1NWCcpLFxuICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgUEFQRVIgXG4gICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbiAgICAgICAgICAgICAgICBcInBhcGVyXCI6IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvcGFwZXIvbGFuZy5lcy1NWCcpLFxuICAgICAgICAgICAgICAgIFwicGFwZXItYWRkXCI6IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvcGFwZXIvbW9kdWxlcy9wYXBlci5hZGQvbGFuZy5lcy1NWCcpLFxuICAgICAgICAgICAgICAgIFwicGFwZXItdXBkYXRlXCI6IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvcGFwZXIvbW9kdWxlcy9wYXBlci51cGRhdGUvbGFuZy5lcy1NWCcpLFxuICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgTUFDSElORSBcbiAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuICAgICAgICAgICAgICAgIFwibWFjaGluZVwiOiByZXF1aXJlKCcuLi8uLi9tb2R1bGVzL21hY2hpbmUvbGFuZy5lcy1NWCcpLFxuICAgICAgICAgICAgICAgIFwibWFjaGluZS1hZGRcIjogcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9tYWNoaW5lL21vZHVsZXMvbWFjaGluZS5hZGQvbGFuZy5lcy1NWCcpLFxuICAgICAgICAgICAgICAgIFwibWFjaGluZS11cGRhdGVcIjogcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9tYWNoaW5lL21vZHVsZXMvbWFjaGluZS51cGRhdGUvbGFuZy5lcy1NWCcpLFxuICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgTUFDSElORSBcbiAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuICAgICAgICAgICAgICAgIFwiaW5rXCI6IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvaW5rL2xhbmcuZXMtTVgnKSxcbiAgICAgICAgICAgICAgICBcImluay1hZGRcIjogcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9pbmsvbW9kdWxlcy9pbmsuYWRkL2xhbmcuZXMtTVgnKSxcbiAgICAgICAgICAgICAgICBcImluay11cGRhdGVcIjogcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9pbmsvbW9kdWxlcy9pbmsudXBkYXRlL2xhbmcuZXMtTVgnKSxcbiAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgIFVTRVIgXG4gICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbiAgICAgICAgICAgICAgICBcInVzZXJcIjogcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy91c2VyL2xhbmcuZXMtTVgnKSxcbiAgICAgICAgICAgICAgICBcInVzZXItYWRkXCI6IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvdXNlci9tb2R1bGVzL3VzZXIuYWRkL2xhbmcuZXMtTVgnKSxcbiAgICAgICAgICAgICAgICBcInVzZXItdXBkYXRlXCI6IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvdXNlci9tb2R1bGVzL3VzZXIudXBkYXRlL2xhbmcuZXMtTVgnKSxcbiAgICAgICAgICAgICAgICBcInVzZXItcHJvZmlsZVwiOiByZXF1aXJlKCcuLi8uLi9tb2R1bGVzL3VzZXIvbW9kdWxlcy91c2VyLnByb2ZpbGUvbGFuZy5lcy1NWCcpLFxuICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgV09SSyBPUkRFUiBcbiAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuICAgICAgICAgICAgICAgIFwid29cIjogcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy93by9sYW5nLmVzLU1YJyksXG4gICAgICAgICAgICAgICAgXCJ3by1hZGRcIjogcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy93by9tb2R1bGVzL3dvLmFkZC9sYW5nLmVzLU1YJyksXG4gICAgICAgICAgICAgICAgXCJ3by11cGRhdGVcIjogcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy93by9tb2R1bGVzL3dvLnVwZGF0ZS9sYW5nLmVzLU1YJyksXG4gICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICBBVVRIIFxuICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4gICAgICAgICAgICAgICAgXCJhdXRoXCI6IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvYXV0aC9sYW5nLmVzLU1YJyksXG4gICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICBaT05FIFxuICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4gICAgICAgICAgICAgICAgXCJ6b25lXCI6IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvem9uZS9sYW5nLmVzLU1YJyksXG4gICAgICAgICAgICAgICAgXCJ6b25lLWFkZFwiOiByZXF1aXJlKCcuLi8uLi9tb2R1bGVzL3pvbmUvbW9kdWxlcy96b25lLmFkZC9sYW5nLmVzLU1YJyksXG4gICAgICAgICAgICAgICAgXCJ6b25lLXVwZGF0ZVwiOiByZXF1aXJlKCcuLi8uLi9tb2R1bGVzL3pvbmUvbW9kdWxlcy96b25lLnVwZGF0ZS9sYW5nLmVzLU1YJyksXG4gICAgICAgICAgICB9IiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIiA6IFwiaW5pY2lhciBzZXNpw7NuXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiZW50ZXJwcmlzZVwiIDogXCJlbXByZXNhXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidXNlclwiIDogXCJ1c3VhcmlvXCIsXG4gICAgICAgICAgICAgICAgICAgIFwicGFzc3dvcmRcIiA6IFwiY29udHJhc2XDsWFcIixcbiAgICAgICAgICAgICAgICB9IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckc2NvcGUnLCAnY2xpZW50RmFjJywgJyRsb2NhdGlvbicsICdpMThuRmlsdGVyJyxcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgY2xpZW50RmFjLCAkbG9jYXRpb24sIGkxOG5GaWx0ZXIpIHtcbiAgICAgICAgICAgICRzY29wZS5mbURhdGEgPSB7fTtcbiAgICAgICAgICAgICRzY29wZS5sYWJlbHMgPSBPYmplY3Qua2V5cyhpMThuRmlsdGVyKFwiY2xpZW50LmxhYmVsc1wiKSk7XG4gICAgICAgICAgICAkc2NvcGUuY29sdW1ucyA9IGkxOG5GaWx0ZXIoXCJjbGllbnQuY29sdW1uc1wiKTtcbiAgICAgICAgXG4gICAgICAgICAgICAvLyBmb3JtYXRJdGVtIGV2ZW50IGhhbmRsZXJcbiAgICAgICAgICAgIHZhciBjbF9pZDtcbiAgICAgICAgICAgICRzY29wZS5mb3JtYXRJdGVtID0gZnVuY3Rpb24gKHMsIGUsIGNlbGwpIHtcblxuICAgICAgICAgICAgICAgIGlmIChlLnBhbmVsLmNlbGxUeXBlID09IHdpam1vLmdyaWQuQ2VsbFR5cGUuUm93SGVhZGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGUuY2VsbC50ZXh0Q29udGVudCA9IGUucm93ICsgMTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBzLnJvd3MuZGVmYXVsdFNpemUgPSAzMDtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIGFkZCBCb290c3RyYXAgaHRtbFxuICAgICAgICAgICAgICAgIGlmICgoZS5wYW5lbC5jZWxsVHlwZSA9PSB3aWptby5ncmlkLkNlbGxUeXBlLkNlbGwpICYmIChlLmNvbCA9PSAwKSkge1xuICAgICAgICAgICAgICAgICAgICBjbF9pZCA9IGUucGFuZWwuZ2V0Q2VsbERhdGEoZS5yb3csIDEsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgZS5jZWxsLnN0eWxlLm92ZXJmbG93ID0gJ3Zpc2libGUnO1xuICAgICAgICAgICAgICAgICAgICBlLmNlbGwuaW5uZXJIVE1MID0gJzxkaXYgY2xhc3M9XCJidG4tZ3JvdXAgYnRuLWdyb3VwLWp1c3RpZmllZFwiIHJvbGU9XCJncm91cFwiIGFyaWEtbGFiZWw9XCIuLi5cIj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidG4tZ3JvdXBcIiByb2xlPVwiZ3JvdXBcIj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiIy9jbGllbnQvdXBkYXRlLycrIGNsX2lkICsgJ1wiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0IGJ0bi14c1wiIG5nLWNsaWNrPVwiZWRpdCgkaXRlbS5jbF9pZClcIj4nICsgaTE4bkZpbHRlcihcImdlbmVyYWwubGFiZWxzLmVkaXRcIikgKyAnPC9hPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYnRuLWdyb3VwXCI+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0ICBidG4teHMgZHJvcGRvd24tdG9nZ2xlXCIgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiIGFyaWEtZXhwYW5kZWQ9XCJmYWxzZVwiPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICcrIGkxOG5GaWx0ZXIoXCJnZW5lcmFsLmxhYmVscy5hZGRcIikgKyAnIDxzcGFuIGNsYXNzPVwiY2FyZXRcIj48L3NwYW4+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51XCIgcm9sZT1cIm1lbnVcIj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiMvd28vYWRkLycrIGNsX2lkICsgJ1wiPjxzcGFuIGNsYXNzPVwiZ2x5cGhpY29uIGdseXBoaWNvbi10aC1sYXJnZVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvc3Bhbj4gT3JkZW48L2E+PC9saT5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiMvcHJvZHVjdC9hZGQvXCIgZGF0YS10b2dnbGU9XCJtb2RhbFwiIGRhdGEtdGFyZ2V0PVwiI215TW9kYWxcIiBkYXRhLWNsX2lkPVwiJysgY2xfaWQgKyAnXCI+PHNwYW4gY2xhc3M9XCJnbHlwaGljb24gZ2x5cGhpY29uLWJhcmNvZGVcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L3NwYW4+IFByb2R1Y3RvPC9hPjwvbGk+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjL3F1b3RlL2FkZC8nKyBjbF9pZCArICdcIj48c3BhbiBjbGFzcz1cImdseXBoaWNvbiBnbHlwaGljb24tZmlsZVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvc3Bhbj4gQ290aXphY2lvbjwvYT48L2xpPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiIy96b25lL2FkZC8nKyBjbF9pZCArICdcIj48c3BhbiBjbGFzcz1cImdseXBoaWNvbiBnbHlwaGljb24tbWFwLW1hcmtlclwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvc3Bhbj4gWm9uYTwvYT48L2xpPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiIy9lbWFpbC9hZGQvJysgY2xfaWQgKyAnXCI+PHNwYW4gY2xhc3M9XCJnbHlwaGljb24gZ2x5cGhpY29uLWVudmVsb3BlXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9zcGFuPiBDb3JyZW88L2E+PC9saT5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC91bD5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJ0bi1ncm91cFwiPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdCAgYnRuLXhzIGRyb3Bkb3duLXRvZ2dsZVwiIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIiBhcmlhLWV4cGFuZGVkPVwiZmFsc2VcIj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnKyBpMThuRmlsdGVyKFwiZ2VuZXJhbC5sYWJlbHMuc2hvd1wiKSArICcgPHNwYW4gY2xhc3M9XCJjYXJldFwiPjwvc3Bhbj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnVcIiByb2xlPVwibWVudVwiPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiIy93by8nKyBjbF9pZCArICdcIj48c3BhbiBjbGFzcz1cImdseXBoaWNvbiBnbHlwaGljb24tbGlzdC1hbHRcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L3NwYW4+IE9yZGVuZXM8L2E+PC9saT5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiMvcHJvZHVjdC8nKyBjbF9pZCArICdcIj48c3BhbiBjbGFzcz1cImdseXBoaWNvbiBnbHlwaGljb24tbGlzdC1hbHRcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L3NwYW4+IFByb2R1Y3RvczwvYT48L2xpPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiIy9xdW90ZS8nKyBjbF9pZCArICdcIj48c3BhbiBjbGFzcz1cImdseXBoaWNvbiBnbHlwaGljb24tbGlzdC1hbHRcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L3NwYW4+IENvdGl6YWNpb25lczwvYT48L2xpPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiIy96b25lLycrIGNsX2lkICsgJ1wiPjxzcGFuIGNsYXNzPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1saXN0LWFsdFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvc3Bhbj4gWm9uYXM8L2E+PC9saT5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiMvZW1haWwvJysgY2xfaWQgKyAnXCI+PHNwYW4gY2xhc3M9XCJnbHlwaGljb24gZ2x5cGhpY29uLWxpc3QtYWx0XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9zcGFuPiBDb3JyZW9zPC9hPjwvbGk+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdWw+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+JztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAgICAgLy8gYmluZCBjb2x1bW5zIHdoZW4gZ3JpZCBpcyBpbml0aWFsaXplZFxuICAgICAgICAgICAgJHNjb3BlLmluaXRHcmlkID0gZnVuY3Rpb24gKHMsIGUpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8ICRzY29wZS5sYWJlbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbCA9IG5ldyB3aWptby5ncmlkLkNvbHVtbigpO1xuICAgICAgICAgICAgICAgICAgICBjb2wuYmluZGluZyA9ICRzY29wZS5jb2x1bW5zW2ldO1xuICAgICAgICAgICAgICAgICAgICBjb2wuaGVhZGVyID0gaTE4bkZpbHRlcihcImNsaWVudC5sYWJlbHMuXCIgKyAkc2NvcGUubGFiZWxzW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgY29sLndvcmRXcmFwID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGNvbC53aWR0aCA9IDE1MDtcbiAgICAgICAgICAgICAgICAgICAgcy5jb2x1bW5zLnB1c2goY29sKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgLy8gY3JlYXRlIHRoZSB0b29sdGlwIG9iamVjdFxuICAgICAgICAgICAgJHNjb3BlLiR3YXRjaCgnZ2dHcmlkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICgkc2NvcGUuZ2dHcmlkKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAvLyBzdG9yZSByZWZlcmVuY2UgdG8gZ3JpZFxuICAgICAgICAgICAgICAgICAgICB2YXIgZmxleCA9ICRzY29wZS5nZ0dyaWQ7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY3JlYXRlIHRvb2x0aXBcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRpcCA9IG5ldyB3aWptby5Ub29sdGlwKCksXG4gICAgICAgICAgICAgICAgICAgICAgICBybmcgPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIG1vbml0b3IgdGhlIG1vdXNlIG92ZXIgdGhlIGdyaWRcbiAgICAgICAgICAgICAgICAgICAgZmxleC5ob3N0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaHQgPSBmbGV4LmhpdFRlc3QoZXZ0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaHQuY2VsbFJhbmdlLmVxdWFscyhybmcpKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBuZXcgY2VsbCBzZWxlY3RlZCwgc2hvdyB0b29sdGlwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGh0LmNlbGxUeXBlID09IHdpam1vLmdyaWQuQ2VsbFR5cGUuQ2VsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBybmcgPSBodC5jZWxsUmFuZ2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb2wgPSBmbGV4LmNvbHVtbnNbcm5nLmNvbF0uaGVhZGVyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2VsbEVsZW1lbnQgPSBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KGV2dC5jbGllbnRYLCBldnQuY2xpZW50WSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjZWxsQm91bmRzID0gd2lqbW8uUmVjdC5mcm9tQm91bmRpbmdSZWN0KGNlbGxFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEgPSB3aWptby5lc2NhcGVIdG1sKGZsZXguZ2V0Q2VsbERhdGEocm5nLnJvdywgcm5nLmNvbCwgdHJ1ZSkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlwQ29udGVudCA9IGNvbCArICc6IFwiPGI+JyArIGRhdGEgKyAnPC9iPlwiJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNlbGxFbGVtZW50LmNsYXNzTmFtZS5pbmRleE9mKCd3ai1jZWxsJykgPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlwLnNob3coZmxleC5ob3N0RWxlbWVudCwgdGlwQ29udGVudCwgY2VsbEJvdW5kcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXAuaGlkZSgpOyAvLyBjZWxsIG11c3QgYmUgYmVoaW5kIHNjcm9sbCBiYXIuLi5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGZsZXguaG9zdEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXAuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcm5nID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICQoJyNteU1vZGFsJykub24oJ3Nob3cuYnMubW9kYWwnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgICAgICB2YXIgYnV0dG9uID0gJChldmVudC5yZWxhdGVkVGFyZ2V0KTsgLy8gQnV0dG9uIHRoYXQgdHJpZ2dlcmVkIHRoZSBtb2RhbFxuICAgICAgICAgICAgICAgICRzY29wZS5jdXJyZW50X2lkID0gYnV0dG9uLmRhdGEoJ2NsX2lkJyk7IC8vIEV4dHJhY3QgaW5mbyBmcm9tIGRhdGEtKiBhdHRyaWJ1dGVzXG4gICAgICAgICAgICAgICAgJHNjb3BlLmZtRGF0YS5wcl9wcm9jZXNzID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICRzY29wZS5mbURhdGEucHJfdHlwZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAkc2NvcGUucmVkaXJlY3QgPSBmdW5jdGlvbiAodXJsKSB7XG4gICAgICAgICAgICAgICAgJCgnI215TW9kYWwnKS5tb2RhbCgnaGlkZScpO1xuICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKHVybCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICRzY29wZS5wcl9wcm9jZXNzb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJjbGllbnQtY3VzdG9tLmZpZWxkcy5wcl9wcm9jZXNzb3B0aW9uc1wiKTtcblxuICAgICAgICAgICAgJHNjb3BlLiR3YXRjaCgnZm1EYXRhLnByX3Byb2Nlc3MnLCBmdW5jdGlvbiAobmV3VmFsdWUsIG9sZFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmZtRGF0YS5wcl90eXBlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUucHJfcHJvY2Vzc29wdGlvbnMsIGZ1bmN0aW9uIChvYmosIGtleSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAobmV3VmFsdWUgPT0gb2JqLnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUucHJfdHlwZW9wdGlvbnMgPSBvYmoudHlwZXM7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkc2NvcGUuJG9uKCckdmlld0NvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgLy8gdGhpcyBjb2RlIGlzIGV4ZWN1dGVkIGFmdGVyIHRoZSB2aWV3IGlzIGxvYWRlZFxuICAgICAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBjbGllbnRGYWMuZGF0YSgpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZGF0YSA9IG5ldyB3aWptby5jb2xsZWN0aW9ucy5Db2xsZWN0aW9uVmlldyhwcm9taXNlLmRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfV07XG4gICAgXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRodHRwJywgJyRxJywgJyRhbGVydHMnLCBmdW5jdGlvbiAoJGh0dHAsICRxLCAkYWxlcnRzKSB7XG4gICAgICAgIHZhciBmYWN0b3J5ID0ge307XG4gICAgICAgIGZhY3RvcnkuZGF0YSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKFxuICAgICAgICAgICAgICAgICRodHRwLnBvc3QoJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9jbGllbnQvJywge1xuICAgICAgICAgICAgICAgICAgICAvKiBQT1NUIHZhcmlhYmxlcyBoZXJlICovXG4gICAgICAgICAgICAgICAgICAgIHByb2NjZXNfaWQ6IG5ldyBEYXRlKCkuZ2V0TWlsbGlzZWNvbmRzKClcbiAgICAgICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0YWNrRXJyb3IgPSBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IGRhdGEuc3RhdHVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGRhdGEuZXJyb3IsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvclR5cGU6IGRhdGEudHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZzogY29uZmlnXG4gICAgICAgICAgICAgICAgICAgIH0sIG51bGwsIDQpO1xuICAgICAgICAgICAgICAgICAgICAkYWxlcnRzLmVycm9yKCdXb29vcHMhIGFuIGVycm9yIGhhcyBvY3VycmVkLicsIHN0YWNrRXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBmYWN0b3J5O1xuICAgIH1dO1xuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbihhbmd1bGFyKXtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgLy9jb21tZW50XG5cbiAgICByZXR1cm4gYW5ndWxhci5tb2R1bGUoJ2FwcC5jbGllbnQnLFtcbiAgICAgICAgcmVxdWlyZSgnLi9tb2R1bGVzL2NsaWVudC5hZGQnKS5uYW1lLFxuICAgICAgICByZXF1aXJlKCcuL21vZHVsZXMvY2xpZW50LnVwZGF0ZScpLm5hbWVcbiAgICBdKVxuXG4gICAgLmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsXG4gICAgZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnY2xpZW50Jywge1xuICAgICAgICAgICAgdXJsOicvY2xpZW50JyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsIDogJ21vZHVsZXMvY2xpZW50L2NsaWVudC52aWV3Lmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlciA6ICdjbGllbnRDdHJsJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICByZXF1aXJlc0xvZ2luOiB0cnVlXG4gICAgICAgICAgICB9ICAgIFxuICAgICAgICB9KTtcbiAgICB9XSlcblxuICAgIC5mYWN0b3J5KCdjbGllbnRGYWMnLHJlcXVpcmUoJy4vY2xpZW50LmZhYycpKVxuXG4gICAgLmNvbnRyb2xsZXIoJ2NsaWVudEN0cmwnLHJlcXVpcmUoJy4vY2xpZW50LmN0cmwnKSlcbiAgICBcbn0pKGFuZ3VsYXIpO1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgICAgICAgICAgICAgICAgIFwibGFiZWxzXCI6e1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci10aXRsZVwiOlwiU2VsZWNjw61vbmUgZWwgdGlwbyBkZSBwcm9kdWN0b1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1wcm9jZXNzXCI6XCJQcm9jZXNzb1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci10eXBlXCI6XCJUaXBvXCIsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICBcImZpZWxkc1wiIDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJfcHJvY2Vzc29wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIk9mZnNldFwiLFwidmFsdWVcIjpcIm9mZnNldFwiLHR5cGVzOltcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkdlbmVyYWxcIixcInZhbHVlXCI6XCJnZW5lcmFsXCJ9LCAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiUGFnaW5hZG9zXCIsXCJ2YWx1ZVwiOlwicGFnaW5hdGVkXCJ9LCAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiY291bnRlcmZvaWxcIixcInZhbHVlXCI6XCJjb3VudGVyZm9pbFwifSwgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiRmxleG9cIixcInZhbHVlXCI6XCJmbGV4b1wiLHR5cGVzOltcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkV0aXF1ZXRhc1wiLFwidmFsdWVcIjpcImxhYmVsc1wifSwgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIlJpYmJvbnNcIixcInZhbHVlXCI6XCJyaWJib25zXCJ9LCAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiY291bnRlcmZvaWxcIixcInZhbHVlXCI6XCJvZmZzZXRcIn0sICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXX0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIlBsb3RlclwiLFwidmFsdWVcIjpcInBsb3R0ZXJcIix0eXBlczpbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJFdGlxdWV0YXNcIixcInZhbHVlXCI6XCJsYWJlbHNcIn0sICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJTZcOxYWxpemFjacOzblwiLFwidmFsdWVcIjpcInNpZ25hZ2VcIn0sICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJCYW5uZXJzXCIsXCJ2YWx1ZVwiOlwiYmFubmVyc1wifSwgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkFydGljdWxvc1wiLFwidmFsdWVcIjpcIkFydGljbGVzXCJ9LCAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF19LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJTZWxsb3NcIixcInZhbHVlXCI6XCJzZWFsc1wiLHR5cGVzOltcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkdvbWFcIixcInZhbHVlXCI6XCJydWJiZXJcIn0sICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJNb2xkdXJhXCIsXCJ2YWx1ZVwiOlwibW9sZGluZ1wifSwgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkF1dG9lbnRpbnRhYmxlXCIsXCJ2YWx1ZVwiOlwic2VsZl90aW50YWJsZVwifSwgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkNvamluXCIsXCJ2YWx1ZVwiOlwicGFkXCJ9LCAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiVGludGFcIixcInZhbHVlXCI6XCJpbmtcIn0sICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXX0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIlNlcmlncmFmw61hXCIsXCJ2YWx1ZVwiOlwic2VyaWdyYXBoeVwiLHR5cGVzOltcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkV0aXF1ZXRhc1wiLFwidmFsdWVcIjpcImxhYmVsc1wifSwgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIlNlw7FhbGl6YWNpw7NuXCIsXCJ2YWx1ZVwiOlwic2lnbmFnZVwifSwgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkJhbm5lcnNcIixcInZhbHVlXCI6XCJiYW5uZXJzXCJ9LCAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiQXJ0aWN1bG9zXCIsXCJ2YWx1ZVwiOlwiQXJ0aWNsZXNcIn0sICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXX0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkxhc2VyXCIsXCJ2YWx1ZVwiOlwibGFzZXJcIix0eXBlczpbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJMYXNlclwiLFwidmFsdWVcIjpcImxhc2VyXCJ9LCAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXX0sXG4gICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCIgOiBcImNsaWVudGVzXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibGFiZWxzXCI6e1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbC1pZFwiOlwiaWQgY2xpZW50ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbC10eXBlXCI6XCJUaXBvIGRlIENsaWVudGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2wtY29ycG9yYXRlbmFtZVwiOlwicmF6w7NuIHNvY2lhbFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbC10aW5cIjpcInJmY1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbC1uYW1lXCI6XCJub21icmVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2wtZmF0aGVyc2xhc3RuYW1lXCI6XCJhcGVsbGlkbyBwYXRlcm5vXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsLW1vdGhlcnNsYXN0bmFtZVwiOlwiYXBlbGxpZG8gbWF0ZXJub1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbC1zdHJlZXRcIjpcImNhbGxlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsLXN0cmVldG51bWJlclwiOlwibnVtZXJvIGV4dGVyaW9yXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsLXN1aXRlbnVtYmVyXCI6XCJudW1lcm8gaW50ZXJpb3JcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2wtbmVpZ2hib3Job29kXCI6XCJjb2xvbmlhXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsLWFkZHJlc3NyZWZlcmVuY2VcIjpcInJlZmVyZW5jaWFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2wtY291bnRyeVwiOlwicGHDrXNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2wtc3RhdGVcIjpcImVzdGFkb1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbC1jaXR5XCI6XCJjaXVkYWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2wtY291bnR5XCI6XCJtdW5pY2lwaW9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2wtemlwY29kZVwiOlwiY29kaWdvIHBvc3RhbFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbC1lbWFpbFwiOlwiY29ycmVvIGVsZWN0csOzbmljb1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbC1waG9uZVwiOlwidGVsw6lmb25vXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsLW1vYmlsZVwiOlwibcOzdmlsXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsLWNyZWRpdGxpbWl0XCI6XCJsaW1pdGUgZGUgY3LDqWRpdG9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2wtY3VzdG9tZXJkaXNjb3VudFwiOlwiZGVzY3VlbnRvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsLXN0YXR1c1wiOlwiZXN0YXR1c1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbC1kYXRlXCI6XCJmZWNoYVwiLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgXCJjb2x1bW5zXCI6W1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbF9pZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbF90eXBlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsX2NvcnBvcmF0ZW5hbWVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xfdGluXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsX25hbWVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xfZmF0aGVyc2xhc3RuYW1lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsX21vdGhlcnNsYXN0bmFtZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbF9zdHJlZXRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xfc3RyZWV0bnVtYmVyXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsX3N1aXRlbnVtYmVyXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsX25laWdoYm9yaG9vZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbF9hZGRyZXNzcmVmZXJlbmNlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsX2NvdW50cnlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xfc3RhdGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xfY2l0eVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbF9jb3VudHlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xfemlwY29kZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbF9lbWFpbFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbF9waG9uZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbF9tb2JpbGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xfY3JlZGl0bGltaXRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xfY3VzdG9tZXJkaXNjb3VudFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbF9zdGF0dXNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xfZGF0ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgIFwiZmllbGRzXCIgOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbF9zdGF0dXNvcHRpb25zIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJBY3Rpdm9cIixcInZhbHVlXCI6XCJBXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJJbmFjdGl2b1wiLFwidmFsdWVcIjpcIklcIn1cbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBjbF90eXBlb3B0aW9ucyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiRmlzaWNhXCIsXCJ2YWx1ZVwiOlwibmF0dXJhbFwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiTW9yYWxcIixcInZhbHVlXCI6XCJsZWdhbFwifVxuICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0iLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRzY29wZScsICdjbGllbnRBZGRGYWMnLCAnJGxvY2F0aW9uJywgJ2kxOG5GaWx0ZXInLCAnJGludGVydmFsJyxcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgY2xpZW50QWRkRmFjLCAkbG9jYXRpb24sIGkxOG5GaWx0ZXIsICRpbnRlcnZhbCkge1xuICAgICAgICAgICAgJHNjb3BlLmZtRGF0YSA9IHt9O1xuICAgICAgICAgICAgJHNjb3BlLmZtRGF0YSA9IHsgXCJjbF90eXBlXCI6IFwibmF0dXJhbFwiLCBcImNsX3RpblwiOiBcIlNBQkctODMwMTA2LUFDQVwiLCBcImNsX25hbWVcIjogXCJHYXNwYXIgQWxlamFuZHJvXCIsIFwiY2xfZmF0aGVyc2xhc3RuYW1lXCI6IFwiU2FuY2hlelwiLCBcImNsX21vdGhlcnNsYXN0bmFtZVwiOiBcIkJldGFuY291cnRcIiwgXCJjbF9jb3VudHJ5XCI6IDM5OTYwNjMsIFwiY2xfc3RhdGVcIjogNDAxNDMzNiwgXCJjbF9jaXR5XCI6IDg1ODE4MTYsIFwiY2xfY291bnR5XCI6IDg1ODE4MTYsIFwiY2xfc3RyZWV0XCI6IFwiQVYgR1VBREFMVVBFXCIsIFwiY2xfc3RyZWV0bnVtYmVyXCI6IFwiNjg3N1wiLCBcImNsX3N1aXRlbnVtYmVyXCI6IFwiODFcIiwgXCJjbF9uZWlnaGJvcmhvb2RcIjogXCJQTEFaQSBHVUFEQUxVUEVcIiwgXCJjbF96aXBjb2RlXCI6IFwiNDUwMzZcIiwgXCJjbF9hZGRyZXNzcmVmZXJlbmNlXCI6IFwiRlJJREEgS0hBTE8gWSBBViBHVUFEQUxVUEVcIiwgXCJjbF9lbWFpbFwiOiBcImFsZWphbmRyb2xzY2FAZ21haWwuY29tXCIsIFwiY2xfcGhvbmVcIjogXCIzMzM3OTc5MTM1XCIsIFwiY2xfbW9iaWxlXCI6IFwiKzUyMTMzMTAxMTI1NzZcIiwgXCJjbF9jcmVkaXRsaW1pdFwiOiBcIjEwMDAwLjAwXCIsIFwiY2xfY3VzdG9tZXJkaXNjb3VudFwiOiBcIjAuMTBcIiwgXCJjbF9zdGF0dXNcIjogXCJBXCIgfVxuXG4gICAgICAgICAgICAkc2NvcGUub25TdWJtaXQgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICBjbGllbnRBZGRGYWMuYWRkKCRzY29wZS5mbURhdGEpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb21pc2UuZGF0YS5yb3dDb3VudCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9jbGllbnQnKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS51cGRhdGVGYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgJHNjb3BlLmdldFN0YXRlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUuY2xfc3RhdGVvcHRpb25zID0gW107XG4gICAgICAgICAgICAgICAgJHNjb3BlLmNsX2NpdHlvcHRpb25zID0gW107XG4gICAgICAgICAgICAgICAgJHNjb3BlLmNsX2NvdW50eW9wdGlvbnMgPSBbXTtcbiAgICAgICAgICAgICAgICAkaW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBjbGllbnRBZGRGYWMuZ2V0U3RhdGVzKCRzY29wZS5mbURhdGEuY2xfY291bnRyeSkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEuZ2VvbmFtZXMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNsX3N0YXRlb3B0aW9ucyA9IHByb21pc2UuZGF0YS5nZW9uYW1lcztcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8kc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sIDAsIDEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkc2NvcGUuZ2V0Q2l0eUNvdW50eSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUuY2xfY2l0eW9wdGlvbnMgPSBbXTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuY2xfY291bnR5b3B0aW9ucyA9IFtdO1xuICAgICAgICAgICAgICAgICRpbnRlcnZhbChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGNsaWVudEFkZEZhYy5nZXRTdGF0ZXMoJHNjb3BlLmZtRGF0YS5jbF9zdGF0ZSkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEuZ2VvbmFtZXMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNsX2NpdHlvcHRpb25zID0gcHJvbWlzZS5kYXRhLmdlb25hbWVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5jbF9jb3VudHlvcHRpb25zID0gcHJvbWlzZS5kYXRhLmdlb25hbWVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyRzY29wZS51cGRhdGVGYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSwgMCwgMSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAkc2NvcGUuY2xfc3RhdHVzb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJjbGllbnQuZmllbGRzLmNsX3N0YXR1c29wdGlvbnNcIik7XG4gICAgICAgICAgICAkc2NvcGUuY2xfdHlwZW9wdGlvbnMgPSBpMThuRmlsdGVyKFwiY2xpZW50LmZpZWxkcy5jbF90eXBlb3B0aW9uc1wiKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgJHNjb3BlLiRvbignJHZpZXdDb250ZW50TG9hZGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIC8vIHRoaXMgY29kZSBpcyBleGVjdXRlZCBhZnRlciB0aGUgdmlldyBpcyBsb2FkZWRcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGNsaWVudEFkZEZhYy5nZXRDb3VudHJpZXMoKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhLmdlb25hbWVzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNsX2NvdW50cnlvcHRpb25zID0gcHJvbWlzZS5kYXRhLmdlb25hbWVzO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8kc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1dO1xuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRodHRwJywgJyRxJywgJyRhbGVydHMnLCAnJHN0YXRlUGFyYW1zJywgZnVuY3Rpb24gKCRodHRwLCAkcSwgJGFsZXJ0cywgJHN0YXRlUGFyYW1zKSB7XG4gICAgICAgIHZhciBmYWN0b3J5ID0ge307XG4gICAgICAgIGZhY3RvcnkuYWRkID0gZnVuY3Rpb24gKGNsX2pzb25iKSB7XG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9ICRodHRwLnBvc3QoJy9jbGllbnQvYWRkJywge1xuICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICBjbF9qc29uYjogY2xfanNvbmJcbiAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICB2YXIgc3RhY2tFcnJvciA9IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogZGF0YS5zdGF0dXMsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjogZGF0YS5lcnJvcixcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yVHlwZTogZGF0YS50eXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnOiBjb25maWdcbiAgICAgICAgICAgICAgICAgICAgfSwgbnVsbCwgNCk7XG4gICAgICAgICAgICAgICAgICAgICRhbGVydHMuZXJyb3IoJ1dvb29wcyEgYW4gZXJyb3IgaGFzIG9jdXJyZWQuJywgc3RhY2tFcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICBmYWN0b3J5LmdldENvdW50cmllcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gJGh0dHAuanNvbnAoJ2h0dHA6Ly9hcGkuZ2VvbmFtZXMub3JnL2NvdW50cnlJbmZvSlNPTj91c2VybmFtZT1hbGVqYW5kcm9sc2NhJmNhbGxiYWNrPUpTT05fQ0FMTEJBQ0snKVxuICAgICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0YWNrRXJyb3IgPSBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IGRhdGEuc3RhdHVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGRhdGEuZXJyb3IsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvclR5cGU6IGRhdGEudHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZzogY29uZmlnXG4gICAgICAgICAgICAgICAgICAgIH0sIG51bGwsIDQpO1xuICAgICAgICAgICAgICAgICAgICAkYWxlcnRzLmVycm9yKCdXb29vcHMhIGFuIGVycm9yIGhhcyBvY3VycmVkLicsIHN0YWNrRXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkuZ2V0U3RhdGVzID0gZnVuY3Rpb24gKGNsX2NvdW50cnkpIHtcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gJGh0dHAuanNvbnAoJ2h0dHA6Ly9hcGkuZ2VvbmFtZXMub3JnL2NoaWxkcmVuSlNPTj9nZW9uYW1lSWQ9JyArIGNsX2NvdW50cnkgKyAnJnVzZXJuYW1lPWFsZWphbmRyb2xzY2EmY2FsbGJhY2s9SlNPTl9DQUxMQkFDSycpXG4gICAgICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc3RhY2tFcnJvciA9IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogZGF0YS5zdGF0dXMsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjogZGF0YS5lcnJvcixcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yVHlwZTogZGF0YS50eXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnOiBjb25maWdcbiAgICAgICAgICAgICAgICAgICAgfSwgbnVsbCwgNCk7XG4gICAgICAgICAgICAgICAgICAgICRhbGVydHMuZXJyb3IoJ1dvb29wcyEgYW4gZXJyb3IgaGFzIG9jdXJyZWQuJywgc3RhY2tFcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeS5nZXRDaXR5Q291bnR5ID0gZnVuY3Rpb24gKGNsX3N0YXRlKSB7XG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9ICRodHRwLmpzb25wKCdodHRwOi8vYXBpLmdlb25hbWVzLm9yZy9jaGlsZHJlbkpTT04/Z2VvbmFtZUlkPScgKyBjbF9zdGF0ZSArICcmdXNlcm5hbWU9YWxlamFuZHJvbHNjYSZjYWxsYmFjaz1KU09OX0NBTExCQUNLJylcbiAgICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzdGFja0Vycm9yID0gSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiBkYXRhLnN0YXR1cyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yOiBkYXRhLmVycm9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JUeXBlOiBkYXRhLnR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25maWc6IGNvbmZpZ1xuICAgICAgICAgICAgICAgICAgICB9LCBudWxsLCA0KTtcbiAgICAgICAgICAgICAgICAgICAgJGFsZXJ0cy5lcnJvcignV29vb3BzISBhbiBlcnJvciBoYXMgb2N1cnJlZC4nLCBzdGFja0Vycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZmFjdG9yeTtcbiAgICB9XTtcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oYW5ndWxhcil7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIFxuICAgIHJldHVybiBhbmd1bGFyLm1vZHVsZSgnYXBwLmNsaWVudC5hZGQnLFtdKVxuXG4gICAgLmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsXG4gICAgZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnY2xpZW50QWRkJywge1xuICAgICAgICAgICAgdXJsOicvY2xpZW50L2FkZCcsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybCA6ICdtb2R1bGVzL2NsaWVudC9tb2R1bGVzL2NsaWVudC5hZGQvY2xpZW50LmFkZC52aWV3Lmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlciA6ICdjbGllbnRBZGRDdHJsJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICByZXF1aXJlc0xvZ2luOiB0cnVlXG4gICAgICAgICAgICB9ICAgIFxuICAgICAgICB9KTtcbiAgICB9XSlcblxuICAgIC5mYWN0b3J5KCdjbGllbnRBZGRGYWMnLHJlcXVpcmUoJy4vY2xpZW50LmFkZC5mYWMnKSlcblxuICAgIC5jb250cm9sbGVyKCdjbGllbnRBZGRDdHJsJyxyZXF1aXJlKCcuL2NsaWVudC5hZGQuY3RybCcpKVxuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiIDogXCJhZ3JlZ2FyIGNsaWVudGVcIixcbiAgICAgICAgICAgICAgICB9IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckc2NvcGUnLCAnY2xpZW50VXBkYXRlRmFjJywgJyRsb2NhdGlvbicsICdpMThuRmlsdGVyJywgJyRpbnRlcnZhbCcsXG4gICAgICAgIGZ1bmN0aW9uICgkc2NvcGUsIGNsaWVudFVwZGF0ZUZhYywgJGxvY2F0aW9uLCBpMThuRmlsdGVyLCAkaW50ZXJ2YWwpIHtcblxuICAgICAgICAgICAgJHNjb3BlLm9uU3VibWl0ID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgY2xpZW50VXBkYXRlRmFjLnVwZGF0ZSgkc2NvcGUuZm1EYXRhKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9taXNlLmRhdGEucm93Q291bnQgPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvY2xpZW50Jyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICRzY29wZS5nZXRTdGF0ZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmNsX3N0YXRlb3B0aW9ucyA9IFtdO1xuICAgICAgICAgICAgICAgICRzY29wZS5jbF9jaXR5b3B0aW9ucyA9IFtdO1xuICAgICAgICAgICAgICAgICRzY29wZS5jbF9jb3VudHlvcHRpb25zID0gW107XG4gICAgICAgICAgICAgICAgJGludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgY2xpZW50VXBkYXRlRmFjLmdldFN0YXRlcygkc2NvcGUuZm1EYXRhLmNsX2NvdW50cnkpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhLmdlb25hbWVzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5jbF9zdGF0ZW9wdGlvbnMgPSBwcm9taXNlLmRhdGEuZ2VvbmFtZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vJHNjb3BlLnVwZGF0ZUZhaWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LCAwLCAxKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJHNjb3BlLmdldENpdHlDb3VudHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmNsX2NpdHlvcHRpb25zID0gW107XG4gICAgICAgICAgICAgICAgJHNjb3BlLmNsX2NvdW50eW9wdGlvbnMgPSBbXTtcbiAgICAgICAgICAgICAgICAkaW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBjbGllbnRVcGRhdGVGYWMuZ2V0U3RhdGVzKCRzY29wZS5mbURhdGEuY2xfc3RhdGUpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhLmdlb25hbWVzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5jbF9jaXR5b3B0aW9ucyA9IHByb21pc2UuZGF0YS5nZW9uYW1lcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuY2xfY291bnR5b3B0aW9ucyA9IHByb21pc2UuZGF0YS5nZW9uYW1lcztcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8kc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sIDAsIDEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkc2NvcGUuY2xfc3RhdHVzb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJjbGllbnQuZmllbGRzLmNsX3N0YXR1c29wdGlvbnNcIik7XG4gICAgICAgICAgICAkc2NvcGUuY2xfdHlwZW9wdGlvbnMgPSBpMThuRmlsdGVyKFwiY2xpZW50LmZpZWxkcy5jbF90eXBlb3B0aW9uc1wiKTtcblxuICAgICAgICAgICAgJHNjb3BlLiRvbignJHZpZXdDb250ZW50TG9hZGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIC8vIHRoaXMgY29kZSBpcyBleGVjdXRlZCBhZnRlciB0aGUgdmlldyBpcyBsb2FkZWRcbiAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgY2xpZW50VXBkYXRlRmFjLmRhdGEoKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhKSAmJiBwcm9taXNlLmRhdGEubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZm1EYXRhID0gcHJvbWlzZS5kYXRhWzBdLmNsX2pzb25iO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGNsaWVudFVwZGF0ZUZhYy5nZXRDb3VudHJpZXMoKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YS5nZW9uYW1lcykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuY2xfY291bnRyeW9wdGlvbnMgPSBwcm9taXNlLmRhdGEuZ2VvbmFtZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vJHNjb3BlLnVwZGF0ZUZhaWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsaWVudFVwZGF0ZUZhYy5nZXRTdGF0ZXMoJHNjb3BlLmZtRGF0YS5jbF9jb3VudHJ5KS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEuZ2VvbmFtZXMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5jbF9zdGF0ZW9wdGlvbnMgPSBwcm9taXNlLmRhdGEuZ2VvbmFtZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8kc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGllbnRVcGRhdGVGYWMuZ2V0Q2l0eUNvdW50eSgkc2NvcGUuZm1EYXRhLmNsX3N0YXRlKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEuZ2VvbmFtZXMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5jbF9jaXR5b3B0aW9ucyA9IHByb21pc2UuZGF0YS5nZW9uYW1lcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNsX2NvdW50eW9wdGlvbnMgPSBwcm9taXNlLmRhdGEuZ2VvbmFtZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8kc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XTtcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckaHR0cCcsICckcScsICckYWxlcnRzJywgJyRzdGF0ZVBhcmFtcycsIGZ1bmN0aW9uICgkaHR0cCwgJHEsICRhbGVydHMsICRzdGF0ZVBhcmFtcykge1xuICAgICAgICB2YXIgZmFjdG9yeSA9IHt9O1xuICAgICAgICBmYWN0b3J5LmRhdGEgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KCcvY2xpZW50L2NsX2lkJywge1xuICAgICAgICAgICAgICAgICAgICAvKiBQT1NUIHZhcmlhYmxlcyBoZXJlICovXG4gICAgICAgICAgICAgICAgICAgIGNsX2lkOiAkc3RhdGVQYXJhbXMuY2xfaWRcbiAgICAgICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0YWNrRXJyb3IgPSBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IGRhdGEuc3RhdHVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGRhdGEuZXJyb3IsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvclR5cGU6IGRhdGEudHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZzogY29uZmlnXG4gICAgICAgICAgICAgICAgICAgIH0sIG51bGwsIDQpO1xuICAgICAgICAgICAgICAgICAgICAkYWxlcnRzLmVycm9yKCdXb29vcHMhIGFuIGVycm9yIGhhcyBvY3VycmVkLicsIHN0YWNrRXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkudXBkYXRlID0gZnVuY3Rpb24gKGNsX2pzb25iKSB7XG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KCcvY2xpZW50L3VwZGF0ZScsIHtcbiAgICAgICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgICAgICBjbF9pZDogJHN0YXRlUGFyYW1zLmNsX2lkLFxuICAgICAgICAgICAgICAgICAgICBjbF9qc29uYjogY2xfanNvbmJcbiAgICAgICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0YWNrRXJyb3IgPSBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IGRhdGEuc3RhdHVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGRhdGEuZXJyb3IsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvclR5cGU6IGRhdGEudHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZzogY29uZmlnXG4gICAgICAgICAgICAgICAgICAgIH0sIG51bGwsIDQpO1xuICAgICAgICAgICAgICAgICAgICAkYWxlcnRzLmVycm9yKCdXb29vcHMhIGFuIGVycm9yIGhhcyBvY3VycmVkLicsIHN0YWNrRXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkuZ2V0Q291bnRyaWVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHByb21pc2UgPSAkaHR0cC5qc29ucCgnaHR0cDovL2FwaS5nZW9uYW1lcy5vcmcvY291bnRyeUluZm9KU09OP3VzZXJuYW1lPWFsZWphbmRyb2xzY2EmY2FsbGJhY2s9SlNPTl9DQUxMQkFDSycpXG4gICAgICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc3RhY2tFcnJvciA9IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogZGF0YS5zdGF0dXMsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjogZGF0YS5lcnJvcixcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yVHlwZTogZGF0YS50eXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnOiBjb25maWdcbiAgICAgICAgICAgICAgICAgICAgfSwgbnVsbCwgNCk7XG4gICAgICAgICAgICAgICAgICAgICRhbGVydHMuZXJyb3IoJ1dvb29wcyEgYW4gZXJyb3IgaGFzIG9jdXJyZWQuJywgc3RhY2tFcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeS5nZXRTdGF0ZXMgPSBmdW5jdGlvbiAoY2xfY291bnRyeSkge1xuICAgICAgICAgICAgdmFyIHByb21pc2UgPSAkaHR0cC5qc29ucCgnaHR0cDovL2FwaS5nZW9uYW1lcy5vcmcvY2hpbGRyZW5KU09OP2dlb25hbWVJZD0nICsgY2xfY291bnRyeSArICcmdXNlcm5hbWU9YWxlamFuZHJvbHNjYSZjYWxsYmFjaz1KU09OX0NBTExCQUNLJylcbiAgICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzdGFja0Vycm9yID0gSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiBkYXRhLnN0YXR1cyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yOiBkYXRhLmVycm9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JUeXBlOiBkYXRhLnR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25maWc6IGNvbmZpZ1xuICAgICAgICAgICAgICAgICAgICB9LCBudWxsLCA0KTtcbiAgICAgICAgICAgICAgICAgICAgJGFsZXJ0cy5lcnJvcignV29vb3BzISBhbiBlcnJvciBoYXMgb2N1cnJlZC4nLCBzdGFja0Vycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICBmYWN0b3J5LmdldENpdHlDb3VudHkgPSBmdW5jdGlvbiAoY2xfc3RhdGUpIHtcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gJGh0dHAuanNvbnAoJ2h0dHA6Ly9hcGkuZ2VvbmFtZXMub3JnL2NoaWxkcmVuSlNPTj9nZW9uYW1lSWQ9JyArIGNsX3N0YXRlICsgJyZ1c2VybmFtZT1hbGVqYW5kcm9sc2NhJmNhbGxiYWNrPUpTT05fQ0FMTEJBQ0snKVxuICAgICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0YWNrRXJyb3IgPSBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IGRhdGEuc3RhdHVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGRhdGEuZXJyb3IsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvclR5cGU6IGRhdGEudHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZzogY29uZmlnXG4gICAgICAgICAgICAgICAgICAgIH0sIG51bGwsIDQpO1xuICAgICAgICAgICAgICAgICAgICAkYWxlcnRzLmVycm9yKCdXb29vcHMhIGFuIGVycm9yIGhhcyBvY3VycmVkLicsIHN0YWNrRXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBmYWN0b3J5O1xuICAgIH1dO1xuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbihhbmd1bGFyKXtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgXG4gICAgcmV0dXJuIGFuZ3VsYXIubW9kdWxlKCdhcHAuY2xpZW50LnVwZGF0ZScsW10pXG5cbiAgICAuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJyxcbiAgICBmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdjbGllbnRVcGRhdGUnLCB7XG4gICAgICAgICAgICB1cmw6Jy9jbGllbnQvdXBkYXRlLzpjbF9pZCcsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybCA6ICdtb2R1bGVzL2NsaWVudC9tb2R1bGVzL2NsaWVudC51cGRhdGUvY2xpZW50LnVwZGF0ZS52aWV3Lmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlciA6ICdjbGllbnRVcGRhdGVDdHJsJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICByZXF1aXJlc0xvZ2luOiB0cnVlXG4gICAgICAgICAgICB9ICAgIFxuICAgICAgICB9KTtcbiAgICB9XSlcblxuICAgIC5mYWN0b3J5KCdjbGllbnRVcGRhdGVGYWMnLHJlcXVpcmUoJy4vY2xpZW50LnVwZGF0ZS5mYWMnKSlcblxuICAgIC5jb250cm9sbGVyKCdjbGllbnRVcGRhdGVDdHJsJyxyZXF1aXJlKCcuL2NsaWVudC51cGRhdGUuY3RybCcpKVxuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiIDogXCJhY3R1YWxpemFyIGNsaWVudGVcIixcbiAgICAgICAgICAgICAgICB9IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckc2NvcGUnLCAnaG9tZUZhYycsICdhdXRoJyxcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgaG9tZUZhYywgYXV0aCkge1xuICAgICAgICAgICAgJHNjb3BlLmF1dGggPSBhdXRoO1xuICAgICAgICB9XTtcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckaHR0cCcsICckcScsICckYWxlcnRzJywgZnVuY3Rpb24gKCRodHRwLCAkcSwgJGFsZXJ0cykge1xuICAgICAgICB2YXIgZmFjdG9yeSA9IHt9O1xuICAgICAgICBmYWN0b3J5LmdldExvZ2luID0gZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKFxuICAgICAgICAgICAgICAgICRodHRwLnBvc3QoJ21vZHVsZXMvaG9tZS9ob21lTW9kZWwucGhwJywge1xuICAgICAgICAgICAgICAgICAgICAvKiBQT1NUIHZhcmlhYmxlcyBoZXJlICovXG4gICAgICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzdGFja0Vycm9yID0gSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiBkYXRhLnN0YXR1cyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yOiBkYXRhLmVycm9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JUeXBlOiBkYXRhLnR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25maWc6IGNvbmZpZ1xuICAgICAgICAgICAgICAgICAgICB9LCBudWxsLCA0KTtcbiAgICAgICAgICAgICAgICAgICAgJGFsZXJ0cy5lcnJvcignV29vb3BzISBhbiBlcnJvciBoYXMgb2N1cnJlZC4nLCBzdGFja0Vycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZmFjdG9yeTtcbiAgICB9XTtcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oYW5ndWxhcil7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIFxuICAgIHJldHVybiBhbmd1bGFyLm1vZHVsZSgnYXBwLmhvbWUnLFtdKVxuXG4gICAgLmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsXG4gICAgZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnaG9tZScsIHtcbiAgICAgICAgICAgIHVybDonL2hvbWUnLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmwgOiAnbW9kdWxlcy9ob21lL2hvbWUudmlldy5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXIgOiAnaG9tZUN0cmwnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHJlcXVpcmVzTG9naW46IHRydWVcbiAgICAgICAgICAgIH0gICAgXG4gICAgICAgIH0pO1xuICAgIH1dKVxuXG4gICAgLmZhY3RvcnkoJ2hvbWVGYWMnLHJlcXVpcmUoJy4vaG9tZS5mYWMnKSlcblxuICAgIC5jb250cm9sbGVyKCdob21lQ3RybCcscmVxdWlyZSgnLi9ob21lLmN0cmwnKSlcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIiA6IFwiaW5pY2lvXCIsXG4gICAgICAgICAgICAgICAgICAgIFwid2VsY29tZVwiIDogXCJiaWVudmVuaWRvIEBAIVwiXG4gICAgICAgICAgICAgICAgfSIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKGFuZ3VsYXIpe1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBcbiAgICByZXR1cm4gYW5ndWxhci5tb2R1bGUoJ2FwcC5pbmsnLFtcbiAgICAgICAgcmVxdWlyZSgnLi9tb2R1bGVzL2luay5hZGQnKS5uYW1lLFxuICAgICAgICByZXF1aXJlKCcuL21vZHVsZXMvaW5rLnVwZGF0ZScpLm5hbWVcbiAgICBdKVxuXG4gICAgLmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsXG4gICAgZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnaW5rJywge1xuICAgICAgICAgICAgdXJsOicvaW5rJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsIDogJ21vZHVsZXMvaW5rL2luay52aWV3Lmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlciA6ICdpbmtDdHJsJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICByZXF1aXJlc0xvZ2luOiB0cnVlXG4gICAgICAgICAgICB9ICAgIFxuICAgICAgICB9KTtcbiAgICB9XSlcblxuICAgIC5mYWN0b3J5KCdpbmtGYWMnLHJlcXVpcmUoJy4vaW5rLmZhYycpKVxuXG4gICAgLmNvbnRyb2xsZXIoJ2lua0N0cmwnLHJlcXVpcmUoJy4vaW5rLmN0cmwnKSlcbiAgICBcbn0pKGFuZ3VsYXIpO1xuIiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckc2NvcGUnLCAnaW5rRmFjJywgJ2kxOG5GaWx0ZXInLFxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCBpbmtGYWMsIGkxOG5GaWx0ZXIpIHtcblxuICAgICAgICAgICAgJHNjb3BlLmxhYmVscyA9IE9iamVjdC5rZXlzKGkxOG5GaWx0ZXIoXCJpbmsubGFiZWxzXCIpKTtcbiAgICAgICAgICAgICRzY29wZS5jb2x1bW5zID0gaTE4bkZpbHRlcihcImluay5jb2x1bW5zXCIpO1xuICAgICAgICBcbiAgICAgICAgICAgIC8vIGZvcm1hdEl0ZW0gZXZlbnQgaGFuZGxlclxuICAgICAgICAgICAgdmFyIGluX2lkO1xuICAgICAgICAgICAgJHNjb3BlLmZvcm1hdEl0ZW0gPSBmdW5jdGlvbiAocywgZSwgY2VsbCkge1xuXG4gICAgICAgICAgICAgICAgaWYgKGUucGFuZWwuY2VsbFR5cGUgPT0gd2lqbW8uZ3JpZC5DZWxsVHlwZS5Sb3dIZWFkZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgZS5jZWxsLnRleHRDb250ZW50ID0gZS5yb3cgKyAxO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHMucm93cy5kZWZhdWx0U2l6ZSA9IDMwO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gYWRkIEJvb3RzdHJhcCBodG1sXG4gICAgICAgICAgICAgICAgaWYgKChlLnBhbmVsLmNlbGxUeXBlID09IHdpam1vLmdyaWQuQ2VsbFR5cGUuQ2VsbCkgJiYgKGUuY29sID09IDApKSB7XG4gICAgICAgICAgICAgICAgICAgIGluX2lkID0gZS5wYW5lbC5nZXRDZWxsRGF0YShlLnJvdywgMSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBlLmNlbGwuc3R5bGUub3ZlcmZsb3cgPSAndmlzaWJsZSc7XG4gICAgICAgICAgICAgICAgICAgIGUuY2VsbC5pbm5lckhUTUwgPSAnPGRpdiBjbGFzcz1cImJ0bi1ncm91cCBidG4tZ3JvdXAtanVzdGlmaWVkXCIgcm9sZT1cImdyb3VwXCIgYXJpYS1sYWJlbD1cIi4uLlwiPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJ0bi1ncm91cFwiIHJvbGU9XCJncm91cFwiPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIjL2luay91cGRhdGUvJysgaW5faWQgKyAnXCIgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHQgYnRuLXhzXCIgbmctY2xpY2s9XCJlZGl0KCRpdGVtLmluX2lkKVwiPkVkaXRhcjwvYT5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj4nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgICAgICAvLyBiaW5kIGNvbHVtbnMgd2hlbiBncmlkIGlzIGluaXRpYWxpemVkXG4gICAgICAgICAgICAkc2NvcGUuaW5pdEdyaWQgPSBmdW5jdGlvbiAocywgZSkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgJHNjb3BlLmxhYmVscy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgY29sID0gbmV3IHdpam1vLmdyaWQuQ29sdW1uKCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbC5iaW5kaW5nID0gJHNjb3BlLmNvbHVtbnNbaV07XG4gICAgICAgICAgICAgICAgICAgIGNvbC5oZWFkZXIgPSBpMThuRmlsdGVyKFwiaW5rLmxhYmVscy5cIiArICRzY29wZS5sYWJlbHNbaV0pO1xuICAgICAgICAgICAgICAgICAgICBjb2wud29yZFdyYXAgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgY29sLndpZHRoID0gMTUwO1xuICAgICAgICAgICAgICAgICAgICBzLmNvbHVtbnMucHVzaChjb2wpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICAvLyBjcmVhdGUgdGhlIHRvb2x0aXAgb2JqZWN0XG4gICAgICAgICAgICAkc2NvcGUuJHdhdGNoKCdnZ0dyaWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCRzY29wZS5nZ0dyaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIC8vIHN0b3JlIHJlZmVyZW5jZSB0byBncmlkXG4gICAgICAgICAgICAgICAgICAgIHZhciBmbGV4ID0gJHNjb3BlLmdnR3JpZDtcblxuICAgICAgICAgICAgICAgICAgICAvLyBjcmVhdGUgdG9vbHRpcFxuICAgICAgICAgICAgICAgICAgICB2YXIgdGlwID0gbmV3IHdpam1vLlRvb2x0aXAoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJuZyA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gbW9uaXRvciB0aGUgbW91c2Ugb3ZlciB0aGUgZ3JpZFxuICAgICAgICAgICAgICAgICAgICBmbGV4Lmhvc3RFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBodCA9IGZsZXguaGl0VGVzdChldnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFodC5jZWxsUmFuZ2UuZXF1YWxzKHJuZykpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG5ldyBjZWxsIHNlbGVjdGVkLCBzaG93IHRvb2x0aXBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaHQuY2VsbFR5cGUgPT0gd2lqbW8uZ3JpZC5DZWxsVHlwZS5DZWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJuZyA9IGh0LmNlbGxSYW5nZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvbCA9IGZsZXguY29sdW1uc1tybmcuY29sXS5oZWFkZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjZWxsRWxlbWVudCA9IGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQoZXZ0LmNsaWVudFgsIGV2dC5jbGllbnRZKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNlbGxCb3VuZHMgPSB3aWptby5SZWN0LmZyb21Cb3VuZGluZ1JlY3QoY2VsbEVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YSA9IHdpam1vLmVzY2FwZUh0bWwoZmxleC5nZXRDZWxsRGF0YShybmcucm93LCBybmcuY29sLCB0cnVlKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXBDb250ZW50ID0gY29sICsgJzogXCI8Yj4nICsgZGF0YSArICc8L2I+XCInO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2VsbEVsZW1lbnQuY2xhc3NOYW1lLmluZGV4T2YoJ3dqLWNlbGwnKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXAuc2hvdyhmbGV4Lmhvc3RFbGVtZW50LCB0aXBDb250ZW50LCBjZWxsQm91bmRzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpcC5oaWRlKCk7IC8vIGNlbGwgbXVzdCBiZSBiZWhpbmQgc2Nyb2xsIGJhci4uLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgZmxleC5ob3N0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpcC5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBybmcgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJHNjb3BlLiRvbignJHZpZXdDb250ZW50TG9hZGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIC8vIHRoaXMgY29kZSBpcyBleGVjdXRlZCBhZnRlciB0aGUgdmlldyBpcyBsb2FkZWRcbiAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgaW5rRmFjLmRhdGEoKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmRhdGEgPSBuZXcgd2lqbW8uY29sbGVjdGlvbnMuQ29sbGVjdGlvblZpZXcocHJvbWlzZS5kYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1dO1xuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRodHRwJywgJyRxJywgJyRhbGVydHMnLCBmdW5jdGlvbiAoJGh0dHAsICRxLCAkYWxlcnRzKSB7XG4gICAgICAgIHZhciBmYWN0b3J5ID0ge307XG4gICAgICAgIGZhY3RvcnkuZGF0YSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKFxuICAgICAgICAgICAgICAgICRodHRwLnBvc3QoJ21vZHVsZXMvaW5rL2luay5tZGwuZ2V0aW5rcy5waHAnLCB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICAgICAgcHJvY2Nlc19pZDogbmV3IERhdGUoKS5nZXRNaWxsaXNlY29uZHMoKVxuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc3RhY2tFcnJvciA9IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogZGF0YS5zdGF0dXMsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjogZGF0YS5lcnJvcixcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yVHlwZTogZGF0YS50eXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnOiBjb25maWdcbiAgICAgICAgICAgICAgICAgICAgfSwgbnVsbCwgNCk7XG4gICAgICAgICAgICAgICAgICAgICRhbGVydHMuZXJyb3IoJ1dvb29wcyEgYW4gZXJyb3IgaGFzIG9jdXJyZWQuJywgc3RhY2tFcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGZhY3Rvcnk7XG4gICAgfV07XG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCIgOiBcIlRpbnRhc1wiLFxuICAgICAgICAgICAgICAgICAgICBcImxhYmVsc1wiOntcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaW4taWRcIjogXCJJRCB0aW50YVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdS1pZFwiOiBcIklEIHByb3ZlZWRvclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpbi1jb2RlXCI6IFwiQ29kaWdvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImluLXR5cGVcIjogXCJUaXBvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImluLWRlc2NyaXB0aW9uXCI6IFwiRGVzY3JpcGNpb25cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaW4tcHJpY2VcIjogXCJQcmVjaW9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaW4tc3RhdHVzXCI6IFwiRXN0YXR1c1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpbi1kYXRlXCI6IFwiRmVjaGFcIlxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBcImNvbHVtbnNcIjpbXG4gICAgICAgICAgICAgICAgICAgICAgICBcImluX2lkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN1X2lkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImluX2NvZGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaW5fdHlwZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpbl9kZXNjcmlwdGlvblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpbl9wcmljZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpbl9zdGF0dXNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaW5fZGF0ZVwiXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICBcImZpZWxkc1wiIDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5fdHlwZW9wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIk9mZnNldFwiLFwidmFsdWVcIjpcIm9mZnNldFwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiRmxleG9cIixcInZhbHVlXCI6XCJmbGV4b1wifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiSW5ramV0IHNvbHZlbnRlXCIsXCJ2YWx1ZVwiOlwiaW5ramV0X3NvbHZlbnRcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIklua2pldCBVVlwiLFwidmFsdWVcIjpcImlua2pldF91dlwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiU2VyaWdyYWbDrWFcIixcInZhbHVlXCI6XCJzZXJpZ3JhcGh5XCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJWaW5pbFwiLFwidmFsdWVcIjpcInZpbnlsXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJUb25lclwiLFwidmFsdWVcIjpcInRvbmVyXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJTZWxsb1wiLFwidmFsdWVcIjpcInNlYWxcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIk90aGVyXCIsXCJ2YWx1ZVwiOlwib3Ryb3NcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5fc3RhdHVzb3B0aW9ucyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiQWN0aXZvXCIsXCJ2YWx1ZVwiOlwiQVwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiSW5hY3Rpdm9cIixcInZhbHVlXCI6XCJJXCJ9XG4gICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKGFuZ3VsYXIpe1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBcbiAgICByZXR1cm4gYW5ndWxhci5tb2R1bGUoJ2FwcC5pbmsuYWRkJyxbXSlcblxuICAgIC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLFxuICAgIGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcbiAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2lua0FkZCcsIHtcbiAgICAgICAgICAgIHVybDonL2luay9hZGQnLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmwgOiAnbW9kdWxlcy9pbmsvbW9kdWxlcy9pbmsuYWRkL2luay5hZGQudmlldy5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXIgOiAnaW5rQWRkQ3RybCcsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgcmVxdWlyZXNMb2dpbjogdHJ1ZVxuICAgICAgICAgICAgfSAgICBcbiAgICAgICAgfSk7XG4gICAgfV0pXG5cbiAgICAuZmFjdG9yeSgnaW5rQWRkRmFjJyxyZXF1aXJlKCcuL2luay5hZGQuZmFjJykpXG5cbiAgICAuY29udHJvbGxlcignaW5rQWRkQ3RybCcscmVxdWlyZSgnLi9pbmsuYWRkLmN0cmwnKSlcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckc2NvcGUnLCAnaW5rQWRkRmFjJywgJyRsb2NhdGlvbicsICdpMThuRmlsdGVyJyxcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgaW5rQWRkRmFjLCAkbG9jYXRpb24sIGkxOG5GaWx0ZXIpIHtcbiAgICAgICAgICAgICRzY29wZS5mbURhdGEgPSB7fTtcblxuICAgICAgICAgICAgJHNjb3BlLm9uU3VibWl0ID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgaW5rQWRkRmFjLmFkZCgkc2NvcGUuZm1EYXRhKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9taXNlLmRhdGEgPT0gXCIxXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvaW5rJyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICRzY29wZS5pbl9zdGF0dXNvcHRpb25zID0gaTE4bkZpbHRlcihcImluay5maWVsZHMuaW5fc3RhdHVzb3B0aW9uc1wiKTtcbiAgICAgICAgICAgICRzY29wZS5pbl90eXBlb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJpbmsuZmllbGRzLmluX3R5cGVvcHRpb25zXCIpO1xuXG4gICAgICAgICAgICAkc2NvcGUuJG9uKCckdmlld0NvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgLy8gdGhpcyBjb2RlIGlzIGV4ZWN1dGVkIGFmdGVyIHRoZSB2aWV3IGlzIGxvYWRlZFxuICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaW5rQWRkRmFjLmdldFN1cHBsaWVycygpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuc3VfaWRvcHRpb25zID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2gocHJvbWlzZS5kYXRhLCBmdW5jdGlvbiAodmFsdWUsIGtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHVzaCh7IFwibGFiZWxcIjogdmFsdWUuc3VfY29ycG9yYXRlbmFtZSwgXCJ2YWx1ZVwiOiB2YWx1ZS5zdV9pZCB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sICRzY29wZS5zdV9pZG9wdGlvbnMpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8kc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1dO1xuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRodHRwJywgJyRxJywgJyRhbGVydHMnLCAnJHN0YXRlUGFyYW1zJywgZnVuY3Rpb24gKCRodHRwLCAkcSwgJGFsZXJ0cywgJHN0YXRlUGFyYW1zKSB7XG4gICAgICAgIHZhciBmYWN0b3J5ID0ge307XG4gICAgICAgIGZhY3RvcnkuYWRkID0gZnVuY3Rpb24gKGluX2pzb25iKSB7XG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9ICRodHRwLnBvc3QoJ21vZHVsZXMvaW5rL21vZHVsZXMvaW5rLmFkZC9pbmsuYWRkLm1kbC5hZGQucGhwJywge1xuICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICBpbl9qc29uYjogaW5fanNvbmJcbiAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICB2YXIgc3RhY2tFcnJvciA9IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogZGF0YS5zdGF0dXMsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjogZGF0YS5lcnJvcixcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yVHlwZTogZGF0YS50eXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnOiBjb25maWdcbiAgICAgICAgICAgICAgICAgICAgfSwgbnVsbCwgNCk7XG4gICAgICAgICAgICAgICAgICAgICRhbGVydHMuZXJyb3IoJ1dvb29wcyEgYW4gZXJyb3IgaGFzIG9jdXJyZWQuJywgc3RhY2tFcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICBmYWN0b3J5LmdldFN1cHBsaWVycyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gJGh0dHAuZ2V0KCdtb2R1bGVzL2luay9tb2R1bGVzL2luay5hZGQvaW5rLmFkZC5tZGwuZ2V0U3VwcGxpZXJzLnBocCcpXG4gICAgICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc3RhY2tFcnJvciA9IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogZGF0YS5zdGF0dXMsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjogZGF0YS5lcnJvcixcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yVHlwZTogZGF0YS50eXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnOiBjb25maWdcbiAgICAgICAgICAgICAgICAgICAgfSwgbnVsbCwgNCk7XG4gICAgICAgICAgICAgICAgICAgICRhbGVydHMuZXJyb3IoJ1dvb29wcyEgYW4gZXJyb3IgaGFzIG9jdXJyZWQuJywgc3RhY2tFcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGZhY3Rvcnk7XG4gICAgfV07XG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCIgOiBcImFncmVnYXIgdGludGFcIixcbiAgICAgICAgICAgICAgICB9IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oYW5ndWxhcil7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIFxuICAgIHJldHVybiBhbmd1bGFyLm1vZHVsZSgnYXBwLmluay51cGRhdGUnLFtdKVxuXG4gICAgLmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsXG4gICAgZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnaW5rVXBkYXRlJywge1xuICAgICAgICAgICAgdXJsOicvaW5rL3VwZGF0ZS86aW5faWQnLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmwgOiAnbW9kdWxlcy9pbmsvbW9kdWxlcy9pbmsudXBkYXRlL2luay51cGRhdGUudmlldy5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXIgOiAnaW5rVXBkYXRlQ3RybCcsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgcmVxdWlyZXNMb2dpbjogdHJ1ZVxuICAgICAgICAgICAgfSAgICBcbiAgICAgICAgfSk7XG4gICAgfV0pXG5cbiAgICAuZmFjdG9yeSgnaW5rVXBkYXRlRmFjJyxyZXF1aXJlKCcuL2luay51cGRhdGUuZmFjJykpXG5cbiAgICAuY29udHJvbGxlcignaW5rVXBkYXRlQ3RybCcscmVxdWlyZSgnLi9pbmsudXBkYXRlLmN0cmwnKSlcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckc2NvcGUnLCAnaW5rVXBkYXRlRmFjJywgJyRsb2NhdGlvbicsICdpMThuRmlsdGVyJyxcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgaW5rVXBkYXRlRmFjLCAkbG9jYXRpb24sIGkxOG5GaWx0ZXIpIHtcblxuICAgICAgICAgICAgJHNjb3BlLm9uU3VibWl0ID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgaW5rVXBkYXRlRmFjLnVwZGF0ZSgkc2NvcGUuZm1EYXRhKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9taXNlLmRhdGEgPT0gXCIxXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvaW5rJyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICRzY29wZS5pbl9zdGF0dXNvcHRpb25zID0gaTE4bkZpbHRlcihcImluay5maWVsZHMuaW5fc3RhdHVzb3B0aW9uc1wiKTtcbiAgICAgICAgICAgICRzY29wZS5pbl90eXBlb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJpbmsuZmllbGRzLmluX3R5cGVvcHRpb25zXCIpO1xuXG4gICAgICAgICAgICAkc2NvcGUuJG9uKCckdmlld0NvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgLy8gdGhpcyBjb2RlIGlzIGV4ZWN1dGVkIGFmdGVyIHRoZSB2aWV3IGlzIGxvYWRlZFxuICAgICAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpbmtVcGRhdGVGYWMuZGF0YSgpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNPYmplY3QoYW5ndWxhci5mcm9tSnNvbihwcm9taXNlLmRhdGEpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmZtRGF0YSA9IGFuZ3VsYXIuZnJvbUpzb24ocHJvbWlzZS5kYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBpbmtVcGRhdGVGYWMuZ2V0U3VwcGxpZXJzKCkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnN1X2lkb3B0aW9ucyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChwcm9taXNlLmRhdGEsIGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHVzaCh7IFwibGFiZWxcIjogdmFsdWUuc3VfY29ycG9yYXRlbmFtZSwgXCJ2YWx1ZVwiOiB2YWx1ZS5zdV9pZCB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCAkc2NvcGUuc3VfaWRvcHRpb25zKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8kc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfV07XG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgcmV0dXJuIFsnJGh0dHAnLCAnJHEnLCAnJGFsZXJ0cycsICckc3RhdGVQYXJhbXMnLCBmdW5jdGlvbiAoJGh0dHAsICRxLCAkYWxlcnRzLCAkc3RhdGVQYXJhbXMpIHtcbiAgICAgICAgdmFyIGZhY3RvcnkgPSB7fTtcbiAgICAgICAgZmFjdG9yeS5kYXRhID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoXG4gICAgICAgICAgICAgICAgJGh0dHAucG9zdCgnbW9kdWxlcy9pbmsvbW9kdWxlcy9pbmsudXBkYXRlL2luay51cGRhdGUubWRsLmdldGluay5waHAnLCB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICAgICAgaW5faWQ6ICRzdGF0ZVBhcmFtcy5pbl9pZFxuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc3RhY2tFcnJvciA9IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogZGF0YS5zdGF0dXMsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjogZGF0YS5lcnJvcixcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yVHlwZTogZGF0YS50eXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnOiBjb25maWdcbiAgICAgICAgICAgICAgICAgICAgfSwgbnVsbCwgNCk7XG4gICAgICAgICAgICAgICAgICAgICRhbGVydHMuZXJyb3IoJ1dvb29wcyEgYW4gZXJyb3IgaGFzIG9jdXJyZWQuJywgc3RhY2tFcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeS51cGRhdGUgPSBmdW5jdGlvbiAoaW5fanNvbmIpIHtcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKFxuICAgICAgICAgICAgICAgICRodHRwLnBvc3QoJ21vZHVsZXMvaW5rL21vZHVsZXMvaW5rLnVwZGF0ZS9pbmsudXBkYXRlLm1kbC51cGRhdGUucGhwJywge1xuICAgICAgICAgICAgICAgICAgICAvKiBQT1NUIHZhcmlhYmxlcyBoZXJlICovXG4gICAgICAgICAgICAgICAgICAgIGluX2lkOiAkc3RhdGVQYXJhbXMuaW5faWQsXG4gICAgICAgICAgICAgICAgICAgIGluX2pzb25iOiBpbl9qc29uYlxuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc3RhY2tFcnJvciA9IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogZGF0YS5zdGF0dXMsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjogZGF0YS5lcnJvcixcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yVHlwZTogZGF0YS50eXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnOiBjb25maWdcbiAgICAgICAgICAgICAgICAgICAgfSwgbnVsbCwgNCk7XG4gICAgICAgICAgICAgICAgICAgICRhbGVydHMuZXJyb3IoJ1dvb29wcyEgYW4gZXJyb3IgaGFzIG9jdXJyZWQuJywgc3RhY2tFcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeS5nZXRTdXBwbGllcnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9ICRodHRwLmdldCgnbW9kdWxlcy9pbmsvbW9kdWxlcy9pbmsuYWRkL2luay5hZGQubWRsLmdldFN1cHBsaWVycy5waHAnKVxuICAgICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0YWNrRXJyb3IgPSBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IGRhdGEuc3RhdHVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGRhdGEuZXJyb3IsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvclR5cGU6IGRhdGEudHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZzogY29uZmlnXG4gICAgICAgICAgICAgICAgICAgIH0sIG51bGwsIDQpO1xuICAgICAgICAgICAgICAgICAgICAkYWxlcnRzLmVycm9yKCdXb29vcHMhIGFuIGVycm9yIGhhcyBvY3VycmVkLicsIHN0YWNrRXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBmYWN0b3J5O1xuICAgIH1dO1xuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiIDogXCJhY3R1YWxpemFyIHRpbnRhXCIsXG4gICAgICAgICAgICAgICAgfSIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgcmV0dXJuIGFuZ3VsYXIubW9kdWxlKCdhcHAubG9naW4nLCBbXSlcblxuICAgICAgICAuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJyxcbiAgICAgICAgICAgIGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICAgICAgICAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2xvZ2luJywge1xuICAgICAgICAgICAgICAgICAgICB1cmw6ICcvbG9naW4nLFxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ21vZHVsZXMvbG9naW4vbG9naW4udmlldy5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ2xvZ2luQ3RybCcsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVpcmVzTG9naW46IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1dKVxuXG4gICAgICAgIC5jb250cm9sbGVyKCdsb2dpbkN0cmwnLCByZXF1aXJlKCcuL2xvZ2luLmN0cmwnKSlcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckc2NvcGUnLCAnJGh0dHAnLCAnYXV0aCcsICdzdG9yZScsICckbG9jYXRpb24nLCAnand0SGVscGVyJyxcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgJGh0dHAsIGF1dGgsIHN0b3JlLCAkbG9jYXRpb24sIGp3dEhlbHBlcikge1xuXG4gICAgICAgICAgICB2YXIgdG9rZW4gPSBzdG9yZS5nZXQoJ3Rva2VuJyk7XG4gICAgICAgICAgICBpZiAodG9rZW4pIHtcbiAgICAgICAgICAgICAgICBpZiAoIWp3dEhlbHBlci5pc1Rva2VuRXhwaXJlZCh0b2tlbikpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFhdXRoLmlzQXV0aGVudGljYXRlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXV0aC5hdXRoZW50aWNhdGUoc3RvcmUuZ2V0KCdwcm9maWxlJyksIHRva2VuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvaG9tZScpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvaG9tZScpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEVpdGhlciBzaG93IHRoZSBsb2dpbiBwYWdlIG9yIHVzZSB0aGUgcmVmcmVzaCB0b2tlbiB0byBnZXQgYSBuZXcgaWRUb2tlblxuICAgICAgICAgICAgICAgICAgICBhdXRoLnNpZ25pbih7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaWN0OiAnZXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogJ2ltZy9nZ2F1dGgtbG9nby5wbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgdXNlcm5hbWU6ICRzY29wZS51c2VybmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhc3N3b3JkOiAkc2NvcGUucGFzc3dvcmQsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25uZWN0aW9uOiAnVXNlcm5hbWUtUGFzc3dvcmQtQXV0aGVudGljYXRpb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVtZW1iZXJMYXN0TG9naW46IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2xvc2FibGU6IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChwcm9maWxlLCB0b2tlbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gU3VjY2VzcyBjYWxsYmFja1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RvcmUuc2V0KCdwcm9maWxlJywgcHJvZmlsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdG9yZS5zZXQoJ3Rva2VuJywgdG9rZW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9ob21lJyk7XG4gICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBFcnJvciBjYWxsYmFja1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGF1dGguc2lnbmluKHtcbiAgICAgICAgICAgICAgICAgICAgZGljdDogJ2VzJyxcbiAgICAgICAgICAgICAgICAgICAgaWNvbjogJ2ltZy9nZ2F1dGgtbG9nby5wbmcnLFxuICAgICAgICAgICAgICAgICAgICB1c2VybmFtZTogJHNjb3BlLnVzZXJuYW1lLFxuICAgICAgICAgICAgICAgICAgICBwYXNzd29yZDogJHNjb3BlLnBhc3N3b3JkLFxuICAgICAgICAgICAgICAgICAgICBjb25uZWN0aW9uOiAnVXNlcm5hbWUtUGFzc3dvcmQtQXV0aGVudGljYXRpb24nLFxuICAgICAgICAgICAgICAgICAgICByZW1lbWJlckxhc3RMb2dpbjogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGNsb3NhYmxlOiBmYWxzZVxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChwcm9maWxlLCB0b2tlbikge1xuICAgICAgICAgICAgICAgICAgICAvLyBTdWNjZXNzIGNhbGxiYWNrXG4gICAgICAgICAgICAgICAgICAgIHN0b3JlLnNldCgncHJvZmlsZScsIHByb2ZpbGUpO1xuICAgICAgICAgICAgICAgICAgICBzdG9yZS5zZXQoJ3Rva2VuJywgdG9rZW4pO1xuICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2hvbWUnKTtcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpXG4gICAgICAgICAgICAgICAgICAgIC8vIEVycm9yIGNhbGxiYWNrXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfV1cblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oYW5ndWxhcil7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIFxuICAgIHJldHVybiBhbmd1bGFyLm1vZHVsZSgnYXBwLm1hY2hpbmUnLFtcbiAgICAgICAgcmVxdWlyZSgnLi9tb2R1bGVzL21hY2hpbmUuYWRkJykubmFtZSxcbiAgICAgICAgcmVxdWlyZSgnLi9tb2R1bGVzL21hY2hpbmUudXBkYXRlJykubmFtZVxuICAgIF0pXG5cbiAgICAuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJyxcbiAgICBmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdtYWNoaW5lJywge1xuICAgICAgICAgICAgdXJsOicvbWFjaGluZScsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybCA6ICdtb2R1bGVzL21hY2hpbmUvbWFjaGluZS52aWV3Lmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlciA6ICdtYWNoaW5lQ3RybCcsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgcmVxdWlyZXNMb2dpbjogdHJ1ZVxuICAgICAgICAgICAgfSAgICBcbiAgICAgICAgfSk7XG4gICAgfV0pXG5cbiAgICAuZmFjdG9yeSgnbWFjaGluZUZhYycscmVxdWlyZSgnLi9tYWNoaW5lLmZhYycpKVxuXG4gICAgLmNvbnRyb2xsZXIoJ21hY2hpbmVDdHJsJyxyZXF1aXJlKCcuL21hY2hpbmUuY3RybCcpKVxuICAgIFxufSkoYW5ndWxhcik7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiIDogXCJtYXF1aW5hc1wiLFxuICAgICAgICAgICAgICAgICAgICBcImxhYmVsc1wiOntcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibWEtaWRcIjpcIklEIE1hcXVpbmFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibWEtbmFtZVwiOlwiTWFxdWluYVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJtYS1tYXhzaXpld2lkdGhcIjpcIlRhbWHDsW8gbWF4LiBhbmNob1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJtYS1tYXhzaXplaGVpZ2h0XCI6XCJUYW1hw7FvIG1heC4gYWx0dXJhXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm1hLW1pbnNpemV3aWR0aFwiOlwiVGFtYcOxbyBtaW4uIGFuY2hvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm1hLW1pbnNpemVoZWlnaHRcIjpcIlRhbWHDsW8gbWF4LiBhbHR1cmFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibWEtc2l6ZW1lYXN1cmVcIjpcIk1lZGlkYVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJtYS10b3RhbGlua3NcIjpcIlRpbnRhcyB0b3RhbGVzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm1hLWZ1bGxjb2xvclwiOlwiRnVsbCBjb2xvclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJtYS1wcmludGJnXCI6XCJJbXByaW1lIGZvbmRvc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJtYS1wcm9jZXNzXCI6XCJQcm9jZXNvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm1hLXN0YXR1c1wiOlwiRXN0YXR1c1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJtYS1kYXRlXCI6XCJGZWNoYVwiLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgXCJjb2x1bW5zXCI6W1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJtYV9pZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJtYV9uYW1lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm1hX21heHNpemV3aWR0aFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJtYV9tYXhzaXplaGVpZ2h0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm1hX21pbnNpemV3aWR0aFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJtYV9taW5zaXplaGVpZ2h0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm1hX3NpemVtZWFzdXJlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm1hX3RvdGFsaW5rc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJtYV9mdWxsY29sb3JcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibWFfcHJpbnRiZ1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJtYV9wcm9jZXNzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm1hX3N0YXR1c1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJtYV9kYXRlXCIsXG4gICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgXCJmaWVsZHNcIiA6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hX3NpemVtZWFzdXJlb3B0aW9ucyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiY21cIixcInZhbHVlXCI6XCJjbVwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwicHVsZ2FkYXNcIixcInZhbHVlXCI6XCJpblwifVxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hX2Z1bGxjb2xvcm9wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIlNpXCIsXCJ2YWx1ZVwiOlwieWVzXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJOb1wiLFwidmFsdWVcIjpcIm5vXCJ9XG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWFfcHJpbnRiZ29wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIlNpXCIsXCJ2YWx1ZVwiOlwieWVzXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJOb1wiLFwidmFsdWVcIjpcIm5vXCJ9XG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWFfcHJvY2Vzc29wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIk9mZnNldFwiLFwidmFsdWVcIjpcIm9mZnNldFwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiRmxleG9cIixcInZhbHVlXCI6XCJmbGV4b1wifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiUGzDs3RlclwiLFwidmFsdWVcIjpcInBsb3R0ZXJcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIlNlbGxvc1wiLFwidmFsdWVcIjpcInNlYWxzXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJTZXJpZ3JhZsOtYVwiLFwidmFsdWVcIjpcInNlcmlncmFwaHlcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkxhc2VyXCIsXCJ2YWx1ZVwiOlwibGFzZXJcIn1cbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBtYV9zdGF0dXNvcHRpb25zIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJBY3Rpdm9cIixcInZhbHVlXCI6XCJBXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJJbmFjdGl2b1wiLFwidmFsdWVcIjpcIklcIn1cbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0iLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRzY29wZScsICdtYWNoaW5lRmFjJywgJ2kxOG5GaWx0ZXInLFxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCBtYWNoaW5lRmFjLCBpMThuRmlsdGVyKSB7XG5cbiAgICAgICAgICAgICRzY29wZS5sYWJlbHMgPSBPYmplY3Qua2V5cyhpMThuRmlsdGVyKFwibWFjaGluZS5sYWJlbHNcIikpO1xuICAgICAgICAgICAgJHNjb3BlLmNvbHVtbnMgPSBpMThuRmlsdGVyKFwibWFjaGluZS5jb2x1bW5zXCIpO1xuICAgICAgICBcbiAgICAgICAgICAgIC8vIGZvcm1hdEl0ZW0gZXZlbnQgaGFuZGxlclxuICAgICAgICAgICAgdmFyIG1hX2lkO1xuICAgICAgICAgICAgJHNjb3BlLmZvcm1hdEl0ZW0gPSBmdW5jdGlvbiAocywgZSwgY2VsbCkge1xuXG4gICAgICAgICAgICAgICAgaWYgKGUucGFuZWwuY2VsbFR5cGUgPT0gd2lqbW8uZ3JpZC5DZWxsVHlwZS5Sb3dIZWFkZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgZS5jZWxsLnRleHRDb250ZW50ID0gZS5yb3cgKyAxO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHMucm93cy5kZWZhdWx0U2l6ZSA9IDMwO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gYWRkIEJvb3RzdHJhcCBodG1sXG4gICAgICAgICAgICAgICAgaWYgKChlLnBhbmVsLmNlbGxUeXBlID09IHdpam1vLmdyaWQuQ2VsbFR5cGUuQ2VsbCkgJiYgKGUuY29sID09IDApKSB7XG4gICAgICAgICAgICAgICAgICAgIG1hX2lkID0gZS5wYW5lbC5nZXRDZWxsRGF0YShlLnJvdywgMSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBlLmNlbGwuc3R5bGUub3ZlcmZsb3cgPSAndmlzaWJsZSc7XG4gICAgICAgICAgICAgICAgICAgIGUuY2VsbC5pbm5lckhUTUwgPSAnPGRpdiBjbGFzcz1cImJ0bi1ncm91cCBidG4tZ3JvdXAtanVzdGlmaWVkXCIgcm9sZT1cImdyb3VwXCIgYXJpYS1sYWJlbD1cIi4uLlwiPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJ0bi1ncm91cFwiIHJvbGU9XCJncm91cFwiPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIjL21hY2hpbmUvdXBkYXRlLycrIG1hX2lkICsgJ1wiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0IGJ0bi14c1wiIG5nLWNsaWNrPVwiZWRpdCgkaXRlbS5tYV9pZClcIj5FZGl0YXI8L2E+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+JztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAgICAgLy8gYmluZCBjb2x1bW5zIHdoZW4gZ3JpZCBpcyBpbml0aWFsaXplZFxuICAgICAgICAgICAgJHNjb3BlLmluaXRHcmlkID0gZnVuY3Rpb24gKHMsIGUpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8ICRzY29wZS5sYWJlbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbCA9IG5ldyB3aWptby5ncmlkLkNvbHVtbigpO1xuICAgICAgICAgICAgICAgICAgICBjb2wuYmluZGluZyA9ICRzY29wZS5jb2x1bW5zW2ldO1xuICAgICAgICAgICAgICAgICAgICBjb2wuaGVhZGVyID0gaTE4bkZpbHRlcihcIm1hY2hpbmUubGFiZWxzLlwiICsgJHNjb3BlLmxhYmVsc1tpXSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbC53b3JkV3JhcCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBjb2wud2lkdGggPSAxNTA7XG4gICAgICAgICAgICAgICAgICAgIHMuY29sdW1ucy5wdXNoKGNvbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIC8vIGNyZWF0ZSB0aGUgdG9vbHRpcCBvYmplY3RcbiAgICAgICAgICAgICRzY29wZS4kd2F0Y2goJ2dnR3JpZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoJHNjb3BlLmdnR3JpZCkge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgLy8gc3RvcmUgcmVmZXJlbmNlIHRvIGdyaWRcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZsZXggPSAkc2NvcGUuZ2dHcmlkO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNyZWF0ZSB0b29sdGlwXG4gICAgICAgICAgICAgICAgICAgIHZhciB0aXAgPSBuZXcgd2lqbW8uVG9vbHRpcCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgcm5nID0gbnVsbDtcblxuICAgICAgICAgICAgICAgICAgICAvLyBtb25pdG9yIHRoZSBtb3VzZSBvdmVyIHRoZSBncmlkXG4gICAgICAgICAgICAgICAgICAgIGZsZXguaG9zdEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGh0ID0gZmxleC5oaXRUZXN0KGV2dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWh0LmNlbGxSYW5nZS5lcXVhbHMocm5nKSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbmV3IGNlbGwgc2VsZWN0ZWQsIHNob3cgdG9vbHRpcFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChodC5jZWxsVHlwZSA9PSB3aWptby5ncmlkLkNlbGxUeXBlLkNlbGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm5nID0gaHQuY2VsbFJhbmdlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29sID0gZmxleC5jb2x1bW5zW3JuZy5jb2xdLmhlYWRlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNlbGxFbGVtZW50ID0gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludChldnQuY2xpZW50WCwgZXZ0LmNsaWVudFkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2VsbEJvdW5kcyA9IHdpam1vLlJlY3QuZnJvbUJvdW5kaW5nUmVjdChjZWxsRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhID0gd2lqbW8uZXNjYXBlSHRtbChmbGV4LmdldENlbGxEYXRhKHJuZy5yb3csIHJuZy5jb2wsIHRydWUpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpcENvbnRlbnQgPSBjb2wgKyAnOiBcIjxiPicgKyBkYXRhICsgJzwvYj5cIic7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjZWxsRWxlbWVudC5jbGFzc05hbWUuaW5kZXhPZignd2otY2VsbCcpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpcC5zaG93KGZsZXguaG9zdEVsZW1lbnQsIHRpcENvbnRlbnQsIGNlbGxCb3VuZHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlwLmhpZGUoKTsgLy8gY2VsbCBtdXN0IGJlIGJlaGluZCBzY3JvbGwgYmFyLi4uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBmbGV4Lmhvc3RFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3V0JywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGlwLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJuZyA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkc2NvcGUuJG9uKCckdmlld0NvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgLy8gdGhpcyBjb2RlIGlzIGV4ZWN1dGVkIGFmdGVyIHRoZSB2aWV3IGlzIGxvYWRlZFxuICAgICAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBtYWNoaW5lRmFjLmRhdGEoKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmRhdGEgPSBuZXcgd2lqbW8uY29sbGVjdGlvbnMuQ29sbGVjdGlvblZpZXcocHJvbWlzZS5kYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1dO1xuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRodHRwJywgJyRxJywgJyRhbGVydHMnLFxuICAgICAgICBmdW5jdGlvbiAoJGh0dHAsICRxLCAkYWxlcnRzKSB7XG4gICAgICAgICAgICB2YXIgZmFjdG9yeSA9IHt9O1xuICAgICAgICAgICAgZmFjdG9yeS5kYXRhID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShcbiAgICAgICAgICAgICAgICAgICAgJGh0dHAucG9zdCgnbW9kdWxlcy9tYWNoaW5lL21hY2hpbmUubWRsLmdldG1hY2hpbmVzLnBocCcsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2NjZXNfaWQ6IG5ldyBEYXRlKCkuZ2V0TWlsbGlzZWNvbmRzKClcbiAgICAgICAgICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzdGFja0Vycm9yID0gSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogZGF0YS5zdGF0dXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGRhdGEuZXJyb3IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JUeXBlOiBkYXRhLnR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnOiBjb25maWdcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIG51bGwsIDQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJGFsZXJ0cy5lcnJvcignV29vb3BzISBhbiBlcnJvciBoYXMgb2N1cnJlZC4nLCBzdGFja0Vycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm4gZmFjdG9yeTtcbiAgICAgICAgfV07XG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKGFuZ3VsYXIpe1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBcbiAgICByZXR1cm4gYW5ndWxhci5tb2R1bGUoJ2FwcC5tYWNoaW5lLmFkZCcsW10pXG5cbiAgICAuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJyxcbiAgICBmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdtYWNoaW5lQWRkJywge1xuICAgICAgICAgICAgdXJsOicvbWFjaGluZS9hZGQnLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmwgOiAnbW9kdWxlcy9tYWNoaW5lL21vZHVsZXMvbWFjaGluZS5hZGQvbWFjaGluZS5hZGQudmlldy5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXIgOiAnbWFjaGluZUFkZEN0cmwnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHJlcXVpcmVzTG9naW46IHRydWVcbiAgICAgICAgICAgIH0gICAgXG4gICAgICAgIH0pO1xuICAgIH1dKVxuXG4gICAgLmZhY3RvcnkoJ21hY2hpbmVBZGRGYWMnLHJlcXVpcmUoJy4vbWFjaGluZS5hZGQuZmFjJykpXG5cbiAgICAuY29udHJvbGxlcignbWFjaGluZUFkZEN0cmwnLHJlcXVpcmUoJy4vbWFjaGluZS5hZGQuY3RybCcpKVxuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiIDogXCJhZ3JlZ2FyIG1hcXVpbmFcIixcbiAgICAgICAgICAgICAgICB9IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oYW5ndWxhcil7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIFxuICAgIHJldHVybiBbJyRzY29wZScsICdtYWNoaW5lQWRkRmFjJywgJyRsb2NhdGlvbicsICdpMThuRmlsdGVyJyxcbiAgICBmdW5jdGlvbiAoJHNjb3BlLCBtYWNoaW5lQWRkRmFjLCAkbG9jYXRpb24sIGkxOG5GaWx0ZXIpIHtcbiAgICAgICAgJHNjb3BlLmZtRGF0YSA9IHt9O1xuXG4gICAgICAgICRzY29wZS5vblN1Ym1pdCA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICBtYWNoaW5lQWRkRmFjLmFkZCgkc2NvcGUuZm1EYXRhKS50aGVuKGZ1bmN0aW9uKHByb21pc2Upe1xuICAgICAgICAgICAgICAgIGlmKHByb21pc2UuZGF0YSA9PSBcIjFcIikge1xuICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL21hY2hpbmUnKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLm1hX3NpemVtZWFzdXJlb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJtYWNoaW5lLmZpZWxkcy5tYV9zaXplbWVhc3VyZW9wdGlvbnNcIik7XG4gICAgICAgICRzY29wZS5tYV9mdWxsY29sb3JvcHRpb25zID0gaTE4bkZpbHRlcihcIm1hY2hpbmUuZmllbGRzLm1hX2Z1bGxjb2xvcm9wdGlvbnNcIik7XG4gICAgICAgICRzY29wZS5tYV9wcmludGJnb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJtYWNoaW5lLmZpZWxkcy5tYV9wcmludGJnb3B0aW9uc1wiKTtcbiAgICAgICAgJHNjb3BlLm1hX3Byb2Nlc3NvcHRpb25zID0gaTE4bkZpbHRlcihcIm1hY2hpbmUuZmllbGRzLm1hX3Byb2Nlc3NvcHRpb25zXCIpO1xuICAgICAgICAkc2NvcGUubWFfc3RhdHVzb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJtYWNoaW5lLmZpZWxkcy5tYV9zdGF0dXNvcHRpb25zXCIpO1xuXG4gICAgICAgICRzY29wZS4kb24oJyR2aWV3Q29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vIHRoaXMgY29kZSBpcyBleGVjdXRlZCBhZnRlciB0aGUgdmlldyBpcyBsb2FkZWRcbiAgICAgICAgICAgIFxuICAgICAgICAgICBcblxuICAgICAgICAgfSk7XG4gICAgfV07XG4gICAgXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRodHRwJywgJyRxJywgJyRhbGVydHMnLCAnJHN0YXRlUGFyYW1zJyxcbiAgICAgICAgZnVuY3Rpb24gKCRodHRwLCAkcSwgJGFsZXJ0cywgJHN0YXRlUGFyYW1zKSB7XG4gICAgICAgICAgICB2YXIgZmFjdG9yeSA9IHt9O1xuICAgICAgICAgICAgZmFjdG9yeS5hZGQgPSBmdW5jdGlvbiAobWFfanNvbmIpIHtcbiAgICAgICAgICAgICAgICB2YXIgcHJvbWlzZSA9ICRodHRwLnBvc3QoJ21vZHVsZXMvbWFjaGluZS9tb2R1bGVzL21hY2hpbmUuYWRkL21hY2hpbmUuYWRkLm1kbC5hZGQucGhwJywge1xuICAgICAgICAgICAgICAgICAgICAvKiBQT1NUIHZhcmlhYmxlcyBoZXJlICovXG4gICAgICAgICAgICAgICAgICAgIG1hX2pzb25iOiBtYV9qc29uYlxuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc3RhY2tFcnJvciA9IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogZGF0YS5zdGF0dXMsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjogZGF0YS5lcnJvcixcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yVHlwZTogZGF0YS50eXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnOiBjb25maWdcbiAgICAgICAgICAgICAgICAgICAgfSwgbnVsbCwgNCk7XG4gICAgICAgICAgICAgICAgICAgICRhbGVydHMuZXJyb3IoJ1dvb29wcyEgYW4gZXJyb3IgaGFzIG9jdXJyZWQuJywgc3RhY2tFcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmV0dXJuIGZhY3Rvcnk7XG4gICAgICAgIH1dO1xuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbihhbmd1bGFyKXtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgXG4gICAgcmV0dXJuIGFuZ3VsYXIubW9kdWxlKCdhcHAubWFjaGluZS51cGRhdGUnLFtdKVxuXG4gICAgLmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsXG4gICAgZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnbWFjaGluZVVwZGF0ZScsIHtcbiAgICAgICAgICAgIHVybDonL21hY2hpbmUvdXBkYXRlLzptYV9pZCcsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybCA6ICdtb2R1bGVzL21hY2hpbmUvbW9kdWxlcy9tYWNoaW5lLnVwZGF0ZS9tYWNoaW5lLnVwZGF0ZS52aWV3Lmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlciA6ICdtYWNoaW5lVXBkYXRlQ3RybCcsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgcmVxdWlyZXNMb2dpbjogdHJ1ZVxuICAgICAgICAgICAgfSAgICBcbiAgICAgICAgfSk7XG4gICAgfV0pXG5cbiAgICAuZmFjdG9yeSgnbWFjaGluZVVwZGF0ZUZhYycscmVxdWlyZSgnLi9tYWNoaW5lLnVwZGF0ZS5mYWMnKSlcblxuICAgIC5jb250cm9sbGVyKCdtYWNoaW5lVXBkYXRlQ3RybCcscmVxdWlyZSgnLi9tYWNoaW5lLnVwZGF0ZS5jdHJsJykpXG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCIgOiBcImFjdHVhbGl6YXIgbWFxdWluYVwiLFxuICAgICAgICAgICAgICAgIH0iLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRzY29wZScsICdtYWNoaW5lVXBkYXRlRmFjJywgJyRsb2NhdGlvbicsICdpMThuRmlsdGVyJyxcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgbWFjaGluZVVwZGF0ZUZhYywgJGxvY2F0aW9uLCBpMThuRmlsdGVyKSB7XG5cbiAgICAgICAgICAgICRzY29wZS5vblN1Ym1pdCA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgIG1hY2hpbmVVcGRhdGVGYWMudXBkYXRlKCRzY29wZS5mbURhdGEpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb21pc2UuZGF0YSA9PSBcIjFcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9tYWNoaW5lJyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICRzY29wZS5tYV9zaXplbWVhc3VyZW9wdGlvbnMgPSBpMThuRmlsdGVyKFwibWFjaGluZS5maWVsZHMubWFfc2l6ZW1lYXN1cmVvcHRpb25zXCIpO1xuICAgICAgICAgICAgJHNjb3BlLm1hX2Z1bGxjb2xvcm9wdGlvbnMgPSBpMThuRmlsdGVyKFwibWFjaGluZS5maWVsZHMubWFfZnVsbGNvbG9yb3B0aW9uc1wiKTtcbiAgICAgICAgICAgICRzY29wZS5tYV9wcmludGJnb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJtYWNoaW5lLmZpZWxkcy5tYV9wcmludGJnb3B0aW9uc1wiKTtcbiAgICAgICAgICAgICRzY29wZS5tYV9wcm9jZXNzb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJtYWNoaW5lLmZpZWxkcy5tYV9wcm9jZXNzb3B0aW9uc1wiKTtcbiAgICAgICAgICAgICRzY29wZS5tYV9zdGF0dXNvcHRpb25zID0gaTE4bkZpbHRlcihcIm1hY2hpbmUuZmllbGRzLm1hX3N0YXR1c29wdGlvbnNcIik7XG5cbiAgICAgICAgICAgICRzY29wZS4kb24oJyR2aWV3Q29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAvLyB0aGlzIGNvZGUgaXMgZXhlY3V0ZWQgYWZ0ZXIgdGhlIHZpZXcgaXMgbG9hZGVkXG4gICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIG1hY2hpbmVVcGRhdGVGYWMuZGF0YSgpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNPYmplY3QoYW5ndWxhci5mcm9tSnNvbihwcm9taXNlLmRhdGEpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmZtRGF0YSA9IGFuZ3VsYXIuZnJvbUpzb24ocHJvbWlzZS5kYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1dO1xuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRodHRwJywgJyRxJywgJyRhbGVydHMnLCAnJHN0YXRlUGFyYW1zJywgZnVuY3Rpb24gKCRodHRwLCAkcSwgJGFsZXJ0cywgJHN0YXRlUGFyYW1zKSB7XG4gICAgICAgIHZhciBmYWN0b3J5ID0ge307XG4gICAgICAgIGZhY3RvcnkuZGF0YSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKFxuICAgICAgICAgICAgICAgICRodHRwLnBvc3QoJ21vZHVsZXMvbWFjaGluZS9tb2R1bGVzL21hY2hpbmUudXBkYXRlL21hY2hpbmUudXBkYXRlLm1kbC5nZXRtYWNoaW5lLnBocCcsIHtcbiAgICAgICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgICAgICBtYV9pZDogJHN0YXRlUGFyYW1zLm1hX2lkXG4gICAgICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzdGFja0Vycm9yID0gSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiBkYXRhLnN0YXR1cyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yOiBkYXRhLmVycm9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JUeXBlOiBkYXRhLnR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25maWc6IGNvbmZpZ1xuICAgICAgICAgICAgICAgICAgICB9LCBudWxsLCA0KTtcbiAgICAgICAgICAgICAgICAgICAgJGFsZXJ0cy5lcnJvcignV29vb3BzISBhbiBlcnJvciBoYXMgb2N1cnJlZC4nLCBzdGFja0Vycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICBmYWN0b3J5LnVwZGF0ZSA9IGZ1bmN0aW9uIChtYV9qc29uYikge1xuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoXG4gICAgICAgICAgICAgICAgJGh0dHAucG9zdCgnbW9kdWxlcy9tYWNoaW5lL21vZHVsZXMvbWFjaGluZS51cGRhdGUvbWFjaGluZS51cGRhdGUubWRsLnVwZGF0ZS5waHAnLCB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICAgICAgbWFfaWQ6ICRzdGF0ZVBhcmFtcy5tYV9pZCxcbiAgICAgICAgICAgICAgICAgICAgbWFfanNvbmI6IG1hX2pzb25iXG4gICAgICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzdGFja0Vycm9yID0gSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiBkYXRhLnN0YXR1cyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yOiBkYXRhLmVycm9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JUeXBlOiBkYXRhLnR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25maWc6IGNvbmZpZ1xuICAgICAgICAgICAgICAgICAgICB9LCBudWxsLCA0KTtcbiAgICAgICAgICAgICAgICAgICAgJGFsZXJ0cy5lcnJvcignV29vb3BzISBhbiBlcnJvciBoYXMgb2N1cnJlZC4nLCBzdGFja0Vycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICBmYWN0b3J5LmdldENvdW50cmllcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gJGh0dHAuZ2V0KCdodHRwOi8vYXBpLmdlb25hbWVzLm9yZy9jb3VudHJ5SW5mb0pTT04/dXNlcm5hbWU9YWxlamFuZHJvbHNjYScpXG4gICAgICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc3RhY2tFcnJvciA9IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogZGF0YS5zdGF0dXMsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjogZGF0YS5lcnJvcixcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yVHlwZTogZGF0YS50eXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnOiBjb25maWdcbiAgICAgICAgICAgICAgICAgICAgfSwgbnVsbCwgNCk7XG4gICAgICAgICAgICAgICAgICAgICRhbGVydHMuZXJyb3IoJ1dvb29wcyEgYW4gZXJyb3IgaGFzIG9jdXJyZWQuJywgc3RhY2tFcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeS5nZXRTdGF0ZXMgPSBmdW5jdGlvbiAobWFfY291bnRyeSkge1xuICAgICAgICAgICAgdmFyIHByb21pc2UgPSAkaHR0cC5nZXQoJ2h0dHA6Ly9hcGkuZ2VvbmFtZXMub3JnL2NoaWxkcmVuSlNPTj9nZW9uYW1lSWQ9JyArIG1hX2NvdW50cnkgKyAnJnVzZXJuYW1lPWFsZWphbmRyb2xzY2EnKVxuICAgICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0YWNrRXJyb3IgPSBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IGRhdGEuc3RhdHVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGRhdGEuZXJyb3IsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvclR5cGU6IGRhdGEudHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZzogY29uZmlnXG4gICAgICAgICAgICAgICAgICAgIH0sIG51bGwsIDQpO1xuICAgICAgICAgICAgICAgICAgICAkYWxlcnRzLmVycm9yKCdXb29vcHMhIGFuIGVycm9yIGhhcyBvY3VycmVkLicsIHN0YWNrRXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkuZ2V0Q2l0eUNvdW50eSA9IGZ1bmN0aW9uIChtYV9zdGF0ZSkge1xuICAgICAgICAgICAgdmFyIHByb21pc2UgPSAkaHR0cC5nZXQoJ2h0dHA6Ly9hcGkuZ2VvbmFtZXMub3JnL2NoaWxkcmVuSlNPTj9nZW9uYW1lSWQ9JyArIG1hX3N0YXRlICsgJyZ1c2VybmFtZT1hbGVqYW5kcm9sc2NhJylcbiAgICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzdGFja0Vycm9yID0gSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiBkYXRhLnN0YXR1cyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yOiBkYXRhLmVycm9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JUeXBlOiBkYXRhLnR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25maWc6IGNvbmZpZ1xuICAgICAgICAgICAgICAgICAgICB9LCBudWxsLCA0KTtcbiAgICAgICAgICAgICAgICAgICAgJGFsZXJ0cy5lcnJvcignV29vb3BzISBhbiBlcnJvciBoYXMgb2N1cnJlZC4nLCBzdGFja0Vycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZmFjdG9yeTtcbiAgICB9XTtcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oYW5ndWxhcil7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIFxuICAgIHJldHVybiBhbmd1bGFyLm1vZHVsZSgnYXBwLnBhcGVyJyxbXG4gICAgICAgIHJlcXVpcmUoJy4vbW9kdWxlcy9wYXBlci5hZGQnKS5uYW1lLFxuICAgICAgICByZXF1aXJlKCcuL21vZHVsZXMvcGFwZXIudXBkYXRlJykubmFtZVxuICAgIF0pXG5cbiAgICAuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJyxcbiAgICBmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdwYXBlcicsIHtcbiAgICAgICAgICAgIHVybDonL3BhcGVyJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsIDogJ21vZHVsZXMvcGFwZXIvcGFwZXIudmlldy5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXIgOiAncGFwZXJDdHJsJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICByZXF1aXJlc0xvZ2luOiB0cnVlXG4gICAgICAgICAgICB9ICAgIFxuICAgICAgICB9KTtcbiAgICB9XSlcblxuICAgIC5mYWN0b3J5KCdwYXBlckZhYycscmVxdWlyZSgnLi9wYXBlci5mYWMnKSlcblxuICAgIC5jb250cm9sbGVyKCdwYXBlckN0cmwnLHJlcXVpcmUoJy4vcGFwZXIuY3RybCcpKVxuICAgIFxufSkoYW5ndWxhcik7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiIDogXCJQYXBlbFwiLFxuICAgICAgICAgICAgICAgICAgICBcImxhYmVsc1wiOntcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicGEtaWRcIjpcIklEIFBhcGVsXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN1LWlkXCI6XCJJRCBQcm92ZWVkb3JcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicGEtY29kZVwiOlwiQ29kaWdvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInBhLXR5cGVcIjpcIlRpcG9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicGEtZGVzY3JpcHRpb25cIjpcIkRlc2NyaXBjacOzblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwYS13ZWlnaHRcIjpcIlBlc29cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicGEtd2lkdGhcIjpcIkFuY2hvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInBhLWhlaWdodFwiOlwiQWx0dXJhXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInBhLW1lYXN1cmVcIjpcIk1lZGlkYVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwYS1wcmljZVwiOlwiUHJlY2lvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInBhLXN0YXR1c1wiOlwiRXN0YXR1c1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwYS1kYXRlXCI6XCJGZWNoYVwiLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgXCJjb2x1bW5zXCI6W1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJwYV9pZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdV9pZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwYV9jb2RlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInBhX3R5cGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicGFfZGVzY3JpcHRpb25cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicGFfd2VpZ2h0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInBhX3dpZHRoXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInBhX2hlaWdodFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwYV9tZWFzdXJlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInBhX3ByaWNlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInBhX3N0YXR1c1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwYV9kYXRlXCIsXG4gICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgXCJmaWVsZHNcIiA6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhX3N0YXR1c29wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkFjdGl2b1wiLFwidmFsdWVcIjpcIkFcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkluYWN0aXZvXCIsXCJ2YWx1ZVwiOlwiSVwifVxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhX3R5cGVvcHRpb25zIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJQYXBlbFwiLFwidmFsdWVcIjpcInBhcGVyXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJDYXJ0dWxpbmFcIixcInZhbHVlXCI6XCJwb3N0ZXJfYm9hcmRcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIlBhcGVsIEFkaGVzaXZvXCIsXCJ2YWx1ZVwiOlwiYWRoZXNpdmVfcGFwZXJcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIlBlbGljdWxhIEFkaGVzaXZhXCIsXCJ2YWx1ZVwiOlwiYWRoZXNpdmUgZmlsbVwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiU8OtbnRldGljb1wiLFwidmFsdWVcIjpcInN5bnRoZXRpY1wifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiUGxhc3RpY29zXCIsXCJ2YWx1ZVwiOlwicGxhc3RpY3NcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIlRlcm1hbCBUcmFuc2ZlclwiLFwidmFsdWVcIjpcInRlcm1hbCB0cmFuc2ZlclwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiRGlyZWN0IFRlcm1hbFwiLFwidmFsdWVcIjpcImRpcmVjdF90ZXJtYWxcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIk90cm9zXCIsXCJ2YWx1ZVwiOlwib3RoZXJcIn1cbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBwYV9tZWFzdXJlb3B0aW9ucyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiY21cIixcInZhbHVlXCI6XCJjbVwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwicHVsZ2FkYXNcIixcInZhbHVlXCI6XCJpblwifVxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0iLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbihhbmd1bGFyKXtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgXG4gICAgcmV0dXJuIGFuZ3VsYXIubW9kdWxlKCdhcHAucGFwZXIuYWRkJyxbXSlcblxuICAgIC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLFxuICAgIGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcbiAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3BhcGVyQWRkJywge1xuICAgICAgICAgICAgdXJsOicvcGFwZXIvYWRkJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsIDogJ21vZHVsZXMvcGFwZXIvbW9kdWxlcy9wYXBlci5hZGQvcGFwZXIuYWRkLnZpZXcuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyIDogJ3BhcGVyQWRkQ3RybCcsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgcmVxdWlyZXNMb2dpbjogdHJ1ZVxuICAgICAgICAgICAgfSAgICBcbiAgICAgICAgfSk7XG4gICAgfV0pXG5cbiAgICAuZmFjdG9yeSgncGFwZXJBZGRGYWMnLHJlcXVpcmUoJy4vcGFwZXIuYWRkLmZhYycpKVxuXG4gICAgLmNvbnRyb2xsZXIoJ3BhcGVyQWRkQ3RybCcscmVxdWlyZSgnLi9wYXBlci5hZGQuY3RybCcpKVxuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiIDogXCJhZ3JlZ2FyIHBhcGVsXCIsXG4gICAgICAgICAgICAgICAgfSIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgcmV0dXJuIFsnJHNjb3BlJywgJ3BhcGVyQWRkRmFjJywgJyRsb2NhdGlvbicsICdpMThuRmlsdGVyJyxcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgcGFwZXJBZGRGYWMsICRsb2NhdGlvbiwgaTE4bkZpbHRlcikge1xuICAgICAgICAgICAgJHNjb3BlLmZtRGF0YSA9IHt9O1xuXG4gICAgICAgICAgICAkc2NvcGUub25TdWJtaXQgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICBwYXBlckFkZEZhYy5hZGQoJHNjb3BlLmZtRGF0YSkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocHJvbWlzZS5kYXRhID09IFwiMVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3BhcGVyJyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICRzY29wZS5wYV9zdGF0dXNvcHRpb25zID0gaTE4bkZpbHRlcihcInBhcGVyLmZpZWxkcy5wYV9zdGF0dXNvcHRpb25zXCIpO1xuICAgICAgICAgICAgJHNjb3BlLnBhX3R5cGVvcHRpb25zID0gaTE4bkZpbHRlcihcInBhcGVyLmZpZWxkcy5wYV90eXBlb3B0aW9uc1wiKTtcbiAgICAgICAgICAgICRzY29wZS5wYV9tZWFzdXJlb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJwYXBlci5maWVsZHMucGFfbWVhc3VyZW9wdGlvbnNcIik7XG5cbiAgICAgICAgICAgICRzY29wZS4kb24oJyR2aWV3Q29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAvLyB0aGlzIGNvZGUgaXMgZXhlY3V0ZWQgYWZ0ZXIgdGhlIHZpZXcgaXMgbG9hZGVkXG4gICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBwYXBlckFkZEZhYy5nZXRTdXBwbGllcnMoKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnN1X2lkb3B0aW9ucyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHByb21pc2UuZGF0YSwgZnVuY3Rpb24gKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnB1c2goeyBcImxhYmVsXCI6IHZhbHVlLnN1X2NvcnBvcmF0ZW5hbWUsIFwidmFsdWVcIjogdmFsdWUuc3VfaWQgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAkc2NvcGUuc3VfaWRvcHRpb25zKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vJHNjb3BlLnVwZGF0ZUZhaWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XTtcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oYW5ndWxhcil7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIFxuICAgIHJldHVybiBbJyRodHRwJywgJyRxJywgJyRhbGVydHMnLCAnJHN0YXRlUGFyYW1zJywgZnVuY3Rpb24oJGh0dHAsICRxLCAkYWxlcnRzLCAkc3RhdGVQYXJhbXMpe1xuICAgICAgICB2YXIgZmFjdG9yeSA9IHt9O1xuICAgICAgICBmYWN0b3J5LmFkZCA9IGZ1bmN0aW9uKHBhX2pzb25iKSB7XG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9ICRodHRwLnBvc3QoJ21vZHVsZXMvcGFwZXIvbW9kdWxlcy9wYXBlci5hZGQvcGFwZXIuYWRkLm1kbC5hZGQucGhwJywge1xuICAgICAgICAgICAgICAgICAgICAvKiBQT1NUIHZhcmlhYmxlcyBoZXJlICovXG4gICAgICAgICAgICAgICAgICAgIHBhX2pzb25iOiBwYV9qc29uYlxuICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZyl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1wic3RhdHVzXCI6IGZhbHNlfTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkuZ2V0U3VwcGxpZXJzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9ICRodHRwLmdldCgnbW9kdWxlcy9wYXBlci9tb2R1bGVzL3BhcGVyLmFkZC9wYXBlci5hZGQubWRsLmdldFN1cHBsaWVycy5waHAnKVxuICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpe1xuICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcInN0YXR1c1wiOiBmYWxzZX07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZmFjdG9yeTtcbiAgICB9XTtcbiAgICBcbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKGFuZ3VsYXIpe1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBcbiAgICByZXR1cm4gYW5ndWxhci5tb2R1bGUoJ2FwcC5wYXBlci51cGRhdGUnLFtdKVxuXG4gICAgLmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsXG4gICAgZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgncGFwZXJVcGRhdGUnLCB7XG4gICAgICAgICAgICB1cmw6Jy9wYXBlci91cGRhdGUvOnBhX2lkJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsIDogJ21vZHVsZXMvcGFwZXIvbW9kdWxlcy9wYXBlci51cGRhdGUvcGFwZXIudXBkYXRlLnZpZXcuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyIDogJ3BhcGVyVXBkYXRlQ3RybCcsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgcmVxdWlyZXNMb2dpbjogdHJ1ZVxuICAgICAgICAgICAgfSAgICBcbiAgICAgICAgfSk7XG4gICAgfV0pXG5cbiAgICAuZmFjdG9yeSgncGFwZXJVcGRhdGVGYWMnLHJlcXVpcmUoJy4vcGFwZXIudXBkYXRlLmZhYycpKVxuXG4gICAgLmNvbnRyb2xsZXIoJ3BhcGVyVXBkYXRlQ3RybCcscmVxdWlyZSgnLi9wYXBlci51cGRhdGUuY3RybCcpKVxuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiIDogXCJhY3R1YWxpemFyIHBhcGVsXCIsXG4gICAgICAgICAgICAgICAgfSIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgcmV0dXJuIFsnJHNjb3BlJywgJ3BhcGVyVXBkYXRlRmFjJywgJyRsb2NhdGlvbicsICdpMThuRmlsdGVyJyxcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgcGFwZXJVcGRhdGVGYWMsICRsb2NhdGlvbiwgaTE4bkZpbHRlcikge1xuXG4gICAgICAgICAgICAkc2NvcGUub25TdWJtaXQgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICBwYXBlclVwZGF0ZUZhYy51cGRhdGUoJHNjb3BlLmZtRGF0YSkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocHJvbWlzZS5kYXRhID09IFwiMVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3BhcGVyJyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICRzY29wZS5wYV9zdGF0dXNvcHRpb25zID0gaTE4bkZpbHRlcihcInBhcGVyLmZpZWxkcy5wYV9zdGF0dXNvcHRpb25zXCIpO1xuICAgICAgICAgICAgJHNjb3BlLnBhX3R5cGVvcHRpb25zID0gaTE4bkZpbHRlcihcInBhcGVyLmZpZWxkcy5wYV90eXBlb3B0aW9uc1wiKTtcbiAgICAgICAgICAgICRzY29wZS5wYV9tZWFzdXJlb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJwYXBlci5maWVsZHMucGFfbWVhc3VyZW9wdGlvbnNcIik7XG5cbiAgICAgICAgICAgICRzY29wZS4kb24oJyR2aWV3Q29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAvLyB0aGlzIGNvZGUgaXMgZXhlY3V0ZWQgYWZ0ZXIgdGhlIHZpZXcgaXMgbG9hZGVkXG4gICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHBhcGVyVXBkYXRlRmFjLmRhdGEoKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzT2JqZWN0KGFuZ3VsYXIuZnJvbUpzb24ocHJvbWlzZS5kYXRhKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5mbURhdGEgPSBhbmd1bGFyLmZyb21Kc29uKHByb21pc2UuZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgcGFwZXJVcGRhdGVGYWMuZ2V0U3VwcGxpZXJzKCkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnN1X2lkb3B0aW9ucyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChwcm9taXNlLmRhdGEsIGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHVzaCh7IFwibGFiZWxcIjogdmFsdWUuc3VfY29ycG9yYXRlbmFtZSwgXCJ2YWx1ZVwiOiB2YWx1ZS5zdV9pZCB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCAkc2NvcGUuc3VfaWRvcHRpb25zKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8kc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfV07XG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgcmV0dXJuIFsnJGh0dHAnLCAnJHEnLCAnJGFsZXJ0cycsICckc3RhdGVQYXJhbXMnLCBmdW5jdGlvbiAoJGh0dHAsICRxLCAkYWxlcnRzLCAkc3RhdGVQYXJhbXMpIHtcbiAgICAgICAgdmFyIGZhY3RvcnkgPSB7fTtcbiAgICAgICAgZmFjdG9yeS5kYXRhID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoXG4gICAgICAgICAgICAgICAgJGh0dHAucG9zdCgnbW9kdWxlcy9wYXBlci9tb2R1bGVzL3BhcGVyLnVwZGF0ZS9wYXBlci51cGRhdGUubWRsLmdldHBhcGVyLnBocCcsIHtcbiAgICAgICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgICAgICBwYV9pZDogJHN0YXRlUGFyYW1zLnBhX2lkXG4gICAgICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzdGFja0Vycm9yID0gSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiBkYXRhLnN0YXR1cyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yOiBkYXRhLmVycm9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JUeXBlOiBkYXRhLnR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25maWc6IGNvbmZpZ1xuICAgICAgICAgICAgICAgICAgICB9LCBudWxsLCA0KTtcbiAgICAgICAgICAgICAgICAgICAgJGFsZXJ0cy5lcnJvcignV29vb3BzISBhbiBlcnJvciBoYXMgb2N1cnJlZC4nLCBzdGFja0Vycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeS51cGRhdGUgPSBmdW5jdGlvbiAocGFfanNvbmIpIHtcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKFxuICAgICAgICAgICAgICAgICRodHRwLnBvc3QoJ21vZHVsZXMvcGFwZXIvbW9kdWxlcy9wYXBlci51cGRhdGUvcGFwZXIudXBkYXRlLm1kbC51cGRhdGUucGhwJywge1xuICAgICAgICAgICAgICAgICAgICAvKiBQT1NUIHZhcmlhYmxlcyBoZXJlICovXG4gICAgICAgICAgICAgICAgICAgIHBhX2lkOiAkc3RhdGVQYXJhbXMucGFfaWQsXG4gICAgICAgICAgICAgICAgICAgIHBhX2pzb25iOiBwYV9qc29uYlxuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc3RhY2tFcnJvciA9IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogZGF0YS5zdGF0dXMsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjogZGF0YS5lcnJvcixcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yVHlwZTogZGF0YS50eXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnOiBjb25maWdcbiAgICAgICAgICAgICAgICAgICAgfSwgbnVsbCwgNCk7XG4gICAgICAgICAgICAgICAgICAgICRhbGVydHMuZXJyb3IoJ1dvb29wcyEgYW4gZXJyb3IgaGFzIG9jdXJyZWQuJywgc3RhY2tFcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkuZ2V0U3VwcGxpZXJzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHByb21pc2UgPSAkaHR0cC5nZXQoJ21vZHVsZXMvcGFwZXIvbW9kdWxlcy9wYXBlci5hZGQvcGFwZXIuYWRkLm1kbC5nZXRTdXBwbGllcnMucGhwJylcbiAgICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzdGFja0Vycm9yID0gSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiBkYXRhLnN0YXR1cyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yOiBkYXRhLmVycm9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JUeXBlOiBkYXRhLnR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25maWc6IGNvbmZpZ1xuICAgICAgICAgICAgICAgICAgICB9LCBudWxsLCA0KTtcbiAgICAgICAgICAgICAgICAgICAgJGFsZXJ0cy5lcnJvcignV29vb3BzISBhbiBlcnJvciBoYXMgb2N1cnJlZC4nLCBzdGFja0Vycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZmFjdG9yeTtcbiAgICB9XTtcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oYW5ndWxhcil7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIFxuICAgIHJldHVybiBbJyRzY29wZScsICdwYXBlckZhYycsICdpMThuRmlsdGVyJyxcbiAgICBmdW5jdGlvbiAoJHNjb3BlLCBwYXBlckZhYywgaTE4bkZpbHRlcikge1xuICAgIFxuICAgICAgICAkc2NvcGUubGFiZWxzID0gT2JqZWN0LmtleXMoaTE4bkZpbHRlcihcInBhcGVyLmxhYmVsc1wiKSk7XG4gICAgICAgICRzY29wZS5jb2x1bW5zID0gaTE4bkZpbHRlcihcInBhcGVyLmNvbHVtbnNcIik7XG4gICAgICAgIFxuICAgICAgICAvLyBmb3JtYXRJdGVtIGV2ZW50IGhhbmRsZXJcbiAgICAgICAgdmFyIHBhX2lkO1xuICAgICAgICAkc2NvcGUuZm9ybWF0SXRlbSA9IGZ1bmN0aW9uKHMsIGUsIGNlbGwpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKGUucGFuZWwuY2VsbFR5cGUgPT0gd2lqbW8uZ3JpZC5DZWxsVHlwZS5Sb3dIZWFkZXIpIHtcbiAgICAgICAgICAgICAgICBlLmNlbGwudGV4dENvbnRlbnQgPSBlLnJvdysxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBzLnJvd3MuZGVmYXVsdFNpemUgPSAzMDtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gYWRkIEJvb3RzdHJhcCBodG1sXG4gICAgICAgICAgICBpZiAoKGUucGFuZWwuY2VsbFR5cGUgPT0gd2lqbW8uZ3JpZC5DZWxsVHlwZS5DZWxsKSAmJiAoZS5jb2wgPT0gMCkpIHtcbiAgICAgICAgICAgICAgICBwYV9pZCA9IGUucGFuZWwuZ2V0Q2VsbERhdGEoZS5yb3csMSxmYWxzZSk7XG4gICAgICAgICAgICAgICAgZS5jZWxsLnN0eWxlLm92ZXJmbG93ID0gJ3Zpc2libGUnO1xuICAgICAgICAgICAgICAgIGUuY2VsbC5pbm5lckhUTUwgPSAnPGRpdiBjbGFzcz1cImJ0bi1ncm91cCBidG4tZ3JvdXAtanVzdGlmaWVkXCIgcm9sZT1cImdyb3VwXCIgYXJpYS1sYWJlbD1cIi4uLlwiPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJ0bi1ncm91cFwiIHJvbGU9XCJncm91cFwiPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIjL3BhcGVyL3VwZGF0ZS8nK3BhX2lkKydcIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdCBidG4teHNcIiBuZy1jbGljaz1cImVkaXQoJGl0ZW0ucGFfaWQpXCI+RWRpdGFyPC9hPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2Pic7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vIGJpbmQgY29sdW1ucyB3aGVuIGdyaWQgaXMgaW5pdGlhbGl6ZWRcbiAgICAgICAgJHNjb3BlLmluaXRHcmlkID0gZnVuY3Rpb24ocywgZSkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAkc2NvcGUubGFiZWxzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNvbCA9IG5ldyB3aWptby5ncmlkLkNvbHVtbigpO1xuICAgICAgICAgICAgICAgIGNvbC5iaW5kaW5nID0gJHNjb3BlLmNvbHVtbnNbaV07XG4gICAgICAgICAgICAgICAgY29sLmhlYWRlciA9IGkxOG5GaWx0ZXIoXCJwYXBlci5sYWJlbHMuXCIgKyAkc2NvcGUubGFiZWxzW2ldKTtcbiAgICAgICAgICAgICAgICBjb2wud29yZFdyYXAgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBjb2wud2lkdGggPSAxNTA7XG4gICAgICAgICAgICAgICAgcy5jb2x1bW5zLnB1c2goY29sKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgLy8gY3JlYXRlIHRoZSB0b29sdGlwIG9iamVjdFxuICAgICAgICAkc2NvcGUuJHdhdGNoKCdnZ0dyaWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoJHNjb3BlLmdnR3JpZCkge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBzdG9yZSByZWZlcmVuY2UgdG8gZ3JpZFxuICAgICAgICAgICAgICAgIHZhciBmbGV4ID0gJHNjb3BlLmdnR3JpZDtcblxuICAgICAgICAgICAgICAgIC8vIGNyZWF0ZSB0b29sdGlwXG4gICAgICAgICAgICAgICAgdmFyIHRpcCA9IG5ldyB3aWptby5Ub29sdGlwKCksXG4gICAgICAgICAgICAgICAgICAgIHJuZyA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICAvLyBtb25pdG9yIHRoZSBtb3VzZSBvdmVyIHRoZSBncmlkXG4gICAgICAgICAgICAgICAgZmxleC5ob3N0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBodCA9IGZsZXguaGl0VGVzdChldnQpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWh0LmNlbGxSYW5nZS5lcXVhbHMocm5nKSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBuZXcgY2VsbCBzZWxlY3RlZCwgc2hvdyB0b29sdGlwXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaHQuY2VsbFR5cGUgPT0gd2lqbW8uZ3JpZC5DZWxsVHlwZS5DZWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm5nID0gaHQuY2VsbFJhbmdlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb2wgPSBmbGV4LmNvbHVtbnNbcm5nLmNvbF0uaGVhZGVyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjZWxsRWxlbWVudCA9IGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQoZXZ0LmNsaWVudFgsIGV2dC5jbGllbnRZKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2VsbEJvdW5kcyA9IHdpam1vLlJlY3QuZnJvbUJvdW5kaW5nUmVjdChjZWxsRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEgPSB3aWptby5lc2NhcGVIdG1sKGZsZXguZ2V0Q2VsbERhdGEocm5nLnJvdywgcm5nLmNvbCwgdHJ1ZSkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXBDb250ZW50ID0gY29sICsgJzogXCI8Yj4nICsgZGF0YSArICc8L2I+XCInO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjZWxsRWxlbWVudC5jbGFzc05hbWUuaW5kZXhPZignd2otY2VsbCcpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlwLnNob3coZmxleC5ob3N0RWxlbWVudCwgdGlwQ29udGVudCwgY2VsbEJvdW5kcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlwLmhpZGUoKTsgLy8gY2VsbCBtdXN0IGJlIGJlaGluZCBzY3JvbGwgYmFyLi4uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgZmxleC5ob3N0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGlwLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgcm5nID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHNjb3BlLiRvbignJHZpZXdDb250ZW50TG9hZGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLy8gdGhpcyBjb2RlIGlzIGV4ZWN1dGVkIGFmdGVyIHRoZSB2aWV3IGlzIGxvYWRlZFxuICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgcGFwZXJGYWMuZGF0YSgpLnRoZW4oZnVuY3Rpb24ocHJvbWlzZSl7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBpZihhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZGF0YSA9IG5ldyB3aWptby5jb2xsZWN0aW9ucy5Db2xsZWN0aW9uVmlldyhwcm9taXNlLmRhdGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgfSk7XG4gICAgfV07XG4gICAgXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRodHRwJywgJyRxJywgJyRhbGVydHMnLCBmdW5jdGlvbiAoJGh0dHAsICRxLCAkYWxlcnRzKSB7XG4gICAgICAgIHZhciBmYWN0b3J5ID0ge307XG4gICAgICAgIGZhY3RvcnkuZGF0YSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKFxuICAgICAgICAgICAgICAgICRodHRwLnBvc3QoJ21vZHVsZXMvcGFwZXIvcGFwZXIubWRsLmdldHBhcGVycy5waHAnLCB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICAgICAgcHJvY2Nlc19pZDogbmV3IERhdGUoKS5nZXRNaWxsaXNlY29uZHMoKVxuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc3RhY2tFcnJvciA9IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogZGF0YS5zdGF0dXMsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjogZGF0YS5lcnJvcixcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yVHlwZTogZGF0YS50eXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnOiBjb25maWdcbiAgICAgICAgICAgICAgICAgICAgfSwgbnVsbCwgNCk7XG4gICAgICAgICAgICAgICAgICAgICRhbGVydHMuZXJyb3IoJ1dvb29wcyEgYW4gZXJyb3IgaGFzIG9jdXJyZWQuJywgc3RhY2tFcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGZhY3Rvcnk7XG4gICAgfV07XG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKGFuZ3VsYXIpe1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBcbiAgICByZXR1cm4gYW5ndWxhci5tb2R1bGUoJ2FwcC5wcm9kdWN0JyxbXG4gICAgICAgIHJlcXVpcmUoJy4vbW9kdWxlcy9wcm9kdWN0T2Zmc2V0R2VuZXJhbC5hZGQnKS5uYW1lLFxuICAgICAgICByZXF1aXJlKCcuL21vZHVsZXMvcHJvZHVjdE9mZnNldEdlbmVyYWwudXBkYXRlJykubmFtZSxcbiAgICAgICAgcmVxdWlyZSgnLi9tb2R1bGVzL3Byb2R1Y3RPZmZzZXRQYWdpbmF0ZWQuYWRkJykubmFtZSxcbiAgICAgICAgLy9yZXF1aXJlKCcuL21vZHVsZXMvcHJvZHVjdE9mZnNldFBhZ2luYXRlZC51cGRhdGUnKS5uYW1lXG4gICAgXSlcblxuICAgIC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLFxuICAgIGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcbiAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3Byb2R1Y3QnLCB7XG4gICAgICAgICAgICB1cmw6Jy9wcm9kdWN0LzpjbF9pZCcsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybCA6ICdtb2R1bGVzL3Byb2R1Y3QvcHJvZHVjdC52aWV3Lmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlciA6ICdwcm9kdWN0Q3RybCcsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgcmVxdWlyZXNMb2dpbjogdHJ1ZVxuICAgICAgICAgICAgfSAgICBcbiAgICAgICAgfSk7XG4gICAgfV0pXG5cbiAgICAuZmFjdG9yeSgncHJvZHVjdEZhYycscmVxdWlyZSgnLi9wcm9kdWN0LmZhYycpKVxuXG4gICAgLmNvbnRyb2xsZXIoJ3Byb2R1Y3RDdHJsJyxyZXF1aXJlKCcuL3Byb2R1Y3QuY3RybCcpKVxuICAgIFxufSkoYW5ndWxhcik7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiIDogXCJQcm9kdWN0b3NcIixcbiAgICAgICAgICAgICAgICAgICAgXCJsYWJlbHNcIjp7XG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLWlkXCI6IFwiSUQgcHJvZHVjdG9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2wtaWRcIjogXCJJRCBDbGllbnRlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLXBhcnRub1wiOiBcIk5vLiBQYXJ0ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1jb2RlXCI6IFwiQ29kaWdvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLW5hbWVcIjogXCJOb21icmVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItcHJvY2Vzc1wiOiBcIlByb2Nlc29cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItdHlwZVwiOiBcIlRpcG9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItc3RhdHVzXCI6IFwiRXN0YXR1c1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1kYXRlXCI6IFwiRmVjaGFcIixcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgXCJjb2x1bW5zXCI6W1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9pZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbF9pZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9wYXJ0bm9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfY29kZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9uYW1lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX3Byb2Nlc3NcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfdHlwZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9zdGF0dXNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfZGF0ZVwiLFxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgXCJmaWVsZHNcIiA6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0iLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbihhbmd1bGFyKXtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgXG4gICAgcmV0dXJuIGFuZ3VsYXIubW9kdWxlKCdhcHAucHJvZHVjdE9mZnNldEdlbmVyYWwuYWRkJyxbXSlcblxuICAgIC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLFxuICAgIGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcbiAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3Byb2R1Y3RPZmZzZXRHZW5lcmFsQWRkJywge1xuICAgICAgICAgICAgdXJsOicvcHJvZHVjdC9hZGQvb2Zmc2V0L2dlbmVyYWwvOmNsX2lkJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsIDogJ21vZHVsZXMvcHJvZHVjdC9tb2R1bGVzL3Byb2R1Y3RPZmZzZXRHZW5lcmFsLmFkZC9wcm9kdWN0T2Zmc2V0R2VuZXJhbC5hZGQudmlldy5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXIgOiAncHJvZHVjdE9mZnNldEdlbmVyYWxBZGRDdHJsJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICByZXF1aXJlc0xvZ2luOiB0cnVlXG4gICAgICAgICAgICB9ICAgIFxuICAgICAgICB9KTtcbiAgICB9XSlcblxuICAgIC5mYWN0b3J5KCdwcm9kdWN0T2Zmc2V0R2VuZXJhbEFkZEZhYycscmVxdWlyZSgnLi9wcm9kdWN0T2Zmc2V0R2VuZXJhbC5hZGQuZmFjJykpXG5cbiAgICAuY29udHJvbGxlcigncHJvZHVjdE9mZnNldEdlbmVyYWxBZGRDdHJsJyxyZXF1aXJlKCcuL3Byb2R1Y3RPZmZzZXRHZW5lcmFsLmFkZC5jdHJsJykpXG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCIgOiBcImFncmVnYXIgcHJvZHVjdG9cIixcbiAgICAgICAgICAgICAgICAgICAgXCJsYWJlbHNcIjp7XG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLWlkXCI6IFwiSUQgcHJvZHVjdG9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2wtaWRcIjogXCJJRCBjbGllbnRlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLXByb2Nlc3NcIjogXCJQcm9jZXNvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLXR5cGVcIjogXCJUaXBvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLXBhcnRub1wiOiBcIk5vLiBwYXJ0ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1jb2RlXCI6IFwiQ29kaWdvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLWRlc2NyaXB0aW9uXCI6IFwiRGVzY3JpcGNpb25cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItZmluYWxzaXpld2lkdGhcIjogXCJBbmNob1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1maW5hbHNpemVoZWlnaHRcIjogXCJBbHRvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLWZpbmFsc2l6ZW1lYXN1cmVcIjogXCJNZWRpZGFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItaW5rZnJvbnRcIjogXCJGcmVudGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItaW5rYmFja1wiOiBcIlJldmVyc29cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicGEtaWRcIjogXCJJRCBwYXBlbFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1wYXBlcnNpemV3aWR0aFwiOiBcIkFuY2hvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLXBhcGVyc2l6ZWhlaWdodFwiOiBcIkFsdG9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItcGFwZXJzaXplbWVhc3VyZVwiOiBcIk1lZGlkYVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1wYXBlcmZvcm1hdHNxdHlcIjogXCJGb3JtYXRvc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci12YXJuaXNoXCI6IFwiQmFybml6XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLXZhcm5pc2h1dlwiOiBcIkJhcm5peiBVVlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci12YXJuaXNoZmluaXNoZWRcIjogXCJBY2FiYWRvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLWxhbWluYXRlXCI6IFwiTGFtaW5hZG9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItbGFtaW5hdGVmaW5pc2hlZFwiOiBcIkFjYWJhZG9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItbGFtaW5hdGVjYWxpYmVyXCI6IFwiQ2FsaWJyZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1sYW1pbmF0ZXNpZGVzXCI6IFwiQ2FyYXNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItZm9saW9cIjogXCJGb2xpb1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1wcmVjdXRcIjogXCJQcmVjb3J0ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1mb2xkXCI6IFwiRG9ibGV6XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLWRpZWN1dHRpbmdcIjogXCJTdWFqZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1kaWVjdXR0aW5ncXR5XCI6IFwiTm8uIFN1YWplc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1yZWluZm9yY2VtZW50XCI6IFwiUmVmdWVyem9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItY29yZFwiOiBcIkNvcmTDs25cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItd2lyZVwiOiBcIkFsw6FtYnJlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLWJsb2Nrc1wiOiBcIkJsb2Nrc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1zdGF0dXNcIjogXCJFc3RhdHVzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLWRhdGVcIjogXCJGZWNoYVwiLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBcImNvbHVtbnNcIjpbXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX2lkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsX2lkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX3Byb2Nlc3NcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfdHlwZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9wYXJ0bm9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfY29kZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9kZXNjcmlwdGlvblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9maW5hbHNpemV3aWR0aFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9maW5hbHNpemVoZWlnaHRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfZmluYWxzaXplbWVhc3VyZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9pbmtmcm9udFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9pbmtiYWNrXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInBhX2lkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX3BhcGVyc2l6ZXdpZHRoXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX3BhcGVyc2l6ZWhlaWdodFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9wYXBlcnNpemVtZWFzdXJlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX3BhcGVyZm9ybWF0c3F0eVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl92YXJuaXNoXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX3Zhcm5pc2h1dlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl92YXJuaXNoZmluaXNoZWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfbGFtaW5hdGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfbGFtaW5hdGVmaW5pc2hlZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9sYW1pbmF0ZWNhbGliZXJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfbGFtaW5hdGVzaWRlc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9mb2xpb1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9wcmVjdXRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfZm9sZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9kaWVjdXR0aW5nXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX2RpZWN1dHRpbmdxdHlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfcmVpbmZvcmNlbWVudFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9jb3JkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX3dpcmVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfYmxvY2tzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX3N0YXR1c1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9kYXRlXCIsXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICBcImZpZWxkc1wiIDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJfZmluYWxzaXplbWVhc3VyZW9wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcImNtXCIsXCJ2YWx1ZVwiOlwiY21cIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcInB1bGdhZGFzXCIsXCJ2YWx1ZVwiOlwiaW5cIn1cbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBwcl9pbmtmcm9udG9wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIjEgdGludGFcIixcInZhbHVlXCI6MX0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIjIgdGludGFzXCIsXCJ2YWx1ZVwiOjJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCIzIHRpbnRhc1wiLFwidmFsdWVcIjozfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiNCB0aW50YXNcIixcInZhbHVlXCI6NH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIjUgdGludGFzXCIsXCJ2YWx1ZVwiOjV9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCI2IHRpbnRhc1wiLFwidmFsdWVcIjo2fSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiNyB0aW50YXNcIixcInZhbHVlXCI6N30sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIjggdGludGFzXCIsXCJ2YWx1ZVwiOjh9LFxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHByX2lua2JhY2tvcHRpb25zIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCIxIHRpbnRhXCIsXCJ2YWx1ZVwiOjF9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCIyIHRpbnRhc1wiLFwidmFsdWVcIjoyfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiMyB0aW50YXNcIixcInZhbHVlXCI6M30sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIjQgdGludGFzXCIsXCJ2YWx1ZVwiOjR9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCI1IHRpbnRhc1wiLFwidmFsdWVcIjo1fSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiNiB0aW50YXNcIixcInZhbHVlXCI6Nn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIjcgdGludGFzXCIsXCJ2YWx1ZVwiOjd9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCI4IHRpbnRhc1wiLFwidmFsdWVcIjo4fSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBwcl9wYXBlcnNpemVtZWFzdXJlb3B0aW9ucyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiY21cIixcInZhbHVlXCI6XCJjbVwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwicHVsZ2FkYXNcIixcInZhbHVlXCI6XCJpblwifVxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHByX3Zhcm5pc2hvcHRpb25zIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJTaVwiLFwidmFsdWVcIjpcInllc1wifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiTm9cIixcInZhbHVlXCI6XCJub1wifVxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHByX3Zhcm5pc2h1dm9wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIlVuYSBjYXJhXCIsXCJ2YWx1ZVwiOlwib25lc2lkZVwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiRG9zIGNhcmFzXCIsXCJ2YWx1ZVwiOlwidHdvc2lkZXNcIn1cbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBwcl92YXJuaXNmaW5pc2hlZG9wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIk1hdGVcIixcInZhbHVlXCI6XCJtYXR0ZVwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiQnJpbGxhbnRlXCIsXCJ2YWx1ZVwiOlwiYnJpZ2h0XCJ9XG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJfbGFtaW5hdGVvcHRpb25zIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJTaVwiLFwidmFsdWVcIjpcInllc1wifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiTm9cIixcInZhbHVlXCI6XCJub1wifVxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHByX2xhbWluYXRlZmluaXNoZWRvcHRpb25zIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJNYXRlXCIsXCJ2YWx1ZVwiOlwibWF0dGVcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkJyaWxsYW50ZVwiLFwidmFsdWVcIjpcImJyaWdodFwifVxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHByX2xhbWluYXRlY2FsaWJlcm9wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIi4ybW1cIixcInZhbHVlXCI6XCIybW1cIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIi40bW1cIixcInZhbHVlXCI6XCI0bW1cIn1cbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBwcl9sYW1pbmF0ZXNpZGVzb3B0aW9ucyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiVW5hIGNhcmFcIixcInZhbHVlXCI6XCJvbmVzaWRlXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJEb3MgY2FyYXNcIixcInZhbHVlXCI6XCJ0d29zaWRlc1wifVxuICAgICAgICAgICAgICAgICAgICAgICAgXSxwcl9mb2xpb29wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIlNpXCIsXCJ2YWx1ZVwiOlwieWVzXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJOb1wiLFwidmFsdWVcIjpcIm5vXCJ9XG4gICAgICAgICAgICAgICAgICAgICAgICBdLHByX3ByZWN1dG9wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIk5vXCIsXCJ2YWx1ZVwiOlwibm9cIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkhvcml6b250YWxcIixcInZhbHVlXCI6XCJob3Jpem9udGFsXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJWZXJ0aWNhbFwiLFwidmFsdWVcIjpcInZlcnRpY2FsXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgXSxwcl9mb2xkb3B0aW9ucyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiVHJpcHRpY29cIixcInZhbHVlXCI6XCJ0cnlwdGljXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgXSxwcl9kaWVjdXR0aW5nb3B0aW9ucyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiU2lcIixcInZhbHVlXCI6XCJ5ZXNcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIk5vXCIsXCJ2YWx1ZVwiOlwibm9cIn1cbiAgICAgICAgICAgICAgICAgICAgICAgIF0scHJfcmVpbmZvcmNlbWVudG9wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIk5vXCIsXCJ2YWx1ZVwiOlwibm9cIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIlVub1wiLFwidmFsdWVcIjpcIm9uZVwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiRG9zXCIsXCJ2YWx1ZVwiOlwidHdvXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgXSxwcl9jb3Jkb3B0aW9ucyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiTm9cIixcInZhbHVlXCI6XCJub1wifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiQ29sb2NhZG9cIixcInZhbHVlXCI6XCJhbGxvY2F0ZWRcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIlNlcGFyYWRvXCIsXCJ2YWx1ZVwiOlwic2VwYXJhdGVkXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgXSxwcl93aXJlb3B0aW9ucyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiTm9cIixcInZhbHVlXCI6XCJub1wifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiQ29sb2NhZG9cIixcInZhbHVlXCI6XCJhbGxvY2F0ZWRcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIlNlcGFyYWRvXCIsXCJ2YWx1ZVwiOlwic2VwYXJhdGVkXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgXSxwcl9ibG9ja3NvcHRpb25zIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJOb1wiLFwidmFsdWVcIjpcIm5vXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCIyMFwiLFwidmFsdWVcIjpcIjIwXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCIyNVwiLFwidmFsdWVcIjpcIjI1XCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCI1MFwiLFwidmFsdWVcIjpcIjUwXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCI3NVwiLFwidmFsdWVcIjpcIjc1XCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCIxMDBcIixcInZhbHVlXCI6XCIxMDBcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJfc3RhdHVzb3B0aW9ucyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiQWN0aXZvXCIsXCJ2YWx1ZVwiOlwiQVwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiSW5hY3Rpdm9cIixcInZhbHVlXCI6XCJJXCJ9XG4gICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgcmV0dXJuIFsnJHNjb3BlJywgJ3Byb2R1Y3RPZmZzZXRHZW5lcmFsQWRkRmFjJywgJyRsb2NhdGlvbicsICdpMThuRmlsdGVyJywgJyRzdGF0ZVBhcmFtcycsXG4gICAgICAgIGZ1bmN0aW9uICgkc2NvcGUsIHByb2R1Y3RPZmZzZXRHZW5lcmFsQWRkRmFjLCAkbG9jYXRpb24sIGkxOG5GaWx0ZXIsICRzdGF0ZVBhcmFtcykge1xuICAgICAgICAgICAgJHNjb3BlLmZtRGF0YSA9IHt9O1xuICAgICAgICAgICAgJHNjb3BlLmZtRGF0YSA9IHsgXCJwcl9wcm9jZXNzXCI6IFwib2Zmc2V0XCIsIFwicHJfdHlwZVwiOiBcImdlbmVyYWxcIiwgXCJjbF9pZFwiOiBcIjZcIiwgXCJwcl9wYXJ0bm9cIjogXCJURVNULUFTQS5hc2FzOiAyMywzNFwiLCBcInByX2Rlc2NyaXB0aW9uXCI6IFwiZXN0ZSBlcyB1biBwcm9kdWN0byBkZSBwcnVlYmFcIiwgXCJwcl9maW5hbHNpemV3aWR0aFwiOiBcIjEwMC4wMFwiLCBcInByX2ZpbmFsc2l6ZWhlaWdodFwiOiBcIjIwMC4wMFwiLCBcInByX2ZpbmFsc2l6ZW1lYXN1cmVcIjogXCJjbVwiLCBcInByX2lua2Zyb250XCI6IDIsIFwicHJfaW5rc2Zyb250XCI6IHsgXCIwXCI6IDIsIFwiMVwiOiAyIH0sIFwicHJfaW5rYmFja1wiOiAzLCBcInByX2lua3NiYWNrXCI6IHsgXCIwXCI6IDIsIFwiMVwiOiAzLCBcIjJcIjogMyB9LCBcInBhX2lkXCI6IDEsIFwicHJfcGFwZXJmb3JtYXRzcXR5XCI6IFwiMTIzXCIsIFwicHJfcGFwZXJzaXpld2lkdGhcIjogXCIxMDAuMDBcIiwgXCJwcl9wYXBlcnNpemVoZWlnaHRcIjogXCIyMDAuMDBcIiwgXCJwcl9wYXBlcnNpemVtZWFzdXJlXCI6IFwiY21cIiwgXCJwcl92YXJuaXNoXCI6IFwieWVzXCIsIFwicHJfdmFybmlzaHV2XCI6IFwib25lc2lkZVwiLCBcInByX3Zhcm5pc2hmaW5pc2hlZFwiOiBcIm1hdHRlXCIsIFwicHJfbGFtaW5hdGVcIjogXCJ5ZXNcIiwgXCJwcl9sYW1pbmF0ZWZpbmlzaGVkXCI6IFwibWF0dGVcIiwgXCJwcl9sYW1pbmF0ZWNhbGliZXJcIjogXCIybW1cIiwgXCJwcl9wcmVjdXRcIjogXCJob3Jpem9udGFsXCIsIFwicHJfZm9sZFwiOiBcInRyeXB0aWNcIiwgXCJwcl9kaWVjdXR0aW5nXCI6IFwieWVzXCIsIFwicHJfZGllY3V0dGluZ3F0eVwiOiBcIjVcIiwgXCJwcl9yZWluZm9yY2VtZW50XCI6IFwib25lXCIsIFwicHJfY29yZFwiOiBcImFsbG9jYXRlZFwiLCBcInByX3dpcmVcIjogXCJhbGxvY2F0ZWRcIiwgXCJwcl9mb2xpb1wiOiBcInllc1wiLCBcInByX2Jsb2Nrc1wiOiBcIjEwMFwiLCBcInByX3N0YXR1c1wiOiBcIkFcIiB9O1xuICAgICAgICAgICAgJHNjb3BlLmZtRGF0YS5wcl9wcm9jZXNzID0gJ29mZnNldCc7XG4gICAgICAgICAgICAkc2NvcGUuZm1EYXRhLnByX3R5cGUgPSAnZ2VuZXJhbCc7XG4gICAgICAgICAgICAkc2NvcGUuZm1EYXRhLmNsX2lkID0gJHN0YXRlUGFyYW1zLmNsX2lkO1xuXG4gICAgICAgICAgICAkc2NvcGUub25TdWJtaXQgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICBwcm9kdWN0T2Zmc2V0R2VuZXJhbEFkZEZhYy5hZGQoJHNjb3BlLmZtRGF0YSkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocHJvbWlzZS5kYXRhLnJvd0NvdW50ID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3Byb2R1Y3QvJyskc3RhdGVQYXJhbXMuY2xfaWQpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnVwZGF0ZUZhaWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAkc2NvcGUucHJfZmluYWxzaXplbWVhc3VyZW9wdGlvbnMgPSBpMThuRmlsdGVyKFwicHJvZHVjdE9mZnNldEdlbmVyYWwtYWRkLmZpZWxkcy5wcl9maW5hbHNpemVtZWFzdXJlb3B0aW9uc1wiKTtcbiAgICAgICAgICAgICRzY29wZS5wcl9pbmtmcm9udG9wdGlvbnMgPSBpMThuRmlsdGVyKFwicHJvZHVjdE9mZnNldEdlbmVyYWwtYWRkLmZpZWxkcy5wcl9pbmtmcm9udG9wdGlvbnNcIik7XG4gICAgICAgICAgICAkc2NvcGUucHJfaW5rYmFja29wdGlvbnMgPSBpMThuRmlsdGVyKFwicHJvZHVjdE9mZnNldEdlbmVyYWwtYWRkLmZpZWxkcy5wcl9pbmtiYWNrb3B0aW9uc1wiKTtcbiAgICAgICAgICAgICRzY29wZS5wcl9wYXBlcnNpemVtZWFzdXJlb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJwcm9kdWN0T2Zmc2V0R2VuZXJhbC1hZGQuZmllbGRzLnByX3BhcGVyc2l6ZW1lYXN1cmVvcHRpb25zXCIpO1xuICAgICAgICAgICAgJHNjb3BlLnByX3Zhcm5pc2hvcHRpb25zID0gaTE4bkZpbHRlcihcInByb2R1Y3RPZmZzZXRHZW5lcmFsLWFkZC5maWVsZHMucHJfdmFybmlzaG9wdGlvbnNcIik7XG4gICAgICAgICAgICAkc2NvcGUucHJfdmFybmlzaHV2b3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJwcm9kdWN0T2Zmc2V0R2VuZXJhbC1hZGQuZmllbGRzLnByX3Zhcm5pc2h1dm9wdGlvbnNcIik7XG4gICAgICAgICAgICAkc2NvcGUucHJfdmFybmlzZmluaXNoZWRvcHRpb25zID0gaTE4bkZpbHRlcihcInByb2R1Y3RPZmZzZXRHZW5lcmFsLWFkZC5maWVsZHMucHJfdmFybmlzZmluaXNoZWRvcHRpb25zXCIpO1xuICAgICAgICAgICAgJHNjb3BlLnByX2xhbWluYXRlb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJwcm9kdWN0T2Zmc2V0R2VuZXJhbC1hZGQuZmllbGRzLnByX2xhbWluYXRlb3B0aW9uc1wiKTtcbiAgICAgICAgICAgICRzY29wZS5wcl9sYW1pbmF0ZWZpbmlzaGVkb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJwcm9kdWN0T2Zmc2V0R2VuZXJhbC1hZGQuZmllbGRzLnByX2xhbWluYXRlZmluaXNoZWRvcHRpb25zXCIpO1xuICAgICAgICAgICAgJHNjb3BlLnByX2xhbWluYXRlY2FsaWJlcm9wdGlvbnMgPSBpMThuRmlsdGVyKFwicHJvZHVjdE9mZnNldEdlbmVyYWwtYWRkLmZpZWxkcy5wcl9sYW1pbmF0ZWNhbGliZXJvcHRpb25zXCIpO1xuICAgICAgICAgICAgJHNjb3BlLnByX2xhbWluYXRlc2lkZXNvcHRpb25zID0gaTE4bkZpbHRlcihcInByb2R1Y3RPZmZzZXRHZW5lcmFsLWFkZC5maWVsZHMucHJfbGFtaW5hdGVzaWRlc29wdGlvbnNcIik7XG4gICAgICAgICAgICAkc2NvcGUucHJfZm9saW9vcHRpb25zID0gaTE4bkZpbHRlcihcInByb2R1Y3RPZmZzZXRHZW5lcmFsLWFkZC5maWVsZHMucHJfZm9saW9vcHRpb25zXCIpO1xuICAgICAgICAgICAgJHNjb3BlLnByX3ByZWN1dG9wdGlvbnMgPSBpMThuRmlsdGVyKFwicHJvZHVjdE9mZnNldEdlbmVyYWwtYWRkLmZpZWxkcy5wcl9wcmVjdXRvcHRpb25zXCIpO1xuICAgICAgICAgICAgJHNjb3BlLnByX2ZvbGRvcHRpb25zID0gaTE4bkZpbHRlcihcInByb2R1Y3RPZmZzZXRHZW5lcmFsLWFkZC5maWVsZHMucHJfZm9sZG9wdGlvbnNcIik7XG4gICAgICAgICAgICAkc2NvcGUucHJfZGllY3V0dGluZ29wdGlvbnMgPSBpMThuRmlsdGVyKFwicHJvZHVjdE9mZnNldEdlbmVyYWwtYWRkLmZpZWxkcy5wcl9kaWVjdXR0aW5nb3B0aW9uc1wiKTtcbiAgICAgICAgICAgICRzY29wZS5wcl9yZWluZm9yY2VtZW50b3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJwcm9kdWN0T2Zmc2V0R2VuZXJhbC1hZGQuZmllbGRzLnByX3JlaW5mb3JjZW1lbnRvcHRpb25zXCIpO1xuICAgICAgICAgICAgJHNjb3BlLnByX2NvcmRvcHRpb25zID0gaTE4bkZpbHRlcihcInByb2R1Y3RPZmZzZXRHZW5lcmFsLWFkZC5maWVsZHMucHJfY29yZG9wdGlvbnNcIik7XG4gICAgICAgICAgICAkc2NvcGUucHJfd2lyZW9wdGlvbnMgPSBpMThuRmlsdGVyKFwicHJvZHVjdE9mZnNldEdlbmVyYWwtYWRkLmZpZWxkcy5wcl93aXJlb3B0aW9uc1wiKTtcbiAgICAgICAgICAgICRzY29wZS5wcl9ibG9ja3NvcHRpb25zID0gaTE4bkZpbHRlcihcInByb2R1Y3RPZmZzZXRHZW5lcmFsLWFkZC5maWVsZHMucHJfYmxvY2tzb3B0aW9uc1wiKTtcbiAgICAgICAgICAgICRzY29wZS5wcl9zdGF0dXNvcHRpb25zID0gaTE4bkZpbHRlcihcInByb2R1Y3RPZmZzZXRHZW5lcmFsLWFkZC5maWVsZHMucHJfc3RhdHVzb3B0aW9uc1wiKTtcbiAgICAgICAgXG4gICAgICAgICAgICAvLyBjcmVhdGUgZnJvbnQgaW5rIGZpZWxkc1xuICAgICAgICAgICAgJHNjb3BlLiR3YXRjaCgnZm1EYXRhLnByX2lua2Zyb250JywgZnVuY3Rpb24gKG5ld1ZhbHVlLCBvbGRWYWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICgkc2NvcGUuZm1EYXRhLnByX2lua2Zyb250ICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZnJvbnRJbmtzID0gbmV3IEFycmF5KG5ld1ZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvbGRWYWx1ZTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZm1EYXRhWydwcl9pbmtzZnJvbnQnXVtpXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgICAgIC8vIGNyZWF0ZSBiYWNrIGluayBmaWVsZHNcbiAgICAgICAgICAgICRzY29wZS4kd2F0Y2goJ2ZtRGF0YS5wcl9pbmtiYWNrJywgZnVuY3Rpb24gKG5ld1ZhbHVlLCBvbGRWYWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICgkc2NvcGUuZm1EYXRhLnByX2lua2JhY2sgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5iYWNrSW5rcyA9IG5ldyBBcnJheShuZXdWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb2xkVmFsdWU7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmZtRGF0YVsncHJfaW5rc2JhY2snXVtpXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkc2NvcGUuJG9uKCckdmlld0NvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgLy8gdGhpcyBjb2RlIGlzIGV4ZWN1dGVkIGFmdGVyIHRoZSB2aWV3IGlzIGxvYWRlZFxuICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgcHJvZHVjdE9mZnNldEdlbmVyYWxBZGRGYWMuZ2V0Q2xpZW50KCkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc09iamVjdChwcm9taXNlLmRhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuY2xpZW50ID0gcHJvbWlzZS5kYXRhO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBwcm9kdWN0T2Zmc2V0R2VuZXJhbEFkZEZhYy5nZXRJbmtzKCkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5wcl9pbmtvcHRpb25zID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2gocHJvbWlzZS5kYXRhLCBmdW5jdGlvbiAodmFsdWUsIGtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHVzaCh7IFwibGFiZWxcIjogdmFsdWUuaW5fY29kZSwgXCJ2YWx1ZVwiOiB2YWx1ZS5pbl9pZCB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sICRzY29wZS5wcl9pbmtvcHRpb25zKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vJHNjb3BlLnVwZGF0ZUZhaWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBwcm9kdWN0T2Zmc2V0R2VuZXJhbEFkZEZhYy5nZXRQYXBlcnMoKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnBhX2lkb3B0aW9ucyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHByb21pc2UuZGF0YSwgZnVuY3Rpb24gKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnB1c2goeyBcImxhYmVsXCI6IHZhbHVlLnBhX2NvZGUsIFwidmFsdWVcIjogdmFsdWUucGFfaWQgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAkc2NvcGUucGFfaWRvcHRpb25zKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vJHNjb3BlLnVwZGF0ZUZhaWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XTtcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckaHR0cCcsICckcScsICckYWxlcnRzJywgJyRzdGF0ZVBhcmFtcycsIGZ1bmN0aW9uICgkaHR0cCwgJHEsICRhbGVydHMsICRzdGF0ZVBhcmFtcykge1xuICAgICAgICB2YXIgZmFjdG9yeSA9IHt9O1xuICAgICAgICBmYWN0b3J5LmdldENsaWVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKFxuICAgICAgICAgICAgICAgICRodHRwLnBvc3QoJy9wcm9kdWN0L29mZnNldC9nZW5lcmFsL2NsaWVudCcsIHtcbiAgICAgICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgICAgICBjbF9pZDogJHN0YXRlUGFyYW1zLmNsX2lkXG4gICAgICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzdGFja0Vycm9yID0gSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiBkYXRhLnN0YXR1cyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yOiBkYXRhLmVycm9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JUeXBlOiBkYXRhLnR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25maWc6IGNvbmZpZ1xuICAgICAgICAgICAgICAgICAgICB9LCBudWxsLCA0KTtcbiAgICAgICAgICAgICAgICAgICAgJGFsZXJ0cy5lcnJvcignV29vb3BzISBhbiBlcnJvciBoYXMgb2N1cnJlZC4nLCBzdGFja0Vycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICBmYWN0b3J5LmdldElua3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KCcvcHJvZHVjdC9vZmZzZXQvZ2VuZXJhbC9pbmsnLCB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICAgICAgcHJvY2Nlc19pZDogbmV3IERhdGUoKS5nZXRNaWxsaXNlY29uZHMoKVxuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc3RhY2tFcnJvciA9IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogZGF0YS5zdGF0dXMsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjogZGF0YS5lcnJvcixcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yVHlwZTogZGF0YS50eXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnOiBjb25maWdcbiAgICAgICAgICAgICAgICAgICAgfSwgbnVsbCwgNCk7XG4gICAgICAgICAgICAgICAgICAgICRhbGVydHMuZXJyb3IoJ1dvb29wcyEgYW4gZXJyb3IgaGFzIG9jdXJyZWQuJywgc3RhY2tFcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeS5nZXRQYXBlcnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KCcvcHJvZHVjdC9vZmZzZXQvZ2VuZXJhbC9wYXBlcicsIHtcbiAgICAgICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgICAgICBwcm9jY2VzX2lkOiBuZXcgRGF0ZSgpLmdldE1pbGxpc2Vjb25kcygpXG4gICAgICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzdGFja0Vycm9yID0gSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiBkYXRhLnN0YXR1cyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yOiBkYXRhLmVycm9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JUeXBlOiBkYXRhLnR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25maWc6IGNvbmZpZ1xuICAgICAgICAgICAgICAgICAgICB9LCBudWxsLCA0KTtcbiAgICAgICAgICAgICAgICAgICAgJGFsZXJ0cy5lcnJvcignV29vb3BzISBhbiBlcnJvciBoYXMgb2N1cnJlZC4nLCBzdGFja0Vycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICBmYWN0b3J5LmFkZCA9IGZ1bmN0aW9uIChwcl9qc29uYikge1xuICAgICAgICAgICAgdmFyIHByb21pc2UgPSAkaHR0cC5wb3N0KCcvcHJvZHVjdC9hZGQnLCB7XG4gICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgIHByX2pzb25iOiBwcl9qc29uYlxuICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgIHZhciBzdGFja0Vycm9yID0gSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IGRhdGEuc3RhdHVzLFxuICAgICAgICAgICAgICAgICAgICBlcnJvcjogZGF0YS5lcnJvcixcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JUeXBlOiBkYXRhLnR5cGUsXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZzogY29uZmlnXG4gICAgICAgICAgICAgICAgfSwgbnVsbCwgNCk7XG4gICAgICAgICAgICAgICAgJGFsZXJ0cy5lcnJvcignV29vb3BzISBhbiBlcnJvciBoYXMgb2N1cnJlZC4nLCBzdGFja0Vycm9yKTtcbiAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGZhY3Rvcnk7XG4gICAgfV07XG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKGFuZ3VsYXIpe1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBcbiAgICByZXR1cm4gYW5ndWxhci5tb2R1bGUoJ2FwcC5wcm9kdWN0T2Zmc2V0R2VuZXJhbC51cGRhdGUnLFtdKVxuXG4gICAgLmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsXG4gICAgZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgncHJvZHVjdE9mZnNldEdlbmVyYWxVcGRhdGUnLCB7XG4gICAgICAgICAgICB1cmw6Jy9wcm9kdWN0L29mZnNldC9nZW5lcmFsL3VwZGF0ZS86Y2xfaWQvOnByX2lkJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsIDogJ21vZHVsZXMvcHJvZHVjdC9tb2R1bGVzL3Byb2R1Y3RPZmZzZXRHZW5lcmFsLnVwZGF0ZS9wcm9kdWN0T2Zmc2V0R2VuZXJhbC51cGRhdGUudmlldy5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXIgOiAncHJvZHVjdE9mZnNldEdlbmVyYWxVcGRhdGVDdHJsJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICByZXF1aXJlc0xvZ2luOiB0cnVlXG4gICAgICAgICAgICB9ICAgIFxuICAgICAgICB9KTtcbiAgICB9XSlcblxuICAgIC5mYWN0b3J5KCdwcm9kdWN0T2Zmc2V0R2VuZXJhbFVwZGF0ZUZhYycscmVxdWlyZSgnLi9wcm9kdWN0T2Zmc2V0R2VuZXJhbC51cGRhdGUuZmFjJykpXG5cbiAgICAuY29udHJvbGxlcigncHJvZHVjdE9mZnNldEdlbmVyYWxVcGRhdGVDdHJsJyxyZXF1aXJlKCcuL3Byb2R1Y3RPZmZzZXRHZW5lcmFsLnVwZGF0ZS5jdHJsJykpXG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnQgPSB7fSIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKGFuZ3VsYXIpe1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBcbiAgICByZXR1cm4gWyckc2NvcGUnLCAncHJvZHVjdE9mZnNldEdlbmVyYWxVcGRhdGVGYWMnLCAnJGxvY2F0aW9uJywgJ2kxOG5GaWx0ZXInLCAnJHN0YXRlUGFyYW1zJywgJyRpbnRlcnZhbCcsXG4gICAgZnVuY3Rpb24gKCRzY29wZSwgcHJvZHVjdE9mZnNldEdlbmVyYWxVcGRhdGVGYWMsICRsb2NhdGlvbiwgaTE4bkZpbHRlciwgJHN0YXRlUGFyYW1zLCAkaW50ZXJ2YWwpIHtcbiAgICAgICAgXG4gICAgICAgICRzY29wZS5vblN1Ym1pdCA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICBwcm9kdWN0T2Zmc2V0R2VuZXJhbFVwZGF0ZUZhYy51cGRhdGUoJHNjb3BlLmZtRGF0YSkudGhlbihmdW5jdGlvbihwcm9taXNlKXtcbiAgICAgICAgICAgICAgICBpZihwcm9taXNlLmRhdGEucm93Q291bnQgPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9wcm9kdWN0LycrJHN0YXRlUGFyYW1zLmNsX2lkKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIFxuICAgICAgICAkc2NvcGUuZ2V0U3RhdGVzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkc2NvcGUucHJfc3RhdGVvcHRpb25zID0gW107XG4gICAgICAgICAgICAkc2NvcGUucHJfY2l0eW9wdGlvbnMgPSBbXTtcbiAgICAgICAgICAgICRzY29wZS5wcl9jb3VudHlvcHRpb25zID0gW107XG4gICAgICAgICAgICAkaW50ZXJ2YWwoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBwcm9kdWN0T2Zmc2V0R2VuZXJhbFVwZGF0ZUZhYy5nZXRTdGF0ZXMoJHNjb3BlLmZtRGF0YS5wcl9jb3VudHJ5KS50aGVuKGZ1bmN0aW9uKHByb21pc2Upe1xuICAgICAgICAgICAgICAgICAgICBpZihhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhLmdlb25hbWVzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnByX3N0YXRlb3B0aW9ucyA9IHByb21pc2UuZGF0YS5nZW9uYW1lcztcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vJHNjb3BlLnVwZGF0ZUZhaWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LDAsMSk7XG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUuZ2V0Q2l0eUNvdW50eSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJHNjb3BlLnByX2NpdHlvcHRpb25zID0gW107XG4gICAgICAgICAgICAkc2NvcGUucHJfY291bnR5b3B0aW9ucyA9IFtdO1xuICAgICAgICAgICAgJGludGVydmFsKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgcHJvZHVjdE9mZnNldEdlbmVyYWxVcGRhdGVGYWMuZ2V0U3RhdGVzKCRzY29wZS5mbURhdGEucHJfc3RhdGUpLnRoZW4oZnVuY3Rpb24ocHJvbWlzZSl7XG4gICAgICAgICAgICAgICAgICAgIGlmKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEuZ2VvbmFtZXMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUucHJfY2l0eW9wdGlvbnMgPSBwcm9taXNlLmRhdGEuZ2VvbmFtZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUucHJfY291bnR5b3B0aW9ucyA9IHByb21pc2UuZGF0YS5nZW9uYW1lcztcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vJHNjb3BlLnVwZGF0ZUZhaWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LDAsMSk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgICRzY29wZS5wcl9zdGF0dXNvcHRpb25zID0gaTE4bkZpbHRlcihcInByb2R1Y3RPZmZzZXRHZW5lcmFsLmZpZWxkcy5wcl9zdGF0dXNvcHRpb25zXCIpO1xuICAgICAgICBcbiAgICAgICAgJHNjb3BlLiRvbignJHZpZXdDb250ZW50TG9hZGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLy8gdGhpcyBjb2RlIGlzIGV4ZWN1dGVkIGFmdGVyIHRoZSB2aWV3IGlzIGxvYWRlZFxuICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgcHJvZHVjdE9mZnNldEdlbmVyYWxVcGRhdGVGYWMuZGF0YSgpLnRoZW4oZnVuY3Rpb24ocHJvbWlzZSl7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBpZihhbmd1bGFyLmlzT2JqZWN0KGFuZ3VsYXIuZnJvbUpzb24ocHJvbWlzZS5kYXRhKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5mbURhdGEgPSBhbmd1bGFyLmZyb21Kc29uKHByb21pc2UuZGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHByb2R1Y3RPZmZzZXRHZW5lcmFsVXBkYXRlRmFjLmdldENvdW50cmllcygpLnRoZW4oZnVuY3Rpb24ocHJvbWlzZSl7XG4gICAgICAgICAgICAgICAgICAgIGlmKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEuZ2VvbmFtZXMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUucHJfY291bnRyeW9wdGlvbnMgPSBwcm9taXNlLmRhdGEuZ2VvbmFtZXM7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyRzY29wZS51cGRhdGVGYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgcHJvZHVjdE9mZnNldEdlbmVyYWxVcGRhdGVGYWMuZ2V0U3RhdGVzKCRzY29wZS5mbURhdGEucHJfY291bnRyeSkudGhlbihmdW5jdGlvbihwcm9taXNlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEuZ2VvbmFtZXMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnByX3N0YXRlb3B0aW9ucyA9IHByb21pc2UuZGF0YS5nZW9uYW1lcztcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8kc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICBwcm9kdWN0T2Zmc2V0R2VuZXJhbFVwZGF0ZUZhYy5nZXRDaXR5Q291bnR5KCRzY29wZS5mbURhdGEucHJfc3RhdGUpLnRoZW4oZnVuY3Rpb24ocHJvbWlzZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZihhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhLmdlb25hbWVzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5wcl9jaXR5b3B0aW9ucyA9IHByb21pc2UuZGF0YS5nZW9uYW1lcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUucHJfY291bnR5b3B0aW9ucyA9IHByb21pc2UuZGF0YS5nZW9uYW1lcztcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8kc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgfSk7XG4gICAgfV07XG4gICAgXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRodHRwJywgJyRxJywgJyRhbGVydHMnLCAnJHN0YXRlUGFyYW1zJywgZnVuY3Rpb24gKCRodHRwLCAkcSwgJGFsZXJ0cywgJHN0YXRlUGFyYW1zKSB7XG4gICAgICAgIHZhciBmYWN0b3J5ID0ge307XG4gICAgICAgIGZhY3RvcnkuZGF0YSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKFxuICAgICAgICAgICAgICAgICRodHRwLnBvc3QoJy9wcm9kdWN0L29mZnNldC9nZW5lcmFsL3Byb2R1Y3QnLCB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICAgICAgcHJfaWQ6ICRzdGF0ZVBhcmFtcy5wcl9pZFxuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc3RhY2tFcnJvciA9IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogZGF0YS5zdGF0dXMsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjogZGF0YS5lcnJvcixcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yVHlwZTogZGF0YS50eXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnOiBjb25maWdcbiAgICAgICAgICAgICAgICAgICAgfSwgbnVsbCwgNCk7XG4gICAgICAgICAgICAgICAgICAgICRhbGVydHMuZXJyb3IoJ1dvb29wcyEgYW4gZXJyb3IgaGFzIG9jdXJyZWQuJywgc3RhY2tFcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeS51cGRhdGUgPSBmdW5jdGlvbiAocHJfanNvbmIpIHtcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKFxuICAgICAgICAgICAgICAgICRodHRwLnBvc3QoJy9wcm9kdWN0L3VwZGF0ZScsIHtcbiAgICAgICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgICAgICBwcl9pZDogJHN0YXRlUGFyYW1zLnByX2lkLFxuICAgICAgICAgICAgICAgICAgICBwcl9qc29uYjogcHJfanNvbmJcbiAgICAgICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0YWNrRXJyb3IgPSBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IGRhdGEuc3RhdHVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGRhdGEuZXJyb3IsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvclR5cGU6IGRhdGEudHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZzogY29uZmlnXG4gICAgICAgICAgICAgICAgICAgIH0sIG51bGwsIDQpO1xuICAgICAgICAgICAgICAgICAgICAkYWxlcnRzLmVycm9yKCdXb29vcHMhIGFuIGVycm9yIGhhcyBvY3VycmVkLicsIHN0YWNrRXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkuZ2V0Q291bnRyaWVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHByb21pc2UgPSAkaHR0cC5qc29ucCgnaHR0cDovL2FwaS5nZW9uYW1lcy5vcmcvY291bnRyeUluZm9KU09OP3VzZXJuYW1lPWFsZWphbmRyb2xzY2EmY2FsbGJhY2s9SlNPTl9DQUxMQkFDSycpXG4gICAgICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc3RhY2tFcnJvciA9IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogZGF0YS5zdGF0dXMsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjogZGF0YS5lcnJvcixcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yVHlwZTogZGF0YS50eXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnOiBjb25maWdcbiAgICAgICAgICAgICAgICAgICAgfSwgbnVsbCwgNCk7XG4gICAgICAgICAgICAgICAgICAgICRhbGVydHMuZXJyb3IoJ1dvb29wcyEgYW4gZXJyb3IgaGFzIG9jdXJyZWQuJywgc3RhY2tFcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeS5nZXRTdGF0ZXMgPSBmdW5jdGlvbiAocHJfY291bnRyeSkge1xuICAgICAgICAgICAgdmFyIHByb21pc2UgPSAkaHR0cC5qc29ucCgnaHR0cDovL2FwaS5nZW9uYW1lcy5vcmcvY2hpbGRyZW5KU09OP2dlb25hbWVJZD0nICsgcHJfY291bnRyeSArICcmdXNlcm5hbWU9YWxlamFuZHJvbHNjYSZjYWxsYmFjaz1KU09OX0NBTExCQUNLJylcbiAgICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzdGFja0Vycm9yID0gSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiBkYXRhLnN0YXR1cyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yOiBkYXRhLmVycm9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JUeXBlOiBkYXRhLnR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25maWc6IGNvbmZpZ1xuICAgICAgICAgICAgICAgICAgICB9LCBudWxsLCA0KTtcbiAgICAgICAgICAgICAgICAgICAgJGFsZXJ0cy5lcnJvcignV29vb3BzISBhbiBlcnJvciBoYXMgb2N1cnJlZC4nLCBzdGFja0Vycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICBmYWN0b3J5LmdldENpdHlDb3VudHkgPSBmdW5jdGlvbiAocHJfc3RhdGUpIHtcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gJGh0dHAuanNvbnAoJ2h0dHA6Ly9hcGkuZ2VvbmFtZXMub3JnL2NoaWxkcmVuSlNPTj9nZW9uYW1lSWQ9JyArIHByX3N0YXRlICsgJyZ1c2VybmFtZT1hbGVqYW5kcm9sc2NhJmNhbGxiYWNrPUpTT05fQ0FMTEJBQ0snKVxuICAgICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0YWNrRXJyb3IgPSBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IGRhdGEuc3RhdHVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGRhdGEuZXJyb3IsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvclR5cGU6IGRhdGEudHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZzogY29uZmlnXG4gICAgICAgICAgICAgICAgICAgIH0sIG51bGwsIDQpO1xuICAgICAgICAgICAgICAgICAgICAkYWxlcnRzLmVycm9yKCdXb29vcHMhIGFuIGVycm9yIGhhcyBvY3VycmVkLicsIHN0YWNrRXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBmYWN0b3J5O1xuICAgIH1dO1xuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbihhbmd1bGFyKXtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgXG4gICAgcmV0dXJuIGFuZ3VsYXIubW9kdWxlKCdhcHAucHJvZHVjdE9mZnNldFBhZ2luYXRlZC5hZGQnLFtdKVxuXG4gICAgLmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsXG4gICAgZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgncHJvZHVjdE9mZnNldFBhZ2luYXRlZEFkZCcsIHtcbiAgICAgICAgICAgIHVybDonL3Byb2R1Y3QvYWRkL29mZnNldC9wYWdpbmF0ZWQvOmNsX2lkJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsIDogJ21vZHVsZXMvcHJvZHVjdC9tb2R1bGVzL3Byb2R1Y3RPZmZzZXRQYWdpbmF0ZWQuYWRkL3Byb2R1Y3RPZmZzZXRQYWdpbmF0ZWQuYWRkLnZpZXcuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyIDogJ3Byb2R1Y3RPZmZzZXRQYWdpbmF0ZWRBZGRDdHJsJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICByZXF1aXJlc0xvZ2luOiB0cnVlXG4gICAgICAgICAgICB9ICAgIFxuICAgICAgICB9KTtcbiAgICB9XSlcblxuICAgIC5mYWN0b3J5KCdwcm9kdWN0T2Zmc2V0UGFnaW5hdGVkQWRkRmFjJyxyZXF1aXJlKCcuL3Byb2R1Y3RPZmZzZXRQYWdpbmF0ZWQuYWRkLmZhYycpKVxuXG4gICAgLmNvbnRyb2xsZXIoJ3Byb2R1Y3RPZmZzZXRQYWdpbmF0ZWRBZGRDdHJsJyxyZXF1aXJlKCcuL3Byb2R1Y3RPZmZzZXRQYWdpbmF0ZWQuYWRkLmN0cmwnKSlcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIiA6IFwiQWdyZWdhciBQcm9kdWN0b1wiLFxuICAgICAgICAgICAgICAgICAgICBcImxhYmVsc1wiOntcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItaWRcIjogXCJJRCBwcm9kdWN0b1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbC1pZFwiOiBcIklEIGNsaWVudGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItcHJvY2Vzc1wiOiBcIlByb2Nlc29cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItdHlwZVwiOiBcIlRpcG9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItcGFydG5vXCI6IFwiTm8uIHBhcnRlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLWNvZGVcIjogXCJDb2RpZ29cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItbmFtZVwiOiBcIk5vbWJyZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1kZXNjcmlwdGlvblwiOiBcIkRlc2NyaXBjaW9uXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLWZpbmFsc2l6ZXdpZHRoXCI6IFwiQW5jaG9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItZmluYWxzaXplaGVpZ2h0XCI6IFwiQWx0b1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1maW5hbHNpemVtZWFzdXJlXCI6IFwiTWVkaWRhXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLWlua2Zyb250XCI6IFwiRnJlbnRlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLWlua2JhY2tcIjogXCJSZXZlcnNvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInBhLWlkXCI6IFwiSUQgcGFwZWxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItcGFwZXJzaXpld2lkdGhcIjogXCJBbmNob1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1wYXBlcnNpemVoZWlnaHRcIjogXCJBbHRvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLXBhcGVyc2l6ZW1lYXN1cmVcIjogXCJNZWRpZGFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItcGFwZXJmb3JtYXRzcXR5XCI6IFwiRm9ybWF0b3NcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItdmFybmlzaFwiOiBcIkJhcm5pelwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci12YXJuaXNoZmluaXNoZWRcIjogXCJBY2FiYWRvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLWxhbWluYXRlXCI6IFwiTGFtaW5hZG9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItbGFtaW5hdGVmaW5pc2hlZFwiOiBcIkFjYWJhZG9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItbGFtaW5hdGVjYWxpYmVyXCI6IFwiQ2FsaWJyZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1sYW1pbmF0ZXNpZGVzXCI6IFwiQ2FyYXNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItZm9saW9cIjogXCJGb2xpb1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1wcmVjdXRcIjogXCJQcmVjb3J0ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1mb2xkXCI6IFwiRG9ibGV6XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLWRpZWN1dHRpbmdcIjogXCJTdWFqZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1kaWVjdXR0aW5ncXR5XCI6IFwiTm8uIFN1YWplc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1yZWluZm9yY2VtZW50XCI6IFwiUmVmdWVyem9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItY29yZFwiOiBcIkNvcmTDs25cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItd2lyZVwiOiBcIkFsw6FtYnJlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLXN0YXBsaW5nXCI6IFwiR3JhcGFkb1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1ib3VuZFwiOlwiRW5jdWFkZXJuYWRvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLXNwaXJhbGJpbmRcIjogXCJFbmdhcmdvbGFkb1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1ibG9ja3NcIjogXCJCbG9ja3NcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItaW50cGFnZXNcIjpcIk5vLiBkZSBQYWdpbmFzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLXN0YXR1c1wiOiBcIkVzdGF0dXNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItZGF0ZVwiOiBcIkZlY2hhXCIsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIFwiY29sdW1uc1wiOltcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfaWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xfaWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfcHJvY2Vzc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl90eXBlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX3BhcnRub1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9jb2RlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX25hbWVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfZGVzY3JpcHRpb25cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfZmluYWxzaXpld2lkdGhcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfZmluYWxzaXplaGVpZ2h0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX2ZpbmFsc2l6ZW1lYXN1cmVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfaW5rZnJvbnRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfaW5rYmFja1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwYV9pZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9wYXBlcnNpemV3aWR0aFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9wYXBlcnNpemVoZWlnaHRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfcGFwZXJzaXplbWVhc3VyZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9wYXBlcmZvcm1hdHNxdHlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfdmFybmlzaFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl92YXJuaXNoZmluaXNoZWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfbGFtaW5hdGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfbGFtaW5hdGVmaW5pc2hlZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9sYW1pbmF0ZWNhbGliZXJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfbGFtaW5hdGVzaWRlc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9mb2xpb1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9wcmVjdXRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfZm9sZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9kaWVjdXR0aW5nXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX2RpZWN1dHRpbmdxdHlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfcmVpbmZvcmNlbWVudFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9jb3JkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX3dpcmVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfYmxvY2tzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX3N0YXBsaW5nXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX2JvdW5kXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX3NwaXJhbGJpbmRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfaW50cGFnZXNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfc3RhdHVzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX2RhdGVcIixcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgIFwiZmllbGRzXCIgOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcl9maW5hbHNpemVtZWFzdXJlb3B0aW9ucyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiY21cIixcInZhbHVlXCI6XCJjbVwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwicHVsZ2FkYXNcIixcInZhbHVlXCI6XCJpblwifVxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHByX2lua2Zyb250b3B0aW9ucyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiMSB0aW50YVwiLFwidmFsdWVcIjoxfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiMiB0aW50YXNcIixcInZhbHVlXCI6Mn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIjMgdGludGFzXCIsXCJ2YWx1ZVwiOjN9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCI0IHRpbnRhc1wiLFwidmFsdWVcIjo0fSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiNSB0aW50YXNcIixcInZhbHVlXCI6NX0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIjYgdGludGFzXCIsXCJ2YWx1ZVwiOjZ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCI3IHRpbnRhc1wiLFwidmFsdWVcIjo3fSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiOCB0aW50YXNcIixcInZhbHVlXCI6OH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJfaW5rYmFja29wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIjEgdGludGFcIixcInZhbHVlXCI6MX0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIjIgdGludGFzXCIsXCJ2YWx1ZVwiOjJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCIzIHRpbnRhc1wiLFwidmFsdWVcIjozfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiNCB0aW50YXNcIixcInZhbHVlXCI6NH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIjUgdGludGFzXCIsXCJ2YWx1ZVwiOjV9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCI2IHRpbnRhc1wiLFwidmFsdWVcIjo2fSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiNyB0aW50YXNcIixcInZhbHVlXCI6N30sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIjggdGludGFzXCIsXCJ2YWx1ZVwiOjh9LFxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHByX3Zhcm5pc2hvcHRpb25zIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJOb1wiLFwidmFsdWVcIjpcIm5vXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJVbmEgY2FyYVwiLFwidmFsdWVcIjpcIm9uZXNpZGVcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkRvcyBjYXJhc1wiLFwidmFsdWVcIjpcInR3b3NpZGVzXCJ9XG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJfdmFybmlzZmluaXNoZWRvcHRpb25zIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJNYXRlXCIsXCJ2YWx1ZVwiOlwibWF0dGVcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkJyaWxsYW50ZVwiLFwidmFsdWVcIjpcImJyaWdodFwifVxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHByX2xhbWluYXRlb3B0aW9ucyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiTm9cIixcInZhbHVlXCI6XCJub1wifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiVW5hIGNhcmFcIixcInZhbHVlXCI6XCJvbmVzaWRlXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJEb3MgY2FyYXNcIixcInZhbHVlXCI6XCJ0d29zaWRlc1wifSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBwcl9sYW1pbmF0ZWZpbmlzaGVkb3B0aW9ucyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiTWF0ZVwiLFwidmFsdWVcIjpcIm1hdHRlXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJCcmlsbGFudGVcIixcInZhbHVlXCI6XCJicmlnaHRcIn1cbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBwcl9sYW1pbmF0ZWNhbGliZXJvcHRpb25zIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCIuMm1tXCIsXCJ2YWx1ZVwiOlwiMm1tXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCIuNG1tXCIsXCJ2YWx1ZVwiOlwiNG1tXCJ9XG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJfbGFtaW5hdGVzaWRlc29wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIlVuYSBjYXJhXCIsXCJ2YWx1ZVwiOlwib25lc2lkZVwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiRG9zIGNhcmFzXCIsXCJ2YWx1ZVwiOlwidHdvc2lkZXNcIn1cbiAgICAgICAgICAgICAgICAgICAgICAgIF0scHJfZm9saW9vcHRpb25zIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJTaVwiLFwidmFsdWVcIjpcInllc1wifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiTm9cIixcInZhbHVlXCI6XCJub1wifVxuICAgICAgICAgICAgICAgICAgICAgICAgXSxwcl9wcmVjdXRvcHRpb25zIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJOb1wiLFwidmFsdWVcIjpcIm5vXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJIb3Jpem9udGFsXCIsXCJ2YWx1ZVwiOlwiaG9yaXpvbnRhbFwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiVmVydGljYWxcIixcInZhbHVlXCI6XCJ2ZXJ0aWNhbFwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF0scHJfZm9sZG9wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIlRyaXB0aWNvXCIsXCJ2YWx1ZVwiOlwidHJ5cHRpY1wifSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF0scHJfZGllY3V0dGluZ29wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIlNpXCIsXCJ2YWx1ZVwiOlwieWVzXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJOb1wiLFwidmFsdWVcIjpcIm5vXCJ9XG4gICAgICAgICAgICAgICAgICAgICAgICBdLHByX3JlaW5mb3JjZW1lbnRvcHRpb25zIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJOb1wiLFwidmFsdWVcIjpcIm5vXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJVbm9cIixcInZhbHVlXCI6XCJvbmVcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkRvc1wiLFwidmFsdWVcIjpcInR3b1wifSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF0scHJfY29yZG9wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIk5vXCIsXCJ2YWx1ZVwiOlwibm9cIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkNvbG9jYWRvXCIsXCJ2YWx1ZVwiOlwiYWxsb2NhdGVkXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJTZXBhcmFkb1wiLFwidmFsdWVcIjpcInNlcGFyYXRlZFwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF0scHJfd2lyZW9wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIk5vXCIsXCJ2YWx1ZVwiOlwibm9cIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkNvbG9jYWRvXCIsXCJ2YWx1ZVwiOlwiYWxsb2NhdGVkXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJTZXBhcmFkb1wiLFwidmFsdWVcIjpcInNlcGFyYXRlZFwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF0scHJfc3RhcGxpbmdvcHRpb25zIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJOb1wiLFwidmFsdWVcIjpcIm5vXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJVbmEgZ3JhcGFcIixcInZhbHVlXCI6XCIxXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJEb3MgZ3JhcGFzXCIsXCJ2YWx1ZVwiOlwiMlwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF0scHJfYm91bmRvcHRpb25zIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJOb1wiLFwidmFsdWVcIjpcIm5vXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJTaVwiLFwidmFsdWVcIjpcInllc1wifSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF0scHJfc3BpcmFsYmluZG9wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIlBsYXN0aWNvXCIsXCJ2YWx1ZVwiOlwicGxhc3RpY1wifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiTWV0YWxcIixcInZhbHVlXCI6XCJtZXRhbFwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF0scHJfYmxvY2tzb3B0aW9ucyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiTm9cIixcInZhbHVlXCI6XCJub1wifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiMjBcIixcInZhbHVlXCI6XCIyMFwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiMjVcIixcInZhbHVlXCI6XCIyNVwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiNTBcIixcInZhbHVlXCI6XCI1MFwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiNzVcIixcInZhbHVlXCI6XCI3NVwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiMTAwXCIsXCJ2YWx1ZVwiOlwiMTAwXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHByX3N0YXR1c29wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkFjdGl2b1wiLFwidmFsdWVcIjpcIkFcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkluYWN0aXZvXCIsXCJ2YWx1ZVwiOlwiSVwifVxuICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0iLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbihhbmd1bGFyKXtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgXG4gICAgcmV0dXJuIFsnJHNjb3BlJywgJ3Byb2R1Y3RPZmZzZXRQYWdpbmF0ZWRBZGRGYWMnLCAnJGxvY2F0aW9uJywgJ2kxOG5GaWx0ZXInLCAnJHN0YXRlUGFyYW1zJyxcbiAgICBmdW5jdGlvbiAoJHNjb3BlLCBwcm9kdWN0T2Zmc2V0UGFnaW5hdGVkQWRkRmFjLCAkbG9jYXRpb24sIGkxOG5GaWx0ZXIsICRzdGF0ZVBhcmFtcykge1xuICAgICAgICAkc2NvcGUuZm1EYXRhID0ge307XG4gICAgICAgICRzY29wZS5mbURhdGEgPSB7IFwicHJfcHJvY2Vzc1wiOiBcIm9mZnNldFwiLCBcInByX3R5cGVcIjogXCJwYWdpbmF0ZWRcIiwgXCJjbF9pZFwiOiBcIjZcIiwgXCJwcl9wYXJ0bm9cIjogXCJURVNULUFTQS5hc2FzOiAyMywzNFwiLCBcInByX2Rlc2NyaXB0aW9uXCI6IFwiZXN0ZSBlcyB1biBwcm9kdWN0byBkZSBwcnVlYmFcIiwgXCJwcl9maW5hbHNpemV3aWR0aFwiOiBcIjEwMC4wMFwiLCBcInByX2ZpbmFsc2l6ZWhlaWdodFwiOiBcIjIwMC4wMFwiLCBcInByX2ZpbmFsc2l6ZW1lYXN1cmVcIjogXCJjbVwiLCBcInByX2lua2Zyb250XCI6IDIsIFwicHJfaW5rc2Zyb250XCI6IHsgXCIwXCI6IFwiMlwiLCBcIjFcIjogXCIzXCIgfSwgXCJwcl9pbmtiYWNrXCI6IDIsIFwicHJfaW5rc2JhY2tcIjogeyBcIjBcIjogXCIyXCIsIFwiMVwiOiBcIjJcIiB9LCBcInBhX2lkXCI6IFwiMVwiLCBcInByX3BhcGVyZm9ybWF0c3F0eVwiOiBcIjEyM1wiLCBcInByX3BhcGVyc2l6ZXdpZHRoXCI6IFwiMTAwLjAwXCIsIFwicHJfcGFwZXJzaXplaGVpZ2h0XCI6IFwiMjAwLjAwXCIsIFwicHJfcGFwZXJzaXplbWVhc3VyZVwiOiBcImNtXCIsIFwicHJfdmFybmlzaFwiOiBcIm9uZXNpZGVcIiwgXCJwcl92YXJuaXNoZmluaXNoZWRcIjogXCJtYXR0ZVwiLCBcInByX2xhbWluYXRlXCI6IFwidHdvc2lkZXNcIiwgXCJwcl9sYW1pbmF0ZWZpbmlzaGVkXCI6IFwibWF0dGVcIiwgXCJwcl9sYW1pbmF0ZWNhbGliZXJcIjogXCIybW1cIiwgXCJwcl9wcmVjdXRcIjogXCJob3Jpem9udGFsXCIsIFwicHJfZm9sZFwiOiBcInRyeXB0aWNcIiwgXCJwcl9kaWVjdXR0aW5nXCI6IFwieWVzXCIsIFwicHJfZGllY3V0dGluZ3F0eVwiOiBcIjVcIiwgXCJwcl9yZWluZm9yY2VtZW50XCI6IFwib25lXCIsIFwicHJfY29yZFwiOiBcImFsbG9jYXRlZFwiLCBcInByX3dpcmVcIjogXCJhbGxvY2F0ZWRcIiwgXCJwcl9mb2xpb1wiOiBcInllc1wiLCBcInByX2Jsb2Nrc1wiOiBcIjEwMFwiLCBcInByX3N0YXR1c1wiOiBcIkFcIiwgXCJwcl9pbnRpbmtmcm9udFwiOiAyLCBcInByX2ludGlua3Nmcm9udFwiOiB7IFwiMFwiOiBcIjJcIiwgXCIxXCI6IFwiM1wiIH0sIFwicHJfaW50aW5rYmFja1wiOiAyLCBcInByX2ludGlua3NiYWNrXCI6IHsgXCIwXCI6IFwiMlwiLCBcIjFcIjogXCIzXCIgfSwgXCJwcl9pbnRwYWdlc1wiOiBcIjEwMFwiLCBcInBhX2ludGlkXCI6IFwiMVwiLCBcInByX2ludHBhcGVyZm9ybWF0c3F0eVwiOiBcIjUwMFwiLCBcInByX3N0YXBsaW5nXCI6IFwiMlwiLCBcInByX2JvdW5kXCI6IFwieWVzXCIsIFwicHJfc3BpcmFsYmluZFwiOiBcInBsYXN0aWNcIiwgXCJwcl9uYW1lXCI6IFwiYXNkYXNkYXNcIiwgXCJwcl9jb2RlXCI6IFwiYXNkYXNkXCIgfTtcbiAgICAgICAgXG4gICAgICAgICRzY29wZS5mbURhdGEucHJfcHJvY2VzcyA9ICdvZmZzZXQnO1xuICAgICAgICAkc2NvcGUuZm1EYXRhLnByX3R5cGUgPSAncGFnaW5hdGVkJztcbiAgICAgICAgJHNjb3BlLmZtRGF0YS5jbF9pZCA9ICRzdGF0ZVBhcmFtcy5jbF9pZDtcblxuICAgICAgICAkc2NvcGUub25TdWJtaXQgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgcHJvZHVjdE9mZnNldFBhZ2luYXRlZEFkZEZhYy5hZGQoJHNjb3BlLmZtRGF0YSkudGhlbihmdW5jdGlvbihwcm9taXNlKXtcbiAgICAgICAgICAgICAgICBpZihwcm9taXNlLmRhdGEucm93Q291bnQgPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3Byb2R1Y3QvJyskc3RhdGVQYXJhbXMuY2xfaWQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS51cGRhdGVGYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICAgICRzY29wZS5wcl9maW5hbHNpemVtZWFzdXJlb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJwcm9kdWN0T2Zmc2V0UGFnaW5hdGVkLWFkZC5maWVsZHMucHJfZmluYWxzaXplbWVhc3VyZW9wdGlvbnNcIik7XG4gICAgICAgICRzY29wZS5wcl9pbmtmcm9udG9wdGlvbnMgPSBpMThuRmlsdGVyKFwicHJvZHVjdE9mZnNldFBhZ2luYXRlZC1hZGQuZmllbGRzLnByX2lua2Zyb250b3B0aW9uc1wiKTtcbiAgICAgICAgJHNjb3BlLnByX2lua2JhY2tvcHRpb25zID0gaTE4bkZpbHRlcihcInByb2R1Y3RPZmZzZXRQYWdpbmF0ZWQtYWRkLmZpZWxkcy5wcl9pbmtiYWNrb3B0aW9uc1wiKTtcbiAgICAgICAgJHNjb3BlLnByX3Zhcm5pc2hvcHRpb25zID0gaTE4bkZpbHRlcihcInByb2R1Y3RPZmZzZXRQYWdpbmF0ZWQtYWRkLmZpZWxkcy5wcl92YXJuaXNob3B0aW9uc1wiKTtcbiAgICAgICAgJHNjb3BlLnByX3Zhcm5pc2ZpbmlzaGVkb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJwcm9kdWN0T2Zmc2V0UGFnaW5hdGVkLWFkZC5maWVsZHMucHJfdmFybmlzZmluaXNoZWRvcHRpb25zXCIpO1xuICAgICAgICAkc2NvcGUucHJfbGFtaW5hdGVvcHRpb25zID0gaTE4bkZpbHRlcihcInByb2R1Y3RPZmZzZXRQYWdpbmF0ZWQtYWRkLmZpZWxkcy5wcl9sYW1pbmF0ZW9wdGlvbnNcIik7XG4gICAgICAgICRzY29wZS5wcl9sYW1pbmF0ZWZpbmlzaGVkb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJwcm9kdWN0T2Zmc2V0UGFnaW5hdGVkLWFkZC5maWVsZHMucHJfbGFtaW5hdGVmaW5pc2hlZG9wdGlvbnNcIik7XG4gICAgICAgICRzY29wZS5wcl9sYW1pbmF0ZWNhbGliZXJvcHRpb25zID0gaTE4bkZpbHRlcihcInByb2R1Y3RPZmZzZXRQYWdpbmF0ZWQtYWRkLmZpZWxkcy5wcl9sYW1pbmF0ZWNhbGliZXJvcHRpb25zXCIpO1xuICAgICAgICAkc2NvcGUucHJfbGFtaW5hdGVzaWRlc29wdGlvbnMgPSBpMThuRmlsdGVyKFwicHJvZHVjdE9mZnNldFBhZ2luYXRlZC1hZGQuZmllbGRzLnByX2xhbWluYXRlc2lkZXNvcHRpb25zXCIpO1xuICAgICAgICAkc2NvcGUucHJfZm9saW9vcHRpb25zID0gaTE4bkZpbHRlcihcInByb2R1Y3RPZmZzZXRQYWdpbmF0ZWQtYWRkLmZpZWxkcy5wcl9mb2xpb29wdGlvbnNcIik7XG4gICAgICAgICRzY29wZS5wcl9wcmVjdXRvcHRpb25zID0gaTE4bkZpbHRlcihcInByb2R1Y3RPZmZzZXRQYWdpbmF0ZWQtYWRkLmZpZWxkcy5wcl9wcmVjdXRvcHRpb25zXCIpO1xuICAgICAgICAkc2NvcGUucHJfZm9sZG9wdGlvbnMgPSBpMThuRmlsdGVyKFwicHJvZHVjdE9mZnNldFBhZ2luYXRlZC1hZGQuZmllbGRzLnByX2ZvbGRvcHRpb25zXCIpO1xuICAgICAgICAkc2NvcGUucHJfZGllY3V0dGluZ29wdGlvbnMgPSBpMThuRmlsdGVyKFwicHJvZHVjdE9mZnNldFBhZ2luYXRlZC1hZGQuZmllbGRzLnByX2RpZWN1dHRpbmdvcHRpb25zXCIpO1xuICAgICAgICAkc2NvcGUucHJfcmVpbmZvcmNlbWVudG9wdGlvbnMgPSBpMThuRmlsdGVyKFwicHJvZHVjdE9mZnNldFBhZ2luYXRlZC1hZGQuZmllbGRzLnByX3JlaW5mb3JjZW1lbnRvcHRpb25zXCIpO1xuICAgICAgICAkc2NvcGUucHJfY29yZG9wdGlvbnMgPSBpMThuRmlsdGVyKFwicHJvZHVjdE9mZnNldFBhZ2luYXRlZC1hZGQuZmllbGRzLnByX2NvcmRvcHRpb25zXCIpO1xuICAgICAgICAkc2NvcGUucHJfd2lyZW9wdGlvbnMgPSBpMThuRmlsdGVyKFwicHJvZHVjdE9mZnNldFBhZ2luYXRlZC1hZGQuZmllbGRzLnByX3dpcmVvcHRpb25zXCIpO1xuICAgICAgICAkc2NvcGUucHJfc3RhcGxpbmdvcHRpb25zID0gaTE4bkZpbHRlcihcInByb2R1Y3RPZmZzZXRQYWdpbmF0ZWQtYWRkLmZpZWxkcy5wcl9zdGFwbGluZ29wdGlvbnNcIik7XG4gICAgICAgICRzY29wZS5wcl9ib3VuZG9wdGlvbnMgPSBpMThuRmlsdGVyKFwicHJvZHVjdE9mZnNldFBhZ2luYXRlZC1hZGQuZmllbGRzLnByX2JvdW5kb3B0aW9uc1wiKTtcbiAgICAgICAgJHNjb3BlLnByX3NwaXJhbGJpbmRvcHRpb25zID0gaTE4bkZpbHRlcihcInByb2R1Y3RPZmZzZXRQYWdpbmF0ZWQtYWRkLmZpZWxkcy5wcl9zcGlyYWxiaW5kb3B0aW9uc1wiKTtcbiAgICAgICAgJHNjb3BlLnByX2Jsb2Nrc29wdGlvbnMgPSBpMThuRmlsdGVyKFwicHJvZHVjdE9mZnNldFBhZ2luYXRlZC1hZGQuZmllbGRzLnByX2Jsb2Nrc29wdGlvbnNcIik7XG4gICAgICAgICRzY29wZS5wcl9zdGF0dXNvcHRpb25zID0gaTE4bkZpbHRlcihcInByb2R1Y3RPZmZzZXRQYWdpbmF0ZWQtYWRkLmZpZWxkcy5wcl9zdGF0dXNvcHRpb25zXCIpO1xuICAgICAgICBcbiAgICAgICAgLy8gY3JlYXRlIGZyb250IGluayBmaWVsZHNcbiAgICAgICAgJHNjb3BlLiR3YXRjaCgnZm1EYXRhLnByX2lua2Zyb250JywgZnVuY3Rpb24obmV3VmFsdWUsIG9sZFZhbHVlKSB7XG4gICAgICAgICAgICBpZigkc2NvcGUuZm1EYXRhLnByX2lua2Zyb250ICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICRzY29wZS5mcm9udElua3MgPSBuZXcgQXJyYXkobmV3VmFsdWUpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaTxuZXdWYWx1ZTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKG9sZFZhbHVlICE9IG5ld1ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZm1EYXRhWydwcl9pbmtzZnJvbnQnXVtpXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICAvLyBjcmVhdGUgYmFjayBpbmsgZmllbGRzXG4gICAgICAgICRzY29wZS4kd2F0Y2goJ2ZtRGF0YS5wcl9pbmtiYWNrJywgZnVuY3Rpb24obmV3VmFsdWUsIG9sZFZhbHVlKSB7XG4gICAgICAgICAgICBpZigkc2NvcGUuZm1EYXRhLnByX2lua2JhY2sgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmJhY2tJbmtzID0gbmV3IEFycmF5KG5ld1ZhbHVlKTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpPTA7IGk8b2xkVmFsdWU7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZihvbGRWYWx1ZSAhPSBuZXdWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmZtRGF0YVsncHJfaW5rc2JhY2snXVtpXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICAvLyBjcmVhdGUgZnJvbnQgaW50ZXJpb3IgaW5rIGZpZWxkc1xuICAgICAgICAkc2NvcGUuJHdhdGNoKCdmbURhdGEucHJfaW50aW5rZnJvbnQnLCBmdW5jdGlvbihuZXdWYWx1ZSwgb2xkVmFsdWUpIHtcbiAgICAgICAgICAgIGlmKCRzY29wZS5mbURhdGEucHJfaW50aW5rZnJvbnQgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmludEZyb250SW5rcyA9IG5ldyBBcnJheShuZXdWYWx1ZSk7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpPG5ld1ZhbHVlOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYob2xkVmFsdWUgIT0gbmV3VmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5mbURhdGFbJ3ByX2ludGlua3Nmcm9udCddW2ldID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIC8vIGNyZWF0ZSBiYWNrIGludGVyaW9yIGluayBmaWVsZHNcbiAgICAgICAgJHNjb3BlLiR3YXRjaCgnZm1EYXRhLnByX2ludGlua2JhY2snLCBmdW5jdGlvbihuZXdWYWx1ZSwgb2xkVmFsdWUpIHtcbiAgICAgICAgICAgIGlmKCRzY29wZS5mbURhdGEucHJfaW50aW5rYmFjayAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUuaW50QmFja0lua3MgPSBuZXcgQXJyYXkobmV3VmFsdWUpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaTxvbGRWYWx1ZTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKG9sZFZhbHVlICE9IG5ld1ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZm1EYXRhWydwcl9pbnRpbmtzYmFjayddW2ldID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAkc2NvcGUuJG9uKCckdmlld0NvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyB0aGlzIGNvZGUgaXMgZXhlY3V0ZWQgYWZ0ZXIgdGhlIHZpZXcgaXMgbG9hZGVkXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHByb2R1Y3RPZmZzZXRQYWdpbmF0ZWRBZGRGYWMuZ2V0Q2xpZW50KCkudGhlbihmdW5jdGlvbihwcm9taXNlKXtcbiAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGlmKGFuZ3VsYXIuaXNPYmplY3QocHJvbWlzZS5kYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuY2xpZW50ID0gcHJvbWlzZS5kYXRhO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBwcm9kdWN0T2Zmc2V0UGFnaW5hdGVkQWRkRmFjLmdldElua3MoKS50aGVuKGZ1bmN0aW9uKHByb21pc2Upe1xuICAgICAgICAgICAgICAgIGlmKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5wcl9pbmtvcHRpb25zID0gW107XG4gICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChwcm9taXNlLmRhdGEsZnVuY3Rpb24odmFsdWUsIGtleSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHVzaCh7XCJsYWJlbFwiOnZhbHVlLmluX2NvZGUsXCJ2YWx1ZVwiOnZhbHVlLmluX2lkfSk7XG4gICAgICAgICAgICAgICAgICAgIH0sJHNjb3BlLnByX2lua29wdGlvbnMpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vJHNjb3BlLnVwZGF0ZUZhaWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBwcm9kdWN0T2Zmc2V0UGFnaW5hdGVkQWRkRmFjLmdldFBhcGVycygpLnRoZW4oZnVuY3Rpb24ocHJvbWlzZSl7XG4gICAgICAgICAgICAgICAgaWYoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnBhX2lkb3B0aW9ucyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2gocHJvbWlzZS5kYXRhLGZ1bmN0aW9uKHZhbHVlLCBrZXkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wdXNoKHtcImxhYmVsXCI6dmFsdWUucGFfY29kZSxcInZhbHVlXCI6dmFsdWUucGFfaWQsIFwid2lkdGhcIjogdmFsdWUucGFfd2lkdGgsIFwiaGVpZ2h0XCI6IHZhbHVlLnBhX2hlaWdodCwgXCJtZWFzdXJlXCI6IHZhbHVlLnBhX21lYXN1cmV9KTtcbiAgICAgICAgICAgICAgICAgICAgfSwkc2NvcGUucGFfaWRvcHRpb25zKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyRzY29wZS51cGRhdGVGYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICBcbiAgICAgICAgIH0pO1xuICAgIH1dO1xuICAgIFxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckaHR0cCcsICckcScsICckYWxlcnRzJywgJyRzdGF0ZVBhcmFtcycsIGZ1bmN0aW9uICgkaHR0cCwgJHEsICRhbGVydHMsICRzdGF0ZVBhcmFtcykge1xuICAgICAgICB2YXIgZmFjdG9yeSA9IHt9O1xuICAgICAgICBmYWN0b3J5LmdldENsaWVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKFxuICAgICAgICAgICAgICAgICRodHRwLnBvc3QoJy9wcm9kdWN0L29mZnNldC9nZW5lcmFsL2NsaWVudCcsIHtcbiAgICAgICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgICAgICBjbF9pZDogJHN0YXRlUGFyYW1zLmNsX2lkXG4gICAgICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzdGFja0Vycm9yID0gSlNPTi5zdHJpbmdpZnkoeyAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogZGF0YS5zdGF0dXMsICAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGRhdGEuZXJyb3IsICAgICAgICAgICAgICAgICAgICAgZXJyb3JUeXBlOiBkYXRhLnR5cGUsICAgICAgICAgICAgICAgICAgICAgY29uZmlnOiBjb25maWcgICAgICAgICAgICAgICAgIH0sbnVsbCw0KTsgICAgICAgICAgICAgICAgICRhbGVydHMuZXJyb3IoJ1dvb29wcyEgYW4gZXJyb3IgaGFzIG9jdXJyZWQuJyxzdGFja0Vycm9yKTsgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkuZ2V0SW5rcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKFxuICAgICAgICAgICAgICAgICRodHRwLnBvc3QoJy9wcm9kdWN0L29mZnNldC9nZW5lcmFsL2luaycsIHtcbiAgICAgICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgICAgICBwcm9jY2VzX2lkOiBuZXcgRGF0ZSgpLmdldE1pbGxpc2Vjb25kcygpXG4gICAgICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzdGFja0Vycm9yID0gSlNPTi5zdHJpbmdpZnkoeyAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogZGF0YS5zdGF0dXMsICAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGRhdGEuZXJyb3IsICAgICAgICAgICAgICAgICAgICAgZXJyb3JUeXBlOiBkYXRhLnR5cGUsICAgICAgICAgICAgICAgICAgICAgY29uZmlnOiBjb25maWcgICAgICAgICAgICAgICAgIH0sbnVsbCw0KTsgICAgICAgICAgICAgICAgICRhbGVydHMuZXJyb3IoJ1dvb29wcyEgYW4gZXJyb3IgaGFzIG9jdXJyZWQuJyxzdGFja0Vycm9yKTsgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkuZ2V0UGFwZXJzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoXG4gICAgICAgICAgICAgICAgJGh0dHAucG9zdCgnL3Byb2R1Y3Qvb2Zmc2V0L2dlbmVyYWwvcGFwZXInLCB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICAgICAgcHJvY2Nlc19pZDogbmV3IERhdGUoKS5nZXRNaWxsaXNlY29uZHMoKVxuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc3RhY2tFcnJvciA9IEpTT04uc3RyaW5naWZ5KHsgICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IGRhdGEuc3RhdHVzLCAgICAgICAgICAgICAgICAgICAgIGVycm9yOiBkYXRhLmVycm9yLCAgICAgICAgICAgICAgICAgICAgIGVycm9yVHlwZTogZGF0YS50eXBlLCAgICAgICAgICAgICAgICAgICAgIGNvbmZpZzogY29uZmlnICAgICAgICAgICAgICAgICB9LG51bGwsNCk7ICAgICAgICAgICAgICAgICAkYWxlcnRzLmVycm9yKCdXb29vcHMhIGFuIGVycm9yIGhhcyBvY3VycmVkLicsc3RhY2tFcnJvcik7ICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICBmYWN0b3J5LmFkZCA9IGZ1bmN0aW9uIChwcl9qc29uYikge1xuICAgICAgICAgICAgdmFyIHByb21pc2UgPSAkaHR0cC5wb3N0KCcvcHJvZHVjdC9hZGQnLCB7XG4gICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgIHByX2pzb25iOiBwcl9qc29uYlxuICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgIHZhciBzdGFja0Vycm9yID0gSlNPTi5zdHJpbmdpZnkoeyAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogZGF0YS5zdGF0dXMsICAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGRhdGEuZXJyb3IsICAgICAgICAgICAgICAgICAgICAgZXJyb3JUeXBlOiBkYXRhLnR5cGUsICAgICAgICAgICAgICAgICAgICAgY29uZmlnOiBjb25maWcgICAgICAgICAgICAgICAgIH0sbnVsbCw0KTsgICAgICAgICAgICAgICAgICRhbGVydHMuZXJyb3IoJ1dvb29wcyEgYW4gZXJyb3IgaGFzIG9jdXJyZWQuJyxzdGFja0Vycm9yKTsgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZmFjdG9yeTtcbiAgICB9XTtcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckc2NvcGUnLCAncHJvZHVjdEZhYycsICdpMThuRmlsdGVyJyxcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgcHJvZHVjdEZhYywgaTE4bkZpbHRlcikge1xuXG4gICAgICAgICAgICAkc2NvcGUubGFiZWxzID0gT2JqZWN0LmtleXMoaTE4bkZpbHRlcihcInByb2R1Y3QubGFiZWxzXCIpKTtcbiAgICAgICAgICAgICRzY29wZS5jb2x1bW5zID0gaTE4bkZpbHRlcihcInByb2R1Y3QuY29sdW1uc1wiKTtcbiAgICAgICAgXG4gICAgICAgICAgICAvL3NldCBRUiBDb2RlIGRhdGEgZGVmYXVsdHNcbiAgICAgICAgICAgICRzY29wZS5xcmNvZGVTdHJpbmcgPSAnWU9VUiBURVhUIFRPIEVOQ09ERSc7XG4gICAgICAgICAgICAkc2NvcGUuc2l6ZSA9IDI1MDtcbiAgICAgICAgICAgICRzY29wZS5jb3JyZWN0aW9uTGV2ZWwgPSAnJztcbiAgICAgICAgICAgICRzY29wZS50eXBlTnVtYmVyID0gMDtcbiAgICAgICAgICAgICRzY29wZS5pbnB1dE1vZGUgPSAnJztcbiAgICAgICAgICAgICRzY29wZS5pbWFnZSA9IHRydWU7XG4gICAgICAgIFxuICAgICAgICAgICAgLy9RUiBDb2RlIG1vZGFsXG4gICAgICAgICAgICAkKCcjbXlNb2RhbCcpLm9uKCdzaG93LmJzLm1vZGFsJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgdmFyIGJ1dHRvbiA9ICQoZXZlbnQucmVsYXRlZFRhcmdldCk7IC8vIEJ1dHRvbiB0aGF0IHRyaWdnZXJlZCB0aGUgbW9kYWxcbiAgICAgICAgICAgICAgICAkc2NvcGUucXJjb2RlU3RyaW5nID0gYnV0dG9uLmRhdGEoJ2NvZGVfZGF0YScpOy8vIEV4dHJhY3QgaW5mbyBmcm9tIGRhdGEtKiBhdHRyaWJ1dGVzXG4gICAgICAgICAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgXG4gICAgICAgICAgICAvLyBmb3JtYXRJdGVtIGV2ZW50IGhhbmRsZXJcbiAgICAgICAgICAgIHZhciBwcl9pZDtcbiAgICAgICAgICAgIHZhciBjbF9pZDtcbiAgICAgICAgICAgIHZhciBwcl9wcm9jZXNzO1xuICAgICAgICAgICAgdmFyIHByX3R5cGU7XG4gICAgICAgICAgICB2YXIgY29kZV9kYXRhO1xuICAgICAgICAgICAgJHNjb3BlLmZvcm1hdEl0ZW0gPSBmdW5jdGlvbiAocywgZSwgY2VsbCkge1xuXG4gICAgICAgICAgICAgICAgaWYgKGUucGFuZWwuY2VsbFR5cGUgPT0gd2lqbW8uZ3JpZC5DZWxsVHlwZS5Sb3dIZWFkZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgZS5jZWxsLnRleHRDb250ZW50ID0gZS5yb3cgKyAxO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHMucm93cy5kZWZhdWx0U2l6ZSA9IDMwO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gYWRkIEJvb3RzdHJhcCBodG1sXG4gICAgICAgICAgICAgICAgaWYgKChlLnBhbmVsLmNlbGxUeXBlID09IHdpam1vLmdyaWQuQ2VsbFR5cGUuQ2VsbCkgJiYgKGUuY29sID09IDApKSB7XG4gICAgICAgICAgICAgICAgICAgIHByX2lkID0gZS5wYW5lbC5nZXRDZWxsRGF0YShlLnJvdywgMSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBjbF9pZCA9IGUucGFuZWwuZ2V0Q2VsbERhdGEoZS5yb3csIDIsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgcHJfcHJvY2VzcyA9IGUucGFuZWwuZ2V0Q2VsbERhdGEoZS5yb3csIDYsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgcHJfdHlwZSA9IGUucGFuZWwuZ2V0Q2VsbERhdGEoZS5yb3csIDcsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgY29kZV9kYXRhID0gKGZ1bmN0aW9uICgpIHsgLy9RUiBDb2RlIGRhdGEgZnJvbSBjb2x1bW5zIFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRleHQgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgJHNjb3BlLmxhYmVscy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQgKz0gaTE4bkZpbHRlcihcInByb2R1Y3QubGFiZWxzLlwiICsgJHNjb3BlLmxhYmVsc1tpXSkgKyAnOiAnICsgZS5wYW5lbC5nZXRDZWxsRGF0YShlLnJvdywgKGkgKyAxKSwgZmFsc2UpICsgJ1xcbidcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0ZXh0O1xuICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICBlLmNlbGwuc3R5bGUub3ZlcmZsb3cgPSAndmlzaWJsZSc7XG4gICAgICAgICAgICAgICAgICAgIGUuY2VsbC5pbm5lckhUTUwgPSAnPGRpdiBjbGFzcz1cImJ0bi1ncm91cCBidG4tZ3JvdXAtanVzdGlmaWVkXCIgcm9sZT1cImdyb3VwXCIgYXJpYS1sYWJlbD1cIi4uLlwiPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJ0bi1ncm91cFwiIHJvbGU9XCJncm91cFwiPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIjL3Byb2R1Y3QvJysgcHJfcHJvY2VzcyArICcvJyArIHByX3R5cGUgKyAnL3VwZGF0ZS8nICsgY2xfaWQgKyAnLycgKyBwcl9pZCArICdcIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdCBidG4teHNcIiBuZy1jbGljaz1cImVkaXQoJGl0ZW0uY2xfaWQpXCI+RWRpdGFyPC9hPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYnRuLWdyb3VwXCIgcm9sZT1cImdyb3VwXCI+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgZGF0YS10b2dnbGU9XCJtb2RhbFwiIGRhdGEtdGFyZ2V0PVwiI215TW9kYWxcIiBkYXRhLWNvZGVfZGF0YT1cIicrIGNvZGVfZGF0YSArICdcIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdCBidG4teHNcIj5RUiBDb2RlPC9hPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2Pic7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgICAgIC8vIGJpbmQgY29sdW1ucyB3aGVuIGdyaWQgaXMgaW5pdGlhbGl6ZWRcbiAgICAgICAgICAgICRzY29wZS5pbml0R3JpZCA9IGZ1bmN0aW9uIChzLCBlKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAkc2NvcGUubGFiZWxzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjb2wgPSBuZXcgd2lqbW8uZ3JpZC5Db2x1bW4oKTtcbiAgICAgICAgICAgICAgICAgICAgY29sLmJpbmRpbmcgPSAkc2NvcGUuY29sdW1uc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgY29sLmhlYWRlciA9IGkxOG5GaWx0ZXIoXCJwcm9kdWN0LmxhYmVscy5cIiArICRzY29wZS5sYWJlbHNbaV0pO1xuICAgICAgICAgICAgICAgICAgICBjb2wud29yZFdyYXAgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgY29sLndpZHRoID0gMTUwO1xuICAgICAgICAgICAgICAgICAgICBzLmNvbHVtbnMucHVzaChjb2wpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICAvLyBjcmVhdGUgdGhlIHRvb2x0aXAgb2JqZWN0XG4gICAgICAgICAgICAkc2NvcGUuJHdhdGNoKCdnZ0dyaWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCRzY29wZS5nZ0dyaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIC8vIHN0b3JlIHJlZmVyZW5jZSB0byBncmlkXG4gICAgICAgICAgICAgICAgICAgIHZhciBmbGV4ID0gJHNjb3BlLmdnR3JpZDtcblxuICAgICAgICAgICAgICAgICAgICAvLyBjcmVhdGUgdG9vbHRpcFxuICAgICAgICAgICAgICAgICAgICB2YXIgdGlwID0gbmV3IHdpam1vLlRvb2x0aXAoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJuZyA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gbW9uaXRvciB0aGUgbW91c2Ugb3ZlciB0aGUgZ3JpZFxuICAgICAgICAgICAgICAgICAgICBmbGV4Lmhvc3RFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBodCA9IGZsZXguaGl0VGVzdChldnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFodC5jZWxsUmFuZ2UuZXF1YWxzKHJuZykpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG5ldyBjZWxsIHNlbGVjdGVkLCBzaG93IHRvb2x0aXBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaHQuY2VsbFR5cGUgPT0gd2lqbW8uZ3JpZC5DZWxsVHlwZS5DZWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJuZyA9IGh0LmNlbGxSYW5nZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvbCA9IGZsZXguY29sdW1uc1tybmcuY29sXS5oZWFkZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjZWxsRWxlbWVudCA9IGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQoZXZ0LmNsaWVudFgsIGV2dC5jbGllbnRZKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNlbGxCb3VuZHMgPSB3aWptby5SZWN0LmZyb21Cb3VuZGluZ1JlY3QoY2VsbEVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YSA9IHdpam1vLmVzY2FwZUh0bWwoZmxleC5nZXRDZWxsRGF0YShybmcucm93LCBybmcuY29sLCB0cnVlKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXBDb250ZW50ID0gY29sICsgJzogXCI8Yj4nICsgZGF0YSArICc8L2I+XCInO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2VsbEVsZW1lbnQuY2xhc3NOYW1lLmluZGV4T2YoJ3dqLWNlbGwnKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXAuc2hvdyhmbGV4Lmhvc3RFbGVtZW50LCB0aXBDb250ZW50LCBjZWxsQm91bmRzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpcC5oaWRlKCk7IC8vIGNlbGwgbXVzdCBiZSBiZWhpbmQgc2Nyb2xsIGJhci4uLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgZmxleC5ob3N0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpcC5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBybmcgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJHNjb3BlLiRvbignJHZpZXdDb250ZW50TG9hZGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIC8vIHRoaXMgY29kZSBpcyBleGVjdXRlZCBhZnRlciB0aGUgdmlldyBpcyBsb2FkZWRcbiAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgcHJvZHVjdEZhYy5kYXRhKCkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5kYXRhID0gbmV3IHdpam1vLmNvbGxlY3Rpb25zLkNvbGxlY3Rpb25WaWV3KHByb21pc2UuZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XTtcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckaHR0cCcsICckcScsICckYWxlcnRzJywgJyRzdGF0ZVBhcmFtcycsIGZ1bmN0aW9uICgkaHR0cCwgJHEsICRhbGVydHMsICRzdGF0ZVBhcmFtcykge1xuICAgICAgICB2YXIgZmFjdG9yeSA9IHt9O1xuICAgICAgICBmYWN0b3J5LmRhdGEgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KCdodHRwOi8vbG9jYWxob3N0OjMwMDAvcHJvZHVjdC9jbF9pZCcsIHtcbiAgICAgICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgICAgICBwcm9jY2VzX2lkOiBuZXcgRGF0ZSgpLmdldE1pbGxpc2Vjb25kcygpLFxuICAgICAgICAgICAgICAgICAgICBjbF9pZDogJHN0YXRlUGFyYW1zLmNsX2lkLFxuICAgICAgICAgICAgICAgICAgICBwcl9zdGF0dXM6ICdBJ1xuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiAgZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGZhY3Rvcnk7XG4gICAgfV07XG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKGFuZ3VsYXIpe1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBcbiAgICByZXR1cm4gYW5ndWxhci5tb2R1bGUoJ2FwcC5zdXBwbGllcicsW1xuICAgICAgICByZXF1aXJlKCcuL21vZHVsZXMvc3VwcGxpZXIuYWRkJykubmFtZSxcbiAgICAgICAgcmVxdWlyZSgnLi9tb2R1bGVzL3N1cHBsaWVyLnVwZGF0ZScpLm5hbWVcbiAgICBdKVxuXG4gICAgLmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsXG4gICAgZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnc3VwcGxpZXInLCB7XG4gICAgICAgICAgICB1cmw6Jy9zdXBwbGllcicsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybCA6ICdtb2R1bGVzL3N1cHBsaWVyL3N1cHBsaWVyLnZpZXcuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyIDogJ3N1cHBsaWVyQ3RybCcsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgcmVxdWlyZXNMb2dpbjogdHJ1ZVxuICAgICAgICAgICAgfSAgICBcbiAgICAgICAgfSk7XG4gICAgfV0pXG5cbiAgICAuZmFjdG9yeSgnc3VwcGxpZXJGYWMnLHJlcXVpcmUoJy4vc3VwcGxpZXIuZmFjJykpXG5cbiAgICAuY29udHJvbGxlcignc3VwcGxpZXJDdHJsJyxyZXF1aXJlKCcuL3N1cHBsaWVyLmN0cmwnKSlcbiAgICBcbn0pKGFuZ3VsYXIpO1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIiA6IFwiUHJvdmVlZG9yZXNcIixcbiAgICAgICAgICAgICAgICAgICAgXCJsYWJlbHNcIjp7XG4gICAgICAgICAgICAgICAgICAgICAgICBcInN1LWlkXCI6XCJpZCBwcm92ZWVkb3JcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3UtY29ycG9yYXRlbmFtZVwiOlwicmF6w7NuIHNvY2lhbFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdS10aW5cIjpcInJmY1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdS1uYW1lXCI6XCJub21icmVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3UtZmF0aGVyc2xhc3RuYW1lXCI6XCJhcGVsbGlkbyBwYXRlcm5vXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN1LW1vdGhlcnNsYXN0bmFtZVwiOlwiYXBlbGxpZG8gbWF0ZXJub1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdS1zdHJlZXRcIjpcImNhbGxlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN1LXN0cmVldG51bWJlclwiOlwibnVtZXJvIGV4dGVyaW9yXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN1LXN1aXRlbnVtYmVyXCI6XCJudW1lcm8gaW50ZXJpb3JcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3UtbmVpZ2hib3Job29kXCI6XCJjb2xvbmlhXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN1LWFkZHJlc3NyZWZlcmVuY2VcIjpcInJlZmVyZW5jaWFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3UtY291bnRyeVwiOlwicGHDrXNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3Utc3RhdGVcIjpcImVzdGFkb1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdS1jaXR5XCI6XCJjaXVkYWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3UtY291bnR5XCI6XCJtdW5pY2lwaW9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3UtemlwY29kZVwiOlwiY29kaWdvIHBvc3RhbFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdS1lbWFpbFwiOlwiY29ycmVvIGVsZWN0csOzbmljb1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdS1waG9uZVwiOlwidGVsw6lmb25vXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN1LW1vYmlsZVwiOlwibcOzdmlsXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN1LXN0YXR1c1wiOlwiZXN0YXR1c1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdS1kYXRlXCI6XCJmZWNoYVwiLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgXCJjb2x1bW5zXCI6W1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdV9pZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdV9jb3Jwb3JhdGVuYW1lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN1X3RpblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdV9uYW1lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN1X2ZhdGhlcnNsYXN0bmFtZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdV9tb3RoZXJzbGFzdG5hbWVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3Vfc3RyZWV0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN1X3N0cmVldG51bWJlclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdV9zdWl0ZW51bWJlclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdV9uZWlnaGJvcmhvb2RcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3VfYWRkcmVzc3JlZmVyZW5jZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdV9jb3VudHJ5XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN1X3N0YXRlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN1X2NpdHlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3VfY291bnR5XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN1X3ppcGNvZGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3VfZW1haWxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3VfcGhvbmVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3VfbW9iaWxlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN1X3N0YXR1c1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdV9kYXRlXCIsXG4gICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgXCJmaWVsZHNcIiA6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1X3N0YXR1c29wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkFjdGl2b1wiLFwidmFsdWVcIjpcIkFcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkluYWN0aXZvXCIsXCJ2YWx1ZVwiOlwiSVwifVxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oYW5ndWxhcil7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIFxuICAgIHJldHVybiBhbmd1bGFyLm1vZHVsZSgnYXBwLnN1cHBsaWVyLmFkZCcsW10pXG5cbiAgICAuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJyxcbiAgICBmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdzdXBwbGllckFkZCcsIHtcbiAgICAgICAgICAgIHVybDonL3N1cHBsaWVyL2FkZCcsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybCA6ICdtb2R1bGVzL3N1cHBsaWVyL21vZHVsZXMvc3VwcGxpZXIuYWRkL3N1cHBsaWVyLmFkZC52aWV3Lmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlciA6ICdzdXBwbGllckFkZEN0cmwnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHJlcXVpcmVzTG9naW46IHRydWVcbiAgICAgICAgICAgIH0gICAgXG4gICAgICAgIH0pO1xuICAgIH1dKVxuXG4gICAgLmZhY3RvcnkoJ3N1cHBsaWVyQWRkRmFjJyxyZXF1aXJlKCcuL3N1cHBsaWVyLmFkZC5mYWMnKSlcblxuICAgIC5jb250cm9sbGVyKCdzdXBwbGllckFkZEN0cmwnLHJlcXVpcmUoJy4vc3VwcGxpZXIuYWRkLmN0cmwnKSlcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIiA6IFwiYWdyZWdhciBwcm92ZWVkb3JcIixcbiAgICAgICAgICAgICAgICB9IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oYW5ndWxhcil7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIFxuICAgIHJldHVybiBbJyRzY29wZScsICdzdXBwbGllckFkZEZhYycsICckbG9jYXRpb24nLCAnaTE4bkZpbHRlcicsICckaW50ZXJ2YWwnLFxuICAgIGZ1bmN0aW9uICgkc2NvcGUsIHN1cHBsaWVyQWRkRmFjLCAkbG9jYXRpb24sIGkxOG5GaWx0ZXIsICRpbnRlcnZhbCkge1xuICAgICAgICAkc2NvcGUuZm1EYXRhID0ge307XG5cbiAgICAgICAgJHNjb3BlLm9uU3VibWl0ID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHN1cHBsaWVyQWRkRmFjLmFkZCgkc2NvcGUuZm1EYXRhKS50aGVuKGZ1bmN0aW9uKHByb21pc2Upe1xuICAgICAgICAgICAgICAgIGlmKHByb21pc2UuZGF0YSA9PSBcIjFcIikge1xuICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3N1cHBsaWVyJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnVwZGF0ZUZhaWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5nZXRTdGF0ZXMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICRzY29wZS5zdV9zdGF0ZW9wdGlvbnMgPSBbXTtcbiAgICAgICAgICAgICRzY29wZS5zdV9jaXR5b3B0aW9ucyA9IFtdO1xuICAgICAgICAgICAgJHNjb3BlLnN1X2NvdW50eW9wdGlvbnMgPSBbXTtcbiAgICAgICAgICAgICRpbnRlcnZhbChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHN1cHBsaWVyQWRkRmFjLmdldFN0YXRlcygkc2NvcGUuZm1EYXRhLnN1X2NvdW50cnkpLnRoZW4oZnVuY3Rpb24ocHJvbWlzZSl7XG4gICAgICAgICAgICAgICAgICAgIGlmKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEuZ2VvbmFtZXMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuc3Vfc3RhdGVvcHRpb25zID0gcHJvbWlzZS5kYXRhLmdlb25hbWVzO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8kc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sMCwxKTtcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS5nZXRDaXR5Q291bnR5ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkc2NvcGUuc3VfY2l0eW9wdGlvbnMgPSBbXTtcbiAgICAgICAgICAgICRzY29wZS5zdV9jb3VudHlvcHRpb25zID0gW107XG4gICAgICAgICAgICAkaW50ZXJ2YWwoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBzdXBwbGllckFkZEZhYy5nZXRTdGF0ZXMoJHNjb3BlLmZtRGF0YS5zdV9zdGF0ZSkudGhlbihmdW5jdGlvbihwcm9taXNlKXtcbiAgICAgICAgICAgICAgICAgICAgaWYoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YS5nZW9uYW1lcykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5zdV9jaXR5b3B0aW9ucyA9IHByb21pc2UuZGF0YS5nZW9uYW1lcztcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5zdV9jb3VudHlvcHRpb25zID0gcHJvbWlzZS5kYXRhLmdlb25hbWVzO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8kc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sMCwxKTtcbiAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICAgICRzY29wZS5zdV9zdGF0dXNvcHRpb25zID0gaTE4bkZpbHRlcihcInN1cHBsaWVyLmZpZWxkcy5zdV9zdGF0dXNvcHRpb25zXCIpO1xuXG4gICAgICAgICRzY29wZS4kb24oJyR2aWV3Q29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vIHRoaXMgY29kZSBpcyBleGVjdXRlZCBhZnRlciB0aGUgdmlldyBpcyBsb2FkZWRcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgc3VwcGxpZXJBZGRGYWMuZ2V0Q291bnRyaWVzKCkudGhlbihmdW5jdGlvbihwcm9taXNlKXtcbiAgICAgICAgICAgICAgICBpZihhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhLmdlb25hbWVzKSkge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuc3VfY291bnRyeW9wdGlvbnMgPSBwcm9taXNlLmRhdGEuZ2VvbmFtZXM7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8kc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgIH0pO1xuICAgIH1dO1xuICAgIFxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckaHR0cCcsICckcScsICckYWxlcnRzJywgJyRzdGF0ZVBhcmFtcycsIGZ1bmN0aW9uICgkaHR0cCwgJHEsICRhbGVydHMsICRzdGF0ZVBhcmFtcykge1xuICAgICAgICB2YXIgZmFjdG9yeSA9IHt9O1xuICAgICAgICBmYWN0b3J5LmFkZCA9IGZ1bmN0aW9uIChzdV9qc29uYikge1xuICAgICAgICAgICAgdmFyIHByb21pc2UgPSAkaHR0cC5wb3N0KCdtb2R1bGVzL3N1cHBsaWVyL21vZHVsZXMvc3VwcGxpZXIuYWRkL3N1cHBsaWVyLmFkZC5tZGwuYWRkLnBocCcsIHtcbiAgICAgICAgICAgICAgICAvKiBQT1NUIHZhcmlhYmxlcyBoZXJlICovXG4gICAgICAgICAgICAgICAgc3VfanNvbmI6IHN1X2pzb25iXG4gICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgdmFyIHN0YWNrRXJyb3IgPSBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogZGF0YS5zdGF0dXMsXG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBkYXRhLmVycm9yLFxuICAgICAgICAgICAgICAgICAgICBlcnJvclR5cGU6IGRhdGEudHlwZSxcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnOiBjb25maWdcbiAgICAgICAgICAgICAgICB9LCBudWxsLCA0KTtcbiAgICAgICAgICAgICAgICAkYWxlcnRzLmVycm9yKCdXb29vcHMhIGFuIGVycm9yIGhhcyBvY3VycmVkLicsIHN0YWNrRXJyb3IpO1xuICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICBmYWN0b3J5LmdldENvdW50cmllcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gJGh0dHAuZ2V0KCdodHRwOi8vYXBpLmdlb25hbWVzLm9yZy9jb3VudHJ5SW5mb0pTT04/dXNlcm5hbWU9YWxlamFuZHJvbHNjYScpXG4gICAgICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc3RhY2tFcnJvciA9IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogZGF0YS5zdGF0dXMsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjogZGF0YS5lcnJvcixcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yVHlwZTogZGF0YS50eXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnOiBjb25maWdcbiAgICAgICAgICAgICAgICAgICAgfSwgbnVsbCwgNCk7XG4gICAgICAgICAgICAgICAgICAgICRhbGVydHMuZXJyb3IoJ1dvb29wcyEgYW4gZXJyb3IgaGFzIG9jdXJyZWQuJywgc3RhY2tFcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeS5nZXRTdGF0ZXMgPSBmdW5jdGlvbiAoc3VfY291bnRyeSkge1xuICAgICAgICAgICAgdmFyIHByb21pc2UgPSAkaHR0cC5nZXQoJ2h0dHA6Ly9hcGkuZ2VvbmFtZXMub3JnL2NoaWxkcmVuSlNPTj9nZW9uYW1lSWQ9JyArIHN1X2NvdW50cnkgKyAnJnVzZXJuYW1lPWFsZWphbmRyb2xzY2EnKVxuICAgICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0YWNrRXJyb3IgPSBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IGRhdGEuc3RhdHVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGRhdGEuZXJyb3IsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvclR5cGU6IGRhdGEudHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZzogY29uZmlnXG4gICAgICAgICAgICAgICAgICAgIH0sIG51bGwsIDQpO1xuICAgICAgICAgICAgICAgICAgICAkYWxlcnRzLmVycm9yKCdXb29vcHMhIGFuIGVycm9yIGhhcyBvY3VycmVkLicsIHN0YWNrRXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkuZ2V0Q2l0eUNvdW50eSA9IGZ1bmN0aW9uIChzdV9zdGF0ZSkge1xuICAgICAgICAgICAgdmFyIHByb21pc2UgPSAkaHR0cC5nZXQoJ2h0dHA6Ly9hcGkuZ2VvbmFtZXMub3JnL2NoaWxkcmVuSlNPTj9nZW9uYW1lSWQ9JyArIHN1X3N0YXRlICsgJyZ1c2VybmFtZT1hbGVqYW5kcm9sc2NhJylcbiAgICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzdGFja0Vycm9yID0gSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiBkYXRhLnN0YXR1cyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yOiBkYXRhLmVycm9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JUeXBlOiBkYXRhLnR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25maWc6IGNvbmZpZ1xuICAgICAgICAgICAgICAgICAgICB9LCBudWxsLCA0KTtcbiAgICAgICAgICAgICAgICAgICAgJGFsZXJ0cy5lcnJvcignV29vb3BzISBhbiBlcnJvciBoYXMgb2N1cnJlZC4nLCBzdGFja0Vycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZmFjdG9yeTtcbiAgICB9XTtcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oYW5ndWxhcil7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIFxuICAgIHJldHVybiBhbmd1bGFyLm1vZHVsZSgnYXBwLnN1cHBsaWVyLnVwZGF0ZScsW10pXG5cbiAgICAuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJyxcbiAgICBmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdzdXBwbGllclVwZGF0ZScsIHtcbiAgICAgICAgICAgIHVybDonL3N1cHBsaWVyL3VwZGF0ZS86c3VfaWQnLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmwgOiAnbW9kdWxlcy9zdXBwbGllci9tb2R1bGVzL3N1cHBsaWVyLnVwZGF0ZS9zdXBwbGllci51cGRhdGUudmlldy5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXIgOiAnc3VwcGxpZXJVcGRhdGVDdHJsJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICByZXF1aXJlc0xvZ2luOiB0cnVlXG4gICAgICAgICAgICB9ICAgIFxuICAgICAgICB9KTtcbiAgICB9XSlcblxuICAgIC5mYWN0b3J5KCdzdXBwbGllclVwZGF0ZUZhYycscmVxdWlyZSgnLi9zdXBwbGllci51cGRhdGUuZmFjJykpXG5cbiAgICAuY29udHJvbGxlcignc3VwcGxpZXJVcGRhdGVDdHJsJyxyZXF1aXJlKCcuL3N1cHBsaWVyLnVwZGF0ZS5jdHJsJykpXG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCIgOiBcImFjdHVhbGl6YXIgcHJvdmVlZG9yXCIsXG4gICAgICAgICAgICAgICAgfSIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgcmV0dXJuIFsnJHNjb3BlJywgJ3N1cHBsaWVyVXBkYXRlRmFjJywgJyRsb2NhdGlvbicsICdpMThuRmlsdGVyJywgJyRpbnRlcnZhbCcsXG4gICAgICAgIGZ1bmN0aW9uICgkc2NvcGUsIHN1cHBsaWVyVXBkYXRlRmFjLCAkbG9jYXRpb24sIGkxOG5GaWx0ZXIsICRpbnRlcnZhbCkge1xuXG4gICAgICAgICAgICAkc2NvcGUub25TdWJtaXQgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICBzdXBwbGllclVwZGF0ZUZhYy51cGRhdGUoJHNjb3BlLmZtRGF0YSkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocHJvbWlzZS5kYXRhID09IFwiMVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3N1cHBsaWVyJyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICRzY29wZS5nZXRTdGF0ZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnN1X3N0YXRlb3B0aW9ucyA9IFtdO1xuICAgICAgICAgICAgICAgICRzY29wZS5zdV9jaXR5b3B0aW9ucyA9IFtdO1xuICAgICAgICAgICAgICAgICRzY29wZS5zdV9jb3VudHlvcHRpb25zID0gW107XG4gICAgICAgICAgICAgICAgJGludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgc3VwcGxpZXJVcGRhdGVGYWMuZ2V0U3RhdGVzKCRzY29wZS5mbURhdGEuc3VfY291bnRyeSkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEuZ2VvbmFtZXMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnN1X3N0YXRlb3B0aW9ucyA9IHByb21pc2UuZGF0YS5nZW9uYW1lcztcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8kc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sIDAsIDEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkc2NvcGUuZ2V0Q2l0eUNvdW50eSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUuc3VfY2l0eW9wdGlvbnMgPSBbXTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuc3VfY291bnR5b3B0aW9ucyA9IFtdO1xuICAgICAgICAgICAgICAgICRpbnRlcnZhbChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHN1cHBsaWVyVXBkYXRlRmFjLmdldFN0YXRlcygkc2NvcGUuZm1EYXRhLnN1X3N0YXRlKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YS5nZW9uYW1lcykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuc3VfY2l0eW9wdGlvbnMgPSBwcm9taXNlLmRhdGEuZ2VvbmFtZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnN1X2NvdW50eW9wdGlvbnMgPSBwcm9taXNlLmRhdGEuZ2VvbmFtZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vJHNjb3BlLnVwZGF0ZUZhaWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LCAwLCAxKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJHNjb3BlLnN1X3N0YXR1c29wdGlvbnMgPSBpMThuRmlsdGVyKFwic3VwcGxpZXIuZmllbGRzLnN1X3N0YXR1c29wdGlvbnNcIik7XG5cbiAgICAgICAgICAgICRzY29wZS4kb24oJyR2aWV3Q29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAvLyB0aGlzIGNvZGUgaXMgZXhlY3V0ZWQgYWZ0ZXIgdGhlIHZpZXcgaXMgbG9hZGVkXG4gICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHN1cHBsaWVyVXBkYXRlRmFjLmRhdGEoKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzT2JqZWN0KGFuZ3VsYXIuZnJvbUpzb24ocHJvbWlzZS5kYXRhKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5mbURhdGEgPSBhbmd1bGFyLmZyb21Kc29uKHByb21pc2UuZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgc3VwcGxpZXJVcGRhdGVGYWMuZ2V0Q291bnRyaWVzKCkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEuZ2VvbmFtZXMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnN1X2NvdW50cnlvcHRpb25zID0gcHJvbWlzZS5kYXRhLmdlb25hbWVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyRzY29wZS51cGRhdGVGYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdXBwbGllclVwZGF0ZUZhYy5nZXRTdGF0ZXMoJHNjb3BlLmZtRGF0YS5zdV9jb3VudHJ5KS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEuZ2VvbmFtZXMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5zdV9zdGF0ZW9wdGlvbnMgPSBwcm9taXNlLmRhdGEuZ2VvbmFtZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8kc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdXBwbGllclVwZGF0ZUZhYy5nZXRDaXR5Q291bnR5KCRzY29wZS5mbURhdGEuc3Vfc3RhdGUpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YS5nZW9uYW1lcykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnN1X2NpdHlvcHRpb25zID0gcHJvbWlzZS5kYXRhLmdlb25hbWVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuc3VfY291bnR5b3B0aW9ucyA9IHByb21pc2UuZGF0YS5nZW9uYW1lcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyRzY29wZS51cGRhdGVGYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1dO1xuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbihhbmd1bGFyKXtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgXG4gICAgcmV0dXJuIFsnJGh0dHAnLCAnJHEnLCAnJGFsZXJ0cycsICckc3RhdGVQYXJhbXMnLCBmdW5jdGlvbigkaHR0cCwgJHEsICRhbGVydHMsICRzdGF0ZVBhcmFtcyl7XG4gICAgICAgIHZhciBmYWN0b3J5ID0ge307XG4gICAgICAgIGZhY3RvcnkuZGF0YSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoXG4gICAgICAgICAgICAgICAgJGh0dHAucG9zdCgnbW9kdWxlcy9zdXBwbGllci9tb2R1bGVzL3N1cHBsaWVyLnVwZGF0ZS9zdXBwbGllci51cGRhdGUubWRsLmdldHN1cHBsaWVyLnBocCcsIHtcbiAgICAgICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgICAgICBzdV9pZDogJHN0YXRlUGFyYW1zLnN1X2lkXG4gICAgICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZyl7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1wic3RhdHVzXCI6IGZhbHNlfTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICBmYWN0b3J5LnVwZGF0ZSA9IGZ1bmN0aW9uKHN1X2pzb25iKSB7XG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KCdtb2R1bGVzL3N1cHBsaWVyL21vZHVsZXMvc3VwcGxpZXIudXBkYXRlL3N1cHBsaWVyLnVwZGF0ZS5tZGwudXBkYXRlLnBocCcsIHtcbiAgICAgICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgICAgICBzdV9pZDogJHN0YXRlUGFyYW1zLnN1X2lkLFxuICAgICAgICAgICAgICAgICAgICBzdV9qc29uYjogc3VfanNvbmJcbiAgICAgICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XCJzdGF0dXNcIjogZmFsc2V9O1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkuZ2V0Q291bnRyaWVzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9ICRodHRwLmdldCgnaHR0cDovL2FwaS5nZW9uYW1lcy5vcmcvY291bnRyeUluZm9KU09OP3VzZXJuYW1lPWFsZWphbmRyb2xzY2EnKVxuICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpe1xuICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcInN0YXR1c1wiOiBmYWxzZX07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICBmYWN0b3J5LmdldFN0YXRlcyA9IGZ1bmN0aW9uKHN1X2NvdW50cnkpIHtcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gJGh0dHAuZ2V0KCdodHRwOi8vYXBpLmdlb25hbWVzLm9yZy9jaGlsZHJlbkpTT04/Z2VvbmFtZUlkPScrc3VfY291bnRyeSsnJnVzZXJuYW1lPWFsZWphbmRyb2xzY2EnKVxuICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpe1xuICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1wic3RhdHVzXCI6IGZhbHNlfTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkuZ2V0Q2l0eUNvdW50eSA9IGZ1bmN0aW9uKHN1X3N0YXRlKSB7XG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9ICRodHRwLmdldCgnaHR0cDovL2FwaS5nZW9uYW1lcy5vcmcvY2hpbGRyZW5KU09OP2dlb25hbWVJZD0nK3N1X3N0YXRlKycmdXNlcm5hbWU9YWxlamFuZHJvbHNjYScpXG4gICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZyl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XCJzdGF0dXNcIjogZmFsc2V9O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGZhY3Rvcnk7XG4gICAgfV07XG4gICAgXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRzY29wZScsICdzdXBwbGllckZhYycsICdpMThuRmlsdGVyJyxcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgc3VwcGxpZXJGYWMsIGkxOG5GaWx0ZXIpIHtcblxuICAgICAgICAgICAgJHNjb3BlLmxhYmVscyA9IE9iamVjdC5rZXlzKGkxOG5GaWx0ZXIoXCJzdXBwbGllci5sYWJlbHNcIikpO1xuICAgICAgICAgICAgJHNjb3BlLmNvbHVtbnMgPSBpMThuRmlsdGVyKFwic3VwcGxpZXIuY29sdW1uc1wiKTtcbiAgICAgICAgXG4gICAgICAgICAgICAvLyBmb3JtYXRJdGVtIGV2ZW50IGhhbmRsZXJcbiAgICAgICAgICAgIHZhciBzdV9pZDtcbiAgICAgICAgICAgICRzY29wZS5mb3JtYXRJdGVtID0gZnVuY3Rpb24gKHMsIGUsIGNlbGwpIHtcblxuICAgICAgICAgICAgICAgIGlmIChlLnBhbmVsLmNlbGxUeXBlID09IHdpam1vLmdyaWQuQ2VsbFR5cGUuUm93SGVhZGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGUuY2VsbC50ZXh0Q29udGVudCA9IGUucm93ICsgMTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBzLnJvd3MuZGVmYXVsdFNpemUgPSAzMDtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIGFkZCBCb290c3RyYXAgaHRtbFxuICAgICAgICAgICAgICAgIGlmICgoZS5wYW5lbC5jZWxsVHlwZSA9PSB3aWptby5ncmlkLkNlbGxUeXBlLkNlbGwpICYmIChlLmNvbCA9PSAwKSkge1xuICAgICAgICAgICAgICAgICAgICBzdV9pZCA9IGUucGFuZWwuZ2V0Q2VsbERhdGEoZS5yb3csIDEsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgZS5jZWxsLnN0eWxlLm92ZXJmbG93ID0gJ3Zpc2libGUnO1xuICAgICAgICAgICAgICAgICAgICBlLmNlbGwuaW5uZXJIVE1MID0gJzxkaXYgY2xhc3M9XCJidG4tZ3JvdXAgYnRuLWdyb3VwLWp1c3RpZmllZFwiIHJvbGU9XCJncm91cFwiIGFyaWEtbGFiZWw9XCIuLi5cIj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidG4tZ3JvdXBcIiByb2xlPVwiZ3JvdXBcIj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiIy9zdXBwbGllci91cGRhdGUvJysgc3VfaWQgKyAnXCIgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHQgYnRuLXhzXCIgbmctY2xpY2s9XCJlZGl0KCRpdGVtLnN1X2lkKVwiPkVkaXRhcjwvYT5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj4nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgICAgICAvLyBiaW5kIGNvbHVtbnMgd2hlbiBncmlkIGlzIGluaXRpYWxpemVkXG4gICAgICAgICAgICAkc2NvcGUuaW5pdEdyaWQgPSBmdW5jdGlvbiAocywgZSkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgJHNjb3BlLmxhYmVscy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgY29sID0gbmV3IHdpam1vLmdyaWQuQ29sdW1uKCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbC5iaW5kaW5nID0gJHNjb3BlLmNvbHVtbnNbaV07XG4gICAgICAgICAgICAgICAgICAgIGNvbC5oZWFkZXIgPSBpMThuRmlsdGVyKFwic3VwcGxpZXIubGFiZWxzLlwiICsgJHNjb3BlLmxhYmVsc1tpXSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbC53b3JkV3JhcCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBjb2wud2lkdGggPSAxNTA7XG4gICAgICAgICAgICAgICAgICAgIHMuY29sdW1ucy5wdXNoKGNvbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIC8vIGNyZWF0ZSB0aGUgdG9vbHRpcCBvYmplY3RcbiAgICAgICAgICAgICRzY29wZS4kd2F0Y2goJ2dnR3JpZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoJHNjb3BlLmdnR3JpZCkge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgLy8gc3RvcmUgcmVmZXJlbmNlIHRvIGdyaWRcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZsZXggPSAkc2NvcGUuZ2dHcmlkO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNyZWF0ZSB0b29sdGlwXG4gICAgICAgICAgICAgICAgICAgIHZhciB0aXAgPSBuZXcgd2lqbW8uVG9vbHRpcCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgcm5nID0gbnVsbDtcblxuICAgICAgICAgICAgICAgICAgICAvLyBtb25pdG9yIHRoZSBtb3VzZSBvdmVyIHRoZSBncmlkXG4gICAgICAgICAgICAgICAgICAgIGZsZXguaG9zdEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGh0ID0gZmxleC5oaXRUZXN0KGV2dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWh0LmNlbGxSYW5nZS5lcXVhbHMocm5nKSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbmV3IGNlbGwgc2VsZWN0ZWQsIHNob3cgdG9vbHRpcFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChodC5jZWxsVHlwZSA9PSB3aWptby5ncmlkLkNlbGxUeXBlLkNlbGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm5nID0gaHQuY2VsbFJhbmdlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29sID0gZmxleC5jb2x1bW5zW3JuZy5jb2xdLmhlYWRlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNlbGxFbGVtZW50ID0gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludChldnQuY2xpZW50WCwgZXZ0LmNsaWVudFkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2VsbEJvdW5kcyA9IHdpam1vLlJlY3QuZnJvbUJvdW5kaW5nUmVjdChjZWxsRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhID0gd2lqbW8uZXNjYXBlSHRtbChmbGV4LmdldENlbGxEYXRhKHJuZy5yb3csIHJuZy5jb2wsIHRydWUpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpcENvbnRlbnQgPSBjb2wgKyAnOiBcIjxiPicgKyBkYXRhICsgJzwvYj5cIic7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjZWxsRWxlbWVudC5jbGFzc05hbWUuaW5kZXhPZignd2otY2VsbCcpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpcC5zaG93KGZsZXguaG9zdEVsZW1lbnQsIHRpcENvbnRlbnQsIGNlbGxCb3VuZHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlwLmhpZGUoKTsgLy8gY2VsbCBtdXN0IGJlIGJlaGluZCBzY3JvbGwgYmFyLi4uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBmbGV4Lmhvc3RFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3V0JywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGlwLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJuZyA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkc2NvcGUuJG9uKCckdmlld0NvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgLy8gdGhpcyBjb2RlIGlzIGV4ZWN1dGVkIGFmdGVyIHRoZSB2aWV3IGlzIGxvYWRlZFxuICAgICAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBzdXBwbGllckZhYy5kYXRhKCkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5kYXRhID0gbmV3IHdpam1vLmNvbGxlY3Rpb25zLkNvbGxlY3Rpb25WaWV3KHByb21pc2UuZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XTtcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckaHR0cCcsICckcScsICckYWxlcnRzJywgZnVuY3Rpb24gKCRodHRwLCAkcSwgJGFsZXJ0cykge1xuICAgICAgICB2YXIgZmFjdG9yeSA9IHt9O1xuICAgICAgICBmYWN0b3J5LmRhdGEgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KCdtb2R1bGVzL3N1cHBsaWVyL3N1cHBsaWVyLm1kbC5nZXRzdXBwbGllcnMucGhwJywge1xuICAgICAgICAgICAgICAgICAgICAvKiBQT1NUIHZhcmlhYmxlcyBoZXJlICovXG4gICAgICAgICAgICAgICAgICAgIHByb2NjZXNfaWQ6IG5ldyBEYXRlKCkuZ2V0TWlsbGlzZWNvbmRzKClcbiAgICAgICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0YWNrRXJyb3IgPSBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IGRhdGEuc3RhdHVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGRhdGEuZXJyb3IsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvclR5cGU6IGRhdGEudHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZzogY29uZmlnXG4gICAgICAgICAgICAgICAgICAgIH0sIG51bGwsIDQpO1xuICAgICAgICAgICAgICAgICAgICAkYWxlcnRzLmVycm9yKCdXb29vcHMhIGFuIGVycm9yIGhhcyBvY3VycmVkLicsIHN0YWNrRXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZmFjdG9yeTtcbiAgICB9XTtcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oYW5ndWxhcil7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIFxuICAgIHJldHVybiBhbmd1bGFyLm1vZHVsZSgnYXBwLnVzZXInLFtcbiAgICAgICAgcmVxdWlyZSgnLi9tb2R1bGVzL3VzZXIuYWRkJykubmFtZSxcbiAgICAgICAgcmVxdWlyZSgnLi9tb2R1bGVzL3VzZXIudXBkYXRlJykubmFtZSxcbiAgICAgICAgcmVxdWlyZSgnLi9tb2R1bGVzL3VzZXIucHJvZmlsZScpLm5hbWVcbiAgICBdKVxuXG4gICAgLmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsXG4gICAgZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgndXNlcicsIHtcbiAgICAgICAgICAgIHVybDonL3VzZXInLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmwgOiAnbW9kdWxlcy91c2VyL3VzZXIudmlldy5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXIgOiAndXNlckN0cmwnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHJlcXVpcmVzTG9naW46IHRydWVcbiAgICAgICAgICAgIH0gICAgXG4gICAgICAgIH0pO1xuICAgIH1dKVxuXG4gICAgLmZhY3RvcnkoJ3VzZXJGYWMnLHJlcXVpcmUoJy4vdXNlci5mYWMnKSlcblxuICAgIC5jb250cm9sbGVyKCd1c2VyQ3RybCcscmVxdWlyZSgnLi91c2VyLmN0cmwnKSlcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIiA6IFwidXN1YXJpb3NcIixcbiAgICAgICAgICAgICAgICAgICAgXCJsYWJlbHNcIjp7XG4gICAgICAgICAgICAgICAgICAgICAgICBcInVzLWlkXCI6IFwiaWQgdXN1YXJpb1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJnci1pZFwiOiBcImlkIGdydXBvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInVzLXVzZXJcIjogXCJ1c3VhcmlvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInVzLXBhc3N3b3JkXCI6IFwiY29udHJhc2XDsWFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidXMtbmFtZVwiOiBcIm5vbWJyZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ1cy1mYXRoZXJzbGFzdG5hbWVcIjogXCJhcGVsbGlkbyBwYXRlcm5vXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInVzLW1vdGhlcnNsYXN0bmFtZVwiOiBcImFwZWxsaWRvIG1hdGVybm9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidXMtZW1haWxcIjogXCJjb3JyZW8gZWxlY3Ryw7NuaWNvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInVzLXBob25lXCI6IFwidGVsw6lmb25vXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInVzLW1vYmlsZVwiOiBcIm3Ds3ZpbFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ1cy1zdGF0dXNcIjogXCJlc3RhdHVzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInVzLWRhdGVcIjogXCJmZWNoYVwiXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIFwiY29sdW1uc1wiOltcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidXNfaWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZ3JfaWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidXNfdXNlclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ1c19wYXNzd29yZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ1c19uYW1lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInVzX2ZhdGhlcnNsYXN0bmFtZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ1c19tb3RoZXJzbGFzdG5hbWVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidXNfZW1haWxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidXNfcGhvbmVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidXNfbW9iaWxlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInVzX3N0YXR1c1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ1c19kYXRlXCJcbiAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgIH0iLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbihhbmd1bGFyKXtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgXG4gICAgcmV0dXJuIGFuZ3VsYXIubW9kdWxlKCdhcHAudXNlci5hZGQnLFtdKVxuXG4gICAgLmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsXG4gICAgZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgndXNlckFkZCcsIHtcbiAgICAgICAgICAgIHVybDonL3VzZXIvYWRkJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsIDogJ21vZHVsZXMvdXNlci9tb2R1bGVzL3VzZXIuYWRkL3VzZXIuYWRkLnZpZXcuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyIDogJ3VzZXJBZGRDdHJsJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICByZXF1aXJlc0xvZ2luOiB0cnVlXG4gICAgICAgICAgICB9ICAgIFxuICAgICAgICB9KTtcbiAgICB9XSlcblxuICAgIC5mYWN0b3J5KCd1c2VyQWRkRmFjJyxyZXF1aXJlKCcuL3VzZXIuYWRkLmZhYycpKVxuXG4gICAgLmNvbnRyb2xsZXIoJ3VzZXJBZGRDdHJsJyxyZXF1aXJlKCcuL3VzZXIuYWRkLmN0cmwnKSlcbiAgICBcbn0pKGFuZ3VsYXIpO1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIiA6IFwiYWdyZWdhciB1c3VhcmlvXCIsXG4gICAgICAgICAgICAgICAgfSIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgcmV0dXJuIFsnJHNjb3BlJywgJ3VzZXJBZGRGYWMnLCAnJGxvY2F0aW9uJyxcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgdXNlckFkZEZhYywgJGxvY2F0aW9uKSB7XG5cbiAgICAgICAgICAgICRzY29wZS5vblN1Ym1pdCA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgIHVzZXJBZGRGYWMuYWRkKCRzY29wZS5mbURhdGEpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb21pc2UuZGF0YSA9PSBcIjFcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy91c2VyJyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICRzY29wZS4kb24oJyR2aWV3Q29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAvLyB0aGlzIGNvZGUgaXMgZXhlY3V0ZWQgYWZ0ZXIgdGhlIHZpZXcgaXMgbG9hZGVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfV07XG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKGFuZ3VsYXIpe1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBcbiAgICByZXR1cm4gWyckaHR0cCcsICckcScsICckYWxlcnRzJywgJyRzdGF0ZVBhcmFtcycsXG4gICAgZnVuY3Rpb24oJGh0dHAsICRxLCAkYWxlcnRzLCAkc3RhdGVQYXJhbXMpe1xuICAgICAgICB2YXIgZmFjdG9yeSA9IHt9O1xuICAgICAgICBmYWN0b3J5LmFkZCA9IGZ1bmN0aW9uKHVzX2pzb25iKSB7XG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9ICRodHRwLnBvc3QoJ21vZHVsZXMvdXNlci9tb2R1bGVzL3VzZXIuYWRkL3VzZXIuYWRkLm1vZGVsLnBocCcsIHtcbiAgICAgICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgICAgICB1c19qc29uYjogdXNfanNvbmJcbiAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpe1xuICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcInN0YXR1c1wiOiBmYWxzZX07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZmFjdG9yeTtcbiAgICB9XTtcbiAgICBcbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKGFuZ3VsYXIpe1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBcbiAgICByZXR1cm4gYW5ndWxhci5tb2R1bGUoJ2FwcC51c2VyLnByb2ZpbGUnLFtdKVxuXG4gICAgLmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsXG4gICAgZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgndXNlclByb2ZpbGUnLCB7XG4gICAgICAgICAgICB1cmw6Jy91c2VyL3Byb2ZpbGUnLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmwgOiAnbW9kdWxlcy91c2VyL21vZHVsZXMvdXNlci5wcm9maWxlL3VzZXIucHJvZmlsZS52aWV3Lmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlciA6ICd1c2VyUHJvZmlsZUN0cmwnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHJlcXVpcmVzTG9naW46IHRydWVcbiAgICAgICAgICAgIH0gICAgXG4gICAgICAgIH0pO1xuICAgIH1dKVxuXG4gICAgLmNvbnRyb2xsZXIoJ3VzZXJQcm9maWxlQ3RybCcscmVxdWlyZSgnLi91c2VyLnByb2ZpbGUuY3RybCcpKVxuICAgIFxufSkoYW5ndWxhcik7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiIDogXCJwZXJmaWwgZGVsIHVzdWFyaW9cIixcbiAgICAgICAgICAgICAgICB9IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oYW5ndWxhcil7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIFxuICAgIHJldHVybiBbJyRzY29wZScsICckbG9jYXRpb24nLCAnaTE4bkZpbHRlcicsICckcm9vdFNjb3BlJyxcbiAgICBmdW5jdGlvbiAoJHNjb3BlLCAkbG9jYXRpb24sIGkxOG5GaWx0ZXIsICRyb290U2NvcGUpIHtcbiAgICAgICAgJHNjb3BlLnVzZXIgPSAkcm9vdFNjb3BlLnVzZXI7XG4gICAgICAgICRzY29wZS4kb24oJyR2aWV3Q29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vIHRoaXMgY29kZSBpcyBleGVjdXRlZCBhZnRlciB0aGUgdmlldyBpcyBsb2FkZWRcbiAgICAgICAgIH0pO1xuICAgIH1dO1xuICAgIFxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oYW5ndWxhcil7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIFxuICAgIHJldHVybiBhbmd1bGFyLm1vZHVsZSgnYXBwLnVzZXIudXBkYXRlJyxbXSlcblxuICAgIC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLFxuICAgIGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcbiAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3VzZXJVcGRhdGUnLCB7XG4gICAgICAgICAgICB1cmw6Jy91c2VyL3VwZGF0ZS86dXNfaWQnLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmwgOiAnbW9kdWxlcy91c2VyL21vZHVsZXMvdXNlci51cGRhdGUvdXNlci51cGRhdGUudmlldy5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXIgOiAndXNlclVwZGF0ZUN0cmwnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHJlcXVpcmVzTG9naW46IHRydWVcbiAgICAgICAgICAgIH0gICAgXG4gICAgICAgIH0pO1xuICAgIH1dKVxuXG4gICAgLmZhY3RvcnkoJ3VzZXJVcGRhdGVGYWMnLHJlcXVpcmUoJy4vdXNlci51cGRhdGUuZmFjJykpXG5cbiAgICAuY29udHJvbGxlcigndXNlclVwZGF0ZUN0cmwnLHJlcXVpcmUoJy4vdXNlci51cGRhdGUuY3RybCcpKVxuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiIDogXCJhY3R1YWxpemFyIHVzdWFyaW9cIixcbiAgICAgICAgICAgICAgICB9IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckc2NvcGUnLCAndXNlclVwZGF0ZUZhYycsICckbG9jYXRpb24nLFxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCB1c2VyVXBkYXRlRmFjLCAkbG9jYXRpb24pIHtcblxuICAgICAgICAgICAgJHNjb3BlLm9uU3VibWl0ID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgdXNlclVwZGF0ZUZhYy51cGRhdGUoJHNjb3BlLmZtRGF0YSkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocHJvbWlzZS5kYXRhID09IFwiMVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3VzZXInKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS51cGRhdGVGYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgJHNjb3BlLiRvbignJHZpZXdDb250ZW50TG9hZGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIC8vIHRoaXMgY29kZSBpcyBleGVjdXRlZCBhZnRlciB0aGUgdmlldyBpcyBsb2FkZWRcblxuICAgICAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB1c2VyVXBkYXRlRmFjLmRhdGEoKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzT2JqZWN0KGFuZ3VsYXIuZnJvbUpzb24ocHJvbWlzZS5kYXRhKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5mbURhdGEgPSBhbmd1bGFyLmZyb21Kc29uKHByb21pc2UuZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuXG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XTtcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckaHR0cCcsICckcScsICckYWxlcnRzJywgJyRzdGF0ZVBhcmFtcycsIGZ1bmN0aW9uICgkaHR0cCwgJHEsICRhbGVydHMsICRzdGF0ZVBhcmFtcykge1xuICAgICAgICB2YXIgZmFjdG9yeSA9IHt9O1xuICAgICAgICBmYWN0b3J5LmRhdGEgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KCdtb2R1bGVzL3VzZXIvbW9kdWxlcy91c2VyLnVwZGF0ZS91c2VyLnVwZGF0ZS5tZGwuZ2V0VXNlci5waHAnLCB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICAgICAgdXNfaWQ6ICRzdGF0ZVBhcmFtcy51c19pZFxuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc3RhY2tFcnJvciA9IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogZGF0YS5zdGF0dXMsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjogZGF0YS5lcnJvcixcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yVHlwZTogZGF0YS50eXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnOiBjb25maWdcbiAgICAgICAgICAgICAgICAgICAgfSwgbnVsbCwgNCk7XG4gICAgICAgICAgICAgICAgICAgICRhbGVydHMuZXJyb3IoJ1dvb29wcyEgYW4gZXJyb3IgaGFzIG9jdXJyZWQuJywgc3RhY2tFcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeS51cGRhdGUgPSBmdW5jdGlvbiAodXNfanNvbmIpIHtcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKFxuICAgICAgICAgICAgICAgICRodHRwLnBvc3QoJ21vZHVsZXMvdXNlci9tb2R1bGVzL3VzZXIudXBkYXRlL3VzZXIudXBkYXRlLm1kbC51cGRhdGUucGhwJywge1xuICAgICAgICAgICAgICAgICAgICAvKiBQT1NUIHZhcmlhYmxlcyBoZXJlICovXG4gICAgICAgICAgICAgICAgICAgIHVzX2lkOiAkc3RhdGVQYXJhbXMudXNfaWQsXG4gICAgICAgICAgICAgICAgICAgIHVzX2pzb25iOiB1c19qc29uYlxuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc3RhY2tFcnJvciA9IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogZGF0YS5zdGF0dXMsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjogZGF0YS5lcnJvcixcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yVHlwZTogZGF0YS50eXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnOiBjb25maWdcbiAgICAgICAgICAgICAgICAgICAgfSwgbnVsbCwgNCk7XG4gICAgICAgICAgICAgICAgICAgICRhbGVydHMuZXJyb3IoJ1dvb29wcyEgYW4gZXJyb3IgaGFzIG9jdXJyZWQuJywgc3RhY2tFcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGZhY3Rvcnk7XG4gICAgfV07XG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKGFuZ3VsYXIpe1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBcbiAgICByZXR1cm4gWyckc2NvcGUnLCAndXNlckZhYycsICdpMThuRmlsdGVyJyxcbiAgICBmdW5jdGlvbiAoJHNjb3BlLCB1c2VyRmFjLCBpMThuRmlsdGVyKSB7XG4gICAgICAgIFxuICAgICAgICAkc2NvcGUubGFiZWxzID0gT2JqZWN0LmtleXMoaTE4bkZpbHRlcihcInVzZXIubGFiZWxzXCIpKTtcbiAgICAgICAgJHNjb3BlLmNvbHVtbnMgPSBpMThuRmlsdGVyKFwidXNlci5jb2x1bW5zXCIpO1xuXG4gICAgICAgICRzY29wZS5lZGl0ID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgICAgICBpZiAoYW5ndWxhci5pc051bWJlcihpZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy9FbWJlZCB0aGUgaWQgdG8gdGhlIGxpbmtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGxpbmsgPSBcIiMvdXNlci91cGRhdGUvXCIgKyBpZDtcbiAgICAgICAgICAgICAgICAgICAgLy9PcGVuIHRoZSBsaW5rXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IGxpbms7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUuZHVwbGljYXRlID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgICAgICBpZiAoYW5ndWxhci5pc051bWJlcihpZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGxpbmsgPSBcIiMvdXNlci9kdXBsaWNhdGUvXCIgKyBpZDtcbiAgICAgICAgICAgICAgICAgICAgLy9PcGVuIHRoZSBsaW5rXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IGxpbms7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vIGJpbmQgY29sdW1ucyB3aGVuIGdyaWQgaXMgaW5pdGlhbGl6ZWRcbiAgICAgICAgJHNjb3BlLmluaXRHcmlkID0gZnVuY3Rpb24ocywgZSkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAkc2NvcGUubGFiZWxzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNvbCA9IG5ldyB3aWptby5ncmlkLkNvbHVtbigpO1xuICAgICAgICAgICAgICAgIGNvbC5iaW5kaW5nID0gJHNjb3BlLmNvbHVtbnNbaV07XG4gICAgICAgICAgICAgICAgY29sLmhlYWRlciA9IGkxOG5GaWx0ZXIoXCJ1c2VyLmxhYmVscy5cIiArICRzY29wZS5sYWJlbHNbaV0pO1xuICAgICAgICAgICAgICAgIHMuY29sdW1ucy5wdXNoKGNvbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLiRvbignJHZpZXdDb250ZW50TG9hZGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLy8gdGhpcyBjb2RlIGlzIGV4ZWN1dGVkIGFmdGVyIHRoZSB2aWV3IGlzIGxvYWRlZFxuICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgdXNlckZhYy5kYXRhKCkudGhlbihmdW5jdGlvbihwcm9taXNlKXtcbiAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGlmKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5kYXRhID0gbmV3IHdpam1vLmNvbGxlY3Rpb25zLkNvbGxlY3Rpb25WaWV3KHByb21pc2UuZGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICB9KTtcbiAgICB9XTtcbiAgICBcbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgcmV0dXJuIFsnJGh0dHAnLCAnJHEnLCAnJGFsZXJ0cycsIGZ1bmN0aW9uICgkaHR0cCwgJHEsICRhbGVydHMpIHtcbiAgICAgICAgdmFyIGZhY3RvcnkgPSB7fTtcbiAgICAgICAgZmFjdG9yeS5kYXRhID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoXG4gICAgICAgICAgICAgICAgJGh0dHAucG9zdCgnbW9kdWxlcy91c2VyL3VzZXIubWRsLmdldFVzZXJzLnBocCcsIHtcbiAgICAgICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc3RhY2tFcnJvciA9IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogZGF0YS5zdGF0dXMsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjogZGF0YS5lcnJvcixcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yVHlwZTogZGF0YS50eXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnOiBjb25maWdcbiAgICAgICAgICAgICAgICAgICAgfSwgbnVsbCwgNCk7XG4gICAgICAgICAgICAgICAgICAgICRhbGVydHMuZXJyb3IoJ1dvb29wcyEgYW4gZXJyb3IgaGFzIG9jdXJyZWQuJywgc3RhY2tFcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGZhY3Rvcnk7XG4gICAgfV07XG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKGFuZ3VsYXIpe1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBcbiAgICByZXR1cm4gYW5ndWxhci5tb2R1bGUoJ2FwcC53bycsW1xuICAgICAgICByZXF1aXJlKCcuL21vZHVsZXMvd28uYWRkJykubmFtZSxcbiAgICAgICAgcmVxdWlyZSgnLi9tb2R1bGVzL3dvLnVwZGF0ZScpLm5hbWUsXG4gICAgICAgIHJlcXVpcmUoJy4vbW9kdWxlcy93by5kdXBsaWNhdGUnKS5uYW1lXG4gICAgXSlcblxuICAgIC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLFxuICAgIGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcbiAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3dvJywge1xuICAgICAgICAgICAgdXJsOicvd28vOmNsX2lkJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsIDogJ21vZHVsZXMvd28vd28udmlldy5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXIgOiAnd29Db250cm9sbGVyJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICByZXF1aXJlc0xvZ2luOiB0cnVlXG4gICAgICAgICAgICB9ICAgIFxuICAgICAgICB9KTtcbiAgICB9XSlcblxuICAgIC5mYWN0b3J5KCd3b0ZhY3RvcnknLHJlcXVpcmUoJy4vd28uZmFjJykpXG5cbiAgICAuY29udHJvbGxlcignd29Db250cm9sbGVyJyxyZXF1aXJlKCcuL3dvLmN0cmwnKSlcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgXCJ0aXRsZVwiOiBcIk9yZGVuZXMgZGUgVHJhYmFqb1wiLFxuICAgIFwibGFiZWxzXCI6IHtcbiAgICAgICAgXCJ3by1pZFwiOiBcIk5vLiBvcmRlblwiLFxuICAgICAgICBcImNsLWlkXCI6IFwiY2xpZW50ZVwiLFxuICAgICAgICBcInpvLWlkXCI6IFwiem9uYVwiLFxuICAgICAgICBcIndvLW9yZGVyZWRieVwiOiBcIk9yZGVuYWRvIHBvclwiLFxuICAgICAgICBcIndvLWF0dGVudGlvblwiOiBcIkF0ZW5jacOzblwiLFxuICAgICAgICBcIm1hLWlkXCI6IFwiTWFxdWluYVwiLFxuICAgICAgICBcIndvLXJlbGVhc2VcIjogXCJSZWxlYXNlXCIsXG4gICAgICAgIFwid28tcG9cIjogXCJPcmRlbiBkZSBjb21wcmFcIixcbiAgICAgICAgXCJ3by1saW5lXCI6IFwiTGluZWFcIixcbiAgICAgICAgXCJ3by1saW5ldG90YWxcIjogXCJEZVwiLFxuICAgICAgICBcInByLWlkXCI6IFwiUHJvZHVjdG9cIixcbiAgICAgICAgXCJ3by1xdHlcIjogXCJDYW50aWRhZFwiLFxuICAgICAgICBcIndvLXBhY2thZ2VxdHlcIjogXCJDYW50aWRhZCB4IHBhcXVldGVcIixcbiAgICAgICAgXCJ3by1leGNlZGVudHF0eVwiOiBcIkV4Y2VkZW50ZVwiLFxuICAgICAgICBcIndvLWZvbGlvc3BlcmZvcm1hdFwiOiBcIkZvbGlvcyB4IGZvcm1hdG9cIixcbiAgICAgICAgXCJ3by1mb2xpb3NzZXJpZXNcIjogXCJTZXJpZVwiLFxuICAgICAgICBcIndvLWZvbGlvc2Zyb21cIjogXCJEZWxcIixcbiAgICAgICAgXCJ3by1mb2xpb3N0b1wiOiBcIkFsXCIsXG4gICAgICAgIFwid28tdHlwZVwiOiBcIlRpcG9cIixcbiAgICAgICAgXCJ3by1jb21taXRtZW50ZGF0ZVwiOiBcIkZlY2hhIGNvbXByb21pc29cIixcbiAgICAgICAgXCJ3by1wcmV2aW91c2lkXCI6IFwiSUQgYW50ZXJpb3JcIixcbiAgICAgICAgXCJ3by1wcmV2aW91c2RhdGVcIjogXCJGZWNoYSBhbnRlcmlvclwiLFxuICAgICAgICBcIndvLW5vdGVzXCI6IFwiTm90YXNcIixcbiAgICAgICAgXCJ3by1wcmljZVwiOiBcIlByZWNpb1wiLFxuICAgICAgICBcIndvLWN1cnJlbmN5XCI6IFwiTW9uZWRhXCIsXG4gICAgICAgIFwid28tZW1haWxcIjogXCJFbnZpYXIgQ29ycmVvXCIsXG4gICAgICAgIFwid28tc3RhdHVzXCI6IFwiRXN0YXR1c1wiLFxuICAgICAgICBcIndvLWRhdGVcIjogXCJGZWNoYVwiXG4gICAgfSxcbiAgICBcImNvbHVtbnNcIjogW1xuICAgICAgICBcIndvX2lkXCIsXG4gICAgICAgIFwiY2xfaWRcIixcbiAgICAgICAgXCJ6b19pZFwiLFxuICAgICAgICBcIndvX29yZGVyZWRieVwiLFxuICAgICAgICBcIndvX2F0dGVudGlvblwiLFxuICAgICAgICBcIm1hX2lkXCIsXG4gICAgICAgIFwid29fcmVsZWFzZVwiLFxuICAgICAgICBcIndvX3BvXCIsXG4gICAgICAgIFwid29fbGluZVwiLFxuICAgICAgICBcIndvX2xpbmV0b3RhbFwiLFxuICAgICAgICBcInByX2lkXCIsXG4gICAgICAgIFwid29fcXR5XCIsXG4gICAgICAgIFwid29fcGFja2FnZXF0eVwiLFxuICAgICAgICBcIndvX2V4Y2VkZW50cXR5XCIsXG4gICAgICAgIFwid29fZm9saW9zcGVyZm9ybWF0XCIsXG4gICAgICAgIFwid29fZm9saW9zc2VyaWVzXCIsXG4gICAgICAgIFwid29fZm9saW9zZnJvbVwiLFxuICAgICAgICBcIndvX2ZvbGlvc3RvXCIsXG4gICAgICAgIFwid29fdHlwZVwiLFxuICAgICAgICBcIndvX2NvbW1pdG1lbnRkYXRlXCIsXG4gICAgICAgIFwid29fcHJldmlvdXNpZFwiLFxuICAgICAgICBcIndvX3ByZXZpb3VzZGF0ZVwiLFxuICAgICAgICBcIndvX25vdGVzXCIsXG4gICAgICAgIFwid29fcHJpY2VcIixcbiAgICAgICAgXCJ3b19jdXJyZW5jeVwiLFxuICAgICAgICBcIndvX2VtYWlsXCIsXG4gICAgICAgIFwid29fc3RhdHVzXCIsXG4gICAgICAgIFwid29fZGF0ZVwiXG4gICAgXVxufSIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKGFuZ3VsYXIpe1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBcbiAgICByZXR1cm4gYW5ndWxhci5tb2R1bGUoJ2FwcC53by5hZGQnLFtdKVxuXG4gICAgLmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsXG4gICAgZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnd29BZGQnLCB7XG4gICAgICAgICAgICB1cmw6Jy93by9hZGQvOmNsX2lkJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsIDogJ21vZHVsZXMvd28vbW9kdWxlcy93by5hZGQvd28uYWRkLnZpZXcuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyIDogJ3dvQWRkQ29udHJvbGxlcicsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgcmVxdWlyZXNMb2dpbjogdHJ1ZVxuICAgICAgICAgICAgfSAgICBcbiAgICAgICAgfSk7XG4gICAgfV0pXG5cbiAgICAuZmFjdG9yeSgnd29BZGRGYWN0b3J5JyxyZXF1aXJlKCcuL3dvLmFkZC5mYWMnKSlcblxuICAgIC5jb250cm9sbGVyKCd3b0FkZENvbnRyb2xsZXInLHJlcXVpcmUoJy4vd28uYWRkLmN0cmwnKSlcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgXCJ0aXRsZVwiOiBcIkFncmVnYXIgT3JkZW4gZGUgVHJhYmFqb1wiLFxuICAgIFwibGFiZWxzXCI6IHtcbiAgICAgICAgXCJjbC1pZFwiOiBcImNsaWVudGVcIixcbiAgICAgICAgXCJ6by1pZFwiOiBcInpvbmFcIixcbiAgICAgICAgXCJ3by1vcmRlcmVkYnlcIjogXCJPcmRlbmFkbyBwb3JcIixcbiAgICAgICAgXCJ3by1hdHRlbnRpb25cIjogXCJBdGVuY2nDs25cIixcbiAgICAgICAgXCJtYS1pZFwiOiBcIk1hcXVpbmFcIixcbiAgICAgICAgXCJ3by1yZWxlYXNlXCI6IFwiUmVsZWFzZVwiLFxuICAgICAgICBcIndvLXBvXCI6IFwiT3JkZW4gZGUgY29tcHJhXCIsXG4gICAgICAgIFwid28tbGluZVwiOiBcIkxpbmVhXCIsXG4gICAgICAgIFwid28tbGluZXRvdGFsXCI6IFwiRGVcIixcbiAgICAgICAgXCJwci1pZFwiOiBcIlByb2R1Y3RvXCIsXG4gICAgICAgIFwicHItcGFydG5vXCI6IFwiTm8uIGRlIHBhcnRlXCIsXG4gICAgICAgIFwicHItY29kZVwiOiBcIkNvZGlnb1wiLFxuICAgICAgICBcInByLW5hbWVcIjogXCJOb21icmVcIixcbiAgICAgICAgXCJ3by1xdHlcIjogXCJDYW50aWRhZFwiLFxuICAgICAgICBcIndvLXBhY2thZ2VxdHlcIjogXCJDYW50aWRhZCB4IHBhcXVldGVcIixcbiAgICAgICAgXCJ3by1leGNlZGVudHF0eVwiOiBcIkV4Y2VkZW50ZVwiLFxuICAgICAgICBcIndvLWZvbGlvc3BlcmZvcm1hdFwiOiBcIkZvbGlvcyB4IGZvcm1hdG9cIixcbiAgICAgICAgXCJ3by1mb2xpb3NzZXJpZXNcIjogXCJTZXJpZVwiLFxuICAgICAgICBcIndvLWZvbGlvc2Zyb21cIjogXCJEZWxcIixcbiAgICAgICAgXCJ3by1mb2xpb3N0b1wiOiBcIkFsXCIsXG4gICAgICAgIFwid28tdHlwZVwiOiBcIlRpcG9cIixcbiAgICAgICAgXCJ3by1pZFwiOiBcIk5vLiBvcmRlblwiLFxuICAgICAgICBcIndvLWRhdGVcIjogXCJGZWNoYVwiLFxuICAgICAgICBcIndvLWNvbW1pdG1lbnRkYXRlXCI6IFwiRmVjaGEgY29tcHJvbWlzb1wiLFxuICAgICAgICBcIndvLXByZXZpb3VzaWRcIjogXCJJRCBhbnRlcmlvclwiLFxuICAgICAgICBcIndvLXByZXZpb3VzZGF0ZVwiOiBcIkZlY2hhIGFudGVyaW9yXCIsXG4gICAgICAgIFwid28tbm90ZXNcIjogXCJOb3Rhc1wiLFxuICAgICAgICBcIndvLXByaWNlXCI6IFwiUHJlY2lvXCIsXG4gICAgICAgIFwid28tY3VycmVuY3lcIjogXCJNb25lZGFcIixcbiAgICAgICAgXCJ3by1lbWFpbFwiOiBcIkVudmlhciBDb3JyZW9cIixcbiAgICAgICAgXCJ3by1zdGF0dXNcIjogXCJFc3RhdHVzXCJcbiAgICB9LFxuICAgIFwiY29sdW1uc1wiOiBbXG4gICAgICAgIFwiY2xfaWRcIixcbiAgICAgICAgXCJ6b19pZFwiLFxuICAgICAgICBcIndvX29yZGVyZWRieVwiLFxuICAgICAgICBcIndvX2F0dGVudGlvblwiLFxuICAgICAgICBcIm1hX2lkXCIsXG4gICAgICAgIFwid29fcmVsZWFzZVwiLFxuICAgICAgICBcIndvX3BvXCIsXG4gICAgICAgIFwid29fbGluZVwiLFxuICAgICAgICBcIndvX2xpbmV0b3RhbFwiLFxuICAgICAgICBcInByX2lkXCIsXG4gICAgICAgIFwicHJfcGFydG5vXCIsXG4gICAgICAgIFwicHJfY29kZVwiLFxuICAgICAgICBcInByX25hbWVcIixcbiAgICAgICAgXCJ3b19xdHlcIixcbiAgICAgICAgXCJ3b19wYWNrYWdlcXR5XCIsXG4gICAgICAgIFwid29fZXhjZWRlbnRxdHlcIixcbiAgICAgICAgXCJ3b19mb2xpb3NwZXJmb3JtYXRcIixcbiAgICAgICAgXCJ3b19mb2xpb3NzZXJpZXNcIixcbiAgICAgICAgXCJ3b19mb2xpb3Nmcm9tXCIsXG4gICAgICAgIFwid29fZm9saW9zdG9cIixcbiAgICAgICAgXCJ3b190eXBlXCIsXG4gICAgICAgIFwid29faWRcIixcbiAgICAgICAgXCJ3b19kYXRlXCIsXG4gICAgICAgIFwid29fY29tbWl0bWVudGRhdGVcIixcbiAgICAgICAgXCJ3b19wcmV2aW91c2lkXCIsXG4gICAgICAgIFwid29fcHJldmlvdXNkYXRlXCIsXG4gICAgICAgIFwid29fbm90ZXNcIixcbiAgICAgICAgXCJ3b19wcmljZVwiLFxuICAgICAgICBcIndvX2N1cnJlbmN5XCIsXG4gICAgICAgIFwid29fZW1haWxcIixcbiAgICAgICAgXCJ3by1zdGF0dXNcIlxuICAgIF0sXG4gICAgXCJmaWVsZHNcIjoge1xuICAgICAgICB3b19mb2xpb3NwZXJmb3JtYXRvcHRpb25zOiBbXG4gICAgICAgICAgICB7IFwibGFiZWxcIjogXCIxXCIsIFwidmFsdWVcIjogMSB9LFxuICAgICAgICAgICAgeyBcImxhYmVsXCI6IFwiMlwiLCBcInZhbHVlXCI6IDIgfSxcbiAgICAgICAgICAgIHsgXCJsYWJlbFwiOiBcIjNcIiwgXCJ2YWx1ZVwiOiAzIH0sXG4gICAgICAgICAgICB7IFwibGFiZWxcIjogXCI0XCIsIFwidmFsdWVcIjogNCB9LFxuICAgICAgICAgICAgeyBcImxhYmVsXCI6IFwiNVwiLCBcInZhbHVlXCI6IDUgfSxcbiAgICAgICAgICAgIHsgXCJsYWJlbFwiOiBcIjZcIiwgXCJ2YWx1ZVwiOiA2IH0sXG4gICAgICAgICAgICB7IFwibGFiZWxcIjogXCI3XCIsIFwidmFsdWVcIjogNyB9LFxuICAgICAgICAgICAgeyBcImxhYmVsXCI6IFwiOFwiLCBcInZhbHVlXCI6IDggfSxcbiAgICAgICAgXSxcbiAgICAgICAgd29fY3VycmVuY3lvcHRpb25zOiBbXG4gICAgICAgICAgICB7IFwibGFiZWxcIjogXCJNWE5cIiwgXCJ2YWx1ZVwiOiBcIk1YTlwiIH0sXG4gICAgICAgICAgICB7IFwibGFiZWxcIjogXCJETExTXCIsIFwidmFsdWVcIjogXCJETExTXCIgfSxcbiAgICAgICAgXSxcbiAgICAgICAgd29fZW1haWxvcHRpb25zOiBbXG4gICAgICAgICAgICB7IFwibGFiZWxcIjogXCJTSVwiLCBcInZhbHVlXCI6IFwieWVzXCIgfSxcbiAgICAgICAgICAgIHsgXCJsYWJlbFwiOiBcIk5PXCIsIFwidmFsdWVcIjogXCJub1wiIH0sXG4gICAgICAgIF1cbiAgICB9XG59IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckc2NvcGUnLCAnd29BZGRGYWN0b3J5JywgJyRzdGF0ZVBhcmFtcycsICdpMThuRmlsdGVyJywgJyRmaWx0ZXInLFxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCB3b0FkZEZhY3RvcnksICRzdGF0ZVBhcmFtcywgaTE4bkZpbHRlciwgJGZpbHRlcikge1xuICAgICAgICAgICAgJHNjb3BlLmZtRGF0YSA9IHt9O1xuICAgICAgICAgICAgLy8kc2NvcGUuZm1EYXRhID0ge1wiem9faWRcIjogXCIyXCIsIFwid29fb3JkZXJlZGJ5XCI6IFwiQWxlamFuZHJvXCIsIFwid29fYXR0ZW50aW9uXCI6IFwiTWFyY29cIiwgXCJtYV9pZFwiOiAxLCBcIndvX3JlbGVhc2VcIjogXCJyZWwwMDFcIiwgXCJ3b19wb1wiOiBcIkFCQzAwMVwiLCBcIndvX2xpbmVcIjogXCIxXCIsIFwid29fbGluZXRvdGFsXCI6IFwiNFwiLCBcInByX2lkXCI6IFwiMTVcIiwgXCJ3b19xdHlcIjogXCIxMDBcIiwgXCJ3b19wYWNrYWdlcXR5XCI6IFwiMTBcIiwgXCJ3b19leGNlZGVudHF0eVwiOiBcIjEwXCIsIFwid29fZm9saW9zcGVyZm9ybWF0XCI6IDEsIFwid29fZm9saW9zc2VyaWVzXCI6IFwiQVwiLCBcIndvX2ZvbGlvc2Zyb21cIjogXCIxXCIsIFwid29fZm9saW9zdG9cIjogXCIxMDBcIiwgXCJ3b19jb21taXRtZW50ZGF0ZVwiOiBcIjIwMTYtMDctMDFcIiwgXCJ3b19ub3Rlc1wiOiBcIkVzdGEgZXMgdW5hIG9yZGVuIGRlIHBydWViYVwiLCBcIndvX3ByaWNlXCI6IFwiOTkuOTlcIiwgXCJ3b19jdXJyZW5jeVwiOiBcIkRMTFNcIiwgXCJ3b19lbWFpbFwiOiBcInllc1wiIH07XG4gICAgICAgICAgICAkc2NvcGUuZm1EYXRhLndvX3R5cGUgPSBcIk5cIjsgLy9OLW5ldyxSLXJlcCxDLWNoYW5nZVxuICAgICAgICAgICAgJHNjb3BlLmZtRGF0YS53b19zdGF0dXMgPSBcIkFcIjsgLy9BLUFjdGl2ZSwgQy1DYW5jZWxsZWRcbiAgICAgICAgICAgICRzY29wZS5mbURhdGEuY2xfaWQgPSAkc3RhdGVQYXJhbXMuY2xfaWQ7XG5cbiAgICAgICAgICAgICRzY29wZS53b19mb2xpb3NwZXJmb3JtYXRvcHRpb25zID0gaTE4bkZpbHRlcihcIndvLWFkZC5maWVsZHMud29fZm9saW9zcGVyZm9ybWF0b3B0aW9uc1wiKTtcbiAgICAgICAgICAgICRzY29wZS53b19jdXJyZW5jeW9wdGlvbnMgPSBpMThuRmlsdGVyKFwid28tYWRkLmZpZWxkcy53b19jdXJyZW5jeW9wdGlvbnNcIik7XG4gICAgICAgICAgICAkc2NvcGUud29fZW1haWxvcHRpb25zID0gaTE4bkZpbHRlcihcIndvLWFkZC5maWVsZHMud29fZW1haWxvcHRpb25zXCIpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAkc2NvcGUub25TdWJtaXQgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICB3b0FkZEZhY3RvcnkuYWRkKCRzY29wZS5mbURhdGEpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb21pc2UuZGF0YS5yb3dDb3VudCA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3dvLycrJHN0YXRlUGFyYW1zLmNsX2lkKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS51cGRhdGVGYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgJHNjb3BlLiRvbignJHZpZXdDb250ZW50TG9hZGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIC8vIHRoaXMgY29kZSBpcyBleGVjdXRlZCBhZnRlciB0aGUgdmlldyBpcyBsb2FkZWRcbiAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgd29BZGRGYWN0b3J5LmdldFpvbmUoKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS56b19pZG9wdGlvbnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcm93cyA9IHByb21pc2UuZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChyb3dzLCBmdW5jdGlvbiAodmFsdWUsIGtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHVzaCh7IFwibGFiZWxcIjogcm93c1trZXldWyd6b19qc29uYiddWyd6b19uYW1lJ10sIFwidmFsdWVcIjogcm93c1trZXldWyd6b19pZCddIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgJHNjb3BlLnpvX2lkb3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB3b0FkZEZhY3RvcnkuZ2V0TWFjaGluZSgpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLm1hX2lkb3B0aW9ucyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByb3dzID0gcHJvbWlzZS5kYXRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHJvd3MsIGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wdXNoKHsgXCJsYWJlbFwiOiByb3dzW2tleV1bJ21hX2pzb25iJ11bJ21hX25hbWUnXSwgXCJ2YWx1ZVwiOiByb3dzW2tleV1bJ21hX2lkJ10gfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAkc2NvcGUubWFfaWRvcHRpb25zKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHdvQWRkRmFjdG9yeS5nZXRQcm9kdWN0KCkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUucHJfaWRvcHRpb25zID0gW107XG4gICAgICAgICAgICAgICAgICAgIHZhciByb3dzID0gW107XG4gICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcm93cyA9IHByb21pc2UuZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChyb3dzLCBmdW5jdGlvbiAodmFsdWUsIGtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHVzaCh7IFwibGFiZWxcIjogcm93c1trZXldWydwcl9pZCddICsgJ18nICsgcm93c1trZXldWydwcl9qc29uYiddWydwcl9uYW1lJ10gKyAnXycgKyByb3dzW2tleV1bJ3ByX2pzb25iJ11bJ3ByX2NvZGUnXSwgXCJ2YWx1ZVwiOiByb3dzW2tleV1bJ3ByX2lkJ10gfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAkc2NvcGUucHJfaWRvcHRpb25zKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLiR3YXRjaChcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZm1EYXRhLnByX2lkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBwckNoYW5nZSggbmV3VmFsdWUsIG9sZFZhbHVlICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcm9kdWN0ID0gJGZpbHRlcignZmlsdGVyJykocm93cywgeyBcInByX2lkXCI6IG5ld1ZhbHVlIH0sIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcm9kdWN0Lmxlbmd0aCAhPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUucHJpbmZvID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUucHJpbmZvID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnByb2R1Y3QgPSBwcm9kdWN0WzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZm9saW8gPSAocHJvZHVjdFswXVsncHJfanNvbmInXVsncHJfZm9saW8nXT09PSd5ZXMnKSA/IHRydWUgOiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XTtcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRodHRwJywgJyRxJywgJyRhbGVydHMnLCAnJHN0YXRlUGFyYW1zJywgZnVuY3Rpb24oJGh0dHAsICRxLCAkYWxlcnRzLCAkc3RhdGVQYXJhbXMpIHtcbiAgICAgICAgdmFyIGZhY3RvcnkgPSB7fTtcbiAgICAgICAgZmFjdG9yeS5nZXRab25lID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KCcvem9uZS9jbF9pZCcsIHtcbiAgICAgICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgICAgICBjbF9pZDogJHN0YXRlUGFyYW1zLmNsX2lkXG4gICAgICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc3RhY2tFcnJvciA9IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogZGF0YS5zdGF0dXMsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjogZGF0YS5lcnJvcixcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yVHlwZTogZGF0YS50eXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnOiBjb25maWdcbiAgICAgICAgICAgICAgICAgICAgfSwgbnVsbCwgNCk7XG4gICAgICAgICAgICAgICAgICAgICRhbGVydHMuZXJyb3IoJ1dvb29wcyEgYW4gZXJyb3IgaGFzIG9jdXJyZWQuJywgc3RhY2tFcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeS5nZXRNYWNoaW5lID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KCcvbWFjaGluZScsIHtcbiAgICAgICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgICAgICBjbF9pZDogJHN0YXRlUGFyYW1zLmNsX2lkXG4gICAgICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc3RhY2tFcnJvciA9IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogZGF0YS5zdGF0dXMsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjogZGF0YS5lcnJvcixcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yVHlwZTogZGF0YS50eXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnOiBjb25maWdcbiAgICAgICAgICAgICAgICAgICAgfSwgbnVsbCwgNCk7XG4gICAgICAgICAgICAgICAgICAgICRhbGVydHMuZXJyb3IoJ1dvb29wcyEgYW4gZXJyb3IgaGFzIG9jdXJyZWQuJywgc3RhY2tFcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeS5nZXRQcm9kdWN0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KCcvcHJvZHVjdC9jbF9pZCcsIHtcbiAgICAgICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgICAgICBjbF9pZDogJHN0YXRlUGFyYW1zLmNsX2lkLFxuICAgICAgICAgICAgICAgICAgICBwcl9zdGF0dXM6ICdBJ1xuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0YWNrRXJyb3IgPSBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IGRhdGEuc3RhdHVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGRhdGEuZXJyb3IsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvclR5cGU6IGRhdGEudHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZzogY29uZmlnXG4gICAgICAgICAgICAgICAgICAgIH0sIG51bGwsIDQpO1xuICAgICAgICAgICAgICAgICAgICAkYWxlcnRzLmVycm9yKCdXb29vcHMhIGFuIGVycm9yIGhhcyBvY3VycmVkLicsIHN0YWNrRXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkuYWRkID0gZnVuY3Rpb24od29fanNvbmIpIHtcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gJGh0dHAucG9zdCgnL3dvL2FkZCcsIHtcbiAgICAgICAgICAgICAgICAvKiBQT1NUIHZhcmlhYmxlcyBoZXJlICovXG4gICAgICAgICAgICAgICAgd29fanNvbmI6IHdvX2pzb25iXG4gICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgIHZhciBzdGFja0Vycm9yID0gSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiBkYXRhLnN0YXR1cyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yOiBkYXRhLmVycm9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JUeXBlOiBkYXRhLnR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25maWc6IGNvbmZpZ1xuICAgICAgICAgICAgICAgICAgICB9LCBudWxsLCA0KTtcbiAgICAgICAgICAgICAgICAgICAgJGFsZXJ0cy5lcnJvcignV29vb3BzISBhbiBlcnJvciBoYXMgb2N1cnJlZC4nLCBzdGFja0Vycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBmYWN0b3J5O1xuICAgIH1dO1xuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbihhbmd1bGFyKXtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgXG4gICAgcmV0dXJuIGFuZ3VsYXIubW9kdWxlKCdhcHAud28uZHVwbGljYXRlJyxbXSlcblxuICAgIC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLFxuICAgIGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcbiAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3dvRHVwbGljYXRlJywge1xuICAgICAgICAgICAgdXJsOicvd28vZHVwbGljYXRlLzpjbF9pZC86d29faWQnLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmwgOiAnbW9kdWxlcy93by9tb2R1bGVzL3dvLmR1cGxpY2F0ZS93by5kdXBsaWNhdGUudmlldy5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXIgOiAnd29EdXBsaWNhdGVDb250cm9sbGVyJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICByZXF1aXJlc0xvZ2luOiB0cnVlXG4gICAgICAgICAgICB9ICAgIFxuICAgICAgICB9KTtcbiAgICB9XSlcblxuICAgIC5mYWN0b3J5KCd3b0R1cGxpY2F0ZUZhY3RvcnknLHJlcXVpcmUoJy4vd28uZHVwbGljYXRlLmZhYycpKVxuXG4gICAgLmNvbnRyb2xsZXIoJ3dvRHVwbGljYXRlQ29udHJvbGxlcicscmVxdWlyZSgnLi93by5kdXBsaWNhdGUuY3RybCcpKVxuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRzY29wZScsICd3b0R1cGxpY2F0ZUZhY3RvcnknLCAnJHN0YXRlUGFyYW1zJywgJ2kxOG5GaWx0ZXInLCAnJGZpbHRlcicsXG4gICAgICAgIGZ1bmN0aW9uICgkc2NvcGUsIHdvRHVwbGljYXRlRmFjdG9yeSwgJHN0YXRlUGFyYW1zLCBpMThuRmlsdGVyLCAkZmlsdGVyKSB7XG5cbiAgICAgICAgICAgICRzY29wZS53b19mb2xpb3NwZXJmb3JtYXRvcHRpb25zID0gaTE4bkZpbHRlcihcIndvLWFkZC5maWVsZHMud29fZm9saW9zcGVyZm9ybWF0b3B0aW9uc1wiKTtcbiAgICAgICAgICAgICRzY29wZS53b19jdXJyZW5jeW9wdGlvbnMgPSBpMThuRmlsdGVyKFwid28tYWRkLmZpZWxkcy53b19jdXJyZW5jeW9wdGlvbnNcIik7XG4gICAgICAgICAgICAkc2NvcGUud29fZW1haWxvcHRpb25zID0gaTE4bkZpbHRlcihcIndvLWFkZC5maWVsZHMud29fZW1haWxvcHRpb25zXCIpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAkc2NvcGUub25TdWJtaXQgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICB3b0R1cGxpY2F0ZUZhY3RvcnkuYWRkKCRzY29wZS5mbURhdGEpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb21pc2UuZGF0YS5yb3dDb3VudCA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3dvLycrJHN0YXRlUGFyYW1zLmNsX2lkKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS51cGRhdGVGYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgJHNjb3BlLiRvbignJHZpZXdDb250ZW50TG9hZGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIC8vIHRoaXMgY29kZSBpcyBleGVjdXRlZCBhZnRlciB0aGUgdmlldyBpcyBsb2FkZWRcbiAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgd29EdXBsaWNhdGVGYWN0b3J5LmdldERhdGEoKS50aGVuKGZ1bmN0aW9uKHByb21pc2Upe1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBpZihhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhKSAmJiBwcm9taXNlLmRhdGEubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmZtRGF0YSA9IHByb21pc2UuZGF0YVswXS53b19qc29uYjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZm1EYXRhLndvX3ByZXZpb3VzaWQgPSBwcm9taXNlLmRhdGFbMF0ud29faWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmZtRGF0YS53b19wcmV2aW91c2RhdGUgPSBwcm9taXNlLmRhdGFbMF0ud29fZGF0ZS5zdWJzdHJpbmcoMCwgMTApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgd29EdXBsaWNhdGVGYWN0b3J5LmdldFpvbmUoKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS56b19pZG9wdGlvbnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcm93cyA9IHByb21pc2UuZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChyb3dzLCBmdW5jdGlvbiAodmFsdWUsIGtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHVzaCh7IFwibGFiZWxcIjogcm93c1trZXldWyd6b19qc29uYiddWyd6b19uYW1lJ10sIFwidmFsdWVcIjogcm93c1trZXldWyd6b19pZCddIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgJHNjb3BlLnpvX2lkb3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB3b0R1cGxpY2F0ZUZhY3RvcnkuZ2V0TWFjaGluZSgpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLm1hX2lkb3B0aW9ucyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByb3dzID0gcHJvbWlzZS5kYXRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHJvd3MsIGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wdXNoKHsgXCJsYWJlbFwiOiByb3dzW2tleV1bJ21hX2pzb25iJ11bJ21hX25hbWUnXSwgXCJ2YWx1ZVwiOiByb3dzW2tleV1bJ21hX2lkJ10gfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAkc2NvcGUubWFfaWRvcHRpb25zKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHdvRHVwbGljYXRlRmFjdG9yeS5nZXRQcm9kdWN0KCkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUucHJfaWRvcHRpb25zID0gW107XG4gICAgICAgICAgICAgICAgICAgIHZhciByb3dzID0gW107XG4gICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcm93cyA9IHByb21pc2UuZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChyb3dzLCBmdW5jdGlvbiAodmFsdWUsIGtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHVzaCh7IFwibGFiZWxcIjogcm93c1trZXldWydwcl9pZCddICsgJ18nICsgcm93c1trZXldWydwcl9qc29uYiddWydwcl9uYW1lJ10gKyAnXycgKyByb3dzW2tleV1bJ3ByX2pzb25iJ11bJ3ByX2NvZGUnXSwgXCJ2YWx1ZVwiOiByb3dzW2tleV1bJ3ByX2lkJ10gfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAkc2NvcGUucHJfaWRvcHRpb25zKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLiR3YXRjaChcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZm1EYXRhLnByX2lkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBwckNoYW5nZSggbmV3VmFsdWUsIG9sZFZhbHVlICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcm9kdWN0ID0gJGZpbHRlcignZmlsdGVyJykocm93cywgeyBcInByX2lkXCI6IG5ld1ZhbHVlIH0sIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcm9kdWN0Lmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnByaW5mbyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnByaW5mbyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5wcm9kdWN0ID0gcHJvZHVjdFswXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmZvbGlvID0gKHByb2R1Y3RbMF1bJ3ByX2pzb25iJ11bJ3ByX2ZvbGlvJ109PT0neWVzJykgPyB0cnVlIDogZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfV07XG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgcmV0dXJuIFsnJGh0dHAnLCAnJHEnLCAnJGFsZXJ0cycsICckc3RhdGVQYXJhbXMnLCBmdW5jdGlvbiAoJGh0dHAsICRxLCAkYWxlcnRzLCAkc3RhdGVQYXJhbXMpIHtcbiAgICAgICAgdmFyIGZhY3RvcnkgPSB7fTtcbiAgICAgICAgZmFjdG9yeS5nZXREYXRhID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoXG4gICAgICAgICAgICAgICAgJGh0dHAucG9zdCgnL3dvL3dvX2lkJywge1xuICAgICAgICAgICAgICAgICAgICAvKiBQT1NUIHZhcmlhYmxlcyBoZXJlICovXG4gICAgICAgICAgICAgICAgICAgIGNsX2lkOiAkc3RhdGVQYXJhbXMuY2xfaWQsXG4gICAgICAgICAgICAgICAgICAgIHdvX2lkOiAkc3RhdGVQYXJhbXMud29faWRcbiAgICAgICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0YWNrRXJyb3IgPSBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IGRhdGEuc3RhdHVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGRhdGEuZXJyb3IsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvclR5cGU6IGRhdGEudHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZzogY29uZmlnXG4gICAgICAgICAgICAgICAgICAgIH0sIG51bGwsIDQpO1xuICAgICAgICAgICAgICAgICAgICAkYWxlcnRzLmVycm9yKCdXb29vcHMhIGFuIGVycm9yIGhhcyBvY3VycmVkLicsIHN0YWNrRXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkuZ2V0Wm9uZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKFxuICAgICAgICAgICAgICAgICRodHRwLnBvc3QoJy96b25lL2NsX2lkJywge1xuICAgICAgICAgICAgICAgICAgICAvKiBQT1NUIHZhcmlhYmxlcyBoZXJlICovXG4gICAgICAgICAgICAgICAgICAgIGNsX2lkOiAkc3RhdGVQYXJhbXMuY2xfaWRcbiAgICAgICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0YWNrRXJyb3IgPSBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IGRhdGEuc3RhdHVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGRhdGEuZXJyb3IsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvclR5cGU6IGRhdGEudHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZzogY29uZmlnXG4gICAgICAgICAgICAgICAgICAgIH0sIG51bGwsIDQpO1xuICAgICAgICAgICAgICAgICAgICAkYWxlcnRzLmVycm9yKCdXb29vcHMhIGFuIGVycm9yIGhhcyBvY3VycmVkLicsIHN0YWNrRXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkuZ2V0TWFjaGluZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKFxuICAgICAgICAgICAgICAgICRodHRwLnBvc3QoJy9tYWNoaW5lJywge1xuICAgICAgICAgICAgICAgICAgICAvKiBQT1NUIHZhcmlhYmxlcyBoZXJlICovXG4gICAgICAgICAgICAgICAgICAgIGNsX2lkOiAkc3RhdGVQYXJhbXMuY2xfaWRcbiAgICAgICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0YWNrRXJyb3IgPSBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IGRhdGEuc3RhdHVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGRhdGEuZXJyb3IsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvclR5cGU6IGRhdGEudHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZzogY29uZmlnXG4gICAgICAgICAgICAgICAgICAgIH0sIG51bGwsIDQpO1xuICAgICAgICAgICAgICAgICAgICAkYWxlcnRzLmVycm9yKCdXb29vcHMhIGFuIGVycm9yIGhhcyBvY3VycmVkLicsIHN0YWNrRXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkuZ2V0UHJvZHVjdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKFxuICAgICAgICAgICAgICAgICRodHRwLnBvc3QoJy9wcm9kdWN0L2NsX2lkJywge1xuICAgICAgICAgICAgICAgICAgICAvKiBQT1NUIHZhcmlhYmxlcyBoZXJlICovXG4gICAgICAgICAgICAgICAgICAgIGNsX2lkOiAkc3RhdGVQYXJhbXMuY2xfaWQsXG4gICAgICAgICAgICAgICAgICAgIHByX3N0YXR1czogJ0EnXG4gICAgICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzdGFja0Vycm9yID0gSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiBkYXRhLnN0YXR1cyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yOiBkYXRhLmVycm9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JUeXBlOiBkYXRhLnR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25maWc6IGNvbmZpZ1xuICAgICAgICAgICAgICAgICAgICB9LCBudWxsLCA0KTtcbiAgICAgICAgICAgICAgICAgICAgJGFsZXJ0cy5lcnJvcignV29vb3BzISBhbiBlcnJvciBoYXMgb2N1cnJlZC4nLCBzdGFja0Vycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICBmYWN0b3J5LmFkZCA9IGZ1bmN0aW9uICh3b19qc29uYikge1xuICAgICAgICAgICAgdmFyIHByb21pc2UgPSAkaHR0cC5wb3N0KCcvd28vYWRkJywge1xuICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICB3b19qc29uYjogd29fanNvbmJcbiAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoY29uZmlnKSlcbiAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KGNvbmZpZykpXG4gICAgICAgICAgICAgICAgdmFyIHN0YWNrRXJyb3IgPSBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogZGF0YS5zdGF0dXMsXG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBkYXRhLmVycm9yLFxuICAgICAgICAgICAgICAgICAgICBlcnJvclR5cGU6IGRhdGEudHlwZSxcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnOiBjb25maWdcbiAgICAgICAgICAgICAgICB9LCBudWxsLCA0KTtcbiAgICAgICAgICAgICAgICAkYWxlcnRzLmVycm9yKCdXb29vcHMhIGFuIGVycm9yIGhhcyBvY3VycmVkLicsIHN0YWNrRXJyb3IpO1xuICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZmFjdG9yeTtcbiAgICB9XTtcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oYW5ndWxhcil7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIFxuICAgIHJldHVybiBhbmd1bGFyLm1vZHVsZSgnYXBwLndvLnVwZGF0ZScsW10pXG5cbiAgICAuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJyxcbiAgICBmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCd3b1VwZGF0ZScsIHtcbiAgICAgICAgICAgIHVybDonL3dvL3VwZGF0ZS86Y2xfaWQvOndvX2lkJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsIDogJ21vZHVsZXMvd28vbW9kdWxlcy93by51cGRhdGUvd28udXBkYXRlLnZpZXcuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyIDogJ3dvVXBkYXRlQ29udHJvbGxlcicsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgcmVxdWlyZXNMb2dpbjogdHJ1ZVxuICAgICAgICAgICAgfSAgICBcbiAgICAgICAgfSk7XG4gICAgfV0pXG5cbiAgICAuZmFjdG9yeSgnd29VcGRhdGVGYWN0b3J5JyxyZXF1aXJlKCcuL3dvLnVwZGF0ZS5mYWMnKSlcblxuICAgIC5jb250cm9sbGVyKCd3b1VwZGF0ZUNvbnRyb2xsZXInLHJlcXVpcmUoJy4vd28udXBkYXRlLmN0cmwnKSlcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgXCJ0aXRsZVwiOiBcIkFjdHVhbGl6YXIgT3JkZW4gZGUgVHJhYmFqb1wiLFxuICAgIFwibGFiZWxzXCI6IHtcbiAgICAgICAgXCJjbC1pZFwiOiBcImNsaWVudGVcIixcbiAgICAgICAgXCJ6by1pZFwiOiBcInpvbmFcIixcbiAgICAgICAgXCJ3by1vcmRlcmVkYnlcIjogXCJPcmRlbmFkbyBwb3JcIixcbiAgICAgICAgXCJ3by1hdHRlbnRpb25cIjogXCJBdGVuY2nDs25cIixcbiAgICAgICAgXCJtYS1pZFwiOiBcIk1hcXVpbmFcIixcbiAgICAgICAgXCJ3by1yZWxlYXNlXCI6IFwiUmVsZWFzZVwiLFxuICAgICAgICBcIndvLXBvXCI6IFwiT3JkZW4gZGUgY29tcHJhXCIsXG4gICAgICAgIFwid28tbGluZVwiOiBcIkxpbmVhXCIsXG4gICAgICAgIFwid28tbGluZXRvdGFsXCI6IFwiRGVcIixcbiAgICAgICAgXCJwci1pZFwiOiBcIlByb2R1Y3RvXCIsXG4gICAgICAgIFwicHItcGFydG5vXCI6IFwiTm8uIGRlIHBhcnRlXCIsXG4gICAgICAgIFwicHItY29kZVwiOiBcIkNvZGlnb1wiLFxuICAgICAgICBcInByLW5hbWVcIjogXCJOb21icmVcIixcbiAgICAgICAgXCJ3by1xdHlcIjogXCJDYW50aWRhZFwiLFxuICAgICAgICBcIndvLXBhY2thZ2VxdHlcIjogXCJDYW50aWRhZCB4IHBhcXVldGVcIixcbiAgICAgICAgXCJ3by1leGNlZGVudHF0eVwiOiBcIkV4Y2VkZW50ZVwiLFxuICAgICAgICBcIndvLWZvbGlvc3BlcmZvcm1hdFwiOiBcIkZvbGlvcyB4IGZvcm1hdG9cIixcbiAgICAgICAgXCJ3by1mb2xpb3NzZXJpZXNcIjogXCJTZXJpZVwiLFxuICAgICAgICBcIndvLWZvbGlvc2Zyb21cIjogXCJEZWxcIixcbiAgICAgICAgXCJ3by1mb2xpb3N0b1wiOiBcIkFsXCIsXG4gICAgICAgIFwid28tdHlwZVwiOiBcIlRpcG9cIixcbiAgICAgICAgXCJ3by1pZFwiOiBcIk5vLiBvcmRlblwiLFxuICAgICAgICBcIndvLWRhdGVcIjogXCJGZWNoYVwiLFxuICAgICAgICBcIndvLWNvbW1pdG1lbnRkYXRlXCI6IFwiRmVjaGEgY29tcHJvbWlzb1wiLFxuICAgICAgICBcIndvLXByZXZpb3VzaWRcIjogXCJJRCBhbnRlcmlvclwiLFxuICAgICAgICBcIndvLXByZXZpb3VzZGF0ZVwiOiBcIkZlY2hhIGFudGVyaW9yXCIsXG4gICAgICAgIFwid28tbm90ZXNcIjogXCJOb3Rhc1wiLFxuICAgICAgICBcIndvLXByaWNlXCI6IFwiUHJlY2lvXCIsXG4gICAgICAgIFwid28tY3VycmVuY3lcIjogXCJNb25lZGFcIixcbiAgICAgICAgXCJ3by1lbWFpbFwiOiBcIkVudmlhciBDb3JyZW9cIixcbiAgICAgICAgXCJ3by1zdGF0dXNcIjogXCJFc3RhdHVzXCJcbiAgICB9LFxuICAgIFwiY29sdW1uc1wiOiBbXG4gICAgICAgIFwiY2xfaWRcIixcbiAgICAgICAgXCJ6b19pZFwiLFxuICAgICAgICBcIndvX29yZGVyZWRieVwiLFxuICAgICAgICBcIndvX2F0dGVudGlvblwiLFxuICAgICAgICBcIm1hX2lkXCIsXG4gICAgICAgIFwid29fcmVsZWFzZVwiLFxuICAgICAgICBcIndvX3BvXCIsXG4gICAgICAgIFwid29fbGluZVwiLFxuICAgICAgICBcIndvX2xpbmV0b3RhbFwiLFxuICAgICAgICBcInByX2lkXCIsXG4gICAgICAgIFwicHJfcGFydG5vXCIsXG4gICAgICAgIFwicHJfY29kZVwiLFxuICAgICAgICBcInByX25hbWVcIixcbiAgICAgICAgXCJ3b19xdHlcIixcbiAgICAgICAgXCJ3b19wYWNrYWdlcXR5XCIsXG4gICAgICAgIFwid29fZXhjZWRlbnRxdHlcIixcbiAgICAgICAgXCJ3b19mb2xpb3NwZXJmb3JtYXRcIixcbiAgICAgICAgXCJ3b19mb2xpb3NzZXJpZXNcIixcbiAgICAgICAgXCJ3b19mb2xpb3Nmcm9tXCIsXG4gICAgICAgIFwid29fZm9saW9zdG9cIixcbiAgICAgICAgXCJ3b190eXBlXCIsXG4gICAgICAgIFwid29faWRcIixcbiAgICAgICAgXCJ3b19kYXRlXCIsXG4gICAgICAgIFwid29fY29tbWl0bWVudGRhdGVcIixcbiAgICAgICAgXCJ3b19wcmV2aW91c2lkXCIsXG4gICAgICAgIFwid29fcHJldmlvdXNkYXRlXCIsXG4gICAgICAgIFwid29fbm90ZXNcIixcbiAgICAgICAgXCJ3b19wcmljZVwiLFxuICAgICAgICBcIndvX2N1cnJlbmN5XCIsXG4gICAgICAgIFwid29fZW1haWxcIixcbiAgICAgICAgXCJ3by1zdGF0dXNcIlxuICAgIF0sXG4gICAgXCJmaWVsZHNcIjoge1xuICAgICAgICB3b19mb2xpb3NwZXJmb3JtYXRvcHRpb25zOiBbXG4gICAgICAgICAgICB7IFwibGFiZWxcIjogXCIxXCIsIFwidmFsdWVcIjogMSB9LFxuICAgICAgICAgICAgeyBcImxhYmVsXCI6IFwiMlwiLCBcInZhbHVlXCI6IDIgfSxcbiAgICAgICAgICAgIHsgXCJsYWJlbFwiOiBcIjNcIiwgXCJ2YWx1ZVwiOiAzIH0sXG4gICAgICAgICAgICB7IFwibGFiZWxcIjogXCI0XCIsIFwidmFsdWVcIjogNCB9LFxuICAgICAgICAgICAgeyBcImxhYmVsXCI6IFwiNVwiLCBcInZhbHVlXCI6IDUgfSxcbiAgICAgICAgICAgIHsgXCJsYWJlbFwiOiBcIjZcIiwgXCJ2YWx1ZVwiOiA2IH0sXG4gICAgICAgICAgICB7IFwibGFiZWxcIjogXCI3XCIsIFwidmFsdWVcIjogNyB9LFxuICAgICAgICAgICAgeyBcImxhYmVsXCI6IFwiOFwiLCBcInZhbHVlXCI6IDggfSxcbiAgICAgICAgXSxcbiAgICAgICAgd29fY3VycmVuY3lvcHRpb25zOiBbXG4gICAgICAgICAgICB7IFwibGFiZWxcIjogXCJNWE5cIiwgXCJ2YWx1ZVwiOiBcIk1YTlwiIH0sXG4gICAgICAgICAgICB7IFwibGFiZWxcIjogXCJETExTXCIsIFwidmFsdWVcIjogXCJETExTXCIgfSxcbiAgICAgICAgXSxcbiAgICAgICAgd29fZW1haWxvcHRpb25zOiBbXG4gICAgICAgICAgICB7IFwibGFiZWxcIjogXCJTSVwiLCBcInZhbHVlXCI6IFwieWVzXCIgfSxcbiAgICAgICAgICAgIHsgXCJsYWJlbFwiOiBcIk5PXCIsIFwidmFsdWVcIjogXCJub1wiIH0sXG4gICAgICAgIF1cbiAgICB9XG59IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckc2NvcGUnLCAnd29VcGRhdGVGYWN0b3J5JywgJyRzdGF0ZVBhcmFtcycsICdpMThuRmlsdGVyJywgJyRmaWx0ZXInLCckbG9jYXRpb24nLFxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCB3b1VwZGF0ZUZhY3RvcnksICRzdGF0ZVBhcmFtcywgaTE4bkZpbHRlciwgJGZpbHRlciwgJGxvY2F0aW9uKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICRzY29wZS53b19mb2xpb3NwZXJmb3JtYXRvcHRpb25zID0gaTE4bkZpbHRlcihcIndvLWFkZC5maWVsZHMud29fZm9saW9zcGVyZm9ybWF0b3B0aW9uc1wiKTtcbiAgICAgICAgICAgICRzY29wZS53b19jdXJyZW5jeW9wdGlvbnMgPSBpMThuRmlsdGVyKFwid28tYWRkLmZpZWxkcy53b19jdXJyZW5jeW9wdGlvbnNcIik7XG4gICAgICAgICAgICAkc2NvcGUud29fZW1haWxvcHRpb25zID0gaTE4bkZpbHRlcihcIndvLWFkZC5maWVsZHMud29fZW1haWxvcHRpb25zXCIpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAkc2NvcGUub25TdWJtaXQgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICB3b1VwZGF0ZUZhY3RvcnkudXBkYXRlKCRzY29wZS5mbURhdGEpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb21pc2UuZGF0YS5yb3dDb3VudCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy93by8nKyRzdGF0ZVBhcmFtcy5jbF9pZCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICRzY29wZS4kb24oJyR2aWV3Q29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAvLyB0aGlzIGNvZGUgaXMgZXhlY3V0ZWQgYWZ0ZXIgdGhlIHZpZXcgaXMgbG9hZGVkXG4gICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHdvVXBkYXRlRmFjdG9yeS5nZXREYXRhKCkudGhlbihmdW5jdGlvbihwcm9taXNlKXtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgaWYoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YSkgJiYgcHJvbWlzZS5kYXRhLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5mbURhdGEgPSBwcm9taXNlLmRhdGFbMF0ud29fanNvbmI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLndvX2lkID0gcHJvbWlzZS5kYXRhWzBdLndvX2lkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS53b19kYXRlID0gcHJvbWlzZS5kYXRhWzBdLndvX2RhdGU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB3b1VwZGF0ZUZhY3RvcnkuZ2V0Wm9uZSgpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnpvX2lkb3B0aW9ucyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByb3dzID0gcHJvbWlzZS5kYXRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHJvd3MsIGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wdXNoKHsgXCJsYWJlbFwiOiByb3dzW2tleV1bJ3pvX2pzb25iJ11bJ3pvX25hbWUnXSwgXCJ2YWx1ZVwiOiByb3dzW2tleV1bJ3pvX2lkJ10gfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAkc2NvcGUuem9faWRvcHRpb25zKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHdvVXBkYXRlRmFjdG9yeS5nZXRNYWNoaW5lKCkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUubWFfaWRvcHRpb25zID0gW107XG4gICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJvd3MgPSBwcm9taXNlLmRhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2gocm93cywgZnVuY3Rpb24gKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnB1c2goeyBcImxhYmVsXCI6IHJvd3Nba2V5XVsnbWFfanNvbmInXVsnbWFfbmFtZSddLCBcInZhbHVlXCI6IHJvd3Nba2V5XVsnbWFfaWQnXSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sICRzY29wZS5tYV9pZG9wdGlvbnMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgd29VcGRhdGVGYWN0b3J5LmdldFByb2R1Y3QoKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5wcl9pZG9wdGlvbnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJvd3MgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3dzID0gcHJvbWlzZS5kYXRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHJvd3MsIGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wdXNoKHsgXCJsYWJlbFwiOiByb3dzW2tleV1bJ3ByX2lkJ10gKyAnXycgKyByb3dzW2tleV1bJ3ByX2pzb25iJ11bJ3ByX25hbWUnXSArICdfJyArIHJvd3Nba2V5XVsncHJfanNvbmInXVsncHJfY29kZSddLCBcInZhbHVlXCI6IHJvd3Nba2V5XVsncHJfaWQnXSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sICRzY29wZS5wcl9pZG9wdGlvbnMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuJHdhdGNoKFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJmbURhdGEucHJfaWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHByQ2hhbmdlKCBuZXdWYWx1ZSwgb2xkVmFsdWUgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHByb2R1Y3QgPSAkZmlsdGVyKCdmaWx0ZXInKShyb3dzLCB7IFwicHJfaWRcIjogbmV3VmFsdWUgfSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByb2R1Y3QubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUucHJpbmZvID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUucHJpbmZvID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnByb2R1Y3QgPSBwcm9kdWN0WzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZm9saW8gPSAocHJvZHVjdFswXVsncHJfanNvbmInXVsncHJfZm9saW8nXT09PSd5ZXMnKSA/IHRydWUgOiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XTtcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckaHR0cCcsICckcScsICckYWxlcnRzJywgJyRzdGF0ZVBhcmFtcycsIGZ1bmN0aW9uICgkaHR0cCwgJHEsICRhbGVydHMsICRzdGF0ZVBhcmFtcykge1xuICAgICAgICB2YXIgZmFjdG9yeSA9IHt9O1xuICAgICAgICBmYWN0b3J5LmdldERhdGEgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KCcvd28vd29faWQnLCB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICAgICAgY2xfaWQ6ICRzdGF0ZVBhcmFtcy5jbF9pZCxcbiAgICAgICAgICAgICAgICAgICAgd29faWQ6ICRzdGF0ZVBhcmFtcy53b19pZFxuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc3RhY2tFcnJvciA9IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogZGF0YS5zdGF0dXMsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjogZGF0YS5lcnJvcixcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yVHlwZTogZGF0YS50eXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnOiBjb25maWdcbiAgICAgICAgICAgICAgICAgICAgfSwgbnVsbCwgNCk7XG4gICAgICAgICAgICAgICAgICAgICRhbGVydHMuZXJyb3IoJ1dvb29wcyEgYW4gZXJyb3IgaGFzIG9jdXJyZWQuJywgc3RhY2tFcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeS5nZXRab25lID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoXG4gICAgICAgICAgICAgICAgJGh0dHAucG9zdCgnL3pvbmUvY2xfaWQnLCB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICAgICAgY2xfaWQ6ICRzdGF0ZVBhcmFtcy5jbF9pZFxuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc3RhY2tFcnJvciA9IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogZGF0YS5zdGF0dXMsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjogZGF0YS5lcnJvcixcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yVHlwZTogZGF0YS50eXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnOiBjb25maWdcbiAgICAgICAgICAgICAgICAgICAgfSwgbnVsbCwgNCk7XG4gICAgICAgICAgICAgICAgICAgICRhbGVydHMuZXJyb3IoJ1dvb29wcyEgYW4gZXJyb3IgaGFzIG9jdXJyZWQuJywgc3RhY2tFcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeS5nZXRNYWNoaW5lID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoXG4gICAgICAgICAgICAgICAgJGh0dHAucG9zdCgnL21hY2hpbmUnLCB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICAgICAgY2xfaWQ6ICRzdGF0ZVBhcmFtcy5jbF9pZFxuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc3RhY2tFcnJvciA9IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogZGF0YS5zdGF0dXMsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjogZGF0YS5lcnJvcixcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yVHlwZTogZGF0YS50eXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnOiBjb25maWdcbiAgICAgICAgICAgICAgICAgICAgfSwgbnVsbCwgNCk7XG4gICAgICAgICAgICAgICAgICAgICRhbGVydHMuZXJyb3IoJ1dvb29wcyEgYW4gZXJyb3IgaGFzIG9jdXJyZWQuJywgc3RhY2tFcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeS5nZXRQcm9kdWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoXG4gICAgICAgICAgICAgICAgJGh0dHAucG9zdCgnL3Byb2R1Y3QvY2xfaWQnLCB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICAgICAgY2xfaWQ6ICRzdGF0ZVBhcmFtcy5jbF9pZCxcbiAgICAgICAgICAgICAgICAgICAgcHJfc3RhdHVzOiAnQSdcbiAgICAgICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0YWNrRXJyb3IgPSBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IGRhdGEuc3RhdHVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGRhdGEuZXJyb3IsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvclR5cGU6IGRhdGEudHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZzogY29uZmlnXG4gICAgICAgICAgICAgICAgICAgIH0sIG51bGwsIDQpO1xuICAgICAgICAgICAgICAgICAgICAkYWxlcnRzLmVycm9yKCdXb29vcHMhIGFuIGVycm9yIGhhcyBvY3VycmVkLicsIHN0YWNrRXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkudXBkYXRlID0gZnVuY3Rpb24gKHdvX2pzb25iKSB7XG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9ICRodHRwLnBvc3QoJy93by91cGRhdGUnLCB7XG4gICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgIHdvX2pzb25iOiB3b19qc29uYixcbiAgICAgICAgICAgICAgICB3b19pZDogJHN0YXRlUGFyYW1zLndvX2lkXG4gICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgdmFyIHN0YWNrRXJyb3IgPSBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogZGF0YS5zdGF0dXMsXG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBkYXRhLmVycm9yLFxuICAgICAgICAgICAgICAgICAgICBlcnJvclR5cGU6IGRhdGEudHlwZSxcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnOiBjb25maWdcbiAgICAgICAgICAgICAgICB9LCBudWxsLCA0KTtcbiAgICAgICAgICAgICAgICAkYWxlcnRzLmVycm9yKCdXb29vcHMhIGFuIGVycm9yIGhhcyBvY3VycmVkLicsIHN0YWNrRXJyb3IpO1xuICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZmFjdG9yeTtcbiAgICB9XTtcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckc2NvcGUnLCAnd29GYWN0b3J5JywgJyRsb2NhdGlvbicsICdpMThuRmlsdGVyJywgJyRzdGF0ZVBhcmFtcycsXG4gICAgICAgIGZ1bmN0aW9uICgkc2NvcGUsIHdvRmFjdG9yeSwgJGxvY2F0aW9uLCBpMThuRmlsdGVyLCAkc3RhdGVQYXJhbXMpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgJHNjb3BlLmxhYmVscyA9IE9iamVjdC5rZXlzKGkxOG5GaWx0ZXIoXCJ3by5sYWJlbHNcIikpO1xuICAgICAgICAgICAgJHNjb3BlLmNvbHVtbnMgPSBpMThuRmlsdGVyKFwid28uY29sdW1uc1wiKTtcblxuICAgICAgICAgICAgJHNjb3BlLmVkaXQgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc051bWJlcihpZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGxpbmsgPSBcIiMvd28vdXBkYXRlL1wiICsgaWQ7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IGxpbms7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgJHNjb3BlLmR1cGxpY2F0ZSA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzTnVtYmVyKGlkKSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbGluayA9IFwiIy93by9kdXBsaWNhdGUvXCIgKyBpZDtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uID0gbGluaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBmb3JtYXRJdGVtIGV2ZW50IGhhbmRsZXJcbiAgICAgICAgICAgIHZhciB3b19pZDtcbiAgICAgICAgICAgICRzY29wZS5mb3JtYXRJdGVtID0gZnVuY3Rpb24gKHMsIGUsIGNlbGwpIHtcblxuICAgICAgICAgICAgICAgIGlmIChlLnBhbmVsLmNlbGxUeXBlID09IHdpam1vLmdyaWQuQ2VsbFR5cGUuUm93SGVhZGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGUuY2VsbC50ZXh0Q29udGVudCA9IGUucm93ICsgMTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBzLnJvd3MuZGVmYXVsdFNpemUgPSAzMDtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIGFkZCBCb290c3RyYXAgaHRtbFxuICAgICAgICAgICAgICAgIGlmICgoZS5wYW5lbC5jZWxsVHlwZSA9PSB3aWptby5ncmlkLkNlbGxUeXBlLkNlbGwpICYmIChlLmNvbCA9PSAwKSkge1xuICAgICAgICAgICAgICAgICAgICB3b19pZCA9IGUucGFuZWwuZ2V0Q2VsbERhdGEoZS5yb3csIDEsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgZS5jZWxsLnN0eWxlLm92ZXJmbG93ID0gJ3Zpc2libGUnO1xuICAgICAgICAgICAgICAgICAgICBlLmNlbGwuaW5uZXJIVE1MID0gJzxkaXYgY2xhc3M9XCJidG4tZ3JvdXAgYnRuLWdyb3VwLWp1c3RpZmllZFwiIHJvbGU9XCJncm91cFwiIGFyaWEtbGFiZWw9XCIuLi5cIj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYnRuLWdyb3VwXCIgcm9sZT1cImdyb3VwXCI+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIjL3dvL3VwZGF0ZS8nICsgJHN0YXRlUGFyYW1zLmNsX2lkICsgJy8nICsgd29faWQgKyAnXCIgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHQgYnRuLXhzXCI+JyArIGkxOG5GaWx0ZXIoXCJnZW5lcmFsLmxhYmVscy5lZGl0XCIpICsgJzwvYT5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYnRuLWdyb3VwXCIgcm9sZT1cImdyb3VwXCI+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIjL3dvL2R1cGxpY2F0ZS8nICsgJHN0YXRlUGFyYW1zLmNsX2lkICsgJy8nICsgd29faWQgKyAnXCIgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHQgYnRuLXhzXCI+JyArIGkxOG5GaWx0ZXIoXCJnZW5lcmFsLmxhYmVscy5kdXBsaWNhdGVcIikgKyAnPC9hPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj4nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgICAgICAvLyBiaW5kIGNvbHVtbnMgd2hlbiBncmlkIGlzIGluaXRpYWxpemVkXG4gICAgICAgICAgICAkc2NvcGUuaW5pdEdyaWQgPSBmdW5jdGlvbiAocywgZSkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgJHNjb3BlLmNvbHVtbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbCA9IG5ldyB3aWptby5ncmlkLkNvbHVtbigpO1xuICAgICAgICAgICAgICAgICAgICBjb2wuYmluZGluZyA9ICRzY29wZS5jb2x1bW5zW2ldO1xuICAgICAgICAgICAgICAgICAgICBjb2wuaGVhZGVyID0gaTE4bkZpbHRlcihcIndvLmxhYmVscy5cIiArICRzY29wZS5sYWJlbHNbaV0pO1xuICAgICAgICAgICAgICAgICAgICBzLmNvbHVtbnMucHVzaChjb2wpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIFxuICAgICAgICAgICAgLy8gY3JlYXRlIHRoZSB0b29sdGlwIG9iamVjdFxuICAgICAgICAgICAgJHNjb3BlLiR3YXRjaCgnZ2dHcmlkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICgkc2NvcGUuZ2dHcmlkKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gc3RvcmUgcmVmZXJlbmNlIHRvIGdyaWRcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZsZXggPSAkc2NvcGUuZ2dHcmlkO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNyZWF0ZSB0b29sdGlwXG4gICAgICAgICAgICAgICAgICAgIHZhciB0aXAgPSBuZXcgd2lqbW8uVG9vbHRpcCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgcm5nID0gbnVsbDtcblxuICAgICAgICAgICAgICAgICAgICAvLyBtb25pdG9yIHRoZSBtb3VzZSBvdmVyIHRoZSBncmlkXG4gICAgICAgICAgICAgICAgICAgIGZsZXguaG9zdEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGh0ID0gZmxleC5oaXRUZXN0KGV2dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWh0LmNlbGxSYW5nZS5lcXVhbHMocm5nKSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbmV3IGNlbGwgc2VsZWN0ZWQsIHNob3cgdG9vbHRpcFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChodC5jZWxsVHlwZSA9PSB3aWptby5ncmlkLkNlbGxUeXBlLkNlbGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm5nID0gaHQuY2VsbFJhbmdlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29sID0gZmxleC5jb2x1bW5zW3JuZy5jb2xdLmhlYWRlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNlbGxFbGVtZW50ID0gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludChldnQuY2xpZW50WCwgZXZ0LmNsaWVudFkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2VsbEJvdW5kcyA9IHdpam1vLlJlY3QuZnJvbUJvdW5kaW5nUmVjdChjZWxsRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhID0gd2lqbW8uZXNjYXBlSHRtbChmbGV4LmdldENlbGxEYXRhKHJuZy5yb3csIHJuZy5jb2wsIHRydWUpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpcENvbnRlbnQgPSBjb2wgKyAnOiBcIjxiPicgKyBkYXRhICsgJzwvYj5cIic7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjZWxsRWxlbWVudC5jbGFzc05hbWUuaW5kZXhPZignd2otY2VsbCcpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpcC5zaG93KGZsZXguaG9zdEVsZW1lbnQsIHRpcENvbnRlbnQsIGNlbGxCb3VuZHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlwLmhpZGUoKTsgLy8gY2VsbCBtdXN0IGJlIGJlaGluZCBzY3JvbGwgYmFyLi4uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBmbGV4Lmhvc3RFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3V0JywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGlwLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJuZyA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkc2NvcGUuJG9uKCckdmlld0NvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgLy8gdGhpcyBjb2RlIGlzIGV4ZWN1dGVkIGFmdGVyIHRoZSB2aWV3IGlzIGxvYWRlZFxuXG4gICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgd29GYWN0b3J5LmdldERhdGEoKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBleHBvc2UgZGF0YSBhcyBhIENvbGxlY3Rpb25WaWV3IHRvIGdldCBldmVudHNcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5kYXRhID0gbmV3IHdpam1vLmNvbGxlY3Rpb25zLkNvbGxlY3Rpb25WaWV3KHByb21pc2UuZGF0YSk7XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1dO1xuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRodHRwJywgJyRxJywgJyRhbGVydHMnLCAnJHN0YXRlUGFyYW1zJywgZnVuY3Rpb24gKCRodHRwLCAkcSwgJGFsZXJ0cywgJHN0YXRlUGFyYW1zKSB7XG4gICAgICAgIHZhciBmYWN0b3J5ID0ge307XG4gICAgICAgIGZhY3RvcnkuZ2V0RGF0YSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKFxuICAgICAgICAgICAgICAgICRodHRwLnBvc3QoJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC93by9jbF9pZCcsIHtcbiAgICAgICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgICAgICBwcm9jY2VzX2lkOiBuZXcgRGF0ZSgpLmdldE1pbGxpc2Vjb25kcygpLFxuICAgICAgICAgICAgICAgICAgICBjbF9pZDogJHN0YXRlUGFyYW1zLmNsX2lkXG4gICAgICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzdGFja0Vycm9yID0gSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiBkYXRhLnN0YXR1cyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yOiBkYXRhLmVycm9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JUeXBlOiBkYXRhLnR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25maWc6IGNvbmZpZ1xuICAgICAgICAgICAgICAgICAgICB9LCBudWxsLCA0KTtcbiAgICAgICAgICAgICAgICAgICAgJGFsZXJ0cy5lcnJvcignV29vb3BzISBhbiBlcnJvciBoYXMgb2N1cnJlZC4nLCBzdGFja0Vycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZmFjdG9yeTtcbiAgICB9XTtcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oYW5ndWxhcil7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIFxuICAgIHJldHVybiBhbmd1bGFyLm1vZHVsZSgnYXBwLnpvbmUnLFtcbiAgICAgICAgcmVxdWlyZSgnLi9tb2R1bGVzL3pvbmUuYWRkJykubmFtZSxcbiAgICAgICAgcmVxdWlyZSgnLi9tb2R1bGVzL3pvbmUudXBkYXRlJykubmFtZVxuICAgIF0pXG5cbiAgICAuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJyxcbiAgICBmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCd6b25lJywge1xuICAgICAgICAgICAgdXJsOicvem9uZS86Y2xfaWQnLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmwgOiAnbW9kdWxlcy96b25lL3pvbmUudmlldy5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXIgOiAnem9uZUN0cmwnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHJlcXVpcmVzTG9naW46IHRydWVcbiAgICAgICAgICAgIH0gICAgXG4gICAgICAgIH0pO1xuICAgIH1dKVxuXG4gICAgLmZhY3RvcnkoJ3pvbmVGYWMnLHJlcXVpcmUoJy4vem9uZS5mYWMnKSlcblxuICAgIC5jb250cm9sbGVyKCd6b25lQ3RybCcscmVxdWlyZSgnLi96b25lLmN0cmwnKSlcbiAgICBcbn0pKGFuZ3VsYXIpO1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIiA6IFwiZGlyZWNjaW9uZXMgZGUgZW52aW9cIixcbiAgICAgICAgICAgICAgICAgICAgXCJsYWJlbHNcIjp7XG4gICAgICAgICAgICAgICAgICAgICAgICBcInpvLWlkXCIgOiBcImlkIHpvbmFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2wtaWRcIiA6IFwiaWQgY2xpZW50ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ6by16b25lXCIgOiBcInpvbmFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiem8tY29ycG9yYXRlbmFtZVwiIDogXCJyYXrDs24gc29jaWFsXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInpvLXRpblwiIDogXCJyZmNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiem8taW1tZXhcIiA6IFwiaW1tZXhcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiem8tbmFtZVwiIDogXCJub21icmVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiem8tZmF0aGVyc2xhc3RuYW1lXCIgOiBcImFwZWxsaWRvIHBhdGVybm9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiem8tbW90aGVyc2xhc3RuYW1lXCIgOiBcImFwZWxsaWRvIG1hdGVybm9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiem8tc3RyZWV0XCI6XCJjYWxsZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ6by1zdHJlZXRudW1iZXJcIjpcIm51bWVybyBleHRlcmlvclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ6by1zdWl0ZW51bWJlclwiOlwibnVtZXJvIGludGVyaW9yXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInpvLW5laWdoYm9yaG9vZFwiOlwiY29sb25pYVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ6by1hZGRyZXNzcmVmZXJlbmNlXCI6XCJyZWZlcmVuY2lhXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInpvLWNvdW50cnlcIjpcInBhw61zXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInpvLXN0YXRlXCI6XCJlc3RhZG9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiem8tY2l0eVwiOlwiY2l1ZGFkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInpvLWNvdW50eVwiOlwibXVuaWNpcGlvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInpvLXppcGNvZGVcIjpcImNvZGlnbyBwb3N0YWxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiem8tZW1haWxcIjpcImNvcnJlbyBlbGVjdHLDs25pY29cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiem8tcGhvbmVcIjpcInRlbMOpZm9ub1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ6by1tb2JpbGVcIjpcIm3Ds3ZpbFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ6by1zdGF0dXNcIjpcImVzdGF0dXNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiem8tZGF0ZVwiOlwiZmVjaGFcIixcblxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBcImNvbHVtbnNcIjpbXG4gICAgICAgICAgICAgICAgICAgICAgICBcInpvX2lkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsX2lkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInpvX3pvbmVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiem9fY29ycG9yYXRlbmFtZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ6b190aW5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiem9faW1tZXhcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiem9fbmFtZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ6b19mYXRoZXJzbGFzdG5hbWVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiem9fbW90aGVyc2xhc3RuYW1lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInpvX3N0cmVldFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ6b19zdHJlZXRudW1iZXJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiem9fc3VpdGVudW1iZXJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiem9fbmVpZ2hib3Job29kXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInpvX2FkZHJlc3NyZWZlcmVuY2VcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiem9fY291bnRyeVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ6b19zdGF0ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ6b19jaXR5XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInpvX2NvdW50eVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ6b196aXBjb2RlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInpvX2VtYWlsXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInpvX3Bob25lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInpvX21vYmlsZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ6b19zdGF0dXNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiem9fZGF0ZVwiLFxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgXCJmaWVsZHNcIiA6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHpvX3N0YXR1c29wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkFjdGl2b1wiLFwidmFsdWVcIjpcIkFcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkluYWN0aXZvXCIsXCJ2YWx1ZVwiOlwiSVwifVxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oYW5ndWxhcil7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIFxuICAgIHJldHVybiBhbmd1bGFyLm1vZHVsZSgnYXBwLnpvbmUuYWRkJyxbXSlcblxuICAgIC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLFxuICAgIGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcbiAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3pvbmVBZGQnLCB7XG4gICAgICAgICAgICB1cmw6Jy96b25lL2FkZC86Y2xfaWQnLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmwgOiAnbW9kdWxlcy96b25lL21vZHVsZXMvem9uZS5hZGQvem9uZS5hZGQudmlldy5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXIgOiAnem9uZUFkZEN0cmwnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHJlcXVpcmVzTG9naW46IHRydWVcbiAgICAgICAgICAgIH0gICAgXG4gICAgICAgIH0pO1xuICAgIH1dKVxuXG4gICAgLmZhY3RvcnkoJ3pvbmVBZGRGYWMnLHJlcXVpcmUoJy4vem9uZS5hZGQuZmFjJykpXG5cbiAgICAuY29udHJvbGxlcignem9uZUFkZEN0cmwnLHJlcXVpcmUoJy4vem9uZS5hZGQuY3RybCcpKVxuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiIDogXCJhZ3JlZ2FyIGRpcmVjY2nDs24gZGUgZW52aW9cIixcbiAgICAgICAgICAgICAgICB9IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckc2NvcGUnLCAnem9uZUFkZEZhYycsICckbG9jYXRpb24nLCAnaTE4bkZpbHRlcicsICckaW50ZXJ2YWwnLCAnJHN0YXRlUGFyYW1zJyxcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgem9uZUFkZEZhYywgJGxvY2F0aW9uLCBpMThuRmlsdGVyLCAkaW50ZXJ2YWwsICRzdGF0ZVBhcmFtcykge1xuICAgICAgICAgICAgJHNjb3BlLmZtRGF0YSA9IHt9O1xuICAgICAgICAgICAgJHNjb3BlLmZtRGF0YS5jbF9pZCA9ICRzdGF0ZVBhcmFtcy5jbF9pZDtcblxuICAgICAgICAgICAgJHNjb3BlLm9uU3VibWl0ID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgem9uZUFkZEZhYy5hZGQoJHNjb3BlLmZtRGF0YSkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocHJvbWlzZS5kYXRhID09IFwiMVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3pvbmUnKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS51cGRhdGVGYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgJHNjb3BlLmdldFN0YXRlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUuem9fc3RhdGVvcHRpb25zID0gW107XG4gICAgICAgICAgICAgICAgJHNjb3BlLnpvX2NpdHlvcHRpb25zID0gW107XG4gICAgICAgICAgICAgICAgJHNjb3BlLnpvX2NvdW50eW9wdGlvbnMgPSBbXTtcbiAgICAgICAgICAgICAgICAkaW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB6b25lQWRkRmFjLmdldFN0YXRlcygkc2NvcGUuZm1EYXRhLnpvX2NvdW50cnkpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhLmdlb25hbWVzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS56b19zdGF0ZW9wdGlvbnMgPSBwcm9taXNlLmRhdGEuZ2VvbmFtZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vJHNjb3BlLnVwZGF0ZUZhaWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LCAwLCAxKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJHNjb3BlLmdldENpdHlDb3VudHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnpvX2NpdHlvcHRpb25zID0gW107XG4gICAgICAgICAgICAgICAgJHNjb3BlLnpvX2NvdW50eW9wdGlvbnMgPSBbXTtcbiAgICAgICAgICAgICAgICAkaW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB6b25lQWRkRmFjLmdldFN0YXRlcygkc2NvcGUuZm1EYXRhLnpvX3N0YXRlKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YS5nZW9uYW1lcykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuem9fY2l0eW9wdGlvbnMgPSBwcm9taXNlLmRhdGEuZ2VvbmFtZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnpvX2NvdW50eW9wdGlvbnMgPSBwcm9taXNlLmRhdGEuZ2VvbmFtZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vJHNjb3BlLnVwZGF0ZUZhaWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LCAwLCAxKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICRzY29wZS56b19zdGF0dXNvcHRpb25zID0gaTE4bkZpbHRlcihcInpvbmUuZmllbGRzLnpvX3N0YXR1c29wdGlvbnNcIik7XG5cbiAgICAgICAgICAgICRzY29wZS4kb24oJyR2aWV3Q29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAvLyB0aGlzIGNvZGUgaXMgZXhlY3V0ZWQgYWZ0ZXIgdGhlIHZpZXcgaXMgbG9hZGVkXG4gICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB6b25lQWRkRmFjLmdldENsaWVudCgpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNPYmplY3QocHJvbWlzZS5kYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNsaWVudCA9IHByb21pc2UuZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgem9uZUFkZEZhYy5nZXRDb3VudHJpZXMoKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhLmdlb25hbWVzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnpvX2NvdW50cnlvcHRpb25zID0gcHJvbWlzZS5kYXRhLmdlb25hbWVzO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8kc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1dO1xuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRodHRwJywgJyRxJywgJyRhbGVydHMnLCAnJHN0YXRlUGFyYW1zJywgZnVuY3Rpb24gKCRodHRwLCAkcSwgJGFsZXJ0cywgJHN0YXRlUGFyYW1zKSB7XG4gICAgICAgIHZhciBmYWN0b3J5ID0ge307XG4gICAgICAgIGZhY3RvcnkuZ2V0Q2xpZW50ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoXG4gICAgICAgICAgICAgICAgJGh0dHAucG9zdCgnbW9kdWxlcy96b25lL21vZHVsZXMvem9uZS5hZGQvem9uZS5hZGQubWRsLmdldENsaWVudC5waHAnLCB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICAgICAgY2xfaWQ6ICRzdGF0ZVBhcmFtcy5jbF9pZFxuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc3RhY2tFcnJvciA9IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogZGF0YS5zdGF0dXMsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjogZGF0YS5lcnJvcixcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yVHlwZTogZGF0YS50eXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnOiBjb25maWdcbiAgICAgICAgICAgICAgICAgICAgfSwgbnVsbCwgNCk7XG4gICAgICAgICAgICAgICAgICAgICRhbGVydHMuZXJyb3IoJ1dvb29wcyEgYW4gZXJyb3IgaGFzIG9jdXJyZWQuJywgc3RhY2tFcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeS5hZGQgPSBmdW5jdGlvbiAoem9fanNvbmIpIHtcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gJGh0dHAucG9zdCgnbW9kdWxlcy96b25lL21vZHVsZXMvem9uZS5hZGQvem9uZS5hZGQubWRsLmFkZC5waHAnLCB7XG4gICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgIHpvX2pzb25iOiB6b19qc29uYlxuICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgIHZhciBzdGFja0Vycm9yID0gSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IGRhdGEuc3RhdHVzLFxuICAgICAgICAgICAgICAgICAgICBlcnJvcjogZGF0YS5lcnJvcixcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JUeXBlOiBkYXRhLnR5cGUsXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZzogY29uZmlnXG4gICAgICAgICAgICAgICAgfSwgbnVsbCwgNCk7XG4gICAgICAgICAgICAgICAgJGFsZXJ0cy5lcnJvcignV29vb3BzISBhbiBlcnJvciBoYXMgb2N1cnJlZC4nLCBzdGFja0Vycm9yKTtcbiAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeS5nZXRDb3VudHJpZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9ICRodHRwLmdldCgnaHR0cDovL2FwaS5nZW9uYW1lcy5vcmcvY291bnRyeUluZm9KU09OP3VzZXJuYW1lPWFsZWphbmRyb2xzY2EnKVxuICAgICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0YWNrRXJyb3IgPSBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IGRhdGEuc3RhdHVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGRhdGEuZXJyb3IsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvclR5cGU6IGRhdGEudHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZzogY29uZmlnXG4gICAgICAgICAgICAgICAgICAgIH0sIG51bGwsIDQpO1xuICAgICAgICAgICAgICAgICAgICAkYWxlcnRzLmVycm9yKCdXb29vcHMhIGFuIGVycm9yIGhhcyBvY3VycmVkLicsIHN0YWNrRXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkuZ2V0U3RhdGVzID0gZnVuY3Rpb24gKHpvX2NvdW50cnkpIHtcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gJGh0dHAuZ2V0KCdodHRwOi8vYXBpLmdlb25hbWVzLm9yZy9jaGlsZHJlbkpTT04/Z2VvbmFtZUlkPScgKyB6b19jb3VudHJ5ICsgJyZ1c2VybmFtZT1hbGVqYW5kcm9sc2NhJylcbiAgICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzdGFja0Vycm9yID0gSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiBkYXRhLnN0YXR1cyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yOiBkYXRhLmVycm9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JUeXBlOiBkYXRhLnR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25maWc6IGNvbmZpZ1xuICAgICAgICAgICAgICAgICAgICB9LCBudWxsLCA0KTtcbiAgICAgICAgICAgICAgICAgICAgJGFsZXJ0cy5lcnJvcignV29vb3BzISBhbiBlcnJvciBoYXMgb2N1cnJlZC4nLCBzdGFja0Vycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICBmYWN0b3J5LmdldENpdHlDb3VudHkgPSBmdW5jdGlvbiAoem9fc3RhdGUpIHtcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gJGh0dHAuZ2V0KCdodHRwOi8vYXBpLmdlb25hbWVzLm9yZy9jaGlsZHJlbkpTT04/Z2VvbmFtZUlkPScgKyB6b19zdGF0ZSArICcmdXNlcm5hbWU9YWxlamFuZHJvbHNjYScpXG4gICAgICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc3RhY2tFcnJvciA9IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogZGF0YS5zdGF0dXMsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjogZGF0YS5lcnJvcixcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yVHlwZTogZGF0YS50eXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnOiBjb25maWdcbiAgICAgICAgICAgICAgICAgICAgfSwgbnVsbCwgNCk7XG4gICAgICAgICAgICAgICAgICAgICRhbGVydHMuZXJyb3IoJ1dvb29wcyEgYW4gZXJyb3IgaGFzIG9jdXJyZWQuJywgc3RhY2tFcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGZhY3Rvcnk7XG4gICAgfV07XG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKGFuZ3VsYXIpe1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBcbiAgICByZXR1cm4gYW5ndWxhci5tb2R1bGUoJ2FwcC56b25lLnVwZGF0ZScsW10pXG5cbiAgICAuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJyxcbiAgICBmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCd6b25lVXBkYXRlJywge1xuICAgICAgICAgICAgdXJsOicvem9uZS91cGRhdGUvOmNsX2lkLzp6b19pZCcsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybCA6ICdtb2R1bGVzL3pvbmUvbW9kdWxlcy96b25lLnVwZGF0ZS96b25lLnVwZGF0ZS52aWV3Lmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlciA6ICd6b25lVXBkYXRlQ3RybCcsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgcmVxdWlyZXNMb2dpbjogdHJ1ZVxuICAgICAgICAgICAgfSAgICBcbiAgICAgICAgfSk7XG4gICAgfV0pXG5cbiAgICAuZmFjdG9yeSgnem9uZVVwZGF0ZUZhYycscmVxdWlyZSgnLi96b25lLnVwZGF0ZS5mYWMnKSlcblxuICAgIC5jb250cm9sbGVyKCd6b25lVXBkYXRlQ3RybCcscmVxdWlyZSgnLi96b25lLnVwZGF0ZS5jdHJsJykpXG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCIgOiBcImFjdHVhbGl6YXIgZGlyZWNjacOzbiBkZSBlbnZpb1wiLFxuICAgICAgICAgICAgICAgIH0iLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRzY29wZScsICd6b25lVXBkYXRlRmFjJywgJyRsb2NhdGlvbicsICdpMThuRmlsdGVyJywgJyRpbnRlcnZhbCcsICckc3RhdGVQYXJhbXMnLFxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCB6b25lVXBkYXRlRmFjLCAkbG9jYXRpb24sIGkxOG5GaWx0ZXIsICRpbnRlcnZhbCwgJHN0YXRlUGFyYW1zKSB7XG5cbiAgICAgICAgICAgICRzY29wZS5vblN1Ym1pdCA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgIHpvbmVVcGRhdGVGYWMudXBkYXRlKCRzY29wZS5mbURhdGEpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb21pc2UuZGF0YSA9PSBcIjFcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy96b25lLycgKyAkc3RhdGVQYXJhbXMuY2xfaWQpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnVwZGF0ZUZhaWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAkc2NvcGUuZ2V0U3RhdGVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICRzY29wZS56b19zdGF0ZW9wdGlvbnMgPSBbXTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuem9fY2l0eW9wdGlvbnMgPSBbXTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuem9fY291bnR5b3B0aW9ucyA9IFtdO1xuICAgICAgICAgICAgICAgICRpbnRlcnZhbChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHpvbmVVcGRhdGVGYWMuZ2V0U3RhdGVzKCRzY29wZS5mbURhdGEuem9fY291bnRyeSkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEuZ2VvbmFtZXMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnpvX3N0YXRlb3B0aW9ucyA9IHByb21pc2UuZGF0YS5nZW9uYW1lcztcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8kc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sIDAsIDEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkc2NvcGUuZ2V0Q2l0eUNvdW50eSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUuem9fY2l0eW9wdGlvbnMgPSBbXTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuem9fY291bnR5b3B0aW9ucyA9IFtdO1xuICAgICAgICAgICAgICAgICRpbnRlcnZhbChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHpvbmVVcGRhdGVGYWMuZ2V0U3RhdGVzKCRzY29wZS5mbURhdGEuem9fc3RhdGUpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhLmdlb25hbWVzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS56b19jaXR5b3B0aW9ucyA9IHByb21pc2UuZGF0YS5nZW9uYW1lcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuem9fY291bnR5b3B0aW9ucyA9IHByb21pc2UuZGF0YS5nZW9uYW1lcztcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8kc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sIDAsIDEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkc2NvcGUuem9fc3RhdHVzb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJ6b25lLmZpZWxkcy56b19zdGF0dXNvcHRpb25zXCIpO1xuXG4gICAgICAgICAgICAkc2NvcGUuJG9uKCckdmlld0NvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgLy8gdGhpcyBjb2RlIGlzIGV4ZWN1dGVkIGFmdGVyIHRoZSB2aWV3IGlzIGxvYWRlZFxuICAgICAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB6b25lVXBkYXRlRmFjLmRhdGEoKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzT2JqZWN0KGFuZ3VsYXIuZnJvbUpzb24ocHJvbWlzZS5kYXRhKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5mbURhdGEgPSBhbmd1bGFyLmZyb21Kc29uKHByb21pc2UuZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgem9uZVVwZGF0ZUZhYy5nZXRDb3VudHJpZXMoKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YS5nZW9uYW1lcykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuem9fY291bnRyeW9wdGlvbnMgPSBwcm9taXNlLmRhdGEuZ2VvbmFtZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vJHNjb3BlLnVwZGF0ZUZhaWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHpvbmVVcGRhdGVGYWMuZ2V0U3RhdGVzKCRzY29wZS5mbURhdGEuem9fY291bnRyeSkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhLmdlb25hbWVzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuem9fc3RhdGVvcHRpb25zID0gcHJvbWlzZS5kYXRhLmdlb25hbWVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vJHNjb3BlLnVwZGF0ZUZhaWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgem9uZVVwZGF0ZUZhYy5nZXRDaXR5Q291bnR5KCRzY29wZS5mbURhdGEuem9fc3RhdGUpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YS5nZW9uYW1lcykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnpvX2NpdHlvcHRpb25zID0gcHJvbWlzZS5kYXRhLmdlb25hbWVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuem9fY291bnR5b3B0aW9ucyA9IHByb21pc2UuZGF0YS5nZW9uYW1lcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyRzY29wZS51cGRhdGVGYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1dO1xuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRodHRwJywgJyRxJywgJyRhbGVydHMnLCAnJHN0YXRlUGFyYW1zJywgZnVuY3Rpb24gKCRodHRwLCAkcSwgJGFsZXJ0cywgJHN0YXRlUGFyYW1zKSB7XG4gICAgICAgIHZhciBmYWN0b3J5ID0ge307XG4gICAgICAgIGZhY3RvcnkuZGF0YSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKFxuICAgICAgICAgICAgICAgICRodHRwLnBvc3QoJ21vZHVsZXMvem9uZS9tb2R1bGVzL3pvbmUudXBkYXRlL3pvbmUudXBkYXRlLm1kbC5nZXRab25lLnBocCcsIHtcbiAgICAgICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgICAgICB6b19pZDogJHN0YXRlUGFyYW1zLnpvX2lkXG4gICAgICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzdGFja0Vycm9yID0gSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiBkYXRhLnN0YXR1cyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yOiBkYXRhLmVycm9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JUeXBlOiBkYXRhLnR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25maWc6IGNvbmZpZ1xuICAgICAgICAgICAgICAgICAgICB9LCBudWxsLCA0KTtcbiAgICAgICAgICAgICAgICAgICAgJGFsZXJ0cy5lcnJvcignV29vb3BzISBhbiBlcnJvciBoYXMgb2N1cnJlZC4nLCBzdGFja0Vycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICBmYWN0b3J5LnVwZGF0ZSA9IGZ1bmN0aW9uICh6b19qc29uYikge1xuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoXG4gICAgICAgICAgICAgICAgJGh0dHAucG9zdCgnbW9kdWxlcy96b25lL21vZHVsZXMvem9uZS51cGRhdGUvem9uZS51cGRhdGUubWRsLnVwZGF0ZS5waHAnLCB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICAgICAgem9faWQ6ICRzdGF0ZVBhcmFtcy56b19pZCxcbiAgICAgICAgICAgICAgICAgICAgem9fanNvbmI6IHpvX2pzb25iXG4gICAgICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzdGFja0Vycm9yID0gSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiBkYXRhLnN0YXR1cyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yOiBkYXRhLmVycm9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JUeXBlOiBkYXRhLnR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25maWc6IGNvbmZpZ1xuICAgICAgICAgICAgICAgICAgICB9LCBudWxsLCA0KTtcbiAgICAgICAgICAgICAgICAgICAgJGFsZXJ0cy5lcnJvcignV29vb3BzISBhbiBlcnJvciBoYXMgb2N1cnJlZC4nLCBzdGFja0Vycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICBmYWN0b3J5LmdldENvdW50cmllcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gJGh0dHAuZ2V0KCdodHRwOi8vYXBpLmdlb25hbWVzLm9yZy9jb3VudHJ5SW5mb0pTT04/dXNlcm5hbWU9YWxlamFuZHJvbHNjYScpXG4gICAgICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc3RhY2tFcnJvciA9IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogZGF0YS5zdGF0dXMsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjogZGF0YS5lcnJvcixcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yVHlwZTogZGF0YS50eXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnOiBjb25maWdcbiAgICAgICAgICAgICAgICAgICAgfSwgbnVsbCwgNCk7XG4gICAgICAgICAgICAgICAgICAgICRhbGVydHMuZXJyb3IoJ1dvb29wcyEgYW4gZXJyb3IgaGFzIG9jdXJyZWQuJywgc3RhY2tFcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeS5nZXRTdGF0ZXMgPSBmdW5jdGlvbiAoem9fY291bnRyeSkge1xuICAgICAgICAgICAgdmFyIHByb21pc2UgPSAkaHR0cC5nZXQoJ2h0dHA6Ly9hcGkuZ2VvbmFtZXMub3JnL2NoaWxkcmVuSlNPTj9nZW9uYW1lSWQ9JyArIHpvX2NvdW50cnkgKyAnJnVzZXJuYW1lPWFsZWphbmRyb2xzY2EnKVxuICAgICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0YWNrRXJyb3IgPSBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IGRhdGEuc3RhdHVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGRhdGEuZXJyb3IsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvclR5cGU6IGRhdGEudHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZzogY29uZmlnXG4gICAgICAgICAgICAgICAgICAgIH0sIG51bGwsIDQpO1xuICAgICAgICAgICAgICAgICAgICAkYWxlcnRzLmVycm9yKCdXb29vcHMhIGFuIGVycm9yIGhhcyBvY3VycmVkLicsIHN0YWNrRXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkuZ2V0Q2l0eUNvdW50eSA9IGZ1bmN0aW9uICh6b19zdGF0ZSkge1xuICAgICAgICAgICAgdmFyIHByb21pc2UgPSAkaHR0cC5nZXQoJ2h0dHA6Ly9hcGkuZ2VvbmFtZXMub3JnL2NoaWxkcmVuSlNPTj9nZW9uYW1lSWQ9JyArIHpvX3N0YXRlICsgJyZ1c2VybmFtZT1hbGVqYW5kcm9sc2NhJylcbiAgICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzdGFja0Vycm9yID0gSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiBkYXRhLnN0YXR1cyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yOiBkYXRhLmVycm9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JUeXBlOiBkYXRhLnR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25maWc6IGNvbmZpZ1xuICAgICAgICAgICAgICAgICAgICB9LCBudWxsLCA0KTtcbiAgICAgICAgICAgICAgICAgICAgJGFsZXJ0cy5lcnJvcignV29vb3BzISBhbiBlcnJvciBoYXMgb2N1cnJlZC4nLCBzdGFja0Vycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZmFjdG9yeTtcbiAgICB9XTtcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckc2NvcGUnLCAnem9uZUZhYycsICdpMThuRmlsdGVyJyxcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgem9uZUZhYywgaTE4bkZpbHRlcikge1xuXG4gICAgICAgICAgICAkc2NvcGUubGFiZWxzID0gT2JqZWN0LmtleXMoaTE4bkZpbHRlcihcInpvbmUubGFiZWxzXCIpKTtcbiAgICAgICAgICAgICRzY29wZS5jb2x1bW5zID0gaTE4bkZpbHRlcihcInpvbmUuY29sdW1uc1wiKTtcbiAgICAgICAgXG4gICAgICAgICAgICAvLyBmb3JtYXRJdGVtIGV2ZW50IGhhbmRsZXJcbiAgICAgICAgICAgIHZhciB6b19pZDtcbiAgICAgICAgICAgIHZhciBjbF9pZDtcbiAgICAgICAgICAgICRzY29wZS5mb3JtYXRJdGVtID0gZnVuY3Rpb24gKHMsIGUsIGNlbGwpIHtcblxuICAgICAgICAgICAgICAgIGlmIChlLnBhbmVsLmNlbGxUeXBlID09IHdpam1vLmdyaWQuQ2VsbFR5cGUuUm93SGVhZGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGUuY2VsbC50ZXh0Q29udGVudCA9IGUucm93ICsgMTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBzLnJvd3MuZGVmYXVsdFNpemUgPSAzMDtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIGFkZCBCb290c3RyYXAgaHRtbFxuICAgICAgICAgICAgICAgIGlmICgoZS5wYW5lbC5jZWxsVHlwZSA9PSB3aWptby5ncmlkLkNlbGxUeXBlLkNlbGwpICYmIChlLmNvbCA9PSAwKSkge1xuICAgICAgICAgICAgICAgICAgICB6b19pZCA9IGUucGFuZWwuZ2V0Q2VsbERhdGEoZS5yb3csIDEsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgY2xfaWQgPSBlLnBhbmVsLmdldENlbGxEYXRhKGUucm93LCAyLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGUuY2VsbC5zdHlsZS5vdmVyZmxvdyA9ICd2aXNpYmxlJztcbiAgICAgICAgICAgICAgICAgICAgZS5jZWxsLmlubmVySFRNTCA9ICc8ZGl2IGNsYXNzPVwiYnRuLWdyb3VwIGJ0bi1ncm91cC1qdXN0aWZpZWRcIiByb2xlPVwiZ3JvdXBcIiBhcmlhLWxhYmVsPVwiLi4uXCI+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYnRuLWdyb3VwXCIgcm9sZT1cImdyb3VwXCI+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cIiMvem9uZS91cGRhdGUvJysgY2xfaWQgKyAnLycgKyB6b19pZCArICdcIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdCBidG4teHNcIiBuZy1jbGljaz1cImVkaXQoJGl0ZW0uY2xfaWQpXCI+RWRpdGFyPC9hPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2Pic7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgICAgIC8vIGJpbmQgY29sdW1ucyB3aGVuIGdyaWQgaXMgaW5pdGlhbGl6ZWRcbiAgICAgICAgICAgICRzY29wZS5pbml0R3JpZCA9IGZ1bmN0aW9uIChzLCBlKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAkc2NvcGUubGFiZWxzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjb2wgPSBuZXcgd2lqbW8uZ3JpZC5Db2x1bW4oKTtcbiAgICAgICAgICAgICAgICAgICAgY29sLmJpbmRpbmcgPSAkc2NvcGUuY29sdW1uc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgY29sLmhlYWRlciA9IGkxOG5GaWx0ZXIoXCJ6b25lLmxhYmVscy5cIiArICRzY29wZS5sYWJlbHNbaV0pO1xuICAgICAgICAgICAgICAgICAgICBjb2wud29yZFdyYXAgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgY29sLndpZHRoID0gMTUwO1xuICAgICAgICAgICAgICAgICAgICBzLmNvbHVtbnMucHVzaChjb2wpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICAvLyBjcmVhdGUgdGhlIHRvb2x0aXAgb2JqZWN0XG4gICAgICAgICAgICAkc2NvcGUuJHdhdGNoKCdnZ0dyaWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCRzY29wZS5nZ0dyaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIC8vIHN0b3JlIHJlZmVyZW5jZSB0byBncmlkXG4gICAgICAgICAgICAgICAgICAgIHZhciBmbGV4ID0gJHNjb3BlLmdnR3JpZDtcblxuICAgICAgICAgICAgICAgICAgICAvLyBjcmVhdGUgdG9vbHRpcFxuICAgICAgICAgICAgICAgICAgICB2YXIgdGlwID0gbmV3IHdpam1vLlRvb2x0aXAoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJuZyA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gbW9uaXRvciB0aGUgbW91c2Ugb3ZlciB0aGUgZ3JpZFxuICAgICAgICAgICAgICAgICAgICBmbGV4Lmhvc3RFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBodCA9IGZsZXguaGl0VGVzdChldnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFodC5jZWxsUmFuZ2UuZXF1YWxzKHJuZykpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG5ldyBjZWxsIHNlbGVjdGVkLCBzaG93IHRvb2x0aXBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaHQuY2VsbFR5cGUgPT0gd2lqbW8uZ3JpZC5DZWxsVHlwZS5DZWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJuZyA9IGh0LmNlbGxSYW5nZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvbCA9IGZsZXguY29sdW1uc1tybmcuY29sXS5oZWFkZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjZWxsRWxlbWVudCA9IGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQoZXZ0LmNsaWVudFgsIGV2dC5jbGllbnRZKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNlbGxCb3VuZHMgPSB3aWptby5SZWN0LmZyb21Cb3VuZGluZ1JlY3QoY2VsbEVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YSA9IHdpam1vLmVzY2FwZUh0bWwoZmxleC5nZXRDZWxsRGF0YShybmcucm93LCBybmcuY29sLCB0cnVlKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXBDb250ZW50ID0gY29sICsgJzogXCI8Yj4nICsgZGF0YSArICc8L2I+XCInO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2VsbEVsZW1lbnQuY2xhc3NOYW1lLmluZGV4T2YoJ3dqLWNlbGwnKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXAuc2hvdyhmbGV4Lmhvc3RFbGVtZW50LCB0aXBDb250ZW50LCBjZWxsQm91bmRzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpcC5oaWRlKCk7IC8vIGNlbGwgbXVzdCBiZSBiZWhpbmQgc2Nyb2xsIGJhci4uLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgZmxleC5ob3N0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpcC5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBybmcgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJHNjb3BlLiRvbignJHZpZXdDb250ZW50TG9hZGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIC8vIHRoaXMgY29kZSBpcyBleGVjdXRlZCBhZnRlciB0aGUgdmlldyBpcyBsb2FkZWRcbiAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgem9uZUZhYy5kYXRhKCkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5kYXRhID0gbmV3IHdpam1vLmNvbGxlY3Rpb25zLkNvbGxlY3Rpb25WaWV3KHByb21pc2UuZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XTtcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckaHR0cCcsICckcScsICckYWxlcnRzJywgJyRzdGF0ZVBhcmFtcycsIGZ1bmN0aW9uICgkaHR0cCwgJHEsICRhbGVydHMsICRzdGF0ZVBhcmFtcykge1xuICAgICAgICB2YXIgZmFjdG9yeSA9IHt9O1xuICAgICAgICBmYWN0b3J5LmRhdGEgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KCdtb2R1bGVzL3pvbmUvem9uZS5tZGwuZ2V0Wm9uZXMucGhwJywge1xuICAgICAgICAgICAgICAgICAgICAvKiBQT1NUIHZhcmlhYmxlcyBoZXJlICovXG4gICAgICAgICAgICAgICAgICAgIHByb2NjZXNfaWQ6IG5ldyBEYXRlKCkuZ2V0TWlsbGlzZWNvbmRzKCksXG4gICAgICAgICAgICAgICAgICAgIGNsX2lkOiAkc3RhdGVQYXJhbXMuY2xfaWRcbiAgICAgICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0YWNrRXJyb3IgPSBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IGRhdGEuc3RhdHVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGRhdGEuZXJyb3IsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvclR5cGU6IGRhdGEudHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZzogY29uZmlnXG4gICAgICAgICAgICAgICAgICAgIH0sIG51bGwsIDQpO1xuICAgICAgICAgICAgICAgICAgICAkYWxlcnRzLmVycm9yKCdXb29vcHMhIGFuIGVycm9yIGhhcyBvY3VycmVkLicsIHN0YWNrRXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBmYWN0b3J5O1xuICAgIH1dO1xuXG59KShhbmd1bGFyKTsiXX0=
