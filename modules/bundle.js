(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Applications/MAMP/htdocs/ggapp/modules/app.js":[function(require,module,exports){
(function(angular){
    //ALEJANDRO
    'use strict';
    
    angular.module('app', [
        'ui.router',
        'ngAnimate',
        'ui.bootstrap',
        'gg-fields',
        'wj',
        require('./auth').name,
        require('./client').name,
        require('./user').name,
        require('./home').name,
        require('./wo').name,
        require('./zone').name
    ])
    
    .config(['$stateProvider', '$urlRouterProvider','USER_ROLES',
    function($stateProvider, $urlRouterProvider, USER_ROLES) {
        // when there is an empty route, redirect to /index   
        $urlRouterProvider.when('', '/auth');
        // when root, redirect to /home  
        $urlRouterProvider.when('/', '/auth');
    }])
    
    .run(function ($rootScope, AUTH_EVENTS, credentialsFac, $location) {
        credentialsFac.credentials().then(function(promise){
            if(promise.data.success) {
                $rootScope.user = promise.data;
            }
            console.log(JSON.stringify(promise.data));
        }).then(function(){
            $rootScope.$on('$stateChangeStart', function (event, next) {
                var authorizedRoles = next.data.authorizedRoles;
                if (authorizedRoles.indexOf($rootScope.user.userRole) == -1) {
                    event.preventDefault();
                    if (!!$rootScope.user.user) {
                        console.log('user is not allowed');
                        $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
                        $location.path('/auth');
                    } else {
                        console.log('user is not logged in');
                        $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
                        $location.path('/auth');
                    }
                }
            });
        });
    })
    
    .filter('i18n',require('./app/lang.filter.i18n'))
    
    .factory('langFac',require('./app/lang.fac'))
    
    .factory('logoutFac',require('./app/logout.fac'))
    
    .factory('credentialsFac',require('./app/user.credentials.fac'))
    
    .controller('appCtrl',require('./app/app.ctrl'))
    
})(angular);

},{"./app/app.ctrl":"/Applications/MAMP/htdocs/ggapp/modules/app/app.ctrl.js","./app/lang.fac":"/Applications/MAMP/htdocs/ggapp/modules/app/lang.fac.js","./app/lang.filter.i18n":"/Applications/MAMP/htdocs/ggapp/modules/app/lang.filter.i18n.js","./app/logout.fac":"/Applications/MAMP/htdocs/ggapp/modules/app/logout.fac.js","./app/user.credentials.fac":"/Applications/MAMP/htdocs/ggapp/modules/app/user.credentials.fac.js","./auth":"/Applications/MAMP/htdocs/ggapp/modules/auth/index.js","./client":"/Applications/MAMP/htdocs/ggapp/modules/client/index.js","./home":"/Applications/MAMP/htdocs/ggapp/modules/home/index.js","./user":"/Applications/MAMP/htdocs/ggapp/modules/user/index.js","./wo":"/Applications/MAMP/htdocs/ggapp/modules/wo/index.js","./zone":"/Applications/MAMP/htdocs/ggapp/modules/zone/index.js"}],"/Applications/MAMP/htdocs/ggapp/modules/app/app.ctrl.js":[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return function ($scope,$rootScope,langFac,logoutFac,i18nFilter,USER_ROLES,$location) {
    
        langFac.getLang().then(function(promise){
            if(promise.data.success) {
                $rootScope.currentLanguage = promise.data.lang;
                $scope.navItems = i18nFilter("GENERAL.NAV");
            }
            console.log(JSON.stringify(promise.data.lang));
        });

        for(var item in $scope.navItems) {
            if ($scope.navItems[item].subMenu) {
                $scope.lastSubmenu = item;   
            }
        }

        $scope.lang = function (lang) {
            langFac.setLang(lang).then(function(promise){
                if(promise.data.success) {
                    $rootScope.currentLanguage = promise.data.lang;
                    $scope.navItems = i18nFilter("GENERAL.NAV");
                }
                console.log(JSON.stringify(promise.data.lang));
            });
        }
        $scope.logout = function() {
            logoutFac.logout().then(function(promise){
                if(promise.data.success) {
                    $rootScope.user = {
                        user:null,
                        userRole:USER_ROLES.guest,
                        userName:null,
                        userFathersLastName:null,
                        userMothersLastName:null, 
                        userDatabase:null
                    }
                    $location.path("/auth");
                }
            });
        }
    };
    
})(angular);
},{}],"/Applications/MAMP/htdocs/ggapp/modules/app/lang.fac.js":[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return function($http, $q) {
        var factory = {};
        factory.setLang = function(newLang) {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('modules/app/lang.mdl.setLang.php', {
                    lang: newLang
                }).success(function(data, status, headers, config){
                    return data;
                }).error(function (data, status, headers, config) {
                    return {"status": false};
                })
            );
            return deferred.promise;
        };
        factory.getLang = function() {
            var deferred = $q.defer();
            deferred.resolve(
                $http.get('modules/app/lang.mdl.getLang.php')
                .success(function(data, status, headers, config){
                    return data;
                }).error(function (data, status, headers, config) {
                    return {"status": false};
                })
            );
            return deferred.promise;
        };
        return factory;
    };
    
})(angular);
},{}],"/Applications/MAMP/htdocs/ggapp/modules/app/lang.filter.i18n.js":[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return ['$rootScope', function($rootScope) {
        
        return function (input,param) {
                var translations = {
                    "es-MX" : require('./lang.locale.es-MX'),
                    "en-US" : require('./lang.locale.en-US')
                };
                var currentLanguage = $rootScope.currentLanguage || 'es-MX',
                keys = input.split('.'),
                data = translations[currentLanguage],
                value = undefined;
                try {
                    for(var key in keys) {
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
},{"./lang.locale.en-US":"/Applications/MAMP/htdocs/ggapp/modules/app/lang.locale.en-US.js","./lang.locale.es-MX":"/Applications/MAMP/htdocs/ggapp/modules/app/lang.locale.es-MX.js"}],"/Applications/MAMP/htdocs/ggapp/modules/app/lang.locale.en-US.js":[function(require,module,exports){
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
},{}],"/Applications/MAMP/htdocs/ggapp/modules/app/lang.locale.es-MX.js":[function(require,module,exports){
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
                },
                "zone-update":{
                    "title" : "actualizar dirección de envio",
                }
                
            }
},{}],"/Applications/MAMP/htdocs/ggapp/modules/app/logout.fac.js":[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return function($http, $q){
        var factory = {};
        factory.logout = function() {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('modules/app/logout.mdl.logOut.php', {
                        /* POST variables here */
                }).success(function(data, status, headers, config){
                    return data;
                }).error(function (data, status, headers, config) {
                    return {"status": false};
                })
            );
            return deferred.promise;
        };
        return factory;
    };
    
})(angular);
},{}],"/Applications/MAMP/htdocs/ggapp/modules/app/user.credentials.fac.js":[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return function($http, $q){
        var factory = {};
        factory.credentials = function() {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('modules/app/user.credentials.mdl.getCredentials.php', {
                        /* POST variables here */
                }).success(function(data, status, headers, config){
                    return data;
                }).error(function (data, status, headers, config) {
                    return {"status": false};
                })
            );
            return deferred.promise;
        };
        return factory;
    };
    
})(angular);
},{}],"/Applications/MAMP/htdocs/ggapp/modules/auth/auth.ctrl.js":[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return function ($rootScope, $scope, authFac, $location, AUTH_EVENTS) {
        $scope.login_databases = [
            {"label":"Grupo Grafico","value":"ggapp"},
            {"label":"Print Source","value":"printsource"}
        ];

        $scope.user = {
            us_database: $scope.login_databases[0] // Grupo Grafico
        };

        $scope.onSubmit = function(user) {
            authFac.login({
                us_database: user.us_database.value,
                us_user: user.us_user,
                us_password: user.us_password
            }).then(function(promise){
                if(promise.data.success) {
                    $rootScope.user = promise.data;
                    $location.path("/home");
                }
                console.log(JSON.stringify($rootScope.user));
            });
        }
        $scope.$on(AUTH_EVENTS.notAuthenticated, function () {
            $scope.notAuthenticated = true;
        });
        $scope.$on(AUTH_EVENTS.notAuthorized, function () {
            $scope.notAuthorized = true;
        });
        $scope.$on('$viewContentLoaded', function () {
            // this code is executed after the view is loaded
         });

        $scope.us_passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}$/;
    };
    
})(angular);
},{}],"/Applications/MAMP/htdocs/ggapp/modules/auth/auth.fac.js":[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return function($http){
        var factory = {};
        factory.login = function(user) {
            var promise = $http.post('modules/auth/auth.mdl.login.php', {
                /* POST variables here */
                us_database: user.us_database,
                us_user: user.us_user,
                us_password: user.us_password
            }).success(function(data, status, headers, config){
                return data;
            }).error(function (data, status, headers, config) {
                return {"status": false};
            });
            return promise;
        }
        return factory;
    };
    
})(angular);
},{}],"/Applications/MAMP/htdocs/ggapp/modules/auth/index.js":[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.auth',[])

    .constant('AUTH_EVENTS', {
        loginSuccess: 'auth-login-success',
        loginFailed: 'auth-login-failed',
        logoutSuccess: 'auth-logout-success',
        sessionTimeout: 'auth-session-timeout',
        notAuthenticated: 'auth-not-authenticated',
        notAuthorized: 'auth-not-authorized'
    })

    .constant('USER_ROLES', {
        admin: 1, 
        editor: 2, 
        guest: 3,
        all: 4,
    })

    .config(['$stateProvider', '$urlRouterProvider','USER_ROLES',
    function($stateProvider, $urlRouterProvider, USER_ROLES) {
        $stateProvider.state('auth', {
            url:'/auth',
            templateUrl : 'modules/auth/auth.view.html',
            controller : 'authCtrl',
            data: {
                authorizedRoles: [USER_ROLES.admin, USER_ROLES.editor, USER_ROLES.guest]
            }    
        });
    }])

    .factory('authFac',require('./auth.fac'))

    .controller('authCtrl',require('./auth.ctrl'))
    
})(angular);
},{"./auth.ctrl":"/Applications/MAMP/htdocs/ggapp/modules/auth/auth.ctrl.js","./auth.fac":"/Applications/MAMP/htdocs/ggapp/modules/auth/auth.fac.js"}],"/Applications/MAMP/htdocs/ggapp/modules/client/client.ctrl.js":[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return function ($scope, clientFac, $window, i18nFilter, $parse) {
    
        $scope.labels = Object.keys(i18nFilter("client.labels"));
        $scope.columns = i18nFilter("client.columns");
        
        // formatItem event handler
        var cl_id;
        $scope.formatItem = function(s, e, cell) {
            
            if (e.panel.cellType == wijmo.grid.CellType.RowHeader) {
                e.cell.textContent = e.row+1;
            }
            
            s.rows.defaultSize = 30;
            
            // add Bootstrap html
            if ((e.panel.cellType == wijmo.grid.CellType.Cell) && (e.col == 0)) {
                cl_id = e.panel.getCellData(e.row,1,false);
                e.cell.style.overflow = 'visible';
                e.cell.innerHTML = '<div class="btn-group btn-group-justified" role="group" aria-label="...">\
                                        <div class="btn-group" role="group">\
                                            <a href="#/client/update/'+cl_id+'" class="btn btn-default btn-xs" ng-click="edit($item.cl_id)">Editar</a>\
                                        </div>\
                                        <div class="btn-group">\
                                          <button type="button" class="btn btn-default  btn-xs dropdown-toggle" data-toggle="dropdown" aria-expanded="false">\
                                            Agregar <span class="caret"></span>\
                                          </button>\
                                          <ul class="dropdown-menu" role="menu">\
                                            <li><a href="#/wo/add/'+cl_id+'"><span class="glyphicon glyphicon-th-large" aria-hidden="true"></span> Orden</a></li>\
                                            <li><a href="#/product/add/'+cl_id+'"><span class="glyphicon glyphicon-barcode" aria-hidden="true"></span> Producto</a></li>\
                                            <li><a href="#/quote/add/'+cl_id+'"><span class="glyphicon glyphicon-file" aria-hidden="true"></span> Cotizacion</a></li>\
                                            <li><a href="#/zone/add/'+cl_id+'"><span class="glyphicon glyphicon-map-marker" aria-hidden="true"></span> Zona</a></li>\
                                            <li><a href="#/email/add/'+cl_id+'"><span class="glyphicon glyphicon-envelope" aria-hidden="true"></span> Correo</a></li>\
                                          </ul>\
                                        </div>\
                                        <div class="btn-group">\
                                          <button type="button" class="btn btn-default  btn-xs dropdown-toggle" data-toggle="dropdown" aria-expanded="false">\
                                            Mostrar <span class="caret"></span>\
                                          </button>\
                                          <ul class="dropdown-menu" role="menu">\
                                            <li><a href="#/wo/'+cl_id+'"><span class="glyphicon glyphicon-list-alt" aria-hidden="true"></span> Ordenes</a></li>\
                                            <li><a href="#/product/'+cl_id+'"><span class="glyphicon glyphicon-list-alt" aria-hidden="true"></span> Productos</a></li>\
                                            <li><a href="#/quote/'+cl_id+'"><span class="glyphicon glyphicon-list-alt" aria-hidden="true"></span> Cotizaciones</a></li>\
                                            <li><a href="#/zone/'+cl_id+'"><span class="glyphicon glyphicon-list-alt" aria-hidden="true"></span> Zonas</a></li>\
                                            <li><a href="#/email/'+cl_id+'"><span class="glyphicon glyphicon-list-alt" aria-hidden="true"></span> Correos</a></li>\
                                          </ul>\
                                        </div>\
                                    </div>';
            }
        }
        
        // bind columns when grid is initialized
        $scope.initGrid = function(s, e) {
            for (var i = 0; i < $scope.labels.length; i++) {
                var col = new wijmo.grid.Column();
                col.binding = $scope.columns[i];
                console.log($scope.columns[i])
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

        $scope.$on('$viewContentLoaded', function () {
            // this code is executed after the view is loaded
            $scope.loading = true;
            clientFac.data().then(function(promise){
                $scope.loading = false;
                if(angular.isArray(promise.data)) {
                    $scope.data = new wijmo.collections.CollectionView(promise.data);
                }
                console.log(angular.fromJson(promise.data));
            });
         });
    };
    
})(angular);
},{}],"/Applications/MAMP/htdocs/ggapp/modules/client/client.fac.js":[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return function($http, $q){
        var factory = {};
        factory.data = function() {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('modules/client/client.mdl.getClients.php', {
                        /* POST variables here */
                        procces_id: new Date().getMilliseconds()
                }).success(function(data, status, headers, config){
                    return data;
                }).error(function (data, status, headers, config) {
                    return {"status": false};
                })
            );
            return deferred.promise;
        };
        return factory;
    };
    
})(angular);
},{}],"/Applications/MAMP/htdocs/ggapp/modules/client/index.js":[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.client',[
        require('./modules/client.add').name,
        require('./modules/client.update').name
    ])

    .config(['$stateProvider', '$urlRouterProvider','USER_ROLES',
    function($stateProvider, $urlRouterProvider, USER_ROLES) {
        $stateProvider.state('client', {
            url:'/client',
            templateUrl : 'modules/client/client.view.html',
            controller : 'clientCtrl',
            data: {
                authorizedRoles: [USER_ROLES.admin,USER_ROLES.editor]
            }    
        });
    }])

    .factory('clientFac',require('./client.fac'))

    .controller('clientCtrl',require('./client.ctrl'))
    
})(angular);

},{"./client.ctrl":"/Applications/MAMP/htdocs/ggapp/modules/client/client.ctrl.js","./client.fac":"/Applications/MAMP/htdocs/ggapp/modules/client/client.fac.js","./modules/client.add":"/Applications/MAMP/htdocs/ggapp/modules/client/modules/client.add/index.js","./modules/client.update":"/Applications/MAMP/htdocs/ggapp/modules/client/modules/client.update/index.js"}],"/Applications/MAMP/htdocs/ggapp/modules/client/modules/client.add/client.add.ctrl.js":[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return function ($scope, clientAddFac, $window, $location, i18nFilter, $interval) {
        $scope.fmData = {};

        $scope.onSubmit = function() {

            clientAddFac.add($scope.fmData).then(function(promise){
                if(promise.data == "1") {
                    $location.path('/client');
                } else {
                    $scope.updateFail = true;
                }
                //console.log(JSON.stringify(promise.data));
            });
            //console.log('form submitted:', $scope.formData);
        };

        $scope.getStates = function() {
            $scope.cl_stateoptions = [];
            $scope.cl_cityoptions = [];
            $scope.cl_countyoptions = [];
            $interval(function(){
                clientAddFac.getStates($scope.fmData.cl_country).then(function(promise){
                    if(angular.isArray(promise.data.geonames)) {
                        $scope.cl_stateoptions = promise.data.geonames;
                    } else {
                        //$scope.updateFail = true;
                    }
                    //console.log(JSON.stringify(promise.data));
                });
            },0,1);
        }

        $scope.getCityCounty = function() {
            $scope.cl_cityoptions = [];
            $scope.cl_countyoptions = [];
            $interval(function(){
                clientAddFac.getStates($scope.fmData.cl_state).then(function(promise){
                    if(angular.isArray(promise.data.geonames)) {
                        $scope.cl_cityoptions = promise.data.geonames;
                        $scope.cl_countyoptions = promise.data.geonames;
                    } else {
                        //$scope.updateFail = true;
                    }
                    //console.log(JSON.stringify(promise.data));
                });
            },0,1);
        };
        
        $scope.cl_statusoptions = [
            {"label":"Activo","value":"A"},
            {"label":"Inactivo","value":"I"}
        ];

        $scope.$on('$viewContentLoaded', function () {
            // this code is executed after the view is loaded
            
            clientAddFac.getCountries().then(function(promise){
                if(angular.isArray(promise.data.geonames)) {
                    $scope.cl_countryoptions = promise.data.geonames;
                } else {
                    //$scope.updateFail = true;
                }
                //console.log(JSON.stringify(promise.data.geonames));
            });

         });
    };
    
})(angular);
},{}],"/Applications/MAMP/htdocs/ggapp/modules/client/modules/client.add/client.add.fac.js":[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return function($http, $stateParams, $interval){
        var factory = {};
        factory.add = function(cl_jsonb) {
            var promise = $http.post('modules/client/modules/client.add/client.add.mdl.add.php', {
                    /* POST variables here */
                    cl_jsonb: cl_jsonb
            }).success(function(data, status, headers, config){
                return data;
            }).error(function (data, status, headers, config) {
                return {"status": false};
            });
            return promise;
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
        factory.getStates = function(cl_country) {
            var promise = $http.get('http://api.geonames.org/childrenJSON?geonameId='+cl_country+'&username=alejandrolsca')
            .success(function(data, status, headers, config){
                return data;
            }).error(function(data, status, headers, config) {
                return {"status": false};
            });
            return promise;
        };
        factory.getCityCounty = function(cl_state) {
            var promise = $http.get('http://api.geonames.org/childrenJSON?geonameId='+cl_state+'&username=alejandrolsca')
            .success(function(data, status, headers, config){
                return data;
            }).error(function(data, status, headers, config) {
                return {"status": false};
            });
            return promise;
        };
        return factory;
    };
    
})(angular);
},{}],"/Applications/MAMP/htdocs/ggapp/modules/client/modules/client.add/index.js":[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.client.add',[])

    .config(['$stateProvider', '$urlRouterProvider','USER_ROLES',
    function($stateProvider, $urlRouterProvider, USER_ROLES) {
        $stateProvider.state('clientAdd', {
            url:'/client/add',
            templateUrl : 'modules/client/modules/client.add/client.add.view.html',
            controller : 'clientAddCtrl',
            data: {
                authorizedRoles: [USER_ROLES.admin,USER_ROLES.editor]
            }    
        });
    }])

    .factory('clientAddFac',require('./client.add.fac'))

    .controller('clientAddCtrl',require('./client.add.ctrl'))

})(angular);
},{"./client.add.ctrl":"/Applications/MAMP/htdocs/ggapp/modules/client/modules/client.add/client.add.ctrl.js","./client.add.fac":"/Applications/MAMP/htdocs/ggapp/modules/client/modules/client.add/client.add.fac.js"}],"/Applications/MAMP/htdocs/ggapp/modules/client/modules/client.update/client.update.ctrl.js":[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return function ($scope, clientUpdateFac, $window, $location, i18nFilter, $interval) {
        
        $scope.onSubmit = function() {

            clientUpdateFac.update($scope.fmData).then(function(promise){
                if(promise.data == "1") {
                    $location.path('/client');
                } else {
                    $scope.updateFail = true;
                }
                //console.log(JSON.stringify(promise.data));
            });
            //console.log('form submitted:', $scope.formData);
        };
        
        $scope.getStates = function() {
            $scope.cl_stateoptions = [];
            $scope.cl_cityoptions = [];
            $scope.cl_countyoptions = [];
            $interval(function(){
                clientUpdateFac.getStates($scope.fmData.cl_country).then(function(promise){
                    if(angular.isArray(promise.data.geonames)) {
                        $scope.cl_stateoptions = promise.data.geonames;
                    } else {
                        //$scope.updateFail = true;
                    }
                    //console.log(JSON.stringify(promise.data));
                });
            },0,1);
        }

        $scope.getCityCounty = function() {
            $scope.cl_cityoptions = [];
            $scope.cl_countyoptions = [];
            $interval(function(){
                clientUpdateFac.getStates($scope.fmData.cl_state).then(function(promise){
                    if(angular.isArray(promise.data.geonames)) {
                        $scope.cl_cityoptions = promise.data.geonames;
                        $scope.cl_countyoptions = promise.data.geonames;
                    } else {
                        //$scope.updateFail = true;
                    }
                    //console.log(JSON.stringify(promise.data));
                });
            },0,1);
        }
        
        $scope.cl_statusoptions = [
            {"label":"Activo","value":"A"},
            {"label":"Inactivo","value":"I"}
        ];

        $scope.$on('$viewContentLoaded', function () {
            // this code is executed after the view is loaded
            $scope.loading = true;
            clientUpdateFac.data().then(function(promise){
                $scope.loading = false;
                if(angular.isObject(angular.fromJson(promise.data))) {
                        $scope.fmData = angular.fromJson(promise.data);
                }
                console.log(promise.data);
            }).then(function(){
                clientUpdateFac.getCountries().then(function(promise){
                    if(angular.isArray(promise.data.geonames)) {
                        $scope.cl_countryoptions = promise.data.geonames;
                    } else {
                        //$scope.updateFail = true;
                    }
                    //console.log(JSON.stringify(promise.data.geonames));
                }).then(function(){
                    clientUpdateFac.getStates($scope.fmData.cl_country).then(function(promise){
                        if(angular.isArray(promise.data.geonames)) {
                            $scope.cl_stateoptions = promise.data.geonames;
                        } else {
                            //$scope.updateFail = true;
                        }
                        //console.log(JSON.stringify(promise.data.geonames));
                    })
                }).then(function(){
                    clientUpdateFac.getCityCounty($scope.fmData.cl_state).then(function(promise){
                        if(angular.isArray(promise.data.geonames)) {
                            $scope.cl_cityoptions = promise.data.geonames;
                            $scope.cl_countyoptions = promise.data.geonames;
                        } else {
                            //$scope.updateFail = true;
                        }
                        //console.log(JSON.stringify(promise.data.geonames));
                    })
                });
            });

         });
    };
    
})(angular);
},{}],"/Applications/MAMP/htdocs/ggapp/modules/client/modules/client.update/client.update.fac.js":[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return function($http, $q, $stateParams){
        var factory = {};
        factory.data = function() {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('modules/client/modules/client.update/client.update.mdl.getClient.php', {
                    /* POST variables here */
                    cl_id: $stateParams.cl_id
                }).success(function(data, status, headers, config){
                    return data;
                }).error(function (data, status, headers, config) {
                    return {"status": false};
                })
            );
            return deferred.promise;
        };
        factory.update = function(cl_jsonb) {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('modules/client/modules/client.update/client.update.mdl.update.php', {
                    /* POST variables here */
                    cl_id: $stateParams.cl_id,
                    cl_jsonb: cl_jsonb
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
        factory.getStates = function(cl_country) {
            var promise = $http.get('http://api.geonames.org/childrenJSON?geonameId='+cl_country+'&username=alejandrolsca')
            .success(function(data, status, headers, config){
                return data;
            }).error(function(data, status, headers, config) {
                return {"status": false};
            });
            return promise;
        };
        factory.getCityCounty = function(cl_state) {
            var promise = $http.get('http://api.geonames.org/childrenJSON?geonameId='+cl_state+'&username=alejandrolsca')
            .success(function(data, status, headers, config){
                return data;
            }).error(function(data, status, headers, config) {
                return {"status": false};
            });
            return promise;
        };
        return factory;
    };
    
})(angular);
},{}],"/Applications/MAMP/htdocs/ggapp/modules/client/modules/client.update/index.js":[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.client.update',[])

    .config(['$stateProvider', '$urlRouterProvider','USER_ROLES',
    function($stateProvider, $urlRouterProvider, USER_ROLES) {
        $stateProvider.state('clientUpdate', {
            url:'/client/update/:cl_id',
            templateUrl : 'modules/client/modules/client.update/client.update.view.html',
            controller : 'clientUpdateCtrl',
            data: {
                authorizedRoles: [USER_ROLES.admin,USER_ROLES.editor]
            }    
        });
    }])

    .factory('clientUpdateFac',require('./client.update.fac'))

    .controller('clientUpdateCtrl',require('./client.update.ctrl'))

})(angular);
},{"./client.update.ctrl":"/Applications/MAMP/htdocs/ggapp/modules/client/modules/client.update/client.update.ctrl.js","./client.update.fac":"/Applications/MAMP/htdocs/ggapp/modules/client/modules/client.update/client.update.fac.js"}],"/Applications/MAMP/htdocs/ggapp/modules/home/home.ctrl.js":[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return function ($rootScope, $scope, homeFac, $window) {
        console.log($rootScope.user);
        $scope.user = $rootScope.user;
        $scope.$on('$viewContentLoaded', function () {
            // this code is executed after the view is loaded
        });
    };
    
})(angular);
},{}],"/Applications/MAMP/htdocs/ggapp/modules/home/home.fac.js":[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return function($http, $q){
        var factory = {};
        factory.getLogin = function(user) {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('modules/home/homeModel.php', {
                        /* POST variables here */
                }).success(function(data, status, headers, config){
                    return data;
                }).error(function (data, status, headers, config) {
                    return {"status": false};
                })
            );
            return deferred.promise;
        };
        return factory;
    };
    
})(angular);
},{}],"/Applications/MAMP/htdocs/ggapp/modules/home/index.js":[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.home',[])

    .config(['$stateProvider', '$urlRouterProvider','USER_ROLES',
    function($stateProvider, $urlRouterProvider, USER_ROLES) {
        $stateProvider.state('home', {
            url:'/home',
            templateUrl : 'modules/home/home.view.html',
            controller : 'homeCtrl',
            data: {
                authorizedRoles: [USER_ROLES.admin, USER_ROLES.editor]
            }    
        });
    }])

    .factory('homeFac',require('./home.fac'))

    .controller('homeCtrl',require('./home.ctrl'))

})(angular);
},{"./home.ctrl":"/Applications/MAMP/htdocs/ggapp/modules/home/home.ctrl.js","./home.fac":"/Applications/MAMP/htdocs/ggapp/modules/home/home.fac.js"}],"/Applications/MAMP/htdocs/ggapp/modules/user/index.js":[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.user',[
        require('./modules/user.add').name,
        require('./modules/user.update').name,
        require('./modules/user.profile').name
    ])

    .config(['$stateProvider', '$urlRouterProvider','USER_ROLES',
    function($stateProvider, $urlRouterProvider, USER_ROLES) {
        $stateProvider.state('user', {
            url:'/user',
            templateUrl : 'modules/user/user.view.html',
            controller : 'userCtrl',
            data: {
                authorizedRoles: [USER_ROLES.admin,USER_ROLES.editor]
            }    
        });
    }])

    .factory('userFac',require('./user.fac'))

    .controller('userCtrl',require('./user.ctrl'))

})(angular);
},{"./modules/user.add":"/Applications/MAMP/htdocs/ggapp/modules/user/modules/user.add/index.js","./modules/user.profile":"/Applications/MAMP/htdocs/ggapp/modules/user/modules/user.profile/index.js","./modules/user.update":"/Applications/MAMP/htdocs/ggapp/modules/user/modules/user.update/index.js","./user.ctrl":"/Applications/MAMP/htdocs/ggapp/modules/user/user.ctrl.js","./user.fac":"/Applications/MAMP/htdocs/ggapp/modules/user/user.fac.js"}],"/Applications/MAMP/htdocs/ggapp/modules/user/modules/user.add/index.js":[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.user.add',[])

    .config(['$stateProvider', '$urlRouterProvider','USER_ROLES',
    function($stateProvider, $urlRouterProvider, USER_ROLES) {
        $stateProvider.state('userAdd', {
            url:'/user/add',
            templateUrl : 'modules/user/modules/user.add/user.add.view.html',
            controller : 'userAddCtrl',
            data: {
                authorizedRoles: [USER_ROLES.admin,USER_ROLES.editor]
            }    
        });
    }])

    .factory('userAddFac',require('./user.add.fac'))

    .controller('userAddCtrl',require('./user.add.ctrl'))
    
})(angular);

},{"./user.add.ctrl":"/Applications/MAMP/htdocs/ggapp/modules/user/modules/user.add/user.add.ctrl.js","./user.add.fac":"/Applications/MAMP/htdocs/ggapp/modules/user/modules/user.add/user.add.fac.js"}],"/Applications/MAMP/htdocs/ggapp/modules/user/modules/user.add/user.add.ctrl.js":[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return function ($scope, userAddFac, $window, $location, i18nFilter) {
        
        $scope.onSubmit = function() {

            userAddFac.add($scope.fmData).then(function(promise){
                if(promise.data == "1") {
                    $location.path('/user');
                } else {
                    $scope.updateFail = true;
                }
                //console.log(JSON.stringify(promise.data));
            });
            //console.log('form submitted:', $scope.formData);
        };

        $scope.$on('$viewContentLoaded', function () {
            // this code is executed after the view is loaded
         });
    };
    
})(angular);
},{}],"/Applications/MAMP/htdocs/ggapp/modules/user/modules/user.add/user.add.fac.js":[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return function($http, $stateParams){
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
    };
    
})(angular);
},{}],"/Applications/MAMP/htdocs/ggapp/modules/user/modules/user.profile/index.js":[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.user.profile',[])

    .config(['$stateProvider', '$urlRouterProvider','USER_ROLES',
    function($stateProvider, $urlRouterProvider, USER_ROLES) {
        $stateProvider.state('userProfile', {
            url:'/user/profile',
            templateUrl : 'modules/user/modules/user.profile/user.profile.view.html',
            controller : 'userProfileCtrl',
            data: {
                authorizedRoles: [USER_ROLES.admin,USER_ROLES.editor]
            }    
        });
    }])

    .controller('userProfileCtrl',require('./user.profile.ctrl'))
    
})(angular);

},{"./user.profile.ctrl":"/Applications/MAMP/htdocs/ggapp/modules/user/modules/user.profile/user.profile.ctrl.js"}],"/Applications/MAMP/htdocs/ggapp/modules/user/modules/user.profile/user.profile.ctrl.js":[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return function ($scope, $window, $location, i18nFilter, $rootScope) {
        $scope.user = $rootScope.user;
        $scope.$on('$viewContentLoaded', function () {
            // this code is executed after the view is loaded
         });
    };
    
})(angular);
},{}],"/Applications/MAMP/htdocs/ggapp/modules/user/modules/user.update/index.js":[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.user.update',[])

    .config(['$stateProvider', '$urlRouterProvider','USER_ROLES',
    function($stateProvider, $urlRouterProvider, USER_ROLES) {
        $stateProvider.state('userUpdate', {
            url:'/user/update/:us_id',
            templateUrl : 'modules/user/modules/user.update/user.update.view.html',
            controller : 'userUpdateCtrl',
            data: {
                authorizedRoles: [USER_ROLES.admin,USER_ROLES.editor]
            }    
        });
    }])

    .factory('userUpdateFac',require('./user.update.fac'))

    .controller('userUpdateCtrl',require('./user.update.ctrl'))

})(angular);
},{"./user.update.ctrl":"/Applications/MAMP/htdocs/ggapp/modules/user/modules/user.update/user.update.ctrl.js","./user.update.fac":"/Applications/MAMP/htdocs/ggapp/modules/user/modules/user.update/user.update.fac.js"}],"/Applications/MAMP/htdocs/ggapp/modules/user/modules/user.update/user.update.ctrl.js":[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return function ($scope, userUpdateFac, $window, $location, i18nFilter) {
        
        $scope.onSubmit = function() {

            userUpdateFac.update($scope.fmData).then(function(promise){
                if(promise.data == "1") {
                    $location.path('/user');
                } else {
                    $scope.updateFail = true;
                }
                //console.log(JSON.stringify(promise.data));
            });
            //console.log('form submitted:', $scope.formData);
        };

        $scope.$on('$viewContentLoaded', function () {
            // this code is executed after the view is loaded

            $scope.loading = true;
            userUpdateFac.data().then(function(promise){
                $scope.loading = false;
                if(angular.isObject(angular.fromJson(promise.data))) {
                        $scope.fmData = angular.fromJson(promise.data);
                }
                console.log(promise.data);
            });



         });
    };
    
})(angular);
},{}],"/Applications/MAMP/htdocs/ggapp/modules/user/modules/user.update/user.update.fac.js":[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return function($http, $q, $stateParams){
        var factory = {};
        factory.data = function() {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('modules/user/modules/user.update/user.update.mdl.getUser.php', {
                    /* POST variables here */
                    us_id: $stateParams.us_id
                }).success(function(data, status, headers, config){
                    return data;
                }).error(function (data, status, headers, config) {
                    return {"status": false};
                })
            );
            return deferred.promise;
        };
        factory.update = function(us_jsonb) {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('modules/user/modules/user.update/user.update.mdl.update.php', {
                    /* POST variables here */
                    us_id: $stateParams.us_id,
                    us_jsonb: us_jsonb
                }).success(function(data, status, headers, config){
                    return data;
                }).error(function (data, status, headers, config) {
                    return {"status": false};
                })
            );
            return deferred.promise;
        };
        return factory;
    };
    
})(angular);
},{}],"/Applications/MAMP/htdocs/ggapp/modules/user/user.ctrl.js":[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return function ($scope, userFac, $window, i18nFilter, $parse) {
        
        $scope.labels = Object.keys(i18nFilter("user.labels"));
        $scope.columns = i18nFilter("user.columns");

        console.log(JSON.stringify($scope.fields));

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
                console.log(angular.fromJson(promise.data));
            });
         });
    };
    
})(angular);
},{}],"/Applications/MAMP/htdocs/ggapp/modules/user/user.fac.js":[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return function($http, $q){
        var factory = {};
        factory.data = function() {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('modules/user/user.mdl.getUsers.php', {
                        /* POST variables here */
                }).success(function(data, status, headers, config){
                    return data;
                }).error(function (data, status, headers, config) {
                    return {"status": false};
                })
            );
            return deferred.promise;
        };
        return factory;
    };
    
})(angular);
},{}],"/Applications/MAMP/htdocs/ggapp/modules/wo/index.js":[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.wo',[
        require('./modules/woAdd').name,
        require('./modules/woUpdate').name
    ])

    .config(['$stateProvider', '$urlRouterProvider','USER_ROLES',
    function($stateProvider, $urlRouterProvider, USER_ROLES) {
        $stateProvider.state('wo', {
            url:'/wo',
            templateUrl : 'modules/wo/wo.view.html',
            controller : 'woController',
            data: {
                authorizedRoles: [USER_ROLES.admin,USER_ROLES.editor]
            }    
        });
    }])

    .factory('woFactory',require('./wo.fac'))

    .controller('woController',require('./wo.ctrl'))

})(angular);
},{"./modules/woAdd":"/Applications/MAMP/htdocs/ggapp/modules/wo/modules/woAdd/index.js","./modules/woUpdate":"/Applications/MAMP/htdocs/ggapp/modules/wo/modules/woUpdate/index.js","./wo.ctrl":"/Applications/MAMP/htdocs/ggapp/modules/wo/wo.ctrl.js","./wo.fac":"/Applications/MAMP/htdocs/ggapp/modules/wo/wo.fac.js"}],"/Applications/MAMP/htdocs/ggapp/modules/wo/modules/woAdd/index.js":[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.woAdd',[])

    .config(['$stateProvider', '$urlRouterProvider','USER_ROLES',
    function($stateProvider, $urlRouterProvider, USER_ROLES) {
        $stateProvider.state('woAdd', {
            url:'/wo/add/:cl_id',
            templateUrl : 'modules/wo/modules/woAdd/wo.add.view.html',
            controller : 'woAddController',
            data: {
                authorizedRoles: [USER_ROLES.admin,USER_ROLES.editor]
            }    
        });
    }])

    .factory('woAddFactory',require('./wo.add.fac'))

    .controller('woAddController',require('./wo.add.ctrl'))

})(angular);
},{"./wo.add.ctrl":"/Applications/MAMP/htdocs/ggapp/modules/wo/modules/woAdd/wo.add.ctrl.js","./wo.add.fac":"/Applications/MAMP/htdocs/ggapp/modules/wo/modules/woAdd/wo.add.fac.js"}],"/Applications/MAMP/htdocs/ggapp/modules/wo/modules/woAdd/wo.add.ctrl.js":[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return function ($scope, woAddFactory, $window, $stateParams) {
        $scope.fmData = {};
        
        $scope.$on('$viewContentLoaded', function () {
            // this code is executed after the view is loaded
            $scope.loading = true;
            woAddFactory.getClient().then(function(promise){
                $scope.loading = false;
                if(angular.isObject(promise.data)) {
                    $scope.client = promise.data;
                    $scope.fmData.cl_corporatename = $scope.client.cl_corporatename;
                }
                console.log(JSON.stringify(promise.data));
            });
         });
    };
    
})(angular);
},{}],"/Applications/MAMP/htdocs/ggapp/modules/wo/modules/woAdd/wo.add.fac.js":[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return function($http, $q , $stateParams){
        var factory = {};
        factory.getClient = function() {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('modules/wo/modules/woAdd/wo.add.mdl.getClient.php', {
                    /* POST variables here */
                    cl_id: $stateParams.cl_id
                }).success(function(data, status, headers, config){
                    return data;
                }).error(function (data, status, headers, config) {
                    return {"status": false};
                })
            );
            return deferred.promise;
        };
        factory.addData = function() {
            var promise = $http.post('modules/wo/modules/woAdd/wo.add.mdl.add.php', {
                    /* POST variables here */
            }).success(function(data, status, headers, config){
                return data;
            }).error(function (data, status, headers, config) {
                return {"status": false};
            });
            return promise;
        };
        return factory;
    };
    
})(angular);
},{}],"/Applications/MAMP/htdocs/ggapp/modules/wo/modules/woUpdate/index.js":[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.woUpdate',[])

    .config(['$stateProvider', '$urlRouterProvider','USER_ROLES',
    function($stateProvider, $urlRouterProvider, USER_ROLES) {
        $stateProvider.state('woUpdate', {
            url:'/wo/update/:wo_id',
            templateUrl : 'modules/wo/modules/woUpdate/wo.update.view.html',
            controller : 'woUpdateController',
            data: {
                authorizedRoles: [USER_ROLES.admin,USER_ROLES.editor]
            }    
        });
    }])

    .factory('woUpdateFactory',require('./wo.update.fac'))

    .controller('woUpdateController',require('./wo.update.ctrl'))

})(angular);
},{"./wo.update.ctrl":"/Applications/MAMP/htdocs/ggapp/modules/wo/modules/woUpdate/wo.update.ctrl.js","./wo.update.fac":"/Applications/MAMP/htdocs/ggapp/modules/wo/modules/woUpdate/wo.update.fac.js"}],"/Applications/MAMP/htdocs/ggapp/modules/wo/modules/woUpdate/wo.update.ctrl.js":[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return function ($scope, woUpdateFactory, $window) {
    
        $scope.$on('$viewContentLoaded', function () {
            // this code is executed after the view is loaded
            $scope.loading = true;
            woUpdateFactory.updateData().then(function(promise){
                $scope.loading = false;
                if(angular.isArray(promise.data)) {

                }
                console.log(JSON.stringify(promise.data));
            });
         });
    };
    
})(angular);
},{}],"/Applications/MAMP/htdocs/ggapp/modules/wo/modules/woUpdate/wo.update.fac.js":[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return function($http, $stateParams){
        var factory = {};
        factory.updateData = function() {
            var promise = $http.post('modules/wo/modules/woUpdate/wo.update.mdl.update.php', {
                    /* POST variables here */
                    wo_id: $stateParams.wo_id
            }).success(function(data, status, headers, config){
                return data;
            }).error(function (data, status, headers, config) {
                return {"status": false};
            });
            return promise;
        };
        return factory;
    };
    
})(angular);
},{}],"/Applications/MAMP/htdocs/ggapp/modules/wo/wo.ctrl.js":[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';
    
    return function ($scope, woFactory,$location, i18nFilter) {
    
        $scope.fields = Object.keys(i18nFilter("WO.FIELDS"));

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
        
        // bind columns when grid is initialized
        $scope.initGrid = function(s, e) {
            for (var i = 0; i < $scope.labels.length; i++) {
                var col = new wijmo.grid.Column();
                col.binding = $scope.fields[i].toLowerCase();
                col.header = i18nFilter("WO.labels." + $scope.fields[i]);
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

        $scope.$on('$viewContentLoaded', function() {
            // this code is executed after the view is loaded

            $scope.loading = true;
            
            woFactory.getData().then(function(promise){
                
                $scope.loading = false;
                
                if(angular.isArray(promise.data)) {
                                            
                    // expose data as a CollectionView to get events
                    $scope.data = new wijmo.collections.CollectionView(promise.data);   
                    
                }
                //console.log(JSON.stringify(promise.data));
            });
         });
    };
    
})(angular);
},{}],"/Applications/MAMP/htdocs/ggapp/modules/wo/wo.fac.js":[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return function($http, $q){
        var factory = {};
        factory.getData = function() {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('modules/wo/wo.mdl.getWO.php', {
                        /* POST variables here */
                }).success(function(data, status, headers, config){
                    return data;
                }).error(function (data, status, headers, config) {
                    return {"status": false};
                })
            );
            return deferred.promise;
        };
        return factory;
    };
    
})(angular);
},{}],"/Applications/MAMP/htdocs/ggapp/modules/zone/index.js":[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.zone',[
        require('./modules/zone.add').name,
        require('./modules/zone.update').name
    ])

    .config(['$stateProvider', '$urlRouterProvider','USER_ROLES',
    function($stateProvider, $urlRouterProvider, USER_ROLES) {
        $stateProvider.state('zone', {
            url:'/zone/:cl_id',
            templateUrl : 'modules/zone/zone.view.html',
            controller : 'zoneCtrl',
            data: {
                authorizedRoles: [USER_ROLES.admin,USER_ROLES.editor]
            }    
        });
    }])

    .factory('zoneFac',require('./zone.fac'))

    .controller('zoneCtrl',require('./zone.ctrl'))
    
})(angular);

},{"./modules/zone.add":"/Applications/MAMP/htdocs/ggapp/modules/zone/modules/zone.add/index.js","./modules/zone.update":"/Applications/MAMP/htdocs/ggapp/modules/zone/modules/zone.update/index.js","./zone.ctrl":"/Applications/MAMP/htdocs/ggapp/modules/zone/zone.ctrl.js","./zone.fac":"/Applications/MAMP/htdocs/ggapp/modules/zone/zone.fac.js"}],"/Applications/MAMP/htdocs/ggapp/modules/zone/modules/zone.add/index.js":[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.zone.add',[])

    .config(['$stateProvider', '$urlRouterProvider','USER_ROLES',
    function($stateProvider, $urlRouterProvider, USER_ROLES) {
        $stateProvider.state('zoneAdd', {
            url:'/zone/add/:cl_id',
            templateUrl : 'modules/zone/modules/zone.add/zone.add.view.html',
            controller : 'zoneAddCtrl',
            data: {
                authorizedRoles: [USER_ROLES.admin,USER_ROLES.editor]
            }    
        });
    }])

    .factory('zoneAddFac',require('./zone.add.fac'))

    .controller('zoneAddCtrl',require('./zone.add.ctrl'))

})(angular);
},{"./zone.add.ctrl":"/Applications/MAMP/htdocs/ggapp/modules/zone/modules/zone.add/zone.add.ctrl.js","./zone.add.fac":"/Applications/MAMP/htdocs/ggapp/modules/zone/modules/zone.add/zone.add.fac.js"}],"/Applications/MAMP/htdocs/ggapp/modules/zone/modules/zone.add/zone.add.ctrl.js":[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return function ($scope, zoneAddFac, $window, $location, i18nFilter, $interval, $stateParams) {
        $scope.fmData = {};
        $scope.fmData.cl_id = $stateParams.cl_id;

        $scope.onSubmit = function() {

            zoneAddFac.add($scope.fmData).then(function(promise){
                if(promise.data == "1") {
                    $location.path('/zone');
                } else {
                    $scope.updateFail = true;
                }
                //console.log(JSON.stringify(promise.data));
            });
            //console.log('form submitted:', $scope.formData);
        };

        $scope.getStates = function() {
            $scope.zo_stateoptions = [];
            $scope.zo_cityoptions = [];
            $scope.zo_countyoptions = [];
            $interval(function(){
                zoneAddFac.getStates($scope.fmData.zo_country).then(function(promise){
                    if(angular.isArray(promise.data.geonames)) {
                        $scope.zo_stateoptions = promise.data.geonames;
                    } else {
                        //$scope.updateFail = true;
                    }
                    //console.log(JSON.stringify(promise.data));
                });
            },0,1);
        }

        $scope.getCityCounty = function() {
            $scope.zo_cityoptions = [];
            $scope.zo_countyoptions = [];
            $interval(function(){
                zoneAddFac.getStates($scope.fmData.zo_state).then(function(promise){
                    if(angular.isArray(promise.data.geonames)) {
                        $scope.zo_cityoptions = promise.data.geonames;
                        $scope.zo_countyoptions = promise.data.geonames;
                    } else {
                        //$scope.updateFail = true;
                    }
                    //console.log(JSON.stringify(promise.data));
                });
            },0,1);
        };
        
        $scope.zo_statusoptions = [
            {"label":"Activo","value":"A"},
            {"label":"Inactivo","value":"I"}
        ];

        $scope.$on('$viewContentLoaded', function () {
            // this code is executed after the view is loaded
            
            zoneAddFac.getClient().then(function(promise){
                $scope.loading = false;
                if(angular.isObject(promise.data)) {
                    $scope.client = promise.data;
                }
                console.log(JSON.stringify(promise.data));
            });
            
            zoneAddFac.getCountries().then(function(promise){
                if(angular.isArray(promise.data.geonames)) {
                    $scope.zo_countryoptions = promise.data.geonames;
                } else {
                    //$scope.updateFail = true;
                }
                //console.log(JSON.stringify(promise.data.geonames));
            });

         });
    };
    
})(angular);
},{}],"/Applications/MAMP/htdocs/ggapp/modules/zone/modules/zone.add/zone.add.fac.js":[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return function($http, $q, $stateParams, $interval){
        var factory = {};
        factory.getClient = function() {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('modules/zone/modules/zone.add/zone.add.mdl.getClient.php', {
                    /* POST variables here */
                    cl_id: $stateParams.cl_id
                }).success(function(data, status, headers, config){
                    return data;
                }).error(function (data, status, headers, config) {
                    return {"status": false};
                })
            );
            return deferred.promise;
        };
        factory.add = function(zo_jsonb) {
            var promise = $http.post('modules/zone/modules/zone.add/zone.add.mdl.add.php', {
                    /* POST variables here */
                    zo_jsonb: zo_jsonb
            }).success(function(data, status, headers, config){
                return data;
            }).error(function (data, status, headers, config) {
                return {"status": false};
            });
            return promise;
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
        factory.getStates = function(zo_country) {
            var promise = $http.get('http://api.geonames.org/childrenJSON?geonameId='+zo_country+'&username=alejandrolsca')
            .success(function(data, status, headers, config){
                return data;
            }).error(function(data, status, headers, config) {
                return {"status": false};
            });
            return promise;
        };
        factory.getCityCounty = function(zo_state) {
            var promise = $http.get('http://api.geonames.org/childrenJSON?geonameId='+zo_state+'&username=alejandrolsca')
            .success(function(data, status, headers, config){
                return data;
            }).error(function(data, status, headers, config) {
                return {"status": false};
            });
            return promise;
        };
        return factory;
    };
    
})(angular);
},{}],"/Applications/MAMP/htdocs/ggapp/modules/zone/modules/zone.update/index.js":[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.zone.update',[])

    .config(['$stateProvider', '$urlRouterProvider','USER_ROLES',
    function($stateProvider, $urlRouterProvider, USER_ROLES) {
        $stateProvider.state('zoneUpdate', {
            url:'/zone/update/:cl_id/:zo_id',
            templateUrl : 'modules/zone/modules/zone.update/zone.update.view.html',
            controller : 'zoneUpdateCtrl',
            data: {
                authorizedRoles: [USER_ROLES.admin,USER_ROLES.editor]
            }    
        });
    }])

    .factory('zoneUpdateFac',require('./zone.update.fac'))

    .controller('zoneUpdateCtrl',require('./zone.update.ctrl'))

})(angular);
},{"./zone.update.ctrl":"/Applications/MAMP/htdocs/ggapp/modules/zone/modules/zone.update/zone.update.ctrl.js","./zone.update.fac":"/Applications/MAMP/htdocs/ggapp/modules/zone/modules/zone.update/zone.update.fac.js"}],"/Applications/MAMP/htdocs/ggapp/modules/zone/modules/zone.update/zone.update.ctrl.js":[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return function ($scope, zoneUpdateFac, $window, $location, i18nFilter, $interval, $stateParams) {
        
        $scope.onSubmit = function() {

            zoneUpdateFac.update($scope.fmData).then(function(promise){
                if(promise.data == "1") {
                    $location.path('/zone/'+$stateParams.cl_id);
                } else {
                    $scope.updateFail = true;
                }
                //console.log(JSON.stringify(promise.data));
            });
            //console.log('form submitted:', $scope.formData);
        };
        
        $scope.getStates = function() {
            $scope.zo_stateoptions = [];
            $scope.zo_cityoptions = [];
            $scope.zo_countyoptions = [];
            $interval(function(){
                zoneUpdateFac.getStates($scope.fmData.zo_country).then(function(promise){
                    if(angular.isArray(promise.data.geonames)) {
                        $scope.zo_stateoptions = promise.data.geonames;
                    } else {
                        //$scope.updateFail = true;
                    }
                    //console.log(JSON.stringify(promise.data));
                });
            },0,1);
        }

        $scope.getCityCounty = function() {
            $scope.zo_cityoptions = [];
            $scope.zo_countyoptions = [];
            $interval(function(){
                zoneUpdateFac.getStates($scope.fmData.zo_state).then(function(promise){
                    if(angular.isArray(promise.data.geonames)) {
                        $scope.zo_cityoptions = promise.data.geonames;
                        $scope.zo_countyoptions = promise.data.geonames;
                    } else {
                        //$scope.updateFail = true;
                    }
                    //console.log(JSON.stringify(promise.data));
                });
            },0,1);
        }
        
        $scope.zo_statusoptions = [
            {"label":"Activo","value":"A"},
            {"label":"Inactivo","value":"I"}
        ];

        $scope.$on('$viewContentLoaded', function () {
            // this code is executed after the view is loaded
            $scope.loading = true;
            zoneUpdateFac.data().then(function(promise){
                $scope.loading = false;
                if(angular.isObject(angular.fromJson(promise.data))) {
                        $scope.fmData = angular.fromJson(promise.data);
                }
                console.log(promise.data);
            }).then(function(){
                zoneUpdateFac.getCountries().then(function(promise){
                    if(angular.isArray(promise.data.geonames)) {
                        $scope.zo_countryoptions = promise.data.geonames;
                    } else {
                        //$scope.updateFail = true;
                    }
                    //console.log(JSON.stringify(promise.data.geonames));
                }).then(function(){
                    zoneUpdateFac.getStates($scope.fmData.zo_country).then(function(promise){
                        if(angular.isArray(promise.data.geonames)) {
                            $scope.zo_stateoptions = promise.data.geonames;
                        } else {
                            //$scope.updateFail = true;
                        }
                        //console.log(JSON.stringify(promise.data.geonames));
                    })
                }).then(function(){
                    zoneUpdateFac.getCityCounty($scope.fmData.zo_state).then(function(promise){
                        if(angular.isArray(promise.data.geonames)) {
                            $scope.zo_cityoptions = promise.data.geonames;
                            $scope.zo_countyoptions = promise.data.geonames;
                        } else {
                            //$scope.updateFail = true;
                        }
                        //console.log(JSON.stringify(promise.data.geonames));
                    })
                });
            });

         });
    };
    
})(angular);
},{}],"/Applications/MAMP/htdocs/ggapp/modules/zone/modules/zone.update/zone.update.fac.js":[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return function($http, $q, $stateParams){
        var factory = {};
        factory.data = function() {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('modules/zone/modules/zone.update/zone.update.mdl.getZone.php', {
                    /* POST variables here */
                    zo_id: $stateParams.zo_id
                }).success(function(data, status, headers, config){
                    return data;
                }).error(function (data, status, headers, config) {
                    return {"status": false};
                })
            );
            return deferred.promise;
        };
        factory.update = function(zo_jsonb) {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('modules/zone/modules/zone.update/zone.update.mdl.update.php', {
                    /* POST variables here */
                    zo_id: $stateParams.zo_id,
                    zo_jsonb: zo_jsonb
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
        factory.getStates = function(zo_country) {
            var promise = $http.get('http://api.geonames.org/childrenJSON?geonameId='+zo_country+'&username=alejandrolsca')
            .success(function(data, status, headers, config){
                return data;
            }).error(function(data, status, headers, config) {
                return {"status": false};
            });
            return promise;
        };
        factory.getCityCounty = function(zo_state) {
            var promise = $http.get('http://api.geonames.org/childrenJSON?geonameId='+zo_state+'&username=alejandrolsca')
            .success(function(data, status, headers, config){
                return data;
            }).error(function(data, status, headers, config) {
                return {"status": false};
            });
            return promise;
        };
        return factory;
    };
    
})(angular);
},{}],"/Applications/MAMP/htdocs/ggapp/modules/zone/zone.ctrl.js":[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return function ($scope, zoneFac, $window, i18nFilter, $parse) {
    
        $scope.labels = Object.keys(i18nFilter("zone.labels"));
        $scope.columns = i18nFilter("zone.columns");
        
        // formatItem event handler
        var zo_id;
        var cl_id;
        $scope.formatItem = function(s, e, cell) {
            
            if (e.panel.cellType == wijmo.grid.CellType.RowHeader) {
                e.cell.textContent = e.row+1;
            }
            
            s.rows.defaultSize = 30;
            
            // add Bootstrap html
            if ((e.panel.cellType == wijmo.grid.CellType.Cell) && (e.col == 0)) {
                zo_id = e.panel.getCellData(e.row,1,false);
                cl_id = e.panel.getCellData(e.row,2,false);
                e.cell.style.overflow = 'visible';
                e.cell.innerHTML = '<div class="btn-group btn-group-justified" role="group" aria-label="...">\
                                        <div class="btn-group" role="group">\
                                            <a href="#/zone/update/'+cl_id+'/'+zo_id+'" class="btn btn-default btn-xs" ng-click="edit($item.cl_id)">Editar</a>\
                                        </div>\
                                    </div>';
            }
        }
        
        // bind columns when grid is initialized
        $scope.initGrid = function(s, e) {
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
            zoneFac.data().then(function(promise){
                $scope.loading = false;
                if(angular.isArray(promise.data)) {
                    $scope.data = new wijmo.collections.CollectionView(promise.data);
                }
                console.log(angular.fromJson(promise.data));
            });
         });
    };
    
})(angular);
},{}],"/Applications/MAMP/htdocs/ggapp/modules/zone/zone.fac.js":[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return function($http, $q, $stateParams){
        var factory = {};
        factory.data = function() {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('modules/zone/zone.mdl.getZones.php', {
                        /* POST variables here */
                        procces_id: new Date().getMilliseconds(),
                        cl_id: $stateParams.cl_id
                }).success(function(data, status, headers, config){
                    return data;
                }).error(function (data, status, headers, config) {
                    return {"status": false};
                })
            );
            return deferred.promise;
        };
        return factory;
    };
    
})(angular);
},{}]},{},["/Applications/MAMP/htdocs/ggapp/modules/app.js"]);
