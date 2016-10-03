(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$scope', function ($scope) {
        //ASD
    }];

})(angular);
},{}],2:[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.404',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('404', {
            url:'/404',
            templateUrl : 'app/404/404.view.html',
            controller : '404Ctrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .controller('404Ctrl',require('./404.ctrl'))

})(angular);
},{"./404.ctrl":1}],3:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$scope', '$rootScope', 'i18nFilter', '$location', 'authService', 
        function ($scope, $rootScope, i18nFilter, $location, authService) {

            //$scope.authService = authService;
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
},{}],4:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q',  function ($http, $q) {
        var factory = {};
        factory.jwtCheck = function (newLang) {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/jwt', {
                    process: new Date().getMilliseconds()
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        return factory;
    }];

})(angular);
},{}],5:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$q', '$injector', 'authService',
        function ($q, $injector, authService) {
            return {
                'request': function (config) {
                    // if user is athenticated, add the profile to the headers

                    if (!!authService.userProfile) {
                        config.headers.profile = JSON.stringify(authService.userProfile);
                    }
                    return config;
                },

                'requestError': function (rejection) {
                    // do something on error
                    return $q.reject(rejection);
                },
                'responseError': function (rejection) {
                    // do something on error
                    var alerts = $injector.get('$alerts');
                    alerts.error('Wooops! an error has ocurred.', JSON.stringify(rejection, null, 4));
                    return $q.reject(rejection);
                }
            }
        }]

})(angular)
},{}],6:[function(require,module,exports){
(function (angular) {

    'use strict';// lo que sea

    angular.module('app', [
        'ui.router',
        'ngAnimate',
        'ui.bootstrap',
        'gg-fields',
        'gg-alerts',
        'wj',
        'ja.qr',
        'auth0.lock',
        'angular-jwt',
        require('./404').name,
        require('./login').name,
        require('./client').name,
        require('./user').name,
        require('./home').name,
        require('./product').name,
        require('./supplier').name,
        require('./machine').name,
        require('./paper').name,
        require('./ink').name,
        require('./wo').name,
        require('./zone').name,
        require('./workflow').name
    ])

        .service('authService', ['$rootScope', '$location', 'lock', 'authManager', function authService($rootScope, $location, lock, authManager) {

            var userProfile = angular.fromJson(localStorage.getItem('profile')) || {};

            function login() {
                lock.show();
            }

            // Logging out just requires removing the user's
            // id_token and profile
            function logout() {
                localStorage.removeItem('id_token');
                localStorage.removeItem('profile');
                authManager.unauthenticate();
                userProfile = {};
            }

            // Set up the logic for when a user authenticates
            // This method is called from app.run.js
            function registerAuthenticationListener() {
                lock.on('authenticated', function (authResult) {
                    localStorage.setItem('id_token', authResult.idToken);
                    authManager.authenticate();

                    lock.getProfile(authResult.idToken, function (error, profile) {
                        if (error) {
                            console.log(error);
                        }

                        localStorage.setItem('profile', JSON.stringify(profile));
                        $rootScope.$broadcast('userProfileSet', profile);
                    });
                    $location.path('/home');
                });
            }

            return {
                userProfile: userProfile,
                login: login,
                logout: logout,
                registerAuthenticationListener: registerAuthenticationListener,
            }
        }])

        .config(['$locationProvider', '$stateProvider', '$urlRouterProvider', '$httpProvider', 'lockProvider', 'jwtOptionsProvider', 'jwtInterceptorProvider',
            function ($locationProvider, $stateProvider, $urlRouterProvider, $httpProvider, lockProvider, jwtOptionsProvider, jwtInterceptorProvider) {

                lockProvider.init({
                    clientID: 'ZexVDEPlqGLMnWXnmyKSsoE8JO3ZS76y',
                    domain: 'grupografico.auth0.com',
                    options: {
                        avatar: null,
                        language: "es",
                        closable: true,
                        autoclose: true,
                        rememberLastLogin: false,
                        auth: {
                            redirect: false,
                            redirectUrl: "http://localhost:3000/www/#/home",
                            responseType: "token",
                            sso: false
                        },
                        languageDictionary: {
                            title: "Grupo Gráfico"
                        },
                        theme: {
                            labeledSubmitButton: true,
                            //logo: "img/ggauth-logo.png",
                            primaryColor: "green"
                        }
                    }
                });

                jwtOptionsProvider.config({
                    loginPath: '/home',
                    unauthenticatedRedirector: ['$state', function ($state) {
                        $state.go('login');
                    }],
                    tokenGetter: function () {
                        return localStorage.getItem('id_token');
                    },
                    whiteListedDomains: [
                        'http://api.geonames.org/'
                    ]
                });

                $httpProvider.interceptors.push('jwtInterceptor');

                $httpProvider.interceptors.push(require('./app.http.interceptor'));

                // Batching multiple $http responses into one $digest
                $httpProvider.useApplyAsync(true);

                // default routes
                $urlRouterProvider.when('', '/home');
                $urlRouterProvider.when('/', '/home');
                $urlRouterProvider.otherwise("/404");

            }])

        .run(['$rootScope', 'authService', 'authManager', '$location', 'jwtHelper', '$state', 'appFac',
            function ($rootScope, authService, authManager, $location, jwtHelper, $state, appFac) {

                $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, options) {
                    if (!!toState.data.requiresLogin) {
                        var token = localStorage.getItem('id_token');
                        if (token) {
                            if (!jwtHelper.isTokenExpired(token)) {
                                if (!authManager.isAuthenticated) {
                                    authManager.authenticate();
                                }
                            } else {
                                $location.path('/login');
                            }
                        } else {
                            $location.path('/login');
                        }
                    }
                });

                // Put the authService on $rootScope so its methods
                // can be accessed from the nav bar
                $rootScope.authService = authService;

                // Register the authentication listener that is
                // set up in auth.service.js
                authService.registerAuthenticationListener();

                // Use the authManager from angular-jwt to check for
                // the user's authentication state when the page is
                // refreshed and maintain authentication
                //authManager.checkAuthOnRefresh();

                // Listen for 401 unauthorized requests and redirect
                // the user to the login page
                authManager.redirectWhenUnauthenticated();


            }])

        .filter('i18n', require('./lang.filter.i18n'))

        .factory('appFac', require('./app.fac'))

        .controller('appCtrl', require('./app.ctrl'))

})(angular);
},{"./404":2,"./app.ctrl":3,"./app.fac":4,"./app.http.interceptor":5,"./client":10,"./home":23,"./ink":25,"./lang.filter.i18n":37,"./login":40,"./machine":42,"./paper":54,"./product":66,"./supplier":82,"./user":94,"./wo":109,"./workflow":124,"./zone":128}],7:[function(require,module,exports){
module.exports = {
                    "title" : "iniciar sesión",
                    "enterprise" : "empresa",
                    "user" : "usuario",
                    "password" : "contraseña",
                }
},{}],8:[function(require,module,exports){
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
                        if (!ht.range.equals(rng)) {

                            // new cell selected, show tooltip
                            if (ht.cellType == wijmo.grid.CellType.Cell) {
                                rng = ht.range;
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
},{}],9:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q',  function ($http, $q) {
        var factory = {};
        factory.data = function () {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/client/', {
                    /* POST variables here */
                    procces_id: new Date().getMilliseconds()
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        return factory;
    }];
})(angular);
},{}],10:[function(require,module,exports){
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
            templateUrl : 'app/client/client.view.html',
            controller : 'clientCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('clientFac',require('./client.fac'))

    .controller('clientCtrl',require('./client.ctrl'))
    
})(angular);

},{"./client.ctrl":8,"./client.fac":9,"./modules/client.add":15,"./modules/client.update":19}],11:[function(require,module,exports){
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
},{}],12:[function(require,module,exports){
module.exports = {
                    "title" : "clientes",
                    "labels":{
                        "cl-id":"id cliente",
                        "cl-type":"Tipo de Cliente",
                        "cl-corporatename":"razón social",
                        "cl-tin":"rfc",
                        "cl-name":"nombre(s)",
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
},{}],13:[function(require,module,exports){
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
},{}],14:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q',  '$stateParams', function ($http, $q, $stateParams) {
        var factory = {};
        factory.add = function (cl_jsonb) {
            var promise = $http.post('/api/client/add', {
                /* POST variables here */
                cl_jsonb: cl_jsonb
            }).success(function (data, status, headers, config) {
                return data;
            }).error(function (data, status, headers, config) {
                
                    return { "status": false };
            });
            return promise;
        };
        factory.getCountries = function () {
            var promise = $http.jsonp('http://api.geonames.org/countryInfoJSON?username=alejandrolsca&callback=JSON_CALLBACK')
                .success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    
                    return { "status": false };
                });
            return promise;
        };
        factory.getStates = function (cl_country) {
            var promise = $http.jsonp('http://api.geonames.org/childrenJSON?geonameId=' + cl_country + '&username=alejandrolsca&callback=JSON_CALLBACK')
                .success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    
                    return { "status": false };
                });
            return promise;
        };
        factory.getCityCounty = function (cl_state) {
            var promise = $http.jsonp('http://api.geonames.org/childrenJSON?geonameId=' + cl_state + '&username=alejandrolsca&callback=JSON_CALLBACK')
                .success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    
                    return { "status": false };
                });
            return promise;
        };
        return factory;
    }];

})(angular);
},{}],15:[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.client.add',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('clientAdd', {
            url:'/client/add',
            templateUrl : 'app/client/modules/client.add/client.add.view.html',
            controller : 'clientAddCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('clientAddFac',require('./client.add.fac'))

    .controller('clientAddCtrl',require('./client.add.ctrl'))

})(angular);
},{"./client.add.ctrl":13,"./client.add.fac":14}],16:[function(require,module,exports){
module.exports = {
                    "title" : "agregar cliente",
                }
},{}],17:[function(require,module,exports){
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
},{}],18:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q',  '$stateParams', function ($http, $q, $stateParams) {
        var factory = {};
        factory.data = function () {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/client/cl_id', {
                    /* POST variables here */
                    cl_id: $stateParams.cl_id
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        factory.update = function (cl_jsonb) {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/client/update', {
                    /* POST variables here */
                    cl_id: $stateParams.cl_id,
                    cl_jsonb: cl_jsonb
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    
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
                    
                    return { "status": false };
                });
            return promise;
        };
        factory.getStates = function (cl_country) {
            var promise = $http.jsonp('http://api.geonames.org/childrenJSON?geonameId=' + cl_country + '&username=alejandrolsca&callback=JSON_CALLBACK')
                .success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    
                    return { "status": false };
                });
            return promise;
        };
        factory.getCityCounty = function (cl_state) {
            var promise = $http.jsonp('http://api.geonames.org/childrenJSON?geonameId=' + cl_state + '&username=alejandrolsca&callback=JSON_CALLBACK')
                .success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    
                    return { "status": false };
                });
            return promise;
        };
        return factory;
    }];

})(angular);
},{}],19:[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.client.update',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('clientUpdate', {
            url:'/client/update/:cl_id',
            templateUrl : 'app/client/modules/client.update/client.update.view.html',
            controller : 'clientUpdateCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('clientUpdateFac',require('./client.update.fac'))

    .controller('clientUpdateCtrl',require('./client.update.ctrl'))

})(angular);
},{"./client.update.ctrl":17,"./client.update.fac":18}],20:[function(require,module,exports){
module.exports = {
                    "title" : "actualizar cliente",
                }
},{}],21:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'homeFac', 'authService',
        function ($scope, homeFac, authService) {
            $scope.authService = authService;
        }];

})(angular);
},{}],22:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q',  function ($http, $q) {
        var factory = {};
        factory.getLogin = function (user) {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('modules/home/homeModel.php', {
                    /* POST variables here */
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        return factory;
    }];

})(angular);
},{}],23:[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.home',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('home', {
            url:'/home',
            templateUrl : 'app/home/home.view.html',
            controller : 'homeCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('homeFac',require('./home.fac'))

    .controller('homeCtrl',require('./home.ctrl'))

})(angular);
},{"./home.ctrl":21,"./home.fac":22}],24:[function(require,module,exports){
module.exports = {
                    "title" : "inicio",
                    "welcome" : "bienvenido @@!"
                }
},{}],25:[function(require,module,exports){
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
            templateUrl : 'app/ink/ink.view.html',
            controller : 'inkCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('inkFac',require('./ink.fac'))

    .controller('inkCtrl',require('./ink.ctrl'))
    
})(angular);

},{"./ink.ctrl":26,"./ink.fac":27,"./modules/ink.add":29,"./modules/ink.update":33}],26:[function(require,module,exports){
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
                        if (!ht.range.equals(rng)) {

                            // new cell selected, show tooltip
                            if (ht.cellType == wijmo.grid.CellType.Cell) {
                                rng = ht.range;
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
},{}],27:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q',  function ($http, $q) {
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
                    
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        return factory;
    }];

})(angular);
},{}],28:[function(require,module,exports){
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
},{}],29:[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.ink.add',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('inkAdd', {
            url:'/ink/add',
            templateUrl : 'app/ink/modules/ink.add/ink.add.view.html',
            controller : 'inkAddCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('inkAddFac',require('./ink.add.fac'))

    .controller('inkAddCtrl',require('./ink.add.ctrl'))

})(angular);
},{"./ink.add.ctrl":30,"./ink.add.fac":31}],30:[function(require,module,exports){
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
},{}],31:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q',  '$stateParams', function ($http, $q, $stateParams) {
        var factory = {};
        factory.add = function (in_jsonb) {
            var promise = $http.post('modules/ink/modules/ink.add/ink.add.mdl.add.php', {
                /* POST variables here */
                in_jsonb: in_jsonb
            }).success(function (data, status, headers, config) {
                return data;
            }).error(function (data, status, headers, config) {
                
                    return { "status": false };
            });
            return promise;
        };
        factory.getSuppliers = function () {
            var promise = $http.get('modules/ink/modules/ink.add/ink.add.mdl.getSuppliers.php')
                .success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    
                    return { "status": false };
                });
            return promise;
        };
        return factory;
    }];

})(angular);
},{}],32:[function(require,module,exports){
module.exports = {
                    "title" : "agregar tinta",
                }
},{}],33:[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.ink.update',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('inkUpdate', {
            url:'/ink/update/:in_id',
            templateUrl : 'app/ink/modules/ink.update/ink.update.view.html',
            controller : 'inkUpdateCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('inkUpdateFac',require('./ink.update.fac'))

    .controller('inkUpdateCtrl',require('./ink.update.ctrl'))

})(angular);
},{"./ink.update.ctrl":34,"./ink.update.fac":35}],34:[function(require,module,exports){
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
},{}],35:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q',  '$stateParams', function ($http, $q, $stateParams) {
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
                    
                    return { "status": false };
                });
            return promise;
        };
        return factory;
    }];

})(angular);
},{}],36:[function(require,module,exports){
module.exports = {
                    "title" : "actualizar tinta",
                }
},{}],37:[function(require,module,exports){
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
},{"./lang.locale.en-US":38,"./lang.locale.es-MX":39}],38:[function(require,module,exports){
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
},{}],39:[function(require,module,exports){
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
                "productOffsetGeneral-update": require('./product/modules/productOffsetGeneral.update/lang.es-MX'),
                "productOffsetPaginated-add": require('./product/modules/productOffsetPaginated.add/lang.es-MX'),
                "productOffsetPaginated-update":{
                    "title" : "actualizar producto",
                },
                /****************************************
                SUPPLIER 
                ****************************************/
                "supplier": require('./supplier/lang.es-MX'),
                "supplier-add": require('./supplier/modules/supplier.add/lang.es-MX'),
                "supplier-update": require('./supplier/modules/supplier.update/lang.es-MX'),
                /****************************************
                PAPER 
                ****************************************/
                "paper": require('./paper/lang.es-MX'),
                "paper-add": require('./paper/modules/paper.add/lang.es-MX'),
                "paper-update": require('./paper/modules/paper.update/lang.es-MX'),
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
                "user-add": require('./user/modules/user.add/lang.es-MX'),
                "user-update": require('./user/modules/user.update/lang.es-MX'),
                "user-profile": require('./user/modules/user.profile/lang.es-MX'),
                /****************************************
                WORK ORDER 
                ****************************************/
                "wo": require('./wo/lang.es-MX'),
                "wo-add": require('./wo/modules/wo.add/lang.es-MX'),
                "wo-update": require('./wo/modules/wo.update/lang.es-MX'),
                /****************************************
                AUTH 
                ****************************************/
                "auth": require('./auth/lang.es-MX'),
                /****************************************
                ZONE 
                ****************************************/
                "zone": require('./zone/lang.es-MX'),
                "zone-add": require('./zone/modules/zone.add/lang.es-MX'),
                "zone-update": require('./zone/modules/zone.update/lang.es-MX'),
                /****************************************
                STATUS 
                ****************************************/
                "workflow": require('./workflow/lang.es-MX'),
            }
},{"./auth/lang.es-MX":7,"./client/lang.custom.es-MX":11,"./client/lang.es-MX":12,"./client/modules/client.add/lang.es-MX":16,"./client/modules/client.update/lang.es-MX":20,"./home/lang.es-MX":24,"./ink/lang.es-MX":28,"./ink/modules/ink.add/lang.es-MX":32,"./ink/modules/ink.update/lang.es-MX":36,"./machine/lang.es-MX":43,"./machine/modules/machine.add/lang.es-MX":47,"./machine/modules/machine.update/lang.es-MX":51,"./paper/lang.es-MX":55,"./paper/modules/paper.add/lang.es-MX":57,"./paper/modules/paper.update/lang.es-MX":61,"./product/lang.es-MX":67,"./product/modules/productOffsetGeneral.add/lang.es-MX":69,"./product/modules/productOffsetGeneral.update/lang.es-MX":73,"./product/modules/productOffsetPaginated.add/lang.es-MX":77,"./supplier/lang.es-MX":83,"./supplier/modules/supplier.add/lang.es-MX":85,"./supplier/modules/supplier.update/lang.es-MX":89,"./user/lang.es-MX":95,"./user/modules/user.add/lang.es-MX":97,"./user/modules/user.profile/lang.es-MX":101,"./user/modules/user.update/lang.es-MX":104,"./wo/lang.es-MX":110,"./wo/modules/wo.add/lang.es-MX":112,"./wo/modules/wo.update/lang.es-MX":119,"./workflow/lang.es-MX":125,"./zone/lang.es-MX":129,"./zone/modules/zone.add/lang.es-MX":131,"./zone/modules/zone.update/lang.es-MX":135}],40:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return angular.module('app.login', [])

        .config(['$stateProvider', '$urlRouterProvider',
            function ($stateProvider, $urlRouterProvider) {
                $stateProvider.state('login', {
                    url: '/login',
                    templateUrl: 'app/login/login.view.html',
                    controller: 'loginCtrl',
                    data: {
                        requiresLogin: false
                    }
                });
            }])

        .controller('loginCtrl', require('./login.ctrl'))

})(angular);
},{"./login.ctrl":41}],41:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$scope', '$http', 'authService', '$location',
        function ($scope, $http, authService, $location) {
            authService.login();
            /*
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
            }*/

        }]

})(angular);
},{}],42:[function(require,module,exports){
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
            templateUrl : 'app/machine/machine.view.html',
            controller : 'machineCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('machineFac',require('./machine.fac'))

    .controller('machineCtrl',require('./machine.ctrl'))
    
})(angular);

},{"./machine.ctrl":44,"./machine.fac":45,"./modules/machine.add":46,"./modules/machine.update":50}],43:[function(require,module,exports){
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
},{}],44:[function(require,module,exports){
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
                        if (!ht.range.equals(rng)) {

                            // new cell selected, show tooltip
                            if (ht.cellType == wijmo.grid.CellType.Cell) {
                                rng = ht.range;
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
},{}],45:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q', 
        function ($http, $q) {
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
                        
                        return { "status": false };
                    })
                );
                return deferred.promise;
            };
            return factory;
        }];

})(angular);
},{}],46:[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.machine.add',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('machineAdd', {
            url:'/machine/add',
            templateUrl : 'app/machine/modules/machine.add/machine.add.view.html',
            controller : 'machineAddCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('machineAddFac',require('./machine.add.fac'))

    .controller('machineAddCtrl',require('./machine.add.ctrl'))

})(angular);
},{"./machine.add.ctrl":48,"./machine.add.fac":49}],47:[function(require,module,exports){
module.exports = {
                    "title" : "agregar maquina",
                }
},{}],48:[function(require,module,exports){
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
},{}],49:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q',  '$stateParams',
        function ($http, $q, $stateParams) {
            var factory = {};
            factory.add = function (ma_jsonb) {
                var promise = $http.post('modules/machine/modules/machine.add/machine.add.mdl.add.php', {
                    /* POST variables here */
                    ma_jsonb: ma_jsonb
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    
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
    
    return angular.module('app.machine.update',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('machineUpdate', {
            url:'/machine/update/:ma_id',
            templateUrl : 'app/machine/modules/machine.update/machine.update.view.html',
            controller : 'machineUpdateCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('machineUpdateFac',require('./machine.update.fac'))

    .controller('machineUpdateCtrl',require('./machine.update.ctrl'))

})(angular);
},{"./machine.update.ctrl":52,"./machine.update.fac":53}],51:[function(require,module,exports){
module.exports = {
                    "title" : "actualizar maquina",
                }
},{}],52:[function(require,module,exports){
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
},{}],53:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q',  '$stateParams', function ($http, $q, $stateParams) {
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
                    
                    return { "status": false };
                });
            return promise;
        };
        factory.getStates = function (ma_country) {
            var promise = $http.get('http://api.geonames.org/childrenJSON?geonameId=' + ma_country + '&username=alejandrolsca')
                .success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    
                    return { "status": false };
                });
            return promise;
        };
        factory.getCityCounty = function (ma_state) {
            var promise = $http.get('http://api.geonames.org/childrenJSON?geonameId=' + ma_state + '&username=alejandrolsca')
                .success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    
                    return { "status": false };
                });
            return promise;
        };
        return factory;
    }];

})(angular);
},{}],54:[function(require,module,exports){
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
            templateUrl : 'app/paper/paper.view.html',
            controller : 'paperCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('paperFac',require('./paper.fac'))

    .controller('paperCtrl',require('./paper.ctrl'))
    
})(angular);

},{"./modules/paper.add":56,"./modules/paper.update":60,"./paper.ctrl":64,"./paper.fac":65}],55:[function(require,module,exports){
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
},{}],56:[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.paper.add',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('paperAdd', {
            url:'/paper/add',
            templateUrl : 'app/paper/modules/paper.add/paper.add.view.html',
            controller : 'paperAddCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('paperAddFac',require('./paper.add.fac'))

    .controller('paperAddCtrl',require('./paper.add.ctrl'))

})(angular);
},{"./paper.add.ctrl":58,"./paper.add.fac":59}],57:[function(require,module,exports){
module.exports = {
                    "title" : "agregar papel",
                }
},{}],58:[function(require,module,exports){
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
},{}],59:[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return ['$http', '$q',  '$stateParams', function($http, $q, $stateParams){
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
},{}],60:[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.paper.update',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('paperUpdate', {
            url:'/paper/update/:pa_id',
            templateUrl : 'app/paper/modules/paper.update/paper.update.view.html',
            controller : 'paperUpdateCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('paperUpdateFac',require('./paper.update.fac'))

    .controller('paperUpdateCtrl',require('./paper.update.ctrl'))

})(angular);
},{"./paper.update.ctrl":62,"./paper.update.fac":63}],61:[function(require,module,exports){
module.exports = {
                    "title" : "actualizar papel",
                }
},{}],62:[function(require,module,exports){
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
},{}],63:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q',  '$stateParams', function ($http, $q, $stateParams) {
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
                    
                    return { "status": false };
                });
            return promise;
        };
        return factory;
    }];

})(angular);
},{}],64:[function(require,module,exports){
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
                    if (!ht.range.equals(rng)) {

                        // new cell selected, show tooltip
                        if (ht.cellType == wijmo.grid.CellType.Cell) {
                            rng = ht.range;
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
},{}],65:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q',  function ($http, $q) {
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
                    
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        return factory;
    }];

})(angular);
},{}],66:[function(require,module,exports){
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
            templateUrl : 'app/product/product.view.html',
            controller : 'productCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('productFac',require('./product.fac'))

    .controller('productCtrl',require('./product.ctrl'))
    
})(angular);

},{"./modules/productOffsetGeneral.add":68,"./modules/productOffsetGeneral.update":72,"./modules/productOffsetPaginated.add":76,"./product.ctrl":80,"./product.fac":81}],67:[function(require,module,exports){
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
},{}],68:[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.productOffsetGeneral.add',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('productOffsetGeneralAdd', {
            url:'/product/add/offset/general/:cl_id',
            templateUrl : 'app/product/modules/productOffsetGeneral.add/productOffsetGeneral.add.view.html',
            controller : 'productOffsetGeneralAddCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('productOffsetGeneralAddFac',require('./productOffsetGeneral.add.fac'))

    .controller('productOffsetGeneralAddCtrl',require('./productOffsetGeneral.add.ctrl'))

})(angular);
},{"./productOffsetGeneral.add.ctrl":70,"./productOffsetGeneral.add.fac":71}],69:[function(require,module,exports){
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
},{}],70:[function(require,module,exports){
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
},{}],71:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q',  '$stateParams', function ($http, $q, $stateParams) {
        var factory = {};
        factory.getClient = function () {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/product/offset/general/client', {
                    /* POST variables here */
                    cl_id: $stateParams.cl_id
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        factory.getInks = function () {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/product/offset/general/ink', {
                    /* POST variables here */
                    procces_id: new Date().getMilliseconds()
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        factory.getPapers = function () {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/product/offset/general/paper', {
                    /* POST variables here */
                    procces_id: new Date().getMilliseconds()
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        factory.add = function (pr_jsonb) {
            var promise = $http.post('/api/product/add', {
                /* POST variables here */
                pr_jsonb: pr_jsonb
            }).success(function (data, status, headers, config) {
                return data;
            }).error(function (data, status, headers, config) {
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
    
    return angular.module('app.productOffsetGeneral.update',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('productOffsetGeneralUpdate', {
            url:'/product/offset/general/update/:cl_id/:pr_id',
            templateUrl : 'app/product/modules/productOffsetGeneral.update/productOffsetGeneral.update.view.html',
            controller : 'productOffsetGeneralUpdateCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('productOffsetGeneralUpdateFac',require('./productOffsetGeneral.update.fac'))

    .controller('productOffsetGeneralUpdateCtrl',require('./productOffsetGeneral.update.ctrl'))

})(angular);
},{"./productOffsetGeneral.update.ctrl":74,"./productOffsetGeneral.update.fac":75}],73:[function(require,module,exports){
module.export = {}
},{}],74:[function(require,module,exports){
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
},{}],75:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q',  '$stateParams', function ($http, $q, $stateParams) {
        var factory = {};
        factory.data = function () {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/product/offset/general/product', {
                    /* POST variables here */
                    pr_id: $stateParams.pr_id
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        factory.update = function (pr_jsonb) {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/product/update', {
                    /* POST variables here */
                    pr_id: $stateParams.pr_id,
                    pr_jsonb: pr_jsonb
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    
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
                    
                    return { "status": false };
                });
            return promise;
        };
        factory.getStates = function (pr_country) {
            var promise = $http.jsonp('http://api.geonames.org/childrenJSON?geonameId=' + pr_country + '&username=alejandrolsca&callback=JSON_CALLBACK')
                .success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    
                    return { "status": false };
                });
            return promise;
        };
        factory.getCityCounty = function (pr_state) {
            var promise = $http.jsonp('http://api.geonames.org/childrenJSON?geonameId=' + pr_state + '&username=alejandrolsca&callback=JSON_CALLBACK')
                .success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    
                    return { "status": false };
                });
            return promise;
        };
        return factory;
    }];

})(angular);
},{}],76:[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.productOffsetPaginated.add',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('productOffsetPaginatedAdd', {
            url:'/product/add/offset/paginated/:cl_id',
            templateUrl : 'app/product/modules/productOffsetPaginated.add/productOffsetPaginated.add.view.html',
            controller : 'productOffsetPaginatedAddCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('productOffsetPaginatedAddFac',require('./productOffsetPaginated.add.fac'))

    .controller('productOffsetPaginatedAddCtrl',require('./productOffsetPaginated.add.ctrl'))

})(angular);
},{"./productOffsetPaginated.add.ctrl":78,"./productOffsetPaginated.add.fac":79}],77:[function(require,module,exports){
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
},{}],78:[function(require,module,exports){
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
},{}],79:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q',  '$stateParams', function ($http, $q, $stateParams) {
        var factory = {};
        factory.getClient = function () {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/product/offset/general/client', {
                    /* POST variables here */
                    cl_id: $stateParams.cl_id
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    return { "status": false };
                })
                );
            return deferred.promise;
        };
        factory.getInks = function () {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/product/offset/general/ink', {
                    /* POST variables here */
                    procces_id: new Date().getMilliseconds()
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    return { "status": false };
                })
                );
            return deferred.promise;
        };
        factory.getPapers = function () {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/product/offset/general/paper', {
                    /* POST variables here */
                    procces_id: new Date().getMilliseconds()
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    return { "status": false };
                })
                );
            return deferred.promise;
        };
        factory.add = function (pr_jsonb) {
            var promise = $http.post('/api/product/add', {
                /* POST variables here */
                pr_jsonb: pr_jsonb
            }).success(function (data, status, headers, config) {
                return data;
            }).error(function (data, status, headers, config) {
                return { "status": false };
            });
            return promise;
        };
        return factory;
    }];

})(angular);
},{}],80:[function(require,module,exports){
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
                        if (!ht.range.equals(rng)) {

                            // new cell selected, show tooltip
                            if (ht.cellType == wijmo.grid.CellType.Cell) {
                                rng = ht.range;
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
},{}],81:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q',  '$stateParams', function ($http, $q, $stateParams) {
        var factory = {};
        factory.data = function () {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/product/cl_id', {
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
},{}],82:[function(require,module,exports){
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
            templateUrl : 'app/supplier/supplier.view.html',
            controller : 'supplierCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('supplierFac',require('./supplier.fac'))

    .controller('supplierCtrl',require('./supplier.ctrl'))
    
})(angular);

},{"./modules/supplier.add":84,"./modules/supplier.update":88,"./supplier.ctrl":92,"./supplier.fac":93}],83:[function(require,module,exports){
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
},{}],84:[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.supplier.add',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('supplierAdd', {
            url:'/supplier/add',
            templateUrl : 'app/supplier/modules/supplier.add/supplier.add.view.html',
            controller : 'supplierAddCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('supplierAddFac',require('./supplier.add.fac'))

    .controller('supplierAddCtrl',require('./supplier.add.ctrl'))

})(angular);
},{"./supplier.add.ctrl":86,"./supplier.add.fac":87}],85:[function(require,module,exports){
module.exports = {
                    "title" : "agregar proveedor",
                }
},{}],86:[function(require,module,exports){
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
},{}],87:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q',  '$stateParams', function ($http, $q, $stateParams) {
        var factory = {};
        factory.add = function (su_jsonb) {
            var promise = $http.post('modules/supplier/modules/supplier.add/supplier.add.mdl.add.php', {
                /* POST variables here */
                su_jsonb: su_jsonb
            }).success(function (data, status, headers, config) {
                return data;
            }).error(function (data, status, headers, config) {
                return { "status": false };
            });
            return promise;
        };
        factory.getCountries = function () {
            var promise = $http.get('http://api.geonames.org/countryInfoJSON?username=alejandrolsca')
                .success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    
                    return { "status": false };
                });
            return promise;
        };
        factory.getStates = function (su_country) {
            var promise = $http.get('http://api.geonames.org/childrenJSON?geonameId=' + su_country + '&username=alejandrolsca')
                .success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    
                    return { "status": false };
                });
            return promise;
        };
        factory.getCityCounty = function (su_state) {
            var promise = $http.get('http://api.geonames.org/childrenJSON?geonameId=' + su_state + '&username=alejandrolsca')
                .success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    
                    return { "status": false };
                });
            return promise;
        };
        return factory;
    }];

})(angular);
},{}],88:[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.supplier.update',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('supplierUpdate', {
            url:'/supplier/update/:su_id',
            templateUrl : 'app/supplier/modules/supplier.update/supplier.update.view.html',
            controller : 'supplierUpdateCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('supplierUpdateFac',require('./supplier.update.fac'))

    .controller('supplierUpdateCtrl',require('./supplier.update.ctrl'))

})(angular);
},{"./supplier.update.ctrl":90,"./supplier.update.fac":91}],89:[function(require,module,exports){
module.exports = {
                    "title" : "actualizar proveedor",
                }
},{}],90:[function(require,module,exports){
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
},{}],91:[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return ['$http', '$q',  '$stateParams', function($http, $q, $stateParams){
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
},{}],92:[function(require,module,exports){
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
                        if (!ht.range.equals(rng)) {

                            // new cell selected, show tooltip
                            if (ht.cellType == wijmo.grid.CellType.Cell) {
                                rng = ht.range;
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
},{}],93:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q',  function ($http, $q) {
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
                    
                    return { "status": false };
                })
                );
            return deferred.promise;
        };
        return factory;
    }];

})(angular);
},{}],94:[function(require,module,exports){
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
            templateUrl : 'app/user/user.view.html',
            controller : 'userCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('userFac',require('./user.fac'))

    .controller('userCtrl',require('./user.ctrl'))

})(angular);
},{"./modules/user.add":96,"./modules/user.profile":100,"./modules/user.update":103,"./user.ctrl":107,"./user.fac":108}],95:[function(require,module,exports){
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
},{}],96:[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.user.add',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('userAdd', {
            url:'/user/add',
            templateUrl : 'app/user/modules/user.add/user.add.view.html',
            controller : 'userAddCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('userAddFac',require('./user.add.fac'))

    .controller('userAddCtrl',require('./user.add.ctrl'))
    
})(angular);

},{"./user.add.ctrl":98,"./user.add.fac":99}],97:[function(require,module,exports){
module.exports = {
                    "title" : "agregar usuario",
                }
},{}],98:[function(require,module,exports){
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
},{}],99:[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return ['$http', '$q',  '$stateParams',
    function($http, $q, $stateParams){
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
},{}],100:[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.user.profile',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('userProfile', {
            url:'/user/profile',
            templateUrl : 'app/user/modules/user.profile/user.profile.view.html',
            controller : 'userProfileCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .controller('userProfileCtrl',require('./user.profile.ctrl'))
    
})(angular);

},{"./user.profile.ctrl":102}],101:[function(require,module,exports){
module.exports = {
                    "title" : "perfil del usuario",
                }
},{}],102:[function(require,module,exports){
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
},{}],103:[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.user.update',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('userUpdate', {
            url:'/user/update/:us_id',
            templateUrl : 'app/user/modules/user.update/user.update.view.html',
            controller : 'userUpdateCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('userUpdateFac',require('./user.update.fac'))

    .controller('userUpdateCtrl',require('./user.update.ctrl'))

})(angular);
},{"./user.update.ctrl":105,"./user.update.fac":106}],104:[function(require,module,exports){
module.exports = {
                    "title" : "actualizar usuario",
                }
},{}],105:[function(require,module,exports){
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
},{}],106:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q',  '$stateParams', function ($http, $q, $stateParams) {
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
                    
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        return factory;
    }];

})(angular);
},{}],107:[function(require,module,exports){
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
},{}],108:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q',  function ($http, $q) {
        var factory = {};
        factory.data = function () {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('modules/user/user.mdl.getUsers.php', {
                    /* POST variables here */
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        return factory;
    }];

})(angular);
},{}],109:[function(require,module,exports){
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
            templateUrl : 'app/wo/wo.view.html',
            controller : 'woController',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('woFactory',require('./wo.fac'))

    .controller('woController',require('./wo.ctrl'))

})(angular);
},{"./modules/wo.add":111,"./modules/wo.duplicate":115,"./modules/wo.update":118,"./wo.ctrl":122,"./wo.fac":123}],110:[function(require,module,exports){
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
},{}],111:[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.wo.add',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('woAdd', {
            url:'/wo/add/:cl_id',
            templateUrl : 'app/wo/modules/wo.add/wo.add.view.html',
            controller : 'woAddController',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('woAddFactory',require('./wo.add.fac'))

    .controller('woAddController',require('./wo.add.ctrl'))

})(angular);
},{"./wo.add.ctrl":113,"./wo.add.fac":114}],112:[function(require,module,exports){
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
},{}],113:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'woAddFactory', '$stateParams', 'i18nFilter', '$filter', '$location',
        function ($scope, woAddFactory, $stateParams, i18nFilter, $filter, $location) {
            $scope.fmData = {};
            //$scope.fmData = {"zo_id": "2", "wo_orderedby": "Alejandro", "wo_attention": "Marco", "ma_id": 1, "wo_release": "rel001", "wo_po": "ABC001", "wo_line": "1", "wo_linetotal": "4", "pr_id": "15", "wo_qty": "100", "wo_packageqty": "10", "wo_excedentqty": "10", "wo_foliosperformat": 1, "wo_foliosseries": "A", "wo_foliosfrom": "1", "wo_foliosto": "100", "wo_commitmentdate": "2016-07-01", "wo_notes": "Esta es una orden de prueba", "wo_price": "99.99", "wo_currency": "DLLS", "wo_email": "yes" };
            $scope.fmData.wo_type = "N"; //N-new,R-rep,C-change
            $scope.fmData.wo_status = 0; //0-Active
            $scope.fmData.cl_id = $stateParams.cl_id;

            $scope.wo_foliosperformatoptions = i18nFilter("wo-add.fields.wo_foliosperformatoptions");
            $scope.wo_currencyoptions = i18nFilter("wo-add.fields.wo_currencyoptions");
            $scope.wo_emailoptions = i18nFilter("wo-add.fields.wo_emailoptions");
            
            $scope.onSubmit = function () {

                woAddFactory.add($scope.fmData).then(function (promise) {
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
},{}],114:[function(require,module,exports){
module.exports = (function(angular) {
    'use strict';

    return ['$http', '$q',  '$stateParams', function($http, $q, $stateParams) {
        var factory = {};
        factory.getZone = function() {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/zone/cl_id', {
                    /* POST variables here */
                    cl_id: $stateParams.cl_id
                }).success(function(data, status, headers, config) {
                    return data;
                }).error(function(data, status, headers, config) {
                    
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        factory.getMachine = function() {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/machine', {
                    /* POST variables here */
                    cl_id: $stateParams.cl_id
                }).success(function(data, status, headers, config) {
                    return data;
                }).error(function(data, status, headers, config) {
                    
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        factory.getProduct = function() {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/product/cl_id', {
                    /* POST variables here */
                    cl_id: $stateParams.cl_id,
                    pr_status: 'A'
                }).success(function(data, status, headers, config) {
                    return data;
                }).error(function(data, status, headers, config) {
                    
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        factory.add = function(wo_jsonb) {
            var promise = $http.post('/api/wo/add', {
                /* POST variables here */
                wo_jsonb: wo_jsonb
            }).success(function(data, status, headers, config) {
                return data;
            }).error(function(data, status, headers, config) {
                
                    return { "status": false };
            });
            return promise;
        };
        return factory;
    }];

})(angular);
},{}],115:[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.wo.duplicate',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('woDuplicate', {
            url:'/wo/duplicate/:cl_id/:wo_id',
            templateUrl : 'app/wo/modules/wo.duplicate/wo.duplicate.view.html',
            controller : 'woDuplicateController',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('woDuplicateFactory',require('./wo.duplicate.fac'))

    .controller('woDuplicateController',require('./wo.duplicate.ctrl'))

})(angular);
},{"./wo.duplicate.ctrl":116,"./wo.duplicate.fac":117}],116:[function(require,module,exports){
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
},{}],117:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q',  '$stateParams', function ($http, $q, $stateParams) {
        var factory = {};
        factory.getData = function () {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/wo/wo_id', {
                    /* POST variables here */
                    cl_id: $stateParams.cl_id,
                    wo_id: $stateParams.wo_id
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        factory.getZone = function () {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/zone/cl_id', {
                    /* POST variables here */
                    cl_id: $stateParams.cl_id
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        factory.getMachine = function () {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/machine', {
                    /* POST variables here */
                    cl_id: $stateParams.cl_id
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        factory.getProduct = function () {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/product/cl_id', {
                    /* POST variables here */
                    cl_id: $stateParams.cl_id,
                    pr_status: 'A'
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        factory.add = function (wo_jsonb) {
            var promise = $http.post('/api/wo/add', {
                /* POST variables here */
                wo_jsonb: wo_jsonb
            }).success(function (data, status, headers, config) {
                console.log(JSON.stringify(config))
                return data;
            }).error(function (data, status, headers, config) {
                return { "status": false };
            });
            return promise;
        };
        return factory;
    }];

})(angular);
},{}],118:[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.wo.update',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('woUpdate', {
            url:'/wo/update/:cl_id/:wo_id',
            templateUrl : 'app/wo/modules/wo.update/wo.update.view.html',
            controller : 'woUpdateController',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('woUpdateFactory',require('./wo.update.fac'))

    .controller('woUpdateController',require('./wo.update.ctrl'))

})(angular);
},{"./wo.update.ctrl":120,"./wo.update.fac":121}],119:[function(require,module,exports){
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
},{}],120:[function(require,module,exports){
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
},{}],121:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q',  '$stateParams', function ($http, $q, $stateParams) {
        var factory = {};
        factory.getData = function () {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/wo/wo_id', {
                    /* POST variables here */
                    cl_id: $stateParams.cl_id,
                    wo_id: $stateParams.wo_id
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        factory.getZone = function () {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/zone/cl_id', {
                    /* POST variables here */
                    cl_id: $stateParams.cl_id
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        factory.getMachine = function () {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/machine', {
                    /* POST variables here */
                    cl_id: $stateParams.cl_id
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        factory.getProduct = function () {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/product/cl_id', {
                    /* POST variables here */
                    cl_id: $stateParams.cl_id,
                    pr_status: 'A'
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        factory.update = function (wo_jsonb) {
            var promise = $http.post('/api/wo/update', {
                /* POST variables here */
                wo_jsonb: wo_jsonb,
                wo_id: $stateParams.wo_id
            }).success(function (data, status, headers, config) {
                return data;
            }).error(function (data, status, headers, config) {
                return { "status": false };
            });
            return promise;
        };
        return factory;
    }];

})(angular);
},{}],122:[function(require,module,exports){
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
                        if (!ht.range.equals(rng)) {

                            // new cell selected, show tooltip
                            if (ht.cellType == wijmo.grid.CellType.Cell) {
                                rng = ht.range;
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
},{}],123:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q',  '$stateParams', function ($http, $q, $stateParams) {
        var factory = {};
        factory.getData = function () {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/wo/cl_id', {
                    /* POST variables here */
                    procces_id: new Date().getMilliseconds(),
                    cl_id: $stateParams.cl_id
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        return factory;
    }];

})(angular);
},{}],124:[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.workflow',[
    ])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('workflow', {
            url:'/workflow',
            templateUrl : 'app/workflow/workflow.view.html',
            controller : 'workflowController',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('workflowFactory',require('./workflow.fac'))

    .controller('workflowController',require('./workflow.ctrl'))

})(angular);
},{"./workflow.ctrl":126,"./workflow.fac":127}],125:[function(require,module,exports){
module.exports = {
    "title": "Flujo de Trabajo",
    "labels": {
        "wo-id": "No. orden",
        "cl-id": "cliente",
        "cl-corporatename": "Razón social",
        "cl-fatherslastname": "Apellido paterno",
        "cl-motherslastname": "Apellido materno",
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
        "wo-nextstatus": "Actualizar a:",
        "wo-date": "Fecha"
    },
    "columns": [
        "wo_id",
        "cl_id",
        "cl_corporatename",
        "cl_fatherslastname",
        "cl_motherslastname",
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
    ],
    "fields": {
        wo_statusoptions: [
            { "label": "Activo", "value": 0, "desc": "Orden Activa", "us_group": "sales", "wo_prevstatus": [] },
            { "label": "En espera de material", "value": 1, "desc": "No hay material en el almacén", "us_group": "warehouse", "wo_prevstatus": [0, 7, 12] },
            { "label": "Material disponible", "value": 2, "desc": "Hay material en el almacén pero aun no se ha iniciado el trabajo", "us_group": "warehouse", "wo_prevstatus": [0, 1, 7, 12] },
            { "label": "En producción", "value": 3, "desc": "En producción", "us_group": "production", "wo_prevstatus": [2, 7, 12] },
            { "label": "Detenido", "value": 4, "desc": "La orden se detuvo en producción", "us_group": "production", "wo_prevstatus": [3] },
            { "label": "Terminado", "value": 5, "desc": "Terminado en producción", "us_group": "production", "wo_prevstatus": [3, 4] },
            { "label": "Departamento de calidad", "value": 6, "desc": "Inspeccion de calidad en proceso", "us_group": "quality_assurance", "wo_prevstatus": [5] },
            { "label": "Rechazado por Calidad", "value": 7, "desc": "Rechazado por calidad", "us_group": "quality_assurance", "wo_prevstatus": [6] },
            { "label": "Empaque", "value": 8, "desc": "En proceso de empaque", "us_group": "empaque", "wo_prevstatus": [6] },
            { "label": "Listo para embarque", "value": 9, "desc": "Listo para embarque", "us_group": "empaque", "wo_prevstatus": [8] },
            { "label": "Facturado", "value": 10, "desc": "Facturado", "us_group": "warehouse", "wo_prevstatus": [9] },
            { "label": "No se pudo entregar", "value": 11, "desc": "El producto no se pudo entregar", "us_group": "warehouse", "wo_prevstatus": [10] },
            { "label": "Rechazado por el cliente", "value": 12, "desc": "El productofue rechazado por el cliente", "us_group": "warehouse", "wo_prevstatus": [10] },
            { "label": "Entregado", "value": 13, "desc": "El producto se entrego al cliente con éxito", "us_group": "warehouse", "wo_prevstatus": [10, 11] },
            { "label": "Cancelado", "value": 14, "desc": "La orden de trabajo fue cancelada", "us_group": "admin", "wo_prevstatus": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14] }
        ]
    }
}
},{}],126:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'workflowFactory', '$location', 'i18nFilter', '$stateParams', '$filter', 'authService',
        function ($scope, workflowFactory, $location, i18nFilter, $stateParams, $filter, authService) {

            var userProfile = angular.fromJson(localStorage.getItem('profile')) || {};

            $scope.fmData = {
                "wo_status": 0
            };

            $scope.labels = Object.keys(i18nFilter("workflow.labels"));
            $scope.columns = i18nFilter("workflow.columns");

            // formatter to add checkboxes to boolean columns
            $scope.onUpdate = function () {
                var flex = $scope.ggGrid;
                var arr = []
                for (var i = 0; i < flex.rows.length; i++) {
                    if (flex.getCellData(i, flex.columns.getColumn('active').index) === true) arr.push(flex.getCellData(i, flex.columns.getColumn('wo_id').index));
                }
                $scope.wo_id = arr;
                $scope.selected = (arr.length > 0) ? true : false;
                var next_status = undefined;
                angular.forEach($scope.wo_statusoptions, function (value, key) {
                    if (value.value === $scope.fmData.wo_nextstatus) next_status = value.label;
                });
                $scope.next_status = next_status;
            };

            $scope.onSubmit = function () {

            }

            $scope.itemFormatter = function (panel, r, c, cell) {

                // highlight rows that have 'active' set
                if (panel.cellType == wijmo.grid.CellType.Cell) {
                    var flex = panel.grid;
                    var row = flex.rows[r];
                    if (row.dataItem.active) {
                        cell.style.backgroundColor = 'gold';
                    }
                }

                if (panel.cellType == wijmo.grid.CellType.ColumnHeader) {
                    var flex = panel.grid;
                    var col = flex.columns[c];

                    // check that this is a boolean column
                    if (col.dataType == wijmo.DataType.Boolean) {

                        // prevent sorting on click
                        col.allowSorting = false;

                        // count true values to initialize checkbox
                        var cnt = 0;
                        for (var i = 0; i < flex.rows.length; i++) {
                            if (flex.getCellData(i, c) == true) cnt++;
                        }

                        // create and initialize checkbox
                        cell.innerHTML = '<input type="checkbox"> ' + cell.innerHTML;
                        var cb = cell.firstChild;
                        cb.checked = cnt > 0;
                        cb.indeterminate = cnt > 0 && cnt < flex.rows.length;

                        // apply checkbox value to cells
                        cb.addEventListener('click', function (e) {
                            flex.beginUpdate();
                            for (var i = 0; i < flex.rows.length; i++) {
                                flex.setCellData(i, c, cb.checked);
                            }
                            flex.endUpdate();
                        });
                    }
                }
            }


            // autosize columns
            $scope.itemsSourceChanged = function (sender, args) {
                sender.autoSizeColumns();
            };

            // bind columns when grid is initialized
            $scope.initGrid = function (s, e) {
                for (var i = 0; i < $scope.columns.length; i++) {
                    var col = new wijmo.grid.Column();
                    col.binding = $scope.columns[i];
                    col.header = i18nFilter("workflow.labels." + $scope.labels[i]);
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
                        if (!ht.range.equals(rng)) {

                            // new cell selected, show tooltip
                            if (ht.cellType == wijmo.grid.CellType.Cell) {
                                rng = ht.range;
                                var col = flex.columns[rng.col].header;
                                var cellElement = document.elementFromPoint(evt.clientX, evt.clientY),
                                    cellBounds = wijmo.Rect.fromBoundingRect(cellElement.getBoundingClientRect()),
                                    data = wijmo.escapeHtml(flex.getCellData(rng.row, rng.col, true)),
                                    tipContent = col + ': "<b>' + data + '</b>"';
                                if (cellElement.className.indexOf('wj-cell') > -1) {
                                    if (rng.col !== 0)
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

            $scope.wo_statusoptions = [];
            var wo_statusoptions = JSON.parse(JSON.stringify(i18nFilter("workflow.fields.wo_statusoptions")))
            var duplicated = [];
            angular.forEach(wo_statusoptions, function (value, key) {
                if (value.us_group === userProfile.app_metadata.us_group) {
                    this.push.apply(this, value.wo_prevstatus);
                }
            }, duplicated)

            duplicated.reduce(function (accum, current) {
                if (accum.indexOf(current) < 0) {
                    accum.push(current);
                }
                return accum;
            }, []);

            angular.forEach(wo_statusoptions, function (value, key) {
                if (duplicated.includes(value.value)) {
                    value.notAnOption = false;
                } else {
                    value.notAnOption = true;
                }
                this.push(value)
            }, $scope.wo_statusoptions)

            $scope.$on('$viewContentLoaded', function () {

                // this code is executed after the view is loaded
                $scope.loading = true;
                $scope.$watch('fmData.wo_status', function (newValue, oldValue) {
                    $scope.actions = [];
                    var actions = JSON.parse(JSON.stringify(i18nFilter("workflow.fields.wo_statusoptions")));
                    angular.forEach(actions, function (value, key) {
                        if (value.wo_prevstatus.includes(newValue)) {
                            if (value.us_group === userProfile.app_metadata.us_group || userProfile.app_metadata.us_group === "admin") {
                                if([13,14].includes(newValue) && [13,14].includes(value.value)) {
                                    value.notAnOption = true;
                                } else {
                                    value.notAnOption = false;
                                }  
                            } else {
                                value.notAnOption = true;
                            }
                            this.push(value);
                        }
                    }, $scope.actions)
                    workflowFactory.getData(newValue).then(function (promise) {
                        $scope.loading = false;
                        if (angular.isArray(promise.data)) {
                            // expose data as a CollectionView to get events
                            $scope.data = new wijmo.collections.CollectionView(promise.data);
                            $scope.data.pageSize = 5;
                        }
                    });
                });
            });
        }];

})(angular);
},{}],127:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q',  '$stateParams', function ($http, $q, $stateParams) {
        var factory = {};
        factory.getData = function (wo_status) {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/workflow', {
                    /* POST variables here */
                    procces_id: new Date().getMilliseconds(),
                    wo_status: wo_status
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        factory.update = function (wo_status, wo_id) {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/workflow/update', {
                    /* POST variables here */
                    procces_id: new Date().getMilliseconds(),
                    wo_status: wo_status,
                    wo_id: wo_id
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        return factory;
    }];

})(angular);
},{}],128:[function(require,module,exports){
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
            templateUrl : 'app/zone/zone.view.html',
            controller : 'zoneCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('zoneFac',require('./zone.fac'))

    .controller('zoneCtrl',require('./zone.ctrl'))
    
})(angular);

},{"./modules/zone.add":130,"./modules/zone.update":134,"./zone.ctrl":138,"./zone.fac":139}],129:[function(require,module,exports){
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
},{}],130:[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.zone.add',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('zoneAdd', {
            url:'/zone/add/:cl_id',
            templateUrl : 'app/zone/modules/zone.add/zone.add.view.html',
            controller : 'zoneAddCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('zoneAddFac',require('./zone.add.fac'))

    .controller('zoneAddCtrl',require('./zone.add.ctrl'))

})(angular);
},{"./zone.add.ctrl":132,"./zone.add.fac":133}],131:[function(require,module,exports){
module.exports = {
                    "title" : "agregar dirección de envio",
                }
},{}],132:[function(require,module,exports){
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
},{}],133:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q',  '$stateParams', function ($http, $q, $stateParams) {
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
                return { "status": false };
            });
            return promise;
        };
        factory.getCountries = function () {
            var promise = $http.get('http://api.geonames.org/countryInfoJSON?username=alejandrolsca')
                .success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    
                    return { "status": false };
                });
            return promise;
        };
        factory.getStates = function (zo_country) {
            var promise = $http.get('http://api.geonames.org/childrenJSON?geonameId=' + zo_country + '&username=alejandrolsca')
                .success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    
                    return { "status": false };
                });
            return promise;
        };
        factory.getCityCounty = function (zo_state) {
            var promise = $http.get('http://api.geonames.org/childrenJSON?geonameId=' + zo_state + '&username=alejandrolsca')
                .success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    
                    return { "status": false };
                });
            return promise;
        };
        return factory;
    }];

})(angular);
},{}],134:[function(require,module,exports){
module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.zone.update',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('zoneUpdate', {
            url:'/zone/update/:cl_id/:zo_id',
            templateUrl : 'app/zone/modules/zone.update/zone.update.view.html',
            controller : 'zoneUpdateCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('zoneUpdateFac',require('./zone.update.fac'))

    .controller('zoneUpdateCtrl',require('./zone.update.ctrl'))

})(angular);
},{"./zone.update.ctrl":136,"./zone.update.fac":137}],135:[function(require,module,exports){
module.exports = {
                    "title" : "actualizar dirección de envio",
                }
},{}],136:[function(require,module,exports){
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
},{}],137:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q',  '$stateParams', function ($http, $q, $stateParams) {
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
                    
                    return { "status": false };
                });
            return promise;
        };
        factory.getStates = function (zo_country) {
            var promise = $http.get('http://api.geonames.org/childrenJSON?geonameId=' + zo_country + '&username=alejandrolsca')
                .success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    
                    return { "status": false };
                });
            return promise;
        };
        factory.getCityCounty = function (zo_state) {
            var promise = $http.get('http://api.geonames.org/childrenJSON?geonameId=' + zo_state + '&username=alejandrolsca')
                .success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    
                    return { "status": false };
                });
            return promise;
        };
        return factory;
    }];

})(angular);
},{}],138:[function(require,module,exports){
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
                        if (!ht.range.equals(rng)) {

                            // new cell selected, show tooltip
                            if (ht.cellType == wijmo.grid.CellType.Cell) {
                                rng = ht.range;
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
},{}],139:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q',  '$stateParams', function ($http, $q, $stateParams) {
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
                    
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        return factory;
    }];

})(angular);
},{}]},{},[6])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwLzQwNC80MDQuY3RybC5qcyIsInNyYy9hcHAvNDA0L2luZGV4LmpzIiwic3JjL2FwcC9hcHAuY3RybC5qcyIsInNyYy9hcHAvYXBwLmZhYy5qcyIsInNyYy9hcHAvYXBwLmh0dHAuaW50ZXJjZXB0b3IuanMiLCJzcmMvYXBwL2FwcC5qcyIsInNyYy9hcHAvYXV0aC9sYW5nLmVzLU1YLmpzIiwic3JjL2FwcC9jbGllbnQvY2xpZW50LmN0cmwuanMiLCJzcmMvYXBwL2NsaWVudC9jbGllbnQuZmFjLmpzIiwic3JjL2FwcC9jbGllbnQvaW5kZXguanMiLCJzcmMvYXBwL2NsaWVudC9sYW5nLmN1c3RvbS5lcy1NWC5qcyIsInNyYy9hcHAvY2xpZW50L2xhbmcuZXMtTVguanMiLCJzcmMvYXBwL2NsaWVudC9tb2R1bGVzL2NsaWVudC5hZGQvY2xpZW50LmFkZC5jdHJsLmpzIiwic3JjL2FwcC9jbGllbnQvbW9kdWxlcy9jbGllbnQuYWRkL2NsaWVudC5hZGQuZmFjLmpzIiwic3JjL2FwcC9jbGllbnQvbW9kdWxlcy9jbGllbnQuYWRkL2luZGV4LmpzIiwic3JjL2FwcC9jbGllbnQvbW9kdWxlcy9jbGllbnQuYWRkL2xhbmcuZXMtTVguanMiLCJzcmMvYXBwL2NsaWVudC9tb2R1bGVzL2NsaWVudC51cGRhdGUvY2xpZW50LnVwZGF0ZS5jdHJsLmpzIiwic3JjL2FwcC9jbGllbnQvbW9kdWxlcy9jbGllbnQudXBkYXRlL2NsaWVudC51cGRhdGUuZmFjLmpzIiwic3JjL2FwcC9jbGllbnQvbW9kdWxlcy9jbGllbnQudXBkYXRlL2luZGV4LmpzIiwic3JjL2FwcC9jbGllbnQvbW9kdWxlcy9jbGllbnQudXBkYXRlL2xhbmcuZXMtTVguanMiLCJzcmMvYXBwL2hvbWUvaG9tZS5jdHJsLmpzIiwic3JjL2FwcC9ob21lL2hvbWUuZmFjLmpzIiwic3JjL2FwcC9ob21lL2luZGV4LmpzIiwic3JjL2FwcC9ob21lL2xhbmcuZXMtTVguanMiLCJzcmMvYXBwL2luay9pbmRleC5qcyIsInNyYy9hcHAvaW5rL2luay5jdHJsLmpzIiwic3JjL2FwcC9pbmsvaW5rLmZhYy5qcyIsInNyYy9hcHAvaW5rL2xhbmcuZXMtTVguanMiLCJzcmMvYXBwL2luay9tb2R1bGVzL2luay5hZGQvaW5kZXguanMiLCJzcmMvYXBwL2luay9tb2R1bGVzL2luay5hZGQvaW5rLmFkZC5jdHJsLmpzIiwic3JjL2FwcC9pbmsvbW9kdWxlcy9pbmsuYWRkL2luay5hZGQuZmFjLmpzIiwic3JjL2FwcC9pbmsvbW9kdWxlcy9pbmsuYWRkL2xhbmcuZXMtTVguanMiLCJzcmMvYXBwL2luay9tb2R1bGVzL2luay51cGRhdGUvaW5kZXguanMiLCJzcmMvYXBwL2luay9tb2R1bGVzL2luay51cGRhdGUvaW5rLnVwZGF0ZS5jdHJsLmpzIiwic3JjL2FwcC9pbmsvbW9kdWxlcy9pbmsudXBkYXRlL2luay51cGRhdGUuZmFjLmpzIiwic3JjL2FwcC9pbmsvbW9kdWxlcy9pbmsudXBkYXRlL2xhbmcuZXMtTVguanMiLCJzcmMvYXBwL2xhbmcuZmlsdGVyLmkxOG4uanMiLCJzcmMvYXBwL2xhbmcubG9jYWxlLmVuLVVTLmpzIiwic3JjL2FwcC9sYW5nLmxvY2FsZS5lcy1NWC5qcyIsInNyYy9hcHAvbG9naW4vaW5kZXguanMiLCJzcmMvYXBwL2xvZ2luL2xvZ2luLmN0cmwuanMiLCJzcmMvYXBwL21hY2hpbmUvaW5kZXguanMiLCJzcmMvYXBwL21hY2hpbmUvbGFuZy5lcy1NWC5qcyIsInNyYy9hcHAvbWFjaGluZS9tYWNoaW5lLmN0cmwuanMiLCJzcmMvYXBwL21hY2hpbmUvbWFjaGluZS5mYWMuanMiLCJzcmMvYXBwL21hY2hpbmUvbW9kdWxlcy9tYWNoaW5lLmFkZC9pbmRleC5qcyIsInNyYy9hcHAvbWFjaGluZS9tb2R1bGVzL21hY2hpbmUuYWRkL2xhbmcuZXMtTVguanMiLCJzcmMvYXBwL21hY2hpbmUvbW9kdWxlcy9tYWNoaW5lLmFkZC9tYWNoaW5lLmFkZC5jdHJsLmpzIiwic3JjL2FwcC9tYWNoaW5lL21vZHVsZXMvbWFjaGluZS5hZGQvbWFjaGluZS5hZGQuZmFjLmpzIiwic3JjL2FwcC9tYWNoaW5lL21vZHVsZXMvbWFjaGluZS51cGRhdGUvaW5kZXguanMiLCJzcmMvYXBwL21hY2hpbmUvbW9kdWxlcy9tYWNoaW5lLnVwZGF0ZS9sYW5nLmVzLU1YLmpzIiwic3JjL2FwcC9tYWNoaW5lL21vZHVsZXMvbWFjaGluZS51cGRhdGUvbWFjaGluZS51cGRhdGUuY3RybC5qcyIsInNyYy9hcHAvbWFjaGluZS9tb2R1bGVzL21hY2hpbmUudXBkYXRlL21hY2hpbmUudXBkYXRlLmZhYy5qcyIsInNyYy9hcHAvcGFwZXIvaW5kZXguanMiLCJzcmMvYXBwL3BhcGVyL2xhbmcuZXMtTVguanMiLCJzcmMvYXBwL3BhcGVyL21vZHVsZXMvcGFwZXIuYWRkL2luZGV4LmpzIiwic3JjL2FwcC9wYXBlci9tb2R1bGVzL3BhcGVyLmFkZC9sYW5nLmVzLU1YLmpzIiwic3JjL2FwcC9wYXBlci9tb2R1bGVzL3BhcGVyLmFkZC9wYXBlci5hZGQuY3RybC5qcyIsInNyYy9hcHAvcGFwZXIvbW9kdWxlcy9wYXBlci5hZGQvcGFwZXIuYWRkLmZhYy5qcyIsInNyYy9hcHAvcGFwZXIvbW9kdWxlcy9wYXBlci51cGRhdGUvaW5kZXguanMiLCJzcmMvYXBwL3BhcGVyL21vZHVsZXMvcGFwZXIudXBkYXRlL2xhbmcuZXMtTVguanMiLCJzcmMvYXBwL3BhcGVyL21vZHVsZXMvcGFwZXIudXBkYXRlL3BhcGVyLnVwZGF0ZS5jdHJsLmpzIiwic3JjL2FwcC9wYXBlci9tb2R1bGVzL3BhcGVyLnVwZGF0ZS9wYXBlci51cGRhdGUuZmFjLmpzIiwic3JjL2FwcC9wYXBlci9wYXBlci5jdHJsLmpzIiwic3JjL2FwcC9wYXBlci9wYXBlci5mYWMuanMiLCJzcmMvYXBwL3Byb2R1Y3QvaW5kZXguanMiLCJzcmMvYXBwL3Byb2R1Y3QvbGFuZy5lcy1NWC5qcyIsInNyYy9hcHAvcHJvZHVjdC9tb2R1bGVzL3Byb2R1Y3RPZmZzZXRHZW5lcmFsLmFkZC9pbmRleC5qcyIsInNyYy9hcHAvcHJvZHVjdC9tb2R1bGVzL3Byb2R1Y3RPZmZzZXRHZW5lcmFsLmFkZC9sYW5nLmVzLU1YLmpzIiwic3JjL2FwcC9wcm9kdWN0L21vZHVsZXMvcHJvZHVjdE9mZnNldEdlbmVyYWwuYWRkL3Byb2R1Y3RPZmZzZXRHZW5lcmFsLmFkZC5jdHJsLmpzIiwic3JjL2FwcC9wcm9kdWN0L21vZHVsZXMvcHJvZHVjdE9mZnNldEdlbmVyYWwuYWRkL3Byb2R1Y3RPZmZzZXRHZW5lcmFsLmFkZC5mYWMuanMiLCJzcmMvYXBwL3Byb2R1Y3QvbW9kdWxlcy9wcm9kdWN0T2Zmc2V0R2VuZXJhbC51cGRhdGUvaW5kZXguanMiLCJzcmMvYXBwL3Byb2R1Y3QvbW9kdWxlcy9wcm9kdWN0T2Zmc2V0R2VuZXJhbC51cGRhdGUvbGFuZy5lcy1NWC5qcyIsInNyYy9hcHAvcHJvZHVjdC9tb2R1bGVzL3Byb2R1Y3RPZmZzZXRHZW5lcmFsLnVwZGF0ZS9wcm9kdWN0T2Zmc2V0R2VuZXJhbC51cGRhdGUuY3RybC5qcyIsInNyYy9hcHAvcHJvZHVjdC9tb2R1bGVzL3Byb2R1Y3RPZmZzZXRHZW5lcmFsLnVwZGF0ZS9wcm9kdWN0T2Zmc2V0R2VuZXJhbC51cGRhdGUuZmFjLmpzIiwic3JjL2FwcC9wcm9kdWN0L21vZHVsZXMvcHJvZHVjdE9mZnNldFBhZ2luYXRlZC5hZGQvaW5kZXguanMiLCJzcmMvYXBwL3Byb2R1Y3QvbW9kdWxlcy9wcm9kdWN0T2Zmc2V0UGFnaW5hdGVkLmFkZC9sYW5nLmVzLU1YLmpzIiwic3JjL2FwcC9wcm9kdWN0L21vZHVsZXMvcHJvZHVjdE9mZnNldFBhZ2luYXRlZC5hZGQvcHJvZHVjdE9mZnNldFBhZ2luYXRlZC5hZGQuY3RybC5qcyIsInNyYy9hcHAvcHJvZHVjdC9tb2R1bGVzL3Byb2R1Y3RPZmZzZXRQYWdpbmF0ZWQuYWRkL3Byb2R1Y3RPZmZzZXRQYWdpbmF0ZWQuYWRkLmZhYy5qcyIsInNyYy9hcHAvcHJvZHVjdC9wcm9kdWN0LmN0cmwuanMiLCJzcmMvYXBwL3Byb2R1Y3QvcHJvZHVjdC5mYWMuanMiLCJzcmMvYXBwL3N1cHBsaWVyL2luZGV4LmpzIiwic3JjL2FwcC9zdXBwbGllci9sYW5nLmVzLU1YLmpzIiwic3JjL2FwcC9zdXBwbGllci9tb2R1bGVzL3N1cHBsaWVyLmFkZC9pbmRleC5qcyIsInNyYy9hcHAvc3VwcGxpZXIvbW9kdWxlcy9zdXBwbGllci5hZGQvbGFuZy5lcy1NWC5qcyIsInNyYy9hcHAvc3VwcGxpZXIvbW9kdWxlcy9zdXBwbGllci5hZGQvc3VwcGxpZXIuYWRkLmN0cmwuanMiLCJzcmMvYXBwL3N1cHBsaWVyL21vZHVsZXMvc3VwcGxpZXIuYWRkL3N1cHBsaWVyLmFkZC5mYWMuanMiLCJzcmMvYXBwL3N1cHBsaWVyL21vZHVsZXMvc3VwcGxpZXIudXBkYXRlL2luZGV4LmpzIiwic3JjL2FwcC9zdXBwbGllci9tb2R1bGVzL3N1cHBsaWVyLnVwZGF0ZS9sYW5nLmVzLU1YLmpzIiwic3JjL2FwcC9zdXBwbGllci9tb2R1bGVzL3N1cHBsaWVyLnVwZGF0ZS9zdXBwbGllci51cGRhdGUuY3RybC5qcyIsInNyYy9hcHAvc3VwcGxpZXIvbW9kdWxlcy9zdXBwbGllci51cGRhdGUvc3VwcGxpZXIudXBkYXRlLmZhYy5qcyIsInNyYy9hcHAvc3VwcGxpZXIvc3VwcGxpZXIuY3RybC5qcyIsInNyYy9hcHAvc3VwcGxpZXIvc3VwcGxpZXIuZmFjLmpzIiwic3JjL2FwcC91c2VyL2luZGV4LmpzIiwic3JjL2FwcC91c2VyL2xhbmcuZXMtTVguanMiLCJzcmMvYXBwL3VzZXIvbW9kdWxlcy91c2VyLmFkZC9pbmRleC5qcyIsInNyYy9hcHAvdXNlci9tb2R1bGVzL3VzZXIuYWRkL2xhbmcuZXMtTVguanMiLCJzcmMvYXBwL3VzZXIvbW9kdWxlcy91c2VyLmFkZC91c2VyLmFkZC5jdHJsLmpzIiwic3JjL2FwcC91c2VyL21vZHVsZXMvdXNlci5hZGQvdXNlci5hZGQuZmFjLmpzIiwic3JjL2FwcC91c2VyL21vZHVsZXMvdXNlci5wcm9maWxlL2luZGV4LmpzIiwic3JjL2FwcC91c2VyL21vZHVsZXMvdXNlci5wcm9maWxlL2xhbmcuZXMtTVguanMiLCJzcmMvYXBwL3VzZXIvbW9kdWxlcy91c2VyLnByb2ZpbGUvdXNlci5wcm9maWxlLmN0cmwuanMiLCJzcmMvYXBwL3VzZXIvbW9kdWxlcy91c2VyLnVwZGF0ZS9pbmRleC5qcyIsInNyYy9hcHAvdXNlci9tb2R1bGVzL3VzZXIudXBkYXRlL2xhbmcuZXMtTVguanMiLCJzcmMvYXBwL3VzZXIvbW9kdWxlcy91c2VyLnVwZGF0ZS91c2VyLnVwZGF0ZS5jdHJsLmpzIiwic3JjL2FwcC91c2VyL21vZHVsZXMvdXNlci51cGRhdGUvdXNlci51cGRhdGUuZmFjLmpzIiwic3JjL2FwcC91c2VyL3VzZXIuY3RybC5qcyIsInNyYy9hcHAvdXNlci91c2VyLmZhYy5qcyIsInNyYy9hcHAvd28vaW5kZXguanMiLCJzcmMvYXBwL3dvL2xhbmcuZXMtTVguanMiLCJzcmMvYXBwL3dvL21vZHVsZXMvd28uYWRkL2luZGV4LmpzIiwic3JjL2FwcC93by9tb2R1bGVzL3dvLmFkZC9sYW5nLmVzLU1YLmpzIiwic3JjL2FwcC93by9tb2R1bGVzL3dvLmFkZC93by5hZGQuY3RybC5qcyIsInNyYy9hcHAvd28vbW9kdWxlcy93by5hZGQvd28uYWRkLmZhYy5qcyIsInNyYy9hcHAvd28vbW9kdWxlcy93by5kdXBsaWNhdGUvaW5kZXguanMiLCJzcmMvYXBwL3dvL21vZHVsZXMvd28uZHVwbGljYXRlL3dvLmR1cGxpY2F0ZS5jdHJsLmpzIiwic3JjL2FwcC93by9tb2R1bGVzL3dvLmR1cGxpY2F0ZS93by5kdXBsaWNhdGUuZmFjLmpzIiwic3JjL2FwcC93by9tb2R1bGVzL3dvLnVwZGF0ZS9pbmRleC5qcyIsInNyYy9hcHAvd28vbW9kdWxlcy93by51cGRhdGUvbGFuZy5lcy1NWC5qcyIsInNyYy9hcHAvd28vbW9kdWxlcy93by51cGRhdGUvd28udXBkYXRlLmN0cmwuanMiLCJzcmMvYXBwL3dvL21vZHVsZXMvd28udXBkYXRlL3dvLnVwZGF0ZS5mYWMuanMiLCJzcmMvYXBwL3dvL3dvLmN0cmwuanMiLCJzcmMvYXBwL3dvL3dvLmZhYy5qcyIsInNyYy9hcHAvd29ya2Zsb3cvaW5kZXguanMiLCJzcmMvYXBwL3dvcmtmbG93L2xhbmcuZXMtTVguanMiLCJzcmMvYXBwL3dvcmtmbG93L3dvcmtmbG93LmN0cmwuanMiLCJzcmMvYXBwL3dvcmtmbG93L3dvcmtmbG93LmZhYy5qcyIsInNyYy9hcHAvem9uZS9pbmRleC5qcyIsInNyYy9hcHAvem9uZS9sYW5nLmVzLU1YLmpzIiwic3JjL2FwcC96b25lL21vZHVsZXMvem9uZS5hZGQvaW5kZXguanMiLCJzcmMvYXBwL3pvbmUvbW9kdWxlcy96b25lLmFkZC9sYW5nLmVzLU1YLmpzIiwic3JjL2FwcC96b25lL21vZHVsZXMvem9uZS5hZGQvem9uZS5hZGQuY3RybC5qcyIsInNyYy9hcHAvem9uZS9tb2R1bGVzL3pvbmUuYWRkL3pvbmUuYWRkLmZhYy5qcyIsInNyYy9hcHAvem9uZS9tb2R1bGVzL3pvbmUudXBkYXRlL2luZGV4LmpzIiwic3JjL2FwcC96b25lL21vZHVsZXMvem9uZS51cGRhdGUvbGFuZy5lcy1NWC5qcyIsInNyYy9hcHAvem9uZS9tb2R1bGVzL3pvbmUudXBkYXRlL3pvbmUudXBkYXRlLmN0cmwuanMiLCJzcmMvYXBwL3pvbmUvbW9kdWxlcy96b25lLnVwZGF0ZS96b25lLnVwZGF0ZS5mYWMuanMiLCJzcmMvYXBwL3pvbmUvem9uZS5jdHJsLmpzIiwic3JjL2FwcC96b25lL3pvbmUuZmFjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9LQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0lBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9JQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbE1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckc2NvcGUnLCBmdW5jdGlvbiAoJHNjb3BlKSB7XG4gICAgICAgIC8vQVNEXG4gICAgfV07XG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKGFuZ3VsYXIpe1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBcbiAgICByZXR1cm4gYW5ndWxhci5tb2R1bGUoJ2FwcC40MDQnLFtdKVxuXG4gICAgLmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsXG4gICAgZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnNDA0Jywge1xuICAgICAgICAgICAgdXJsOicvNDA0JyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsIDogJ2FwcC80MDQvNDA0LnZpZXcuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyIDogJzQwNEN0cmwnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHJlcXVpcmVzTG9naW46IHRydWVcbiAgICAgICAgICAgIH0gICAgXG4gICAgICAgIH0pO1xuICAgIH1dKVxuXG4gICAgLmNvbnRyb2xsZXIoJzQwNEN0cmwnLHJlcXVpcmUoJy4vNDA0LmN0cmwnKSlcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckc2NvcGUnLCAnJHJvb3RTY29wZScsICdpMThuRmlsdGVyJywgJyRsb2NhdGlvbicsICdhdXRoU2VydmljZScsIFxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCAkcm9vdFNjb3BlLCBpMThuRmlsdGVyLCAkbG9jYXRpb24sIGF1dGhTZXJ2aWNlKSB7XG5cbiAgICAgICAgICAgIC8vJHNjb3BlLmF1dGhTZXJ2aWNlID0gYXV0aFNlcnZpY2U7XG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgbGFuZ0ZhYy5nZXRMYW5nKCkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgIGlmIChwcm9taXNlLmRhdGEuc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLmN1cnJlbnRMYW5ndWFnZSA9IHByb21pc2UuZGF0YS5sYW5nO1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUubmF2SXRlbXMgPSBpMThuRmlsdGVyKFwiR0VORVJBTC5OQVZcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGl0ZW0gaW4gJHNjb3BlLm5hdkl0ZW1zKSB7XG4gICAgICAgICAgICAgICAgaWYgKCRzY29wZS5uYXZJdGVtc1tpdGVtXS5zdWJNZW51KSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5sYXN0U3VibWVudSA9IGl0ZW07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJHNjb3BlLmxhbmcgPSBmdW5jdGlvbiAobGFuZykge1xuICAgICAgICAgICAgICAgIGxhbmdGYWMuc2V0TGFuZyhsYW5nKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9taXNlLmRhdGEuc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS5jdXJyZW50TGFuZ3VhZ2UgPSBwcm9taXNlLmRhdGEubGFuZztcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5uYXZJdGVtcyA9IGkxOG5GaWx0ZXIoXCJHRU5FUkFMLk5BVlwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgKi9cbiAgICAgICAgfV1cblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckaHR0cCcsICckcScsICBmdW5jdGlvbiAoJGh0dHAsICRxKSB7XG4gICAgICAgIHZhciBmYWN0b3J5ID0ge307XG4gICAgICAgIGZhY3Rvcnkuand0Q2hlY2sgPSBmdW5jdGlvbiAobmV3TGFuZykge1xuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoXG4gICAgICAgICAgICAgICAgJGh0dHAucG9zdCgnL2FwaS9qd3QnLCB7XG4gICAgICAgICAgICAgICAgICAgIHByb2Nlc3M6IG5ldyBEYXRlKCkuZ2V0TWlsbGlzZWNvbmRzKClcbiAgICAgICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGZhY3Rvcnk7XG4gICAgfV07XG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgcmV0dXJuIFsnJHEnLCAnJGluamVjdG9yJywgJ2F1dGhTZXJ2aWNlJyxcbiAgICAgICAgZnVuY3Rpb24gKCRxLCAkaW5qZWN0b3IsIGF1dGhTZXJ2aWNlKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICdyZXF1ZXN0JzogZnVuY3Rpb24gKGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICAvLyBpZiB1c2VyIGlzIGF0aGVudGljYXRlZCwgYWRkIHRoZSBwcm9maWxlIHRvIHRoZSBoZWFkZXJzXG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCEhYXV0aFNlcnZpY2UudXNlclByb2ZpbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZy5oZWFkZXJzLnByb2ZpbGUgPSBKU09OLnN0cmluZ2lmeShhdXRoU2VydmljZS51c2VyUHJvZmlsZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbmZpZztcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgJ3JlcXVlc3RFcnJvcic6IGZ1bmN0aW9uIChyZWplY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZG8gc29tZXRoaW5nIG9uIGVycm9yXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkcS5yZWplY3QocmVqZWN0aW9uKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICdyZXNwb25zZUVycm9yJzogZnVuY3Rpb24gKHJlamVjdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAvLyBkbyBzb21ldGhpbmcgb24gZXJyb3JcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFsZXJ0cyA9ICRpbmplY3Rvci5nZXQoJyRhbGVydHMnKTtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnRzLmVycm9yKCdXb29vcHMhIGFuIGVycm9yIGhhcyBvY3VycmVkLicsIEpTT04uc3RyaW5naWZ5KHJlamVjdGlvbiwgbnVsbCwgNCkpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHEucmVqZWN0KHJlamVjdGlvbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XVxuXG59KShhbmd1bGFyKSIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuXG4gICAgJ3VzZSBzdHJpY3QnOy8vIGxvIHF1ZSBzZWFcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAnLCBbXG4gICAgICAgICd1aS5yb3V0ZXInLFxuICAgICAgICAnbmdBbmltYXRlJyxcbiAgICAgICAgJ3VpLmJvb3RzdHJhcCcsXG4gICAgICAgICdnZy1maWVsZHMnLFxuICAgICAgICAnZ2ctYWxlcnRzJyxcbiAgICAgICAgJ3dqJyxcbiAgICAgICAgJ2phLnFyJyxcbiAgICAgICAgJ2F1dGgwLmxvY2snLFxuICAgICAgICAnYW5ndWxhci1qd3QnLFxuICAgICAgICByZXF1aXJlKCcuLzQwNCcpLm5hbWUsXG4gICAgICAgIHJlcXVpcmUoJy4vbG9naW4nKS5uYW1lLFxuICAgICAgICByZXF1aXJlKCcuL2NsaWVudCcpLm5hbWUsXG4gICAgICAgIHJlcXVpcmUoJy4vdXNlcicpLm5hbWUsXG4gICAgICAgIHJlcXVpcmUoJy4vaG9tZScpLm5hbWUsXG4gICAgICAgIHJlcXVpcmUoJy4vcHJvZHVjdCcpLm5hbWUsXG4gICAgICAgIHJlcXVpcmUoJy4vc3VwcGxpZXInKS5uYW1lLFxuICAgICAgICByZXF1aXJlKCcuL21hY2hpbmUnKS5uYW1lLFxuICAgICAgICByZXF1aXJlKCcuL3BhcGVyJykubmFtZSxcbiAgICAgICAgcmVxdWlyZSgnLi9pbmsnKS5uYW1lLFxuICAgICAgICByZXF1aXJlKCcuL3dvJykubmFtZSxcbiAgICAgICAgcmVxdWlyZSgnLi96b25lJykubmFtZSxcbiAgICAgICAgcmVxdWlyZSgnLi93b3JrZmxvdycpLm5hbWVcbiAgICBdKVxuXG4gICAgICAgIC5zZXJ2aWNlKCdhdXRoU2VydmljZScsIFsnJHJvb3RTY29wZScsICckbG9jYXRpb24nLCAnbG9jaycsICdhdXRoTWFuYWdlcicsIGZ1bmN0aW9uIGF1dGhTZXJ2aWNlKCRyb290U2NvcGUsICRsb2NhdGlvbiwgbG9jaywgYXV0aE1hbmFnZXIpIHtcblxuICAgICAgICAgICAgdmFyIHVzZXJQcm9maWxlID0gYW5ndWxhci5mcm9tSnNvbihsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncHJvZmlsZScpKSB8fCB7fTtcblxuICAgICAgICAgICAgZnVuY3Rpb24gbG9naW4oKSB7XG4gICAgICAgICAgICAgICAgbG9jay5zaG93KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIExvZ2dpbmcgb3V0IGp1c3QgcmVxdWlyZXMgcmVtb3ZpbmcgdGhlIHVzZXInc1xuICAgICAgICAgICAgLy8gaWRfdG9rZW4gYW5kIHByb2ZpbGVcbiAgICAgICAgICAgIGZ1bmN0aW9uIGxvZ291dCgpIHtcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgnaWRfdG9rZW4nKTtcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgncHJvZmlsZScpO1xuICAgICAgICAgICAgICAgIGF1dGhNYW5hZ2VyLnVuYXV0aGVudGljYXRlKCk7XG4gICAgICAgICAgICAgICAgdXNlclByb2ZpbGUgPSB7fTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gU2V0IHVwIHRoZSBsb2dpYyBmb3Igd2hlbiBhIHVzZXIgYXV0aGVudGljYXRlc1xuICAgICAgICAgICAgLy8gVGhpcyBtZXRob2QgaXMgY2FsbGVkIGZyb20gYXBwLnJ1bi5qc1xuICAgICAgICAgICAgZnVuY3Rpb24gcmVnaXN0ZXJBdXRoZW50aWNhdGlvbkxpc3RlbmVyKCkge1xuICAgICAgICAgICAgICAgIGxvY2sub24oJ2F1dGhlbnRpY2F0ZWQnLCBmdW5jdGlvbiAoYXV0aFJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnaWRfdG9rZW4nLCBhdXRoUmVzdWx0LmlkVG9rZW4pO1xuICAgICAgICAgICAgICAgICAgICBhdXRoTWFuYWdlci5hdXRoZW50aWNhdGUoKTtcblxuICAgICAgICAgICAgICAgICAgICBsb2NrLmdldFByb2ZpbGUoYXV0aFJlc3VsdC5pZFRva2VuLCBmdW5jdGlvbiAoZXJyb3IsIHByb2ZpbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3Byb2ZpbGUnLCBKU09OLnN0cmluZ2lmeShwcm9maWxlKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ3VzZXJQcm9maWxlU2V0JywgcHJvZmlsZSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2hvbWUnKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB1c2VyUHJvZmlsZTogdXNlclByb2ZpbGUsXG4gICAgICAgICAgICAgICAgbG9naW46IGxvZ2luLFxuICAgICAgICAgICAgICAgIGxvZ291dDogbG9nb3V0LFxuICAgICAgICAgICAgICAgIHJlZ2lzdGVyQXV0aGVudGljYXRpb25MaXN0ZW5lcjogcmVnaXN0ZXJBdXRoZW50aWNhdGlvbkxpc3RlbmVyLFxuICAgICAgICAgICAgfVxuICAgICAgICB9XSlcblxuICAgICAgICAuY29uZmlnKFsnJGxvY2F0aW9uUHJvdmlkZXInLCAnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJywgJyRodHRwUHJvdmlkZXInLCAnbG9ja1Byb3ZpZGVyJywgJ2p3dE9wdGlvbnNQcm92aWRlcicsICdqd3RJbnRlcmNlcHRvclByb3ZpZGVyJyxcbiAgICAgICAgICAgIGZ1bmN0aW9uICgkbG9jYXRpb25Qcm92aWRlciwgJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlciwgJGh0dHBQcm92aWRlciwgbG9ja1Byb3ZpZGVyLCBqd3RPcHRpb25zUHJvdmlkZXIsIGp3dEludGVyY2VwdG9yUHJvdmlkZXIpIHtcblxuICAgICAgICAgICAgICAgIGxvY2tQcm92aWRlci5pbml0KHtcbiAgICAgICAgICAgICAgICAgICAgY2xpZW50SUQ6ICdaZXhWREVQbHFHTE1uV1hubXlLU3NvRThKTzNaUzc2eScsXG4gICAgICAgICAgICAgICAgICAgIGRvbWFpbjogJ2dydXBvZ3JhZmljby5hdXRoMC5jb20nLFxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdmF0YXI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBsYW5ndWFnZTogXCJlc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2xvc2FibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBhdXRvY2xvc2U6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICByZW1lbWJlckxhc3RMb2dpbjogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBhdXRoOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVkaXJlY3Q6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlZGlyZWN0VXJsOiBcImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMC93d3cvIy9ob21lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2VUeXBlOiBcInRva2VuXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3NvOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhbmd1YWdlRGljdGlvbmFyeToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIkdydXBvIEdyw6FmaWNvXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGVtZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsZWRTdWJtaXRCdXR0b246IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9sb2dvOiBcImltZy9nZ2F1dGgtbG9nby5wbmdcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmltYXJ5Q29sb3I6IFwiZ3JlZW5cIlxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBqd3RPcHRpb25zUHJvdmlkZXIuY29uZmlnKHtcbiAgICAgICAgICAgICAgICAgICAgbG9naW5QYXRoOiAnL2hvbWUnLFxuICAgICAgICAgICAgICAgICAgICB1bmF1dGhlbnRpY2F0ZWRSZWRpcmVjdG9yOiBbJyRzdGF0ZScsIGZ1bmN0aW9uICgkc3RhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnbG9naW4nKTtcbiAgICAgICAgICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICAgICAgICAgIHRva2VuR2V0dGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2lkX3Rva2VuJyk7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHdoaXRlTGlzdGVkRG9tYWluczogW1xuICAgICAgICAgICAgICAgICAgICAgICAgJ2h0dHA6Ly9hcGkuZ2VvbmFtZXMub3JnLydcbiAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgJGh0dHBQcm92aWRlci5pbnRlcmNlcHRvcnMucHVzaCgnand0SW50ZXJjZXB0b3InKTtcblxuICAgICAgICAgICAgICAgICRodHRwUHJvdmlkZXIuaW50ZXJjZXB0b3JzLnB1c2gocmVxdWlyZSgnLi9hcHAuaHR0cC5pbnRlcmNlcHRvcicpKTtcblxuICAgICAgICAgICAgICAgIC8vIEJhdGNoaW5nIG11bHRpcGxlICRodHRwIHJlc3BvbnNlcyBpbnRvIG9uZSAkZGlnZXN0XG4gICAgICAgICAgICAgICAgJGh0dHBQcm92aWRlci51c2VBcHBseUFzeW5jKHRydWUpO1xuXG4gICAgICAgICAgICAgICAgLy8gZGVmYXVsdCByb3V0ZXNcbiAgICAgICAgICAgICAgICAkdXJsUm91dGVyUHJvdmlkZXIud2hlbignJywgJy9ob21lJyk7XG4gICAgICAgICAgICAgICAgJHVybFJvdXRlclByb3ZpZGVyLndoZW4oJy8nLCAnL2hvbWUnKTtcbiAgICAgICAgICAgICAgICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKFwiLzQwNFwiKTtcblxuICAgICAgICAgICAgfV0pXG5cbiAgICAgICAgLnJ1bihbJyRyb290U2NvcGUnLCAnYXV0aFNlcnZpY2UnLCAnYXV0aE1hbmFnZXInLCAnJGxvY2F0aW9uJywgJ2p3dEhlbHBlcicsICckc3RhdGUnLCAnYXBwRmFjJyxcbiAgICAgICAgICAgIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCBhdXRoU2VydmljZSwgYXV0aE1hbmFnZXIsICRsb2NhdGlvbiwgand0SGVscGVyLCAkc3RhdGUsIGFwcEZhYykge1xuXG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN0YXJ0JywgZnVuY3Rpb24gKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcywgZnJvbVN0YXRlLCBmcm9tUGFyYW1zLCBvcHRpb25zKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghIXRvU3RhdGUuZGF0YS5yZXF1aXJlc0xvZ2luKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdG9rZW4gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnaWRfdG9rZW4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0b2tlbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghand0SGVscGVyLmlzVG9rZW5FeHBpcmVkKHRva2VuKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWF1dGhNYW5hZ2VyLmlzQXV0aGVudGljYXRlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXV0aE1hbmFnZXIuYXV0aGVudGljYXRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2xvZ2luJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2xvZ2luJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIC8vIFB1dCB0aGUgYXV0aFNlcnZpY2Ugb24gJHJvb3RTY29wZSBzbyBpdHMgbWV0aG9kc1xuICAgICAgICAgICAgICAgIC8vIGNhbiBiZSBhY2Nlc3NlZCBmcm9tIHRoZSBuYXYgYmFyXG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS5hdXRoU2VydmljZSA9IGF1dGhTZXJ2aWNlO1xuXG4gICAgICAgICAgICAgICAgLy8gUmVnaXN0ZXIgdGhlIGF1dGhlbnRpY2F0aW9uIGxpc3RlbmVyIHRoYXQgaXNcbiAgICAgICAgICAgICAgICAvLyBzZXQgdXAgaW4gYXV0aC5zZXJ2aWNlLmpzXG4gICAgICAgICAgICAgICAgYXV0aFNlcnZpY2UucmVnaXN0ZXJBdXRoZW50aWNhdGlvbkxpc3RlbmVyKCk7XG5cbiAgICAgICAgICAgICAgICAvLyBVc2UgdGhlIGF1dGhNYW5hZ2VyIGZyb20gYW5ndWxhci1qd3QgdG8gY2hlY2sgZm9yXG4gICAgICAgICAgICAgICAgLy8gdGhlIHVzZXIncyBhdXRoZW50aWNhdGlvbiBzdGF0ZSB3aGVuIHRoZSBwYWdlIGlzXG4gICAgICAgICAgICAgICAgLy8gcmVmcmVzaGVkIGFuZCBtYWludGFpbiBhdXRoZW50aWNhdGlvblxuICAgICAgICAgICAgICAgIC8vYXV0aE1hbmFnZXIuY2hlY2tBdXRoT25SZWZyZXNoKCk7XG5cbiAgICAgICAgICAgICAgICAvLyBMaXN0ZW4gZm9yIDQwMSB1bmF1dGhvcml6ZWQgcmVxdWVzdHMgYW5kIHJlZGlyZWN0XG4gICAgICAgICAgICAgICAgLy8gdGhlIHVzZXIgdG8gdGhlIGxvZ2luIHBhZ2VcbiAgICAgICAgICAgICAgICBhdXRoTWFuYWdlci5yZWRpcmVjdFdoZW5VbmF1dGhlbnRpY2F0ZWQoKTtcblxuXG4gICAgICAgICAgICB9XSlcblxuICAgICAgICAuZmlsdGVyKCdpMThuJywgcmVxdWlyZSgnLi9sYW5nLmZpbHRlci5pMThuJykpXG5cbiAgICAgICAgLmZhY3RvcnkoJ2FwcEZhYycsIHJlcXVpcmUoJy4vYXBwLmZhYycpKVxuXG4gICAgICAgIC5jb250cm9sbGVyKCdhcHBDdHJsJywgcmVxdWlyZSgnLi9hcHAuY3RybCcpKVxuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiIDogXCJpbmljaWFyIHNlc2nDs25cIixcbiAgICAgICAgICAgICAgICAgICAgXCJlbnRlcnByaXNlXCIgOiBcImVtcHJlc2FcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ1c2VyXCIgOiBcInVzdWFyaW9cIixcbiAgICAgICAgICAgICAgICAgICAgXCJwYXNzd29yZFwiIDogXCJjb250cmFzZcOxYVwiLFxuICAgICAgICAgICAgICAgIH0iLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRzY29wZScsICdjbGllbnRGYWMnLCAnJGxvY2F0aW9uJywgJ2kxOG5GaWx0ZXInLFxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCBjbGllbnRGYWMsICRsb2NhdGlvbiwgaTE4bkZpbHRlcikge1xuICAgICAgICAgICAgJHNjb3BlLmZtRGF0YSA9IHt9O1xuICAgICAgICAgICAgJHNjb3BlLmxhYmVscyA9IE9iamVjdC5rZXlzKGkxOG5GaWx0ZXIoXCJjbGllbnQubGFiZWxzXCIpKTtcbiAgICAgICAgICAgICRzY29wZS5jb2x1bW5zID0gaTE4bkZpbHRlcihcImNsaWVudC5jb2x1bW5zXCIpO1xuICAgICAgICBcbiAgICAgICAgICAgIC8vIGZvcm1hdEl0ZW0gZXZlbnQgaGFuZGxlclxuICAgICAgICAgICAgdmFyIGNsX2lkO1xuICAgICAgICAgICAgJHNjb3BlLmZvcm1hdEl0ZW0gPSBmdW5jdGlvbiAocywgZSwgY2VsbCkge1xuXG4gICAgICAgICAgICAgICAgaWYgKGUucGFuZWwuY2VsbFR5cGUgPT0gd2lqbW8uZ3JpZC5DZWxsVHlwZS5Sb3dIZWFkZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgZS5jZWxsLnRleHRDb250ZW50ID0gZS5yb3cgKyAxO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHMucm93cy5kZWZhdWx0U2l6ZSA9IDMwO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gYWRkIEJvb3RzdHJhcCBodG1sXG4gICAgICAgICAgICAgICAgaWYgKChlLnBhbmVsLmNlbGxUeXBlID09IHdpam1vLmdyaWQuQ2VsbFR5cGUuQ2VsbCkgJiYgKGUuY29sID09IDApKSB7XG4gICAgICAgICAgICAgICAgICAgIGNsX2lkID0gZS5wYW5lbC5nZXRDZWxsRGF0YShlLnJvdywgMSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBlLmNlbGwuc3R5bGUub3ZlcmZsb3cgPSAndmlzaWJsZSc7XG4gICAgICAgICAgICAgICAgICAgIGUuY2VsbC5pbm5lckhUTUwgPSAnPGRpdiBjbGFzcz1cImJ0bi1ncm91cCBidG4tZ3JvdXAtanVzdGlmaWVkXCIgcm9sZT1cImdyb3VwXCIgYXJpYS1sYWJlbD1cIi4uLlwiPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJ0bi1ncm91cFwiIHJvbGU9XCJncm91cFwiPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIjL2NsaWVudC91cGRhdGUvJysgY2xfaWQgKyAnXCIgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHQgYnRuLXhzXCIgbmctY2xpY2s9XCJlZGl0KCRpdGVtLmNsX2lkKVwiPicgKyBpMThuRmlsdGVyKFwiZ2VuZXJhbC5sYWJlbHMuZWRpdFwiKSArICc8L2E+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidG4tZ3JvdXBcIj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHQgIGJ0bi14cyBkcm9wZG93bi10b2dnbGVcIiBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCIgYXJpYS1leHBhbmRlZD1cImZhbHNlXCI+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJysgaTE4bkZpbHRlcihcImdlbmVyYWwubGFiZWxzLmFkZFwiKSArICcgPHNwYW4gY2xhc3M9XCJjYXJldFwiPjwvc3Bhbj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnVcIiByb2xlPVwibWVudVwiPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiIy93by9hZGQvJysgY2xfaWQgKyAnXCI+PHNwYW4gY2xhc3M9XCJnbHlwaGljb24gZ2x5cGhpY29uLXRoLWxhcmdlXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9zcGFuPiBPcmRlbjwvYT48L2xpPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiIy9wcm9kdWN0L2FkZC9cIiBkYXRhLXRvZ2dsZT1cIm1vZGFsXCIgZGF0YS10YXJnZXQ9XCIjbXlNb2RhbFwiIGRhdGEtY2xfaWQ9XCInKyBjbF9pZCArICdcIj48c3BhbiBjbGFzcz1cImdseXBoaWNvbiBnbHlwaGljb24tYmFyY29kZVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvc3Bhbj4gUHJvZHVjdG88L2E+PC9saT5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiMvcXVvdGUvYWRkLycrIGNsX2lkICsgJ1wiPjxzcGFuIGNsYXNzPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1maWxlXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9zcGFuPiBDb3RpemFjaW9uPC9hPjwvbGk+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjL3pvbmUvYWRkLycrIGNsX2lkICsgJ1wiPjxzcGFuIGNsYXNzPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1tYXAtbWFya2VyXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9zcGFuPiBab25hPC9hPjwvbGk+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjL2VtYWlsL2FkZC8nKyBjbF9pZCArICdcIj48c3BhbiBjbGFzcz1cImdseXBoaWNvbiBnbHlwaGljb24tZW52ZWxvcGVcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L3NwYW4+IENvcnJlbzwvYT48L2xpPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3VsPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYnRuLWdyb3VwXCI+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0ICBidG4teHMgZHJvcGRvd24tdG9nZ2xlXCIgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiIGFyaWEtZXhwYW5kZWQ9XCJmYWxzZVwiPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICcrIGkxOG5GaWx0ZXIoXCJnZW5lcmFsLmxhYmVscy5zaG93XCIpICsgJyA8c3BhbiBjbGFzcz1cImNhcmV0XCI+PC9zcGFuPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudVwiIHJvbGU9XCJtZW51XCI+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjL3dvLycrIGNsX2lkICsgJ1wiPjxzcGFuIGNsYXNzPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1saXN0LWFsdFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvc3Bhbj4gT3JkZW5lczwvYT48L2xpPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiIy9wcm9kdWN0LycrIGNsX2lkICsgJ1wiPjxzcGFuIGNsYXNzPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1saXN0LWFsdFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvc3Bhbj4gUHJvZHVjdG9zPC9hPjwvbGk+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjL3F1b3RlLycrIGNsX2lkICsgJ1wiPjxzcGFuIGNsYXNzPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1saXN0LWFsdFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvc3Bhbj4gQ290aXphY2lvbmVzPC9hPjwvbGk+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjL3pvbmUvJysgY2xfaWQgKyAnXCI+PHNwYW4gY2xhc3M9XCJnbHlwaGljb24gZ2x5cGhpY29uLWxpc3QtYWx0XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9zcGFuPiBab25hczwvYT48L2xpPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiIy9lbWFpbC8nKyBjbF9pZCArICdcIj48c3BhbiBjbGFzcz1cImdseXBoaWNvbiBnbHlwaGljb24tbGlzdC1hbHRcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L3NwYW4+IENvcnJlb3M8L2E+PC9saT5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC91bD5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj4nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgICAgICAvLyBiaW5kIGNvbHVtbnMgd2hlbiBncmlkIGlzIGluaXRpYWxpemVkXG4gICAgICAgICAgICAkc2NvcGUuaW5pdEdyaWQgPSBmdW5jdGlvbiAocywgZSkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgJHNjb3BlLmxhYmVscy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgY29sID0gbmV3IHdpam1vLmdyaWQuQ29sdW1uKCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbC5iaW5kaW5nID0gJHNjb3BlLmNvbHVtbnNbaV07XG4gICAgICAgICAgICAgICAgICAgIGNvbC5oZWFkZXIgPSBpMThuRmlsdGVyKFwiY2xpZW50LmxhYmVscy5cIiArICRzY29wZS5sYWJlbHNbaV0pO1xuICAgICAgICAgICAgICAgICAgICBjb2wud29yZFdyYXAgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgY29sLndpZHRoID0gMTUwO1xuICAgICAgICAgICAgICAgICAgICBzLmNvbHVtbnMucHVzaChjb2wpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICAvLyBjcmVhdGUgdGhlIHRvb2x0aXAgb2JqZWN0XG4gICAgICAgICAgICAkc2NvcGUuJHdhdGNoKCdnZ0dyaWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCRzY29wZS5nZ0dyaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIC8vIHN0b3JlIHJlZmVyZW5jZSB0byBncmlkXG4gICAgICAgICAgICAgICAgICAgIHZhciBmbGV4ID0gJHNjb3BlLmdnR3JpZDtcblxuICAgICAgICAgICAgICAgICAgICAvLyBjcmVhdGUgdG9vbHRpcFxuICAgICAgICAgICAgICAgICAgICB2YXIgdGlwID0gbmV3IHdpam1vLlRvb2x0aXAoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJuZyA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gbW9uaXRvciB0aGUgbW91c2Ugb3ZlciB0aGUgZ3JpZFxuICAgICAgICAgICAgICAgICAgICBmbGV4Lmhvc3RFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBodCA9IGZsZXguaGl0VGVzdChldnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFodC5yYW5nZS5lcXVhbHMocm5nKSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbmV3IGNlbGwgc2VsZWN0ZWQsIHNob3cgdG9vbHRpcFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChodC5jZWxsVHlwZSA9PSB3aWptby5ncmlkLkNlbGxUeXBlLkNlbGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm5nID0gaHQucmFuZ2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb2wgPSBmbGV4LmNvbHVtbnNbcm5nLmNvbF0uaGVhZGVyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2VsbEVsZW1lbnQgPSBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KGV2dC5jbGllbnRYLCBldnQuY2xpZW50WSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjZWxsQm91bmRzID0gd2lqbW8uUmVjdC5mcm9tQm91bmRpbmdSZWN0KGNlbGxFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEgPSB3aWptby5lc2NhcGVIdG1sKGZsZXguZ2V0Q2VsbERhdGEocm5nLnJvdywgcm5nLmNvbCwgdHJ1ZSkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlwQ29udGVudCA9IGNvbCArICc6IFwiPGI+JyArIGRhdGEgKyAnPC9iPlwiJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNlbGxFbGVtZW50LmNsYXNzTmFtZS5pbmRleE9mKCd3ai1jZWxsJykgPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlwLnNob3coZmxleC5ob3N0RWxlbWVudCwgdGlwQ29udGVudCwgY2VsbEJvdW5kcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXAuaGlkZSgpOyAvLyBjZWxsIG11c3QgYmUgYmVoaW5kIHNjcm9sbCBiYXIuLi5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGZsZXguaG9zdEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXAuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcm5nID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICQoJyNteU1vZGFsJykub24oJ3Nob3cuYnMubW9kYWwnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgICAgICB2YXIgYnV0dG9uID0gJChldmVudC5yZWxhdGVkVGFyZ2V0KTsgLy8gQnV0dG9uIHRoYXQgdHJpZ2dlcmVkIHRoZSBtb2RhbFxuICAgICAgICAgICAgICAgICRzY29wZS5jdXJyZW50X2lkID0gYnV0dG9uLmRhdGEoJ2NsX2lkJyk7IC8vIEV4dHJhY3QgaW5mbyBmcm9tIGRhdGEtKiBhdHRyaWJ1dGVzXG4gICAgICAgICAgICAgICAgJHNjb3BlLmZtRGF0YS5wcl9wcm9jZXNzID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICRzY29wZS5mbURhdGEucHJfdHlwZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAkc2NvcGUucmVkaXJlY3QgPSBmdW5jdGlvbiAodXJsKSB7XG4gICAgICAgICAgICAgICAgJCgnI215TW9kYWwnKS5tb2RhbCgnaGlkZScpO1xuICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKHVybCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICRzY29wZS5wcl9wcm9jZXNzb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJjbGllbnQtY3VzdG9tLmZpZWxkcy5wcl9wcm9jZXNzb3B0aW9uc1wiKTtcblxuICAgICAgICAgICAgJHNjb3BlLiR3YXRjaCgnZm1EYXRhLnByX3Byb2Nlc3MnLCBmdW5jdGlvbiAobmV3VmFsdWUsIG9sZFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmZtRGF0YS5wcl90eXBlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUucHJfcHJvY2Vzc29wdGlvbnMsIGZ1bmN0aW9uIChvYmosIGtleSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAobmV3VmFsdWUgPT0gb2JqLnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUucHJfdHlwZW9wdGlvbnMgPSBvYmoudHlwZXM7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkc2NvcGUuJG9uKCckdmlld0NvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgLy8gdGhpcyBjb2RlIGlzIGV4ZWN1dGVkIGFmdGVyIHRoZSB2aWV3IGlzIGxvYWRlZFxuICAgICAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBjbGllbnRGYWMuZGF0YSgpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZGF0YSA9IG5ldyB3aWptby5jb2xsZWN0aW9ucy5Db2xsZWN0aW9uVmlldyhwcm9taXNlLmRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfV07XG4gICAgXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRodHRwJywgJyRxJywgIGZ1bmN0aW9uICgkaHR0cCwgJHEpIHtcbiAgICAgICAgdmFyIGZhY3RvcnkgPSB7fTtcbiAgICAgICAgZmFjdG9yeS5kYXRhID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoXG4gICAgICAgICAgICAgICAgJGh0dHAucG9zdCgnL2FwaS9jbGllbnQvJywge1xuICAgICAgICAgICAgICAgICAgICAvKiBQT1NUIHZhcmlhYmxlcyBoZXJlICovXG4gICAgICAgICAgICAgICAgICAgIHByb2NjZXNfaWQ6IG5ldyBEYXRlKCkuZ2V0TWlsbGlzZWNvbmRzKClcbiAgICAgICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZmFjdG9yeTtcbiAgICB9XTtcbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKGFuZ3VsYXIpe1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICAvL2NvbW1lbnRcblxuICAgIHJldHVybiBhbmd1bGFyLm1vZHVsZSgnYXBwLmNsaWVudCcsW1xuICAgICAgICByZXF1aXJlKCcuL21vZHVsZXMvY2xpZW50LmFkZCcpLm5hbWUsXG4gICAgICAgIHJlcXVpcmUoJy4vbW9kdWxlcy9jbGllbnQudXBkYXRlJykubmFtZVxuICAgIF0pXG5cbiAgICAuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJyxcbiAgICBmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdjbGllbnQnLCB7XG4gICAgICAgICAgICB1cmw6Jy9jbGllbnQnLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmwgOiAnYXBwL2NsaWVudC9jbGllbnQudmlldy5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXIgOiAnY2xpZW50Q3RybCcsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgcmVxdWlyZXNMb2dpbjogdHJ1ZVxuICAgICAgICAgICAgfSAgICBcbiAgICAgICAgfSk7XG4gICAgfV0pXG5cbiAgICAuZmFjdG9yeSgnY2xpZW50RmFjJyxyZXF1aXJlKCcuL2NsaWVudC5mYWMnKSlcblxuICAgIC5jb250cm9sbGVyKCdjbGllbnRDdHJsJyxyZXF1aXJlKCcuL2NsaWVudC5jdHJsJykpXG4gICAgXG59KShhbmd1bGFyKTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgICAgICAgICAgICAgICAgICBcImxhYmVsc1wiOntcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItdGl0bGVcIjpcIlNlbGVjY8Otb25lIGVsIHRpcG8gZGUgcHJvZHVjdG9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItcHJvY2Vzc1wiOlwiUHJvY2Vzc29cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItdHlwZVwiOlwiVGlwb1wiLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgXCJmaWVsZHNcIiA6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByX3Byb2Nlc3NvcHRpb25zIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJPZmZzZXRcIixcInZhbHVlXCI6XCJvZmZzZXRcIix0eXBlczpbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJHZW5lcmFsXCIsXCJ2YWx1ZVwiOlwiZ2VuZXJhbFwifSwgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIlBhZ2luYWRvc1wiLFwidmFsdWVcIjpcInBhZ2luYXRlZFwifSwgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcImNvdW50ZXJmb2lsXCIsXCJ2YWx1ZVwiOlwiY291bnRlcmZvaWxcIn0sICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXX0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkZsZXhvXCIsXCJ2YWx1ZVwiOlwiZmxleG9cIix0eXBlczpbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJFdGlxdWV0YXNcIixcInZhbHVlXCI6XCJsYWJlbHNcIn0sICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJSaWJib25zXCIsXCJ2YWx1ZVwiOlwicmliYm9uc1wifSwgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcImNvdW50ZXJmb2lsXCIsXCJ2YWx1ZVwiOlwib2Zmc2V0XCJ9LCAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF19LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJQbG90ZXJcIixcInZhbHVlXCI6XCJwbG90dGVyXCIsdHlwZXM6W1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiRXRpcXVldGFzXCIsXCJ2YWx1ZVwiOlwibGFiZWxzXCJ9LCAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiU2XDsWFsaXphY2nDs25cIixcInZhbHVlXCI6XCJzaWduYWdlXCJ9LCAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiQmFubmVyc1wiLFwidmFsdWVcIjpcImJhbm5lcnNcIn0sICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJBcnRpY3Vsb3NcIixcInZhbHVlXCI6XCJBcnRpY2xlc1wifSwgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiU2VsbG9zXCIsXCJ2YWx1ZVwiOlwic2VhbHNcIix0eXBlczpbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJHb21hXCIsXCJ2YWx1ZVwiOlwicnViYmVyXCJ9LCAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiTW9sZHVyYVwiLFwidmFsdWVcIjpcIm1vbGRpbmdcIn0sICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJBdXRvZW50aW50YWJsZVwiLFwidmFsdWVcIjpcInNlbGZfdGludGFibGVcIn0sICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJDb2ppblwiLFwidmFsdWVcIjpcInBhZFwifSwgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIlRpbnRhXCIsXCJ2YWx1ZVwiOlwiaW5rXCJ9LCAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF19LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJTZXJpZ3JhZsOtYVwiLFwidmFsdWVcIjpcInNlcmlncmFwaHlcIix0eXBlczpbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJFdGlxdWV0YXNcIixcInZhbHVlXCI6XCJsYWJlbHNcIn0sICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJTZcOxYWxpemFjacOzblwiLFwidmFsdWVcIjpcInNpZ25hZ2VcIn0sICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJCYW5uZXJzXCIsXCJ2YWx1ZVwiOlwiYmFubmVyc1wifSwgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkFydGljdWxvc1wiLFwidmFsdWVcIjpcIkFydGljbGVzXCJ9LCAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF19LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJMYXNlclwiLFwidmFsdWVcIjpcImxhc2VyXCIsdHlwZXM6W1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiTGFzZXJcIixcInZhbHVlXCI6XCJsYXNlclwifSwgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF19LFxuICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiIDogXCJjbGllbnRlc1wiLFxuICAgICAgICAgICAgICAgICAgICBcImxhYmVsc1wiOntcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2wtaWRcIjpcImlkIGNsaWVudGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2wtdHlwZVwiOlwiVGlwbyBkZSBDbGllbnRlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsLWNvcnBvcmF0ZW5hbWVcIjpcInJhesOzbiBzb2NpYWxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2wtdGluXCI6XCJyZmNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2wtbmFtZVwiOlwibm9tYnJlKHMpXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsLWZhdGhlcnNsYXN0bmFtZVwiOlwiYXBlbGxpZG8gcGF0ZXJub1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbC1tb3RoZXJzbGFzdG5hbWVcIjpcImFwZWxsaWRvIG1hdGVybm9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2wtc3RyZWV0XCI6XCJjYWxsZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbC1zdHJlZXRudW1iZXJcIjpcIm51bWVybyBleHRlcmlvclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbC1zdWl0ZW51bWJlclwiOlwibnVtZXJvIGludGVyaW9yXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsLW5laWdoYm9yaG9vZFwiOlwiY29sb25pYVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbC1hZGRyZXNzcmVmZXJlbmNlXCI6XCJyZWZlcmVuY2lhXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsLWNvdW50cnlcIjpcInBhw61zXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsLXN0YXRlXCI6XCJlc3RhZG9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2wtY2l0eVwiOlwiY2l1ZGFkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsLWNvdW50eVwiOlwibXVuaWNpcGlvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsLXppcGNvZGVcIjpcImNvZGlnbyBwb3N0YWxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2wtZW1haWxcIjpcImNvcnJlbyBlbGVjdHLDs25pY29cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2wtcGhvbmVcIjpcInRlbMOpZm9ub1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbC1tb2JpbGVcIjpcIm3Ds3ZpbFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbC1jcmVkaXRsaW1pdFwiOlwibGltaXRlIGRlIGNyw6lkaXRvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsLWN1c3RvbWVyZGlzY291bnRcIjpcImRlc2N1ZW50b1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbC1zdGF0dXNcIjpcImVzdGF0dXNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2wtZGF0ZVwiOlwiZmVjaGFcIixcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgIFwiY29sdW1uc1wiOltcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xfaWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xfdHlwZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbF9jb3Jwb3JhdGVuYW1lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsX3RpblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbF9uYW1lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsX2ZhdGhlcnNsYXN0bmFtZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbF9tb3RoZXJzbGFzdG5hbWVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xfc3RyZWV0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsX3N0cmVldG51bWJlclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbF9zdWl0ZW51bWJlclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbF9uZWlnaGJvcmhvb2RcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xfYWRkcmVzc3JlZmVyZW5jZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbF9jb3VudHJ5XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsX3N0YXRlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsX2NpdHlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xfY291bnR5XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsX3ppcGNvZGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xfZW1haWxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xfcGhvbmVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xfbW9iaWxlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsX2NyZWRpdGxpbWl0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsX2N1c3RvbWVyZGlzY291bnRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xfc3RhdHVzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsX2RhdGVcIixcbiAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICBcImZpZWxkc1wiIDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xfc3RhdHVzb3B0aW9ucyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiQWN0aXZvXCIsXCJ2YWx1ZVwiOlwiQVwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiSW5hY3Rpdm9cIixcInZhbHVlXCI6XCJJXCJ9XG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2xfdHlwZW9wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkZpc2ljYVwiLFwidmFsdWVcIjpcIm5hdHVyYWxcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIk1vcmFsXCIsXCJ2YWx1ZVwiOlwibGVnYWxcIn1cbiAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckc2NvcGUnLCAnY2xpZW50QWRkRmFjJywgJyRsb2NhdGlvbicsICdpMThuRmlsdGVyJywgJyRpbnRlcnZhbCcsXG4gICAgICAgIGZ1bmN0aW9uICgkc2NvcGUsIGNsaWVudEFkZEZhYywgJGxvY2F0aW9uLCBpMThuRmlsdGVyLCAkaW50ZXJ2YWwpIHtcbiAgICAgICAgICAgICRzY29wZS5mbURhdGEgPSB7fTtcbiAgICAgICAgICAgICRzY29wZS5mbURhdGEgPSB7IFwiY2xfdHlwZVwiOiBcIm5hdHVyYWxcIiwgXCJjbF90aW5cIjogXCJTQUJHLTgzMDEwNi1BQ0FcIiwgXCJjbF9uYW1lXCI6IFwiR2FzcGFyIEFsZWphbmRyb1wiLCBcImNsX2ZhdGhlcnNsYXN0bmFtZVwiOiBcIlNhbmNoZXpcIiwgXCJjbF9tb3RoZXJzbGFzdG5hbWVcIjogXCJCZXRhbmNvdXJ0XCIsIFwiY2xfY291bnRyeVwiOiAzOTk2MDYzLCBcImNsX3N0YXRlXCI6IDQwMTQzMzYsIFwiY2xfY2l0eVwiOiA4NTgxODE2LCBcImNsX2NvdW50eVwiOiA4NTgxODE2LCBcImNsX3N0cmVldFwiOiBcIkFWIEdVQURBTFVQRVwiLCBcImNsX3N0cmVldG51bWJlclwiOiBcIjY4NzdcIiwgXCJjbF9zdWl0ZW51bWJlclwiOiBcIjgxXCIsIFwiY2xfbmVpZ2hib3Job29kXCI6IFwiUExBWkEgR1VBREFMVVBFXCIsIFwiY2xfemlwY29kZVwiOiBcIjQ1MDM2XCIsIFwiY2xfYWRkcmVzc3JlZmVyZW5jZVwiOiBcIkZSSURBIEtIQUxPIFkgQVYgR1VBREFMVVBFXCIsIFwiY2xfZW1haWxcIjogXCJhbGVqYW5kcm9sc2NhQGdtYWlsLmNvbVwiLCBcImNsX3Bob25lXCI6IFwiMzMzNzk3OTEzNVwiLCBcImNsX21vYmlsZVwiOiBcIis1MjEzMzEwMTEyNTc2XCIsIFwiY2xfY3JlZGl0bGltaXRcIjogXCIxMDAwMC4wMFwiLCBcImNsX2N1c3RvbWVyZGlzY291bnRcIjogXCIwLjEwXCIsIFwiY2xfc3RhdHVzXCI6IFwiQVwiIH1cblxuICAgICAgICAgICAgJHNjb3BlLm9uU3VibWl0ID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgY2xpZW50QWRkRmFjLmFkZCgkc2NvcGUuZm1EYXRhKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9taXNlLmRhdGEucm93Q291bnQgPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvY2xpZW50Jyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICRzY29wZS5nZXRTdGF0ZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmNsX3N0YXRlb3B0aW9ucyA9IFtdO1xuICAgICAgICAgICAgICAgICRzY29wZS5jbF9jaXR5b3B0aW9ucyA9IFtdO1xuICAgICAgICAgICAgICAgICRzY29wZS5jbF9jb3VudHlvcHRpb25zID0gW107XG4gICAgICAgICAgICAgICAgJGludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgY2xpZW50QWRkRmFjLmdldFN0YXRlcygkc2NvcGUuZm1EYXRhLmNsX2NvdW50cnkpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhLmdlb25hbWVzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5jbF9zdGF0ZW9wdGlvbnMgPSBwcm9taXNlLmRhdGEuZ2VvbmFtZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vJHNjb3BlLnVwZGF0ZUZhaWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LCAwLCAxKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJHNjb3BlLmdldENpdHlDb3VudHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmNsX2NpdHlvcHRpb25zID0gW107XG4gICAgICAgICAgICAgICAgJHNjb3BlLmNsX2NvdW50eW9wdGlvbnMgPSBbXTtcbiAgICAgICAgICAgICAgICAkaW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBjbGllbnRBZGRGYWMuZ2V0U3RhdGVzKCRzY29wZS5mbURhdGEuY2xfc3RhdGUpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhLmdlb25hbWVzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5jbF9jaXR5b3B0aW9ucyA9IHByb21pc2UuZGF0YS5nZW9uYW1lcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuY2xfY291bnR5b3B0aW9ucyA9IHByb21pc2UuZGF0YS5nZW9uYW1lcztcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8kc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sIDAsIDEpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgJHNjb3BlLmNsX3N0YXR1c29wdGlvbnMgPSBpMThuRmlsdGVyKFwiY2xpZW50LmZpZWxkcy5jbF9zdGF0dXNvcHRpb25zXCIpO1xuICAgICAgICAgICAgJHNjb3BlLmNsX3R5cGVvcHRpb25zID0gaTE4bkZpbHRlcihcImNsaWVudC5maWVsZHMuY2xfdHlwZW9wdGlvbnNcIik7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICRzY29wZS4kb24oJyR2aWV3Q29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAvLyB0aGlzIGNvZGUgaXMgZXhlY3V0ZWQgYWZ0ZXIgdGhlIHZpZXcgaXMgbG9hZGVkXG4gICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBjbGllbnRBZGRGYWMuZ2V0Q291bnRyaWVzKCkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YS5nZW9uYW1lcykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5jbF9jb3VudHJ5b3B0aW9ucyA9IHByb21pc2UuZGF0YS5nZW9uYW1lcztcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vJHNjb3BlLnVwZGF0ZUZhaWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XTtcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckaHR0cCcsICckcScsICAnJHN0YXRlUGFyYW1zJywgZnVuY3Rpb24gKCRodHRwLCAkcSwgJHN0YXRlUGFyYW1zKSB7XG4gICAgICAgIHZhciBmYWN0b3J5ID0ge307XG4gICAgICAgIGZhY3RvcnkuYWRkID0gZnVuY3Rpb24gKGNsX2pzb25iKSB7XG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9ICRodHRwLnBvc3QoJy9hcGkvY2xpZW50L2FkZCcsIHtcbiAgICAgICAgICAgICAgICAvKiBQT1NUIHZhcmlhYmxlcyBoZXJlICovXG4gICAgICAgICAgICAgICAgY2xfanNvbmI6IGNsX2pzb25iXG4gICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICBmYWN0b3J5LmdldENvdW50cmllcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gJGh0dHAuanNvbnAoJ2h0dHA6Ly9hcGkuZ2VvbmFtZXMub3JnL2NvdW50cnlJbmZvSlNPTj91c2VybmFtZT1hbGVqYW5kcm9sc2NhJmNhbGxiYWNrPUpTT05fQ0FMTEJBQ0snKVxuICAgICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeS5nZXRTdGF0ZXMgPSBmdW5jdGlvbiAoY2xfY291bnRyeSkge1xuICAgICAgICAgICAgdmFyIHByb21pc2UgPSAkaHR0cC5qc29ucCgnaHR0cDovL2FwaS5nZW9uYW1lcy5vcmcvY2hpbGRyZW5KU09OP2dlb25hbWVJZD0nICsgY2xfY291bnRyeSArICcmdXNlcm5hbWU9YWxlamFuZHJvbHNjYSZjYWxsYmFjaz1KU09OX0NBTExCQUNLJylcbiAgICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkuZ2V0Q2l0eUNvdW50eSA9IGZ1bmN0aW9uIChjbF9zdGF0ZSkge1xuICAgICAgICAgICAgdmFyIHByb21pc2UgPSAkaHR0cC5qc29ucCgnaHR0cDovL2FwaS5nZW9uYW1lcy5vcmcvY2hpbGRyZW5KU09OP2dlb25hbWVJZD0nICsgY2xfc3RhdGUgKyAnJnVzZXJuYW1lPWFsZWphbmRyb2xzY2EmY2FsbGJhY2s9SlNPTl9DQUxMQkFDSycpXG4gICAgICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZmFjdG9yeTtcbiAgICB9XTtcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oYW5ndWxhcil7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIFxuICAgIHJldHVybiBhbmd1bGFyLm1vZHVsZSgnYXBwLmNsaWVudC5hZGQnLFtdKVxuXG4gICAgLmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsXG4gICAgZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnY2xpZW50QWRkJywge1xuICAgICAgICAgICAgdXJsOicvY2xpZW50L2FkZCcsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybCA6ICdhcHAvY2xpZW50L21vZHVsZXMvY2xpZW50LmFkZC9jbGllbnQuYWRkLnZpZXcuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyIDogJ2NsaWVudEFkZEN0cmwnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHJlcXVpcmVzTG9naW46IHRydWVcbiAgICAgICAgICAgIH0gICAgXG4gICAgICAgIH0pO1xuICAgIH1dKVxuXG4gICAgLmZhY3RvcnkoJ2NsaWVudEFkZEZhYycscmVxdWlyZSgnLi9jbGllbnQuYWRkLmZhYycpKVxuXG4gICAgLmNvbnRyb2xsZXIoJ2NsaWVudEFkZEN0cmwnLHJlcXVpcmUoJy4vY2xpZW50LmFkZC5jdHJsJykpXG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCIgOiBcImFncmVnYXIgY2xpZW50ZVwiLFxuICAgICAgICAgICAgICAgIH0iLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRzY29wZScsICdjbGllbnRVcGRhdGVGYWMnLCAnJGxvY2F0aW9uJywgJ2kxOG5GaWx0ZXInLCAnJGludGVydmFsJyxcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgY2xpZW50VXBkYXRlRmFjLCAkbG9jYXRpb24sIGkxOG5GaWx0ZXIsICRpbnRlcnZhbCkge1xuXG4gICAgICAgICAgICAkc2NvcGUub25TdWJtaXQgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICBjbGllbnRVcGRhdGVGYWMudXBkYXRlKCRzY29wZS5mbURhdGEpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb21pc2UuZGF0YS5yb3dDb3VudCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9jbGllbnQnKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS51cGRhdGVGYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgJHNjb3BlLmdldFN0YXRlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUuY2xfc3RhdGVvcHRpb25zID0gW107XG4gICAgICAgICAgICAgICAgJHNjb3BlLmNsX2NpdHlvcHRpb25zID0gW107XG4gICAgICAgICAgICAgICAgJHNjb3BlLmNsX2NvdW50eW9wdGlvbnMgPSBbXTtcbiAgICAgICAgICAgICAgICAkaW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBjbGllbnRVcGRhdGVGYWMuZ2V0U3RhdGVzKCRzY29wZS5mbURhdGEuY2xfY291bnRyeSkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEuZ2VvbmFtZXMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNsX3N0YXRlb3B0aW9ucyA9IHByb21pc2UuZGF0YS5nZW9uYW1lcztcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8kc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sIDAsIDEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkc2NvcGUuZ2V0Q2l0eUNvdW50eSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUuY2xfY2l0eW9wdGlvbnMgPSBbXTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuY2xfY291bnR5b3B0aW9ucyA9IFtdO1xuICAgICAgICAgICAgICAgICRpbnRlcnZhbChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGNsaWVudFVwZGF0ZUZhYy5nZXRTdGF0ZXMoJHNjb3BlLmZtRGF0YS5jbF9zdGF0ZSkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEuZ2VvbmFtZXMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNsX2NpdHlvcHRpb25zID0gcHJvbWlzZS5kYXRhLmdlb25hbWVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5jbF9jb3VudHlvcHRpb25zID0gcHJvbWlzZS5kYXRhLmdlb25hbWVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyRzY29wZS51cGRhdGVGYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSwgMCwgMSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICRzY29wZS5jbF9zdGF0dXNvcHRpb25zID0gaTE4bkZpbHRlcihcImNsaWVudC5maWVsZHMuY2xfc3RhdHVzb3B0aW9uc1wiKTtcbiAgICAgICAgICAgICRzY29wZS5jbF90eXBlb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJjbGllbnQuZmllbGRzLmNsX3R5cGVvcHRpb25zXCIpO1xuXG4gICAgICAgICAgICAkc2NvcGUuJG9uKCckdmlld0NvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgLy8gdGhpcyBjb2RlIGlzIGV4ZWN1dGVkIGFmdGVyIHRoZSB2aWV3IGlzIGxvYWRlZFxuICAgICAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBjbGllbnRVcGRhdGVGYWMuZGF0YSgpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEpICYmIHByb21pc2UuZGF0YS5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5mbURhdGEgPSBwcm9taXNlLmRhdGFbMF0uY2xfanNvbmI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgY2xpZW50VXBkYXRlRmFjLmdldENvdW50cmllcygpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhLmdlb25hbWVzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5jbF9jb3VudHJ5b3B0aW9ucyA9IHByb21pc2UuZGF0YS5nZW9uYW1lcztcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8kc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xpZW50VXBkYXRlRmFjLmdldFN0YXRlcygkc2NvcGUuZm1EYXRhLmNsX2NvdW50cnkpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YS5nZW9uYW1lcykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNsX3N0YXRlb3B0aW9ucyA9IHByb21pc2UuZGF0YS5nZW9uYW1lcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyRzY29wZS51cGRhdGVGYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsaWVudFVwZGF0ZUZhYy5nZXRDaXR5Q291bnR5KCRzY29wZS5mbURhdGEuY2xfc3RhdGUpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YS5nZW9uYW1lcykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNsX2NpdHlvcHRpb25zID0gcHJvbWlzZS5kYXRhLmdlb25hbWVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuY2xfY291bnR5b3B0aW9ucyA9IHByb21pc2UuZGF0YS5nZW9uYW1lcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyRzY29wZS51cGRhdGVGYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1dO1xuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRodHRwJywgJyRxJywgICckc3RhdGVQYXJhbXMnLCBmdW5jdGlvbiAoJGh0dHAsICRxLCAkc3RhdGVQYXJhbXMpIHtcbiAgICAgICAgdmFyIGZhY3RvcnkgPSB7fTtcbiAgICAgICAgZmFjdG9yeS5kYXRhID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoXG4gICAgICAgICAgICAgICAgJGh0dHAucG9zdCgnL2FwaS9jbGllbnQvY2xfaWQnLCB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICAgICAgY2xfaWQ6ICRzdGF0ZVBhcmFtcy5jbF9pZFxuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICBmYWN0b3J5LnVwZGF0ZSA9IGZ1bmN0aW9uIChjbF9qc29uYikge1xuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoXG4gICAgICAgICAgICAgICAgJGh0dHAucG9zdCgnL2FwaS9jbGllbnQvdXBkYXRlJywge1xuICAgICAgICAgICAgICAgICAgICAvKiBQT1NUIHZhcmlhYmxlcyBoZXJlICovXG4gICAgICAgICAgICAgICAgICAgIGNsX2lkOiAkc3RhdGVQYXJhbXMuY2xfaWQsXG4gICAgICAgICAgICAgICAgICAgIGNsX2pzb25iOiBjbF9qc29uYlxuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICBmYWN0b3J5LmdldENvdW50cmllcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gJGh0dHAuanNvbnAoJ2h0dHA6Ly9hcGkuZ2VvbmFtZXMub3JnL2NvdW50cnlJbmZvSlNPTj91c2VybmFtZT1hbGVqYW5kcm9sc2NhJmNhbGxiYWNrPUpTT05fQ0FMTEJBQ0snKVxuICAgICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeS5nZXRTdGF0ZXMgPSBmdW5jdGlvbiAoY2xfY291bnRyeSkge1xuICAgICAgICAgICAgdmFyIHByb21pc2UgPSAkaHR0cC5qc29ucCgnaHR0cDovL2FwaS5nZW9uYW1lcy5vcmcvY2hpbGRyZW5KU09OP2dlb25hbWVJZD0nICsgY2xfY291bnRyeSArICcmdXNlcm5hbWU9YWxlamFuZHJvbHNjYSZjYWxsYmFjaz1KU09OX0NBTExCQUNLJylcbiAgICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkuZ2V0Q2l0eUNvdW50eSA9IGZ1bmN0aW9uIChjbF9zdGF0ZSkge1xuICAgICAgICAgICAgdmFyIHByb21pc2UgPSAkaHR0cC5qc29ucCgnaHR0cDovL2FwaS5nZW9uYW1lcy5vcmcvY2hpbGRyZW5KU09OP2dlb25hbWVJZD0nICsgY2xfc3RhdGUgKyAnJnVzZXJuYW1lPWFsZWphbmRyb2xzY2EmY2FsbGJhY2s9SlNPTl9DQUxMQkFDSycpXG4gICAgICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZmFjdG9yeTtcbiAgICB9XTtcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oYW5ndWxhcil7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIFxuICAgIHJldHVybiBhbmd1bGFyLm1vZHVsZSgnYXBwLmNsaWVudC51cGRhdGUnLFtdKVxuXG4gICAgLmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsXG4gICAgZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnY2xpZW50VXBkYXRlJywge1xuICAgICAgICAgICAgdXJsOicvY2xpZW50L3VwZGF0ZS86Y2xfaWQnLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmwgOiAnYXBwL2NsaWVudC9tb2R1bGVzL2NsaWVudC51cGRhdGUvY2xpZW50LnVwZGF0ZS52aWV3Lmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlciA6ICdjbGllbnRVcGRhdGVDdHJsJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICByZXF1aXJlc0xvZ2luOiB0cnVlXG4gICAgICAgICAgICB9ICAgIFxuICAgICAgICB9KTtcbiAgICB9XSlcblxuICAgIC5mYWN0b3J5KCdjbGllbnRVcGRhdGVGYWMnLHJlcXVpcmUoJy4vY2xpZW50LnVwZGF0ZS5mYWMnKSlcblxuICAgIC5jb250cm9sbGVyKCdjbGllbnRVcGRhdGVDdHJsJyxyZXF1aXJlKCcuL2NsaWVudC51cGRhdGUuY3RybCcpKVxuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiIDogXCJhY3R1YWxpemFyIGNsaWVudGVcIixcbiAgICAgICAgICAgICAgICB9IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckc2NvcGUnLCAnaG9tZUZhYycsICdhdXRoU2VydmljZScsXG4gICAgICAgIGZ1bmN0aW9uICgkc2NvcGUsIGhvbWVGYWMsIGF1dGhTZXJ2aWNlKSB7XG4gICAgICAgICAgICAkc2NvcGUuYXV0aFNlcnZpY2UgPSBhdXRoU2VydmljZTtcbiAgICAgICAgfV07XG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgcmV0dXJuIFsnJGh0dHAnLCAnJHEnLCAgZnVuY3Rpb24gKCRodHRwLCAkcSkge1xuICAgICAgICB2YXIgZmFjdG9yeSA9IHt9O1xuICAgICAgICBmYWN0b3J5LmdldExvZ2luID0gZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKFxuICAgICAgICAgICAgICAgICRodHRwLnBvc3QoJ21vZHVsZXMvaG9tZS9ob21lTW9kZWwucGhwJywge1xuICAgICAgICAgICAgICAgICAgICAvKiBQT1NUIHZhcmlhYmxlcyBoZXJlICovXG4gICAgICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBmYWN0b3J5O1xuICAgIH1dO1xuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbihhbmd1bGFyKXtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgXG4gICAgcmV0dXJuIGFuZ3VsYXIubW9kdWxlKCdhcHAuaG9tZScsW10pXG5cbiAgICAuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJyxcbiAgICBmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdob21lJywge1xuICAgICAgICAgICAgdXJsOicvaG9tZScsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybCA6ICdhcHAvaG9tZS9ob21lLnZpZXcuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyIDogJ2hvbWVDdHJsJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICByZXF1aXJlc0xvZ2luOiB0cnVlXG4gICAgICAgICAgICB9ICAgIFxuICAgICAgICB9KTtcbiAgICB9XSlcblxuICAgIC5mYWN0b3J5KCdob21lRmFjJyxyZXF1aXJlKCcuL2hvbWUuZmFjJykpXG5cbiAgICAuY29udHJvbGxlcignaG9tZUN0cmwnLHJlcXVpcmUoJy4vaG9tZS5jdHJsJykpXG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCIgOiBcImluaWNpb1wiLFxuICAgICAgICAgICAgICAgICAgICBcIndlbGNvbWVcIiA6IFwiYmllbnZlbmlkbyBAQCFcIlxuICAgICAgICAgICAgICAgIH0iLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbihhbmd1bGFyKXtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgXG4gICAgcmV0dXJuIGFuZ3VsYXIubW9kdWxlKCdhcHAuaW5rJyxbXG4gICAgICAgIHJlcXVpcmUoJy4vbW9kdWxlcy9pbmsuYWRkJykubmFtZSxcbiAgICAgICAgcmVxdWlyZSgnLi9tb2R1bGVzL2luay51cGRhdGUnKS5uYW1lXG4gICAgXSlcblxuICAgIC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLFxuICAgIGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcbiAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2luaycsIHtcbiAgICAgICAgICAgIHVybDonL2luaycsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybCA6ICdhcHAvaW5rL2luay52aWV3Lmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlciA6ICdpbmtDdHJsJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICByZXF1aXJlc0xvZ2luOiB0cnVlXG4gICAgICAgICAgICB9ICAgIFxuICAgICAgICB9KTtcbiAgICB9XSlcblxuICAgIC5mYWN0b3J5KCdpbmtGYWMnLHJlcXVpcmUoJy4vaW5rLmZhYycpKVxuXG4gICAgLmNvbnRyb2xsZXIoJ2lua0N0cmwnLHJlcXVpcmUoJy4vaW5rLmN0cmwnKSlcbiAgICBcbn0pKGFuZ3VsYXIpO1xuIiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckc2NvcGUnLCAnaW5rRmFjJywgJ2kxOG5GaWx0ZXInLFxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCBpbmtGYWMsIGkxOG5GaWx0ZXIpIHtcblxuICAgICAgICAgICAgJHNjb3BlLmxhYmVscyA9IE9iamVjdC5rZXlzKGkxOG5GaWx0ZXIoXCJpbmsubGFiZWxzXCIpKTtcbiAgICAgICAgICAgICRzY29wZS5jb2x1bW5zID0gaTE4bkZpbHRlcihcImluay5jb2x1bW5zXCIpO1xuICAgICAgICBcbiAgICAgICAgICAgIC8vIGZvcm1hdEl0ZW0gZXZlbnQgaGFuZGxlclxuICAgICAgICAgICAgdmFyIGluX2lkO1xuICAgICAgICAgICAgJHNjb3BlLmZvcm1hdEl0ZW0gPSBmdW5jdGlvbiAocywgZSwgY2VsbCkge1xuXG4gICAgICAgICAgICAgICAgaWYgKGUucGFuZWwuY2VsbFR5cGUgPT0gd2lqbW8uZ3JpZC5DZWxsVHlwZS5Sb3dIZWFkZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgZS5jZWxsLnRleHRDb250ZW50ID0gZS5yb3cgKyAxO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHMucm93cy5kZWZhdWx0U2l6ZSA9IDMwO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gYWRkIEJvb3RzdHJhcCBodG1sXG4gICAgICAgICAgICAgICAgaWYgKChlLnBhbmVsLmNlbGxUeXBlID09IHdpam1vLmdyaWQuQ2VsbFR5cGUuQ2VsbCkgJiYgKGUuY29sID09IDApKSB7XG4gICAgICAgICAgICAgICAgICAgIGluX2lkID0gZS5wYW5lbC5nZXRDZWxsRGF0YShlLnJvdywgMSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBlLmNlbGwuc3R5bGUub3ZlcmZsb3cgPSAndmlzaWJsZSc7XG4gICAgICAgICAgICAgICAgICAgIGUuY2VsbC5pbm5lckhUTUwgPSAnPGRpdiBjbGFzcz1cImJ0bi1ncm91cCBidG4tZ3JvdXAtanVzdGlmaWVkXCIgcm9sZT1cImdyb3VwXCIgYXJpYS1sYWJlbD1cIi4uLlwiPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJ0bi1ncm91cFwiIHJvbGU9XCJncm91cFwiPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIjL2luay91cGRhdGUvJysgaW5faWQgKyAnXCIgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHQgYnRuLXhzXCIgbmctY2xpY2s9XCJlZGl0KCRpdGVtLmluX2lkKVwiPkVkaXRhcjwvYT5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj4nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgICAgICAvLyBiaW5kIGNvbHVtbnMgd2hlbiBncmlkIGlzIGluaXRpYWxpemVkXG4gICAgICAgICAgICAkc2NvcGUuaW5pdEdyaWQgPSBmdW5jdGlvbiAocywgZSkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgJHNjb3BlLmxhYmVscy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgY29sID0gbmV3IHdpam1vLmdyaWQuQ29sdW1uKCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbC5iaW5kaW5nID0gJHNjb3BlLmNvbHVtbnNbaV07XG4gICAgICAgICAgICAgICAgICAgIGNvbC5oZWFkZXIgPSBpMThuRmlsdGVyKFwiaW5rLmxhYmVscy5cIiArICRzY29wZS5sYWJlbHNbaV0pO1xuICAgICAgICAgICAgICAgICAgICBjb2wud29yZFdyYXAgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgY29sLndpZHRoID0gMTUwO1xuICAgICAgICAgICAgICAgICAgICBzLmNvbHVtbnMucHVzaChjb2wpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICAvLyBjcmVhdGUgdGhlIHRvb2x0aXAgb2JqZWN0XG4gICAgICAgICAgICAkc2NvcGUuJHdhdGNoKCdnZ0dyaWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCRzY29wZS5nZ0dyaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIC8vIHN0b3JlIHJlZmVyZW5jZSB0byBncmlkXG4gICAgICAgICAgICAgICAgICAgIHZhciBmbGV4ID0gJHNjb3BlLmdnR3JpZDtcblxuICAgICAgICAgICAgICAgICAgICAvLyBjcmVhdGUgdG9vbHRpcFxuICAgICAgICAgICAgICAgICAgICB2YXIgdGlwID0gbmV3IHdpam1vLlRvb2x0aXAoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJuZyA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gbW9uaXRvciB0aGUgbW91c2Ugb3ZlciB0aGUgZ3JpZFxuICAgICAgICAgICAgICAgICAgICBmbGV4Lmhvc3RFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBodCA9IGZsZXguaGl0VGVzdChldnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFodC5yYW5nZS5lcXVhbHMocm5nKSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbmV3IGNlbGwgc2VsZWN0ZWQsIHNob3cgdG9vbHRpcFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChodC5jZWxsVHlwZSA9PSB3aWptby5ncmlkLkNlbGxUeXBlLkNlbGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm5nID0gaHQucmFuZ2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb2wgPSBmbGV4LmNvbHVtbnNbcm5nLmNvbF0uaGVhZGVyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2VsbEVsZW1lbnQgPSBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KGV2dC5jbGllbnRYLCBldnQuY2xpZW50WSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjZWxsQm91bmRzID0gd2lqbW8uUmVjdC5mcm9tQm91bmRpbmdSZWN0KGNlbGxFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEgPSB3aWptby5lc2NhcGVIdG1sKGZsZXguZ2V0Q2VsbERhdGEocm5nLnJvdywgcm5nLmNvbCwgdHJ1ZSkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlwQ29udGVudCA9IGNvbCArICc6IFwiPGI+JyArIGRhdGEgKyAnPC9iPlwiJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNlbGxFbGVtZW50LmNsYXNzTmFtZS5pbmRleE9mKCd3ai1jZWxsJykgPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlwLnNob3coZmxleC5ob3N0RWxlbWVudCwgdGlwQ29udGVudCwgY2VsbEJvdW5kcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXAuaGlkZSgpOyAvLyBjZWxsIG11c3QgYmUgYmVoaW5kIHNjcm9sbCBiYXIuLi5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGZsZXguaG9zdEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXAuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcm5nID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICRzY29wZS4kb24oJyR2aWV3Q29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAvLyB0aGlzIGNvZGUgaXMgZXhlY3V0ZWQgYWZ0ZXIgdGhlIHZpZXcgaXMgbG9hZGVkXG4gICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGlua0ZhYy5kYXRhKCkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5kYXRhID0gbmV3IHdpam1vLmNvbGxlY3Rpb25zLkNvbGxlY3Rpb25WaWV3KHByb21pc2UuZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XTtcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckaHR0cCcsICckcScsICBmdW5jdGlvbiAoJGh0dHAsICRxKSB7XG4gICAgICAgIHZhciBmYWN0b3J5ID0ge307XG4gICAgICAgIGZhY3RvcnkuZGF0YSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKFxuICAgICAgICAgICAgICAgICRodHRwLnBvc3QoJ21vZHVsZXMvaW5rL2luay5tZGwuZ2V0aW5rcy5waHAnLCB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICAgICAgcHJvY2Nlc19pZDogbmV3IERhdGUoKS5nZXRNaWxsaXNlY29uZHMoKVxuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZmFjdG9yeTtcbiAgICB9XTtcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIiA6IFwiVGludGFzXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibGFiZWxzXCI6e1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJpbi1pZFwiOiBcIklEIHRpbnRhXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN1LWlkXCI6IFwiSUQgcHJvdmVlZG9yXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImluLWNvZGVcIjogXCJDb2RpZ29cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaW4tdHlwZVwiOiBcIlRpcG9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaW4tZGVzY3JpcHRpb25cIjogXCJEZXNjcmlwY2lvblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpbi1wcmljZVwiOiBcIlByZWNpb1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpbi1zdGF0dXNcIjogXCJFc3RhdHVzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImluLWRhdGVcIjogXCJGZWNoYVwiXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIFwiY29sdW1uc1wiOltcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaW5faWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3VfaWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaW5fY29kZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpbl90eXBlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImluX2Rlc2NyaXB0aW9uXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImluX3ByaWNlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImluX3N0YXR1c1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpbl9kYXRlXCJcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgIFwiZmllbGRzXCIgOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbl90eXBlb3B0aW9ucyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiT2Zmc2V0XCIsXCJ2YWx1ZVwiOlwib2Zmc2V0XCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJGbGV4b1wiLFwidmFsdWVcIjpcImZsZXhvXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJJbmtqZXQgc29sdmVudGVcIixcInZhbHVlXCI6XCJpbmtqZXRfc29sdmVudFwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiSW5ramV0IFVWXCIsXCJ2YWx1ZVwiOlwiaW5ramV0X3V2XCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJTZXJpZ3JhZsOtYVwiLFwidmFsdWVcIjpcInNlcmlncmFwaHlcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIlZpbmlsXCIsXCJ2YWx1ZVwiOlwidmlueWxcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIlRvbmVyXCIsXCJ2YWx1ZVwiOlwidG9uZXJcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIlNlbGxvXCIsXCJ2YWx1ZVwiOlwic2VhbFwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiT3RoZXJcIixcInZhbHVlXCI6XCJvdHJvc1wifSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBpbl9zdGF0dXNvcHRpb25zIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJBY3Rpdm9cIixcInZhbHVlXCI6XCJBXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJJbmFjdGl2b1wiLFwidmFsdWVcIjpcIklcIn1cbiAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oYW5ndWxhcil7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIFxuICAgIHJldHVybiBhbmd1bGFyLm1vZHVsZSgnYXBwLmluay5hZGQnLFtdKVxuXG4gICAgLmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsXG4gICAgZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnaW5rQWRkJywge1xuICAgICAgICAgICAgdXJsOicvaW5rL2FkZCcsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybCA6ICdhcHAvaW5rL21vZHVsZXMvaW5rLmFkZC9pbmsuYWRkLnZpZXcuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyIDogJ2lua0FkZEN0cmwnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHJlcXVpcmVzTG9naW46IHRydWVcbiAgICAgICAgICAgIH0gICAgXG4gICAgICAgIH0pO1xuICAgIH1dKVxuXG4gICAgLmZhY3RvcnkoJ2lua0FkZEZhYycscmVxdWlyZSgnLi9pbmsuYWRkLmZhYycpKVxuXG4gICAgLmNvbnRyb2xsZXIoJ2lua0FkZEN0cmwnLHJlcXVpcmUoJy4vaW5rLmFkZC5jdHJsJykpXG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgcmV0dXJuIFsnJHNjb3BlJywgJ2lua0FkZEZhYycsICckbG9jYXRpb24nLCAnaTE4bkZpbHRlcicsXG4gICAgICAgIGZ1bmN0aW9uICgkc2NvcGUsIGlua0FkZEZhYywgJGxvY2F0aW9uLCBpMThuRmlsdGVyKSB7XG4gICAgICAgICAgICAkc2NvcGUuZm1EYXRhID0ge307XG5cbiAgICAgICAgICAgICRzY29wZS5vblN1Ym1pdCA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgIGlua0FkZEZhYy5hZGQoJHNjb3BlLmZtRGF0YSkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocHJvbWlzZS5kYXRhID09IFwiMVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2luaycpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnVwZGF0ZUZhaWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAkc2NvcGUuaW5fc3RhdHVzb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJpbmsuZmllbGRzLmluX3N0YXR1c29wdGlvbnNcIik7XG4gICAgICAgICAgICAkc2NvcGUuaW5fdHlwZW9wdGlvbnMgPSBpMThuRmlsdGVyKFwiaW5rLmZpZWxkcy5pbl90eXBlb3B0aW9uc1wiKTtcblxuICAgICAgICAgICAgJHNjb3BlLiRvbignJHZpZXdDb250ZW50TG9hZGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIC8vIHRoaXMgY29kZSBpcyBleGVjdXRlZCBhZnRlciB0aGUgdmlldyBpcyBsb2FkZWRcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlua0FkZEZhYy5nZXRTdXBwbGllcnMoKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnN1X2lkb3B0aW9ucyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHByb21pc2UuZGF0YSwgZnVuY3Rpb24gKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnB1c2goeyBcImxhYmVsXCI6IHZhbHVlLnN1X2NvcnBvcmF0ZW5hbWUsIFwidmFsdWVcIjogdmFsdWUuc3VfaWQgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAkc2NvcGUuc3VfaWRvcHRpb25zKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vJHNjb3BlLnVwZGF0ZUZhaWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XTtcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckaHR0cCcsICckcScsICAnJHN0YXRlUGFyYW1zJywgZnVuY3Rpb24gKCRodHRwLCAkcSwgJHN0YXRlUGFyYW1zKSB7XG4gICAgICAgIHZhciBmYWN0b3J5ID0ge307XG4gICAgICAgIGZhY3RvcnkuYWRkID0gZnVuY3Rpb24gKGluX2pzb25iKSB7XG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9ICRodHRwLnBvc3QoJ21vZHVsZXMvaW5rL21vZHVsZXMvaW5rLmFkZC9pbmsuYWRkLm1kbC5hZGQucGhwJywge1xuICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICBpbl9qc29uYjogaW5fanNvbmJcbiAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkuZ2V0U3VwcGxpZXJzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHByb21pc2UgPSAkaHR0cC5nZXQoJ21vZHVsZXMvaW5rL21vZHVsZXMvaW5rLmFkZC9pbmsuYWRkLm1kbC5nZXRTdXBwbGllcnMucGhwJylcbiAgICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBmYWN0b3J5O1xuICAgIH1dO1xuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiIDogXCJhZ3JlZ2FyIHRpbnRhXCIsXG4gICAgICAgICAgICAgICAgfSIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKGFuZ3VsYXIpe1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBcbiAgICByZXR1cm4gYW5ndWxhci5tb2R1bGUoJ2FwcC5pbmsudXBkYXRlJyxbXSlcblxuICAgIC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLFxuICAgIGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcbiAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2lua1VwZGF0ZScsIHtcbiAgICAgICAgICAgIHVybDonL2luay91cGRhdGUvOmluX2lkJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsIDogJ2FwcC9pbmsvbW9kdWxlcy9pbmsudXBkYXRlL2luay51cGRhdGUudmlldy5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXIgOiAnaW5rVXBkYXRlQ3RybCcsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgcmVxdWlyZXNMb2dpbjogdHJ1ZVxuICAgICAgICAgICAgfSAgICBcbiAgICAgICAgfSk7XG4gICAgfV0pXG5cbiAgICAuZmFjdG9yeSgnaW5rVXBkYXRlRmFjJyxyZXF1aXJlKCcuL2luay51cGRhdGUuZmFjJykpXG5cbiAgICAuY29udHJvbGxlcignaW5rVXBkYXRlQ3RybCcscmVxdWlyZSgnLi9pbmsudXBkYXRlLmN0cmwnKSlcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckc2NvcGUnLCAnaW5rVXBkYXRlRmFjJywgJyRsb2NhdGlvbicsICdpMThuRmlsdGVyJyxcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgaW5rVXBkYXRlRmFjLCAkbG9jYXRpb24sIGkxOG5GaWx0ZXIpIHtcblxuICAgICAgICAgICAgJHNjb3BlLm9uU3VibWl0ID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgaW5rVXBkYXRlRmFjLnVwZGF0ZSgkc2NvcGUuZm1EYXRhKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9taXNlLmRhdGEgPT0gXCIxXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvaW5rJyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICRzY29wZS5pbl9zdGF0dXNvcHRpb25zID0gaTE4bkZpbHRlcihcImluay5maWVsZHMuaW5fc3RhdHVzb3B0aW9uc1wiKTtcbiAgICAgICAgICAgICRzY29wZS5pbl90eXBlb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJpbmsuZmllbGRzLmluX3R5cGVvcHRpb25zXCIpO1xuXG4gICAgICAgICAgICAkc2NvcGUuJG9uKCckdmlld0NvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgLy8gdGhpcyBjb2RlIGlzIGV4ZWN1dGVkIGFmdGVyIHRoZSB2aWV3IGlzIGxvYWRlZFxuICAgICAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpbmtVcGRhdGVGYWMuZGF0YSgpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNPYmplY3QoYW5ndWxhci5mcm9tSnNvbihwcm9taXNlLmRhdGEpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmZtRGF0YSA9IGFuZ3VsYXIuZnJvbUpzb24ocHJvbWlzZS5kYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBpbmtVcGRhdGVGYWMuZ2V0U3VwcGxpZXJzKCkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnN1X2lkb3B0aW9ucyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChwcm9taXNlLmRhdGEsIGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHVzaCh7IFwibGFiZWxcIjogdmFsdWUuc3VfY29ycG9yYXRlbmFtZSwgXCJ2YWx1ZVwiOiB2YWx1ZS5zdV9pZCB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCAkc2NvcGUuc3VfaWRvcHRpb25zKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8kc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfV07XG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgcmV0dXJuIFsnJGh0dHAnLCAnJHEnLCAgJyRzdGF0ZVBhcmFtcycsIGZ1bmN0aW9uICgkaHR0cCwgJHEsICRzdGF0ZVBhcmFtcykge1xuICAgICAgICB2YXIgZmFjdG9yeSA9IHt9O1xuICAgICAgICBmYWN0b3J5LmRhdGEgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KCdtb2R1bGVzL2luay9tb2R1bGVzL2luay51cGRhdGUvaW5rLnVwZGF0ZS5tZGwuZ2V0aW5rLnBocCcsIHtcbiAgICAgICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgICAgICBpbl9pZDogJHN0YXRlUGFyYW1zLmluX2lkXG4gICAgICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkudXBkYXRlID0gZnVuY3Rpb24gKGluX2pzb25iKSB7XG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KCdtb2R1bGVzL2luay9tb2R1bGVzL2luay51cGRhdGUvaW5rLnVwZGF0ZS5tZGwudXBkYXRlLnBocCcsIHtcbiAgICAgICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgICAgICBpbl9pZDogJHN0YXRlUGFyYW1zLmluX2lkLFxuICAgICAgICAgICAgICAgICAgICBpbl9qc29uYjogaW5fanNvbmJcbiAgICAgICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeS5nZXRTdXBwbGllcnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9ICRodHRwLmdldCgnbW9kdWxlcy9pbmsvbW9kdWxlcy9pbmsuYWRkL2luay5hZGQubWRsLmdldFN1cHBsaWVycy5waHAnKVxuICAgICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGZhY3Rvcnk7XG4gICAgfV07XG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCIgOiBcImFjdHVhbGl6YXIgdGludGFcIixcbiAgICAgICAgICAgICAgICB9IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckcm9vdFNjb3BlJyxcbiAgICAgICAgZnVuY3Rpb24gKCRyb290U2NvcGUpIHtcblxuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChpbnB1dCwgcGFyYW0pIHtcbiAgICAgICAgICAgICAgICB2YXIgdHJhbnNsYXRpb25zID0ge1xuICAgICAgICAgICAgICAgICAgICBcImVzLU1YXCI6IHJlcXVpcmUoJy4vbGFuZy5sb2NhbGUuZXMtTVgnKSxcbiAgICAgICAgICAgICAgICAgICAgXCJlbi1VU1wiOiByZXF1aXJlKCcuL2xhbmcubG9jYWxlLmVuLVVTJylcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50TGFuZ3VhZ2UgPSAkcm9vdFNjb3BlLmN1cnJlbnRMYW5ndWFnZSB8fCAnZXMtTVgnLFxuICAgICAgICAgICAgICAgICAgICBrZXlzID0gaW5wdXQuc3BsaXQoJy4nKSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YSA9IHRyYW5zbGF0aW9uc1tjdXJyZW50TGFuZ3VhZ2VdLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4ga2V5cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YSA9IGRhdGFba2V5c1trZXldXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoISFkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKHR5cGVvZiBwYXJhbSA9PT0gXCJ1bmRlZmluZWRcIikgPyBkYXRhIDogZGF0YS5yZXBsYWNlKCdAQCcsIHBhcmFtKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpbnB1dDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlLmRlc2NyaXB0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGlucHV0O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuICAgICAgICB9XTtcbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgICAgICAgICAgICAgIFwiR0VORVJBTFwiOntcbiAgICAgICAgICAgICAgICAgICAgXCJOQVZcIjpbXG4gICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6XCJIb21lXCIsXCJ1cmxcIjpcIiMvaG9tZVwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcIm5hbWVcIjpcIkNsaWVudGVzXCIsXCJ1cmxcIjpcIiMvY2xpZW50XCIsXCJzdWJNZW51XCI6IFxuICAgICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOiBcIkFncmVnYXJcIixcInVybFwiOiBcIiMvY2xpZW50L2FkZFwifVxuICAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6XCJQcm9kdWN0c1wiLFwidXJsXCI6XCIjL3Byb2R1Y3RcIixcInN1Yk1lbnVcIjogXG4gICAgICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6IFwiQWRkXCIsXCJ1cmxcIjogXCIjL3Byb2R1Y3QvYWRkXCJ9XG4gICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcIm5hbWVcIjpcIldvcmsgT3JkZXJzXCIsXCJ1cmxcIjpcIiMvd29cIixcInN1Yk1lbnVcIjogXG4gICAgICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6IFwiQWRkXCIsXCJ1cmxcIjogXCIjL3dvL2FkZFwifVxuICAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6XCJVc2Vyc1wiLFwidXJsXCI6XCIjL3VzZXJcIixcInN1Yk1lbnVcIjogXG4gICAgICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6IFwiQWRkXCIsXCJ1cmxcIjogXCIjL3VzZXIvYWRkXCJ9XG4gICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcIm5hbWVcIjpcIkxvZ2luXCIsXCJ1cmxcIjpcIiMvXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOlwiUmVwb3J0c1wiLFwidXJsXCI6XCIjL3JlcG9ydHNcIixcInN1Yk1lbnVcIjogXG4gICAgICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcIm5hbWVcIjogXCJzdWIxXCIsXCJ1cmxcIjogXCIuLi9sb2dpblwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6IFwic3ViMlwiLFwidXJsXCI6IFwiLi4vbG9naW5cIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOiBcInN1YjNcIixcInVybFwiOiBcIi4uL2xvZ2luXCJ9XG4gICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICBcIkJVVFRPTlNcIjp7XG4gICAgICAgICAgICAgICAgICAgICAgICBcIkVESVRcIjpcIkVkaXRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiRFVQTElDQVRFXCI6XCJEdXBsaWNhdGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiV09cIjpcIldvcmsgT3JkZXJcIixcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgXCJTVUJNSVRcIjpcIlN1Ym1pdFwiLFxuICAgICAgICAgICAgICAgICAgICBcIkNPUFlSSUdIVFwiOlwiwqkyMDE0IEdydXBvIEdyYWZpY28gZGUgTcOpeGljbyBTLkEuIGRlIEMuVi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXCJIT01FXCI6e1xuICAgICAgICAgICAgICAgICAgICBcIlRJVExFXCIgOiBcIkhvbWVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJXRUxDT01FXCIgOiBcIldlbGNvbWUgQEAhXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwiQ0xJRU5UXCI6e1xuICAgICAgICAgICAgICAgICAgICBcIlRJVExFXCIgOiBcIkNsaWVudGVzXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiRklFTERTXCI6e1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJDTF9JRFwiOlwiQ2xpZW50IElEXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkNMX0NPUlBPUkFURU5BTUVcIjpcIkNvcnBvcmF0ZSBOYW1lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkNMX1RJTlwiOlwiVElOXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkNMX05BTUVcIjpcIk5hbWVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiQ0xfRkFUSEVSU0xBU1ROQU1FXCI6XCJGYXRoZXJzIExhc3RuYW1lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkNMX01PVEhFUlNMQVNUTkFNRVwiOlwiTW90aGVycyBMYXN0bmFtZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJDTF9TVFJFRVRcIjpcIlN0cmVldFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJDTF9TVFJFRVROVU1CRVJcIjpcIlN0cmVldCBOdW1iZXJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiQ0xfU1VJVEVOVU1CRVJcIjpcIlN1aXRlIE51bWJlclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJDTF9ORUlHSEJPUkhPT0RcIjpcIk5laWdoYm9yaG9vZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJDTF9BRERSRVNTUkVGRVJFTkNFXCI6XCJBZGRyZXNzIFJlZmVyZW5jZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJDTF9DT1VOVFJZXCI6XCJDb3VudHJ5XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkNMX1NUQVRFXCI6XCJTdGF0ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJDTF9DSVRZXCI6XCJDaXR5XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkNMX0NPVU5UWVwiOlwiQ291bnR5XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkNMX1pJUENPREVcIjpcIlppcCBDb2RlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkNMX0VNQUlMXCI6XCJFLW1haWxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiQ0xfUEhPTkVcIjpcIlBob25lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkNMX01PQklMRVwiOlwiTW9iaWxlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkNMX0NSRURJVExJTUlUXCI6XCJDcmVkaXQgTGltaXRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiQ0xfQ1VTVE9NRVJESVNDT1VOVFwiOlwiRGlzY291bnRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiQ0xfU1RBVFVTXCI6XCJTdGF0dXNcIixcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXCJDTElFTlRfQUREXCI6e1xuICAgICAgICAgICAgICAgICAgICBcIlRJVExFXCIgOiBcIkFkZCBDbGllbnRcIixcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwiQ0xJRU5UX1VQREFURVwiOntcbiAgICAgICAgICAgICAgICAgICAgXCJUSVRMRVwiIDogXCJVcGRhdGUgQ2xpZW50XCIsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBcIlVTRVJcIjp7XG4gICAgICAgICAgICAgICAgICAgIFwiVElUTEVcIiA6IFwiVXNlcnNcIixcbiAgICAgICAgICAgICAgICAgICAgXCJGSUVMRFNcIjp7XG4gICAgICAgICAgICAgICAgICAgICAgICBcIlVTX0lEXCI6IFwiVXNlciBJRFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJHUl9JRFwiOiBcIkdyb3VwIElEXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlVTX1VTRVJcIjogXCJVc2VyXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlVTX1BBU1NXT1JEXCI6IFwiUGFzc3dvcmRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiVVNfTkFNRVwiOiBcIk5hbWVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiVVNfRkFUSEVSU0xBU1ROQU1FXCI6IFwiRmF0aGVycyBMYXN0bmFtZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJVU19NT1RIRVJTTEFTVE5BTUVcIjogXCJNb3RoZXJzIExhc3RuYW1lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlVTX0VNQUlMXCI6IFwiRS1tYWlsXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlVTX1BIT05FXCI6IFwiUGhvbmVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiVVNfTU9CSUxFXCI6IFwiTW9iaWxlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlVTX1NUQVRVU1wiOiBcIlN0YXR1c1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJVU19EQVRFXCI6IFwiRGF0ZVwiXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwiVVNFUl9BRERcIjp7XG4gICAgICAgICAgICAgICAgICAgIFwiVElUTEVcIiA6IFwiQWRkIFVzZXJcIixcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwiVVNFUl9VUERBVEVcIjp7XG4gICAgICAgICAgICAgICAgICAgIFwiVElUTEVcIiA6IFwiVXBkYXRlIFVzZXJcIixcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwiV09cIjp7XG4gICAgICAgICAgICAgICAgICAgIFwiVElUTEVcIiA6IFwiV29yayBPcmRlcnNcIixcbiAgICAgICAgICAgICAgICAgICAgXCJGSUVMRFNcIjp7XG4gICAgICAgICAgICAgICAgICAgICAgICBcIldPX0lEXCIgOiBcIk9yZGVyIE5vLlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJXT19EQVRFXCIgOiBcIkRhdGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiQ0xfSURcIiA6IFwiQ2xpZW50IElEXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlpPX0lEXCIgOiBcIlpvbmUgSURcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiV09fT1JERVJFREJZXCIgOiBcIk9yZGVyZWQgQnlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiV09fQVRURU5USU9OXCIgOiBcIkF0dGVudGlvblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJXT19SRlFcIiA6IFwiUkZRXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIldPX1BST0NFU1NcIiA6IFwiUHJvY2Vzc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJXT19SRUxFQVNFXCIgOiBcIlJlbGVhc2VcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiV09fUE9cIiA6IFwiUHVyY2hhc2UgT3JkZXJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiV09fTElORVwiIDogXCJMaW5lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIldPX0xJTkVUT1RBTFwiIDogXCJUb3RhbCBMaW5lc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJQUlNFX0lEXCIgOiBcIlByb2R1Y3QgSURcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiV09fU1RBVFVTXCIgOiBcIlN0YXR1c1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJXT19DT01NSVRNRU5UREFURVwiIDogXCJDb21taXRtZW50IERhdGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiV09fUFJFVklPVVNJRFwiIDogXCJQcmV2aW91cyBJRFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJXT19QUkVWSU9VU0RBVEVcIiA6IFwiUHJldmlvdXMgRGF0ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJTSF9JRFwiIDogXCJTaGlwbWVudCBJRFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJTSF9EQVRFXCIgOiBcIlNoaXBtZW50IERhdGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiV09fVFJBQ0tJTkdOT1wiIDogXCJUcmFja2luZyBOby5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiV09fU0hJUFBJTkdEQVRFXCIgOiBcIlNoaXBwaW5nIERhdGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiV09fREVMSVZFUllEQVRFXCIgOiBcIkRlbGl2ZXJ5IERhdGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiV09fSU5WT0lDRU5PXCIgOiBcIkludm9pY2UgTm8uXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIldPX0lOVk9JQ0VEQVRFXCIgOiBcIkludm9pY2UgRGF0ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJXT19OT1RFU1wiIDogXCJOb3Rlc1wiXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwiV09fQUREXCI6e1xuICAgICAgICAgICAgICAgICAgICBcIlRJVExFXCIgOiBcIkFkZCBXb3JrIE9yZGVyXCIsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBcIldPX1VQREFURVwiOntcbiAgICAgICAgICAgICAgICAgICAgXCJUSVRMRVwiIDogXCJVcGRhdGUgV29yayBPcmRlclwiLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXCJBVVRIXCI6e1xuICAgICAgICAgICAgICAgICAgICBcIlRJVExFXCIgOiBcIkxvZ2luXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiRU5URVJQUklTRVwiIDogXCJFbnRlcnByaXNlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiVVNFUlwiIDogXCJVc2VyXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiUEFTU1dPUkRcIiA6IFwiUGFzc3dvcmRcIixcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgICAgICAgICAgICAgXCJnZW5lcmFsXCI6eyBcbiAgICAgICAgICAgICAgICAgICAgXCJuYXZcIjpbXG4gICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6XCJpbmljaW9cIixcInVybFwiOlwiIy9ob21lXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOlwiY2xpZW50ZXNcIixcInVybFwiOlwiIy9jbGllbnRcIixcInN1Ym1lbnVcIjogXG4gICAgICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6IFwiYWdyZWdhclwiLFwidXJsXCI6IFwiIy9jbGllbnQvYWRkXCJ9XG4gICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcIm5hbWVcIjpcInByb2R1Y3Rvc1wiLFwidXJsXCI6XCIjL3Byb2R1Y3RcIixcInN1Ym1lbnVcIjogXG4gICAgICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6IFwiYWdyZWdhclwiLFwidXJsXCI6IFwiIy9wcm9kdWN0L2FkZFwifVxuICAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6XCJvcmRlbmVzIGRlIHRyYWJham9cIixcInVybFwiOlwiIy93b1wiLFwic3VibWVudVwiOiBcbiAgICAgICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcIm5hbWVcIjogXCJhZ3JlZ2FyXCIsXCJ1cmxcIjogXCIjL3dvL2FkZFwifVxuICAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6XCJ1c3Vhcmlvc1wiLFwidXJsXCI6XCIjL3VzZXJcIixcInN1Ym1lbnVcIjogXG4gICAgICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6IFwiYWdyZWdhclwiLFwidXJsXCI6IFwiIy91c2VyL2FkZFwifVxuICAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6XCJsb2dpblwiLFwidXJsXCI6XCIjL1wifSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcIm5hbWVcIjpcInJlcG9ydGVzXCIsXCJ1cmxcIjpcIiMvcmVwb3J0c1wiLFwic3VibWVudVwiOiBcbiAgICAgICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcIm5hbWVcIjogXCJzdWIxXCIsXCJ1cmxcIjogXCIuLi9sb2dpblwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOiBcInN1YjJcIixcInVybFwiOiBcIi4uL2xvZ2luXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6IFwic3ViM1wiLFwidXJsXCI6IFwiLi4vbG9naW5cIn1cbiAgICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgIFwibGFiZWxzXCI6e1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJhZGRcIjpcIkFncmVnYXJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZWRpdFwiOlwiZWRpdGFyXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImR1cGxpY2F0ZVwiOlwiZHVwbGljYXJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic2hvd1wiOlwibW9zdHJhclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdWJtaXRcIjpcIkVudmlhclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbG9zZVwiOlwiQ2VycmFyXCIsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIFwicmVnZXhwXCI6e1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJzaW5nbGVzcGFjZXNcIjogXCJzaW4gZXNwYWNpb3MgZG9ibGVzIG5pIGNhcmFjdGVyZXMgZXNwZWNpYWxlcy5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicGFwZXJjb2RlXCI6IFwic2luIGVzcGFjaW9zIG5pIGNhcmFjdGVyZXMgZXNwZWNpYWxlc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpbmtjb2RlXCI6IFwic2luIGVzcGFjaW9zIG5pIGNhcmFjdGVyZXMgZXNwZWNpYWxlc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJtYWNoaW5ldG90YWxpbmtzXCI6IFwibWluaW1vIDEgbWF4aW1vIDhcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicmZjXCI6IFwiWFhYWC0jIyMjIyNbLVhYWF1cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZW1haWxcIjogXCJwb3IgZmF2b3IgaW50cm9kdXpjYSB1biBlbWFpbCB2YWxpZG8uXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImRlY2ltYWxcIjogXCJudW1lcm8geSBkZSAyIGEgNSBkZWNpbWFsZXMgKCMuIyNbIyMjXSlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZGlzY291bnRcIjogXCJjZXJvIG1hcyAyIGRlY2ltYWxlcyAoMC4jIylcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaW50ZWdlclwiOiBcInNvbG8gbnVtZXJvcyBlbnRlcm9zXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInppcGNvZGVcIjogXCJlbCBjb2RpZ28gcG9zdGFsIGVzIGRlIDUgbnVtZXJvcy5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZGF0ZVwiOiBcImFhYWEtbW0tZGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidXNlclwiOiBcImRlIDQgYSAxNiBjYXJhY3RlcmVzIHNpbiBlc3BhY2lvcyBuaSBjYXJhY3RlcmVzIGVzcGVjaWFsZXMuXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInBhc3N3b3JkXCI6IFwibGEgY29udHJhc2XDsWEgZGViZSBjb250ZW5lciBkZSA4LTE2IGNhcmFjdGVyZXMsIHBvciBsbyBtZW5vcyB1bmEgbGV0cmEgbWF5dXNjdWxhLCB1bmEgbGV0cmEgbWludXNjdWxhIHkgdW4gZGlnaXRvLlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwaG9uZVwiOiBcInNvbG8gdXNlIGVsIHNpbWJvbG8gKyBhbCBwcmluY2lwaW8geSBudW1lcm9zIGRlbCAwIGFsIDlcIlxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBcImNvcHlyaWdodFwiOlwiwqkyMDE0IGdydXBvIGdyYWZpY28gZGUgbcOpeGljbyBzLmEuIGRlIGMudi4gdG9kb3MgbG9zIGRlcmVjaG9zIHJlc2VydmFkb3MuXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgSE9NRSBcbiAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuICAgICAgICAgICAgICAgIFwiaG9tZVwiOnJlcXVpcmUoJy4vaG9tZS9sYW5nLmVzLU1YJyksXG4gICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICBDTElFTlQgXG4gICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbiAgICAgICAgICAgICAgICBcImNsaWVudFwiOiByZXF1aXJlKCcuL2NsaWVudC9sYW5nLmVzLU1YJyksXG4gICAgICAgICAgICAgICAgXCJjbGllbnQtY3VzdG9tXCI6IHJlcXVpcmUoJy4vY2xpZW50L2xhbmcuY3VzdG9tLmVzLU1YJyksXG4gICAgICAgICAgICAgICAgXCJjbGllbnQtYWRkXCI6IHJlcXVpcmUoJy4vY2xpZW50L21vZHVsZXMvY2xpZW50LmFkZC9sYW5nLmVzLU1YJyksXG4gICAgICAgICAgICAgICAgXCJjbGllbnQtdXBkYXRlXCI6IHJlcXVpcmUoJy4vY2xpZW50L21vZHVsZXMvY2xpZW50LnVwZGF0ZS9sYW5nLmVzLU1YJyksXG4gICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICBQUk9EVUNUIFxuICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4gICAgICAgICAgICAgICAgXCJwcm9kdWN0XCI6IHJlcXVpcmUoJy4vcHJvZHVjdC9sYW5nLmVzLU1YJyksXG4gICAgICAgICAgICAgICAgXCJwcm9kdWN0T2Zmc2V0R2VuZXJhbC1hZGRcIjogcmVxdWlyZSgnLi9wcm9kdWN0L21vZHVsZXMvcHJvZHVjdE9mZnNldEdlbmVyYWwuYWRkL2xhbmcuZXMtTVgnKSxcbiAgICAgICAgICAgICAgICBcInByb2R1Y3RPZmZzZXRHZW5lcmFsLXVwZGF0ZVwiOiByZXF1aXJlKCcuL3Byb2R1Y3QvbW9kdWxlcy9wcm9kdWN0T2Zmc2V0R2VuZXJhbC51cGRhdGUvbGFuZy5lcy1NWCcpLFxuICAgICAgICAgICAgICAgIFwicHJvZHVjdE9mZnNldFBhZ2luYXRlZC1hZGRcIjogcmVxdWlyZSgnLi9wcm9kdWN0L21vZHVsZXMvcHJvZHVjdE9mZnNldFBhZ2luYXRlZC5hZGQvbGFuZy5lcy1NWCcpLFxuICAgICAgICAgICAgICAgIFwicHJvZHVjdE9mZnNldFBhZ2luYXRlZC11cGRhdGVcIjp7XG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIiA6IFwiYWN0dWFsaXphciBwcm9kdWN0b1wiLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICBTVVBQTElFUiBcbiAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuICAgICAgICAgICAgICAgIFwic3VwcGxpZXJcIjogcmVxdWlyZSgnLi9zdXBwbGllci9sYW5nLmVzLU1YJyksXG4gICAgICAgICAgICAgICAgXCJzdXBwbGllci1hZGRcIjogcmVxdWlyZSgnLi9zdXBwbGllci9tb2R1bGVzL3N1cHBsaWVyLmFkZC9sYW5nLmVzLU1YJyksXG4gICAgICAgICAgICAgICAgXCJzdXBwbGllci11cGRhdGVcIjogcmVxdWlyZSgnLi9zdXBwbGllci9tb2R1bGVzL3N1cHBsaWVyLnVwZGF0ZS9sYW5nLmVzLU1YJyksXG4gICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICBQQVBFUiBcbiAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuICAgICAgICAgICAgICAgIFwicGFwZXJcIjogcmVxdWlyZSgnLi9wYXBlci9sYW5nLmVzLU1YJyksXG4gICAgICAgICAgICAgICAgXCJwYXBlci1hZGRcIjogcmVxdWlyZSgnLi9wYXBlci9tb2R1bGVzL3BhcGVyLmFkZC9sYW5nLmVzLU1YJyksXG4gICAgICAgICAgICAgICAgXCJwYXBlci11cGRhdGVcIjogcmVxdWlyZSgnLi9wYXBlci9tb2R1bGVzL3BhcGVyLnVwZGF0ZS9sYW5nLmVzLU1YJyksXG4gICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICBNQUNISU5FIFxuICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4gICAgICAgICAgICAgICAgXCJtYWNoaW5lXCI6IHJlcXVpcmUoJy4vbWFjaGluZS9sYW5nLmVzLU1YJyksXG4gICAgICAgICAgICAgICAgXCJtYWNoaW5lLWFkZFwiOiByZXF1aXJlKCcuL21hY2hpbmUvbW9kdWxlcy9tYWNoaW5lLmFkZC9sYW5nLmVzLU1YJyksXG4gICAgICAgICAgICAgICAgXCJtYWNoaW5lLXVwZGF0ZVwiOiByZXF1aXJlKCcuL21hY2hpbmUvbW9kdWxlcy9tYWNoaW5lLnVwZGF0ZS9sYW5nLmVzLU1YJyksXG4gICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICBNQUNISU5FIFxuICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4gICAgICAgICAgICAgICAgXCJpbmtcIjogcmVxdWlyZSgnLi9pbmsvbGFuZy5lcy1NWCcpLFxuICAgICAgICAgICAgICAgIFwiaW5rLWFkZFwiOiByZXF1aXJlKCcuL2luay9tb2R1bGVzL2luay5hZGQvbGFuZy5lcy1NWCcpLFxuICAgICAgICAgICAgICAgIFwiaW5rLXVwZGF0ZVwiOiByZXF1aXJlKCcuL2luay9tb2R1bGVzL2luay51cGRhdGUvbGFuZy5lcy1NWCcpLFxuICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgVVNFUiBcbiAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuICAgICAgICAgICAgICAgIFwidXNlclwiOiByZXF1aXJlKCcuL3VzZXIvbGFuZy5lcy1NWCcpLFxuICAgICAgICAgICAgICAgIFwidXNlci1hZGRcIjogcmVxdWlyZSgnLi91c2VyL21vZHVsZXMvdXNlci5hZGQvbGFuZy5lcy1NWCcpLFxuICAgICAgICAgICAgICAgIFwidXNlci11cGRhdGVcIjogcmVxdWlyZSgnLi91c2VyL21vZHVsZXMvdXNlci51cGRhdGUvbGFuZy5lcy1NWCcpLFxuICAgICAgICAgICAgICAgIFwidXNlci1wcm9maWxlXCI6IHJlcXVpcmUoJy4vdXNlci9tb2R1bGVzL3VzZXIucHJvZmlsZS9sYW5nLmVzLU1YJyksXG4gICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICBXT1JLIE9SREVSIFxuICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4gICAgICAgICAgICAgICAgXCJ3b1wiOiByZXF1aXJlKCcuL3dvL2xhbmcuZXMtTVgnKSxcbiAgICAgICAgICAgICAgICBcIndvLWFkZFwiOiByZXF1aXJlKCcuL3dvL21vZHVsZXMvd28uYWRkL2xhbmcuZXMtTVgnKSxcbiAgICAgICAgICAgICAgICBcIndvLXVwZGF0ZVwiOiByZXF1aXJlKCcuL3dvL21vZHVsZXMvd28udXBkYXRlL2xhbmcuZXMtTVgnKSxcbiAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgIEFVVEggXG4gICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbiAgICAgICAgICAgICAgICBcImF1dGhcIjogcmVxdWlyZSgnLi9hdXRoL2xhbmcuZXMtTVgnKSxcbiAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgIFpPTkUgXG4gICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbiAgICAgICAgICAgICAgICBcInpvbmVcIjogcmVxdWlyZSgnLi96b25lL2xhbmcuZXMtTVgnKSxcbiAgICAgICAgICAgICAgICBcInpvbmUtYWRkXCI6IHJlcXVpcmUoJy4vem9uZS9tb2R1bGVzL3pvbmUuYWRkL2xhbmcuZXMtTVgnKSxcbiAgICAgICAgICAgICAgICBcInpvbmUtdXBkYXRlXCI6IHJlcXVpcmUoJy4vem9uZS9tb2R1bGVzL3pvbmUudXBkYXRlL2xhbmcuZXMtTVgnKSxcbiAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgIFNUQVRVUyBcbiAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuICAgICAgICAgICAgICAgIFwid29ya2Zsb3dcIjogcmVxdWlyZSgnLi93b3JrZmxvdy9sYW5nLmVzLU1YJyksXG4gICAgICAgICAgICB9IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gYW5ndWxhci5tb2R1bGUoJ2FwcC5sb2dpbicsIFtdKVxuXG4gICAgICAgIC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLFxuICAgICAgICAgICAgZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcbiAgICAgICAgICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnbG9naW4nLCB7XG4gICAgICAgICAgICAgICAgICAgIHVybDogJy9sb2dpbicsXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL2xvZ2luL2xvZ2luLnZpZXcuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdsb2dpbkN0cmwnLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlc0xvZ2luOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XSlcblxuICAgICAgICAuY29udHJvbGxlcignbG9naW5DdHJsJywgcmVxdWlyZSgnLi9sb2dpbi5jdHJsJykpXG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgcmV0dXJuIFsnJHNjb3BlJywgJyRodHRwJywgJ2F1dGhTZXJ2aWNlJywgJyRsb2NhdGlvbicsXG4gICAgICAgIGZ1bmN0aW9uICgkc2NvcGUsICRodHRwLCBhdXRoU2VydmljZSwgJGxvY2F0aW9uKSB7XG4gICAgICAgICAgICBhdXRoU2VydmljZS5sb2dpbigpO1xuICAgICAgICAgICAgLypcbiAgICAgICAgICAgIHZhciB0b2tlbiA9IHN0b3JlLmdldCgndG9rZW4nKTtcbiAgICAgICAgICAgIGlmICh0b2tlbikge1xuICAgICAgICAgICAgICAgIGlmICghand0SGVscGVyLmlzVG9rZW5FeHBpcmVkKHRva2VuKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWF1dGguaXNBdXRoZW50aWNhdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdXRoLmF1dGhlbnRpY2F0ZShzdG9yZS5nZXQoJ3Byb2ZpbGUnKSwgdG9rZW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9ob21lJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9ob21lJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gRWl0aGVyIHNob3cgdGhlIGxvZ2luIHBhZ2Ugb3IgdXNlIHRoZSByZWZyZXNoIHRva2VuIHRvIGdldCBhIG5ldyBpZFRva2VuXG4gICAgICAgICAgICAgICAgICAgIGF1dGguc2lnbmluKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpY3Q6ICdlcycsXG4gICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnaW1nL2dnYXV0aC1sb2dvLnBuZycsXG4gICAgICAgICAgICAgICAgICAgICAgICB1c2VybmFtZTogJHNjb3BlLnVzZXJuYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFzc3dvcmQ6ICRzY29wZS5wYXNzd29yZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbm5lY3Rpb246ICdVc2VybmFtZS1QYXNzd29yZC1BdXRoZW50aWNhdGlvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICByZW1lbWJlckxhc3RMb2dpbjogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBjbG9zYWJsZTogZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKHByb2ZpbGUsIHRva2VuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBTdWNjZXNzIGNhbGxiYWNrXG4gICAgICAgICAgICAgICAgICAgICAgICBzdG9yZS5zZXQoJ3Byb2ZpbGUnLCBwcm9maWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0b3JlLnNldCgndG9rZW4nLCB0b2tlbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2hvbWUnKTtcbiAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcilcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEVycm9yIGNhbGxiYWNrXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYXV0aC5zaWduaW4oe1xuICAgICAgICAgICAgICAgICAgICBkaWN0OiAnZXMnLFxuICAgICAgICAgICAgICAgICAgICBpY29uOiAnaW1nL2dnYXV0aC1sb2dvLnBuZycsXG4gICAgICAgICAgICAgICAgICAgIHVzZXJuYW1lOiAkc2NvcGUudXNlcm5hbWUsXG4gICAgICAgICAgICAgICAgICAgIHBhc3N3b3JkOiAkc2NvcGUucGFzc3dvcmQsXG4gICAgICAgICAgICAgICAgICAgIGNvbm5lY3Rpb246ICdVc2VybmFtZS1QYXNzd29yZC1BdXRoZW50aWNhdGlvbicsXG4gICAgICAgICAgICAgICAgICAgIHJlbWVtYmVyTGFzdExvZ2luOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgY2xvc2FibGU6IGZhbHNlXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKHByb2ZpbGUsIHRva2VuKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFN1Y2Nlc3MgY2FsbGJhY2tcbiAgICAgICAgICAgICAgICAgICAgc3RvcmUuc2V0KCdwcm9maWxlJywgcHJvZmlsZSk7XG4gICAgICAgICAgICAgICAgICAgIHN0b3JlLnNldCgndG9rZW4nLCB0b2tlbik7XG4gICAgICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvaG9tZScpO1xuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcilcbiAgICAgICAgICAgICAgICAgICAgLy8gRXJyb3IgY2FsbGJhY2tcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0qL1xuXG4gICAgICAgIH1dXG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKGFuZ3VsYXIpe1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBcbiAgICByZXR1cm4gYW5ndWxhci5tb2R1bGUoJ2FwcC5tYWNoaW5lJyxbXG4gICAgICAgIHJlcXVpcmUoJy4vbW9kdWxlcy9tYWNoaW5lLmFkZCcpLm5hbWUsXG4gICAgICAgIHJlcXVpcmUoJy4vbW9kdWxlcy9tYWNoaW5lLnVwZGF0ZScpLm5hbWVcbiAgICBdKVxuXG4gICAgLmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsXG4gICAgZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnbWFjaGluZScsIHtcbiAgICAgICAgICAgIHVybDonL21hY2hpbmUnLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmwgOiAnYXBwL21hY2hpbmUvbWFjaGluZS52aWV3Lmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlciA6ICdtYWNoaW5lQ3RybCcsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgcmVxdWlyZXNMb2dpbjogdHJ1ZVxuICAgICAgICAgICAgfSAgICBcbiAgICAgICAgfSk7XG4gICAgfV0pXG5cbiAgICAuZmFjdG9yeSgnbWFjaGluZUZhYycscmVxdWlyZSgnLi9tYWNoaW5lLmZhYycpKVxuXG4gICAgLmNvbnRyb2xsZXIoJ21hY2hpbmVDdHJsJyxyZXF1aXJlKCcuL21hY2hpbmUuY3RybCcpKVxuICAgIFxufSkoYW5ndWxhcik7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiIDogXCJtYXF1aW5hc1wiLFxuICAgICAgICAgICAgICAgICAgICBcImxhYmVsc1wiOntcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibWEtaWRcIjpcIklEIE1hcXVpbmFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibWEtbmFtZVwiOlwiTWFxdWluYVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJtYS1tYXhzaXpld2lkdGhcIjpcIlRhbWHDsW8gbWF4LiBhbmNob1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJtYS1tYXhzaXplaGVpZ2h0XCI6XCJUYW1hw7FvIG1heC4gYWx0dXJhXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm1hLW1pbnNpemV3aWR0aFwiOlwiVGFtYcOxbyBtaW4uIGFuY2hvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm1hLW1pbnNpemVoZWlnaHRcIjpcIlRhbWHDsW8gbWF4LiBhbHR1cmFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibWEtc2l6ZW1lYXN1cmVcIjpcIk1lZGlkYVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJtYS10b3RhbGlua3NcIjpcIlRpbnRhcyB0b3RhbGVzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm1hLWZ1bGxjb2xvclwiOlwiRnVsbCBjb2xvclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJtYS1wcmludGJnXCI6XCJJbXByaW1lIGZvbmRvc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJtYS1wcm9jZXNzXCI6XCJQcm9jZXNvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm1hLXN0YXR1c1wiOlwiRXN0YXR1c1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJtYS1kYXRlXCI6XCJGZWNoYVwiLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgXCJjb2x1bW5zXCI6W1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJtYV9pZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJtYV9uYW1lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm1hX21heHNpemV3aWR0aFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJtYV9tYXhzaXplaGVpZ2h0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm1hX21pbnNpemV3aWR0aFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJtYV9taW5zaXplaGVpZ2h0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm1hX3NpemVtZWFzdXJlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm1hX3RvdGFsaW5rc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJtYV9mdWxsY29sb3JcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibWFfcHJpbnRiZ1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJtYV9wcm9jZXNzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm1hX3N0YXR1c1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJtYV9kYXRlXCIsXG4gICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgXCJmaWVsZHNcIiA6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hX3NpemVtZWFzdXJlb3B0aW9ucyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiY21cIixcInZhbHVlXCI6XCJjbVwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwicHVsZ2FkYXNcIixcInZhbHVlXCI6XCJpblwifVxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hX2Z1bGxjb2xvcm9wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIlNpXCIsXCJ2YWx1ZVwiOlwieWVzXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJOb1wiLFwidmFsdWVcIjpcIm5vXCJ9XG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWFfcHJpbnRiZ29wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIlNpXCIsXCJ2YWx1ZVwiOlwieWVzXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJOb1wiLFwidmFsdWVcIjpcIm5vXCJ9XG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWFfcHJvY2Vzc29wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIk9mZnNldFwiLFwidmFsdWVcIjpcIm9mZnNldFwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiRmxleG9cIixcInZhbHVlXCI6XCJmbGV4b1wifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiUGzDs3RlclwiLFwidmFsdWVcIjpcInBsb3R0ZXJcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIlNlbGxvc1wiLFwidmFsdWVcIjpcInNlYWxzXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJTZXJpZ3JhZsOtYVwiLFwidmFsdWVcIjpcInNlcmlncmFwaHlcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkxhc2VyXCIsXCJ2YWx1ZVwiOlwibGFzZXJcIn1cbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBtYV9zdGF0dXNvcHRpb25zIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJBY3Rpdm9cIixcInZhbHVlXCI6XCJBXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJJbmFjdGl2b1wiLFwidmFsdWVcIjpcIklcIn1cbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0iLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRzY29wZScsICdtYWNoaW5lRmFjJywgJ2kxOG5GaWx0ZXInLFxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCBtYWNoaW5lRmFjLCBpMThuRmlsdGVyKSB7XG5cbiAgICAgICAgICAgICRzY29wZS5sYWJlbHMgPSBPYmplY3Qua2V5cyhpMThuRmlsdGVyKFwibWFjaGluZS5sYWJlbHNcIikpO1xuICAgICAgICAgICAgJHNjb3BlLmNvbHVtbnMgPSBpMThuRmlsdGVyKFwibWFjaGluZS5jb2x1bW5zXCIpO1xuICAgICAgICBcbiAgICAgICAgICAgIC8vIGZvcm1hdEl0ZW0gZXZlbnQgaGFuZGxlclxuICAgICAgICAgICAgdmFyIG1hX2lkO1xuICAgICAgICAgICAgJHNjb3BlLmZvcm1hdEl0ZW0gPSBmdW5jdGlvbiAocywgZSwgY2VsbCkge1xuXG4gICAgICAgICAgICAgICAgaWYgKGUucGFuZWwuY2VsbFR5cGUgPT0gd2lqbW8uZ3JpZC5DZWxsVHlwZS5Sb3dIZWFkZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgZS5jZWxsLnRleHRDb250ZW50ID0gZS5yb3cgKyAxO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHMucm93cy5kZWZhdWx0U2l6ZSA9IDMwO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gYWRkIEJvb3RzdHJhcCBodG1sXG4gICAgICAgICAgICAgICAgaWYgKChlLnBhbmVsLmNlbGxUeXBlID09IHdpam1vLmdyaWQuQ2VsbFR5cGUuQ2VsbCkgJiYgKGUuY29sID09IDApKSB7XG4gICAgICAgICAgICAgICAgICAgIG1hX2lkID0gZS5wYW5lbC5nZXRDZWxsRGF0YShlLnJvdywgMSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBlLmNlbGwuc3R5bGUub3ZlcmZsb3cgPSAndmlzaWJsZSc7XG4gICAgICAgICAgICAgICAgICAgIGUuY2VsbC5pbm5lckhUTUwgPSAnPGRpdiBjbGFzcz1cImJ0bi1ncm91cCBidG4tZ3JvdXAtanVzdGlmaWVkXCIgcm9sZT1cImdyb3VwXCIgYXJpYS1sYWJlbD1cIi4uLlwiPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJ0bi1ncm91cFwiIHJvbGU9XCJncm91cFwiPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIjL21hY2hpbmUvdXBkYXRlLycrIG1hX2lkICsgJ1wiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0IGJ0bi14c1wiIG5nLWNsaWNrPVwiZWRpdCgkaXRlbS5tYV9pZClcIj5FZGl0YXI8L2E+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+JztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAgICAgLy8gYmluZCBjb2x1bW5zIHdoZW4gZ3JpZCBpcyBpbml0aWFsaXplZFxuICAgICAgICAgICAgJHNjb3BlLmluaXRHcmlkID0gZnVuY3Rpb24gKHMsIGUpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8ICRzY29wZS5sYWJlbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbCA9IG5ldyB3aWptby5ncmlkLkNvbHVtbigpO1xuICAgICAgICAgICAgICAgICAgICBjb2wuYmluZGluZyA9ICRzY29wZS5jb2x1bW5zW2ldO1xuICAgICAgICAgICAgICAgICAgICBjb2wuaGVhZGVyID0gaTE4bkZpbHRlcihcIm1hY2hpbmUubGFiZWxzLlwiICsgJHNjb3BlLmxhYmVsc1tpXSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbC53b3JkV3JhcCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBjb2wud2lkdGggPSAxNTA7XG4gICAgICAgICAgICAgICAgICAgIHMuY29sdW1ucy5wdXNoKGNvbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIC8vIGNyZWF0ZSB0aGUgdG9vbHRpcCBvYmplY3RcbiAgICAgICAgICAgICRzY29wZS4kd2F0Y2goJ2dnR3JpZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoJHNjb3BlLmdnR3JpZCkge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgLy8gc3RvcmUgcmVmZXJlbmNlIHRvIGdyaWRcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZsZXggPSAkc2NvcGUuZ2dHcmlkO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNyZWF0ZSB0b29sdGlwXG4gICAgICAgICAgICAgICAgICAgIHZhciB0aXAgPSBuZXcgd2lqbW8uVG9vbHRpcCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgcm5nID0gbnVsbDtcblxuICAgICAgICAgICAgICAgICAgICAvLyBtb25pdG9yIHRoZSBtb3VzZSBvdmVyIHRoZSBncmlkXG4gICAgICAgICAgICAgICAgICAgIGZsZXguaG9zdEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGh0ID0gZmxleC5oaXRUZXN0KGV2dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWh0LnJhbmdlLmVxdWFscyhybmcpKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBuZXcgY2VsbCBzZWxlY3RlZCwgc2hvdyB0b29sdGlwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGh0LmNlbGxUeXBlID09IHdpam1vLmdyaWQuQ2VsbFR5cGUuQ2VsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBybmcgPSBodC5yYW5nZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvbCA9IGZsZXguY29sdW1uc1tybmcuY29sXS5oZWFkZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjZWxsRWxlbWVudCA9IGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQoZXZ0LmNsaWVudFgsIGV2dC5jbGllbnRZKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNlbGxCb3VuZHMgPSB3aWptby5SZWN0LmZyb21Cb3VuZGluZ1JlY3QoY2VsbEVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YSA9IHdpam1vLmVzY2FwZUh0bWwoZmxleC5nZXRDZWxsRGF0YShybmcucm93LCBybmcuY29sLCB0cnVlKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXBDb250ZW50ID0gY29sICsgJzogXCI8Yj4nICsgZGF0YSArICc8L2I+XCInO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2VsbEVsZW1lbnQuY2xhc3NOYW1lLmluZGV4T2YoJ3dqLWNlbGwnKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXAuc2hvdyhmbGV4Lmhvc3RFbGVtZW50LCB0aXBDb250ZW50LCBjZWxsQm91bmRzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpcC5oaWRlKCk7IC8vIGNlbGwgbXVzdCBiZSBiZWhpbmQgc2Nyb2xsIGJhci4uLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgZmxleC5ob3N0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpcC5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBybmcgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJHNjb3BlLiRvbignJHZpZXdDb250ZW50TG9hZGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIC8vIHRoaXMgY29kZSBpcyBleGVjdXRlZCBhZnRlciB0aGUgdmlldyBpcyBsb2FkZWRcbiAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgbWFjaGluZUZhYy5kYXRhKCkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5kYXRhID0gbmV3IHdpam1vLmNvbGxlY3Rpb25zLkNvbGxlY3Rpb25WaWV3KHByb21pc2UuZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XTtcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckaHR0cCcsICckcScsIFxuICAgICAgICBmdW5jdGlvbiAoJGh0dHAsICRxKSB7XG4gICAgICAgICAgICB2YXIgZmFjdG9yeSA9IHt9O1xuICAgICAgICAgICAgZmFjdG9yeS5kYXRhID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShcbiAgICAgICAgICAgICAgICAgICAgJGh0dHAucG9zdCgnbW9kdWxlcy9tYWNoaW5lL21hY2hpbmUubWRsLmdldG1hY2hpbmVzLnBocCcsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2NjZXNfaWQ6IG5ldyBEYXRlKCkuZ2V0TWlsbGlzZWNvbmRzKClcbiAgICAgICAgICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJldHVybiBmYWN0b3J5O1xuICAgICAgICB9XTtcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oYW5ndWxhcil7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIFxuICAgIHJldHVybiBhbmd1bGFyLm1vZHVsZSgnYXBwLm1hY2hpbmUuYWRkJyxbXSlcblxuICAgIC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLFxuICAgIGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcbiAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ21hY2hpbmVBZGQnLCB7XG4gICAgICAgICAgICB1cmw6Jy9tYWNoaW5lL2FkZCcsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybCA6ICdhcHAvbWFjaGluZS9tb2R1bGVzL21hY2hpbmUuYWRkL21hY2hpbmUuYWRkLnZpZXcuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyIDogJ21hY2hpbmVBZGRDdHJsJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICByZXF1aXJlc0xvZ2luOiB0cnVlXG4gICAgICAgICAgICB9ICAgIFxuICAgICAgICB9KTtcbiAgICB9XSlcblxuICAgIC5mYWN0b3J5KCdtYWNoaW5lQWRkRmFjJyxyZXF1aXJlKCcuL21hY2hpbmUuYWRkLmZhYycpKVxuXG4gICAgLmNvbnRyb2xsZXIoJ21hY2hpbmVBZGRDdHJsJyxyZXF1aXJlKCcuL21hY2hpbmUuYWRkLmN0cmwnKSlcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIiA6IFwiYWdyZWdhciBtYXF1aW5hXCIsXG4gICAgICAgICAgICAgICAgfSIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKGFuZ3VsYXIpe1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBcbiAgICByZXR1cm4gWyckc2NvcGUnLCAnbWFjaGluZUFkZEZhYycsICckbG9jYXRpb24nLCAnaTE4bkZpbHRlcicsXG4gICAgZnVuY3Rpb24gKCRzY29wZSwgbWFjaGluZUFkZEZhYywgJGxvY2F0aW9uLCBpMThuRmlsdGVyKSB7XG4gICAgICAgICRzY29wZS5mbURhdGEgPSB7fTtcblxuICAgICAgICAkc2NvcGUub25TdWJtaXQgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgbWFjaGluZUFkZEZhYy5hZGQoJHNjb3BlLmZtRGF0YSkudGhlbihmdW5jdGlvbihwcm9taXNlKXtcbiAgICAgICAgICAgICAgICBpZihwcm9taXNlLmRhdGEgPT0gXCIxXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9tYWNoaW5lJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnVwZGF0ZUZhaWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5tYV9zaXplbWVhc3VyZW9wdGlvbnMgPSBpMThuRmlsdGVyKFwibWFjaGluZS5maWVsZHMubWFfc2l6ZW1lYXN1cmVvcHRpb25zXCIpO1xuICAgICAgICAkc2NvcGUubWFfZnVsbGNvbG9yb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJtYWNoaW5lLmZpZWxkcy5tYV9mdWxsY29sb3JvcHRpb25zXCIpO1xuICAgICAgICAkc2NvcGUubWFfcHJpbnRiZ29wdGlvbnMgPSBpMThuRmlsdGVyKFwibWFjaGluZS5maWVsZHMubWFfcHJpbnRiZ29wdGlvbnNcIik7XG4gICAgICAgICRzY29wZS5tYV9wcm9jZXNzb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJtYWNoaW5lLmZpZWxkcy5tYV9wcm9jZXNzb3B0aW9uc1wiKTtcbiAgICAgICAgJHNjb3BlLm1hX3N0YXR1c29wdGlvbnMgPSBpMThuRmlsdGVyKFwibWFjaGluZS5maWVsZHMubWFfc3RhdHVzb3B0aW9uc1wiKTtcblxuICAgICAgICAkc2NvcGUuJG9uKCckdmlld0NvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyB0aGlzIGNvZGUgaXMgZXhlY3V0ZWQgYWZ0ZXIgdGhlIHZpZXcgaXMgbG9hZGVkXG4gICAgICAgICAgICBcbiAgICAgICAgICAgXG5cbiAgICAgICAgIH0pO1xuICAgIH1dO1xuICAgIFxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckaHR0cCcsICckcScsICAnJHN0YXRlUGFyYW1zJyxcbiAgICAgICAgZnVuY3Rpb24gKCRodHRwLCAkcSwgJHN0YXRlUGFyYW1zKSB7XG4gICAgICAgICAgICB2YXIgZmFjdG9yeSA9IHt9O1xuICAgICAgICAgICAgZmFjdG9yeS5hZGQgPSBmdW5jdGlvbiAobWFfanNvbmIpIHtcbiAgICAgICAgICAgICAgICB2YXIgcHJvbWlzZSA9ICRodHRwLnBvc3QoJ21vZHVsZXMvbWFjaGluZS9tb2R1bGVzL21hY2hpbmUuYWRkL21hY2hpbmUuYWRkLm1kbC5hZGQucGhwJywge1xuICAgICAgICAgICAgICAgICAgICAvKiBQT1NUIHZhcmlhYmxlcyBoZXJlICovXG4gICAgICAgICAgICAgICAgICAgIG1hX2pzb25iOiBtYV9qc29uYlxuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm4gZmFjdG9yeTtcbiAgICAgICAgfV07XG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKGFuZ3VsYXIpe1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBcbiAgICByZXR1cm4gYW5ndWxhci5tb2R1bGUoJ2FwcC5tYWNoaW5lLnVwZGF0ZScsW10pXG5cbiAgICAuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJyxcbiAgICBmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdtYWNoaW5lVXBkYXRlJywge1xuICAgICAgICAgICAgdXJsOicvbWFjaGluZS91cGRhdGUvOm1hX2lkJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsIDogJ2FwcC9tYWNoaW5lL21vZHVsZXMvbWFjaGluZS51cGRhdGUvbWFjaGluZS51cGRhdGUudmlldy5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXIgOiAnbWFjaGluZVVwZGF0ZUN0cmwnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHJlcXVpcmVzTG9naW46IHRydWVcbiAgICAgICAgICAgIH0gICAgXG4gICAgICAgIH0pO1xuICAgIH1dKVxuXG4gICAgLmZhY3RvcnkoJ21hY2hpbmVVcGRhdGVGYWMnLHJlcXVpcmUoJy4vbWFjaGluZS51cGRhdGUuZmFjJykpXG5cbiAgICAuY29udHJvbGxlcignbWFjaGluZVVwZGF0ZUN0cmwnLHJlcXVpcmUoJy4vbWFjaGluZS51cGRhdGUuY3RybCcpKVxuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiIDogXCJhY3R1YWxpemFyIG1hcXVpbmFcIixcbiAgICAgICAgICAgICAgICB9IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckc2NvcGUnLCAnbWFjaGluZVVwZGF0ZUZhYycsICckbG9jYXRpb24nLCAnaTE4bkZpbHRlcicsXG4gICAgICAgIGZ1bmN0aW9uICgkc2NvcGUsIG1hY2hpbmVVcGRhdGVGYWMsICRsb2NhdGlvbiwgaTE4bkZpbHRlcikge1xuXG4gICAgICAgICAgICAkc2NvcGUub25TdWJtaXQgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICBtYWNoaW5lVXBkYXRlRmFjLnVwZGF0ZSgkc2NvcGUuZm1EYXRhKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9taXNlLmRhdGEgPT0gXCIxXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvbWFjaGluZScpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnVwZGF0ZUZhaWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAkc2NvcGUubWFfc2l6ZW1lYXN1cmVvcHRpb25zID0gaTE4bkZpbHRlcihcIm1hY2hpbmUuZmllbGRzLm1hX3NpemVtZWFzdXJlb3B0aW9uc1wiKTtcbiAgICAgICAgICAgICRzY29wZS5tYV9mdWxsY29sb3JvcHRpb25zID0gaTE4bkZpbHRlcihcIm1hY2hpbmUuZmllbGRzLm1hX2Z1bGxjb2xvcm9wdGlvbnNcIik7XG4gICAgICAgICAgICAkc2NvcGUubWFfcHJpbnRiZ29wdGlvbnMgPSBpMThuRmlsdGVyKFwibWFjaGluZS5maWVsZHMubWFfcHJpbnRiZ29wdGlvbnNcIik7XG4gICAgICAgICAgICAkc2NvcGUubWFfcHJvY2Vzc29wdGlvbnMgPSBpMThuRmlsdGVyKFwibWFjaGluZS5maWVsZHMubWFfcHJvY2Vzc29wdGlvbnNcIik7XG4gICAgICAgICAgICAkc2NvcGUubWFfc3RhdHVzb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJtYWNoaW5lLmZpZWxkcy5tYV9zdGF0dXNvcHRpb25zXCIpO1xuXG4gICAgICAgICAgICAkc2NvcGUuJG9uKCckdmlld0NvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgLy8gdGhpcyBjb2RlIGlzIGV4ZWN1dGVkIGFmdGVyIHRoZSB2aWV3IGlzIGxvYWRlZFxuICAgICAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBtYWNoaW5lVXBkYXRlRmFjLmRhdGEoKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzT2JqZWN0KGFuZ3VsYXIuZnJvbUpzb24ocHJvbWlzZS5kYXRhKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5mbURhdGEgPSBhbmd1bGFyLmZyb21Kc29uKHByb21pc2UuZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XTtcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckaHR0cCcsICckcScsICAnJHN0YXRlUGFyYW1zJywgZnVuY3Rpb24gKCRodHRwLCAkcSwgJHN0YXRlUGFyYW1zKSB7XG4gICAgICAgIHZhciBmYWN0b3J5ID0ge307XG4gICAgICAgIGZhY3RvcnkuZGF0YSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKFxuICAgICAgICAgICAgICAgICRodHRwLnBvc3QoJ21vZHVsZXMvbWFjaGluZS9tb2R1bGVzL21hY2hpbmUudXBkYXRlL21hY2hpbmUudXBkYXRlLm1kbC5nZXRtYWNoaW5lLnBocCcsIHtcbiAgICAgICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgICAgICBtYV9pZDogJHN0YXRlUGFyYW1zLm1hX2lkXG4gICAgICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkudXBkYXRlID0gZnVuY3Rpb24gKG1hX2pzb25iKSB7XG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KCdtb2R1bGVzL21hY2hpbmUvbW9kdWxlcy9tYWNoaW5lLnVwZGF0ZS9tYWNoaW5lLnVwZGF0ZS5tZGwudXBkYXRlLnBocCcsIHtcbiAgICAgICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgICAgICBtYV9pZDogJHN0YXRlUGFyYW1zLm1hX2lkLFxuICAgICAgICAgICAgICAgICAgICBtYV9qc29uYjogbWFfanNvbmJcbiAgICAgICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeS5nZXRDb3VudHJpZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9ICRodHRwLmdldCgnaHR0cDovL2FwaS5nZW9uYW1lcy5vcmcvY291bnRyeUluZm9KU09OP3VzZXJuYW1lPWFsZWphbmRyb2xzY2EnKVxuICAgICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeS5nZXRTdGF0ZXMgPSBmdW5jdGlvbiAobWFfY291bnRyeSkge1xuICAgICAgICAgICAgdmFyIHByb21pc2UgPSAkaHR0cC5nZXQoJ2h0dHA6Ly9hcGkuZ2VvbmFtZXMub3JnL2NoaWxkcmVuSlNPTj9nZW9uYW1lSWQ9JyArIG1hX2NvdW50cnkgKyAnJnVzZXJuYW1lPWFsZWphbmRyb2xzY2EnKVxuICAgICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeS5nZXRDaXR5Q291bnR5ID0gZnVuY3Rpb24gKG1hX3N0YXRlKSB7XG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9ICRodHRwLmdldCgnaHR0cDovL2FwaS5nZW9uYW1lcy5vcmcvY2hpbGRyZW5KU09OP2dlb25hbWVJZD0nICsgbWFfc3RhdGUgKyAnJnVzZXJuYW1lPWFsZWphbmRyb2xzY2EnKVxuICAgICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGZhY3Rvcnk7XG4gICAgfV07XG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKGFuZ3VsYXIpe1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBcbiAgICByZXR1cm4gYW5ndWxhci5tb2R1bGUoJ2FwcC5wYXBlcicsW1xuICAgICAgICByZXF1aXJlKCcuL21vZHVsZXMvcGFwZXIuYWRkJykubmFtZSxcbiAgICAgICAgcmVxdWlyZSgnLi9tb2R1bGVzL3BhcGVyLnVwZGF0ZScpLm5hbWVcbiAgICBdKVxuXG4gICAgLmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsXG4gICAgZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgncGFwZXInLCB7XG4gICAgICAgICAgICB1cmw6Jy9wYXBlcicsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybCA6ICdhcHAvcGFwZXIvcGFwZXIudmlldy5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXIgOiAncGFwZXJDdHJsJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICByZXF1aXJlc0xvZ2luOiB0cnVlXG4gICAgICAgICAgICB9ICAgIFxuICAgICAgICB9KTtcbiAgICB9XSlcblxuICAgIC5mYWN0b3J5KCdwYXBlckZhYycscmVxdWlyZSgnLi9wYXBlci5mYWMnKSlcblxuICAgIC5jb250cm9sbGVyKCdwYXBlckN0cmwnLHJlcXVpcmUoJy4vcGFwZXIuY3RybCcpKVxuICAgIFxufSkoYW5ndWxhcik7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiIDogXCJQYXBlbFwiLFxuICAgICAgICAgICAgICAgICAgICBcImxhYmVsc1wiOntcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicGEtaWRcIjpcIklEIFBhcGVsXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN1LWlkXCI6XCJJRCBQcm92ZWVkb3JcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicGEtY29kZVwiOlwiQ29kaWdvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInBhLXR5cGVcIjpcIlRpcG9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicGEtZGVzY3JpcHRpb25cIjpcIkRlc2NyaXBjacOzblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwYS13ZWlnaHRcIjpcIlBlc29cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicGEtd2lkdGhcIjpcIkFuY2hvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInBhLWhlaWdodFwiOlwiQWx0dXJhXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInBhLW1lYXN1cmVcIjpcIk1lZGlkYVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwYS1wcmljZVwiOlwiUHJlY2lvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInBhLXN0YXR1c1wiOlwiRXN0YXR1c1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwYS1kYXRlXCI6XCJGZWNoYVwiLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgXCJjb2x1bW5zXCI6W1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJwYV9pZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdV9pZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwYV9jb2RlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInBhX3R5cGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicGFfZGVzY3JpcHRpb25cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicGFfd2VpZ2h0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInBhX3dpZHRoXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInBhX2hlaWdodFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwYV9tZWFzdXJlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInBhX3ByaWNlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInBhX3N0YXR1c1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwYV9kYXRlXCIsXG4gICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgXCJmaWVsZHNcIiA6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhX3N0YXR1c29wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkFjdGl2b1wiLFwidmFsdWVcIjpcIkFcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkluYWN0aXZvXCIsXCJ2YWx1ZVwiOlwiSVwifVxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhX3R5cGVvcHRpb25zIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJQYXBlbFwiLFwidmFsdWVcIjpcInBhcGVyXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJDYXJ0dWxpbmFcIixcInZhbHVlXCI6XCJwb3N0ZXJfYm9hcmRcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIlBhcGVsIEFkaGVzaXZvXCIsXCJ2YWx1ZVwiOlwiYWRoZXNpdmVfcGFwZXJcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIlBlbGljdWxhIEFkaGVzaXZhXCIsXCJ2YWx1ZVwiOlwiYWRoZXNpdmUgZmlsbVwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiU8OtbnRldGljb1wiLFwidmFsdWVcIjpcInN5bnRoZXRpY1wifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiUGxhc3RpY29zXCIsXCJ2YWx1ZVwiOlwicGxhc3RpY3NcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIlRlcm1hbCBUcmFuc2ZlclwiLFwidmFsdWVcIjpcInRlcm1hbCB0cmFuc2ZlclwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiRGlyZWN0IFRlcm1hbFwiLFwidmFsdWVcIjpcImRpcmVjdF90ZXJtYWxcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIk90cm9zXCIsXCJ2YWx1ZVwiOlwib3RoZXJcIn1cbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBwYV9tZWFzdXJlb3B0aW9ucyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiY21cIixcInZhbHVlXCI6XCJjbVwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwicHVsZ2FkYXNcIixcInZhbHVlXCI6XCJpblwifVxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0iLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbihhbmd1bGFyKXtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgXG4gICAgcmV0dXJuIGFuZ3VsYXIubW9kdWxlKCdhcHAucGFwZXIuYWRkJyxbXSlcblxuICAgIC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLFxuICAgIGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcbiAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3BhcGVyQWRkJywge1xuICAgICAgICAgICAgdXJsOicvcGFwZXIvYWRkJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsIDogJ2FwcC9wYXBlci9tb2R1bGVzL3BhcGVyLmFkZC9wYXBlci5hZGQudmlldy5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXIgOiAncGFwZXJBZGRDdHJsJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICByZXF1aXJlc0xvZ2luOiB0cnVlXG4gICAgICAgICAgICB9ICAgIFxuICAgICAgICB9KTtcbiAgICB9XSlcblxuICAgIC5mYWN0b3J5KCdwYXBlckFkZEZhYycscmVxdWlyZSgnLi9wYXBlci5hZGQuZmFjJykpXG5cbiAgICAuY29udHJvbGxlcigncGFwZXJBZGRDdHJsJyxyZXF1aXJlKCcuL3BhcGVyLmFkZC5jdHJsJykpXG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCIgOiBcImFncmVnYXIgcGFwZWxcIixcbiAgICAgICAgICAgICAgICB9IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckc2NvcGUnLCAncGFwZXJBZGRGYWMnLCAnJGxvY2F0aW9uJywgJ2kxOG5GaWx0ZXInLFxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCBwYXBlckFkZEZhYywgJGxvY2F0aW9uLCBpMThuRmlsdGVyKSB7XG4gICAgICAgICAgICAkc2NvcGUuZm1EYXRhID0ge307XG5cbiAgICAgICAgICAgICRzY29wZS5vblN1Ym1pdCA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgIHBhcGVyQWRkRmFjLmFkZCgkc2NvcGUuZm1EYXRhKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9taXNlLmRhdGEgPT0gXCIxXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvcGFwZXInKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS51cGRhdGVGYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgJHNjb3BlLnBhX3N0YXR1c29wdGlvbnMgPSBpMThuRmlsdGVyKFwicGFwZXIuZmllbGRzLnBhX3N0YXR1c29wdGlvbnNcIik7XG4gICAgICAgICAgICAkc2NvcGUucGFfdHlwZW9wdGlvbnMgPSBpMThuRmlsdGVyKFwicGFwZXIuZmllbGRzLnBhX3R5cGVvcHRpb25zXCIpO1xuICAgICAgICAgICAgJHNjb3BlLnBhX21lYXN1cmVvcHRpb25zID0gaTE4bkZpbHRlcihcInBhcGVyLmZpZWxkcy5wYV9tZWFzdXJlb3B0aW9uc1wiKTtcblxuICAgICAgICAgICAgJHNjb3BlLiRvbignJHZpZXdDb250ZW50TG9hZGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIC8vIHRoaXMgY29kZSBpcyBleGVjdXRlZCBhZnRlciB0aGUgdmlldyBpcyBsb2FkZWRcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHBhcGVyQWRkRmFjLmdldFN1cHBsaWVycygpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuc3VfaWRvcHRpb25zID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2gocHJvbWlzZS5kYXRhLCBmdW5jdGlvbiAodmFsdWUsIGtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHVzaCh7IFwibGFiZWxcIjogdmFsdWUuc3VfY29ycG9yYXRlbmFtZSwgXCJ2YWx1ZVwiOiB2YWx1ZS5zdV9pZCB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sICRzY29wZS5zdV9pZG9wdGlvbnMpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8kc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1dO1xuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbihhbmd1bGFyKXtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgXG4gICAgcmV0dXJuIFsnJGh0dHAnLCAnJHEnLCAgJyRzdGF0ZVBhcmFtcycsIGZ1bmN0aW9uKCRodHRwLCAkcSwgJHN0YXRlUGFyYW1zKXtcbiAgICAgICAgdmFyIGZhY3RvcnkgPSB7fTtcbiAgICAgICAgZmFjdG9yeS5hZGQgPSBmdW5jdGlvbihwYV9qc29uYikge1xuICAgICAgICAgICAgdmFyIHByb21pc2UgPSAkaHR0cC5wb3N0KCdtb2R1bGVzL3BhcGVyL21vZHVsZXMvcGFwZXIuYWRkL3BhcGVyLmFkZC5tZGwuYWRkLnBocCcsIHtcbiAgICAgICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgICAgICBwYV9qc29uYjogcGFfanNvbmJcbiAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpe1xuICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcInN0YXR1c1wiOiBmYWxzZX07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICBmYWN0b3J5LmdldFN1cHBsaWVycyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHByb21pc2UgPSAkaHR0cC5nZXQoJ21vZHVsZXMvcGFwZXIvbW9kdWxlcy9wYXBlci5hZGQvcGFwZXIuYWRkLm1kbC5nZXRTdXBwbGllcnMucGhwJylcbiAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XCJzdGF0dXNcIjogZmFsc2V9O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGZhY3Rvcnk7XG4gICAgfV07XG4gICAgXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbihhbmd1bGFyKXtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgXG4gICAgcmV0dXJuIGFuZ3VsYXIubW9kdWxlKCdhcHAucGFwZXIudXBkYXRlJyxbXSlcblxuICAgIC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLFxuICAgIGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcbiAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3BhcGVyVXBkYXRlJywge1xuICAgICAgICAgICAgdXJsOicvcGFwZXIvdXBkYXRlLzpwYV9pZCcsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybCA6ICdhcHAvcGFwZXIvbW9kdWxlcy9wYXBlci51cGRhdGUvcGFwZXIudXBkYXRlLnZpZXcuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyIDogJ3BhcGVyVXBkYXRlQ3RybCcsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgcmVxdWlyZXNMb2dpbjogdHJ1ZVxuICAgICAgICAgICAgfSAgICBcbiAgICAgICAgfSk7XG4gICAgfV0pXG5cbiAgICAuZmFjdG9yeSgncGFwZXJVcGRhdGVGYWMnLHJlcXVpcmUoJy4vcGFwZXIudXBkYXRlLmZhYycpKVxuXG4gICAgLmNvbnRyb2xsZXIoJ3BhcGVyVXBkYXRlQ3RybCcscmVxdWlyZSgnLi9wYXBlci51cGRhdGUuY3RybCcpKVxuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiIDogXCJhY3R1YWxpemFyIHBhcGVsXCIsXG4gICAgICAgICAgICAgICAgfSIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgcmV0dXJuIFsnJHNjb3BlJywgJ3BhcGVyVXBkYXRlRmFjJywgJyRsb2NhdGlvbicsICdpMThuRmlsdGVyJyxcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgcGFwZXJVcGRhdGVGYWMsICRsb2NhdGlvbiwgaTE4bkZpbHRlcikge1xuXG4gICAgICAgICAgICAkc2NvcGUub25TdWJtaXQgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICBwYXBlclVwZGF0ZUZhYy51cGRhdGUoJHNjb3BlLmZtRGF0YSkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocHJvbWlzZS5kYXRhID09IFwiMVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3BhcGVyJyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICRzY29wZS5wYV9zdGF0dXNvcHRpb25zID0gaTE4bkZpbHRlcihcInBhcGVyLmZpZWxkcy5wYV9zdGF0dXNvcHRpb25zXCIpO1xuICAgICAgICAgICAgJHNjb3BlLnBhX3R5cGVvcHRpb25zID0gaTE4bkZpbHRlcihcInBhcGVyLmZpZWxkcy5wYV90eXBlb3B0aW9uc1wiKTtcbiAgICAgICAgICAgICRzY29wZS5wYV9tZWFzdXJlb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJwYXBlci5maWVsZHMucGFfbWVhc3VyZW9wdGlvbnNcIik7XG5cbiAgICAgICAgICAgICRzY29wZS4kb24oJyR2aWV3Q29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAvLyB0aGlzIGNvZGUgaXMgZXhlY3V0ZWQgYWZ0ZXIgdGhlIHZpZXcgaXMgbG9hZGVkXG4gICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHBhcGVyVXBkYXRlRmFjLmRhdGEoKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzT2JqZWN0KGFuZ3VsYXIuZnJvbUpzb24ocHJvbWlzZS5kYXRhKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5mbURhdGEgPSBhbmd1bGFyLmZyb21Kc29uKHByb21pc2UuZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgcGFwZXJVcGRhdGVGYWMuZ2V0U3VwcGxpZXJzKCkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnN1X2lkb3B0aW9ucyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChwcm9taXNlLmRhdGEsIGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHVzaCh7IFwibGFiZWxcIjogdmFsdWUuc3VfY29ycG9yYXRlbmFtZSwgXCJ2YWx1ZVwiOiB2YWx1ZS5zdV9pZCB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCAkc2NvcGUuc3VfaWRvcHRpb25zKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8kc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfV07XG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgcmV0dXJuIFsnJGh0dHAnLCAnJHEnLCAgJyRzdGF0ZVBhcmFtcycsIGZ1bmN0aW9uICgkaHR0cCwgJHEsICRzdGF0ZVBhcmFtcykge1xuICAgICAgICB2YXIgZmFjdG9yeSA9IHt9O1xuICAgICAgICBmYWN0b3J5LmRhdGEgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KCdtb2R1bGVzL3BhcGVyL21vZHVsZXMvcGFwZXIudXBkYXRlL3BhcGVyLnVwZGF0ZS5tZGwuZ2V0cGFwZXIucGhwJywge1xuICAgICAgICAgICAgICAgICAgICAvKiBQT1NUIHZhcmlhYmxlcyBoZXJlICovXG4gICAgICAgICAgICAgICAgICAgIHBhX2lkOiAkc3RhdGVQYXJhbXMucGFfaWRcbiAgICAgICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkudXBkYXRlID0gZnVuY3Rpb24gKHBhX2pzb25iKSB7XG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KCdtb2R1bGVzL3BhcGVyL21vZHVsZXMvcGFwZXIudXBkYXRlL3BhcGVyLnVwZGF0ZS5tZGwudXBkYXRlLnBocCcsIHtcbiAgICAgICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgICAgICBwYV9pZDogJHN0YXRlUGFyYW1zLnBhX2lkLFxuICAgICAgICAgICAgICAgICAgICBwYV9qc29uYjogcGFfanNvbmJcbiAgICAgICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkuZ2V0U3VwcGxpZXJzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHByb21pc2UgPSAkaHR0cC5nZXQoJ21vZHVsZXMvcGFwZXIvbW9kdWxlcy9wYXBlci5hZGQvcGFwZXIuYWRkLm1kbC5nZXRTdXBwbGllcnMucGhwJylcbiAgICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBmYWN0b3J5O1xuICAgIH1dO1xuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbihhbmd1bGFyKXtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgXG4gICAgcmV0dXJuIFsnJHNjb3BlJywgJ3BhcGVyRmFjJywgJ2kxOG5GaWx0ZXInLFxuICAgIGZ1bmN0aW9uICgkc2NvcGUsIHBhcGVyRmFjLCBpMThuRmlsdGVyKSB7XG4gICAgXG4gICAgICAgICRzY29wZS5sYWJlbHMgPSBPYmplY3Qua2V5cyhpMThuRmlsdGVyKFwicGFwZXIubGFiZWxzXCIpKTtcbiAgICAgICAgJHNjb3BlLmNvbHVtbnMgPSBpMThuRmlsdGVyKFwicGFwZXIuY29sdW1uc1wiKTtcbiAgICAgICAgXG4gICAgICAgIC8vIGZvcm1hdEl0ZW0gZXZlbnQgaGFuZGxlclxuICAgICAgICB2YXIgcGFfaWQ7XG4gICAgICAgICRzY29wZS5mb3JtYXRJdGVtID0gZnVuY3Rpb24ocywgZSwgY2VsbCkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoZS5wYW5lbC5jZWxsVHlwZSA9PSB3aWptby5ncmlkLkNlbGxUeXBlLlJvd0hlYWRlcikge1xuICAgICAgICAgICAgICAgIGUuY2VsbC50ZXh0Q29udGVudCA9IGUucm93KzE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHMucm93cy5kZWZhdWx0U2l6ZSA9IDMwO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBhZGQgQm9vdHN0cmFwIGh0bWxcbiAgICAgICAgICAgIGlmICgoZS5wYW5lbC5jZWxsVHlwZSA9PSB3aWptby5ncmlkLkNlbGxUeXBlLkNlbGwpICYmIChlLmNvbCA9PSAwKSkge1xuICAgICAgICAgICAgICAgIHBhX2lkID0gZS5wYW5lbC5nZXRDZWxsRGF0YShlLnJvdywxLGZhbHNlKTtcbiAgICAgICAgICAgICAgICBlLmNlbGwuc3R5bGUub3ZlcmZsb3cgPSAndmlzaWJsZSc7XG4gICAgICAgICAgICAgICAgZS5jZWxsLmlubmVySFRNTCA9ICc8ZGl2IGNsYXNzPVwiYnRuLWdyb3VwIGJ0bi1ncm91cC1qdXN0aWZpZWRcIiByb2xlPVwiZ3JvdXBcIiBhcmlhLWxhYmVsPVwiLi4uXCI+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYnRuLWdyb3VwXCIgcm9sZT1cImdyb3VwXCI+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cIiMvcGFwZXIvdXBkYXRlLycrcGFfaWQrJ1wiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0IGJ0bi14c1wiIG5nLWNsaWNrPVwiZWRpdCgkaXRlbS5wYV9pZClcIj5FZGl0YXI8L2E+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy8gYmluZCBjb2x1bW5zIHdoZW4gZ3JpZCBpcyBpbml0aWFsaXplZFxuICAgICAgICAkc2NvcGUuaW5pdEdyaWQgPSBmdW5jdGlvbihzLCBlKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8ICRzY29wZS5sYWJlbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgY29sID0gbmV3IHdpam1vLmdyaWQuQ29sdW1uKCk7XG4gICAgICAgICAgICAgICAgY29sLmJpbmRpbmcgPSAkc2NvcGUuY29sdW1uc1tpXTtcbiAgICAgICAgICAgICAgICBjb2wuaGVhZGVyID0gaTE4bkZpbHRlcihcInBhcGVyLmxhYmVscy5cIiArICRzY29wZS5sYWJlbHNbaV0pO1xuICAgICAgICAgICAgICAgIGNvbC53b3JkV3JhcCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGNvbC53aWR0aCA9IDE1MDtcbiAgICAgICAgICAgICAgICBzLmNvbHVtbnMucHVzaChjb2wpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICAvLyBjcmVhdGUgdGhlIHRvb2x0aXAgb2JqZWN0XG4gICAgICAgICRzY29wZS4kd2F0Y2goJ2dnR3JpZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICgkc2NvcGUuZ2dHcmlkKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIHN0b3JlIHJlZmVyZW5jZSB0byBncmlkXG4gICAgICAgICAgICAgICAgdmFyIGZsZXggPSAkc2NvcGUuZ2dHcmlkO1xuXG4gICAgICAgICAgICAgICAgLy8gY3JlYXRlIHRvb2x0aXBcbiAgICAgICAgICAgICAgICB2YXIgdGlwID0gbmV3IHdpam1vLlRvb2x0aXAoKSxcbiAgICAgICAgICAgICAgICAgICAgcm5nID0gbnVsbDtcblxuICAgICAgICAgICAgICAgIC8vIG1vbml0b3IgdGhlIG1vdXNlIG92ZXIgdGhlIGdyaWRcbiAgICAgICAgICAgICAgICBmbGV4Lmhvc3RFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGh0ID0gZmxleC5oaXRUZXN0KGV2dCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghaHQucmFuZ2UuZXF1YWxzKHJuZykpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbmV3IGNlbGwgc2VsZWN0ZWQsIHNob3cgdG9vbHRpcFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGh0LmNlbGxUeXBlID09IHdpam1vLmdyaWQuQ2VsbFR5cGUuQ2VsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJuZyA9IGh0LnJhbmdlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb2wgPSBmbGV4LmNvbHVtbnNbcm5nLmNvbF0uaGVhZGVyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjZWxsRWxlbWVudCA9IGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQoZXZ0LmNsaWVudFgsIGV2dC5jbGllbnRZKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2VsbEJvdW5kcyA9IHdpam1vLlJlY3QuZnJvbUJvdW5kaW5nUmVjdChjZWxsRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEgPSB3aWptby5lc2NhcGVIdG1sKGZsZXguZ2V0Q2VsbERhdGEocm5nLnJvdywgcm5nLmNvbCwgdHJ1ZSkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXBDb250ZW50ID0gY29sICsgJzogXCI8Yj4nICsgZGF0YSArICc8L2I+XCInO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjZWxsRWxlbWVudC5jbGFzc05hbWUuaW5kZXhPZignd2otY2VsbCcpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlwLnNob3coZmxleC5ob3N0RWxlbWVudCwgdGlwQ29udGVudCwgY2VsbEJvdW5kcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlwLmhpZGUoKTsgLy8gY2VsbCBtdXN0IGJlIGJlaGluZCBzY3JvbGwgYmFyLi4uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgZmxleC5ob3N0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGlwLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgcm5nID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHNjb3BlLiRvbignJHZpZXdDb250ZW50TG9hZGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLy8gdGhpcyBjb2RlIGlzIGV4ZWN1dGVkIGFmdGVyIHRoZSB2aWV3IGlzIGxvYWRlZFxuICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgcGFwZXJGYWMuZGF0YSgpLnRoZW4oZnVuY3Rpb24ocHJvbWlzZSl7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBpZihhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZGF0YSA9IG5ldyB3aWptby5jb2xsZWN0aW9ucy5Db2xsZWN0aW9uVmlldyhwcm9taXNlLmRhdGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgfSk7XG4gICAgfV07XG4gICAgXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRodHRwJywgJyRxJywgIGZ1bmN0aW9uICgkaHR0cCwgJHEpIHtcbiAgICAgICAgdmFyIGZhY3RvcnkgPSB7fTtcbiAgICAgICAgZmFjdG9yeS5kYXRhID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoXG4gICAgICAgICAgICAgICAgJGh0dHAucG9zdCgnbW9kdWxlcy9wYXBlci9wYXBlci5tZGwuZ2V0cGFwZXJzLnBocCcsIHtcbiAgICAgICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgICAgICBwcm9jY2VzX2lkOiBuZXcgRGF0ZSgpLmdldE1pbGxpc2Vjb25kcygpXG4gICAgICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBmYWN0b3J5O1xuICAgIH1dO1xuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbihhbmd1bGFyKXtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgXG4gICAgcmV0dXJuIGFuZ3VsYXIubW9kdWxlKCdhcHAucHJvZHVjdCcsW1xuICAgICAgICByZXF1aXJlKCcuL21vZHVsZXMvcHJvZHVjdE9mZnNldEdlbmVyYWwuYWRkJykubmFtZSxcbiAgICAgICAgcmVxdWlyZSgnLi9tb2R1bGVzL3Byb2R1Y3RPZmZzZXRHZW5lcmFsLnVwZGF0ZScpLm5hbWUsXG4gICAgICAgIHJlcXVpcmUoJy4vbW9kdWxlcy9wcm9kdWN0T2Zmc2V0UGFnaW5hdGVkLmFkZCcpLm5hbWUsXG4gICAgICAgIC8vcmVxdWlyZSgnLi9tb2R1bGVzL3Byb2R1Y3RPZmZzZXRQYWdpbmF0ZWQudXBkYXRlJykubmFtZVxuICAgIF0pXG5cbiAgICAuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJyxcbiAgICBmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdwcm9kdWN0Jywge1xuICAgICAgICAgICAgdXJsOicvcHJvZHVjdC86Y2xfaWQnLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmwgOiAnYXBwL3Byb2R1Y3QvcHJvZHVjdC52aWV3Lmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlciA6ICdwcm9kdWN0Q3RybCcsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgcmVxdWlyZXNMb2dpbjogdHJ1ZVxuICAgICAgICAgICAgfSAgICBcbiAgICAgICAgfSk7XG4gICAgfV0pXG5cbiAgICAuZmFjdG9yeSgncHJvZHVjdEZhYycscmVxdWlyZSgnLi9wcm9kdWN0LmZhYycpKVxuXG4gICAgLmNvbnRyb2xsZXIoJ3Byb2R1Y3RDdHJsJyxyZXF1aXJlKCcuL3Byb2R1Y3QuY3RybCcpKVxuICAgIFxufSkoYW5ndWxhcik7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiIDogXCJQcm9kdWN0b3NcIixcbiAgICAgICAgICAgICAgICAgICAgXCJsYWJlbHNcIjp7XG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLWlkXCI6IFwiSUQgcHJvZHVjdG9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2wtaWRcIjogXCJJRCBDbGllbnRlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLXBhcnRub1wiOiBcIk5vLiBQYXJ0ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1jb2RlXCI6IFwiQ29kaWdvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLW5hbWVcIjogXCJOb21icmVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItcHJvY2Vzc1wiOiBcIlByb2Nlc29cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItdHlwZVwiOiBcIlRpcG9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItc3RhdHVzXCI6IFwiRXN0YXR1c1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1kYXRlXCI6IFwiRmVjaGFcIixcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgXCJjb2x1bW5zXCI6W1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9pZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbF9pZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9wYXJ0bm9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfY29kZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9uYW1lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX3Byb2Nlc3NcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfdHlwZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9zdGF0dXNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfZGF0ZVwiLFxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgXCJmaWVsZHNcIiA6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0iLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbihhbmd1bGFyKXtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgXG4gICAgcmV0dXJuIGFuZ3VsYXIubW9kdWxlKCdhcHAucHJvZHVjdE9mZnNldEdlbmVyYWwuYWRkJyxbXSlcblxuICAgIC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLFxuICAgIGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcbiAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3Byb2R1Y3RPZmZzZXRHZW5lcmFsQWRkJywge1xuICAgICAgICAgICAgdXJsOicvcHJvZHVjdC9hZGQvb2Zmc2V0L2dlbmVyYWwvOmNsX2lkJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsIDogJ2FwcC9wcm9kdWN0L21vZHVsZXMvcHJvZHVjdE9mZnNldEdlbmVyYWwuYWRkL3Byb2R1Y3RPZmZzZXRHZW5lcmFsLmFkZC52aWV3Lmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlciA6ICdwcm9kdWN0T2Zmc2V0R2VuZXJhbEFkZEN0cmwnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHJlcXVpcmVzTG9naW46IHRydWVcbiAgICAgICAgICAgIH0gICAgXG4gICAgICAgIH0pO1xuICAgIH1dKVxuXG4gICAgLmZhY3RvcnkoJ3Byb2R1Y3RPZmZzZXRHZW5lcmFsQWRkRmFjJyxyZXF1aXJlKCcuL3Byb2R1Y3RPZmZzZXRHZW5lcmFsLmFkZC5mYWMnKSlcblxuICAgIC5jb250cm9sbGVyKCdwcm9kdWN0T2Zmc2V0R2VuZXJhbEFkZEN0cmwnLHJlcXVpcmUoJy4vcHJvZHVjdE9mZnNldEdlbmVyYWwuYWRkLmN0cmwnKSlcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIiA6IFwiYWdyZWdhciBwcm9kdWN0b1wiLFxuICAgICAgICAgICAgICAgICAgICBcImxhYmVsc1wiOntcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItaWRcIjogXCJJRCBwcm9kdWN0b1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbC1pZFwiOiBcIklEIGNsaWVudGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItcHJvY2Vzc1wiOiBcIlByb2Nlc29cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItdHlwZVwiOiBcIlRpcG9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItcGFydG5vXCI6IFwiTm8uIHBhcnRlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLWNvZGVcIjogXCJDb2RpZ29cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItZGVzY3JpcHRpb25cIjogXCJEZXNjcmlwY2lvblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1maW5hbHNpemV3aWR0aFwiOiBcIkFuY2hvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLWZpbmFsc2l6ZWhlaWdodFwiOiBcIkFsdG9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItZmluYWxzaXplbWVhc3VyZVwiOiBcIk1lZGlkYVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1pbmtmcm9udFwiOiBcIkZyZW50ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1pbmtiYWNrXCI6IFwiUmV2ZXJzb1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwYS1pZFwiOiBcIklEIHBhcGVsXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLXBhcGVyc2l6ZXdpZHRoXCI6IFwiQW5jaG9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItcGFwZXJzaXplaGVpZ2h0XCI6IFwiQWx0b1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1wYXBlcnNpemVtZWFzdXJlXCI6IFwiTWVkaWRhXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLXBhcGVyZm9ybWF0c3F0eVwiOiBcIkZvcm1hdG9zXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLXZhcm5pc2hcIjogXCJCYXJuaXpcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItdmFybmlzaHV2XCI6IFwiQmFybml6IFVWXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLXZhcm5pc2hmaW5pc2hlZFwiOiBcIkFjYWJhZG9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItbGFtaW5hdGVcIjogXCJMYW1pbmFkb1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1sYW1pbmF0ZWZpbmlzaGVkXCI6IFwiQWNhYmFkb1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1sYW1pbmF0ZWNhbGliZXJcIjogXCJDYWxpYnJlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLWxhbWluYXRlc2lkZXNcIjogXCJDYXJhc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1mb2xpb1wiOiBcIkZvbGlvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLXByZWN1dFwiOiBcIlByZWNvcnRlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLWZvbGRcIjogXCJEb2JsZXpcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItZGllY3V0dGluZ1wiOiBcIlN1YWplXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLWRpZWN1dHRpbmdxdHlcIjogXCJOby4gU3VhamVzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLXJlaW5mb3JjZW1lbnRcIjogXCJSZWZ1ZXJ6b1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1jb3JkXCI6IFwiQ29yZMOzblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci13aXJlXCI6IFwiQWzDoW1icmVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItYmxvY2tzXCI6IFwiQmxvY2tzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLXN0YXR1c1wiOiBcIkVzdGF0dXNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItZGF0ZVwiOiBcIkZlY2hhXCIsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIFwiY29sdW1uc1wiOltcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfaWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xfaWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfcHJvY2Vzc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl90eXBlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX3BhcnRub1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9jb2RlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX2Rlc2NyaXB0aW9uXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX2ZpbmFsc2l6ZXdpZHRoXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX2ZpbmFsc2l6ZWhlaWdodFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9maW5hbHNpemVtZWFzdXJlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX2lua2Zyb250XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX2lua2JhY2tcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicGFfaWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfcGFwZXJzaXpld2lkdGhcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfcGFwZXJzaXplaGVpZ2h0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX3BhcGVyc2l6ZW1lYXN1cmVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfcGFwZXJmb3JtYXRzcXR5XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX3Zhcm5pc2hcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfdmFybmlzaHV2XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX3Zhcm5pc2hmaW5pc2hlZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9sYW1pbmF0ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9sYW1pbmF0ZWZpbmlzaGVkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX2xhbWluYXRlY2FsaWJlclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9sYW1pbmF0ZXNpZGVzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX2ZvbGlvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX3ByZWN1dFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9mb2xkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX2RpZWN1dHRpbmdcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfZGllY3V0dGluZ3F0eVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9yZWluZm9yY2VtZW50XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX2NvcmRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfd2lyZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9ibG9ja3NcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfc3RhdHVzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX2RhdGVcIixcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgIFwiZmllbGRzXCIgOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcl9maW5hbHNpemVtZWFzdXJlb3B0aW9ucyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiY21cIixcInZhbHVlXCI6XCJjbVwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwicHVsZ2FkYXNcIixcInZhbHVlXCI6XCJpblwifVxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHByX2lua2Zyb250b3B0aW9ucyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiMSB0aW50YVwiLFwidmFsdWVcIjoxfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiMiB0aW50YXNcIixcInZhbHVlXCI6Mn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIjMgdGludGFzXCIsXCJ2YWx1ZVwiOjN9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCI0IHRpbnRhc1wiLFwidmFsdWVcIjo0fSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiNSB0aW50YXNcIixcInZhbHVlXCI6NX0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIjYgdGludGFzXCIsXCJ2YWx1ZVwiOjZ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCI3IHRpbnRhc1wiLFwidmFsdWVcIjo3fSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiOCB0aW50YXNcIixcInZhbHVlXCI6OH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJfaW5rYmFja29wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIjEgdGludGFcIixcInZhbHVlXCI6MX0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIjIgdGludGFzXCIsXCJ2YWx1ZVwiOjJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCIzIHRpbnRhc1wiLFwidmFsdWVcIjozfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiNCB0aW50YXNcIixcInZhbHVlXCI6NH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIjUgdGludGFzXCIsXCJ2YWx1ZVwiOjV9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCI2IHRpbnRhc1wiLFwidmFsdWVcIjo2fSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiNyB0aW50YXNcIixcInZhbHVlXCI6N30sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIjggdGludGFzXCIsXCJ2YWx1ZVwiOjh9LFxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHByX3BhcGVyc2l6ZW1lYXN1cmVvcHRpb25zIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJjbVwiLFwidmFsdWVcIjpcImNtXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJwdWxnYWRhc1wiLFwidmFsdWVcIjpcImluXCJ9XG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJfdmFybmlzaG9wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIlNpXCIsXCJ2YWx1ZVwiOlwieWVzXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJOb1wiLFwidmFsdWVcIjpcIm5vXCJ9XG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJfdmFybmlzaHV2b3B0aW9ucyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiVW5hIGNhcmFcIixcInZhbHVlXCI6XCJvbmVzaWRlXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJEb3MgY2FyYXNcIixcInZhbHVlXCI6XCJ0d29zaWRlc1wifVxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHByX3Zhcm5pc2ZpbmlzaGVkb3B0aW9ucyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiTWF0ZVwiLFwidmFsdWVcIjpcIm1hdHRlXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJCcmlsbGFudGVcIixcInZhbHVlXCI6XCJicmlnaHRcIn1cbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBwcl9sYW1pbmF0ZW9wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIlNpXCIsXCJ2YWx1ZVwiOlwieWVzXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJOb1wiLFwidmFsdWVcIjpcIm5vXCJ9XG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJfbGFtaW5hdGVmaW5pc2hlZG9wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIk1hdGVcIixcInZhbHVlXCI6XCJtYXR0ZVwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiQnJpbGxhbnRlXCIsXCJ2YWx1ZVwiOlwiYnJpZ2h0XCJ9XG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJfbGFtaW5hdGVjYWxpYmVyb3B0aW9ucyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiLjJtbVwiLFwidmFsdWVcIjpcIjJtbVwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiLjRtbVwiLFwidmFsdWVcIjpcIjRtbVwifVxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHByX2xhbWluYXRlc2lkZXNvcHRpb25zIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJVbmEgY2FyYVwiLFwidmFsdWVcIjpcIm9uZXNpZGVcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkRvcyBjYXJhc1wiLFwidmFsdWVcIjpcInR3b3NpZGVzXCJ9XG4gICAgICAgICAgICAgICAgICAgICAgICBdLHByX2ZvbGlvb3B0aW9ucyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiU2lcIixcInZhbHVlXCI6XCJ5ZXNcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIk5vXCIsXCJ2YWx1ZVwiOlwibm9cIn1cbiAgICAgICAgICAgICAgICAgICAgICAgIF0scHJfcHJlY3V0b3B0aW9ucyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiTm9cIixcInZhbHVlXCI6XCJub1wifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiSG9yaXpvbnRhbFwiLFwidmFsdWVcIjpcImhvcml6b250YWxcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIlZlcnRpY2FsXCIsXCJ2YWx1ZVwiOlwidmVydGljYWxcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICBdLHByX2ZvbGRvcHRpb25zIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJUcmlwdGljb1wiLFwidmFsdWVcIjpcInRyeXB0aWNcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICBdLHByX2RpZWN1dHRpbmdvcHRpb25zIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJTaVwiLFwidmFsdWVcIjpcInllc1wifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiTm9cIixcInZhbHVlXCI6XCJub1wifVxuICAgICAgICAgICAgICAgICAgICAgICAgXSxwcl9yZWluZm9yY2VtZW50b3B0aW9ucyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiTm9cIixcInZhbHVlXCI6XCJub1wifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiVW5vXCIsXCJ2YWx1ZVwiOlwib25lXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJEb3NcIixcInZhbHVlXCI6XCJ0d29cIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICBdLHByX2NvcmRvcHRpb25zIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJOb1wiLFwidmFsdWVcIjpcIm5vXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJDb2xvY2Fkb1wiLFwidmFsdWVcIjpcImFsbG9jYXRlZFwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiU2VwYXJhZG9cIixcInZhbHVlXCI6XCJzZXBhcmF0ZWRcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICBdLHByX3dpcmVvcHRpb25zIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJOb1wiLFwidmFsdWVcIjpcIm5vXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJDb2xvY2Fkb1wiLFwidmFsdWVcIjpcImFsbG9jYXRlZFwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiU2VwYXJhZG9cIixcInZhbHVlXCI6XCJzZXBhcmF0ZWRcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICBdLHByX2Jsb2Nrc29wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIk5vXCIsXCJ2YWx1ZVwiOlwibm9cIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIjIwXCIsXCJ2YWx1ZVwiOlwiMjBcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIjI1XCIsXCJ2YWx1ZVwiOlwiMjVcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIjUwXCIsXCJ2YWx1ZVwiOlwiNTBcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIjc1XCIsXCJ2YWx1ZVwiOlwiNzVcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIjEwMFwiLFwidmFsdWVcIjpcIjEwMFwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBwcl9zdGF0dXNvcHRpb25zIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJBY3Rpdm9cIixcInZhbHVlXCI6XCJBXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJJbmFjdGl2b1wiLFwidmFsdWVcIjpcIklcIn1cbiAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckc2NvcGUnLCAncHJvZHVjdE9mZnNldEdlbmVyYWxBZGRGYWMnLCAnJGxvY2F0aW9uJywgJ2kxOG5GaWx0ZXInLCAnJHN0YXRlUGFyYW1zJyxcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgcHJvZHVjdE9mZnNldEdlbmVyYWxBZGRGYWMsICRsb2NhdGlvbiwgaTE4bkZpbHRlciwgJHN0YXRlUGFyYW1zKSB7XG4gICAgICAgICAgICAkc2NvcGUuZm1EYXRhID0ge307XG4gICAgICAgICAgICAkc2NvcGUuZm1EYXRhID0geyBcInByX3Byb2Nlc3NcIjogXCJvZmZzZXRcIiwgXCJwcl90eXBlXCI6IFwiZ2VuZXJhbFwiLCBcImNsX2lkXCI6IFwiNlwiLCBcInByX3BhcnRub1wiOiBcIlRFU1QtQVNBLmFzYXM6IDIzLDM0XCIsIFwicHJfZGVzY3JpcHRpb25cIjogXCJlc3RlIGVzIHVuIHByb2R1Y3RvIGRlIHBydWViYVwiLCBcInByX2ZpbmFsc2l6ZXdpZHRoXCI6IFwiMTAwLjAwXCIsIFwicHJfZmluYWxzaXplaGVpZ2h0XCI6IFwiMjAwLjAwXCIsIFwicHJfZmluYWxzaXplbWVhc3VyZVwiOiBcImNtXCIsIFwicHJfaW5rZnJvbnRcIjogMiwgXCJwcl9pbmtzZnJvbnRcIjogeyBcIjBcIjogMiwgXCIxXCI6IDIgfSwgXCJwcl9pbmtiYWNrXCI6IDMsIFwicHJfaW5rc2JhY2tcIjogeyBcIjBcIjogMiwgXCIxXCI6IDMsIFwiMlwiOiAzIH0sIFwicGFfaWRcIjogMSwgXCJwcl9wYXBlcmZvcm1hdHNxdHlcIjogXCIxMjNcIiwgXCJwcl9wYXBlcnNpemV3aWR0aFwiOiBcIjEwMC4wMFwiLCBcInByX3BhcGVyc2l6ZWhlaWdodFwiOiBcIjIwMC4wMFwiLCBcInByX3BhcGVyc2l6ZW1lYXN1cmVcIjogXCJjbVwiLCBcInByX3Zhcm5pc2hcIjogXCJ5ZXNcIiwgXCJwcl92YXJuaXNodXZcIjogXCJvbmVzaWRlXCIsIFwicHJfdmFybmlzaGZpbmlzaGVkXCI6IFwibWF0dGVcIiwgXCJwcl9sYW1pbmF0ZVwiOiBcInllc1wiLCBcInByX2xhbWluYXRlZmluaXNoZWRcIjogXCJtYXR0ZVwiLCBcInByX2xhbWluYXRlY2FsaWJlclwiOiBcIjJtbVwiLCBcInByX3ByZWN1dFwiOiBcImhvcml6b250YWxcIiwgXCJwcl9mb2xkXCI6IFwidHJ5cHRpY1wiLCBcInByX2RpZWN1dHRpbmdcIjogXCJ5ZXNcIiwgXCJwcl9kaWVjdXR0aW5ncXR5XCI6IFwiNVwiLCBcInByX3JlaW5mb3JjZW1lbnRcIjogXCJvbmVcIiwgXCJwcl9jb3JkXCI6IFwiYWxsb2NhdGVkXCIsIFwicHJfd2lyZVwiOiBcImFsbG9jYXRlZFwiLCBcInByX2ZvbGlvXCI6IFwieWVzXCIsIFwicHJfYmxvY2tzXCI6IFwiMTAwXCIsIFwicHJfc3RhdHVzXCI6IFwiQVwiIH07XG4gICAgICAgICAgICAkc2NvcGUuZm1EYXRhLnByX3Byb2Nlc3MgPSAnb2Zmc2V0JztcbiAgICAgICAgICAgICRzY29wZS5mbURhdGEucHJfdHlwZSA9ICdnZW5lcmFsJztcbiAgICAgICAgICAgICRzY29wZS5mbURhdGEuY2xfaWQgPSAkc3RhdGVQYXJhbXMuY2xfaWQ7XG5cbiAgICAgICAgICAgICRzY29wZS5vblN1Ym1pdCA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgIHByb2R1Y3RPZmZzZXRHZW5lcmFsQWRkRmFjLmFkZCgkc2NvcGUuZm1EYXRhKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9taXNlLmRhdGEucm93Q291bnQgPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvcHJvZHVjdC8nKyRzdGF0ZVBhcmFtcy5jbF9pZCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICRzY29wZS5wcl9maW5hbHNpemVtZWFzdXJlb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJwcm9kdWN0T2Zmc2V0R2VuZXJhbC1hZGQuZmllbGRzLnByX2ZpbmFsc2l6ZW1lYXN1cmVvcHRpb25zXCIpO1xuICAgICAgICAgICAgJHNjb3BlLnByX2lua2Zyb250b3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJwcm9kdWN0T2Zmc2V0R2VuZXJhbC1hZGQuZmllbGRzLnByX2lua2Zyb250b3B0aW9uc1wiKTtcbiAgICAgICAgICAgICRzY29wZS5wcl9pbmtiYWNrb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJwcm9kdWN0T2Zmc2V0R2VuZXJhbC1hZGQuZmllbGRzLnByX2lua2JhY2tvcHRpb25zXCIpO1xuICAgICAgICAgICAgJHNjb3BlLnByX3BhcGVyc2l6ZW1lYXN1cmVvcHRpb25zID0gaTE4bkZpbHRlcihcInByb2R1Y3RPZmZzZXRHZW5lcmFsLWFkZC5maWVsZHMucHJfcGFwZXJzaXplbWVhc3VyZW9wdGlvbnNcIik7XG4gICAgICAgICAgICAkc2NvcGUucHJfdmFybmlzaG9wdGlvbnMgPSBpMThuRmlsdGVyKFwicHJvZHVjdE9mZnNldEdlbmVyYWwtYWRkLmZpZWxkcy5wcl92YXJuaXNob3B0aW9uc1wiKTtcbiAgICAgICAgICAgICRzY29wZS5wcl92YXJuaXNodXZvcHRpb25zID0gaTE4bkZpbHRlcihcInByb2R1Y3RPZmZzZXRHZW5lcmFsLWFkZC5maWVsZHMucHJfdmFybmlzaHV2b3B0aW9uc1wiKTtcbiAgICAgICAgICAgICRzY29wZS5wcl92YXJuaXNmaW5pc2hlZG9wdGlvbnMgPSBpMThuRmlsdGVyKFwicHJvZHVjdE9mZnNldEdlbmVyYWwtYWRkLmZpZWxkcy5wcl92YXJuaXNmaW5pc2hlZG9wdGlvbnNcIik7XG4gICAgICAgICAgICAkc2NvcGUucHJfbGFtaW5hdGVvcHRpb25zID0gaTE4bkZpbHRlcihcInByb2R1Y3RPZmZzZXRHZW5lcmFsLWFkZC5maWVsZHMucHJfbGFtaW5hdGVvcHRpb25zXCIpO1xuICAgICAgICAgICAgJHNjb3BlLnByX2xhbWluYXRlZmluaXNoZWRvcHRpb25zID0gaTE4bkZpbHRlcihcInByb2R1Y3RPZmZzZXRHZW5lcmFsLWFkZC5maWVsZHMucHJfbGFtaW5hdGVmaW5pc2hlZG9wdGlvbnNcIik7XG4gICAgICAgICAgICAkc2NvcGUucHJfbGFtaW5hdGVjYWxpYmVyb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJwcm9kdWN0T2Zmc2V0R2VuZXJhbC1hZGQuZmllbGRzLnByX2xhbWluYXRlY2FsaWJlcm9wdGlvbnNcIik7XG4gICAgICAgICAgICAkc2NvcGUucHJfbGFtaW5hdGVzaWRlc29wdGlvbnMgPSBpMThuRmlsdGVyKFwicHJvZHVjdE9mZnNldEdlbmVyYWwtYWRkLmZpZWxkcy5wcl9sYW1pbmF0ZXNpZGVzb3B0aW9uc1wiKTtcbiAgICAgICAgICAgICRzY29wZS5wcl9mb2xpb29wdGlvbnMgPSBpMThuRmlsdGVyKFwicHJvZHVjdE9mZnNldEdlbmVyYWwtYWRkLmZpZWxkcy5wcl9mb2xpb29wdGlvbnNcIik7XG4gICAgICAgICAgICAkc2NvcGUucHJfcHJlY3V0b3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJwcm9kdWN0T2Zmc2V0R2VuZXJhbC1hZGQuZmllbGRzLnByX3ByZWN1dG9wdGlvbnNcIik7XG4gICAgICAgICAgICAkc2NvcGUucHJfZm9sZG9wdGlvbnMgPSBpMThuRmlsdGVyKFwicHJvZHVjdE9mZnNldEdlbmVyYWwtYWRkLmZpZWxkcy5wcl9mb2xkb3B0aW9uc1wiKTtcbiAgICAgICAgICAgICRzY29wZS5wcl9kaWVjdXR0aW5nb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJwcm9kdWN0T2Zmc2V0R2VuZXJhbC1hZGQuZmllbGRzLnByX2RpZWN1dHRpbmdvcHRpb25zXCIpO1xuICAgICAgICAgICAgJHNjb3BlLnByX3JlaW5mb3JjZW1lbnRvcHRpb25zID0gaTE4bkZpbHRlcihcInByb2R1Y3RPZmZzZXRHZW5lcmFsLWFkZC5maWVsZHMucHJfcmVpbmZvcmNlbWVudG9wdGlvbnNcIik7XG4gICAgICAgICAgICAkc2NvcGUucHJfY29yZG9wdGlvbnMgPSBpMThuRmlsdGVyKFwicHJvZHVjdE9mZnNldEdlbmVyYWwtYWRkLmZpZWxkcy5wcl9jb3Jkb3B0aW9uc1wiKTtcbiAgICAgICAgICAgICRzY29wZS5wcl93aXJlb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJwcm9kdWN0T2Zmc2V0R2VuZXJhbC1hZGQuZmllbGRzLnByX3dpcmVvcHRpb25zXCIpO1xuICAgICAgICAgICAgJHNjb3BlLnByX2Jsb2Nrc29wdGlvbnMgPSBpMThuRmlsdGVyKFwicHJvZHVjdE9mZnNldEdlbmVyYWwtYWRkLmZpZWxkcy5wcl9ibG9ja3NvcHRpb25zXCIpO1xuICAgICAgICAgICAgJHNjb3BlLnByX3N0YXR1c29wdGlvbnMgPSBpMThuRmlsdGVyKFwicHJvZHVjdE9mZnNldEdlbmVyYWwtYWRkLmZpZWxkcy5wcl9zdGF0dXNvcHRpb25zXCIpO1xuICAgICAgICBcbiAgICAgICAgICAgIC8vIGNyZWF0ZSBmcm9udCBpbmsgZmllbGRzXG4gICAgICAgICAgICAkc2NvcGUuJHdhdGNoKCdmbURhdGEucHJfaW5rZnJvbnQnLCBmdW5jdGlvbiAobmV3VmFsdWUsIG9sZFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKCRzY29wZS5mbURhdGEucHJfaW5rZnJvbnQgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5mcm9udElua3MgPSBuZXcgQXJyYXkobmV3VmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG9sZFZhbHVlOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5mbURhdGFbJ3ByX2lua3Nmcm9udCddW2ldID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICAgICAgLy8gY3JlYXRlIGJhY2sgaW5rIGZpZWxkc1xuICAgICAgICAgICAgJHNjb3BlLiR3YXRjaCgnZm1EYXRhLnByX2lua2JhY2snLCBmdW5jdGlvbiAobmV3VmFsdWUsIG9sZFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKCRzY29wZS5mbURhdGEucHJfaW5rYmFjayAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmJhY2tJbmtzID0gbmV3IEFycmF5KG5ld1ZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvbGRWYWx1ZTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZm1EYXRhWydwcl9pbmtzYmFjayddW2ldID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICRzY29wZS4kb24oJyR2aWV3Q29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAvLyB0aGlzIGNvZGUgaXMgZXhlY3V0ZWQgYWZ0ZXIgdGhlIHZpZXcgaXMgbG9hZGVkXG4gICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBwcm9kdWN0T2Zmc2V0R2VuZXJhbEFkZEZhYy5nZXRDbGllbnQoKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzT2JqZWN0KHByb21pc2UuZGF0YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5jbGllbnQgPSBwcm9taXNlLmRhdGE7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHByb2R1Y3RPZmZzZXRHZW5lcmFsQWRkRmFjLmdldElua3MoKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnByX2lua29wdGlvbnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChwcm9taXNlLmRhdGEsIGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wdXNoKHsgXCJsYWJlbFwiOiB2YWx1ZS5pbl9jb2RlLCBcInZhbHVlXCI6IHZhbHVlLmluX2lkIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgJHNjb3BlLnByX2lua29wdGlvbnMpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8kc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHByb2R1Y3RPZmZzZXRHZW5lcmFsQWRkRmFjLmdldFBhcGVycygpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUucGFfaWRvcHRpb25zID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2gocHJvbWlzZS5kYXRhLCBmdW5jdGlvbiAodmFsdWUsIGtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHVzaCh7IFwibGFiZWxcIjogdmFsdWUucGFfY29kZSwgXCJ2YWx1ZVwiOiB2YWx1ZS5wYV9pZCB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sICRzY29wZS5wYV9pZG9wdGlvbnMpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8kc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1dO1xuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRodHRwJywgJyRxJywgICckc3RhdGVQYXJhbXMnLCBmdW5jdGlvbiAoJGh0dHAsICRxLCAkc3RhdGVQYXJhbXMpIHtcbiAgICAgICAgdmFyIGZhY3RvcnkgPSB7fTtcbiAgICAgICAgZmFjdG9yeS5nZXRDbGllbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KCcvYXBpL3Byb2R1Y3Qvb2Zmc2V0L2dlbmVyYWwvY2xpZW50Jywge1xuICAgICAgICAgICAgICAgICAgICAvKiBQT1NUIHZhcmlhYmxlcyBoZXJlICovXG4gICAgICAgICAgICAgICAgICAgIGNsX2lkOiAkc3RhdGVQYXJhbXMuY2xfaWRcbiAgICAgICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeS5nZXRJbmtzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoXG4gICAgICAgICAgICAgICAgJGh0dHAucG9zdCgnL2FwaS9wcm9kdWN0L29mZnNldC9nZW5lcmFsL2luaycsIHtcbiAgICAgICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgICAgICBwcm9jY2VzX2lkOiBuZXcgRGF0ZSgpLmdldE1pbGxpc2Vjb25kcygpXG4gICAgICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkuZ2V0UGFwZXJzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoXG4gICAgICAgICAgICAgICAgJGh0dHAucG9zdCgnL2FwaS9wcm9kdWN0L29mZnNldC9nZW5lcmFsL3BhcGVyJywge1xuICAgICAgICAgICAgICAgICAgICAvKiBQT1NUIHZhcmlhYmxlcyBoZXJlICovXG4gICAgICAgICAgICAgICAgICAgIHByb2NjZXNfaWQ6IG5ldyBEYXRlKCkuZ2V0TWlsbGlzZWNvbmRzKClcbiAgICAgICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeS5hZGQgPSBmdW5jdGlvbiAocHJfanNvbmIpIHtcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gJGh0dHAucG9zdCgnL2FwaS9wcm9kdWN0L2FkZCcsIHtcbiAgICAgICAgICAgICAgICAvKiBQT1NUIHZhcmlhYmxlcyBoZXJlICovXG4gICAgICAgICAgICAgICAgcHJfanNvbmI6IHByX2pzb25iXG4gICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBmYWN0b3J5O1xuICAgIH1dO1xuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbihhbmd1bGFyKXtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgXG4gICAgcmV0dXJuIGFuZ3VsYXIubW9kdWxlKCdhcHAucHJvZHVjdE9mZnNldEdlbmVyYWwudXBkYXRlJyxbXSlcblxuICAgIC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLFxuICAgIGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcbiAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3Byb2R1Y3RPZmZzZXRHZW5lcmFsVXBkYXRlJywge1xuICAgICAgICAgICAgdXJsOicvcHJvZHVjdC9vZmZzZXQvZ2VuZXJhbC91cGRhdGUvOmNsX2lkLzpwcl9pZCcsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybCA6ICdhcHAvcHJvZHVjdC9tb2R1bGVzL3Byb2R1Y3RPZmZzZXRHZW5lcmFsLnVwZGF0ZS9wcm9kdWN0T2Zmc2V0R2VuZXJhbC51cGRhdGUudmlldy5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXIgOiAncHJvZHVjdE9mZnNldEdlbmVyYWxVcGRhdGVDdHJsJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICByZXF1aXJlc0xvZ2luOiB0cnVlXG4gICAgICAgICAgICB9ICAgIFxuICAgICAgICB9KTtcbiAgICB9XSlcblxuICAgIC5mYWN0b3J5KCdwcm9kdWN0T2Zmc2V0R2VuZXJhbFVwZGF0ZUZhYycscmVxdWlyZSgnLi9wcm9kdWN0T2Zmc2V0R2VuZXJhbC51cGRhdGUuZmFjJykpXG5cbiAgICAuY29udHJvbGxlcigncHJvZHVjdE9mZnNldEdlbmVyYWxVcGRhdGVDdHJsJyxyZXF1aXJlKCcuL3Byb2R1Y3RPZmZzZXRHZW5lcmFsLnVwZGF0ZS5jdHJsJykpXG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnQgPSB7fSIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKGFuZ3VsYXIpe1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBcbiAgICByZXR1cm4gWyckc2NvcGUnLCAncHJvZHVjdE9mZnNldEdlbmVyYWxVcGRhdGVGYWMnLCAnJGxvY2F0aW9uJywgJ2kxOG5GaWx0ZXInLCAnJHN0YXRlUGFyYW1zJywgJyRpbnRlcnZhbCcsXG4gICAgZnVuY3Rpb24gKCRzY29wZSwgcHJvZHVjdE9mZnNldEdlbmVyYWxVcGRhdGVGYWMsICRsb2NhdGlvbiwgaTE4bkZpbHRlciwgJHN0YXRlUGFyYW1zLCAkaW50ZXJ2YWwpIHtcbiAgICAgICAgXG4gICAgICAgICRzY29wZS5vblN1Ym1pdCA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICBwcm9kdWN0T2Zmc2V0R2VuZXJhbFVwZGF0ZUZhYy51cGRhdGUoJHNjb3BlLmZtRGF0YSkudGhlbihmdW5jdGlvbihwcm9taXNlKXtcbiAgICAgICAgICAgICAgICBpZihwcm9taXNlLmRhdGEucm93Q291bnQgPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9wcm9kdWN0LycrJHN0YXRlUGFyYW1zLmNsX2lkKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIFxuICAgICAgICAkc2NvcGUuZ2V0U3RhdGVzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkc2NvcGUucHJfc3RhdGVvcHRpb25zID0gW107XG4gICAgICAgICAgICAkc2NvcGUucHJfY2l0eW9wdGlvbnMgPSBbXTtcbiAgICAgICAgICAgICRzY29wZS5wcl9jb3VudHlvcHRpb25zID0gW107XG4gICAgICAgICAgICAkaW50ZXJ2YWwoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBwcm9kdWN0T2Zmc2V0R2VuZXJhbFVwZGF0ZUZhYy5nZXRTdGF0ZXMoJHNjb3BlLmZtRGF0YS5wcl9jb3VudHJ5KS50aGVuKGZ1bmN0aW9uKHByb21pc2Upe1xuICAgICAgICAgICAgICAgICAgICBpZihhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhLmdlb25hbWVzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnByX3N0YXRlb3B0aW9ucyA9IHByb21pc2UuZGF0YS5nZW9uYW1lcztcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vJHNjb3BlLnVwZGF0ZUZhaWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LDAsMSk7XG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUuZ2V0Q2l0eUNvdW50eSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJHNjb3BlLnByX2NpdHlvcHRpb25zID0gW107XG4gICAgICAgICAgICAkc2NvcGUucHJfY291bnR5b3B0aW9ucyA9IFtdO1xuICAgICAgICAgICAgJGludGVydmFsKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgcHJvZHVjdE9mZnNldEdlbmVyYWxVcGRhdGVGYWMuZ2V0U3RhdGVzKCRzY29wZS5mbURhdGEucHJfc3RhdGUpLnRoZW4oZnVuY3Rpb24ocHJvbWlzZSl7XG4gICAgICAgICAgICAgICAgICAgIGlmKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEuZ2VvbmFtZXMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUucHJfY2l0eW9wdGlvbnMgPSBwcm9taXNlLmRhdGEuZ2VvbmFtZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUucHJfY291bnR5b3B0aW9ucyA9IHByb21pc2UuZGF0YS5nZW9uYW1lcztcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vJHNjb3BlLnVwZGF0ZUZhaWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LDAsMSk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgICRzY29wZS5wcl9zdGF0dXNvcHRpb25zID0gaTE4bkZpbHRlcihcInByb2R1Y3RPZmZzZXRHZW5lcmFsLmZpZWxkcy5wcl9zdGF0dXNvcHRpb25zXCIpO1xuICAgICAgICBcbiAgICAgICAgJHNjb3BlLiRvbignJHZpZXdDb250ZW50TG9hZGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLy8gdGhpcyBjb2RlIGlzIGV4ZWN1dGVkIGFmdGVyIHRoZSB2aWV3IGlzIGxvYWRlZFxuICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgcHJvZHVjdE9mZnNldEdlbmVyYWxVcGRhdGVGYWMuZGF0YSgpLnRoZW4oZnVuY3Rpb24ocHJvbWlzZSl7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBpZihhbmd1bGFyLmlzT2JqZWN0KGFuZ3VsYXIuZnJvbUpzb24ocHJvbWlzZS5kYXRhKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5mbURhdGEgPSBhbmd1bGFyLmZyb21Kc29uKHByb21pc2UuZGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHByb2R1Y3RPZmZzZXRHZW5lcmFsVXBkYXRlRmFjLmdldENvdW50cmllcygpLnRoZW4oZnVuY3Rpb24ocHJvbWlzZSl7XG4gICAgICAgICAgICAgICAgICAgIGlmKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEuZ2VvbmFtZXMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUucHJfY291bnRyeW9wdGlvbnMgPSBwcm9taXNlLmRhdGEuZ2VvbmFtZXM7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyRzY29wZS51cGRhdGVGYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgcHJvZHVjdE9mZnNldEdlbmVyYWxVcGRhdGVGYWMuZ2V0U3RhdGVzKCRzY29wZS5mbURhdGEucHJfY291bnRyeSkudGhlbihmdW5jdGlvbihwcm9taXNlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEuZ2VvbmFtZXMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnByX3N0YXRlb3B0aW9ucyA9IHByb21pc2UuZGF0YS5nZW9uYW1lcztcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8kc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICBwcm9kdWN0T2Zmc2V0R2VuZXJhbFVwZGF0ZUZhYy5nZXRDaXR5Q291bnR5KCRzY29wZS5mbURhdGEucHJfc3RhdGUpLnRoZW4oZnVuY3Rpb24ocHJvbWlzZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZihhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhLmdlb25hbWVzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5wcl9jaXR5b3B0aW9ucyA9IHByb21pc2UuZGF0YS5nZW9uYW1lcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUucHJfY291bnR5b3B0aW9ucyA9IHByb21pc2UuZGF0YS5nZW9uYW1lcztcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8kc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgfSk7XG4gICAgfV07XG4gICAgXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRodHRwJywgJyRxJywgICckc3RhdGVQYXJhbXMnLCBmdW5jdGlvbiAoJGh0dHAsICRxLCAkc3RhdGVQYXJhbXMpIHtcbiAgICAgICAgdmFyIGZhY3RvcnkgPSB7fTtcbiAgICAgICAgZmFjdG9yeS5kYXRhID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoXG4gICAgICAgICAgICAgICAgJGh0dHAucG9zdCgnL2FwaS9wcm9kdWN0L29mZnNldC9nZW5lcmFsL3Byb2R1Y3QnLCB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICAgICAgcHJfaWQ6ICRzdGF0ZVBhcmFtcy5wcl9pZFxuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICBmYWN0b3J5LnVwZGF0ZSA9IGZ1bmN0aW9uIChwcl9qc29uYikge1xuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoXG4gICAgICAgICAgICAgICAgJGh0dHAucG9zdCgnL2FwaS9wcm9kdWN0L3VwZGF0ZScsIHtcbiAgICAgICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgICAgICBwcl9pZDogJHN0YXRlUGFyYW1zLnByX2lkLFxuICAgICAgICAgICAgICAgICAgICBwcl9qc29uYjogcHJfanNvbmJcbiAgICAgICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeS5nZXRDb3VudHJpZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9ICRodHRwLmpzb25wKCdodHRwOi8vYXBpLmdlb25hbWVzLm9yZy9jb3VudHJ5SW5mb0pTT04/dXNlcm5hbWU9YWxlamFuZHJvbHNjYSZjYWxsYmFjaz1KU09OX0NBTExCQUNLJylcbiAgICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkuZ2V0U3RhdGVzID0gZnVuY3Rpb24gKHByX2NvdW50cnkpIHtcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gJGh0dHAuanNvbnAoJ2h0dHA6Ly9hcGkuZ2VvbmFtZXMub3JnL2NoaWxkcmVuSlNPTj9nZW9uYW1lSWQ9JyArIHByX2NvdW50cnkgKyAnJnVzZXJuYW1lPWFsZWphbmRyb2xzY2EmY2FsbGJhY2s9SlNPTl9DQUxMQkFDSycpXG4gICAgICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICBmYWN0b3J5LmdldENpdHlDb3VudHkgPSBmdW5jdGlvbiAocHJfc3RhdGUpIHtcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gJGh0dHAuanNvbnAoJ2h0dHA6Ly9hcGkuZ2VvbmFtZXMub3JnL2NoaWxkcmVuSlNPTj9nZW9uYW1lSWQ9JyArIHByX3N0YXRlICsgJyZ1c2VybmFtZT1hbGVqYW5kcm9sc2NhJmNhbGxiYWNrPUpTT05fQ0FMTEJBQ0snKVxuICAgICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGZhY3Rvcnk7XG4gICAgfV07XG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKGFuZ3VsYXIpe1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBcbiAgICByZXR1cm4gYW5ndWxhci5tb2R1bGUoJ2FwcC5wcm9kdWN0T2Zmc2V0UGFnaW5hdGVkLmFkZCcsW10pXG5cbiAgICAuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJyxcbiAgICBmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdwcm9kdWN0T2Zmc2V0UGFnaW5hdGVkQWRkJywge1xuICAgICAgICAgICAgdXJsOicvcHJvZHVjdC9hZGQvb2Zmc2V0L3BhZ2luYXRlZC86Y2xfaWQnLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmwgOiAnYXBwL3Byb2R1Y3QvbW9kdWxlcy9wcm9kdWN0T2Zmc2V0UGFnaW5hdGVkLmFkZC9wcm9kdWN0T2Zmc2V0UGFnaW5hdGVkLmFkZC52aWV3Lmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlciA6ICdwcm9kdWN0T2Zmc2V0UGFnaW5hdGVkQWRkQ3RybCcsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgcmVxdWlyZXNMb2dpbjogdHJ1ZVxuICAgICAgICAgICAgfSAgICBcbiAgICAgICAgfSk7XG4gICAgfV0pXG5cbiAgICAuZmFjdG9yeSgncHJvZHVjdE9mZnNldFBhZ2luYXRlZEFkZEZhYycscmVxdWlyZSgnLi9wcm9kdWN0T2Zmc2V0UGFnaW5hdGVkLmFkZC5mYWMnKSlcblxuICAgIC5jb250cm9sbGVyKCdwcm9kdWN0T2Zmc2V0UGFnaW5hdGVkQWRkQ3RybCcscmVxdWlyZSgnLi9wcm9kdWN0T2Zmc2V0UGFnaW5hdGVkLmFkZC5jdHJsJykpXG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCIgOiBcIkFncmVnYXIgUHJvZHVjdG9cIixcbiAgICAgICAgICAgICAgICAgICAgXCJsYWJlbHNcIjp7XG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLWlkXCI6IFwiSUQgcHJvZHVjdG9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2wtaWRcIjogXCJJRCBjbGllbnRlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLXByb2Nlc3NcIjogXCJQcm9jZXNvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLXR5cGVcIjogXCJUaXBvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLXBhcnRub1wiOiBcIk5vLiBwYXJ0ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1jb2RlXCI6IFwiQ29kaWdvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLW5hbWVcIjogXCJOb21icmVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItZGVzY3JpcHRpb25cIjogXCJEZXNjcmlwY2lvblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1maW5hbHNpemV3aWR0aFwiOiBcIkFuY2hvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLWZpbmFsc2l6ZWhlaWdodFwiOiBcIkFsdG9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItZmluYWxzaXplbWVhc3VyZVwiOiBcIk1lZGlkYVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1pbmtmcm9udFwiOiBcIkZyZW50ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1pbmtiYWNrXCI6IFwiUmV2ZXJzb1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwYS1pZFwiOiBcIklEIHBhcGVsXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLXBhcGVyc2l6ZXdpZHRoXCI6IFwiQW5jaG9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItcGFwZXJzaXplaGVpZ2h0XCI6IFwiQWx0b1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1wYXBlcnNpemVtZWFzdXJlXCI6IFwiTWVkaWRhXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLXBhcGVyZm9ybWF0c3F0eVwiOiBcIkZvcm1hdG9zXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLXZhcm5pc2hcIjogXCJCYXJuaXpcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItdmFybmlzaGZpbmlzaGVkXCI6IFwiQWNhYmFkb1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1sYW1pbmF0ZVwiOiBcIkxhbWluYWRvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLWxhbWluYXRlZmluaXNoZWRcIjogXCJBY2FiYWRvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLWxhbWluYXRlY2FsaWJlclwiOiBcIkNhbGlicmVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItbGFtaW5hdGVzaWRlc1wiOiBcIkNhcmFzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLWZvbGlvXCI6IFwiRm9saW9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItcHJlY3V0XCI6IFwiUHJlY29ydGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItZm9sZFwiOiBcIkRvYmxlelwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1kaWVjdXR0aW5nXCI6IFwiU3VhamVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItZGllY3V0dGluZ3F0eVwiOiBcIk5vLiBTdWFqZXNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItcmVpbmZvcmNlbWVudFwiOiBcIlJlZnVlcnpvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLWNvcmRcIjogXCJDb3Jkw7NuXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLXdpcmVcIjogXCJBbMOhbWJyZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1zdGFwbGluZ1wiOiBcIkdyYXBhZG9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItYm91bmRcIjpcIkVuY3VhZGVybmFkb1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1zcGlyYWxiaW5kXCI6IFwiRW5nYXJnb2xhZG9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItYmxvY2tzXCI6IFwiQmxvY2tzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLWludHBhZ2VzXCI6XCJOby4gZGUgUGFnaW5hc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1zdGF0dXNcIjogXCJFc3RhdHVzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLWRhdGVcIjogXCJGZWNoYVwiLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBcImNvbHVtbnNcIjpbXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX2lkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsX2lkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX3Byb2Nlc3NcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfdHlwZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9wYXJ0bm9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfY29kZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9uYW1lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX2Rlc2NyaXB0aW9uXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX2ZpbmFsc2l6ZXdpZHRoXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX2ZpbmFsc2l6ZWhlaWdodFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9maW5hbHNpemVtZWFzdXJlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX2lua2Zyb250XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX2lua2JhY2tcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicGFfaWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfcGFwZXJzaXpld2lkdGhcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfcGFwZXJzaXplaGVpZ2h0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX3BhcGVyc2l6ZW1lYXN1cmVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfcGFwZXJmb3JtYXRzcXR5XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX3Zhcm5pc2hcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfdmFybmlzaGZpbmlzaGVkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX2xhbWluYXRlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX2xhbWluYXRlZmluaXNoZWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfbGFtaW5hdGVjYWxpYmVyXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX2xhbWluYXRlc2lkZXNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfZm9saW9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfcHJlY3V0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX2ZvbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfZGllY3V0dGluZ1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9kaWVjdXR0aW5ncXR5XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX3JlaW5mb3JjZW1lbnRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfY29yZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl93aXJlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX2Jsb2Nrc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9zdGFwbGluZ1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9ib3VuZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9zcGlyYWxiaW5kXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX2ludHBhZ2VzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX3N0YXR1c1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9kYXRlXCIsXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICBcImZpZWxkc1wiIDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJfZmluYWxzaXplbWVhc3VyZW9wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcImNtXCIsXCJ2YWx1ZVwiOlwiY21cIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcInB1bGdhZGFzXCIsXCJ2YWx1ZVwiOlwiaW5cIn1cbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBwcl9pbmtmcm9udG9wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIjEgdGludGFcIixcInZhbHVlXCI6MX0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIjIgdGludGFzXCIsXCJ2YWx1ZVwiOjJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCIzIHRpbnRhc1wiLFwidmFsdWVcIjozfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiNCB0aW50YXNcIixcInZhbHVlXCI6NH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIjUgdGludGFzXCIsXCJ2YWx1ZVwiOjV9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCI2IHRpbnRhc1wiLFwidmFsdWVcIjo2fSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiNyB0aW50YXNcIixcInZhbHVlXCI6N30sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIjggdGludGFzXCIsXCJ2YWx1ZVwiOjh9LFxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHByX2lua2JhY2tvcHRpb25zIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCIxIHRpbnRhXCIsXCJ2YWx1ZVwiOjF9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCIyIHRpbnRhc1wiLFwidmFsdWVcIjoyfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiMyB0aW50YXNcIixcInZhbHVlXCI6M30sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIjQgdGludGFzXCIsXCJ2YWx1ZVwiOjR9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCI1IHRpbnRhc1wiLFwidmFsdWVcIjo1fSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiNiB0aW50YXNcIixcInZhbHVlXCI6Nn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIjcgdGludGFzXCIsXCJ2YWx1ZVwiOjd9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCI4IHRpbnRhc1wiLFwidmFsdWVcIjo4fSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBwcl92YXJuaXNob3B0aW9ucyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiTm9cIixcInZhbHVlXCI6XCJub1wifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiVW5hIGNhcmFcIixcInZhbHVlXCI6XCJvbmVzaWRlXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJEb3MgY2FyYXNcIixcInZhbHVlXCI6XCJ0d29zaWRlc1wifVxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHByX3Zhcm5pc2ZpbmlzaGVkb3B0aW9ucyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiTWF0ZVwiLFwidmFsdWVcIjpcIm1hdHRlXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJCcmlsbGFudGVcIixcInZhbHVlXCI6XCJicmlnaHRcIn1cbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBwcl9sYW1pbmF0ZW9wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIk5vXCIsXCJ2YWx1ZVwiOlwibm9cIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIlVuYSBjYXJhXCIsXCJ2YWx1ZVwiOlwib25lc2lkZVwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiRG9zIGNhcmFzXCIsXCJ2YWx1ZVwiOlwidHdvc2lkZXNcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJfbGFtaW5hdGVmaW5pc2hlZG9wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIk1hdGVcIixcInZhbHVlXCI6XCJtYXR0ZVwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiQnJpbGxhbnRlXCIsXCJ2YWx1ZVwiOlwiYnJpZ2h0XCJ9XG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJfbGFtaW5hdGVjYWxpYmVyb3B0aW9ucyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiLjJtbVwiLFwidmFsdWVcIjpcIjJtbVwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiLjRtbVwiLFwidmFsdWVcIjpcIjRtbVwifVxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHByX2xhbWluYXRlc2lkZXNvcHRpb25zIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJVbmEgY2FyYVwiLFwidmFsdWVcIjpcIm9uZXNpZGVcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkRvcyBjYXJhc1wiLFwidmFsdWVcIjpcInR3b3NpZGVzXCJ9XG4gICAgICAgICAgICAgICAgICAgICAgICBdLHByX2ZvbGlvb3B0aW9ucyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiU2lcIixcInZhbHVlXCI6XCJ5ZXNcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIk5vXCIsXCJ2YWx1ZVwiOlwibm9cIn1cbiAgICAgICAgICAgICAgICAgICAgICAgIF0scHJfcHJlY3V0b3B0aW9ucyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiTm9cIixcInZhbHVlXCI6XCJub1wifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiSG9yaXpvbnRhbFwiLFwidmFsdWVcIjpcImhvcml6b250YWxcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIlZlcnRpY2FsXCIsXCJ2YWx1ZVwiOlwidmVydGljYWxcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICBdLHByX2ZvbGRvcHRpb25zIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJUcmlwdGljb1wiLFwidmFsdWVcIjpcInRyeXB0aWNcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICBdLHByX2RpZWN1dHRpbmdvcHRpb25zIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJTaVwiLFwidmFsdWVcIjpcInllc1wifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiTm9cIixcInZhbHVlXCI6XCJub1wifVxuICAgICAgICAgICAgICAgICAgICAgICAgXSxwcl9yZWluZm9yY2VtZW50b3B0aW9ucyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiTm9cIixcInZhbHVlXCI6XCJub1wifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiVW5vXCIsXCJ2YWx1ZVwiOlwib25lXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJEb3NcIixcInZhbHVlXCI6XCJ0d29cIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICBdLHByX2NvcmRvcHRpb25zIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJOb1wiLFwidmFsdWVcIjpcIm5vXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJDb2xvY2Fkb1wiLFwidmFsdWVcIjpcImFsbG9jYXRlZFwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiU2VwYXJhZG9cIixcInZhbHVlXCI6XCJzZXBhcmF0ZWRcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICBdLHByX3dpcmVvcHRpb25zIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJOb1wiLFwidmFsdWVcIjpcIm5vXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJDb2xvY2Fkb1wiLFwidmFsdWVcIjpcImFsbG9jYXRlZFwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiU2VwYXJhZG9cIixcInZhbHVlXCI6XCJzZXBhcmF0ZWRcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICBdLHByX3N0YXBsaW5nb3B0aW9ucyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiTm9cIixcInZhbHVlXCI6XCJub1wifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiVW5hIGdyYXBhXCIsXCJ2YWx1ZVwiOlwiMVwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiRG9zIGdyYXBhc1wiLFwidmFsdWVcIjpcIjJcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICBdLHByX2JvdW5kb3B0aW9ucyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiTm9cIixcInZhbHVlXCI6XCJub1wifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiU2lcIixcInZhbHVlXCI6XCJ5ZXNcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICBdLHByX3NwaXJhbGJpbmRvcHRpb25zIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJQbGFzdGljb1wiLFwidmFsdWVcIjpcInBsYXN0aWNcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIk1ldGFsXCIsXCJ2YWx1ZVwiOlwibWV0YWxcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICBdLHByX2Jsb2Nrc29wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIk5vXCIsXCJ2YWx1ZVwiOlwibm9cIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIjIwXCIsXCJ2YWx1ZVwiOlwiMjBcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIjI1XCIsXCJ2YWx1ZVwiOlwiMjVcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIjUwXCIsXCJ2YWx1ZVwiOlwiNTBcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIjc1XCIsXCJ2YWx1ZVwiOlwiNzVcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIjEwMFwiLFwidmFsdWVcIjpcIjEwMFwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBwcl9zdGF0dXNvcHRpb25zIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJBY3Rpdm9cIixcInZhbHVlXCI6XCJBXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJJbmFjdGl2b1wiLFwidmFsdWVcIjpcIklcIn1cbiAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oYW5ndWxhcil7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIFxuICAgIHJldHVybiBbJyRzY29wZScsICdwcm9kdWN0T2Zmc2V0UGFnaW5hdGVkQWRkRmFjJywgJyRsb2NhdGlvbicsICdpMThuRmlsdGVyJywgJyRzdGF0ZVBhcmFtcycsXG4gICAgZnVuY3Rpb24gKCRzY29wZSwgcHJvZHVjdE9mZnNldFBhZ2luYXRlZEFkZEZhYywgJGxvY2F0aW9uLCBpMThuRmlsdGVyLCAkc3RhdGVQYXJhbXMpIHtcbiAgICAgICAgJHNjb3BlLmZtRGF0YSA9IHt9O1xuICAgICAgICAkc2NvcGUuZm1EYXRhID0geyBcInByX3Byb2Nlc3NcIjogXCJvZmZzZXRcIiwgXCJwcl90eXBlXCI6IFwicGFnaW5hdGVkXCIsIFwiY2xfaWRcIjogXCI2XCIsIFwicHJfcGFydG5vXCI6IFwiVEVTVC1BU0EuYXNhczogMjMsMzRcIiwgXCJwcl9kZXNjcmlwdGlvblwiOiBcImVzdGUgZXMgdW4gcHJvZHVjdG8gZGUgcHJ1ZWJhXCIsIFwicHJfZmluYWxzaXpld2lkdGhcIjogXCIxMDAuMDBcIiwgXCJwcl9maW5hbHNpemVoZWlnaHRcIjogXCIyMDAuMDBcIiwgXCJwcl9maW5hbHNpemVtZWFzdXJlXCI6IFwiY21cIiwgXCJwcl9pbmtmcm9udFwiOiAyLCBcInByX2lua3Nmcm9udFwiOiB7IFwiMFwiOiBcIjJcIiwgXCIxXCI6IFwiM1wiIH0sIFwicHJfaW5rYmFja1wiOiAyLCBcInByX2lua3NiYWNrXCI6IHsgXCIwXCI6IFwiMlwiLCBcIjFcIjogXCIyXCIgfSwgXCJwYV9pZFwiOiBcIjFcIiwgXCJwcl9wYXBlcmZvcm1hdHNxdHlcIjogXCIxMjNcIiwgXCJwcl9wYXBlcnNpemV3aWR0aFwiOiBcIjEwMC4wMFwiLCBcInByX3BhcGVyc2l6ZWhlaWdodFwiOiBcIjIwMC4wMFwiLCBcInByX3BhcGVyc2l6ZW1lYXN1cmVcIjogXCJjbVwiLCBcInByX3Zhcm5pc2hcIjogXCJvbmVzaWRlXCIsIFwicHJfdmFybmlzaGZpbmlzaGVkXCI6IFwibWF0dGVcIiwgXCJwcl9sYW1pbmF0ZVwiOiBcInR3b3NpZGVzXCIsIFwicHJfbGFtaW5hdGVmaW5pc2hlZFwiOiBcIm1hdHRlXCIsIFwicHJfbGFtaW5hdGVjYWxpYmVyXCI6IFwiMm1tXCIsIFwicHJfcHJlY3V0XCI6IFwiaG9yaXpvbnRhbFwiLCBcInByX2ZvbGRcIjogXCJ0cnlwdGljXCIsIFwicHJfZGllY3V0dGluZ1wiOiBcInllc1wiLCBcInByX2RpZWN1dHRpbmdxdHlcIjogXCI1XCIsIFwicHJfcmVpbmZvcmNlbWVudFwiOiBcIm9uZVwiLCBcInByX2NvcmRcIjogXCJhbGxvY2F0ZWRcIiwgXCJwcl93aXJlXCI6IFwiYWxsb2NhdGVkXCIsIFwicHJfZm9saW9cIjogXCJ5ZXNcIiwgXCJwcl9ibG9ja3NcIjogXCIxMDBcIiwgXCJwcl9zdGF0dXNcIjogXCJBXCIsIFwicHJfaW50aW5rZnJvbnRcIjogMiwgXCJwcl9pbnRpbmtzZnJvbnRcIjogeyBcIjBcIjogXCIyXCIsIFwiMVwiOiBcIjNcIiB9LCBcInByX2ludGlua2JhY2tcIjogMiwgXCJwcl9pbnRpbmtzYmFja1wiOiB7IFwiMFwiOiBcIjJcIiwgXCIxXCI6IFwiM1wiIH0sIFwicHJfaW50cGFnZXNcIjogXCIxMDBcIiwgXCJwYV9pbnRpZFwiOiBcIjFcIiwgXCJwcl9pbnRwYXBlcmZvcm1hdHNxdHlcIjogXCI1MDBcIiwgXCJwcl9zdGFwbGluZ1wiOiBcIjJcIiwgXCJwcl9ib3VuZFwiOiBcInllc1wiLCBcInByX3NwaXJhbGJpbmRcIjogXCJwbGFzdGljXCIsIFwicHJfbmFtZVwiOiBcImFzZGFzZGFzXCIsIFwicHJfY29kZVwiOiBcImFzZGFzZFwiIH07XG4gICAgICAgIFxuICAgICAgICAkc2NvcGUuZm1EYXRhLnByX3Byb2Nlc3MgPSAnb2Zmc2V0JztcbiAgICAgICAgJHNjb3BlLmZtRGF0YS5wcl90eXBlID0gJ3BhZ2luYXRlZCc7XG4gICAgICAgICRzY29wZS5mbURhdGEuY2xfaWQgPSAkc3RhdGVQYXJhbXMuY2xfaWQ7XG5cbiAgICAgICAgJHNjb3BlLm9uU3VibWl0ID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHByb2R1Y3RPZmZzZXRQYWdpbmF0ZWRBZGRGYWMuYWRkKCRzY29wZS5mbURhdGEpLnRoZW4oZnVuY3Rpb24ocHJvbWlzZSl7XG4gICAgICAgICAgICAgICAgaWYocHJvbWlzZS5kYXRhLnJvd0NvdW50ID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9wcm9kdWN0LycrJHN0YXRlUGFyYW1zLmNsX2lkKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIFxuICAgICAgICAkc2NvcGUucHJfZmluYWxzaXplbWVhc3VyZW9wdGlvbnMgPSBpMThuRmlsdGVyKFwicHJvZHVjdE9mZnNldFBhZ2luYXRlZC1hZGQuZmllbGRzLnByX2ZpbmFsc2l6ZW1lYXN1cmVvcHRpb25zXCIpO1xuICAgICAgICAkc2NvcGUucHJfaW5rZnJvbnRvcHRpb25zID0gaTE4bkZpbHRlcihcInByb2R1Y3RPZmZzZXRQYWdpbmF0ZWQtYWRkLmZpZWxkcy5wcl9pbmtmcm9udG9wdGlvbnNcIik7XG4gICAgICAgICRzY29wZS5wcl9pbmtiYWNrb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJwcm9kdWN0T2Zmc2V0UGFnaW5hdGVkLWFkZC5maWVsZHMucHJfaW5rYmFja29wdGlvbnNcIik7XG4gICAgICAgICRzY29wZS5wcl92YXJuaXNob3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJwcm9kdWN0T2Zmc2V0UGFnaW5hdGVkLWFkZC5maWVsZHMucHJfdmFybmlzaG9wdGlvbnNcIik7XG4gICAgICAgICRzY29wZS5wcl92YXJuaXNmaW5pc2hlZG9wdGlvbnMgPSBpMThuRmlsdGVyKFwicHJvZHVjdE9mZnNldFBhZ2luYXRlZC1hZGQuZmllbGRzLnByX3Zhcm5pc2ZpbmlzaGVkb3B0aW9uc1wiKTtcbiAgICAgICAgJHNjb3BlLnByX2xhbWluYXRlb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJwcm9kdWN0T2Zmc2V0UGFnaW5hdGVkLWFkZC5maWVsZHMucHJfbGFtaW5hdGVvcHRpb25zXCIpO1xuICAgICAgICAkc2NvcGUucHJfbGFtaW5hdGVmaW5pc2hlZG9wdGlvbnMgPSBpMThuRmlsdGVyKFwicHJvZHVjdE9mZnNldFBhZ2luYXRlZC1hZGQuZmllbGRzLnByX2xhbWluYXRlZmluaXNoZWRvcHRpb25zXCIpO1xuICAgICAgICAkc2NvcGUucHJfbGFtaW5hdGVjYWxpYmVyb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJwcm9kdWN0T2Zmc2V0UGFnaW5hdGVkLWFkZC5maWVsZHMucHJfbGFtaW5hdGVjYWxpYmVyb3B0aW9uc1wiKTtcbiAgICAgICAgJHNjb3BlLnByX2xhbWluYXRlc2lkZXNvcHRpb25zID0gaTE4bkZpbHRlcihcInByb2R1Y3RPZmZzZXRQYWdpbmF0ZWQtYWRkLmZpZWxkcy5wcl9sYW1pbmF0ZXNpZGVzb3B0aW9uc1wiKTtcbiAgICAgICAgJHNjb3BlLnByX2ZvbGlvb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJwcm9kdWN0T2Zmc2V0UGFnaW5hdGVkLWFkZC5maWVsZHMucHJfZm9saW9vcHRpb25zXCIpO1xuICAgICAgICAkc2NvcGUucHJfcHJlY3V0b3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJwcm9kdWN0T2Zmc2V0UGFnaW5hdGVkLWFkZC5maWVsZHMucHJfcHJlY3V0b3B0aW9uc1wiKTtcbiAgICAgICAgJHNjb3BlLnByX2ZvbGRvcHRpb25zID0gaTE4bkZpbHRlcihcInByb2R1Y3RPZmZzZXRQYWdpbmF0ZWQtYWRkLmZpZWxkcy5wcl9mb2xkb3B0aW9uc1wiKTtcbiAgICAgICAgJHNjb3BlLnByX2RpZWN1dHRpbmdvcHRpb25zID0gaTE4bkZpbHRlcihcInByb2R1Y3RPZmZzZXRQYWdpbmF0ZWQtYWRkLmZpZWxkcy5wcl9kaWVjdXR0aW5nb3B0aW9uc1wiKTtcbiAgICAgICAgJHNjb3BlLnByX3JlaW5mb3JjZW1lbnRvcHRpb25zID0gaTE4bkZpbHRlcihcInByb2R1Y3RPZmZzZXRQYWdpbmF0ZWQtYWRkLmZpZWxkcy5wcl9yZWluZm9yY2VtZW50b3B0aW9uc1wiKTtcbiAgICAgICAgJHNjb3BlLnByX2NvcmRvcHRpb25zID0gaTE4bkZpbHRlcihcInByb2R1Y3RPZmZzZXRQYWdpbmF0ZWQtYWRkLmZpZWxkcy5wcl9jb3Jkb3B0aW9uc1wiKTtcbiAgICAgICAgJHNjb3BlLnByX3dpcmVvcHRpb25zID0gaTE4bkZpbHRlcihcInByb2R1Y3RPZmZzZXRQYWdpbmF0ZWQtYWRkLmZpZWxkcy5wcl93aXJlb3B0aW9uc1wiKTtcbiAgICAgICAgJHNjb3BlLnByX3N0YXBsaW5nb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJwcm9kdWN0T2Zmc2V0UGFnaW5hdGVkLWFkZC5maWVsZHMucHJfc3RhcGxpbmdvcHRpb25zXCIpO1xuICAgICAgICAkc2NvcGUucHJfYm91bmRvcHRpb25zID0gaTE4bkZpbHRlcihcInByb2R1Y3RPZmZzZXRQYWdpbmF0ZWQtYWRkLmZpZWxkcy5wcl9ib3VuZG9wdGlvbnNcIik7XG4gICAgICAgICRzY29wZS5wcl9zcGlyYWxiaW5kb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJwcm9kdWN0T2Zmc2V0UGFnaW5hdGVkLWFkZC5maWVsZHMucHJfc3BpcmFsYmluZG9wdGlvbnNcIik7XG4gICAgICAgICRzY29wZS5wcl9ibG9ja3NvcHRpb25zID0gaTE4bkZpbHRlcihcInByb2R1Y3RPZmZzZXRQYWdpbmF0ZWQtYWRkLmZpZWxkcy5wcl9ibG9ja3NvcHRpb25zXCIpO1xuICAgICAgICAkc2NvcGUucHJfc3RhdHVzb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJwcm9kdWN0T2Zmc2V0UGFnaW5hdGVkLWFkZC5maWVsZHMucHJfc3RhdHVzb3B0aW9uc1wiKTtcbiAgICAgICAgXG4gICAgICAgIC8vIGNyZWF0ZSBmcm9udCBpbmsgZmllbGRzXG4gICAgICAgICRzY29wZS4kd2F0Y2goJ2ZtRGF0YS5wcl9pbmtmcm9udCcsIGZ1bmN0aW9uKG5ld1ZhbHVlLCBvbGRWYWx1ZSkge1xuICAgICAgICAgICAgaWYoJHNjb3BlLmZtRGF0YS5wcl9pbmtmcm9udCAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUuZnJvbnRJbmtzID0gbmV3IEFycmF5KG5ld1ZhbHVlKTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpPTA7IGk8bmV3VmFsdWU7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZihvbGRWYWx1ZSAhPSBuZXdWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmZtRGF0YVsncHJfaW5rc2Zyb250J11baV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgLy8gY3JlYXRlIGJhY2sgaW5rIGZpZWxkc1xuICAgICAgICAkc2NvcGUuJHdhdGNoKCdmbURhdGEucHJfaW5rYmFjaycsIGZ1bmN0aW9uKG5ld1ZhbHVlLCBvbGRWYWx1ZSkge1xuICAgICAgICAgICAgaWYoJHNjb3BlLmZtRGF0YS5wcl9pbmtiYWNrICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICRzY29wZS5iYWNrSW5rcyA9IG5ldyBBcnJheShuZXdWYWx1ZSk7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpPG9sZFZhbHVlOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYob2xkVmFsdWUgIT0gbmV3VmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5mbURhdGFbJ3ByX2lua3NiYWNrJ11baV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgLy8gY3JlYXRlIGZyb250IGludGVyaW9yIGluayBmaWVsZHNcbiAgICAgICAgJHNjb3BlLiR3YXRjaCgnZm1EYXRhLnByX2ludGlua2Zyb250JywgZnVuY3Rpb24obmV3VmFsdWUsIG9sZFZhbHVlKSB7XG4gICAgICAgICAgICBpZigkc2NvcGUuZm1EYXRhLnByX2ludGlua2Zyb250ICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICRzY29wZS5pbnRGcm9udElua3MgPSBuZXcgQXJyYXkobmV3VmFsdWUpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaTxuZXdWYWx1ZTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKG9sZFZhbHVlICE9IG5ld1ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZm1EYXRhWydwcl9pbnRpbmtzZnJvbnQnXVtpXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICAvLyBjcmVhdGUgYmFjayBpbnRlcmlvciBpbmsgZmllbGRzXG4gICAgICAgICRzY29wZS4kd2F0Y2goJ2ZtRGF0YS5wcl9pbnRpbmtiYWNrJywgZnVuY3Rpb24obmV3VmFsdWUsIG9sZFZhbHVlKSB7XG4gICAgICAgICAgICBpZigkc2NvcGUuZm1EYXRhLnByX2ludGlua2JhY2sgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmludEJhY2tJbmtzID0gbmV3IEFycmF5KG5ld1ZhbHVlKTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpPTA7IGk8b2xkVmFsdWU7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZihvbGRWYWx1ZSAhPSBuZXdWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmZtRGF0YVsncHJfaW50aW5rc2JhY2snXVtpXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHNjb3BlLiRvbignJHZpZXdDb250ZW50TG9hZGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLy8gdGhpcyBjb2RlIGlzIGV4ZWN1dGVkIGFmdGVyIHRoZSB2aWV3IGlzIGxvYWRlZFxuICAgICAgICAgICAgXG4gICAgICAgICAgICBwcm9kdWN0T2Zmc2V0UGFnaW5hdGVkQWRkRmFjLmdldENsaWVudCgpLnRoZW4oZnVuY3Rpb24ocHJvbWlzZSl7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBpZihhbmd1bGFyLmlzT2JqZWN0KHByb21pc2UuZGF0YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNsaWVudCA9IHByb21pc2UuZGF0YTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcHJvZHVjdE9mZnNldFBhZ2luYXRlZEFkZEZhYy5nZXRJbmtzKCkudGhlbihmdW5jdGlvbihwcm9taXNlKXtcbiAgICAgICAgICAgICAgICBpZihhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUucHJfaW5rb3B0aW9ucyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2gocHJvbWlzZS5kYXRhLGZ1bmN0aW9uKHZhbHVlLCBrZXkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnB1c2goe1wibGFiZWxcIjp2YWx1ZS5pbl9jb2RlLFwidmFsdWVcIjp2YWx1ZS5pbl9pZH0pO1xuICAgICAgICAgICAgICAgICAgICB9LCRzY29wZS5wcl9pbmtvcHRpb25zKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyRzY29wZS51cGRhdGVGYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcHJvZHVjdE9mZnNldFBhZ2luYXRlZEFkZEZhYy5nZXRQYXBlcnMoKS50aGVuKGZ1bmN0aW9uKHByb21pc2Upe1xuICAgICAgICAgICAgICAgIGlmKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5wYV9pZG9wdGlvbnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHByb21pc2UuZGF0YSxmdW5jdGlvbih2YWx1ZSwga2V5KXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHVzaCh7XCJsYWJlbFwiOnZhbHVlLnBhX2NvZGUsXCJ2YWx1ZVwiOnZhbHVlLnBhX2lkLCBcIndpZHRoXCI6IHZhbHVlLnBhX3dpZHRoLCBcImhlaWdodFwiOiB2YWx1ZS5wYV9oZWlnaHQsIFwibWVhc3VyZVwiOiB2YWx1ZS5wYV9tZWFzdXJlfSk7XG4gICAgICAgICAgICAgICAgICAgIH0sJHNjb3BlLnBhX2lkb3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8kc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgXG4gICAgICAgICB9KTtcbiAgICB9XTtcbiAgICBcbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgcmV0dXJuIFsnJGh0dHAnLCAnJHEnLCAgJyRzdGF0ZVBhcmFtcycsIGZ1bmN0aW9uICgkaHR0cCwgJHEsICRzdGF0ZVBhcmFtcykge1xuICAgICAgICB2YXIgZmFjdG9yeSA9IHt9O1xuICAgICAgICBmYWN0b3J5LmdldENsaWVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKFxuICAgICAgICAgICAgICAgICRodHRwLnBvc3QoJy9hcGkvcHJvZHVjdC9vZmZzZXQvZ2VuZXJhbC9jbGllbnQnLCB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICAgICAgY2xfaWQ6ICRzdGF0ZVBhcmFtcy5jbF9pZFxuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICBmYWN0b3J5LmdldElua3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KCcvYXBpL3Byb2R1Y3Qvb2Zmc2V0L2dlbmVyYWwvaW5rJywge1xuICAgICAgICAgICAgICAgICAgICAvKiBQT1NUIHZhcmlhYmxlcyBoZXJlICovXG4gICAgICAgICAgICAgICAgICAgIHByb2NjZXNfaWQ6IG5ldyBEYXRlKCkuZ2V0TWlsbGlzZWNvbmRzKClcbiAgICAgICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeS5nZXRQYXBlcnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KCcvYXBpL3Byb2R1Y3Qvb2Zmc2V0L2dlbmVyYWwvcGFwZXInLCB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICAgICAgcHJvY2Nlc19pZDogbmV3IERhdGUoKS5nZXRNaWxsaXNlY29uZHMoKVxuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICBmYWN0b3J5LmFkZCA9IGZ1bmN0aW9uIChwcl9qc29uYikge1xuICAgICAgICAgICAgdmFyIHByb21pc2UgPSAkaHR0cC5wb3N0KCcvYXBpL3Byb2R1Y3QvYWRkJywge1xuICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICBwcl9qc29uYjogcHJfanNvbmJcbiAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGZhY3Rvcnk7XG4gICAgfV07XG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgcmV0dXJuIFsnJHNjb3BlJywgJ3Byb2R1Y3RGYWMnLCAnaTE4bkZpbHRlcicsXG4gICAgICAgIGZ1bmN0aW9uICgkc2NvcGUsIHByb2R1Y3RGYWMsIGkxOG5GaWx0ZXIpIHtcblxuICAgICAgICAgICAgJHNjb3BlLmxhYmVscyA9IE9iamVjdC5rZXlzKGkxOG5GaWx0ZXIoXCJwcm9kdWN0LmxhYmVsc1wiKSk7XG4gICAgICAgICAgICAkc2NvcGUuY29sdW1ucyA9IGkxOG5GaWx0ZXIoXCJwcm9kdWN0LmNvbHVtbnNcIik7XG4gICAgICAgIFxuICAgICAgICAgICAgLy9zZXQgUVIgQ29kZSBkYXRhIGRlZmF1bHRzXG4gICAgICAgICAgICAkc2NvcGUucXJjb2RlU3RyaW5nID0gJ1lPVVIgVEVYVCBUTyBFTkNPREUnO1xuICAgICAgICAgICAgJHNjb3BlLnNpemUgPSAyNTA7XG4gICAgICAgICAgICAkc2NvcGUuY29ycmVjdGlvbkxldmVsID0gJyc7XG4gICAgICAgICAgICAkc2NvcGUudHlwZU51bWJlciA9IDA7XG4gICAgICAgICAgICAkc2NvcGUuaW5wdXRNb2RlID0gJyc7XG4gICAgICAgICAgICAkc2NvcGUuaW1hZ2UgPSB0cnVlO1xuICAgICAgICBcbiAgICAgICAgICAgIC8vUVIgQ29kZSBtb2RhbFxuICAgICAgICAgICAgJCgnI215TW9kYWwnKS5vbignc2hvdy5icy5tb2RhbCcsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgICAgIHZhciBidXR0b24gPSAkKGV2ZW50LnJlbGF0ZWRUYXJnZXQpOyAvLyBCdXR0b24gdGhhdCB0cmlnZ2VyZWQgdGhlIG1vZGFsXG4gICAgICAgICAgICAgICAgJHNjb3BlLnFyY29kZVN0cmluZyA9IGJ1dHRvbi5kYXRhKCdjb2RlX2RhdGEnKTsvLyBFeHRyYWN0IGluZm8gZnJvbSBkYXRhLSogYXR0cmlidXRlc1xuICAgICAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIFxuICAgICAgICAgICAgLy8gZm9ybWF0SXRlbSBldmVudCBoYW5kbGVyXG4gICAgICAgICAgICB2YXIgcHJfaWQ7XG4gICAgICAgICAgICB2YXIgY2xfaWQ7XG4gICAgICAgICAgICB2YXIgcHJfcHJvY2VzcztcbiAgICAgICAgICAgIHZhciBwcl90eXBlO1xuICAgICAgICAgICAgdmFyIGNvZGVfZGF0YTtcbiAgICAgICAgICAgICRzY29wZS5mb3JtYXRJdGVtID0gZnVuY3Rpb24gKHMsIGUsIGNlbGwpIHtcblxuICAgICAgICAgICAgICAgIGlmIChlLnBhbmVsLmNlbGxUeXBlID09IHdpam1vLmdyaWQuQ2VsbFR5cGUuUm93SGVhZGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGUuY2VsbC50ZXh0Q29udGVudCA9IGUucm93ICsgMTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBzLnJvd3MuZGVmYXVsdFNpemUgPSAzMDtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIGFkZCBCb290c3RyYXAgaHRtbFxuICAgICAgICAgICAgICAgIGlmICgoZS5wYW5lbC5jZWxsVHlwZSA9PSB3aWptby5ncmlkLkNlbGxUeXBlLkNlbGwpICYmIChlLmNvbCA9PSAwKSkge1xuICAgICAgICAgICAgICAgICAgICBwcl9pZCA9IGUucGFuZWwuZ2V0Q2VsbERhdGEoZS5yb3csIDEsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgY2xfaWQgPSBlLnBhbmVsLmdldENlbGxEYXRhKGUucm93LCAyLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIHByX3Byb2Nlc3MgPSBlLnBhbmVsLmdldENlbGxEYXRhKGUucm93LCA2LCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIHByX3R5cGUgPSBlLnBhbmVsLmdldENlbGxEYXRhKGUucm93LCA3LCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGNvZGVfZGF0YSA9IChmdW5jdGlvbiAoKSB7IC8vUVIgQ29kZSBkYXRhIGZyb20gY29sdW1ucyBcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ZXh0ID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8ICRzY29wZS5sYWJlbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0ICs9IGkxOG5GaWx0ZXIoXCJwcm9kdWN0LmxhYmVscy5cIiArICRzY29wZS5sYWJlbHNbaV0pICsgJzogJyArIGUucGFuZWwuZ2V0Q2VsbERhdGEoZS5yb3csIChpICsgMSksIGZhbHNlKSArICdcXG4nXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGV4dDtcbiAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgZS5jZWxsLnN0eWxlLm92ZXJmbG93ID0gJ3Zpc2libGUnO1xuICAgICAgICAgICAgICAgICAgICBlLmNlbGwuaW5uZXJIVE1MID0gJzxkaXYgY2xhc3M9XCJidG4tZ3JvdXAgYnRuLWdyb3VwLWp1c3RpZmllZFwiIHJvbGU9XCJncm91cFwiIGFyaWEtbGFiZWw9XCIuLi5cIj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidG4tZ3JvdXBcIiByb2xlPVwiZ3JvdXBcIj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiIy9wcm9kdWN0LycrIHByX3Byb2Nlc3MgKyAnLycgKyBwcl90eXBlICsgJy91cGRhdGUvJyArIGNsX2lkICsgJy8nICsgcHJfaWQgKyAnXCIgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHQgYnRuLXhzXCIgbmctY2xpY2s9XCJlZGl0KCRpdGVtLmNsX2lkKVwiPkVkaXRhcjwvYT5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJ0bi1ncm91cFwiIHJvbGU9XCJncm91cFwiPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGRhdGEtdG9nZ2xlPVwibW9kYWxcIiBkYXRhLXRhcmdldD1cIiNteU1vZGFsXCIgZGF0YS1jb2RlX2RhdGE9XCInKyBjb2RlX2RhdGEgKyAnXCIgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHQgYnRuLXhzXCI+UVIgQ29kZTwvYT5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj4nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgICAgICAvLyBiaW5kIGNvbHVtbnMgd2hlbiBncmlkIGlzIGluaXRpYWxpemVkXG4gICAgICAgICAgICAkc2NvcGUuaW5pdEdyaWQgPSBmdW5jdGlvbiAocywgZSkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgJHNjb3BlLmxhYmVscy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgY29sID0gbmV3IHdpam1vLmdyaWQuQ29sdW1uKCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbC5iaW5kaW5nID0gJHNjb3BlLmNvbHVtbnNbaV07XG4gICAgICAgICAgICAgICAgICAgIGNvbC5oZWFkZXIgPSBpMThuRmlsdGVyKFwicHJvZHVjdC5sYWJlbHMuXCIgKyAkc2NvcGUubGFiZWxzW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgY29sLndvcmRXcmFwID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGNvbC53aWR0aCA9IDE1MDtcbiAgICAgICAgICAgICAgICAgICAgcy5jb2x1bW5zLnB1c2goY29sKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgLy8gY3JlYXRlIHRoZSB0b29sdGlwIG9iamVjdFxuICAgICAgICAgICAgJHNjb3BlLiR3YXRjaCgnZ2dHcmlkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICgkc2NvcGUuZ2dHcmlkKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAvLyBzdG9yZSByZWZlcmVuY2UgdG8gZ3JpZFxuICAgICAgICAgICAgICAgICAgICB2YXIgZmxleCA9ICRzY29wZS5nZ0dyaWQ7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY3JlYXRlIHRvb2x0aXBcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRpcCA9IG5ldyB3aWptby5Ub29sdGlwKCksXG4gICAgICAgICAgICAgICAgICAgICAgICBybmcgPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIG1vbml0b3IgdGhlIG1vdXNlIG92ZXIgdGhlIGdyaWRcbiAgICAgICAgICAgICAgICAgICAgZmxleC5ob3N0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaHQgPSBmbGV4LmhpdFRlc3QoZXZ0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaHQucmFuZ2UuZXF1YWxzKHJuZykpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG5ldyBjZWxsIHNlbGVjdGVkLCBzaG93IHRvb2x0aXBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaHQuY2VsbFR5cGUgPT0gd2lqbW8uZ3JpZC5DZWxsVHlwZS5DZWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJuZyA9IGh0LnJhbmdlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29sID0gZmxleC5jb2x1bW5zW3JuZy5jb2xdLmhlYWRlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNlbGxFbGVtZW50ID0gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludChldnQuY2xpZW50WCwgZXZ0LmNsaWVudFkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2VsbEJvdW5kcyA9IHdpam1vLlJlY3QuZnJvbUJvdW5kaW5nUmVjdChjZWxsRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhID0gd2lqbW8uZXNjYXBlSHRtbChmbGV4LmdldENlbGxEYXRhKHJuZy5yb3csIHJuZy5jb2wsIHRydWUpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpcENvbnRlbnQgPSBjb2wgKyAnOiBcIjxiPicgKyBkYXRhICsgJzwvYj5cIic7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjZWxsRWxlbWVudC5jbGFzc05hbWUuaW5kZXhPZignd2otY2VsbCcpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpcC5zaG93KGZsZXguaG9zdEVsZW1lbnQsIHRpcENvbnRlbnQsIGNlbGxCb3VuZHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlwLmhpZGUoKTsgLy8gY2VsbCBtdXN0IGJlIGJlaGluZCBzY3JvbGwgYmFyLi4uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBmbGV4Lmhvc3RFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3V0JywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGlwLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJuZyA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkc2NvcGUuJG9uKCckdmlld0NvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgLy8gdGhpcyBjb2RlIGlzIGV4ZWN1dGVkIGFmdGVyIHRoZSB2aWV3IGlzIGxvYWRlZFxuICAgICAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBwcm9kdWN0RmFjLmRhdGEoKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmRhdGEgPSBuZXcgd2lqbW8uY29sbGVjdGlvbnMuQ29sbGVjdGlvblZpZXcocHJvbWlzZS5kYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1dO1xuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRodHRwJywgJyRxJywgICckc3RhdGVQYXJhbXMnLCBmdW5jdGlvbiAoJGh0dHAsICRxLCAkc3RhdGVQYXJhbXMpIHtcbiAgICAgICAgdmFyIGZhY3RvcnkgPSB7fTtcbiAgICAgICAgZmFjdG9yeS5kYXRhID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoXG4gICAgICAgICAgICAgICAgJGh0dHAucG9zdCgnL2FwaS9wcm9kdWN0L2NsX2lkJywge1xuICAgICAgICAgICAgICAgICAgICAvKiBQT1NUIHZhcmlhYmxlcyBoZXJlICovXG4gICAgICAgICAgICAgICAgICAgIHByb2NjZXNfaWQ6IG5ldyBEYXRlKCkuZ2V0TWlsbGlzZWNvbmRzKCksXG4gICAgICAgICAgICAgICAgICAgIGNsX2lkOiAkc3RhdGVQYXJhbXMuY2xfaWQsXG4gICAgICAgICAgICAgICAgICAgIHByX3N0YXR1czogJ0EnXG4gICAgICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6ICBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZmFjdG9yeTtcbiAgICB9XTtcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oYW5ndWxhcil7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIFxuICAgIHJldHVybiBhbmd1bGFyLm1vZHVsZSgnYXBwLnN1cHBsaWVyJyxbXG4gICAgICAgIHJlcXVpcmUoJy4vbW9kdWxlcy9zdXBwbGllci5hZGQnKS5uYW1lLFxuICAgICAgICByZXF1aXJlKCcuL21vZHVsZXMvc3VwcGxpZXIudXBkYXRlJykubmFtZVxuICAgIF0pXG5cbiAgICAuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJyxcbiAgICBmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdzdXBwbGllcicsIHtcbiAgICAgICAgICAgIHVybDonL3N1cHBsaWVyJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsIDogJ2FwcC9zdXBwbGllci9zdXBwbGllci52aWV3Lmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlciA6ICdzdXBwbGllckN0cmwnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHJlcXVpcmVzTG9naW46IHRydWVcbiAgICAgICAgICAgIH0gICAgXG4gICAgICAgIH0pO1xuICAgIH1dKVxuXG4gICAgLmZhY3RvcnkoJ3N1cHBsaWVyRmFjJyxyZXF1aXJlKCcuL3N1cHBsaWVyLmZhYycpKVxuXG4gICAgLmNvbnRyb2xsZXIoJ3N1cHBsaWVyQ3RybCcscmVxdWlyZSgnLi9zdXBwbGllci5jdHJsJykpXG4gICAgXG59KShhbmd1bGFyKTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCIgOiBcIlByb3ZlZWRvcmVzXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibGFiZWxzXCI6e1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdS1pZFwiOlwiaWQgcHJvdmVlZG9yXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN1LWNvcnBvcmF0ZW5hbWVcIjpcInJhesOzbiBzb2NpYWxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3UtdGluXCI6XCJyZmNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3UtbmFtZVwiOlwibm9tYnJlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN1LWZhdGhlcnNsYXN0bmFtZVwiOlwiYXBlbGxpZG8gcGF0ZXJub1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdS1tb3RoZXJzbGFzdG5hbWVcIjpcImFwZWxsaWRvIG1hdGVybm9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3Utc3RyZWV0XCI6XCJjYWxsZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdS1zdHJlZXRudW1iZXJcIjpcIm51bWVybyBleHRlcmlvclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdS1zdWl0ZW51bWJlclwiOlwibnVtZXJvIGludGVyaW9yXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN1LW5laWdoYm9yaG9vZFwiOlwiY29sb25pYVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdS1hZGRyZXNzcmVmZXJlbmNlXCI6XCJyZWZlcmVuY2lhXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN1LWNvdW50cnlcIjpcInBhw61zXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN1LXN0YXRlXCI6XCJlc3RhZG9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3UtY2l0eVwiOlwiY2l1ZGFkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN1LWNvdW50eVwiOlwibXVuaWNpcGlvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN1LXppcGNvZGVcIjpcImNvZGlnbyBwb3N0YWxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3UtZW1haWxcIjpcImNvcnJlbyBlbGVjdHLDs25pY29cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3UtcGhvbmVcIjpcInRlbMOpZm9ub1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdS1tb2JpbGVcIjpcIm3Ds3ZpbFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdS1zdGF0dXNcIjpcImVzdGF0dXNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3UtZGF0ZVwiOlwiZmVjaGFcIixcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgIFwiY29sdW1uc1wiOltcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3VfaWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3VfY29ycG9yYXRlbmFtZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdV90aW5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3VfbmFtZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdV9mYXRoZXJzbGFzdG5hbWVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3VfbW90aGVyc2xhc3RuYW1lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN1X3N0cmVldFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdV9zdHJlZXRudW1iZXJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3Vfc3VpdGVudW1iZXJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3VfbmVpZ2hib3Job29kXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN1X2FkZHJlc3NyZWZlcmVuY2VcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3VfY291bnRyeVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdV9zdGF0ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdV9jaXR5XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN1X2NvdW50eVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdV96aXBjb2RlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN1X2VtYWlsXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN1X3Bob25lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN1X21vYmlsZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdV9zdGF0dXNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3VfZGF0ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgIFwiZmllbGRzXCIgOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdV9zdGF0dXNvcHRpb25zIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJBY3Rpdm9cIixcInZhbHVlXCI6XCJBXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJJbmFjdGl2b1wiLFwidmFsdWVcIjpcIklcIn1cbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKGFuZ3VsYXIpe1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBcbiAgICByZXR1cm4gYW5ndWxhci5tb2R1bGUoJ2FwcC5zdXBwbGllci5hZGQnLFtdKVxuXG4gICAgLmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsXG4gICAgZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnc3VwcGxpZXJBZGQnLCB7XG4gICAgICAgICAgICB1cmw6Jy9zdXBwbGllci9hZGQnLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmwgOiAnYXBwL3N1cHBsaWVyL21vZHVsZXMvc3VwcGxpZXIuYWRkL3N1cHBsaWVyLmFkZC52aWV3Lmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlciA6ICdzdXBwbGllckFkZEN0cmwnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHJlcXVpcmVzTG9naW46IHRydWVcbiAgICAgICAgICAgIH0gICAgXG4gICAgICAgIH0pO1xuICAgIH1dKVxuXG4gICAgLmZhY3RvcnkoJ3N1cHBsaWVyQWRkRmFjJyxyZXF1aXJlKCcuL3N1cHBsaWVyLmFkZC5mYWMnKSlcblxuICAgIC5jb250cm9sbGVyKCdzdXBwbGllckFkZEN0cmwnLHJlcXVpcmUoJy4vc3VwcGxpZXIuYWRkLmN0cmwnKSlcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIiA6IFwiYWdyZWdhciBwcm92ZWVkb3JcIixcbiAgICAgICAgICAgICAgICB9IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oYW5ndWxhcil7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIFxuICAgIHJldHVybiBbJyRzY29wZScsICdzdXBwbGllckFkZEZhYycsICckbG9jYXRpb24nLCAnaTE4bkZpbHRlcicsICckaW50ZXJ2YWwnLFxuICAgIGZ1bmN0aW9uICgkc2NvcGUsIHN1cHBsaWVyQWRkRmFjLCAkbG9jYXRpb24sIGkxOG5GaWx0ZXIsICRpbnRlcnZhbCkge1xuICAgICAgICAkc2NvcGUuZm1EYXRhID0ge307XG5cbiAgICAgICAgJHNjb3BlLm9uU3VibWl0ID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHN1cHBsaWVyQWRkRmFjLmFkZCgkc2NvcGUuZm1EYXRhKS50aGVuKGZ1bmN0aW9uKHByb21pc2Upe1xuICAgICAgICAgICAgICAgIGlmKHByb21pc2UuZGF0YSA9PSBcIjFcIikge1xuICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3N1cHBsaWVyJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnVwZGF0ZUZhaWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5nZXRTdGF0ZXMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICRzY29wZS5zdV9zdGF0ZW9wdGlvbnMgPSBbXTtcbiAgICAgICAgICAgICRzY29wZS5zdV9jaXR5b3B0aW9ucyA9IFtdO1xuICAgICAgICAgICAgJHNjb3BlLnN1X2NvdW50eW9wdGlvbnMgPSBbXTtcbiAgICAgICAgICAgICRpbnRlcnZhbChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHN1cHBsaWVyQWRkRmFjLmdldFN0YXRlcygkc2NvcGUuZm1EYXRhLnN1X2NvdW50cnkpLnRoZW4oZnVuY3Rpb24ocHJvbWlzZSl7XG4gICAgICAgICAgICAgICAgICAgIGlmKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEuZ2VvbmFtZXMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuc3Vfc3RhdGVvcHRpb25zID0gcHJvbWlzZS5kYXRhLmdlb25hbWVzO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8kc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sMCwxKTtcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS5nZXRDaXR5Q291bnR5ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkc2NvcGUuc3VfY2l0eW9wdGlvbnMgPSBbXTtcbiAgICAgICAgICAgICRzY29wZS5zdV9jb3VudHlvcHRpb25zID0gW107XG4gICAgICAgICAgICAkaW50ZXJ2YWwoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBzdXBwbGllckFkZEZhYy5nZXRTdGF0ZXMoJHNjb3BlLmZtRGF0YS5zdV9zdGF0ZSkudGhlbihmdW5jdGlvbihwcm9taXNlKXtcbiAgICAgICAgICAgICAgICAgICAgaWYoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YS5nZW9uYW1lcykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5zdV9jaXR5b3B0aW9ucyA9IHByb21pc2UuZGF0YS5nZW9uYW1lcztcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5zdV9jb3VudHlvcHRpb25zID0gcHJvbWlzZS5kYXRhLmdlb25hbWVzO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8kc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sMCwxKTtcbiAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICAgICRzY29wZS5zdV9zdGF0dXNvcHRpb25zID0gaTE4bkZpbHRlcihcInN1cHBsaWVyLmZpZWxkcy5zdV9zdGF0dXNvcHRpb25zXCIpO1xuXG4gICAgICAgICRzY29wZS4kb24oJyR2aWV3Q29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vIHRoaXMgY29kZSBpcyBleGVjdXRlZCBhZnRlciB0aGUgdmlldyBpcyBsb2FkZWRcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgc3VwcGxpZXJBZGRGYWMuZ2V0Q291bnRyaWVzKCkudGhlbihmdW5jdGlvbihwcm9taXNlKXtcbiAgICAgICAgICAgICAgICBpZihhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhLmdlb25hbWVzKSkge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuc3VfY291bnRyeW9wdGlvbnMgPSBwcm9taXNlLmRhdGEuZ2VvbmFtZXM7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8kc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgIH0pO1xuICAgIH1dO1xuICAgIFxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckaHR0cCcsICckcScsICAnJHN0YXRlUGFyYW1zJywgZnVuY3Rpb24gKCRodHRwLCAkcSwgJHN0YXRlUGFyYW1zKSB7XG4gICAgICAgIHZhciBmYWN0b3J5ID0ge307XG4gICAgICAgIGZhY3RvcnkuYWRkID0gZnVuY3Rpb24gKHN1X2pzb25iKSB7XG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9ICRodHRwLnBvc3QoJ21vZHVsZXMvc3VwcGxpZXIvbW9kdWxlcy9zdXBwbGllci5hZGQvc3VwcGxpZXIuYWRkLm1kbC5hZGQucGhwJywge1xuICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICBzdV9qc29uYjogc3VfanNvbmJcbiAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeS5nZXRDb3VudHJpZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9ICRodHRwLmdldCgnaHR0cDovL2FwaS5nZW9uYW1lcy5vcmcvY291bnRyeUluZm9KU09OP3VzZXJuYW1lPWFsZWphbmRyb2xzY2EnKVxuICAgICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeS5nZXRTdGF0ZXMgPSBmdW5jdGlvbiAoc3VfY291bnRyeSkge1xuICAgICAgICAgICAgdmFyIHByb21pc2UgPSAkaHR0cC5nZXQoJ2h0dHA6Ly9hcGkuZ2VvbmFtZXMub3JnL2NoaWxkcmVuSlNPTj9nZW9uYW1lSWQ9JyArIHN1X2NvdW50cnkgKyAnJnVzZXJuYW1lPWFsZWphbmRyb2xzY2EnKVxuICAgICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeS5nZXRDaXR5Q291bnR5ID0gZnVuY3Rpb24gKHN1X3N0YXRlKSB7XG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9ICRodHRwLmdldCgnaHR0cDovL2FwaS5nZW9uYW1lcy5vcmcvY2hpbGRyZW5KU09OP2dlb25hbWVJZD0nICsgc3Vfc3RhdGUgKyAnJnVzZXJuYW1lPWFsZWphbmRyb2xzY2EnKVxuICAgICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGZhY3Rvcnk7XG4gICAgfV07XG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKGFuZ3VsYXIpe1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBcbiAgICByZXR1cm4gYW5ndWxhci5tb2R1bGUoJ2FwcC5zdXBwbGllci51cGRhdGUnLFtdKVxuXG4gICAgLmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsXG4gICAgZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnc3VwcGxpZXJVcGRhdGUnLCB7XG4gICAgICAgICAgICB1cmw6Jy9zdXBwbGllci91cGRhdGUvOnN1X2lkJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsIDogJ2FwcC9zdXBwbGllci9tb2R1bGVzL3N1cHBsaWVyLnVwZGF0ZS9zdXBwbGllci51cGRhdGUudmlldy5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXIgOiAnc3VwcGxpZXJVcGRhdGVDdHJsJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICByZXF1aXJlc0xvZ2luOiB0cnVlXG4gICAgICAgICAgICB9ICAgIFxuICAgICAgICB9KTtcbiAgICB9XSlcblxuICAgIC5mYWN0b3J5KCdzdXBwbGllclVwZGF0ZUZhYycscmVxdWlyZSgnLi9zdXBwbGllci51cGRhdGUuZmFjJykpXG5cbiAgICAuY29udHJvbGxlcignc3VwcGxpZXJVcGRhdGVDdHJsJyxyZXF1aXJlKCcuL3N1cHBsaWVyLnVwZGF0ZS5jdHJsJykpXG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCIgOiBcImFjdHVhbGl6YXIgcHJvdmVlZG9yXCIsXG4gICAgICAgICAgICAgICAgfSIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgcmV0dXJuIFsnJHNjb3BlJywgJ3N1cHBsaWVyVXBkYXRlRmFjJywgJyRsb2NhdGlvbicsICdpMThuRmlsdGVyJywgJyRpbnRlcnZhbCcsXG4gICAgICAgIGZ1bmN0aW9uICgkc2NvcGUsIHN1cHBsaWVyVXBkYXRlRmFjLCAkbG9jYXRpb24sIGkxOG5GaWx0ZXIsICRpbnRlcnZhbCkge1xuXG4gICAgICAgICAgICAkc2NvcGUub25TdWJtaXQgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICBzdXBwbGllclVwZGF0ZUZhYy51cGRhdGUoJHNjb3BlLmZtRGF0YSkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocHJvbWlzZS5kYXRhID09IFwiMVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3N1cHBsaWVyJyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICRzY29wZS5nZXRTdGF0ZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnN1X3N0YXRlb3B0aW9ucyA9IFtdO1xuICAgICAgICAgICAgICAgICRzY29wZS5zdV9jaXR5b3B0aW9ucyA9IFtdO1xuICAgICAgICAgICAgICAgICRzY29wZS5zdV9jb3VudHlvcHRpb25zID0gW107XG4gICAgICAgICAgICAgICAgJGludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgc3VwcGxpZXJVcGRhdGVGYWMuZ2V0U3RhdGVzKCRzY29wZS5mbURhdGEuc3VfY291bnRyeSkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEuZ2VvbmFtZXMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnN1X3N0YXRlb3B0aW9ucyA9IHByb21pc2UuZGF0YS5nZW9uYW1lcztcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8kc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sIDAsIDEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkc2NvcGUuZ2V0Q2l0eUNvdW50eSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUuc3VfY2l0eW9wdGlvbnMgPSBbXTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuc3VfY291bnR5b3B0aW9ucyA9IFtdO1xuICAgICAgICAgICAgICAgICRpbnRlcnZhbChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHN1cHBsaWVyVXBkYXRlRmFjLmdldFN0YXRlcygkc2NvcGUuZm1EYXRhLnN1X3N0YXRlKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YS5nZW9uYW1lcykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuc3VfY2l0eW9wdGlvbnMgPSBwcm9taXNlLmRhdGEuZ2VvbmFtZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnN1X2NvdW50eW9wdGlvbnMgPSBwcm9taXNlLmRhdGEuZ2VvbmFtZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vJHNjb3BlLnVwZGF0ZUZhaWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LCAwLCAxKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJHNjb3BlLnN1X3N0YXR1c29wdGlvbnMgPSBpMThuRmlsdGVyKFwic3VwcGxpZXIuZmllbGRzLnN1X3N0YXR1c29wdGlvbnNcIik7XG5cbiAgICAgICAgICAgICRzY29wZS4kb24oJyR2aWV3Q29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAvLyB0aGlzIGNvZGUgaXMgZXhlY3V0ZWQgYWZ0ZXIgdGhlIHZpZXcgaXMgbG9hZGVkXG4gICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHN1cHBsaWVyVXBkYXRlRmFjLmRhdGEoKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzT2JqZWN0KGFuZ3VsYXIuZnJvbUpzb24ocHJvbWlzZS5kYXRhKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5mbURhdGEgPSBhbmd1bGFyLmZyb21Kc29uKHByb21pc2UuZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgc3VwcGxpZXJVcGRhdGVGYWMuZ2V0Q291bnRyaWVzKCkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEuZ2VvbmFtZXMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnN1X2NvdW50cnlvcHRpb25zID0gcHJvbWlzZS5kYXRhLmdlb25hbWVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyRzY29wZS51cGRhdGVGYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdXBwbGllclVwZGF0ZUZhYy5nZXRTdGF0ZXMoJHNjb3BlLmZtRGF0YS5zdV9jb3VudHJ5KS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEuZ2VvbmFtZXMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5zdV9zdGF0ZW9wdGlvbnMgPSBwcm9taXNlLmRhdGEuZ2VvbmFtZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8kc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdXBwbGllclVwZGF0ZUZhYy5nZXRDaXR5Q291bnR5KCRzY29wZS5mbURhdGEuc3Vfc3RhdGUpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YS5nZW9uYW1lcykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnN1X2NpdHlvcHRpb25zID0gcHJvbWlzZS5kYXRhLmdlb25hbWVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuc3VfY291bnR5b3B0aW9ucyA9IHByb21pc2UuZGF0YS5nZW9uYW1lcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyRzY29wZS51cGRhdGVGYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1dO1xuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbihhbmd1bGFyKXtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgXG4gICAgcmV0dXJuIFsnJGh0dHAnLCAnJHEnLCAgJyRzdGF0ZVBhcmFtcycsIGZ1bmN0aW9uKCRodHRwLCAkcSwgJHN0YXRlUGFyYW1zKXtcbiAgICAgICAgdmFyIGZhY3RvcnkgPSB7fTtcbiAgICAgICAgZmFjdG9yeS5kYXRhID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KCdtb2R1bGVzL3N1cHBsaWVyL21vZHVsZXMvc3VwcGxpZXIudXBkYXRlL3N1cHBsaWVyLnVwZGF0ZS5tZGwuZ2V0c3VwcGxpZXIucGhwJywge1xuICAgICAgICAgICAgICAgICAgICAvKiBQT1NUIHZhcmlhYmxlcyBoZXJlICovXG4gICAgICAgICAgICAgICAgICAgIHN1X2lkOiAkc3RhdGVQYXJhbXMuc3VfaWRcbiAgICAgICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XCJzdGF0dXNcIjogZmFsc2V9O1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkudXBkYXRlID0gZnVuY3Rpb24oc3VfanNvbmIpIHtcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKFxuICAgICAgICAgICAgICAgICRodHRwLnBvc3QoJ21vZHVsZXMvc3VwcGxpZXIvbW9kdWxlcy9zdXBwbGllci51cGRhdGUvc3VwcGxpZXIudXBkYXRlLm1kbC51cGRhdGUucGhwJywge1xuICAgICAgICAgICAgICAgICAgICAvKiBQT1NUIHZhcmlhYmxlcyBoZXJlICovXG4gICAgICAgICAgICAgICAgICAgIHN1X2lkOiAkc3RhdGVQYXJhbXMuc3VfaWQsXG4gICAgICAgICAgICAgICAgICAgIHN1X2pzb25iOiBzdV9qc29uYlxuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcInN0YXR1c1wiOiBmYWxzZX07XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeS5nZXRDb3VudHJpZXMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gJGh0dHAuZ2V0KCdodHRwOi8vYXBpLmdlb25hbWVzLm9yZy9jb3VudHJ5SW5mb0pTT04/dXNlcm5hbWU9YWxlamFuZHJvbHNjYScpXG4gICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZyl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1wic3RhdHVzXCI6IGZhbHNlfTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkuZ2V0U3RhdGVzID0gZnVuY3Rpb24oc3VfY291bnRyeSkge1xuICAgICAgICAgICAgdmFyIHByb21pc2UgPSAkaHR0cC5nZXQoJ2h0dHA6Ly9hcGkuZ2VvbmFtZXMub3JnL2NoaWxkcmVuSlNPTj9nZW9uYW1lSWQ9JytzdV9jb3VudHJ5KycmdXNlcm5hbWU9YWxlamFuZHJvbHNjYScpXG4gICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZyl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XCJzdGF0dXNcIjogZmFsc2V9O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeS5nZXRDaXR5Q291bnR5ID0gZnVuY3Rpb24oc3Vfc3RhdGUpIHtcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gJGh0dHAuZ2V0KCdodHRwOi8vYXBpLmdlb25hbWVzLm9yZy9jaGlsZHJlbkpTT04/Z2VvbmFtZUlkPScrc3Vfc3RhdGUrJyZ1c2VybmFtZT1hbGVqYW5kcm9sc2NhJylcbiAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcInN0YXR1c1wiOiBmYWxzZX07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZmFjdG9yeTtcbiAgICB9XTtcbiAgICBcbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgcmV0dXJuIFsnJHNjb3BlJywgJ3N1cHBsaWVyRmFjJywgJ2kxOG5GaWx0ZXInLFxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCBzdXBwbGllckZhYywgaTE4bkZpbHRlcikge1xuXG4gICAgICAgICAgICAkc2NvcGUubGFiZWxzID0gT2JqZWN0LmtleXMoaTE4bkZpbHRlcihcInN1cHBsaWVyLmxhYmVsc1wiKSk7XG4gICAgICAgICAgICAkc2NvcGUuY29sdW1ucyA9IGkxOG5GaWx0ZXIoXCJzdXBwbGllci5jb2x1bW5zXCIpO1xuICAgICAgICBcbiAgICAgICAgICAgIC8vIGZvcm1hdEl0ZW0gZXZlbnQgaGFuZGxlclxuICAgICAgICAgICAgdmFyIHN1X2lkO1xuICAgICAgICAgICAgJHNjb3BlLmZvcm1hdEl0ZW0gPSBmdW5jdGlvbiAocywgZSwgY2VsbCkge1xuXG4gICAgICAgICAgICAgICAgaWYgKGUucGFuZWwuY2VsbFR5cGUgPT0gd2lqbW8uZ3JpZC5DZWxsVHlwZS5Sb3dIZWFkZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgZS5jZWxsLnRleHRDb250ZW50ID0gZS5yb3cgKyAxO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHMucm93cy5kZWZhdWx0U2l6ZSA9IDMwO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gYWRkIEJvb3RzdHJhcCBodG1sXG4gICAgICAgICAgICAgICAgaWYgKChlLnBhbmVsLmNlbGxUeXBlID09IHdpam1vLmdyaWQuQ2VsbFR5cGUuQ2VsbCkgJiYgKGUuY29sID09IDApKSB7XG4gICAgICAgICAgICAgICAgICAgIHN1X2lkID0gZS5wYW5lbC5nZXRDZWxsRGF0YShlLnJvdywgMSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBlLmNlbGwuc3R5bGUub3ZlcmZsb3cgPSAndmlzaWJsZSc7XG4gICAgICAgICAgICAgICAgICAgIGUuY2VsbC5pbm5lckhUTUwgPSAnPGRpdiBjbGFzcz1cImJ0bi1ncm91cCBidG4tZ3JvdXAtanVzdGlmaWVkXCIgcm9sZT1cImdyb3VwXCIgYXJpYS1sYWJlbD1cIi4uLlwiPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJ0bi1ncm91cFwiIHJvbGU9XCJncm91cFwiPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIjL3N1cHBsaWVyL3VwZGF0ZS8nKyBzdV9pZCArICdcIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdCBidG4teHNcIiBuZy1jbGljaz1cImVkaXQoJGl0ZW0uc3VfaWQpXCI+RWRpdGFyPC9hPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2Pic7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgICAgIC8vIGJpbmQgY29sdW1ucyB3aGVuIGdyaWQgaXMgaW5pdGlhbGl6ZWRcbiAgICAgICAgICAgICRzY29wZS5pbml0R3JpZCA9IGZ1bmN0aW9uIChzLCBlKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAkc2NvcGUubGFiZWxzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjb2wgPSBuZXcgd2lqbW8uZ3JpZC5Db2x1bW4oKTtcbiAgICAgICAgICAgICAgICAgICAgY29sLmJpbmRpbmcgPSAkc2NvcGUuY29sdW1uc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgY29sLmhlYWRlciA9IGkxOG5GaWx0ZXIoXCJzdXBwbGllci5sYWJlbHMuXCIgKyAkc2NvcGUubGFiZWxzW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgY29sLndvcmRXcmFwID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGNvbC53aWR0aCA9IDE1MDtcbiAgICAgICAgICAgICAgICAgICAgcy5jb2x1bW5zLnB1c2goY29sKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgLy8gY3JlYXRlIHRoZSB0b29sdGlwIG9iamVjdFxuICAgICAgICAgICAgJHNjb3BlLiR3YXRjaCgnZ2dHcmlkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICgkc2NvcGUuZ2dHcmlkKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAvLyBzdG9yZSByZWZlcmVuY2UgdG8gZ3JpZFxuICAgICAgICAgICAgICAgICAgICB2YXIgZmxleCA9ICRzY29wZS5nZ0dyaWQ7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY3JlYXRlIHRvb2x0aXBcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRpcCA9IG5ldyB3aWptby5Ub29sdGlwKCksXG4gICAgICAgICAgICAgICAgICAgICAgICBybmcgPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIG1vbml0b3IgdGhlIG1vdXNlIG92ZXIgdGhlIGdyaWRcbiAgICAgICAgICAgICAgICAgICAgZmxleC5ob3N0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaHQgPSBmbGV4LmhpdFRlc3QoZXZ0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaHQucmFuZ2UuZXF1YWxzKHJuZykpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG5ldyBjZWxsIHNlbGVjdGVkLCBzaG93IHRvb2x0aXBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaHQuY2VsbFR5cGUgPT0gd2lqbW8uZ3JpZC5DZWxsVHlwZS5DZWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJuZyA9IGh0LnJhbmdlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29sID0gZmxleC5jb2x1bW5zW3JuZy5jb2xdLmhlYWRlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNlbGxFbGVtZW50ID0gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludChldnQuY2xpZW50WCwgZXZ0LmNsaWVudFkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2VsbEJvdW5kcyA9IHdpam1vLlJlY3QuZnJvbUJvdW5kaW5nUmVjdChjZWxsRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhID0gd2lqbW8uZXNjYXBlSHRtbChmbGV4LmdldENlbGxEYXRhKHJuZy5yb3csIHJuZy5jb2wsIHRydWUpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpcENvbnRlbnQgPSBjb2wgKyAnOiBcIjxiPicgKyBkYXRhICsgJzwvYj5cIic7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjZWxsRWxlbWVudC5jbGFzc05hbWUuaW5kZXhPZignd2otY2VsbCcpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpcC5zaG93KGZsZXguaG9zdEVsZW1lbnQsIHRpcENvbnRlbnQsIGNlbGxCb3VuZHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlwLmhpZGUoKTsgLy8gY2VsbCBtdXN0IGJlIGJlaGluZCBzY3JvbGwgYmFyLi4uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBmbGV4Lmhvc3RFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3V0JywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGlwLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJuZyA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkc2NvcGUuJG9uKCckdmlld0NvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgLy8gdGhpcyBjb2RlIGlzIGV4ZWN1dGVkIGFmdGVyIHRoZSB2aWV3IGlzIGxvYWRlZFxuICAgICAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBzdXBwbGllckZhYy5kYXRhKCkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5kYXRhID0gbmV3IHdpam1vLmNvbGxlY3Rpb25zLkNvbGxlY3Rpb25WaWV3KHByb21pc2UuZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XTtcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckaHR0cCcsICckcScsICBmdW5jdGlvbiAoJGh0dHAsICRxKSB7XG4gICAgICAgIHZhciBmYWN0b3J5ID0ge307XG4gICAgICAgIGZhY3RvcnkuZGF0YSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKFxuICAgICAgICAgICAgICAgICRodHRwLnBvc3QoJ21vZHVsZXMvc3VwcGxpZXIvc3VwcGxpZXIubWRsLmdldHN1cHBsaWVycy5waHAnLCB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICAgICAgcHJvY2Nlc19pZDogbmV3IERhdGUoKS5nZXRNaWxsaXNlY29uZHMoKVxuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGZhY3Rvcnk7XG4gICAgfV07XG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKGFuZ3VsYXIpe1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBcbiAgICByZXR1cm4gYW5ndWxhci5tb2R1bGUoJ2FwcC51c2VyJyxbXG4gICAgICAgIHJlcXVpcmUoJy4vbW9kdWxlcy91c2VyLmFkZCcpLm5hbWUsXG4gICAgICAgIHJlcXVpcmUoJy4vbW9kdWxlcy91c2VyLnVwZGF0ZScpLm5hbWUsXG4gICAgICAgIHJlcXVpcmUoJy4vbW9kdWxlcy91c2VyLnByb2ZpbGUnKS5uYW1lXG4gICAgXSlcblxuICAgIC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLFxuICAgIGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcbiAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3VzZXInLCB7XG4gICAgICAgICAgICB1cmw6Jy91c2VyJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsIDogJ2FwcC91c2VyL3VzZXIudmlldy5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXIgOiAndXNlckN0cmwnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHJlcXVpcmVzTG9naW46IHRydWVcbiAgICAgICAgICAgIH0gICAgXG4gICAgICAgIH0pO1xuICAgIH1dKVxuXG4gICAgLmZhY3RvcnkoJ3VzZXJGYWMnLHJlcXVpcmUoJy4vdXNlci5mYWMnKSlcblxuICAgIC5jb250cm9sbGVyKCd1c2VyQ3RybCcscmVxdWlyZSgnLi91c2VyLmN0cmwnKSlcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIiA6IFwidXN1YXJpb3NcIixcbiAgICAgICAgICAgICAgICAgICAgXCJsYWJlbHNcIjp7XG4gICAgICAgICAgICAgICAgICAgICAgICBcInVzLWlkXCI6IFwiaWQgdXN1YXJpb1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJnci1pZFwiOiBcImlkIGdydXBvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInVzLXVzZXJcIjogXCJ1c3VhcmlvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInVzLXBhc3N3b3JkXCI6IFwiY29udHJhc2XDsWFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidXMtbmFtZVwiOiBcIm5vbWJyZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ1cy1mYXRoZXJzbGFzdG5hbWVcIjogXCJhcGVsbGlkbyBwYXRlcm5vXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInVzLW1vdGhlcnNsYXN0bmFtZVwiOiBcImFwZWxsaWRvIG1hdGVybm9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidXMtZW1haWxcIjogXCJjb3JyZW8gZWxlY3Ryw7NuaWNvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInVzLXBob25lXCI6IFwidGVsw6lmb25vXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInVzLW1vYmlsZVwiOiBcIm3Ds3ZpbFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ1cy1zdGF0dXNcIjogXCJlc3RhdHVzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInVzLWRhdGVcIjogXCJmZWNoYVwiXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIFwiY29sdW1uc1wiOltcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidXNfaWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZ3JfaWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidXNfdXNlclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ1c19wYXNzd29yZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ1c19uYW1lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInVzX2ZhdGhlcnNsYXN0bmFtZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ1c19tb3RoZXJzbGFzdG5hbWVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidXNfZW1haWxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidXNfcGhvbmVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidXNfbW9iaWxlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInVzX3N0YXR1c1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ1c19kYXRlXCJcbiAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgIH0iLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbihhbmd1bGFyKXtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgXG4gICAgcmV0dXJuIGFuZ3VsYXIubW9kdWxlKCdhcHAudXNlci5hZGQnLFtdKVxuXG4gICAgLmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsXG4gICAgZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgndXNlckFkZCcsIHtcbiAgICAgICAgICAgIHVybDonL3VzZXIvYWRkJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsIDogJ2FwcC91c2VyL21vZHVsZXMvdXNlci5hZGQvdXNlci5hZGQudmlldy5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXIgOiAndXNlckFkZEN0cmwnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHJlcXVpcmVzTG9naW46IHRydWVcbiAgICAgICAgICAgIH0gICAgXG4gICAgICAgIH0pO1xuICAgIH1dKVxuXG4gICAgLmZhY3RvcnkoJ3VzZXJBZGRGYWMnLHJlcXVpcmUoJy4vdXNlci5hZGQuZmFjJykpXG5cbiAgICAuY29udHJvbGxlcigndXNlckFkZEN0cmwnLHJlcXVpcmUoJy4vdXNlci5hZGQuY3RybCcpKVxuICAgIFxufSkoYW5ndWxhcik7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiIDogXCJhZ3JlZ2FyIHVzdWFyaW9cIixcbiAgICAgICAgICAgICAgICB9IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckc2NvcGUnLCAndXNlckFkZEZhYycsICckbG9jYXRpb24nLFxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCB1c2VyQWRkRmFjLCAkbG9jYXRpb24pIHtcblxuICAgICAgICAgICAgJHNjb3BlLm9uU3VibWl0ID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgdXNlckFkZEZhYy5hZGQoJHNjb3BlLmZtRGF0YSkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocHJvbWlzZS5kYXRhID09IFwiMVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3VzZXInKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS51cGRhdGVGYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgJHNjb3BlLiRvbignJHZpZXdDb250ZW50TG9hZGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIC8vIHRoaXMgY29kZSBpcyBleGVjdXRlZCBhZnRlciB0aGUgdmlldyBpcyBsb2FkZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XTtcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oYW5ndWxhcil7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIFxuICAgIHJldHVybiBbJyRodHRwJywgJyRxJywgICckc3RhdGVQYXJhbXMnLFxuICAgIGZ1bmN0aW9uKCRodHRwLCAkcSwgJHN0YXRlUGFyYW1zKXtcbiAgICAgICAgdmFyIGZhY3RvcnkgPSB7fTtcbiAgICAgICAgZmFjdG9yeS5hZGQgPSBmdW5jdGlvbih1c19qc29uYikge1xuICAgICAgICAgICAgdmFyIHByb21pc2UgPSAkaHR0cC5wb3N0KCdtb2R1bGVzL3VzZXIvbW9kdWxlcy91c2VyLmFkZC91c2VyLmFkZC5tb2RlbC5waHAnLCB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICAgICAgdXNfanNvbmI6IHVzX2pzb25iXG4gICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XCJzdGF0dXNcIjogZmFsc2V9O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGZhY3Rvcnk7XG4gICAgfV07XG4gICAgXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbihhbmd1bGFyKXtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgXG4gICAgcmV0dXJuIGFuZ3VsYXIubW9kdWxlKCdhcHAudXNlci5wcm9maWxlJyxbXSlcblxuICAgIC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLFxuICAgIGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcbiAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3VzZXJQcm9maWxlJywge1xuICAgICAgICAgICAgdXJsOicvdXNlci9wcm9maWxlJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsIDogJ2FwcC91c2VyL21vZHVsZXMvdXNlci5wcm9maWxlL3VzZXIucHJvZmlsZS52aWV3Lmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlciA6ICd1c2VyUHJvZmlsZUN0cmwnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHJlcXVpcmVzTG9naW46IHRydWVcbiAgICAgICAgICAgIH0gICAgXG4gICAgICAgIH0pO1xuICAgIH1dKVxuXG4gICAgLmNvbnRyb2xsZXIoJ3VzZXJQcm9maWxlQ3RybCcscmVxdWlyZSgnLi91c2VyLnByb2ZpbGUuY3RybCcpKVxuICAgIFxufSkoYW5ndWxhcik7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiIDogXCJwZXJmaWwgZGVsIHVzdWFyaW9cIixcbiAgICAgICAgICAgICAgICB9IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oYW5ndWxhcil7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIFxuICAgIHJldHVybiBbJyRzY29wZScsICckbG9jYXRpb24nLCAnaTE4bkZpbHRlcicsICckcm9vdFNjb3BlJyxcbiAgICBmdW5jdGlvbiAoJHNjb3BlLCAkbG9jYXRpb24sIGkxOG5GaWx0ZXIsICRyb290U2NvcGUpIHtcbiAgICAgICAgJHNjb3BlLnVzZXIgPSAkcm9vdFNjb3BlLnVzZXI7XG4gICAgICAgICRzY29wZS4kb24oJyR2aWV3Q29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vIHRoaXMgY29kZSBpcyBleGVjdXRlZCBhZnRlciB0aGUgdmlldyBpcyBsb2FkZWRcbiAgICAgICAgIH0pO1xuICAgIH1dO1xuICAgIFxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oYW5ndWxhcil7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIFxuICAgIHJldHVybiBhbmd1bGFyLm1vZHVsZSgnYXBwLnVzZXIudXBkYXRlJyxbXSlcblxuICAgIC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLFxuICAgIGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcbiAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3VzZXJVcGRhdGUnLCB7XG4gICAgICAgICAgICB1cmw6Jy91c2VyL3VwZGF0ZS86dXNfaWQnLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmwgOiAnYXBwL3VzZXIvbW9kdWxlcy91c2VyLnVwZGF0ZS91c2VyLnVwZGF0ZS52aWV3Lmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlciA6ICd1c2VyVXBkYXRlQ3RybCcsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgcmVxdWlyZXNMb2dpbjogdHJ1ZVxuICAgICAgICAgICAgfSAgICBcbiAgICAgICAgfSk7XG4gICAgfV0pXG5cbiAgICAuZmFjdG9yeSgndXNlclVwZGF0ZUZhYycscmVxdWlyZSgnLi91c2VyLnVwZGF0ZS5mYWMnKSlcblxuICAgIC5jb250cm9sbGVyKCd1c2VyVXBkYXRlQ3RybCcscmVxdWlyZSgnLi91c2VyLnVwZGF0ZS5jdHJsJykpXG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCIgOiBcImFjdHVhbGl6YXIgdXN1YXJpb1wiLFxuICAgICAgICAgICAgICAgIH0iLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRzY29wZScsICd1c2VyVXBkYXRlRmFjJywgJyRsb2NhdGlvbicsXG4gICAgICAgIGZ1bmN0aW9uICgkc2NvcGUsIHVzZXJVcGRhdGVGYWMsICRsb2NhdGlvbikge1xuXG4gICAgICAgICAgICAkc2NvcGUub25TdWJtaXQgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICB1c2VyVXBkYXRlRmFjLnVwZGF0ZSgkc2NvcGUuZm1EYXRhKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9taXNlLmRhdGEgPT0gXCIxXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvdXNlcicpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnVwZGF0ZUZhaWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAkc2NvcGUuJG9uKCckdmlld0NvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgLy8gdGhpcyBjb2RlIGlzIGV4ZWN1dGVkIGFmdGVyIHRoZSB2aWV3IGlzIGxvYWRlZFxuXG4gICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHVzZXJVcGRhdGVGYWMuZGF0YSgpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNPYmplY3QoYW5ndWxhci5mcm9tSnNvbihwcm9taXNlLmRhdGEpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmZtRGF0YSA9IGFuZ3VsYXIuZnJvbUpzb24ocHJvbWlzZS5kYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG5cblxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1dO1xuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRodHRwJywgJyRxJywgICckc3RhdGVQYXJhbXMnLCBmdW5jdGlvbiAoJGh0dHAsICRxLCAkc3RhdGVQYXJhbXMpIHtcbiAgICAgICAgdmFyIGZhY3RvcnkgPSB7fTtcbiAgICAgICAgZmFjdG9yeS5kYXRhID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoXG4gICAgICAgICAgICAgICAgJGh0dHAucG9zdCgnbW9kdWxlcy91c2VyL21vZHVsZXMvdXNlci51cGRhdGUvdXNlci51cGRhdGUubWRsLmdldFVzZXIucGhwJywge1xuICAgICAgICAgICAgICAgICAgICAvKiBQT1NUIHZhcmlhYmxlcyBoZXJlICovXG4gICAgICAgICAgICAgICAgICAgIHVzX2lkOiAkc3RhdGVQYXJhbXMudXNfaWRcbiAgICAgICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeS51cGRhdGUgPSBmdW5jdGlvbiAodXNfanNvbmIpIHtcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKFxuICAgICAgICAgICAgICAgICRodHRwLnBvc3QoJ21vZHVsZXMvdXNlci9tb2R1bGVzL3VzZXIudXBkYXRlL3VzZXIudXBkYXRlLm1kbC51cGRhdGUucGhwJywge1xuICAgICAgICAgICAgICAgICAgICAvKiBQT1NUIHZhcmlhYmxlcyBoZXJlICovXG4gICAgICAgICAgICAgICAgICAgIHVzX2lkOiAkc3RhdGVQYXJhbXMudXNfaWQsXG4gICAgICAgICAgICAgICAgICAgIHVzX2pzb25iOiB1c19qc29uYlxuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZmFjdG9yeTtcbiAgICB9XTtcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oYW5ndWxhcil7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIFxuICAgIHJldHVybiBbJyRzY29wZScsICd1c2VyRmFjJywgJ2kxOG5GaWx0ZXInLFxuICAgIGZ1bmN0aW9uICgkc2NvcGUsIHVzZXJGYWMsIGkxOG5GaWx0ZXIpIHtcbiAgICAgICAgXG4gICAgICAgICRzY29wZS5sYWJlbHMgPSBPYmplY3Qua2V5cyhpMThuRmlsdGVyKFwidXNlci5sYWJlbHNcIikpO1xuICAgICAgICAkc2NvcGUuY29sdW1ucyA9IGkxOG5GaWx0ZXIoXCJ1c2VyLmNvbHVtbnNcIik7XG5cbiAgICAgICAgJHNjb3BlLmVkaXQgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzTnVtYmVyKGlkKSkge1xuICAgICAgICAgICAgICAgICAgICAvL0VtYmVkIHRoZSBpZCB0byB0aGUgbGlua1xuICAgICAgICAgICAgICAgICAgICB2YXIgbGluayA9IFwiIy91c2VyL3VwZGF0ZS9cIiArIGlkO1xuICAgICAgICAgICAgICAgICAgICAvL09wZW4gdGhlIGxpbmtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uID0gbGluaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS5kdXBsaWNhdGUgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzTnVtYmVyKGlkKSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbGluayA9IFwiIy91c2VyL2R1cGxpY2F0ZS9cIiArIGlkO1xuICAgICAgICAgICAgICAgICAgICAvL09wZW4gdGhlIGxpbmtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uID0gbGluaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy8gYmluZCBjb2x1bW5zIHdoZW4gZ3JpZCBpcyBpbml0aWFsaXplZFxuICAgICAgICAkc2NvcGUuaW5pdEdyaWQgPSBmdW5jdGlvbihzLCBlKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8ICRzY29wZS5sYWJlbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgY29sID0gbmV3IHdpam1vLmdyaWQuQ29sdW1uKCk7XG4gICAgICAgICAgICAgICAgY29sLmJpbmRpbmcgPSAkc2NvcGUuY29sdW1uc1tpXTtcbiAgICAgICAgICAgICAgICBjb2wuaGVhZGVyID0gaTE4bkZpbHRlcihcInVzZXIubGFiZWxzLlwiICsgJHNjb3BlLmxhYmVsc1tpXSk7XG4gICAgICAgICAgICAgICAgcy5jb2x1bW5zLnB1c2goY29sKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuJG9uKCckdmlld0NvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyB0aGlzIGNvZGUgaXMgZXhlY3V0ZWQgYWZ0ZXIgdGhlIHZpZXcgaXMgbG9hZGVkXG4gICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG4gICAgICAgICAgICB1c2VyRmFjLmRhdGEoKS50aGVuKGZ1bmN0aW9uKHByb21pc2Upe1xuICAgICAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgaWYoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmRhdGEgPSBuZXcgd2lqbW8uY29sbGVjdGlvbnMuQ29sbGVjdGlvblZpZXcocHJvbWlzZS5kYXRhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgIH0pO1xuICAgIH1dO1xuICAgIFxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckaHR0cCcsICckcScsICBmdW5jdGlvbiAoJGh0dHAsICRxKSB7XG4gICAgICAgIHZhciBmYWN0b3J5ID0ge307XG4gICAgICAgIGZhY3RvcnkuZGF0YSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKFxuICAgICAgICAgICAgICAgICRodHRwLnBvc3QoJ21vZHVsZXMvdXNlci91c2VyLm1kbC5nZXRVc2Vycy5waHAnLCB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGZhY3Rvcnk7XG4gICAgfV07XG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKGFuZ3VsYXIpe1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBcbiAgICByZXR1cm4gYW5ndWxhci5tb2R1bGUoJ2FwcC53bycsW1xuICAgICAgICByZXF1aXJlKCcuL21vZHVsZXMvd28uYWRkJykubmFtZSxcbiAgICAgICAgcmVxdWlyZSgnLi9tb2R1bGVzL3dvLnVwZGF0ZScpLm5hbWUsXG4gICAgICAgIHJlcXVpcmUoJy4vbW9kdWxlcy93by5kdXBsaWNhdGUnKS5uYW1lXG4gICAgXSlcblxuICAgIC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLFxuICAgIGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcbiAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3dvJywge1xuICAgICAgICAgICAgdXJsOicvd28vOmNsX2lkJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsIDogJ2FwcC93by93by52aWV3Lmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlciA6ICd3b0NvbnRyb2xsZXInLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHJlcXVpcmVzTG9naW46IHRydWVcbiAgICAgICAgICAgIH0gICAgXG4gICAgICAgIH0pO1xuICAgIH1dKVxuXG4gICAgLmZhY3RvcnkoJ3dvRmFjdG9yeScscmVxdWlyZSgnLi93by5mYWMnKSlcblxuICAgIC5jb250cm9sbGVyKCd3b0NvbnRyb2xsZXInLHJlcXVpcmUoJy4vd28uY3RybCcpKVxuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBcInRpdGxlXCI6IFwiT3JkZW5lcyBkZSBUcmFiYWpvXCIsXG4gICAgXCJsYWJlbHNcIjoge1xuICAgICAgICBcIndvLWlkXCI6IFwiTm8uIG9yZGVuXCIsXG4gICAgICAgIFwiY2wtaWRcIjogXCJjbGllbnRlXCIsXG4gICAgICAgIFwiem8taWRcIjogXCJ6b25hXCIsXG4gICAgICAgIFwid28tb3JkZXJlZGJ5XCI6IFwiT3JkZW5hZG8gcG9yXCIsXG4gICAgICAgIFwid28tYXR0ZW50aW9uXCI6IFwiQXRlbmNpw7NuXCIsXG4gICAgICAgIFwibWEtaWRcIjogXCJNYXF1aW5hXCIsXG4gICAgICAgIFwid28tcmVsZWFzZVwiOiBcIlJlbGVhc2VcIixcbiAgICAgICAgXCJ3by1wb1wiOiBcIk9yZGVuIGRlIGNvbXByYVwiLFxuICAgICAgICBcIndvLWxpbmVcIjogXCJMaW5lYVwiLFxuICAgICAgICBcIndvLWxpbmV0b3RhbFwiOiBcIkRlXCIsXG4gICAgICAgIFwicHItaWRcIjogXCJQcm9kdWN0b1wiLFxuICAgICAgICBcIndvLXF0eVwiOiBcIkNhbnRpZGFkXCIsXG4gICAgICAgIFwid28tcGFja2FnZXF0eVwiOiBcIkNhbnRpZGFkIHggcGFxdWV0ZVwiLFxuICAgICAgICBcIndvLWV4Y2VkZW50cXR5XCI6IFwiRXhjZWRlbnRlXCIsXG4gICAgICAgIFwid28tZm9saW9zcGVyZm9ybWF0XCI6IFwiRm9saW9zIHggZm9ybWF0b1wiLFxuICAgICAgICBcIndvLWZvbGlvc3Nlcmllc1wiOiBcIlNlcmllXCIsXG4gICAgICAgIFwid28tZm9saW9zZnJvbVwiOiBcIkRlbFwiLFxuICAgICAgICBcIndvLWZvbGlvc3RvXCI6IFwiQWxcIixcbiAgICAgICAgXCJ3by10eXBlXCI6IFwiVGlwb1wiLFxuICAgICAgICBcIndvLWNvbW1pdG1lbnRkYXRlXCI6IFwiRmVjaGEgY29tcHJvbWlzb1wiLFxuICAgICAgICBcIndvLXByZXZpb3VzaWRcIjogXCJJRCBhbnRlcmlvclwiLFxuICAgICAgICBcIndvLXByZXZpb3VzZGF0ZVwiOiBcIkZlY2hhIGFudGVyaW9yXCIsXG4gICAgICAgIFwid28tbm90ZXNcIjogXCJOb3Rhc1wiLFxuICAgICAgICBcIndvLXByaWNlXCI6IFwiUHJlY2lvXCIsXG4gICAgICAgIFwid28tY3VycmVuY3lcIjogXCJNb25lZGFcIixcbiAgICAgICAgXCJ3by1lbWFpbFwiOiBcIkVudmlhciBDb3JyZW9cIixcbiAgICAgICAgXCJ3by1zdGF0dXNcIjogXCJFc3RhdHVzXCIsXG4gICAgICAgIFwid28tZGF0ZVwiOiBcIkZlY2hhXCJcbiAgICB9LFxuICAgIFwiY29sdW1uc1wiOiBbXG4gICAgICAgIFwid29faWRcIixcbiAgICAgICAgXCJjbF9pZFwiLFxuICAgICAgICBcInpvX2lkXCIsXG4gICAgICAgIFwid29fb3JkZXJlZGJ5XCIsXG4gICAgICAgIFwid29fYXR0ZW50aW9uXCIsXG4gICAgICAgIFwibWFfaWRcIixcbiAgICAgICAgXCJ3b19yZWxlYXNlXCIsXG4gICAgICAgIFwid29fcG9cIixcbiAgICAgICAgXCJ3b19saW5lXCIsXG4gICAgICAgIFwid29fbGluZXRvdGFsXCIsXG4gICAgICAgIFwicHJfaWRcIixcbiAgICAgICAgXCJ3b19xdHlcIixcbiAgICAgICAgXCJ3b19wYWNrYWdlcXR5XCIsXG4gICAgICAgIFwid29fZXhjZWRlbnRxdHlcIixcbiAgICAgICAgXCJ3b19mb2xpb3NwZXJmb3JtYXRcIixcbiAgICAgICAgXCJ3b19mb2xpb3NzZXJpZXNcIixcbiAgICAgICAgXCJ3b19mb2xpb3Nmcm9tXCIsXG4gICAgICAgIFwid29fZm9saW9zdG9cIixcbiAgICAgICAgXCJ3b190eXBlXCIsXG4gICAgICAgIFwid29fY29tbWl0bWVudGRhdGVcIixcbiAgICAgICAgXCJ3b19wcmV2aW91c2lkXCIsXG4gICAgICAgIFwid29fcHJldmlvdXNkYXRlXCIsXG4gICAgICAgIFwid29fbm90ZXNcIixcbiAgICAgICAgXCJ3b19wcmljZVwiLFxuICAgICAgICBcIndvX2N1cnJlbmN5XCIsXG4gICAgICAgIFwid29fZW1haWxcIixcbiAgICAgICAgXCJ3b19zdGF0dXNcIixcbiAgICAgICAgXCJ3b19kYXRlXCJcbiAgICBdXG59IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oYW5ndWxhcil7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIFxuICAgIHJldHVybiBhbmd1bGFyLm1vZHVsZSgnYXBwLndvLmFkZCcsW10pXG5cbiAgICAuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJyxcbiAgICBmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCd3b0FkZCcsIHtcbiAgICAgICAgICAgIHVybDonL3dvL2FkZC86Y2xfaWQnLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmwgOiAnYXBwL3dvL21vZHVsZXMvd28uYWRkL3dvLmFkZC52aWV3Lmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlciA6ICd3b0FkZENvbnRyb2xsZXInLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHJlcXVpcmVzTG9naW46IHRydWVcbiAgICAgICAgICAgIH0gICAgXG4gICAgICAgIH0pO1xuICAgIH1dKVxuXG4gICAgLmZhY3RvcnkoJ3dvQWRkRmFjdG9yeScscmVxdWlyZSgnLi93by5hZGQuZmFjJykpXG5cbiAgICAuY29udHJvbGxlcignd29BZGRDb250cm9sbGVyJyxyZXF1aXJlKCcuL3dvLmFkZC5jdHJsJykpXG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgIFwidGl0bGVcIjogXCJBZ3JlZ2FyIE9yZGVuIGRlIFRyYWJham9cIixcbiAgICBcImxhYmVsc1wiOiB7XG4gICAgICAgIFwiY2wtaWRcIjogXCJjbGllbnRlXCIsXG4gICAgICAgIFwiem8taWRcIjogXCJ6b25hXCIsXG4gICAgICAgIFwid28tb3JkZXJlZGJ5XCI6IFwiT3JkZW5hZG8gcG9yXCIsXG4gICAgICAgIFwid28tYXR0ZW50aW9uXCI6IFwiQXRlbmNpw7NuXCIsXG4gICAgICAgIFwibWEtaWRcIjogXCJNYXF1aW5hXCIsXG4gICAgICAgIFwid28tcmVsZWFzZVwiOiBcIlJlbGVhc2VcIixcbiAgICAgICAgXCJ3by1wb1wiOiBcIk9yZGVuIGRlIGNvbXByYVwiLFxuICAgICAgICBcIndvLWxpbmVcIjogXCJMaW5lYVwiLFxuICAgICAgICBcIndvLWxpbmV0b3RhbFwiOiBcIkRlXCIsXG4gICAgICAgIFwicHItaWRcIjogXCJQcm9kdWN0b1wiLFxuICAgICAgICBcInByLXBhcnRub1wiOiBcIk5vLiBkZSBwYXJ0ZVwiLFxuICAgICAgICBcInByLWNvZGVcIjogXCJDb2RpZ29cIixcbiAgICAgICAgXCJwci1uYW1lXCI6IFwiTm9tYnJlXCIsXG4gICAgICAgIFwid28tcXR5XCI6IFwiQ2FudGlkYWRcIixcbiAgICAgICAgXCJ3by1wYWNrYWdlcXR5XCI6IFwiQ2FudGlkYWQgeCBwYXF1ZXRlXCIsXG4gICAgICAgIFwid28tZXhjZWRlbnRxdHlcIjogXCJFeGNlZGVudGVcIixcbiAgICAgICAgXCJ3by1mb2xpb3NwZXJmb3JtYXRcIjogXCJGb2xpb3MgeCBmb3JtYXRvXCIsXG4gICAgICAgIFwid28tZm9saW9zc2VyaWVzXCI6IFwiU2VyaWVcIixcbiAgICAgICAgXCJ3by1mb2xpb3Nmcm9tXCI6IFwiRGVsXCIsXG4gICAgICAgIFwid28tZm9saW9zdG9cIjogXCJBbFwiLFxuICAgICAgICBcIndvLXR5cGVcIjogXCJUaXBvXCIsXG4gICAgICAgIFwid28taWRcIjogXCJOby4gb3JkZW5cIixcbiAgICAgICAgXCJ3by1kYXRlXCI6IFwiRmVjaGFcIixcbiAgICAgICAgXCJ3by1jb21taXRtZW50ZGF0ZVwiOiBcIkZlY2hhIGNvbXByb21pc29cIixcbiAgICAgICAgXCJ3by1wcmV2aW91c2lkXCI6IFwiSUQgYW50ZXJpb3JcIixcbiAgICAgICAgXCJ3by1wcmV2aW91c2RhdGVcIjogXCJGZWNoYSBhbnRlcmlvclwiLFxuICAgICAgICBcIndvLW5vdGVzXCI6IFwiTm90YXNcIixcbiAgICAgICAgXCJ3by1wcmljZVwiOiBcIlByZWNpb1wiLFxuICAgICAgICBcIndvLWN1cnJlbmN5XCI6IFwiTW9uZWRhXCIsXG4gICAgICAgIFwid28tZW1haWxcIjogXCJFbnZpYXIgQ29ycmVvXCIsXG4gICAgICAgIFwid28tc3RhdHVzXCI6IFwiRXN0YXR1c1wiXG4gICAgfSxcbiAgICBcImNvbHVtbnNcIjogW1xuICAgICAgICBcImNsX2lkXCIsXG4gICAgICAgIFwiem9faWRcIixcbiAgICAgICAgXCJ3b19vcmRlcmVkYnlcIixcbiAgICAgICAgXCJ3b19hdHRlbnRpb25cIixcbiAgICAgICAgXCJtYV9pZFwiLFxuICAgICAgICBcIndvX3JlbGVhc2VcIixcbiAgICAgICAgXCJ3b19wb1wiLFxuICAgICAgICBcIndvX2xpbmVcIixcbiAgICAgICAgXCJ3b19saW5ldG90YWxcIixcbiAgICAgICAgXCJwcl9pZFwiLFxuICAgICAgICBcInByX3BhcnRub1wiLFxuICAgICAgICBcInByX2NvZGVcIixcbiAgICAgICAgXCJwcl9uYW1lXCIsXG4gICAgICAgIFwid29fcXR5XCIsXG4gICAgICAgIFwid29fcGFja2FnZXF0eVwiLFxuICAgICAgICBcIndvX2V4Y2VkZW50cXR5XCIsXG4gICAgICAgIFwid29fZm9saW9zcGVyZm9ybWF0XCIsXG4gICAgICAgIFwid29fZm9saW9zc2VyaWVzXCIsXG4gICAgICAgIFwid29fZm9saW9zZnJvbVwiLFxuICAgICAgICBcIndvX2ZvbGlvc3RvXCIsXG4gICAgICAgIFwid29fdHlwZVwiLFxuICAgICAgICBcIndvX2lkXCIsXG4gICAgICAgIFwid29fZGF0ZVwiLFxuICAgICAgICBcIndvX2NvbW1pdG1lbnRkYXRlXCIsXG4gICAgICAgIFwid29fcHJldmlvdXNpZFwiLFxuICAgICAgICBcIndvX3ByZXZpb3VzZGF0ZVwiLFxuICAgICAgICBcIndvX25vdGVzXCIsXG4gICAgICAgIFwid29fcHJpY2VcIixcbiAgICAgICAgXCJ3b19jdXJyZW5jeVwiLFxuICAgICAgICBcIndvX2VtYWlsXCIsXG4gICAgICAgIFwid28tc3RhdHVzXCJcbiAgICBdLFxuICAgIFwiZmllbGRzXCI6IHtcbiAgICAgICAgd29fZm9saW9zcGVyZm9ybWF0b3B0aW9uczogW1xuICAgICAgICAgICAgeyBcImxhYmVsXCI6IFwiMVwiLCBcInZhbHVlXCI6IDEgfSxcbiAgICAgICAgICAgIHsgXCJsYWJlbFwiOiBcIjJcIiwgXCJ2YWx1ZVwiOiAyIH0sXG4gICAgICAgICAgICB7IFwibGFiZWxcIjogXCIzXCIsIFwidmFsdWVcIjogMyB9LFxuICAgICAgICAgICAgeyBcImxhYmVsXCI6IFwiNFwiLCBcInZhbHVlXCI6IDQgfSxcbiAgICAgICAgICAgIHsgXCJsYWJlbFwiOiBcIjVcIiwgXCJ2YWx1ZVwiOiA1IH0sXG4gICAgICAgICAgICB7IFwibGFiZWxcIjogXCI2XCIsIFwidmFsdWVcIjogNiB9LFxuICAgICAgICAgICAgeyBcImxhYmVsXCI6IFwiN1wiLCBcInZhbHVlXCI6IDcgfSxcbiAgICAgICAgICAgIHsgXCJsYWJlbFwiOiBcIjhcIiwgXCJ2YWx1ZVwiOiA4IH0sXG4gICAgICAgIF0sXG4gICAgICAgIHdvX2N1cnJlbmN5b3B0aW9uczogW1xuICAgICAgICAgICAgeyBcImxhYmVsXCI6IFwiTVhOXCIsIFwidmFsdWVcIjogXCJNWE5cIiB9LFxuICAgICAgICAgICAgeyBcImxhYmVsXCI6IFwiRExMU1wiLCBcInZhbHVlXCI6IFwiRExMU1wiIH0sXG4gICAgICAgIF0sXG4gICAgICAgIHdvX2VtYWlsb3B0aW9uczogW1xuICAgICAgICAgICAgeyBcImxhYmVsXCI6IFwiU0lcIiwgXCJ2YWx1ZVwiOiBcInllc1wiIH0sXG4gICAgICAgICAgICB7IFwibGFiZWxcIjogXCJOT1wiLCBcInZhbHVlXCI6IFwibm9cIiB9LFxuICAgICAgICBdXG4gICAgfVxufSIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgcmV0dXJuIFsnJHNjb3BlJywgJ3dvQWRkRmFjdG9yeScsICckc3RhdGVQYXJhbXMnLCAnaTE4bkZpbHRlcicsICckZmlsdGVyJywgJyRsb2NhdGlvbicsXG4gICAgICAgIGZ1bmN0aW9uICgkc2NvcGUsIHdvQWRkRmFjdG9yeSwgJHN0YXRlUGFyYW1zLCBpMThuRmlsdGVyLCAkZmlsdGVyLCAkbG9jYXRpb24pIHtcbiAgICAgICAgICAgICRzY29wZS5mbURhdGEgPSB7fTtcbiAgICAgICAgICAgIC8vJHNjb3BlLmZtRGF0YSA9IHtcInpvX2lkXCI6IFwiMlwiLCBcIndvX29yZGVyZWRieVwiOiBcIkFsZWphbmRyb1wiLCBcIndvX2F0dGVudGlvblwiOiBcIk1hcmNvXCIsIFwibWFfaWRcIjogMSwgXCJ3b19yZWxlYXNlXCI6IFwicmVsMDAxXCIsIFwid29fcG9cIjogXCJBQkMwMDFcIiwgXCJ3b19saW5lXCI6IFwiMVwiLCBcIndvX2xpbmV0b3RhbFwiOiBcIjRcIiwgXCJwcl9pZFwiOiBcIjE1XCIsIFwid29fcXR5XCI6IFwiMTAwXCIsIFwid29fcGFja2FnZXF0eVwiOiBcIjEwXCIsIFwid29fZXhjZWRlbnRxdHlcIjogXCIxMFwiLCBcIndvX2ZvbGlvc3BlcmZvcm1hdFwiOiAxLCBcIndvX2ZvbGlvc3Nlcmllc1wiOiBcIkFcIiwgXCJ3b19mb2xpb3Nmcm9tXCI6IFwiMVwiLCBcIndvX2ZvbGlvc3RvXCI6IFwiMTAwXCIsIFwid29fY29tbWl0bWVudGRhdGVcIjogXCIyMDE2LTA3LTAxXCIsIFwid29fbm90ZXNcIjogXCJFc3RhIGVzIHVuYSBvcmRlbiBkZSBwcnVlYmFcIiwgXCJ3b19wcmljZVwiOiBcIjk5Ljk5XCIsIFwid29fY3VycmVuY3lcIjogXCJETExTXCIsIFwid29fZW1haWxcIjogXCJ5ZXNcIiB9O1xuICAgICAgICAgICAgJHNjb3BlLmZtRGF0YS53b190eXBlID0gXCJOXCI7IC8vTi1uZXcsUi1yZXAsQy1jaGFuZ2VcbiAgICAgICAgICAgICRzY29wZS5mbURhdGEud29fc3RhdHVzID0gMDsgLy8wLUFjdGl2ZVxuICAgICAgICAgICAgJHNjb3BlLmZtRGF0YS5jbF9pZCA9ICRzdGF0ZVBhcmFtcy5jbF9pZDtcblxuICAgICAgICAgICAgJHNjb3BlLndvX2ZvbGlvc3BlcmZvcm1hdG9wdGlvbnMgPSBpMThuRmlsdGVyKFwid28tYWRkLmZpZWxkcy53b19mb2xpb3NwZXJmb3JtYXRvcHRpb25zXCIpO1xuICAgICAgICAgICAgJHNjb3BlLndvX2N1cnJlbmN5b3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJ3by1hZGQuZmllbGRzLndvX2N1cnJlbmN5b3B0aW9uc1wiKTtcbiAgICAgICAgICAgICRzY29wZS53b19lbWFpbG9wdGlvbnMgPSBpMThuRmlsdGVyKFwid28tYWRkLmZpZWxkcy53b19lbWFpbG9wdGlvbnNcIik7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICRzY29wZS5vblN1Ym1pdCA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgIHdvQWRkRmFjdG9yeS5hZGQoJHNjb3BlLmZtRGF0YSkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocHJvbWlzZS5kYXRhLnJvd0NvdW50ID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3dvLycrJHN0YXRlUGFyYW1zLmNsX2lkKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS51cGRhdGVGYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgJHNjb3BlLiRvbignJHZpZXdDb250ZW50TG9hZGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIC8vIHRoaXMgY29kZSBpcyBleGVjdXRlZCBhZnRlciB0aGUgdmlldyBpcyBsb2FkZWRcbiAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgd29BZGRGYWN0b3J5LmdldFpvbmUoKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS56b19pZG9wdGlvbnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcm93cyA9IHByb21pc2UuZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChyb3dzLCBmdW5jdGlvbiAodmFsdWUsIGtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHVzaCh7IFwibGFiZWxcIjogcm93c1trZXldWyd6b19qc29uYiddWyd6b19uYW1lJ10sIFwidmFsdWVcIjogcm93c1trZXldWyd6b19pZCddIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgJHNjb3BlLnpvX2lkb3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB3b0FkZEZhY3RvcnkuZ2V0TWFjaGluZSgpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLm1hX2lkb3B0aW9ucyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByb3dzID0gcHJvbWlzZS5kYXRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHJvd3MsIGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wdXNoKHsgXCJsYWJlbFwiOiByb3dzW2tleV1bJ21hX2pzb25iJ11bJ21hX25hbWUnXSwgXCJ2YWx1ZVwiOiByb3dzW2tleV1bJ21hX2lkJ10gfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAkc2NvcGUubWFfaWRvcHRpb25zKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHdvQWRkRmFjdG9yeS5nZXRQcm9kdWN0KCkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUucHJfaWRvcHRpb25zID0gW107XG4gICAgICAgICAgICAgICAgICAgIHZhciByb3dzID0gW107XG4gICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcm93cyA9IHByb21pc2UuZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChyb3dzLCBmdW5jdGlvbiAodmFsdWUsIGtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHVzaCh7IFwibGFiZWxcIjogcm93c1trZXldWydwcl9pZCddICsgJ18nICsgcm93c1trZXldWydwcl9qc29uYiddWydwcl9uYW1lJ10gKyAnXycgKyByb3dzW2tleV1bJ3ByX2pzb25iJ11bJ3ByX2NvZGUnXSwgXCJ2YWx1ZVwiOiByb3dzW2tleV1bJ3ByX2lkJ10gfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAkc2NvcGUucHJfaWRvcHRpb25zKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLiR3YXRjaChcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZm1EYXRhLnByX2lkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBwckNoYW5nZSggbmV3VmFsdWUsIG9sZFZhbHVlICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcm9kdWN0ID0gJGZpbHRlcignZmlsdGVyJykocm93cywgeyBcInByX2lkXCI6IG5ld1ZhbHVlIH0sIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcm9kdWN0Lmxlbmd0aCAhPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUucHJpbmZvID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUucHJpbmZvID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnByb2R1Y3QgPSBwcm9kdWN0WzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZm9saW8gPSAocHJvZHVjdFswXVsncHJfanNvbmInXVsncHJfZm9saW8nXT09PSd5ZXMnKSA/IHRydWUgOiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XTtcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRodHRwJywgJyRxJywgICckc3RhdGVQYXJhbXMnLCBmdW5jdGlvbigkaHR0cCwgJHEsICRzdGF0ZVBhcmFtcykge1xuICAgICAgICB2YXIgZmFjdG9yeSA9IHt9O1xuICAgICAgICBmYWN0b3J5LmdldFpvbmUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKFxuICAgICAgICAgICAgICAgICRodHRwLnBvc3QoJy9hcGkvem9uZS9jbF9pZCcsIHtcbiAgICAgICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgICAgICBjbF9pZDogJHN0YXRlUGFyYW1zLmNsX2lkXG4gICAgICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICBmYWN0b3J5LmdldE1hY2hpbmUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKFxuICAgICAgICAgICAgICAgICRodHRwLnBvc3QoJy9hcGkvbWFjaGluZScsIHtcbiAgICAgICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgICAgICBjbF9pZDogJHN0YXRlUGFyYW1zLmNsX2lkXG4gICAgICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICBmYWN0b3J5LmdldFByb2R1Y3QgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKFxuICAgICAgICAgICAgICAgICRodHRwLnBvc3QoJy9hcGkvcHJvZHVjdC9jbF9pZCcsIHtcbiAgICAgICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgICAgICBjbF9pZDogJHN0YXRlUGFyYW1zLmNsX2lkLFxuICAgICAgICAgICAgICAgICAgICBwcl9zdGF0dXM6ICdBJ1xuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeS5hZGQgPSBmdW5jdGlvbih3b19qc29uYikge1xuICAgICAgICAgICAgdmFyIHByb21pc2UgPSAkaHR0cC5wb3N0KCcvYXBpL3dvL2FkZCcsIHtcbiAgICAgICAgICAgICAgICAvKiBQT1NUIHZhcmlhYmxlcyBoZXJlICovXG4gICAgICAgICAgICAgICAgd29fanNvbmI6IHdvX2pzb25iXG4gICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGZhY3Rvcnk7XG4gICAgfV07XG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKGFuZ3VsYXIpe1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBcbiAgICByZXR1cm4gYW5ndWxhci5tb2R1bGUoJ2FwcC53by5kdXBsaWNhdGUnLFtdKVxuXG4gICAgLmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsXG4gICAgZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnd29EdXBsaWNhdGUnLCB7XG4gICAgICAgICAgICB1cmw6Jy93by9kdXBsaWNhdGUvOmNsX2lkLzp3b19pZCcsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybCA6ICdhcHAvd28vbW9kdWxlcy93by5kdXBsaWNhdGUvd28uZHVwbGljYXRlLnZpZXcuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyIDogJ3dvRHVwbGljYXRlQ29udHJvbGxlcicsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgcmVxdWlyZXNMb2dpbjogdHJ1ZVxuICAgICAgICAgICAgfSAgICBcbiAgICAgICAgfSk7XG4gICAgfV0pXG5cbiAgICAuZmFjdG9yeSgnd29EdXBsaWNhdGVGYWN0b3J5JyxyZXF1aXJlKCcuL3dvLmR1cGxpY2F0ZS5mYWMnKSlcblxuICAgIC5jb250cm9sbGVyKCd3b0R1cGxpY2F0ZUNvbnRyb2xsZXInLHJlcXVpcmUoJy4vd28uZHVwbGljYXRlLmN0cmwnKSlcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckc2NvcGUnLCAnd29EdXBsaWNhdGVGYWN0b3J5JywgJyRzdGF0ZVBhcmFtcycsICdpMThuRmlsdGVyJywgJyRmaWx0ZXInLFxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCB3b0R1cGxpY2F0ZUZhY3RvcnksICRzdGF0ZVBhcmFtcywgaTE4bkZpbHRlciwgJGZpbHRlcikge1xuXG4gICAgICAgICAgICAkc2NvcGUud29fZm9saW9zcGVyZm9ybWF0b3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJ3by1hZGQuZmllbGRzLndvX2ZvbGlvc3BlcmZvcm1hdG9wdGlvbnNcIik7XG4gICAgICAgICAgICAkc2NvcGUud29fY3VycmVuY3lvcHRpb25zID0gaTE4bkZpbHRlcihcIndvLWFkZC5maWVsZHMud29fY3VycmVuY3lvcHRpb25zXCIpO1xuICAgICAgICAgICAgJHNjb3BlLndvX2VtYWlsb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJ3by1hZGQuZmllbGRzLndvX2VtYWlsb3B0aW9uc1wiKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgJHNjb3BlLm9uU3VibWl0ID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgd29EdXBsaWNhdGVGYWN0b3J5LmFkZCgkc2NvcGUuZm1EYXRhKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9taXNlLmRhdGEucm93Q291bnQgPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy93by8nKyRzdGF0ZVBhcmFtcy5jbF9pZCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICRzY29wZS4kb24oJyR2aWV3Q29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAvLyB0aGlzIGNvZGUgaXMgZXhlY3V0ZWQgYWZ0ZXIgdGhlIHZpZXcgaXMgbG9hZGVkXG4gICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHdvRHVwbGljYXRlRmFjdG9yeS5nZXREYXRhKCkudGhlbihmdW5jdGlvbihwcm9taXNlKXtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgaWYoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YSkgJiYgcHJvbWlzZS5kYXRhLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5mbURhdGEgPSBwcm9taXNlLmRhdGFbMF0ud29fanNvbmI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmZtRGF0YS53b19wcmV2aW91c2lkID0gcHJvbWlzZS5kYXRhWzBdLndvX2lkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5mbURhdGEud29fcHJldmlvdXNkYXRlID0gcHJvbWlzZS5kYXRhWzBdLndvX2RhdGUuc3Vic3RyaW5nKDAsIDEwKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHdvRHVwbGljYXRlRmFjdG9yeS5nZXRab25lKCkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuem9faWRvcHRpb25zID0gW107XG4gICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJvd3MgPSBwcm9taXNlLmRhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2gocm93cywgZnVuY3Rpb24gKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnB1c2goeyBcImxhYmVsXCI6IHJvd3Nba2V5XVsnem9fanNvbmInXVsnem9fbmFtZSddLCBcInZhbHVlXCI6IHJvd3Nba2V5XVsnem9faWQnXSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sICRzY29wZS56b19pZG9wdGlvbnMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgd29EdXBsaWNhdGVGYWN0b3J5LmdldE1hY2hpbmUoKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5tYV9pZG9wdGlvbnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcm93cyA9IHByb21pc2UuZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChyb3dzLCBmdW5jdGlvbiAodmFsdWUsIGtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHVzaCh7IFwibGFiZWxcIjogcm93c1trZXldWydtYV9qc29uYiddWydtYV9uYW1lJ10sIFwidmFsdWVcIjogcm93c1trZXldWydtYV9pZCddIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgJHNjb3BlLm1hX2lkb3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB3b0R1cGxpY2F0ZUZhY3RvcnkuZ2V0UHJvZHVjdCgpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnByX2lkb3B0aW9ucyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICB2YXIgcm93cyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3MgPSBwcm9taXNlLmRhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2gocm93cywgZnVuY3Rpb24gKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnB1c2goeyBcImxhYmVsXCI6IHJvd3Nba2V5XVsncHJfaWQnXSArICdfJyArIHJvd3Nba2V5XVsncHJfanNvbmInXVsncHJfbmFtZSddICsgJ18nICsgcm93c1trZXldWydwcl9qc29uYiddWydwcl9jb2RlJ10sIFwidmFsdWVcIjogcm93c1trZXldWydwcl9pZCddIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgJHNjb3BlLnByX2lkb3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS4kd2F0Y2goXG4gICAgICAgICAgICAgICAgICAgICAgICBcImZtRGF0YS5wcl9pZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gcHJDaGFuZ2UoIG5ld1ZhbHVlLCBvbGRWYWx1ZSApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcHJvZHVjdCA9ICRmaWx0ZXIoJ2ZpbHRlcicpKHJvd3MsIHsgXCJwcl9pZFwiOiBuZXdWYWx1ZSB9LCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJvZHVjdC5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5wcmluZm8gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5wcmluZm8gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUucHJvZHVjdCA9IHByb2R1Y3RbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5mb2xpbyA9IChwcm9kdWN0WzBdWydwcl9qc29uYiddWydwcl9mb2xpbyddPT09J3llcycpID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1dO1xuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRodHRwJywgJyRxJywgICckc3RhdGVQYXJhbXMnLCBmdW5jdGlvbiAoJGh0dHAsICRxLCAkc3RhdGVQYXJhbXMpIHtcbiAgICAgICAgdmFyIGZhY3RvcnkgPSB7fTtcbiAgICAgICAgZmFjdG9yeS5nZXREYXRhID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoXG4gICAgICAgICAgICAgICAgJGh0dHAucG9zdCgnL2FwaS93by93b19pZCcsIHtcbiAgICAgICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgICAgICBjbF9pZDogJHN0YXRlUGFyYW1zLmNsX2lkLFxuICAgICAgICAgICAgICAgICAgICB3b19pZDogJHN0YXRlUGFyYW1zLndvX2lkXG4gICAgICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkuZ2V0Wm9uZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKFxuICAgICAgICAgICAgICAgICRodHRwLnBvc3QoJy9hcGkvem9uZS9jbF9pZCcsIHtcbiAgICAgICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgICAgICBjbF9pZDogJHN0YXRlUGFyYW1zLmNsX2lkXG4gICAgICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkuZ2V0TWFjaGluZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKFxuICAgICAgICAgICAgICAgICRodHRwLnBvc3QoJy9hcGkvbWFjaGluZScsIHtcbiAgICAgICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgICAgICBjbF9pZDogJHN0YXRlUGFyYW1zLmNsX2lkXG4gICAgICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkuZ2V0UHJvZHVjdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKFxuICAgICAgICAgICAgICAgICRodHRwLnBvc3QoJy9hcGkvcHJvZHVjdC9jbF9pZCcsIHtcbiAgICAgICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgICAgICBjbF9pZDogJHN0YXRlUGFyYW1zLmNsX2lkLFxuICAgICAgICAgICAgICAgICAgICBwcl9zdGF0dXM6ICdBJ1xuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICBmYWN0b3J5LmFkZCA9IGZ1bmN0aW9uICh3b19qc29uYikge1xuICAgICAgICAgICAgdmFyIHByb21pc2UgPSAkaHR0cC5wb3N0KCcvYXBpL3dvL2FkZCcsIHtcbiAgICAgICAgICAgICAgICAvKiBQT1NUIHZhcmlhYmxlcyBoZXJlICovXG4gICAgICAgICAgICAgICAgd29fanNvbmI6IHdvX2pzb25iXG4gICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KGNvbmZpZykpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGZhY3Rvcnk7XG4gICAgfV07XG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKGFuZ3VsYXIpe1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBcbiAgICByZXR1cm4gYW5ndWxhci5tb2R1bGUoJ2FwcC53by51cGRhdGUnLFtdKVxuXG4gICAgLmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsXG4gICAgZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnd29VcGRhdGUnLCB7XG4gICAgICAgICAgICB1cmw6Jy93by91cGRhdGUvOmNsX2lkLzp3b19pZCcsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybCA6ICdhcHAvd28vbW9kdWxlcy93by51cGRhdGUvd28udXBkYXRlLnZpZXcuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyIDogJ3dvVXBkYXRlQ29udHJvbGxlcicsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgcmVxdWlyZXNMb2dpbjogdHJ1ZVxuICAgICAgICAgICAgfSAgICBcbiAgICAgICAgfSk7XG4gICAgfV0pXG5cbiAgICAuZmFjdG9yeSgnd29VcGRhdGVGYWN0b3J5JyxyZXF1aXJlKCcuL3dvLnVwZGF0ZS5mYWMnKSlcblxuICAgIC5jb250cm9sbGVyKCd3b1VwZGF0ZUNvbnRyb2xsZXInLHJlcXVpcmUoJy4vd28udXBkYXRlLmN0cmwnKSlcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgXCJ0aXRsZVwiOiBcIkFjdHVhbGl6YXIgT3JkZW4gZGUgVHJhYmFqb1wiLFxuICAgIFwibGFiZWxzXCI6IHtcbiAgICAgICAgXCJjbC1pZFwiOiBcImNsaWVudGVcIixcbiAgICAgICAgXCJ6by1pZFwiOiBcInpvbmFcIixcbiAgICAgICAgXCJ3by1vcmRlcmVkYnlcIjogXCJPcmRlbmFkbyBwb3JcIixcbiAgICAgICAgXCJ3by1hdHRlbnRpb25cIjogXCJBdGVuY2nDs25cIixcbiAgICAgICAgXCJtYS1pZFwiOiBcIk1hcXVpbmFcIixcbiAgICAgICAgXCJ3by1yZWxlYXNlXCI6IFwiUmVsZWFzZVwiLFxuICAgICAgICBcIndvLXBvXCI6IFwiT3JkZW4gZGUgY29tcHJhXCIsXG4gICAgICAgIFwid28tbGluZVwiOiBcIkxpbmVhXCIsXG4gICAgICAgIFwid28tbGluZXRvdGFsXCI6IFwiRGVcIixcbiAgICAgICAgXCJwci1pZFwiOiBcIlByb2R1Y3RvXCIsXG4gICAgICAgIFwicHItcGFydG5vXCI6IFwiTm8uIGRlIHBhcnRlXCIsXG4gICAgICAgIFwicHItY29kZVwiOiBcIkNvZGlnb1wiLFxuICAgICAgICBcInByLW5hbWVcIjogXCJOb21icmVcIixcbiAgICAgICAgXCJ3by1xdHlcIjogXCJDYW50aWRhZFwiLFxuICAgICAgICBcIndvLXBhY2thZ2VxdHlcIjogXCJDYW50aWRhZCB4IHBhcXVldGVcIixcbiAgICAgICAgXCJ3by1leGNlZGVudHF0eVwiOiBcIkV4Y2VkZW50ZVwiLFxuICAgICAgICBcIndvLWZvbGlvc3BlcmZvcm1hdFwiOiBcIkZvbGlvcyB4IGZvcm1hdG9cIixcbiAgICAgICAgXCJ3by1mb2xpb3NzZXJpZXNcIjogXCJTZXJpZVwiLFxuICAgICAgICBcIndvLWZvbGlvc2Zyb21cIjogXCJEZWxcIixcbiAgICAgICAgXCJ3by1mb2xpb3N0b1wiOiBcIkFsXCIsXG4gICAgICAgIFwid28tdHlwZVwiOiBcIlRpcG9cIixcbiAgICAgICAgXCJ3by1pZFwiOiBcIk5vLiBvcmRlblwiLFxuICAgICAgICBcIndvLWRhdGVcIjogXCJGZWNoYVwiLFxuICAgICAgICBcIndvLWNvbW1pdG1lbnRkYXRlXCI6IFwiRmVjaGEgY29tcHJvbWlzb1wiLFxuICAgICAgICBcIndvLXByZXZpb3VzaWRcIjogXCJJRCBhbnRlcmlvclwiLFxuICAgICAgICBcIndvLXByZXZpb3VzZGF0ZVwiOiBcIkZlY2hhIGFudGVyaW9yXCIsXG4gICAgICAgIFwid28tbm90ZXNcIjogXCJOb3Rhc1wiLFxuICAgICAgICBcIndvLXByaWNlXCI6IFwiUHJlY2lvXCIsXG4gICAgICAgIFwid28tY3VycmVuY3lcIjogXCJNb25lZGFcIixcbiAgICAgICAgXCJ3by1lbWFpbFwiOiBcIkVudmlhciBDb3JyZW9cIixcbiAgICAgICAgXCJ3by1zdGF0dXNcIjogXCJFc3RhdHVzXCJcbiAgICB9LFxuICAgIFwiY29sdW1uc1wiOiBbXG4gICAgICAgIFwiY2xfaWRcIixcbiAgICAgICAgXCJ6b19pZFwiLFxuICAgICAgICBcIndvX29yZGVyZWRieVwiLFxuICAgICAgICBcIndvX2F0dGVudGlvblwiLFxuICAgICAgICBcIm1hX2lkXCIsXG4gICAgICAgIFwid29fcmVsZWFzZVwiLFxuICAgICAgICBcIndvX3BvXCIsXG4gICAgICAgIFwid29fbGluZVwiLFxuICAgICAgICBcIndvX2xpbmV0b3RhbFwiLFxuICAgICAgICBcInByX2lkXCIsXG4gICAgICAgIFwicHJfcGFydG5vXCIsXG4gICAgICAgIFwicHJfY29kZVwiLFxuICAgICAgICBcInByX25hbWVcIixcbiAgICAgICAgXCJ3b19xdHlcIixcbiAgICAgICAgXCJ3b19wYWNrYWdlcXR5XCIsXG4gICAgICAgIFwid29fZXhjZWRlbnRxdHlcIixcbiAgICAgICAgXCJ3b19mb2xpb3NwZXJmb3JtYXRcIixcbiAgICAgICAgXCJ3b19mb2xpb3NzZXJpZXNcIixcbiAgICAgICAgXCJ3b19mb2xpb3Nmcm9tXCIsXG4gICAgICAgIFwid29fZm9saW9zdG9cIixcbiAgICAgICAgXCJ3b190eXBlXCIsXG4gICAgICAgIFwid29faWRcIixcbiAgICAgICAgXCJ3b19kYXRlXCIsXG4gICAgICAgIFwid29fY29tbWl0bWVudGRhdGVcIixcbiAgICAgICAgXCJ3b19wcmV2aW91c2lkXCIsXG4gICAgICAgIFwid29fcHJldmlvdXNkYXRlXCIsXG4gICAgICAgIFwid29fbm90ZXNcIixcbiAgICAgICAgXCJ3b19wcmljZVwiLFxuICAgICAgICBcIndvX2N1cnJlbmN5XCIsXG4gICAgICAgIFwid29fZW1haWxcIixcbiAgICAgICAgXCJ3by1zdGF0dXNcIlxuICAgIF0sXG4gICAgXCJmaWVsZHNcIjoge1xuICAgICAgICB3b19mb2xpb3NwZXJmb3JtYXRvcHRpb25zOiBbXG4gICAgICAgICAgICB7IFwibGFiZWxcIjogXCIxXCIsIFwidmFsdWVcIjogMSB9LFxuICAgICAgICAgICAgeyBcImxhYmVsXCI6IFwiMlwiLCBcInZhbHVlXCI6IDIgfSxcbiAgICAgICAgICAgIHsgXCJsYWJlbFwiOiBcIjNcIiwgXCJ2YWx1ZVwiOiAzIH0sXG4gICAgICAgICAgICB7IFwibGFiZWxcIjogXCI0XCIsIFwidmFsdWVcIjogNCB9LFxuICAgICAgICAgICAgeyBcImxhYmVsXCI6IFwiNVwiLCBcInZhbHVlXCI6IDUgfSxcbiAgICAgICAgICAgIHsgXCJsYWJlbFwiOiBcIjZcIiwgXCJ2YWx1ZVwiOiA2IH0sXG4gICAgICAgICAgICB7IFwibGFiZWxcIjogXCI3XCIsIFwidmFsdWVcIjogNyB9LFxuICAgICAgICAgICAgeyBcImxhYmVsXCI6IFwiOFwiLCBcInZhbHVlXCI6IDggfSxcbiAgICAgICAgXSxcbiAgICAgICAgd29fY3VycmVuY3lvcHRpb25zOiBbXG4gICAgICAgICAgICB7IFwibGFiZWxcIjogXCJNWE5cIiwgXCJ2YWx1ZVwiOiBcIk1YTlwiIH0sXG4gICAgICAgICAgICB7IFwibGFiZWxcIjogXCJETExTXCIsIFwidmFsdWVcIjogXCJETExTXCIgfSxcbiAgICAgICAgXSxcbiAgICAgICAgd29fZW1haWxvcHRpb25zOiBbXG4gICAgICAgICAgICB7IFwibGFiZWxcIjogXCJTSVwiLCBcInZhbHVlXCI6IFwieWVzXCIgfSxcbiAgICAgICAgICAgIHsgXCJsYWJlbFwiOiBcIk5PXCIsIFwidmFsdWVcIjogXCJub1wiIH0sXG4gICAgICAgIF1cbiAgICB9XG59IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckc2NvcGUnLCAnd29VcGRhdGVGYWN0b3J5JywgJyRzdGF0ZVBhcmFtcycsICdpMThuRmlsdGVyJywgJyRmaWx0ZXInLCckbG9jYXRpb24nLFxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCB3b1VwZGF0ZUZhY3RvcnksICRzdGF0ZVBhcmFtcywgaTE4bkZpbHRlciwgJGZpbHRlciwgJGxvY2F0aW9uKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICRzY29wZS53b19mb2xpb3NwZXJmb3JtYXRvcHRpb25zID0gaTE4bkZpbHRlcihcIndvLWFkZC5maWVsZHMud29fZm9saW9zcGVyZm9ybWF0b3B0aW9uc1wiKTtcbiAgICAgICAgICAgICRzY29wZS53b19jdXJyZW5jeW9wdGlvbnMgPSBpMThuRmlsdGVyKFwid28tYWRkLmZpZWxkcy53b19jdXJyZW5jeW9wdGlvbnNcIik7XG4gICAgICAgICAgICAkc2NvcGUud29fZW1haWxvcHRpb25zID0gaTE4bkZpbHRlcihcIndvLWFkZC5maWVsZHMud29fZW1haWxvcHRpb25zXCIpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAkc2NvcGUub25TdWJtaXQgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICB3b1VwZGF0ZUZhY3RvcnkudXBkYXRlKCRzY29wZS5mbURhdGEpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb21pc2UuZGF0YS5yb3dDb3VudCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy93by8nKyRzdGF0ZVBhcmFtcy5jbF9pZCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICRzY29wZS4kb24oJyR2aWV3Q29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAvLyB0aGlzIGNvZGUgaXMgZXhlY3V0ZWQgYWZ0ZXIgdGhlIHZpZXcgaXMgbG9hZGVkXG4gICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHdvVXBkYXRlRmFjdG9yeS5nZXREYXRhKCkudGhlbihmdW5jdGlvbihwcm9taXNlKXtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgaWYoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YSkgJiYgcHJvbWlzZS5kYXRhLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5mbURhdGEgPSBwcm9taXNlLmRhdGFbMF0ud29fanNvbmI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLndvX2lkID0gcHJvbWlzZS5kYXRhWzBdLndvX2lkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS53b19kYXRlID0gcHJvbWlzZS5kYXRhWzBdLndvX2RhdGU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB3b1VwZGF0ZUZhY3RvcnkuZ2V0Wm9uZSgpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnpvX2lkb3B0aW9ucyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByb3dzID0gcHJvbWlzZS5kYXRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHJvd3MsIGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wdXNoKHsgXCJsYWJlbFwiOiByb3dzW2tleV1bJ3pvX2pzb25iJ11bJ3pvX25hbWUnXSwgXCJ2YWx1ZVwiOiByb3dzW2tleV1bJ3pvX2lkJ10gfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAkc2NvcGUuem9faWRvcHRpb25zKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHdvVXBkYXRlRmFjdG9yeS5nZXRNYWNoaW5lKCkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUubWFfaWRvcHRpb25zID0gW107XG4gICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJvd3MgPSBwcm9taXNlLmRhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2gocm93cywgZnVuY3Rpb24gKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnB1c2goeyBcImxhYmVsXCI6IHJvd3Nba2V5XVsnbWFfanNvbmInXVsnbWFfbmFtZSddLCBcInZhbHVlXCI6IHJvd3Nba2V5XVsnbWFfaWQnXSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sICRzY29wZS5tYV9pZG9wdGlvbnMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgd29VcGRhdGVGYWN0b3J5LmdldFByb2R1Y3QoKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5wcl9pZG9wdGlvbnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJvd3MgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3dzID0gcHJvbWlzZS5kYXRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHJvd3MsIGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wdXNoKHsgXCJsYWJlbFwiOiByb3dzW2tleV1bJ3ByX2lkJ10gKyAnXycgKyByb3dzW2tleV1bJ3ByX2pzb25iJ11bJ3ByX25hbWUnXSArICdfJyArIHJvd3Nba2V5XVsncHJfanNvbmInXVsncHJfY29kZSddLCBcInZhbHVlXCI6IHJvd3Nba2V5XVsncHJfaWQnXSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sICRzY29wZS5wcl9pZG9wdGlvbnMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuJHdhdGNoKFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJmbURhdGEucHJfaWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHByQ2hhbmdlKCBuZXdWYWx1ZSwgb2xkVmFsdWUgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHByb2R1Y3QgPSAkZmlsdGVyKCdmaWx0ZXInKShyb3dzLCB7IFwicHJfaWRcIjogbmV3VmFsdWUgfSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByb2R1Y3QubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUucHJpbmZvID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUucHJpbmZvID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnByb2R1Y3QgPSBwcm9kdWN0WzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZm9saW8gPSAocHJvZHVjdFswXVsncHJfanNvbmInXVsncHJfZm9saW8nXT09PSd5ZXMnKSA/IHRydWUgOiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XTtcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckaHR0cCcsICckcScsICAnJHN0YXRlUGFyYW1zJywgZnVuY3Rpb24gKCRodHRwLCAkcSwgJHN0YXRlUGFyYW1zKSB7XG4gICAgICAgIHZhciBmYWN0b3J5ID0ge307XG4gICAgICAgIGZhY3RvcnkuZ2V0RGF0YSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKFxuICAgICAgICAgICAgICAgICRodHRwLnBvc3QoJy9hcGkvd28vd29faWQnLCB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICAgICAgY2xfaWQ6ICRzdGF0ZVBhcmFtcy5jbF9pZCxcbiAgICAgICAgICAgICAgICAgICAgd29faWQ6ICRzdGF0ZVBhcmFtcy53b19pZFxuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICBmYWN0b3J5LmdldFpvbmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KCcvYXBpL3pvbmUvY2xfaWQnLCB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICAgICAgY2xfaWQ6ICRzdGF0ZVBhcmFtcy5jbF9pZFxuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICBmYWN0b3J5LmdldE1hY2hpbmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KCcvYXBpL21hY2hpbmUnLCB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICAgICAgY2xfaWQ6ICRzdGF0ZVBhcmFtcy5jbF9pZFxuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICBmYWN0b3J5LmdldFByb2R1Y3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KCcvYXBpL3Byb2R1Y3QvY2xfaWQnLCB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICAgICAgY2xfaWQ6ICRzdGF0ZVBhcmFtcy5jbF9pZCxcbiAgICAgICAgICAgICAgICAgICAgcHJfc3RhdHVzOiAnQSdcbiAgICAgICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeS51cGRhdGUgPSBmdW5jdGlvbiAod29fanNvbmIpIHtcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gJGh0dHAucG9zdCgnL2FwaS93by91cGRhdGUnLCB7XG4gICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgIHdvX2pzb25iOiB3b19qc29uYixcbiAgICAgICAgICAgICAgICB3b19pZDogJHN0YXRlUGFyYW1zLndvX2lkXG4gICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBmYWN0b3J5O1xuICAgIH1dO1xuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRzY29wZScsICd3b0ZhY3RvcnknLCAnJGxvY2F0aW9uJywgJ2kxOG5GaWx0ZXInLCAnJHN0YXRlUGFyYW1zJyxcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgd29GYWN0b3J5LCAkbG9jYXRpb24sIGkxOG5GaWx0ZXIsICRzdGF0ZVBhcmFtcykge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAkc2NvcGUubGFiZWxzID0gT2JqZWN0LmtleXMoaTE4bkZpbHRlcihcIndvLmxhYmVsc1wiKSk7XG4gICAgICAgICAgICAkc2NvcGUuY29sdW1ucyA9IGkxOG5GaWx0ZXIoXCJ3by5jb2x1bW5zXCIpO1xuXG4gICAgICAgICAgICAkc2NvcGUuZWRpdCA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzTnVtYmVyKGlkKSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbGluayA9IFwiIy93by91cGRhdGUvXCIgKyBpZDtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uID0gbGluaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAkc2NvcGUuZHVwbGljYXRlID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNOdW1iZXIoaWQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBsaW5rID0gXCIjL3dvL2R1cGxpY2F0ZS9cIiArIGlkO1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24gPSBsaW5rO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIGZvcm1hdEl0ZW0gZXZlbnQgaGFuZGxlclxuICAgICAgICAgICAgdmFyIHdvX2lkO1xuICAgICAgICAgICAgJHNjb3BlLmZvcm1hdEl0ZW0gPSBmdW5jdGlvbiAocywgZSwgY2VsbCkge1xuXG4gICAgICAgICAgICAgICAgaWYgKGUucGFuZWwuY2VsbFR5cGUgPT0gd2lqbW8uZ3JpZC5DZWxsVHlwZS5Sb3dIZWFkZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgZS5jZWxsLnRleHRDb250ZW50ID0gZS5yb3cgKyAxO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHMucm93cy5kZWZhdWx0U2l6ZSA9IDMwO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gYWRkIEJvb3RzdHJhcCBodG1sXG4gICAgICAgICAgICAgICAgaWYgKChlLnBhbmVsLmNlbGxUeXBlID09IHdpam1vLmdyaWQuQ2VsbFR5cGUuQ2VsbCkgJiYgKGUuY29sID09IDApKSB7XG4gICAgICAgICAgICAgICAgICAgIHdvX2lkID0gZS5wYW5lbC5nZXRDZWxsRGF0YShlLnJvdywgMSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBlLmNlbGwuc3R5bGUub3ZlcmZsb3cgPSAndmlzaWJsZSc7XG4gICAgICAgICAgICAgICAgICAgIGUuY2VsbC5pbm5lckhUTUwgPSAnPGRpdiBjbGFzcz1cImJ0bi1ncm91cCBidG4tZ3JvdXAtanVzdGlmaWVkXCIgcm9sZT1cImdyb3VwXCIgYXJpYS1sYWJlbD1cIi4uLlwiPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidG4tZ3JvdXBcIiByb2xlPVwiZ3JvdXBcIj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cIiMvd28vdXBkYXRlLycgKyAkc3RhdGVQYXJhbXMuY2xfaWQgKyAnLycgKyB3b19pZCArICdcIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdCBidG4teHNcIj4nICsgaTE4bkZpbHRlcihcImdlbmVyYWwubGFiZWxzLmVkaXRcIikgKyAnPC9hPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidG4tZ3JvdXBcIiByb2xlPVwiZ3JvdXBcIj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cIiMvd28vZHVwbGljYXRlLycgKyAkc3RhdGVQYXJhbXMuY2xfaWQgKyAnLycgKyB3b19pZCArICdcIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdCBidG4teHNcIj4nICsgaTE4bkZpbHRlcihcImdlbmVyYWwubGFiZWxzLmR1cGxpY2F0ZVwiKSArICc8L2E+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2Pic7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgICAgIC8vIGJpbmQgY29sdW1ucyB3aGVuIGdyaWQgaXMgaW5pdGlhbGl6ZWRcbiAgICAgICAgICAgICRzY29wZS5pbml0R3JpZCA9IGZ1bmN0aW9uIChzLCBlKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAkc2NvcGUuY29sdW1ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgY29sID0gbmV3IHdpam1vLmdyaWQuQ29sdW1uKCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbC5iaW5kaW5nID0gJHNjb3BlLmNvbHVtbnNbaV07XG4gICAgICAgICAgICAgICAgICAgIGNvbC5oZWFkZXIgPSBpMThuRmlsdGVyKFwid28ubGFiZWxzLlwiICsgJHNjb3BlLmxhYmVsc1tpXSk7XG4gICAgICAgICAgICAgICAgICAgIHMuY29sdW1ucy5wdXNoKGNvbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICAgICAgICAvLyBjcmVhdGUgdGhlIHRvb2x0aXAgb2JqZWN0XG4gICAgICAgICAgICAkc2NvcGUuJHdhdGNoKCdnZ0dyaWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCRzY29wZS5nZ0dyaWQpIHtcblxuICAgICAgICAgICAgICAgICAgICAvLyBzdG9yZSByZWZlcmVuY2UgdG8gZ3JpZFxuICAgICAgICAgICAgICAgICAgICB2YXIgZmxleCA9ICRzY29wZS5nZ0dyaWQ7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY3JlYXRlIHRvb2x0aXBcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRpcCA9IG5ldyB3aWptby5Ub29sdGlwKCksXG4gICAgICAgICAgICAgICAgICAgICAgICBybmcgPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIG1vbml0b3IgdGhlIG1vdXNlIG92ZXIgdGhlIGdyaWRcbiAgICAgICAgICAgICAgICAgICAgZmxleC5ob3N0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaHQgPSBmbGV4LmhpdFRlc3QoZXZ0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaHQucmFuZ2UuZXF1YWxzKHJuZykpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG5ldyBjZWxsIHNlbGVjdGVkLCBzaG93IHRvb2x0aXBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaHQuY2VsbFR5cGUgPT0gd2lqbW8uZ3JpZC5DZWxsVHlwZS5DZWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJuZyA9IGh0LnJhbmdlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29sID0gZmxleC5jb2x1bW5zW3JuZy5jb2xdLmhlYWRlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNlbGxFbGVtZW50ID0gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludChldnQuY2xpZW50WCwgZXZ0LmNsaWVudFkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2VsbEJvdW5kcyA9IHdpam1vLlJlY3QuZnJvbUJvdW5kaW5nUmVjdChjZWxsRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhID0gd2lqbW8uZXNjYXBlSHRtbChmbGV4LmdldENlbGxEYXRhKHJuZy5yb3csIHJuZy5jb2wsIHRydWUpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpcENvbnRlbnQgPSBjb2wgKyAnOiBcIjxiPicgKyBkYXRhICsgJzwvYj5cIic7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjZWxsRWxlbWVudC5jbGFzc05hbWUuaW5kZXhPZignd2otY2VsbCcpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpcC5zaG93KGZsZXguaG9zdEVsZW1lbnQsIHRpcENvbnRlbnQsIGNlbGxCb3VuZHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlwLmhpZGUoKTsgLy8gY2VsbCBtdXN0IGJlIGJlaGluZCBzY3JvbGwgYmFyLi4uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBmbGV4Lmhvc3RFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3V0JywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGlwLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJuZyA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkc2NvcGUuJG9uKCckdmlld0NvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgLy8gdGhpcyBjb2RlIGlzIGV4ZWN1dGVkIGFmdGVyIHRoZSB2aWV3IGlzIGxvYWRlZFxuXG4gICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgd29GYWN0b3J5LmdldERhdGEoKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBleHBvc2UgZGF0YSBhcyBhIENvbGxlY3Rpb25WaWV3IHRvIGdldCBldmVudHNcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5kYXRhID0gbmV3IHdpam1vLmNvbGxlY3Rpb25zLkNvbGxlY3Rpb25WaWV3KHByb21pc2UuZGF0YSk7XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1dO1xuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRodHRwJywgJyRxJywgICckc3RhdGVQYXJhbXMnLCBmdW5jdGlvbiAoJGh0dHAsICRxLCAkc3RhdGVQYXJhbXMpIHtcbiAgICAgICAgdmFyIGZhY3RvcnkgPSB7fTtcbiAgICAgICAgZmFjdG9yeS5nZXREYXRhID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoXG4gICAgICAgICAgICAgICAgJGh0dHAucG9zdCgnL2FwaS93by9jbF9pZCcsIHtcbiAgICAgICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgICAgICBwcm9jY2VzX2lkOiBuZXcgRGF0ZSgpLmdldE1pbGxpc2Vjb25kcygpLFxuICAgICAgICAgICAgICAgICAgICBjbF9pZDogJHN0YXRlUGFyYW1zLmNsX2lkXG4gICAgICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBmYWN0b3J5O1xuICAgIH1dO1xuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbihhbmd1bGFyKXtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgXG4gICAgcmV0dXJuIGFuZ3VsYXIubW9kdWxlKCdhcHAud29ya2Zsb3cnLFtcbiAgICBdKVxuXG4gICAgLmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsXG4gICAgZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnd29ya2Zsb3cnLCB7XG4gICAgICAgICAgICB1cmw6Jy93b3JrZmxvdycsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybCA6ICdhcHAvd29ya2Zsb3cvd29ya2Zsb3cudmlldy5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXIgOiAnd29ya2Zsb3dDb250cm9sbGVyJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICByZXF1aXJlc0xvZ2luOiB0cnVlXG4gICAgICAgICAgICB9ICAgIFxuICAgICAgICB9KTtcbiAgICB9XSlcblxuICAgIC5mYWN0b3J5KCd3b3JrZmxvd0ZhY3RvcnknLHJlcXVpcmUoJy4vd29ya2Zsb3cuZmFjJykpXG5cbiAgICAuY29udHJvbGxlcignd29ya2Zsb3dDb250cm9sbGVyJyxyZXF1aXJlKCcuL3dvcmtmbG93LmN0cmwnKSlcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgXCJ0aXRsZVwiOiBcIkZsdWpvIGRlIFRyYWJham9cIixcbiAgICBcImxhYmVsc1wiOiB7XG4gICAgICAgIFwid28taWRcIjogXCJOby4gb3JkZW5cIixcbiAgICAgICAgXCJjbC1pZFwiOiBcImNsaWVudGVcIixcbiAgICAgICAgXCJjbC1jb3Jwb3JhdGVuYW1lXCI6IFwiUmF6w7NuIHNvY2lhbFwiLFxuICAgICAgICBcImNsLWZhdGhlcnNsYXN0bmFtZVwiOiBcIkFwZWxsaWRvIHBhdGVybm9cIixcbiAgICAgICAgXCJjbC1tb3RoZXJzbGFzdG5hbWVcIjogXCJBcGVsbGlkbyBtYXRlcm5vXCIsXG4gICAgICAgIFwiem8taWRcIjogXCJ6b25hXCIsXG4gICAgICAgIFwid28tb3JkZXJlZGJ5XCI6IFwiT3JkZW5hZG8gcG9yXCIsXG4gICAgICAgIFwid28tYXR0ZW50aW9uXCI6IFwiQXRlbmNpw7NuXCIsXG4gICAgICAgIFwibWEtaWRcIjogXCJNYXF1aW5hXCIsXG4gICAgICAgIFwid28tcmVsZWFzZVwiOiBcIlJlbGVhc2VcIixcbiAgICAgICAgXCJ3by1wb1wiOiBcIk9yZGVuIGRlIGNvbXByYVwiLFxuICAgICAgICBcIndvLWxpbmVcIjogXCJMaW5lYVwiLFxuICAgICAgICBcIndvLWxpbmV0b3RhbFwiOiBcIkRlXCIsXG4gICAgICAgIFwicHItaWRcIjogXCJQcm9kdWN0b1wiLFxuICAgICAgICBcIndvLXF0eVwiOiBcIkNhbnRpZGFkXCIsXG4gICAgICAgIFwid28tcGFja2FnZXF0eVwiOiBcIkNhbnRpZGFkIHggcGFxdWV0ZVwiLFxuICAgICAgICBcIndvLWV4Y2VkZW50cXR5XCI6IFwiRXhjZWRlbnRlXCIsXG4gICAgICAgIFwid28tZm9saW9zcGVyZm9ybWF0XCI6IFwiRm9saW9zIHggZm9ybWF0b1wiLFxuICAgICAgICBcIndvLWZvbGlvc3Nlcmllc1wiOiBcIlNlcmllXCIsXG4gICAgICAgIFwid28tZm9saW9zZnJvbVwiOiBcIkRlbFwiLFxuICAgICAgICBcIndvLWZvbGlvc3RvXCI6IFwiQWxcIixcbiAgICAgICAgXCJ3by10eXBlXCI6IFwiVGlwb1wiLFxuICAgICAgICBcIndvLWNvbW1pdG1lbnRkYXRlXCI6IFwiRmVjaGEgY29tcHJvbWlzb1wiLFxuICAgICAgICBcIndvLXByZXZpb3VzaWRcIjogXCJJRCBhbnRlcmlvclwiLFxuICAgICAgICBcIndvLXByZXZpb3VzZGF0ZVwiOiBcIkZlY2hhIGFudGVyaW9yXCIsXG4gICAgICAgIFwid28tbm90ZXNcIjogXCJOb3Rhc1wiLFxuICAgICAgICBcIndvLXByaWNlXCI6IFwiUHJlY2lvXCIsXG4gICAgICAgIFwid28tY3VycmVuY3lcIjogXCJNb25lZGFcIixcbiAgICAgICAgXCJ3by1lbWFpbFwiOiBcIkVudmlhciBDb3JyZW9cIixcbiAgICAgICAgXCJ3by1zdGF0dXNcIjogXCJFc3RhdHVzXCIsXG4gICAgICAgIFwid28tbmV4dHN0YXR1c1wiOiBcIkFjdHVhbGl6YXIgYTpcIixcbiAgICAgICAgXCJ3by1kYXRlXCI6IFwiRmVjaGFcIlxuICAgIH0sXG4gICAgXCJjb2x1bW5zXCI6IFtcbiAgICAgICAgXCJ3b19pZFwiLFxuICAgICAgICBcImNsX2lkXCIsXG4gICAgICAgIFwiY2xfY29ycG9yYXRlbmFtZVwiLFxuICAgICAgICBcImNsX2ZhdGhlcnNsYXN0bmFtZVwiLFxuICAgICAgICBcImNsX21vdGhlcnNsYXN0bmFtZVwiLFxuICAgICAgICBcInpvX2lkXCIsXG4gICAgICAgIFwid29fb3JkZXJlZGJ5XCIsXG4gICAgICAgIFwid29fYXR0ZW50aW9uXCIsXG4gICAgICAgIFwibWFfaWRcIixcbiAgICAgICAgXCJ3b19yZWxlYXNlXCIsXG4gICAgICAgIFwid29fcG9cIixcbiAgICAgICAgXCJ3b19saW5lXCIsXG4gICAgICAgIFwid29fbGluZXRvdGFsXCIsXG4gICAgICAgIFwicHJfaWRcIixcbiAgICAgICAgXCJ3b19xdHlcIixcbiAgICAgICAgXCJ3b19wYWNrYWdlcXR5XCIsXG4gICAgICAgIFwid29fZXhjZWRlbnRxdHlcIixcbiAgICAgICAgXCJ3b19mb2xpb3NwZXJmb3JtYXRcIixcbiAgICAgICAgXCJ3b19mb2xpb3NzZXJpZXNcIixcbiAgICAgICAgXCJ3b19mb2xpb3Nmcm9tXCIsXG4gICAgICAgIFwid29fZm9saW9zdG9cIixcbiAgICAgICAgXCJ3b190eXBlXCIsXG4gICAgICAgIFwid29fY29tbWl0bWVudGRhdGVcIixcbiAgICAgICAgXCJ3b19wcmV2aW91c2lkXCIsXG4gICAgICAgIFwid29fcHJldmlvdXNkYXRlXCIsXG4gICAgICAgIFwid29fbm90ZXNcIixcbiAgICAgICAgXCJ3b19wcmljZVwiLFxuICAgICAgICBcIndvX2N1cnJlbmN5XCIsXG4gICAgICAgIFwid29fZW1haWxcIixcbiAgICAgICAgXCJ3b19zdGF0dXNcIixcbiAgICAgICAgXCJ3b19kYXRlXCJcbiAgICBdLFxuICAgIFwiZmllbGRzXCI6IHtcbiAgICAgICAgd29fc3RhdHVzb3B0aW9uczogW1xuICAgICAgICAgICAgeyBcImxhYmVsXCI6IFwiQWN0aXZvXCIsIFwidmFsdWVcIjogMCwgXCJkZXNjXCI6IFwiT3JkZW4gQWN0aXZhXCIsIFwidXNfZ3JvdXBcIjogXCJzYWxlc1wiLCBcIndvX3ByZXZzdGF0dXNcIjogW10gfSxcbiAgICAgICAgICAgIHsgXCJsYWJlbFwiOiBcIkVuIGVzcGVyYSBkZSBtYXRlcmlhbFwiLCBcInZhbHVlXCI6IDEsIFwiZGVzY1wiOiBcIk5vIGhheSBtYXRlcmlhbCBlbiBlbCBhbG1hY8OpblwiLCBcInVzX2dyb3VwXCI6IFwid2FyZWhvdXNlXCIsIFwid29fcHJldnN0YXR1c1wiOiBbMCwgNywgMTJdIH0sXG4gICAgICAgICAgICB7IFwibGFiZWxcIjogXCJNYXRlcmlhbCBkaXNwb25pYmxlXCIsIFwidmFsdWVcIjogMiwgXCJkZXNjXCI6IFwiSGF5IG1hdGVyaWFsIGVuIGVsIGFsbWFjw6luIHBlcm8gYXVuIG5vIHNlIGhhIGluaWNpYWRvIGVsIHRyYWJham9cIiwgXCJ1c19ncm91cFwiOiBcIndhcmVob3VzZVwiLCBcIndvX3ByZXZzdGF0dXNcIjogWzAsIDEsIDcsIDEyXSB9LFxuICAgICAgICAgICAgeyBcImxhYmVsXCI6IFwiRW4gcHJvZHVjY2nDs25cIiwgXCJ2YWx1ZVwiOiAzLCBcImRlc2NcIjogXCJFbiBwcm9kdWNjacOzblwiLCBcInVzX2dyb3VwXCI6IFwicHJvZHVjdGlvblwiLCBcIndvX3ByZXZzdGF0dXNcIjogWzIsIDcsIDEyXSB9LFxuICAgICAgICAgICAgeyBcImxhYmVsXCI6IFwiRGV0ZW5pZG9cIiwgXCJ2YWx1ZVwiOiA0LCBcImRlc2NcIjogXCJMYSBvcmRlbiBzZSBkZXR1dm8gZW4gcHJvZHVjY2nDs25cIiwgXCJ1c19ncm91cFwiOiBcInByb2R1Y3Rpb25cIiwgXCJ3b19wcmV2c3RhdHVzXCI6IFszXSB9LFxuICAgICAgICAgICAgeyBcImxhYmVsXCI6IFwiVGVybWluYWRvXCIsIFwidmFsdWVcIjogNSwgXCJkZXNjXCI6IFwiVGVybWluYWRvIGVuIHByb2R1Y2Npw7NuXCIsIFwidXNfZ3JvdXBcIjogXCJwcm9kdWN0aW9uXCIsIFwid29fcHJldnN0YXR1c1wiOiBbMywgNF0gfSxcbiAgICAgICAgICAgIHsgXCJsYWJlbFwiOiBcIkRlcGFydGFtZW50byBkZSBjYWxpZGFkXCIsIFwidmFsdWVcIjogNiwgXCJkZXNjXCI6IFwiSW5zcGVjY2lvbiBkZSBjYWxpZGFkIGVuIHByb2Nlc29cIiwgXCJ1c19ncm91cFwiOiBcInF1YWxpdHlfYXNzdXJhbmNlXCIsIFwid29fcHJldnN0YXR1c1wiOiBbNV0gfSxcbiAgICAgICAgICAgIHsgXCJsYWJlbFwiOiBcIlJlY2hhemFkbyBwb3IgQ2FsaWRhZFwiLCBcInZhbHVlXCI6IDcsIFwiZGVzY1wiOiBcIlJlY2hhemFkbyBwb3IgY2FsaWRhZFwiLCBcInVzX2dyb3VwXCI6IFwicXVhbGl0eV9hc3N1cmFuY2VcIiwgXCJ3b19wcmV2c3RhdHVzXCI6IFs2XSB9LFxuICAgICAgICAgICAgeyBcImxhYmVsXCI6IFwiRW1wYXF1ZVwiLCBcInZhbHVlXCI6IDgsIFwiZGVzY1wiOiBcIkVuIHByb2Nlc28gZGUgZW1wYXF1ZVwiLCBcInVzX2dyb3VwXCI6IFwiZW1wYXF1ZVwiLCBcIndvX3ByZXZzdGF0dXNcIjogWzZdIH0sXG4gICAgICAgICAgICB7IFwibGFiZWxcIjogXCJMaXN0byBwYXJhIGVtYmFycXVlXCIsIFwidmFsdWVcIjogOSwgXCJkZXNjXCI6IFwiTGlzdG8gcGFyYSBlbWJhcnF1ZVwiLCBcInVzX2dyb3VwXCI6IFwiZW1wYXF1ZVwiLCBcIndvX3ByZXZzdGF0dXNcIjogWzhdIH0sXG4gICAgICAgICAgICB7IFwibGFiZWxcIjogXCJGYWN0dXJhZG9cIiwgXCJ2YWx1ZVwiOiAxMCwgXCJkZXNjXCI6IFwiRmFjdHVyYWRvXCIsIFwidXNfZ3JvdXBcIjogXCJ3YXJlaG91c2VcIiwgXCJ3b19wcmV2c3RhdHVzXCI6IFs5XSB9LFxuICAgICAgICAgICAgeyBcImxhYmVsXCI6IFwiTm8gc2UgcHVkbyBlbnRyZWdhclwiLCBcInZhbHVlXCI6IDExLCBcImRlc2NcIjogXCJFbCBwcm9kdWN0byBubyBzZSBwdWRvIGVudHJlZ2FyXCIsIFwidXNfZ3JvdXBcIjogXCJ3YXJlaG91c2VcIiwgXCJ3b19wcmV2c3RhdHVzXCI6IFsxMF0gfSxcbiAgICAgICAgICAgIHsgXCJsYWJlbFwiOiBcIlJlY2hhemFkbyBwb3IgZWwgY2xpZW50ZVwiLCBcInZhbHVlXCI6IDEyLCBcImRlc2NcIjogXCJFbCBwcm9kdWN0b2Z1ZSByZWNoYXphZG8gcG9yIGVsIGNsaWVudGVcIiwgXCJ1c19ncm91cFwiOiBcIndhcmVob3VzZVwiLCBcIndvX3ByZXZzdGF0dXNcIjogWzEwXSB9LFxuICAgICAgICAgICAgeyBcImxhYmVsXCI6IFwiRW50cmVnYWRvXCIsIFwidmFsdWVcIjogMTMsIFwiZGVzY1wiOiBcIkVsIHByb2R1Y3RvIHNlIGVudHJlZ28gYWwgY2xpZW50ZSBjb24gw6l4aXRvXCIsIFwidXNfZ3JvdXBcIjogXCJ3YXJlaG91c2VcIiwgXCJ3b19wcmV2c3RhdHVzXCI6IFsxMCwgMTFdIH0sXG4gICAgICAgICAgICB7IFwibGFiZWxcIjogXCJDYW5jZWxhZG9cIiwgXCJ2YWx1ZVwiOiAxNCwgXCJkZXNjXCI6IFwiTGEgb3JkZW4gZGUgdHJhYmFqbyBmdWUgY2FuY2VsYWRhXCIsIFwidXNfZ3JvdXBcIjogXCJhZG1pblwiLCBcIndvX3ByZXZzdGF0dXNcIjogWzAsIDEsIDIsIDMsIDQsIDUsIDYsIDcsIDgsIDksIDEwLCAxMSwgMTIsIDEzLCAxNF0gfVxuICAgICAgICBdXG4gICAgfVxufSIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgcmV0dXJuIFsnJHNjb3BlJywgJ3dvcmtmbG93RmFjdG9yeScsICckbG9jYXRpb24nLCAnaTE4bkZpbHRlcicsICckc3RhdGVQYXJhbXMnLCAnJGZpbHRlcicsICdhdXRoU2VydmljZScsXG4gICAgICAgIGZ1bmN0aW9uICgkc2NvcGUsIHdvcmtmbG93RmFjdG9yeSwgJGxvY2F0aW9uLCBpMThuRmlsdGVyLCAkc3RhdGVQYXJhbXMsICRmaWx0ZXIsIGF1dGhTZXJ2aWNlKSB7XG5cbiAgICAgICAgICAgIHZhciB1c2VyUHJvZmlsZSA9IGFuZ3VsYXIuZnJvbUpzb24obG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3Byb2ZpbGUnKSkgfHwge307XG5cbiAgICAgICAgICAgICRzY29wZS5mbURhdGEgPSB7XG4gICAgICAgICAgICAgICAgXCJ3b19zdGF0dXNcIjogMFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgJHNjb3BlLmxhYmVscyA9IE9iamVjdC5rZXlzKGkxOG5GaWx0ZXIoXCJ3b3JrZmxvdy5sYWJlbHNcIikpO1xuICAgICAgICAgICAgJHNjb3BlLmNvbHVtbnMgPSBpMThuRmlsdGVyKFwid29ya2Zsb3cuY29sdW1uc1wiKTtcblxuICAgICAgICAgICAgLy8gZm9ybWF0dGVyIHRvIGFkZCBjaGVja2JveGVzIHRvIGJvb2xlYW4gY29sdW1uc1xuICAgICAgICAgICAgJHNjb3BlLm9uVXBkYXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBmbGV4ID0gJHNjb3BlLmdnR3JpZDtcbiAgICAgICAgICAgICAgICB2YXIgYXJyID0gW11cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZsZXgucm93cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZmxleC5nZXRDZWxsRGF0YShpLCBmbGV4LmNvbHVtbnMuZ2V0Q29sdW1uKCdhY3RpdmUnKS5pbmRleCkgPT09IHRydWUpIGFyci5wdXNoKGZsZXguZ2V0Q2VsbERhdGEoaSwgZmxleC5jb2x1bW5zLmdldENvbHVtbignd29faWQnKS5pbmRleCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAkc2NvcGUud29faWQgPSBhcnI7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnNlbGVjdGVkID0gKGFyci5sZW5ndGggPiAwKSA/IHRydWUgOiBmYWxzZTtcbiAgICAgICAgICAgICAgICB2YXIgbmV4dF9zdGF0dXMgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKCRzY29wZS53b19zdGF0dXNvcHRpb25zLCBmdW5jdGlvbiAodmFsdWUsIGtleSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUudmFsdWUgPT09ICRzY29wZS5mbURhdGEud29fbmV4dHN0YXR1cykgbmV4dF9zdGF0dXMgPSB2YWx1ZS5sYWJlbDtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAkc2NvcGUubmV4dF9zdGF0dXMgPSBuZXh0X3N0YXR1cztcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICRzY29wZS5vblN1Ym1pdCA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkc2NvcGUuaXRlbUZvcm1hdHRlciA9IGZ1bmN0aW9uIChwYW5lbCwgciwgYywgY2VsbCkge1xuXG4gICAgICAgICAgICAgICAgLy8gaGlnaGxpZ2h0IHJvd3MgdGhhdCBoYXZlICdhY3RpdmUnIHNldFxuICAgICAgICAgICAgICAgIGlmIChwYW5lbC5jZWxsVHlwZSA9PSB3aWptby5ncmlkLkNlbGxUeXBlLkNlbGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZsZXggPSBwYW5lbC5ncmlkO1xuICAgICAgICAgICAgICAgICAgICB2YXIgcm93ID0gZmxleC5yb3dzW3JdO1xuICAgICAgICAgICAgICAgICAgICBpZiAocm93LmRhdGFJdGVtLmFjdGl2ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2VsbC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnZ29sZCc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAocGFuZWwuY2VsbFR5cGUgPT0gd2lqbW8uZ3JpZC5DZWxsVHlwZS5Db2x1bW5IZWFkZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZsZXggPSBwYW5lbC5ncmlkO1xuICAgICAgICAgICAgICAgICAgICB2YXIgY29sID0gZmxleC5jb2x1bW5zW2NdO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNoZWNrIHRoYXQgdGhpcyBpcyBhIGJvb2xlYW4gY29sdW1uXG4gICAgICAgICAgICAgICAgICAgIGlmIChjb2wuZGF0YVR5cGUgPT0gd2lqbW8uRGF0YVR5cGUuQm9vbGVhbikge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBwcmV2ZW50IHNvcnRpbmcgb24gY2xpY2tcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbC5hbGxvd1NvcnRpbmcgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY291bnQgdHJ1ZSB2YWx1ZXMgdG8gaW5pdGlhbGl6ZSBjaGVja2JveFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNudCA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZsZXgucm93cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmbGV4LmdldENlbGxEYXRhKGksIGMpID09IHRydWUpIGNudCsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjcmVhdGUgYW5kIGluaXRpYWxpemUgY2hlY2tib3hcbiAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwuaW5uZXJIVE1MID0gJzxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIj4gJyArIGNlbGwuaW5uZXJIVE1MO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNiID0gY2VsbC5maXJzdENoaWxkO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2IuY2hlY2tlZCA9IGNudCA+IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYi5pbmRldGVybWluYXRlID0gY250ID4gMCAmJiBjbnQgPCBmbGV4LnJvd3MubGVuZ3RoO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBhcHBseSBjaGVja2JveCB2YWx1ZSB0byBjZWxsc1xuICAgICAgICAgICAgICAgICAgICAgICAgY2IuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZsZXguYmVnaW5VcGRhdGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZsZXgucm93cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmbGV4LnNldENlbGxEYXRhKGksIGMsIGNiLmNoZWNrZWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmbGV4LmVuZFVwZGF0ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgLy8gYXV0b3NpemUgY29sdW1uc1xuICAgICAgICAgICAgJHNjb3BlLml0ZW1zU291cmNlQ2hhbmdlZCA9IGZ1bmN0aW9uIChzZW5kZXIsIGFyZ3MpIHtcbiAgICAgICAgICAgICAgICBzZW5kZXIuYXV0b1NpemVDb2x1bW5zKCk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyBiaW5kIGNvbHVtbnMgd2hlbiBncmlkIGlzIGluaXRpYWxpemVkXG4gICAgICAgICAgICAkc2NvcGUuaW5pdEdyaWQgPSBmdW5jdGlvbiAocywgZSkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgJHNjb3BlLmNvbHVtbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbCA9IG5ldyB3aWptby5ncmlkLkNvbHVtbigpO1xuICAgICAgICAgICAgICAgICAgICBjb2wuYmluZGluZyA9ICRzY29wZS5jb2x1bW5zW2ldO1xuICAgICAgICAgICAgICAgICAgICBjb2wuaGVhZGVyID0gaTE4bkZpbHRlcihcIndvcmtmbG93LmxhYmVscy5cIiArICRzY29wZS5sYWJlbHNbaV0pO1xuICAgICAgICAgICAgICAgICAgICBzLmNvbHVtbnMucHVzaChjb2wpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIGNyZWF0ZSB0aGUgdG9vbHRpcCBvYmplY3RcbiAgICAgICAgICAgICRzY29wZS4kd2F0Y2goJ2dnR3JpZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoJHNjb3BlLmdnR3JpZCkge1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIHN0b3JlIHJlZmVyZW5jZSB0byBncmlkXG4gICAgICAgICAgICAgICAgICAgIHZhciBmbGV4ID0gJHNjb3BlLmdnR3JpZDtcblxuICAgICAgICAgICAgICAgICAgICAvLyBjcmVhdGUgdG9vbHRpcFxuICAgICAgICAgICAgICAgICAgICB2YXIgdGlwID0gbmV3IHdpam1vLlRvb2x0aXAoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJuZyA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gbW9uaXRvciB0aGUgbW91c2Ugb3ZlciB0aGUgZ3JpZFxuICAgICAgICAgICAgICAgICAgICBmbGV4Lmhvc3RFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBodCA9IGZsZXguaGl0VGVzdChldnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFodC5yYW5nZS5lcXVhbHMocm5nKSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbmV3IGNlbGwgc2VsZWN0ZWQsIHNob3cgdG9vbHRpcFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChodC5jZWxsVHlwZSA9PSB3aWptby5ncmlkLkNlbGxUeXBlLkNlbGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm5nID0gaHQucmFuZ2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb2wgPSBmbGV4LmNvbHVtbnNbcm5nLmNvbF0uaGVhZGVyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2VsbEVsZW1lbnQgPSBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KGV2dC5jbGllbnRYLCBldnQuY2xpZW50WSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjZWxsQm91bmRzID0gd2lqbW8uUmVjdC5mcm9tQm91bmRpbmdSZWN0KGNlbGxFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEgPSB3aWptby5lc2NhcGVIdG1sKGZsZXguZ2V0Q2VsbERhdGEocm5nLnJvdywgcm5nLmNvbCwgdHJ1ZSkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlwQ29udGVudCA9IGNvbCArICc6IFwiPGI+JyArIGRhdGEgKyAnPC9iPlwiJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNlbGxFbGVtZW50LmNsYXNzTmFtZS5pbmRleE9mKCd3ai1jZWxsJykgPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJuZy5jb2wgIT09IDApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlwLnNob3coZmxleC5ob3N0RWxlbWVudCwgdGlwQ29udGVudCwgY2VsbEJvdW5kcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXAuaGlkZSgpOyAvLyBjZWxsIG11c3QgYmUgYmVoaW5kIHNjcm9sbCBiYXIuLi5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGZsZXguaG9zdEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXAuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcm5nID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICRzY29wZS53b19zdGF0dXNvcHRpb25zID0gW107XG4gICAgICAgICAgICB2YXIgd29fc3RhdHVzb3B0aW9ucyA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoaTE4bkZpbHRlcihcIndvcmtmbG93LmZpZWxkcy53b19zdGF0dXNvcHRpb25zXCIpKSlcbiAgICAgICAgICAgIHZhciBkdXBsaWNhdGVkID0gW107XG4gICAgICAgICAgICBhbmd1bGFyLmZvckVhY2god29fc3RhdHVzb3B0aW9ucywgZnVuY3Rpb24gKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUudXNfZ3JvdXAgPT09IHVzZXJQcm9maWxlLmFwcF9tZXRhZGF0YS51c19ncm91cCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnB1c2guYXBwbHkodGhpcywgdmFsdWUud29fcHJldnN0YXR1cyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgZHVwbGljYXRlZClcblxuICAgICAgICAgICAgZHVwbGljYXRlZC5yZWR1Y2UoZnVuY3Rpb24gKGFjY3VtLCBjdXJyZW50KSB7XG4gICAgICAgICAgICAgICAgaWYgKGFjY3VtLmluZGV4T2YoY3VycmVudCkgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGFjY3VtLnB1c2goY3VycmVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBhY2N1bTtcbiAgICAgICAgICAgIH0sIFtdKTtcblxuICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHdvX3N0YXR1c29wdGlvbnMsIGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgICAgICAgaWYgKGR1cGxpY2F0ZWQuaW5jbHVkZXModmFsdWUudmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlLm5vdEFuT3B0aW9uID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUubm90QW5PcHRpb24gPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnB1c2godmFsdWUpXG4gICAgICAgICAgICB9LCAkc2NvcGUud29fc3RhdHVzb3B0aW9ucylcblxuICAgICAgICAgICAgJHNjb3BlLiRvbignJHZpZXdDb250ZW50TG9hZGVkJywgZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgLy8gdGhpcyBjb2RlIGlzIGV4ZWN1dGVkIGFmdGVyIHRoZSB2aWV3IGlzIGxvYWRlZFxuICAgICAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuJHdhdGNoKCdmbURhdGEud29fc3RhdHVzJywgZnVuY3Rpb24gKG5ld1ZhbHVlLCBvbGRWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuYWN0aW9ucyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICB2YXIgYWN0aW9ucyA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoaTE4bkZpbHRlcihcIndvcmtmbG93LmZpZWxkcy53b19zdGF0dXNvcHRpb25zXCIpKSk7XG4gICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChhY3Rpb25zLCBmdW5jdGlvbiAodmFsdWUsIGtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlLndvX3ByZXZzdGF0dXMuaW5jbHVkZXMobmV3VmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlLnVzX2dyb3VwID09PSB1c2VyUHJvZmlsZS5hcHBfbWV0YWRhdGEudXNfZ3JvdXAgfHwgdXNlclByb2ZpbGUuYXBwX21ldGFkYXRhLnVzX2dyb3VwID09PSBcImFkbWluXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoWzEzLDE0XS5pbmNsdWRlcyhuZXdWYWx1ZSkgJiYgWzEzLDE0XS5pbmNsdWRlcyh2YWx1ZS52YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlLm5vdEFuT3B0aW9uID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlLm5vdEFuT3B0aW9uID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlLm5vdEFuT3B0aW9uID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wdXNoKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSwgJHNjb3BlLmFjdGlvbnMpXG4gICAgICAgICAgICAgICAgICAgIHdvcmtmbG93RmFjdG9yeS5nZXREYXRhKG5ld1ZhbHVlKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZXhwb3NlIGRhdGEgYXMgYSBDb2xsZWN0aW9uVmlldyB0byBnZXQgZXZlbnRzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmRhdGEgPSBuZXcgd2lqbW8uY29sbGVjdGlvbnMuQ29sbGVjdGlvblZpZXcocHJvbWlzZS5kYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZGF0YS5wYWdlU2l6ZSA9IDU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1dO1xuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRodHRwJywgJyRxJywgICckc3RhdGVQYXJhbXMnLCBmdW5jdGlvbiAoJGh0dHAsICRxLCAkc3RhdGVQYXJhbXMpIHtcbiAgICAgICAgdmFyIGZhY3RvcnkgPSB7fTtcbiAgICAgICAgZmFjdG9yeS5nZXREYXRhID0gZnVuY3Rpb24gKHdvX3N0YXR1cykge1xuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoXG4gICAgICAgICAgICAgICAgJGh0dHAucG9zdCgnL2FwaS93b3JrZmxvdycsIHtcbiAgICAgICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgICAgICBwcm9jY2VzX2lkOiBuZXcgRGF0ZSgpLmdldE1pbGxpc2Vjb25kcygpLFxuICAgICAgICAgICAgICAgICAgICB3b19zdGF0dXM6IHdvX3N0YXR1c1xuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICBmYWN0b3J5LnVwZGF0ZSA9IGZ1bmN0aW9uICh3b19zdGF0dXMsIHdvX2lkKSB7XG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KCcvYXBpL3dvcmtmbG93L3VwZGF0ZScsIHtcbiAgICAgICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgICAgICBwcm9jY2VzX2lkOiBuZXcgRGF0ZSgpLmdldE1pbGxpc2Vjb25kcygpLFxuICAgICAgICAgICAgICAgICAgICB3b19zdGF0dXM6IHdvX3N0YXR1cyxcbiAgICAgICAgICAgICAgICAgICAgd29faWQ6IHdvX2lkXG4gICAgICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBmYWN0b3J5O1xuICAgIH1dO1xuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbihhbmd1bGFyKXtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgXG4gICAgcmV0dXJuIGFuZ3VsYXIubW9kdWxlKCdhcHAuem9uZScsW1xuICAgICAgICByZXF1aXJlKCcuL21vZHVsZXMvem9uZS5hZGQnKS5uYW1lLFxuICAgICAgICByZXF1aXJlKCcuL21vZHVsZXMvem9uZS51cGRhdGUnKS5uYW1lXG4gICAgXSlcblxuICAgIC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLFxuICAgIGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcbiAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3pvbmUnLCB7XG4gICAgICAgICAgICB1cmw6Jy96b25lLzpjbF9pZCcsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybCA6ICdhcHAvem9uZS96b25lLnZpZXcuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyIDogJ3pvbmVDdHJsJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICByZXF1aXJlc0xvZ2luOiB0cnVlXG4gICAgICAgICAgICB9ICAgIFxuICAgICAgICB9KTtcbiAgICB9XSlcblxuICAgIC5mYWN0b3J5KCd6b25lRmFjJyxyZXF1aXJlKCcuL3pvbmUuZmFjJykpXG5cbiAgICAuY29udHJvbGxlcignem9uZUN0cmwnLHJlcXVpcmUoJy4vem9uZS5jdHJsJykpXG4gICAgXG59KShhbmd1bGFyKTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCIgOiBcImRpcmVjY2lvbmVzIGRlIGVudmlvXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibGFiZWxzXCI6e1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJ6by1pZFwiIDogXCJpZCB6b25hXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsLWlkXCIgOiBcImlkIGNsaWVudGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiem8tem9uZVwiIDogXCJ6b25hXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInpvLWNvcnBvcmF0ZW5hbWVcIiA6IFwicmF6w7NuIHNvY2lhbFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ6by10aW5cIiA6IFwicmZjXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInpvLWltbWV4XCIgOiBcImltbWV4XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInpvLW5hbWVcIiA6IFwibm9tYnJlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInpvLWZhdGhlcnNsYXN0bmFtZVwiIDogXCJhcGVsbGlkbyBwYXRlcm5vXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInpvLW1vdGhlcnNsYXN0bmFtZVwiIDogXCJhcGVsbGlkbyBtYXRlcm5vXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInpvLXN0cmVldFwiOlwiY2FsbGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiem8tc3RyZWV0bnVtYmVyXCI6XCJudW1lcm8gZXh0ZXJpb3JcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiem8tc3VpdGVudW1iZXJcIjpcIm51bWVybyBpbnRlcmlvclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ6by1uZWlnaGJvcmhvb2RcIjpcImNvbG9uaWFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiem8tYWRkcmVzc3JlZmVyZW5jZVwiOlwicmVmZXJlbmNpYVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ6by1jb3VudHJ5XCI6XCJwYcOtc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ6by1zdGF0ZVwiOlwiZXN0YWRvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInpvLWNpdHlcIjpcImNpdWRhZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ6by1jb3VudHlcIjpcIm11bmljaXBpb1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ6by16aXBjb2RlXCI6XCJjb2RpZ28gcG9zdGFsXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInpvLWVtYWlsXCI6XCJjb3JyZW8gZWxlY3Ryw7NuaWNvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInpvLXBob25lXCI6XCJ0ZWzDqWZvbm9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiem8tbW9iaWxlXCI6XCJtw7N2aWxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiem8tc3RhdHVzXCI6XCJlc3RhdHVzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInpvLWRhdGVcIjpcImZlY2hhXCIsXG5cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgXCJjb2x1bW5zXCI6W1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJ6b19pZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbF9pZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ6b196b25lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInpvX2NvcnBvcmF0ZW5hbWVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiem9fdGluXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInpvX2ltbWV4XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInpvX25hbWVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiem9fZmF0aGVyc2xhc3RuYW1lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInpvX21vdGhlcnNsYXN0bmFtZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ6b19zdHJlZXRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiem9fc3RyZWV0bnVtYmVyXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInpvX3N1aXRlbnVtYmVyXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInpvX25laWdoYm9yaG9vZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ6b19hZGRyZXNzcmVmZXJlbmNlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInpvX2NvdW50cnlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiem9fc3RhdGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiem9fY2l0eVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ6b19jb3VudHlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiem9femlwY29kZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ6b19lbWFpbFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ6b19waG9uZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ6b19tb2JpbGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiem9fc3RhdHVzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInpvX2RhdGVcIixcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgIFwiZmllbGRzXCIgOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB6b19zdGF0dXNvcHRpb25zIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJBY3Rpdm9cIixcInZhbHVlXCI6XCJBXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJJbmFjdGl2b1wiLFwidmFsdWVcIjpcIklcIn1cbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKGFuZ3VsYXIpe1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBcbiAgICByZXR1cm4gYW5ndWxhci5tb2R1bGUoJ2FwcC56b25lLmFkZCcsW10pXG5cbiAgICAuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJyxcbiAgICBmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCd6b25lQWRkJywge1xuICAgICAgICAgICAgdXJsOicvem9uZS9hZGQvOmNsX2lkJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsIDogJ2FwcC96b25lL21vZHVsZXMvem9uZS5hZGQvem9uZS5hZGQudmlldy5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXIgOiAnem9uZUFkZEN0cmwnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHJlcXVpcmVzTG9naW46IHRydWVcbiAgICAgICAgICAgIH0gICAgXG4gICAgICAgIH0pO1xuICAgIH1dKVxuXG4gICAgLmZhY3RvcnkoJ3pvbmVBZGRGYWMnLHJlcXVpcmUoJy4vem9uZS5hZGQuZmFjJykpXG5cbiAgICAuY29udHJvbGxlcignem9uZUFkZEN0cmwnLHJlcXVpcmUoJy4vem9uZS5hZGQuY3RybCcpKVxuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiIDogXCJhZ3JlZ2FyIGRpcmVjY2nDs24gZGUgZW52aW9cIixcbiAgICAgICAgICAgICAgICB9IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckc2NvcGUnLCAnem9uZUFkZEZhYycsICckbG9jYXRpb24nLCAnaTE4bkZpbHRlcicsICckaW50ZXJ2YWwnLCAnJHN0YXRlUGFyYW1zJyxcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgem9uZUFkZEZhYywgJGxvY2F0aW9uLCBpMThuRmlsdGVyLCAkaW50ZXJ2YWwsICRzdGF0ZVBhcmFtcykge1xuICAgICAgICAgICAgJHNjb3BlLmZtRGF0YSA9IHt9O1xuICAgICAgICAgICAgJHNjb3BlLmZtRGF0YS5jbF9pZCA9ICRzdGF0ZVBhcmFtcy5jbF9pZDtcblxuICAgICAgICAgICAgJHNjb3BlLm9uU3VibWl0ID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgem9uZUFkZEZhYy5hZGQoJHNjb3BlLmZtRGF0YSkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocHJvbWlzZS5kYXRhID09IFwiMVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3pvbmUnKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS51cGRhdGVGYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgJHNjb3BlLmdldFN0YXRlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUuem9fc3RhdGVvcHRpb25zID0gW107XG4gICAgICAgICAgICAgICAgJHNjb3BlLnpvX2NpdHlvcHRpb25zID0gW107XG4gICAgICAgICAgICAgICAgJHNjb3BlLnpvX2NvdW50eW9wdGlvbnMgPSBbXTtcbiAgICAgICAgICAgICAgICAkaW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB6b25lQWRkRmFjLmdldFN0YXRlcygkc2NvcGUuZm1EYXRhLnpvX2NvdW50cnkpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhLmdlb25hbWVzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS56b19zdGF0ZW9wdGlvbnMgPSBwcm9taXNlLmRhdGEuZ2VvbmFtZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vJHNjb3BlLnVwZGF0ZUZhaWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LCAwLCAxKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJHNjb3BlLmdldENpdHlDb3VudHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnpvX2NpdHlvcHRpb25zID0gW107XG4gICAgICAgICAgICAgICAgJHNjb3BlLnpvX2NvdW50eW9wdGlvbnMgPSBbXTtcbiAgICAgICAgICAgICAgICAkaW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB6b25lQWRkRmFjLmdldFN0YXRlcygkc2NvcGUuZm1EYXRhLnpvX3N0YXRlKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YS5nZW9uYW1lcykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuem9fY2l0eW9wdGlvbnMgPSBwcm9taXNlLmRhdGEuZ2VvbmFtZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnpvX2NvdW50eW9wdGlvbnMgPSBwcm9taXNlLmRhdGEuZ2VvbmFtZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vJHNjb3BlLnVwZGF0ZUZhaWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LCAwLCAxKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICRzY29wZS56b19zdGF0dXNvcHRpb25zID0gaTE4bkZpbHRlcihcInpvbmUuZmllbGRzLnpvX3N0YXR1c29wdGlvbnNcIik7XG5cbiAgICAgICAgICAgICRzY29wZS4kb24oJyR2aWV3Q29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAvLyB0aGlzIGNvZGUgaXMgZXhlY3V0ZWQgYWZ0ZXIgdGhlIHZpZXcgaXMgbG9hZGVkXG4gICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB6b25lQWRkRmFjLmdldENsaWVudCgpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNPYmplY3QocHJvbWlzZS5kYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNsaWVudCA9IHByb21pc2UuZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgem9uZUFkZEZhYy5nZXRDb3VudHJpZXMoKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhLmdlb25hbWVzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnpvX2NvdW50cnlvcHRpb25zID0gcHJvbWlzZS5kYXRhLmdlb25hbWVzO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8kc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1dO1xuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRodHRwJywgJyRxJywgICckc3RhdGVQYXJhbXMnLCBmdW5jdGlvbiAoJGh0dHAsICRxLCAkc3RhdGVQYXJhbXMpIHtcbiAgICAgICAgdmFyIGZhY3RvcnkgPSB7fTtcbiAgICAgICAgZmFjdG9yeS5nZXRDbGllbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KCdtb2R1bGVzL3pvbmUvbW9kdWxlcy96b25lLmFkZC96b25lLmFkZC5tZGwuZ2V0Q2xpZW50LnBocCcsIHtcbiAgICAgICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgICAgICBjbF9pZDogJHN0YXRlUGFyYW1zLmNsX2lkXG4gICAgICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkuYWRkID0gZnVuY3Rpb24gKHpvX2pzb25iKSB7XG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9ICRodHRwLnBvc3QoJ21vZHVsZXMvem9uZS9tb2R1bGVzL3pvbmUuYWRkL3pvbmUuYWRkLm1kbC5hZGQucGhwJywge1xuICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICB6b19qc29uYjogem9fanNvbmJcbiAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeS5nZXRDb3VudHJpZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9ICRodHRwLmdldCgnaHR0cDovL2FwaS5nZW9uYW1lcy5vcmcvY291bnRyeUluZm9KU09OP3VzZXJuYW1lPWFsZWphbmRyb2xzY2EnKVxuICAgICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeS5nZXRTdGF0ZXMgPSBmdW5jdGlvbiAoem9fY291bnRyeSkge1xuICAgICAgICAgICAgdmFyIHByb21pc2UgPSAkaHR0cC5nZXQoJ2h0dHA6Ly9hcGkuZ2VvbmFtZXMub3JnL2NoaWxkcmVuSlNPTj9nZW9uYW1lSWQ9JyArIHpvX2NvdW50cnkgKyAnJnVzZXJuYW1lPWFsZWphbmRyb2xzY2EnKVxuICAgICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeS5nZXRDaXR5Q291bnR5ID0gZnVuY3Rpb24gKHpvX3N0YXRlKSB7XG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9ICRodHRwLmdldCgnaHR0cDovL2FwaS5nZW9uYW1lcy5vcmcvY2hpbGRyZW5KU09OP2dlb25hbWVJZD0nICsgem9fc3RhdGUgKyAnJnVzZXJuYW1lPWFsZWphbmRyb2xzY2EnKVxuICAgICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGZhY3Rvcnk7XG4gICAgfV07XG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKGFuZ3VsYXIpe1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBcbiAgICByZXR1cm4gYW5ndWxhci5tb2R1bGUoJ2FwcC56b25lLnVwZGF0ZScsW10pXG5cbiAgICAuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJyxcbiAgICBmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCd6b25lVXBkYXRlJywge1xuICAgICAgICAgICAgdXJsOicvem9uZS91cGRhdGUvOmNsX2lkLzp6b19pZCcsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybCA6ICdhcHAvem9uZS9tb2R1bGVzL3pvbmUudXBkYXRlL3pvbmUudXBkYXRlLnZpZXcuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyIDogJ3pvbmVVcGRhdGVDdHJsJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICByZXF1aXJlc0xvZ2luOiB0cnVlXG4gICAgICAgICAgICB9ICAgIFxuICAgICAgICB9KTtcbiAgICB9XSlcblxuICAgIC5mYWN0b3J5KCd6b25lVXBkYXRlRmFjJyxyZXF1aXJlKCcuL3pvbmUudXBkYXRlLmZhYycpKVxuXG4gICAgLmNvbnRyb2xsZXIoJ3pvbmVVcGRhdGVDdHJsJyxyZXF1aXJlKCcuL3pvbmUudXBkYXRlLmN0cmwnKSlcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIiA6IFwiYWN0dWFsaXphciBkaXJlY2Npw7NuIGRlIGVudmlvXCIsXG4gICAgICAgICAgICAgICAgfSIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgcmV0dXJuIFsnJHNjb3BlJywgJ3pvbmVVcGRhdGVGYWMnLCAnJGxvY2F0aW9uJywgJ2kxOG5GaWx0ZXInLCAnJGludGVydmFsJywgJyRzdGF0ZVBhcmFtcycsXG4gICAgICAgIGZ1bmN0aW9uICgkc2NvcGUsIHpvbmVVcGRhdGVGYWMsICRsb2NhdGlvbiwgaTE4bkZpbHRlciwgJGludGVydmFsLCAkc3RhdGVQYXJhbXMpIHtcblxuICAgICAgICAgICAgJHNjb3BlLm9uU3VibWl0ID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgem9uZVVwZGF0ZUZhYy51cGRhdGUoJHNjb3BlLmZtRGF0YSkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocHJvbWlzZS5kYXRhID09IFwiMVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3pvbmUvJyArICRzdGF0ZVBhcmFtcy5jbF9pZCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICRzY29wZS5nZXRTdGF0ZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnpvX3N0YXRlb3B0aW9ucyA9IFtdO1xuICAgICAgICAgICAgICAgICRzY29wZS56b19jaXR5b3B0aW9ucyA9IFtdO1xuICAgICAgICAgICAgICAgICRzY29wZS56b19jb3VudHlvcHRpb25zID0gW107XG4gICAgICAgICAgICAgICAgJGludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgem9uZVVwZGF0ZUZhYy5nZXRTdGF0ZXMoJHNjb3BlLmZtRGF0YS56b19jb3VudHJ5KS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YS5nZW9uYW1lcykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuem9fc3RhdGVvcHRpb25zID0gcHJvbWlzZS5kYXRhLmdlb25hbWVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyRzY29wZS51cGRhdGVGYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSwgMCwgMSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICRzY29wZS5nZXRDaXR5Q291bnR5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICRzY29wZS56b19jaXR5b3B0aW9ucyA9IFtdO1xuICAgICAgICAgICAgICAgICRzY29wZS56b19jb3VudHlvcHRpb25zID0gW107XG4gICAgICAgICAgICAgICAgJGludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgem9uZVVwZGF0ZUZhYy5nZXRTdGF0ZXMoJHNjb3BlLmZtRGF0YS56b19zdGF0ZSkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEuZ2VvbmFtZXMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnpvX2NpdHlvcHRpb25zID0gcHJvbWlzZS5kYXRhLmdlb25hbWVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS56b19jb3VudHlvcHRpb25zID0gcHJvbWlzZS5kYXRhLmdlb25hbWVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyRzY29wZS51cGRhdGVGYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSwgMCwgMSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICRzY29wZS56b19zdGF0dXNvcHRpb25zID0gaTE4bkZpbHRlcihcInpvbmUuZmllbGRzLnpvX3N0YXR1c29wdGlvbnNcIik7XG5cbiAgICAgICAgICAgICRzY29wZS4kb24oJyR2aWV3Q29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAvLyB0aGlzIGNvZGUgaXMgZXhlY3V0ZWQgYWZ0ZXIgdGhlIHZpZXcgaXMgbG9hZGVkXG4gICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHpvbmVVcGRhdGVGYWMuZGF0YSgpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNPYmplY3QoYW5ndWxhci5mcm9tSnNvbihwcm9taXNlLmRhdGEpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmZtRGF0YSA9IGFuZ3VsYXIuZnJvbUpzb24ocHJvbWlzZS5kYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB6b25lVXBkYXRlRmFjLmdldENvdW50cmllcygpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhLmdlb25hbWVzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS56b19jb3VudHJ5b3B0aW9ucyA9IHByb21pc2UuZGF0YS5nZW9uYW1lcztcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8kc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgem9uZVVwZGF0ZUZhYy5nZXRTdGF0ZXMoJHNjb3BlLmZtRGF0YS56b19jb3VudHJ5KS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEuZ2VvbmFtZXMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS56b19zdGF0ZW9wdGlvbnMgPSBwcm9taXNlLmRhdGEuZ2VvbmFtZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8kc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB6b25lVXBkYXRlRmFjLmdldENpdHlDb3VudHkoJHNjb3BlLmZtRGF0YS56b19zdGF0ZSkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhLmdlb25hbWVzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuem9fY2l0eW9wdGlvbnMgPSBwcm9taXNlLmRhdGEuZ2VvbmFtZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS56b19jb3VudHlvcHRpb25zID0gcHJvbWlzZS5kYXRhLmdlb25hbWVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vJHNjb3BlLnVwZGF0ZUZhaWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfV07XG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgcmV0dXJuIFsnJGh0dHAnLCAnJHEnLCAgJyRzdGF0ZVBhcmFtcycsIGZ1bmN0aW9uICgkaHR0cCwgJHEsICRzdGF0ZVBhcmFtcykge1xuICAgICAgICB2YXIgZmFjdG9yeSA9IHt9O1xuICAgICAgICBmYWN0b3J5LmRhdGEgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KCdtb2R1bGVzL3pvbmUvbW9kdWxlcy96b25lLnVwZGF0ZS96b25lLnVwZGF0ZS5tZGwuZ2V0Wm9uZS5waHAnLCB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICAgICAgem9faWQ6ICRzdGF0ZVBhcmFtcy56b19pZFxuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICBmYWN0b3J5LnVwZGF0ZSA9IGZ1bmN0aW9uICh6b19qc29uYikge1xuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoXG4gICAgICAgICAgICAgICAgJGh0dHAucG9zdCgnbW9kdWxlcy96b25lL21vZHVsZXMvem9uZS51cGRhdGUvem9uZS51cGRhdGUubWRsLnVwZGF0ZS5waHAnLCB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICAgICAgem9faWQ6ICRzdGF0ZVBhcmFtcy56b19pZCxcbiAgICAgICAgICAgICAgICAgICAgem9fanNvbmI6IHpvX2pzb25iXG4gICAgICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkuZ2V0Q291bnRyaWVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHByb21pc2UgPSAkaHR0cC5nZXQoJ2h0dHA6Ly9hcGkuZ2VvbmFtZXMub3JnL2NvdW50cnlJbmZvSlNPTj91c2VybmFtZT1hbGVqYW5kcm9sc2NhJylcbiAgICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkuZ2V0U3RhdGVzID0gZnVuY3Rpb24gKHpvX2NvdW50cnkpIHtcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gJGh0dHAuZ2V0KCdodHRwOi8vYXBpLmdlb25hbWVzLm9yZy9jaGlsZHJlbkpTT04/Z2VvbmFtZUlkPScgKyB6b19jb3VudHJ5ICsgJyZ1c2VybmFtZT1hbGVqYW5kcm9sc2NhJylcbiAgICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkuZ2V0Q2l0eUNvdW50eSA9IGZ1bmN0aW9uICh6b19zdGF0ZSkge1xuICAgICAgICAgICAgdmFyIHByb21pc2UgPSAkaHR0cC5nZXQoJ2h0dHA6Ly9hcGkuZ2VvbmFtZXMub3JnL2NoaWxkcmVuSlNPTj9nZW9uYW1lSWQ9JyArIHpvX3N0YXRlICsgJyZ1c2VybmFtZT1hbGVqYW5kcm9sc2NhJylcbiAgICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBmYWN0b3J5O1xuICAgIH1dO1xuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRzY29wZScsICd6b25lRmFjJywgJ2kxOG5GaWx0ZXInLFxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCB6b25lRmFjLCBpMThuRmlsdGVyKSB7XG5cbiAgICAgICAgICAgICRzY29wZS5sYWJlbHMgPSBPYmplY3Qua2V5cyhpMThuRmlsdGVyKFwiem9uZS5sYWJlbHNcIikpO1xuICAgICAgICAgICAgJHNjb3BlLmNvbHVtbnMgPSBpMThuRmlsdGVyKFwiem9uZS5jb2x1bW5zXCIpO1xuICAgICAgICBcbiAgICAgICAgICAgIC8vIGZvcm1hdEl0ZW0gZXZlbnQgaGFuZGxlclxuICAgICAgICAgICAgdmFyIHpvX2lkO1xuICAgICAgICAgICAgdmFyIGNsX2lkO1xuICAgICAgICAgICAgJHNjb3BlLmZvcm1hdEl0ZW0gPSBmdW5jdGlvbiAocywgZSwgY2VsbCkge1xuXG4gICAgICAgICAgICAgICAgaWYgKGUucGFuZWwuY2VsbFR5cGUgPT0gd2lqbW8uZ3JpZC5DZWxsVHlwZS5Sb3dIZWFkZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgZS5jZWxsLnRleHRDb250ZW50ID0gZS5yb3cgKyAxO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHMucm93cy5kZWZhdWx0U2l6ZSA9IDMwO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gYWRkIEJvb3RzdHJhcCBodG1sXG4gICAgICAgICAgICAgICAgaWYgKChlLnBhbmVsLmNlbGxUeXBlID09IHdpam1vLmdyaWQuQ2VsbFR5cGUuQ2VsbCkgJiYgKGUuY29sID09IDApKSB7XG4gICAgICAgICAgICAgICAgICAgIHpvX2lkID0gZS5wYW5lbC5nZXRDZWxsRGF0YShlLnJvdywgMSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBjbF9pZCA9IGUucGFuZWwuZ2V0Q2VsbERhdGEoZS5yb3csIDIsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgZS5jZWxsLnN0eWxlLm92ZXJmbG93ID0gJ3Zpc2libGUnO1xuICAgICAgICAgICAgICAgICAgICBlLmNlbGwuaW5uZXJIVE1MID0gJzxkaXYgY2xhc3M9XCJidG4tZ3JvdXAgYnRuLWdyb3VwLWp1c3RpZmllZFwiIHJvbGU9XCJncm91cFwiIGFyaWEtbGFiZWw9XCIuLi5cIj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidG4tZ3JvdXBcIiByb2xlPVwiZ3JvdXBcIj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiIy96b25lL3VwZGF0ZS8nKyBjbF9pZCArICcvJyArIHpvX2lkICsgJ1wiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0IGJ0bi14c1wiIG5nLWNsaWNrPVwiZWRpdCgkaXRlbS5jbF9pZClcIj5FZGl0YXI8L2E+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+JztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAgICAgLy8gYmluZCBjb2x1bW5zIHdoZW4gZ3JpZCBpcyBpbml0aWFsaXplZFxuICAgICAgICAgICAgJHNjb3BlLmluaXRHcmlkID0gZnVuY3Rpb24gKHMsIGUpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8ICRzY29wZS5sYWJlbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbCA9IG5ldyB3aWptby5ncmlkLkNvbHVtbigpO1xuICAgICAgICAgICAgICAgICAgICBjb2wuYmluZGluZyA9ICRzY29wZS5jb2x1bW5zW2ldO1xuICAgICAgICAgICAgICAgICAgICBjb2wuaGVhZGVyID0gaTE4bkZpbHRlcihcInpvbmUubGFiZWxzLlwiICsgJHNjb3BlLmxhYmVsc1tpXSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbC53b3JkV3JhcCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBjb2wud2lkdGggPSAxNTA7XG4gICAgICAgICAgICAgICAgICAgIHMuY29sdW1ucy5wdXNoKGNvbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIC8vIGNyZWF0ZSB0aGUgdG9vbHRpcCBvYmplY3RcbiAgICAgICAgICAgICRzY29wZS4kd2F0Y2goJ2dnR3JpZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoJHNjb3BlLmdnR3JpZCkge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgLy8gc3RvcmUgcmVmZXJlbmNlIHRvIGdyaWRcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZsZXggPSAkc2NvcGUuZ2dHcmlkO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNyZWF0ZSB0b29sdGlwXG4gICAgICAgICAgICAgICAgICAgIHZhciB0aXAgPSBuZXcgd2lqbW8uVG9vbHRpcCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgcm5nID0gbnVsbDtcblxuICAgICAgICAgICAgICAgICAgICAvLyBtb25pdG9yIHRoZSBtb3VzZSBvdmVyIHRoZSBncmlkXG4gICAgICAgICAgICAgICAgICAgIGZsZXguaG9zdEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGh0ID0gZmxleC5oaXRUZXN0KGV2dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWh0LnJhbmdlLmVxdWFscyhybmcpKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBuZXcgY2VsbCBzZWxlY3RlZCwgc2hvdyB0b29sdGlwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGh0LmNlbGxUeXBlID09IHdpam1vLmdyaWQuQ2VsbFR5cGUuQ2VsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBybmcgPSBodC5yYW5nZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvbCA9IGZsZXguY29sdW1uc1tybmcuY29sXS5oZWFkZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjZWxsRWxlbWVudCA9IGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQoZXZ0LmNsaWVudFgsIGV2dC5jbGllbnRZKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNlbGxCb3VuZHMgPSB3aWptby5SZWN0LmZyb21Cb3VuZGluZ1JlY3QoY2VsbEVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YSA9IHdpam1vLmVzY2FwZUh0bWwoZmxleC5nZXRDZWxsRGF0YShybmcucm93LCBybmcuY29sLCB0cnVlKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXBDb250ZW50ID0gY29sICsgJzogXCI8Yj4nICsgZGF0YSArICc8L2I+XCInO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2VsbEVsZW1lbnQuY2xhc3NOYW1lLmluZGV4T2YoJ3dqLWNlbGwnKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXAuc2hvdyhmbGV4Lmhvc3RFbGVtZW50LCB0aXBDb250ZW50LCBjZWxsQm91bmRzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpcC5oaWRlKCk7IC8vIGNlbGwgbXVzdCBiZSBiZWhpbmQgc2Nyb2xsIGJhci4uLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgZmxleC5ob3N0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpcC5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBybmcgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJHNjb3BlLiRvbignJHZpZXdDb250ZW50TG9hZGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIC8vIHRoaXMgY29kZSBpcyBleGVjdXRlZCBhZnRlciB0aGUgdmlldyBpcyBsb2FkZWRcbiAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgem9uZUZhYy5kYXRhKCkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5kYXRhID0gbmV3IHdpam1vLmNvbGxlY3Rpb25zLkNvbGxlY3Rpb25WaWV3KHByb21pc2UuZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XTtcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckaHR0cCcsICckcScsICAnJHN0YXRlUGFyYW1zJywgZnVuY3Rpb24gKCRodHRwLCAkcSwgJHN0YXRlUGFyYW1zKSB7XG4gICAgICAgIHZhciBmYWN0b3J5ID0ge307XG4gICAgICAgIGZhY3RvcnkuZGF0YSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKFxuICAgICAgICAgICAgICAgICRodHRwLnBvc3QoJ21vZHVsZXMvem9uZS96b25lLm1kbC5nZXRab25lcy5waHAnLCB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICAgICAgcHJvY2Nlc19pZDogbmV3IERhdGUoKS5nZXRNaWxsaXNlY29uZHMoKSxcbiAgICAgICAgICAgICAgICAgICAgY2xfaWQ6ICRzdGF0ZVBhcmFtcy5jbF9pZFxuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZmFjdG9yeTtcbiAgICB9XTtcblxufSkoYW5ndWxhcik7Il19
