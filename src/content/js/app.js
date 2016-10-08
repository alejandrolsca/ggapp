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
                    $rootScope.currentState = toState;
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
            { "label": "En espera de material", "value": 1, "desc": "No hay material en el almacén", "us_group": "warehouse", "wo_prevstatus": [0, 4, 7, 12] },
            { "label": "Material disponible", "value": 2, "desc": "Hay material en el almacén pero aun no se ha iniciado el trabajo", "us_group": "warehouse", "wo_prevstatus": [0, 1, 7, 12] },
            { "label": "En producción", "value": 3, "desc": "En producción", "us_group": "production", "wo_prevstatus": [2, 4] },
            { "label": "Detenido", "value": 4, "desc": "La orden se detuvo en producción", "us_group": "production", "wo_prevstatus": [3] },
            { "label": "Terminado", "value": 5, "desc": "Terminado en producción", "us_group": "production", "wo_prevstatus": [3] },
            { "label": "Departamento de calidad", "value": 6, "desc": "Inspeccion de calidad en proceso", "us_group": "quality_assurance", "wo_prevstatus": [5] },
            { "label": "Rechazado por calidad", "value": 7, "desc": "Rechazado por calidad", "us_group": "quality_assurance", "wo_prevstatus": [6] },
            { "label": "Aprobado por calidad", "value": 8, "desc": "Aprobado por calidad", "us_group": "quality_assurance", "wo_prevstatus": [6] },
            { "label": "Empaque", "value": 9, "desc": "En proceso de empaque", "us_group": "packaging", "wo_prevstatus": [8] },
            { "label": "Listo para embarque", "value": 10, "desc": "Listo para embarque", "us_group": "packaging", "wo_prevstatus": [9] },
            { "label": "Facturado", "value": 11, "desc": "Facturado", "us_group": "warehouse", "wo_prevstatus": [10] },
            { "label": "No se pudo entregar", "value": 12, "desc": "El producto no se pudo entregar", "us_group": "warehouse", "wo_prevstatus": [11] },
            { "label": "Rechazado por el cliente", "value": 13, "desc": "El productofue rechazado por el cliente", "us_group": "warehouse", "wo_prevstatus": [11, 12] },
            { "label": "Entregado", "value": 14, "desc": "El producto se entrego al cliente con éxito", "us_group": "warehouse", "wo_prevstatus": [11, 12] },
            { "label": "Cancelada", "value": 15, "desc": "La orden de trabajo fue cancelada", "us_group": "admin", "wo_prevstatus": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15] }
        ]
    }
}
},{}],126:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'workflowFactory', '$location', 'i18nFilter', '$stateParams', '$filter', 'authService',
        function ($scope, workflowFactory, $location, i18nFilter, $stateParams, $filter, authService) {

            var userProfile = angular.fromJson(localStorage.getItem('profile')) || {};



            $scope.labels = Object.keys(i18nFilter("workflow.labels"));
            $scope.columns = i18nFilter("workflow.columns");

            // formatter to add checkboxes to boolean columns
            $scope.onUpdate = function () {
                var flex = $scope.ggGrid;
                var arr = []
                for (var i = 0; i < flex.rows.length; i++) {
                    if (flex.getCellData(i, flex.columns.getColumn('active').index) === true) arr.push(+flex.getCellData(i, flex.columns.getColumn('wo_id').index));
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
                console.log($scope.wo_id.join(','))
                workflowFactory.update($scope.fmData.wo_nextstatus, $scope.wo_id.join(',')).then(function (promise) {
                    console.log(promise.data)
                    if (promise.data.rowCount >= 1) {
                        $scope.fmData.wo_status = $scope.fmData.wo_nextstatus;
                    } else {
                        $scope.updateFail = true;
                    }
                });
                $('#myModal').modal('hide');
                console.log('submited')
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
                                if ([14, 15].includes(newValue) && [14, 15].includes(value.value)) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwLzQwNC80MDQuY3RybC5qcyIsInNyYy9hcHAvNDA0L2luZGV4LmpzIiwic3JjL2FwcC9hcHAuY3RybC5qcyIsInNyYy9hcHAvYXBwLmZhYy5qcyIsInNyYy9hcHAvYXBwLmh0dHAuaW50ZXJjZXB0b3IuanMiLCJzcmMvYXBwL2FwcC5qcyIsInNyYy9hcHAvYXV0aC9sYW5nLmVzLU1YLmpzIiwic3JjL2FwcC9jbGllbnQvY2xpZW50LmN0cmwuanMiLCJzcmMvYXBwL2NsaWVudC9jbGllbnQuZmFjLmpzIiwic3JjL2FwcC9jbGllbnQvaW5kZXguanMiLCJzcmMvYXBwL2NsaWVudC9sYW5nLmN1c3RvbS5lcy1NWC5qcyIsInNyYy9hcHAvY2xpZW50L2xhbmcuZXMtTVguanMiLCJzcmMvYXBwL2NsaWVudC9tb2R1bGVzL2NsaWVudC5hZGQvY2xpZW50LmFkZC5jdHJsLmpzIiwic3JjL2FwcC9jbGllbnQvbW9kdWxlcy9jbGllbnQuYWRkL2NsaWVudC5hZGQuZmFjLmpzIiwic3JjL2FwcC9jbGllbnQvbW9kdWxlcy9jbGllbnQuYWRkL2luZGV4LmpzIiwic3JjL2FwcC9jbGllbnQvbW9kdWxlcy9jbGllbnQuYWRkL2xhbmcuZXMtTVguanMiLCJzcmMvYXBwL2NsaWVudC9tb2R1bGVzL2NsaWVudC51cGRhdGUvY2xpZW50LnVwZGF0ZS5jdHJsLmpzIiwic3JjL2FwcC9jbGllbnQvbW9kdWxlcy9jbGllbnQudXBkYXRlL2NsaWVudC51cGRhdGUuZmFjLmpzIiwic3JjL2FwcC9jbGllbnQvbW9kdWxlcy9jbGllbnQudXBkYXRlL2luZGV4LmpzIiwic3JjL2FwcC9jbGllbnQvbW9kdWxlcy9jbGllbnQudXBkYXRlL2xhbmcuZXMtTVguanMiLCJzcmMvYXBwL2hvbWUvaG9tZS5jdHJsLmpzIiwic3JjL2FwcC9ob21lL2hvbWUuZmFjLmpzIiwic3JjL2FwcC9ob21lL2luZGV4LmpzIiwic3JjL2FwcC9ob21lL2xhbmcuZXMtTVguanMiLCJzcmMvYXBwL2luay9pbmRleC5qcyIsInNyYy9hcHAvaW5rL2luay5jdHJsLmpzIiwic3JjL2FwcC9pbmsvaW5rLmZhYy5qcyIsInNyYy9hcHAvaW5rL2xhbmcuZXMtTVguanMiLCJzcmMvYXBwL2luay9tb2R1bGVzL2luay5hZGQvaW5kZXguanMiLCJzcmMvYXBwL2luay9tb2R1bGVzL2luay5hZGQvaW5rLmFkZC5jdHJsLmpzIiwic3JjL2FwcC9pbmsvbW9kdWxlcy9pbmsuYWRkL2luay5hZGQuZmFjLmpzIiwic3JjL2FwcC9pbmsvbW9kdWxlcy9pbmsuYWRkL2xhbmcuZXMtTVguanMiLCJzcmMvYXBwL2luay9tb2R1bGVzL2luay51cGRhdGUvaW5kZXguanMiLCJzcmMvYXBwL2luay9tb2R1bGVzL2luay51cGRhdGUvaW5rLnVwZGF0ZS5jdHJsLmpzIiwic3JjL2FwcC9pbmsvbW9kdWxlcy9pbmsudXBkYXRlL2luay51cGRhdGUuZmFjLmpzIiwic3JjL2FwcC9pbmsvbW9kdWxlcy9pbmsudXBkYXRlL2xhbmcuZXMtTVguanMiLCJzcmMvYXBwL2xhbmcuZmlsdGVyLmkxOG4uanMiLCJzcmMvYXBwL2xhbmcubG9jYWxlLmVuLVVTLmpzIiwic3JjL2FwcC9sYW5nLmxvY2FsZS5lcy1NWC5qcyIsInNyYy9hcHAvbG9naW4vaW5kZXguanMiLCJzcmMvYXBwL2xvZ2luL2xvZ2luLmN0cmwuanMiLCJzcmMvYXBwL21hY2hpbmUvaW5kZXguanMiLCJzcmMvYXBwL21hY2hpbmUvbGFuZy5lcy1NWC5qcyIsInNyYy9hcHAvbWFjaGluZS9tYWNoaW5lLmN0cmwuanMiLCJzcmMvYXBwL21hY2hpbmUvbWFjaGluZS5mYWMuanMiLCJzcmMvYXBwL21hY2hpbmUvbW9kdWxlcy9tYWNoaW5lLmFkZC9pbmRleC5qcyIsInNyYy9hcHAvbWFjaGluZS9tb2R1bGVzL21hY2hpbmUuYWRkL2xhbmcuZXMtTVguanMiLCJzcmMvYXBwL21hY2hpbmUvbW9kdWxlcy9tYWNoaW5lLmFkZC9tYWNoaW5lLmFkZC5jdHJsLmpzIiwic3JjL2FwcC9tYWNoaW5lL21vZHVsZXMvbWFjaGluZS5hZGQvbWFjaGluZS5hZGQuZmFjLmpzIiwic3JjL2FwcC9tYWNoaW5lL21vZHVsZXMvbWFjaGluZS51cGRhdGUvaW5kZXguanMiLCJzcmMvYXBwL21hY2hpbmUvbW9kdWxlcy9tYWNoaW5lLnVwZGF0ZS9sYW5nLmVzLU1YLmpzIiwic3JjL2FwcC9tYWNoaW5lL21vZHVsZXMvbWFjaGluZS51cGRhdGUvbWFjaGluZS51cGRhdGUuY3RybC5qcyIsInNyYy9hcHAvbWFjaGluZS9tb2R1bGVzL21hY2hpbmUudXBkYXRlL21hY2hpbmUudXBkYXRlLmZhYy5qcyIsInNyYy9hcHAvcGFwZXIvaW5kZXguanMiLCJzcmMvYXBwL3BhcGVyL2xhbmcuZXMtTVguanMiLCJzcmMvYXBwL3BhcGVyL21vZHVsZXMvcGFwZXIuYWRkL2luZGV4LmpzIiwic3JjL2FwcC9wYXBlci9tb2R1bGVzL3BhcGVyLmFkZC9sYW5nLmVzLU1YLmpzIiwic3JjL2FwcC9wYXBlci9tb2R1bGVzL3BhcGVyLmFkZC9wYXBlci5hZGQuY3RybC5qcyIsInNyYy9hcHAvcGFwZXIvbW9kdWxlcy9wYXBlci5hZGQvcGFwZXIuYWRkLmZhYy5qcyIsInNyYy9hcHAvcGFwZXIvbW9kdWxlcy9wYXBlci51cGRhdGUvaW5kZXguanMiLCJzcmMvYXBwL3BhcGVyL21vZHVsZXMvcGFwZXIudXBkYXRlL2xhbmcuZXMtTVguanMiLCJzcmMvYXBwL3BhcGVyL21vZHVsZXMvcGFwZXIudXBkYXRlL3BhcGVyLnVwZGF0ZS5jdHJsLmpzIiwic3JjL2FwcC9wYXBlci9tb2R1bGVzL3BhcGVyLnVwZGF0ZS9wYXBlci51cGRhdGUuZmFjLmpzIiwic3JjL2FwcC9wYXBlci9wYXBlci5jdHJsLmpzIiwic3JjL2FwcC9wYXBlci9wYXBlci5mYWMuanMiLCJzcmMvYXBwL3Byb2R1Y3QvaW5kZXguanMiLCJzcmMvYXBwL3Byb2R1Y3QvbGFuZy5lcy1NWC5qcyIsInNyYy9hcHAvcHJvZHVjdC9tb2R1bGVzL3Byb2R1Y3RPZmZzZXRHZW5lcmFsLmFkZC9pbmRleC5qcyIsInNyYy9hcHAvcHJvZHVjdC9tb2R1bGVzL3Byb2R1Y3RPZmZzZXRHZW5lcmFsLmFkZC9sYW5nLmVzLU1YLmpzIiwic3JjL2FwcC9wcm9kdWN0L21vZHVsZXMvcHJvZHVjdE9mZnNldEdlbmVyYWwuYWRkL3Byb2R1Y3RPZmZzZXRHZW5lcmFsLmFkZC5jdHJsLmpzIiwic3JjL2FwcC9wcm9kdWN0L21vZHVsZXMvcHJvZHVjdE9mZnNldEdlbmVyYWwuYWRkL3Byb2R1Y3RPZmZzZXRHZW5lcmFsLmFkZC5mYWMuanMiLCJzcmMvYXBwL3Byb2R1Y3QvbW9kdWxlcy9wcm9kdWN0T2Zmc2V0R2VuZXJhbC51cGRhdGUvaW5kZXguanMiLCJzcmMvYXBwL3Byb2R1Y3QvbW9kdWxlcy9wcm9kdWN0T2Zmc2V0R2VuZXJhbC51cGRhdGUvbGFuZy5lcy1NWC5qcyIsInNyYy9hcHAvcHJvZHVjdC9tb2R1bGVzL3Byb2R1Y3RPZmZzZXRHZW5lcmFsLnVwZGF0ZS9wcm9kdWN0T2Zmc2V0R2VuZXJhbC51cGRhdGUuY3RybC5qcyIsInNyYy9hcHAvcHJvZHVjdC9tb2R1bGVzL3Byb2R1Y3RPZmZzZXRHZW5lcmFsLnVwZGF0ZS9wcm9kdWN0T2Zmc2V0R2VuZXJhbC51cGRhdGUuZmFjLmpzIiwic3JjL2FwcC9wcm9kdWN0L21vZHVsZXMvcHJvZHVjdE9mZnNldFBhZ2luYXRlZC5hZGQvaW5kZXguanMiLCJzcmMvYXBwL3Byb2R1Y3QvbW9kdWxlcy9wcm9kdWN0T2Zmc2V0UGFnaW5hdGVkLmFkZC9sYW5nLmVzLU1YLmpzIiwic3JjL2FwcC9wcm9kdWN0L21vZHVsZXMvcHJvZHVjdE9mZnNldFBhZ2luYXRlZC5hZGQvcHJvZHVjdE9mZnNldFBhZ2luYXRlZC5hZGQuY3RybC5qcyIsInNyYy9hcHAvcHJvZHVjdC9tb2R1bGVzL3Byb2R1Y3RPZmZzZXRQYWdpbmF0ZWQuYWRkL3Byb2R1Y3RPZmZzZXRQYWdpbmF0ZWQuYWRkLmZhYy5qcyIsInNyYy9hcHAvcHJvZHVjdC9wcm9kdWN0LmN0cmwuanMiLCJzcmMvYXBwL3Byb2R1Y3QvcHJvZHVjdC5mYWMuanMiLCJzcmMvYXBwL3N1cHBsaWVyL2luZGV4LmpzIiwic3JjL2FwcC9zdXBwbGllci9sYW5nLmVzLU1YLmpzIiwic3JjL2FwcC9zdXBwbGllci9tb2R1bGVzL3N1cHBsaWVyLmFkZC9pbmRleC5qcyIsInNyYy9hcHAvc3VwcGxpZXIvbW9kdWxlcy9zdXBwbGllci5hZGQvbGFuZy5lcy1NWC5qcyIsInNyYy9hcHAvc3VwcGxpZXIvbW9kdWxlcy9zdXBwbGllci5hZGQvc3VwcGxpZXIuYWRkLmN0cmwuanMiLCJzcmMvYXBwL3N1cHBsaWVyL21vZHVsZXMvc3VwcGxpZXIuYWRkL3N1cHBsaWVyLmFkZC5mYWMuanMiLCJzcmMvYXBwL3N1cHBsaWVyL21vZHVsZXMvc3VwcGxpZXIudXBkYXRlL2luZGV4LmpzIiwic3JjL2FwcC9zdXBwbGllci9tb2R1bGVzL3N1cHBsaWVyLnVwZGF0ZS9sYW5nLmVzLU1YLmpzIiwic3JjL2FwcC9zdXBwbGllci9tb2R1bGVzL3N1cHBsaWVyLnVwZGF0ZS9zdXBwbGllci51cGRhdGUuY3RybC5qcyIsInNyYy9hcHAvc3VwcGxpZXIvbW9kdWxlcy9zdXBwbGllci51cGRhdGUvc3VwcGxpZXIudXBkYXRlLmZhYy5qcyIsInNyYy9hcHAvc3VwcGxpZXIvc3VwcGxpZXIuY3RybC5qcyIsInNyYy9hcHAvc3VwcGxpZXIvc3VwcGxpZXIuZmFjLmpzIiwic3JjL2FwcC91c2VyL2luZGV4LmpzIiwic3JjL2FwcC91c2VyL2xhbmcuZXMtTVguanMiLCJzcmMvYXBwL3VzZXIvbW9kdWxlcy91c2VyLmFkZC9pbmRleC5qcyIsInNyYy9hcHAvdXNlci9tb2R1bGVzL3VzZXIuYWRkL2xhbmcuZXMtTVguanMiLCJzcmMvYXBwL3VzZXIvbW9kdWxlcy91c2VyLmFkZC91c2VyLmFkZC5jdHJsLmpzIiwic3JjL2FwcC91c2VyL21vZHVsZXMvdXNlci5hZGQvdXNlci5hZGQuZmFjLmpzIiwic3JjL2FwcC91c2VyL21vZHVsZXMvdXNlci5wcm9maWxlL2luZGV4LmpzIiwic3JjL2FwcC91c2VyL21vZHVsZXMvdXNlci5wcm9maWxlL2xhbmcuZXMtTVguanMiLCJzcmMvYXBwL3VzZXIvbW9kdWxlcy91c2VyLnByb2ZpbGUvdXNlci5wcm9maWxlLmN0cmwuanMiLCJzcmMvYXBwL3VzZXIvbW9kdWxlcy91c2VyLnVwZGF0ZS9pbmRleC5qcyIsInNyYy9hcHAvdXNlci9tb2R1bGVzL3VzZXIudXBkYXRlL2xhbmcuZXMtTVguanMiLCJzcmMvYXBwL3VzZXIvbW9kdWxlcy91c2VyLnVwZGF0ZS91c2VyLnVwZGF0ZS5jdHJsLmpzIiwic3JjL2FwcC91c2VyL21vZHVsZXMvdXNlci51cGRhdGUvdXNlci51cGRhdGUuZmFjLmpzIiwic3JjL2FwcC91c2VyL3VzZXIuY3RybC5qcyIsInNyYy9hcHAvdXNlci91c2VyLmZhYy5qcyIsInNyYy9hcHAvd28vaW5kZXguanMiLCJzcmMvYXBwL3dvL2xhbmcuZXMtTVguanMiLCJzcmMvYXBwL3dvL21vZHVsZXMvd28uYWRkL2luZGV4LmpzIiwic3JjL2FwcC93by9tb2R1bGVzL3dvLmFkZC9sYW5nLmVzLU1YLmpzIiwic3JjL2FwcC93by9tb2R1bGVzL3dvLmFkZC93by5hZGQuY3RybC5qcyIsInNyYy9hcHAvd28vbW9kdWxlcy93by5hZGQvd28uYWRkLmZhYy5qcyIsInNyYy9hcHAvd28vbW9kdWxlcy93by5kdXBsaWNhdGUvaW5kZXguanMiLCJzcmMvYXBwL3dvL21vZHVsZXMvd28uZHVwbGljYXRlL3dvLmR1cGxpY2F0ZS5jdHJsLmpzIiwic3JjL2FwcC93by9tb2R1bGVzL3dvLmR1cGxpY2F0ZS93by5kdXBsaWNhdGUuZmFjLmpzIiwic3JjL2FwcC93by9tb2R1bGVzL3dvLnVwZGF0ZS9pbmRleC5qcyIsInNyYy9hcHAvd28vbW9kdWxlcy93by51cGRhdGUvbGFuZy5lcy1NWC5qcyIsInNyYy9hcHAvd28vbW9kdWxlcy93by51cGRhdGUvd28udXBkYXRlLmN0cmwuanMiLCJzcmMvYXBwL3dvL21vZHVsZXMvd28udXBkYXRlL3dvLnVwZGF0ZS5mYWMuanMiLCJzcmMvYXBwL3dvL3dvLmN0cmwuanMiLCJzcmMvYXBwL3dvL3dvLmZhYy5qcyIsInNyYy9hcHAvd29ya2Zsb3cvaW5kZXguanMiLCJzcmMvYXBwL3dvcmtmbG93L2xhbmcuZXMtTVguanMiLCJzcmMvYXBwL3dvcmtmbG93L3dvcmtmbG93LmN0cmwuanMiLCJzcmMvYXBwL3dvcmtmbG93L3dvcmtmbG93LmZhYy5qcyIsInNyYy9hcHAvem9uZS9pbmRleC5qcyIsInNyYy9hcHAvem9uZS9sYW5nLmVzLU1YLmpzIiwic3JjL2FwcC96b25lL21vZHVsZXMvem9uZS5hZGQvaW5kZXguanMiLCJzcmMvYXBwL3pvbmUvbW9kdWxlcy96b25lLmFkZC9sYW5nLmVzLU1YLmpzIiwic3JjL2FwcC96b25lL21vZHVsZXMvem9uZS5hZGQvem9uZS5hZGQuY3RybC5qcyIsInNyYy9hcHAvem9uZS9tb2R1bGVzL3pvbmUuYWRkL3pvbmUuYWRkLmZhYy5qcyIsInNyYy9hcHAvem9uZS9tb2R1bGVzL3pvbmUudXBkYXRlL2luZGV4LmpzIiwic3JjL2FwcC96b25lL21vZHVsZXMvem9uZS51cGRhdGUvbGFuZy5lcy1NWC5qcyIsInNyYy9hcHAvem9uZS9tb2R1bGVzL3pvbmUudXBkYXRlL3pvbmUudXBkYXRlLmN0cmwuanMiLCJzcmMvYXBwL3pvbmUvbW9kdWxlcy96b25lLnVwZGF0ZS96b25lLnVwZGF0ZS5mYWMuanMiLCJzcmMvYXBwL3pvbmUvem9uZS5jdHJsLmpzIiwic3JjL2FwcC96b25lL3pvbmUuZmFjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0lBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDektBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRzY29wZScsIGZ1bmN0aW9uICgkc2NvcGUpIHtcbiAgICAgICAgLy9BU0RcbiAgICB9XTtcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oYW5ndWxhcil7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIFxuICAgIHJldHVybiBhbmd1bGFyLm1vZHVsZSgnYXBwLjQwNCcsW10pXG5cbiAgICAuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJyxcbiAgICBmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCc0MDQnLCB7XG4gICAgICAgICAgICB1cmw6Jy80MDQnLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmwgOiAnYXBwLzQwNC80MDQudmlldy5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXIgOiAnNDA0Q3RybCcsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgcmVxdWlyZXNMb2dpbjogdHJ1ZVxuICAgICAgICAgICAgfSAgICBcbiAgICAgICAgfSk7XG4gICAgfV0pXG5cbiAgICAuY29udHJvbGxlcignNDA0Q3RybCcscmVxdWlyZSgnLi80MDQuY3RybCcpKVxuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRzY29wZScsICckcm9vdFNjb3BlJywgJ2kxOG5GaWx0ZXInLCAnJGxvY2F0aW9uJywgJ2F1dGhTZXJ2aWNlJywgXG4gICAgICAgIGZ1bmN0aW9uICgkc2NvcGUsICRyb290U2NvcGUsIGkxOG5GaWx0ZXIsICRsb2NhdGlvbiwgYXV0aFNlcnZpY2UpIHtcblxuICAgICAgICAgICAgLy8kc2NvcGUuYXV0aFNlcnZpY2UgPSBhdXRoU2VydmljZTtcbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICBsYW5nRmFjLmdldExhbmcoKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHByb21pc2UuZGF0YS5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuY3VycmVudExhbmd1YWdlID0gcHJvbWlzZS5kYXRhLmxhbmc7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5uYXZJdGVtcyA9IGkxOG5GaWx0ZXIoXCJHRU5FUkFMLk5BVlwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZm9yICh2YXIgaXRlbSBpbiAkc2NvcGUubmF2SXRlbXMpIHtcbiAgICAgICAgICAgICAgICBpZiAoJHNjb3BlLm5hdkl0ZW1zW2l0ZW1dLnN1Yk1lbnUpIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmxhc3RTdWJtZW51ID0gaXRlbTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAkc2NvcGUubGFuZyA9IGZ1bmN0aW9uIChsYW5nKSB7XG4gICAgICAgICAgICAgICAgbGFuZ0ZhYy5zZXRMYW5nKGxhbmcpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb21pc2UuZGF0YS5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLmN1cnJlbnRMYW5ndWFnZSA9IHByb21pc2UuZGF0YS5sYW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLm5hdkl0ZW1zID0gaTE4bkZpbHRlcihcIkdFTkVSQUwuTkFWXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAqL1xuICAgICAgICB9XVxuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRodHRwJywgJyRxJywgIGZ1bmN0aW9uICgkaHR0cCwgJHEpIHtcbiAgICAgICAgdmFyIGZhY3RvcnkgPSB7fTtcbiAgICAgICAgZmFjdG9yeS5qd3RDaGVjayA9IGZ1bmN0aW9uIChuZXdMYW5nKSB7XG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KCcvYXBpL2p3dCcsIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvY2VzczogbmV3IERhdGUoKS5nZXRNaWxsaXNlY29uZHMoKVxuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZmFjdG9yeTtcbiAgICB9XTtcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckcScsICckaW5qZWN0b3InLCAnYXV0aFNlcnZpY2UnLFxuICAgICAgICBmdW5jdGlvbiAoJHEsICRpbmplY3RvciwgYXV0aFNlcnZpY2UpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgJ3JlcXVlc3QnOiBmdW5jdGlvbiAoY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIHVzZXIgaXMgYXRoZW50aWNhdGVkLCBhZGQgdGhlIHByb2ZpbGUgdG8gdGhlIGhlYWRlcnNcblxuICAgICAgICAgICAgICAgICAgICBpZiAoISFhdXRoU2VydmljZS51c2VyUHJvZmlsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnLmhlYWRlcnMucHJvZmlsZSA9IEpTT04uc3RyaW5naWZ5KGF1dGhTZXJ2aWNlLnVzZXJQcm9maWxlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29uZmlnO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAncmVxdWVzdEVycm9yJzogZnVuY3Rpb24gKHJlamVjdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAvLyBkbyBzb21ldGhpbmcgb24gZXJyb3JcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRxLnJlamVjdChyZWplY3Rpb24pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJ3Jlc3BvbnNlRXJyb3InOiBmdW5jdGlvbiAocmVqZWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGRvIHNvbWV0aGluZyBvbiBlcnJvclxuICAgICAgICAgICAgICAgICAgICB2YXIgYWxlcnRzID0gJGluamVjdG9yLmdldCgnJGFsZXJ0cycpO1xuICAgICAgICAgICAgICAgICAgICBhbGVydHMuZXJyb3IoJ1dvb29wcyEgYW4gZXJyb3IgaGFzIG9jdXJyZWQuJywgSlNPTi5zdHJpbmdpZnkocmVqZWN0aW9uLCBudWxsLCA0KSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkcS5yZWplY3QocmVqZWN0aW9uKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1dXG5cbn0pKGFuZ3VsYXIpIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG5cbiAgICAndXNlIHN0cmljdCc7Ly8gbG8gcXVlIHNlYVxuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcCcsIFtcbiAgICAgICAgJ3VpLnJvdXRlcicsXG4gICAgICAgICduZ0FuaW1hdGUnLFxuICAgICAgICAndWkuYm9vdHN0cmFwJyxcbiAgICAgICAgJ2dnLWZpZWxkcycsXG4gICAgICAgICdnZy1hbGVydHMnLFxuICAgICAgICAnd2onLFxuICAgICAgICAnamEucXInLFxuICAgICAgICAnYXV0aDAubG9jaycsXG4gICAgICAgICdhbmd1bGFyLWp3dCcsXG4gICAgICAgIHJlcXVpcmUoJy4vNDA0JykubmFtZSxcbiAgICAgICAgcmVxdWlyZSgnLi9sb2dpbicpLm5hbWUsXG4gICAgICAgIHJlcXVpcmUoJy4vY2xpZW50JykubmFtZSxcbiAgICAgICAgcmVxdWlyZSgnLi91c2VyJykubmFtZSxcbiAgICAgICAgcmVxdWlyZSgnLi9ob21lJykubmFtZSxcbiAgICAgICAgcmVxdWlyZSgnLi9wcm9kdWN0JykubmFtZSxcbiAgICAgICAgcmVxdWlyZSgnLi9zdXBwbGllcicpLm5hbWUsXG4gICAgICAgIHJlcXVpcmUoJy4vbWFjaGluZScpLm5hbWUsXG4gICAgICAgIHJlcXVpcmUoJy4vcGFwZXInKS5uYW1lLFxuICAgICAgICByZXF1aXJlKCcuL2luaycpLm5hbWUsXG4gICAgICAgIHJlcXVpcmUoJy4vd28nKS5uYW1lLFxuICAgICAgICByZXF1aXJlKCcuL3pvbmUnKS5uYW1lLFxuICAgICAgICByZXF1aXJlKCcuL3dvcmtmbG93JykubmFtZVxuICAgIF0pXG5cbiAgICAgICAgLnNlcnZpY2UoJ2F1dGhTZXJ2aWNlJywgWyckcm9vdFNjb3BlJywgJyRsb2NhdGlvbicsICdsb2NrJywgJ2F1dGhNYW5hZ2VyJywgZnVuY3Rpb24gYXV0aFNlcnZpY2UoJHJvb3RTY29wZSwgJGxvY2F0aW9uLCBsb2NrLCBhdXRoTWFuYWdlcikge1xuXG4gICAgICAgICAgICB2YXIgdXNlclByb2ZpbGUgPSBhbmd1bGFyLmZyb21Kc29uKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdwcm9maWxlJykpIHx8IHt9O1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBsb2dpbigpIHtcbiAgICAgICAgICAgICAgICBsb2NrLnNob3coKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gTG9nZ2luZyBvdXQganVzdCByZXF1aXJlcyByZW1vdmluZyB0aGUgdXNlcidzXG4gICAgICAgICAgICAvLyBpZF90b2tlbiBhbmQgcHJvZmlsZVxuICAgICAgICAgICAgZnVuY3Rpb24gbG9nb3V0KCkge1xuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCdpZF90b2tlbicpO1xuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCdwcm9maWxlJyk7XG4gICAgICAgICAgICAgICAgYXV0aE1hbmFnZXIudW5hdXRoZW50aWNhdGUoKTtcbiAgICAgICAgICAgICAgICB1c2VyUHJvZmlsZSA9IHt9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBTZXQgdXAgdGhlIGxvZ2ljIGZvciB3aGVuIGEgdXNlciBhdXRoZW50aWNhdGVzXG4gICAgICAgICAgICAvLyBUaGlzIG1ldGhvZCBpcyBjYWxsZWQgZnJvbSBhcHAucnVuLmpzXG4gICAgICAgICAgICBmdW5jdGlvbiByZWdpc3RlckF1dGhlbnRpY2F0aW9uTGlzdGVuZXIoKSB7XG4gICAgICAgICAgICAgICAgbG9jay5vbignYXV0aGVudGljYXRlZCcsIGZ1bmN0aW9uIChhdXRoUmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdpZF90b2tlbicsIGF1dGhSZXN1bHQuaWRUb2tlbik7XG4gICAgICAgICAgICAgICAgICAgIGF1dGhNYW5hZ2VyLmF1dGhlbnRpY2F0ZSgpO1xuXG4gICAgICAgICAgICAgICAgICAgIGxvY2suZ2V0UHJvZmlsZShhdXRoUmVzdWx0LmlkVG9rZW4sIGZ1bmN0aW9uIChlcnJvciwgcHJvZmlsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncHJvZmlsZScsIEpTT04uc3RyaW5naWZ5KHByb2ZpbGUpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgndXNlclByb2ZpbGVTZXQnLCBwcm9maWxlKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvaG9tZScpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHVzZXJQcm9maWxlOiB1c2VyUHJvZmlsZSxcbiAgICAgICAgICAgICAgICBsb2dpbjogbG9naW4sXG4gICAgICAgICAgICAgICAgbG9nb3V0OiBsb2dvdXQsXG4gICAgICAgICAgICAgICAgcmVnaXN0ZXJBdXRoZW50aWNhdGlvbkxpc3RlbmVyOiByZWdpc3RlckF1dGhlbnRpY2F0aW9uTGlzdGVuZXIsXG4gICAgICAgICAgICB9XG4gICAgICAgIH1dKVxuXG4gICAgICAgIC5jb25maWcoWyckbG9jYXRpb25Qcm92aWRlcicsICckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLCAnJGh0dHBQcm92aWRlcicsICdsb2NrUHJvdmlkZXInLCAnand0T3B0aW9uc1Byb3ZpZGVyJywgJ2p3dEludGVyY2VwdG9yUHJvdmlkZXInLFxuICAgICAgICAgICAgZnVuY3Rpb24gKCRsb2NhdGlvblByb3ZpZGVyLCAkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyLCAkaHR0cFByb3ZpZGVyLCBsb2NrUHJvdmlkZXIsIGp3dE9wdGlvbnNQcm92aWRlciwgand0SW50ZXJjZXB0b3JQcm92aWRlcikge1xuXG4gICAgICAgICAgICAgICAgbG9ja1Byb3ZpZGVyLmluaXQoe1xuICAgICAgICAgICAgICAgICAgICBjbGllbnRJRDogJ1pleFZERVBscUdMTW5XWG5teUtTc29FOEpPM1pTNzZ5JyxcbiAgICAgICAgICAgICAgICAgICAgZG9tYWluOiAnZ3J1cG9ncmFmaWNvLmF1dGgwLmNvbScsXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhcjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhbmd1YWdlOiBcImVzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjbG9zYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGF1dG9jbG9zZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbWVtYmVyTGFzdExvZ2luOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGF1dGg6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWRpcmVjdDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVkaXJlY3RVcmw6IFwiaHR0cDovL2xvY2FsaG9zdDozMDAwL3d3dy8jL2hvbWVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZVR5cGU6IFwidG9rZW5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzc286IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgbGFuZ3VhZ2VEaWN0aW9uYXJ5OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiR3J1cG8gR3LDoWZpY29cIlxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoZW1lOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWxlZFN1Ym1pdEJ1dHRvbjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2xvZ286IFwiaW1nL2dnYXV0aC1sb2dvLnBuZ1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByaW1hcnlDb2xvcjogXCJncmVlblwiXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGp3dE9wdGlvbnNQcm92aWRlci5jb25maWcoe1xuICAgICAgICAgICAgICAgICAgICBsb2dpblBhdGg6ICcvaG9tZScsXG4gICAgICAgICAgICAgICAgICAgIHVuYXV0aGVudGljYXRlZFJlZGlyZWN0b3I6IFsnJHN0YXRlJywgZnVuY3Rpb24gKCRzdGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdsb2dpbicpO1xuICAgICAgICAgICAgICAgICAgICB9XSxcbiAgICAgICAgICAgICAgICAgICAgdG9rZW5HZXR0ZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnaWRfdG9rZW4nKTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgd2hpdGVMaXN0ZWREb21haW5zOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAnaHR0cDovL2FwaS5nZW9uYW1lcy5vcmcvJ1xuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAkaHR0cFByb3ZpZGVyLmludGVyY2VwdG9ycy5wdXNoKCdqd3RJbnRlcmNlcHRvcicpO1xuXG4gICAgICAgICAgICAgICAgJGh0dHBQcm92aWRlci5pbnRlcmNlcHRvcnMucHVzaChyZXF1aXJlKCcuL2FwcC5odHRwLmludGVyY2VwdG9yJykpO1xuXG4gICAgICAgICAgICAgICAgLy8gQmF0Y2hpbmcgbXVsdGlwbGUgJGh0dHAgcmVzcG9uc2VzIGludG8gb25lICRkaWdlc3RcbiAgICAgICAgICAgICAgICAkaHR0cFByb3ZpZGVyLnVzZUFwcGx5QXN5bmModHJ1ZSk7XG5cbiAgICAgICAgICAgICAgICAvLyBkZWZhdWx0IHJvdXRlc1xuICAgICAgICAgICAgICAgICR1cmxSb3V0ZXJQcm92aWRlci53aGVuKCcnLCAnL2hvbWUnKTtcbiAgICAgICAgICAgICAgICAkdXJsUm91dGVyUHJvdmlkZXIud2hlbignLycsICcvaG9tZScpO1xuICAgICAgICAgICAgICAgICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoXCIvNDA0XCIpO1xuXG4gICAgICAgICAgICB9XSlcblxuICAgICAgICAucnVuKFsnJHJvb3RTY29wZScsICdhdXRoU2VydmljZScsICdhdXRoTWFuYWdlcicsICckbG9jYXRpb24nLCAnand0SGVscGVyJywgJyRzdGF0ZScsICdhcHBGYWMnLFxuICAgICAgICAgICAgZnVuY3Rpb24gKCRyb290U2NvcGUsIGF1dGhTZXJ2aWNlLCBhdXRoTWFuYWdlciwgJGxvY2F0aW9uLCBqd3RIZWxwZXIsICRzdGF0ZSwgYXBwRmFjKSB7XG5cbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRvbignJHN0YXRlQ2hhbmdlU3RhcnQnLCBmdW5jdGlvbiAoZXZlbnQsIHRvU3RhdGUsIHRvUGFyYW1zLCBmcm9tU3RhdGUsIGZyb21QYXJhbXMsIG9wdGlvbnMpIHtcbiAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS5jdXJyZW50U3RhdGUgPSB0b1N0YXRlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoISF0b1N0YXRlLmRhdGEucmVxdWlyZXNMb2dpbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRva2VuID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2lkX3Rva2VuJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodG9rZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWp3dEhlbHBlci5pc1Rva2VuRXhwaXJlZCh0b2tlbikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFhdXRoTWFuYWdlci5pc0F1dGhlbnRpY2F0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF1dGhNYW5hZ2VyLmF1dGhlbnRpY2F0ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9sb2dpbicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9sb2dpbicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAvLyBQdXQgdGhlIGF1dGhTZXJ2aWNlIG9uICRyb290U2NvcGUgc28gaXRzIG1ldGhvZHNcbiAgICAgICAgICAgICAgICAvLyBjYW4gYmUgYWNjZXNzZWQgZnJvbSB0aGUgbmF2IGJhclxuICAgICAgICAgICAgICAgICRyb290U2NvcGUuYXV0aFNlcnZpY2UgPSBhdXRoU2VydmljZTtcblxuICAgICAgICAgICAgICAgIC8vIFJlZ2lzdGVyIHRoZSBhdXRoZW50aWNhdGlvbiBsaXN0ZW5lciB0aGF0IGlzXG4gICAgICAgICAgICAgICAgLy8gc2V0IHVwIGluIGF1dGguc2VydmljZS5qc1xuICAgICAgICAgICAgICAgIGF1dGhTZXJ2aWNlLnJlZ2lzdGVyQXV0aGVudGljYXRpb25MaXN0ZW5lcigpO1xuXG4gICAgICAgICAgICAgICAgLy8gVXNlIHRoZSBhdXRoTWFuYWdlciBmcm9tIGFuZ3VsYXItand0IHRvIGNoZWNrIGZvclxuICAgICAgICAgICAgICAgIC8vIHRoZSB1c2VyJ3MgYXV0aGVudGljYXRpb24gc3RhdGUgd2hlbiB0aGUgcGFnZSBpc1xuICAgICAgICAgICAgICAgIC8vIHJlZnJlc2hlZCBhbmQgbWFpbnRhaW4gYXV0aGVudGljYXRpb25cbiAgICAgICAgICAgICAgICAvL2F1dGhNYW5hZ2VyLmNoZWNrQXV0aE9uUmVmcmVzaCgpO1xuXG4gICAgICAgICAgICAgICAgLy8gTGlzdGVuIGZvciA0MDEgdW5hdXRob3JpemVkIHJlcXVlc3RzIGFuZCByZWRpcmVjdFxuICAgICAgICAgICAgICAgIC8vIHRoZSB1c2VyIHRvIHRoZSBsb2dpbiBwYWdlXG4gICAgICAgICAgICAgICAgYXV0aE1hbmFnZXIucmVkaXJlY3RXaGVuVW5hdXRoZW50aWNhdGVkKCk7XG5cblxuICAgICAgICAgICAgfV0pXG5cbiAgICAgICAgLmZpbHRlcignaTE4bicsIHJlcXVpcmUoJy4vbGFuZy5maWx0ZXIuaTE4bicpKVxuXG4gICAgICAgIC5mYWN0b3J5KCdhcHBGYWMnLCByZXF1aXJlKCcuL2FwcC5mYWMnKSlcblxuICAgICAgICAuY29udHJvbGxlcignYXBwQ3RybCcsIHJlcXVpcmUoJy4vYXBwLmN0cmwnKSlcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIiA6IFwiaW5pY2lhciBzZXNpw7NuXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiZW50ZXJwcmlzZVwiIDogXCJlbXByZXNhXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidXNlclwiIDogXCJ1c3VhcmlvXCIsXG4gICAgICAgICAgICAgICAgICAgIFwicGFzc3dvcmRcIiA6IFwiY29udHJhc2XDsWFcIixcbiAgICAgICAgICAgICAgICB9IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckc2NvcGUnLCAnY2xpZW50RmFjJywgJyRsb2NhdGlvbicsICdpMThuRmlsdGVyJyxcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgY2xpZW50RmFjLCAkbG9jYXRpb24sIGkxOG5GaWx0ZXIpIHtcbiAgICAgICAgICAgICRzY29wZS5mbURhdGEgPSB7fTtcbiAgICAgICAgICAgICRzY29wZS5sYWJlbHMgPSBPYmplY3Qua2V5cyhpMThuRmlsdGVyKFwiY2xpZW50LmxhYmVsc1wiKSk7XG4gICAgICAgICAgICAkc2NvcGUuY29sdW1ucyA9IGkxOG5GaWx0ZXIoXCJjbGllbnQuY29sdW1uc1wiKTtcbiAgICAgICAgXG4gICAgICAgICAgICAvLyBmb3JtYXRJdGVtIGV2ZW50IGhhbmRsZXJcbiAgICAgICAgICAgIHZhciBjbF9pZDtcbiAgICAgICAgICAgICRzY29wZS5mb3JtYXRJdGVtID0gZnVuY3Rpb24gKHMsIGUsIGNlbGwpIHtcblxuICAgICAgICAgICAgICAgIGlmIChlLnBhbmVsLmNlbGxUeXBlID09IHdpam1vLmdyaWQuQ2VsbFR5cGUuUm93SGVhZGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGUuY2VsbC50ZXh0Q29udGVudCA9IGUucm93ICsgMTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBzLnJvd3MuZGVmYXVsdFNpemUgPSAzMDtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIGFkZCBCb290c3RyYXAgaHRtbFxuICAgICAgICAgICAgICAgIGlmICgoZS5wYW5lbC5jZWxsVHlwZSA9PSB3aWptby5ncmlkLkNlbGxUeXBlLkNlbGwpICYmIChlLmNvbCA9PSAwKSkge1xuICAgICAgICAgICAgICAgICAgICBjbF9pZCA9IGUucGFuZWwuZ2V0Q2VsbERhdGEoZS5yb3csIDEsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgZS5jZWxsLnN0eWxlLm92ZXJmbG93ID0gJ3Zpc2libGUnO1xuICAgICAgICAgICAgICAgICAgICBlLmNlbGwuaW5uZXJIVE1MID0gJzxkaXYgY2xhc3M9XCJidG4tZ3JvdXAgYnRuLWdyb3VwLWp1c3RpZmllZFwiIHJvbGU9XCJncm91cFwiIGFyaWEtbGFiZWw9XCIuLi5cIj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidG4tZ3JvdXBcIiByb2xlPVwiZ3JvdXBcIj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiIy9jbGllbnQvdXBkYXRlLycrIGNsX2lkICsgJ1wiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0IGJ0bi14c1wiIG5nLWNsaWNrPVwiZWRpdCgkaXRlbS5jbF9pZClcIj4nICsgaTE4bkZpbHRlcihcImdlbmVyYWwubGFiZWxzLmVkaXRcIikgKyAnPC9hPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYnRuLWdyb3VwXCI+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0ICBidG4teHMgZHJvcGRvd24tdG9nZ2xlXCIgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiIGFyaWEtZXhwYW5kZWQ9XCJmYWxzZVwiPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICcrIGkxOG5GaWx0ZXIoXCJnZW5lcmFsLmxhYmVscy5hZGRcIikgKyAnIDxzcGFuIGNsYXNzPVwiY2FyZXRcIj48L3NwYW4+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51XCIgcm9sZT1cIm1lbnVcIj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiMvd28vYWRkLycrIGNsX2lkICsgJ1wiPjxzcGFuIGNsYXNzPVwiZ2x5cGhpY29uIGdseXBoaWNvbi10aC1sYXJnZVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvc3Bhbj4gT3JkZW48L2E+PC9saT5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiMvcHJvZHVjdC9hZGQvXCIgZGF0YS10b2dnbGU9XCJtb2RhbFwiIGRhdGEtdGFyZ2V0PVwiI215TW9kYWxcIiBkYXRhLWNsX2lkPVwiJysgY2xfaWQgKyAnXCI+PHNwYW4gY2xhc3M9XCJnbHlwaGljb24gZ2x5cGhpY29uLWJhcmNvZGVcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L3NwYW4+IFByb2R1Y3RvPC9hPjwvbGk+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjL3F1b3RlL2FkZC8nKyBjbF9pZCArICdcIj48c3BhbiBjbGFzcz1cImdseXBoaWNvbiBnbHlwaGljb24tZmlsZVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvc3Bhbj4gQ290aXphY2lvbjwvYT48L2xpPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiIy96b25lL2FkZC8nKyBjbF9pZCArICdcIj48c3BhbiBjbGFzcz1cImdseXBoaWNvbiBnbHlwaGljb24tbWFwLW1hcmtlclwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvc3Bhbj4gWm9uYTwvYT48L2xpPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiIy9lbWFpbC9hZGQvJysgY2xfaWQgKyAnXCI+PHNwYW4gY2xhc3M9XCJnbHlwaGljb24gZ2x5cGhpY29uLWVudmVsb3BlXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9zcGFuPiBDb3JyZW88L2E+PC9saT5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC91bD5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJ0bi1ncm91cFwiPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdCAgYnRuLXhzIGRyb3Bkb3duLXRvZ2dsZVwiIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIiBhcmlhLWV4cGFuZGVkPVwiZmFsc2VcIj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnKyBpMThuRmlsdGVyKFwiZ2VuZXJhbC5sYWJlbHMuc2hvd1wiKSArICcgPHNwYW4gY2xhc3M9XCJjYXJldFwiPjwvc3Bhbj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnVcIiByb2xlPVwibWVudVwiPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiIy93by8nKyBjbF9pZCArICdcIj48c3BhbiBjbGFzcz1cImdseXBoaWNvbiBnbHlwaGljb24tbGlzdC1hbHRcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L3NwYW4+IE9yZGVuZXM8L2E+PC9saT5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiMvcHJvZHVjdC8nKyBjbF9pZCArICdcIj48c3BhbiBjbGFzcz1cImdseXBoaWNvbiBnbHlwaGljb24tbGlzdC1hbHRcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L3NwYW4+IFByb2R1Y3RvczwvYT48L2xpPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiIy9xdW90ZS8nKyBjbF9pZCArICdcIj48c3BhbiBjbGFzcz1cImdseXBoaWNvbiBnbHlwaGljb24tbGlzdC1hbHRcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L3NwYW4+IENvdGl6YWNpb25lczwvYT48L2xpPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiIy96b25lLycrIGNsX2lkICsgJ1wiPjxzcGFuIGNsYXNzPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1saXN0LWFsdFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvc3Bhbj4gWm9uYXM8L2E+PC9saT5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiMvZW1haWwvJysgY2xfaWQgKyAnXCI+PHNwYW4gY2xhc3M9XCJnbHlwaGljb24gZ2x5cGhpY29uLWxpc3QtYWx0XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9zcGFuPiBDb3JyZW9zPC9hPjwvbGk+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdWw+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+JztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAgICAgLy8gYmluZCBjb2x1bW5zIHdoZW4gZ3JpZCBpcyBpbml0aWFsaXplZFxuICAgICAgICAgICAgJHNjb3BlLmluaXRHcmlkID0gZnVuY3Rpb24gKHMsIGUpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8ICRzY29wZS5sYWJlbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbCA9IG5ldyB3aWptby5ncmlkLkNvbHVtbigpO1xuICAgICAgICAgICAgICAgICAgICBjb2wuYmluZGluZyA9ICRzY29wZS5jb2x1bW5zW2ldO1xuICAgICAgICAgICAgICAgICAgICBjb2wuaGVhZGVyID0gaTE4bkZpbHRlcihcImNsaWVudC5sYWJlbHMuXCIgKyAkc2NvcGUubGFiZWxzW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgY29sLndvcmRXcmFwID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGNvbC53aWR0aCA9IDE1MDtcbiAgICAgICAgICAgICAgICAgICAgcy5jb2x1bW5zLnB1c2goY29sKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgLy8gY3JlYXRlIHRoZSB0b29sdGlwIG9iamVjdFxuICAgICAgICAgICAgJHNjb3BlLiR3YXRjaCgnZ2dHcmlkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICgkc2NvcGUuZ2dHcmlkKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAvLyBzdG9yZSByZWZlcmVuY2UgdG8gZ3JpZFxuICAgICAgICAgICAgICAgICAgICB2YXIgZmxleCA9ICRzY29wZS5nZ0dyaWQ7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY3JlYXRlIHRvb2x0aXBcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRpcCA9IG5ldyB3aWptby5Ub29sdGlwKCksXG4gICAgICAgICAgICAgICAgICAgICAgICBybmcgPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIG1vbml0b3IgdGhlIG1vdXNlIG92ZXIgdGhlIGdyaWRcbiAgICAgICAgICAgICAgICAgICAgZmxleC5ob3N0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaHQgPSBmbGV4LmhpdFRlc3QoZXZ0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaHQucmFuZ2UuZXF1YWxzKHJuZykpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG5ldyBjZWxsIHNlbGVjdGVkLCBzaG93IHRvb2x0aXBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaHQuY2VsbFR5cGUgPT0gd2lqbW8uZ3JpZC5DZWxsVHlwZS5DZWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJuZyA9IGh0LnJhbmdlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29sID0gZmxleC5jb2x1bW5zW3JuZy5jb2xdLmhlYWRlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNlbGxFbGVtZW50ID0gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludChldnQuY2xpZW50WCwgZXZ0LmNsaWVudFkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2VsbEJvdW5kcyA9IHdpam1vLlJlY3QuZnJvbUJvdW5kaW5nUmVjdChjZWxsRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhID0gd2lqbW8uZXNjYXBlSHRtbChmbGV4LmdldENlbGxEYXRhKHJuZy5yb3csIHJuZy5jb2wsIHRydWUpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpcENvbnRlbnQgPSBjb2wgKyAnOiBcIjxiPicgKyBkYXRhICsgJzwvYj5cIic7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjZWxsRWxlbWVudC5jbGFzc05hbWUuaW5kZXhPZignd2otY2VsbCcpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpcC5zaG93KGZsZXguaG9zdEVsZW1lbnQsIHRpcENvbnRlbnQsIGNlbGxCb3VuZHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlwLmhpZGUoKTsgLy8gY2VsbCBtdXN0IGJlIGJlaGluZCBzY3JvbGwgYmFyLi4uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBmbGV4Lmhvc3RFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3V0JywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGlwLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJuZyA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkKCcjbXlNb2RhbCcpLm9uKCdzaG93LmJzLm1vZGFsJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgdmFyIGJ1dHRvbiA9ICQoZXZlbnQucmVsYXRlZFRhcmdldCk7IC8vIEJ1dHRvbiB0aGF0IHRyaWdnZXJlZCB0aGUgbW9kYWxcbiAgICAgICAgICAgICAgICAkc2NvcGUuY3VycmVudF9pZCA9IGJ1dHRvbi5kYXRhKCdjbF9pZCcpOyAvLyBFeHRyYWN0IGluZm8gZnJvbSBkYXRhLSogYXR0cmlidXRlc1xuICAgICAgICAgICAgICAgICRzY29wZS5mbURhdGEucHJfcHJvY2VzcyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAkc2NvcGUuZm1EYXRhLnByX3R5cGUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgJHNjb3BlLnJlZGlyZWN0ID0gZnVuY3Rpb24gKHVybCkge1xuICAgICAgICAgICAgICAgICQoJyNteU1vZGFsJykubW9kYWwoJ2hpZGUnKTtcbiAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCh1cmwpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkc2NvcGUucHJfcHJvY2Vzc29wdGlvbnMgPSBpMThuRmlsdGVyKFwiY2xpZW50LWN1c3RvbS5maWVsZHMucHJfcHJvY2Vzc29wdGlvbnNcIik7XG5cbiAgICAgICAgICAgICRzY29wZS4kd2F0Y2goJ2ZtRGF0YS5wcl9wcm9jZXNzJywgZnVuY3Rpb24gKG5ld1ZhbHVlLCBvbGRWYWx1ZSkge1xuICAgICAgICAgICAgICAgICRzY29wZS5mbURhdGEucHJfdHlwZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2goJHNjb3BlLnByX3Byb2Nlc3NvcHRpb25zLCBmdW5jdGlvbiAob2JqLCBrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5ld1ZhbHVlID09IG9iai52YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnByX3R5cGVvcHRpb25zID0gb2JqLnR5cGVzO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJHNjb3BlLiRvbignJHZpZXdDb250ZW50TG9hZGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIC8vIHRoaXMgY29kZSBpcyBleGVjdXRlZCBhZnRlciB0aGUgdmlldyBpcyBsb2FkZWRcbiAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgY2xpZW50RmFjLmRhdGEoKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmRhdGEgPSBuZXcgd2lqbW8uY29sbGVjdGlvbnMuQ29sbGVjdGlvblZpZXcocHJvbWlzZS5kYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1dO1xuICAgIFxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckaHR0cCcsICckcScsICBmdW5jdGlvbiAoJGh0dHAsICRxKSB7XG4gICAgICAgIHZhciBmYWN0b3J5ID0ge307XG4gICAgICAgIGZhY3RvcnkuZGF0YSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKFxuICAgICAgICAgICAgICAgICRodHRwLnBvc3QoJy9hcGkvY2xpZW50LycsIHtcbiAgICAgICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgICAgICBwcm9jY2VzX2lkOiBuZXcgRGF0ZSgpLmdldE1pbGxpc2Vjb25kcygpXG4gICAgICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGZhY3Rvcnk7XG4gICAgfV07XG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbihhbmd1bGFyKXtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgLy9jb21tZW50XG5cbiAgICByZXR1cm4gYW5ndWxhci5tb2R1bGUoJ2FwcC5jbGllbnQnLFtcbiAgICAgICAgcmVxdWlyZSgnLi9tb2R1bGVzL2NsaWVudC5hZGQnKS5uYW1lLFxuICAgICAgICByZXF1aXJlKCcuL21vZHVsZXMvY2xpZW50LnVwZGF0ZScpLm5hbWVcbiAgICBdKVxuXG4gICAgLmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsXG4gICAgZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnY2xpZW50Jywge1xuICAgICAgICAgICAgdXJsOicvY2xpZW50JyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsIDogJ2FwcC9jbGllbnQvY2xpZW50LnZpZXcuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyIDogJ2NsaWVudEN0cmwnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHJlcXVpcmVzTG9naW46IHRydWVcbiAgICAgICAgICAgIH0gICAgXG4gICAgICAgIH0pO1xuICAgIH1dKVxuXG4gICAgLmZhY3RvcnkoJ2NsaWVudEZhYycscmVxdWlyZSgnLi9jbGllbnQuZmFjJykpXG5cbiAgICAuY29udHJvbGxlcignY2xpZW50Q3RybCcscmVxdWlyZSgnLi9jbGllbnQuY3RybCcpKVxuICAgIFxufSkoYW5ndWxhcik7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAgICAgICAgICAgICAgICAgXCJsYWJlbHNcIjp7XG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLXRpdGxlXCI6XCJTZWxlY2PDrW9uZSBlbCB0aXBvIGRlIHByb2R1Y3RvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLXByb2Nlc3NcIjpcIlByb2Nlc3NvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLXR5cGVcIjpcIlRpcG9cIixcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgIFwiZmllbGRzXCIgOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcl9wcm9jZXNzb3B0aW9ucyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiT2Zmc2V0XCIsXCJ2YWx1ZVwiOlwib2Zmc2V0XCIsdHlwZXM6W1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiR2VuZXJhbFwiLFwidmFsdWVcIjpcImdlbmVyYWxcIn0sICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJQYWdpbmFkb3NcIixcInZhbHVlXCI6XCJwYWdpbmF0ZWRcIn0sICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJjb3VudGVyZm9pbFwiLFwidmFsdWVcIjpcImNvdW50ZXJmb2lsXCJ9LCAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF19LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJGbGV4b1wiLFwidmFsdWVcIjpcImZsZXhvXCIsdHlwZXM6W1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiRXRpcXVldGFzXCIsXCJ2YWx1ZVwiOlwibGFiZWxzXCJ9LCAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiUmliYm9uc1wiLFwidmFsdWVcIjpcInJpYmJvbnNcIn0sICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJjb3VudGVyZm9pbFwiLFwidmFsdWVcIjpcIm9mZnNldFwifSwgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiUGxvdGVyXCIsXCJ2YWx1ZVwiOlwicGxvdHRlclwiLHR5cGVzOltcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkV0aXF1ZXRhc1wiLFwidmFsdWVcIjpcImxhYmVsc1wifSwgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIlNlw7FhbGl6YWNpw7NuXCIsXCJ2YWx1ZVwiOlwic2lnbmFnZVwifSwgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkJhbm5lcnNcIixcInZhbHVlXCI6XCJiYW5uZXJzXCJ9LCAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiQXJ0aWN1bG9zXCIsXCJ2YWx1ZVwiOlwiQXJ0aWNsZXNcIn0sICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXX0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIlNlbGxvc1wiLFwidmFsdWVcIjpcInNlYWxzXCIsdHlwZXM6W1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiR29tYVwiLFwidmFsdWVcIjpcInJ1YmJlclwifSwgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIk1vbGR1cmFcIixcInZhbHVlXCI6XCJtb2xkaW5nXCJ9LCAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiQXV0b2VudGludGFibGVcIixcInZhbHVlXCI6XCJzZWxmX3RpbnRhYmxlXCJ9LCAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiQ29qaW5cIixcInZhbHVlXCI6XCJwYWRcIn0sICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJUaW50YVwiLFwidmFsdWVcIjpcImlua1wifSwgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiU2VyaWdyYWbDrWFcIixcInZhbHVlXCI6XCJzZXJpZ3JhcGh5XCIsdHlwZXM6W1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiRXRpcXVldGFzXCIsXCJ2YWx1ZVwiOlwibGFiZWxzXCJ9LCAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiU2XDsWFsaXphY2nDs25cIixcInZhbHVlXCI6XCJzaWduYWdlXCJ9LCAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiQmFubmVyc1wiLFwidmFsdWVcIjpcImJhbm5lcnNcIn0sICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJBcnRpY3Vsb3NcIixcInZhbHVlXCI6XCJBcnRpY2xlc1wifSwgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiTGFzZXJcIixcInZhbHVlXCI6XCJsYXNlclwiLHR5cGVzOltcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkxhc2VyXCIsXCJ2YWx1ZVwiOlwibGFzZXJcIn0sICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIiA6IFwiY2xpZW50ZXNcIixcbiAgICAgICAgICAgICAgICAgICAgXCJsYWJlbHNcIjp7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsLWlkXCI6XCJpZCBjbGllbnRlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsLXR5cGVcIjpcIlRpcG8gZGUgQ2xpZW50ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbC1jb3Jwb3JhdGVuYW1lXCI6XCJyYXrDs24gc29jaWFsXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsLXRpblwiOlwicmZjXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsLW5hbWVcIjpcIm5vbWJyZShzKVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbC1mYXRoZXJzbGFzdG5hbWVcIjpcImFwZWxsaWRvIHBhdGVybm9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2wtbW90aGVyc2xhc3RuYW1lXCI6XCJhcGVsbGlkbyBtYXRlcm5vXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsLXN0cmVldFwiOlwiY2FsbGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2wtc3RyZWV0bnVtYmVyXCI6XCJudW1lcm8gZXh0ZXJpb3JcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2wtc3VpdGVudW1iZXJcIjpcIm51bWVybyBpbnRlcmlvclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbC1uZWlnaGJvcmhvb2RcIjpcImNvbG9uaWFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2wtYWRkcmVzc3JlZmVyZW5jZVwiOlwicmVmZXJlbmNpYVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbC1jb3VudHJ5XCI6XCJwYcOtc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbC1zdGF0ZVwiOlwiZXN0YWRvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsLWNpdHlcIjpcImNpdWRhZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbC1jb3VudHlcIjpcIm11bmljaXBpb1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbC16aXBjb2RlXCI6XCJjb2RpZ28gcG9zdGFsXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsLWVtYWlsXCI6XCJjb3JyZW8gZWxlY3Ryw7NuaWNvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsLXBob25lXCI6XCJ0ZWzDqWZvbm9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2wtbW9iaWxlXCI6XCJtw7N2aWxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2wtY3JlZGl0bGltaXRcIjpcImxpbWl0ZSBkZSBjcsOpZGl0b1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbC1jdXN0b21lcmRpc2NvdW50XCI6XCJkZXNjdWVudG9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2wtc3RhdHVzXCI6XCJlc3RhdHVzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsLWRhdGVcIjpcImZlY2hhXCIsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICBcImNvbHVtbnNcIjpbXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsX2lkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsX3R5cGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xfY29ycG9yYXRlbmFtZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbF90aW5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xfbmFtZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbF9mYXRoZXJzbGFzdG5hbWVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xfbW90aGVyc2xhc3RuYW1lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsX3N0cmVldFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbF9zdHJlZXRudW1iZXJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xfc3VpdGVudW1iZXJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xfbmVpZ2hib3Job29kXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsX2FkZHJlc3NyZWZlcmVuY2VcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xfY291bnRyeVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbF9zdGF0ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbF9jaXR5XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsX2NvdW50eVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbF96aXBjb2RlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsX2VtYWlsXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsX3Bob25lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsX21vYmlsZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbF9jcmVkaXRsaW1pdFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbF9jdXN0b21lcmRpc2NvdW50XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsX3N0YXR1c1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbF9kYXRlXCIsXG4gICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgXCJmaWVsZHNcIiA6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsX3N0YXR1c29wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkFjdGl2b1wiLFwidmFsdWVcIjpcIkFcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkluYWN0aXZvXCIsXCJ2YWx1ZVwiOlwiSVwifVxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsX3R5cGVvcHRpb25zIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJGaXNpY2FcIixcInZhbHVlXCI6XCJuYXR1cmFsXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJNb3JhbFwiLFwidmFsdWVcIjpcImxlZ2FsXCJ9XG4gICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgcmV0dXJuIFsnJHNjb3BlJywgJ2NsaWVudEFkZEZhYycsICckbG9jYXRpb24nLCAnaTE4bkZpbHRlcicsICckaW50ZXJ2YWwnLFxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCBjbGllbnRBZGRGYWMsICRsb2NhdGlvbiwgaTE4bkZpbHRlciwgJGludGVydmFsKSB7XG4gICAgICAgICAgICAkc2NvcGUuZm1EYXRhID0ge307XG4gICAgICAgICAgICAkc2NvcGUuZm1EYXRhID0geyBcImNsX3R5cGVcIjogXCJuYXR1cmFsXCIsIFwiY2xfdGluXCI6IFwiU0FCRy04MzAxMDYtQUNBXCIsIFwiY2xfbmFtZVwiOiBcIkdhc3BhciBBbGVqYW5kcm9cIiwgXCJjbF9mYXRoZXJzbGFzdG5hbWVcIjogXCJTYW5jaGV6XCIsIFwiY2xfbW90aGVyc2xhc3RuYW1lXCI6IFwiQmV0YW5jb3VydFwiLCBcImNsX2NvdW50cnlcIjogMzk5NjA2MywgXCJjbF9zdGF0ZVwiOiA0MDE0MzM2LCBcImNsX2NpdHlcIjogODU4MTgxNiwgXCJjbF9jb3VudHlcIjogODU4MTgxNiwgXCJjbF9zdHJlZXRcIjogXCJBViBHVUFEQUxVUEVcIiwgXCJjbF9zdHJlZXRudW1iZXJcIjogXCI2ODc3XCIsIFwiY2xfc3VpdGVudW1iZXJcIjogXCI4MVwiLCBcImNsX25laWdoYm9yaG9vZFwiOiBcIlBMQVpBIEdVQURBTFVQRVwiLCBcImNsX3ppcGNvZGVcIjogXCI0NTAzNlwiLCBcImNsX2FkZHJlc3NyZWZlcmVuY2VcIjogXCJGUklEQSBLSEFMTyBZIEFWIEdVQURBTFVQRVwiLCBcImNsX2VtYWlsXCI6IFwiYWxlamFuZHJvbHNjYUBnbWFpbC5jb21cIiwgXCJjbF9waG9uZVwiOiBcIjMzMzc5NzkxMzVcIiwgXCJjbF9tb2JpbGVcIjogXCIrNTIxMzMxMDExMjU3NlwiLCBcImNsX2NyZWRpdGxpbWl0XCI6IFwiMTAwMDAuMDBcIiwgXCJjbF9jdXN0b21lcmRpc2NvdW50XCI6IFwiMC4xMFwiLCBcImNsX3N0YXR1c1wiOiBcIkFcIiB9XG5cbiAgICAgICAgICAgICRzY29wZS5vblN1Ym1pdCA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgIGNsaWVudEFkZEZhYy5hZGQoJHNjb3BlLmZtRGF0YSkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocHJvbWlzZS5kYXRhLnJvd0NvdW50ID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2NsaWVudCcpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnVwZGF0ZUZhaWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAkc2NvcGUuZ2V0U3RhdGVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICRzY29wZS5jbF9zdGF0ZW9wdGlvbnMgPSBbXTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuY2xfY2l0eW9wdGlvbnMgPSBbXTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuY2xfY291bnR5b3B0aW9ucyA9IFtdO1xuICAgICAgICAgICAgICAgICRpbnRlcnZhbChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGNsaWVudEFkZEZhYy5nZXRTdGF0ZXMoJHNjb3BlLmZtRGF0YS5jbF9jb3VudHJ5KS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YS5nZW9uYW1lcykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuY2xfc3RhdGVvcHRpb25zID0gcHJvbWlzZS5kYXRhLmdlb25hbWVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyRzY29wZS51cGRhdGVGYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSwgMCwgMSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICRzY29wZS5nZXRDaXR5Q291bnR5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICRzY29wZS5jbF9jaXR5b3B0aW9ucyA9IFtdO1xuICAgICAgICAgICAgICAgICRzY29wZS5jbF9jb3VudHlvcHRpb25zID0gW107XG4gICAgICAgICAgICAgICAgJGludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgY2xpZW50QWRkRmFjLmdldFN0YXRlcygkc2NvcGUuZm1EYXRhLmNsX3N0YXRlKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YS5nZW9uYW1lcykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuY2xfY2l0eW9wdGlvbnMgPSBwcm9taXNlLmRhdGEuZ2VvbmFtZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNsX2NvdW50eW9wdGlvbnMgPSBwcm9taXNlLmRhdGEuZ2VvbmFtZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vJHNjb3BlLnVwZGF0ZUZhaWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LCAwLCAxKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICRzY29wZS5jbF9zdGF0dXNvcHRpb25zID0gaTE4bkZpbHRlcihcImNsaWVudC5maWVsZHMuY2xfc3RhdHVzb3B0aW9uc1wiKTtcbiAgICAgICAgICAgICRzY29wZS5jbF90eXBlb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJjbGllbnQuZmllbGRzLmNsX3R5cGVvcHRpb25zXCIpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAkc2NvcGUuJG9uKCckdmlld0NvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgLy8gdGhpcyBjb2RlIGlzIGV4ZWN1dGVkIGFmdGVyIHRoZSB2aWV3IGlzIGxvYWRlZFxuICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgY2xpZW50QWRkRmFjLmdldENvdW50cmllcygpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEuZ2VvbmFtZXMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuY2xfY291bnRyeW9wdGlvbnMgPSBwcm9taXNlLmRhdGEuZ2VvbmFtZXM7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyRzY29wZS51cGRhdGVGYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfV07XG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgcmV0dXJuIFsnJGh0dHAnLCAnJHEnLCAgJyRzdGF0ZVBhcmFtcycsIGZ1bmN0aW9uICgkaHR0cCwgJHEsICRzdGF0ZVBhcmFtcykge1xuICAgICAgICB2YXIgZmFjdG9yeSA9IHt9O1xuICAgICAgICBmYWN0b3J5LmFkZCA9IGZ1bmN0aW9uIChjbF9qc29uYikge1xuICAgICAgICAgICAgdmFyIHByb21pc2UgPSAkaHR0cC5wb3N0KCcvYXBpL2NsaWVudC9hZGQnLCB7XG4gICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgIGNsX2pzb25iOiBjbF9qc29uYlxuICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeS5nZXRDb3VudHJpZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9ICRodHRwLmpzb25wKCdodHRwOi8vYXBpLmdlb25hbWVzLm9yZy9jb3VudHJ5SW5mb0pTT04/dXNlcm5hbWU9YWxlamFuZHJvbHNjYSZjYWxsYmFjaz1KU09OX0NBTExCQUNLJylcbiAgICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkuZ2V0U3RhdGVzID0gZnVuY3Rpb24gKGNsX2NvdW50cnkpIHtcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gJGh0dHAuanNvbnAoJ2h0dHA6Ly9hcGkuZ2VvbmFtZXMub3JnL2NoaWxkcmVuSlNPTj9nZW9uYW1lSWQ9JyArIGNsX2NvdW50cnkgKyAnJnVzZXJuYW1lPWFsZWphbmRyb2xzY2EmY2FsbGJhY2s9SlNPTl9DQUxMQkFDSycpXG4gICAgICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICBmYWN0b3J5LmdldENpdHlDb3VudHkgPSBmdW5jdGlvbiAoY2xfc3RhdGUpIHtcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gJGh0dHAuanNvbnAoJ2h0dHA6Ly9hcGkuZ2VvbmFtZXMub3JnL2NoaWxkcmVuSlNPTj9nZW9uYW1lSWQ9JyArIGNsX3N0YXRlICsgJyZ1c2VybmFtZT1hbGVqYW5kcm9sc2NhJmNhbGxiYWNrPUpTT05fQ0FMTEJBQ0snKVxuICAgICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGZhY3Rvcnk7XG4gICAgfV07XG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKGFuZ3VsYXIpe1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBcbiAgICByZXR1cm4gYW5ndWxhci5tb2R1bGUoJ2FwcC5jbGllbnQuYWRkJyxbXSlcblxuICAgIC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLFxuICAgIGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcbiAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2NsaWVudEFkZCcsIHtcbiAgICAgICAgICAgIHVybDonL2NsaWVudC9hZGQnLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmwgOiAnYXBwL2NsaWVudC9tb2R1bGVzL2NsaWVudC5hZGQvY2xpZW50LmFkZC52aWV3Lmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlciA6ICdjbGllbnRBZGRDdHJsJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICByZXF1aXJlc0xvZ2luOiB0cnVlXG4gICAgICAgICAgICB9ICAgIFxuICAgICAgICB9KTtcbiAgICB9XSlcblxuICAgIC5mYWN0b3J5KCdjbGllbnRBZGRGYWMnLHJlcXVpcmUoJy4vY2xpZW50LmFkZC5mYWMnKSlcblxuICAgIC5jb250cm9sbGVyKCdjbGllbnRBZGRDdHJsJyxyZXF1aXJlKCcuL2NsaWVudC5hZGQuY3RybCcpKVxuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiIDogXCJhZ3JlZ2FyIGNsaWVudGVcIixcbiAgICAgICAgICAgICAgICB9IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckc2NvcGUnLCAnY2xpZW50VXBkYXRlRmFjJywgJyRsb2NhdGlvbicsICdpMThuRmlsdGVyJywgJyRpbnRlcnZhbCcsXG4gICAgICAgIGZ1bmN0aW9uICgkc2NvcGUsIGNsaWVudFVwZGF0ZUZhYywgJGxvY2F0aW9uLCBpMThuRmlsdGVyLCAkaW50ZXJ2YWwpIHtcblxuICAgICAgICAgICAgJHNjb3BlLm9uU3VibWl0ID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgY2xpZW50VXBkYXRlRmFjLnVwZGF0ZSgkc2NvcGUuZm1EYXRhKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9taXNlLmRhdGEucm93Q291bnQgPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvY2xpZW50Jyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICRzY29wZS5nZXRTdGF0ZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmNsX3N0YXRlb3B0aW9ucyA9IFtdO1xuICAgICAgICAgICAgICAgICRzY29wZS5jbF9jaXR5b3B0aW9ucyA9IFtdO1xuICAgICAgICAgICAgICAgICRzY29wZS5jbF9jb3VudHlvcHRpb25zID0gW107XG4gICAgICAgICAgICAgICAgJGludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgY2xpZW50VXBkYXRlRmFjLmdldFN0YXRlcygkc2NvcGUuZm1EYXRhLmNsX2NvdW50cnkpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhLmdlb25hbWVzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5jbF9zdGF0ZW9wdGlvbnMgPSBwcm9taXNlLmRhdGEuZ2VvbmFtZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vJHNjb3BlLnVwZGF0ZUZhaWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LCAwLCAxKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJHNjb3BlLmdldENpdHlDb3VudHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmNsX2NpdHlvcHRpb25zID0gW107XG4gICAgICAgICAgICAgICAgJHNjb3BlLmNsX2NvdW50eW9wdGlvbnMgPSBbXTtcbiAgICAgICAgICAgICAgICAkaW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBjbGllbnRVcGRhdGVGYWMuZ2V0U3RhdGVzKCRzY29wZS5mbURhdGEuY2xfc3RhdGUpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhLmdlb25hbWVzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5jbF9jaXR5b3B0aW9ucyA9IHByb21pc2UuZGF0YS5nZW9uYW1lcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuY2xfY291bnR5b3B0aW9ucyA9IHByb21pc2UuZGF0YS5nZW9uYW1lcztcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8kc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sIDAsIDEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkc2NvcGUuY2xfc3RhdHVzb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJjbGllbnQuZmllbGRzLmNsX3N0YXR1c29wdGlvbnNcIik7XG4gICAgICAgICAgICAkc2NvcGUuY2xfdHlwZW9wdGlvbnMgPSBpMThuRmlsdGVyKFwiY2xpZW50LmZpZWxkcy5jbF90eXBlb3B0aW9uc1wiKTtcblxuICAgICAgICAgICAgJHNjb3BlLiRvbignJHZpZXdDb250ZW50TG9hZGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIC8vIHRoaXMgY29kZSBpcyBleGVjdXRlZCBhZnRlciB0aGUgdmlldyBpcyBsb2FkZWRcbiAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgY2xpZW50VXBkYXRlRmFjLmRhdGEoKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhKSAmJiBwcm9taXNlLmRhdGEubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZm1EYXRhID0gcHJvbWlzZS5kYXRhWzBdLmNsX2pzb25iO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGNsaWVudFVwZGF0ZUZhYy5nZXRDb3VudHJpZXMoKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YS5nZW9uYW1lcykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuY2xfY291bnRyeW9wdGlvbnMgPSBwcm9taXNlLmRhdGEuZ2VvbmFtZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vJHNjb3BlLnVwZGF0ZUZhaWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsaWVudFVwZGF0ZUZhYy5nZXRTdGF0ZXMoJHNjb3BlLmZtRGF0YS5jbF9jb3VudHJ5KS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEuZ2VvbmFtZXMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5jbF9zdGF0ZW9wdGlvbnMgPSBwcm9taXNlLmRhdGEuZ2VvbmFtZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8kc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGllbnRVcGRhdGVGYWMuZ2V0Q2l0eUNvdW50eSgkc2NvcGUuZm1EYXRhLmNsX3N0YXRlKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEuZ2VvbmFtZXMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5jbF9jaXR5b3B0aW9ucyA9IHByb21pc2UuZGF0YS5nZW9uYW1lcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNsX2NvdW50eW9wdGlvbnMgPSBwcm9taXNlLmRhdGEuZ2VvbmFtZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8kc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XTtcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckaHR0cCcsICckcScsICAnJHN0YXRlUGFyYW1zJywgZnVuY3Rpb24gKCRodHRwLCAkcSwgJHN0YXRlUGFyYW1zKSB7XG4gICAgICAgIHZhciBmYWN0b3J5ID0ge307XG4gICAgICAgIGZhY3RvcnkuZGF0YSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKFxuICAgICAgICAgICAgICAgICRodHRwLnBvc3QoJy9hcGkvY2xpZW50L2NsX2lkJywge1xuICAgICAgICAgICAgICAgICAgICAvKiBQT1NUIHZhcmlhYmxlcyBoZXJlICovXG4gICAgICAgICAgICAgICAgICAgIGNsX2lkOiAkc3RhdGVQYXJhbXMuY2xfaWRcbiAgICAgICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeS51cGRhdGUgPSBmdW5jdGlvbiAoY2xfanNvbmIpIHtcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKFxuICAgICAgICAgICAgICAgICRodHRwLnBvc3QoJy9hcGkvY2xpZW50L3VwZGF0ZScsIHtcbiAgICAgICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgICAgICBjbF9pZDogJHN0YXRlUGFyYW1zLmNsX2lkLFxuICAgICAgICAgICAgICAgICAgICBjbF9qc29uYjogY2xfanNvbmJcbiAgICAgICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeS5nZXRDb3VudHJpZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9ICRodHRwLmpzb25wKCdodHRwOi8vYXBpLmdlb25hbWVzLm9yZy9jb3VudHJ5SW5mb0pTT04/dXNlcm5hbWU9YWxlamFuZHJvbHNjYSZjYWxsYmFjaz1KU09OX0NBTExCQUNLJylcbiAgICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkuZ2V0U3RhdGVzID0gZnVuY3Rpb24gKGNsX2NvdW50cnkpIHtcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gJGh0dHAuanNvbnAoJ2h0dHA6Ly9hcGkuZ2VvbmFtZXMub3JnL2NoaWxkcmVuSlNPTj9nZW9uYW1lSWQ9JyArIGNsX2NvdW50cnkgKyAnJnVzZXJuYW1lPWFsZWphbmRyb2xzY2EmY2FsbGJhY2s9SlNPTl9DQUxMQkFDSycpXG4gICAgICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICBmYWN0b3J5LmdldENpdHlDb3VudHkgPSBmdW5jdGlvbiAoY2xfc3RhdGUpIHtcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gJGh0dHAuanNvbnAoJ2h0dHA6Ly9hcGkuZ2VvbmFtZXMub3JnL2NoaWxkcmVuSlNPTj9nZW9uYW1lSWQ9JyArIGNsX3N0YXRlICsgJyZ1c2VybmFtZT1hbGVqYW5kcm9sc2NhJmNhbGxiYWNrPUpTT05fQ0FMTEJBQ0snKVxuICAgICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGZhY3Rvcnk7XG4gICAgfV07XG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKGFuZ3VsYXIpe1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBcbiAgICByZXR1cm4gYW5ndWxhci5tb2R1bGUoJ2FwcC5jbGllbnQudXBkYXRlJyxbXSlcblxuICAgIC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLFxuICAgIGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcbiAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2NsaWVudFVwZGF0ZScsIHtcbiAgICAgICAgICAgIHVybDonL2NsaWVudC91cGRhdGUvOmNsX2lkJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsIDogJ2FwcC9jbGllbnQvbW9kdWxlcy9jbGllbnQudXBkYXRlL2NsaWVudC51cGRhdGUudmlldy5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXIgOiAnY2xpZW50VXBkYXRlQ3RybCcsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgcmVxdWlyZXNMb2dpbjogdHJ1ZVxuICAgICAgICAgICAgfSAgICBcbiAgICAgICAgfSk7XG4gICAgfV0pXG5cbiAgICAuZmFjdG9yeSgnY2xpZW50VXBkYXRlRmFjJyxyZXF1aXJlKCcuL2NsaWVudC51cGRhdGUuZmFjJykpXG5cbiAgICAuY29udHJvbGxlcignY2xpZW50VXBkYXRlQ3RybCcscmVxdWlyZSgnLi9jbGllbnQudXBkYXRlLmN0cmwnKSlcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIiA6IFwiYWN0dWFsaXphciBjbGllbnRlXCIsXG4gICAgICAgICAgICAgICAgfSIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgcmV0dXJuIFsnJHNjb3BlJywgJ2hvbWVGYWMnLCAnYXV0aFNlcnZpY2UnLFxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCBob21lRmFjLCBhdXRoU2VydmljZSkge1xuICAgICAgICAgICAgJHNjb3BlLmF1dGhTZXJ2aWNlID0gYXV0aFNlcnZpY2U7XG4gICAgICAgIH1dO1xuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRodHRwJywgJyRxJywgIGZ1bmN0aW9uICgkaHR0cCwgJHEpIHtcbiAgICAgICAgdmFyIGZhY3RvcnkgPSB7fTtcbiAgICAgICAgZmFjdG9yeS5nZXRMb2dpbiA9IGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KCdtb2R1bGVzL2hvbWUvaG9tZU1vZGVsLnBocCcsIHtcbiAgICAgICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZmFjdG9yeTtcbiAgICB9XTtcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oYW5ndWxhcil7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIFxuICAgIHJldHVybiBhbmd1bGFyLm1vZHVsZSgnYXBwLmhvbWUnLFtdKVxuXG4gICAgLmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsXG4gICAgZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnaG9tZScsIHtcbiAgICAgICAgICAgIHVybDonL2hvbWUnLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmwgOiAnYXBwL2hvbWUvaG9tZS52aWV3Lmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlciA6ICdob21lQ3RybCcsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgcmVxdWlyZXNMb2dpbjogdHJ1ZVxuICAgICAgICAgICAgfSAgICBcbiAgICAgICAgfSk7XG4gICAgfV0pXG5cbiAgICAuZmFjdG9yeSgnaG9tZUZhYycscmVxdWlyZSgnLi9ob21lLmZhYycpKVxuXG4gICAgLmNvbnRyb2xsZXIoJ2hvbWVDdHJsJyxyZXF1aXJlKCcuL2hvbWUuY3RybCcpKVxuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiIDogXCJpbmljaW9cIixcbiAgICAgICAgICAgICAgICAgICAgXCJ3ZWxjb21lXCIgOiBcImJpZW52ZW5pZG8gQEAhXCJcbiAgICAgICAgICAgICAgICB9IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oYW5ndWxhcil7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIFxuICAgIHJldHVybiBhbmd1bGFyLm1vZHVsZSgnYXBwLmluaycsW1xuICAgICAgICByZXF1aXJlKCcuL21vZHVsZXMvaW5rLmFkZCcpLm5hbWUsXG4gICAgICAgIHJlcXVpcmUoJy4vbW9kdWxlcy9pbmsudXBkYXRlJykubmFtZVxuICAgIF0pXG5cbiAgICAuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJyxcbiAgICBmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdpbmsnLCB7XG4gICAgICAgICAgICB1cmw6Jy9pbmsnLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmwgOiAnYXBwL2luay9pbmsudmlldy5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXIgOiAnaW5rQ3RybCcsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgcmVxdWlyZXNMb2dpbjogdHJ1ZVxuICAgICAgICAgICAgfSAgICBcbiAgICAgICAgfSk7XG4gICAgfV0pXG5cbiAgICAuZmFjdG9yeSgnaW5rRmFjJyxyZXF1aXJlKCcuL2luay5mYWMnKSlcblxuICAgIC5jb250cm9sbGVyKCdpbmtDdHJsJyxyZXF1aXJlKCcuL2luay5jdHJsJykpXG4gICAgXG59KShhbmd1bGFyKTtcbiIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgcmV0dXJuIFsnJHNjb3BlJywgJ2lua0ZhYycsICdpMThuRmlsdGVyJyxcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgaW5rRmFjLCBpMThuRmlsdGVyKSB7XG5cbiAgICAgICAgICAgICRzY29wZS5sYWJlbHMgPSBPYmplY3Qua2V5cyhpMThuRmlsdGVyKFwiaW5rLmxhYmVsc1wiKSk7XG4gICAgICAgICAgICAkc2NvcGUuY29sdW1ucyA9IGkxOG5GaWx0ZXIoXCJpbmsuY29sdW1uc1wiKTtcbiAgICAgICAgXG4gICAgICAgICAgICAvLyBmb3JtYXRJdGVtIGV2ZW50IGhhbmRsZXJcbiAgICAgICAgICAgIHZhciBpbl9pZDtcbiAgICAgICAgICAgICRzY29wZS5mb3JtYXRJdGVtID0gZnVuY3Rpb24gKHMsIGUsIGNlbGwpIHtcblxuICAgICAgICAgICAgICAgIGlmIChlLnBhbmVsLmNlbGxUeXBlID09IHdpam1vLmdyaWQuQ2VsbFR5cGUuUm93SGVhZGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGUuY2VsbC50ZXh0Q29udGVudCA9IGUucm93ICsgMTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBzLnJvd3MuZGVmYXVsdFNpemUgPSAzMDtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIGFkZCBCb290c3RyYXAgaHRtbFxuICAgICAgICAgICAgICAgIGlmICgoZS5wYW5lbC5jZWxsVHlwZSA9PSB3aWptby5ncmlkLkNlbGxUeXBlLkNlbGwpICYmIChlLmNvbCA9PSAwKSkge1xuICAgICAgICAgICAgICAgICAgICBpbl9pZCA9IGUucGFuZWwuZ2V0Q2VsbERhdGEoZS5yb3csIDEsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgZS5jZWxsLnN0eWxlLm92ZXJmbG93ID0gJ3Zpc2libGUnO1xuICAgICAgICAgICAgICAgICAgICBlLmNlbGwuaW5uZXJIVE1MID0gJzxkaXYgY2xhc3M9XCJidG4tZ3JvdXAgYnRuLWdyb3VwLWp1c3RpZmllZFwiIHJvbGU9XCJncm91cFwiIGFyaWEtbGFiZWw9XCIuLi5cIj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidG4tZ3JvdXBcIiByb2xlPVwiZ3JvdXBcIj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiIy9pbmsvdXBkYXRlLycrIGluX2lkICsgJ1wiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0IGJ0bi14c1wiIG5nLWNsaWNrPVwiZWRpdCgkaXRlbS5pbl9pZClcIj5FZGl0YXI8L2E+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+JztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAgICAgLy8gYmluZCBjb2x1bW5zIHdoZW4gZ3JpZCBpcyBpbml0aWFsaXplZFxuICAgICAgICAgICAgJHNjb3BlLmluaXRHcmlkID0gZnVuY3Rpb24gKHMsIGUpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8ICRzY29wZS5sYWJlbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbCA9IG5ldyB3aWptby5ncmlkLkNvbHVtbigpO1xuICAgICAgICAgICAgICAgICAgICBjb2wuYmluZGluZyA9ICRzY29wZS5jb2x1bW5zW2ldO1xuICAgICAgICAgICAgICAgICAgICBjb2wuaGVhZGVyID0gaTE4bkZpbHRlcihcImluay5sYWJlbHMuXCIgKyAkc2NvcGUubGFiZWxzW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgY29sLndvcmRXcmFwID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGNvbC53aWR0aCA9IDE1MDtcbiAgICAgICAgICAgICAgICAgICAgcy5jb2x1bW5zLnB1c2goY29sKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgLy8gY3JlYXRlIHRoZSB0b29sdGlwIG9iamVjdFxuICAgICAgICAgICAgJHNjb3BlLiR3YXRjaCgnZ2dHcmlkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICgkc2NvcGUuZ2dHcmlkKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAvLyBzdG9yZSByZWZlcmVuY2UgdG8gZ3JpZFxuICAgICAgICAgICAgICAgICAgICB2YXIgZmxleCA9ICRzY29wZS5nZ0dyaWQ7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY3JlYXRlIHRvb2x0aXBcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRpcCA9IG5ldyB3aWptby5Ub29sdGlwKCksXG4gICAgICAgICAgICAgICAgICAgICAgICBybmcgPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIG1vbml0b3IgdGhlIG1vdXNlIG92ZXIgdGhlIGdyaWRcbiAgICAgICAgICAgICAgICAgICAgZmxleC5ob3N0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaHQgPSBmbGV4LmhpdFRlc3QoZXZ0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaHQucmFuZ2UuZXF1YWxzKHJuZykpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG5ldyBjZWxsIHNlbGVjdGVkLCBzaG93IHRvb2x0aXBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaHQuY2VsbFR5cGUgPT0gd2lqbW8uZ3JpZC5DZWxsVHlwZS5DZWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJuZyA9IGh0LnJhbmdlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29sID0gZmxleC5jb2x1bW5zW3JuZy5jb2xdLmhlYWRlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNlbGxFbGVtZW50ID0gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludChldnQuY2xpZW50WCwgZXZ0LmNsaWVudFkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2VsbEJvdW5kcyA9IHdpam1vLlJlY3QuZnJvbUJvdW5kaW5nUmVjdChjZWxsRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhID0gd2lqbW8uZXNjYXBlSHRtbChmbGV4LmdldENlbGxEYXRhKHJuZy5yb3csIHJuZy5jb2wsIHRydWUpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpcENvbnRlbnQgPSBjb2wgKyAnOiBcIjxiPicgKyBkYXRhICsgJzwvYj5cIic7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjZWxsRWxlbWVudC5jbGFzc05hbWUuaW5kZXhPZignd2otY2VsbCcpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpcC5zaG93KGZsZXguaG9zdEVsZW1lbnQsIHRpcENvbnRlbnQsIGNlbGxCb3VuZHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlwLmhpZGUoKTsgLy8gY2VsbCBtdXN0IGJlIGJlaGluZCBzY3JvbGwgYmFyLi4uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBmbGV4Lmhvc3RFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3V0JywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGlwLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJuZyA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkc2NvcGUuJG9uKCckdmlld0NvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgLy8gdGhpcyBjb2RlIGlzIGV4ZWN1dGVkIGFmdGVyIHRoZSB2aWV3IGlzIGxvYWRlZFxuICAgICAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpbmtGYWMuZGF0YSgpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZGF0YSA9IG5ldyB3aWptby5jb2xsZWN0aW9ucy5Db2xsZWN0aW9uVmlldyhwcm9taXNlLmRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfV07XG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgcmV0dXJuIFsnJGh0dHAnLCAnJHEnLCAgZnVuY3Rpb24gKCRodHRwLCAkcSkge1xuICAgICAgICB2YXIgZmFjdG9yeSA9IHt9O1xuICAgICAgICBmYWN0b3J5LmRhdGEgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KCdtb2R1bGVzL2luay9pbmsubWRsLmdldGlua3MucGhwJywge1xuICAgICAgICAgICAgICAgICAgICAvKiBQT1NUIHZhcmlhYmxlcyBoZXJlICovXG4gICAgICAgICAgICAgICAgICAgIHByb2NjZXNfaWQ6IG5ldyBEYXRlKCkuZ2V0TWlsbGlzZWNvbmRzKClcbiAgICAgICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGZhY3Rvcnk7XG4gICAgfV07XG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCIgOiBcIlRpbnRhc1wiLFxuICAgICAgICAgICAgICAgICAgICBcImxhYmVsc1wiOntcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaW4taWRcIjogXCJJRCB0aW50YVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdS1pZFwiOiBcIklEIHByb3ZlZWRvclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpbi1jb2RlXCI6IFwiQ29kaWdvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImluLXR5cGVcIjogXCJUaXBvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImluLWRlc2NyaXB0aW9uXCI6IFwiRGVzY3JpcGNpb25cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaW4tcHJpY2VcIjogXCJQcmVjaW9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaW4tc3RhdHVzXCI6IFwiRXN0YXR1c1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpbi1kYXRlXCI6IFwiRmVjaGFcIlxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBcImNvbHVtbnNcIjpbXG4gICAgICAgICAgICAgICAgICAgICAgICBcImluX2lkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN1X2lkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImluX2NvZGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaW5fdHlwZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpbl9kZXNjcmlwdGlvblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpbl9wcmljZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpbl9zdGF0dXNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaW5fZGF0ZVwiXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICBcImZpZWxkc1wiIDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5fdHlwZW9wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIk9mZnNldFwiLFwidmFsdWVcIjpcIm9mZnNldFwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiRmxleG9cIixcInZhbHVlXCI6XCJmbGV4b1wifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiSW5ramV0IHNvbHZlbnRlXCIsXCJ2YWx1ZVwiOlwiaW5ramV0X3NvbHZlbnRcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIklua2pldCBVVlwiLFwidmFsdWVcIjpcImlua2pldF91dlwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiU2VyaWdyYWbDrWFcIixcInZhbHVlXCI6XCJzZXJpZ3JhcGh5XCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJWaW5pbFwiLFwidmFsdWVcIjpcInZpbnlsXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJUb25lclwiLFwidmFsdWVcIjpcInRvbmVyXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJTZWxsb1wiLFwidmFsdWVcIjpcInNlYWxcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIk90aGVyXCIsXCJ2YWx1ZVwiOlwib3Ryb3NcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5fc3RhdHVzb3B0aW9ucyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiQWN0aXZvXCIsXCJ2YWx1ZVwiOlwiQVwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiSW5hY3Rpdm9cIixcInZhbHVlXCI6XCJJXCJ9XG4gICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKGFuZ3VsYXIpe1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBcbiAgICByZXR1cm4gYW5ndWxhci5tb2R1bGUoJ2FwcC5pbmsuYWRkJyxbXSlcblxuICAgIC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLFxuICAgIGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcbiAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2lua0FkZCcsIHtcbiAgICAgICAgICAgIHVybDonL2luay9hZGQnLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmwgOiAnYXBwL2luay9tb2R1bGVzL2luay5hZGQvaW5rLmFkZC52aWV3Lmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlciA6ICdpbmtBZGRDdHJsJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICByZXF1aXJlc0xvZ2luOiB0cnVlXG4gICAgICAgICAgICB9ICAgIFxuICAgICAgICB9KTtcbiAgICB9XSlcblxuICAgIC5mYWN0b3J5KCdpbmtBZGRGYWMnLHJlcXVpcmUoJy4vaW5rLmFkZC5mYWMnKSlcblxuICAgIC5jb250cm9sbGVyKCdpbmtBZGRDdHJsJyxyZXF1aXJlKCcuL2luay5hZGQuY3RybCcpKVxuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRzY29wZScsICdpbmtBZGRGYWMnLCAnJGxvY2F0aW9uJywgJ2kxOG5GaWx0ZXInLFxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCBpbmtBZGRGYWMsICRsb2NhdGlvbiwgaTE4bkZpbHRlcikge1xuICAgICAgICAgICAgJHNjb3BlLmZtRGF0YSA9IHt9O1xuXG4gICAgICAgICAgICAkc2NvcGUub25TdWJtaXQgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICBpbmtBZGRGYWMuYWRkKCRzY29wZS5mbURhdGEpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb21pc2UuZGF0YSA9PSBcIjFcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9pbmsnKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS51cGRhdGVGYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgJHNjb3BlLmluX3N0YXR1c29wdGlvbnMgPSBpMThuRmlsdGVyKFwiaW5rLmZpZWxkcy5pbl9zdGF0dXNvcHRpb25zXCIpO1xuICAgICAgICAgICAgJHNjb3BlLmluX3R5cGVvcHRpb25zID0gaTE4bkZpbHRlcihcImluay5maWVsZHMuaW5fdHlwZW9wdGlvbnNcIik7XG5cbiAgICAgICAgICAgICRzY29wZS4kb24oJyR2aWV3Q29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAvLyB0aGlzIGNvZGUgaXMgZXhlY3V0ZWQgYWZ0ZXIgdGhlIHZpZXcgaXMgbG9hZGVkXG4gICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpbmtBZGRGYWMuZ2V0U3VwcGxpZXJzKCkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5zdV9pZG9wdGlvbnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChwcm9taXNlLmRhdGEsIGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wdXNoKHsgXCJsYWJlbFwiOiB2YWx1ZS5zdV9jb3Jwb3JhdGVuYW1lLCBcInZhbHVlXCI6IHZhbHVlLnN1X2lkIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgJHNjb3BlLnN1X2lkb3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyRzY29wZS51cGRhdGVGYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfV07XG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgcmV0dXJuIFsnJGh0dHAnLCAnJHEnLCAgJyRzdGF0ZVBhcmFtcycsIGZ1bmN0aW9uICgkaHR0cCwgJHEsICRzdGF0ZVBhcmFtcykge1xuICAgICAgICB2YXIgZmFjdG9yeSA9IHt9O1xuICAgICAgICBmYWN0b3J5LmFkZCA9IGZ1bmN0aW9uIChpbl9qc29uYikge1xuICAgICAgICAgICAgdmFyIHByb21pc2UgPSAkaHR0cC5wb3N0KCdtb2R1bGVzL2luay9tb2R1bGVzL2luay5hZGQvaW5rLmFkZC5tZGwuYWRkLnBocCcsIHtcbiAgICAgICAgICAgICAgICAvKiBQT1NUIHZhcmlhYmxlcyBoZXJlICovXG4gICAgICAgICAgICAgICAgaW5fanNvbmI6IGluX2pzb25iXG4gICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICBmYWN0b3J5LmdldFN1cHBsaWVycyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gJGh0dHAuZ2V0KCdtb2R1bGVzL2luay9tb2R1bGVzL2luay5hZGQvaW5rLmFkZC5tZGwuZ2V0U3VwcGxpZXJzLnBocCcpXG4gICAgICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZmFjdG9yeTtcbiAgICB9XTtcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIiA6IFwiYWdyZWdhciB0aW50YVwiLFxuICAgICAgICAgICAgICAgIH0iLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbihhbmd1bGFyKXtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgXG4gICAgcmV0dXJuIGFuZ3VsYXIubW9kdWxlKCdhcHAuaW5rLnVwZGF0ZScsW10pXG5cbiAgICAuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJyxcbiAgICBmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdpbmtVcGRhdGUnLCB7XG4gICAgICAgICAgICB1cmw6Jy9pbmsvdXBkYXRlLzppbl9pZCcsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybCA6ICdhcHAvaW5rL21vZHVsZXMvaW5rLnVwZGF0ZS9pbmsudXBkYXRlLnZpZXcuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyIDogJ2lua1VwZGF0ZUN0cmwnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHJlcXVpcmVzTG9naW46IHRydWVcbiAgICAgICAgICAgIH0gICAgXG4gICAgICAgIH0pO1xuICAgIH1dKVxuXG4gICAgLmZhY3RvcnkoJ2lua1VwZGF0ZUZhYycscmVxdWlyZSgnLi9pbmsudXBkYXRlLmZhYycpKVxuXG4gICAgLmNvbnRyb2xsZXIoJ2lua1VwZGF0ZUN0cmwnLHJlcXVpcmUoJy4vaW5rLnVwZGF0ZS5jdHJsJykpXG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgcmV0dXJuIFsnJHNjb3BlJywgJ2lua1VwZGF0ZUZhYycsICckbG9jYXRpb24nLCAnaTE4bkZpbHRlcicsXG4gICAgICAgIGZ1bmN0aW9uICgkc2NvcGUsIGlua1VwZGF0ZUZhYywgJGxvY2F0aW9uLCBpMThuRmlsdGVyKSB7XG5cbiAgICAgICAgICAgICRzY29wZS5vblN1Ym1pdCA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgIGlua1VwZGF0ZUZhYy51cGRhdGUoJHNjb3BlLmZtRGF0YSkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocHJvbWlzZS5kYXRhID09IFwiMVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2luaycpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnVwZGF0ZUZhaWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAkc2NvcGUuaW5fc3RhdHVzb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJpbmsuZmllbGRzLmluX3N0YXR1c29wdGlvbnNcIik7XG4gICAgICAgICAgICAkc2NvcGUuaW5fdHlwZW9wdGlvbnMgPSBpMThuRmlsdGVyKFwiaW5rLmZpZWxkcy5pbl90eXBlb3B0aW9uc1wiKTtcblxuICAgICAgICAgICAgJHNjb3BlLiRvbignJHZpZXdDb250ZW50TG9hZGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIC8vIHRoaXMgY29kZSBpcyBleGVjdXRlZCBhZnRlciB0aGUgdmlldyBpcyBsb2FkZWRcbiAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgaW5rVXBkYXRlRmFjLmRhdGEoKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzT2JqZWN0KGFuZ3VsYXIuZnJvbUpzb24ocHJvbWlzZS5kYXRhKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5mbURhdGEgPSBhbmd1bGFyLmZyb21Kc29uKHByb21pc2UuZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5rVXBkYXRlRmFjLmdldFN1cHBsaWVycygpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5zdV9pZG9wdGlvbnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2gocHJvbWlzZS5kYXRhLCBmdW5jdGlvbiAodmFsdWUsIGtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnB1c2goeyBcImxhYmVsXCI6IHZhbHVlLnN1X2NvcnBvcmF0ZW5hbWUsIFwidmFsdWVcIjogdmFsdWUuc3VfaWQgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgJHNjb3BlLnN1X2lkb3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vJHNjb3BlLnVwZGF0ZUZhaWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1dO1xuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRodHRwJywgJyRxJywgICckc3RhdGVQYXJhbXMnLCBmdW5jdGlvbiAoJGh0dHAsICRxLCAkc3RhdGVQYXJhbXMpIHtcbiAgICAgICAgdmFyIGZhY3RvcnkgPSB7fTtcbiAgICAgICAgZmFjdG9yeS5kYXRhID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoXG4gICAgICAgICAgICAgICAgJGh0dHAucG9zdCgnbW9kdWxlcy9pbmsvbW9kdWxlcy9pbmsudXBkYXRlL2luay51cGRhdGUubWRsLmdldGluay5waHAnLCB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICAgICAgaW5faWQ6ICRzdGF0ZVBhcmFtcy5pbl9pZFxuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICBmYWN0b3J5LnVwZGF0ZSA9IGZ1bmN0aW9uIChpbl9qc29uYikge1xuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoXG4gICAgICAgICAgICAgICAgJGh0dHAucG9zdCgnbW9kdWxlcy9pbmsvbW9kdWxlcy9pbmsudXBkYXRlL2luay51cGRhdGUubWRsLnVwZGF0ZS5waHAnLCB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICAgICAgaW5faWQ6ICRzdGF0ZVBhcmFtcy5pbl9pZCxcbiAgICAgICAgICAgICAgICAgICAgaW5fanNvbmI6IGluX2pzb25iXG4gICAgICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkuZ2V0U3VwcGxpZXJzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHByb21pc2UgPSAkaHR0cC5nZXQoJ21vZHVsZXMvaW5rL21vZHVsZXMvaW5rLmFkZC9pbmsuYWRkLm1kbC5nZXRTdXBwbGllcnMucGhwJylcbiAgICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBmYWN0b3J5O1xuICAgIH1dO1xuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiIDogXCJhY3R1YWxpemFyIHRpbnRhXCIsXG4gICAgICAgICAgICAgICAgfSIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgcmV0dXJuIFsnJHJvb3RTY29wZScsXG4gICAgICAgIGZ1bmN0aW9uICgkcm9vdFNjb3BlKSB7XG5cbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoaW5wdXQsIHBhcmFtKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRyYW5zbGF0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAgICAgXCJlcy1NWFwiOiByZXF1aXJlKCcuL2xhbmcubG9jYWxlLmVzLU1YJyksXG4gICAgICAgICAgICAgICAgICAgIFwiZW4tVVNcIjogcmVxdWlyZSgnLi9sYW5nLmxvY2FsZS5lbi1VUycpXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB2YXIgY3VycmVudExhbmd1YWdlID0gJHJvb3RTY29wZS5jdXJyZW50TGFuZ3VhZ2UgfHwgJ2VzLU1YJyxcbiAgICAgICAgICAgICAgICAgICAga2V5cyA9IGlucHV0LnNwbGl0KCcuJyksXG4gICAgICAgICAgICAgICAgICAgIGRhdGEgPSB0cmFuc2xhdGlvbnNbY3VycmVudExhbmd1YWdlXSxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIGtleXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEgPSBkYXRhW2tleXNba2V5XV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKCEhZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICh0eXBlb2YgcGFyYW0gPT09IFwidW5kZWZpbmVkXCIpID8gZGF0YSA6IGRhdGEucmVwbGFjZSgnQEAnLCBwYXJhbSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaW5wdXQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZS5kZXNjcmlwdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpbnB1dDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfV07XG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAgICAgICAgICAgICBcIkdFTkVSQUxcIjp7XG4gICAgICAgICAgICAgICAgICAgIFwiTkFWXCI6W1xuICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOlwiSG9tZVwiLFwidXJsXCI6XCIjL2hvbWVcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6XCJDbGllbnRlc1wiLFwidXJsXCI6XCIjL2NsaWVudFwiLFwic3ViTWVudVwiOiBcbiAgICAgICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcIm5hbWVcIjogXCJBZ3JlZ2FyXCIsXCJ1cmxcIjogXCIjL2NsaWVudC9hZGRcIn1cbiAgICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOlwiUHJvZHVjdHNcIixcInVybFwiOlwiIy9wcm9kdWN0XCIsXCJzdWJNZW51XCI6IFxuICAgICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOiBcIkFkZFwiLFwidXJsXCI6IFwiIy9wcm9kdWN0L2FkZFwifVxuICAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6XCJXb3JrIE9yZGVyc1wiLFwidXJsXCI6XCIjL3dvXCIsXCJzdWJNZW51XCI6IFxuICAgICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOiBcIkFkZFwiLFwidXJsXCI6IFwiIy93by9hZGRcIn1cbiAgICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOlwiVXNlcnNcIixcInVybFwiOlwiIy91c2VyXCIsXCJzdWJNZW51XCI6IFxuICAgICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOiBcIkFkZFwiLFwidXJsXCI6IFwiIy91c2VyL2FkZFwifVxuICAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6XCJMb2dpblwiLFwidXJsXCI6XCIjL1wifSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcIm5hbWVcIjpcIlJlcG9ydHNcIixcInVybFwiOlwiIy9yZXBvcnRzXCIsXCJzdWJNZW51XCI6IFxuICAgICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6IFwic3ViMVwiLFwidXJsXCI6IFwiLi4vbG9naW5cIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOiBcInN1YjJcIixcInVybFwiOiBcIi4uL2xvZ2luXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcIm5hbWVcIjogXCJzdWIzXCIsXCJ1cmxcIjogXCIuLi9sb2dpblwifVxuICAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgXCJCVVRUT05TXCI6e1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJFRElUXCI6XCJFZGl0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkRVUExJQ0FURVwiOlwiRHVwbGljYXRlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIldPXCI6XCJXb3JrIE9yZGVyXCIsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIFwiU1VCTUlUXCI6XCJTdWJtaXRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJDT1BZUklHSFRcIjpcIsKpMjAxNCBHcnVwbyBHcmFmaWNvIGRlIE3DqXhpY28gUy5BLiBkZSBDLlYuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwiSE9NRVwiOntcbiAgICAgICAgICAgICAgICAgICAgXCJUSVRMRVwiIDogXCJIb21lXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiV0VMQ09NRVwiIDogXCJXZWxjb21lIEBAIVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBcIkNMSUVOVFwiOntcbiAgICAgICAgICAgICAgICAgICAgXCJUSVRMRVwiIDogXCJDbGllbnRlc1wiLFxuICAgICAgICAgICAgICAgICAgICBcIkZJRUxEU1wiOntcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiQ0xfSURcIjpcIkNsaWVudCBJRFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJDTF9DT1JQT1JBVEVOQU1FXCI6XCJDb3Jwb3JhdGUgTmFtZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJDTF9USU5cIjpcIlRJTlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJDTF9OQU1FXCI6XCJOYW1lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkNMX0ZBVEhFUlNMQVNUTkFNRVwiOlwiRmF0aGVycyBMYXN0bmFtZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJDTF9NT1RIRVJTTEFTVE5BTUVcIjpcIk1vdGhlcnMgTGFzdG5hbWVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiQ0xfU1RSRUVUXCI6XCJTdHJlZXRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiQ0xfU1RSRUVUTlVNQkVSXCI6XCJTdHJlZXQgTnVtYmVyXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkNMX1NVSVRFTlVNQkVSXCI6XCJTdWl0ZSBOdW1iZXJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiQ0xfTkVJR0hCT1JIT09EXCI6XCJOZWlnaGJvcmhvb2RcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiQ0xfQUREUkVTU1JFRkVSRU5DRVwiOlwiQWRkcmVzcyBSZWZlcmVuY2VcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiQ0xfQ09VTlRSWVwiOlwiQ291bnRyeVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJDTF9TVEFURVwiOlwiU3RhdGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiQ0xfQ0lUWVwiOlwiQ2l0eVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJDTF9DT1VOVFlcIjpcIkNvdW50eVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJDTF9aSVBDT0RFXCI6XCJaaXAgQ29kZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJDTF9FTUFJTFwiOlwiRS1tYWlsXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkNMX1BIT05FXCI6XCJQaG9uZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJDTF9NT0JJTEVcIjpcIk1vYmlsZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJDTF9DUkVESVRMSU1JVFwiOlwiQ3JlZGl0IExpbWl0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkNMX0NVU1RPTUVSRElTQ09VTlRcIjpcIkRpc2NvdW50XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkNMX1NUQVRVU1wiOlwiU3RhdHVzXCIsXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwiQ0xJRU5UX0FERFwiOntcbiAgICAgICAgICAgICAgICAgICAgXCJUSVRMRVwiIDogXCJBZGQgQ2xpZW50XCIsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBcIkNMSUVOVF9VUERBVEVcIjp7XG4gICAgICAgICAgICAgICAgICAgIFwiVElUTEVcIiA6IFwiVXBkYXRlIENsaWVudFwiLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXCJVU0VSXCI6e1xuICAgICAgICAgICAgICAgICAgICBcIlRJVExFXCIgOiBcIlVzZXJzXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiRklFTERTXCI6e1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJVU19JRFwiOiBcIlVzZXIgSURcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiR1JfSURcIjogXCJHcm91cCBJRFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJVU19VU0VSXCI6IFwiVXNlclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJVU19QQVNTV09SRFwiOiBcIlBhc3N3b3JkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlVTX05BTUVcIjogXCJOYW1lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlVTX0ZBVEhFUlNMQVNUTkFNRVwiOiBcIkZhdGhlcnMgTGFzdG5hbWVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiVVNfTU9USEVSU0xBU1ROQU1FXCI6IFwiTW90aGVycyBMYXN0bmFtZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJVU19FTUFJTFwiOiBcIkUtbWFpbFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJVU19QSE9ORVwiOiBcIlBob25lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlVTX01PQklMRVwiOiBcIk1vYmlsZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJVU19TVEFUVVNcIjogXCJTdGF0dXNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiVVNfREFURVwiOiBcIkRhdGVcIlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBcIlVTRVJfQUREXCI6e1xuICAgICAgICAgICAgICAgICAgICBcIlRJVExFXCIgOiBcIkFkZCBVc2VyXCIsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBcIlVTRVJfVVBEQVRFXCI6e1xuICAgICAgICAgICAgICAgICAgICBcIlRJVExFXCIgOiBcIlVwZGF0ZSBVc2VyXCIsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBcIldPXCI6e1xuICAgICAgICAgICAgICAgICAgICBcIlRJVExFXCIgOiBcIldvcmsgT3JkZXJzXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiRklFTERTXCI6e1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJXT19JRFwiIDogXCJPcmRlciBOby5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiV09fREFURVwiIDogXCJEYXRlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkNMX0lEXCIgOiBcIkNsaWVudCBJRFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJaT19JRFwiIDogXCJab25lIElEXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIldPX09SREVSRURCWVwiIDogXCJPcmRlcmVkIEJ5XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIldPX0FUVEVOVElPTlwiIDogXCJBdHRlbnRpb25cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiV09fUkZRXCIgOiBcIlJGUVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJXT19QUk9DRVNTXCIgOiBcIlByb2Nlc3NcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiV09fUkVMRUFTRVwiIDogXCJSZWxlYXNlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIldPX1BPXCIgOiBcIlB1cmNoYXNlIE9yZGVyXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIldPX0xJTkVcIiA6IFwiTGluZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJXT19MSU5FVE9UQUxcIiA6IFwiVG90YWwgTGluZXNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiUFJTRV9JRFwiIDogXCJQcm9kdWN0IElEXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIldPX1NUQVRVU1wiIDogXCJTdGF0dXNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiV09fQ09NTUlUTUVOVERBVEVcIiA6IFwiQ29tbWl0bWVudCBEYXRlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIldPX1BSRVZJT1VTSURcIiA6IFwiUHJldmlvdXMgSURcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiV09fUFJFVklPVVNEQVRFXCIgOiBcIlByZXZpb3VzIERhdGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiU0hfSURcIiA6IFwiU2hpcG1lbnQgSURcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiU0hfREFURVwiIDogXCJTaGlwbWVudCBEYXRlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIldPX1RSQUNLSU5HTk9cIiA6IFwiVHJhY2tpbmcgTm8uXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIldPX1NISVBQSU5HREFURVwiIDogXCJTaGlwcGluZyBEYXRlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIldPX0RFTElWRVJZREFURVwiIDogXCJEZWxpdmVyeSBEYXRlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIldPX0lOVk9JQ0VOT1wiIDogXCJJbnZvaWNlIE5vLlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJXT19JTlZPSUNFREFURVwiIDogXCJJbnZvaWNlIERhdGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiV09fTk9URVNcIiA6IFwiTm90ZXNcIlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBcIldPX0FERFwiOntcbiAgICAgICAgICAgICAgICAgICAgXCJUSVRMRVwiIDogXCJBZGQgV29yayBPcmRlclwiLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXCJXT19VUERBVEVcIjp7XG4gICAgICAgICAgICAgICAgICAgIFwiVElUTEVcIiA6IFwiVXBkYXRlIFdvcmsgT3JkZXJcIixcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwiQVVUSFwiOntcbiAgICAgICAgICAgICAgICAgICAgXCJUSVRMRVwiIDogXCJMb2dpblwiLFxuICAgICAgICAgICAgICAgICAgICBcIkVOVEVSUFJJU0VcIiA6IFwiRW50ZXJwcmlzZVwiLFxuICAgICAgICAgICAgICAgICAgICBcIlVTRVJcIiA6IFwiVXNlclwiLFxuICAgICAgICAgICAgICAgICAgICBcIlBBU1NXT1JEXCIgOiBcIlBhc3N3b3JkXCIsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgICAgICAgICAgICAgIFwiZ2VuZXJhbFwiOnsgXG4gICAgICAgICAgICAgICAgICAgIFwibmF2XCI6W1xuICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOlwiaW5pY2lvXCIsXCJ1cmxcIjpcIiMvaG9tZVwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcIm5hbWVcIjpcImNsaWVudGVzXCIsXCJ1cmxcIjpcIiMvY2xpZW50XCIsXCJzdWJtZW51XCI6IFxuICAgICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOiBcImFncmVnYXJcIixcInVybFwiOiBcIiMvY2xpZW50L2FkZFwifVxuICAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6XCJwcm9kdWN0b3NcIixcInVybFwiOlwiIy9wcm9kdWN0XCIsXCJzdWJtZW51XCI6IFxuICAgICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOiBcImFncmVnYXJcIixcInVybFwiOiBcIiMvcHJvZHVjdC9hZGRcIn1cbiAgICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOlwib3JkZW5lcyBkZSB0cmFiYWpvXCIsXCJ1cmxcIjpcIiMvd29cIixcInN1Ym1lbnVcIjogXG4gICAgICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6IFwiYWdyZWdhclwiLFwidXJsXCI6IFwiIy93by9hZGRcIn1cbiAgICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOlwidXN1YXJpb3NcIixcInVybFwiOlwiIy91c2VyXCIsXCJzdWJtZW51XCI6IFxuICAgICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOiBcImFncmVnYXJcIixcInVybFwiOiBcIiMvdXNlci9hZGRcIn1cbiAgICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOlwibG9naW5cIixcInVybFwiOlwiIy9cIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6XCJyZXBvcnRlc1wiLFwidXJsXCI6XCIjL3JlcG9ydHNcIixcInN1Ym1lbnVcIjogXG4gICAgICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6IFwic3ViMVwiLFwidXJsXCI6IFwiLi4vbG9naW5cIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcIm5hbWVcIjogXCJzdWIyXCIsXCJ1cmxcIjogXCIuLi9sb2dpblwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOiBcInN1YjNcIixcInVybFwiOiBcIi4uL2xvZ2luXCJ9XG4gICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICBcImxhYmVsc1wiOntcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYWRkXCI6XCJBZ3JlZ2FyXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImVkaXRcIjpcImVkaXRhclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJkdXBsaWNhdGVcIjpcImR1cGxpY2FyXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInNob3dcIjpcIm1vc3RyYXJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3VibWl0XCI6XCJFbnZpYXJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xvc2VcIjpcIkNlcnJhclwiLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBcInJlZ2V4cFwiOntcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic2luZ2xlc3BhY2VzXCI6IFwic2luIGVzcGFjaW9zIGRvYmxlcyBuaSBjYXJhY3RlcmVzIGVzcGVjaWFsZXMuXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInBhcGVyY29kZVwiOiBcInNpbiBlc3BhY2lvcyBuaSBjYXJhY3RlcmVzIGVzcGVjaWFsZXNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaW5rY29kZVwiOiBcInNpbiBlc3BhY2lvcyBuaSBjYXJhY3RlcmVzIGVzcGVjaWFsZXNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibWFjaGluZXRvdGFsaW5rc1wiOiBcIm1pbmltbyAxIG1heGltbyA4XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJmY1wiOiBcIlhYWFgtIyMjIyMjWy1YWFhdXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImVtYWlsXCI6IFwicG9yIGZhdm9yIGludHJvZHV6Y2EgdW4gZW1haWwgdmFsaWRvLlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJkZWNpbWFsXCI6IFwibnVtZXJvIHkgZGUgMiBhIDUgZGVjaW1hbGVzICgjLiMjWyMjI10pXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImRpc2NvdW50XCI6IFwiY2VybyBtYXMgMiBkZWNpbWFsZXMgKDAuIyMpXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImludGVnZXJcIjogXCJzb2xvIG51bWVyb3MgZW50ZXJvc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ6aXBjb2RlXCI6IFwiZWwgY29kaWdvIHBvc3RhbCBlcyBkZSA1IG51bWVyb3MuXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImRhdGVcIjogXCJhYWFhLW1tLWRkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInVzZXJcIjogXCJkZSA0IGEgMTYgY2FyYWN0ZXJlcyBzaW4gZXNwYWNpb3MgbmkgY2FyYWN0ZXJlcyBlc3BlY2lhbGVzLlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwYXNzd29yZFwiOiBcImxhIGNvbnRyYXNlw7FhIGRlYmUgY29udGVuZXIgZGUgOC0xNiBjYXJhY3RlcmVzLCBwb3IgbG8gbWVub3MgdW5hIGxldHJhIG1heXVzY3VsYSwgdW5hIGxldHJhIG1pbnVzY3VsYSB5IHVuIGRpZ2l0by5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicGhvbmVcIjogXCJzb2xvIHVzZSBlbCBzaW1ib2xvICsgYWwgcHJpbmNpcGlvIHkgbnVtZXJvcyBkZWwgMCBhbCA5XCJcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgXCJjb3B5cmlnaHRcIjpcIsKpMjAxNCBncnVwbyBncmFmaWNvIGRlIG3DqXhpY28gcy5hLiBkZSBjLnYuIHRvZG9zIGxvcyBkZXJlY2hvcyByZXNlcnZhZG9zLlwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgIEhPTUUgXG4gICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbiAgICAgICAgICAgICAgICBcImhvbWVcIjpyZXF1aXJlKCcuL2hvbWUvbGFuZy5lcy1NWCcpLFxuICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgQ0xJRU5UIFxuICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4gICAgICAgICAgICAgICAgXCJjbGllbnRcIjogcmVxdWlyZSgnLi9jbGllbnQvbGFuZy5lcy1NWCcpLFxuICAgICAgICAgICAgICAgIFwiY2xpZW50LWN1c3RvbVwiOiByZXF1aXJlKCcuL2NsaWVudC9sYW5nLmN1c3RvbS5lcy1NWCcpLFxuICAgICAgICAgICAgICAgIFwiY2xpZW50LWFkZFwiOiByZXF1aXJlKCcuL2NsaWVudC9tb2R1bGVzL2NsaWVudC5hZGQvbGFuZy5lcy1NWCcpLFxuICAgICAgICAgICAgICAgIFwiY2xpZW50LXVwZGF0ZVwiOiByZXF1aXJlKCcuL2NsaWVudC9tb2R1bGVzL2NsaWVudC51cGRhdGUvbGFuZy5lcy1NWCcpLFxuICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgUFJPRFVDVCBcbiAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuICAgICAgICAgICAgICAgIFwicHJvZHVjdFwiOiByZXF1aXJlKCcuL3Byb2R1Y3QvbGFuZy5lcy1NWCcpLFxuICAgICAgICAgICAgICAgIFwicHJvZHVjdE9mZnNldEdlbmVyYWwtYWRkXCI6IHJlcXVpcmUoJy4vcHJvZHVjdC9tb2R1bGVzL3Byb2R1Y3RPZmZzZXRHZW5lcmFsLmFkZC9sYW5nLmVzLU1YJyksXG4gICAgICAgICAgICAgICAgXCJwcm9kdWN0T2Zmc2V0R2VuZXJhbC11cGRhdGVcIjogcmVxdWlyZSgnLi9wcm9kdWN0L21vZHVsZXMvcHJvZHVjdE9mZnNldEdlbmVyYWwudXBkYXRlL2xhbmcuZXMtTVgnKSxcbiAgICAgICAgICAgICAgICBcInByb2R1Y3RPZmZzZXRQYWdpbmF0ZWQtYWRkXCI6IHJlcXVpcmUoJy4vcHJvZHVjdC9tb2R1bGVzL3Byb2R1Y3RPZmZzZXRQYWdpbmF0ZWQuYWRkL2xhbmcuZXMtTVgnKSxcbiAgICAgICAgICAgICAgICBcInByb2R1Y3RPZmZzZXRQYWdpbmF0ZWQtdXBkYXRlXCI6e1xuICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCIgOiBcImFjdHVhbGl6YXIgcHJvZHVjdG9cIixcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgU1VQUExJRVIgXG4gICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbiAgICAgICAgICAgICAgICBcInN1cHBsaWVyXCI6IHJlcXVpcmUoJy4vc3VwcGxpZXIvbGFuZy5lcy1NWCcpLFxuICAgICAgICAgICAgICAgIFwic3VwcGxpZXItYWRkXCI6IHJlcXVpcmUoJy4vc3VwcGxpZXIvbW9kdWxlcy9zdXBwbGllci5hZGQvbGFuZy5lcy1NWCcpLFxuICAgICAgICAgICAgICAgIFwic3VwcGxpZXItdXBkYXRlXCI6IHJlcXVpcmUoJy4vc3VwcGxpZXIvbW9kdWxlcy9zdXBwbGllci51cGRhdGUvbGFuZy5lcy1NWCcpLFxuICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgUEFQRVIgXG4gICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbiAgICAgICAgICAgICAgICBcInBhcGVyXCI6IHJlcXVpcmUoJy4vcGFwZXIvbGFuZy5lcy1NWCcpLFxuICAgICAgICAgICAgICAgIFwicGFwZXItYWRkXCI6IHJlcXVpcmUoJy4vcGFwZXIvbW9kdWxlcy9wYXBlci5hZGQvbGFuZy5lcy1NWCcpLFxuICAgICAgICAgICAgICAgIFwicGFwZXItdXBkYXRlXCI6IHJlcXVpcmUoJy4vcGFwZXIvbW9kdWxlcy9wYXBlci51cGRhdGUvbGFuZy5lcy1NWCcpLFxuICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgTUFDSElORSBcbiAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuICAgICAgICAgICAgICAgIFwibWFjaGluZVwiOiByZXF1aXJlKCcuL21hY2hpbmUvbGFuZy5lcy1NWCcpLFxuICAgICAgICAgICAgICAgIFwibWFjaGluZS1hZGRcIjogcmVxdWlyZSgnLi9tYWNoaW5lL21vZHVsZXMvbWFjaGluZS5hZGQvbGFuZy5lcy1NWCcpLFxuICAgICAgICAgICAgICAgIFwibWFjaGluZS11cGRhdGVcIjogcmVxdWlyZSgnLi9tYWNoaW5lL21vZHVsZXMvbWFjaGluZS51cGRhdGUvbGFuZy5lcy1NWCcpLFxuICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgTUFDSElORSBcbiAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuICAgICAgICAgICAgICAgIFwiaW5rXCI6IHJlcXVpcmUoJy4vaW5rL2xhbmcuZXMtTVgnKSxcbiAgICAgICAgICAgICAgICBcImluay1hZGRcIjogcmVxdWlyZSgnLi9pbmsvbW9kdWxlcy9pbmsuYWRkL2xhbmcuZXMtTVgnKSxcbiAgICAgICAgICAgICAgICBcImluay11cGRhdGVcIjogcmVxdWlyZSgnLi9pbmsvbW9kdWxlcy9pbmsudXBkYXRlL2xhbmcuZXMtTVgnKSxcbiAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgIFVTRVIgXG4gICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbiAgICAgICAgICAgICAgICBcInVzZXJcIjogcmVxdWlyZSgnLi91c2VyL2xhbmcuZXMtTVgnKSxcbiAgICAgICAgICAgICAgICBcInVzZXItYWRkXCI6IHJlcXVpcmUoJy4vdXNlci9tb2R1bGVzL3VzZXIuYWRkL2xhbmcuZXMtTVgnKSxcbiAgICAgICAgICAgICAgICBcInVzZXItdXBkYXRlXCI6IHJlcXVpcmUoJy4vdXNlci9tb2R1bGVzL3VzZXIudXBkYXRlL2xhbmcuZXMtTVgnKSxcbiAgICAgICAgICAgICAgICBcInVzZXItcHJvZmlsZVwiOiByZXF1aXJlKCcuL3VzZXIvbW9kdWxlcy91c2VyLnByb2ZpbGUvbGFuZy5lcy1NWCcpLFxuICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgV09SSyBPUkRFUiBcbiAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuICAgICAgICAgICAgICAgIFwid29cIjogcmVxdWlyZSgnLi93by9sYW5nLmVzLU1YJyksXG4gICAgICAgICAgICAgICAgXCJ3by1hZGRcIjogcmVxdWlyZSgnLi93by9tb2R1bGVzL3dvLmFkZC9sYW5nLmVzLU1YJyksXG4gICAgICAgICAgICAgICAgXCJ3by11cGRhdGVcIjogcmVxdWlyZSgnLi93by9tb2R1bGVzL3dvLnVwZGF0ZS9sYW5nLmVzLU1YJyksXG4gICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICBBVVRIIFxuICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4gICAgICAgICAgICAgICAgXCJhdXRoXCI6IHJlcXVpcmUoJy4vYXV0aC9sYW5nLmVzLU1YJyksXG4gICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICBaT05FIFxuICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4gICAgICAgICAgICAgICAgXCJ6b25lXCI6IHJlcXVpcmUoJy4vem9uZS9sYW5nLmVzLU1YJyksXG4gICAgICAgICAgICAgICAgXCJ6b25lLWFkZFwiOiByZXF1aXJlKCcuL3pvbmUvbW9kdWxlcy96b25lLmFkZC9sYW5nLmVzLU1YJyksXG4gICAgICAgICAgICAgICAgXCJ6b25lLXVwZGF0ZVwiOiByZXF1aXJlKCcuL3pvbmUvbW9kdWxlcy96b25lLnVwZGF0ZS9sYW5nLmVzLU1YJyksXG4gICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICBTVEFUVVMgXG4gICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbiAgICAgICAgICAgICAgICBcIndvcmtmbG93XCI6IHJlcXVpcmUoJy4vd29ya2Zsb3cvbGFuZy5lcy1NWCcpLFxuICAgICAgICAgICAgfSIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgcmV0dXJuIGFuZ3VsYXIubW9kdWxlKCdhcHAubG9naW4nLCBbXSlcblxuICAgICAgICAuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJyxcbiAgICAgICAgICAgIGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICAgICAgICAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2xvZ2luJywge1xuICAgICAgICAgICAgICAgICAgICB1cmw6ICcvbG9naW4nLFxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9sb2dpbi9sb2dpbi52aWV3Lmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnbG9naW5DdHJsJyxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWlyZXNMb2dpbjogZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfV0pXG5cbiAgICAgICAgLmNvbnRyb2xsZXIoJ2xvZ2luQ3RybCcsIHJlcXVpcmUoJy4vbG9naW4uY3RybCcpKVxuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRzY29wZScsICckaHR0cCcsICdhdXRoU2VydmljZScsICckbG9jYXRpb24nLFxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCAkaHR0cCwgYXV0aFNlcnZpY2UsICRsb2NhdGlvbikge1xuICAgICAgICAgICAgYXV0aFNlcnZpY2UubG9naW4oKTtcbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICB2YXIgdG9rZW4gPSBzdG9yZS5nZXQoJ3Rva2VuJyk7XG4gICAgICAgICAgICBpZiAodG9rZW4pIHtcbiAgICAgICAgICAgICAgICBpZiAoIWp3dEhlbHBlci5pc1Rva2VuRXhwaXJlZCh0b2tlbikpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFhdXRoLmlzQXV0aGVudGljYXRlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXV0aC5hdXRoZW50aWNhdGUoc3RvcmUuZ2V0KCdwcm9maWxlJyksIHRva2VuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvaG9tZScpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvaG9tZScpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEVpdGhlciBzaG93IHRoZSBsb2dpbiBwYWdlIG9yIHVzZSB0aGUgcmVmcmVzaCB0b2tlbiB0byBnZXQgYSBuZXcgaWRUb2tlblxuICAgICAgICAgICAgICAgICAgICBhdXRoLnNpZ25pbih7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaWN0OiAnZXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogJ2ltZy9nZ2F1dGgtbG9nby5wbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgdXNlcm5hbWU6ICRzY29wZS51c2VybmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhc3N3b3JkOiAkc2NvcGUucGFzc3dvcmQsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25uZWN0aW9uOiAnVXNlcm5hbWUtUGFzc3dvcmQtQXV0aGVudGljYXRpb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVtZW1iZXJMYXN0TG9naW46IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2xvc2FibGU6IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChwcm9maWxlLCB0b2tlbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gU3VjY2VzcyBjYWxsYmFja1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RvcmUuc2V0KCdwcm9maWxlJywgcHJvZmlsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdG9yZS5zZXQoJ3Rva2VuJywgdG9rZW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9ob21lJyk7XG4gICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBFcnJvciBjYWxsYmFja1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGF1dGguc2lnbmluKHtcbiAgICAgICAgICAgICAgICAgICAgZGljdDogJ2VzJyxcbiAgICAgICAgICAgICAgICAgICAgaWNvbjogJ2ltZy9nZ2F1dGgtbG9nby5wbmcnLFxuICAgICAgICAgICAgICAgICAgICB1c2VybmFtZTogJHNjb3BlLnVzZXJuYW1lLFxuICAgICAgICAgICAgICAgICAgICBwYXNzd29yZDogJHNjb3BlLnBhc3N3b3JkLFxuICAgICAgICAgICAgICAgICAgICBjb25uZWN0aW9uOiAnVXNlcm5hbWUtUGFzc3dvcmQtQXV0aGVudGljYXRpb24nLFxuICAgICAgICAgICAgICAgICAgICByZW1lbWJlckxhc3RMb2dpbjogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGNsb3NhYmxlOiBmYWxzZVxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChwcm9maWxlLCB0b2tlbikge1xuICAgICAgICAgICAgICAgICAgICAvLyBTdWNjZXNzIGNhbGxiYWNrXG4gICAgICAgICAgICAgICAgICAgIHN0b3JlLnNldCgncHJvZmlsZScsIHByb2ZpbGUpO1xuICAgICAgICAgICAgICAgICAgICBzdG9yZS5zZXQoJ3Rva2VuJywgdG9rZW4pO1xuICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2hvbWUnKTtcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpXG4gICAgICAgICAgICAgICAgICAgIC8vIEVycm9yIGNhbGxiYWNrXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9Ki9cblxuICAgICAgICB9XVxuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbihhbmd1bGFyKXtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgXG4gICAgcmV0dXJuIGFuZ3VsYXIubW9kdWxlKCdhcHAubWFjaGluZScsW1xuICAgICAgICByZXF1aXJlKCcuL21vZHVsZXMvbWFjaGluZS5hZGQnKS5uYW1lLFxuICAgICAgICByZXF1aXJlKCcuL21vZHVsZXMvbWFjaGluZS51cGRhdGUnKS5uYW1lXG4gICAgXSlcblxuICAgIC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLFxuICAgIGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcbiAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ21hY2hpbmUnLCB7XG4gICAgICAgICAgICB1cmw6Jy9tYWNoaW5lJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsIDogJ2FwcC9tYWNoaW5lL21hY2hpbmUudmlldy5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXIgOiAnbWFjaGluZUN0cmwnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHJlcXVpcmVzTG9naW46IHRydWVcbiAgICAgICAgICAgIH0gICAgXG4gICAgICAgIH0pO1xuICAgIH1dKVxuXG4gICAgLmZhY3RvcnkoJ21hY2hpbmVGYWMnLHJlcXVpcmUoJy4vbWFjaGluZS5mYWMnKSlcblxuICAgIC5jb250cm9sbGVyKCdtYWNoaW5lQ3RybCcscmVxdWlyZSgnLi9tYWNoaW5lLmN0cmwnKSlcbiAgICBcbn0pKGFuZ3VsYXIpO1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIiA6IFwibWFxdWluYXNcIixcbiAgICAgICAgICAgICAgICAgICAgXCJsYWJlbHNcIjp7XG4gICAgICAgICAgICAgICAgICAgICAgICBcIm1hLWlkXCI6XCJJRCBNYXF1aW5hXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm1hLW5hbWVcIjpcIk1hcXVpbmFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibWEtbWF4c2l6ZXdpZHRoXCI6XCJUYW1hw7FvIG1heC4gYW5jaG9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibWEtbWF4c2l6ZWhlaWdodFwiOlwiVGFtYcOxbyBtYXguIGFsdHVyYVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJtYS1taW5zaXpld2lkdGhcIjpcIlRhbWHDsW8gbWluLiBhbmNob1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJtYS1taW5zaXplaGVpZ2h0XCI6XCJUYW1hw7FvIG1heC4gYWx0dXJhXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm1hLXNpemVtZWFzdXJlXCI6XCJNZWRpZGFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibWEtdG90YWxpbmtzXCI6XCJUaW50YXMgdG90YWxlc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJtYS1mdWxsY29sb3JcIjpcIkZ1bGwgY29sb3JcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibWEtcHJpbnRiZ1wiOlwiSW1wcmltZSBmb25kb3NcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibWEtcHJvY2Vzc1wiOlwiUHJvY2Vzb1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJtYS1zdGF0dXNcIjpcIkVzdGF0dXNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibWEtZGF0ZVwiOlwiRmVjaGFcIixcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgIFwiY29sdW1uc1wiOltcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibWFfaWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibWFfbmFtZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJtYV9tYXhzaXpld2lkdGhcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibWFfbWF4c2l6ZWhlaWdodFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJtYV9taW5zaXpld2lkdGhcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibWFfbWluc2l6ZWhlaWdodFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJtYV9zaXplbWVhc3VyZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJtYV90b3RhbGlua3NcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibWFfZnVsbGNvbG9yXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm1hX3ByaW50YmdcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibWFfcHJvY2Vzc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJtYV9zdGF0dXNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibWFfZGF0ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgIFwiZmllbGRzXCIgOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYV9zaXplbWVhc3VyZW9wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcImNtXCIsXCJ2YWx1ZVwiOlwiY21cIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcInB1bGdhZGFzXCIsXCJ2YWx1ZVwiOlwiaW5cIn1cbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBtYV9mdWxsY29sb3JvcHRpb25zIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJTaVwiLFwidmFsdWVcIjpcInllc1wifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiTm9cIixcInZhbHVlXCI6XCJub1wifVxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hX3ByaW50YmdvcHRpb25zIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJTaVwiLFwidmFsdWVcIjpcInllc1wifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiTm9cIixcInZhbHVlXCI6XCJub1wifVxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hX3Byb2Nlc3NvcHRpb25zIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJPZmZzZXRcIixcInZhbHVlXCI6XCJvZmZzZXRcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkZsZXhvXCIsXCJ2YWx1ZVwiOlwiZmxleG9cIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIlBsw7N0ZXJcIixcInZhbHVlXCI6XCJwbG90dGVyXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJTZWxsb3NcIixcInZhbHVlXCI6XCJzZWFsc1wifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiU2VyaWdyYWbDrWFcIixcInZhbHVlXCI6XCJzZXJpZ3JhcGh5XCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJMYXNlclwiLFwidmFsdWVcIjpcImxhc2VyXCJ9XG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWFfc3RhdHVzb3B0aW9ucyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiQWN0aXZvXCIsXCJ2YWx1ZVwiOlwiQVwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiSW5hY3Rpdm9cIixcInZhbHVlXCI6XCJJXCJ9XG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckc2NvcGUnLCAnbWFjaGluZUZhYycsICdpMThuRmlsdGVyJyxcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgbWFjaGluZUZhYywgaTE4bkZpbHRlcikge1xuXG4gICAgICAgICAgICAkc2NvcGUubGFiZWxzID0gT2JqZWN0LmtleXMoaTE4bkZpbHRlcihcIm1hY2hpbmUubGFiZWxzXCIpKTtcbiAgICAgICAgICAgICRzY29wZS5jb2x1bW5zID0gaTE4bkZpbHRlcihcIm1hY2hpbmUuY29sdW1uc1wiKTtcbiAgICAgICAgXG4gICAgICAgICAgICAvLyBmb3JtYXRJdGVtIGV2ZW50IGhhbmRsZXJcbiAgICAgICAgICAgIHZhciBtYV9pZDtcbiAgICAgICAgICAgICRzY29wZS5mb3JtYXRJdGVtID0gZnVuY3Rpb24gKHMsIGUsIGNlbGwpIHtcblxuICAgICAgICAgICAgICAgIGlmIChlLnBhbmVsLmNlbGxUeXBlID09IHdpam1vLmdyaWQuQ2VsbFR5cGUuUm93SGVhZGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGUuY2VsbC50ZXh0Q29udGVudCA9IGUucm93ICsgMTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBzLnJvd3MuZGVmYXVsdFNpemUgPSAzMDtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIGFkZCBCb290c3RyYXAgaHRtbFxuICAgICAgICAgICAgICAgIGlmICgoZS5wYW5lbC5jZWxsVHlwZSA9PSB3aWptby5ncmlkLkNlbGxUeXBlLkNlbGwpICYmIChlLmNvbCA9PSAwKSkge1xuICAgICAgICAgICAgICAgICAgICBtYV9pZCA9IGUucGFuZWwuZ2V0Q2VsbERhdGEoZS5yb3csIDEsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgZS5jZWxsLnN0eWxlLm92ZXJmbG93ID0gJ3Zpc2libGUnO1xuICAgICAgICAgICAgICAgICAgICBlLmNlbGwuaW5uZXJIVE1MID0gJzxkaXYgY2xhc3M9XCJidG4tZ3JvdXAgYnRuLWdyb3VwLWp1c3RpZmllZFwiIHJvbGU9XCJncm91cFwiIGFyaWEtbGFiZWw9XCIuLi5cIj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidG4tZ3JvdXBcIiByb2xlPVwiZ3JvdXBcIj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiIy9tYWNoaW5lL3VwZGF0ZS8nKyBtYV9pZCArICdcIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdCBidG4teHNcIiBuZy1jbGljaz1cImVkaXQoJGl0ZW0ubWFfaWQpXCI+RWRpdGFyPC9hPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2Pic7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgICAgIC8vIGJpbmQgY29sdW1ucyB3aGVuIGdyaWQgaXMgaW5pdGlhbGl6ZWRcbiAgICAgICAgICAgICRzY29wZS5pbml0R3JpZCA9IGZ1bmN0aW9uIChzLCBlKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAkc2NvcGUubGFiZWxzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjb2wgPSBuZXcgd2lqbW8uZ3JpZC5Db2x1bW4oKTtcbiAgICAgICAgICAgICAgICAgICAgY29sLmJpbmRpbmcgPSAkc2NvcGUuY29sdW1uc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgY29sLmhlYWRlciA9IGkxOG5GaWx0ZXIoXCJtYWNoaW5lLmxhYmVscy5cIiArICRzY29wZS5sYWJlbHNbaV0pO1xuICAgICAgICAgICAgICAgICAgICBjb2wud29yZFdyYXAgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgY29sLndpZHRoID0gMTUwO1xuICAgICAgICAgICAgICAgICAgICBzLmNvbHVtbnMucHVzaChjb2wpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICAvLyBjcmVhdGUgdGhlIHRvb2x0aXAgb2JqZWN0XG4gICAgICAgICAgICAkc2NvcGUuJHdhdGNoKCdnZ0dyaWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCRzY29wZS5nZ0dyaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIC8vIHN0b3JlIHJlZmVyZW5jZSB0byBncmlkXG4gICAgICAgICAgICAgICAgICAgIHZhciBmbGV4ID0gJHNjb3BlLmdnR3JpZDtcblxuICAgICAgICAgICAgICAgICAgICAvLyBjcmVhdGUgdG9vbHRpcFxuICAgICAgICAgICAgICAgICAgICB2YXIgdGlwID0gbmV3IHdpam1vLlRvb2x0aXAoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJuZyA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gbW9uaXRvciB0aGUgbW91c2Ugb3ZlciB0aGUgZ3JpZFxuICAgICAgICAgICAgICAgICAgICBmbGV4Lmhvc3RFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBodCA9IGZsZXguaGl0VGVzdChldnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFodC5yYW5nZS5lcXVhbHMocm5nKSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbmV3IGNlbGwgc2VsZWN0ZWQsIHNob3cgdG9vbHRpcFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChodC5jZWxsVHlwZSA9PSB3aWptby5ncmlkLkNlbGxUeXBlLkNlbGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm5nID0gaHQucmFuZ2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb2wgPSBmbGV4LmNvbHVtbnNbcm5nLmNvbF0uaGVhZGVyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2VsbEVsZW1lbnQgPSBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KGV2dC5jbGllbnRYLCBldnQuY2xpZW50WSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjZWxsQm91bmRzID0gd2lqbW8uUmVjdC5mcm9tQm91bmRpbmdSZWN0KGNlbGxFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEgPSB3aWptby5lc2NhcGVIdG1sKGZsZXguZ2V0Q2VsbERhdGEocm5nLnJvdywgcm5nLmNvbCwgdHJ1ZSkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlwQ29udGVudCA9IGNvbCArICc6IFwiPGI+JyArIGRhdGEgKyAnPC9iPlwiJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNlbGxFbGVtZW50LmNsYXNzTmFtZS5pbmRleE9mKCd3ai1jZWxsJykgPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlwLnNob3coZmxleC5ob3N0RWxlbWVudCwgdGlwQ29udGVudCwgY2VsbEJvdW5kcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXAuaGlkZSgpOyAvLyBjZWxsIG11c3QgYmUgYmVoaW5kIHNjcm9sbCBiYXIuLi5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGZsZXguaG9zdEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXAuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcm5nID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICRzY29wZS4kb24oJyR2aWV3Q29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAvLyB0aGlzIGNvZGUgaXMgZXhlY3V0ZWQgYWZ0ZXIgdGhlIHZpZXcgaXMgbG9hZGVkXG4gICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIG1hY2hpbmVGYWMuZGF0YSgpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZGF0YSA9IG5ldyB3aWptby5jb2xsZWN0aW9ucy5Db2xsZWN0aW9uVmlldyhwcm9taXNlLmRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfV07XG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgcmV0dXJuIFsnJGh0dHAnLCAnJHEnLCBcbiAgICAgICAgZnVuY3Rpb24gKCRodHRwLCAkcSkge1xuICAgICAgICAgICAgdmFyIGZhY3RvcnkgPSB7fTtcbiAgICAgICAgICAgIGZhY3RvcnkuZGF0YSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoXG4gICAgICAgICAgICAgICAgICAgICRodHRwLnBvc3QoJ21vZHVsZXMvbWFjaGluZS9tYWNoaW5lLm1kbC5nZXRtYWNoaW5lcy5waHAnLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBQT1NUIHZhcmlhYmxlcyBoZXJlICovXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9jY2VzX2lkOiBuZXcgRGF0ZSgpLmdldE1pbGxpc2Vjb25kcygpXG4gICAgICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm4gZmFjdG9yeTtcbiAgICAgICAgfV07XG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKGFuZ3VsYXIpe1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBcbiAgICByZXR1cm4gYW5ndWxhci5tb2R1bGUoJ2FwcC5tYWNoaW5lLmFkZCcsW10pXG5cbiAgICAuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJyxcbiAgICBmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdtYWNoaW5lQWRkJywge1xuICAgICAgICAgICAgdXJsOicvbWFjaGluZS9hZGQnLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmwgOiAnYXBwL21hY2hpbmUvbW9kdWxlcy9tYWNoaW5lLmFkZC9tYWNoaW5lLmFkZC52aWV3Lmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlciA6ICdtYWNoaW5lQWRkQ3RybCcsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgcmVxdWlyZXNMb2dpbjogdHJ1ZVxuICAgICAgICAgICAgfSAgICBcbiAgICAgICAgfSk7XG4gICAgfV0pXG5cbiAgICAuZmFjdG9yeSgnbWFjaGluZUFkZEZhYycscmVxdWlyZSgnLi9tYWNoaW5lLmFkZC5mYWMnKSlcblxuICAgIC5jb250cm9sbGVyKCdtYWNoaW5lQWRkQ3RybCcscmVxdWlyZSgnLi9tYWNoaW5lLmFkZC5jdHJsJykpXG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCIgOiBcImFncmVnYXIgbWFxdWluYVwiLFxuICAgICAgICAgICAgICAgIH0iLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbihhbmd1bGFyKXtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgXG4gICAgcmV0dXJuIFsnJHNjb3BlJywgJ21hY2hpbmVBZGRGYWMnLCAnJGxvY2F0aW9uJywgJ2kxOG5GaWx0ZXInLFxuICAgIGZ1bmN0aW9uICgkc2NvcGUsIG1hY2hpbmVBZGRGYWMsICRsb2NhdGlvbiwgaTE4bkZpbHRlcikge1xuICAgICAgICAkc2NvcGUuZm1EYXRhID0ge307XG5cbiAgICAgICAgJHNjb3BlLm9uU3VibWl0ID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIG1hY2hpbmVBZGRGYWMuYWRkKCRzY29wZS5mbURhdGEpLnRoZW4oZnVuY3Rpb24ocHJvbWlzZSl7XG4gICAgICAgICAgICAgICAgaWYocHJvbWlzZS5kYXRhID09IFwiMVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvbWFjaGluZScpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS51cGRhdGVGYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUubWFfc2l6ZW1lYXN1cmVvcHRpb25zID0gaTE4bkZpbHRlcihcIm1hY2hpbmUuZmllbGRzLm1hX3NpemVtZWFzdXJlb3B0aW9uc1wiKTtcbiAgICAgICAgJHNjb3BlLm1hX2Z1bGxjb2xvcm9wdGlvbnMgPSBpMThuRmlsdGVyKFwibWFjaGluZS5maWVsZHMubWFfZnVsbGNvbG9yb3B0aW9uc1wiKTtcbiAgICAgICAgJHNjb3BlLm1hX3ByaW50YmdvcHRpb25zID0gaTE4bkZpbHRlcihcIm1hY2hpbmUuZmllbGRzLm1hX3ByaW50YmdvcHRpb25zXCIpO1xuICAgICAgICAkc2NvcGUubWFfcHJvY2Vzc29wdGlvbnMgPSBpMThuRmlsdGVyKFwibWFjaGluZS5maWVsZHMubWFfcHJvY2Vzc29wdGlvbnNcIik7XG4gICAgICAgICRzY29wZS5tYV9zdGF0dXNvcHRpb25zID0gaTE4bkZpbHRlcihcIm1hY2hpbmUuZmllbGRzLm1hX3N0YXR1c29wdGlvbnNcIik7XG5cbiAgICAgICAgJHNjb3BlLiRvbignJHZpZXdDb250ZW50TG9hZGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLy8gdGhpcyBjb2RlIGlzIGV4ZWN1dGVkIGFmdGVyIHRoZSB2aWV3IGlzIGxvYWRlZFxuICAgICAgICAgICAgXG4gICAgICAgICAgIFxuXG4gICAgICAgICB9KTtcbiAgICB9XTtcbiAgICBcbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgcmV0dXJuIFsnJGh0dHAnLCAnJHEnLCAgJyRzdGF0ZVBhcmFtcycsXG4gICAgICAgIGZ1bmN0aW9uICgkaHR0cCwgJHEsICRzdGF0ZVBhcmFtcykge1xuICAgICAgICAgICAgdmFyIGZhY3RvcnkgPSB7fTtcbiAgICAgICAgICAgIGZhY3RvcnkuYWRkID0gZnVuY3Rpb24gKG1hX2pzb25iKSB7XG4gICAgICAgICAgICAgICAgdmFyIHByb21pc2UgPSAkaHR0cC5wb3N0KCdtb2R1bGVzL21hY2hpbmUvbW9kdWxlcy9tYWNoaW5lLmFkZC9tYWNoaW5lLmFkZC5tZGwuYWRkLnBocCcsIHtcbiAgICAgICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgICAgICBtYV9qc29uYjogbWFfanNvbmJcbiAgICAgICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmV0dXJuIGZhY3Rvcnk7XG4gICAgICAgIH1dO1xuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbihhbmd1bGFyKXtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgXG4gICAgcmV0dXJuIGFuZ3VsYXIubW9kdWxlKCdhcHAubWFjaGluZS51cGRhdGUnLFtdKVxuXG4gICAgLmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsXG4gICAgZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnbWFjaGluZVVwZGF0ZScsIHtcbiAgICAgICAgICAgIHVybDonL21hY2hpbmUvdXBkYXRlLzptYV9pZCcsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybCA6ICdhcHAvbWFjaGluZS9tb2R1bGVzL21hY2hpbmUudXBkYXRlL21hY2hpbmUudXBkYXRlLnZpZXcuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyIDogJ21hY2hpbmVVcGRhdGVDdHJsJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICByZXF1aXJlc0xvZ2luOiB0cnVlXG4gICAgICAgICAgICB9ICAgIFxuICAgICAgICB9KTtcbiAgICB9XSlcblxuICAgIC5mYWN0b3J5KCdtYWNoaW5lVXBkYXRlRmFjJyxyZXF1aXJlKCcuL21hY2hpbmUudXBkYXRlLmZhYycpKVxuXG4gICAgLmNvbnRyb2xsZXIoJ21hY2hpbmVVcGRhdGVDdHJsJyxyZXF1aXJlKCcuL21hY2hpbmUudXBkYXRlLmN0cmwnKSlcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIiA6IFwiYWN0dWFsaXphciBtYXF1aW5hXCIsXG4gICAgICAgICAgICAgICAgfSIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgcmV0dXJuIFsnJHNjb3BlJywgJ21hY2hpbmVVcGRhdGVGYWMnLCAnJGxvY2F0aW9uJywgJ2kxOG5GaWx0ZXInLFxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCBtYWNoaW5lVXBkYXRlRmFjLCAkbG9jYXRpb24sIGkxOG5GaWx0ZXIpIHtcblxuICAgICAgICAgICAgJHNjb3BlLm9uU3VibWl0ID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgbWFjaGluZVVwZGF0ZUZhYy51cGRhdGUoJHNjb3BlLmZtRGF0YSkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocHJvbWlzZS5kYXRhID09IFwiMVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL21hY2hpbmUnKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS51cGRhdGVGYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgJHNjb3BlLm1hX3NpemVtZWFzdXJlb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJtYWNoaW5lLmZpZWxkcy5tYV9zaXplbWVhc3VyZW9wdGlvbnNcIik7XG4gICAgICAgICAgICAkc2NvcGUubWFfZnVsbGNvbG9yb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJtYWNoaW5lLmZpZWxkcy5tYV9mdWxsY29sb3JvcHRpb25zXCIpO1xuICAgICAgICAgICAgJHNjb3BlLm1hX3ByaW50YmdvcHRpb25zID0gaTE4bkZpbHRlcihcIm1hY2hpbmUuZmllbGRzLm1hX3ByaW50YmdvcHRpb25zXCIpO1xuICAgICAgICAgICAgJHNjb3BlLm1hX3Byb2Nlc3NvcHRpb25zID0gaTE4bkZpbHRlcihcIm1hY2hpbmUuZmllbGRzLm1hX3Byb2Nlc3NvcHRpb25zXCIpO1xuICAgICAgICAgICAgJHNjb3BlLm1hX3N0YXR1c29wdGlvbnMgPSBpMThuRmlsdGVyKFwibWFjaGluZS5maWVsZHMubWFfc3RhdHVzb3B0aW9uc1wiKTtcblxuICAgICAgICAgICAgJHNjb3BlLiRvbignJHZpZXdDb250ZW50TG9hZGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIC8vIHRoaXMgY29kZSBpcyBleGVjdXRlZCBhZnRlciB0aGUgdmlldyBpcyBsb2FkZWRcbiAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgbWFjaGluZVVwZGF0ZUZhYy5kYXRhKCkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc09iamVjdChhbmd1bGFyLmZyb21Kc29uKHByb21pc2UuZGF0YSkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZm1EYXRhID0gYW5ndWxhci5mcm9tSnNvbihwcm9taXNlLmRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfV07XG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgcmV0dXJuIFsnJGh0dHAnLCAnJHEnLCAgJyRzdGF0ZVBhcmFtcycsIGZ1bmN0aW9uICgkaHR0cCwgJHEsICRzdGF0ZVBhcmFtcykge1xuICAgICAgICB2YXIgZmFjdG9yeSA9IHt9O1xuICAgICAgICBmYWN0b3J5LmRhdGEgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KCdtb2R1bGVzL21hY2hpbmUvbW9kdWxlcy9tYWNoaW5lLnVwZGF0ZS9tYWNoaW5lLnVwZGF0ZS5tZGwuZ2V0bWFjaGluZS5waHAnLCB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICAgICAgbWFfaWQ6ICRzdGF0ZVBhcmFtcy5tYV9pZFxuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICBmYWN0b3J5LnVwZGF0ZSA9IGZ1bmN0aW9uIChtYV9qc29uYikge1xuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoXG4gICAgICAgICAgICAgICAgJGh0dHAucG9zdCgnbW9kdWxlcy9tYWNoaW5lL21vZHVsZXMvbWFjaGluZS51cGRhdGUvbWFjaGluZS51cGRhdGUubWRsLnVwZGF0ZS5waHAnLCB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICAgICAgbWFfaWQ6ICRzdGF0ZVBhcmFtcy5tYV9pZCxcbiAgICAgICAgICAgICAgICAgICAgbWFfanNvbmI6IG1hX2pzb25iXG4gICAgICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkuZ2V0Q291bnRyaWVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHByb21pc2UgPSAkaHR0cC5nZXQoJ2h0dHA6Ly9hcGkuZ2VvbmFtZXMub3JnL2NvdW50cnlJbmZvSlNPTj91c2VybmFtZT1hbGVqYW5kcm9sc2NhJylcbiAgICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkuZ2V0U3RhdGVzID0gZnVuY3Rpb24gKG1hX2NvdW50cnkpIHtcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gJGh0dHAuZ2V0KCdodHRwOi8vYXBpLmdlb25hbWVzLm9yZy9jaGlsZHJlbkpTT04/Z2VvbmFtZUlkPScgKyBtYV9jb3VudHJ5ICsgJyZ1c2VybmFtZT1hbGVqYW5kcm9sc2NhJylcbiAgICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkuZ2V0Q2l0eUNvdW50eSA9IGZ1bmN0aW9uIChtYV9zdGF0ZSkge1xuICAgICAgICAgICAgdmFyIHByb21pc2UgPSAkaHR0cC5nZXQoJ2h0dHA6Ly9hcGkuZ2VvbmFtZXMub3JnL2NoaWxkcmVuSlNPTj9nZW9uYW1lSWQ9JyArIG1hX3N0YXRlICsgJyZ1c2VybmFtZT1hbGVqYW5kcm9sc2NhJylcbiAgICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBmYWN0b3J5O1xuICAgIH1dO1xuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbihhbmd1bGFyKXtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgXG4gICAgcmV0dXJuIGFuZ3VsYXIubW9kdWxlKCdhcHAucGFwZXInLFtcbiAgICAgICAgcmVxdWlyZSgnLi9tb2R1bGVzL3BhcGVyLmFkZCcpLm5hbWUsXG4gICAgICAgIHJlcXVpcmUoJy4vbW9kdWxlcy9wYXBlci51cGRhdGUnKS5uYW1lXG4gICAgXSlcblxuICAgIC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLFxuICAgIGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcbiAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3BhcGVyJywge1xuICAgICAgICAgICAgdXJsOicvcGFwZXInLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmwgOiAnYXBwL3BhcGVyL3BhcGVyLnZpZXcuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyIDogJ3BhcGVyQ3RybCcsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgcmVxdWlyZXNMb2dpbjogdHJ1ZVxuICAgICAgICAgICAgfSAgICBcbiAgICAgICAgfSk7XG4gICAgfV0pXG5cbiAgICAuZmFjdG9yeSgncGFwZXJGYWMnLHJlcXVpcmUoJy4vcGFwZXIuZmFjJykpXG5cbiAgICAuY29udHJvbGxlcigncGFwZXJDdHJsJyxyZXF1aXJlKCcuL3BhcGVyLmN0cmwnKSlcbiAgICBcbn0pKGFuZ3VsYXIpO1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIiA6IFwiUGFwZWxcIixcbiAgICAgICAgICAgICAgICAgICAgXCJsYWJlbHNcIjp7XG4gICAgICAgICAgICAgICAgICAgICAgICBcInBhLWlkXCI6XCJJRCBQYXBlbFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdS1pZFwiOlwiSUQgUHJvdmVlZG9yXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInBhLWNvZGVcIjpcIkNvZGlnb1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwYS10eXBlXCI6XCJUaXBvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInBhLWRlc2NyaXB0aW9uXCI6XCJEZXNjcmlwY2nDs25cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicGEtd2VpZ2h0XCI6XCJQZXNvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInBhLXdpZHRoXCI6XCJBbmNob1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwYS1oZWlnaHRcIjpcIkFsdHVyYVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwYS1tZWFzdXJlXCI6XCJNZWRpZGFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicGEtcHJpY2VcIjpcIlByZWNpb1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwYS1zdGF0dXNcIjpcIkVzdGF0dXNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicGEtZGF0ZVwiOlwiRmVjaGFcIixcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgIFwiY29sdW1uc1wiOltcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicGFfaWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3VfaWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicGFfY29kZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwYV90eXBlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInBhX2Rlc2NyaXB0aW9uXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInBhX3dlaWdodFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwYV93aWR0aFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwYV9oZWlnaHRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicGFfbWVhc3VyZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwYV9wcmljZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwYV9zdGF0dXNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicGFfZGF0ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgIFwiZmllbGRzXCIgOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYV9zdGF0dXNvcHRpb25zIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJBY3Rpdm9cIixcInZhbHVlXCI6XCJBXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJJbmFjdGl2b1wiLFwidmFsdWVcIjpcIklcIn1cbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBwYV90eXBlb3B0aW9ucyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiUGFwZWxcIixcInZhbHVlXCI6XCJwYXBlclwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiQ2FydHVsaW5hXCIsXCJ2YWx1ZVwiOlwicG9zdGVyX2JvYXJkXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJQYXBlbCBBZGhlc2l2b1wiLFwidmFsdWVcIjpcImFkaGVzaXZlX3BhcGVyXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJQZWxpY3VsYSBBZGhlc2l2YVwiLFwidmFsdWVcIjpcImFkaGVzaXZlIGZpbG1cIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIlPDrW50ZXRpY29cIixcInZhbHVlXCI6XCJzeW50aGV0aWNcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIlBsYXN0aWNvc1wiLFwidmFsdWVcIjpcInBsYXN0aWNzXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJUZXJtYWwgVHJhbnNmZXJcIixcInZhbHVlXCI6XCJ0ZXJtYWwgdHJhbnNmZXJcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkRpcmVjdCBUZXJtYWxcIixcInZhbHVlXCI6XCJkaXJlY3RfdGVybWFsXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJPdHJvc1wiLFwidmFsdWVcIjpcIm90aGVyXCJ9XG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFfbWVhc3VyZW9wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcImNtXCIsXCJ2YWx1ZVwiOlwiY21cIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcInB1bGdhZGFzXCIsXCJ2YWx1ZVwiOlwiaW5cIn1cbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oYW5ndWxhcil7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIFxuICAgIHJldHVybiBhbmd1bGFyLm1vZHVsZSgnYXBwLnBhcGVyLmFkZCcsW10pXG5cbiAgICAuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJyxcbiAgICBmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdwYXBlckFkZCcsIHtcbiAgICAgICAgICAgIHVybDonL3BhcGVyL2FkZCcsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybCA6ICdhcHAvcGFwZXIvbW9kdWxlcy9wYXBlci5hZGQvcGFwZXIuYWRkLnZpZXcuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyIDogJ3BhcGVyQWRkQ3RybCcsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgcmVxdWlyZXNMb2dpbjogdHJ1ZVxuICAgICAgICAgICAgfSAgICBcbiAgICAgICAgfSk7XG4gICAgfV0pXG5cbiAgICAuZmFjdG9yeSgncGFwZXJBZGRGYWMnLHJlcXVpcmUoJy4vcGFwZXIuYWRkLmZhYycpKVxuXG4gICAgLmNvbnRyb2xsZXIoJ3BhcGVyQWRkQ3RybCcscmVxdWlyZSgnLi9wYXBlci5hZGQuY3RybCcpKVxuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiIDogXCJhZ3JlZ2FyIHBhcGVsXCIsXG4gICAgICAgICAgICAgICAgfSIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgcmV0dXJuIFsnJHNjb3BlJywgJ3BhcGVyQWRkRmFjJywgJyRsb2NhdGlvbicsICdpMThuRmlsdGVyJyxcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgcGFwZXJBZGRGYWMsICRsb2NhdGlvbiwgaTE4bkZpbHRlcikge1xuICAgICAgICAgICAgJHNjb3BlLmZtRGF0YSA9IHt9O1xuXG4gICAgICAgICAgICAkc2NvcGUub25TdWJtaXQgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICBwYXBlckFkZEZhYy5hZGQoJHNjb3BlLmZtRGF0YSkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocHJvbWlzZS5kYXRhID09IFwiMVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3BhcGVyJyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICRzY29wZS5wYV9zdGF0dXNvcHRpb25zID0gaTE4bkZpbHRlcihcInBhcGVyLmZpZWxkcy5wYV9zdGF0dXNvcHRpb25zXCIpO1xuICAgICAgICAgICAgJHNjb3BlLnBhX3R5cGVvcHRpb25zID0gaTE4bkZpbHRlcihcInBhcGVyLmZpZWxkcy5wYV90eXBlb3B0aW9uc1wiKTtcbiAgICAgICAgICAgICRzY29wZS5wYV9tZWFzdXJlb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJwYXBlci5maWVsZHMucGFfbWVhc3VyZW9wdGlvbnNcIik7XG5cbiAgICAgICAgICAgICRzY29wZS4kb24oJyR2aWV3Q29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAvLyB0aGlzIGNvZGUgaXMgZXhlY3V0ZWQgYWZ0ZXIgdGhlIHZpZXcgaXMgbG9hZGVkXG4gICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBwYXBlckFkZEZhYy5nZXRTdXBwbGllcnMoKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnN1X2lkb3B0aW9ucyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHByb21pc2UuZGF0YSwgZnVuY3Rpb24gKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnB1c2goeyBcImxhYmVsXCI6IHZhbHVlLnN1X2NvcnBvcmF0ZW5hbWUsIFwidmFsdWVcIjogdmFsdWUuc3VfaWQgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAkc2NvcGUuc3VfaWRvcHRpb25zKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vJHNjb3BlLnVwZGF0ZUZhaWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XTtcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oYW5ndWxhcil7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIFxuICAgIHJldHVybiBbJyRodHRwJywgJyRxJywgICckc3RhdGVQYXJhbXMnLCBmdW5jdGlvbigkaHR0cCwgJHEsICRzdGF0ZVBhcmFtcyl7XG4gICAgICAgIHZhciBmYWN0b3J5ID0ge307XG4gICAgICAgIGZhY3RvcnkuYWRkID0gZnVuY3Rpb24ocGFfanNvbmIpIHtcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gJGh0dHAucG9zdCgnbW9kdWxlcy9wYXBlci9tb2R1bGVzL3BhcGVyLmFkZC9wYXBlci5hZGQubWRsLmFkZC5waHAnLCB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICAgICAgcGFfanNvbmI6IHBhX2pzb25iXG4gICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XCJzdGF0dXNcIjogZmFsc2V9O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeS5nZXRTdXBwbGllcnMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gJGh0dHAuZ2V0KCdtb2R1bGVzL3BhcGVyL21vZHVsZXMvcGFwZXIuYWRkL3BhcGVyLmFkZC5tZGwuZ2V0U3VwcGxpZXJzLnBocCcpXG4gICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZyl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1wic3RhdHVzXCI6IGZhbHNlfTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBmYWN0b3J5O1xuICAgIH1dO1xuICAgIFxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oYW5ndWxhcil7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIFxuICAgIHJldHVybiBhbmd1bGFyLm1vZHVsZSgnYXBwLnBhcGVyLnVwZGF0ZScsW10pXG5cbiAgICAuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJyxcbiAgICBmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdwYXBlclVwZGF0ZScsIHtcbiAgICAgICAgICAgIHVybDonL3BhcGVyL3VwZGF0ZS86cGFfaWQnLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmwgOiAnYXBwL3BhcGVyL21vZHVsZXMvcGFwZXIudXBkYXRlL3BhcGVyLnVwZGF0ZS52aWV3Lmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlciA6ICdwYXBlclVwZGF0ZUN0cmwnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHJlcXVpcmVzTG9naW46IHRydWVcbiAgICAgICAgICAgIH0gICAgXG4gICAgICAgIH0pO1xuICAgIH1dKVxuXG4gICAgLmZhY3RvcnkoJ3BhcGVyVXBkYXRlRmFjJyxyZXF1aXJlKCcuL3BhcGVyLnVwZGF0ZS5mYWMnKSlcblxuICAgIC5jb250cm9sbGVyKCdwYXBlclVwZGF0ZUN0cmwnLHJlcXVpcmUoJy4vcGFwZXIudXBkYXRlLmN0cmwnKSlcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIiA6IFwiYWN0dWFsaXphciBwYXBlbFwiLFxuICAgICAgICAgICAgICAgIH0iLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRzY29wZScsICdwYXBlclVwZGF0ZUZhYycsICckbG9jYXRpb24nLCAnaTE4bkZpbHRlcicsXG4gICAgICAgIGZ1bmN0aW9uICgkc2NvcGUsIHBhcGVyVXBkYXRlRmFjLCAkbG9jYXRpb24sIGkxOG5GaWx0ZXIpIHtcblxuICAgICAgICAgICAgJHNjb3BlLm9uU3VibWl0ID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgcGFwZXJVcGRhdGVGYWMudXBkYXRlKCRzY29wZS5mbURhdGEpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb21pc2UuZGF0YSA9PSBcIjFcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9wYXBlcicpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnVwZGF0ZUZhaWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAkc2NvcGUucGFfc3RhdHVzb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJwYXBlci5maWVsZHMucGFfc3RhdHVzb3B0aW9uc1wiKTtcbiAgICAgICAgICAgICRzY29wZS5wYV90eXBlb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJwYXBlci5maWVsZHMucGFfdHlwZW9wdGlvbnNcIik7XG4gICAgICAgICAgICAkc2NvcGUucGFfbWVhc3VyZW9wdGlvbnMgPSBpMThuRmlsdGVyKFwicGFwZXIuZmllbGRzLnBhX21lYXN1cmVvcHRpb25zXCIpO1xuXG4gICAgICAgICAgICAkc2NvcGUuJG9uKCckdmlld0NvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgLy8gdGhpcyBjb2RlIGlzIGV4ZWN1dGVkIGFmdGVyIHRoZSB2aWV3IGlzIGxvYWRlZFxuICAgICAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBwYXBlclVwZGF0ZUZhYy5kYXRhKCkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc09iamVjdChhbmd1bGFyLmZyb21Kc29uKHByb21pc2UuZGF0YSkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZm1EYXRhID0gYW5ndWxhci5mcm9tSnNvbihwcm9taXNlLmRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhcGVyVXBkYXRlRmFjLmdldFN1cHBsaWVycygpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5zdV9pZG9wdGlvbnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2gocHJvbWlzZS5kYXRhLCBmdW5jdGlvbiAodmFsdWUsIGtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnB1c2goeyBcImxhYmVsXCI6IHZhbHVlLnN1X2NvcnBvcmF0ZW5hbWUsIFwidmFsdWVcIjogdmFsdWUuc3VfaWQgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgJHNjb3BlLnN1X2lkb3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vJHNjb3BlLnVwZGF0ZUZhaWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1dO1xuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRodHRwJywgJyRxJywgICckc3RhdGVQYXJhbXMnLCBmdW5jdGlvbiAoJGh0dHAsICRxLCAkc3RhdGVQYXJhbXMpIHtcbiAgICAgICAgdmFyIGZhY3RvcnkgPSB7fTtcbiAgICAgICAgZmFjdG9yeS5kYXRhID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoXG4gICAgICAgICAgICAgICAgJGh0dHAucG9zdCgnbW9kdWxlcy9wYXBlci9tb2R1bGVzL3BhcGVyLnVwZGF0ZS9wYXBlci51cGRhdGUubWRsLmdldHBhcGVyLnBocCcsIHtcbiAgICAgICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgICAgICBwYV9pZDogJHN0YXRlUGFyYW1zLnBhX2lkXG4gICAgICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICBmYWN0b3J5LnVwZGF0ZSA9IGZ1bmN0aW9uIChwYV9qc29uYikge1xuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoXG4gICAgICAgICAgICAgICAgJGh0dHAucG9zdCgnbW9kdWxlcy9wYXBlci9tb2R1bGVzL3BhcGVyLnVwZGF0ZS9wYXBlci51cGRhdGUubWRsLnVwZGF0ZS5waHAnLCB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICAgICAgcGFfaWQ6ICRzdGF0ZVBhcmFtcy5wYV9pZCxcbiAgICAgICAgICAgICAgICAgICAgcGFfanNvbmI6IHBhX2pzb25iXG4gICAgICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICBmYWN0b3J5LmdldFN1cHBsaWVycyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gJGh0dHAuZ2V0KCdtb2R1bGVzL3BhcGVyL21vZHVsZXMvcGFwZXIuYWRkL3BhcGVyLmFkZC5tZGwuZ2V0U3VwcGxpZXJzLnBocCcpXG4gICAgICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZmFjdG9yeTtcbiAgICB9XTtcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oYW5ndWxhcil7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIFxuICAgIHJldHVybiBbJyRzY29wZScsICdwYXBlckZhYycsICdpMThuRmlsdGVyJyxcbiAgICBmdW5jdGlvbiAoJHNjb3BlLCBwYXBlckZhYywgaTE4bkZpbHRlcikge1xuICAgIFxuICAgICAgICAkc2NvcGUubGFiZWxzID0gT2JqZWN0LmtleXMoaTE4bkZpbHRlcihcInBhcGVyLmxhYmVsc1wiKSk7XG4gICAgICAgICRzY29wZS5jb2x1bW5zID0gaTE4bkZpbHRlcihcInBhcGVyLmNvbHVtbnNcIik7XG4gICAgICAgIFxuICAgICAgICAvLyBmb3JtYXRJdGVtIGV2ZW50IGhhbmRsZXJcbiAgICAgICAgdmFyIHBhX2lkO1xuICAgICAgICAkc2NvcGUuZm9ybWF0SXRlbSA9IGZ1bmN0aW9uKHMsIGUsIGNlbGwpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKGUucGFuZWwuY2VsbFR5cGUgPT0gd2lqbW8uZ3JpZC5DZWxsVHlwZS5Sb3dIZWFkZXIpIHtcbiAgICAgICAgICAgICAgICBlLmNlbGwudGV4dENvbnRlbnQgPSBlLnJvdysxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBzLnJvd3MuZGVmYXVsdFNpemUgPSAzMDtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gYWRkIEJvb3RzdHJhcCBodG1sXG4gICAgICAgICAgICBpZiAoKGUucGFuZWwuY2VsbFR5cGUgPT0gd2lqbW8uZ3JpZC5DZWxsVHlwZS5DZWxsKSAmJiAoZS5jb2wgPT0gMCkpIHtcbiAgICAgICAgICAgICAgICBwYV9pZCA9IGUucGFuZWwuZ2V0Q2VsbERhdGEoZS5yb3csMSxmYWxzZSk7XG4gICAgICAgICAgICAgICAgZS5jZWxsLnN0eWxlLm92ZXJmbG93ID0gJ3Zpc2libGUnO1xuICAgICAgICAgICAgICAgIGUuY2VsbC5pbm5lckhUTUwgPSAnPGRpdiBjbGFzcz1cImJ0bi1ncm91cCBidG4tZ3JvdXAtanVzdGlmaWVkXCIgcm9sZT1cImdyb3VwXCIgYXJpYS1sYWJlbD1cIi4uLlwiPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJ0bi1ncm91cFwiIHJvbGU9XCJncm91cFwiPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIjL3BhcGVyL3VwZGF0ZS8nK3BhX2lkKydcIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdCBidG4teHNcIiBuZy1jbGljaz1cImVkaXQoJGl0ZW0ucGFfaWQpXCI+RWRpdGFyPC9hPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2Pic7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vIGJpbmQgY29sdW1ucyB3aGVuIGdyaWQgaXMgaW5pdGlhbGl6ZWRcbiAgICAgICAgJHNjb3BlLmluaXRHcmlkID0gZnVuY3Rpb24ocywgZSkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAkc2NvcGUubGFiZWxzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNvbCA9IG5ldyB3aWptby5ncmlkLkNvbHVtbigpO1xuICAgICAgICAgICAgICAgIGNvbC5iaW5kaW5nID0gJHNjb3BlLmNvbHVtbnNbaV07XG4gICAgICAgICAgICAgICAgY29sLmhlYWRlciA9IGkxOG5GaWx0ZXIoXCJwYXBlci5sYWJlbHMuXCIgKyAkc2NvcGUubGFiZWxzW2ldKTtcbiAgICAgICAgICAgICAgICBjb2wud29yZFdyYXAgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBjb2wud2lkdGggPSAxNTA7XG4gICAgICAgICAgICAgICAgcy5jb2x1bW5zLnB1c2goY29sKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgLy8gY3JlYXRlIHRoZSB0b29sdGlwIG9iamVjdFxuICAgICAgICAkc2NvcGUuJHdhdGNoKCdnZ0dyaWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoJHNjb3BlLmdnR3JpZCkge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBzdG9yZSByZWZlcmVuY2UgdG8gZ3JpZFxuICAgICAgICAgICAgICAgIHZhciBmbGV4ID0gJHNjb3BlLmdnR3JpZDtcblxuICAgICAgICAgICAgICAgIC8vIGNyZWF0ZSB0b29sdGlwXG4gICAgICAgICAgICAgICAgdmFyIHRpcCA9IG5ldyB3aWptby5Ub29sdGlwKCksXG4gICAgICAgICAgICAgICAgICAgIHJuZyA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICAvLyBtb25pdG9yIHRoZSBtb3VzZSBvdmVyIHRoZSBncmlkXG4gICAgICAgICAgICAgICAgZmxleC5ob3N0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBodCA9IGZsZXguaGl0VGVzdChldnQpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWh0LnJhbmdlLmVxdWFscyhybmcpKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG5ldyBjZWxsIHNlbGVjdGVkLCBzaG93IHRvb2x0aXBcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChodC5jZWxsVHlwZSA9PSB3aWptby5ncmlkLkNlbGxUeXBlLkNlbGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBybmcgPSBodC5yYW5nZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29sID0gZmxleC5jb2x1bW5zW3JuZy5jb2xdLmhlYWRlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2VsbEVsZW1lbnQgPSBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KGV2dC5jbGllbnRYLCBldnQuY2xpZW50WSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNlbGxCb3VuZHMgPSB3aWptby5SZWN0LmZyb21Cb3VuZGluZ1JlY3QoY2VsbEVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhID0gd2lqbW8uZXNjYXBlSHRtbChmbGV4LmdldENlbGxEYXRhKHJuZy5yb3csIHJuZy5jb2wsIHRydWUpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlwQ29udGVudCA9IGNvbCArICc6IFwiPGI+JyArIGRhdGEgKyAnPC9iPlwiJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2VsbEVsZW1lbnQuY2xhc3NOYW1lLmluZGV4T2YoJ3dqLWNlbGwnKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpcC5zaG93KGZsZXguaG9zdEVsZW1lbnQsIHRpcENvbnRlbnQsIGNlbGxCb3VuZHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpcC5oaWRlKCk7IC8vIGNlbGwgbXVzdCBiZSBiZWhpbmQgc2Nyb2xsIGJhci4uLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGZsZXguaG9zdEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRpcC5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgIHJuZyA9IG51bGw7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRzY29wZS4kb24oJyR2aWV3Q29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vIHRoaXMgY29kZSBpcyBleGVjdXRlZCBhZnRlciB0aGUgdmlldyBpcyBsb2FkZWRcbiAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgIHBhcGVyRmFjLmRhdGEoKS50aGVuKGZ1bmN0aW9uKHByb21pc2Upe1xuICAgICAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgaWYoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmRhdGEgPSBuZXcgd2lqbW8uY29sbGVjdGlvbnMuQ29sbGVjdGlvblZpZXcocHJvbWlzZS5kYXRhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgIH0pO1xuICAgIH1dO1xuICAgIFxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckaHR0cCcsICckcScsICBmdW5jdGlvbiAoJGh0dHAsICRxKSB7XG4gICAgICAgIHZhciBmYWN0b3J5ID0ge307XG4gICAgICAgIGZhY3RvcnkuZGF0YSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKFxuICAgICAgICAgICAgICAgICRodHRwLnBvc3QoJ21vZHVsZXMvcGFwZXIvcGFwZXIubWRsLmdldHBhcGVycy5waHAnLCB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICAgICAgcHJvY2Nlc19pZDogbmV3IERhdGUoKS5nZXRNaWxsaXNlY29uZHMoKVxuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZmFjdG9yeTtcbiAgICB9XTtcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oYW5ndWxhcil7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIFxuICAgIHJldHVybiBhbmd1bGFyLm1vZHVsZSgnYXBwLnByb2R1Y3QnLFtcbiAgICAgICAgcmVxdWlyZSgnLi9tb2R1bGVzL3Byb2R1Y3RPZmZzZXRHZW5lcmFsLmFkZCcpLm5hbWUsXG4gICAgICAgIHJlcXVpcmUoJy4vbW9kdWxlcy9wcm9kdWN0T2Zmc2V0R2VuZXJhbC51cGRhdGUnKS5uYW1lLFxuICAgICAgICByZXF1aXJlKCcuL21vZHVsZXMvcHJvZHVjdE9mZnNldFBhZ2luYXRlZC5hZGQnKS5uYW1lLFxuICAgICAgICAvL3JlcXVpcmUoJy4vbW9kdWxlcy9wcm9kdWN0T2Zmc2V0UGFnaW5hdGVkLnVwZGF0ZScpLm5hbWVcbiAgICBdKVxuXG4gICAgLmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsXG4gICAgZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgncHJvZHVjdCcsIHtcbiAgICAgICAgICAgIHVybDonL3Byb2R1Y3QvOmNsX2lkJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsIDogJ2FwcC9wcm9kdWN0L3Byb2R1Y3Qudmlldy5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXIgOiAncHJvZHVjdEN0cmwnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHJlcXVpcmVzTG9naW46IHRydWVcbiAgICAgICAgICAgIH0gICAgXG4gICAgICAgIH0pO1xuICAgIH1dKVxuXG4gICAgLmZhY3RvcnkoJ3Byb2R1Y3RGYWMnLHJlcXVpcmUoJy4vcHJvZHVjdC5mYWMnKSlcblxuICAgIC5jb250cm9sbGVyKCdwcm9kdWN0Q3RybCcscmVxdWlyZSgnLi9wcm9kdWN0LmN0cmwnKSlcbiAgICBcbn0pKGFuZ3VsYXIpO1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIiA6IFwiUHJvZHVjdG9zXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibGFiZWxzXCI6e1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1pZFwiOiBcIklEIHByb2R1Y3RvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsLWlkXCI6IFwiSUQgQ2xpZW50ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1wYXJ0bm9cIjogXCJOby4gUGFydGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItY29kZVwiOiBcIkNvZGlnb1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1uYW1lXCI6IFwiTm9tYnJlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLXByb2Nlc3NcIjogXCJQcm9jZXNvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLXR5cGVcIjogXCJUaXBvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLXN0YXR1c1wiOiBcIkVzdGF0dXNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItZGF0ZVwiOiBcIkZlY2hhXCIsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIFwiY29sdW1uc1wiOltcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfaWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xfaWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfcGFydG5vXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX2NvZGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfbmFtZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9wcm9jZXNzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX3R5cGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfc3RhdHVzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX2RhdGVcIixcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgIFwiZmllbGRzXCIgOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oYW5ndWxhcil7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIFxuICAgIHJldHVybiBhbmd1bGFyLm1vZHVsZSgnYXBwLnByb2R1Y3RPZmZzZXRHZW5lcmFsLmFkZCcsW10pXG5cbiAgICAuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJyxcbiAgICBmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdwcm9kdWN0T2Zmc2V0R2VuZXJhbEFkZCcsIHtcbiAgICAgICAgICAgIHVybDonL3Byb2R1Y3QvYWRkL29mZnNldC9nZW5lcmFsLzpjbF9pZCcsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybCA6ICdhcHAvcHJvZHVjdC9tb2R1bGVzL3Byb2R1Y3RPZmZzZXRHZW5lcmFsLmFkZC9wcm9kdWN0T2Zmc2V0R2VuZXJhbC5hZGQudmlldy5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXIgOiAncHJvZHVjdE9mZnNldEdlbmVyYWxBZGRDdHJsJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICByZXF1aXJlc0xvZ2luOiB0cnVlXG4gICAgICAgICAgICB9ICAgIFxuICAgICAgICB9KTtcbiAgICB9XSlcblxuICAgIC5mYWN0b3J5KCdwcm9kdWN0T2Zmc2V0R2VuZXJhbEFkZEZhYycscmVxdWlyZSgnLi9wcm9kdWN0T2Zmc2V0R2VuZXJhbC5hZGQuZmFjJykpXG5cbiAgICAuY29udHJvbGxlcigncHJvZHVjdE9mZnNldEdlbmVyYWxBZGRDdHJsJyxyZXF1aXJlKCcuL3Byb2R1Y3RPZmZzZXRHZW5lcmFsLmFkZC5jdHJsJykpXG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCIgOiBcImFncmVnYXIgcHJvZHVjdG9cIixcbiAgICAgICAgICAgICAgICAgICAgXCJsYWJlbHNcIjp7XG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLWlkXCI6IFwiSUQgcHJvZHVjdG9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2wtaWRcIjogXCJJRCBjbGllbnRlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLXByb2Nlc3NcIjogXCJQcm9jZXNvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLXR5cGVcIjogXCJUaXBvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLXBhcnRub1wiOiBcIk5vLiBwYXJ0ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1jb2RlXCI6IFwiQ29kaWdvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLWRlc2NyaXB0aW9uXCI6IFwiRGVzY3JpcGNpb25cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItZmluYWxzaXpld2lkdGhcIjogXCJBbmNob1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1maW5hbHNpemVoZWlnaHRcIjogXCJBbHRvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLWZpbmFsc2l6ZW1lYXN1cmVcIjogXCJNZWRpZGFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItaW5rZnJvbnRcIjogXCJGcmVudGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItaW5rYmFja1wiOiBcIlJldmVyc29cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicGEtaWRcIjogXCJJRCBwYXBlbFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1wYXBlcnNpemV3aWR0aFwiOiBcIkFuY2hvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLXBhcGVyc2l6ZWhlaWdodFwiOiBcIkFsdG9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItcGFwZXJzaXplbWVhc3VyZVwiOiBcIk1lZGlkYVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1wYXBlcmZvcm1hdHNxdHlcIjogXCJGb3JtYXRvc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci12YXJuaXNoXCI6IFwiQmFybml6XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLXZhcm5pc2h1dlwiOiBcIkJhcm5peiBVVlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci12YXJuaXNoZmluaXNoZWRcIjogXCJBY2FiYWRvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLWxhbWluYXRlXCI6IFwiTGFtaW5hZG9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItbGFtaW5hdGVmaW5pc2hlZFwiOiBcIkFjYWJhZG9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItbGFtaW5hdGVjYWxpYmVyXCI6IFwiQ2FsaWJyZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1sYW1pbmF0ZXNpZGVzXCI6IFwiQ2FyYXNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItZm9saW9cIjogXCJGb2xpb1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1wcmVjdXRcIjogXCJQcmVjb3J0ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1mb2xkXCI6IFwiRG9ibGV6XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLWRpZWN1dHRpbmdcIjogXCJTdWFqZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1kaWVjdXR0aW5ncXR5XCI6IFwiTm8uIFN1YWplc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1yZWluZm9yY2VtZW50XCI6IFwiUmVmdWVyem9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItY29yZFwiOiBcIkNvcmTDs25cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItd2lyZVwiOiBcIkFsw6FtYnJlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLWJsb2Nrc1wiOiBcIkJsb2Nrc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1zdGF0dXNcIjogXCJFc3RhdHVzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLWRhdGVcIjogXCJGZWNoYVwiLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBcImNvbHVtbnNcIjpbXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX2lkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsX2lkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX3Byb2Nlc3NcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfdHlwZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9wYXJ0bm9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfY29kZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9kZXNjcmlwdGlvblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9maW5hbHNpemV3aWR0aFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9maW5hbHNpemVoZWlnaHRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfZmluYWxzaXplbWVhc3VyZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9pbmtmcm9udFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9pbmtiYWNrXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInBhX2lkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX3BhcGVyc2l6ZXdpZHRoXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX3BhcGVyc2l6ZWhlaWdodFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9wYXBlcnNpemVtZWFzdXJlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX3BhcGVyZm9ybWF0c3F0eVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl92YXJuaXNoXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX3Zhcm5pc2h1dlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl92YXJuaXNoZmluaXNoZWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfbGFtaW5hdGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfbGFtaW5hdGVmaW5pc2hlZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9sYW1pbmF0ZWNhbGliZXJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfbGFtaW5hdGVzaWRlc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9mb2xpb1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9wcmVjdXRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfZm9sZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9kaWVjdXR0aW5nXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX2RpZWN1dHRpbmdxdHlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfcmVpbmZvcmNlbWVudFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9jb3JkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX3dpcmVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfYmxvY2tzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX3N0YXR1c1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9kYXRlXCIsXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICBcImZpZWxkc1wiIDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJfZmluYWxzaXplbWVhc3VyZW9wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcImNtXCIsXCJ2YWx1ZVwiOlwiY21cIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcInB1bGdhZGFzXCIsXCJ2YWx1ZVwiOlwiaW5cIn1cbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBwcl9pbmtmcm9udG9wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIjEgdGludGFcIixcInZhbHVlXCI6MX0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIjIgdGludGFzXCIsXCJ2YWx1ZVwiOjJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCIzIHRpbnRhc1wiLFwidmFsdWVcIjozfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiNCB0aW50YXNcIixcInZhbHVlXCI6NH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIjUgdGludGFzXCIsXCJ2YWx1ZVwiOjV9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCI2IHRpbnRhc1wiLFwidmFsdWVcIjo2fSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiNyB0aW50YXNcIixcInZhbHVlXCI6N30sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIjggdGludGFzXCIsXCJ2YWx1ZVwiOjh9LFxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHByX2lua2JhY2tvcHRpb25zIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCIxIHRpbnRhXCIsXCJ2YWx1ZVwiOjF9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCIyIHRpbnRhc1wiLFwidmFsdWVcIjoyfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiMyB0aW50YXNcIixcInZhbHVlXCI6M30sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIjQgdGludGFzXCIsXCJ2YWx1ZVwiOjR9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCI1IHRpbnRhc1wiLFwidmFsdWVcIjo1fSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiNiB0aW50YXNcIixcInZhbHVlXCI6Nn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIjcgdGludGFzXCIsXCJ2YWx1ZVwiOjd9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCI4IHRpbnRhc1wiLFwidmFsdWVcIjo4fSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBwcl9wYXBlcnNpemVtZWFzdXJlb3B0aW9ucyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiY21cIixcInZhbHVlXCI6XCJjbVwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwicHVsZ2FkYXNcIixcInZhbHVlXCI6XCJpblwifVxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHByX3Zhcm5pc2hvcHRpb25zIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJTaVwiLFwidmFsdWVcIjpcInllc1wifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiTm9cIixcInZhbHVlXCI6XCJub1wifVxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHByX3Zhcm5pc2h1dm9wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIlVuYSBjYXJhXCIsXCJ2YWx1ZVwiOlwib25lc2lkZVwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiRG9zIGNhcmFzXCIsXCJ2YWx1ZVwiOlwidHdvc2lkZXNcIn1cbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBwcl92YXJuaXNmaW5pc2hlZG9wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIk1hdGVcIixcInZhbHVlXCI6XCJtYXR0ZVwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiQnJpbGxhbnRlXCIsXCJ2YWx1ZVwiOlwiYnJpZ2h0XCJ9XG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJfbGFtaW5hdGVvcHRpb25zIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJTaVwiLFwidmFsdWVcIjpcInllc1wifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiTm9cIixcInZhbHVlXCI6XCJub1wifVxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHByX2xhbWluYXRlZmluaXNoZWRvcHRpb25zIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJNYXRlXCIsXCJ2YWx1ZVwiOlwibWF0dGVcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkJyaWxsYW50ZVwiLFwidmFsdWVcIjpcImJyaWdodFwifVxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHByX2xhbWluYXRlY2FsaWJlcm9wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIi4ybW1cIixcInZhbHVlXCI6XCIybW1cIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIi40bW1cIixcInZhbHVlXCI6XCI0bW1cIn1cbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBwcl9sYW1pbmF0ZXNpZGVzb3B0aW9ucyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiVW5hIGNhcmFcIixcInZhbHVlXCI6XCJvbmVzaWRlXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJEb3MgY2FyYXNcIixcInZhbHVlXCI6XCJ0d29zaWRlc1wifVxuICAgICAgICAgICAgICAgICAgICAgICAgXSxwcl9mb2xpb29wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIlNpXCIsXCJ2YWx1ZVwiOlwieWVzXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJOb1wiLFwidmFsdWVcIjpcIm5vXCJ9XG4gICAgICAgICAgICAgICAgICAgICAgICBdLHByX3ByZWN1dG9wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIk5vXCIsXCJ2YWx1ZVwiOlwibm9cIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkhvcml6b250YWxcIixcInZhbHVlXCI6XCJob3Jpem9udGFsXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJWZXJ0aWNhbFwiLFwidmFsdWVcIjpcInZlcnRpY2FsXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgXSxwcl9mb2xkb3B0aW9ucyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiVHJpcHRpY29cIixcInZhbHVlXCI6XCJ0cnlwdGljXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgXSxwcl9kaWVjdXR0aW5nb3B0aW9ucyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiU2lcIixcInZhbHVlXCI6XCJ5ZXNcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIk5vXCIsXCJ2YWx1ZVwiOlwibm9cIn1cbiAgICAgICAgICAgICAgICAgICAgICAgIF0scHJfcmVpbmZvcmNlbWVudG9wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIk5vXCIsXCJ2YWx1ZVwiOlwibm9cIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIlVub1wiLFwidmFsdWVcIjpcIm9uZVwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiRG9zXCIsXCJ2YWx1ZVwiOlwidHdvXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgXSxwcl9jb3Jkb3B0aW9ucyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiTm9cIixcInZhbHVlXCI6XCJub1wifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiQ29sb2NhZG9cIixcInZhbHVlXCI6XCJhbGxvY2F0ZWRcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIlNlcGFyYWRvXCIsXCJ2YWx1ZVwiOlwic2VwYXJhdGVkXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgXSxwcl93aXJlb3B0aW9ucyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiTm9cIixcInZhbHVlXCI6XCJub1wifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiQ29sb2NhZG9cIixcInZhbHVlXCI6XCJhbGxvY2F0ZWRcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIlNlcGFyYWRvXCIsXCJ2YWx1ZVwiOlwic2VwYXJhdGVkXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgXSxwcl9ibG9ja3NvcHRpb25zIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJOb1wiLFwidmFsdWVcIjpcIm5vXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCIyMFwiLFwidmFsdWVcIjpcIjIwXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCIyNVwiLFwidmFsdWVcIjpcIjI1XCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCI1MFwiLFwidmFsdWVcIjpcIjUwXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCI3NVwiLFwidmFsdWVcIjpcIjc1XCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCIxMDBcIixcInZhbHVlXCI6XCIxMDBcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJfc3RhdHVzb3B0aW9ucyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiQWN0aXZvXCIsXCJ2YWx1ZVwiOlwiQVwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiSW5hY3Rpdm9cIixcInZhbHVlXCI6XCJJXCJ9XG4gICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgcmV0dXJuIFsnJHNjb3BlJywgJ3Byb2R1Y3RPZmZzZXRHZW5lcmFsQWRkRmFjJywgJyRsb2NhdGlvbicsICdpMThuRmlsdGVyJywgJyRzdGF0ZVBhcmFtcycsXG4gICAgICAgIGZ1bmN0aW9uICgkc2NvcGUsIHByb2R1Y3RPZmZzZXRHZW5lcmFsQWRkRmFjLCAkbG9jYXRpb24sIGkxOG5GaWx0ZXIsICRzdGF0ZVBhcmFtcykge1xuICAgICAgICAgICAgJHNjb3BlLmZtRGF0YSA9IHt9O1xuICAgICAgICAgICAgJHNjb3BlLmZtRGF0YSA9IHsgXCJwcl9wcm9jZXNzXCI6IFwib2Zmc2V0XCIsIFwicHJfdHlwZVwiOiBcImdlbmVyYWxcIiwgXCJjbF9pZFwiOiBcIjZcIiwgXCJwcl9wYXJ0bm9cIjogXCJURVNULUFTQS5hc2FzOiAyMywzNFwiLCBcInByX2Rlc2NyaXB0aW9uXCI6IFwiZXN0ZSBlcyB1biBwcm9kdWN0byBkZSBwcnVlYmFcIiwgXCJwcl9maW5hbHNpemV3aWR0aFwiOiBcIjEwMC4wMFwiLCBcInByX2ZpbmFsc2l6ZWhlaWdodFwiOiBcIjIwMC4wMFwiLCBcInByX2ZpbmFsc2l6ZW1lYXN1cmVcIjogXCJjbVwiLCBcInByX2lua2Zyb250XCI6IDIsIFwicHJfaW5rc2Zyb250XCI6IHsgXCIwXCI6IDIsIFwiMVwiOiAyIH0sIFwicHJfaW5rYmFja1wiOiAzLCBcInByX2lua3NiYWNrXCI6IHsgXCIwXCI6IDIsIFwiMVwiOiAzLCBcIjJcIjogMyB9LCBcInBhX2lkXCI6IDEsIFwicHJfcGFwZXJmb3JtYXRzcXR5XCI6IFwiMTIzXCIsIFwicHJfcGFwZXJzaXpld2lkdGhcIjogXCIxMDAuMDBcIiwgXCJwcl9wYXBlcnNpemVoZWlnaHRcIjogXCIyMDAuMDBcIiwgXCJwcl9wYXBlcnNpemVtZWFzdXJlXCI6IFwiY21cIiwgXCJwcl92YXJuaXNoXCI6IFwieWVzXCIsIFwicHJfdmFybmlzaHV2XCI6IFwib25lc2lkZVwiLCBcInByX3Zhcm5pc2hmaW5pc2hlZFwiOiBcIm1hdHRlXCIsIFwicHJfbGFtaW5hdGVcIjogXCJ5ZXNcIiwgXCJwcl9sYW1pbmF0ZWZpbmlzaGVkXCI6IFwibWF0dGVcIiwgXCJwcl9sYW1pbmF0ZWNhbGliZXJcIjogXCIybW1cIiwgXCJwcl9wcmVjdXRcIjogXCJob3Jpem9udGFsXCIsIFwicHJfZm9sZFwiOiBcInRyeXB0aWNcIiwgXCJwcl9kaWVjdXR0aW5nXCI6IFwieWVzXCIsIFwicHJfZGllY3V0dGluZ3F0eVwiOiBcIjVcIiwgXCJwcl9yZWluZm9yY2VtZW50XCI6IFwib25lXCIsIFwicHJfY29yZFwiOiBcImFsbG9jYXRlZFwiLCBcInByX3dpcmVcIjogXCJhbGxvY2F0ZWRcIiwgXCJwcl9mb2xpb1wiOiBcInllc1wiLCBcInByX2Jsb2Nrc1wiOiBcIjEwMFwiLCBcInByX3N0YXR1c1wiOiBcIkFcIiB9O1xuICAgICAgICAgICAgJHNjb3BlLmZtRGF0YS5wcl9wcm9jZXNzID0gJ29mZnNldCc7XG4gICAgICAgICAgICAkc2NvcGUuZm1EYXRhLnByX3R5cGUgPSAnZ2VuZXJhbCc7XG4gICAgICAgICAgICAkc2NvcGUuZm1EYXRhLmNsX2lkID0gJHN0YXRlUGFyYW1zLmNsX2lkO1xuXG4gICAgICAgICAgICAkc2NvcGUub25TdWJtaXQgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICBwcm9kdWN0T2Zmc2V0R2VuZXJhbEFkZEZhYy5hZGQoJHNjb3BlLmZtRGF0YSkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocHJvbWlzZS5kYXRhLnJvd0NvdW50ID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3Byb2R1Y3QvJyskc3RhdGVQYXJhbXMuY2xfaWQpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnVwZGF0ZUZhaWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAkc2NvcGUucHJfZmluYWxzaXplbWVhc3VyZW9wdGlvbnMgPSBpMThuRmlsdGVyKFwicHJvZHVjdE9mZnNldEdlbmVyYWwtYWRkLmZpZWxkcy5wcl9maW5hbHNpemVtZWFzdXJlb3B0aW9uc1wiKTtcbiAgICAgICAgICAgICRzY29wZS5wcl9pbmtmcm9udG9wdGlvbnMgPSBpMThuRmlsdGVyKFwicHJvZHVjdE9mZnNldEdlbmVyYWwtYWRkLmZpZWxkcy5wcl9pbmtmcm9udG9wdGlvbnNcIik7XG4gICAgICAgICAgICAkc2NvcGUucHJfaW5rYmFja29wdGlvbnMgPSBpMThuRmlsdGVyKFwicHJvZHVjdE9mZnNldEdlbmVyYWwtYWRkLmZpZWxkcy5wcl9pbmtiYWNrb3B0aW9uc1wiKTtcbiAgICAgICAgICAgICRzY29wZS5wcl9wYXBlcnNpemVtZWFzdXJlb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJwcm9kdWN0T2Zmc2V0R2VuZXJhbC1hZGQuZmllbGRzLnByX3BhcGVyc2l6ZW1lYXN1cmVvcHRpb25zXCIpO1xuICAgICAgICAgICAgJHNjb3BlLnByX3Zhcm5pc2hvcHRpb25zID0gaTE4bkZpbHRlcihcInByb2R1Y3RPZmZzZXRHZW5lcmFsLWFkZC5maWVsZHMucHJfdmFybmlzaG9wdGlvbnNcIik7XG4gICAgICAgICAgICAkc2NvcGUucHJfdmFybmlzaHV2b3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJwcm9kdWN0T2Zmc2V0R2VuZXJhbC1hZGQuZmllbGRzLnByX3Zhcm5pc2h1dm9wdGlvbnNcIik7XG4gICAgICAgICAgICAkc2NvcGUucHJfdmFybmlzZmluaXNoZWRvcHRpb25zID0gaTE4bkZpbHRlcihcInByb2R1Y3RPZmZzZXRHZW5lcmFsLWFkZC5maWVsZHMucHJfdmFybmlzZmluaXNoZWRvcHRpb25zXCIpO1xuICAgICAgICAgICAgJHNjb3BlLnByX2xhbWluYXRlb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJwcm9kdWN0T2Zmc2V0R2VuZXJhbC1hZGQuZmllbGRzLnByX2xhbWluYXRlb3B0aW9uc1wiKTtcbiAgICAgICAgICAgICRzY29wZS5wcl9sYW1pbmF0ZWZpbmlzaGVkb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJwcm9kdWN0T2Zmc2V0R2VuZXJhbC1hZGQuZmllbGRzLnByX2xhbWluYXRlZmluaXNoZWRvcHRpb25zXCIpO1xuICAgICAgICAgICAgJHNjb3BlLnByX2xhbWluYXRlY2FsaWJlcm9wdGlvbnMgPSBpMThuRmlsdGVyKFwicHJvZHVjdE9mZnNldEdlbmVyYWwtYWRkLmZpZWxkcy5wcl9sYW1pbmF0ZWNhbGliZXJvcHRpb25zXCIpO1xuICAgICAgICAgICAgJHNjb3BlLnByX2xhbWluYXRlc2lkZXNvcHRpb25zID0gaTE4bkZpbHRlcihcInByb2R1Y3RPZmZzZXRHZW5lcmFsLWFkZC5maWVsZHMucHJfbGFtaW5hdGVzaWRlc29wdGlvbnNcIik7XG4gICAgICAgICAgICAkc2NvcGUucHJfZm9saW9vcHRpb25zID0gaTE4bkZpbHRlcihcInByb2R1Y3RPZmZzZXRHZW5lcmFsLWFkZC5maWVsZHMucHJfZm9saW9vcHRpb25zXCIpO1xuICAgICAgICAgICAgJHNjb3BlLnByX3ByZWN1dG9wdGlvbnMgPSBpMThuRmlsdGVyKFwicHJvZHVjdE9mZnNldEdlbmVyYWwtYWRkLmZpZWxkcy5wcl9wcmVjdXRvcHRpb25zXCIpO1xuICAgICAgICAgICAgJHNjb3BlLnByX2ZvbGRvcHRpb25zID0gaTE4bkZpbHRlcihcInByb2R1Y3RPZmZzZXRHZW5lcmFsLWFkZC5maWVsZHMucHJfZm9sZG9wdGlvbnNcIik7XG4gICAgICAgICAgICAkc2NvcGUucHJfZGllY3V0dGluZ29wdGlvbnMgPSBpMThuRmlsdGVyKFwicHJvZHVjdE9mZnNldEdlbmVyYWwtYWRkLmZpZWxkcy5wcl9kaWVjdXR0aW5nb3B0aW9uc1wiKTtcbiAgICAgICAgICAgICRzY29wZS5wcl9yZWluZm9yY2VtZW50b3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJwcm9kdWN0T2Zmc2V0R2VuZXJhbC1hZGQuZmllbGRzLnByX3JlaW5mb3JjZW1lbnRvcHRpb25zXCIpO1xuICAgICAgICAgICAgJHNjb3BlLnByX2NvcmRvcHRpb25zID0gaTE4bkZpbHRlcihcInByb2R1Y3RPZmZzZXRHZW5lcmFsLWFkZC5maWVsZHMucHJfY29yZG9wdGlvbnNcIik7XG4gICAgICAgICAgICAkc2NvcGUucHJfd2lyZW9wdGlvbnMgPSBpMThuRmlsdGVyKFwicHJvZHVjdE9mZnNldEdlbmVyYWwtYWRkLmZpZWxkcy5wcl93aXJlb3B0aW9uc1wiKTtcbiAgICAgICAgICAgICRzY29wZS5wcl9ibG9ja3NvcHRpb25zID0gaTE4bkZpbHRlcihcInByb2R1Y3RPZmZzZXRHZW5lcmFsLWFkZC5maWVsZHMucHJfYmxvY2tzb3B0aW9uc1wiKTtcbiAgICAgICAgICAgICRzY29wZS5wcl9zdGF0dXNvcHRpb25zID0gaTE4bkZpbHRlcihcInByb2R1Y3RPZmZzZXRHZW5lcmFsLWFkZC5maWVsZHMucHJfc3RhdHVzb3B0aW9uc1wiKTtcbiAgICAgICAgXG4gICAgICAgICAgICAvLyBjcmVhdGUgZnJvbnQgaW5rIGZpZWxkc1xuICAgICAgICAgICAgJHNjb3BlLiR3YXRjaCgnZm1EYXRhLnByX2lua2Zyb250JywgZnVuY3Rpb24gKG5ld1ZhbHVlLCBvbGRWYWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICgkc2NvcGUuZm1EYXRhLnByX2lua2Zyb250ICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZnJvbnRJbmtzID0gbmV3IEFycmF5KG5ld1ZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvbGRWYWx1ZTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZm1EYXRhWydwcl9pbmtzZnJvbnQnXVtpXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgICAgIC8vIGNyZWF0ZSBiYWNrIGluayBmaWVsZHNcbiAgICAgICAgICAgICRzY29wZS4kd2F0Y2goJ2ZtRGF0YS5wcl9pbmtiYWNrJywgZnVuY3Rpb24gKG5ld1ZhbHVlLCBvbGRWYWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICgkc2NvcGUuZm1EYXRhLnByX2lua2JhY2sgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5iYWNrSW5rcyA9IG5ldyBBcnJheShuZXdWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb2xkVmFsdWU7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmZtRGF0YVsncHJfaW5rc2JhY2snXVtpXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkc2NvcGUuJG9uKCckdmlld0NvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgLy8gdGhpcyBjb2RlIGlzIGV4ZWN1dGVkIGFmdGVyIHRoZSB2aWV3IGlzIGxvYWRlZFxuICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgcHJvZHVjdE9mZnNldEdlbmVyYWxBZGRGYWMuZ2V0Q2xpZW50KCkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc09iamVjdChwcm9taXNlLmRhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuY2xpZW50ID0gcHJvbWlzZS5kYXRhO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBwcm9kdWN0T2Zmc2V0R2VuZXJhbEFkZEZhYy5nZXRJbmtzKCkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5wcl9pbmtvcHRpb25zID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2gocHJvbWlzZS5kYXRhLCBmdW5jdGlvbiAodmFsdWUsIGtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHVzaCh7IFwibGFiZWxcIjogdmFsdWUuaW5fY29kZSwgXCJ2YWx1ZVwiOiB2YWx1ZS5pbl9pZCB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sICRzY29wZS5wcl9pbmtvcHRpb25zKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vJHNjb3BlLnVwZGF0ZUZhaWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBwcm9kdWN0T2Zmc2V0R2VuZXJhbEFkZEZhYy5nZXRQYXBlcnMoKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnBhX2lkb3B0aW9ucyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHByb21pc2UuZGF0YSwgZnVuY3Rpb24gKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnB1c2goeyBcImxhYmVsXCI6IHZhbHVlLnBhX2NvZGUsIFwidmFsdWVcIjogdmFsdWUucGFfaWQgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAkc2NvcGUucGFfaWRvcHRpb25zKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vJHNjb3BlLnVwZGF0ZUZhaWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XTtcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckaHR0cCcsICckcScsICAnJHN0YXRlUGFyYW1zJywgZnVuY3Rpb24gKCRodHRwLCAkcSwgJHN0YXRlUGFyYW1zKSB7XG4gICAgICAgIHZhciBmYWN0b3J5ID0ge307XG4gICAgICAgIGZhY3RvcnkuZ2V0Q2xpZW50ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoXG4gICAgICAgICAgICAgICAgJGh0dHAucG9zdCgnL2FwaS9wcm9kdWN0L29mZnNldC9nZW5lcmFsL2NsaWVudCcsIHtcbiAgICAgICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgICAgICBjbF9pZDogJHN0YXRlUGFyYW1zLmNsX2lkXG4gICAgICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkuZ2V0SW5rcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKFxuICAgICAgICAgICAgICAgICRodHRwLnBvc3QoJy9hcGkvcHJvZHVjdC9vZmZzZXQvZ2VuZXJhbC9pbmsnLCB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICAgICAgcHJvY2Nlc19pZDogbmV3IERhdGUoKS5nZXRNaWxsaXNlY29uZHMoKVxuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICBmYWN0b3J5LmdldFBhcGVycyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKFxuICAgICAgICAgICAgICAgICRodHRwLnBvc3QoJy9hcGkvcHJvZHVjdC9vZmZzZXQvZ2VuZXJhbC9wYXBlcicsIHtcbiAgICAgICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgICAgICBwcm9jY2VzX2lkOiBuZXcgRGF0ZSgpLmdldE1pbGxpc2Vjb25kcygpXG4gICAgICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkuYWRkID0gZnVuY3Rpb24gKHByX2pzb25iKSB7XG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9ICRodHRwLnBvc3QoJy9hcGkvcHJvZHVjdC9hZGQnLCB7XG4gICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgIHByX2pzb25iOiBwcl9qc29uYlxuICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZmFjdG9yeTtcbiAgICB9XTtcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oYW5ndWxhcil7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIFxuICAgIHJldHVybiBhbmd1bGFyLm1vZHVsZSgnYXBwLnByb2R1Y3RPZmZzZXRHZW5lcmFsLnVwZGF0ZScsW10pXG5cbiAgICAuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJyxcbiAgICBmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdwcm9kdWN0T2Zmc2V0R2VuZXJhbFVwZGF0ZScsIHtcbiAgICAgICAgICAgIHVybDonL3Byb2R1Y3Qvb2Zmc2V0L2dlbmVyYWwvdXBkYXRlLzpjbF9pZC86cHJfaWQnLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmwgOiAnYXBwL3Byb2R1Y3QvbW9kdWxlcy9wcm9kdWN0T2Zmc2V0R2VuZXJhbC51cGRhdGUvcHJvZHVjdE9mZnNldEdlbmVyYWwudXBkYXRlLnZpZXcuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyIDogJ3Byb2R1Y3RPZmZzZXRHZW5lcmFsVXBkYXRlQ3RybCcsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgcmVxdWlyZXNMb2dpbjogdHJ1ZVxuICAgICAgICAgICAgfSAgICBcbiAgICAgICAgfSk7XG4gICAgfV0pXG5cbiAgICAuZmFjdG9yeSgncHJvZHVjdE9mZnNldEdlbmVyYWxVcGRhdGVGYWMnLHJlcXVpcmUoJy4vcHJvZHVjdE9mZnNldEdlbmVyYWwudXBkYXRlLmZhYycpKVxuXG4gICAgLmNvbnRyb2xsZXIoJ3Byb2R1Y3RPZmZzZXRHZW5lcmFsVXBkYXRlQ3RybCcscmVxdWlyZSgnLi9wcm9kdWN0T2Zmc2V0R2VuZXJhbC51cGRhdGUuY3RybCcpKVxuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0ID0ge30iLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbihhbmd1bGFyKXtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgXG4gICAgcmV0dXJuIFsnJHNjb3BlJywgJ3Byb2R1Y3RPZmZzZXRHZW5lcmFsVXBkYXRlRmFjJywgJyRsb2NhdGlvbicsICdpMThuRmlsdGVyJywgJyRzdGF0ZVBhcmFtcycsICckaW50ZXJ2YWwnLFxuICAgIGZ1bmN0aW9uICgkc2NvcGUsIHByb2R1Y3RPZmZzZXRHZW5lcmFsVXBkYXRlRmFjLCAkbG9jYXRpb24sIGkxOG5GaWx0ZXIsICRzdGF0ZVBhcmFtcywgJGludGVydmFsKSB7XG4gICAgICAgIFxuICAgICAgICAkc2NvcGUub25TdWJtaXQgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgcHJvZHVjdE9mZnNldEdlbmVyYWxVcGRhdGVGYWMudXBkYXRlKCRzY29wZS5mbURhdGEpLnRoZW4oZnVuY3Rpb24ocHJvbWlzZSl7XG4gICAgICAgICAgICAgICAgaWYocHJvbWlzZS5kYXRhLnJvd0NvdW50ID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvcHJvZHVjdC8nKyRzdGF0ZVBhcmFtcy5jbF9pZCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnVwZGF0ZUZhaWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICBcbiAgICAgICAgJHNjb3BlLmdldFN0YXRlcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJHNjb3BlLnByX3N0YXRlb3B0aW9ucyA9IFtdO1xuICAgICAgICAgICAgJHNjb3BlLnByX2NpdHlvcHRpb25zID0gW107XG4gICAgICAgICAgICAkc2NvcGUucHJfY291bnR5b3B0aW9ucyA9IFtdO1xuICAgICAgICAgICAgJGludGVydmFsKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgcHJvZHVjdE9mZnNldEdlbmVyYWxVcGRhdGVGYWMuZ2V0U3RhdGVzKCRzY29wZS5mbURhdGEucHJfY291bnRyeSkudGhlbihmdW5jdGlvbihwcm9taXNlKXtcbiAgICAgICAgICAgICAgICAgICAgaWYoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YS5nZW9uYW1lcykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5wcl9zdGF0ZW9wdGlvbnMgPSBwcm9taXNlLmRhdGEuZ2VvbmFtZXM7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyRzY29wZS51cGRhdGVGYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSwwLDEpO1xuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLmdldENpdHlDb3VudHkgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICRzY29wZS5wcl9jaXR5b3B0aW9ucyA9IFtdO1xuICAgICAgICAgICAgJHNjb3BlLnByX2NvdW50eW9wdGlvbnMgPSBbXTtcbiAgICAgICAgICAgICRpbnRlcnZhbChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHByb2R1Y3RPZmZzZXRHZW5lcmFsVXBkYXRlRmFjLmdldFN0YXRlcygkc2NvcGUuZm1EYXRhLnByX3N0YXRlKS50aGVuKGZ1bmN0aW9uKHByb21pc2Upe1xuICAgICAgICAgICAgICAgICAgICBpZihhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhLmdlb25hbWVzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnByX2NpdHlvcHRpb25zID0gcHJvbWlzZS5kYXRhLmdlb25hbWVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnByX2NvdW50eW9wdGlvbnMgPSBwcm9taXNlLmRhdGEuZ2VvbmFtZXM7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyRzY29wZS51cGRhdGVGYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSwwLDEpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAkc2NvcGUucHJfc3RhdHVzb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJwcm9kdWN0T2Zmc2V0R2VuZXJhbC5maWVsZHMucHJfc3RhdHVzb3B0aW9uc1wiKTtcbiAgICAgICAgXG4gICAgICAgICRzY29wZS4kb24oJyR2aWV3Q29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vIHRoaXMgY29kZSBpcyBleGVjdXRlZCBhZnRlciB0aGUgdmlldyBpcyBsb2FkZWRcbiAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgIHByb2R1Y3RPZmZzZXRHZW5lcmFsVXBkYXRlRmFjLmRhdGEoKS50aGVuKGZ1bmN0aW9uKHByb21pc2Upe1xuICAgICAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgaWYoYW5ndWxhci5pc09iamVjdChhbmd1bGFyLmZyb21Kc29uKHByb21pc2UuZGF0YSkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZm1EYXRhID0gYW5ndWxhci5mcm9tSnNvbihwcm9taXNlLmRhdGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBwcm9kdWN0T2Zmc2V0R2VuZXJhbFVwZGF0ZUZhYy5nZXRDb3VudHJpZXMoKS50aGVuKGZ1bmN0aW9uKHByb21pc2Upe1xuICAgICAgICAgICAgICAgICAgICBpZihhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhLmdlb25hbWVzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnByX2NvdW50cnlvcHRpb25zID0gcHJvbWlzZS5kYXRhLmdlb25hbWVzO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8kc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIHByb2R1Y3RPZmZzZXRHZW5lcmFsVXBkYXRlRmFjLmdldFN0YXRlcygkc2NvcGUuZm1EYXRhLnByX2NvdW50cnkpLnRoZW4oZnVuY3Rpb24ocHJvbWlzZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZihhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhLmdlb25hbWVzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5wcl9zdGF0ZW9wdGlvbnMgPSBwcm9taXNlLmRhdGEuZ2VvbmFtZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vJHNjb3BlLnVwZGF0ZUZhaWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgcHJvZHVjdE9mZnNldEdlbmVyYWxVcGRhdGVGYWMuZ2V0Q2l0eUNvdW50eSgkc2NvcGUuZm1EYXRhLnByX3N0YXRlKS50aGVuKGZ1bmN0aW9uKHByb21pc2Upe1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YS5nZW9uYW1lcykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUucHJfY2l0eW9wdGlvbnMgPSBwcm9taXNlLmRhdGEuZ2VvbmFtZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnByX2NvdW50eW9wdGlvbnMgPSBwcm9taXNlLmRhdGEuZ2VvbmFtZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vJHNjb3BlLnVwZGF0ZUZhaWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgIH0pO1xuICAgIH1dO1xuICAgIFxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckaHR0cCcsICckcScsICAnJHN0YXRlUGFyYW1zJywgZnVuY3Rpb24gKCRodHRwLCAkcSwgJHN0YXRlUGFyYW1zKSB7XG4gICAgICAgIHZhciBmYWN0b3J5ID0ge307XG4gICAgICAgIGZhY3RvcnkuZGF0YSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKFxuICAgICAgICAgICAgICAgICRodHRwLnBvc3QoJy9hcGkvcHJvZHVjdC9vZmZzZXQvZ2VuZXJhbC9wcm9kdWN0Jywge1xuICAgICAgICAgICAgICAgICAgICAvKiBQT1NUIHZhcmlhYmxlcyBoZXJlICovXG4gICAgICAgICAgICAgICAgICAgIHByX2lkOiAkc3RhdGVQYXJhbXMucHJfaWRcbiAgICAgICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeS51cGRhdGUgPSBmdW5jdGlvbiAocHJfanNvbmIpIHtcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKFxuICAgICAgICAgICAgICAgICRodHRwLnBvc3QoJy9hcGkvcHJvZHVjdC91cGRhdGUnLCB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICAgICAgcHJfaWQ6ICRzdGF0ZVBhcmFtcy5wcl9pZCxcbiAgICAgICAgICAgICAgICAgICAgcHJfanNvbmI6IHByX2pzb25iXG4gICAgICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkuZ2V0Q291bnRyaWVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHByb21pc2UgPSAkaHR0cC5qc29ucCgnaHR0cDovL2FwaS5nZW9uYW1lcy5vcmcvY291bnRyeUluZm9KU09OP3VzZXJuYW1lPWFsZWphbmRyb2xzY2EmY2FsbGJhY2s9SlNPTl9DQUxMQkFDSycpXG4gICAgICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICBmYWN0b3J5LmdldFN0YXRlcyA9IGZ1bmN0aW9uIChwcl9jb3VudHJ5KSB7XG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9ICRodHRwLmpzb25wKCdodHRwOi8vYXBpLmdlb25hbWVzLm9yZy9jaGlsZHJlbkpTT04/Z2VvbmFtZUlkPScgKyBwcl9jb3VudHJ5ICsgJyZ1c2VybmFtZT1hbGVqYW5kcm9sc2NhJmNhbGxiYWNrPUpTT05fQ0FMTEJBQ0snKVxuICAgICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeS5nZXRDaXR5Q291bnR5ID0gZnVuY3Rpb24gKHByX3N0YXRlKSB7XG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9ICRodHRwLmpzb25wKCdodHRwOi8vYXBpLmdlb25hbWVzLm9yZy9jaGlsZHJlbkpTT04/Z2VvbmFtZUlkPScgKyBwcl9zdGF0ZSArICcmdXNlcm5hbWU9YWxlamFuZHJvbHNjYSZjYWxsYmFjaz1KU09OX0NBTExCQUNLJylcbiAgICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBmYWN0b3J5O1xuICAgIH1dO1xuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbihhbmd1bGFyKXtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgXG4gICAgcmV0dXJuIGFuZ3VsYXIubW9kdWxlKCdhcHAucHJvZHVjdE9mZnNldFBhZ2luYXRlZC5hZGQnLFtdKVxuXG4gICAgLmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsXG4gICAgZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgncHJvZHVjdE9mZnNldFBhZ2luYXRlZEFkZCcsIHtcbiAgICAgICAgICAgIHVybDonL3Byb2R1Y3QvYWRkL29mZnNldC9wYWdpbmF0ZWQvOmNsX2lkJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsIDogJ2FwcC9wcm9kdWN0L21vZHVsZXMvcHJvZHVjdE9mZnNldFBhZ2luYXRlZC5hZGQvcHJvZHVjdE9mZnNldFBhZ2luYXRlZC5hZGQudmlldy5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXIgOiAncHJvZHVjdE9mZnNldFBhZ2luYXRlZEFkZEN0cmwnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHJlcXVpcmVzTG9naW46IHRydWVcbiAgICAgICAgICAgIH0gICAgXG4gICAgICAgIH0pO1xuICAgIH1dKVxuXG4gICAgLmZhY3RvcnkoJ3Byb2R1Y3RPZmZzZXRQYWdpbmF0ZWRBZGRGYWMnLHJlcXVpcmUoJy4vcHJvZHVjdE9mZnNldFBhZ2luYXRlZC5hZGQuZmFjJykpXG5cbiAgICAuY29udHJvbGxlcigncHJvZHVjdE9mZnNldFBhZ2luYXRlZEFkZEN0cmwnLHJlcXVpcmUoJy4vcHJvZHVjdE9mZnNldFBhZ2luYXRlZC5hZGQuY3RybCcpKVxuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiIDogXCJBZ3JlZ2FyIFByb2R1Y3RvXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibGFiZWxzXCI6e1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1pZFwiOiBcIklEIHByb2R1Y3RvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsLWlkXCI6IFwiSUQgY2xpZW50ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1wcm9jZXNzXCI6IFwiUHJvY2Vzb1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci10eXBlXCI6IFwiVGlwb1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1wYXJ0bm9cIjogXCJOby4gcGFydGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItY29kZVwiOiBcIkNvZGlnb1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1uYW1lXCI6IFwiTm9tYnJlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLWRlc2NyaXB0aW9uXCI6IFwiRGVzY3JpcGNpb25cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItZmluYWxzaXpld2lkdGhcIjogXCJBbmNob1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1maW5hbHNpemVoZWlnaHRcIjogXCJBbHRvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLWZpbmFsc2l6ZW1lYXN1cmVcIjogXCJNZWRpZGFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItaW5rZnJvbnRcIjogXCJGcmVudGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItaW5rYmFja1wiOiBcIlJldmVyc29cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicGEtaWRcIjogXCJJRCBwYXBlbFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1wYXBlcnNpemV3aWR0aFwiOiBcIkFuY2hvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLXBhcGVyc2l6ZWhlaWdodFwiOiBcIkFsdG9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItcGFwZXJzaXplbWVhc3VyZVwiOiBcIk1lZGlkYVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1wYXBlcmZvcm1hdHNxdHlcIjogXCJGb3JtYXRvc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci12YXJuaXNoXCI6IFwiQmFybml6XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLXZhcm5pc2hmaW5pc2hlZFwiOiBcIkFjYWJhZG9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItbGFtaW5hdGVcIjogXCJMYW1pbmFkb1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1sYW1pbmF0ZWZpbmlzaGVkXCI6IFwiQWNhYmFkb1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1sYW1pbmF0ZWNhbGliZXJcIjogXCJDYWxpYnJlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLWxhbWluYXRlc2lkZXNcIjogXCJDYXJhc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1mb2xpb1wiOiBcIkZvbGlvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLXByZWN1dFwiOiBcIlByZWNvcnRlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLWZvbGRcIjogXCJEb2JsZXpcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItZGllY3V0dGluZ1wiOiBcIlN1YWplXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLWRpZWN1dHRpbmdxdHlcIjogXCJOby4gU3VhamVzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLXJlaW5mb3JjZW1lbnRcIjogXCJSZWZ1ZXJ6b1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1jb3JkXCI6IFwiQ29yZMOzblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci13aXJlXCI6IFwiQWzDoW1icmVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItc3RhcGxpbmdcIjogXCJHcmFwYWRvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLWJvdW5kXCI6XCJFbmN1YWRlcm5hZG9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItc3BpcmFsYmluZFwiOiBcIkVuZ2FyZ29sYWRvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLWJsb2Nrc1wiOiBcIkJsb2Nrc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1pbnRwYWdlc1wiOlwiTm8uIGRlIFBhZ2luYXNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItc3RhdHVzXCI6IFwiRXN0YXR1c1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1kYXRlXCI6IFwiRmVjaGFcIixcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgXCJjb2x1bW5zXCI6W1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9pZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbF9pZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9wcm9jZXNzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX3R5cGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfcGFydG5vXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX2NvZGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfbmFtZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9kZXNjcmlwdGlvblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9maW5hbHNpemV3aWR0aFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9maW5hbHNpemVoZWlnaHRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfZmluYWxzaXplbWVhc3VyZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9pbmtmcm9udFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9pbmtiYWNrXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInBhX2lkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX3BhcGVyc2l6ZXdpZHRoXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX3BhcGVyc2l6ZWhlaWdodFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9wYXBlcnNpemVtZWFzdXJlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX3BhcGVyZm9ybWF0c3F0eVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl92YXJuaXNoXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX3Zhcm5pc2hmaW5pc2hlZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9sYW1pbmF0ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9sYW1pbmF0ZWZpbmlzaGVkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX2xhbWluYXRlY2FsaWJlclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9sYW1pbmF0ZXNpZGVzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX2ZvbGlvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX3ByZWN1dFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9mb2xkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX2RpZWN1dHRpbmdcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfZGllY3V0dGluZ3F0eVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9yZWluZm9yY2VtZW50XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX2NvcmRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfd2lyZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9ibG9ja3NcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfc3RhcGxpbmdcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfYm91bmRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfc3BpcmFsYmluZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9pbnRwYWdlc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9zdGF0dXNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfZGF0ZVwiLFxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgXCJmaWVsZHNcIiA6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByX2ZpbmFsc2l6ZW1lYXN1cmVvcHRpb25zIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJjbVwiLFwidmFsdWVcIjpcImNtXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJwdWxnYWRhc1wiLFwidmFsdWVcIjpcImluXCJ9XG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJfaW5rZnJvbnRvcHRpb25zIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCIxIHRpbnRhXCIsXCJ2YWx1ZVwiOjF9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCIyIHRpbnRhc1wiLFwidmFsdWVcIjoyfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiMyB0aW50YXNcIixcInZhbHVlXCI6M30sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIjQgdGludGFzXCIsXCJ2YWx1ZVwiOjR9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCI1IHRpbnRhc1wiLFwidmFsdWVcIjo1fSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiNiB0aW50YXNcIixcInZhbHVlXCI6Nn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIjcgdGludGFzXCIsXCJ2YWx1ZVwiOjd9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCI4IHRpbnRhc1wiLFwidmFsdWVcIjo4fSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBwcl9pbmtiYWNrb3B0aW9ucyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiMSB0aW50YVwiLFwidmFsdWVcIjoxfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiMiB0aW50YXNcIixcInZhbHVlXCI6Mn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIjMgdGludGFzXCIsXCJ2YWx1ZVwiOjN9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCI0IHRpbnRhc1wiLFwidmFsdWVcIjo0fSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiNSB0aW50YXNcIixcInZhbHVlXCI6NX0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIjYgdGludGFzXCIsXCJ2YWx1ZVwiOjZ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCI3IHRpbnRhc1wiLFwidmFsdWVcIjo3fSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiOCB0aW50YXNcIixcInZhbHVlXCI6OH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJfdmFybmlzaG9wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIk5vXCIsXCJ2YWx1ZVwiOlwibm9cIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIlVuYSBjYXJhXCIsXCJ2YWx1ZVwiOlwib25lc2lkZVwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiRG9zIGNhcmFzXCIsXCJ2YWx1ZVwiOlwidHdvc2lkZXNcIn1cbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBwcl92YXJuaXNmaW5pc2hlZG9wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIk1hdGVcIixcInZhbHVlXCI6XCJtYXR0ZVwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiQnJpbGxhbnRlXCIsXCJ2YWx1ZVwiOlwiYnJpZ2h0XCJ9XG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJfbGFtaW5hdGVvcHRpb25zIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJOb1wiLFwidmFsdWVcIjpcIm5vXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJVbmEgY2FyYVwiLFwidmFsdWVcIjpcIm9uZXNpZGVcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkRvcyBjYXJhc1wiLFwidmFsdWVcIjpcInR3b3NpZGVzXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHByX2xhbWluYXRlZmluaXNoZWRvcHRpb25zIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJNYXRlXCIsXCJ2YWx1ZVwiOlwibWF0dGVcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkJyaWxsYW50ZVwiLFwidmFsdWVcIjpcImJyaWdodFwifVxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHByX2xhbWluYXRlY2FsaWJlcm9wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIi4ybW1cIixcInZhbHVlXCI6XCIybW1cIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIi40bW1cIixcInZhbHVlXCI6XCI0bW1cIn1cbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBwcl9sYW1pbmF0ZXNpZGVzb3B0aW9ucyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiVW5hIGNhcmFcIixcInZhbHVlXCI6XCJvbmVzaWRlXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJEb3MgY2FyYXNcIixcInZhbHVlXCI6XCJ0d29zaWRlc1wifVxuICAgICAgICAgICAgICAgICAgICAgICAgXSxwcl9mb2xpb29wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIlNpXCIsXCJ2YWx1ZVwiOlwieWVzXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJOb1wiLFwidmFsdWVcIjpcIm5vXCJ9XG4gICAgICAgICAgICAgICAgICAgICAgICBdLHByX3ByZWN1dG9wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIk5vXCIsXCJ2YWx1ZVwiOlwibm9cIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkhvcml6b250YWxcIixcInZhbHVlXCI6XCJob3Jpem9udGFsXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJWZXJ0aWNhbFwiLFwidmFsdWVcIjpcInZlcnRpY2FsXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgXSxwcl9mb2xkb3B0aW9ucyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiVHJpcHRpY29cIixcInZhbHVlXCI6XCJ0cnlwdGljXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgXSxwcl9kaWVjdXR0aW5nb3B0aW9ucyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiU2lcIixcInZhbHVlXCI6XCJ5ZXNcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIk5vXCIsXCJ2YWx1ZVwiOlwibm9cIn1cbiAgICAgICAgICAgICAgICAgICAgICAgIF0scHJfcmVpbmZvcmNlbWVudG9wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIk5vXCIsXCJ2YWx1ZVwiOlwibm9cIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIlVub1wiLFwidmFsdWVcIjpcIm9uZVwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiRG9zXCIsXCJ2YWx1ZVwiOlwidHdvXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgXSxwcl9jb3Jkb3B0aW9ucyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiTm9cIixcInZhbHVlXCI6XCJub1wifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiQ29sb2NhZG9cIixcInZhbHVlXCI6XCJhbGxvY2F0ZWRcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIlNlcGFyYWRvXCIsXCJ2YWx1ZVwiOlwic2VwYXJhdGVkXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgXSxwcl93aXJlb3B0aW9ucyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiTm9cIixcInZhbHVlXCI6XCJub1wifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiQ29sb2NhZG9cIixcInZhbHVlXCI6XCJhbGxvY2F0ZWRcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIlNlcGFyYWRvXCIsXCJ2YWx1ZVwiOlwic2VwYXJhdGVkXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgXSxwcl9zdGFwbGluZ29wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIk5vXCIsXCJ2YWx1ZVwiOlwibm9cIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIlVuYSBncmFwYVwiLFwidmFsdWVcIjpcIjFcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkRvcyBncmFwYXNcIixcInZhbHVlXCI6XCIyXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgXSxwcl9ib3VuZG9wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIk5vXCIsXCJ2YWx1ZVwiOlwibm9cIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIlNpXCIsXCJ2YWx1ZVwiOlwieWVzXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgXSxwcl9zcGlyYWxiaW5kb3B0aW9ucyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiUGxhc3RpY29cIixcInZhbHVlXCI6XCJwbGFzdGljXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJNZXRhbFwiLFwidmFsdWVcIjpcIm1ldGFsXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgXSxwcl9ibG9ja3NvcHRpb25zIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJOb1wiLFwidmFsdWVcIjpcIm5vXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCIyMFwiLFwidmFsdWVcIjpcIjIwXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCIyNVwiLFwidmFsdWVcIjpcIjI1XCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCI1MFwiLFwidmFsdWVcIjpcIjUwXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCI3NVwiLFwidmFsdWVcIjpcIjc1XCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCIxMDBcIixcInZhbHVlXCI6XCIxMDBcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJfc3RhdHVzb3B0aW9ucyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiQWN0aXZvXCIsXCJ2YWx1ZVwiOlwiQVwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiSW5hY3Rpdm9cIixcInZhbHVlXCI6XCJJXCJ9XG4gICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKGFuZ3VsYXIpe1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBcbiAgICByZXR1cm4gWyckc2NvcGUnLCAncHJvZHVjdE9mZnNldFBhZ2luYXRlZEFkZEZhYycsICckbG9jYXRpb24nLCAnaTE4bkZpbHRlcicsICckc3RhdGVQYXJhbXMnLFxuICAgIGZ1bmN0aW9uICgkc2NvcGUsIHByb2R1Y3RPZmZzZXRQYWdpbmF0ZWRBZGRGYWMsICRsb2NhdGlvbiwgaTE4bkZpbHRlciwgJHN0YXRlUGFyYW1zKSB7XG4gICAgICAgICRzY29wZS5mbURhdGEgPSB7fTtcbiAgICAgICAgJHNjb3BlLmZtRGF0YSA9IHsgXCJwcl9wcm9jZXNzXCI6IFwib2Zmc2V0XCIsIFwicHJfdHlwZVwiOiBcInBhZ2luYXRlZFwiLCBcImNsX2lkXCI6IFwiNlwiLCBcInByX3BhcnRub1wiOiBcIlRFU1QtQVNBLmFzYXM6IDIzLDM0XCIsIFwicHJfZGVzY3JpcHRpb25cIjogXCJlc3RlIGVzIHVuIHByb2R1Y3RvIGRlIHBydWViYVwiLCBcInByX2ZpbmFsc2l6ZXdpZHRoXCI6IFwiMTAwLjAwXCIsIFwicHJfZmluYWxzaXplaGVpZ2h0XCI6IFwiMjAwLjAwXCIsIFwicHJfZmluYWxzaXplbWVhc3VyZVwiOiBcImNtXCIsIFwicHJfaW5rZnJvbnRcIjogMiwgXCJwcl9pbmtzZnJvbnRcIjogeyBcIjBcIjogXCIyXCIsIFwiMVwiOiBcIjNcIiB9LCBcInByX2lua2JhY2tcIjogMiwgXCJwcl9pbmtzYmFja1wiOiB7IFwiMFwiOiBcIjJcIiwgXCIxXCI6IFwiMlwiIH0sIFwicGFfaWRcIjogXCIxXCIsIFwicHJfcGFwZXJmb3JtYXRzcXR5XCI6IFwiMTIzXCIsIFwicHJfcGFwZXJzaXpld2lkdGhcIjogXCIxMDAuMDBcIiwgXCJwcl9wYXBlcnNpemVoZWlnaHRcIjogXCIyMDAuMDBcIiwgXCJwcl9wYXBlcnNpemVtZWFzdXJlXCI6IFwiY21cIiwgXCJwcl92YXJuaXNoXCI6IFwib25lc2lkZVwiLCBcInByX3Zhcm5pc2hmaW5pc2hlZFwiOiBcIm1hdHRlXCIsIFwicHJfbGFtaW5hdGVcIjogXCJ0d29zaWRlc1wiLCBcInByX2xhbWluYXRlZmluaXNoZWRcIjogXCJtYXR0ZVwiLCBcInByX2xhbWluYXRlY2FsaWJlclwiOiBcIjJtbVwiLCBcInByX3ByZWN1dFwiOiBcImhvcml6b250YWxcIiwgXCJwcl9mb2xkXCI6IFwidHJ5cHRpY1wiLCBcInByX2RpZWN1dHRpbmdcIjogXCJ5ZXNcIiwgXCJwcl9kaWVjdXR0aW5ncXR5XCI6IFwiNVwiLCBcInByX3JlaW5mb3JjZW1lbnRcIjogXCJvbmVcIiwgXCJwcl9jb3JkXCI6IFwiYWxsb2NhdGVkXCIsIFwicHJfd2lyZVwiOiBcImFsbG9jYXRlZFwiLCBcInByX2ZvbGlvXCI6IFwieWVzXCIsIFwicHJfYmxvY2tzXCI6IFwiMTAwXCIsIFwicHJfc3RhdHVzXCI6IFwiQVwiLCBcInByX2ludGlua2Zyb250XCI6IDIsIFwicHJfaW50aW5rc2Zyb250XCI6IHsgXCIwXCI6IFwiMlwiLCBcIjFcIjogXCIzXCIgfSwgXCJwcl9pbnRpbmtiYWNrXCI6IDIsIFwicHJfaW50aW5rc2JhY2tcIjogeyBcIjBcIjogXCIyXCIsIFwiMVwiOiBcIjNcIiB9LCBcInByX2ludHBhZ2VzXCI6IFwiMTAwXCIsIFwicGFfaW50aWRcIjogXCIxXCIsIFwicHJfaW50cGFwZXJmb3JtYXRzcXR5XCI6IFwiNTAwXCIsIFwicHJfc3RhcGxpbmdcIjogXCIyXCIsIFwicHJfYm91bmRcIjogXCJ5ZXNcIiwgXCJwcl9zcGlyYWxiaW5kXCI6IFwicGxhc3RpY1wiLCBcInByX25hbWVcIjogXCJhc2Rhc2Rhc1wiLCBcInByX2NvZGVcIjogXCJhc2Rhc2RcIiB9O1xuICAgICAgICBcbiAgICAgICAgJHNjb3BlLmZtRGF0YS5wcl9wcm9jZXNzID0gJ29mZnNldCc7XG4gICAgICAgICRzY29wZS5mbURhdGEucHJfdHlwZSA9ICdwYWdpbmF0ZWQnO1xuICAgICAgICAkc2NvcGUuZm1EYXRhLmNsX2lkID0gJHN0YXRlUGFyYW1zLmNsX2lkO1xuXG4gICAgICAgICRzY29wZS5vblN1Ym1pdCA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICBwcm9kdWN0T2Zmc2V0UGFnaW5hdGVkQWRkRmFjLmFkZCgkc2NvcGUuZm1EYXRhKS50aGVuKGZ1bmN0aW9uKHByb21pc2Upe1xuICAgICAgICAgICAgICAgIGlmKHByb21pc2UuZGF0YS5yb3dDb3VudCA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvcHJvZHVjdC8nKyRzdGF0ZVBhcmFtcy5jbF9pZCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnVwZGF0ZUZhaWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICBcbiAgICAgICAgJHNjb3BlLnByX2ZpbmFsc2l6ZW1lYXN1cmVvcHRpb25zID0gaTE4bkZpbHRlcihcInByb2R1Y3RPZmZzZXRQYWdpbmF0ZWQtYWRkLmZpZWxkcy5wcl9maW5hbHNpemVtZWFzdXJlb3B0aW9uc1wiKTtcbiAgICAgICAgJHNjb3BlLnByX2lua2Zyb250b3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJwcm9kdWN0T2Zmc2V0UGFnaW5hdGVkLWFkZC5maWVsZHMucHJfaW5rZnJvbnRvcHRpb25zXCIpO1xuICAgICAgICAkc2NvcGUucHJfaW5rYmFja29wdGlvbnMgPSBpMThuRmlsdGVyKFwicHJvZHVjdE9mZnNldFBhZ2luYXRlZC1hZGQuZmllbGRzLnByX2lua2JhY2tvcHRpb25zXCIpO1xuICAgICAgICAkc2NvcGUucHJfdmFybmlzaG9wdGlvbnMgPSBpMThuRmlsdGVyKFwicHJvZHVjdE9mZnNldFBhZ2luYXRlZC1hZGQuZmllbGRzLnByX3Zhcm5pc2hvcHRpb25zXCIpO1xuICAgICAgICAkc2NvcGUucHJfdmFybmlzZmluaXNoZWRvcHRpb25zID0gaTE4bkZpbHRlcihcInByb2R1Y3RPZmZzZXRQYWdpbmF0ZWQtYWRkLmZpZWxkcy5wcl92YXJuaXNmaW5pc2hlZG9wdGlvbnNcIik7XG4gICAgICAgICRzY29wZS5wcl9sYW1pbmF0ZW9wdGlvbnMgPSBpMThuRmlsdGVyKFwicHJvZHVjdE9mZnNldFBhZ2luYXRlZC1hZGQuZmllbGRzLnByX2xhbWluYXRlb3B0aW9uc1wiKTtcbiAgICAgICAgJHNjb3BlLnByX2xhbWluYXRlZmluaXNoZWRvcHRpb25zID0gaTE4bkZpbHRlcihcInByb2R1Y3RPZmZzZXRQYWdpbmF0ZWQtYWRkLmZpZWxkcy5wcl9sYW1pbmF0ZWZpbmlzaGVkb3B0aW9uc1wiKTtcbiAgICAgICAgJHNjb3BlLnByX2xhbWluYXRlY2FsaWJlcm9wdGlvbnMgPSBpMThuRmlsdGVyKFwicHJvZHVjdE9mZnNldFBhZ2luYXRlZC1hZGQuZmllbGRzLnByX2xhbWluYXRlY2FsaWJlcm9wdGlvbnNcIik7XG4gICAgICAgICRzY29wZS5wcl9sYW1pbmF0ZXNpZGVzb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJwcm9kdWN0T2Zmc2V0UGFnaW5hdGVkLWFkZC5maWVsZHMucHJfbGFtaW5hdGVzaWRlc29wdGlvbnNcIik7XG4gICAgICAgICRzY29wZS5wcl9mb2xpb29wdGlvbnMgPSBpMThuRmlsdGVyKFwicHJvZHVjdE9mZnNldFBhZ2luYXRlZC1hZGQuZmllbGRzLnByX2ZvbGlvb3B0aW9uc1wiKTtcbiAgICAgICAgJHNjb3BlLnByX3ByZWN1dG9wdGlvbnMgPSBpMThuRmlsdGVyKFwicHJvZHVjdE9mZnNldFBhZ2luYXRlZC1hZGQuZmllbGRzLnByX3ByZWN1dG9wdGlvbnNcIik7XG4gICAgICAgICRzY29wZS5wcl9mb2xkb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJwcm9kdWN0T2Zmc2V0UGFnaW5hdGVkLWFkZC5maWVsZHMucHJfZm9sZG9wdGlvbnNcIik7XG4gICAgICAgICRzY29wZS5wcl9kaWVjdXR0aW5nb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJwcm9kdWN0T2Zmc2V0UGFnaW5hdGVkLWFkZC5maWVsZHMucHJfZGllY3V0dGluZ29wdGlvbnNcIik7XG4gICAgICAgICRzY29wZS5wcl9yZWluZm9yY2VtZW50b3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJwcm9kdWN0T2Zmc2V0UGFnaW5hdGVkLWFkZC5maWVsZHMucHJfcmVpbmZvcmNlbWVudG9wdGlvbnNcIik7XG4gICAgICAgICRzY29wZS5wcl9jb3Jkb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJwcm9kdWN0T2Zmc2V0UGFnaW5hdGVkLWFkZC5maWVsZHMucHJfY29yZG9wdGlvbnNcIik7XG4gICAgICAgICRzY29wZS5wcl93aXJlb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJwcm9kdWN0T2Zmc2V0UGFnaW5hdGVkLWFkZC5maWVsZHMucHJfd2lyZW9wdGlvbnNcIik7XG4gICAgICAgICRzY29wZS5wcl9zdGFwbGluZ29wdGlvbnMgPSBpMThuRmlsdGVyKFwicHJvZHVjdE9mZnNldFBhZ2luYXRlZC1hZGQuZmllbGRzLnByX3N0YXBsaW5nb3B0aW9uc1wiKTtcbiAgICAgICAgJHNjb3BlLnByX2JvdW5kb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJwcm9kdWN0T2Zmc2V0UGFnaW5hdGVkLWFkZC5maWVsZHMucHJfYm91bmRvcHRpb25zXCIpO1xuICAgICAgICAkc2NvcGUucHJfc3BpcmFsYmluZG9wdGlvbnMgPSBpMThuRmlsdGVyKFwicHJvZHVjdE9mZnNldFBhZ2luYXRlZC1hZGQuZmllbGRzLnByX3NwaXJhbGJpbmRvcHRpb25zXCIpO1xuICAgICAgICAkc2NvcGUucHJfYmxvY2tzb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJwcm9kdWN0T2Zmc2V0UGFnaW5hdGVkLWFkZC5maWVsZHMucHJfYmxvY2tzb3B0aW9uc1wiKTtcbiAgICAgICAgJHNjb3BlLnByX3N0YXR1c29wdGlvbnMgPSBpMThuRmlsdGVyKFwicHJvZHVjdE9mZnNldFBhZ2luYXRlZC1hZGQuZmllbGRzLnByX3N0YXR1c29wdGlvbnNcIik7XG4gICAgICAgIFxuICAgICAgICAvLyBjcmVhdGUgZnJvbnQgaW5rIGZpZWxkc1xuICAgICAgICAkc2NvcGUuJHdhdGNoKCdmbURhdGEucHJfaW5rZnJvbnQnLCBmdW5jdGlvbihuZXdWYWx1ZSwgb2xkVmFsdWUpIHtcbiAgICAgICAgICAgIGlmKCRzY29wZS5mbURhdGEucHJfaW5rZnJvbnQgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmZyb250SW5rcyA9IG5ldyBBcnJheShuZXdWYWx1ZSk7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpPG5ld1ZhbHVlOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYob2xkVmFsdWUgIT0gbmV3VmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5mbURhdGFbJ3ByX2lua3Nmcm9udCddW2ldID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIC8vIGNyZWF0ZSBiYWNrIGluayBmaWVsZHNcbiAgICAgICAgJHNjb3BlLiR3YXRjaCgnZm1EYXRhLnByX2lua2JhY2snLCBmdW5jdGlvbihuZXdWYWx1ZSwgb2xkVmFsdWUpIHtcbiAgICAgICAgICAgIGlmKCRzY29wZS5mbURhdGEucHJfaW5rYmFjayAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUuYmFja0lua3MgPSBuZXcgQXJyYXkobmV3VmFsdWUpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaTxvbGRWYWx1ZTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKG9sZFZhbHVlICE9IG5ld1ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZm1EYXRhWydwcl9pbmtzYmFjayddW2ldID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIC8vIGNyZWF0ZSBmcm9udCBpbnRlcmlvciBpbmsgZmllbGRzXG4gICAgICAgICRzY29wZS4kd2F0Y2goJ2ZtRGF0YS5wcl9pbnRpbmtmcm9udCcsIGZ1bmN0aW9uKG5ld1ZhbHVlLCBvbGRWYWx1ZSkge1xuICAgICAgICAgICAgaWYoJHNjb3BlLmZtRGF0YS5wcl9pbnRpbmtmcm9udCAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUuaW50RnJvbnRJbmtzID0gbmV3IEFycmF5KG5ld1ZhbHVlKTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpPTA7IGk8bmV3VmFsdWU7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZihvbGRWYWx1ZSAhPSBuZXdWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmZtRGF0YVsncHJfaW50aW5rc2Zyb250J11baV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgLy8gY3JlYXRlIGJhY2sgaW50ZXJpb3IgaW5rIGZpZWxkc1xuICAgICAgICAkc2NvcGUuJHdhdGNoKCdmbURhdGEucHJfaW50aW5rYmFjaycsIGZ1bmN0aW9uKG5ld1ZhbHVlLCBvbGRWYWx1ZSkge1xuICAgICAgICAgICAgaWYoJHNjb3BlLmZtRGF0YS5wcl9pbnRpbmtiYWNrICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICRzY29wZS5pbnRCYWNrSW5rcyA9IG5ldyBBcnJheShuZXdWYWx1ZSk7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpPG9sZFZhbHVlOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYob2xkVmFsdWUgIT0gbmV3VmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5mbURhdGFbJ3ByX2ludGlua3NiYWNrJ11baV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRzY29wZS4kb24oJyR2aWV3Q29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vIHRoaXMgY29kZSBpcyBleGVjdXRlZCBhZnRlciB0aGUgdmlldyBpcyBsb2FkZWRcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcHJvZHVjdE9mZnNldFBhZ2luYXRlZEFkZEZhYy5nZXRDbGllbnQoKS50aGVuKGZ1bmN0aW9uKHByb21pc2Upe1xuICAgICAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgaWYoYW5ndWxhci5pc09iamVjdChwcm9taXNlLmRhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5jbGllbnQgPSBwcm9taXNlLmRhdGE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHByb2R1Y3RPZmZzZXRQYWdpbmF0ZWRBZGRGYWMuZ2V0SW5rcygpLnRoZW4oZnVuY3Rpb24ocHJvbWlzZSl7XG4gICAgICAgICAgICAgICAgaWYoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnByX2lua29wdGlvbnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHByb21pc2UuZGF0YSxmdW5jdGlvbih2YWx1ZSwga2V5KXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wdXNoKHtcImxhYmVsXCI6dmFsdWUuaW5fY29kZSxcInZhbHVlXCI6dmFsdWUuaW5faWR9KTtcbiAgICAgICAgICAgICAgICAgICAgfSwkc2NvcGUucHJfaW5rb3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8kc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHByb2R1Y3RPZmZzZXRQYWdpbmF0ZWRBZGRGYWMuZ2V0UGFwZXJzKCkudGhlbihmdW5jdGlvbihwcm9taXNlKXtcbiAgICAgICAgICAgICAgICBpZihhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUucGFfaWRvcHRpb25zID0gW107XG4gICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChwcm9taXNlLmRhdGEsZnVuY3Rpb24odmFsdWUsIGtleSl7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnB1c2goe1wibGFiZWxcIjp2YWx1ZS5wYV9jb2RlLFwidmFsdWVcIjp2YWx1ZS5wYV9pZCwgXCJ3aWR0aFwiOiB2YWx1ZS5wYV93aWR0aCwgXCJoZWlnaHRcIjogdmFsdWUucGFfaGVpZ2h0LCBcIm1lYXN1cmVcIjogdmFsdWUucGFfbWVhc3VyZX0pO1xuICAgICAgICAgICAgICAgICAgICB9LCRzY29wZS5wYV9pZG9wdGlvbnMpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vJHNjb3BlLnVwZGF0ZUZhaWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgIFxuICAgICAgICAgfSk7XG4gICAgfV07XG4gICAgXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRodHRwJywgJyRxJywgICckc3RhdGVQYXJhbXMnLCBmdW5jdGlvbiAoJGh0dHAsICRxLCAkc3RhdGVQYXJhbXMpIHtcbiAgICAgICAgdmFyIGZhY3RvcnkgPSB7fTtcbiAgICAgICAgZmFjdG9yeS5nZXRDbGllbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KCcvYXBpL3Byb2R1Y3Qvb2Zmc2V0L2dlbmVyYWwvY2xpZW50Jywge1xuICAgICAgICAgICAgICAgICAgICAvKiBQT1NUIHZhcmlhYmxlcyBoZXJlICovXG4gICAgICAgICAgICAgICAgICAgIGNsX2lkOiAkc3RhdGVQYXJhbXMuY2xfaWRcbiAgICAgICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeS5nZXRJbmtzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoXG4gICAgICAgICAgICAgICAgJGh0dHAucG9zdCgnL2FwaS9wcm9kdWN0L29mZnNldC9nZW5lcmFsL2luaycsIHtcbiAgICAgICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgICAgICBwcm9jY2VzX2lkOiBuZXcgRGF0ZSgpLmdldE1pbGxpc2Vjb25kcygpXG4gICAgICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkuZ2V0UGFwZXJzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoXG4gICAgICAgICAgICAgICAgJGh0dHAucG9zdCgnL2FwaS9wcm9kdWN0L29mZnNldC9nZW5lcmFsL3BhcGVyJywge1xuICAgICAgICAgICAgICAgICAgICAvKiBQT1NUIHZhcmlhYmxlcyBoZXJlICovXG4gICAgICAgICAgICAgICAgICAgIHByb2NjZXNfaWQ6IG5ldyBEYXRlKCkuZ2V0TWlsbGlzZWNvbmRzKClcbiAgICAgICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeS5hZGQgPSBmdW5jdGlvbiAocHJfanNvbmIpIHtcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gJGh0dHAucG9zdCgnL2FwaS9wcm9kdWN0L2FkZCcsIHtcbiAgICAgICAgICAgICAgICAvKiBQT1NUIHZhcmlhYmxlcyBoZXJlICovXG4gICAgICAgICAgICAgICAgcHJfanNvbmI6IHByX2pzb25iXG4gICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBmYWN0b3J5O1xuICAgIH1dO1xuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRzY29wZScsICdwcm9kdWN0RmFjJywgJ2kxOG5GaWx0ZXInLFxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCBwcm9kdWN0RmFjLCBpMThuRmlsdGVyKSB7XG5cbiAgICAgICAgICAgICRzY29wZS5sYWJlbHMgPSBPYmplY3Qua2V5cyhpMThuRmlsdGVyKFwicHJvZHVjdC5sYWJlbHNcIikpO1xuICAgICAgICAgICAgJHNjb3BlLmNvbHVtbnMgPSBpMThuRmlsdGVyKFwicHJvZHVjdC5jb2x1bW5zXCIpO1xuICAgICAgICBcbiAgICAgICAgICAgIC8vc2V0IFFSIENvZGUgZGF0YSBkZWZhdWx0c1xuICAgICAgICAgICAgJHNjb3BlLnFyY29kZVN0cmluZyA9ICdZT1VSIFRFWFQgVE8gRU5DT0RFJztcbiAgICAgICAgICAgICRzY29wZS5zaXplID0gMjUwO1xuICAgICAgICAgICAgJHNjb3BlLmNvcnJlY3Rpb25MZXZlbCA9ICcnO1xuICAgICAgICAgICAgJHNjb3BlLnR5cGVOdW1iZXIgPSAwO1xuICAgICAgICAgICAgJHNjb3BlLmlucHV0TW9kZSA9ICcnO1xuICAgICAgICAgICAgJHNjb3BlLmltYWdlID0gdHJ1ZTtcbiAgICAgICAgXG4gICAgICAgICAgICAvL1FSIENvZGUgbW9kYWxcbiAgICAgICAgICAgICQoJyNteU1vZGFsJykub24oJ3Nob3cuYnMubW9kYWwnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgICAgICB2YXIgYnV0dG9uID0gJChldmVudC5yZWxhdGVkVGFyZ2V0KTsgLy8gQnV0dG9uIHRoYXQgdHJpZ2dlcmVkIHRoZSBtb2RhbFxuICAgICAgICAgICAgICAgICRzY29wZS5xcmNvZGVTdHJpbmcgPSBidXR0b24uZGF0YSgnY29kZV9kYXRhJyk7Ly8gRXh0cmFjdCBpbmZvIGZyb20gZGF0YS0qIGF0dHJpYnV0ZXNcbiAgICAgICAgICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICBcbiAgICAgICAgICAgIC8vIGZvcm1hdEl0ZW0gZXZlbnQgaGFuZGxlclxuICAgICAgICAgICAgdmFyIHByX2lkO1xuICAgICAgICAgICAgdmFyIGNsX2lkO1xuICAgICAgICAgICAgdmFyIHByX3Byb2Nlc3M7XG4gICAgICAgICAgICB2YXIgcHJfdHlwZTtcbiAgICAgICAgICAgIHZhciBjb2RlX2RhdGE7XG4gICAgICAgICAgICAkc2NvcGUuZm9ybWF0SXRlbSA9IGZ1bmN0aW9uIChzLCBlLCBjZWxsKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoZS5wYW5lbC5jZWxsVHlwZSA9PSB3aWptby5ncmlkLkNlbGxUeXBlLlJvd0hlYWRlcikge1xuICAgICAgICAgICAgICAgICAgICBlLmNlbGwudGV4dENvbnRlbnQgPSBlLnJvdyArIDE7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcy5yb3dzLmRlZmF1bHRTaXplID0gMzA7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBhZGQgQm9vdHN0cmFwIGh0bWxcbiAgICAgICAgICAgICAgICBpZiAoKGUucGFuZWwuY2VsbFR5cGUgPT0gd2lqbW8uZ3JpZC5DZWxsVHlwZS5DZWxsKSAmJiAoZS5jb2wgPT0gMCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJfaWQgPSBlLnBhbmVsLmdldENlbGxEYXRhKGUucm93LCAxLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGNsX2lkID0gZS5wYW5lbC5nZXRDZWxsRGF0YShlLnJvdywgMiwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBwcl9wcm9jZXNzID0gZS5wYW5lbC5nZXRDZWxsRGF0YShlLnJvdywgNiwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBwcl90eXBlID0gZS5wYW5lbC5nZXRDZWxsRGF0YShlLnJvdywgNywgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBjb2RlX2RhdGEgPSAoZnVuY3Rpb24gKCkgeyAvL1FSIENvZGUgZGF0YSBmcm9tIGNvbHVtbnMgXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGV4dCA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAkc2NvcGUubGFiZWxzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dCArPSBpMThuRmlsdGVyKFwicHJvZHVjdC5sYWJlbHMuXCIgKyAkc2NvcGUubGFiZWxzW2ldKSArICc6ICcgKyBlLnBhbmVsLmdldENlbGxEYXRhKGUucm93LCAoaSArIDEpLCBmYWxzZSkgKyAnXFxuJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgIGUuY2VsbC5zdHlsZS5vdmVyZmxvdyA9ICd2aXNpYmxlJztcbiAgICAgICAgICAgICAgICAgICAgZS5jZWxsLmlubmVySFRNTCA9ICc8ZGl2IGNsYXNzPVwiYnRuLWdyb3VwIGJ0bi1ncm91cC1qdXN0aWZpZWRcIiByb2xlPVwiZ3JvdXBcIiBhcmlhLWxhYmVsPVwiLi4uXCI+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYnRuLWdyb3VwXCIgcm9sZT1cImdyb3VwXCI+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cIiMvcHJvZHVjdC8nKyBwcl9wcm9jZXNzICsgJy8nICsgcHJfdHlwZSArICcvdXBkYXRlLycgKyBjbF9pZCArICcvJyArIHByX2lkICsgJ1wiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0IGJ0bi14c1wiIG5nLWNsaWNrPVwiZWRpdCgkaXRlbS5jbF9pZClcIj5FZGl0YXI8L2E+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidG4tZ3JvdXBcIiByb2xlPVwiZ3JvdXBcIj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBkYXRhLXRvZ2dsZT1cIm1vZGFsXCIgZGF0YS10YXJnZXQ9XCIjbXlNb2RhbFwiIGRhdGEtY29kZV9kYXRhPVwiJysgY29kZV9kYXRhICsgJ1wiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0IGJ0bi14c1wiPlFSIENvZGU8L2E+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+JztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAgICAgLy8gYmluZCBjb2x1bW5zIHdoZW4gZ3JpZCBpcyBpbml0aWFsaXplZFxuICAgICAgICAgICAgJHNjb3BlLmluaXRHcmlkID0gZnVuY3Rpb24gKHMsIGUpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8ICRzY29wZS5sYWJlbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbCA9IG5ldyB3aWptby5ncmlkLkNvbHVtbigpO1xuICAgICAgICAgICAgICAgICAgICBjb2wuYmluZGluZyA9ICRzY29wZS5jb2x1bW5zW2ldO1xuICAgICAgICAgICAgICAgICAgICBjb2wuaGVhZGVyID0gaTE4bkZpbHRlcihcInByb2R1Y3QubGFiZWxzLlwiICsgJHNjb3BlLmxhYmVsc1tpXSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbC53b3JkV3JhcCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBjb2wud2lkdGggPSAxNTA7XG4gICAgICAgICAgICAgICAgICAgIHMuY29sdW1ucy5wdXNoKGNvbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIC8vIGNyZWF0ZSB0aGUgdG9vbHRpcCBvYmplY3RcbiAgICAgICAgICAgICRzY29wZS4kd2F0Y2goJ2dnR3JpZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoJHNjb3BlLmdnR3JpZCkge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgLy8gc3RvcmUgcmVmZXJlbmNlIHRvIGdyaWRcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZsZXggPSAkc2NvcGUuZ2dHcmlkO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNyZWF0ZSB0b29sdGlwXG4gICAgICAgICAgICAgICAgICAgIHZhciB0aXAgPSBuZXcgd2lqbW8uVG9vbHRpcCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgcm5nID0gbnVsbDtcblxuICAgICAgICAgICAgICAgICAgICAvLyBtb25pdG9yIHRoZSBtb3VzZSBvdmVyIHRoZSBncmlkXG4gICAgICAgICAgICAgICAgICAgIGZsZXguaG9zdEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGh0ID0gZmxleC5oaXRUZXN0KGV2dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWh0LnJhbmdlLmVxdWFscyhybmcpKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBuZXcgY2VsbCBzZWxlY3RlZCwgc2hvdyB0b29sdGlwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGh0LmNlbGxUeXBlID09IHdpam1vLmdyaWQuQ2VsbFR5cGUuQ2VsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBybmcgPSBodC5yYW5nZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvbCA9IGZsZXguY29sdW1uc1tybmcuY29sXS5oZWFkZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjZWxsRWxlbWVudCA9IGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQoZXZ0LmNsaWVudFgsIGV2dC5jbGllbnRZKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNlbGxCb3VuZHMgPSB3aWptby5SZWN0LmZyb21Cb3VuZGluZ1JlY3QoY2VsbEVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YSA9IHdpam1vLmVzY2FwZUh0bWwoZmxleC5nZXRDZWxsRGF0YShybmcucm93LCBybmcuY29sLCB0cnVlKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXBDb250ZW50ID0gY29sICsgJzogXCI8Yj4nICsgZGF0YSArICc8L2I+XCInO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2VsbEVsZW1lbnQuY2xhc3NOYW1lLmluZGV4T2YoJ3dqLWNlbGwnKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXAuc2hvdyhmbGV4Lmhvc3RFbGVtZW50LCB0aXBDb250ZW50LCBjZWxsQm91bmRzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpcC5oaWRlKCk7IC8vIGNlbGwgbXVzdCBiZSBiZWhpbmQgc2Nyb2xsIGJhci4uLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgZmxleC5ob3N0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpcC5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBybmcgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJHNjb3BlLiRvbignJHZpZXdDb250ZW50TG9hZGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIC8vIHRoaXMgY29kZSBpcyBleGVjdXRlZCBhZnRlciB0aGUgdmlldyBpcyBsb2FkZWRcbiAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgcHJvZHVjdEZhYy5kYXRhKCkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5kYXRhID0gbmV3IHdpam1vLmNvbGxlY3Rpb25zLkNvbGxlY3Rpb25WaWV3KHByb21pc2UuZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XTtcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckaHR0cCcsICckcScsICAnJHN0YXRlUGFyYW1zJywgZnVuY3Rpb24gKCRodHRwLCAkcSwgJHN0YXRlUGFyYW1zKSB7XG4gICAgICAgIHZhciBmYWN0b3J5ID0ge307XG4gICAgICAgIGZhY3RvcnkuZGF0YSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKFxuICAgICAgICAgICAgICAgICRodHRwLnBvc3QoJy9hcGkvcHJvZHVjdC9jbF9pZCcsIHtcbiAgICAgICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgICAgICBwcm9jY2VzX2lkOiBuZXcgRGF0ZSgpLmdldE1pbGxpc2Vjb25kcygpLFxuICAgICAgICAgICAgICAgICAgICBjbF9pZDogJHN0YXRlUGFyYW1zLmNsX2lkLFxuICAgICAgICAgICAgICAgICAgICBwcl9zdGF0dXM6ICdBJ1xuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiAgZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGZhY3Rvcnk7XG4gICAgfV07XG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKGFuZ3VsYXIpe1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBcbiAgICByZXR1cm4gYW5ndWxhci5tb2R1bGUoJ2FwcC5zdXBwbGllcicsW1xuICAgICAgICByZXF1aXJlKCcuL21vZHVsZXMvc3VwcGxpZXIuYWRkJykubmFtZSxcbiAgICAgICAgcmVxdWlyZSgnLi9tb2R1bGVzL3N1cHBsaWVyLnVwZGF0ZScpLm5hbWVcbiAgICBdKVxuXG4gICAgLmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsXG4gICAgZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnc3VwcGxpZXInLCB7XG4gICAgICAgICAgICB1cmw6Jy9zdXBwbGllcicsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybCA6ICdhcHAvc3VwcGxpZXIvc3VwcGxpZXIudmlldy5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXIgOiAnc3VwcGxpZXJDdHJsJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICByZXF1aXJlc0xvZ2luOiB0cnVlXG4gICAgICAgICAgICB9ICAgIFxuICAgICAgICB9KTtcbiAgICB9XSlcblxuICAgIC5mYWN0b3J5KCdzdXBwbGllckZhYycscmVxdWlyZSgnLi9zdXBwbGllci5mYWMnKSlcblxuICAgIC5jb250cm9sbGVyKCdzdXBwbGllckN0cmwnLHJlcXVpcmUoJy4vc3VwcGxpZXIuY3RybCcpKVxuICAgIFxufSkoYW5ndWxhcik7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiIDogXCJQcm92ZWVkb3Jlc1wiLFxuICAgICAgICAgICAgICAgICAgICBcImxhYmVsc1wiOntcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3UtaWRcIjpcImlkIHByb3ZlZWRvclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdS1jb3Jwb3JhdGVuYW1lXCI6XCJyYXrDs24gc29jaWFsXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN1LXRpblwiOlwicmZjXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN1LW5hbWVcIjpcIm5vbWJyZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdS1mYXRoZXJzbGFzdG5hbWVcIjpcImFwZWxsaWRvIHBhdGVybm9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3UtbW90aGVyc2xhc3RuYW1lXCI6XCJhcGVsbGlkbyBtYXRlcm5vXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN1LXN0cmVldFwiOlwiY2FsbGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3Utc3RyZWV0bnVtYmVyXCI6XCJudW1lcm8gZXh0ZXJpb3JcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3Utc3VpdGVudW1iZXJcIjpcIm51bWVybyBpbnRlcmlvclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdS1uZWlnaGJvcmhvb2RcIjpcImNvbG9uaWFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3UtYWRkcmVzc3JlZmVyZW5jZVwiOlwicmVmZXJlbmNpYVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdS1jb3VudHJ5XCI6XCJwYcOtc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdS1zdGF0ZVwiOlwiZXN0YWRvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN1LWNpdHlcIjpcImNpdWRhZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdS1jb3VudHlcIjpcIm11bmljaXBpb1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdS16aXBjb2RlXCI6XCJjb2RpZ28gcG9zdGFsXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN1LWVtYWlsXCI6XCJjb3JyZW8gZWxlY3Ryw7NuaWNvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN1LXBob25lXCI6XCJ0ZWzDqWZvbm9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3UtbW9iaWxlXCI6XCJtw7N2aWxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3Utc3RhdHVzXCI6XCJlc3RhdHVzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN1LWRhdGVcIjpcImZlY2hhXCIsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICBcImNvbHVtbnNcIjpbXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN1X2lkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN1X2NvcnBvcmF0ZW5hbWVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3VfdGluXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN1X25hbWVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3VfZmF0aGVyc2xhc3RuYW1lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN1X21vdGhlcnNsYXN0bmFtZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdV9zdHJlZXRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3Vfc3RyZWV0bnVtYmVyXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN1X3N1aXRlbnVtYmVyXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN1X25laWdoYm9yaG9vZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdV9hZGRyZXNzcmVmZXJlbmNlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN1X2NvdW50cnlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3Vfc3RhdGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3VfY2l0eVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdV9jb3VudHlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3VfemlwY29kZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdV9lbWFpbFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdV9waG9uZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdV9tb2JpbGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3Vfc3RhdHVzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN1X2RhdGVcIixcbiAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICBcImZpZWxkc1wiIDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3Vfc3RhdHVzb3B0aW9ucyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiQWN0aXZvXCIsXCJ2YWx1ZVwiOlwiQVwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiSW5hY3Rpdm9cIixcInZhbHVlXCI6XCJJXCJ9XG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0iLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbihhbmd1bGFyKXtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgXG4gICAgcmV0dXJuIGFuZ3VsYXIubW9kdWxlKCdhcHAuc3VwcGxpZXIuYWRkJyxbXSlcblxuICAgIC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLFxuICAgIGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcbiAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3N1cHBsaWVyQWRkJywge1xuICAgICAgICAgICAgdXJsOicvc3VwcGxpZXIvYWRkJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsIDogJ2FwcC9zdXBwbGllci9tb2R1bGVzL3N1cHBsaWVyLmFkZC9zdXBwbGllci5hZGQudmlldy5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXIgOiAnc3VwcGxpZXJBZGRDdHJsJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICByZXF1aXJlc0xvZ2luOiB0cnVlXG4gICAgICAgICAgICB9ICAgIFxuICAgICAgICB9KTtcbiAgICB9XSlcblxuICAgIC5mYWN0b3J5KCdzdXBwbGllckFkZEZhYycscmVxdWlyZSgnLi9zdXBwbGllci5hZGQuZmFjJykpXG5cbiAgICAuY29udHJvbGxlcignc3VwcGxpZXJBZGRDdHJsJyxyZXF1aXJlKCcuL3N1cHBsaWVyLmFkZC5jdHJsJykpXG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCIgOiBcImFncmVnYXIgcHJvdmVlZG9yXCIsXG4gICAgICAgICAgICAgICAgfSIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKGFuZ3VsYXIpe1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBcbiAgICByZXR1cm4gWyckc2NvcGUnLCAnc3VwcGxpZXJBZGRGYWMnLCAnJGxvY2F0aW9uJywgJ2kxOG5GaWx0ZXInLCAnJGludGVydmFsJyxcbiAgICBmdW5jdGlvbiAoJHNjb3BlLCBzdXBwbGllckFkZEZhYywgJGxvY2F0aW9uLCBpMThuRmlsdGVyLCAkaW50ZXJ2YWwpIHtcbiAgICAgICAgJHNjb3BlLmZtRGF0YSA9IHt9O1xuXG4gICAgICAgICRzY29wZS5vblN1Ym1pdCA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICBzdXBwbGllckFkZEZhYy5hZGQoJHNjb3BlLmZtRGF0YSkudGhlbihmdW5jdGlvbihwcm9taXNlKXtcbiAgICAgICAgICAgICAgICBpZihwcm9taXNlLmRhdGEgPT0gXCIxXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9zdXBwbGllcicpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS51cGRhdGVGYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuZ2V0U3RhdGVzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkc2NvcGUuc3Vfc3RhdGVvcHRpb25zID0gW107XG4gICAgICAgICAgICAkc2NvcGUuc3VfY2l0eW9wdGlvbnMgPSBbXTtcbiAgICAgICAgICAgICRzY29wZS5zdV9jb3VudHlvcHRpb25zID0gW107XG4gICAgICAgICAgICAkaW50ZXJ2YWwoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBzdXBwbGllckFkZEZhYy5nZXRTdGF0ZXMoJHNjb3BlLmZtRGF0YS5zdV9jb3VudHJ5KS50aGVuKGZ1bmN0aW9uKHByb21pc2Upe1xuICAgICAgICAgICAgICAgICAgICBpZihhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhLmdlb25hbWVzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnN1X3N0YXRlb3B0aW9ucyA9IHByb21pc2UuZGF0YS5nZW9uYW1lcztcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vJHNjb3BlLnVwZGF0ZUZhaWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LDAsMSk7XG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUuZ2V0Q2l0eUNvdW50eSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJHNjb3BlLnN1X2NpdHlvcHRpb25zID0gW107XG4gICAgICAgICAgICAkc2NvcGUuc3VfY291bnR5b3B0aW9ucyA9IFtdO1xuICAgICAgICAgICAgJGludGVydmFsKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgc3VwcGxpZXJBZGRGYWMuZ2V0U3RhdGVzKCRzY29wZS5mbURhdGEuc3Vfc3RhdGUpLnRoZW4oZnVuY3Rpb24ocHJvbWlzZSl7XG4gICAgICAgICAgICAgICAgICAgIGlmKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEuZ2VvbmFtZXMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuc3VfY2l0eW9wdGlvbnMgPSBwcm9taXNlLmRhdGEuZ2VvbmFtZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuc3VfY291bnR5b3B0aW9ucyA9IHByb21pc2UuZGF0YS5nZW9uYW1lcztcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vJHNjb3BlLnVwZGF0ZUZhaWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LDAsMSk7XG4gICAgICAgIH07XG4gICAgICAgIFxuICAgICAgICAkc2NvcGUuc3Vfc3RhdHVzb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJzdXBwbGllci5maWVsZHMuc3Vfc3RhdHVzb3B0aW9uc1wiKTtcblxuICAgICAgICAkc2NvcGUuJG9uKCckdmlld0NvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyB0aGlzIGNvZGUgaXMgZXhlY3V0ZWQgYWZ0ZXIgdGhlIHZpZXcgaXMgbG9hZGVkXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHN1cHBsaWVyQWRkRmFjLmdldENvdW50cmllcygpLnRoZW4oZnVuY3Rpb24ocHJvbWlzZSl7XG4gICAgICAgICAgICAgICAgaWYoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YS5nZW9uYW1lcykpIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnN1X2NvdW50cnlvcHRpb25zID0gcHJvbWlzZS5kYXRhLmdlb25hbWVzO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vJHNjb3BlLnVwZGF0ZUZhaWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICB9KTtcbiAgICB9XTtcbiAgICBcbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgcmV0dXJuIFsnJGh0dHAnLCAnJHEnLCAgJyRzdGF0ZVBhcmFtcycsIGZ1bmN0aW9uICgkaHR0cCwgJHEsICRzdGF0ZVBhcmFtcykge1xuICAgICAgICB2YXIgZmFjdG9yeSA9IHt9O1xuICAgICAgICBmYWN0b3J5LmFkZCA9IGZ1bmN0aW9uIChzdV9qc29uYikge1xuICAgICAgICAgICAgdmFyIHByb21pc2UgPSAkaHR0cC5wb3N0KCdtb2R1bGVzL3N1cHBsaWVyL21vZHVsZXMvc3VwcGxpZXIuYWRkL3N1cHBsaWVyLmFkZC5tZGwuYWRkLnBocCcsIHtcbiAgICAgICAgICAgICAgICAvKiBQT1NUIHZhcmlhYmxlcyBoZXJlICovXG4gICAgICAgICAgICAgICAgc3VfanNvbmI6IHN1X2pzb25iXG4gICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkuZ2V0Q291bnRyaWVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHByb21pc2UgPSAkaHR0cC5nZXQoJ2h0dHA6Ly9hcGkuZ2VvbmFtZXMub3JnL2NvdW50cnlJbmZvSlNPTj91c2VybmFtZT1hbGVqYW5kcm9sc2NhJylcbiAgICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkuZ2V0U3RhdGVzID0gZnVuY3Rpb24gKHN1X2NvdW50cnkpIHtcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gJGh0dHAuZ2V0KCdodHRwOi8vYXBpLmdlb25hbWVzLm9yZy9jaGlsZHJlbkpTT04/Z2VvbmFtZUlkPScgKyBzdV9jb3VudHJ5ICsgJyZ1c2VybmFtZT1hbGVqYW5kcm9sc2NhJylcbiAgICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkuZ2V0Q2l0eUNvdW50eSA9IGZ1bmN0aW9uIChzdV9zdGF0ZSkge1xuICAgICAgICAgICAgdmFyIHByb21pc2UgPSAkaHR0cC5nZXQoJ2h0dHA6Ly9hcGkuZ2VvbmFtZXMub3JnL2NoaWxkcmVuSlNPTj9nZW9uYW1lSWQ9JyArIHN1X3N0YXRlICsgJyZ1c2VybmFtZT1hbGVqYW5kcm9sc2NhJylcbiAgICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBmYWN0b3J5O1xuICAgIH1dO1xuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbihhbmd1bGFyKXtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgXG4gICAgcmV0dXJuIGFuZ3VsYXIubW9kdWxlKCdhcHAuc3VwcGxpZXIudXBkYXRlJyxbXSlcblxuICAgIC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLFxuICAgIGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcbiAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3N1cHBsaWVyVXBkYXRlJywge1xuICAgICAgICAgICAgdXJsOicvc3VwcGxpZXIvdXBkYXRlLzpzdV9pZCcsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybCA6ICdhcHAvc3VwcGxpZXIvbW9kdWxlcy9zdXBwbGllci51cGRhdGUvc3VwcGxpZXIudXBkYXRlLnZpZXcuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyIDogJ3N1cHBsaWVyVXBkYXRlQ3RybCcsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgcmVxdWlyZXNMb2dpbjogdHJ1ZVxuICAgICAgICAgICAgfSAgICBcbiAgICAgICAgfSk7XG4gICAgfV0pXG5cbiAgICAuZmFjdG9yeSgnc3VwcGxpZXJVcGRhdGVGYWMnLHJlcXVpcmUoJy4vc3VwcGxpZXIudXBkYXRlLmZhYycpKVxuXG4gICAgLmNvbnRyb2xsZXIoJ3N1cHBsaWVyVXBkYXRlQ3RybCcscmVxdWlyZSgnLi9zdXBwbGllci51cGRhdGUuY3RybCcpKVxuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiIDogXCJhY3R1YWxpemFyIHByb3ZlZWRvclwiLFxuICAgICAgICAgICAgICAgIH0iLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRzY29wZScsICdzdXBwbGllclVwZGF0ZUZhYycsICckbG9jYXRpb24nLCAnaTE4bkZpbHRlcicsICckaW50ZXJ2YWwnLFxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCBzdXBwbGllclVwZGF0ZUZhYywgJGxvY2F0aW9uLCBpMThuRmlsdGVyLCAkaW50ZXJ2YWwpIHtcblxuICAgICAgICAgICAgJHNjb3BlLm9uU3VibWl0ID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgc3VwcGxpZXJVcGRhdGVGYWMudXBkYXRlKCRzY29wZS5mbURhdGEpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb21pc2UuZGF0YSA9PSBcIjFcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9zdXBwbGllcicpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnVwZGF0ZUZhaWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAkc2NvcGUuZ2V0U3RhdGVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICRzY29wZS5zdV9zdGF0ZW9wdGlvbnMgPSBbXTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuc3VfY2l0eW9wdGlvbnMgPSBbXTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuc3VfY291bnR5b3B0aW9ucyA9IFtdO1xuICAgICAgICAgICAgICAgICRpbnRlcnZhbChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHN1cHBsaWVyVXBkYXRlRmFjLmdldFN0YXRlcygkc2NvcGUuZm1EYXRhLnN1X2NvdW50cnkpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhLmdlb25hbWVzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5zdV9zdGF0ZW9wdGlvbnMgPSBwcm9taXNlLmRhdGEuZ2VvbmFtZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vJHNjb3BlLnVwZGF0ZUZhaWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LCAwLCAxKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJHNjb3BlLmdldENpdHlDb3VudHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnN1X2NpdHlvcHRpb25zID0gW107XG4gICAgICAgICAgICAgICAgJHNjb3BlLnN1X2NvdW50eW9wdGlvbnMgPSBbXTtcbiAgICAgICAgICAgICAgICAkaW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBzdXBwbGllclVwZGF0ZUZhYy5nZXRTdGF0ZXMoJHNjb3BlLmZtRGF0YS5zdV9zdGF0ZSkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEuZ2VvbmFtZXMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnN1X2NpdHlvcHRpb25zID0gcHJvbWlzZS5kYXRhLmdlb25hbWVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5zdV9jb3VudHlvcHRpb25zID0gcHJvbWlzZS5kYXRhLmdlb25hbWVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyRzY29wZS51cGRhdGVGYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSwgMCwgMSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICRzY29wZS5zdV9zdGF0dXNvcHRpb25zID0gaTE4bkZpbHRlcihcInN1cHBsaWVyLmZpZWxkcy5zdV9zdGF0dXNvcHRpb25zXCIpO1xuXG4gICAgICAgICAgICAkc2NvcGUuJG9uKCckdmlld0NvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgLy8gdGhpcyBjb2RlIGlzIGV4ZWN1dGVkIGFmdGVyIHRoZSB2aWV3IGlzIGxvYWRlZFxuICAgICAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBzdXBwbGllclVwZGF0ZUZhYy5kYXRhKCkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc09iamVjdChhbmd1bGFyLmZyb21Kc29uKHByb21pc2UuZGF0YSkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZm1EYXRhID0gYW5ndWxhci5mcm9tSnNvbihwcm9taXNlLmRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHN1cHBsaWVyVXBkYXRlRmFjLmdldENvdW50cmllcygpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhLmdlb25hbWVzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5zdV9jb3VudHJ5b3B0aW9ucyA9IHByb21pc2UuZGF0YS5nZW9uYW1lcztcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8kc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3VwcGxpZXJVcGRhdGVGYWMuZ2V0U3RhdGVzKCRzY29wZS5mbURhdGEuc3VfY291bnRyeSkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhLmdlb25hbWVzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuc3Vfc3RhdGVvcHRpb25zID0gcHJvbWlzZS5kYXRhLmdlb25hbWVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vJHNjb3BlLnVwZGF0ZUZhaWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3VwcGxpZXJVcGRhdGVGYWMuZ2V0Q2l0eUNvdW50eSgkc2NvcGUuZm1EYXRhLnN1X3N0YXRlKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEuZ2VvbmFtZXMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5zdV9jaXR5b3B0aW9ucyA9IHByb21pc2UuZGF0YS5nZW9uYW1lcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnN1X2NvdW50eW9wdGlvbnMgPSBwcm9taXNlLmRhdGEuZ2VvbmFtZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8kc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XTtcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oYW5ndWxhcil7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIFxuICAgIHJldHVybiBbJyRodHRwJywgJyRxJywgICckc3RhdGVQYXJhbXMnLCBmdW5jdGlvbigkaHR0cCwgJHEsICRzdGF0ZVBhcmFtcyl7XG4gICAgICAgIHZhciBmYWN0b3J5ID0ge307XG4gICAgICAgIGZhY3RvcnkuZGF0YSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoXG4gICAgICAgICAgICAgICAgJGh0dHAucG9zdCgnbW9kdWxlcy9zdXBwbGllci9tb2R1bGVzL3N1cHBsaWVyLnVwZGF0ZS9zdXBwbGllci51cGRhdGUubWRsLmdldHN1cHBsaWVyLnBocCcsIHtcbiAgICAgICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgICAgICBzdV9pZDogJHN0YXRlUGFyYW1zLnN1X2lkXG4gICAgICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZyl7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1wic3RhdHVzXCI6IGZhbHNlfTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICBmYWN0b3J5LnVwZGF0ZSA9IGZ1bmN0aW9uKHN1X2pzb25iKSB7XG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KCdtb2R1bGVzL3N1cHBsaWVyL21vZHVsZXMvc3VwcGxpZXIudXBkYXRlL3N1cHBsaWVyLnVwZGF0ZS5tZGwudXBkYXRlLnBocCcsIHtcbiAgICAgICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgICAgICBzdV9pZDogJHN0YXRlUGFyYW1zLnN1X2lkLFxuICAgICAgICAgICAgICAgICAgICBzdV9qc29uYjogc3VfanNvbmJcbiAgICAgICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XCJzdGF0dXNcIjogZmFsc2V9O1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkuZ2V0Q291bnRyaWVzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9ICRodHRwLmdldCgnaHR0cDovL2FwaS5nZW9uYW1lcy5vcmcvY291bnRyeUluZm9KU09OP3VzZXJuYW1lPWFsZWphbmRyb2xzY2EnKVxuICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpe1xuICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcInN0YXR1c1wiOiBmYWxzZX07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICBmYWN0b3J5LmdldFN0YXRlcyA9IGZ1bmN0aW9uKHN1X2NvdW50cnkpIHtcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gJGh0dHAuZ2V0KCdodHRwOi8vYXBpLmdlb25hbWVzLm9yZy9jaGlsZHJlbkpTT04/Z2VvbmFtZUlkPScrc3VfY291bnRyeSsnJnVzZXJuYW1lPWFsZWphbmRyb2xzY2EnKVxuICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpe1xuICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1wic3RhdHVzXCI6IGZhbHNlfTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkuZ2V0Q2l0eUNvdW50eSA9IGZ1bmN0aW9uKHN1X3N0YXRlKSB7XG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9ICRodHRwLmdldCgnaHR0cDovL2FwaS5nZW9uYW1lcy5vcmcvY2hpbGRyZW5KU09OP2dlb25hbWVJZD0nK3N1X3N0YXRlKycmdXNlcm5hbWU9YWxlamFuZHJvbHNjYScpXG4gICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZyl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XCJzdGF0dXNcIjogZmFsc2V9O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGZhY3Rvcnk7XG4gICAgfV07XG4gICAgXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRzY29wZScsICdzdXBwbGllckZhYycsICdpMThuRmlsdGVyJyxcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgc3VwcGxpZXJGYWMsIGkxOG5GaWx0ZXIpIHtcblxuICAgICAgICAgICAgJHNjb3BlLmxhYmVscyA9IE9iamVjdC5rZXlzKGkxOG5GaWx0ZXIoXCJzdXBwbGllci5sYWJlbHNcIikpO1xuICAgICAgICAgICAgJHNjb3BlLmNvbHVtbnMgPSBpMThuRmlsdGVyKFwic3VwcGxpZXIuY29sdW1uc1wiKTtcbiAgICAgICAgXG4gICAgICAgICAgICAvLyBmb3JtYXRJdGVtIGV2ZW50IGhhbmRsZXJcbiAgICAgICAgICAgIHZhciBzdV9pZDtcbiAgICAgICAgICAgICRzY29wZS5mb3JtYXRJdGVtID0gZnVuY3Rpb24gKHMsIGUsIGNlbGwpIHtcblxuICAgICAgICAgICAgICAgIGlmIChlLnBhbmVsLmNlbGxUeXBlID09IHdpam1vLmdyaWQuQ2VsbFR5cGUuUm93SGVhZGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGUuY2VsbC50ZXh0Q29udGVudCA9IGUucm93ICsgMTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBzLnJvd3MuZGVmYXVsdFNpemUgPSAzMDtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIGFkZCBCb290c3RyYXAgaHRtbFxuICAgICAgICAgICAgICAgIGlmICgoZS5wYW5lbC5jZWxsVHlwZSA9PSB3aWptby5ncmlkLkNlbGxUeXBlLkNlbGwpICYmIChlLmNvbCA9PSAwKSkge1xuICAgICAgICAgICAgICAgICAgICBzdV9pZCA9IGUucGFuZWwuZ2V0Q2VsbERhdGEoZS5yb3csIDEsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgZS5jZWxsLnN0eWxlLm92ZXJmbG93ID0gJ3Zpc2libGUnO1xuICAgICAgICAgICAgICAgICAgICBlLmNlbGwuaW5uZXJIVE1MID0gJzxkaXYgY2xhc3M9XCJidG4tZ3JvdXAgYnRuLWdyb3VwLWp1c3RpZmllZFwiIHJvbGU9XCJncm91cFwiIGFyaWEtbGFiZWw9XCIuLi5cIj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidG4tZ3JvdXBcIiByb2xlPVwiZ3JvdXBcIj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiIy9zdXBwbGllci91cGRhdGUvJysgc3VfaWQgKyAnXCIgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHQgYnRuLXhzXCIgbmctY2xpY2s9XCJlZGl0KCRpdGVtLnN1X2lkKVwiPkVkaXRhcjwvYT5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj4nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgICAgICAvLyBiaW5kIGNvbHVtbnMgd2hlbiBncmlkIGlzIGluaXRpYWxpemVkXG4gICAgICAgICAgICAkc2NvcGUuaW5pdEdyaWQgPSBmdW5jdGlvbiAocywgZSkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgJHNjb3BlLmxhYmVscy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgY29sID0gbmV3IHdpam1vLmdyaWQuQ29sdW1uKCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbC5iaW5kaW5nID0gJHNjb3BlLmNvbHVtbnNbaV07XG4gICAgICAgICAgICAgICAgICAgIGNvbC5oZWFkZXIgPSBpMThuRmlsdGVyKFwic3VwcGxpZXIubGFiZWxzLlwiICsgJHNjb3BlLmxhYmVsc1tpXSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbC53b3JkV3JhcCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBjb2wud2lkdGggPSAxNTA7XG4gICAgICAgICAgICAgICAgICAgIHMuY29sdW1ucy5wdXNoKGNvbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIC8vIGNyZWF0ZSB0aGUgdG9vbHRpcCBvYmplY3RcbiAgICAgICAgICAgICRzY29wZS4kd2F0Y2goJ2dnR3JpZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoJHNjb3BlLmdnR3JpZCkge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgLy8gc3RvcmUgcmVmZXJlbmNlIHRvIGdyaWRcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZsZXggPSAkc2NvcGUuZ2dHcmlkO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNyZWF0ZSB0b29sdGlwXG4gICAgICAgICAgICAgICAgICAgIHZhciB0aXAgPSBuZXcgd2lqbW8uVG9vbHRpcCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgcm5nID0gbnVsbDtcblxuICAgICAgICAgICAgICAgICAgICAvLyBtb25pdG9yIHRoZSBtb3VzZSBvdmVyIHRoZSBncmlkXG4gICAgICAgICAgICAgICAgICAgIGZsZXguaG9zdEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGh0ID0gZmxleC5oaXRUZXN0KGV2dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWh0LnJhbmdlLmVxdWFscyhybmcpKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBuZXcgY2VsbCBzZWxlY3RlZCwgc2hvdyB0b29sdGlwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGh0LmNlbGxUeXBlID09IHdpam1vLmdyaWQuQ2VsbFR5cGUuQ2VsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBybmcgPSBodC5yYW5nZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvbCA9IGZsZXguY29sdW1uc1tybmcuY29sXS5oZWFkZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjZWxsRWxlbWVudCA9IGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQoZXZ0LmNsaWVudFgsIGV2dC5jbGllbnRZKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNlbGxCb3VuZHMgPSB3aWptby5SZWN0LmZyb21Cb3VuZGluZ1JlY3QoY2VsbEVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YSA9IHdpam1vLmVzY2FwZUh0bWwoZmxleC5nZXRDZWxsRGF0YShybmcucm93LCBybmcuY29sLCB0cnVlKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXBDb250ZW50ID0gY29sICsgJzogXCI8Yj4nICsgZGF0YSArICc8L2I+XCInO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2VsbEVsZW1lbnQuY2xhc3NOYW1lLmluZGV4T2YoJ3dqLWNlbGwnKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXAuc2hvdyhmbGV4Lmhvc3RFbGVtZW50LCB0aXBDb250ZW50LCBjZWxsQm91bmRzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpcC5oaWRlKCk7IC8vIGNlbGwgbXVzdCBiZSBiZWhpbmQgc2Nyb2xsIGJhci4uLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgZmxleC5ob3N0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpcC5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBybmcgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJHNjb3BlLiRvbignJHZpZXdDb250ZW50TG9hZGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIC8vIHRoaXMgY29kZSBpcyBleGVjdXRlZCBhZnRlciB0aGUgdmlldyBpcyBsb2FkZWRcbiAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgc3VwcGxpZXJGYWMuZGF0YSgpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZGF0YSA9IG5ldyB3aWptby5jb2xsZWN0aW9ucy5Db2xsZWN0aW9uVmlldyhwcm9taXNlLmRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfV07XG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgcmV0dXJuIFsnJGh0dHAnLCAnJHEnLCAgZnVuY3Rpb24gKCRodHRwLCAkcSkge1xuICAgICAgICB2YXIgZmFjdG9yeSA9IHt9O1xuICAgICAgICBmYWN0b3J5LmRhdGEgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KCdtb2R1bGVzL3N1cHBsaWVyL3N1cHBsaWVyLm1kbC5nZXRzdXBwbGllcnMucGhwJywge1xuICAgICAgICAgICAgICAgICAgICAvKiBQT1NUIHZhcmlhYmxlcyBoZXJlICovXG4gICAgICAgICAgICAgICAgICAgIHByb2NjZXNfaWQ6IG5ldyBEYXRlKCkuZ2V0TWlsbGlzZWNvbmRzKClcbiAgICAgICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBmYWN0b3J5O1xuICAgIH1dO1xuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbihhbmd1bGFyKXtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgXG4gICAgcmV0dXJuIGFuZ3VsYXIubW9kdWxlKCdhcHAudXNlcicsW1xuICAgICAgICByZXF1aXJlKCcuL21vZHVsZXMvdXNlci5hZGQnKS5uYW1lLFxuICAgICAgICByZXF1aXJlKCcuL21vZHVsZXMvdXNlci51cGRhdGUnKS5uYW1lLFxuICAgICAgICByZXF1aXJlKCcuL21vZHVsZXMvdXNlci5wcm9maWxlJykubmFtZVxuICAgIF0pXG5cbiAgICAuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJyxcbiAgICBmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCd1c2VyJywge1xuICAgICAgICAgICAgdXJsOicvdXNlcicsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybCA6ICdhcHAvdXNlci91c2VyLnZpZXcuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyIDogJ3VzZXJDdHJsJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICByZXF1aXJlc0xvZ2luOiB0cnVlXG4gICAgICAgICAgICB9ICAgIFxuICAgICAgICB9KTtcbiAgICB9XSlcblxuICAgIC5mYWN0b3J5KCd1c2VyRmFjJyxyZXF1aXJlKCcuL3VzZXIuZmFjJykpXG5cbiAgICAuY29udHJvbGxlcigndXNlckN0cmwnLHJlcXVpcmUoJy4vdXNlci5jdHJsJykpXG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCIgOiBcInVzdWFyaW9zXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibGFiZWxzXCI6e1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJ1cy1pZFwiOiBcImlkIHVzdWFyaW9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZ3ItaWRcIjogXCJpZCBncnVwb1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ1cy11c2VyXCI6IFwidXN1YXJpb1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ1cy1wYXNzd29yZFwiOiBcImNvbnRyYXNlw7FhXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInVzLW5hbWVcIjogXCJub21icmVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidXMtZmF0aGVyc2xhc3RuYW1lXCI6IFwiYXBlbGxpZG8gcGF0ZXJub1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ1cy1tb3RoZXJzbGFzdG5hbWVcIjogXCJhcGVsbGlkbyBtYXRlcm5vXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInVzLWVtYWlsXCI6IFwiY29ycmVvIGVsZWN0csOzbmljb1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ1cy1waG9uZVwiOiBcInRlbMOpZm9ub1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ1cy1tb2JpbGVcIjogXCJtw7N2aWxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidXMtc3RhdHVzXCI6IFwiZXN0YXR1c1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ1cy1kYXRlXCI6IFwiZmVjaGFcIlxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBcImNvbHVtbnNcIjpbXG4gICAgICAgICAgICAgICAgICAgICAgICBcInVzX2lkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImdyX2lkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInVzX3VzZXJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidXNfcGFzc3dvcmRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidXNfbmFtZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ1c19mYXRoZXJzbGFzdG5hbWVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidXNfbW90aGVyc2xhc3RuYW1lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInVzX2VtYWlsXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInVzX3Bob25lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInVzX21vYmlsZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ1c19zdGF0dXNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidXNfZGF0ZVwiXG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICB9IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oYW5ndWxhcil7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIFxuICAgIHJldHVybiBhbmd1bGFyLm1vZHVsZSgnYXBwLnVzZXIuYWRkJyxbXSlcblxuICAgIC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLFxuICAgIGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcbiAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3VzZXJBZGQnLCB7XG4gICAgICAgICAgICB1cmw6Jy91c2VyL2FkZCcsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybCA6ICdhcHAvdXNlci9tb2R1bGVzL3VzZXIuYWRkL3VzZXIuYWRkLnZpZXcuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyIDogJ3VzZXJBZGRDdHJsJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICByZXF1aXJlc0xvZ2luOiB0cnVlXG4gICAgICAgICAgICB9ICAgIFxuICAgICAgICB9KTtcbiAgICB9XSlcblxuICAgIC5mYWN0b3J5KCd1c2VyQWRkRmFjJyxyZXF1aXJlKCcuL3VzZXIuYWRkLmZhYycpKVxuXG4gICAgLmNvbnRyb2xsZXIoJ3VzZXJBZGRDdHJsJyxyZXF1aXJlKCcuL3VzZXIuYWRkLmN0cmwnKSlcbiAgICBcbn0pKGFuZ3VsYXIpO1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIiA6IFwiYWdyZWdhciB1c3VhcmlvXCIsXG4gICAgICAgICAgICAgICAgfSIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgcmV0dXJuIFsnJHNjb3BlJywgJ3VzZXJBZGRGYWMnLCAnJGxvY2F0aW9uJyxcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgdXNlckFkZEZhYywgJGxvY2F0aW9uKSB7XG5cbiAgICAgICAgICAgICRzY29wZS5vblN1Ym1pdCA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgIHVzZXJBZGRGYWMuYWRkKCRzY29wZS5mbURhdGEpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb21pc2UuZGF0YSA9PSBcIjFcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy91c2VyJyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICRzY29wZS4kb24oJyR2aWV3Q29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAvLyB0aGlzIGNvZGUgaXMgZXhlY3V0ZWQgYWZ0ZXIgdGhlIHZpZXcgaXMgbG9hZGVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfV07XG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKGFuZ3VsYXIpe1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBcbiAgICByZXR1cm4gWyckaHR0cCcsICckcScsICAnJHN0YXRlUGFyYW1zJyxcbiAgICBmdW5jdGlvbigkaHR0cCwgJHEsICRzdGF0ZVBhcmFtcyl7XG4gICAgICAgIHZhciBmYWN0b3J5ID0ge307XG4gICAgICAgIGZhY3RvcnkuYWRkID0gZnVuY3Rpb24odXNfanNvbmIpIHtcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gJGh0dHAucG9zdCgnbW9kdWxlcy91c2VyL21vZHVsZXMvdXNlci5hZGQvdXNlci5hZGQubW9kZWwucGhwJywge1xuICAgICAgICAgICAgICAgICAgICAvKiBQT1NUIHZhcmlhYmxlcyBoZXJlICovXG4gICAgICAgICAgICAgICAgICAgIHVzX2pzb25iOiB1c19qc29uYlxuICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZyl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1wic3RhdHVzXCI6IGZhbHNlfTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBmYWN0b3J5O1xuICAgIH1dO1xuICAgIFxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oYW5ndWxhcil7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIFxuICAgIHJldHVybiBhbmd1bGFyLm1vZHVsZSgnYXBwLnVzZXIucHJvZmlsZScsW10pXG5cbiAgICAuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJyxcbiAgICBmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCd1c2VyUHJvZmlsZScsIHtcbiAgICAgICAgICAgIHVybDonL3VzZXIvcHJvZmlsZScsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybCA6ICdhcHAvdXNlci9tb2R1bGVzL3VzZXIucHJvZmlsZS91c2VyLnByb2ZpbGUudmlldy5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXIgOiAndXNlclByb2ZpbGVDdHJsJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICByZXF1aXJlc0xvZ2luOiB0cnVlXG4gICAgICAgICAgICB9ICAgIFxuICAgICAgICB9KTtcbiAgICB9XSlcblxuICAgIC5jb250cm9sbGVyKCd1c2VyUHJvZmlsZUN0cmwnLHJlcXVpcmUoJy4vdXNlci5wcm9maWxlLmN0cmwnKSlcbiAgICBcbn0pKGFuZ3VsYXIpO1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIiA6IFwicGVyZmlsIGRlbCB1c3VhcmlvXCIsXG4gICAgICAgICAgICAgICAgfSIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKGFuZ3VsYXIpe1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBcbiAgICByZXR1cm4gWyckc2NvcGUnLCAnJGxvY2F0aW9uJywgJ2kxOG5GaWx0ZXInLCAnJHJvb3RTY29wZScsXG4gICAgZnVuY3Rpb24gKCRzY29wZSwgJGxvY2F0aW9uLCBpMThuRmlsdGVyLCAkcm9vdFNjb3BlKSB7XG4gICAgICAgICRzY29wZS51c2VyID0gJHJvb3RTY29wZS51c2VyO1xuICAgICAgICAkc2NvcGUuJG9uKCckdmlld0NvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyB0aGlzIGNvZGUgaXMgZXhlY3V0ZWQgYWZ0ZXIgdGhlIHZpZXcgaXMgbG9hZGVkXG4gICAgICAgICB9KTtcbiAgICB9XTtcbiAgICBcbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKGFuZ3VsYXIpe1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBcbiAgICByZXR1cm4gYW5ndWxhci5tb2R1bGUoJ2FwcC51c2VyLnVwZGF0ZScsW10pXG5cbiAgICAuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJyxcbiAgICBmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCd1c2VyVXBkYXRlJywge1xuICAgICAgICAgICAgdXJsOicvdXNlci91cGRhdGUvOnVzX2lkJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsIDogJ2FwcC91c2VyL21vZHVsZXMvdXNlci51cGRhdGUvdXNlci51cGRhdGUudmlldy5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXIgOiAndXNlclVwZGF0ZUN0cmwnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHJlcXVpcmVzTG9naW46IHRydWVcbiAgICAgICAgICAgIH0gICAgXG4gICAgICAgIH0pO1xuICAgIH1dKVxuXG4gICAgLmZhY3RvcnkoJ3VzZXJVcGRhdGVGYWMnLHJlcXVpcmUoJy4vdXNlci51cGRhdGUuZmFjJykpXG5cbiAgICAuY29udHJvbGxlcigndXNlclVwZGF0ZUN0cmwnLHJlcXVpcmUoJy4vdXNlci51cGRhdGUuY3RybCcpKVxuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiIDogXCJhY3R1YWxpemFyIHVzdWFyaW9cIixcbiAgICAgICAgICAgICAgICB9IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckc2NvcGUnLCAndXNlclVwZGF0ZUZhYycsICckbG9jYXRpb24nLFxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCB1c2VyVXBkYXRlRmFjLCAkbG9jYXRpb24pIHtcblxuICAgICAgICAgICAgJHNjb3BlLm9uU3VibWl0ID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgdXNlclVwZGF0ZUZhYy51cGRhdGUoJHNjb3BlLmZtRGF0YSkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocHJvbWlzZS5kYXRhID09IFwiMVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3VzZXInKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS51cGRhdGVGYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgJHNjb3BlLiRvbignJHZpZXdDb250ZW50TG9hZGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIC8vIHRoaXMgY29kZSBpcyBleGVjdXRlZCBhZnRlciB0aGUgdmlldyBpcyBsb2FkZWRcblxuICAgICAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB1c2VyVXBkYXRlRmFjLmRhdGEoKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzT2JqZWN0KGFuZ3VsYXIuZnJvbUpzb24ocHJvbWlzZS5kYXRhKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5mbURhdGEgPSBhbmd1bGFyLmZyb21Kc29uKHByb21pc2UuZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuXG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XTtcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckaHR0cCcsICckcScsICAnJHN0YXRlUGFyYW1zJywgZnVuY3Rpb24gKCRodHRwLCAkcSwgJHN0YXRlUGFyYW1zKSB7XG4gICAgICAgIHZhciBmYWN0b3J5ID0ge307XG4gICAgICAgIGZhY3RvcnkuZGF0YSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKFxuICAgICAgICAgICAgICAgICRodHRwLnBvc3QoJ21vZHVsZXMvdXNlci9tb2R1bGVzL3VzZXIudXBkYXRlL3VzZXIudXBkYXRlLm1kbC5nZXRVc2VyLnBocCcsIHtcbiAgICAgICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgICAgICB1c19pZDogJHN0YXRlUGFyYW1zLnVzX2lkXG4gICAgICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkudXBkYXRlID0gZnVuY3Rpb24gKHVzX2pzb25iKSB7XG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KCdtb2R1bGVzL3VzZXIvbW9kdWxlcy91c2VyLnVwZGF0ZS91c2VyLnVwZGF0ZS5tZGwudXBkYXRlLnBocCcsIHtcbiAgICAgICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgICAgICB1c19pZDogJHN0YXRlUGFyYW1zLnVzX2lkLFxuICAgICAgICAgICAgICAgICAgICB1c19qc29uYjogdXNfanNvbmJcbiAgICAgICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGZhY3Rvcnk7XG4gICAgfV07XG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKGFuZ3VsYXIpe1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBcbiAgICByZXR1cm4gWyckc2NvcGUnLCAndXNlckZhYycsICdpMThuRmlsdGVyJyxcbiAgICBmdW5jdGlvbiAoJHNjb3BlLCB1c2VyRmFjLCBpMThuRmlsdGVyKSB7XG4gICAgICAgIFxuICAgICAgICAkc2NvcGUubGFiZWxzID0gT2JqZWN0LmtleXMoaTE4bkZpbHRlcihcInVzZXIubGFiZWxzXCIpKTtcbiAgICAgICAgJHNjb3BlLmNvbHVtbnMgPSBpMThuRmlsdGVyKFwidXNlci5jb2x1bW5zXCIpO1xuXG4gICAgICAgICRzY29wZS5lZGl0ID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgICAgICBpZiAoYW5ndWxhci5pc051bWJlcihpZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy9FbWJlZCB0aGUgaWQgdG8gdGhlIGxpbmtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGxpbmsgPSBcIiMvdXNlci91cGRhdGUvXCIgKyBpZDtcbiAgICAgICAgICAgICAgICAgICAgLy9PcGVuIHRoZSBsaW5rXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IGxpbms7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUuZHVwbGljYXRlID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgICAgICBpZiAoYW5ndWxhci5pc051bWJlcihpZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGxpbmsgPSBcIiMvdXNlci9kdXBsaWNhdGUvXCIgKyBpZDtcbiAgICAgICAgICAgICAgICAgICAgLy9PcGVuIHRoZSBsaW5rXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IGxpbms7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vIGJpbmQgY29sdW1ucyB3aGVuIGdyaWQgaXMgaW5pdGlhbGl6ZWRcbiAgICAgICAgJHNjb3BlLmluaXRHcmlkID0gZnVuY3Rpb24ocywgZSkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAkc2NvcGUubGFiZWxzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNvbCA9IG5ldyB3aWptby5ncmlkLkNvbHVtbigpO1xuICAgICAgICAgICAgICAgIGNvbC5iaW5kaW5nID0gJHNjb3BlLmNvbHVtbnNbaV07XG4gICAgICAgICAgICAgICAgY29sLmhlYWRlciA9IGkxOG5GaWx0ZXIoXCJ1c2VyLmxhYmVscy5cIiArICRzY29wZS5sYWJlbHNbaV0pO1xuICAgICAgICAgICAgICAgIHMuY29sdW1ucy5wdXNoKGNvbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLiRvbignJHZpZXdDb250ZW50TG9hZGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLy8gdGhpcyBjb2RlIGlzIGV4ZWN1dGVkIGFmdGVyIHRoZSB2aWV3IGlzIGxvYWRlZFxuICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgdXNlckZhYy5kYXRhKCkudGhlbihmdW5jdGlvbihwcm9taXNlKXtcbiAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGlmKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5kYXRhID0gbmV3IHdpam1vLmNvbGxlY3Rpb25zLkNvbGxlY3Rpb25WaWV3KHByb21pc2UuZGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICB9KTtcbiAgICB9XTtcbiAgICBcbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgcmV0dXJuIFsnJGh0dHAnLCAnJHEnLCAgZnVuY3Rpb24gKCRodHRwLCAkcSkge1xuICAgICAgICB2YXIgZmFjdG9yeSA9IHt9O1xuICAgICAgICBmYWN0b3J5LmRhdGEgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KCdtb2R1bGVzL3VzZXIvdXNlci5tZGwuZ2V0VXNlcnMucGhwJywge1xuICAgICAgICAgICAgICAgICAgICAvKiBQT1NUIHZhcmlhYmxlcyBoZXJlICovXG4gICAgICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBmYWN0b3J5O1xuICAgIH1dO1xuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbihhbmd1bGFyKXtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgXG4gICAgcmV0dXJuIGFuZ3VsYXIubW9kdWxlKCdhcHAud28nLFtcbiAgICAgICAgcmVxdWlyZSgnLi9tb2R1bGVzL3dvLmFkZCcpLm5hbWUsXG4gICAgICAgIHJlcXVpcmUoJy4vbW9kdWxlcy93by51cGRhdGUnKS5uYW1lLFxuICAgICAgICByZXF1aXJlKCcuL21vZHVsZXMvd28uZHVwbGljYXRlJykubmFtZVxuICAgIF0pXG5cbiAgICAuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJyxcbiAgICBmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCd3bycsIHtcbiAgICAgICAgICAgIHVybDonL3dvLzpjbF9pZCcsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybCA6ICdhcHAvd28vd28udmlldy5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXIgOiAnd29Db250cm9sbGVyJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICByZXF1aXJlc0xvZ2luOiB0cnVlXG4gICAgICAgICAgICB9ICAgIFxuICAgICAgICB9KTtcbiAgICB9XSlcblxuICAgIC5mYWN0b3J5KCd3b0ZhY3RvcnknLHJlcXVpcmUoJy4vd28uZmFjJykpXG5cbiAgICAuY29udHJvbGxlcignd29Db250cm9sbGVyJyxyZXF1aXJlKCcuL3dvLmN0cmwnKSlcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgXCJ0aXRsZVwiOiBcIk9yZGVuZXMgZGUgVHJhYmFqb1wiLFxuICAgIFwibGFiZWxzXCI6IHtcbiAgICAgICAgXCJ3by1pZFwiOiBcIk5vLiBvcmRlblwiLFxuICAgICAgICBcImNsLWlkXCI6IFwiY2xpZW50ZVwiLFxuICAgICAgICBcInpvLWlkXCI6IFwiem9uYVwiLFxuICAgICAgICBcIndvLW9yZGVyZWRieVwiOiBcIk9yZGVuYWRvIHBvclwiLFxuICAgICAgICBcIndvLWF0dGVudGlvblwiOiBcIkF0ZW5jacOzblwiLFxuICAgICAgICBcIm1hLWlkXCI6IFwiTWFxdWluYVwiLFxuICAgICAgICBcIndvLXJlbGVhc2VcIjogXCJSZWxlYXNlXCIsXG4gICAgICAgIFwid28tcG9cIjogXCJPcmRlbiBkZSBjb21wcmFcIixcbiAgICAgICAgXCJ3by1saW5lXCI6IFwiTGluZWFcIixcbiAgICAgICAgXCJ3by1saW5ldG90YWxcIjogXCJEZVwiLFxuICAgICAgICBcInByLWlkXCI6IFwiUHJvZHVjdG9cIixcbiAgICAgICAgXCJ3by1xdHlcIjogXCJDYW50aWRhZFwiLFxuICAgICAgICBcIndvLXBhY2thZ2VxdHlcIjogXCJDYW50aWRhZCB4IHBhcXVldGVcIixcbiAgICAgICAgXCJ3by1leGNlZGVudHF0eVwiOiBcIkV4Y2VkZW50ZVwiLFxuICAgICAgICBcIndvLWZvbGlvc3BlcmZvcm1hdFwiOiBcIkZvbGlvcyB4IGZvcm1hdG9cIixcbiAgICAgICAgXCJ3by1mb2xpb3NzZXJpZXNcIjogXCJTZXJpZVwiLFxuICAgICAgICBcIndvLWZvbGlvc2Zyb21cIjogXCJEZWxcIixcbiAgICAgICAgXCJ3by1mb2xpb3N0b1wiOiBcIkFsXCIsXG4gICAgICAgIFwid28tdHlwZVwiOiBcIlRpcG9cIixcbiAgICAgICAgXCJ3by1jb21taXRtZW50ZGF0ZVwiOiBcIkZlY2hhIGNvbXByb21pc29cIixcbiAgICAgICAgXCJ3by1wcmV2aW91c2lkXCI6IFwiSUQgYW50ZXJpb3JcIixcbiAgICAgICAgXCJ3by1wcmV2aW91c2RhdGVcIjogXCJGZWNoYSBhbnRlcmlvclwiLFxuICAgICAgICBcIndvLW5vdGVzXCI6IFwiTm90YXNcIixcbiAgICAgICAgXCJ3by1wcmljZVwiOiBcIlByZWNpb1wiLFxuICAgICAgICBcIndvLWN1cnJlbmN5XCI6IFwiTW9uZWRhXCIsXG4gICAgICAgIFwid28tZW1haWxcIjogXCJFbnZpYXIgQ29ycmVvXCIsXG4gICAgICAgIFwid28tc3RhdHVzXCI6IFwiRXN0YXR1c1wiLFxuICAgICAgICBcIndvLWRhdGVcIjogXCJGZWNoYVwiXG4gICAgfSxcbiAgICBcImNvbHVtbnNcIjogW1xuICAgICAgICBcIndvX2lkXCIsXG4gICAgICAgIFwiY2xfaWRcIixcbiAgICAgICAgXCJ6b19pZFwiLFxuICAgICAgICBcIndvX29yZGVyZWRieVwiLFxuICAgICAgICBcIndvX2F0dGVudGlvblwiLFxuICAgICAgICBcIm1hX2lkXCIsXG4gICAgICAgIFwid29fcmVsZWFzZVwiLFxuICAgICAgICBcIndvX3BvXCIsXG4gICAgICAgIFwid29fbGluZVwiLFxuICAgICAgICBcIndvX2xpbmV0b3RhbFwiLFxuICAgICAgICBcInByX2lkXCIsXG4gICAgICAgIFwid29fcXR5XCIsXG4gICAgICAgIFwid29fcGFja2FnZXF0eVwiLFxuICAgICAgICBcIndvX2V4Y2VkZW50cXR5XCIsXG4gICAgICAgIFwid29fZm9saW9zcGVyZm9ybWF0XCIsXG4gICAgICAgIFwid29fZm9saW9zc2VyaWVzXCIsXG4gICAgICAgIFwid29fZm9saW9zZnJvbVwiLFxuICAgICAgICBcIndvX2ZvbGlvc3RvXCIsXG4gICAgICAgIFwid29fdHlwZVwiLFxuICAgICAgICBcIndvX2NvbW1pdG1lbnRkYXRlXCIsXG4gICAgICAgIFwid29fcHJldmlvdXNpZFwiLFxuICAgICAgICBcIndvX3ByZXZpb3VzZGF0ZVwiLFxuICAgICAgICBcIndvX25vdGVzXCIsXG4gICAgICAgIFwid29fcHJpY2VcIixcbiAgICAgICAgXCJ3b19jdXJyZW5jeVwiLFxuICAgICAgICBcIndvX2VtYWlsXCIsXG4gICAgICAgIFwid29fc3RhdHVzXCIsXG4gICAgICAgIFwid29fZGF0ZVwiXG4gICAgXVxufSIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKGFuZ3VsYXIpe1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBcbiAgICByZXR1cm4gYW5ndWxhci5tb2R1bGUoJ2FwcC53by5hZGQnLFtdKVxuXG4gICAgLmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsXG4gICAgZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnd29BZGQnLCB7XG4gICAgICAgICAgICB1cmw6Jy93by9hZGQvOmNsX2lkJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsIDogJ2FwcC93by9tb2R1bGVzL3dvLmFkZC93by5hZGQudmlldy5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXIgOiAnd29BZGRDb250cm9sbGVyJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICByZXF1aXJlc0xvZ2luOiB0cnVlXG4gICAgICAgICAgICB9ICAgIFxuICAgICAgICB9KTtcbiAgICB9XSlcblxuICAgIC5mYWN0b3J5KCd3b0FkZEZhY3RvcnknLHJlcXVpcmUoJy4vd28uYWRkLmZhYycpKVxuXG4gICAgLmNvbnRyb2xsZXIoJ3dvQWRkQ29udHJvbGxlcicscmVxdWlyZSgnLi93by5hZGQuY3RybCcpKVxuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBcInRpdGxlXCI6IFwiQWdyZWdhciBPcmRlbiBkZSBUcmFiYWpvXCIsXG4gICAgXCJsYWJlbHNcIjoge1xuICAgICAgICBcImNsLWlkXCI6IFwiY2xpZW50ZVwiLFxuICAgICAgICBcInpvLWlkXCI6IFwiem9uYVwiLFxuICAgICAgICBcIndvLW9yZGVyZWRieVwiOiBcIk9yZGVuYWRvIHBvclwiLFxuICAgICAgICBcIndvLWF0dGVudGlvblwiOiBcIkF0ZW5jacOzblwiLFxuICAgICAgICBcIm1hLWlkXCI6IFwiTWFxdWluYVwiLFxuICAgICAgICBcIndvLXJlbGVhc2VcIjogXCJSZWxlYXNlXCIsXG4gICAgICAgIFwid28tcG9cIjogXCJPcmRlbiBkZSBjb21wcmFcIixcbiAgICAgICAgXCJ3by1saW5lXCI6IFwiTGluZWFcIixcbiAgICAgICAgXCJ3by1saW5ldG90YWxcIjogXCJEZVwiLFxuICAgICAgICBcInByLWlkXCI6IFwiUHJvZHVjdG9cIixcbiAgICAgICAgXCJwci1wYXJ0bm9cIjogXCJOby4gZGUgcGFydGVcIixcbiAgICAgICAgXCJwci1jb2RlXCI6IFwiQ29kaWdvXCIsXG4gICAgICAgIFwicHItbmFtZVwiOiBcIk5vbWJyZVwiLFxuICAgICAgICBcIndvLXF0eVwiOiBcIkNhbnRpZGFkXCIsXG4gICAgICAgIFwid28tcGFja2FnZXF0eVwiOiBcIkNhbnRpZGFkIHggcGFxdWV0ZVwiLFxuICAgICAgICBcIndvLWV4Y2VkZW50cXR5XCI6IFwiRXhjZWRlbnRlXCIsXG4gICAgICAgIFwid28tZm9saW9zcGVyZm9ybWF0XCI6IFwiRm9saW9zIHggZm9ybWF0b1wiLFxuICAgICAgICBcIndvLWZvbGlvc3Nlcmllc1wiOiBcIlNlcmllXCIsXG4gICAgICAgIFwid28tZm9saW9zZnJvbVwiOiBcIkRlbFwiLFxuICAgICAgICBcIndvLWZvbGlvc3RvXCI6IFwiQWxcIixcbiAgICAgICAgXCJ3by10eXBlXCI6IFwiVGlwb1wiLFxuICAgICAgICBcIndvLWlkXCI6IFwiTm8uIG9yZGVuXCIsXG4gICAgICAgIFwid28tZGF0ZVwiOiBcIkZlY2hhXCIsXG4gICAgICAgIFwid28tY29tbWl0bWVudGRhdGVcIjogXCJGZWNoYSBjb21wcm9taXNvXCIsXG4gICAgICAgIFwid28tcHJldmlvdXNpZFwiOiBcIklEIGFudGVyaW9yXCIsXG4gICAgICAgIFwid28tcHJldmlvdXNkYXRlXCI6IFwiRmVjaGEgYW50ZXJpb3JcIixcbiAgICAgICAgXCJ3by1ub3Rlc1wiOiBcIk5vdGFzXCIsXG4gICAgICAgIFwid28tcHJpY2VcIjogXCJQcmVjaW9cIixcbiAgICAgICAgXCJ3by1jdXJyZW5jeVwiOiBcIk1vbmVkYVwiLFxuICAgICAgICBcIndvLWVtYWlsXCI6IFwiRW52aWFyIENvcnJlb1wiLFxuICAgICAgICBcIndvLXN0YXR1c1wiOiBcIkVzdGF0dXNcIlxuICAgIH0sXG4gICAgXCJjb2x1bW5zXCI6IFtcbiAgICAgICAgXCJjbF9pZFwiLFxuICAgICAgICBcInpvX2lkXCIsXG4gICAgICAgIFwid29fb3JkZXJlZGJ5XCIsXG4gICAgICAgIFwid29fYXR0ZW50aW9uXCIsXG4gICAgICAgIFwibWFfaWRcIixcbiAgICAgICAgXCJ3b19yZWxlYXNlXCIsXG4gICAgICAgIFwid29fcG9cIixcbiAgICAgICAgXCJ3b19saW5lXCIsXG4gICAgICAgIFwid29fbGluZXRvdGFsXCIsXG4gICAgICAgIFwicHJfaWRcIixcbiAgICAgICAgXCJwcl9wYXJ0bm9cIixcbiAgICAgICAgXCJwcl9jb2RlXCIsXG4gICAgICAgIFwicHJfbmFtZVwiLFxuICAgICAgICBcIndvX3F0eVwiLFxuICAgICAgICBcIndvX3BhY2thZ2VxdHlcIixcbiAgICAgICAgXCJ3b19leGNlZGVudHF0eVwiLFxuICAgICAgICBcIndvX2ZvbGlvc3BlcmZvcm1hdFwiLFxuICAgICAgICBcIndvX2ZvbGlvc3Nlcmllc1wiLFxuICAgICAgICBcIndvX2ZvbGlvc2Zyb21cIixcbiAgICAgICAgXCJ3b19mb2xpb3N0b1wiLFxuICAgICAgICBcIndvX3R5cGVcIixcbiAgICAgICAgXCJ3b19pZFwiLFxuICAgICAgICBcIndvX2RhdGVcIixcbiAgICAgICAgXCJ3b19jb21taXRtZW50ZGF0ZVwiLFxuICAgICAgICBcIndvX3ByZXZpb3VzaWRcIixcbiAgICAgICAgXCJ3b19wcmV2aW91c2RhdGVcIixcbiAgICAgICAgXCJ3b19ub3Rlc1wiLFxuICAgICAgICBcIndvX3ByaWNlXCIsXG4gICAgICAgIFwid29fY3VycmVuY3lcIixcbiAgICAgICAgXCJ3b19lbWFpbFwiLFxuICAgICAgICBcIndvLXN0YXR1c1wiXG4gICAgXSxcbiAgICBcImZpZWxkc1wiOiB7XG4gICAgICAgIHdvX2ZvbGlvc3BlcmZvcm1hdG9wdGlvbnM6IFtcbiAgICAgICAgICAgIHsgXCJsYWJlbFwiOiBcIjFcIiwgXCJ2YWx1ZVwiOiAxIH0sXG4gICAgICAgICAgICB7IFwibGFiZWxcIjogXCIyXCIsIFwidmFsdWVcIjogMiB9LFxuICAgICAgICAgICAgeyBcImxhYmVsXCI6IFwiM1wiLCBcInZhbHVlXCI6IDMgfSxcbiAgICAgICAgICAgIHsgXCJsYWJlbFwiOiBcIjRcIiwgXCJ2YWx1ZVwiOiA0IH0sXG4gICAgICAgICAgICB7IFwibGFiZWxcIjogXCI1XCIsIFwidmFsdWVcIjogNSB9LFxuICAgICAgICAgICAgeyBcImxhYmVsXCI6IFwiNlwiLCBcInZhbHVlXCI6IDYgfSxcbiAgICAgICAgICAgIHsgXCJsYWJlbFwiOiBcIjdcIiwgXCJ2YWx1ZVwiOiA3IH0sXG4gICAgICAgICAgICB7IFwibGFiZWxcIjogXCI4XCIsIFwidmFsdWVcIjogOCB9LFxuICAgICAgICBdLFxuICAgICAgICB3b19jdXJyZW5jeW9wdGlvbnM6IFtcbiAgICAgICAgICAgIHsgXCJsYWJlbFwiOiBcIk1YTlwiLCBcInZhbHVlXCI6IFwiTVhOXCIgfSxcbiAgICAgICAgICAgIHsgXCJsYWJlbFwiOiBcIkRMTFNcIiwgXCJ2YWx1ZVwiOiBcIkRMTFNcIiB9LFxuICAgICAgICBdLFxuICAgICAgICB3b19lbWFpbG9wdGlvbnM6IFtcbiAgICAgICAgICAgIHsgXCJsYWJlbFwiOiBcIlNJXCIsIFwidmFsdWVcIjogXCJ5ZXNcIiB9LFxuICAgICAgICAgICAgeyBcImxhYmVsXCI6IFwiTk9cIiwgXCJ2YWx1ZVwiOiBcIm5vXCIgfSxcbiAgICAgICAgXVxuICAgIH1cbn0iLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRzY29wZScsICd3b0FkZEZhY3RvcnknLCAnJHN0YXRlUGFyYW1zJywgJ2kxOG5GaWx0ZXInLCAnJGZpbHRlcicsICckbG9jYXRpb24nLFxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCB3b0FkZEZhY3RvcnksICRzdGF0ZVBhcmFtcywgaTE4bkZpbHRlciwgJGZpbHRlciwgJGxvY2F0aW9uKSB7XG4gICAgICAgICAgICAkc2NvcGUuZm1EYXRhID0ge307XG4gICAgICAgICAgICAvLyRzY29wZS5mbURhdGEgPSB7XCJ6b19pZFwiOiBcIjJcIiwgXCJ3b19vcmRlcmVkYnlcIjogXCJBbGVqYW5kcm9cIiwgXCJ3b19hdHRlbnRpb25cIjogXCJNYXJjb1wiLCBcIm1hX2lkXCI6IDEsIFwid29fcmVsZWFzZVwiOiBcInJlbDAwMVwiLCBcIndvX3BvXCI6IFwiQUJDMDAxXCIsIFwid29fbGluZVwiOiBcIjFcIiwgXCJ3b19saW5ldG90YWxcIjogXCI0XCIsIFwicHJfaWRcIjogXCIxNVwiLCBcIndvX3F0eVwiOiBcIjEwMFwiLCBcIndvX3BhY2thZ2VxdHlcIjogXCIxMFwiLCBcIndvX2V4Y2VkZW50cXR5XCI6IFwiMTBcIiwgXCJ3b19mb2xpb3NwZXJmb3JtYXRcIjogMSwgXCJ3b19mb2xpb3NzZXJpZXNcIjogXCJBXCIsIFwid29fZm9saW9zZnJvbVwiOiBcIjFcIiwgXCJ3b19mb2xpb3N0b1wiOiBcIjEwMFwiLCBcIndvX2NvbW1pdG1lbnRkYXRlXCI6IFwiMjAxNi0wNy0wMVwiLCBcIndvX25vdGVzXCI6IFwiRXN0YSBlcyB1bmEgb3JkZW4gZGUgcHJ1ZWJhXCIsIFwid29fcHJpY2VcIjogXCI5OS45OVwiLCBcIndvX2N1cnJlbmN5XCI6IFwiRExMU1wiLCBcIndvX2VtYWlsXCI6IFwieWVzXCIgfTtcbiAgICAgICAgICAgICRzY29wZS5mbURhdGEud29fdHlwZSA9IFwiTlwiOyAvL04tbmV3LFItcmVwLEMtY2hhbmdlXG4gICAgICAgICAgICAkc2NvcGUuZm1EYXRhLndvX3N0YXR1cyA9IDA7IC8vMC1BY3RpdmVcbiAgICAgICAgICAgICRzY29wZS5mbURhdGEuY2xfaWQgPSAkc3RhdGVQYXJhbXMuY2xfaWQ7XG5cbiAgICAgICAgICAgICRzY29wZS53b19mb2xpb3NwZXJmb3JtYXRvcHRpb25zID0gaTE4bkZpbHRlcihcIndvLWFkZC5maWVsZHMud29fZm9saW9zcGVyZm9ybWF0b3B0aW9uc1wiKTtcbiAgICAgICAgICAgICRzY29wZS53b19jdXJyZW5jeW9wdGlvbnMgPSBpMThuRmlsdGVyKFwid28tYWRkLmZpZWxkcy53b19jdXJyZW5jeW9wdGlvbnNcIik7XG4gICAgICAgICAgICAkc2NvcGUud29fZW1haWxvcHRpb25zID0gaTE4bkZpbHRlcihcIndvLWFkZC5maWVsZHMud29fZW1haWxvcHRpb25zXCIpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAkc2NvcGUub25TdWJtaXQgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICB3b0FkZEZhY3RvcnkuYWRkKCRzY29wZS5mbURhdGEpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb21pc2UuZGF0YS5yb3dDb3VudCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy93by8nKyRzdGF0ZVBhcmFtcy5jbF9pZCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICRzY29wZS4kb24oJyR2aWV3Q29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAvLyB0aGlzIGNvZGUgaXMgZXhlY3V0ZWQgYWZ0ZXIgdGhlIHZpZXcgaXMgbG9hZGVkXG4gICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHdvQWRkRmFjdG9yeS5nZXRab25lKCkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuem9faWRvcHRpb25zID0gW107XG4gICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJvd3MgPSBwcm9taXNlLmRhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2gocm93cywgZnVuY3Rpb24gKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnB1c2goeyBcImxhYmVsXCI6IHJvd3Nba2V5XVsnem9fanNvbmInXVsnem9fbmFtZSddLCBcInZhbHVlXCI6IHJvd3Nba2V5XVsnem9faWQnXSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sICRzY29wZS56b19pZG9wdGlvbnMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgd29BZGRGYWN0b3J5LmdldE1hY2hpbmUoKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5tYV9pZG9wdGlvbnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcm93cyA9IHByb21pc2UuZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChyb3dzLCBmdW5jdGlvbiAodmFsdWUsIGtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHVzaCh7IFwibGFiZWxcIjogcm93c1trZXldWydtYV9qc29uYiddWydtYV9uYW1lJ10sIFwidmFsdWVcIjogcm93c1trZXldWydtYV9pZCddIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgJHNjb3BlLm1hX2lkb3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB3b0FkZEZhY3RvcnkuZ2V0UHJvZHVjdCgpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnByX2lkb3B0aW9ucyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICB2YXIgcm93cyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3MgPSBwcm9taXNlLmRhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2gocm93cywgZnVuY3Rpb24gKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnB1c2goeyBcImxhYmVsXCI6IHJvd3Nba2V5XVsncHJfaWQnXSArICdfJyArIHJvd3Nba2V5XVsncHJfanNvbmInXVsncHJfbmFtZSddICsgJ18nICsgcm93c1trZXldWydwcl9qc29uYiddWydwcl9jb2RlJ10sIFwidmFsdWVcIjogcm93c1trZXldWydwcl9pZCddIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgJHNjb3BlLnByX2lkb3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS4kd2F0Y2goXG4gICAgICAgICAgICAgICAgICAgICAgICBcImZtRGF0YS5wcl9pZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gcHJDaGFuZ2UoIG5ld1ZhbHVlLCBvbGRWYWx1ZSApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcHJvZHVjdCA9ICRmaWx0ZXIoJ2ZpbHRlcicpKHJvd3MsIHsgXCJwcl9pZFwiOiBuZXdWYWx1ZSB9LCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJvZHVjdC5sZW5ndGggIT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnByaW5mbyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnByaW5mbyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5wcm9kdWN0ID0gcHJvZHVjdFswXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmZvbGlvID0gKHByb2R1Y3RbMF1bJ3ByX2pzb25iJ11bJ3ByX2ZvbGlvJ109PT0neWVzJykgPyB0cnVlIDogZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfV07XG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckaHR0cCcsICckcScsICAnJHN0YXRlUGFyYW1zJywgZnVuY3Rpb24oJGh0dHAsICRxLCAkc3RhdGVQYXJhbXMpIHtcbiAgICAgICAgdmFyIGZhY3RvcnkgPSB7fTtcbiAgICAgICAgZmFjdG9yeS5nZXRab25lID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KCcvYXBpL3pvbmUvY2xfaWQnLCB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICAgICAgY2xfaWQ6ICRzdGF0ZVBhcmFtcy5jbF9pZFxuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeS5nZXRNYWNoaW5lID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KCcvYXBpL21hY2hpbmUnLCB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICAgICAgY2xfaWQ6ICRzdGF0ZVBhcmFtcy5jbF9pZFxuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeS5nZXRQcm9kdWN0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KCcvYXBpL3Byb2R1Y3QvY2xfaWQnLCB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICAgICAgY2xfaWQ6ICRzdGF0ZVBhcmFtcy5jbF9pZCxcbiAgICAgICAgICAgICAgICAgICAgcHJfc3RhdHVzOiAnQSdcbiAgICAgICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkuYWRkID0gZnVuY3Rpb24od29fanNvbmIpIHtcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gJGh0dHAucG9zdCgnL2FwaS93by9hZGQnLCB7XG4gICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgIHdvX2pzb25iOiB3b19qc29uYlxuICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBmYWN0b3J5O1xuICAgIH1dO1xuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbihhbmd1bGFyKXtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgXG4gICAgcmV0dXJuIGFuZ3VsYXIubW9kdWxlKCdhcHAud28uZHVwbGljYXRlJyxbXSlcblxuICAgIC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLFxuICAgIGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcbiAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3dvRHVwbGljYXRlJywge1xuICAgICAgICAgICAgdXJsOicvd28vZHVwbGljYXRlLzpjbF9pZC86d29faWQnLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmwgOiAnYXBwL3dvL21vZHVsZXMvd28uZHVwbGljYXRlL3dvLmR1cGxpY2F0ZS52aWV3Lmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlciA6ICd3b0R1cGxpY2F0ZUNvbnRyb2xsZXInLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHJlcXVpcmVzTG9naW46IHRydWVcbiAgICAgICAgICAgIH0gICAgXG4gICAgICAgIH0pO1xuICAgIH1dKVxuXG4gICAgLmZhY3RvcnkoJ3dvRHVwbGljYXRlRmFjdG9yeScscmVxdWlyZSgnLi93by5kdXBsaWNhdGUuZmFjJykpXG5cbiAgICAuY29udHJvbGxlcignd29EdXBsaWNhdGVDb250cm9sbGVyJyxyZXF1aXJlKCcuL3dvLmR1cGxpY2F0ZS5jdHJsJykpXG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgcmV0dXJuIFsnJHNjb3BlJywgJ3dvRHVwbGljYXRlRmFjdG9yeScsICckc3RhdGVQYXJhbXMnLCAnaTE4bkZpbHRlcicsICckZmlsdGVyJyxcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgd29EdXBsaWNhdGVGYWN0b3J5LCAkc3RhdGVQYXJhbXMsIGkxOG5GaWx0ZXIsICRmaWx0ZXIpIHtcblxuICAgICAgICAgICAgJHNjb3BlLndvX2ZvbGlvc3BlcmZvcm1hdG9wdGlvbnMgPSBpMThuRmlsdGVyKFwid28tYWRkLmZpZWxkcy53b19mb2xpb3NwZXJmb3JtYXRvcHRpb25zXCIpO1xuICAgICAgICAgICAgJHNjb3BlLndvX2N1cnJlbmN5b3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJ3by1hZGQuZmllbGRzLndvX2N1cnJlbmN5b3B0aW9uc1wiKTtcbiAgICAgICAgICAgICRzY29wZS53b19lbWFpbG9wdGlvbnMgPSBpMThuRmlsdGVyKFwid28tYWRkLmZpZWxkcy53b19lbWFpbG9wdGlvbnNcIik7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICRzY29wZS5vblN1Ym1pdCA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgIHdvRHVwbGljYXRlRmFjdG9yeS5hZGQoJHNjb3BlLmZtRGF0YSkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocHJvbWlzZS5kYXRhLnJvd0NvdW50ID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvd28vJyskc3RhdGVQYXJhbXMuY2xfaWQpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnVwZGF0ZUZhaWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAkc2NvcGUuJG9uKCckdmlld0NvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgLy8gdGhpcyBjb2RlIGlzIGV4ZWN1dGVkIGFmdGVyIHRoZSB2aWV3IGlzIGxvYWRlZFxuICAgICAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB3b0R1cGxpY2F0ZUZhY3RvcnkuZ2V0RGF0YSgpLnRoZW4oZnVuY3Rpb24ocHJvbWlzZSl7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGlmKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEpICYmIHByb21pc2UuZGF0YS5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZm1EYXRhID0gcHJvbWlzZS5kYXRhWzBdLndvX2pzb25iO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5mbURhdGEud29fcHJldmlvdXNpZCA9IHByb21pc2UuZGF0YVswXS53b19pZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZm1EYXRhLndvX3ByZXZpb3VzZGF0ZSA9IHByb21pc2UuZGF0YVswXS53b19kYXRlLnN1YnN0cmluZygwLCAxMCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB3b0R1cGxpY2F0ZUZhY3RvcnkuZ2V0Wm9uZSgpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnpvX2lkb3B0aW9ucyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByb3dzID0gcHJvbWlzZS5kYXRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHJvd3MsIGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wdXNoKHsgXCJsYWJlbFwiOiByb3dzW2tleV1bJ3pvX2pzb25iJ11bJ3pvX25hbWUnXSwgXCJ2YWx1ZVwiOiByb3dzW2tleV1bJ3pvX2lkJ10gfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAkc2NvcGUuem9faWRvcHRpb25zKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHdvRHVwbGljYXRlRmFjdG9yeS5nZXRNYWNoaW5lKCkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUubWFfaWRvcHRpb25zID0gW107XG4gICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJvd3MgPSBwcm9taXNlLmRhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2gocm93cywgZnVuY3Rpb24gKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnB1c2goeyBcImxhYmVsXCI6IHJvd3Nba2V5XVsnbWFfanNvbmInXVsnbWFfbmFtZSddLCBcInZhbHVlXCI6IHJvd3Nba2V5XVsnbWFfaWQnXSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sICRzY29wZS5tYV9pZG9wdGlvbnMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgd29EdXBsaWNhdGVGYWN0b3J5LmdldFByb2R1Y3QoKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5wcl9pZG9wdGlvbnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJvd3MgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3dzID0gcHJvbWlzZS5kYXRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHJvd3MsIGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wdXNoKHsgXCJsYWJlbFwiOiByb3dzW2tleV1bJ3ByX2lkJ10gKyAnXycgKyByb3dzW2tleV1bJ3ByX2pzb25iJ11bJ3ByX25hbWUnXSArICdfJyArIHJvd3Nba2V5XVsncHJfanNvbmInXVsncHJfY29kZSddLCBcInZhbHVlXCI6IHJvd3Nba2V5XVsncHJfaWQnXSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sICRzY29wZS5wcl9pZG9wdGlvbnMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuJHdhdGNoKFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJmbURhdGEucHJfaWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHByQ2hhbmdlKCBuZXdWYWx1ZSwgb2xkVmFsdWUgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHByb2R1Y3QgPSAkZmlsdGVyKCdmaWx0ZXInKShyb3dzLCB7IFwicHJfaWRcIjogbmV3VmFsdWUgfSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByb2R1Y3QubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUucHJpbmZvID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUucHJpbmZvID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnByb2R1Y3QgPSBwcm9kdWN0WzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZm9saW8gPSAocHJvZHVjdFswXVsncHJfanNvbmInXVsncHJfZm9saW8nXT09PSd5ZXMnKSA/IHRydWUgOiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XTtcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckaHR0cCcsICckcScsICAnJHN0YXRlUGFyYW1zJywgZnVuY3Rpb24gKCRodHRwLCAkcSwgJHN0YXRlUGFyYW1zKSB7XG4gICAgICAgIHZhciBmYWN0b3J5ID0ge307XG4gICAgICAgIGZhY3RvcnkuZ2V0RGF0YSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKFxuICAgICAgICAgICAgICAgICRodHRwLnBvc3QoJy9hcGkvd28vd29faWQnLCB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICAgICAgY2xfaWQ6ICRzdGF0ZVBhcmFtcy5jbF9pZCxcbiAgICAgICAgICAgICAgICAgICAgd29faWQ6ICRzdGF0ZVBhcmFtcy53b19pZFxuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICBmYWN0b3J5LmdldFpvbmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KCcvYXBpL3pvbmUvY2xfaWQnLCB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICAgICAgY2xfaWQ6ICRzdGF0ZVBhcmFtcy5jbF9pZFxuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICBmYWN0b3J5LmdldE1hY2hpbmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KCcvYXBpL21hY2hpbmUnLCB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICAgICAgY2xfaWQ6ICRzdGF0ZVBhcmFtcy5jbF9pZFxuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICBmYWN0b3J5LmdldFByb2R1Y3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KCcvYXBpL3Byb2R1Y3QvY2xfaWQnLCB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICAgICAgY2xfaWQ6ICRzdGF0ZVBhcmFtcy5jbF9pZCxcbiAgICAgICAgICAgICAgICAgICAgcHJfc3RhdHVzOiAnQSdcbiAgICAgICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeS5hZGQgPSBmdW5jdGlvbiAod29fanNvbmIpIHtcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gJGh0dHAucG9zdCgnL2FwaS93by9hZGQnLCB7XG4gICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgIHdvX2pzb25iOiB3b19qc29uYlxuICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShjb25maWcpKVxuICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBmYWN0b3J5O1xuICAgIH1dO1xuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbihhbmd1bGFyKXtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgXG4gICAgcmV0dXJuIGFuZ3VsYXIubW9kdWxlKCdhcHAud28udXBkYXRlJyxbXSlcblxuICAgIC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLFxuICAgIGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcbiAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3dvVXBkYXRlJywge1xuICAgICAgICAgICAgdXJsOicvd28vdXBkYXRlLzpjbF9pZC86d29faWQnLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmwgOiAnYXBwL3dvL21vZHVsZXMvd28udXBkYXRlL3dvLnVwZGF0ZS52aWV3Lmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlciA6ICd3b1VwZGF0ZUNvbnRyb2xsZXInLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHJlcXVpcmVzTG9naW46IHRydWVcbiAgICAgICAgICAgIH0gICAgXG4gICAgICAgIH0pO1xuICAgIH1dKVxuXG4gICAgLmZhY3RvcnkoJ3dvVXBkYXRlRmFjdG9yeScscmVxdWlyZSgnLi93by51cGRhdGUuZmFjJykpXG5cbiAgICAuY29udHJvbGxlcignd29VcGRhdGVDb250cm9sbGVyJyxyZXF1aXJlKCcuL3dvLnVwZGF0ZS5jdHJsJykpXG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgIFwidGl0bGVcIjogXCJBY3R1YWxpemFyIE9yZGVuIGRlIFRyYWJham9cIixcbiAgICBcImxhYmVsc1wiOiB7XG4gICAgICAgIFwiY2wtaWRcIjogXCJjbGllbnRlXCIsXG4gICAgICAgIFwiem8taWRcIjogXCJ6b25hXCIsXG4gICAgICAgIFwid28tb3JkZXJlZGJ5XCI6IFwiT3JkZW5hZG8gcG9yXCIsXG4gICAgICAgIFwid28tYXR0ZW50aW9uXCI6IFwiQXRlbmNpw7NuXCIsXG4gICAgICAgIFwibWEtaWRcIjogXCJNYXF1aW5hXCIsXG4gICAgICAgIFwid28tcmVsZWFzZVwiOiBcIlJlbGVhc2VcIixcbiAgICAgICAgXCJ3by1wb1wiOiBcIk9yZGVuIGRlIGNvbXByYVwiLFxuICAgICAgICBcIndvLWxpbmVcIjogXCJMaW5lYVwiLFxuICAgICAgICBcIndvLWxpbmV0b3RhbFwiOiBcIkRlXCIsXG4gICAgICAgIFwicHItaWRcIjogXCJQcm9kdWN0b1wiLFxuICAgICAgICBcInByLXBhcnRub1wiOiBcIk5vLiBkZSBwYXJ0ZVwiLFxuICAgICAgICBcInByLWNvZGVcIjogXCJDb2RpZ29cIixcbiAgICAgICAgXCJwci1uYW1lXCI6IFwiTm9tYnJlXCIsXG4gICAgICAgIFwid28tcXR5XCI6IFwiQ2FudGlkYWRcIixcbiAgICAgICAgXCJ3by1wYWNrYWdlcXR5XCI6IFwiQ2FudGlkYWQgeCBwYXF1ZXRlXCIsXG4gICAgICAgIFwid28tZXhjZWRlbnRxdHlcIjogXCJFeGNlZGVudGVcIixcbiAgICAgICAgXCJ3by1mb2xpb3NwZXJmb3JtYXRcIjogXCJGb2xpb3MgeCBmb3JtYXRvXCIsXG4gICAgICAgIFwid28tZm9saW9zc2VyaWVzXCI6IFwiU2VyaWVcIixcbiAgICAgICAgXCJ3by1mb2xpb3Nmcm9tXCI6IFwiRGVsXCIsXG4gICAgICAgIFwid28tZm9saW9zdG9cIjogXCJBbFwiLFxuICAgICAgICBcIndvLXR5cGVcIjogXCJUaXBvXCIsXG4gICAgICAgIFwid28taWRcIjogXCJOby4gb3JkZW5cIixcbiAgICAgICAgXCJ3by1kYXRlXCI6IFwiRmVjaGFcIixcbiAgICAgICAgXCJ3by1jb21taXRtZW50ZGF0ZVwiOiBcIkZlY2hhIGNvbXByb21pc29cIixcbiAgICAgICAgXCJ3by1wcmV2aW91c2lkXCI6IFwiSUQgYW50ZXJpb3JcIixcbiAgICAgICAgXCJ3by1wcmV2aW91c2RhdGVcIjogXCJGZWNoYSBhbnRlcmlvclwiLFxuICAgICAgICBcIndvLW5vdGVzXCI6IFwiTm90YXNcIixcbiAgICAgICAgXCJ3by1wcmljZVwiOiBcIlByZWNpb1wiLFxuICAgICAgICBcIndvLWN1cnJlbmN5XCI6IFwiTW9uZWRhXCIsXG4gICAgICAgIFwid28tZW1haWxcIjogXCJFbnZpYXIgQ29ycmVvXCIsXG4gICAgICAgIFwid28tc3RhdHVzXCI6IFwiRXN0YXR1c1wiXG4gICAgfSxcbiAgICBcImNvbHVtbnNcIjogW1xuICAgICAgICBcImNsX2lkXCIsXG4gICAgICAgIFwiem9faWRcIixcbiAgICAgICAgXCJ3b19vcmRlcmVkYnlcIixcbiAgICAgICAgXCJ3b19hdHRlbnRpb25cIixcbiAgICAgICAgXCJtYV9pZFwiLFxuICAgICAgICBcIndvX3JlbGVhc2VcIixcbiAgICAgICAgXCJ3b19wb1wiLFxuICAgICAgICBcIndvX2xpbmVcIixcbiAgICAgICAgXCJ3b19saW5ldG90YWxcIixcbiAgICAgICAgXCJwcl9pZFwiLFxuICAgICAgICBcInByX3BhcnRub1wiLFxuICAgICAgICBcInByX2NvZGVcIixcbiAgICAgICAgXCJwcl9uYW1lXCIsXG4gICAgICAgIFwid29fcXR5XCIsXG4gICAgICAgIFwid29fcGFja2FnZXF0eVwiLFxuICAgICAgICBcIndvX2V4Y2VkZW50cXR5XCIsXG4gICAgICAgIFwid29fZm9saW9zcGVyZm9ybWF0XCIsXG4gICAgICAgIFwid29fZm9saW9zc2VyaWVzXCIsXG4gICAgICAgIFwid29fZm9saW9zZnJvbVwiLFxuICAgICAgICBcIndvX2ZvbGlvc3RvXCIsXG4gICAgICAgIFwid29fdHlwZVwiLFxuICAgICAgICBcIndvX2lkXCIsXG4gICAgICAgIFwid29fZGF0ZVwiLFxuICAgICAgICBcIndvX2NvbW1pdG1lbnRkYXRlXCIsXG4gICAgICAgIFwid29fcHJldmlvdXNpZFwiLFxuICAgICAgICBcIndvX3ByZXZpb3VzZGF0ZVwiLFxuICAgICAgICBcIndvX25vdGVzXCIsXG4gICAgICAgIFwid29fcHJpY2VcIixcbiAgICAgICAgXCJ3b19jdXJyZW5jeVwiLFxuICAgICAgICBcIndvX2VtYWlsXCIsXG4gICAgICAgIFwid28tc3RhdHVzXCJcbiAgICBdLFxuICAgIFwiZmllbGRzXCI6IHtcbiAgICAgICAgd29fZm9saW9zcGVyZm9ybWF0b3B0aW9uczogW1xuICAgICAgICAgICAgeyBcImxhYmVsXCI6IFwiMVwiLCBcInZhbHVlXCI6IDEgfSxcbiAgICAgICAgICAgIHsgXCJsYWJlbFwiOiBcIjJcIiwgXCJ2YWx1ZVwiOiAyIH0sXG4gICAgICAgICAgICB7IFwibGFiZWxcIjogXCIzXCIsIFwidmFsdWVcIjogMyB9LFxuICAgICAgICAgICAgeyBcImxhYmVsXCI6IFwiNFwiLCBcInZhbHVlXCI6IDQgfSxcbiAgICAgICAgICAgIHsgXCJsYWJlbFwiOiBcIjVcIiwgXCJ2YWx1ZVwiOiA1IH0sXG4gICAgICAgICAgICB7IFwibGFiZWxcIjogXCI2XCIsIFwidmFsdWVcIjogNiB9LFxuICAgICAgICAgICAgeyBcImxhYmVsXCI6IFwiN1wiLCBcInZhbHVlXCI6IDcgfSxcbiAgICAgICAgICAgIHsgXCJsYWJlbFwiOiBcIjhcIiwgXCJ2YWx1ZVwiOiA4IH0sXG4gICAgICAgIF0sXG4gICAgICAgIHdvX2N1cnJlbmN5b3B0aW9uczogW1xuICAgICAgICAgICAgeyBcImxhYmVsXCI6IFwiTVhOXCIsIFwidmFsdWVcIjogXCJNWE5cIiB9LFxuICAgICAgICAgICAgeyBcImxhYmVsXCI6IFwiRExMU1wiLCBcInZhbHVlXCI6IFwiRExMU1wiIH0sXG4gICAgICAgIF0sXG4gICAgICAgIHdvX2VtYWlsb3B0aW9uczogW1xuICAgICAgICAgICAgeyBcImxhYmVsXCI6IFwiU0lcIiwgXCJ2YWx1ZVwiOiBcInllc1wiIH0sXG4gICAgICAgICAgICB7IFwibGFiZWxcIjogXCJOT1wiLCBcInZhbHVlXCI6IFwibm9cIiB9LFxuICAgICAgICBdXG4gICAgfVxufSIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgcmV0dXJuIFsnJHNjb3BlJywgJ3dvVXBkYXRlRmFjdG9yeScsICckc3RhdGVQYXJhbXMnLCAnaTE4bkZpbHRlcicsICckZmlsdGVyJywnJGxvY2F0aW9uJyxcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgd29VcGRhdGVGYWN0b3J5LCAkc3RhdGVQYXJhbXMsIGkxOG5GaWx0ZXIsICRmaWx0ZXIsICRsb2NhdGlvbikge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAkc2NvcGUud29fZm9saW9zcGVyZm9ybWF0b3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJ3by1hZGQuZmllbGRzLndvX2ZvbGlvc3BlcmZvcm1hdG9wdGlvbnNcIik7XG4gICAgICAgICAgICAkc2NvcGUud29fY3VycmVuY3lvcHRpb25zID0gaTE4bkZpbHRlcihcIndvLWFkZC5maWVsZHMud29fY3VycmVuY3lvcHRpb25zXCIpO1xuICAgICAgICAgICAgJHNjb3BlLndvX2VtYWlsb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJ3by1hZGQuZmllbGRzLndvX2VtYWlsb3B0aW9uc1wiKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgJHNjb3BlLm9uU3VibWl0ID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgd29VcGRhdGVGYWN0b3J5LnVwZGF0ZSgkc2NvcGUuZm1EYXRhKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9taXNlLmRhdGEucm93Q291bnQgPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvd28vJyskc3RhdGVQYXJhbXMuY2xfaWQpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnVwZGF0ZUZhaWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAkc2NvcGUuJG9uKCckdmlld0NvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgLy8gdGhpcyBjb2RlIGlzIGV4ZWN1dGVkIGFmdGVyIHRoZSB2aWV3IGlzIGxvYWRlZFxuICAgICAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB3b1VwZGF0ZUZhY3RvcnkuZ2V0RGF0YSgpLnRoZW4oZnVuY3Rpb24ocHJvbWlzZSl7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGlmKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEpICYmIHByb21pc2UuZGF0YS5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZm1EYXRhID0gcHJvbWlzZS5kYXRhWzBdLndvX2pzb25iO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS53b19pZCA9IHByb21pc2UuZGF0YVswXS53b19pZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUud29fZGF0ZSA9IHByb21pc2UuZGF0YVswXS53b19kYXRlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgd29VcGRhdGVGYWN0b3J5LmdldFpvbmUoKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS56b19pZG9wdGlvbnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcm93cyA9IHByb21pc2UuZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChyb3dzLCBmdW5jdGlvbiAodmFsdWUsIGtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHVzaCh7IFwibGFiZWxcIjogcm93c1trZXldWyd6b19qc29uYiddWyd6b19uYW1lJ10sIFwidmFsdWVcIjogcm93c1trZXldWyd6b19pZCddIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgJHNjb3BlLnpvX2lkb3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB3b1VwZGF0ZUZhY3RvcnkuZ2V0TWFjaGluZSgpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLm1hX2lkb3B0aW9ucyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByb3dzID0gcHJvbWlzZS5kYXRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHJvd3MsIGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wdXNoKHsgXCJsYWJlbFwiOiByb3dzW2tleV1bJ21hX2pzb25iJ11bJ21hX25hbWUnXSwgXCJ2YWx1ZVwiOiByb3dzW2tleV1bJ21hX2lkJ10gfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAkc2NvcGUubWFfaWRvcHRpb25zKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHdvVXBkYXRlRmFjdG9yeS5nZXRQcm9kdWN0KCkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUucHJfaWRvcHRpb25zID0gW107XG4gICAgICAgICAgICAgICAgICAgIHZhciByb3dzID0gW107XG4gICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcm93cyA9IHByb21pc2UuZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChyb3dzLCBmdW5jdGlvbiAodmFsdWUsIGtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHVzaCh7IFwibGFiZWxcIjogcm93c1trZXldWydwcl9pZCddICsgJ18nICsgcm93c1trZXldWydwcl9qc29uYiddWydwcl9uYW1lJ10gKyAnXycgKyByb3dzW2tleV1bJ3ByX2pzb25iJ11bJ3ByX2NvZGUnXSwgXCJ2YWx1ZVwiOiByb3dzW2tleV1bJ3ByX2lkJ10gfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAkc2NvcGUucHJfaWRvcHRpb25zKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLiR3YXRjaChcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZm1EYXRhLnByX2lkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBwckNoYW5nZSggbmV3VmFsdWUsIG9sZFZhbHVlICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcm9kdWN0ID0gJGZpbHRlcignZmlsdGVyJykocm93cywgeyBcInByX2lkXCI6IG5ld1ZhbHVlIH0sIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcm9kdWN0Lmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnByaW5mbyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnByaW5mbyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5wcm9kdWN0ID0gcHJvZHVjdFswXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmZvbGlvID0gKHByb2R1Y3RbMF1bJ3ByX2pzb25iJ11bJ3ByX2ZvbGlvJ109PT0neWVzJykgPyB0cnVlIDogZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfV07XG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgcmV0dXJuIFsnJGh0dHAnLCAnJHEnLCAgJyRzdGF0ZVBhcmFtcycsIGZ1bmN0aW9uICgkaHR0cCwgJHEsICRzdGF0ZVBhcmFtcykge1xuICAgICAgICB2YXIgZmFjdG9yeSA9IHt9O1xuICAgICAgICBmYWN0b3J5LmdldERhdGEgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KCcvYXBpL3dvL3dvX2lkJywge1xuICAgICAgICAgICAgICAgICAgICAvKiBQT1NUIHZhcmlhYmxlcyBoZXJlICovXG4gICAgICAgICAgICAgICAgICAgIGNsX2lkOiAkc3RhdGVQYXJhbXMuY2xfaWQsXG4gICAgICAgICAgICAgICAgICAgIHdvX2lkOiAkc3RhdGVQYXJhbXMud29faWRcbiAgICAgICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeS5nZXRab25lID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoXG4gICAgICAgICAgICAgICAgJGh0dHAucG9zdCgnL2FwaS96b25lL2NsX2lkJywge1xuICAgICAgICAgICAgICAgICAgICAvKiBQT1NUIHZhcmlhYmxlcyBoZXJlICovXG4gICAgICAgICAgICAgICAgICAgIGNsX2lkOiAkc3RhdGVQYXJhbXMuY2xfaWRcbiAgICAgICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeS5nZXRNYWNoaW5lID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoXG4gICAgICAgICAgICAgICAgJGh0dHAucG9zdCgnL2FwaS9tYWNoaW5lJywge1xuICAgICAgICAgICAgICAgICAgICAvKiBQT1NUIHZhcmlhYmxlcyBoZXJlICovXG4gICAgICAgICAgICAgICAgICAgIGNsX2lkOiAkc3RhdGVQYXJhbXMuY2xfaWRcbiAgICAgICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeS5nZXRQcm9kdWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoXG4gICAgICAgICAgICAgICAgJGh0dHAucG9zdCgnL2FwaS9wcm9kdWN0L2NsX2lkJywge1xuICAgICAgICAgICAgICAgICAgICAvKiBQT1NUIHZhcmlhYmxlcyBoZXJlICovXG4gICAgICAgICAgICAgICAgICAgIGNsX2lkOiAkc3RhdGVQYXJhbXMuY2xfaWQsXG4gICAgICAgICAgICAgICAgICAgIHByX3N0YXR1czogJ0EnXG4gICAgICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkudXBkYXRlID0gZnVuY3Rpb24gKHdvX2pzb25iKSB7XG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9ICRodHRwLnBvc3QoJy9hcGkvd28vdXBkYXRlJywge1xuICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICB3b19qc29uYjogd29fanNvbmIsXG4gICAgICAgICAgICAgICAgd29faWQ6ICRzdGF0ZVBhcmFtcy53b19pZFxuICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZmFjdG9yeTtcbiAgICB9XTtcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckc2NvcGUnLCAnd29GYWN0b3J5JywgJyRsb2NhdGlvbicsICdpMThuRmlsdGVyJywgJyRzdGF0ZVBhcmFtcycsXG4gICAgICAgIGZ1bmN0aW9uICgkc2NvcGUsIHdvRmFjdG9yeSwgJGxvY2F0aW9uLCBpMThuRmlsdGVyLCAkc3RhdGVQYXJhbXMpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgJHNjb3BlLmxhYmVscyA9IE9iamVjdC5rZXlzKGkxOG5GaWx0ZXIoXCJ3by5sYWJlbHNcIikpO1xuICAgICAgICAgICAgJHNjb3BlLmNvbHVtbnMgPSBpMThuRmlsdGVyKFwid28uY29sdW1uc1wiKTtcblxuICAgICAgICAgICAgJHNjb3BlLmVkaXQgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc051bWJlcihpZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGxpbmsgPSBcIiMvd28vdXBkYXRlL1wiICsgaWQ7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IGxpbms7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgJHNjb3BlLmR1cGxpY2F0ZSA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzTnVtYmVyKGlkKSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbGluayA9IFwiIy93by9kdXBsaWNhdGUvXCIgKyBpZDtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uID0gbGluaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBmb3JtYXRJdGVtIGV2ZW50IGhhbmRsZXJcbiAgICAgICAgICAgIHZhciB3b19pZDtcbiAgICAgICAgICAgICRzY29wZS5mb3JtYXRJdGVtID0gZnVuY3Rpb24gKHMsIGUsIGNlbGwpIHtcblxuICAgICAgICAgICAgICAgIGlmIChlLnBhbmVsLmNlbGxUeXBlID09IHdpam1vLmdyaWQuQ2VsbFR5cGUuUm93SGVhZGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGUuY2VsbC50ZXh0Q29udGVudCA9IGUucm93ICsgMTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBzLnJvd3MuZGVmYXVsdFNpemUgPSAzMDtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIGFkZCBCb290c3RyYXAgaHRtbFxuICAgICAgICAgICAgICAgIGlmICgoZS5wYW5lbC5jZWxsVHlwZSA9PSB3aWptby5ncmlkLkNlbGxUeXBlLkNlbGwpICYmIChlLmNvbCA9PSAwKSkge1xuICAgICAgICAgICAgICAgICAgICB3b19pZCA9IGUucGFuZWwuZ2V0Q2VsbERhdGEoZS5yb3csIDEsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgZS5jZWxsLnN0eWxlLm92ZXJmbG93ID0gJ3Zpc2libGUnO1xuICAgICAgICAgICAgICAgICAgICBlLmNlbGwuaW5uZXJIVE1MID0gJzxkaXYgY2xhc3M9XCJidG4tZ3JvdXAgYnRuLWdyb3VwLWp1c3RpZmllZFwiIHJvbGU9XCJncm91cFwiIGFyaWEtbGFiZWw9XCIuLi5cIj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYnRuLWdyb3VwXCIgcm9sZT1cImdyb3VwXCI+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIjL3dvL3VwZGF0ZS8nICsgJHN0YXRlUGFyYW1zLmNsX2lkICsgJy8nICsgd29faWQgKyAnXCIgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHQgYnRuLXhzXCI+JyArIGkxOG5GaWx0ZXIoXCJnZW5lcmFsLmxhYmVscy5lZGl0XCIpICsgJzwvYT5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYnRuLWdyb3VwXCIgcm9sZT1cImdyb3VwXCI+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIjL3dvL2R1cGxpY2F0ZS8nICsgJHN0YXRlUGFyYW1zLmNsX2lkICsgJy8nICsgd29faWQgKyAnXCIgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHQgYnRuLXhzXCI+JyArIGkxOG5GaWx0ZXIoXCJnZW5lcmFsLmxhYmVscy5kdXBsaWNhdGVcIikgKyAnPC9hPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj4nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgICAgICAvLyBiaW5kIGNvbHVtbnMgd2hlbiBncmlkIGlzIGluaXRpYWxpemVkXG4gICAgICAgICAgICAkc2NvcGUuaW5pdEdyaWQgPSBmdW5jdGlvbiAocywgZSkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgJHNjb3BlLmNvbHVtbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbCA9IG5ldyB3aWptby5ncmlkLkNvbHVtbigpO1xuICAgICAgICAgICAgICAgICAgICBjb2wuYmluZGluZyA9ICRzY29wZS5jb2x1bW5zW2ldO1xuICAgICAgICAgICAgICAgICAgICBjb2wuaGVhZGVyID0gaTE4bkZpbHRlcihcIndvLmxhYmVscy5cIiArICRzY29wZS5sYWJlbHNbaV0pO1xuICAgICAgICAgICAgICAgICAgICBzLmNvbHVtbnMucHVzaChjb2wpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIFxuICAgICAgICAgICAgLy8gY3JlYXRlIHRoZSB0b29sdGlwIG9iamVjdFxuICAgICAgICAgICAgJHNjb3BlLiR3YXRjaCgnZ2dHcmlkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICgkc2NvcGUuZ2dHcmlkKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gc3RvcmUgcmVmZXJlbmNlIHRvIGdyaWRcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZsZXggPSAkc2NvcGUuZ2dHcmlkO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNyZWF0ZSB0b29sdGlwXG4gICAgICAgICAgICAgICAgICAgIHZhciB0aXAgPSBuZXcgd2lqbW8uVG9vbHRpcCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgcm5nID0gbnVsbDtcblxuICAgICAgICAgICAgICAgICAgICAvLyBtb25pdG9yIHRoZSBtb3VzZSBvdmVyIHRoZSBncmlkXG4gICAgICAgICAgICAgICAgICAgIGZsZXguaG9zdEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGh0ID0gZmxleC5oaXRUZXN0KGV2dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWh0LnJhbmdlLmVxdWFscyhybmcpKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBuZXcgY2VsbCBzZWxlY3RlZCwgc2hvdyB0b29sdGlwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGh0LmNlbGxUeXBlID09IHdpam1vLmdyaWQuQ2VsbFR5cGUuQ2VsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBybmcgPSBodC5yYW5nZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvbCA9IGZsZXguY29sdW1uc1tybmcuY29sXS5oZWFkZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjZWxsRWxlbWVudCA9IGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQoZXZ0LmNsaWVudFgsIGV2dC5jbGllbnRZKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNlbGxCb3VuZHMgPSB3aWptby5SZWN0LmZyb21Cb3VuZGluZ1JlY3QoY2VsbEVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YSA9IHdpam1vLmVzY2FwZUh0bWwoZmxleC5nZXRDZWxsRGF0YShybmcucm93LCBybmcuY29sLCB0cnVlKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXBDb250ZW50ID0gY29sICsgJzogXCI8Yj4nICsgZGF0YSArICc8L2I+XCInO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2VsbEVsZW1lbnQuY2xhc3NOYW1lLmluZGV4T2YoJ3dqLWNlbGwnKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXAuc2hvdyhmbGV4Lmhvc3RFbGVtZW50LCB0aXBDb250ZW50LCBjZWxsQm91bmRzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpcC5oaWRlKCk7IC8vIGNlbGwgbXVzdCBiZSBiZWhpbmQgc2Nyb2xsIGJhci4uLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgZmxleC5ob3N0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpcC5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBybmcgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJHNjb3BlLiRvbignJHZpZXdDb250ZW50TG9hZGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIC8vIHRoaXMgY29kZSBpcyBleGVjdXRlZCBhZnRlciB0aGUgdmlldyBpcyBsb2FkZWRcblxuICAgICAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgIHdvRmFjdG9yeS5nZXREYXRhKCkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZXhwb3NlIGRhdGEgYXMgYSBDb2xsZWN0aW9uVmlldyB0byBnZXQgZXZlbnRzXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZGF0YSA9IG5ldyB3aWptby5jb2xsZWN0aW9ucy5Db2xsZWN0aW9uVmlldyhwcm9taXNlLmRhdGEpO1xuXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XTtcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckaHR0cCcsICckcScsICAnJHN0YXRlUGFyYW1zJywgZnVuY3Rpb24gKCRodHRwLCAkcSwgJHN0YXRlUGFyYW1zKSB7XG4gICAgICAgIHZhciBmYWN0b3J5ID0ge307XG4gICAgICAgIGZhY3RvcnkuZ2V0RGF0YSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKFxuICAgICAgICAgICAgICAgICRodHRwLnBvc3QoJy9hcGkvd28vY2xfaWQnLCB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICAgICAgcHJvY2Nlc19pZDogbmV3IERhdGUoKS5nZXRNaWxsaXNlY29uZHMoKSxcbiAgICAgICAgICAgICAgICAgICAgY2xfaWQ6ICRzdGF0ZVBhcmFtcy5jbF9pZFxuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZmFjdG9yeTtcbiAgICB9XTtcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oYW5ndWxhcil7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIFxuICAgIHJldHVybiBhbmd1bGFyLm1vZHVsZSgnYXBwLndvcmtmbG93JyxbXG4gICAgXSlcblxuICAgIC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLFxuICAgIGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcbiAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3dvcmtmbG93Jywge1xuICAgICAgICAgICAgdXJsOicvd29ya2Zsb3cnLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmwgOiAnYXBwL3dvcmtmbG93L3dvcmtmbG93LnZpZXcuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyIDogJ3dvcmtmbG93Q29udHJvbGxlcicsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgcmVxdWlyZXNMb2dpbjogdHJ1ZVxuICAgICAgICAgICAgfSAgICBcbiAgICAgICAgfSk7XG4gICAgfV0pXG5cbiAgICAuZmFjdG9yeSgnd29ya2Zsb3dGYWN0b3J5JyxyZXF1aXJlKCcuL3dvcmtmbG93LmZhYycpKVxuXG4gICAgLmNvbnRyb2xsZXIoJ3dvcmtmbG93Q29udHJvbGxlcicscmVxdWlyZSgnLi93b3JrZmxvdy5jdHJsJykpXG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgIFwidGl0bGVcIjogXCJGbHVqbyBkZSBUcmFiYWpvXCIsXG4gICAgXCJsYWJlbHNcIjoge1xuICAgICAgICBcIndvLWlkXCI6IFwiTm8uIG9yZGVuXCIsXG4gICAgICAgIFwiY2wtaWRcIjogXCJjbGllbnRlXCIsXG4gICAgICAgIFwiY2wtY29ycG9yYXRlbmFtZVwiOiBcIlJhesOzbiBzb2NpYWxcIixcbiAgICAgICAgXCJjbC1mYXRoZXJzbGFzdG5hbWVcIjogXCJBcGVsbGlkbyBwYXRlcm5vXCIsXG4gICAgICAgIFwiY2wtbW90aGVyc2xhc3RuYW1lXCI6IFwiQXBlbGxpZG8gbWF0ZXJub1wiLFxuICAgICAgICBcInpvLWlkXCI6IFwiem9uYVwiLFxuICAgICAgICBcIndvLW9yZGVyZWRieVwiOiBcIk9yZGVuYWRvIHBvclwiLFxuICAgICAgICBcIndvLWF0dGVudGlvblwiOiBcIkF0ZW5jacOzblwiLFxuICAgICAgICBcIm1hLWlkXCI6IFwiTWFxdWluYVwiLFxuICAgICAgICBcIndvLXJlbGVhc2VcIjogXCJSZWxlYXNlXCIsXG4gICAgICAgIFwid28tcG9cIjogXCJPcmRlbiBkZSBjb21wcmFcIixcbiAgICAgICAgXCJ3by1saW5lXCI6IFwiTGluZWFcIixcbiAgICAgICAgXCJ3by1saW5ldG90YWxcIjogXCJEZVwiLFxuICAgICAgICBcInByLWlkXCI6IFwiUHJvZHVjdG9cIixcbiAgICAgICAgXCJ3by1xdHlcIjogXCJDYW50aWRhZFwiLFxuICAgICAgICBcIndvLXBhY2thZ2VxdHlcIjogXCJDYW50aWRhZCB4IHBhcXVldGVcIixcbiAgICAgICAgXCJ3by1leGNlZGVudHF0eVwiOiBcIkV4Y2VkZW50ZVwiLFxuICAgICAgICBcIndvLWZvbGlvc3BlcmZvcm1hdFwiOiBcIkZvbGlvcyB4IGZvcm1hdG9cIixcbiAgICAgICAgXCJ3by1mb2xpb3NzZXJpZXNcIjogXCJTZXJpZVwiLFxuICAgICAgICBcIndvLWZvbGlvc2Zyb21cIjogXCJEZWxcIixcbiAgICAgICAgXCJ3by1mb2xpb3N0b1wiOiBcIkFsXCIsXG4gICAgICAgIFwid28tdHlwZVwiOiBcIlRpcG9cIixcbiAgICAgICAgXCJ3by1jb21taXRtZW50ZGF0ZVwiOiBcIkZlY2hhIGNvbXByb21pc29cIixcbiAgICAgICAgXCJ3by1wcmV2aW91c2lkXCI6IFwiSUQgYW50ZXJpb3JcIixcbiAgICAgICAgXCJ3by1wcmV2aW91c2RhdGVcIjogXCJGZWNoYSBhbnRlcmlvclwiLFxuICAgICAgICBcIndvLW5vdGVzXCI6IFwiTm90YXNcIixcbiAgICAgICAgXCJ3by1wcmljZVwiOiBcIlByZWNpb1wiLFxuICAgICAgICBcIndvLWN1cnJlbmN5XCI6IFwiTW9uZWRhXCIsXG4gICAgICAgIFwid28tZW1haWxcIjogXCJFbnZpYXIgQ29ycmVvXCIsXG4gICAgICAgIFwid28tc3RhdHVzXCI6IFwiRXN0YXR1c1wiLFxuICAgICAgICBcIndvLW5leHRzdGF0dXNcIjogXCJBY3R1YWxpemFyIGE6XCIsXG4gICAgICAgIFwid28tZGF0ZVwiOiBcIkZlY2hhXCJcbiAgICB9LFxuICAgIFwiY29sdW1uc1wiOiBbXG4gICAgICAgIFwid29faWRcIixcbiAgICAgICAgXCJjbF9pZFwiLFxuICAgICAgICBcImNsX2NvcnBvcmF0ZW5hbWVcIixcbiAgICAgICAgXCJjbF9mYXRoZXJzbGFzdG5hbWVcIixcbiAgICAgICAgXCJjbF9tb3RoZXJzbGFzdG5hbWVcIixcbiAgICAgICAgXCJ6b19pZFwiLFxuICAgICAgICBcIndvX29yZGVyZWRieVwiLFxuICAgICAgICBcIndvX2F0dGVudGlvblwiLFxuICAgICAgICBcIm1hX2lkXCIsXG4gICAgICAgIFwid29fcmVsZWFzZVwiLFxuICAgICAgICBcIndvX3BvXCIsXG4gICAgICAgIFwid29fbGluZVwiLFxuICAgICAgICBcIndvX2xpbmV0b3RhbFwiLFxuICAgICAgICBcInByX2lkXCIsXG4gICAgICAgIFwid29fcXR5XCIsXG4gICAgICAgIFwid29fcGFja2FnZXF0eVwiLFxuICAgICAgICBcIndvX2V4Y2VkZW50cXR5XCIsXG4gICAgICAgIFwid29fZm9saW9zcGVyZm9ybWF0XCIsXG4gICAgICAgIFwid29fZm9saW9zc2VyaWVzXCIsXG4gICAgICAgIFwid29fZm9saW9zZnJvbVwiLFxuICAgICAgICBcIndvX2ZvbGlvc3RvXCIsXG4gICAgICAgIFwid29fdHlwZVwiLFxuICAgICAgICBcIndvX2NvbW1pdG1lbnRkYXRlXCIsXG4gICAgICAgIFwid29fcHJldmlvdXNpZFwiLFxuICAgICAgICBcIndvX3ByZXZpb3VzZGF0ZVwiLFxuICAgICAgICBcIndvX25vdGVzXCIsXG4gICAgICAgIFwid29fcHJpY2VcIixcbiAgICAgICAgXCJ3b19jdXJyZW5jeVwiLFxuICAgICAgICBcIndvX2VtYWlsXCIsXG4gICAgICAgIFwid29fc3RhdHVzXCIsXG4gICAgICAgIFwid29fZGF0ZVwiXG4gICAgXSxcbiAgICBcImZpZWxkc1wiOiB7XG4gICAgICAgIHdvX3N0YXR1c29wdGlvbnM6IFtcbiAgICAgICAgICAgIHsgXCJsYWJlbFwiOiBcIkFjdGl2b1wiLCBcInZhbHVlXCI6IDAsIFwiZGVzY1wiOiBcIk9yZGVuIEFjdGl2YVwiLCBcInVzX2dyb3VwXCI6IFwic2FsZXNcIiwgXCJ3b19wcmV2c3RhdHVzXCI6IFtdIH0sXG4gICAgICAgICAgICB7IFwibGFiZWxcIjogXCJFbiBlc3BlcmEgZGUgbWF0ZXJpYWxcIiwgXCJ2YWx1ZVwiOiAxLCBcImRlc2NcIjogXCJObyBoYXkgbWF0ZXJpYWwgZW4gZWwgYWxtYWPDqW5cIiwgXCJ1c19ncm91cFwiOiBcIndhcmVob3VzZVwiLCBcIndvX3ByZXZzdGF0dXNcIjogWzAsIDQsIDcsIDEyXSB9LFxuICAgICAgICAgICAgeyBcImxhYmVsXCI6IFwiTWF0ZXJpYWwgZGlzcG9uaWJsZVwiLCBcInZhbHVlXCI6IDIsIFwiZGVzY1wiOiBcIkhheSBtYXRlcmlhbCBlbiBlbCBhbG1hY8OpbiBwZXJvIGF1biBubyBzZSBoYSBpbmljaWFkbyBlbCB0cmFiYWpvXCIsIFwidXNfZ3JvdXBcIjogXCJ3YXJlaG91c2VcIiwgXCJ3b19wcmV2c3RhdHVzXCI6IFswLCAxLCA3LCAxMl0gfSxcbiAgICAgICAgICAgIHsgXCJsYWJlbFwiOiBcIkVuIHByb2R1Y2Npw7NuXCIsIFwidmFsdWVcIjogMywgXCJkZXNjXCI6IFwiRW4gcHJvZHVjY2nDs25cIiwgXCJ1c19ncm91cFwiOiBcInByb2R1Y3Rpb25cIiwgXCJ3b19wcmV2c3RhdHVzXCI6IFsyLCA0XSB9LFxuICAgICAgICAgICAgeyBcImxhYmVsXCI6IFwiRGV0ZW5pZG9cIiwgXCJ2YWx1ZVwiOiA0LCBcImRlc2NcIjogXCJMYSBvcmRlbiBzZSBkZXR1dm8gZW4gcHJvZHVjY2nDs25cIiwgXCJ1c19ncm91cFwiOiBcInByb2R1Y3Rpb25cIiwgXCJ3b19wcmV2c3RhdHVzXCI6IFszXSB9LFxuICAgICAgICAgICAgeyBcImxhYmVsXCI6IFwiVGVybWluYWRvXCIsIFwidmFsdWVcIjogNSwgXCJkZXNjXCI6IFwiVGVybWluYWRvIGVuIHByb2R1Y2Npw7NuXCIsIFwidXNfZ3JvdXBcIjogXCJwcm9kdWN0aW9uXCIsIFwid29fcHJldnN0YXR1c1wiOiBbM10gfSxcbiAgICAgICAgICAgIHsgXCJsYWJlbFwiOiBcIkRlcGFydGFtZW50byBkZSBjYWxpZGFkXCIsIFwidmFsdWVcIjogNiwgXCJkZXNjXCI6IFwiSW5zcGVjY2lvbiBkZSBjYWxpZGFkIGVuIHByb2Nlc29cIiwgXCJ1c19ncm91cFwiOiBcInF1YWxpdHlfYXNzdXJhbmNlXCIsIFwid29fcHJldnN0YXR1c1wiOiBbNV0gfSxcbiAgICAgICAgICAgIHsgXCJsYWJlbFwiOiBcIlJlY2hhemFkbyBwb3IgY2FsaWRhZFwiLCBcInZhbHVlXCI6IDcsIFwiZGVzY1wiOiBcIlJlY2hhemFkbyBwb3IgY2FsaWRhZFwiLCBcInVzX2dyb3VwXCI6IFwicXVhbGl0eV9hc3N1cmFuY2VcIiwgXCJ3b19wcmV2c3RhdHVzXCI6IFs2XSB9LFxuICAgICAgICAgICAgeyBcImxhYmVsXCI6IFwiQXByb2JhZG8gcG9yIGNhbGlkYWRcIiwgXCJ2YWx1ZVwiOiA4LCBcImRlc2NcIjogXCJBcHJvYmFkbyBwb3IgY2FsaWRhZFwiLCBcInVzX2dyb3VwXCI6IFwicXVhbGl0eV9hc3N1cmFuY2VcIiwgXCJ3b19wcmV2c3RhdHVzXCI6IFs2XSB9LFxuICAgICAgICAgICAgeyBcImxhYmVsXCI6IFwiRW1wYXF1ZVwiLCBcInZhbHVlXCI6IDksIFwiZGVzY1wiOiBcIkVuIHByb2Nlc28gZGUgZW1wYXF1ZVwiLCBcInVzX2dyb3VwXCI6IFwicGFja2FnaW5nXCIsIFwid29fcHJldnN0YXR1c1wiOiBbOF0gfSxcbiAgICAgICAgICAgIHsgXCJsYWJlbFwiOiBcIkxpc3RvIHBhcmEgZW1iYXJxdWVcIiwgXCJ2YWx1ZVwiOiAxMCwgXCJkZXNjXCI6IFwiTGlzdG8gcGFyYSBlbWJhcnF1ZVwiLCBcInVzX2dyb3VwXCI6IFwicGFja2FnaW5nXCIsIFwid29fcHJldnN0YXR1c1wiOiBbOV0gfSxcbiAgICAgICAgICAgIHsgXCJsYWJlbFwiOiBcIkZhY3R1cmFkb1wiLCBcInZhbHVlXCI6IDExLCBcImRlc2NcIjogXCJGYWN0dXJhZG9cIiwgXCJ1c19ncm91cFwiOiBcIndhcmVob3VzZVwiLCBcIndvX3ByZXZzdGF0dXNcIjogWzEwXSB9LFxuICAgICAgICAgICAgeyBcImxhYmVsXCI6IFwiTm8gc2UgcHVkbyBlbnRyZWdhclwiLCBcInZhbHVlXCI6IDEyLCBcImRlc2NcIjogXCJFbCBwcm9kdWN0byBubyBzZSBwdWRvIGVudHJlZ2FyXCIsIFwidXNfZ3JvdXBcIjogXCJ3YXJlaG91c2VcIiwgXCJ3b19wcmV2c3RhdHVzXCI6IFsxMV0gfSxcbiAgICAgICAgICAgIHsgXCJsYWJlbFwiOiBcIlJlY2hhemFkbyBwb3IgZWwgY2xpZW50ZVwiLCBcInZhbHVlXCI6IDEzLCBcImRlc2NcIjogXCJFbCBwcm9kdWN0b2Z1ZSByZWNoYXphZG8gcG9yIGVsIGNsaWVudGVcIiwgXCJ1c19ncm91cFwiOiBcIndhcmVob3VzZVwiLCBcIndvX3ByZXZzdGF0dXNcIjogWzExLCAxMl0gfSxcbiAgICAgICAgICAgIHsgXCJsYWJlbFwiOiBcIkVudHJlZ2Fkb1wiLCBcInZhbHVlXCI6IDE0LCBcImRlc2NcIjogXCJFbCBwcm9kdWN0byBzZSBlbnRyZWdvIGFsIGNsaWVudGUgY29uIMOpeGl0b1wiLCBcInVzX2dyb3VwXCI6IFwid2FyZWhvdXNlXCIsIFwid29fcHJldnN0YXR1c1wiOiBbMTEsIDEyXSB9LFxuICAgICAgICAgICAgeyBcImxhYmVsXCI6IFwiQ2FuY2VsYWRhXCIsIFwidmFsdWVcIjogMTUsIFwiZGVzY1wiOiBcIkxhIG9yZGVuIGRlIHRyYWJham8gZnVlIGNhbmNlbGFkYVwiLCBcInVzX2dyb3VwXCI6IFwiYWRtaW5cIiwgXCJ3b19wcmV2c3RhdHVzXCI6IFswLCAxLCAyLCAzLCA0LCA1LCA2LCA3LCA4LCA5LCAxMCwgMTEsIDEyLCAxMywgMTQsIDE1XSB9XG4gICAgICAgIF1cbiAgICB9XG59IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckc2NvcGUnLCAnd29ya2Zsb3dGYWN0b3J5JywgJyRsb2NhdGlvbicsICdpMThuRmlsdGVyJywgJyRzdGF0ZVBhcmFtcycsICckZmlsdGVyJywgJ2F1dGhTZXJ2aWNlJyxcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgd29ya2Zsb3dGYWN0b3J5LCAkbG9jYXRpb24sIGkxOG5GaWx0ZXIsICRzdGF0ZVBhcmFtcywgJGZpbHRlciwgYXV0aFNlcnZpY2UpIHtcblxuICAgICAgICAgICAgdmFyIHVzZXJQcm9maWxlID0gYW5ndWxhci5mcm9tSnNvbihsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncHJvZmlsZScpKSB8fCB7fTtcblxuXG5cbiAgICAgICAgICAgICRzY29wZS5sYWJlbHMgPSBPYmplY3Qua2V5cyhpMThuRmlsdGVyKFwid29ya2Zsb3cubGFiZWxzXCIpKTtcbiAgICAgICAgICAgICRzY29wZS5jb2x1bW5zID0gaTE4bkZpbHRlcihcIndvcmtmbG93LmNvbHVtbnNcIik7XG5cbiAgICAgICAgICAgIC8vIGZvcm1hdHRlciB0byBhZGQgY2hlY2tib3hlcyB0byBib29sZWFuIGNvbHVtbnNcbiAgICAgICAgICAgICRzY29wZS5vblVwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgZmxleCA9ICRzY29wZS5nZ0dyaWQ7XG4gICAgICAgICAgICAgICAgdmFyIGFyciA9IFtdXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmbGV4LnJvd3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZsZXguZ2V0Q2VsbERhdGEoaSwgZmxleC5jb2x1bW5zLmdldENvbHVtbignYWN0aXZlJykuaW5kZXgpID09PSB0cnVlKSBhcnIucHVzaCgrZmxleC5nZXRDZWxsRGF0YShpLCBmbGV4LmNvbHVtbnMuZ2V0Q29sdW1uKCd3b19pZCcpLmluZGV4KSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICRzY29wZS53b19pZCA9IGFycjtcbiAgICAgICAgICAgICAgICAkc2NvcGUuc2VsZWN0ZWQgPSAoYXJyLmxlbmd0aCA+IDApID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICAgICAgICAgIHZhciBuZXh0X3N0YXR1cyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2goJHNjb3BlLndvX3N0YXR1c29wdGlvbnMsIGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZS52YWx1ZSA9PT0gJHNjb3BlLmZtRGF0YS53b19uZXh0c3RhdHVzKSBuZXh0X3N0YXR1cyA9IHZhbHVlLmxhYmVsO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICRzY29wZS5uZXh0X3N0YXR1cyA9IG5leHRfc3RhdHVzO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgJHNjb3BlLm9uU3VibWl0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCRzY29wZS53b19pZC5qb2luKCcsJykpXG4gICAgICAgICAgICAgICAgd29ya2Zsb3dGYWN0b3J5LnVwZGF0ZSgkc2NvcGUuZm1EYXRhLndvX25leHRzdGF0dXMsICRzY29wZS53b19pZC5qb2luKCcsJykpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocHJvbWlzZS5kYXRhKVxuICAgICAgICAgICAgICAgICAgICBpZiAocHJvbWlzZS5kYXRhLnJvd0NvdW50ID49IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5mbURhdGEud29fc3RhdHVzID0gJHNjb3BlLmZtRGF0YS53b19uZXh0c3RhdHVzO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnVwZGF0ZUZhaWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgJCgnI215TW9kYWwnKS5tb2RhbCgnaGlkZScpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdzdWJtaXRlZCcpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICRzY29wZS5pdGVtRm9ybWF0dGVyID0gZnVuY3Rpb24gKHBhbmVsLCByLCBjLCBjZWxsKSB7XG5cbiAgICAgICAgICAgICAgICAvLyBoaWdobGlnaHQgcm93cyB0aGF0IGhhdmUgJ2FjdGl2ZScgc2V0XG4gICAgICAgICAgICAgICAgaWYgKHBhbmVsLmNlbGxUeXBlID09IHdpam1vLmdyaWQuQ2VsbFR5cGUuQ2VsbCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZmxleCA9IHBhbmVsLmdyaWQ7XG4gICAgICAgICAgICAgICAgICAgIHZhciByb3cgPSBmbGV4LnJvd3Nbcl07XG4gICAgICAgICAgICAgICAgICAgIGlmIChyb3cuZGF0YUl0ZW0uYWN0aXZlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjZWxsLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICdnb2xkJztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChwYW5lbC5jZWxsVHlwZSA9PSB3aWptby5ncmlkLkNlbGxUeXBlLkNvbHVtbkhlYWRlcikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZmxleCA9IHBhbmVsLmdyaWQ7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjb2wgPSBmbGV4LmNvbHVtbnNbY107XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY2hlY2sgdGhhdCB0aGlzIGlzIGEgYm9vbGVhbiBjb2x1bW5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbC5kYXRhVHlwZSA9PSB3aWptby5EYXRhVHlwZS5Cb29sZWFuKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHByZXZlbnQgc29ydGluZyBvbiBjbGlja1xuICAgICAgICAgICAgICAgICAgICAgICAgY29sLmFsbG93U29ydGluZyA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb3VudCB0cnVlIHZhbHVlcyB0byBpbml0aWFsaXplIGNoZWNrYm94XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY250ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZmxleC5yb3dzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZsZXguZ2V0Q2VsbERhdGEoaSwgYykgPT0gdHJ1ZSkgY250Kys7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNyZWF0ZSBhbmQgaW5pdGlhbGl6ZSBjaGVja2JveFxuICAgICAgICAgICAgICAgICAgICAgICAgY2VsbC5pbm5lckhUTUwgPSAnPGlucHV0IHR5cGU9XCJjaGVja2JveFwiPiAnICsgY2VsbC5pbm5lckhUTUw7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2IgPSBjZWxsLmZpcnN0Q2hpbGQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYi5jaGVja2VkID0gY250ID4gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNiLmluZGV0ZXJtaW5hdGUgPSBjbnQgPiAwICYmIGNudCA8IGZsZXgucm93cy5sZW5ndGg7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFwcGx5IGNoZWNrYm94IHZhbHVlIHRvIGNlbGxzXG4gICAgICAgICAgICAgICAgICAgICAgICBjYi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmxleC5iZWdpblVwZGF0ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZmxleC5yb3dzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZsZXguc2V0Q2VsbERhdGEoaSwgYywgY2IuY2hlY2tlZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZsZXguZW5kVXBkYXRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICAvLyBhdXRvc2l6ZSBjb2x1bW5zXG4gICAgICAgICAgICAkc2NvcGUuaXRlbXNTb3VyY2VDaGFuZ2VkID0gZnVuY3Rpb24gKHNlbmRlciwgYXJncykge1xuICAgICAgICAgICAgICAgIHNlbmRlci5hdXRvU2l6ZUNvbHVtbnMoKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIGJpbmQgY29sdW1ucyB3aGVuIGdyaWQgaXMgaW5pdGlhbGl6ZWRcbiAgICAgICAgICAgICRzY29wZS5pbml0R3JpZCA9IGZ1bmN0aW9uIChzLCBlKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAkc2NvcGUuY29sdW1ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgY29sID0gbmV3IHdpam1vLmdyaWQuQ29sdW1uKCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbC5iaW5kaW5nID0gJHNjb3BlLmNvbHVtbnNbaV07XG4gICAgICAgICAgICAgICAgICAgIGNvbC5oZWFkZXIgPSBpMThuRmlsdGVyKFwid29ya2Zsb3cubGFiZWxzLlwiICsgJHNjb3BlLmxhYmVsc1tpXSk7XG4gICAgICAgICAgICAgICAgICAgIHMuY29sdW1ucy5wdXNoKGNvbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8gY3JlYXRlIHRoZSB0b29sdGlwIG9iamVjdFxuICAgICAgICAgICAgJHNjb3BlLiR3YXRjaCgnZ2dHcmlkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICgkc2NvcGUuZ2dHcmlkKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gc3RvcmUgcmVmZXJlbmNlIHRvIGdyaWRcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZsZXggPSAkc2NvcGUuZ2dHcmlkO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNyZWF0ZSB0b29sdGlwXG4gICAgICAgICAgICAgICAgICAgIHZhciB0aXAgPSBuZXcgd2lqbW8uVG9vbHRpcCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgcm5nID0gbnVsbDtcblxuICAgICAgICAgICAgICAgICAgICAvLyBtb25pdG9yIHRoZSBtb3VzZSBvdmVyIHRoZSBncmlkXG4gICAgICAgICAgICAgICAgICAgIGZsZXguaG9zdEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGh0ID0gZmxleC5oaXRUZXN0KGV2dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWh0LnJhbmdlLmVxdWFscyhybmcpKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBuZXcgY2VsbCBzZWxlY3RlZCwgc2hvdyB0b29sdGlwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGh0LmNlbGxUeXBlID09IHdpam1vLmdyaWQuQ2VsbFR5cGUuQ2VsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBybmcgPSBodC5yYW5nZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvbCA9IGZsZXguY29sdW1uc1tybmcuY29sXS5oZWFkZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjZWxsRWxlbWVudCA9IGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQoZXZ0LmNsaWVudFgsIGV2dC5jbGllbnRZKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNlbGxCb3VuZHMgPSB3aWptby5SZWN0LmZyb21Cb3VuZGluZ1JlY3QoY2VsbEVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YSA9IHdpam1vLmVzY2FwZUh0bWwoZmxleC5nZXRDZWxsRGF0YShybmcucm93LCBybmcuY29sLCB0cnVlKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXBDb250ZW50ID0gY29sICsgJzogXCI8Yj4nICsgZGF0YSArICc8L2I+XCInO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2VsbEVsZW1lbnQuY2xhc3NOYW1lLmluZGV4T2YoJ3dqLWNlbGwnKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocm5nLmNvbCAhPT0gMClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXAuc2hvdyhmbGV4Lmhvc3RFbGVtZW50LCB0aXBDb250ZW50LCBjZWxsQm91bmRzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpcC5oaWRlKCk7IC8vIGNlbGwgbXVzdCBiZSBiZWhpbmQgc2Nyb2xsIGJhci4uLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgZmxleC5ob3N0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpcC5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBybmcgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJHNjb3BlLndvX3N0YXR1c29wdGlvbnMgPSBbXTtcbiAgICAgICAgICAgIHZhciB3b19zdGF0dXNvcHRpb25zID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShpMThuRmlsdGVyKFwid29ya2Zsb3cuZmllbGRzLndvX3N0YXR1c29wdGlvbnNcIikpKVxuICAgICAgICAgICAgdmFyIGR1cGxpY2F0ZWQgPSBbXTtcbiAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh3b19zdGF0dXNvcHRpb25zLCBmdW5jdGlvbiAodmFsdWUsIGtleSkge1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZS51c19ncm91cCA9PT0gdXNlclByb2ZpbGUuYXBwX21ldGFkYXRhLnVzX2dyb3VwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHVzaC5hcHBseSh0aGlzLCB2YWx1ZS53b19wcmV2c3RhdHVzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCBkdXBsaWNhdGVkKVxuXG4gICAgICAgICAgICBkdXBsaWNhdGVkLnJlZHVjZShmdW5jdGlvbiAoYWNjdW0sIGN1cnJlbnQpIHtcbiAgICAgICAgICAgICAgICBpZiAoYWNjdW0uaW5kZXhPZihjdXJyZW50KSA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgYWNjdW0ucHVzaChjdXJyZW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFjY3VtO1xuICAgICAgICAgICAgfSwgW10pO1xuXG4gICAgICAgICAgICBhbmd1bGFyLmZvckVhY2god29fc3RhdHVzb3B0aW9ucywgZnVuY3Rpb24gKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgICAgICAgICBpZiAoZHVwbGljYXRlZC5pbmNsdWRlcyh2YWx1ZS52YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUubm90QW5PcHRpb24gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZS5ub3RBbk9wdGlvbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucHVzaCh2YWx1ZSlcbiAgICAgICAgICAgIH0sICRzY29wZS53b19zdGF0dXNvcHRpb25zKVxuXG4gICAgICAgICAgICAkc2NvcGUuJG9uKCckdmlld0NvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICAvLyB0aGlzIGNvZGUgaXMgZXhlY3V0ZWQgYWZ0ZXIgdGhlIHZpZXcgaXMgbG9hZGVkXG4gICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgICRzY29wZS4kd2F0Y2goJ2ZtRGF0YS53b19zdGF0dXMnLCBmdW5jdGlvbiAobmV3VmFsdWUsIG9sZFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5hY3Rpb25zID0gW107XG4gICAgICAgICAgICAgICAgICAgIHZhciBhY3Rpb25zID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShpMThuRmlsdGVyKFwid29ya2Zsb3cuZmllbGRzLndvX3N0YXR1c29wdGlvbnNcIikpKTtcbiAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKGFjdGlvbnMsIGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUud29fcHJldnN0YXR1cy5pbmNsdWRlcyhuZXdWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUudXNfZ3JvdXAgPT09IHVzZXJQcm9maWxlLmFwcF9tZXRhZGF0YS51c19ncm91cCB8fCB1c2VyUHJvZmlsZS5hcHBfbWV0YWRhdGEudXNfZ3JvdXAgPT09IFwiYWRtaW5cIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoWzE0LCAxNV0uaW5jbHVkZXMobmV3VmFsdWUpICYmIFsxNCwgMTVdLmluY2x1ZGVzKHZhbHVlLnZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUubm90QW5PcHRpb24gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUubm90QW5PcHRpb24gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlLm5vdEFuT3B0aW9uID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wdXNoKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSwgJHNjb3BlLmFjdGlvbnMpXG4gICAgICAgICAgICAgICAgICAgIHdvcmtmbG93RmFjdG9yeS5nZXREYXRhKG5ld1ZhbHVlKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZXhwb3NlIGRhdGEgYXMgYSBDb2xsZWN0aW9uVmlldyB0byBnZXQgZXZlbnRzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmRhdGEgPSBuZXcgd2lqbW8uY29sbGVjdGlvbnMuQ29sbGVjdGlvblZpZXcocHJvbWlzZS5kYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZGF0YS5wYWdlU2l6ZSA9IDU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1dO1xuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRodHRwJywgJyRxJywgICckc3RhdGVQYXJhbXMnLCBmdW5jdGlvbiAoJGh0dHAsICRxLCAkc3RhdGVQYXJhbXMpIHtcbiAgICAgICAgdmFyIGZhY3RvcnkgPSB7fTtcbiAgICAgICAgZmFjdG9yeS5nZXREYXRhID0gZnVuY3Rpb24gKHdvX3N0YXR1cykge1xuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoXG4gICAgICAgICAgICAgICAgJGh0dHAucG9zdCgnL2FwaS93b3JrZmxvdycsIHtcbiAgICAgICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgICAgICBwcm9jY2VzX2lkOiBuZXcgRGF0ZSgpLmdldE1pbGxpc2Vjb25kcygpLFxuICAgICAgICAgICAgICAgICAgICB3b19zdGF0dXM6IHdvX3N0YXR1c1xuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICBmYWN0b3J5LnVwZGF0ZSA9IGZ1bmN0aW9uICh3b19zdGF0dXMsIHdvX2lkKSB7XG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KCcvYXBpL3dvcmtmbG93L3VwZGF0ZScsIHtcbiAgICAgICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgICAgICBwcm9jY2VzX2lkOiBuZXcgRGF0ZSgpLmdldE1pbGxpc2Vjb25kcygpLFxuICAgICAgICAgICAgICAgICAgICB3b19zdGF0dXM6IHdvX3N0YXR1cyxcbiAgICAgICAgICAgICAgICAgICAgd29faWQ6IHdvX2lkXG4gICAgICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBmYWN0b3J5O1xuICAgIH1dO1xuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbihhbmd1bGFyKXtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgXG4gICAgcmV0dXJuIGFuZ3VsYXIubW9kdWxlKCdhcHAuem9uZScsW1xuICAgICAgICByZXF1aXJlKCcuL21vZHVsZXMvem9uZS5hZGQnKS5uYW1lLFxuICAgICAgICByZXF1aXJlKCcuL21vZHVsZXMvem9uZS51cGRhdGUnKS5uYW1lXG4gICAgXSlcblxuICAgIC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLFxuICAgIGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcbiAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3pvbmUnLCB7XG4gICAgICAgICAgICB1cmw6Jy96b25lLzpjbF9pZCcsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybCA6ICdhcHAvem9uZS96b25lLnZpZXcuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyIDogJ3pvbmVDdHJsJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICByZXF1aXJlc0xvZ2luOiB0cnVlXG4gICAgICAgICAgICB9ICAgIFxuICAgICAgICB9KTtcbiAgICB9XSlcblxuICAgIC5mYWN0b3J5KCd6b25lRmFjJyxyZXF1aXJlKCcuL3pvbmUuZmFjJykpXG5cbiAgICAuY29udHJvbGxlcignem9uZUN0cmwnLHJlcXVpcmUoJy4vem9uZS5jdHJsJykpXG4gICAgXG59KShhbmd1bGFyKTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCIgOiBcImRpcmVjY2lvbmVzIGRlIGVudmlvXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibGFiZWxzXCI6e1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJ6by1pZFwiIDogXCJpZCB6b25hXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsLWlkXCIgOiBcImlkIGNsaWVudGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiem8tem9uZVwiIDogXCJ6b25hXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInpvLWNvcnBvcmF0ZW5hbWVcIiA6IFwicmF6w7NuIHNvY2lhbFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ6by10aW5cIiA6IFwicmZjXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInpvLWltbWV4XCIgOiBcImltbWV4XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInpvLW5hbWVcIiA6IFwibm9tYnJlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInpvLWZhdGhlcnNsYXN0bmFtZVwiIDogXCJhcGVsbGlkbyBwYXRlcm5vXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInpvLW1vdGhlcnNsYXN0bmFtZVwiIDogXCJhcGVsbGlkbyBtYXRlcm5vXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInpvLXN0cmVldFwiOlwiY2FsbGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiem8tc3RyZWV0bnVtYmVyXCI6XCJudW1lcm8gZXh0ZXJpb3JcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiem8tc3VpdGVudW1iZXJcIjpcIm51bWVybyBpbnRlcmlvclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ6by1uZWlnaGJvcmhvb2RcIjpcImNvbG9uaWFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiem8tYWRkcmVzc3JlZmVyZW5jZVwiOlwicmVmZXJlbmNpYVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ6by1jb3VudHJ5XCI6XCJwYcOtc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ6by1zdGF0ZVwiOlwiZXN0YWRvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInpvLWNpdHlcIjpcImNpdWRhZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ6by1jb3VudHlcIjpcIm11bmljaXBpb1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ6by16aXBjb2RlXCI6XCJjb2RpZ28gcG9zdGFsXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInpvLWVtYWlsXCI6XCJjb3JyZW8gZWxlY3Ryw7NuaWNvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInpvLXBob25lXCI6XCJ0ZWzDqWZvbm9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiem8tbW9iaWxlXCI6XCJtw7N2aWxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiem8tc3RhdHVzXCI6XCJlc3RhdHVzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInpvLWRhdGVcIjpcImZlY2hhXCIsXG5cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgXCJjb2x1bW5zXCI6W1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJ6b19pZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbF9pZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ6b196b25lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInpvX2NvcnBvcmF0ZW5hbWVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiem9fdGluXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInpvX2ltbWV4XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInpvX25hbWVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiem9fZmF0aGVyc2xhc3RuYW1lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInpvX21vdGhlcnNsYXN0bmFtZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ6b19zdHJlZXRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiem9fc3RyZWV0bnVtYmVyXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInpvX3N1aXRlbnVtYmVyXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInpvX25laWdoYm9yaG9vZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ6b19hZGRyZXNzcmVmZXJlbmNlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInpvX2NvdW50cnlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiem9fc3RhdGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiem9fY2l0eVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ6b19jb3VudHlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiem9femlwY29kZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ6b19lbWFpbFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ6b19waG9uZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ6b19tb2JpbGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiem9fc3RhdHVzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInpvX2RhdGVcIixcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgIFwiZmllbGRzXCIgOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB6b19zdGF0dXNvcHRpb25zIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJBY3Rpdm9cIixcInZhbHVlXCI6XCJBXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJJbmFjdGl2b1wiLFwidmFsdWVcIjpcIklcIn1cbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKGFuZ3VsYXIpe1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBcbiAgICByZXR1cm4gYW5ndWxhci5tb2R1bGUoJ2FwcC56b25lLmFkZCcsW10pXG5cbiAgICAuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJyxcbiAgICBmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCd6b25lQWRkJywge1xuICAgICAgICAgICAgdXJsOicvem9uZS9hZGQvOmNsX2lkJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsIDogJ2FwcC96b25lL21vZHVsZXMvem9uZS5hZGQvem9uZS5hZGQudmlldy5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXIgOiAnem9uZUFkZEN0cmwnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHJlcXVpcmVzTG9naW46IHRydWVcbiAgICAgICAgICAgIH0gICAgXG4gICAgICAgIH0pO1xuICAgIH1dKVxuXG4gICAgLmZhY3RvcnkoJ3pvbmVBZGRGYWMnLHJlcXVpcmUoJy4vem9uZS5hZGQuZmFjJykpXG5cbiAgICAuY29udHJvbGxlcignem9uZUFkZEN0cmwnLHJlcXVpcmUoJy4vem9uZS5hZGQuY3RybCcpKVxuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiIDogXCJhZ3JlZ2FyIGRpcmVjY2nDs24gZGUgZW52aW9cIixcbiAgICAgICAgICAgICAgICB9IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckc2NvcGUnLCAnem9uZUFkZEZhYycsICckbG9jYXRpb24nLCAnaTE4bkZpbHRlcicsICckaW50ZXJ2YWwnLCAnJHN0YXRlUGFyYW1zJyxcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgem9uZUFkZEZhYywgJGxvY2F0aW9uLCBpMThuRmlsdGVyLCAkaW50ZXJ2YWwsICRzdGF0ZVBhcmFtcykge1xuICAgICAgICAgICAgJHNjb3BlLmZtRGF0YSA9IHt9O1xuICAgICAgICAgICAgJHNjb3BlLmZtRGF0YS5jbF9pZCA9ICRzdGF0ZVBhcmFtcy5jbF9pZDtcblxuICAgICAgICAgICAgJHNjb3BlLm9uU3VibWl0ID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgem9uZUFkZEZhYy5hZGQoJHNjb3BlLmZtRGF0YSkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocHJvbWlzZS5kYXRhID09IFwiMVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3pvbmUnKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS51cGRhdGVGYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgJHNjb3BlLmdldFN0YXRlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUuem9fc3RhdGVvcHRpb25zID0gW107XG4gICAgICAgICAgICAgICAgJHNjb3BlLnpvX2NpdHlvcHRpb25zID0gW107XG4gICAgICAgICAgICAgICAgJHNjb3BlLnpvX2NvdW50eW9wdGlvbnMgPSBbXTtcbiAgICAgICAgICAgICAgICAkaW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB6b25lQWRkRmFjLmdldFN0YXRlcygkc2NvcGUuZm1EYXRhLnpvX2NvdW50cnkpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhLmdlb25hbWVzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS56b19zdGF0ZW9wdGlvbnMgPSBwcm9taXNlLmRhdGEuZ2VvbmFtZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vJHNjb3BlLnVwZGF0ZUZhaWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LCAwLCAxKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJHNjb3BlLmdldENpdHlDb3VudHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnpvX2NpdHlvcHRpb25zID0gW107XG4gICAgICAgICAgICAgICAgJHNjb3BlLnpvX2NvdW50eW9wdGlvbnMgPSBbXTtcbiAgICAgICAgICAgICAgICAkaW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB6b25lQWRkRmFjLmdldFN0YXRlcygkc2NvcGUuZm1EYXRhLnpvX3N0YXRlKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YS5nZW9uYW1lcykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuem9fY2l0eW9wdGlvbnMgPSBwcm9taXNlLmRhdGEuZ2VvbmFtZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnpvX2NvdW50eW9wdGlvbnMgPSBwcm9taXNlLmRhdGEuZ2VvbmFtZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vJHNjb3BlLnVwZGF0ZUZhaWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LCAwLCAxKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICRzY29wZS56b19zdGF0dXNvcHRpb25zID0gaTE4bkZpbHRlcihcInpvbmUuZmllbGRzLnpvX3N0YXR1c29wdGlvbnNcIik7XG5cbiAgICAgICAgICAgICRzY29wZS4kb24oJyR2aWV3Q29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAvLyB0aGlzIGNvZGUgaXMgZXhlY3V0ZWQgYWZ0ZXIgdGhlIHZpZXcgaXMgbG9hZGVkXG4gICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB6b25lQWRkRmFjLmdldENsaWVudCgpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNPYmplY3QocHJvbWlzZS5kYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNsaWVudCA9IHByb21pc2UuZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgem9uZUFkZEZhYy5nZXRDb3VudHJpZXMoKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhLmdlb25hbWVzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnpvX2NvdW50cnlvcHRpb25zID0gcHJvbWlzZS5kYXRhLmdlb25hbWVzO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8kc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1dO1xuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRodHRwJywgJyRxJywgICckc3RhdGVQYXJhbXMnLCBmdW5jdGlvbiAoJGh0dHAsICRxLCAkc3RhdGVQYXJhbXMpIHtcbiAgICAgICAgdmFyIGZhY3RvcnkgPSB7fTtcbiAgICAgICAgZmFjdG9yeS5nZXRDbGllbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KCdtb2R1bGVzL3pvbmUvbW9kdWxlcy96b25lLmFkZC96b25lLmFkZC5tZGwuZ2V0Q2xpZW50LnBocCcsIHtcbiAgICAgICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgICAgICBjbF9pZDogJHN0YXRlUGFyYW1zLmNsX2lkXG4gICAgICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkuYWRkID0gZnVuY3Rpb24gKHpvX2pzb25iKSB7XG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9ICRodHRwLnBvc3QoJ21vZHVsZXMvem9uZS9tb2R1bGVzL3pvbmUuYWRkL3pvbmUuYWRkLm1kbC5hZGQucGhwJywge1xuICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICB6b19qc29uYjogem9fanNvbmJcbiAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeS5nZXRDb3VudHJpZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9ICRodHRwLmdldCgnaHR0cDovL2FwaS5nZW9uYW1lcy5vcmcvY291bnRyeUluZm9KU09OP3VzZXJuYW1lPWFsZWphbmRyb2xzY2EnKVxuICAgICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeS5nZXRTdGF0ZXMgPSBmdW5jdGlvbiAoem9fY291bnRyeSkge1xuICAgICAgICAgICAgdmFyIHByb21pc2UgPSAkaHR0cC5nZXQoJ2h0dHA6Ly9hcGkuZ2VvbmFtZXMub3JnL2NoaWxkcmVuSlNPTj9nZW9uYW1lSWQ9JyArIHpvX2NvdW50cnkgKyAnJnVzZXJuYW1lPWFsZWphbmRyb2xzY2EnKVxuICAgICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeS5nZXRDaXR5Q291bnR5ID0gZnVuY3Rpb24gKHpvX3N0YXRlKSB7XG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9ICRodHRwLmdldCgnaHR0cDovL2FwaS5nZW9uYW1lcy5vcmcvY2hpbGRyZW5KU09OP2dlb25hbWVJZD0nICsgem9fc3RhdGUgKyAnJnVzZXJuYW1lPWFsZWphbmRyb2xzY2EnKVxuICAgICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGZhY3Rvcnk7XG4gICAgfV07XG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKGFuZ3VsYXIpe1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBcbiAgICByZXR1cm4gYW5ndWxhci5tb2R1bGUoJ2FwcC56b25lLnVwZGF0ZScsW10pXG5cbiAgICAuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJyxcbiAgICBmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCd6b25lVXBkYXRlJywge1xuICAgICAgICAgICAgdXJsOicvem9uZS91cGRhdGUvOmNsX2lkLzp6b19pZCcsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybCA6ICdhcHAvem9uZS9tb2R1bGVzL3pvbmUudXBkYXRlL3pvbmUudXBkYXRlLnZpZXcuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyIDogJ3pvbmVVcGRhdGVDdHJsJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICByZXF1aXJlc0xvZ2luOiB0cnVlXG4gICAgICAgICAgICB9ICAgIFxuICAgICAgICB9KTtcbiAgICB9XSlcblxuICAgIC5mYWN0b3J5KCd6b25lVXBkYXRlRmFjJyxyZXF1aXJlKCcuL3pvbmUudXBkYXRlLmZhYycpKVxuXG4gICAgLmNvbnRyb2xsZXIoJ3pvbmVVcGRhdGVDdHJsJyxyZXF1aXJlKCcuL3pvbmUudXBkYXRlLmN0cmwnKSlcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIiA6IFwiYWN0dWFsaXphciBkaXJlY2Npw7NuIGRlIGVudmlvXCIsXG4gICAgICAgICAgICAgICAgfSIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgcmV0dXJuIFsnJHNjb3BlJywgJ3pvbmVVcGRhdGVGYWMnLCAnJGxvY2F0aW9uJywgJ2kxOG5GaWx0ZXInLCAnJGludGVydmFsJywgJyRzdGF0ZVBhcmFtcycsXG4gICAgICAgIGZ1bmN0aW9uICgkc2NvcGUsIHpvbmVVcGRhdGVGYWMsICRsb2NhdGlvbiwgaTE4bkZpbHRlciwgJGludGVydmFsLCAkc3RhdGVQYXJhbXMpIHtcblxuICAgICAgICAgICAgJHNjb3BlLm9uU3VibWl0ID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgem9uZVVwZGF0ZUZhYy51cGRhdGUoJHNjb3BlLmZtRGF0YSkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocHJvbWlzZS5kYXRhID09IFwiMVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3pvbmUvJyArICRzdGF0ZVBhcmFtcy5jbF9pZCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICRzY29wZS5nZXRTdGF0ZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnpvX3N0YXRlb3B0aW9ucyA9IFtdO1xuICAgICAgICAgICAgICAgICRzY29wZS56b19jaXR5b3B0aW9ucyA9IFtdO1xuICAgICAgICAgICAgICAgICRzY29wZS56b19jb3VudHlvcHRpb25zID0gW107XG4gICAgICAgICAgICAgICAgJGludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgem9uZVVwZGF0ZUZhYy5nZXRTdGF0ZXMoJHNjb3BlLmZtRGF0YS56b19jb3VudHJ5KS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YS5nZW9uYW1lcykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuem9fc3RhdGVvcHRpb25zID0gcHJvbWlzZS5kYXRhLmdlb25hbWVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyRzY29wZS51cGRhdGVGYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSwgMCwgMSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICRzY29wZS5nZXRDaXR5Q291bnR5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICRzY29wZS56b19jaXR5b3B0aW9ucyA9IFtdO1xuICAgICAgICAgICAgICAgICRzY29wZS56b19jb3VudHlvcHRpb25zID0gW107XG4gICAgICAgICAgICAgICAgJGludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgem9uZVVwZGF0ZUZhYy5nZXRTdGF0ZXMoJHNjb3BlLmZtRGF0YS56b19zdGF0ZSkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEuZ2VvbmFtZXMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnpvX2NpdHlvcHRpb25zID0gcHJvbWlzZS5kYXRhLmdlb25hbWVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS56b19jb3VudHlvcHRpb25zID0gcHJvbWlzZS5kYXRhLmdlb25hbWVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyRzY29wZS51cGRhdGVGYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSwgMCwgMSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICRzY29wZS56b19zdGF0dXNvcHRpb25zID0gaTE4bkZpbHRlcihcInpvbmUuZmllbGRzLnpvX3N0YXR1c29wdGlvbnNcIik7XG5cbiAgICAgICAgICAgICRzY29wZS4kb24oJyR2aWV3Q29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAvLyB0aGlzIGNvZGUgaXMgZXhlY3V0ZWQgYWZ0ZXIgdGhlIHZpZXcgaXMgbG9hZGVkXG4gICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHpvbmVVcGRhdGVGYWMuZGF0YSgpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNPYmplY3QoYW5ndWxhci5mcm9tSnNvbihwcm9taXNlLmRhdGEpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmZtRGF0YSA9IGFuZ3VsYXIuZnJvbUpzb24ocHJvbWlzZS5kYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB6b25lVXBkYXRlRmFjLmdldENvdW50cmllcygpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhLmdlb25hbWVzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS56b19jb3VudHJ5b3B0aW9ucyA9IHByb21pc2UuZGF0YS5nZW9uYW1lcztcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8kc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgem9uZVVwZGF0ZUZhYy5nZXRTdGF0ZXMoJHNjb3BlLmZtRGF0YS56b19jb3VudHJ5KS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEuZ2VvbmFtZXMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS56b19zdGF0ZW9wdGlvbnMgPSBwcm9taXNlLmRhdGEuZ2VvbmFtZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8kc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB6b25lVXBkYXRlRmFjLmdldENpdHlDb3VudHkoJHNjb3BlLmZtRGF0YS56b19zdGF0ZSkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhLmdlb25hbWVzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuem9fY2l0eW9wdGlvbnMgPSBwcm9taXNlLmRhdGEuZ2VvbmFtZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS56b19jb3VudHlvcHRpb25zID0gcHJvbWlzZS5kYXRhLmdlb25hbWVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vJHNjb3BlLnVwZGF0ZUZhaWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfV07XG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgcmV0dXJuIFsnJGh0dHAnLCAnJHEnLCAgJyRzdGF0ZVBhcmFtcycsIGZ1bmN0aW9uICgkaHR0cCwgJHEsICRzdGF0ZVBhcmFtcykge1xuICAgICAgICB2YXIgZmFjdG9yeSA9IHt9O1xuICAgICAgICBmYWN0b3J5LmRhdGEgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KCdtb2R1bGVzL3pvbmUvbW9kdWxlcy96b25lLnVwZGF0ZS96b25lLnVwZGF0ZS5tZGwuZ2V0Wm9uZS5waHAnLCB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICAgICAgem9faWQ6ICRzdGF0ZVBhcmFtcy56b19pZFxuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICBmYWN0b3J5LnVwZGF0ZSA9IGZ1bmN0aW9uICh6b19qc29uYikge1xuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoXG4gICAgICAgICAgICAgICAgJGh0dHAucG9zdCgnbW9kdWxlcy96b25lL21vZHVsZXMvem9uZS51cGRhdGUvem9uZS51cGRhdGUubWRsLnVwZGF0ZS5waHAnLCB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICAgICAgem9faWQ6ICRzdGF0ZVBhcmFtcy56b19pZCxcbiAgICAgICAgICAgICAgICAgICAgem9fanNvbmI6IHpvX2pzb25iXG4gICAgICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkuZ2V0Q291bnRyaWVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHByb21pc2UgPSAkaHR0cC5nZXQoJ2h0dHA6Ly9hcGkuZ2VvbmFtZXMub3JnL2NvdW50cnlJbmZvSlNPTj91c2VybmFtZT1hbGVqYW5kcm9sc2NhJylcbiAgICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkuZ2V0U3RhdGVzID0gZnVuY3Rpb24gKHpvX2NvdW50cnkpIHtcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gJGh0dHAuZ2V0KCdodHRwOi8vYXBpLmdlb25hbWVzLm9yZy9jaGlsZHJlbkpTT04/Z2VvbmFtZUlkPScgKyB6b19jb3VudHJ5ICsgJyZ1c2VybmFtZT1hbGVqYW5kcm9sc2NhJylcbiAgICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkuZ2V0Q2l0eUNvdW50eSA9IGZ1bmN0aW9uICh6b19zdGF0ZSkge1xuICAgICAgICAgICAgdmFyIHByb21pc2UgPSAkaHR0cC5nZXQoJ2h0dHA6Ly9hcGkuZ2VvbmFtZXMub3JnL2NoaWxkcmVuSlNPTj9nZW9uYW1lSWQ9JyArIHpvX3N0YXRlICsgJyZ1c2VybmFtZT1hbGVqYW5kcm9sc2NhJylcbiAgICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBmYWN0b3J5O1xuICAgIH1dO1xuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRzY29wZScsICd6b25lRmFjJywgJ2kxOG5GaWx0ZXInLFxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCB6b25lRmFjLCBpMThuRmlsdGVyKSB7XG5cbiAgICAgICAgICAgICRzY29wZS5sYWJlbHMgPSBPYmplY3Qua2V5cyhpMThuRmlsdGVyKFwiem9uZS5sYWJlbHNcIikpO1xuICAgICAgICAgICAgJHNjb3BlLmNvbHVtbnMgPSBpMThuRmlsdGVyKFwiem9uZS5jb2x1bW5zXCIpO1xuICAgICAgICBcbiAgICAgICAgICAgIC8vIGZvcm1hdEl0ZW0gZXZlbnQgaGFuZGxlclxuICAgICAgICAgICAgdmFyIHpvX2lkO1xuICAgICAgICAgICAgdmFyIGNsX2lkO1xuICAgICAgICAgICAgJHNjb3BlLmZvcm1hdEl0ZW0gPSBmdW5jdGlvbiAocywgZSwgY2VsbCkge1xuXG4gICAgICAgICAgICAgICAgaWYgKGUucGFuZWwuY2VsbFR5cGUgPT0gd2lqbW8uZ3JpZC5DZWxsVHlwZS5Sb3dIZWFkZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgZS5jZWxsLnRleHRDb250ZW50ID0gZS5yb3cgKyAxO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHMucm93cy5kZWZhdWx0U2l6ZSA9IDMwO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gYWRkIEJvb3RzdHJhcCBodG1sXG4gICAgICAgICAgICAgICAgaWYgKChlLnBhbmVsLmNlbGxUeXBlID09IHdpam1vLmdyaWQuQ2VsbFR5cGUuQ2VsbCkgJiYgKGUuY29sID09IDApKSB7XG4gICAgICAgICAgICAgICAgICAgIHpvX2lkID0gZS5wYW5lbC5nZXRDZWxsRGF0YShlLnJvdywgMSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBjbF9pZCA9IGUucGFuZWwuZ2V0Q2VsbERhdGEoZS5yb3csIDIsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgZS5jZWxsLnN0eWxlLm92ZXJmbG93ID0gJ3Zpc2libGUnO1xuICAgICAgICAgICAgICAgICAgICBlLmNlbGwuaW5uZXJIVE1MID0gJzxkaXYgY2xhc3M9XCJidG4tZ3JvdXAgYnRuLWdyb3VwLWp1c3RpZmllZFwiIHJvbGU9XCJncm91cFwiIGFyaWEtbGFiZWw9XCIuLi5cIj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidG4tZ3JvdXBcIiByb2xlPVwiZ3JvdXBcIj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiIy96b25lL3VwZGF0ZS8nKyBjbF9pZCArICcvJyArIHpvX2lkICsgJ1wiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0IGJ0bi14c1wiIG5nLWNsaWNrPVwiZWRpdCgkaXRlbS5jbF9pZClcIj5FZGl0YXI8L2E+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+JztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAgICAgLy8gYmluZCBjb2x1bW5zIHdoZW4gZ3JpZCBpcyBpbml0aWFsaXplZFxuICAgICAgICAgICAgJHNjb3BlLmluaXRHcmlkID0gZnVuY3Rpb24gKHMsIGUpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8ICRzY29wZS5sYWJlbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbCA9IG5ldyB3aWptby5ncmlkLkNvbHVtbigpO1xuICAgICAgICAgICAgICAgICAgICBjb2wuYmluZGluZyA9ICRzY29wZS5jb2x1bW5zW2ldO1xuICAgICAgICAgICAgICAgICAgICBjb2wuaGVhZGVyID0gaTE4bkZpbHRlcihcInpvbmUubGFiZWxzLlwiICsgJHNjb3BlLmxhYmVsc1tpXSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbC53b3JkV3JhcCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBjb2wud2lkdGggPSAxNTA7XG4gICAgICAgICAgICAgICAgICAgIHMuY29sdW1ucy5wdXNoKGNvbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIC8vIGNyZWF0ZSB0aGUgdG9vbHRpcCBvYmplY3RcbiAgICAgICAgICAgICRzY29wZS4kd2F0Y2goJ2dnR3JpZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoJHNjb3BlLmdnR3JpZCkge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgLy8gc3RvcmUgcmVmZXJlbmNlIHRvIGdyaWRcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZsZXggPSAkc2NvcGUuZ2dHcmlkO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNyZWF0ZSB0b29sdGlwXG4gICAgICAgICAgICAgICAgICAgIHZhciB0aXAgPSBuZXcgd2lqbW8uVG9vbHRpcCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgcm5nID0gbnVsbDtcblxuICAgICAgICAgICAgICAgICAgICAvLyBtb25pdG9yIHRoZSBtb3VzZSBvdmVyIHRoZSBncmlkXG4gICAgICAgICAgICAgICAgICAgIGZsZXguaG9zdEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGh0ID0gZmxleC5oaXRUZXN0KGV2dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWh0LnJhbmdlLmVxdWFscyhybmcpKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBuZXcgY2VsbCBzZWxlY3RlZCwgc2hvdyB0b29sdGlwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGh0LmNlbGxUeXBlID09IHdpam1vLmdyaWQuQ2VsbFR5cGUuQ2VsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBybmcgPSBodC5yYW5nZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvbCA9IGZsZXguY29sdW1uc1tybmcuY29sXS5oZWFkZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjZWxsRWxlbWVudCA9IGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQoZXZ0LmNsaWVudFgsIGV2dC5jbGllbnRZKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNlbGxCb3VuZHMgPSB3aWptby5SZWN0LmZyb21Cb3VuZGluZ1JlY3QoY2VsbEVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YSA9IHdpam1vLmVzY2FwZUh0bWwoZmxleC5nZXRDZWxsRGF0YShybmcucm93LCBybmcuY29sLCB0cnVlKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXBDb250ZW50ID0gY29sICsgJzogXCI8Yj4nICsgZGF0YSArICc8L2I+XCInO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2VsbEVsZW1lbnQuY2xhc3NOYW1lLmluZGV4T2YoJ3dqLWNlbGwnKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXAuc2hvdyhmbGV4Lmhvc3RFbGVtZW50LCB0aXBDb250ZW50LCBjZWxsQm91bmRzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpcC5oaWRlKCk7IC8vIGNlbGwgbXVzdCBiZSBiZWhpbmQgc2Nyb2xsIGJhci4uLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgZmxleC5ob3N0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpcC5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBybmcgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJHNjb3BlLiRvbignJHZpZXdDb250ZW50TG9hZGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIC8vIHRoaXMgY29kZSBpcyBleGVjdXRlZCBhZnRlciB0aGUgdmlldyBpcyBsb2FkZWRcbiAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgem9uZUZhYy5kYXRhKCkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5kYXRhID0gbmV3IHdpam1vLmNvbGxlY3Rpb25zLkNvbGxlY3Rpb25WaWV3KHByb21pc2UuZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XTtcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckaHR0cCcsICckcScsICAnJHN0YXRlUGFyYW1zJywgZnVuY3Rpb24gKCRodHRwLCAkcSwgJHN0YXRlUGFyYW1zKSB7XG4gICAgICAgIHZhciBmYWN0b3J5ID0ge307XG4gICAgICAgIGZhY3RvcnkuZGF0YSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKFxuICAgICAgICAgICAgICAgICRodHRwLnBvc3QoJ21vZHVsZXMvem9uZS96b25lLm1kbC5nZXRab25lcy5waHAnLCB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICAgICAgcHJvY2Nlc19pZDogbmV3IERhdGUoKS5nZXRNaWxsaXNlY29uZHMoKSxcbiAgICAgICAgICAgICAgICAgICAgY2xfaWQ6ICRzdGF0ZVBhcmFtcy5jbF9pZFxuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZmFjdG9yeTtcbiAgICB9XTtcblxufSkoYW5ndWxhcik7Il19
