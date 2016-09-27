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
            { "label": "Activo", "value": 0, "desc": "Orden Activa", "us_group": "ventas", "wo_prevstatus": [] },
            { "label": "En espera de material", "value": 1, "desc": "No hay material en el almacén", "us_group": "almacen", "wo_prevstatus": [0, 7, 12] },
            { "label": "Material disponible", "value": 2, "desc": "Hay material en el almacén pero aun no se ha iniciado el trabajo", "us_group": "almacen", "wo_prevstatus": [0, 7, 12] },
            { "label": "En producción", "value": 3, "desc": "En producción", "us_group": "produccion", "wo_prevstatus": [2, 7, 12] },
            { "label": "Detenido", "value": 4, "desc": "La orden se detuvo en producción", "us_group": "produccion", "wo_prevstatus": [3] },
            { "label": "Terminado", "value": 5, "desc": "Terminado en producción", "us_group": "produccion", "wo_prevstatus": [3, 4] },
            { "label": "Departamento de calidad", "value": 6, "desc": "Inspeccion de calidad en proceso", "us_group": "calidad", "wo_prevstatus": [5] },
            { "label": "Rechazado por Calidad", "value": 7, "desc": "Rechazado por calidad", "us_group": "calidad", "wo_prevstatus": [6] },
            { "label": "Empaque", "value": 8, "desc": "En proceso de empaque", "us_group": "empaque", "wo_prevstatus": [6] },
            { "label": "Listo para embarque", "value": 9, "desc": "Listo para embarque", "us_group": "empaque", "wo_prevstatus": [8] },
            { "label": "Facturado", "value": 10, "desc": "Facturado", "us_group": "almacen", "wo_prevstatus": [9] },
            { "label": "No se pudo entregar", "value": 11, "desc": "El producto no se pudo entregar", "us_group": "almacen", "wo_prevstatus": [10] },
            { "label": "Rechazado por el cliente", "value": 12, "desc": "El productofue rechazado por el cliente", "us_group": "almacen", "wo_prevstatus": [10] },
            { "label": "Entregado", "value": 13, "desc": "El producto se entrego al cliente con éxito", "us_group": "almacen", "wo_prevstatus": [10, 11] },
            { "label": "Cancelar", "value": 14, "desc": "La orden de trabajo fue cancelada", "us_group": "admin", "wo_prevstatus": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] }
        ]
    }
}
},{}],126:[function(require,module,exports){
module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'workflowFactory', '$location', 'i18nFilter', '$stateParams', '$filter',
        function ($scope, workflowFactory, $location, i18nFilter, $stateParams, $filter) {

            $scope.fmData = {
                "wo_status": 0
            };

            $scope.labels = Object.keys(i18nFilter("workflow.labels"));
            $scope.columns = i18nFilter("workflow.columns");

            // formatter to add checkboxes to boolean columns
            $scope.onSubmit = function () {
                var flex = $scope.ggGrid;
                var arr = []
                for (var i = 0; i < flex.rows.length; i++) {
                    if (flex.getCellData(i, flex.columns.getColumn('active').index) === true) arr.push(flex.getCellData(i, flex.columns.getColumn('wo_id').index));
                }
                $scope.wo_id = arr;
                console.log(arr)
            };
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

            $scope.wo_statusoptions = i18nFilter("workflow.fields.wo_statusoptions");

            $scope.$on('$viewContentLoaded', function () {

                // this code is executed after the view is loaded
                $scope.loading = true;
                $scope.$watch('fmData.wo_status', function (newValue, oldValue) {
                    $scope.actions = [];
                    angular.forEach($scope.wo_statusoptions, function (value, key) {
                        if (value.wo_prevstatus.includes(newValue)) {
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
                })
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwLzQwNC80MDQuY3RybC5qcyIsInNyYy9hcHAvNDA0L2luZGV4LmpzIiwic3JjL2FwcC9hcHAuY3RybC5qcyIsInNyYy9hcHAvYXBwLmZhYy5qcyIsInNyYy9hcHAvYXBwLmh0dHAuaW50ZXJjZXB0b3IuanMiLCJzcmMvYXBwL2FwcC5qcyIsInNyYy9hcHAvYXV0aC9sYW5nLmVzLU1YLmpzIiwic3JjL2FwcC9jbGllbnQvY2xpZW50LmN0cmwuanMiLCJzcmMvYXBwL2NsaWVudC9jbGllbnQuZmFjLmpzIiwic3JjL2FwcC9jbGllbnQvaW5kZXguanMiLCJzcmMvYXBwL2NsaWVudC9sYW5nLmN1c3RvbS5lcy1NWC5qcyIsInNyYy9hcHAvY2xpZW50L2xhbmcuZXMtTVguanMiLCJzcmMvYXBwL2NsaWVudC9tb2R1bGVzL2NsaWVudC5hZGQvY2xpZW50LmFkZC5jdHJsLmpzIiwic3JjL2FwcC9jbGllbnQvbW9kdWxlcy9jbGllbnQuYWRkL2NsaWVudC5hZGQuZmFjLmpzIiwic3JjL2FwcC9jbGllbnQvbW9kdWxlcy9jbGllbnQuYWRkL2luZGV4LmpzIiwic3JjL2FwcC9jbGllbnQvbW9kdWxlcy9jbGllbnQuYWRkL2xhbmcuZXMtTVguanMiLCJzcmMvYXBwL2NsaWVudC9tb2R1bGVzL2NsaWVudC51cGRhdGUvY2xpZW50LnVwZGF0ZS5jdHJsLmpzIiwic3JjL2FwcC9jbGllbnQvbW9kdWxlcy9jbGllbnQudXBkYXRlL2NsaWVudC51cGRhdGUuZmFjLmpzIiwic3JjL2FwcC9jbGllbnQvbW9kdWxlcy9jbGllbnQudXBkYXRlL2luZGV4LmpzIiwic3JjL2FwcC9jbGllbnQvbW9kdWxlcy9jbGllbnQudXBkYXRlL2xhbmcuZXMtTVguanMiLCJzcmMvYXBwL2hvbWUvaG9tZS5jdHJsLmpzIiwic3JjL2FwcC9ob21lL2hvbWUuZmFjLmpzIiwic3JjL2FwcC9ob21lL2luZGV4LmpzIiwic3JjL2FwcC9ob21lL2xhbmcuZXMtTVguanMiLCJzcmMvYXBwL2luay9pbmRleC5qcyIsInNyYy9hcHAvaW5rL2luay5jdHJsLmpzIiwic3JjL2FwcC9pbmsvaW5rLmZhYy5qcyIsInNyYy9hcHAvaW5rL2xhbmcuZXMtTVguanMiLCJzcmMvYXBwL2luay9tb2R1bGVzL2luay5hZGQvaW5kZXguanMiLCJzcmMvYXBwL2luay9tb2R1bGVzL2luay5hZGQvaW5rLmFkZC5jdHJsLmpzIiwic3JjL2FwcC9pbmsvbW9kdWxlcy9pbmsuYWRkL2luay5hZGQuZmFjLmpzIiwic3JjL2FwcC9pbmsvbW9kdWxlcy9pbmsuYWRkL2xhbmcuZXMtTVguanMiLCJzcmMvYXBwL2luay9tb2R1bGVzL2luay51cGRhdGUvaW5kZXguanMiLCJzcmMvYXBwL2luay9tb2R1bGVzL2luay51cGRhdGUvaW5rLnVwZGF0ZS5jdHJsLmpzIiwic3JjL2FwcC9pbmsvbW9kdWxlcy9pbmsudXBkYXRlL2luay51cGRhdGUuZmFjLmpzIiwic3JjL2FwcC9pbmsvbW9kdWxlcy9pbmsudXBkYXRlL2xhbmcuZXMtTVguanMiLCJzcmMvYXBwL2xhbmcuZmlsdGVyLmkxOG4uanMiLCJzcmMvYXBwL2xhbmcubG9jYWxlLmVuLVVTLmpzIiwic3JjL2FwcC9sYW5nLmxvY2FsZS5lcy1NWC5qcyIsInNyYy9hcHAvbG9naW4vaW5kZXguanMiLCJzcmMvYXBwL2xvZ2luL2xvZ2luLmN0cmwuanMiLCJzcmMvYXBwL21hY2hpbmUvaW5kZXguanMiLCJzcmMvYXBwL21hY2hpbmUvbGFuZy5lcy1NWC5qcyIsInNyYy9hcHAvbWFjaGluZS9tYWNoaW5lLmN0cmwuanMiLCJzcmMvYXBwL21hY2hpbmUvbWFjaGluZS5mYWMuanMiLCJzcmMvYXBwL21hY2hpbmUvbW9kdWxlcy9tYWNoaW5lLmFkZC9pbmRleC5qcyIsInNyYy9hcHAvbWFjaGluZS9tb2R1bGVzL21hY2hpbmUuYWRkL2xhbmcuZXMtTVguanMiLCJzcmMvYXBwL21hY2hpbmUvbW9kdWxlcy9tYWNoaW5lLmFkZC9tYWNoaW5lLmFkZC5jdHJsLmpzIiwic3JjL2FwcC9tYWNoaW5lL21vZHVsZXMvbWFjaGluZS5hZGQvbWFjaGluZS5hZGQuZmFjLmpzIiwic3JjL2FwcC9tYWNoaW5lL21vZHVsZXMvbWFjaGluZS51cGRhdGUvaW5kZXguanMiLCJzcmMvYXBwL21hY2hpbmUvbW9kdWxlcy9tYWNoaW5lLnVwZGF0ZS9sYW5nLmVzLU1YLmpzIiwic3JjL2FwcC9tYWNoaW5lL21vZHVsZXMvbWFjaGluZS51cGRhdGUvbWFjaGluZS51cGRhdGUuY3RybC5qcyIsInNyYy9hcHAvbWFjaGluZS9tb2R1bGVzL21hY2hpbmUudXBkYXRlL21hY2hpbmUudXBkYXRlLmZhYy5qcyIsInNyYy9hcHAvcGFwZXIvaW5kZXguanMiLCJzcmMvYXBwL3BhcGVyL2xhbmcuZXMtTVguanMiLCJzcmMvYXBwL3BhcGVyL21vZHVsZXMvcGFwZXIuYWRkL2luZGV4LmpzIiwic3JjL2FwcC9wYXBlci9tb2R1bGVzL3BhcGVyLmFkZC9sYW5nLmVzLU1YLmpzIiwic3JjL2FwcC9wYXBlci9tb2R1bGVzL3BhcGVyLmFkZC9wYXBlci5hZGQuY3RybC5qcyIsInNyYy9hcHAvcGFwZXIvbW9kdWxlcy9wYXBlci5hZGQvcGFwZXIuYWRkLmZhYy5qcyIsInNyYy9hcHAvcGFwZXIvbW9kdWxlcy9wYXBlci51cGRhdGUvaW5kZXguanMiLCJzcmMvYXBwL3BhcGVyL21vZHVsZXMvcGFwZXIudXBkYXRlL2xhbmcuZXMtTVguanMiLCJzcmMvYXBwL3BhcGVyL21vZHVsZXMvcGFwZXIudXBkYXRlL3BhcGVyLnVwZGF0ZS5jdHJsLmpzIiwic3JjL2FwcC9wYXBlci9tb2R1bGVzL3BhcGVyLnVwZGF0ZS9wYXBlci51cGRhdGUuZmFjLmpzIiwic3JjL2FwcC9wYXBlci9wYXBlci5jdHJsLmpzIiwic3JjL2FwcC9wYXBlci9wYXBlci5mYWMuanMiLCJzcmMvYXBwL3Byb2R1Y3QvaW5kZXguanMiLCJzcmMvYXBwL3Byb2R1Y3QvbGFuZy5lcy1NWC5qcyIsInNyYy9hcHAvcHJvZHVjdC9tb2R1bGVzL3Byb2R1Y3RPZmZzZXRHZW5lcmFsLmFkZC9pbmRleC5qcyIsInNyYy9hcHAvcHJvZHVjdC9tb2R1bGVzL3Byb2R1Y3RPZmZzZXRHZW5lcmFsLmFkZC9sYW5nLmVzLU1YLmpzIiwic3JjL2FwcC9wcm9kdWN0L21vZHVsZXMvcHJvZHVjdE9mZnNldEdlbmVyYWwuYWRkL3Byb2R1Y3RPZmZzZXRHZW5lcmFsLmFkZC5jdHJsLmpzIiwic3JjL2FwcC9wcm9kdWN0L21vZHVsZXMvcHJvZHVjdE9mZnNldEdlbmVyYWwuYWRkL3Byb2R1Y3RPZmZzZXRHZW5lcmFsLmFkZC5mYWMuanMiLCJzcmMvYXBwL3Byb2R1Y3QvbW9kdWxlcy9wcm9kdWN0T2Zmc2V0R2VuZXJhbC51cGRhdGUvaW5kZXguanMiLCJzcmMvYXBwL3Byb2R1Y3QvbW9kdWxlcy9wcm9kdWN0T2Zmc2V0R2VuZXJhbC51cGRhdGUvbGFuZy5lcy1NWC5qcyIsInNyYy9hcHAvcHJvZHVjdC9tb2R1bGVzL3Byb2R1Y3RPZmZzZXRHZW5lcmFsLnVwZGF0ZS9wcm9kdWN0T2Zmc2V0R2VuZXJhbC51cGRhdGUuY3RybC5qcyIsInNyYy9hcHAvcHJvZHVjdC9tb2R1bGVzL3Byb2R1Y3RPZmZzZXRHZW5lcmFsLnVwZGF0ZS9wcm9kdWN0T2Zmc2V0R2VuZXJhbC51cGRhdGUuZmFjLmpzIiwic3JjL2FwcC9wcm9kdWN0L21vZHVsZXMvcHJvZHVjdE9mZnNldFBhZ2luYXRlZC5hZGQvaW5kZXguanMiLCJzcmMvYXBwL3Byb2R1Y3QvbW9kdWxlcy9wcm9kdWN0T2Zmc2V0UGFnaW5hdGVkLmFkZC9sYW5nLmVzLU1YLmpzIiwic3JjL2FwcC9wcm9kdWN0L21vZHVsZXMvcHJvZHVjdE9mZnNldFBhZ2luYXRlZC5hZGQvcHJvZHVjdE9mZnNldFBhZ2luYXRlZC5hZGQuY3RybC5qcyIsInNyYy9hcHAvcHJvZHVjdC9tb2R1bGVzL3Byb2R1Y3RPZmZzZXRQYWdpbmF0ZWQuYWRkL3Byb2R1Y3RPZmZzZXRQYWdpbmF0ZWQuYWRkLmZhYy5qcyIsInNyYy9hcHAvcHJvZHVjdC9wcm9kdWN0LmN0cmwuanMiLCJzcmMvYXBwL3Byb2R1Y3QvcHJvZHVjdC5mYWMuanMiLCJzcmMvYXBwL3N1cHBsaWVyL2luZGV4LmpzIiwic3JjL2FwcC9zdXBwbGllci9sYW5nLmVzLU1YLmpzIiwic3JjL2FwcC9zdXBwbGllci9tb2R1bGVzL3N1cHBsaWVyLmFkZC9pbmRleC5qcyIsInNyYy9hcHAvc3VwcGxpZXIvbW9kdWxlcy9zdXBwbGllci5hZGQvbGFuZy5lcy1NWC5qcyIsInNyYy9hcHAvc3VwcGxpZXIvbW9kdWxlcy9zdXBwbGllci5hZGQvc3VwcGxpZXIuYWRkLmN0cmwuanMiLCJzcmMvYXBwL3N1cHBsaWVyL21vZHVsZXMvc3VwcGxpZXIuYWRkL3N1cHBsaWVyLmFkZC5mYWMuanMiLCJzcmMvYXBwL3N1cHBsaWVyL21vZHVsZXMvc3VwcGxpZXIudXBkYXRlL2luZGV4LmpzIiwic3JjL2FwcC9zdXBwbGllci9tb2R1bGVzL3N1cHBsaWVyLnVwZGF0ZS9sYW5nLmVzLU1YLmpzIiwic3JjL2FwcC9zdXBwbGllci9tb2R1bGVzL3N1cHBsaWVyLnVwZGF0ZS9zdXBwbGllci51cGRhdGUuY3RybC5qcyIsInNyYy9hcHAvc3VwcGxpZXIvbW9kdWxlcy9zdXBwbGllci51cGRhdGUvc3VwcGxpZXIudXBkYXRlLmZhYy5qcyIsInNyYy9hcHAvc3VwcGxpZXIvc3VwcGxpZXIuY3RybC5qcyIsInNyYy9hcHAvc3VwcGxpZXIvc3VwcGxpZXIuZmFjLmpzIiwic3JjL2FwcC91c2VyL2luZGV4LmpzIiwic3JjL2FwcC91c2VyL2xhbmcuZXMtTVguanMiLCJzcmMvYXBwL3VzZXIvbW9kdWxlcy91c2VyLmFkZC9pbmRleC5qcyIsInNyYy9hcHAvdXNlci9tb2R1bGVzL3VzZXIuYWRkL2xhbmcuZXMtTVguanMiLCJzcmMvYXBwL3VzZXIvbW9kdWxlcy91c2VyLmFkZC91c2VyLmFkZC5jdHJsLmpzIiwic3JjL2FwcC91c2VyL21vZHVsZXMvdXNlci5hZGQvdXNlci5hZGQuZmFjLmpzIiwic3JjL2FwcC91c2VyL21vZHVsZXMvdXNlci5wcm9maWxlL2luZGV4LmpzIiwic3JjL2FwcC91c2VyL21vZHVsZXMvdXNlci5wcm9maWxlL2xhbmcuZXMtTVguanMiLCJzcmMvYXBwL3VzZXIvbW9kdWxlcy91c2VyLnByb2ZpbGUvdXNlci5wcm9maWxlLmN0cmwuanMiLCJzcmMvYXBwL3VzZXIvbW9kdWxlcy91c2VyLnVwZGF0ZS9pbmRleC5qcyIsInNyYy9hcHAvdXNlci9tb2R1bGVzL3VzZXIudXBkYXRlL2xhbmcuZXMtTVguanMiLCJzcmMvYXBwL3VzZXIvbW9kdWxlcy91c2VyLnVwZGF0ZS91c2VyLnVwZGF0ZS5jdHJsLmpzIiwic3JjL2FwcC91c2VyL21vZHVsZXMvdXNlci51cGRhdGUvdXNlci51cGRhdGUuZmFjLmpzIiwic3JjL2FwcC91c2VyL3VzZXIuY3RybC5qcyIsInNyYy9hcHAvdXNlci91c2VyLmZhYy5qcyIsInNyYy9hcHAvd28vaW5kZXguanMiLCJzcmMvYXBwL3dvL2xhbmcuZXMtTVguanMiLCJzcmMvYXBwL3dvL21vZHVsZXMvd28uYWRkL2luZGV4LmpzIiwic3JjL2FwcC93by9tb2R1bGVzL3dvLmFkZC9sYW5nLmVzLU1YLmpzIiwic3JjL2FwcC93by9tb2R1bGVzL3dvLmFkZC93by5hZGQuY3RybC5qcyIsInNyYy9hcHAvd28vbW9kdWxlcy93by5hZGQvd28uYWRkLmZhYy5qcyIsInNyYy9hcHAvd28vbW9kdWxlcy93by5kdXBsaWNhdGUvaW5kZXguanMiLCJzcmMvYXBwL3dvL21vZHVsZXMvd28uZHVwbGljYXRlL3dvLmR1cGxpY2F0ZS5jdHJsLmpzIiwic3JjL2FwcC93by9tb2R1bGVzL3dvLmR1cGxpY2F0ZS93by5kdXBsaWNhdGUuZmFjLmpzIiwic3JjL2FwcC93by9tb2R1bGVzL3dvLnVwZGF0ZS9pbmRleC5qcyIsInNyYy9hcHAvd28vbW9kdWxlcy93by51cGRhdGUvbGFuZy5lcy1NWC5qcyIsInNyYy9hcHAvd28vbW9kdWxlcy93by51cGRhdGUvd28udXBkYXRlLmN0cmwuanMiLCJzcmMvYXBwL3dvL21vZHVsZXMvd28udXBkYXRlL3dvLnVwZGF0ZS5mYWMuanMiLCJzcmMvYXBwL3dvL3dvLmN0cmwuanMiLCJzcmMvYXBwL3dvL3dvLmZhYy5qcyIsInNyYy9hcHAvd29ya2Zsb3cvaW5kZXguanMiLCJzcmMvYXBwL3dvcmtmbG93L2xhbmcuZXMtTVguanMiLCJzcmMvYXBwL3dvcmtmbG93L3dvcmtmbG93LmN0cmwuanMiLCJzcmMvYXBwL3dvcmtmbG93L3dvcmtmbG93LmZhYy5qcyIsInNyYy9hcHAvem9uZS9pbmRleC5qcyIsInNyYy9hcHAvem9uZS9sYW5nLmVzLU1YLmpzIiwic3JjL2FwcC96b25lL21vZHVsZXMvem9uZS5hZGQvaW5kZXguanMiLCJzcmMvYXBwL3pvbmUvbW9kdWxlcy96b25lLmFkZC9sYW5nLmVzLU1YLmpzIiwic3JjL2FwcC96b25lL21vZHVsZXMvem9uZS5hZGQvem9uZS5hZGQuY3RybC5qcyIsInNyYy9hcHAvem9uZS9tb2R1bGVzL3pvbmUuYWRkL3pvbmUuYWRkLmZhYy5qcyIsInNyYy9hcHAvem9uZS9tb2R1bGVzL3pvbmUudXBkYXRlL2luZGV4LmpzIiwic3JjL2FwcC96b25lL21vZHVsZXMvem9uZS51cGRhdGUvbGFuZy5lcy1NWC5qcyIsInNyYy9hcHAvem9uZS9tb2R1bGVzL3pvbmUudXBkYXRlL3pvbmUudXBkYXRlLmN0cmwuanMiLCJzcmMvYXBwL3pvbmUvbW9kdWxlcy96b25lLnVwZGF0ZS96b25lLnVwZGF0ZS5mYWMuanMiLCJzcmMvYXBwL3pvbmUvem9uZS5jdHJsLmpzIiwic3JjL2FwcC96b25lL3pvbmUuZmFjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25JQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgcmV0dXJuIFsnJHNjb3BlJywgZnVuY3Rpb24gKCRzY29wZSkge1xuICAgICAgICAvL0FTRFxuICAgIH1dO1xuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbihhbmd1bGFyKXtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgXG4gICAgcmV0dXJuIGFuZ3VsYXIubW9kdWxlKCdhcHAuNDA0JyxbXSlcblxuICAgIC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLFxuICAgIGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcbiAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJzQwNCcsIHtcbiAgICAgICAgICAgIHVybDonLzQwNCcsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybCA6ICdhcHAvNDA0LzQwNC52aWV3Lmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlciA6ICc0MDRDdHJsJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICByZXF1aXJlc0xvZ2luOiB0cnVlXG4gICAgICAgICAgICB9ICAgIFxuICAgICAgICB9KTtcbiAgICB9XSlcblxuICAgIC5jb250cm9sbGVyKCc0MDRDdHJsJyxyZXF1aXJlKCcuLzQwNC5jdHJsJykpXG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgcmV0dXJuIFsnJHNjb3BlJywgJyRyb290U2NvcGUnLCAnaTE4bkZpbHRlcicsICckbG9jYXRpb24nLCAnYXV0aFNlcnZpY2UnLCBcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgJHJvb3RTY29wZSwgaTE4bkZpbHRlciwgJGxvY2F0aW9uLCBhdXRoU2VydmljZSkge1xuXG4gICAgICAgICAgICAvLyRzY29wZS5hdXRoU2VydmljZSA9IGF1dGhTZXJ2aWNlO1xuICAgICAgICAgICAgLypcbiAgICAgICAgICAgIGxhbmdGYWMuZ2V0TGFuZygpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICBpZiAocHJvbWlzZS5kYXRhLnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS5jdXJyZW50TGFuZ3VhZ2UgPSBwcm9taXNlLmRhdGEubGFuZztcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLm5hdkl0ZW1zID0gaTE4bkZpbHRlcihcIkdFTkVSQUwuTkFWXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpdGVtIGluICRzY29wZS5uYXZJdGVtcykge1xuICAgICAgICAgICAgICAgIGlmICgkc2NvcGUubmF2SXRlbXNbaXRlbV0uc3ViTWVudSkge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUubGFzdFN1Ym1lbnUgPSBpdGVtO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICRzY29wZS5sYW5nID0gZnVuY3Rpb24gKGxhbmcpIHtcbiAgICAgICAgICAgICAgICBsYW5nRmFjLnNldExhbmcobGFuZykudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocHJvbWlzZS5kYXRhLnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuY3VycmVudExhbmd1YWdlID0gcHJvbWlzZS5kYXRhLmxhbmc7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUubmF2SXRlbXMgPSBpMThuRmlsdGVyKFwiR0VORVJBTC5OQVZcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICovXG4gICAgICAgIH1dXG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgcmV0dXJuIFsnJGh0dHAnLCAnJHEnLCAgZnVuY3Rpb24gKCRodHRwLCAkcSkge1xuICAgICAgICB2YXIgZmFjdG9yeSA9IHt9O1xuICAgICAgICBmYWN0b3J5Lmp3dENoZWNrID0gZnVuY3Rpb24gKG5ld0xhbmcpIHtcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKFxuICAgICAgICAgICAgICAgICRodHRwLnBvc3QoJy9hcGkvand0Jywge1xuICAgICAgICAgICAgICAgICAgICBwcm9jZXNzOiBuZXcgRGF0ZSgpLmdldE1pbGxpc2Vjb25kcygpXG4gICAgICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBmYWN0b3J5O1xuICAgIH1dO1xuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRxJywgJyRpbmplY3RvcicsICdhdXRoU2VydmljZScsXG4gICAgICAgIGZ1bmN0aW9uICgkcSwgJGluamVjdG9yLCBhdXRoU2VydmljZSkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAncmVxdWVzdCc6IGZ1bmN0aW9uIChjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgdXNlciBpcyBhdGhlbnRpY2F0ZWQsIGFkZCB0aGUgcHJvZmlsZSB0byB0aGUgaGVhZGVyc1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghIWF1dGhTZXJ2aWNlLnVzZXJQcm9maWxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25maWcuaGVhZGVycy5wcm9maWxlID0gSlNPTi5zdHJpbmdpZnkoYXV0aFNlcnZpY2UudXNlclByb2ZpbGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjb25maWc7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgICdyZXF1ZXN0RXJyb3InOiBmdW5jdGlvbiAocmVqZWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGRvIHNvbWV0aGluZyBvbiBlcnJvclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHEucmVqZWN0KHJlamVjdGlvbik7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAncmVzcG9uc2VFcnJvcic6IGZ1bmN0aW9uIChyZWplY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZG8gc29tZXRoaW5nIG9uIGVycm9yXG4gICAgICAgICAgICAgICAgICAgIHZhciBhbGVydHMgPSAkaW5qZWN0b3IuZ2V0KCckYWxlcnRzJyk7XG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0cy5lcnJvcignV29vb3BzISBhbiBlcnJvciBoYXMgb2N1cnJlZC4nLCBKU09OLnN0cmluZ2lmeShyZWplY3Rpb24sIG51bGwsIDQpKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRxLnJlamVjdChyZWplY3Rpb24pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfV1cblxufSkoYW5ndWxhcikiLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcblxuICAgICd1c2Ugc3RyaWN0JzsvLyBsbyBxdWUgc2VhXG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwJywgW1xuICAgICAgICAndWkucm91dGVyJyxcbiAgICAgICAgJ25nQW5pbWF0ZScsXG4gICAgICAgICd1aS5ib290c3RyYXAnLFxuICAgICAgICAnZ2ctZmllbGRzJyxcbiAgICAgICAgJ2dnLWFsZXJ0cycsXG4gICAgICAgICd3aicsXG4gICAgICAgICdqYS5xcicsXG4gICAgICAgICdhdXRoMC5sb2NrJyxcbiAgICAgICAgJ2FuZ3VsYXItand0JyxcbiAgICAgICAgcmVxdWlyZSgnLi80MDQnKS5uYW1lLFxuICAgICAgICByZXF1aXJlKCcuL2xvZ2luJykubmFtZSxcbiAgICAgICAgcmVxdWlyZSgnLi9jbGllbnQnKS5uYW1lLFxuICAgICAgICByZXF1aXJlKCcuL3VzZXInKS5uYW1lLFxuICAgICAgICByZXF1aXJlKCcuL2hvbWUnKS5uYW1lLFxuICAgICAgICByZXF1aXJlKCcuL3Byb2R1Y3QnKS5uYW1lLFxuICAgICAgICByZXF1aXJlKCcuL3N1cHBsaWVyJykubmFtZSxcbiAgICAgICAgcmVxdWlyZSgnLi9tYWNoaW5lJykubmFtZSxcbiAgICAgICAgcmVxdWlyZSgnLi9wYXBlcicpLm5hbWUsXG4gICAgICAgIHJlcXVpcmUoJy4vaW5rJykubmFtZSxcbiAgICAgICAgcmVxdWlyZSgnLi93bycpLm5hbWUsXG4gICAgICAgIHJlcXVpcmUoJy4vem9uZScpLm5hbWUsXG4gICAgICAgIHJlcXVpcmUoJy4vd29ya2Zsb3cnKS5uYW1lXG4gICAgXSlcblxuICAgICAgICAuc2VydmljZSgnYXV0aFNlcnZpY2UnLCBbJyRyb290U2NvcGUnLCAnJGxvY2F0aW9uJywgJ2xvY2snLCAnYXV0aE1hbmFnZXInLCBmdW5jdGlvbiBhdXRoU2VydmljZSgkcm9vdFNjb3BlLCAkbG9jYXRpb24sIGxvY2ssIGF1dGhNYW5hZ2VyKSB7XG5cbiAgICAgICAgICAgIHZhciB1c2VyUHJvZmlsZSA9IGFuZ3VsYXIuZnJvbUpzb24obG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3Byb2ZpbGUnKSkgfHwge307XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGxvZ2luKCkge1xuICAgICAgICAgICAgICAgIGxvY2suc2hvdygpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBMb2dnaW5nIG91dCBqdXN0IHJlcXVpcmVzIHJlbW92aW5nIHRoZSB1c2VyJ3NcbiAgICAgICAgICAgIC8vIGlkX3Rva2VuIGFuZCBwcm9maWxlXG4gICAgICAgICAgICBmdW5jdGlvbiBsb2dvdXQoKSB7XG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ2lkX3Rva2VuJyk7XG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ3Byb2ZpbGUnKTtcbiAgICAgICAgICAgICAgICBhdXRoTWFuYWdlci51bmF1dGhlbnRpY2F0ZSgpO1xuICAgICAgICAgICAgICAgIHVzZXJQcm9maWxlID0ge307XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFNldCB1cCB0aGUgbG9naWMgZm9yIHdoZW4gYSB1c2VyIGF1dGhlbnRpY2F0ZXNcbiAgICAgICAgICAgIC8vIFRoaXMgbWV0aG9kIGlzIGNhbGxlZCBmcm9tIGFwcC5ydW4uanNcbiAgICAgICAgICAgIGZ1bmN0aW9uIHJlZ2lzdGVyQXV0aGVudGljYXRpb25MaXN0ZW5lcigpIHtcbiAgICAgICAgICAgICAgICBsb2NrLm9uKCdhdXRoZW50aWNhdGVkJywgZnVuY3Rpb24gKGF1dGhSZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2lkX3Rva2VuJywgYXV0aFJlc3VsdC5pZFRva2VuKTtcbiAgICAgICAgICAgICAgICAgICAgYXV0aE1hbmFnZXIuYXV0aGVudGljYXRlKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgbG9jay5nZXRQcm9maWxlKGF1dGhSZXN1bHQuaWRUb2tlbiwgZnVuY3Rpb24gKGVycm9yLCBwcm9maWxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdwcm9maWxlJywgSlNPTi5zdHJpbmdpZnkocHJvZmlsZSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCd1c2VyUHJvZmlsZVNldCcsIHByb2ZpbGUpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9ob21lJyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdXNlclByb2ZpbGU6IHVzZXJQcm9maWxlLFxuICAgICAgICAgICAgICAgIGxvZ2luOiBsb2dpbixcbiAgICAgICAgICAgICAgICBsb2dvdXQ6IGxvZ291dCxcbiAgICAgICAgICAgICAgICByZWdpc3RlckF1dGhlbnRpY2F0aW9uTGlzdGVuZXI6IHJlZ2lzdGVyQXV0aGVudGljYXRpb25MaXN0ZW5lcixcbiAgICAgICAgICAgIH1cbiAgICAgICAgfV0pXG5cbiAgICAgICAgLmNvbmZpZyhbJyRsb2NhdGlvblByb3ZpZGVyJywgJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsICckaHR0cFByb3ZpZGVyJywgJ2xvY2tQcm92aWRlcicsICdqd3RPcHRpb25zUHJvdmlkZXInLCAnand0SW50ZXJjZXB0b3JQcm92aWRlcicsXG4gICAgICAgICAgICBmdW5jdGlvbiAoJGxvY2F0aW9uUHJvdmlkZXIsICRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIsICRodHRwUHJvdmlkZXIsIGxvY2tQcm92aWRlciwgand0T3B0aW9uc1Byb3ZpZGVyLCBqd3RJbnRlcmNlcHRvclByb3ZpZGVyKSB7XG4gICAgICAgICAgICAgICAgbG9ja1Byb3ZpZGVyLmluaXQoe1xuICAgICAgICAgICAgICAgICAgICBjbGllbnRJRDogJ1pleFZERVBscUdMTW5XWG5teUtTc29FOEpPM1pTNzZ5JyxcbiAgICAgICAgICAgICAgICAgICAgZG9tYWluOiAnZ3J1cG9ncmFmaWNvLmF1dGgwLmNvbScsXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhcjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhbmd1YWdlOiBcImVzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjbG9zYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGF1dG9jbG9zZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbWVtYmVyTGFzdExvZ2luOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGF1dGg6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWRpcmVjdDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVkaXJlY3RVcmw6IFwiaHR0cDovL2xvY2FsaG9zdDozMDAwL3d3dy8jL2hvbWVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZVR5cGU6IFwidG9rZW5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzc286IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgbGFuZ3VhZ2VEaWN0aW9uYXJ5OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiR3J1cG8gR3LDoWZpY29cIlxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoZW1lOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWxlZFN1Ym1pdEJ1dHRvbjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2xvZ286IFwiaW1nL2dnYXV0aC1sb2dvLnBuZ1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByaW1hcnlDb2xvcjogXCJncmVlblwiXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGp3dE9wdGlvbnNQcm92aWRlci5jb25maWcoe1xuICAgICAgICAgICAgICAgICAgICBsb2dpblBhdGg6ICcvaG9tZScsXG4gICAgICAgICAgICAgICAgICAgIHVuYXV0aGVudGljYXRlZFJlZGlyZWN0b3I6IFsnJHN0YXRlJywgZnVuY3Rpb24gKCRzdGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdsb2dpbicpO1xuICAgICAgICAgICAgICAgICAgICB9XSxcbiAgICAgICAgICAgICAgICAgICAgdG9rZW5HZXR0ZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnaWRfdG9rZW4nKTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgd2hpdGVMaXN0ZWREb21haW5zOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAnaHR0cDovL2FwaS5nZW9uYW1lcy5vcmcvJ1xuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAkaHR0cFByb3ZpZGVyLmludGVyY2VwdG9ycy5wdXNoKCdqd3RJbnRlcmNlcHRvcicpO1xuXG4gICAgICAgICAgICAgICAgJGh0dHBQcm92aWRlci5pbnRlcmNlcHRvcnMucHVzaChyZXF1aXJlKCcuL2FwcC5odHRwLmludGVyY2VwdG9yJykpO1xuXG4gICAgICAgICAgICAgICAgLy8gQmF0Y2hpbmcgbXVsdGlwbGUgJGh0dHAgcmVzcG9uc2VzIGludG8gb25lICRkaWdlc3RcbiAgICAgICAgICAgICAgICAkaHR0cFByb3ZpZGVyLnVzZUFwcGx5QXN5bmModHJ1ZSk7XG5cbiAgICAgICAgICAgICAgICAvLyBkZWZhdWx0IHJvdXRlc1xuICAgICAgICAgICAgICAgICR1cmxSb3V0ZXJQcm92aWRlci53aGVuKCcnLCAnL2hvbWUnKTtcbiAgICAgICAgICAgICAgICAkdXJsUm91dGVyUHJvdmlkZXIud2hlbignLycsICcvaG9tZScpO1xuICAgICAgICAgICAgICAgICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoXCIvNDA0XCIpO1xuXG4gICAgICAgICAgICB9XSlcblxuICAgICAgICAucnVuKFsnJHJvb3RTY29wZScsICdhdXRoU2VydmljZScsICdhdXRoTWFuYWdlcicsICckbG9jYXRpb24nLCAnand0SGVscGVyJywgJyRzdGF0ZScsICdhcHBGYWMnLFxuICAgICAgICAgICAgZnVuY3Rpb24gKCRyb290U2NvcGUsIGF1dGhTZXJ2aWNlLCBhdXRoTWFuYWdlciwgJGxvY2F0aW9uLCBqd3RIZWxwZXIsICRzdGF0ZSwgYXBwRmFjKSB7XG5cbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRvbignJHN0YXRlQ2hhbmdlU3RhcnQnLCBmdW5jdGlvbiAoZXZlbnQsIHRvU3RhdGUsIHRvUGFyYW1zLCBmcm9tU3RhdGUsIGZyb21QYXJhbXMsIG9wdGlvbnMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEhdG9TdGF0ZS5kYXRhLnJlcXVpcmVzTG9naW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0b2tlbiA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdpZF90b2tlbicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRva2VuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFqd3RIZWxwZXIuaXNUb2tlbkV4cGlyZWQodG9rZW4pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghYXV0aE1hbmFnZXIuaXNBdXRoZW50aWNhdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdXRoTWFuYWdlci5hdXRoZW50aWNhdGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvbG9naW4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvbG9naW4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgLy8gUHV0IHRoZSBhdXRoU2VydmljZSBvbiAkcm9vdFNjb3BlIHNvIGl0cyBtZXRob2RzXG4gICAgICAgICAgICAgICAgLy8gY2FuIGJlIGFjY2Vzc2VkIGZyb20gdGhlIG5hdiBiYXJcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLmF1dGhTZXJ2aWNlID0gYXV0aFNlcnZpY2U7XG5cbiAgICAgICAgICAgICAgICAvLyBSZWdpc3RlciB0aGUgYXV0aGVudGljYXRpb24gbGlzdGVuZXIgdGhhdCBpc1xuICAgICAgICAgICAgICAgIC8vIHNldCB1cCBpbiBhdXRoLnNlcnZpY2UuanNcbiAgICAgICAgICAgICAgICBhdXRoU2VydmljZS5yZWdpc3RlckF1dGhlbnRpY2F0aW9uTGlzdGVuZXIoKTtcblxuICAgICAgICAgICAgICAgIC8vIFVzZSB0aGUgYXV0aE1hbmFnZXIgZnJvbSBhbmd1bGFyLWp3dCB0byBjaGVjayBmb3JcbiAgICAgICAgICAgICAgICAvLyB0aGUgdXNlcidzIGF1dGhlbnRpY2F0aW9uIHN0YXRlIHdoZW4gdGhlIHBhZ2UgaXNcbiAgICAgICAgICAgICAgICAvLyByZWZyZXNoZWQgYW5kIG1haW50YWluIGF1dGhlbnRpY2F0aW9uXG4gICAgICAgICAgICAgICAgLy9hdXRoTWFuYWdlci5jaGVja0F1dGhPblJlZnJlc2goKTtcblxuICAgICAgICAgICAgICAgIC8vIExpc3RlbiBmb3IgNDAxIHVuYXV0aG9yaXplZCByZXF1ZXN0cyBhbmQgcmVkaXJlY3RcbiAgICAgICAgICAgICAgICAvLyB0aGUgdXNlciB0byB0aGUgbG9naW4gcGFnZVxuICAgICAgICAgICAgICAgIGF1dGhNYW5hZ2VyLnJlZGlyZWN0V2hlblVuYXV0aGVudGljYXRlZCgpO1xuXG5cbiAgICAgICAgICAgIH1dKVxuXG4gICAgICAgIC5maWx0ZXIoJ2kxOG4nLCByZXF1aXJlKCcuL2xhbmcuZmlsdGVyLmkxOG4nKSlcblxuICAgICAgICAuZmFjdG9yeSgnYXBwRmFjJywgcmVxdWlyZSgnLi9hcHAuZmFjJykpXG5cbiAgICAgICAgLmNvbnRyb2xsZXIoJ2FwcEN0cmwnLCByZXF1aXJlKCcuL2FwcC5jdHJsJykpXG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCIgOiBcImluaWNpYXIgc2VzacOzblwiLFxuICAgICAgICAgICAgICAgICAgICBcImVudGVycHJpc2VcIiA6IFwiZW1wcmVzYVwiLFxuICAgICAgICAgICAgICAgICAgICBcInVzZXJcIiA6IFwidXN1YXJpb1wiLFxuICAgICAgICAgICAgICAgICAgICBcInBhc3N3b3JkXCIgOiBcImNvbnRyYXNlw7FhXCIsXG4gICAgICAgICAgICAgICAgfSIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgcmV0dXJuIFsnJHNjb3BlJywgJ2NsaWVudEZhYycsICckbG9jYXRpb24nLCAnaTE4bkZpbHRlcicsXG4gICAgICAgIGZ1bmN0aW9uICgkc2NvcGUsIGNsaWVudEZhYywgJGxvY2F0aW9uLCBpMThuRmlsdGVyKSB7XG4gICAgICAgICAgICAkc2NvcGUuZm1EYXRhID0ge307XG4gICAgICAgICAgICAkc2NvcGUubGFiZWxzID0gT2JqZWN0LmtleXMoaTE4bkZpbHRlcihcImNsaWVudC5sYWJlbHNcIikpO1xuICAgICAgICAgICAgJHNjb3BlLmNvbHVtbnMgPSBpMThuRmlsdGVyKFwiY2xpZW50LmNvbHVtbnNcIik7XG4gICAgICAgIFxuICAgICAgICAgICAgLy8gZm9ybWF0SXRlbSBldmVudCBoYW5kbGVyXG4gICAgICAgICAgICB2YXIgY2xfaWQ7XG4gICAgICAgICAgICAkc2NvcGUuZm9ybWF0SXRlbSA9IGZ1bmN0aW9uIChzLCBlLCBjZWxsKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoZS5wYW5lbC5jZWxsVHlwZSA9PSB3aWptby5ncmlkLkNlbGxUeXBlLlJvd0hlYWRlcikge1xuICAgICAgICAgICAgICAgICAgICBlLmNlbGwudGV4dENvbnRlbnQgPSBlLnJvdyArIDE7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcy5yb3dzLmRlZmF1bHRTaXplID0gMzA7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBhZGQgQm9vdHN0cmFwIGh0bWxcbiAgICAgICAgICAgICAgICBpZiAoKGUucGFuZWwuY2VsbFR5cGUgPT0gd2lqbW8uZ3JpZC5DZWxsVHlwZS5DZWxsKSAmJiAoZS5jb2wgPT0gMCkpIHtcbiAgICAgICAgICAgICAgICAgICAgY2xfaWQgPSBlLnBhbmVsLmdldENlbGxEYXRhKGUucm93LCAxLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGUuY2VsbC5zdHlsZS5vdmVyZmxvdyA9ICd2aXNpYmxlJztcbiAgICAgICAgICAgICAgICAgICAgZS5jZWxsLmlubmVySFRNTCA9ICc8ZGl2IGNsYXNzPVwiYnRuLWdyb3VwIGJ0bi1ncm91cC1qdXN0aWZpZWRcIiByb2xlPVwiZ3JvdXBcIiBhcmlhLWxhYmVsPVwiLi4uXCI+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYnRuLWdyb3VwXCIgcm9sZT1cImdyb3VwXCI+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cIiMvY2xpZW50L3VwZGF0ZS8nKyBjbF9pZCArICdcIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdCBidG4teHNcIiBuZy1jbGljaz1cImVkaXQoJGl0ZW0uY2xfaWQpXCI+JyArIGkxOG5GaWx0ZXIoXCJnZW5lcmFsLmxhYmVscy5lZGl0XCIpICsgJzwvYT5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJ0bi1ncm91cFwiPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdCAgYnRuLXhzIGRyb3Bkb3duLXRvZ2dsZVwiIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIiBhcmlhLWV4cGFuZGVkPVwiZmFsc2VcIj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnKyBpMThuRmlsdGVyKFwiZ2VuZXJhbC5sYWJlbHMuYWRkXCIpICsgJyA8c3BhbiBjbGFzcz1cImNhcmV0XCI+PC9zcGFuPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudVwiIHJvbGU9XCJtZW51XCI+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjL3dvL2FkZC8nKyBjbF9pZCArICdcIj48c3BhbiBjbGFzcz1cImdseXBoaWNvbiBnbHlwaGljb24tdGgtbGFyZ2VcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L3NwYW4+IE9yZGVuPC9hPjwvbGk+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjL3Byb2R1Y3QvYWRkL1wiIGRhdGEtdG9nZ2xlPVwibW9kYWxcIiBkYXRhLXRhcmdldD1cIiNteU1vZGFsXCIgZGF0YS1jbF9pZD1cIicrIGNsX2lkICsgJ1wiPjxzcGFuIGNsYXNzPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1iYXJjb2RlXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9zcGFuPiBQcm9kdWN0bzwvYT48L2xpPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiIy9xdW90ZS9hZGQvJysgY2xfaWQgKyAnXCI+PHNwYW4gY2xhc3M9XCJnbHlwaGljb24gZ2x5cGhpY29uLWZpbGVcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L3NwYW4+IENvdGl6YWNpb248L2E+PC9saT5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiMvem9uZS9hZGQvJysgY2xfaWQgKyAnXCI+PHNwYW4gY2xhc3M9XCJnbHlwaGljb24gZ2x5cGhpY29uLW1hcC1tYXJrZXJcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L3NwYW4+IFpvbmE8L2E+PC9saT5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiMvZW1haWwvYWRkLycrIGNsX2lkICsgJ1wiPjxzcGFuIGNsYXNzPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1lbnZlbG9wZVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvc3Bhbj4gQ29ycmVvPC9hPjwvbGk+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdWw+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidG4tZ3JvdXBcIj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHQgIGJ0bi14cyBkcm9wZG93bi10b2dnbGVcIiBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCIgYXJpYS1leHBhbmRlZD1cImZhbHNlXCI+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJysgaTE4bkZpbHRlcihcImdlbmVyYWwubGFiZWxzLnNob3dcIikgKyAnIDxzcGFuIGNsYXNzPVwiY2FyZXRcIj48L3NwYW4+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51XCIgcm9sZT1cIm1lbnVcIj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiMvd28vJysgY2xfaWQgKyAnXCI+PHNwYW4gY2xhc3M9XCJnbHlwaGljb24gZ2x5cGhpY29uLWxpc3QtYWx0XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9zcGFuPiBPcmRlbmVzPC9hPjwvbGk+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjL3Byb2R1Y3QvJysgY2xfaWQgKyAnXCI+PHNwYW4gY2xhc3M9XCJnbHlwaGljb24gZ2x5cGhpY29uLWxpc3QtYWx0XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9zcGFuPiBQcm9kdWN0b3M8L2E+PC9saT5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiMvcXVvdGUvJysgY2xfaWQgKyAnXCI+PHNwYW4gY2xhc3M9XCJnbHlwaGljb24gZ2x5cGhpY29uLWxpc3QtYWx0XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9zcGFuPiBDb3RpemFjaW9uZXM8L2E+PC9saT5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiMvem9uZS8nKyBjbF9pZCArICdcIj48c3BhbiBjbGFzcz1cImdseXBoaWNvbiBnbHlwaGljb24tbGlzdC1hbHRcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L3NwYW4+IFpvbmFzPC9hPjwvbGk+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjL2VtYWlsLycrIGNsX2lkICsgJ1wiPjxzcGFuIGNsYXNzPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1saXN0LWFsdFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvc3Bhbj4gQ29ycmVvczwvYT48L2xpPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3VsPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2Pic7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgICAgIC8vIGJpbmQgY29sdW1ucyB3aGVuIGdyaWQgaXMgaW5pdGlhbGl6ZWRcbiAgICAgICAgICAgICRzY29wZS5pbml0R3JpZCA9IGZ1bmN0aW9uIChzLCBlKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAkc2NvcGUubGFiZWxzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjb2wgPSBuZXcgd2lqbW8uZ3JpZC5Db2x1bW4oKTtcbiAgICAgICAgICAgICAgICAgICAgY29sLmJpbmRpbmcgPSAkc2NvcGUuY29sdW1uc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgY29sLmhlYWRlciA9IGkxOG5GaWx0ZXIoXCJjbGllbnQubGFiZWxzLlwiICsgJHNjb3BlLmxhYmVsc1tpXSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbC53b3JkV3JhcCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBjb2wud2lkdGggPSAxNTA7XG4gICAgICAgICAgICAgICAgICAgIHMuY29sdW1ucy5wdXNoKGNvbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIC8vIGNyZWF0ZSB0aGUgdG9vbHRpcCBvYmplY3RcbiAgICAgICAgICAgICRzY29wZS4kd2F0Y2goJ2dnR3JpZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoJHNjb3BlLmdnR3JpZCkge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgLy8gc3RvcmUgcmVmZXJlbmNlIHRvIGdyaWRcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZsZXggPSAkc2NvcGUuZ2dHcmlkO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNyZWF0ZSB0b29sdGlwXG4gICAgICAgICAgICAgICAgICAgIHZhciB0aXAgPSBuZXcgd2lqbW8uVG9vbHRpcCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgcm5nID0gbnVsbDtcblxuICAgICAgICAgICAgICAgICAgICAvLyBtb25pdG9yIHRoZSBtb3VzZSBvdmVyIHRoZSBncmlkXG4gICAgICAgICAgICAgICAgICAgIGZsZXguaG9zdEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGh0ID0gZmxleC5oaXRUZXN0KGV2dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWh0LnJhbmdlLmVxdWFscyhybmcpKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBuZXcgY2VsbCBzZWxlY3RlZCwgc2hvdyB0b29sdGlwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGh0LmNlbGxUeXBlID09IHdpam1vLmdyaWQuQ2VsbFR5cGUuQ2VsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBybmcgPSBodC5yYW5nZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvbCA9IGZsZXguY29sdW1uc1tybmcuY29sXS5oZWFkZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjZWxsRWxlbWVudCA9IGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQoZXZ0LmNsaWVudFgsIGV2dC5jbGllbnRZKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNlbGxCb3VuZHMgPSB3aWptby5SZWN0LmZyb21Cb3VuZGluZ1JlY3QoY2VsbEVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YSA9IHdpam1vLmVzY2FwZUh0bWwoZmxleC5nZXRDZWxsRGF0YShybmcucm93LCBybmcuY29sLCB0cnVlKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXBDb250ZW50ID0gY29sICsgJzogXCI8Yj4nICsgZGF0YSArICc8L2I+XCInO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2VsbEVsZW1lbnQuY2xhc3NOYW1lLmluZGV4T2YoJ3dqLWNlbGwnKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXAuc2hvdyhmbGV4Lmhvc3RFbGVtZW50LCB0aXBDb250ZW50LCBjZWxsQm91bmRzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpcC5oaWRlKCk7IC8vIGNlbGwgbXVzdCBiZSBiZWhpbmQgc2Nyb2xsIGJhci4uLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgZmxleC5ob3N0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpcC5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBybmcgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJCgnI215TW9kYWwnKS5vbignc2hvdy5icy5tb2RhbCcsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgICAgIHZhciBidXR0b24gPSAkKGV2ZW50LnJlbGF0ZWRUYXJnZXQpOyAvLyBCdXR0b24gdGhhdCB0cmlnZ2VyZWQgdGhlIG1vZGFsXG4gICAgICAgICAgICAgICAgJHNjb3BlLmN1cnJlbnRfaWQgPSBidXR0b24uZGF0YSgnY2xfaWQnKTsgLy8gRXh0cmFjdCBpbmZvIGZyb20gZGF0YS0qIGF0dHJpYnV0ZXNcbiAgICAgICAgICAgICAgICAkc2NvcGUuZm1EYXRhLnByX3Byb2Nlc3MgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmZtRGF0YS5wcl90eXBlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICRzY29wZS5yZWRpcmVjdCA9IGZ1bmN0aW9uICh1cmwpIHtcbiAgICAgICAgICAgICAgICAkKCcjbXlNb2RhbCcpLm1vZGFsKCdoaWRlJyk7XG4gICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgodXJsKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJHNjb3BlLnByX3Byb2Nlc3NvcHRpb25zID0gaTE4bkZpbHRlcihcImNsaWVudC1jdXN0b20uZmllbGRzLnByX3Byb2Nlc3NvcHRpb25zXCIpO1xuXG4gICAgICAgICAgICAkc2NvcGUuJHdhdGNoKCdmbURhdGEucHJfcHJvY2VzcycsIGZ1bmN0aW9uIChuZXdWYWx1ZSwgb2xkVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUuZm1EYXRhLnByX3R5cGUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKCRzY29wZS5wcl9wcm9jZXNzb3B0aW9ucywgZnVuY3Rpb24gKG9iaiwga2V5KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXdWYWx1ZSA9PSBvYmoudmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5wcl90eXBlb3B0aW9ucyA9IG9iai50eXBlcztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICRzY29wZS4kb24oJyR2aWV3Q29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAvLyB0aGlzIGNvZGUgaXMgZXhlY3V0ZWQgYWZ0ZXIgdGhlIHZpZXcgaXMgbG9hZGVkXG4gICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGNsaWVudEZhYy5kYXRhKCkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5kYXRhID0gbmV3IHdpam1vLmNvbGxlY3Rpb25zLkNvbGxlY3Rpb25WaWV3KHByb21pc2UuZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XTtcbiAgICBcbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgcmV0dXJuIFsnJGh0dHAnLCAnJHEnLCAgZnVuY3Rpb24gKCRodHRwLCAkcSkge1xuICAgICAgICB2YXIgZmFjdG9yeSA9IHt9O1xuICAgICAgICBmYWN0b3J5LmRhdGEgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KCcvYXBpL2NsaWVudC8nLCB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICAgICAgcHJvY2Nlc19pZDogbmV3IERhdGUoKS5nZXRNaWxsaXNlY29uZHMoKVxuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBmYWN0b3J5O1xuICAgIH1dO1xufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oYW5ndWxhcil7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIC8vY29tbWVudFxuXG4gICAgcmV0dXJuIGFuZ3VsYXIubW9kdWxlKCdhcHAuY2xpZW50JyxbXG4gICAgICAgIHJlcXVpcmUoJy4vbW9kdWxlcy9jbGllbnQuYWRkJykubmFtZSxcbiAgICAgICAgcmVxdWlyZSgnLi9tb2R1bGVzL2NsaWVudC51cGRhdGUnKS5uYW1lXG4gICAgXSlcblxuICAgIC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLFxuICAgIGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcbiAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2NsaWVudCcsIHtcbiAgICAgICAgICAgIHVybDonL2NsaWVudCcsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybCA6ICdhcHAvY2xpZW50L2NsaWVudC52aWV3Lmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlciA6ICdjbGllbnRDdHJsJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICByZXF1aXJlc0xvZ2luOiB0cnVlXG4gICAgICAgICAgICB9ICAgIFxuICAgICAgICB9KTtcbiAgICB9XSlcblxuICAgIC5mYWN0b3J5KCdjbGllbnRGYWMnLHJlcXVpcmUoJy4vY2xpZW50LmZhYycpKVxuXG4gICAgLmNvbnRyb2xsZXIoJ2NsaWVudEN0cmwnLHJlcXVpcmUoJy4vY2xpZW50LmN0cmwnKSlcbiAgICBcbn0pKGFuZ3VsYXIpO1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgICAgICAgICAgICAgICAgIFwibGFiZWxzXCI6e1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci10aXRsZVwiOlwiU2VsZWNjw61vbmUgZWwgdGlwbyBkZSBwcm9kdWN0b1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1wcm9jZXNzXCI6XCJQcm9jZXNzb1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci10eXBlXCI6XCJUaXBvXCIsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICBcImZpZWxkc1wiIDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJfcHJvY2Vzc29wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIk9mZnNldFwiLFwidmFsdWVcIjpcIm9mZnNldFwiLHR5cGVzOltcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkdlbmVyYWxcIixcInZhbHVlXCI6XCJnZW5lcmFsXCJ9LCAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiUGFnaW5hZG9zXCIsXCJ2YWx1ZVwiOlwicGFnaW5hdGVkXCJ9LCAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiY291bnRlcmZvaWxcIixcInZhbHVlXCI6XCJjb3VudGVyZm9pbFwifSwgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiRmxleG9cIixcInZhbHVlXCI6XCJmbGV4b1wiLHR5cGVzOltcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkV0aXF1ZXRhc1wiLFwidmFsdWVcIjpcImxhYmVsc1wifSwgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIlJpYmJvbnNcIixcInZhbHVlXCI6XCJyaWJib25zXCJ9LCAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiY291bnRlcmZvaWxcIixcInZhbHVlXCI6XCJvZmZzZXRcIn0sICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXX0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIlBsb3RlclwiLFwidmFsdWVcIjpcInBsb3R0ZXJcIix0eXBlczpbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJFdGlxdWV0YXNcIixcInZhbHVlXCI6XCJsYWJlbHNcIn0sICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJTZcOxYWxpemFjacOzblwiLFwidmFsdWVcIjpcInNpZ25hZ2VcIn0sICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJCYW5uZXJzXCIsXCJ2YWx1ZVwiOlwiYmFubmVyc1wifSwgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkFydGljdWxvc1wiLFwidmFsdWVcIjpcIkFydGljbGVzXCJ9LCAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF19LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJTZWxsb3NcIixcInZhbHVlXCI6XCJzZWFsc1wiLHR5cGVzOltcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkdvbWFcIixcInZhbHVlXCI6XCJydWJiZXJcIn0sICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJNb2xkdXJhXCIsXCJ2YWx1ZVwiOlwibW9sZGluZ1wifSwgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkF1dG9lbnRpbnRhYmxlXCIsXCJ2YWx1ZVwiOlwic2VsZl90aW50YWJsZVwifSwgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkNvamluXCIsXCJ2YWx1ZVwiOlwicGFkXCJ9LCAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiVGludGFcIixcInZhbHVlXCI6XCJpbmtcIn0sICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXX0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIlNlcmlncmFmw61hXCIsXCJ2YWx1ZVwiOlwic2VyaWdyYXBoeVwiLHR5cGVzOltcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkV0aXF1ZXRhc1wiLFwidmFsdWVcIjpcImxhYmVsc1wifSwgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIlNlw7FhbGl6YWNpw7NuXCIsXCJ2YWx1ZVwiOlwic2lnbmFnZVwifSwgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkJhbm5lcnNcIixcInZhbHVlXCI6XCJiYW5uZXJzXCJ9LCAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiQXJ0aWN1bG9zXCIsXCJ2YWx1ZVwiOlwiQXJ0aWNsZXNcIn0sICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXX0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkxhc2VyXCIsXCJ2YWx1ZVwiOlwibGFzZXJcIix0eXBlczpbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJMYXNlclwiLFwidmFsdWVcIjpcImxhc2VyXCJ9LCAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXX0sXG4gICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCIgOiBcImNsaWVudGVzXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibGFiZWxzXCI6e1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbC1pZFwiOlwiaWQgY2xpZW50ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbC10eXBlXCI6XCJUaXBvIGRlIENsaWVudGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2wtY29ycG9yYXRlbmFtZVwiOlwicmF6w7NuIHNvY2lhbFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbC10aW5cIjpcInJmY1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbC1uYW1lXCI6XCJub21icmUocylcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2wtZmF0aGVyc2xhc3RuYW1lXCI6XCJhcGVsbGlkbyBwYXRlcm5vXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsLW1vdGhlcnNsYXN0bmFtZVwiOlwiYXBlbGxpZG8gbWF0ZXJub1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbC1zdHJlZXRcIjpcImNhbGxlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsLXN0cmVldG51bWJlclwiOlwibnVtZXJvIGV4dGVyaW9yXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsLXN1aXRlbnVtYmVyXCI6XCJudW1lcm8gaW50ZXJpb3JcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2wtbmVpZ2hib3Job29kXCI6XCJjb2xvbmlhXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsLWFkZHJlc3NyZWZlcmVuY2VcIjpcInJlZmVyZW5jaWFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2wtY291bnRyeVwiOlwicGHDrXNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2wtc3RhdGVcIjpcImVzdGFkb1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbC1jaXR5XCI6XCJjaXVkYWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2wtY291bnR5XCI6XCJtdW5pY2lwaW9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2wtemlwY29kZVwiOlwiY29kaWdvIHBvc3RhbFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbC1lbWFpbFwiOlwiY29ycmVvIGVsZWN0csOzbmljb1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbC1waG9uZVwiOlwidGVsw6lmb25vXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsLW1vYmlsZVwiOlwibcOzdmlsXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsLWNyZWRpdGxpbWl0XCI6XCJsaW1pdGUgZGUgY3LDqWRpdG9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2wtY3VzdG9tZXJkaXNjb3VudFwiOlwiZGVzY3VlbnRvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsLXN0YXR1c1wiOlwiZXN0YXR1c1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbC1kYXRlXCI6XCJmZWNoYVwiLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgXCJjb2x1bW5zXCI6W1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbF9pZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbF90eXBlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsX2NvcnBvcmF0ZW5hbWVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xfdGluXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsX25hbWVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xfZmF0aGVyc2xhc3RuYW1lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsX21vdGhlcnNsYXN0bmFtZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbF9zdHJlZXRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xfc3RyZWV0bnVtYmVyXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsX3N1aXRlbnVtYmVyXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsX25laWdoYm9yaG9vZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbF9hZGRyZXNzcmVmZXJlbmNlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsX2NvdW50cnlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xfc3RhdGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xfY2l0eVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbF9jb3VudHlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xfemlwY29kZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbF9lbWFpbFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbF9waG9uZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbF9tb2JpbGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xfY3JlZGl0bGltaXRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xfY3VzdG9tZXJkaXNjb3VudFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbF9zdGF0dXNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xfZGF0ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgIFwiZmllbGRzXCIgOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbF9zdGF0dXNvcHRpb25zIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJBY3Rpdm9cIixcInZhbHVlXCI6XCJBXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJJbmFjdGl2b1wiLFwidmFsdWVcIjpcIklcIn1cbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBjbF90eXBlb3B0aW9ucyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiRmlzaWNhXCIsXCJ2YWx1ZVwiOlwibmF0dXJhbFwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiTW9yYWxcIixcInZhbHVlXCI6XCJsZWdhbFwifVxuICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0iLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRzY29wZScsICdjbGllbnRBZGRGYWMnLCAnJGxvY2F0aW9uJywgJ2kxOG5GaWx0ZXInLCAnJGludGVydmFsJyxcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgY2xpZW50QWRkRmFjLCAkbG9jYXRpb24sIGkxOG5GaWx0ZXIsICRpbnRlcnZhbCkge1xuICAgICAgICAgICAgJHNjb3BlLmZtRGF0YSA9IHt9O1xuICAgICAgICAgICAgJHNjb3BlLmZtRGF0YSA9IHsgXCJjbF90eXBlXCI6IFwibmF0dXJhbFwiLCBcImNsX3RpblwiOiBcIlNBQkctODMwMTA2LUFDQVwiLCBcImNsX25hbWVcIjogXCJHYXNwYXIgQWxlamFuZHJvXCIsIFwiY2xfZmF0aGVyc2xhc3RuYW1lXCI6IFwiU2FuY2hlelwiLCBcImNsX21vdGhlcnNsYXN0bmFtZVwiOiBcIkJldGFuY291cnRcIiwgXCJjbF9jb3VudHJ5XCI6IDM5OTYwNjMsIFwiY2xfc3RhdGVcIjogNDAxNDMzNiwgXCJjbF9jaXR5XCI6IDg1ODE4MTYsIFwiY2xfY291bnR5XCI6IDg1ODE4MTYsIFwiY2xfc3RyZWV0XCI6IFwiQVYgR1VBREFMVVBFXCIsIFwiY2xfc3RyZWV0bnVtYmVyXCI6IFwiNjg3N1wiLCBcImNsX3N1aXRlbnVtYmVyXCI6IFwiODFcIiwgXCJjbF9uZWlnaGJvcmhvb2RcIjogXCJQTEFaQSBHVUFEQUxVUEVcIiwgXCJjbF96aXBjb2RlXCI6IFwiNDUwMzZcIiwgXCJjbF9hZGRyZXNzcmVmZXJlbmNlXCI6IFwiRlJJREEgS0hBTE8gWSBBViBHVUFEQUxVUEVcIiwgXCJjbF9lbWFpbFwiOiBcImFsZWphbmRyb2xzY2FAZ21haWwuY29tXCIsIFwiY2xfcGhvbmVcIjogXCIzMzM3OTc5MTM1XCIsIFwiY2xfbW9iaWxlXCI6IFwiKzUyMTMzMTAxMTI1NzZcIiwgXCJjbF9jcmVkaXRsaW1pdFwiOiBcIjEwMDAwLjAwXCIsIFwiY2xfY3VzdG9tZXJkaXNjb3VudFwiOiBcIjAuMTBcIiwgXCJjbF9zdGF0dXNcIjogXCJBXCIgfVxuXG4gICAgICAgICAgICAkc2NvcGUub25TdWJtaXQgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICBjbGllbnRBZGRGYWMuYWRkKCRzY29wZS5mbURhdGEpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb21pc2UuZGF0YS5yb3dDb3VudCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9jbGllbnQnKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS51cGRhdGVGYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgJHNjb3BlLmdldFN0YXRlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUuY2xfc3RhdGVvcHRpb25zID0gW107XG4gICAgICAgICAgICAgICAgJHNjb3BlLmNsX2NpdHlvcHRpb25zID0gW107XG4gICAgICAgICAgICAgICAgJHNjb3BlLmNsX2NvdW50eW9wdGlvbnMgPSBbXTtcbiAgICAgICAgICAgICAgICAkaW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBjbGllbnRBZGRGYWMuZ2V0U3RhdGVzKCRzY29wZS5mbURhdGEuY2xfY291bnRyeSkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEuZ2VvbmFtZXMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNsX3N0YXRlb3B0aW9ucyA9IHByb21pc2UuZGF0YS5nZW9uYW1lcztcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8kc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sIDAsIDEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkc2NvcGUuZ2V0Q2l0eUNvdW50eSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUuY2xfY2l0eW9wdGlvbnMgPSBbXTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuY2xfY291bnR5b3B0aW9ucyA9IFtdO1xuICAgICAgICAgICAgICAgICRpbnRlcnZhbChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGNsaWVudEFkZEZhYy5nZXRTdGF0ZXMoJHNjb3BlLmZtRGF0YS5jbF9zdGF0ZSkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEuZ2VvbmFtZXMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNsX2NpdHlvcHRpb25zID0gcHJvbWlzZS5kYXRhLmdlb25hbWVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5jbF9jb3VudHlvcHRpb25zID0gcHJvbWlzZS5kYXRhLmdlb25hbWVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyRzY29wZS51cGRhdGVGYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSwgMCwgMSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAkc2NvcGUuY2xfc3RhdHVzb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJjbGllbnQuZmllbGRzLmNsX3N0YXR1c29wdGlvbnNcIik7XG4gICAgICAgICAgICAkc2NvcGUuY2xfdHlwZW9wdGlvbnMgPSBpMThuRmlsdGVyKFwiY2xpZW50LmZpZWxkcy5jbF90eXBlb3B0aW9uc1wiKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgJHNjb3BlLiRvbignJHZpZXdDb250ZW50TG9hZGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIC8vIHRoaXMgY29kZSBpcyBleGVjdXRlZCBhZnRlciB0aGUgdmlldyBpcyBsb2FkZWRcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGNsaWVudEFkZEZhYy5nZXRDb3VudHJpZXMoKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhLmdlb25hbWVzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNsX2NvdW50cnlvcHRpb25zID0gcHJvbWlzZS5kYXRhLmdlb25hbWVzO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8kc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1dO1xuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRodHRwJywgJyRxJywgICckc3RhdGVQYXJhbXMnLCBmdW5jdGlvbiAoJGh0dHAsICRxLCAkc3RhdGVQYXJhbXMpIHtcbiAgICAgICAgdmFyIGZhY3RvcnkgPSB7fTtcbiAgICAgICAgZmFjdG9yeS5hZGQgPSBmdW5jdGlvbiAoY2xfanNvbmIpIHtcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gJGh0dHAucG9zdCgnL2FwaS9jbGllbnQvYWRkJywge1xuICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICBjbF9qc29uYjogY2xfanNvbmJcbiAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkuZ2V0Q291bnRyaWVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHByb21pc2UgPSAkaHR0cC5qc29ucCgnaHR0cDovL2FwaS5nZW9uYW1lcy5vcmcvY291bnRyeUluZm9KU09OP3VzZXJuYW1lPWFsZWphbmRyb2xzY2EmY2FsbGJhY2s9SlNPTl9DQUxMQkFDSycpXG4gICAgICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICBmYWN0b3J5LmdldFN0YXRlcyA9IGZ1bmN0aW9uIChjbF9jb3VudHJ5KSB7XG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9ICRodHRwLmpzb25wKCdodHRwOi8vYXBpLmdlb25hbWVzLm9yZy9jaGlsZHJlbkpTT04/Z2VvbmFtZUlkPScgKyBjbF9jb3VudHJ5ICsgJyZ1c2VybmFtZT1hbGVqYW5kcm9sc2NhJmNhbGxiYWNrPUpTT05fQ0FMTEJBQ0snKVxuICAgICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeS5nZXRDaXR5Q291bnR5ID0gZnVuY3Rpb24gKGNsX3N0YXRlKSB7XG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9ICRodHRwLmpzb25wKCdodHRwOi8vYXBpLmdlb25hbWVzLm9yZy9jaGlsZHJlbkpTT04/Z2VvbmFtZUlkPScgKyBjbF9zdGF0ZSArICcmdXNlcm5hbWU9YWxlamFuZHJvbHNjYSZjYWxsYmFjaz1KU09OX0NBTExCQUNLJylcbiAgICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBmYWN0b3J5O1xuICAgIH1dO1xuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbihhbmd1bGFyKXtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgXG4gICAgcmV0dXJuIGFuZ3VsYXIubW9kdWxlKCdhcHAuY2xpZW50LmFkZCcsW10pXG5cbiAgICAuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJyxcbiAgICBmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdjbGllbnRBZGQnLCB7XG4gICAgICAgICAgICB1cmw6Jy9jbGllbnQvYWRkJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsIDogJ2FwcC9jbGllbnQvbW9kdWxlcy9jbGllbnQuYWRkL2NsaWVudC5hZGQudmlldy5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXIgOiAnY2xpZW50QWRkQ3RybCcsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgcmVxdWlyZXNMb2dpbjogdHJ1ZVxuICAgICAgICAgICAgfSAgICBcbiAgICAgICAgfSk7XG4gICAgfV0pXG5cbiAgICAuZmFjdG9yeSgnY2xpZW50QWRkRmFjJyxyZXF1aXJlKCcuL2NsaWVudC5hZGQuZmFjJykpXG5cbiAgICAuY29udHJvbGxlcignY2xpZW50QWRkQ3RybCcscmVxdWlyZSgnLi9jbGllbnQuYWRkLmN0cmwnKSlcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIiA6IFwiYWdyZWdhciBjbGllbnRlXCIsXG4gICAgICAgICAgICAgICAgfSIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgcmV0dXJuIFsnJHNjb3BlJywgJ2NsaWVudFVwZGF0ZUZhYycsICckbG9jYXRpb24nLCAnaTE4bkZpbHRlcicsICckaW50ZXJ2YWwnLFxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCBjbGllbnRVcGRhdGVGYWMsICRsb2NhdGlvbiwgaTE4bkZpbHRlciwgJGludGVydmFsKSB7XG5cbiAgICAgICAgICAgICRzY29wZS5vblN1Ym1pdCA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgIGNsaWVudFVwZGF0ZUZhYy51cGRhdGUoJHNjb3BlLmZtRGF0YSkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocHJvbWlzZS5kYXRhLnJvd0NvdW50ID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2NsaWVudCcpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnVwZGF0ZUZhaWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAkc2NvcGUuZ2V0U3RhdGVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICRzY29wZS5jbF9zdGF0ZW9wdGlvbnMgPSBbXTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuY2xfY2l0eW9wdGlvbnMgPSBbXTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuY2xfY291bnR5b3B0aW9ucyA9IFtdO1xuICAgICAgICAgICAgICAgICRpbnRlcnZhbChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGNsaWVudFVwZGF0ZUZhYy5nZXRTdGF0ZXMoJHNjb3BlLmZtRGF0YS5jbF9jb3VudHJ5KS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YS5nZW9uYW1lcykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuY2xfc3RhdGVvcHRpb25zID0gcHJvbWlzZS5kYXRhLmdlb25hbWVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyRzY29wZS51cGRhdGVGYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSwgMCwgMSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICRzY29wZS5nZXRDaXR5Q291bnR5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICRzY29wZS5jbF9jaXR5b3B0aW9ucyA9IFtdO1xuICAgICAgICAgICAgICAgICRzY29wZS5jbF9jb3VudHlvcHRpb25zID0gW107XG4gICAgICAgICAgICAgICAgJGludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgY2xpZW50VXBkYXRlRmFjLmdldFN0YXRlcygkc2NvcGUuZm1EYXRhLmNsX3N0YXRlKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YS5nZW9uYW1lcykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuY2xfY2l0eW9wdGlvbnMgPSBwcm9taXNlLmRhdGEuZ2VvbmFtZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNsX2NvdW50eW9wdGlvbnMgPSBwcm9taXNlLmRhdGEuZ2VvbmFtZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vJHNjb3BlLnVwZGF0ZUZhaWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LCAwLCAxKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJHNjb3BlLmNsX3N0YXR1c29wdGlvbnMgPSBpMThuRmlsdGVyKFwiY2xpZW50LmZpZWxkcy5jbF9zdGF0dXNvcHRpb25zXCIpO1xuICAgICAgICAgICAgJHNjb3BlLmNsX3R5cGVvcHRpb25zID0gaTE4bkZpbHRlcihcImNsaWVudC5maWVsZHMuY2xfdHlwZW9wdGlvbnNcIik7XG5cbiAgICAgICAgICAgICRzY29wZS4kb24oJyR2aWV3Q29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAvLyB0aGlzIGNvZGUgaXMgZXhlY3V0ZWQgYWZ0ZXIgdGhlIHZpZXcgaXMgbG9hZGVkXG4gICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGNsaWVudFVwZGF0ZUZhYy5kYXRhKCkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YSkgJiYgcHJvbWlzZS5kYXRhLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmZtRGF0YSA9IHByb21pc2UuZGF0YVswXS5jbF9qc29uYjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBjbGllbnRVcGRhdGVGYWMuZ2V0Q291bnRyaWVzKCkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEuZ2VvbmFtZXMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNsX2NvdW50cnlvcHRpb25zID0gcHJvbWlzZS5kYXRhLmdlb25hbWVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyRzY29wZS51cGRhdGVGYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGllbnRVcGRhdGVGYWMuZ2V0U3RhdGVzKCRzY29wZS5mbURhdGEuY2xfY291bnRyeSkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhLmdlb25hbWVzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuY2xfc3RhdGVvcHRpb25zID0gcHJvbWlzZS5kYXRhLmdlb25hbWVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vJHNjb3BlLnVwZGF0ZUZhaWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xpZW50VXBkYXRlRmFjLmdldENpdHlDb3VudHkoJHNjb3BlLmZtRGF0YS5jbF9zdGF0ZSkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhLmdlb25hbWVzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuY2xfY2l0eW9wdGlvbnMgPSBwcm9taXNlLmRhdGEuZ2VvbmFtZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5jbF9jb3VudHlvcHRpb25zID0gcHJvbWlzZS5kYXRhLmdlb25hbWVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vJHNjb3BlLnVwZGF0ZUZhaWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfV07XG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgcmV0dXJuIFsnJGh0dHAnLCAnJHEnLCAgJyRzdGF0ZVBhcmFtcycsIGZ1bmN0aW9uICgkaHR0cCwgJHEsICRzdGF0ZVBhcmFtcykge1xuICAgICAgICB2YXIgZmFjdG9yeSA9IHt9O1xuICAgICAgICBmYWN0b3J5LmRhdGEgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KCcvYXBpL2NsaWVudC9jbF9pZCcsIHtcbiAgICAgICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgICAgICBjbF9pZDogJHN0YXRlUGFyYW1zLmNsX2lkXG4gICAgICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkudXBkYXRlID0gZnVuY3Rpb24gKGNsX2pzb25iKSB7XG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KCcvYXBpL2NsaWVudC91cGRhdGUnLCB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICAgICAgY2xfaWQ6ICRzdGF0ZVBhcmFtcy5jbF9pZCxcbiAgICAgICAgICAgICAgICAgICAgY2xfanNvbmI6IGNsX2pzb25iXG4gICAgICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkuZ2V0Q291bnRyaWVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHByb21pc2UgPSAkaHR0cC5qc29ucCgnaHR0cDovL2FwaS5nZW9uYW1lcy5vcmcvY291bnRyeUluZm9KU09OP3VzZXJuYW1lPWFsZWphbmRyb2xzY2EmY2FsbGJhY2s9SlNPTl9DQUxMQkFDSycpXG4gICAgICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICBmYWN0b3J5LmdldFN0YXRlcyA9IGZ1bmN0aW9uIChjbF9jb3VudHJ5KSB7XG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9ICRodHRwLmpzb25wKCdodHRwOi8vYXBpLmdlb25hbWVzLm9yZy9jaGlsZHJlbkpTT04/Z2VvbmFtZUlkPScgKyBjbF9jb3VudHJ5ICsgJyZ1c2VybmFtZT1hbGVqYW5kcm9sc2NhJmNhbGxiYWNrPUpTT05fQ0FMTEJBQ0snKVxuICAgICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeS5nZXRDaXR5Q291bnR5ID0gZnVuY3Rpb24gKGNsX3N0YXRlKSB7XG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9ICRodHRwLmpzb25wKCdodHRwOi8vYXBpLmdlb25hbWVzLm9yZy9jaGlsZHJlbkpTT04/Z2VvbmFtZUlkPScgKyBjbF9zdGF0ZSArICcmdXNlcm5hbWU9YWxlamFuZHJvbHNjYSZjYWxsYmFjaz1KU09OX0NBTExCQUNLJylcbiAgICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBmYWN0b3J5O1xuICAgIH1dO1xuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbihhbmd1bGFyKXtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgXG4gICAgcmV0dXJuIGFuZ3VsYXIubW9kdWxlKCdhcHAuY2xpZW50LnVwZGF0ZScsW10pXG5cbiAgICAuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJyxcbiAgICBmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdjbGllbnRVcGRhdGUnLCB7XG4gICAgICAgICAgICB1cmw6Jy9jbGllbnQvdXBkYXRlLzpjbF9pZCcsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybCA6ICdhcHAvY2xpZW50L21vZHVsZXMvY2xpZW50LnVwZGF0ZS9jbGllbnQudXBkYXRlLnZpZXcuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyIDogJ2NsaWVudFVwZGF0ZUN0cmwnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHJlcXVpcmVzTG9naW46IHRydWVcbiAgICAgICAgICAgIH0gICAgXG4gICAgICAgIH0pO1xuICAgIH1dKVxuXG4gICAgLmZhY3RvcnkoJ2NsaWVudFVwZGF0ZUZhYycscmVxdWlyZSgnLi9jbGllbnQudXBkYXRlLmZhYycpKVxuXG4gICAgLmNvbnRyb2xsZXIoJ2NsaWVudFVwZGF0ZUN0cmwnLHJlcXVpcmUoJy4vY2xpZW50LnVwZGF0ZS5jdHJsJykpXG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCIgOiBcImFjdHVhbGl6YXIgY2xpZW50ZVwiLFxuICAgICAgICAgICAgICAgIH0iLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRzY29wZScsICdob21lRmFjJywgJ2F1dGhTZXJ2aWNlJyxcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgaG9tZUZhYywgYXV0aFNlcnZpY2UpIHtcbiAgICAgICAgICAgICRzY29wZS5hdXRoU2VydmljZSA9IGF1dGhTZXJ2aWNlO1xuICAgICAgICB9XTtcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckaHR0cCcsICckcScsICBmdW5jdGlvbiAoJGh0dHAsICRxKSB7XG4gICAgICAgIHZhciBmYWN0b3J5ID0ge307XG4gICAgICAgIGZhY3RvcnkuZ2V0TG9naW4gPSBmdW5jdGlvbiAodXNlcikge1xuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoXG4gICAgICAgICAgICAgICAgJGh0dHAucG9zdCgnbW9kdWxlcy9ob21lL2hvbWVNb2RlbC5waHAnLCB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGZhY3Rvcnk7XG4gICAgfV07XG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKGFuZ3VsYXIpe1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBcbiAgICByZXR1cm4gYW5ndWxhci5tb2R1bGUoJ2FwcC5ob21lJyxbXSlcblxuICAgIC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLFxuICAgIGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcbiAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2hvbWUnLCB7XG4gICAgICAgICAgICB1cmw6Jy9ob21lJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsIDogJ2FwcC9ob21lL2hvbWUudmlldy5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXIgOiAnaG9tZUN0cmwnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHJlcXVpcmVzTG9naW46IHRydWVcbiAgICAgICAgICAgIH0gICAgXG4gICAgICAgIH0pO1xuICAgIH1dKVxuXG4gICAgLmZhY3RvcnkoJ2hvbWVGYWMnLHJlcXVpcmUoJy4vaG9tZS5mYWMnKSlcblxuICAgIC5jb250cm9sbGVyKCdob21lQ3RybCcscmVxdWlyZSgnLi9ob21lLmN0cmwnKSlcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIiA6IFwiaW5pY2lvXCIsXG4gICAgICAgICAgICAgICAgICAgIFwid2VsY29tZVwiIDogXCJiaWVudmVuaWRvIEBAIVwiXG4gICAgICAgICAgICAgICAgfSIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKGFuZ3VsYXIpe1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBcbiAgICByZXR1cm4gYW5ndWxhci5tb2R1bGUoJ2FwcC5pbmsnLFtcbiAgICAgICAgcmVxdWlyZSgnLi9tb2R1bGVzL2luay5hZGQnKS5uYW1lLFxuICAgICAgICByZXF1aXJlKCcuL21vZHVsZXMvaW5rLnVwZGF0ZScpLm5hbWVcbiAgICBdKVxuXG4gICAgLmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsXG4gICAgZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnaW5rJywge1xuICAgICAgICAgICAgdXJsOicvaW5rJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsIDogJ2FwcC9pbmsvaW5rLnZpZXcuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyIDogJ2lua0N0cmwnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHJlcXVpcmVzTG9naW46IHRydWVcbiAgICAgICAgICAgIH0gICAgXG4gICAgICAgIH0pO1xuICAgIH1dKVxuXG4gICAgLmZhY3RvcnkoJ2lua0ZhYycscmVxdWlyZSgnLi9pbmsuZmFjJykpXG5cbiAgICAuY29udHJvbGxlcignaW5rQ3RybCcscmVxdWlyZSgnLi9pbmsuY3RybCcpKVxuICAgIFxufSkoYW5ndWxhcik7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRzY29wZScsICdpbmtGYWMnLCAnaTE4bkZpbHRlcicsXG4gICAgICAgIGZ1bmN0aW9uICgkc2NvcGUsIGlua0ZhYywgaTE4bkZpbHRlcikge1xuXG4gICAgICAgICAgICAkc2NvcGUubGFiZWxzID0gT2JqZWN0LmtleXMoaTE4bkZpbHRlcihcImluay5sYWJlbHNcIikpO1xuICAgICAgICAgICAgJHNjb3BlLmNvbHVtbnMgPSBpMThuRmlsdGVyKFwiaW5rLmNvbHVtbnNcIik7XG4gICAgICAgIFxuICAgICAgICAgICAgLy8gZm9ybWF0SXRlbSBldmVudCBoYW5kbGVyXG4gICAgICAgICAgICB2YXIgaW5faWQ7XG4gICAgICAgICAgICAkc2NvcGUuZm9ybWF0SXRlbSA9IGZ1bmN0aW9uIChzLCBlLCBjZWxsKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoZS5wYW5lbC5jZWxsVHlwZSA9PSB3aWptby5ncmlkLkNlbGxUeXBlLlJvd0hlYWRlcikge1xuICAgICAgICAgICAgICAgICAgICBlLmNlbGwudGV4dENvbnRlbnQgPSBlLnJvdyArIDE7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcy5yb3dzLmRlZmF1bHRTaXplID0gMzA7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBhZGQgQm9vdHN0cmFwIGh0bWxcbiAgICAgICAgICAgICAgICBpZiAoKGUucGFuZWwuY2VsbFR5cGUgPT0gd2lqbW8uZ3JpZC5DZWxsVHlwZS5DZWxsKSAmJiAoZS5jb2wgPT0gMCkpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5faWQgPSBlLnBhbmVsLmdldENlbGxEYXRhKGUucm93LCAxLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGUuY2VsbC5zdHlsZS5vdmVyZmxvdyA9ICd2aXNpYmxlJztcbiAgICAgICAgICAgICAgICAgICAgZS5jZWxsLmlubmVySFRNTCA9ICc8ZGl2IGNsYXNzPVwiYnRuLWdyb3VwIGJ0bi1ncm91cC1qdXN0aWZpZWRcIiByb2xlPVwiZ3JvdXBcIiBhcmlhLWxhYmVsPVwiLi4uXCI+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYnRuLWdyb3VwXCIgcm9sZT1cImdyb3VwXCI+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cIiMvaW5rL3VwZGF0ZS8nKyBpbl9pZCArICdcIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdCBidG4teHNcIiBuZy1jbGljaz1cImVkaXQoJGl0ZW0uaW5faWQpXCI+RWRpdGFyPC9hPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2Pic7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgICAgIC8vIGJpbmQgY29sdW1ucyB3aGVuIGdyaWQgaXMgaW5pdGlhbGl6ZWRcbiAgICAgICAgICAgICRzY29wZS5pbml0R3JpZCA9IGZ1bmN0aW9uIChzLCBlKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAkc2NvcGUubGFiZWxzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjb2wgPSBuZXcgd2lqbW8uZ3JpZC5Db2x1bW4oKTtcbiAgICAgICAgICAgICAgICAgICAgY29sLmJpbmRpbmcgPSAkc2NvcGUuY29sdW1uc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgY29sLmhlYWRlciA9IGkxOG5GaWx0ZXIoXCJpbmsubGFiZWxzLlwiICsgJHNjb3BlLmxhYmVsc1tpXSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbC53b3JkV3JhcCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBjb2wud2lkdGggPSAxNTA7XG4gICAgICAgICAgICAgICAgICAgIHMuY29sdW1ucy5wdXNoKGNvbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIC8vIGNyZWF0ZSB0aGUgdG9vbHRpcCBvYmplY3RcbiAgICAgICAgICAgICRzY29wZS4kd2F0Y2goJ2dnR3JpZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoJHNjb3BlLmdnR3JpZCkge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgLy8gc3RvcmUgcmVmZXJlbmNlIHRvIGdyaWRcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZsZXggPSAkc2NvcGUuZ2dHcmlkO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNyZWF0ZSB0b29sdGlwXG4gICAgICAgICAgICAgICAgICAgIHZhciB0aXAgPSBuZXcgd2lqbW8uVG9vbHRpcCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgcm5nID0gbnVsbDtcblxuICAgICAgICAgICAgICAgICAgICAvLyBtb25pdG9yIHRoZSBtb3VzZSBvdmVyIHRoZSBncmlkXG4gICAgICAgICAgICAgICAgICAgIGZsZXguaG9zdEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGh0ID0gZmxleC5oaXRUZXN0KGV2dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWh0LnJhbmdlLmVxdWFscyhybmcpKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBuZXcgY2VsbCBzZWxlY3RlZCwgc2hvdyB0b29sdGlwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGh0LmNlbGxUeXBlID09IHdpam1vLmdyaWQuQ2VsbFR5cGUuQ2VsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBybmcgPSBodC5yYW5nZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvbCA9IGZsZXguY29sdW1uc1tybmcuY29sXS5oZWFkZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjZWxsRWxlbWVudCA9IGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQoZXZ0LmNsaWVudFgsIGV2dC5jbGllbnRZKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNlbGxCb3VuZHMgPSB3aWptby5SZWN0LmZyb21Cb3VuZGluZ1JlY3QoY2VsbEVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YSA9IHdpam1vLmVzY2FwZUh0bWwoZmxleC5nZXRDZWxsRGF0YShybmcucm93LCBybmcuY29sLCB0cnVlKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXBDb250ZW50ID0gY29sICsgJzogXCI8Yj4nICsgZGF0YSArICc8L2I+XCInO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2VsbEVsZW1lbnQuY2xhc3NOYW1lLmluZGV4T2YoJ3dqLWNlbGwnKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXAuc2hvdyhmbGV4Lmhvc3RFbGVtZW50LCB0aXBDb250ZW50LCBjZWxsQm91bmRzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpcC5oaWRlKCk7IC8vIGNlbGwgbXVzdCBiZSBiZWhpbmQgc2Nyb2xsIGJhci4uLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgZmxleC5ob3N0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpcC5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBybmcgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJHNjb3BlLiRvbignJHZpZXdDb250ZW50TG9hZGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIC8vIHRoaXMgY29kZSBpcyBleGVjdXRlZCBhZnRlciB0aGUgdmlldyBpcyBsb2FkZWRcbiAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgaW5rRmFjLmRhdGEoKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmRhdGEgPSBuZXcgd2lqbW8uY29sbGVjdGlvbnMuQ29sbGVjdGlvblZpZXcocHJvbWlzZS5kYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1dO1xuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRodHRwJywgJyRxJywgIGZ1bmN0aW9uICgkaHR0cCwgJHEpIHtcbiAgICAgICAgdmFyIGZhY3RvcnkgPSB7fTtcbiAgICAgICAgZmFjdG9yeS5kYXRhID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoXG4gICAgICAgICAgICAgICAgJGh0dHAucG9zdCgnbW9kdWxlcy9pbmsvaW5rLm1kbC5nZXRpbmtzLnBocCcsIHtcbiAgICAgICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgICAgICBwcm9jY2VzX2lkOiBuZXcgRGF0ZSgpLmdldE1pbGxpc2Vjb25kcygpXG4gICAgICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBmYWN0b3J5O1xuICAgIH1dO1xuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiIDogXCJUaW50YXNcIixcbiAgICAgICAgICAgICAgICAgICAgXCJsYWJlbHNcIjp7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImluLWlkXCI6IFwiSUQgdGludGFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3UtaWRcIjogXCJJRCBwcm92ZWVkb3JcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaW4tY29kZVwiOiBcIkNvZGlnb1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpbi10eXBlXCI6IFwiVGlwb1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpbi1kZXNjcmlwdGlvblwiOiBcIkRlc2NyaXBjaW9uXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImluLXByaWNlXCI6IFwiUHJlY2lvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImluLXN0YXR1c1wiOiBcIkVzdGF0dXNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaW4tZGF0ZVwiOiBcIkZlY2hhXCJcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgXCJjb2x1bW5zXCI6W1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJpbl9pZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdV9pZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpbl9jb2RlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImluX3R5cGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaW5fZGVzY3JpcHRpb25cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaW5fcHJpY2VcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaW5fc3RhdHVzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImluX2RhdGVcIlxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgXCJmaWVsZHNcIiA6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluX3R5cGVvcHRpb25zIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJPZmZzZXRcIixcInZhbHVlXCI6XCJvZmZzZXRcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkZsZXhvXCIsXCJ2YWx1ZVwiOlwiZmxleG9cIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIklua2pldCBzb2x2ZW50ZVwiLFwidmFsdWVcIjpcImlua2pldF9zb2x2ZW50XCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJJbmtqZXQgVVZcIixcInZhbHVlXCI6XCJpbmtqZXRfdXZcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIlNlcmlncmFmw61hXCIsXCJ2YWx1ZVwiOlwic2VyaWdyYXBoeVwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiVmluaWxcIixcInZhbHVlXCI6XCJ2aW55bFwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiVG9uZXJcIixcInZhbHVlXCI6XCJ0b25lclwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiU2VsbG9cIixcInZhbHVlXCI6XCJzZWFsXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJPdGhlclwiLFwidmFsdWVcIjpcIm90cm9zXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGluX3N0YXR1c29wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkFjdGl2b1wiLFwidmFsdWVcIjpcIkFcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkluYWN0aXZvXCIsXCJ2YWx1ZVwiOlwiSVwifVxuICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0iLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbihhbmd1bGFyKXtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgXG4gICAgcmV0dXJuIGFuZ3VsYXIubW9kdWxlKCdhcHAuaW5rLmFkZCcsW10pXG5cbiAgICAuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJyxcbiAgICBmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdpbmtBZGQnLCB7XG4gICAgICAgICAgICB1cmw6Jy9pbmsvYWRkJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsIDogJ2FwcC9pbmsvbW9kdWxlcy9pbmsuYWRkL2luay5hZGQudmlldy5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXIgOiAnaW5rQWRkQ3RybCcsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgcmVxdWlyZXNMb2dpbjogdHJ1ZVxuICAgICAgICAgICAgfSAgICBcbiAgICAgICAgfSk7XG4gICAgfV0pXG5cbiAgICAuZmFjdG9yeSgnaW5rQWRkRmFjJyxyZXF1aXJlKCcuL2luay5hZGQuZmFjJykpXG5cbiAgICAuY29udHJvbGxlcignaW5rQWRkQ3RybCcscmVxdWlyZSgnLi9pbmsuYWRkLmN0cmwnKSlcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckc2NvcGUnLCAnaW5rQWRkRmFjJywgJyRsb2NhdGlvbicsICdpMThuRmlsdGVyJyxcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgaW5rQWRkRmFjLCAkbG9jYXRpb24sIGkxOG5GaWx0ZXIpIHtcbiAgICAgICAgICAgICRzY29wZS5mbURhdGEgPSB7fTtcblxuICAgICAgICAgICAgJHNjb3BlLm9uU3VibWl0ID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgaW5rQWRkRmFjLmFkZCgkc2NvcGUuZm1EYXRhKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9taXNlLmRhdGEgPT0gXCIxXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvaW5rJyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICRzY29wZS5pbl9zdGF0dXNvcHRpb25zID0gaTE4bkZpbHRlcihcImluay5maWVsZHMuaW5fc3RhdHVzb3B0aW9uc1wiKTtcbiAgICAgICAgICAgICRzY29wZS5pbl90eXBlb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJpbmsuZmllbGRzLmluX3R5cGVvcHRpb25zXCIpO1xuXG4gICAgICAgICAgICAkc2NvcGUuJG9uKCckdmlld0NvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgLy8gdGhpcyBjb2RlIGlzIGV4ZWN1dGVkIGFmdGVyIHRoZSB2aWV3IGlzIGxvYWRlZFxuICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaW5rQWRkRmFjLmdldFN1cHBsaWVycygpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuc3VfaWRvcHRpb25zID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2gocHJvbWlzZS5kYXRhLCBmdW5jdGlvbiAodmFsdWUsIGtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHVzaCh7IFwibGFiZWxcIjogdmFsdWUuc3VfY29ycG9yYXRlbmFtZSwgXCJ2YWx1ZVwiOiB2YWx1ZS5zdV9pZCB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sICRzY29wZS5zdV9pZG9wdGlvbnMpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8kc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1dO1xuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRodHRwJywgJyRxJywgICckc3RhdGVQYXJhbXMnLCBmdW5jdGlvbiAoJGh0dHAsICRxLCAkc3RhdGVQYXJhbXMpIHtcbiAgICAgICAgdmFyIGZhY3RvcnkgPSB7fTtcbiAgICAgICAgZmFjdG9yeS5hZGQgPSBmdW5jdGlvbiAoaW5fanNvbmIpIHtcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gJGh0dHAucG9zdCgnbW9kdWxlcy9pbmsvbW9kdWxlcy9pbmsuYWRkL2luay5hZGQubWRsLmFkZC5waHAnLCB7XG4gICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgIGluX2pzb25iOiBpbl9qc29uYlxuICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeS5nZXRTdXBwbGllcnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9ICRodHRwLmdldCgnbW9kdWxlcy9pbmsvbW9kdWxlcy9pbmsuYWRkL2luay5hZGQubWRsLmdldFN1cHBsaWVycy5waHAnKVxuICAgICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGZhY3Rvcnk7XG4gICAgfV07XG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCIgOiBcImFncmVnYXIgdGludGFcIixcbiAgICAgICAgICAgICAgICB9IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oYW5ndWxhcil7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIFxuICAgIHJldHVybiBhbmd1bGFyLm1vZHVsZSgnYXBwLmluay51cGRhdGUnLFtdKVxuXG4gICAgLmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsXG4gICAgZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnaW5rVXBkYXRlJywge1xuICAgICAgICAgICAgdXJsOicvaW5rL3VwZGF0ZS86aW5faWQnLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmwgOiAnYXBwL2luay9tb2R1bGVzL2luay51cGRhdGUvaW5rLnVwZGF0ZS52aWV3Lmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlciA6ICdpbmtVcGRhdGVDdHJsJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICByZXF1aXJlc0xvZ2luOiB0cnVlXG4gICAgICAgICAgICB9ICAgIFxuICAgICAgICB9KTtcbiAgICB9XSlcblxuICAgIC5mYWN0b3J5KCdpbmtVcGRhdGVGYWMnLHJlcXVpcmUoJy4vaW5rLnVwZGF0ZS5mYWMnKSlcblxuICAgIC5jb250cm9sbGVyKCdpbmtVcGRhdGVDdHJsJyxyZXF1aXJlKCcuL2luay51cGRhdGUuY3RybCcpKVxuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRzY29wZScsICdpbmtVcGRhdGVGYWMnLCAnJGxvY2F0aW9uJywgJ2kxOG5GaWx0ZXInLFxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCBpbmtVcGRhdGVGYWMsICRsb2NhdGlvbiwgaTE4bkZpbHRlcikge1xuXG4gICAgICAgICAgICAkc2NvcGUub25TdWJtaXQgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICBpbmtVcGRhdGVGYWMudXBkYXRlKCRzY29wZS5mbURhdGEpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb21pc2UuZGF0YSA9PSBcIjFcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9pbmsnKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS51cGRhdGVGYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgJHNjb3BlLmluX3N0YXR1c29wdGlvbnMgPSBpMThuRmlsdGVyKFwiaW5rLmZpZWxkcy5pbl9zdGF0dXNvcHRpb25zXCIpO1xuICAgICAgICAgICAgJHNjb3BlLmluX3R5cGVvcHRpb25zID0gaTE4bkZpbHRlcihcImluay5maWVsZHMuaW5fdHlwZW9wdGlvbnNcIik7XG5cbiAgICAgICAgICAgICRzY29wZS4kb24oJyR2aWV3Q29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAvLyB0aGlzIGNvZGUgaXMgZXhlY3V0ZWQgYWZ0ZXIgdGhlIHZpZXcgaXMgbG9hZGVkXG4gICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGlua1VwZGF0ZUZhYy5kYXRhKCkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc09iamVjdChhbmd1bGFyLmZyb21Kc29uKHByb21pc2UuZGF0YSkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZm1EYXRhID0gYW5ndWxhci5mcm9tSnNvbihwcm9taXNlLmRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGlua1VwZGF0ZUZhYy5nZXRTdXBwbGllcnMoKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuc3VfaWRvcHRpb25zID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHByb21pc2UuZGF0YSwgZnVuY3Rpb24gKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wdXNoKHsgXCJsYWJlbFwiOiB2YWx1ZS5zdV9jb3Jwb3JhdGVuYW1lLCBcInZhbHVlXCI6IHZhbHVlLnN1X2lkIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sICRzY29wZS5zdV9pZG9wdGlvbnMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyRzY29wZS51cGRhdGVGYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XTtcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckaHR0cCcsICckcScsICAnJHN0YXRlUGFyYW1zJywgZnVuY3Rpb24gKCRodHRwLCAkcSwgJHN0YXRlUGFyYW1zKSB7XG4gICAgICAgIHZhciBmYWN0b3J5ID0ge307XG4gICAgICAgIGZhY3RvcnkuZGF0YSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKFxuICAgICAgICAgICAgICAgICRodHRwLnBvc3QoJ21vZHVsZXMvaW5rL21vZHVsZXMvaW5rLnVwZGF0ZS9pbmsudXBkYXRlLm1kbC5nZXRpbmsucGhwJywge1xuICAgICAgICAgICAgICAgICAgICAvKiBQT1NUIHZhcmlhYmxlcyBoZXJlICovXG4gICAgICAgICAgICAgICAgICAgIGluX2lkOiAkc3RhdGVQYXJhbXMuaW5faWRcbiAgICAgICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeS51cGRhdGUgPSBmdW5jdGlvbiAoaW5fanNvbmIpIHtcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKFxuICAgICAgICAgICAgICAgICRodHRwLnBvc3QoJ21vZHVsZXMvaW5rL21vZHVsZXMvaW5rLnVwZGF0ZS9pbmsudXBkYXRlLm1kbC51cGRhdGUucGhwJywge1xuICAgICAgICAgICAgICAgICAgICAvKiBQT1NUIHZhcmlhYmxlcyBoZXJlICovXG4gICAgICAgICAgICAgICAgICAgIGluX2lkOiAkc3RhdGVQYXJhbXMuaW5faWQsXG4gICAgICAgICAgICAgICAgICAgIGluX2pzb25iOiBpbl9qc29uYlxuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICBmYWN0b3J5LmdldFN1cHBsaWVycyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gJGh0dHAuZ2V0KCdtb2R1bGVzL2luay9tb2R1bGVzL2luay5hZGQvaW5rLmFkZC5tZGwuZ2V0U3VwcGxpZXJzLnBocCcpXG4gICAgICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZmFjdG9yeTtcbiAgICB9XTtcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIiA6IFwiYWN0dWFsaXphciB0aW50YVwiLFxuICAgICAgICAgICAgICAgIH0iLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRyb290U2NvcGUnLFxuICAgICAgICBmdW5jdGlvbiAoJHJvb3RTY29wZSkge1xuXG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGlucHV0LCBwYXJhbSkge1xuICAgICAgICAgICAgICAgIHZhciB0cmFuc2xhdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgICAgIFwiZXMtTVhcIjogcmVxdWlyZSgnLi9sYW5nLmxvY2FsZS5lcy1NWCcpLFxuICAgICAgICAgICAgICAgICAgICBcImVuLVVTXCI6IHJlcXVpcmUoJy4vbGFuZy5sb2NhbGUuZW4tVVMnKVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgdmFyIGN1cnJlbnRMYW5ndWFnZSA9ICRyb290U2NvcGUuY3VycmVudExhbmd1YWdlIHx8ICdlcy1NWCcsXG4gICAgICAgICAgICAgICAgICAgIGtleXMgPSBpbnB1dC5zcGxpdCgnLicpLFxuICAgICAgICAgICAgICAgICAgICBkYXRhID0gdHJhbnNsYXRpb25zW2N1cnJlbnRMYW5ndWFnZV0sXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBrZXlzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhID0gZGF0YVtrZXlzW2tleV1dO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICghIWRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAodHlwZW9mIHBhcmFtID09PSBcInVuZGVmaW5lZFwiKSA/IGRhdGEgOiBkYXRhLnJlcGxhY2UoJ0BAJywgcGFyYW0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGlucHV0O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUuZGVzY3JpcHRpb24pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaW5wdXQ7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG4gICAgICAgIH1dO1xufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgICAgICAgICAgICAgXCJHRU5FUkFMXCI6e1xuICAgICAgICAgICAgICAgICAgICBcIk5BVlwiOltcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcIm5hbWVcIjpcIkhvbWVcIixcInVybFwiOlwiIy9ob21lXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOlwiQ2xpZW50ZXNcIixcInVybFwiOlwiIy9jbGllbnRcIixcInN1Yk1lbnVcIjogXG4gICAgICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6IFwiQWdyZWdhclwiLFwidXJsXCI6IFwiIy9jbGllbnQvYWRkXCJ9XG4gICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcIm5hbWVcIjpcIlByb2R1Y3RzXCIsXCJ1cmxcIjpcIiMvcHJvZHVjdFwiLFwic3ViTWVudVwiOiBcbiAgICAgICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcIm5hbWVcIjogXCJBZGRcIixcInVybFwiOiBcIiMvcHJvZHVjdC9hZGRcIn1cbiAgICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOlwiV29yayBPcmRlcnNcIixcInVybFwiOlwiIy93b1wiLFwic3ViTWVudVwiOiBcbiAgICAgICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcIm5hbWVcIjogXCJBZGRcIixcInVybFwiOiBcIiMvd28vYWRkXCJ9XG4gICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcIm5hbWVcIjpcIlVzZXJzXCIsXCJ1cmxcIjpcIiMvdXNlclwiLFwic3ViTWVudVwiOiBcbiAgICAgICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcIm5hbWVcIjogXCJBZGRcIixcInVybFwiOiBcIiMvdXNlci9hZGRcIn1cbiAgICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOlwiTG9naW5cIixcInVybFwiOlwiIy9cIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6XCJSZXBvcnRzXCIsXCJ1cmxcIjpcIiMvcmVwb3J0c1wiLFwic3ViTWVudVwiOiBcbiAgICAgICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOiBcInN1YjFcIixcInVybFwiOiBcIi4uL2xvZ2luXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcIm5hbWVcIjogXCJzdWIyXCIsXCJ1cmxcIjogXCIuLi9sb2dpblwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6IFwic3ViM1wiLFwidXJsXCI6IFwiLi4vbG9naW5cIn1cbiAgICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgIFwiQlVUVE9OU1wiOntcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiRURJVFwiOlwiRWRpdFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJEVVBMSUNBVEVcIjpcIkR1cGxpY2F0ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJXT1wiOlwiV29yayBPcmRlclwiLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBcIlNVQk1JVFwiOlwiU3VibWl0XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiQ09QWVJJR0hUXCI6XCLCqTIwMTQgR3J1cG8gR3JhZmljbyBkZSBNw6l4aWNvIFMuQS4gZGUgQy5WLiBBbGwgcmlnaHRzIHJlc2VydmVkLlwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBcIkhPTUVcIjp7XG4gICAgICAgICAgICAgICAgICAgIFwiVElUTEVcIiA6IFwiSG9tZVwiLFxuICAgICAgICAgICAgICAgICAgICBcIldFTENPTUVcIiA6IFwiV2VsY29tZSBAQCFcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXCJDTElFTlRcIjp7XG4gICAgICAgICAgICAgICAgICAgIFwiVElUTEVcIiA6IFwiQ2xpZW50ZXNcIixcbiAgICAgICAgICAgICAgICAgICAgXCJGSUVMRFNcIjp7XG4gICAgICAgICAgICAgICAgICAgICAgICBcIkNMX0lEXCI6XCJDbGllbnQgSURcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiQ0xfQ09SUE9SQVRFTkFNRVwiOlwiQ29ycG9yYXRlIE5hbWVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiQ0xfVElOXCI6XCJUSU5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiQ0xfTkFNRVwiOlwiTmFtZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJDTF9GQVRIRVJTTEFTVE5BTUVcIjpcIkZhdGhlcnMgTGFzdG5hbWVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiQ0xfTU9USEVSU0xBU1ROQU1FXCI6XCJNb3RoZXJzIExhc3RuYW1lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkNMX1NUUkVFVFwiOlwiU3RyZWV0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkNMX1NUUkVFVE5VTUJFUlwiOlwiU3RyZWV0IE51bWJlclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJDTF9TVUlURU5VTUJFUlwiOlwiU3VpdGUgTnVtYmVyXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkNMX05FSUdIQk9SSE9PRFwiOlwiTmVpZ2hib3Job29kXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkNMX0FERFJFU1NSRUZFUkVOQ0VcIjpcIkFkZHJlc3MgUmVmZXJlbmNlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkNMX0NPVU5UUllcIjpcIkNvdW50cnlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiQ0xfU1RBVEVcIjpcIlN0YXRlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkNMX0NJVFlcIjpcIkNpdHlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiQ0xfQ09VTlRZXCI6XCJDb3VudHlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiQ0xfWklQQ09ERVwiOlwiWmlwIENvZGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiQ0xfRU1BSUxcIjpcIkUtbWFpbFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJDTF9QSE9ORVwiOlwiUGhvbmVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiQ0xfTU9CSUxFXCI6XCJNb2JpbGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiQ0xfQ1JFRElUTElNSVRcIjpcIkNyZWRpdCBMaW1pdFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJDTF9DVVNUT01FUkRJU0NPVU5UXCI6XCJEaXNjb3VudFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJDTF9TVEFUVVNcIjpcIlN0YXR1c1wiLFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBcIkNMSUVOVF9BRERcIjp7XG4gICAgICAgICAgICAgICAgICAgIFwiVElUTEVcIiA6IFwiQWRkIENsaWVudFwiLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXCJDTElFTlRfVVBEQVRFXCI6e1xuICAgICAgICAgICAgICAgICAgICBcIlRJVExFXCIgOiBcIlVwZGF0ZSBDbGllbnRcIixcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwiVVNFUlwiOntcbiAgICAgICAgICAgICAgICAgICAgXCJUSVRMRVwiIDogXCJVc2Vyc1wiLFxuICAgICAgICAgICAgICAgICAgICBcIkZJRUxEU1wiOntcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiVVNfSURcIjogXCJVc2VyIElEXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkdSX0lEXCI6IFwiR3JvdXAgSURcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiVVNfVVNFUlwiOiBcIlVzZXJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiVVNfUEFTU1dPUkRcIjogXCJQYXNzd29yZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJVU19OQU1FXCI6IFwiTmFtZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJVU19GQVRIRVJTTEFTVE5BTUVcIjogXCJGYXRoZXJzIExhc3RuYW1lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlVTX01PVEhFUlNMQVNUTkFNRVwiOiBcIk1vdGhlcnMgTGFzdG5hbWVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiVVNfRU1BSUxcIjogXCJFLW1haWxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiVVNfUEhPTkVcIjogXCJQaG9uZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJVU19NT0JJTEVcIjogXCJNb2JpbGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiVVNfU1RBVFVTXCI6IFwiU3RhdHVzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlVTX0RBVEVcIjogXCJEYXRlXCJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXCJVU0VSX0FERFwiOntcbiAgICAgICAgICAgICAgICAgICAgXCJUSVRMRVwiIDogXCJBZGQgVXNlclwiLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXCJVU0VSX1VQREFURVwiOntcbiAgICAgICAgICAgICAgICAgICAgXCJUSVRMRVwiIDogXCJVcGRhdGUgVXNlclwiLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXCJXT1wiOntcbiAgICAgICAgICAgICAgICAgICAgXCJUSVRMRVwiIDogXCJXb3JrIE9yZGVyc1wiLFxuICAgICAgICAgICAgICAgICAgICBcIkZJRUxEU1wiOntcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiV09fSURcIiA6IFwiT3JkZXIgTm8uXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIldPX0RBVEVcIiA6IFwiRGF0ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJDTF9JRFwiIDogXCJDbGllbnQgSURcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiWk9fSURcIiA6IFwiWm9uZSBJRFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJXT19PUkRFUkVEQllcIiA6IFwiT3JkZXJlZCBCeVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJXT19BVFRFTlRJT05cIiA6IFwiQXR0ZW50aW9uXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIldPX1JGUVwiIDogXCJSRlFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiV09fUFJPQ0VTU1wiIDogXCJQcm9jZXNzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIldPX1JFTEVBU0VcIiA6IFwiUmVsZWFzZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJXT19QT1wiIDogXCJQdXJjaGFzZSBPcmRlclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJXT19MSU5FXCIgOiBcIkxpbmVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiV09fTElORVRPVEFMXCIgOiBcIlRvdGFsIExpbmVzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlBSU0VfSURcIiA6IFwiUHJvZHVjdCBJRFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJXT19TVEFUVVNcIiA6IFwiU3RhdHVzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIldPX0NPTU1JVE1FTlREQVRFXCIgOiBcIkNvbW1pdG1lbnQgRGF0ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJXT19QUkVWSU9VU0lEXCIgOiBcIlByZXZpb3VzIElEXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIldPX1BSRVZJT1VTREFURVwiIDogXCJQcmV2aW91cyBEYXRlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlNIX0lEXCIgOiBcIlNoaXBtZW50IElEXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlNIX0RBVEVcIiA6IFwiU2hpcG1lbnQgRGF0ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJXT19UUkFDS0lOR05PXCIgOiBcIlRyYWNraW5nIE5vLlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJXT19TSElQUElOR0RBVEVcIiA6IFwiU2hpcHBpbmcgRGF0ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJXT19ERUxJVkVSWURBVEVcIiA6IFwiRGVsaXZlcnkgRGF0ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJXT19JTlZPSUNFTk9cIiA6IFwiSW52b2ljZSBOby5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiV09fSU5WT0lDRURBVEVcIiA6IFwiSW52b2ljZSBEYXRlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIldPX05PVEVTXCIgOiBcIk5vdGVzXCJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXCJXT19BRERcIjp7XG4gICAgICAgICAgICAgICAgICAgIFwiVElUTEVcIiA6IFwiQWRkIFdvcmsgT3JkZXJcIixcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwiV09fVVBEQVRFXCI6e1xuICAgICAgICAgICAgICAgICAgICBcIlRJVExFXCIgOiBcIlVwZGF0ZSBXb3JrIE9yZGVyXCIsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBcIkFVVEhcIjp7XG4gICAgICAgICAgICAgICAgICAgIFwiVElUTEVcIiA6IFwiTG9naW5cIixcbiAgICAgICAgICAgICAgICAgICAgXCJFTlRFUlBSSVNFXCIgOiBcIkVudGVycHJpc2VcIixcbiAgICAgICAgICAgICAgICAgICAgXCJVU0VSXCIgOiBcIlVzZXJcIixcbiAgICAgICAgICAgICAgICAgICAgXCJQQVNTV09SRFwiIDogXCJQYXNzd29yZFwiLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAgICAgICAgICAgICBcImdlbmVyYWxcIjp7IFxuICAgICAgICAgICAgICAgICAgICBcIm5hdlwiOltcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcIm5hbWVcIjpcImluaWNpb1wiLFwidXJsXCI6XCIjL2hvbWVcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6XCJjbGllbnRlc1wiLFwidXJsXCI6XCIjL2NsaWVudFwiLFwic3VibWVudVwiOiBcbiAgICAgICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcIm5hbWVcIjogXCJhZ3JlZ2FyXCIsXCJ1cmxcIjogXCIjL2NsaWVudC9hZGRcIn1cbiAgICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOlwicHJvZHVjdG9zXCIsXCJ1cmxcIjpcIiMvcHJvZHVjdFwiLFwic3VibWVudVwiOiBcbiAgICAgICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcIm5hbWVcIjogXCJhZ3JlZ2FyXCIsXCJ1cmxcIjogXCIjL3Byb2R1Y3QvYWRkXCJ9XG4gICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcIm5hbWVcIjpcIm9yZGVuZXMgZGUgdHJhYmFqb1wiLFwidXJsXCI6XCIjL3dvXCIsXCJzdWJtZW51XCI6IFxuICAgICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOiBcImFncmVnYXJcIixcInVybFwiOiBcIiMvd28vYWRkXCJ9XG4gICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcIm5hbWVcIjpcInVzdWFyaW9zXCIsXCJ1cmxcIjpcIiMvdXNlclwiLFwic3VibWVudVwiOiBcbiAgICAgICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcIm5hbWVcIjogXCJhZ3JlZ2FyXCIsXCJ1cmxcIjogXCIjL3VzZXIvYWRkXCJ9XG4gICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcIm5hbWVcIjpcImxvZ2luXCIsXCJ1cmxcIjpcIiMvXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOlwicmVwb3J0ZXNcIixcInVybFwiOlwiIy9yZXBvcnRzXCIsXCJzdWJtZW51XCI6IFxuICAgICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOiBcInN1YjFcIixcInVybFwiOiBcIi4uL2xvZ2luXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6IFwic3ViMlwiLFwidXJsXCI6IFwiLi4vbG9naW5cIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcIm5hbWVcIjogXCJzdWIzXCIsXCJ1cmxcIjogXCIuLi9sb2dpblwifVxuICAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgXCJsYWJlbHNcIjp7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImFkZFwiOlwiQWdyZWdhclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJlZGl0XCI6XCJlZGl0YXJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZHVwbGljYXRlXCI6XCJkdXBsaWNhclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzaG93XCI6XCJtb3N0cmFyXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN1Ym1pdFwiOlwiRW52aWFyXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsb3NlXCI6XCJDZXJyYXJcIixcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgXCJyZWdleHBcIjp7XG4gICAgICAgICAgICAgICAgICAgICAgICBcInNpbmdsZXNwYWNlc1wiOiBcInNpbiBlc3BhY2lvcyBkb2JsZXMgbmkgY2FyYWN0ZXJlcyBlc3BlY2lhbGVzLlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwYXBlcmNvZGVcIjogXCJzaW4gZXNwYWNpb3MgbmkgY2FyYWN0ZXJlcyBlc3BlY2lhbGVzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImlua2NvZGVcIjogXCJzaW4gZXNwYWNpb3MgbmkgY2FyYWN0ZXJlcyBlc3BlY2lhbGVzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm1hY2hpbmV0b3RhbGlua3NcIjogXCJtaW5pbW8gMSBtYXhpbW8gOFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJyZmNcIjogXCJYWFhYLSMjIyMjI1stWFhYXVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJlbWFpbFwiOiBcInBvciBmYXZvciBpbnRyb2R1emNhIHVuIGVtYWlsIHZhbGlkby5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZGVjaW1hbFwiOiBcIm51bWVybyB5IGRlIDIgYSA1IGRlY2ltYWxlcyAoIy4jI1sjIyNdKVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJkaXNjb3VudFwiOiBcImNlcm8gbWFzIDIgZGVjaW1hbGVzICgwLiMjKVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpbnRlZ2VyXCI6IFwic29sbyBudW1lcm9zIGVudGVyb3NcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiemlwY29kZVwiOiBcImVsIGNvZGlnbyBwb3N0YWwgZXMgZGUgNSBudW1lcm9zLlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJkYXRlXCI6IFwiYWFhYS1tbS1kZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ1c2VyXCI6IFwiZGUgNCBhIDE2IGNhcmFjdGVyZXMgc2luIGVzcGFjaW9zIG5pIGNhcmFjdGVyZXMgZXNwZWNpYWxlcy5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicGFzc3dvcmRcIjogXCJsYSBjb250cmFzZcOxYSBkZWJlIGNvbnRlbmVyIGRlIDgtMTYgY2FyYWN0ZXJlcywgcG9yIGxvIG1lbm9zIHVuYSBsZXRyYSBtYXl1c2N1bGEsIHVuYSBsZXRyYSBtaW51c2N1bGEgeSB1biBkaWdpdG8uXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInBob25lXCI6IFwic29sbyB1c2UgZWwgc2ltYm9sbyArIGFsIHByaW5jaXBpbyB5IG51bWVyb3MgZGVsIDAgYWwgOVwiXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIFwiY29weXJpZ2h0XCI6XCLCqTIwMTQgZ3J1cG8gZ3JhZmljbyBkZSBtw6l4aWNvIHMuYS4gZGUgYy52LiB0b2RvcyBsb3MgZGVyZWNob3MgcmVzZXJ2YWRvcy5cIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICBIT01FIFxuICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4gICAgICAgICAgICAgICAgXCJob21lXCI6cmVxdWlyZSgnLi9ob21lL2xhbmcuZXMtTVgnKSxcbiAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgIENMSUVOVCBcbiAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuICAgICAgICAgICAgICAgIFwiY2xpZW50XCI6IHJlcXVpcmUoJy4vY2xpZW50L2xhbmcuZXMtTVgnKSxcbiAgICAgICAgICAgICAgICBcImNsaWVudC1jdXN0b21cIjogcmVxdWlyZSgnLi9jbGllbnQvbGFuZy5jdXN0b20uZXMtTVgnKSxcbiAgICAgICAgICAgICAgICBcImNsaWVudC1hZGRcIjogcmVxdWlyZSgnLi9jbGllbnQvbW9kdWxlcy9jbGllbnQuYWRkL2xhbmcuZXMtTVgnKSxcbiAgICAgICAgICAgICAgICBcImNsaWVudC11cGRhdGVcIjogcmVxdWlyZSgnLi9jbGllbnQvbW9kdWxlcy9jbGllbnQudXBkYXRlL2xhbmcuZXMtTVgnKSxcbiAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgIFBST0RVQ1QgXG4gICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbiAgICAgICAgICAgICAgICBcInByb2R1Y3RcIjogcmVxdWlyZSgnLi9wcm9kdWN0L2xhbmcuZXMtTVgnKSxcbiAgICAgICAgICAgICAgICBcInByb2R1Y3RPZmZzZXRHZW5lcmFsLWFkZFwiOiByZXF1aXJlKCcuL3Byb2R1Y3QvbW9kdWxlcy9wcm9kdWN0T2Zmc2V0R2VuZXJhbC5hZGQvbGFuZy5lcy1NWCcpLFxuICAgICAgICAgICAgICAgIFwicHJvZHVjdE9mZnNldEdlbmVyYWwtdXBkYXRlXCI6IHJlcXVpcmUoJy4vcHJvZHVjdC9tb2R1bGVzL3Byb2R1Y3RPZmZzZXRHZW5lcmFsLnVwZGF0ZS9sYW5nLmVzLU1YJyksXG4gICAgICAgICAgICAgICAgXCJwcm9kdWN0T2Zmc2V0UGFnaW5hdGVkLWFkZFwiOiByZXF1aXJlKCcuL3Byb2R1Y3QvbW9kdWxlcy9wcm9kdWN0T2Zmc2V0UGFnaW5hdGVkLmFkZC9sYW5nLmVzLU1YJyksXG4gICAgICAgICAgICAgICAgXCJwcm9kdWN0T2Zmc2V0UGFnaW5hdGVkLXVwZGF0ZVwiOntcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiIDogXCJhY3R1YWxpemFyIHByb2R1Y3RvXCIsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgIFNVUFBMSUVSIFxuICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4gICAgICAgICAgICAgICAgXCJzdXBwbGllclwiOiByZXF1aXJlKCcuL3N1cHBsaWVyL2xhbmcuZXMtTVgnKSxcbiAgICAgICAgICAgICAgICBcInN1cHBsaWVyLWFkZFwiOiByZXF1aXJlKCcuL3N1cHBsaWVyL21vZHVsZXMvc3VwcGxpZXIuYWRkL2xhbmcuZXMtTVgnKSxcbiAgICAgICAgICAgICAgICBcInN1cHBsaWVyLXVwZGF0ZVwiOiByZXF1aXJlKCcuL3N1cHBsaWVyL21vZHVsZXMvc3VwcGxpZXIudXBkYXRlL2xhbmcuZXMtTVgnKSxcbiAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgIFBBUEVSIFxuICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4gICAgICAgICAgICAgICAgXCJwYXBlclwiOiByZXF1aXJlKCcuL3BhcGVyL2xhbmcuZXMtTVgnKSxcbiAgICAgICAgICAgICAgICBcInBhcGVyLWFkZFwiOiByZXF1aXJlKCcuL3BhcGVyL21vZHVsZXMvcGFwZXIuYWRkL2xhbmcuZXMtTVgnKSxcbiAgICAgICAgICAgICAgICBcInBhcGVyLXVwZGF0ZVwiOiByZXF1aXJlKCcuL3BhcGVyL21vZHVsZXMvcGFwZXIudXBkYXRlL2xhbmcuZXMtTVgnKSxcbiAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgIE1BQ0hJTkUgXG4gICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbiAgICAgICAgICAgICAgICBcIm1hY2hpbmVcIjogcmVxdWlyZSgnLi9tYWNoaW5lL2xhbmcuZXMtTVgnKSxcbiAgICAgICAgICAgICAgICBcIm1hY2hpbmUtYWRkXCI6IHJlcXVpcmUoJy4vbWFjaGluZS9tb2R1bGVzL21hY2hpbmUuYWRkL2xhbmcuZXMtTVgnKSxcbiAgICAgICAgICAgICAgICBcIm1hY2hpbmUtdXBkYXRlXCI6IHJlcXVpcmUoJy4vbWFjaGluZS9tb2R1bGVzL21hY2hpbmUudXBkYXRlL2xhbmcuZXMtTVgnKSxcbiAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgIE1BQ0hJTkUgXG4gICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbiAgICAgICAgICAgICAgICBcImlua1wiOiByZXF1aXJlKCcuL2luay9sYW5nLmVzLU1YJyksXG4gICAgICAgICAgICAgICAgXCJpbmstYWRkXCI6IHJlcXVpcmUoJy4vaW5rL21vZHVsZXMvaW5rLmFkZC9sYW5nLmVzLU1YJyksXG4gICAgICAgICAgICAgICAgXCJpbmstdXBkYXRlXCI6IHJlcXVpcmUoJy4vaW5rL21vZHVsZXMvaW5rLnVwZGF0ZS9sYW5nLmVzLU1YJyksXG4gICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICBVU0VSIFxuICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4gICAgICAgICAgICAgICAgXCJ1c2VyXCI6IHJlcXVpcmUoJy4vdXNlci9sYW5nLmVzLU1YJyksXG4gICAgICAgICAgICAgICAgXCJ1c2VyLWFkZFwiOiByZXF1aXJlKCcuL3VzZXIvbW9kdWxlcy91c2VyLmFkZC9sYW5nLmVzLU1YJyksXG4gICAgICAgICAgICAgICAgXCJ1c2VyLXVwZGF0ZVwiOiByZXF1aXJlKCcuL3VzZXIvbW9kdWxlcy91c2VyLnVwZGF0ZS9sYW5nLmVzLU1YJyksXG4gICAgICAgICAgICAgICAgXCJ1c2VyLXByb2ZpbGVcIjogcmVxdWlyZSgnLi91c2VyL21vZHVsZXMvdXNlci5wcm9maWxlL2xhbmcuZXMtTVgnKSxcbiAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgIFdPUksgT1JERVIgXG4gICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbiAgICAgICAgICAgICAgICBcIndvXCI6IHJlcXVpcmUoJy4vd28vbGFuZy5lcy1NWCcpLFxuICAgICAgICAgICAgICAgIFwid28tYWRkXCI6IHJlcXVpcmUoJy4vd28vbW9kdWxlcy93by5hZGQvbGFuZy5lcy1NWCcpLFxuICAgICAgICAgICAgICAgIFwid28tdXBkYXRlXCI6IHJlcXVpcmUoJy4vd28vbW9kdWxlcy93by51cGRhdGUvbGFuZy5lcy1NWCcpLFxuICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgQVVUSCBcbiAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuICAgICAgICAgICAgICAgIFwiYXV0aFwiOiByZXF1aXJlKCcuL2F1dGgvbGFuZy5lcy1NWCcpLFxuICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgWk9ORSBcbiAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuICAgICAgICAgICAgICAgIFwiem9uZVwiOiByZXF1aXJlKCcuL3pvbmUvbGFuZy5lcy1NWCcpLFxuICAgICAgICAgICAgICAgIFwiem9uZS1hZGRcIjogcmVxdWlyZSgnLi96b25lL21vZHVsZXMvem9uZS5hZGQvbGFuZy5lcy1NWCcpLFxuICAgICAgICAgICAgICAgIFwiem9uZS11cGRhdGVcIjogcmVxdWlyZSgnLi96b25lL21vZHVsZXMvem9uZS51cGRhdGUvbGFuZy5lcy1NWCcpLFxuICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgU1RBVFVTIFxuICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4gICAgICAgICAgICAgICAgXCJ3b3JrZmxvd1wiOiByZXF1aXJlKCcuL3dvcmtmbG93L2xhbmcuZXMtTVgnKSxcbiAgICAgICAgICAgIH0iLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBhbmd1bGFyLm1vZHVsZSgnYXBwLmxvZ2luJywgW10pXG5cbiAgICAgICAgLmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsXG4gICAgICAgICAgICBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuICAgICAgICAgICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdsb2dpbicsIHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnL2xvZ2luJyxcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvbG9naW4vbG9naW4udmlldy5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ2xvZ2luQ3RybCcsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVpcmVzTG9naW46IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1dKVxuXG4gICAgICAgIC5jb250cm9sbGVyKCdsb2dpbkN0cmwnLCByZXF1aXJlKCcuL2xvZ2luLmN0cmwnKSlcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckc2NvcGUnLCAnJGh0dHAnLCAnYXV0aFNlcnZpY2UnLCAnJGxvY2F0aW9uJyxcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgJGh0dHAsIGF1dGhTZXJ2aWNlLCAkbG9jYXRpb24pIHtcbiAgICAgICAgICAgIGF1dGhTZXJ2aWNlLmxvZ2luKCk7XG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgdmFyIHRva2VuID0gc3RvcmUuZ2V0KCd0b2tlbicpO1xuICAgICAgICAgICAgaWYgKHRva2VuKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFqd3RIZWxwZXIuaXNUb2tlbkV4cGlyZWQodG9rZW4pKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghYXV0aC5pc0F1dGhlbnRpY2F0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF1dGguYXV0aGVudGljYXRlKHN0b3JlLmdldCgncHJvZmlsZScpLCB0b2tlbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2hvbWUnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2hvbWUnKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBFaXRoZXIgc2hvdyB0aGUgbG9naW4gcGFnZSBvciB1c2UgdGhlIHJlZnJlc2ggdG9rZW4gdG8gZ2V0IGEgbmV3IGlkVG9rZW5cbiAgICAgICAgICAgICAgICAgICAgYXV0aC5zaWduaW4oe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGljdDogJ2VzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGljb246ICdpbWcvZ2dhdXRoLWxvZ28ucG5nJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJuYW1lOiAkc2NvcGUudXNlcm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXNzd29yZDogJHNjb3BlLnBhc3N3b3JkLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29ubmVjdGlvbjogJ1VzZXJuYW1lLVBhc3N3b3JkLUF1dGhlbnRpY2F0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbWVtYmVyTGFzdExvZ2luOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsb3NhYmxlOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAocHJvZmlsZSwgdG9rZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFN1Y2Nlc3MgY2FsbGJhY2tcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0b3JlLnNldCgncHJvZmlsZScsIHByb2ZpbGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RvcmUuc2V0KCd0b2tlbicsIHRva2VuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvaG9tZScpO1xuICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRXJyb3IgY2FsbGJhY2tcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBhdXRoLnNpZ25pbih7XG4gICAgICAgICAgICAgICAgICAgIGRpY3Q6ICdlcycsXG4gICAgICAgICAgICAgICAgICAgIGljb246ICdpbWcvZ2dhdXRoLWxvZ28ucG5nJyxcbiAgICAgICAgICAgICAgICAgICAgdXNlcm5hbWU6ICRzY29wZS51c2VybmFtZSxcbiAgICAgICAgICAgICAgICAgICAgcGFzc3dvcmQ6ICRzY29wZS5wYXNzd29yZCxcbiAgICAgICAgICAgICAgICAgICAgY29ubmVjdGlvbjogJ1VzZXJuYW1lLVBhc3N3b3JkLUF1dGhlbnRpY2F0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgcmVtZW1iZXJMYXN0TG9naW46IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBjbG9zYWJsZTogZmFsc2VcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAocHJvZmlsZSwgdG9rZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gU3VjY2VzcyBjYWxsYmFja1xuICAgICAgICAgICAgICAgICAgICBzdG9yZS5zZXQoJ3Byb2ZpbGUnLCBwcm9maWxlKTtcbiAgICAgICAgICAgICAgICAgICAgc3RvcmUuc2V0KCd0b2tlbicsIHRva2VuKTtcbiAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9ob21lJyk7XG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKVxuICAgICAgICAgICAgICAgICAgICAvLyBFcnJvciBjYWxsYmFja1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSovXG5cbiAgICAgICAgfV1cblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oYW5ndWxhcil7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIFxuICAgIHJldHVybiBhbmd1bGFyLm1vZHVsZSgnYXBwLm1hY2hpbmUnLFtcbiAgICAgICAgcmVxdWlyZSgnLi9tb2R1bGVzL21hY2hpbmUuYWRkJykubmFtZSxcbiAgICAgICAgcmVxdWlyZSgnLi9tb2R1bGVzL21hY2hpbmUudXBkYXRlJykubmFtZVxuICAgIF0pXG5cbiAgICAuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJyxcbiAgICBmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdtYWNoaW5lJywge1xuICAgICAgICAgICAgdXJsOicvbWFjaGluZScsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybCA6ICdhcHAvbWFjaGluZS9tYWNoaW5lLnZpZXcuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyIDogJ21hY2hpbmVDdHJsJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICByZXF1aXJlc0xvZ2luOiB0cnVlXG4gICAgICAgICAgICB9ICAgIFxuICAgICAgICB9KTtcbiAgICB9XSlcblxuICAgIC5mYWN0b3J5KCdtYWNoaW5lRmFjJyxyZXF1aXJlKCcuL21hY2hpbmUuZmFjJykpXG5cbiAgICAuY29udHJvbGxlcignbWFjaGluZUN0cmwnLHJlcXVpcmUoJy4vbWFjaGluZS5jdHJsJykpXG4gICAgXG59KShhbmd1bGFyKTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCIgOiBcIm1hcXVpbmFzXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibGFiZWxzXCI6e1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJtYS1pZFwiOlwiSUQgTWFxdWluYVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJtYS1uYW1lXCI6XCJNYXF1aW5hXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm1hLW1heHNpemV3aWR0aFwiOlwiVGFtYcOxbyBtYXguIGFuY2hvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm1hLW1heHNpemVoZWlnaHRcIjpcIlRhbWHDsW8gbWF4LiBhbHR1cmFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibWEtbWluc2l6ZXdpZHRoXCI6XCJUYW1hw7FvIG1pbi4gYW5jaG9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibWEtbWluc2l6ZWhlaWdodFwiOlwiVGFtYcOxbyBtYXguIGFsdHVyYVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJtYS1zaXplbWVhc3VyZVwiOlwiTWVkaWRhXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm1hLXRvdGFsaW5rc1wiOlwiVGludGFzIHRvdGFsZXNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibWEtZnVsbGNvbG9yXCI6XCJGdWxsIGNvbG9yXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm1hLXByaW50YmdcIjpcIkltcHJpbWUgZm9uZG9zXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm1hLXByb2Nlc3NcIjpcIlByb2Nlc29cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibWEtc3RhdHVzXCI6XCJFc3RhdHVzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm1hLWRhdGVcIjpcIkZlY2hhXCIsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICBcImNvbHVtbnNcIjpbXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm1hX2lkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm1hX25hbWVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibWFfbWF4c2l6ZXdpZHRoXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm1hX21heHNpemVoZWlnaHRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibWFfbWluc2l6ZXdpZHRoXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm1hX21pbnNpemVoZWlnaHRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibWFfc2l6ZW1lYXN1cmVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibWFfdG90YWxpbmtzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm1hX2Z1bGxjb2xvclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJtYV9wcmludGJnXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm1hX3Byb2Nlc3NcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibWFfc3RhdHVzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm1hX2RhdGVcIixcbiAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICBcImZpZWxkc1wiIDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWFfc2l6ZW1lYXN1cmVvcHRpb25zIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJjbVwiLFwidmFsdWVcIjpcImNtXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJwdWxnYWRhc1wiLFwidmFsdWVcIjpcImluXCJ9XG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWFfZnVsbGNvbG9yb3B0aW9ucyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiU2lcIixcInZhbHVlXCI6XCJ5ZXNcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIk5vXCIsXCJ2YWx1ZVwiOlwibm9cIn1cbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBtYV9wcmludGJnb3B0aW9ucyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiU2lcIixcInZhbHVlXCI6XCJ5ZXNcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIk5vXCIsXCJ2YWx1ZVwiOlwibm9cIn1cbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBtYV9wcm9jZXNzb3B0aW9ucyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiT2Zmc2V0XCIsXCJ2YWx1ZVwiOlwib2Zmc2V0XCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJGbGV4b1wiLFwidmFsdWVcIjpcImZsZXhvXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJQbMOzdGVyXCIsXCJ2YWx1ZVwiOlwicGxvdHRlclwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiU2VsbG9zXCIsXCJ2YWx1ZVwiOlwic2VhbHNcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIlNlcmlncmFmw61hXCIsXCJ2YWx1ZVwiOlwic2VyaWdyYXBoeVwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiTGFzZXJcIixcInZhbHVlXCI6XCJsYXNlclwifVxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hX3N0YXR1c29wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkFjdGl2b1wiLFwidmFsdWVcIjpcIkFcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkluYWN0aXZvXCIsXCJ2YWx1ZVwiOlwiSVwifVxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcblxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgcmV0dXJuIFsnJHNjb3BlJywgJ21hY2hpbmVGYWMnLCAnaTE4bkZpbHRlcicsXG4gICAgICAgIGZ1bmN0aW9uICgkc2NvcGUsIG1hY2hpbmVGYWMsIGkxOG5GaWx0ZXIpIHtcblxuICAgICAgICAgICAgJHNjb3BlLmxhYmVscyA9IE9iamVjdC5rZXlzKGkxOG5GaWx0ZXIoXCJtYWNoaW5lLmxhYmVsc1wiKSk7XG4gICAgICAgICAgICAkc2NvcGUuY29sdW1ucyA9IGkxOG5GaWx0ZXIoXCJtYWNoaW5lLmNvbHVtbnNcIik7XG4gICAgICAgIFxuICAgICAgICAgICAgLy8gZm9ybWF0SXRlbSBldmVudCBoYW5kbGVyXG4gICAgICAgICAgICB2YXIgbWFfaWQ7XG4gICAgICAgICAgICAkc2NvcGUuZm9ybWF0SXRlbSA9IGZ1bmN0aW9uIChzLCBlLCBjZWxsKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoZS5wYW5lbC5jZWxsVHlwZSA9PSB3aWptby5ncmlkLkNlbGxUeXBlLlJvd0hlYWRlcikge1xuICAgICAgICAgICAgICAgICAgICBlLmNlbGwudGV4dENvbnRlbnQgPSBlLnJvdyArIDE7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcy5yb3dzLmRlZmF1bHRTaXplID0gMzA7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBhZGQgQm9vdHN0cmFwIGh0bWxcbiAgICAgICAgICAgICAgICBpZiAoKGUucGFuZWwuY2VsbFR5cGUgPT0gd2lqbW8uZ3JpZC5DZWxsVHlwZS5DZWxsKSAmJiAoZS5jb2wgPT0gMCkpIHtcbiAgICAgICAgICAgICAgICAgICAgbWFfaWQgPSBlLnBhbmVsLmdldENlbGxEYXRhKGUucm93LCAxLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGUuY2VsbC5zdHlsZS5vdmVyZmxvdyA9ICd2aXNpYmxlJztcbiAgICAgICAgICAgICAgICAgICAgZS5jZWxsLmlubmVySFRNTCA9ICc8ZGl2IGNsYXNzPVwiYnRuLWdyb3VwIGJ0bi1ncm91cC1qdXN0aWZpZWRcIiByb2xlPVwiZ3JvdXBcIiBhcmlhLWxhYmVsPVwiLi4uXCI+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYnRuLWdyb3VwXCIgcm9sZT1cImdyb3VwXCI+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cIiMvbWFjaGluZS91cGRhdGUvJysgbWFfaWQgKyAnXCIgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHQgYnRuLXhzXCIgbmctY2xpY2s9XCJlZGl0KCRpdGVtLm1hX2lkKVwiPkVkaXRhcjwvYT5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj4nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgICAgICAvLyBiaW5kIGNvbHVtbnMgd2hlbiBncmlkIGlzIGluaXRpYWxpemVkXG4gICAgICAgICAgICAkc2NvcGUuaW5pdEdyaWQgPSBmdW5jdGlvbiAocywgZSkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgJHNjb3BlLmxhYmVscy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgY29sID0gbmV3IHdpam1vLmdyaWQuQ29sdW1uKCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbC5iaW5kaW5nID0gJHNjb3BlLmNvbHVtbnNbaV07XG4gICAgICAgICAgICAgICAgICAgIGNvbC5oZWFkZXIgPSBpMThuRmlsdGVyKFwibWFjaGluZS5sYWJlbHMuXCIgKyAkc2NvcGUubGFiZWxzW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgY29sLndvcmRXcmFwID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGNvbC53aWR0aCA9IDE1MDtcbiAgICAgICAgICAgICAgICAgICAgcy5jb2x1bW5zLnB1c2goY29sKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgLy8gY3JlYXRlIHRoZSB0b29sdGlwIG9iamVjdFxuICAgICAgICAgICAgJHNjb3BlLiR3YXRjaCgnZ2dHcmlkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICgkc2NvcGUuZ2dHcmlkKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAvLyBzdG9yZSByZWZlcmVuY2UgdG8gZ3JpZFxuICAgICAgICAgICAgICAgICAgICB2YXIgZmxleCA9ICRzY29wZS5nZ0dyaWQ7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY3JlYXRlIHRvb2x0aXBcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRpcCA9IG5ldyB3aWptby5Ub29sdGlwKCksXG4gICAgICAgICAgICAgICAgICAgICAgICBybmcgPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIG1vbml0b3IgdGhlIG1vdXNlIG92ZXIgdGhlIGdyaWRcbiAgICAgICAgICAgICAgICAgICAgZmxleC5ob3N0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaHQgPSBmbGV4LmhpdFRlc3QoZXZ0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaHQucmFuZ2UuZXF1YWxzKHJuZykpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG5ldyBjZWxsIHNlbGVjdGVkLCBzaG93IHRvb2x0aXBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaHQuY2VsbFR5cGUgPT0gd2lqbW8uZ3JpZC5DZWxsVHlwZS5DZWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJuZyA9IGh0LnJhbmdlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29sID0gZmxleC5jb2x1bW5zW3JuZy5jb2xdLmhlYWRlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNlbGxFbGVtZW50ID0gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludChldnQuY2xpZW50WCwgZXZ0LmNsaWVudFkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2VsbEJvdW5kcyA9IHdpam1vLlJlY3QuZnJvbUJvdW5kaW5nUmVjdChjZWxsRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhID0gd2lqbW8uZXNjYXBlSHRtbChmbGV4LmdldENlbGxEYXRhKHJuZy5yb3csIHJuZy5jb2wsIHRydWUpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpcENvbnRlbnQgPSBjb2wgKyAnOiBcIjxiPicgKyBkYXRhICsgJzwvYj5cIic7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjZWxsRWxlbWVudC5jbGFzc05hbWUuaW5kZXhPZignd2otY2VsbCcpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpcC5zaG93KGZsZXguaG9zdEVsZW1lbnQsIHRpcENvbnRlbnQsIGNlbGxCb3VuZHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlwLmhpZGUoKTsgLy8gY2VsbCBtdXN0IGJlIGJlaGluZCBzY3JvbGwgYmFyLi4uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBmbGV4Lmhvc3RFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3V0JywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGlwLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJuZyA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkc2NvcGUuJG9uKCckdmlld0NvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgLy8gdGhpcyBjb2RlIGlzIGV4ZWN1dGVkIGFmdGVyIHRoZSB2aWV3IGlzIGxvYWRlZFxuICAgICAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBtYWNoaW5lRmFjLmRhdGEoKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmRhdGEgPSBuZXcgd2lqbW8uY29sbGVjdGlvbnMuQ29sbGVjdGlvblZpZXcocHJvbWlzZS5kYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1dO1xuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRodHRwJywgJyRxJywgXG4gICAgICAgIGZ1bmN0aW9uICgkaHR0cCwgJHEpIHtcbiAgICAgICAgICAgIHZhciBmYWN0b3J5ID0ge307XG4gICAgICAgICAgICBmYWN0b3J5LmRhdGEgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKFxuICAgICAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KCdtb2R1bGVzL21hY2hpbmUvbWFjaGluZS5tZGwuZ2V0bWFjaGluZXMucGhwJywge1xuICAgICAgICAgICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvY2Nlc19pZDogbmV3IERhdGUoKS5nZXRNaWxsaXNlY29uZHMoKVxuICAgICAgICAgICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmV0dXJuIGZhY3Rvcnk7XG4gICAgICAgIH1dO1xuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbihhbmd1bGFyKXtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgXG4gICAgcmV0dXJuIGFuZ3VsYXIubW9kdWxlKCdhcHAubWFjaGluZS5hZGQnLFtdKVxuXG4gICAgLmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsXG4gICAgZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnbWFjaGluZUFkZCcsIHtcbiAgICAgICAgICAgIHVybDonL21hY2hpbmUvYWRkJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsIDogJ2FwcC9tYWNoaW5lL21vZHVsZXMvbWFjaGluZS5hZGQvbWFjaGluZS5hZGQudmlldy5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXIgOiAnbWFjaGluZUFkZEN0cmwnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHJlcXVpcmVzTG9naW46IHRydWVcbiAgICAgICAgICAgIH0gICAgXG4gICAgICAgIH0pO1xuICAgIH1dKVxuXG4gICAgLmZhY3RvcnkoJ21hY2hpbmVBZGRGYWMnLHJlcXVpcmUoJy4vbWFjaGluZS5hZGQuZmFjJykpXG5cbiAgICAuY29udHJvbGxlcignbWFjaGluZUFkZEN0cmwnLHJlcXVpcmUoJy4vbWFjaGluZS5hZGQuY3RybCcpKVxuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiIDogXCJhZ3JlZ2FyIG1hcXVpbmFcIixcbiAgICAgICAgICAgICAgICB9IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oYW5ndWxhcil7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIFxuICAgIHJldHVybiBbJyRzY29wZScsICdtYWNoaW5lQWRkRmFjJywgJyRsb2NhdGlvbicsICdpMThuRmlsdGVyJyxcbiAgICBmdW5jdGlvbiAoJHNjb3BlLCBtYWNoaW5lQWRkRmFjLCAkbG9jYXRpb24sIGkxOG5GaWx0ZXIpIHtcbiAgICAgICAgJHNjb3BlLmZtRGF0YSA9IHt9O1xuXG4gICAgICAgICRzY29wZS5vblN1Ym1pdCA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICBtYWNoaW5lQWRkRmFjLmFkZCgkc2NvcGUuZm1EYXRhKS50aGVuKGZ1bmN0aW9uKHByb21pc2Upe1xuICAgICAgICAgICAgICAgIGlmKHByb21pc2UuZGF0YSA9PSBcIjFcIikge1xuICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL21hY2hpbmUnKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLm1hX3NpemVtZWFzdXJlb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJtYWNoaW5lLmZpZWxkcy5tYV9zaXplbWVhc3VyZW9wdGlvbnNcIik7XG4gICAgICAgICRzY29wZS5tYV9mdWxsY29sb3JvcHRpb25zID0gaTE4bkZpbHRlcihcIm1hY2hpbmUuZmllbGRzLm1hX2Z1bGxjb2xvcm9wdGlvbnNcIik7XG4gICAgICAgICRzY29wZS5tYV9wcmludGJnb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJtYWNoaW5lLmZpZWxkcy5tYV9wcmludGJnb3B0aW9uc1wiKTtcbiAgICAgICAgJHNjb3BlLm1hX3Byb2Nlc3NvcHRpb25zID0gaTE4bkZpbHRlcihcIm1hY2hpbmUuZmllbGRzLm1hX3Byb2Nlc3NvcHRpb25zXCIpO1xuICAgICAgICAkc2NvcGUubWFfc3RhdHVzb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJtYWNoaW5lLmZpZWxkcy5tYV9zdGF0dXNvcHRpb25zXCIpO1xuXG4gICAgICAgICRzY29wZS4kb24oJyR2aWV3Q29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vIHRoaXMgY29kZSBpcyBleGVjdXRlZCBhZnRlciB0aGUgdmlldyBpcyBsb2FkZWRcbiAgICAgICAgICAgIFxuICAgICAgICAgICBcblxuICAgICAgICAgfSk7XG4gICAgfV07XG4gICAgXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRodHRwJywgJyRxJywgICckc3RhdGVQYXJhbXMnLFxuICAgICAgICBmdW5jdGlvbiAoJGh0dHAsICRxLCAkc3RhdGVQYXJhbXMpIHtcbiAgICAgICAgICAgIHZhciBmYWN0b3J5ID0ge307XG4gICAgICAgICAgICBmYWN0b3J5LmFkZCA9IGZ1bmN0aW9uIChtYV9qc29uYikge1xuICAgICAgICAgICAgICAgIHZhciBwcm9taXNlID0gJGh0dHAucG9zdCgnbW9kdWxlcy9tYWNoaW5lL21vZHVsZXMvbWFjaGluZS5hZGQvbWFjaGluZS5hZGQubWRsLmFkZC5waHAnLCB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICAgICAgbWFfanNvbmI6IG1hX2pzb25iXG4gICAgICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJldHVybiBmYWN0b3J5O1xuICAgICAgICB9XTtcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oYW5ndWxhcil7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIFxuICAgIHJldHVybiBhbmd1bGFyLm1vZHVsZSgnYXBwLm1hY2hpbmUudXBkYXRlJyxbXSlcblxuICAgIC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLFxuICAgIGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcbiAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ21hY2hpbmVVcGRhdGUnLCB7XG4gICAgICAgICAgICB1cmw6Jy9tYWNoaW5lL3VwZGF0ZS86bWFfaWQnLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmwgOiAnYXBwL21hY2hpbmUvbW9kdWxlcy9tYWNoaW5lLnVwZGF0ZS9tYWNoaW5lLnVwZGF0ZS52aWV3Lmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlciA6ICdtYWNoaW5lVXBkYXRlQ3RybCcsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgcmVxdWlyZXNMb2dpbjogdHJ1ZVxuICAgICAgICAgICAgfSAgICBcbiAgICAgICAgfSk7XG4gICAgfV0pXG5cbiAgICAuZmFjdG9yeSgnbWFjaGluZVVwZGF0ZUZhYycscmVxdWlyZSgnLi9tYWNoaW5lLnVwZGF0ZS5mYWMnKSlcblxuICAgIC5jb250cm9sbGVyKCdtYWNoaW5lVXBkYXRlQ3RybCcscmVxdWlyZSgnLi9tYWNoaW5lLnVwZGF0ZS5jdHJsJykpXG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCIgOiBcImFjdHVhbGl6YXIgbWFxdWluYVwiLFxuICAgICAgICAgICAgICAgIH0iLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRzY29wZScsICdtYWNoaW5lVXBkYXRlRmFjJywgJyRsb2NhdGlvbicsICdpMThuRmlsdGVyJyxcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgbWFjaGluZVVwZGF0ZUZhYywgJGxvY2F0aW9uLCBpMThuRmlsdGVyKSB7XG5cbiAgICAgICAgICAgICRzY29wZS5vblN1Ym1pdCA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgIG1hY2hpbmVVcGRhdGVGYWMudXBkYXRlKCRzY29wZS5mbURhdGEpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb21pc2UuZGF0YSA9PSBcIjFcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9tYWNoaW5lJyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICRzY29wZS5tYV9zaXplbWVhc3VyZW9wdGlvbnMgPSBpMThuRmlsdGVyKFwibWFjaGluZS5maWVsZHMubWFfc2l6ZW1lYXN1cmVvcHRpb25zXCIpO1xuICAgICAgICAgICAgJHNjb3BlLm1hX2Z1bGxjb2xvcm9wdGlvbnMgPSBpMThuRmlsdGVyKFwibWFjaGluZS5maWVsZHMubWFfZnVsbGNvbG9yb3B0aW9uc1wiKTtcbiAgICAgICAgICAgICRzY29wZS5tYV9wcmludGJnb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJtYWNoaW5lLmZpZWxkcy5tYV9wcmludGJnb3B0aW9uc1wiKTtcbiAgICAgICAgICAgICRzY29wZS5tYV9wcm9jZXNzb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJtYWNoaW5lLmZpZWxkcy5tYV9wcm9jZXNzb3B0aW9uc1wiKTtcbiAgICAgICAgICAgICRzY29wZS5tYV9zdGF0dXNvcHRpb25zID0gaTE4bkZpbHRlcihcIm1hY2hpbmUuZmllbGRzLm1hX3N0YXR1c29wdGlvbnNcIik7XG5cbiAgICAgICAgICAgICRzY29wZS4kb24oJyR2aWV3Q29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAvLyB0aGlzIGNvZGUgaXMgZXhlY3V0ZWQgYWZ0ZXIgdGhlIHZpZXcgaXMgbG9hZGVkXG4gICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIG1hY2hpbmVVcGRhdGVGYWMuZGF0YSgpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNPYmplY3QoYW5ndWxhci5mcm9tSnNvbihwcm9taXNlLmRhdGEpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmZtRGF0YSA9IGFuZ3VsYXIuZnJvbUpzb24ocHJvbWlzZS5kYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1dO1xuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRodHRwJywgJyRxJywgICckc3RhdGVQYXJhbXMnLCBmdW5jdGlvbiAoJGh0dHAsICRxLCAkc3RhdGVQYXJhbXMpIHtcbiAgICAgICAgdmFyIGZhY3RvcnkgPSB7fTtcbiAgICAgICAgZmFjdG9yeS5kYXRhID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoXG4gICAgICAgICAgICAgICAgJGh0dHAucG9zdCgnbW9kdWxlcy9tYWNoaW5lL21vZHVsZXMvbWFjaGluZS51cGRhdGUvbWFjaGluZS51cGRhdGUubWRsLmdldG1hY2hpbmUucGhwJywge1xuICAgICAgICAgICAgICAgICAgICAvKiBQT1NUIHZhcmlhYmxlcyBoZXJlICovXG4gICAgICAgICAgICAgICAgICAgIG1hX2lkOiAkc3RhdGVQYXJhbXMubWFfaWRcbiAgICAgICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeS51cGRhdGUgPSBmdW5jdGlvbiAobWFfanNvbmIpIHtcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKFxuICAgICAgICAgICAgICAgICRodHRwLnBvc3QoJ21vZHVsZXMvbWFjaGluZS9tb2R1bGVzL21hY2hpbmUudXBkYXRlL21hY2hpbmUudXBkYXRlLm1kbC51cGRhdGUucGhwJywge1xuICAgICAgICAgICAgICAgICAgICAvKiBQT1NUIHZhcmlhYmxlcyBoZXJlICovXG4gICAgICAgICAgICAgICAgICAgIG1hX2lkOiAkc3RhdGVQYXJhbXMubWFfaWQsXG4gICAgICAgICAgICAgICAgICAgIG1hX2pzb25iOiBtYV9qc29uYlxuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICBmYWN0b3J5LmdldENvdW50cmllcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gJGh0dHAuZ2V0KCdodHRwOi8vYXBpLmdlb25hbWVzLm9yZy9jb3VudHJ5SW5mb0pTT04/dXNlcm5hbWU9YWxlamFuZHJvbHNjYScpXG4gICAgICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICBmYWN0b3J5LmdldFN0YXRlcyA9IGZ1bmN0aW9uIChtYV9jb3VudHJ5KSB7XG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9ICRodHRwLmdldCgnaHR0cDovL2FwaS5nZW9uYW1lcy5vcmcvY2hpbGRyZW5KU09OP2dlb25hbWVJZD0nICsgbWFfY291bnRyeSArICcmdXNlcm5hbWU9YWxlamFuZHJvbHNjYScpXG4gICAgICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICBmYWN0b3J5LmdldENpdHlDb3VudHkgPSBmdW5jdGlvbiAobWFfc3RhdGUpIHtcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gJGh0dHAuZ2V0KCdodHRwOi8vYXBpLmdlb25hbWVzLm9yZy9jaGlsZHJlbkpTT04/Z2VvbmFtZUlkPScgKyBtYV9zdGF0ZSArICcmdXNlcm5hbWU9YWxlamFuZHJvbHNjYScpXG4gICAgICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZmFjdG9yeTtcbiAgICB9XTtcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oYW5ndWxhcil7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIFxuICAgIHJldHVybiBhbmd1bGFyLm1vZHVsZSgnYXBwLnBhcGVyJyxbXG4gICAgICAgIHJlcXVpcmUoJy4vbW9kdWxlcy9wYXBlci5hZGQnKS5uYW1lLFxuICAgICAgICByZXF1aXJlKCcuL21vZHVsZXMvcGFwZXIudXBkYXRlJykubmFtZVxuICAgIF0pXG5cbiAgICAuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJyxcbiAgICBmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdwYXBlcicsIHtcbiAgICAgICAgICAgIHVybDonL3BhcGVyJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsIDogJ2FwcC9wYXBlci9wYXBlci52aWV3Lmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlciA6ICdwYXBlckN0cmwnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHJlcXVpcmVzTG9naW46IHRydWVcbiAgICAgICAgICAgIH0gICAgXG4gICAgICAgIH0pO1xuICAgIH1dKVxuXG4gICAgLmZhY3RvcnkoJ3BhcGVyRmFjJyxyZXF1aXJlKCcuL3BhcGVyLmZhYycpKVxuXG4gICAgLmNvbnRyb2xsZXIoJ3BhcGVyQ3RybCcscmVxdWlyZSgnLi9wYXBlci5jdHJsJykpXG4gICAgXG59KShhbmd1bGFyKTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCIgOiBcIlBhcGVsXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibGFiZWxzXCI6e1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJwYS1pZFwiOlwiSUQgUGFwZWxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3UtaWRcIjpcIklEIFByb3ZlZWRvclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwYS1jb2RlXCI6XCJDb2RpZ29cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicGEtdHlwZVwiOlwiVGlwb1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwYS1kZXNjcmlwdGlvblwiOlwiRGVzY3JpcGNpw7NuXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInBhLXdlaWdodFwiOlwiUGVzb1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwYS13aWR0aFwiOlwiQW5jaG9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicGEtaGVpZ2h0XCI6XCJBbHR1cmFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicGEtbWVhc3VyZVwiOlwiTWVkaWRhXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInBhLXByaWNlXCI6XCJQcmVjaW9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicGEtc3RhdHVzXCI6XCJFc3RhdHVzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInBhLWRhdGVcIjpcIkZlY2hhXCIsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICBcImNvbHVtbnNcIjpbXG4gICAgICAgICAgICAgICAgICAgICAgICBcInBhX2lkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN1X2lkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInBhX2NvZGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicGFfdHlwZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwYV9kZXNjcmlwdGlvblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwYV93ZWlnaHRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicGFfd2lkdGhcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicGFfaGVpZ2h0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInBhX21lYXN1cmVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicGFfcHJpY2VcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicGFfc3RhdHVzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInBhX2RhdGVcIixcbiAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICBcImZpZWxkc1wiIDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFfc3RhdHVzb3B0aW9ucyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiQWN0aXZvXCIsXCJ2YWx1ZVwiOlwiQVwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiSW5hY3Rpdm9cIixcInZhbHVlXCI6XCJJXCJ9XG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFfdHlwZW9wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIlBhcGVsXCIsXCJ2YWx1ZVwiOlwicGFwZXJcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkNhcnR1bGluYVwiLFwidmFsdWVcIjpcInBvc3Rlcl9ib2FyZFwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiUGFwZWwgQWRoZXNpdm9cIixcInZhbHVlXCI6XCJhZGhlc2l2ZV9wYXBlclwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiUGVsaWN1bGEgQWRoZXNpdmFcIixcInZhbHVlXCI6XCJhZGhlc2l2ZSBmaWxtXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJTw61udGV0aWNvXCIsXCJ2YWx1ZVwiOlwic3ludGhldGljXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJQbGFzdGljb3NcIixcInZhbHVlXCI6XCJwbGFzdGljc1wifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiVGVybWFsIFRyYW5zZmVyXCIsXCJ2YWx1ZVwiOlwidGVybWFsIHRyYW5zZmVyXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJEaXJlY3QgVGVybWFsXCIsXCJ2YWx1ZVwiOlwiZGlyZWN0X3Rlcm1hbFwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiT3Ryb3NcIixcInZhbHVlXCI6XCJvdGhlclwifVxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhX21lYXN1cmVvcHRpb25zIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJjbVwiLFwidmFsdWVcIjpcImNtXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJwdWxnYWRhc1wiLFwidmFsdWVcIjpcImluXCJ9XG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKGFuZ3VsYXIpe1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBcbiAgICByZXR1cm4gYW5ndWxhci5tb2R1bGUoJ2FwcC5wYXBlci5hZGQnLFtdKVxuXG4gICAgLmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsXG4gICAgZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgncGFwZXJBZGQnLCB7XG4gICAgICAgICAgICB1cmw6Jy9wYXBlci9hZGQnLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmwgOiAnYXBwL3BhcGVyL21vZHVsZXMvcGFwZXIuYWRkL3BhcGVyLmFkZC52aWV3Lmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlciA6ICdwYXBlckFkZEN0cmwnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHJlcXVpcmVzTG9naW46IHRydWVcbiAgICAgICAgICAgIH0gICAgXG4gICAgICAgIH0pO1xuICAgIH1dKVxuXG4gICAgLmZhY3RvcnkoJ3BhcGVyQWRkRmFjJyxyZXF1aXJlKCcuL3BhcGVyLmFkZC5mYWMnKSlcblxuICAgIC5jb250cm9sbGVyKCdwYXBlckFkZEN0cmwnLHJlcXVpcmUoJy4vcGFwZXIuYWRkLmN0cmwnKSlcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIiA6IFwiYWdyZWdhciBwYXBlbFwiLFxuICAgICAgICAgICAgICAgIH0iLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRzY29wZScsICdwYXBlckFkZEZhYycsICckbG9jYXRpb24nLCAnaTE4bkZpbHRlcicsXG4gICAgICAgIGZ1bmN0aW9uICgkc2NvcGUsIHBhcGVyQWRkRmFjLCAkbG9jYXRpb24sIGkxOG5GaWx0ZXIpIHtcbiAgICAgICAgICAgICRzY29wZS5mbURhdGEgPSB7fTtcblxuICAgICAgICAgICAgJHNjb3BlLm9uU3VibWl0ID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgcGFwZXJBZGRGYWMuYWRkKCRzY29wZS5mbURhdGEpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb21pc2UuZGF0YSA9PSBcIjFcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9wYXBlcicpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnVwZGF0ZUZhaWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAkc2NvcGUucGFfc3RhdHVzb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJwYXBlci5maWVsZHMucGFfc3RhdHVzb3B0aW9uc1wiKTtcbiAgICAgICAgICAgICRzY29wZS5wYV90eXBlb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJwYXBlci5maWVsZHMucGFfdHlwZW9wdGlvbnNcIik7XG4gICAgICAgICAgICAkc2NvcGUucGFfbWVhc3VyZW9wdGlvbnMgPSBpMThuRmlsdGVyKFwicGFwZXIuZmllbGRzLnBhX21lYXN1cmVvcHRpb25zXCIpO1xuXG4gICAgICAgICAgICAkc2NvcGUuJG9uKCckdmlld0NvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgLy8gdGhpcyBjb2RlIGlzIGV4ZWN1dGVkIGFmdGVyIHRoZSB2aWV3IGlzIGxvYWRlZFxuICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgcGFwZXJBZGRGYWMuZ2V0U3VwcGxpZXJzKCkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5zdV9pZG9wdGlvbnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChwcm9taXNlLmRhdGEsIGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wdXNoKHsgXCJsYWJlbFwiOiB2YWx1ZS5zdV9jb3Jwb3JhdGVuYW1lLCBcInZhbHVlXCI6IHZhbHVlLnN1X2lkIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgJHNjb3BlLnN1X2lkb3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyRzY29wZS51cGRhdGVGYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfV07XG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKGFuZ3VsYXIpe1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBcbiAgICByZXR1cm4gWyckaHR0cCcsICckcScsICAnJHN0YXRlUGFyYW1zJywgZnVuY3Rpb24oJGh0dHAsICRxLCAkc3RhdGVQYXJhbXMpe1xuICAgICAgICB2YXIgZmFjdG9yeSA9IHt9O1xuICAgICAgICBmYWN0b3J5LmFkZCA9IGZ1bmN0aW9uKHBhX2pzb25iKSB7XG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9ICRodHRwLnBvc3QoJ21vZHVsZXMvcGFwZXIvbW9kdWxlcy9wYXBlci5hZGQvcGFwZXIuYWRkLm1kbC5hZGQucGhwJywge1xuICAgICAgICAgICAgICAgICAgICAvKiBQT1NUIHZhcmlhYmxlcyBoZXJlICovXG4gICAgICAgICAgICAgICAgICAgIHBhX2pzb25iOiBwYV9qc29uYlxuICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZyl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1wic3RhdHVzXCI6IGZhbHNlfTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkuZ2V0U3VwcGxpZXJzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9ICRodHRwLmdldCgnbW9kdWxlcy9wYXBlci9tb2R1bGVzL3BhcGVyLmFkZC9wYXBlci5hZGQubWRsLmdldFN1cHBsaWVycy5waHAnKVxuICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpe1xuICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcInN0YXR1c1wiOiBmYWxzZX07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZmFjdG9yeTtcbiAgICB9XTtcbiAgICBcbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKGFuZ3VsYXIpe1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBcbiAgICByZXR1cm4gYW5ndWxhci5tb2R1bGUoJ2FwcC5wYXBlci51cGRhdGUnLFtdKVxuXG4gICAgLmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsXG4gICAgZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgncGFwZXJVcGRhdGUnLCB7XG4gICAgICAgICAgICB1cmw6Jy9wYXBlci91cGRhdGUvOnBhX2lkJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsIDogJ2FwcC9wYXBlci9tb2R1bGVzL3BhcGVyLnVwZGF0ZS9wYXBlci51cGRhdGUudmlldy5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXIgOiAncGFwZXJVcGRhdGVDdHJsJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICByZXF1aXJlc0xvZ2luOiB0cnVlXG4gICAgICAgICAgICB9ICAgIFxuICAgICAgICB9KTtcbiAgICB9XSlcblxuICAgIC5mYWN0b3J5KCdwYXBlclVwZGF0ZUZhYycscmVxdWlyZSgnLi9wYXBlci51cGRhdGUuZmFjJykpXG5cbiAgICAuY29udHJvbGxlcigncGFwZXJVcGRhdGVDdHJsJyxyZXF1aXJlKCcuL3BhcGVyLnVwZGF0ZS5jdHJsJykpXG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCIgOiBcImFjdHVhbGl6YXIgcGFwZWxcIixcbiAgICAgICAgICAgICAgICB9IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckc2NvcGUnLCAncGFwZXJVcGRhdGVGYWMnLCAnJGxvY2F0aW9uJywgJ2kxOG5GaWx0ZXInLFxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCBwYXBlclVwZGF0ZUZhYywgJGxvY2F0aW9uLCBpMThuRmlsdGVyKSB7XG5cbiAgICAgICAgICAgICRzY29wZS5vblN1Ym1pdCA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgIHBhcGVyVXBkYXRlRmFjLnVwZGF0ZSgkc2NvcGUuZm1EYXRhKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9taXNlLmRhdGEgPT0gXCIxXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvcGFwZXInKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS51cGRhdGVGYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgJHNjb3BlLnBhX3N0YXR1c29wdGlvbnMgPSBpMThuRmlsdGVyKFwicGFwZXIuZmllbGRzLnBhX3N0YXR1c29wdGlvbnNcIik7XG4gICAgICAgICAgICAkc2NvcGUucGFfdHlwZW9wdGlvbnMgPSBpMThuRmlsdGVyKFwicGFwZXIuZmllbGRzLnBhX3R5cGVvcHRpb25zXCIpO1xuICAgICAgICAgICAgJHNjb3BlLnBhX21lYXN1cmVvcHRpb25zID0gaTE4bkZpbHRlcihcInBhcGVyLmZpZWxkcy5wYV9tZWFzdXJlb3B0aW9uc1wiKTtcblxuICAgICAgICAgICAgJHNjb3BlLiRvbignJHZpZXdDb250ZW50TG9hZGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIC8vIHRoaXMgY29kZSBpcyBleGVjdXRlZCBhZnRlciB0aGUgdmlldyBpcyBsb2FkZWRcbiAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgcGFwZXJVcGRhdGVGYWMuZGF0YSgpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNPYmplY3QoYW5ndWxhci5mcm9tSnNvbihwcm9taXNlLmRhdGEpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmZtRGF0YSA9IGFuZ3VsYXIuZnJvbUpzb24ocHJvbWlzZS5kYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBwYXBlclVwZGF0ZUZhYy5nZXRTdXBwbGllcnMoKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuc3VfaWRvcHRpb25zID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHByb21pc2UuZGF0YSwgZnVuY3Rpb24gKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wdXNoKHsgXCJsYWJlbFwiOiB2YWx1ZS5zdV9jb3Jwb3JhdGVuYW1lLCBcInZhbHVlXCI6IHZhbHVlLnN1X2lkIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sICRzY29wZS5zdV9pZG9wdGlvbnMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyRzY29wZS51cGRhdGVGYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XTtcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckaHR0cCcsICckcScsICAnJHN0YXRlUGFyYW1zJywgZnVuY3Rpb24gKCRodHRwLCAkcSwgJHN0YXRlUGFyYW1zKSB7XG4gICAgICAgIHZhciBmYWN0b3J5ID0ge307XG4gICAgICAgIGZhY3RvcnkuZGF0YSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKFxuICAgICAgICAgICAgICAgICRodHRwLnBvc3QoJ21vZHVsZXMvcGFwZXIvbW9kdWxlcy9wYXBlci51cGRhdGUvcGFwZXIudXBkYXRlLm1kbC5nZXRwYXBlci5waHAnLCB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICAgICAgcGFfaWQ6ICRzdGF0ZVBhcmFtcy5wYV9pZFxuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeS51cGRhdGUgPSBmdW5jdGlvbiAocGFfanNvbmIpIHtcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKFxuICAgICAgICAgICAgICAgICRodHRwLnBvc3QoJ21vZHVsZXMvcGFwZXIvbW9kdWxlcy9wYXBlci51cGRhdGUvcGFwZXIudXBkYXRlLm1kbC51cGRhdGUucGhwJywge1xuICAgICAgICAgICAgICAgICAgICAvKiBQT1NUIHZhcmlhYmxlcyBoZXJlICovXG4gICAgICAgICAgICAgICAgICAgIHBhX2lkOiAkc3RhdGVQYXJhbXMucGFfaWQsXG4gICAgICAgICAgICAgICAgICAgIHBhX2pzb25iOiBwYV9qc29uYlxuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeS5nZXRTdXBwbGllcnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9ICRodHRwLmdldCgnbW9kdWxlcy9wYXBlci9tb2R1bGVzL3BhcGVyLmFkZC9wYXBlci5hZGQubWRsLmdldFN1cHBsaWVycy5waHAnKVxuICAgICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGZhY3Rvcnk7XG4gICAgfV07XG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKGFuZ3VsYXIpe1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBcbiAgICByZXR1cm4gWyckc2NvcGUnLCAncGFwZXJGYWMnLCAnaTE4bkZpbHRlcicsXG4gICAgZnVuY3Rpb24gKCRzY29wZSwgcGFwZXJGYWMsIGkxOG5GaWx0ZXIpIHtcbiAgICBcbiAgICAgICAgJHNjb3BlLmxhYmVscyA9IE9iamVjdC5rZXlzKGkxOG5GaWx0ZXIoXCJwYXBlci5sYWJlbHNcIikpO1xuICAgICAgICAkc2NvcGUuY29sdW1ucyA9IGkxOG5GaWx0ZXIoXCJwYXBlci5jb2x1bW5zXCIpO1xuICAgICAgICBcbiAgICAgICAgLy8gZm9ybWF0SXRlbSBldmVudCBoYW5kbGVyXG4gICAgICAgIHZhciBwYV9pZDtcbiAgICAgICAgJHNjb3BlLmZvcm1hdEl0ZW0gPSBmdW5jdGlvbihzLCBlLCBjZWxsKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChlLnBhbmVsLmNlbGxUeXBlID09IHdpam1vLmdyaWQuQ2VsbFR5cGUuUm93SGVhZGVyKSB7XG4gICAgICAgICAgICAgICAgZS5jZWxsLnRleHRDb250ZW50ID0gZS5yb3crMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcy5yb3dzLmRlZmF1bHRTaXplID0gMzA7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIGFkZCBCb290c3RyYXAgaHRtbFxuICAgICAgICAgICAgaWYgKChlLnBhbmVsLmNlbGxUeXBlID09IHdpam1vLmdyaWQuQ2VsbFR5cGUuQ2VsbCkgJiYgKGUuY29sID09IDApKSB7XG4gICAgICAgICAgICAgICAgcGFfaWQgPSBlLnBhbmVsLmdldENlbGxEYXRhKGUucm93LDEsZmFsc2UpO1xuICAgICAgICAgICAgICAgIGUuY2VsbC5zdHlsZS5vdmVyZmxvdyA9ICd2aXNpYmxlJztcbiAgICAgICAgICAgICAgICBlLmNlbGwuaW5uZXJIVE1MID0gJzxkaXYgY2xhc3M9XCJidG4tZ3JvdXAgYnRuLWdyb3VwLWp1c3RpZmllZFwiIHJvbGU9XCJncm91cFwiIGFyaWEtbGFiZWw9XCIuLi5cIj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidG4tZ3JvdXBcIiByb2xlPVwiZ3JvdXBcIj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiIy9wYXBlci91cGRhdGUvJytwYV9pZCsnXCIgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHQgYnRuLXhzXCIgbmctY2xpY2s9XCJlZGl0KCRpdGVtLnBhX2lkKVwiPkVkaXRhcjwvYT5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj4nO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvLyBiaW5kIGNvbHVtbnMgd2hlbiBncmlkIGlzIGluaXRpYWxpemVkXG4gICAgICAgICRzY29wZS5pbml0R3JpZCA9IGZ1bmN0aW9uKHMsIGUpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgJHNjb3BlLmxhYmVscy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBjb2wgPSBuZXcgd2lqbW8uZ3JpZC5Db2x1bW4oKTtcbiAgICAgICAgICAgICAgICBjb2wuYmluZGluZyA9ICRzY29wZS5jb2x1bW5zW2ldO1xuICAgICAgICAgICAgICAgIGNvbC5oZWFkZXIgPSBpMThuRmlsdGVyKFwicGFwZXIubGFiZWxzLlwiICsgJHNjb3BlLmxhYmVsc1tpXSk7XG4gICAgICAgICAgICAgICAgY29sLndvcmRXcmFwID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgY29sLndpZHRoID0gMTUwO1xuICAgICAgICAgICAgICAgIHMuY29sdW1ucy5wdXNoKGNvbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIC8vIGNyZWF0ZSB0aGUgdG9vbHRpcCBvYmplY3RcbiAgICAgICAgJHNjb3BlLiR3YXRjaCgnZ2dHcmlkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKCRzY29wZS5nZ0dyaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gc3RvcmUgcmVmZXJlbmNlIHRvIGdyaWRcbiAgICAgICAgICAgICAgICB2YXIgZmxleCA9ICRzY29wZS5nZ0dyaWQ7XG5cbiAgICAgICAgICAgICAgICAvLyBjcmVhdGUgdG9vbHRpcFxuICAgICAgICAgICAgICAgIHZhciB0aXAgPSBuZXcgd2lqbW8uVG9vbHRpcCgpLFxuICAgICAgICAgICAgICAgICAgICBybmcgPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgLy8gbW9uaXRvciB0aGUgbW91c2Ugb3ZlciB0aGUgZ3JpZFxuICAgICAgICAgICAgICAgIGZsZXguaG9zdEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaHQgPSBmbGV4LmhpdFRlc3QoZXZ0KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFodC5yYW5nZS5lcXVhbHMocm5nKSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBuZXcgY2VsbCBzZWxlY3RlZCwgc2hvdyB0b29sdGlwXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaHQuY2VsbFR5cGUgPT0gd2lqbW8uZ3JpZC5DZWxsVHlwZS5DZWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm5nID0gaHQucmFuZ2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvbCA9IGZsZXguY29sdW1uc1tybmcuY29sXS5oZWFkZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNlbGxFbGVtZW50ID0gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludChldnQuY2xpZW50WCwgZXZ0LmNsaWVudFkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjZWxsQm91bmRzID0gd2lqbW8uUmVjdC5mcm9tQm91bmRpbmdSZWN0KGNlbGxFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YSA9IHdpam1vLmVzY2FwZUh0bWwoZmxleC5nZXRDZWxsRGF0YShybmcucm93LCBybmcuY29sLCB0cnVlKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpcENvbnRlbnQgPSBjb2wgKyAnOiBcIjxiPicgKyBkYXRhICsgJzwvYj5cIic7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNlbGxFbGVtZW50LmNsYXNzTmFtZS5pbmRleE9mKCd3ai1jZWxsJykgPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXAuc2hvdyhmbGV4Lmhvc3RFbGVtZW50LCB0aXBDb250ZW50LCBjZWxsQm91bmRzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXAuaGlkZSgpOyAvLyBjZWxsIG11c3QgYmUgYmVoaW5kIHNjcm9sbCBiYXIuLi5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBmbGV4Lmhvc3RFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3V0JywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB0aXAuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICBybmcgPSBudWxsO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAkc2NvcGUuJG9uKCckdmlld0NvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyB0aGlzIGNvZGUgaXMgZXhlY3V0ZWQgYWZ0ZXIgdGhlIHZpZXcgaXMgbG9hZGVkXG4gICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG4gICAgICAgICAgICBwYXBlckZhYy5kYXRhKCkudGhlbihmdW5jdGlvbihwcm9taXNlKXtcbiAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGlmKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5kYXRhID0gbmV3IHdpam1vLmNvbGxlY3Rpb25zLkNvbGxlY3Rpb25WaWV3KHByb21pc2UuZGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICB9KTtcbiAgICB9XTtcbiAgICBcbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgcmV0dXJuIFsnJGh0dHAnLCAnJHEnLCAgZnVuY3Rpb24gKCRodHRwLCAkcSkge1xuICAgICAgICB2YXIgZmFjdG9yeSA9IHt9O1xuICAgICAgICBmYWN0b3J5LmRhdGEgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KCdtb2R1bGVzL3BhcGVyL3BhcGVyLm1kbC5nZXRwYXBlcnMucGhwJywge1xuICAgICAgICAgICAgICAgICAgICAvKiBQT1NUIHZhcmlhYmxlcyBoZXJlICovXG4gICAgICAgICAgICAgICAgICAgIHByb2NjZXNfaWQ6IG5ldyBEYXRlKCkuZ2V0TWlsbGlzZWNvbmRzKClcbiAgICAgICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGZhY3Rvcnk7XG4gICAgfV07XG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKGFuZ3VsYXIpe1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBcbiAgICByZXR1cm4gYW5ndWxhci5tb2R1bGUoJ2FwcC5wcm9kdWN0JyxbXG4gICAgICAgIHJlcXVpcmUoJy4vbW9kdWxlcy9wcm9kdWN0T2Zmc2V0R2VuZXJhbC5hZGQnKS5uYW1lLFxuICAgICAgICByZXF1aXJlKCcuL21vZHVsZXMvcHJvZHVjdE9mZnNldEdlbmVyYWwudXBkYXRlJykubmFtZSxcbiAgICAgICAgcmVxdWlyZSgnLi9tb2R1bGVzL3Byb2R1Y3RPZmZzZXRQYWdpbmF0ZWQuYWRkJykubmFtZSxcbiAgICAgICAgLy9yZXF1aXJlKCcuL21vZHVsZXMvcHJvZHVjdE9mZnNldFBhZ2luYXRlZC51cGRhdGUnKS5uYW1lXG4gICAgXSlcblxuICAgIC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLFxuICAgIGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcbiAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3Byb2R1Y3QnLCB7XG4gICAgICAgICAgICB1cmw6Jy9wcm9kdWN0LzpjbF9pZCcsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybCA6ICdhcHAvcHJvZHVjdC9wcm9kdWN0LnZpZXcuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyIDogJ3Byb2R1Y3RDdHJsJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICByZXF1aXJlc0xvZ2luOiB0cnVlXG4gICAgICAgICAgICB9ICAgIFxuICAgICAgICB9KTtcbiAgICB9XSlcblxuICAgIC5mYWN0b3J5KCdwcm9kdWN0RmFjJyxyZXF1aXJlKCcuL3Byb2R1Y3QuZmFjJykpXG5cbiAgICAuY29udHJvbGxlcigncHJvZHVjdEN0cmwnLHJlcXVpcmUoJy4vcHJvZHVjdC5jdHJsJykpXG4gICAgXG59KShhbmd1bGFyKTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCIgOiBcIlByb2R1Y3Rvc1wiLFxuICAgICAgICAgICAgICAgICAgICBcImxhYmVsc1wiOntcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItaWRcIjogXCJJRCBwcm9kdWN0b1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbC1pZFwiOiBcIklEIENsaWVudGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItcGFydG5vXCI6IFwiTm8uIFBhcnRlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLWNvZGVcIjogXCJDb2RpZ29cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItbmFtZVwiOiBcIk5vbWJyZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1wcm9jZXNzXCI6IFwiUHJvY2Vzb1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci10eXBlXCI6IFwiVGlwb1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1zdGF0dXNcIjogXCJFc3RhdHVzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLWRhdGVcIjogXCJGZWNoYVwiLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBcImNvbHVtbnNcIjpbXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX2lkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsX2lkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX3BhcnRub1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9jb2RlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX25hbWVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfcHJvY2Vzc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl90eXBlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX3N0YXR1c1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9kYXRlXCIsXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICBcImZpZWxkc1wiIDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKGFuZ3VsYXIpe1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBcbiAgICByZXR1cm4gYW5ndWxhci5tb2R1bGUoJ2FwcC5wcm9kdWN0T2Zmc2V0R2VuZXJhbC5hZGQnLFtdKVxuXG4gICAgLmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsXG4gICAgZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgncHJvZHVjdE9mZnNldEdlbmVyYWxBZGQnLCB7XG4gICAgICAgICAgICB1cmw6Jy9wcm9kdWN0L2FkZC9vZmZzZXQvZ2VuZXJhbC86Y2xfaWQnLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmwgOiAnYXBwL3Byb2R1Y3QvbW9kdWxlcy9wcm9kdWN0T2Zmc2V0R2VuZXJhbC5hZGQvcHJvZHVjdE9mZnNldEdlbmVyYWwuYWRkLnZpZXcuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyIDogJ3Byb2R1Y3RPZmZzZXRHZW5lcmFsQWRkQ3RybCcsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgcmVxdWlyZXNMb2dpbjogdHJ1ZVxuICAgICAgICAgICAgfSAgICBcbiAgICAgICAgfSk7XG4gICAgfV0pXG5cbiAgICAuZmFjdG9yeSgncHJvZHVjdE9mZnNldEdlbmVyYWxBZGRGYWMnLHJlcXVpcmUoJy4vcHJvZHVjdE9mZnNldEdlbmVyYWwuYWRkLmZhYycpKVxuXG4gICAgLmNvbnRyb2xsZXIoJ3Byb2R1Y3RPZmZzZXRHZW5lcmFsQWRkQ3RybCcscmVxdWlyZSgnLi9wcm9kdWN0T2Zmc2V0R2VuZXJhbC5hZGQuY3RybCcpKVxuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiIDogXCJhZ3JlZ2FyIHByb2R1Y3RvXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibGFiZWxzXCI6e1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1pZFwiOiBcIklEIHByb2R1Y3RvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsLWlkXCI6IFwiSUQgY2xpZW50ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1wcm9jZXNzXCI6IFwiUHJvY2Vzb1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci10eXBlXCI6IFwiVGlwb1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1wYXJ0bm9cIjogXCJOby4gcGFydGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItY29kZVwiOiBcIkNvZGlnb1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1kZXNjcmlwdGlvblwiOiBcIkRlc2NyaXBjaW9uXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLWZpbmFsc2l6ZXdpZHRoXCI6IFwiQW5jaG9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItZmluYWxzaXplaGVpZ2h0XCI6IFwiQWx0b1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1maW5hbHNpemVtZWFzdXJlXCI6IFwiTWVkaWRhXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLWlua2Zyb250XCI6IFwiRnJlbnRlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLWlua2JhY2tcIjogXCJSZXZlcnNvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInBhLWlkXCI6IFwiSUQgcGFwZWxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItcGFwZXJzaXpld2lkdGhcIjogXCJBbmNob1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1wYXBlcnNpemVoZWlnaHRcIjogXCJBbHRvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLXBhcGVyc2l6ZW1lYXN1cmVcIjogXCJNZWRpZGFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItcGFwZXJmb3JtYXRzcXR5XCI6IFwiRm9ybWF0b3NcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItdmFybmlzaFwiOiBcIkJhcm5pelwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci12YXJuaXNodXZcIjogXCJCYXJuaXogVVZcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItdmFybmlzaGZpbmlzaGVkXCI6IFwiQWNhYmFkb1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1sYW1pbmF0ZVwiOiBcIkxhbWluYWRvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLWxhbWluYXRlZmluaXNoZWRcIjogXCJBY2FiYWRvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLWxhbWluYXRlY2FsaWJlclwiOiBcIkNhbGlicmVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItbGFtaW5hdGVzaWRlc1wiOiBcIkNhcmFzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLWZvbGlvXCI6IFwiRm9saW9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItcHJlY3V0XCI6IFwiUHJlY29ydGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItZm9sZFwiOiBcIkRvYmxlelwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1kaWVjdXR0aW5nXCI6IFwiU3VhamVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItZGllY3V0dGluZ3F0eVwiOiBcIk5vLiBTdWFqZXNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItcmVpbmZvcmNlbWVudFwiOiBcIlJlZnVlcnpvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLWNvcmRcIjogXCJDb3Jkw7NuXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLXdpcmVcIjogXCJBbMOhbWJyZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1ibG9ja3NcIjogXCJCbG9ja3NcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItc3RhdHVzXCI6IFwiRXN0YXR1c1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1kYXRlXCI6IFwiRmVjaGFcIixcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgXCJjb2x1bW5zXCI6W1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9pZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbF9pZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9wcm9jZXNzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX3R5cGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfcGFydG5vXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX2NvZGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfZGVzY3JpcHRpb25cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfZmluYWxzaXpld2lkdGhcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfZmluYWxzaXplaGVpZ2h0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX2ZpbmFsc2l6ZW1lYXN1cmVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfaW5rZnJvbnRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfaW5rYmFja1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwYV9pZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9wYXBlcnNpemV3aWR0aFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9wYXBlcnNpemVoZWlnaHRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfcGFwZXJzaXplbWVhc3VyZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9wYXBlcmZvcm1hdHNxdHlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfdmFybmlzaFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl92YXJuaXNodXZcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfdmFybmlzaGZpbmlzaGVkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX2xhbWluYXRlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX2xhbWluYXRlZmluaXNoZWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfbGFtaW5hdGVjYWxpYmVyXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX2xhbWluYXRlc2lkZXNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfZm9saW9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfcHJlY3V0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX2ZvbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfZGllY3V0dGluZ1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9kaWVjdXR0aW5ncXR5XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX3JlaW5mb3JjZW1lbnRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfY29yZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl93aXJlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX2Jsb2Nrc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9zdGF0dXNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfZGF0ZVwiLFxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgXCJmaWVsZHNcIiA6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByX2ZpbmFsc2l6ZW1lYXN1cmVvcHRpb25zIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJjbVwiLFwidmFsdWVcIjpcImNtXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJwdWxnYWRhc1wiLFwidmFsdWVcIjpcImluXCJ9XG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJfaW5rZnJvbnRvcHRpb25zIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCIxIHRpbnRhXCIsXCJ2YWx1ZVwiOjF9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCIyIHRpbnRhc1wiLFwidmFsdWVcIjoyfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiMyB0aW50YXNcIixcInZhbHVlXCI6M30sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIjQgdGludGFzXCIsXCJ2YWx1ZVwiOjR9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCI1IHRpbnRhc1wiLFwidmFsdWVcIjo1fSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiNiB0aW50YXNcIixcInZhbHVlXCI6Nn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIjcgdGludGFzXCIsXCJ2YWx1ZVwiOjd9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCI4IHRpbnRhc1wiLFwidmFsdWVcIjo4fSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBwcl9pbmtiYWNrb3B0aW9ucyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiMSB0aW50YVwiLFwidmFsdWVcIjoxfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiMiB0aW50YXNcIixcInZhbHVlXCI6Mn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIjMgdGludGFzXCIsXCJ2YWx1ZVwiOjN9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCI0IHRpbnRhc1wiLFwidmFsdWVcIjo0fSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiNSB0aW50YXNcIixcInZhbHVlXCI6NX0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIjYgdGludGFzXCIsXCJ2YWx1ZVwiOjZ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCI3IHRpbnRhc1wiLFwidmFsdWVcIjo3fSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiOCB0aW50YXNcIixcInZhbHVlXCI6OH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJfcGFwZXJzaXplbWVhc3VyZW9wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcImNtXCIsXCJ2YWx1ZVwiOlwiY21cIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcInB1bGdhZGFzXCIsXCJ2YWx1ZVwiOlwiaW5cIn1cbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBwcl92YXJuaXNob3B0aW9ucyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiU2lcIixcInZhbHVlXCI6XCJ5ZXNcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIk5vXCIsXCJ2YWx1ZVwiOlwibm9cIn1cbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBwcl92YXJuaXNodXZvcHRpb25zIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJVbmEgY2FyYVwiLFwidmFsdWVcIjpcIm9uZXNpZGVcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkRvcyBjYXJhc1wiLFwidmFsdWVcIjpcInR3b3NpZGVzXCJ9XG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJfdmFybmlzZmluaXNoZWRvcHRpb25zIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJNYXRlXCIsXCJ2YWx1ZVwiOlwibWF0dGVcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkJyaWxsYW50ZVwiLFwidmFsdWVcIjpcImJyaWdodFwifVxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHByX2xhbWluYXRlb3B0aW9ucyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiU2lcIixcInZhbHVlXCI6XCJ5ZXNcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIk5vXCIsXCJ2YWx1ZVwiOlwibm9cIn1cbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBwcl9sYW1pbmF0ZWZpbmlzaGVkb3B0aW9ucyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiTWF0ZVwiLFwidmFsdWVcIjpcIm1hdHRlXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJCcmlsbGFudGVcIixcInZhbHVlXCI6XCJicmlnaHRcIn1cbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBwcl9sYW1pbmF0ZWNhbGliZXJvcHRpb25zIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCIuMm1tXCIsXCJ2YWx1ZVwiOlwiMm1tXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCIuNG1tXCIsXCJ2YWx1ZVwiOlwiNG1tXCJ9XG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJfbGFtaW5hdGVzaWRlc29wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIlVuYSBjYXJhXCIsXCJ2YWx1ZVwiOlwib25lc2lkZVwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiRG9zIGNhcmFzXCIsXCJ2YWx1ZVwiOlwidHdvc2lkZXNcIn1cbiAgICAgICAgICAgICAgICAgICAgICAgIF0scHJfZm9saW9vcHRpb25zIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJTaVwiLFwidmFsdWVcIjpcInllc1wifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiTm9cIixcInZhbHVlXCI6XCJub1wifVxuICAgICAgICAgICAgICAgICAgICAgICAgXSxwcl9wcmVjdXRvcHRpb25zIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJOb1wiLFwidmFsdWVcIjpcIm5vXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJIb3Jpem9udGFsXCIsXCJ2YWx1ZVwiOlwiaG9yaXpvbnRhbFwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiVmVydGljYWxcIixcInZhbHVlXCI6XCJ2ZXJ0aWNhbFwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF0scHJfZm9sZG9wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIlRyaXB0aWNvXCIsXCJ2YWx1ZVwiOlwidHJ5cHRpY1wifSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF0scHJfZGllY3V0dGluZ29wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIlNpXCIsXCJ2YWx1ZVwiOlwieWVzXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJOb1wiLFwidmFsdWVcIjpcIm5vXCJ9XG4gICAgICAgICAgICAgICAgICAgICAgICBdLHByX3JlaW5mb3JjZW1lbnRvcHRpb25zIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJOb1wiLFwidmFsdWVcIjpcIm5vXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJVbm9cIixcInZhbHVlXCI6XCJvbmVcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkRvc1wiLFwidmFsdWVcIjpcInR3b1wifSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF0scHJfY29yZG9wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIk5vXCIsXCJ2YWx1ZVwiOlwibm9cIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkNvbG9jYWRvXCIsXCJ2YWx1ZVwiOlwiYWxsb2NhdGVkXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJTZXBhcmFkb1wiLFwidmFsdWVcIjpcInNlcGFyYXRlZFwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF0scHJfd2lyZW9wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIk5vXCIsXCJ2YWx1ZVwiOlwibm9cIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkNvbG9jYWRvXCIsXCJ2YWx1ZVwiOlwiYWxsb2NhdGVkXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJTZXBhcmFkb1wiLFwidmFsdWVcIjpcInNlcGFyYXRlZFwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF0scHJfYmxvY2tzb3B0aW9ucyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiTm9cIixcInZhbHVlXCI6XCJub1wifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiMjBcIixcInZhbHVlXCI6XCIyMFwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiMjVcIixcInZhbHVlXCI6XCIyNVwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiNTBcIixcInZhbHVlXCI6XCI1MFwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiNzVcIixcInZhbHVlXCI6XCI3NVwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiMTAwXCIsXCJ2YWx1ZVwiOlwiMTAwXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHByX3N0YXR1c29wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkFjdGl2b1wiLFwidmFsdWVcIjpcIkFcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkluYWN0aXZvXCIsXCJ2YWx1ZVwiOlwiSVwifVxuICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0iLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRzY29wZScsICdwcm9kdWN0T2Zmc2V0R2VuZXJhbEFkZEZhYycsICckbG9jYXRpb24nLCAnaTE4bkZpbHRlcicsICckc3RhdGVQYXJhbXMnLFxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCBwcm9kdWN0T2Zmc2V0R2VuZXJhbEFkZEZhYywgJGxvY2F0aW9uLCBpMThuRmlsdGVyLCAkc3RhdGVQYXJhbXMpIHtcbiAgICAgICAgICAgICRzY29wZS5mbURhdGEgPSB7fTtcbiAgICAgICAgICAgICRzY29wZS5mbURhdGEgPSB7IFwicHJfcHJvY2Vzc1wiOiBcIm9mZnNldFwiLCBcInByX3R5cGVcIjogXCJnZW5lcmFsXCIsIFwiY2xfaWRcIjogXCI2XCIsIFwicHJfcGFydG5vXCI6IFwiVEVTVC1BU0EuYXNhczogMjMsMzRcIiwgXCJwcl9kZXNjcmlwdGlvblwiOiBcImVzdGUgZXMgdW4gcHJvZHVjdG8gZGUgcHJ1ZWJhXCIsIFwicHJfZmluYWxzaXpld2lkdGhcIjogXCIxMDAuMDBcIiwgXCJwcl9maW5hbHNpemVoZWlnaHRcIjogXCIyMDAuMDBcIiwgXCJwcl9maW5hbHNpemVtZWFzdXJlXCI6IFwiY21cIiwgXCJwcl9pbmtmcm9udFwiOiAyLCBcInByX2lua3Nmcm9udFwiOiB7IFwiMFwiOiAyLCBcIjFcIjogMiB9LCBcInByX2lua2JhY2tcIjogMywgXCJwcl9pbmtzYmFja1wiOiB7IFwiMFwiOiAyLCBcIjFcIjogMywgXCIyXCI6IDMgfSwgXCJwYV9pZFwiOiAxLCBcInByX3BhcGVyZm9ybWF0c3F0eVwiOiBcIjEyM1wiLCBcInByX3BhcGVyc2l6ZXdpZHRoXCI6IFwiMTAwLjAwXCIsIFwicHJfcGFwZXJzaXplaGVpZ2h0XCI6IFwiMjAwLjAwXCIsIFwicHJfcGFwZXJzaXplbWVhc3VyZVwiOiBcImNtXCIsIFwicHJfdmFybmlzaFwiOiBcInllc1wiLCBcInByX3Zhcm5pc2h1dlwiOiBcIm9uZXNpZGVcIiwgXCJwcl92YXJuaXNoZmluaXNoZWRcIjogXCJtYXR0ZVwiLCBcInByX2xhbWluYXRlXCI6IFwieWVzXCIsIFwicHJfbGFtaW5hdGVmaW5pc2hlZFwiOiBcIm1hdHRlXCIsIFwicHJfbGFtaW5hdGVjYWxpYmVyXCI6IFwiMm1tXCIsIFwicHJfcHJlY3V0XCI6IFwiaG9yaXpvbnRhbFwiLCBcInByX2ZvbGRcIjogXCJ0cnlwdGljXCIsIFwicHJfZGllY3V0dGluZ1wiOiBcInllc1wiLCBcInByX2RpZWN1dHRpbmdxdHlcIjogXCI1XCIsIFwicHJfcmVpbmZvcmNlbWVudFwiOiBcIm9uZVwiLCBcInByX2NvcmRcIjogXCJhbGxvY2F0ZWRcIiwgXCJwcl93aXJlXCI6IFwiYWxsb2NhdGVkXCIsIFwicHJfZm9saW9cIjogXCJ5ZXNcIiwgXCJwcl9ibG9ja3NcIjogXCIxMDBcIiwgXCJwcl9zdGF0dXNcIjogXCJBXCIgfTtcbiAgICAgICAgICAgICRzY29wZS5mbURhdGEucHJfcHJvY2VzcyA9ICdvZmZzZXQnO1xuICAgICAgICAgICAgJHNjb3BlLmZtRGF0YS5wcl90eXBlID0gJ2dlbmVyYWwnO1xuICAgICAgICAgICAgJHNjb3BlLmZtRGF0YS5jbF9pZCA9ICRzdGF0ZVBhcmFtcy5jbF9pZDtcblxuICAgICAgICAgICAgJHNjb3BlLm9uU3VibWl0ID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgcHJvZHVjdE9mZnNldEdlbmVyYWxBZGRGYWMuYWRkKCRzY29wZS5mbURhdGEpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb21pc2UuZGF0YS5yb3dDb3VudCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9wcm9kdWN0LycrJHN0YXRlUGFyYW1zLmNsX2lkKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS51cGRhdGVGYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgJHNjb3BlLnByX2ZpbmFsc2l6ZW1lYXN1cmVvcHRpb25zID0gaTE4bkZpbHRlcihcInByb2R1Y3RPZmZzZXRHZW5lcmFsLWFkZC5maWVsZHMucHJfZmluYWxzaXplbWVhc3VyZW9wdGlvbnNcIik7XG4gICAgICAgICAgICAkc2NvcGUucHJfaW5rZnJvbnRvcHRpb25zID0gaTE4bkZpbHRlcihcInByb2R1Y3RPZmZzZXRHZW5lcmFsLWFkZC5maWVsZHMucHJfaW5rZnJvbnRvcHRpb25zXCIpO1xuICAgICAgICAgICAgJHNjb3BlLnByX2lua2JhY2tvcHRpb25zID0gaTE4bkZpbHRlcihcInByb2R1Y3RPZmZzZXRHZW5lcmFsLWFkZC5maWVsZHMucHJfaW5rYmFja29wdGlvbnNcIik7XG4gICAgICAgICAgICAkc2NvcGUucHJfcGFwZXJzaXplbWVhc3VyZW9wdGlvbnMgPSBpMThuRmlsdGVyKFwicHJvZHVjdE9mZnNldEdlbmVyYWwtYWRkLmZpZWxkcy5wcl9wYXBlcnNpemVtZWFzdXJlb3B0aW9uc1wiKTtcbiAgICAgICAgICAgICRzY29wZS5wcl92YXJuaXNob3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJwcm9kdWN0T2Zmc2V0R2VuZXJhbC1hZGQuZmllbGRzLnByX3Zhcm5pc2hvcHRpb25zXCIpO1xuICAgICAgICAgICAgJHNjb3BlLnByX3Zhcm5pc2h1dm9wdGlvbnMgPSBpMThuRmlsdGVyKFwicHJvZHVjdE9mZnNldEdlbmVyYWwtYWRkLmZpZWxkcy5wcl92YXJuaXNodXZvcHRpb25zXCIpO1xuICAgICAgICAgICAgJHNjb3BlLnByX3Zhcm5pc2ZpbmlzaGVkb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJwcm9kdWN0T2Zmc2V0R2VuZXJhbC1hZGQuZmllbGRzLnByX3Zhcm5pc2ZpbmlzaGVkb3B0aW9uc1wiKTtcbiAgICAgICAgICAgICRzY29wZS5wcl9sYW1pbmF0ZW9wdGlvbnMgPSBpMThuRmlsdGVyKFwicHJvZHVjdE9mZnNldEdlbmVyYWwtYWRkLmZpZWxkcy5wcl9sYW1pbmF0ZW9wdGlvbnNcIik7XG4gICAgICAgICAgICAkc2NvcGUucHJfbGFtaW5hdGVmaW5pc2hlZG9wdGlvbnMgPSBpMThuRmlsdGVyKFwicHJvZHVjdE9mZnNldEdlbmVyYWwtYWRkLmZpZWxkcy5wcl9sYW1pbmF0ZWZpbmlzaGVkb3B0aW9uc1wiKTtcbiAgICAgICAgICAgICRzY29wZS5wcl9sYW1pbmF0ZWNhbGliZXJvcHRpb25zID0gaTE4bkZpbHRlcihcInByb2R1Y3RPZmZzZXRHZW5lcmFsLWFkZC5maWVsZHMucHJfbGFtaW5hdGVjYWxpYmVyb3B0aW9uc1wiKTtcbiAgICAgICAgICAgICRzY29wZS5wcl9sYW1pbmF0ZXNpZGVzb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJwcm9kdWN0T2Zmc2V0R2VuZXJhbC1hZGQuZmllbGRzLnByX2xhbWluYXRlc2lkZXNvcHRpb25zXCIpO1xuICAgICAgICAgICAgJHNjb3BlLnByX2ZvbGlvb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJwcm9kdWN0T2Zmc2V0R2VuZXJhbC1hZGQuZmllbGRzLnByX2ZvbGlvb3B0aW9uc1wiKTtcbiAgICAgICAgICAgICRzY29wZS5wcl9wcmVjdXRvcHRpb25zID0gaTE4bkZpbHRlcihcInByb2R1Y3RPZmZzZXRHZW5lcmFsLWFkZC5maWVsZHMucHJfcHJlY3V0b3B0aW9uc1wiKTtcbiAgICAgICAgICAgICRzY29wZS5wcl9mb2xkb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJwcm9kdWN0T2Zmc2V0R2VuZXJhbC1hZGQuZmllbGRzLnByX2ZvbGRvcHRpb25zXCIpO1xuICAgICAgICAgICAgJHNjb3BlLnByX2RpZWN1dHRpbmdvcHRpb25zID0gaTE4bkZpbHRlcihcInByb2R1Y3RPZmZzZXRHZW5lcmFsLWFkZC5maWVsZHMucHJfZGllY3V0dGluZ29wdGlvbnNcIik7XG4gICAgICAgICAgICAkc2NvcGUucHJfcmVpbmZvcmNlbWVudG9wdGlvbnMgPSBpMThuRmlsdGVyKFwicHJvZHVjdE9mZnNldEdlbmVyYWwtYWRkLmZpZWxkcy5wcl9yZWluZm9yY2VtZW50b3B0aW9uc1wiKTtcbiAgICAgICAgICAgICRzY29wZS5wcl9jb3Jkb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJwcm9kdWN0T2Zmc2V0R2VuZXJhbC1hZGQuZmllbGRzLnByX2NvcmRvcHRpb25zXCIpO1xuICAgICAgICAgICAgJHNjb3BlLnByX3dpcmVvcHRpb25zID0gaTE4bkZpbHRlcihcInByb2R1Y3RPZmZzZXRHZW5lcmFsLWFkZC5maWVsZHMucHJfd2lyZW9wdGlvbnNcIik7XG4gICAgICAgICAgICAkc2NvcGUucHJfYmxvY2tzb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJwcm9kdWN0T2Zmc2V0R2VuZXJhbC1hZGQuZmllbGRzLnByX2Jsb2Nrc29wdGlvbnNcIik7XG4gICAgICAgICAgICAkc2NvcGUucHJfc3RhdHVzb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJwcm9kdWN0T2Zmc2V0R2VuZXJhbC1hZGQuZmllbGRzLnByX3N0YXR1c29wdGlvbnNcIik7XG4gICAgICAgIFxuICAgICAgICAgICAgLy8gY3JlYXRlIGZyb250IGluayBmaWVsZHNcbiAgICAgICAgICAgICRzY29wZS4kd2F0Y2goJ2ZtRGF0YS5wcl9pbmtmcm9udCcsIGZ1bmN0aW9uIChuZXdWYWx1ZSwgb2xkVmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAoJHNjb3BlLmZtRGF0YS5wcl9pbmtmcm9udCAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmZyb250SW5rcyA9IG5ldyBBcnJheShuZXdWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb2xkVmFsdWU7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmZtRGF0YVsncHJfaW5rc2Zyb250J11baV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgICAgICAvLyBjcmVhdGUgYmFjayBpbmsgZmllbGRzXG4gICAgICAgICAgICAkc2NvcGUuJHdhdGNoKCdmbURhdGEucHJfaW5rYmFjaycsIGZ1bmN0aW9uIChuZXdWYWx1ZSwgb2xkVmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAoJHNjb3BlLmZtRGF0YS5wcl9pbmtiYWNrICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuYmFja0lua3MgPSBuZXcgQXJyYXkobmV3VmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG9sZFZhbHVlOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5mbURhdGFbJ3ByX2lua3NiYWNrJ11baV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJHNjb3BlLiRvbignJHZpZXdDb250ZW50TG9hZGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIC8vIHRoaXMgY29kZSBpcyBleGVjdXRlZCBhZnRlciB0aGUgdmlldyBpcyBsb2FkZWRcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHByb2R1Y3RPZmZzZXRHZW5lcmFsQWRkRmFjLmdldENsaWVudCgpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNPYmplY3QocHJvbWlzZS5kYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNsaWVudCA9IHByb21pc2UuZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgcHJvZHVjdE9mZnNldEdlbmVyYWxBZGRGYWMuZ2V0SW5rcygpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUucHJfaW5rb3B0aW9ucyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHByb21pc2UuZGF0YSwgZnVuY3Rpb24gKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnB1c2goeyBcImxhYmVsXCI6IHZhbHVlLmluX2NvZGUsIFwidmFsdWVcIjogdmFsdWUuaW5faWQgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAkc2NvcGUucHJfaW5rb3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyRzY29wZS51cGRhdGVGYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgcHJvZHVjdE9mZnNldEdlbmVyYWxBZGRGYWMuZ2V0UGFwZXJzKCkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5wYV9pZG9wdGlvbnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChwcm9taXNlLmRhdGEsIGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wdXNoKHsgXCJsYWJlbFwiOiB2YWx1ZS5wYV9jb2RlLCBcInZhbHVlXCI6IHZhbHVlLnBhX2lkIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgJHNjb3BlLnBhX2lkb3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyRzY29wZS51cGRhdGVGYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfV07XG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgcmV0dXJuIFsnJGh0dHAnLCAnJHEnLCAgJyRzdGF0ZVBhcmFtcycsIGZ1bmN0aW9uICgkaHR0cCwgJHEsICRzdGF0ZVBhcmFtcykge1xuICAgICAgICB2YXIgZmFjdG9yeSA9IHt9O1xuICAgICAgICBmYWN0b3J5LmdldENsaWVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKFxuICAgICAgICAgICAgICAgICRodHRwLnBvc3QoJy9hcGkvcHJvZHVjdC9vZmZzZXQvZ2VuZXJhbC9jbGllbnQnLCB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICAgICAgY2xfaWQ6ICRzdGF0ZVBhcmFtcy5jbF9pZFxuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICBmYWN0b3J5LmdldElua3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KCcvYXBpL3Byb2R1Y3Qvb2Zmc2V0L2dlbmVyYWwvaW5rJywge1xuICAgICAgICAgICAgICAgICAgICAvKiBQT1NUIHZhcmlhYmxlcyBoZXJlICovXG4gICAgICAgICAgICAgICAgICAgIHByb2NjZXNfaWQ6IG5ldyBEYXRlKCkuZ2V0TWlsbGlzZWNvbmRzKClcbiAgICAgICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeS5nZXRQYXBlcnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KCcvYXBpL3Byb2R1Y3Qvb2Zmc2V0L2dlbmVyYWwvcGFwZXInLCB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICAgICAgcHJvY2Nlc19pZDogbmV3IERhdGUoKS5nZXRNaWxsaXNlY29uZHMoKVxuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICBmYWN0b3J5LmFkZCA9IGZ1bmN0aW9uIChwcl9qc29uYikge1xuICAgICAgICAgICAgdmFyIHByb21pc2UgPSAkaHR0cC5wb3N0KCcvYXBpL3Byb2R1Y3QvYWRkJywge1xuICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICBwcl9qc29uYjogcHJfanNvbmJcbiAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGZhY3Rvcnk7XG4gICAgfV07XG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKGFuZ3VsYXIpe1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBcbiAgICByZXR1cm4gYW5ndWxhci5tb2R1bGUoJ2FwcC5wcm9kdWN0T2Zmc2V0R2VuZXJhbC51cGRhdGUnLFtdKVxuXG4gICAgLmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsXG4gICAgZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgncHJvZHVjdE9mZnNldEdlbmVyYWxVcGRhdGUnLCB7XG4gICAgICAgICAgICB1cmw6Jy9wcm9kdWN0L29mZnNldC9nZW5lcmFsL3VwZGF0ZS86Y2xfaWQvOnByX2lkJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsIDogJ2FwcC9wcm9kdWN0L21vZHVsZXMvcHJvZHVjdE9mZnNldEdlbmVyYWwudXBkYXRlL3Byb2R1Y3RPZmZzZXRHZW5lcmFsLnVwZGF0ZS52aWV3Lmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlciA6ICdwcm9kdWN0T2Zmc2V0R2VuZXJhbFVwZGF0ZUN0cmwnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHJlcXVpcmVzTG9naW46IHRydWVcbiAgICAgICAgICAgIH0gICAgXG4gICAgICAgIH0pO1xuICAgIH1dKVxuXG4gICAgLmZhY3RvcnkoJ3Byb2R1Y3RPZmZzZXRHZW5lcmFsVXBkYXRlRmFjJyxyZXF1aXJlKCcuL3Byb2R1Y3RPZmZzZXRHZW5lcmFsLnVwZGF0ZS5mYWMnKSlcblxuICAgIC5jb250cm9sbGVyKCdwcm9kdWN0T2Zmc2V0R2VuZXJhbFVwZGF0ZUN0cmwnLHJlcXVpcmUoJy4vcHJvZHVjdE9mZnNldEdlbmVyYWwudXBkYXRlLmN0cmwnKSlcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydCA9IHt9IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oYW5ndWxhcil7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIFxuICAgIHJldHVybiBbJyRzY29wZScsICdwcm9kdWN0T2Zmc2V0R2VuZXJhbFVwZGF0ZUZhYycsICckbG9jYXRpb24nLCAnaTE4bkZpbHRlcicsICckc3RhdGVQYXJhbXMnLCAnJGludGVydmFsJyxcbiAgICBmdW5jdGlvbiAoJHNjb3BlLCBwcm9kdWN0T2Zmc2V0R2VuZXJhbFVwZGF0ZUZhYywgJGxvY2F0aW9uLCBpMThuRmlsdGVyLCAkc3RhdGVQYXJhbXMsICRpbnRlcnZhbCkge1xuICAgICAgICBcbiAgICAgICAgJHNjb3BlLm9uU3VibWl0ID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHByb2R1Y3RPZmZzZXRHZW5lcmFsVXBkYXRlRmFjLnVwZGF0ZSgkc2NvcGUuZm1EYXRhKS50aGVuKGZ1bmN0aW9uKHByb21pc2Upe1xuICAgICAgICAgICAgICAgIGlmKHByb21pc2UuZGF0YS5yb3dDb3VudCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3Byb2R1Y3QvJyskc3RhdGVQYXJhbXMuY2xfaWQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS51cGRhdGVGYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICAgICRzY29wZS5nZXRTdGF0ZXMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICRzY29wZS5wcl9zdGF0ZW9wdGlvbnMgPSBbXTtcbiAgICAgICAgICAgICRzY29wZS5wcl9jaXR5b3B0aW9ucyA9IFtdO1xuICAgICAgICAgICAgJHNjb3BlLnByX2NvdW50eW9wdGlvbnMgPSBbXTtcbiAgICAgICAgICAgICRpbnRlcnZhbChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHByb2R1Y3RPZmZzZXRHZW5lcmFsVXBkYXRlRmFjLmdldFN0YXRlcygkc2NvcGUuZm1EYXRhLnByX2NvdW50cnkpLnRoZW4oZnVuY3Rpb24ocHJvbWlzZSl7XG4gICAgICAgICAgICAgICAgICAgIGlmKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEuZ2VvbmFtZXMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUucHJfc3RhdGVvcHRpb25zID0gcHJvbWlzZS5kYXRhLmdlb25hbWVzO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8kc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sMCwxKTtcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS5nZXRDaXR5Q291bnR5ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkc2NvcGUucHJfY2l0eW9wdGlvbnMgPSBbXTtcbiAgICAgICAgICAgICRzY29wZS5wcl9jb3VudHlvcHRpb25zID0gW107XG4gICAgICAgICAgICAkaW50ZXJ2YWwoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBwcm9kdWN0T2Zmc2V0R2VuZXJhbFVwZGF0ZUZhYy5nZXRTdGF0ZXMoJHNjb3BlLmZtRGF0YS5wcl9zdGF0ZSkudGhlbihmdW5jdGlvbihwcm9taXNlKXtcbiAgICAgICAgICAgICAgICAgICAgaWYoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YS5nZW9uYW1lcykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5wcl9jaXR5b3B0aW9ucyA9IHByb21pc2UuZGF0YS5nZW9uYW1lcztcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5wcl9jb3VudHlvcHRpb25zID0gcHJvbWlzZS5kYXRhLmdlb25hbWVzO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8kc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sMCwxKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgJHNjb3BlLnByX3N0YXR1c29wdGlvbnMgPSBpMThuRmlsdGVyKFwicHJvZHVjdE9mZnNldEdlbmVyYWwuZmllbGRzLnByX3N0YXR1c29wdGlvbnNcIik7XG4gICAgICAgIFxuICAgICAgICAkc2NvcGUuJG9uKCckdmlld0NvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyB0aGlzIGNvZGUgaXMgZXhlY3V0ZWQgYWZ0ZXIgdGhlIHZpZXcgaXMgbG9hZGVkXG4gICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG4gICAgICAgICAgICBwcm9kdWN0T2Zmc2V0R2VuZXJhbFVwZGF0ZUZhYy5kYXRhKCkudGhlbihmdW5jdGlvbihwcm9taXNlKXtcbiAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGlmKGFuZ3VsYXIuaXNPYmplY3QoYW5ndWxhci5mcm9tSnNvbihwcm9taXNlLmRhdGEpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmZtRGF0YSA9IGFuZ3VsYXIuZnJvbUpzb24ocHJvbWlzZS5kYXRhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgcHJvZHVjdE9mZnNldEdlbmVyYWxVcGRhdGVGYWMuZ2V0Q291bnRyaWVzKCkudGhlbihmdW5jdGlvbihwcm9taXNlKXtcbiAgICAgICAgICAgICAgICAgICAgaWYoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YS5nZW9uYW1lcykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5wcl9jb3VudHJ5b3B0aW9ucyA9IHByb21pc2UuZGF0YS5nZW9uYW1lcztcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vJHNjb3BlLnVwZGF0ZUZhaWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICBwcm9kdWN0T2Zmc2V0R2VuZXJhbFVwZGF0ZUZhYy5nZXRTdGF0ZXMoJHNjb3BlLmZtRGF0YS5wcl9jb3VudHJ5KS50aGVuKGZ1bmN0aW9uKHByb21pc2Upe1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YS5nZW9uYW1lcykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUucHJfc3RhdGVvcHRpb25zID0gcHJvbWlzZS5kYXRhLmdlb25hbWVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyRzY29wZS51cGRhdGVGYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIHByb2R1Y3RPZmZzZXRHZW5lcmFsVXBkYXRlRmFjLmdldENpdHlDb3VudHkoJHNjb3BlLmZtRGF0YS5wcl9zdGF0ZSkudGhlbihmdW5jdGlvbihwcm9taXNlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEuZ2VvbmFtZXMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnByX2NpdHlvcHRpb25zID0gcHJvbWlzZS5kYXRhLmdlb25hbWVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5wcl9jb3VudHlvcHRpb25zID0gcHJvbWlzZS5kYXRhLmdlb25hbWVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyRzY29wZS51cGRhdGVGYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICB9KTtcbiAgICB9XTtcbiAgICBcbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgcmV0dXJuIFsnJGh0dHAnLCAnJHEnLCAgJyRzdGF0ZVBhcmFtcycsIGZ1bmN0aW9uICgkaHR0cCwgJHEsICRzdGF0ZVBhcmFtcykge1xuICAgICAgICB2YXIgZmFjdG9yeSA9IHt9O1xuICAgICAgICBmYWN0b3J5LmRhdGEgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KCcvYXBpL3Byb2R1Y3Qvb2Zmc2V0L2dlbmVyYWwvcHJvZHVjdCcsIHtcbiAgICAgICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgICAgICBwcl9pZDogJHN0YXRlUGFyYW1zLnByX2lkXG4gICAgICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkudXBkYXRlID0gZnVuY3Rpb24gKHByX2pzb25iKSB7XG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KCcvYXBpL3Byb2R1Y3QvdXBkYXRlJywge1xuICAgICAgICAgICAgICAgICAgICAvKiBQT1NUIHZhcmlhYmxlcyBoZXJlICovXG4gICAgICAgICAgICAgICAgICAgIHByX2lkOiAkc3RhdGVQYXJhbXMucHJfaWQsXG4gICAgICAgICAgICAgICAgICAgIHByX2pzb25iOiBwcl9qc29uYlxuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICBmYWN0b3J5LmdldENvdW50cmllcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gJGh0dHAuanNvbnAoJ2h0dHA6Ly9hcGkuZ2VvbmFtZXMub3JnL2NvdW50cnlJbmZvSlNPTj91c2VybmFtZT1hbGVqYW5kcm9sc2NhJmNhbGxiYWNrPUpTT05fQ0FMTEJBQ0snKVxuICAgICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeS5nZXRTdGF0ZXMgPSBmdW5jdGlvbiAocHJfY291bnRyeSkge1xuICAgICAgICAgICAgdmFyIHByb21pc2UgPSAkaHR0cC5qc29ucCgnaHR0cDovL2FwaS5nZW9uYW1lcy5vcmcvY2hpbGRyZW5KU09OP2dlb25hbWVJZD0nICsgcHJfY291bnRyeSArICcmdXNlcm5hbWU9YWxlamFuZHJvbHNjYSZjYWxsYmFjaz1KU09OX0NBTExCQUNLJylcbiAgICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkuZ2V0Q2l0eUNvdW50eSA9IGZ1bmN0aW9uIChwcl9zdGF0ZSkge1xuICAgICAgICAgICAgdmFyIHByb21pc2UgPSAkaHR0cC5qc29ucCgnaHR0cDovL2FwaS5nZW9uYW1lcy5vcmcvY2hpbGRyZW5KU09OP2dlb25hbWVJZD0nICsgcHJfc3RhdGUgKyAnJnVzZXJuYW1lPWFsZWphbmRyb2xzY2EmY2FsbGJhY2s9SlNPTl9DQUxMQkFDSycpXG4gICAgICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZmFjdG9yeTtcbiAgICB9XTtcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oYW5ndWxhcil7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIFxuICAgIHJldHVybiBhbmd1bGFyLm1vZHVsZSgnYXBwLnByb2R1Y3RPZmZzZXRQYWdpbmF0ZWQuYWRkJyxbXSlcblxuICAgIC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLFxuICAgIGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcbiAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3Byb2R1Y3RPZmZzZXRQYWdpbmF0ZWRBZGQnLCB7XG4gICAgICAgICAgICB1cmw6Jy9wcm9kdWN0L2FkZC9vZmZzZXQvcGFnaW5hdGVkLzpjbF9pZCcsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybCA6ICdhcHAvcHJvZHVjdC9tb2R1bGVzL3Byb2R1Y3RPZmZzZXRQYWdpbmF0ZWQuYWRkL3Byb2R1Y3RPZmZzZXRQYWdpbmF0ZWQuYWRkLnZpZXcuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyIDogJ3Byb2R1Y3RPZmZzZXRQYWdpbmF0ZWRBZGRDdHJsJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICByZXF1aXJlc0xvZ2luOiB0cnVlXG4gICAgICAgICAgICB9ICAgIFxuICAgICAgICB9KTtcbiAgICB9XSlcblxuICAgIC5mYWN0b3J5KCdwcm9kdWN0T2Zmc2V0UGFnaW5hdGVkQWRkRmFjJyxyZXF1aXJlKCcuL3Byb2R1Y3RPZmZzZXRQYWdpbmF0ZWQuYWRkLmZhYycpKVxuXG4gICAgLmNvbnRyb2xsZXIoJ3Byb2R1Y3RPZmZzZXRQYWdpbmF0ZWRBZGRDdHJsJyxyZXF1aXJlKCcuL3Byb2R1Y3RPZmZzZXRQYWdpbmF0ZWQuYWRkLmN0cmwnKSlcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIiA6IFwiQWdyZWdhciBQcm9kdWN0b1wiLFxuICAgICAgICAgICAgICAgICAgICBcImxhYmVsc1wiOntcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItaWRcIjogXCJJRCBwcm9kdWN0b1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbC1pZFwiOiBcIklEIGNsaWVudGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItcHJvY2Vzc1wiOiBcIlByb2Nlc29cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItdHlwZVwiOiBcIlRpcG9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItcGFydG5vXCI6IFwiTm8uIHBhcnRlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLWNvZGVcIjogXCJDb2RpZ29cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItbmFtZVwiOiBcIk5vbWJyZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1kZXNjcmlwdGlvblwiOiBcIkRlc2NyaXBjaW9uXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLWZpbmFsc2l6ZXdpZHRoXCI6IFwiQW5jaG9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItZmluYWxzaXplaGVpZ2h0XCI6IFwiQWx0b1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1maW5hbHNpemVtZWFzdXJlXCI6IFwiTWVkaWRhXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLWlua2Zyb250XCI6IFwiRnJlbnRlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLWlua2JhY2tcIjogXCJSZXZlcnNvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInBhLWlkXCI6IFwiSUQgcGFwZWxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItcGFwZXJzaXpld2lkdGhcIjogXCJBbmNob1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1wYXBlcnNpemVoZWlnaHRcIjogXCJBbHRvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLXBhcGVyc2l6ZW1lYXN1cmVcIjogXCJNZWRpZGFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItcGFwZXJmb3JtYXRzcXR5XCI6IFwiRm9ybWF0b3NcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItdmFybmlzaFwiOiBcIkJhcm5pelwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci12YXJuaXNoZmluaXNoZWRcIjogXCJBY2FiYWRvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLWxhbWluYXRlXCI6IFwiTGFtaW5hZG9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItbGFtaW5hdGVmaW5pc2hlZFwiOiBcIkFjYWJhZG9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItbGFtaW5hdGVjYWxpYmVyXCI6IFwiQ2FsaWJyZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1sYW1pbmF0ZXNpZGVzXCI6IFwiQ2FyYXNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItZm9saW9cIjogXCJGb2xpb1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1wcmVjdXRcIjogXCJQcmVjb3J0ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1mb2xkXCI6IFwiRG9ibGV6XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLWRpZWN1dHRpbmdcIjogXCJTdWFqZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1kaWVjdXR0aW5ncXR5XCI6IFwiTm8uIFN1YWplc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1yZWluZm9yY2VtZW50XCI6IFwiUmVmdWVyem9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItY29yZFwiOiBcIkNvcmTDs25cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItd2lyZVwiOiBcIkFsw6FtYnJlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLXN0YXBsaW5nXCI6IFwiR3JhcGFkb1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1ib3VuZFwiOlwiRW5jdWFkZXJuYWRvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLXNwaXJhbGJpbmRcIjogXCJFbmdhcmdvbGFkb1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwci1ibG9ja3NcIjogXCJCbG9ja3NcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItaW50cGFnZXNcIjpcIk5vLiBkZSBQYWdpbmFzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByLXN0YXR1c1wiOiBcIkVzdGF0dXNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHItZGF0ZVwiOiBcIkZlY2hhXCIsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIFwiY29sdW1uc1wiOltcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfaWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xfaWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfcHJvY2Vzc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl90eXBlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX3BhcnRub1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9jb2RlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX25hbWVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfZGVzY3JpcHRpb25cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfZmluYWxzaXpld2lkdGhcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfZmluYWxzaXplaGVpZ2h0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX2ZpbmFsc2l6ZW1lYXN1cmVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfaW5rZnJvbnRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfaW5rYmFja1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwYV9pZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9wYXBlcnNpemV3aWR0aFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9wYXBlcnNpemVoZWlnaHRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfcGFwZXJzaXplbWVhc3VyZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9wYXBlcmZvcm1hdHNxdHlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfdmFybmlzaFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl92YXJuaXNoZmluaXNoZWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfbGFtaW5hdGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfbGFtaW5hdGVmaW5pc2hlZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9sYW1pbmF0ZWNhbGliZXJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfbGFtaW5hdGVzaWRlc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9mb2xpb1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9wcmVjdXRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfZm9sZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9kaWVjdXR0aW5nXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX2RpZWN1dHRpbmdxdHlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfcmVpbmZvcmNlbWVudFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcl9jb3JkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX3dpcmVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfYmxvY2tzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX3N0YXBsaW5nXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX2JvdW5kXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX3NwaXJhbGJpbmRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfaW50cGFnZXNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJfc3RhdHVzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByX2RhdGVcIixcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgIFwiZmllbGRzXCIgOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcl9maW5hbHNpemVtZWFzdXJlb3B0aW9ucyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiY21cIixcInZhbHVlXCI6XCJjbVwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwicHVsZ2FkYXNcIixcInZhbHVlXCI6XCJpblwifVxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHByX2lua2Zyb250b3B0aW9ucyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiMSB0aW50YVwiLFwidmFsdWVcIjoxfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiMiB0aW50YXNcIixcInZhbHVlXCI6Mn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIjMgdGludGFzXCIsXCJ2YWx1ZVwiOjN9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCI0IHRpbnRhc1wiLFwidmFsdWVcIjo0fSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiNSB0aW50YXNcIixcInZhbHVlXCI6NX0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIjYgdGludGFzXCIsXCJ2YWx1ZVwiOjZ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCI3IHRpbnRhc1wiLFwidmFsdWVcIjo3fSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiOCB0aW50YXNcIixcInZhbHVlXCI6OH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJfaW5rYmFja29wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIjEgdGludGFcIixcInZhbHVlXCI6MX0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIjIgdGludGFzXCIsXCJ2YWx1ZVwiOjJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCIzIHRpbnRhc1wiLFwidmFsdWVcIjozfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiNCB0aW50YXNcIixcInZhbHVlXCI6NH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIjUgdGludGFzXCIsXCJ2YWx1ZVwiOjV9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCI2IHRpbnRhc1wiLFwidmFsdWVcIjo2fSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiNyB0aW50YXNcIixcInZhbHVlXCI6N30sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIjggdGludGFzXCIsXCJ2YWx1ZVwiOjh9LFxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHByX3Zhcm5pc2hvcHRpb25zIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJOb1wiLFwidmFsdWVcIjpcIm5vXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJVbmEgY2FyYVwiLFwidmFsdWVcIjpcIm9uZXNpZGVcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkRvcyBjYXJhc1wiLFwidmFsdWVcIjpcInR3b3NpZGVzXCJ9XG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJfdmFybmlzZmluaXNoZWRvcHRpb25zIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJNYXRlXCIsXCJ2YWx1ZVwiOlwibWF0dGVcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkJyaWxsYW50ZVwiLFwidmFsdWVcIjpcImJyaWdodFwifVxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHByX2xhbWluYXRlb3B0aW9ucyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiTm9cIixcInZhbHVlXCI6XCJub1wifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiVW5hIGNhcmFcIixcInZhbHVlXCI6XCJvbmVzaWRlXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJEb3MgY2FyYXNcIixcInZhbHVlXCI6XCJ0d29zaWRlc1wifSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBwcl9sYW1pbmF0ZWZpbmlzaGVkb3B0aW9ucyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiTWF0ZVwiLFwidmFsdWVcIjpcIm1hdHRlXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJCcmlsbGFudGVcIixcInZhbHVlXCI6XCJicmlnaHRcIn1cbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBwcl9sYW1pbmF0ZWNhbGliZXJvcHRpb25zIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCIuMm1tXCIsXCJ2YWx1ZVwiOlwiMm1tXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCIuNG1tXCIsXCJ2YWx1ZVwiOlwiNG1tXCJ9XG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJfbGFtaW5hdGVzaWRlc29wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIlVuYSBjYXJhXCIsXCJ2YWx1ZVwiOlwib25lc2lkZVwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiRG9zIGNhcmFzXCIsXCJ2YWx1ZVwiOlwidHdvc2lkZXNcIn1cbiAgICAgICAgICAgICAgICAgICAgICAgIF0scHJfZm9saW9vcHRpb25zIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJTaVwiLFwidmFsdWVcIjpcInllc1wifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiTm9cIixcInZhbHVlXCI6XCJub1wifVxuICAgICAgICAgICAgICAgICAgICAgICAgXSxwcl9wcmVjdXRvcHRpb25zIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJOb1wiLFwidmFsdWVcIjpcIm5vXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJIb3Jpem9udGFsXCIsXCJ2YWx1ZVwiOlwiaG9yaXpvbnRhbFwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiVmVydGljYWxcIixcInZhbHVlXCI6XCJ2ZXJ0aWNhbFwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF0scHJfZm9sZG9wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIlRyaXB0aWNvXCIsXCJ2YWx1ZVwiOlwidHJ5cHRpY1wifSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF0scHJfZGllY3V0dGluZ29wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIlNpXCIsXCJ2YWx1ZVwiOlwieWVzXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJOb1wiLFwidmFsdWVcIjpcIm5vXCJ9XG4gICAgICAgICAgICAgICAgICAgICAgICBdLHByX3JlaW5mb3JjZW1lbnRvcHRpb25zIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJOb1wiLFwidmFsdWVcIjpcIm5vXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJVbm9cIixcInZhbHVlXCI6XCJvbmVcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkRvc1wiLFwidmFsdWVcIjpcInR3b1wifSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF0scHJfY29yZG9wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIk5vXCIsXCJ2YWx1ZVwiOlwibm9cIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkNvbG9jYWRvXCIsXCJ2YWx1ZVwiOlwiYWxsb2NhdGVkXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJTZXBhcmFkb1wiLFwidmFsdWVcIjpcInNlcGFyYXRlZFwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF0scHJfd2lyZW9wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIk5vXCIsXCJ2YWx1ZVwiOlwibm9cIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkNvbG9jYWRvXCIsXCJ2YWx1ZVwiOlwiYWxsb2NhdGVkXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJTZXBhcmFkb1wiLFwidmFsdWVcIjpcInNlcGFyYXRlZFwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF0scHJfc3RhcGxpbmdvcHRpb25zIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJOb1wiLFwidmFsdWVcIjpcIm5vXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJVbmEgZ3JhcGFcIixcInZhbHVlXCI6XCIxXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJEb3MgZ3JhcGFzXCIsXCJ2YWx1ZVwiOlwiMlwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF0scHJfYm91bmRvcHRpb25zIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJOb1wiLFwidmFsdWVcIjpcIm5vXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJTaVwiLFwidmFsdWVcIjpcInllc1wifSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF0scHJfc3BpcmFsYmluZG9wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIlBsYXN0aWNvXCIsXCJ2YWx1ZVwiOlwicGxhc3RpY1wifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiTWV0YWxcIixcInZhbHVlXCI6XCJtZXRhbFwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF0scHJfYmxvY2tzb3B0aW9ucyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiTm9cIixcInZhbHVlXCI6XCJub1wifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiMjBcIixcInZhbHVlXCI6XCIyMFwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiMjVcIixcInZhbHVlXCI6XCIyNVwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiNTBcIixcInZhbHVlXCI6XCI1MFwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiNzVcIixcInZhbHVlXCI6XCI3NVwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJsYWJlbFwiOlwiMTAwXCIsXCJ2YWx1ZVwiOlwiMTAwXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHByX3N0YXR1c29wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkFjdGl2b1wiLFwidmFsdWVcIjpcIkFcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkluYWN0aXZvXCIsXCJ2YWx1ZVwiOlwiSVwifVxuICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0iLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbihhbmd1bGFyKXtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgXG4gICAgcmV0dXJuIFsnJHNjb3BlJywgJ3Byb2R1Y3RPZmZzZXRQYWdpbmF0ZWRBZGRGYWMnLCAnJGxvY2F0aW9uJywgJ2kxOG5GaWx0ZXInLCAnJHN0YXRlUGFyYW1zJyxcbiAgICBmdW5jdGlvbiAoJHNjb3BlLCBwcm9kdWN0T2Zmc2V0UGFnaW5hdGVkQWRkRmFjLCAkbG9jYXRpb24sIGkxOG5GaWx0ZXIsICRzdGF0ZVBhcmFtcykge1xuICAgICAgICAkc2NvcGUuZm1EYXRhID0ge307XG4gICAgICAgICRzY29wZS5mbURhdGEgPSB7IFwicHJfcHJvY2Vzc1wiOiBcIm9mZnNldFwiLCBcInByX3R5cGVcIjogXCJwYWdpbmF0ZWRcIiwgXCJjbF9pZFwiOiBcIjZcIiwgXCJwcl9wYXJ0bm9cIjogXCJURVNULUFTQS5hc2FzOiAyMywzNFwiLCBcInByX2Rlc2NyaXB0aW9uXCI6IFwiZXN0ZSBlcyB1biBwcm9kdWN0byBkZSBwcnVlYmFcIiwgXCJwcl9maW5hbHNpemV3aWR0aFwiOiBcIjEwMC4wMFwiLCBcInByX2ZpbmFsc2l6ZWhlaWdodFwiOiBcIjIwMC4wMFwiLCBcInByX2ZpbmFsc2l6ZW1lYXN1cmVcIjogXCJjbVwiLCBcInByX2lua2Zyb250XCI6IDIsIFwicHJfaW5rc2Zyb250XCI6IHsgXCIwXCI6IFwiMlwiLCBcIjFcIjogXCIzXCIgfSwgXCJwcl9pbmtiYWNrXCI6IDIsIFwicHJfaW5rc2JhY2tcIjogeyBcIjBcIjogXCIyXCIsIFwiMVwiOiBcIjJcIiB9LCBcInBhX2lkXCI6IFwiMVwiLCBcInByX3BhcGVyZm9ybWF0c3F0eVwiOiBcIjEyM1wiLCBcInByX3BhcGVyc2l6ZXdpZHRoXCI6IFwiMTAwLjAwXCIsIFwicHJfcGFwZXJzaXplaGVpZ2h0XCI6IFwiMjAwLjAwXCIsIFwicHJfcGFwZXJzaXplbWVhc3VyZVwiOiBcImNtXCIsIFwicHJfdmFybmlzaFwiOiBcIm9uZXNpZGVcIiwgXCJwcl92YXJuaXNoZmluaXNoZWRcIjogXCJtYXR0ZVwiLCBcInByX2xhbWluYXRlXCI6IFwidHdvc2lkZXNcIiwgXCJwcl9sYW1pbmF0ZWZpbmlzaGVkXCI6IFwibWF0dGVcIiwgXCJwcl9sYW1pbmF0ZWNhbGliZXJcIjogXCIybW1cIiwgXCJwcl9wcmVjdXRcIjogXCJob3Jpem9udGFsXCIsIFwicHJfZm9sZFwiOiBcInRyeXB0aWNcIiwgXCJwcl9kaWVjdXR0aW5nXCI6IFwieWVzXCIsIFwicHJfZGllY3V0dGluZ3F0eVwiOiBcIjVcIiwgXCJwcl9yZWluZm9yY2VtZW50XCI6IFwib25lXCIsIFwicHJfY29yZFwiOiBcImFsbG9jYXRlZFwiLCBcInByX3dpcmVcIjogXCJhbGxvY2F0ZWRcIiwgXCJwcl9mb2xpb1wiOiBcInllc1wiLCBcInByX2Jsb2Nrc1wiOiBcIjEwMFwiLCBcInByX3N0YXR1c1wiOiBcIkFcIiwgXCJwcl9pbnRpbmtmcm9udFwiOiAyLCBcInByX2ludGlua3Nmcm9udFwiOiB7IFwiMFwiOiBcIjJcIiwgXCIxXCI6IFwiM1wiIH0sIFwicHJfaW50aW5rYmFja1wiOiAyLCBcInByX2ludGlua3NiYWNrXCI6IHsgXCIwXCI6IFwiMlwiLCBcIjFcIjogXCIzXCIgfSwgXCJwcl9pbnRwYWdlc1wiOiBcIjEwMFwiLCBcInBhX2ludGlkXCI6IFwiMVwiLCBcInByX2ludHBhcGVyZm9ybWF0c3F0eVwiOiBcIjUwMFwiLCBcInByX3N0YXBsaW5nXCI6IFwiMlwiLCBcInByX2JvdW5kXCI6IFwieWVzXCIsIFwicHJfc3BpcmFsYmluZFwiOiBcInBsYXN0aWNcIiwgXCJwcl9uYW1lXCI6IFwiYXNkYXNkYXNcIiwgXCJwcl9jb2RlXCI6IFwiYXNkYXNkXCIgfTtcbiAgICAgICAgXG4gICAgICAgICRzY29wZS5mbURhdGEucHJfcHJvY2VzcyA9ICdvZmZzZXQnO1xuICAgICAgICAkc2NvcGUuZm1EYXRhLnByX3R5cGUgPSAncGFnaW5hdGVkJztcbiAgICAgICAgJHNjb3BlLmZtRGF0YS5jbF9pZCA9ICRzdGF0ZVBhcmFtcy5jbF9pZDtcblxuICAgICAgICAkc2NvcGUub25TdWJtaXQgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgcHJvZHVjdE9mZnNldFBhZ2luYXRlZEFkZEZhYy5hZGQoJHNjb3BlLmZtRGF0YSkudGhlbihmdW5jdGlvbihwcm9taXNlKXtcbiAgICAgICAgICAgICAgICBpZihwcm9taXNlLmRhdGEucm93Q291bnQgPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3Byb2R1Y3QvJyskc3RhdGVQYXJhbXMuY2xfaWQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS51cGRhdGVGYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICAgICRzY29wZS5wcl9maW5hbHNpemVtZWFzdXJlb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJwcm9kdWN0T2Zmc2V0UGFnaW5hdGVkLWFkZC5maWVsZHMucHJfZmluYWxzaXplbWVhc3VyZW9wdGlvbnNcIik7XG4gICAgICAgICRzY29wZS5wcl9pbmtmcm9udG9wdGlvbnMgPSBpMThuRmlsdGVyKFwicHJvZHVjdE9mZnNldFBhZ2luYXRlZC1hZGQuZmllbGRzLnByX2lua2Zyb250b3B0aW9uc1wiKTtcbiAgICAgICAgJHNjb3BlLnByX2lua2JhY2tvcHRpb25zID0gaTE4bkZpbHRlcihcInByb2R1Y3RPZmZzZXRQYWdpbmF0ZWQtYWRkLmZpZWxkcy5wcl9pbmtiYWNrb3B0aW9uc1wiKTtcbiAgICAgICAgJHNjb3BlLnByX3Zhcm5pc2hvcHRpb25zID0gaTE4bkZpbHRlcihcInByb2R1Y3RPZmZzZXRQYWdpbmF0ZWQtYWRkLmZpZWxkcy5wcl92YXJuaXNob3B0aW9uc1wiKTtcbiAgICAgICAgJHNjb3BlLnByX3Zhcm5pc2ZpbmlzaGVkb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJwcm9kdWN0T2Zmc2V0UGFnaW5hdGVkLWFkZC5maWVsZHMucHJfdmFybmlzZmluaXNoZWRvcHRpb25zXCIpO1xuICAgICAgICAkc2NvcGUucHJfbGFtaW5hdGVvcHRpb25zID0gaTE4bkZpbHRlcihcInByb2R1Y3RPZmZzZXRQYWdpbmF0ZWQtYWRkLmZpZWxkcy5wcl9sYW1pbmF0ZW9wdGlvbnNcIik7XG4gICAgICAgICRzY29wZS5wcl9sYW1pbmF0ZWZpbmlzaGVkb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJwcm9kdWN0T2Zmc2V0UGFnaW5hdGVkLWFkZC5maWVsZHMucHJfbGFtaW5hdGVmaW5pc2hlZG9wdGlvbnNcIik7XG4gICAgICAgICRzY29wZS5wcl9sYW1pbmF0ZWNhbGliZXJvcHRpb25zID0gaTE4bkZpbHRlcihcInByb2R1Y3RPZmZzZXRQYWdpbmF0ZWQtYWRkLmZpZWxkcy5wcl9sYW1pbmF0ZWNhbGliZXJvcHRpb25zXCIpO1xuICAgICAgICAkc2NvcGUucHJfbGFtaW5hdGVzaWRlc29wdGlvbnMgPSBpMThuRmlsdGVyKFwicHJvZHVjdE9mZnNldFBhZ2luYXRlZC1hZGQuZmllbGRzLnByX2xhbWluYXRlc2lkZXNvcHRpb25zXCIpO1xuICAgICAgICAkc2NvcGUucHJfZm9saW9vcHRpb25zID0gaTE4bkZpbHRlcihcInByb2R1Y3RPZmZzZXRQYWdpbmF0ZWQtYWRkLmZpZWxkcy5wcl9mb2xpb29wdGlvbnNcIik7XG4gICAgICAgICRzY29wZS5wcl9wcmVjdXRvcHRpb25zID0gaTE4bkZpbHRlcihcInByb2R1Y3RPZmZzZXRQYWdpbmF0ZWQtYWRkLmZpZWxkcy5wcl9wcmVjdXRvcHRpb25zXCIpO1xuICAgICAgICAkc2NvcGUucHJfZm9sZG9wdGlvbnMgPSBpMThuRmlsdGVyKFwicHJvZHVjdE9mZnNldFBhZ2luYXRlZC1hZGQuZmllbGRzLnByX2ZvbGRvcHRpb25zXCIpO1xuICAgICAgICAkc2NvcGUucHJfZGllY3V0dGluZ29wdGlvbnMgPSBpMThuRmlsdGVyKFwicHJvZHVjdE9mZnNldFBhZ2luYXRlZC1hZGQuZmllbGRzLnByX2RpZWN1dHRpbmdvcHRpb25zXCIpO1xuICAgICAgICAkc2NvcGUucHJfcmVpbmZvcmNlbWVudG9wdGlvbnMgPSBpMThuRmlsdGVyKFwicHJvZHVjdE9mZnNldFBhZ2luYXRlZC1hZGQuZmllbGRzLnByX3JlaW5mb3JjZW1lbnRvcHRpb25zXCIpO1xuICAgICAgICAkc2NvcGUucHJfY29yZG9wdGlvbnMgPSBpMThuRmlsdGVyKFwicHJvZHVjdE9mZnNldFBhZ2luYXRlZC1hZGQuZmllbGRzLnByX2NvcmRvcHRpb25zXCIpO1xuICAgICAgICAkc2NvcGUucHJfd2lyZW9wdGlvbnMgPSBpMThuRmlsdGVyKFwicHJvZHVjdE9mZnNldFBhZ2luYXRlZC1hZGQuZmllbGRzLnByX3dpcmVvcHRpb25zXCIpO1xuICAgICAgICAkc2NvcGUucHJfc3RhcGxpbmdvcHRpb25zID0gaTE4bkZpbHRlcihcInByb2R1Y3RPZmZzZXRQYWdpbmF0ZWQtYWRkLmZpZWxkcy5wcl9zdGFwbGluZ29wdGlvbnNcIik7XG4gICAgICAgICRzY29wZS5wcl9ib3VuZG9wdGlvbnMgPSBpMThuRmlsdGVyKFwicHJvZHVjdE9mZnNldFBhZ2luYXRlZC1hZGQuZmllbGRzLnByX2JvdW5kb3B0aW9uc1wiKTtcbiAgICAgICAgJHNjb3BlLnByX3NwaXJhbGJpbmRvcHRpb25zID0gaTE4bkZpbHRlcihcInByb2R1Y3RPZmZzZXRQYWdpbmF0ZWQtYWRkLmZpZWxkcy5wcl9zcGlyYWxiaW5kb3B0aW9uc1wiKTtcbiAgICAgICAgJHNjb3BlLnByX2Jsb2Nrc29wdGlvbnMgPSBpMThuRmlsdGVyKFwicHJvZHVjdE9mZnNldFBhZ2luYXRlZC1hZGQuZmllbGRzLnByX2Jsb2Nrc29wdGlvbnNcIik7XG4gICAgICAgICRzY29wZS5wcl9zdGF0dXNvcHRpb25zID0gaTE4bkZpbHRlcihcInByb2R1Y3RPZmZzZXRQYWdpbmF0ZWQtYWRkLmZpZWxkcy5wcl9zdGF0dXNvcHRpb25zXCIpO1xuICAgICAgICBcbiAgICAgICAgLy8gY3JlYXRlIGZyb250IGluayBmaWVsZHNcbiAgICAgICAgJHNjb3BlLiR3YXRjaCgnZm1EYXRhLnByX2lua2Zyb250JywgZnVuY3Rpb24obmV3VmFsdWUsIG9sZFZhbHVlKSB7XG4gICAgICAgICAgICBpZigkc2NvcGUuZm1EYXRhLnByX2lua2Zyb250ICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICRzY29wZS5mcm9udElua3MgPSBuZXcgQXJyYXkobmV3VmFsdWUpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaTxuZXdWYWx1ZTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKG9sZFZhbHVlICE9IG5ld1ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZm1EYXRhWydwcl9pbmtzZnJvbnQnXVtpXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICAvLyBjcmVhdGUgYmFjayBpbmsgZmllbGRzXG4gICAgICAgICRzY29wZS4kd2F0Y2goJ2ZtRGF0YS5wcl9pbmtiYWNrJywgZnVuY3Rpb24obmV3VmFsdWUsIG9sZFZhbHVlKSB7XG4gICAgICAgICAgICBpZigkc2NvcGUuZm1EYXRhLnByX2lua2JhY2sgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmJhY2tJbmtzID0gbmV3IEFycmF5KG5ld1ZhbHVlKTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpPTA7IGk8b2xkVmFsdWU7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZihvbGRWYWx1ZSAhPSBuZXdWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmZtRGF0YVsncHJfaW5rc2JhY2snXVtpXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICAvLyBjcmVhdGUgZnJvbnQgaW50ZXJpb3IgaW5rIGZpZWxkc1xuICAgICAgICAkc2NvcGUuJHdhdGNoKCdmbURhdGEucHJfaW50aW5rZnJvbnQnLCBmdW5jdGlvbihuZXdWYWx1ZSwgb2xkVmFsdWUpIHtcbiAgICAgICAgICAgIGlmKCRzY29wZS5mbURhdGEucHJfaW50aW5rZnJvbnQgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmludEZyb250SW5rcyA9IG5ldyBBcnJheShuZXdWYWx1ZSk7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpPG5ld1ZhbHVlOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYob2xkVmFsdWUgIT0gbmV3VmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5mbURhdGFbJ3ByX2ludGlua3Nmcm9udCddW2ldID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIC8vIGNyZWF0ZSBiYWNrIGludGVyaW9yIGluayBmaWVsZHNcbiAgICAgICAgJHNjb3BlLiR3YXRjaCgnZm1EYXRhLnByX2ludGlua2JhY2snLCBmdW5jdGlvbihuZXdWYWx1ZSwgb2xkVmFsdWUpIHtcbiAgICAgICAgICAgIGlmKCRzY29wZS5mbURhdGEucHJfaW50aW5rYmFjayAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUuaW50QmFja0lua3MgPSBuZXcgQXJyYXkobmV3VmFsdWUpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaTxvbGRWYWx1ZTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKG9sZFZhbHVlICE9IG5ld1ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZm1EYXRhWydwcl9pbnRpbmtzYmFjayddW2ldID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAkc2NvcGUuJG9uKCckdmlld0NvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyB0aGlzIGNvZGUgaXMgZXhlY3V0ZWQgYWZ0ZXIgdGhlIHZpZXcgaXMgbG9hZGVkXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHByb2R1Y3RPZmZzZXRQYWdpbmF0ZWRBZGRGYWMuZ2V0Q2xpZW50KCkudGhlbihmdW5jdGlvbihwcm9taXNlKXtcbiAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGlmKGFuZ3VsYXIuaXNPYmplY3QocHJvbWlzZS5kYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuY2xpZW50ID0gcHJvbWlzZS5kYXRhO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBwcm9kdWN0T2Zmc2V0UGFnaW5hdGVkQWRkRmFjLmdldElua3MoKS50aGVuKGZ1bmN0aW9uKHByb21pc2Upe1xuICAgICAgICAgICAgICAgIGlmKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5wcl9pbmtvcHRpb25zID0gW107XG4gICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChwcm9taXNlLmRhdGEsZnVuY3Rpb24odmFsdWUsIGtleSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHVzaCh7XCJsYWJlbFwiOnZhbHVlLmluX2NvZGUsXCJ2YWx1ZVwiOnZhbHVlLmluX2lkfSk7XG4gICAgICAgICAgICAgICAgICAgIH0sJHNjb3BlLnByX2lua29wdGlvbnMpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vJHNjb3BlLnVwZGF0ZUZhaWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBwcm9kdWN0T2Zmc2V0UGFnaW5hdGVkQWRkRmFjLmdldFBhcGVycygpLnRoZW4oZnVuY3Rpb24ocHJvbWlzZSl7XG4gICAgICAgICAgICAgICAgaWYoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnBhX2lkb3B0aW9ucyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2gocHJvbWlzZS5kYXRhLGZ1bmN0aW9uKHZhbHVlLCBrZXkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wdXNoKHtcImxhYmVsXCI6dmFsdWUucGFfY29kZSxcInZhbHVlXCI6dmFsdWUucGFfaWQsIFwid2lkdGhcIjogdmFsdWUucGFfd2lkdGgsIFwiaGVpZ2h0XCI6IHZhbHVlLnBhX2hlaWdodCwgXCJtZWFzdXJlXCI6IHZhbHVlLnBhX21lYXN1cmV9KTtcbiAgICAgICAgICAgICAgICAgICAgfSwkc2NvcGUucGFfaWRvcHRpb25zKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyRzY29wZS51cGRhdGVGYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICBcbiAgICAgICAgIH0pO1xuICAgIH1dO1xuICAgIFxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckaHR0cCcsICckcScsICAnJHN0YXRlUGFyYW1zJywgZnVuY3Rpb24gKCRodHRwLCAkcSwgJHN0YXRlUGFyYW1zKSB7XG4gICAgICAgIHZhciBmYWN0b3J5ID0ge307XG4gICAgICAgIGZhY3RvcnkuZ2V0Q2xpZW50ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoXG4gICAgICAgICAgICAgICAgJGh0dHAucG9zdCgnL2FwaS9wcm9kdWN0L29mZnNldC9nZW5lcmFsL2NsaWVudCcsIHtcbiAgICAgICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgICAgICBjbF9pZDogJHN0YXRlUGFyYW1zLmNsX2lkXG4gICAgICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkuZ2V0SW5rcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKFxuICAgICAgICAgICAgICAgICRodHRwLnBvc3QoJy9hcGkvcHJvZHVjdC9vZmZzZXQvZ2VuZXJhbC9pbmsnLCB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICAgICAgcHJvY2Nlc19pZDogbmV3IERhdGUoKS5nZXRNaWxsaXNlY29uZHMoKVxuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICBmYWN0b3J5LmdldFBhcGVycyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKFxuICAgICAgICAgICAgICAgICRodHRwLnBvc3QoJy9hcGkvcHJvZHVjdC9vZmZzZXQvZ2VuZXJhbC9wYXBlcicsIHtcbiAgICAgICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgICAgICBwcm9jY2VzX2lkOiBuZXcgRGF0ZSgpLmdldE1pbGxpc2Vjb25kcygpXG4gICAgICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkuYWRkID0gZnVuY3Rpb24gKHByX2pzb25iKSB7XG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9ICRodHRwLnBvc3QoJy9hcGkvcHJvZHVjdC9hZGQnLCB7XG4gICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgIHByX2pzb25iOiBwcl9qc29uYlxuICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZmFjdG9yeTtcbiAgICB9XTtcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckc2NvcGUnLCAncHJvZHVjdEZhYycsICdpMThuRmlsdGVyJyxcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgcHJvZHVjdEZhYywgaTE4bkZpbHRlcikge1xuXG4gICAgICAgICAgICAkc2NvcGUubGFiZWxzID0gT2JqZWN0LmtleXMoaTE4bkZpbHRlcihcInByb2R1Y3QubGFiZWxzXCIpKTtcbiAgICAgICAgICAgICRzY29wZS5jb2x1bW5zID0gaTE4bkZpbHRlcihcInByb2R1Y3QuY29sdW1uc1wiKTtcbiAgICAgICAgXG4gICAgICAgICAgICAvL3NldCBRUiBDb2RlIGRhdGEgZGVmYXVsdHNcbiAgICAgICAgICAgICRzY29wZS5xcmNvZGVTdHJpbmcgPSAnWU9VUiBURVhUIFRPIEVOQ09ERSc7XG4gICAgICAgICAgICAkc2NvcGUuc2l6ZSA9IDI1MDtcbiAgICAgICAgICAgICRzY29wZS5jb3JyZWN0aW9uTGV2ZWwgPSAnJztcbiAgICAgICAgICAgICRzY29wZS50eXBlTnVtYmVyID0gMDtcbiAgICAgICAgICAgICRzY29wZS5pbnB1dE1vZGUgPSAnJztcbiAgICAgICAgICAgICRzY29wZS5pbWFnZSA9IHRydWU7XG4gICAgICAgIFxuICAgICAgICAgICAgLy9RUiBDb2RlIG1vZGFsXG4gICAgICAgICAgICAkKCcjbXlNb2RhbCcpLm9uKCdzaG93LmJzLm1vZGFsJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgdmFyIGJ1dHRvbiA9ICQoZXZlbnQucmVsYXRlZFRhcmdldCk7IC8vIEJ1dHRvbiB0aGF0IHRyaWdnZXJlZCB0aGUgbW9kYWxcbiAgICAgICAgICAgICAgICAkc2NvcGUucXJjb2RlU3RyaW5nID0gYnV0dG9uLmRhdGEoJ2NvZGVfZGF0YScpOy8vIEV4dHJhY3QgaW5mbyBmcm9tIGRhdGEtKiBhdHRyaWJ1dGVzXG4gICAgICAgICAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgXG4gICAgICAgICAgICAvLyBmb3JtYXRJdGVtIGV2ZW50IGhhbmRsZXJcbiAgICAgICAgICAgIHZhciBwcl9pZDtcbiAgICAgICAgICAgIHZhciBjbF9pZDtcbiAgICAgICAgICAgIHZhciBwcl9wcm9jZXNzO1xuICAgICAgICAgICAgdmFyIHByX3R5cGU7XG4gICAgICAgICAgICB2YXIgY29kZV9kYXRhO1xuICAgICAgICAgICAgJHNjb3BlLmZvcm1hdEl0ZW0gPSBmdW5jdGlvbiAocywgZSwgY2VsbCkge1xuXG4gICAgICAgICAgICAgICAgaWYgKGUucGFuZWwuY2VsbFR5cGUgPT0gd2lqbW8uZ3JpZC5DZWxsVHlwZS5Sb3dIZWFkZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgZS5jZWxsLnRleHRDb250ZW50ID0gZS5yb3cgKyAxO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHMucm93cy5kZWZhdWx0U2l6ZSA9IDMwO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gYWRkIEJvb3RzdHJhcCBodG1sXG4gICAgICAgICAgICAgICAgaWYgKChlLnBhbmVsLmNlbGxUeXBlID09IHdpam1vLmdyaWQuQ2VsbFR5cGUuQ2VsbCkgJiYgKGUuY29sID09IDApKSB7XG4gICAgICAgICAgICAgICAgICAgIHByX2lkID0gZS5wYW5lbC5nZXRDZWxsRGF0YShlLnJvdywgMSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBjbF9pZCA9IGUucGFuZWwuZ2V0Q2VsbERhdGEoZS5yb3csIDIsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgcHJfcHJvY2VzcyA9IGUucGFuZWwuZ2V0Q2VsbERhdGEoZS5yb3csIDYsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgcHJfdHlwZSA9IGUucGFuZWwuZ2V0Q2VsbERhdGEoZS5yb3csIDcsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgY29kZV9kYXRhID0gKGZ1bmN0aW9uICgpIHsgLy9RUiBDb2RlIGRhdGEgZnJvbSBjb2x1bW5zIFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRleHQgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgJHNjb3BlLmxhYmVscy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQgKz0gaTE4bkZpbHRlcihcInByb2R1Y3QubGFiZWxzLlwiICsgJHNjb3BlLmxhYmVsc1tpXSkgKyAnOiAnICsgZS5wYW5lbC5nZXRDZWxsRGF0YShlLnJvdywgKGkgKyAxKSwgZmFsc2UpICsgJ1xcbidcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0ZXh0O1xuICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICBlLmNlbGwuc3R5bGUub3ZlcmZsb3cgPSAndmlzaWJsZSc7XG4gICAgICAgICAgICAgICAgICAgIGUuY2VsbC5pbm5lckhUTUwgPSAnPGRpdiBjbGFzcz1cImJ0bi1ncm91cCBidG4tZ3JvdXAtanVzdGlmaWVkXCIgcm9sZT1cImdyb3VwXCIgYXJpYS1sYWJlbD1cIi4uLlwiPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJ0bi1ncm91cFwiIHJvbGU9XCJncm91cFwiPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIjL3Byb2R1Y3QvJysgcHJfcHJvY2VzcyArICcvJyArIHByX3R5cGUgKyAnL3VwZGF0ZS8nICsgY2xfaWQgKyAnLycgKyBwcl9pZCArICdcIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdCBidG4teHNcIiBuZy1jbGljaz1cImVkaXQoJGl0ZW0uY2xfaWQpXCI+RWRpdGFyPC9hPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYnRuLWdyb3VwXCIgcm9sZT1cImdyb3VwXCI+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgZGF0YS10b2dnbGU9XCJtb2RhbFwiIGRhdGEtdGFyZ2V0PVwiI215TW9kYWxcIiBkYXRhLWNvZGVfZGF0YT1cIicrIGNvZGVfZGF0YSArICdcIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdCBidG4teHNcIj5RUiBDb2RlPC9hPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2Pic7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgICAgIC8vIGJpbmQgY29sdW1ucyB3aGVuIGdyaWQgaXMgaW5pdGlhbGl6ZWRcbiAgICAgICAgICAgICRzY29wZS5pbml0R3JpZCA9IGZ1bmN0aW9uIChzLCBlKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAkc2NvcGUubGFiZWxzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjb2wgPSBuZXcgd2lqbW8uZ3JpZC5Db2x1bW4oKTtcbiAgICAgICAgICAgICAgICAgICAgY29sLmJpbmRpbmcgPSAkc2NvcGUuY29sdW1uc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgY29sLmhlYWRlciA9IGkxOG5GaWx0ZXIoXCJwcm9kdWN0LmxhYmVscy5cIiArICRzY29wZS5sYWJlbHNbaV0pO1xuICAgICAgICAgICAgICAgICAgICBjb2wud29yZFdyYXAgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgY29sLndpZHRoID0gMTUwO1xuICAgICAgICAgICAgICAgICAgICBzLmNvbHVtbnMucHVzaChjb2wpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICAvLyBjcmVhdGUgdGhlIHRvb2x0aXAgb2JqZWN0XG4gICAgICAgICAgICAkc2NvcGUuJHdhdGNoKCdnZ0dyaWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCRzY29wZS5nZ0dyaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIC8vIHN0b3JlIHJlZmVyZW5jZSB0byBncmlkXG4gICAgICAgICAgICAgICAgICAgIHZhciBmbGV4ID0gJHNjb3BlLmdnR3JpZDtcblxuICAgICAgICAgICAgICAgICAgICAvLyBjcmVhdGUgdG9vbHRpcFxuICAgICAgICAgICAgICAgICAgICB2YXIgdGlwID0gbmV3IHdpam1vLlRvb2x0aXAoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJuZyA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gbW9uaXRvciB0aGUgbW91c2Ugb3ZlciB0aGUgZ3JpZFxuICAgICAgICAgICAgICAgICAgICBmbGV4Lmhvc3RFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBodCA9IGZsZXguaGl0VGVzdChldnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFodC5yYW5nZS5lcXVhbHMocm5nKSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbmV3IGNlbGwgc2VsZWN0ZWQsIHNob3cgdG9vbHRpcFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChodC5jZWxsVHlwZSA9PSB3aWptby5ncmlkLkNlbGxUeXBlLkNlbGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm5nID0gaHQucmFuZ2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb2wgPSBmbGV4LmNvbHVtbnNbcm5nLmNvbF0uaGVhZGVyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2VsbEVsZW1lbnQgPSBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KGV2dC5jbGllbnRYLCBldnQuY2xpZW50WSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjZWxsQm91bmRzID0gd2lqbW8uUmVjdC5mcm9tQm91bmRpbmdSZWN0KGNlbGxFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEgPSB3aWptby5lc2NhcGVIdG1sKGZsZXguZ2V0Q2VsbERhdGEocm5nLnJvdywgcm5nLmNvbCwgdHJ1ZSkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlwQ29udGVudCA9IGNvbCArICc6IFwiPGI+JyArIGRhdGEgKyAnPC9iPlwiJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNlbGxFbGVtZW50LmNsYXNzTmFtZS5pbmRleE9mKCd3ai1jZWxsJykgPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlwLnNob3coZmxleC5ob3N0RWxlbWVudCwgdGlwQ29udGVudCwgY2VsbEJvdW5kcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXAuaGlkZSgpOyAvLyBjZWxsIG11c3QgYmUgYmVoaW5kIHNjcm9sbCBiYXIuLi5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGZsZXguaG9zdEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXAuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcm5nID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICRzY29wZS4kb24oJyR2aWV3Q29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAvLyB0aGlzIGNvZGUgaXMgZXhlY3V0ZWQgYWZ0ZXIgdGhlIHZpZXcgaXMgbG9hZGVkXG4gICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHByb2R1Y3RGYWMuZGF0YSgpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZGF0YSA9IG5ldyB3aWptby5jb2xsZWN0aW9ucy5Db2xsZWN0aW9uVmlldyhwcm9taXNlLmRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfV07XG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgcmV0dXJuIFsnJGh0dHAnLCAnJHEnLCAgJyRzdGF0ZVBhcmFtcycsIGZ1bmN0aW9uICgkaHR0cCwgJHEsICRzdGF0ZVBhcmFtcykge1xuICAgICAgICB2YXIgZmFjdG9yeSA9IHt9O1xuICAgICAgICBmYWN0b3J5LmRhdGEgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KCcvYXBpL3Byb2R1Y3QvY2xfaWQnLCB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICAgICAgcHJvY2Nlc19pZDogbmV3IERhdGUoKS5nZXRNaWxsaXNlY29uZHMoKSxcbiAgICAgICAgICAgICAgICAgICAgY2xfaWQ6ICRzdGF0ZVBhcmFtcy5jbF9pZCxcbiAgICAgICAgICAgICAgICAgICAgcHJfc3RhdHVzOiAnQSdcbiAgICAgICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogIGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBmYWN0b3J5O1xuICAgIH1dO1xuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbihhbmd1bGFyKXtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgXG4gICAgcmV0dXJuIGFuZ3VsYXIubW9kdWxlKCdhcHAuc3VwcGxpZXInLFtcbiAgICAgICAgcmVxdWlyZSgnLi9tb2R1bGVzL3N1cHBsaWVyLmFkZCcpLm5hbWUsXG4gICAgICAgIHJlcXVpcmUoJy4vbW9kdWxlcy9zdXBwbGllci51cGRhdGUnKS5uYW1lXG4gICAgXSlcblxuICAgIC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLFxuICAgIGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcbiAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3N1cHBsaWVyJywge1xuICAgICAgICAgICAgdXJsOicvc3VwcGxpZXInLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmwgOiAnYXBwL3N1cHBsaWVyL3N1cHBsaWVyLnZpZXcuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyIDogJ3N1cHBsaWVyQ3RybCcsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgcmVxdWlyZXNMb2dpbjogdHJ1ZVxuICAgICAgICAgICAgfSAgICBcbiAgICAgICAgfSk7XG4gICAgfV0pXG5cbiAgICAuZmFjdG9yeSgnc3VwcGxpZXJGYWMnLHJlcXVpcmUoJy4vc3VwcGxpZXIuZmFjJykpXG5cbiAgICAuY29udHJvbGxlcignc3VwcGxpZXJDdHJsJyxyZXF1aXJlKCcuL3N1cHBsaWVyLmN0cmwnKSlcbiAgICBcbn0pKGFuZ3VsYXIpO1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIiA6IFwiUHJvdmVlZG9yZXNcIixcbiAgICAgICAgICAgICAgICAgICAgXCJsYWJlbHNcIjp7XG4gICAgICAgICAgICAgICAgICAgICAgICBcInN1LWlkXCI6XCJpZCBwcm92ZWVkb3JcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3UtY29ycG9yYXRlbmFtZVwiOlwicmF6w7NuIHNvY2lhbFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdS10aW5cIjpcInJmY1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdS1uYW1lXCI6XCJub21icmVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3UtZmF0aGVyc2xhc3RuYW1lXCI6XCJhcGVsbGlkbyBwYXRlcm5vXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN1LW1vdGhlcnNsYXN0bmFtZVwiOlwiYXBlbGxpZG8gbWF0ZXJub1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdS1zdHJlZXRcIjpcImNhbGxlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN1LXN0cmVldG51bWJlclwiOlwibnVtZXJvIGV4dGVyaW9yXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN1LXN1aXRlbnVtYmVyXCI6XCJudW1lcm8gaW50ZXJpb3JcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3UtbmVpZ2hib3Job29kXCI6XCJjb2xvbmlhXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN1LWFkZHJlc3NyZWZlcmVuY2VcIjpcInJlZmVyZW5jaWFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3UtY291bnRyeVwiOlwicGHDrXNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3Utc3RhdGVcIjpcImVzdGFkb1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdS1jaXR5XCI6XCJjaXVkYWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3UtY291bnR5XCI6XCJtdW5pY2lwaW9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3UtemlwY29kZVwiOlwiY29kaWdvIHBvc3RhbFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdS1lbWFpbFwiOlwiY29ycmVvIGVsZWN0csOzbmljb1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdS1waG9uZVwiOlwidGVsw6lmb25vXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN1LW1vYmlsZVwiOlwibcOzdmlsXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN1LXN0YXR1c1wiOlwiZXN0YXR1c1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdS1kYXRlXCI6XCJmZWNoYVwiLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgXCJjb2x1bW5zXCI6W1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdV9pZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdV9jb3Jwb3JhdGVuYW1lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN1X3RpblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdV9uYW1lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN1X2ZhdGhlcnNsYXN0bmFtZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdV9tb3RoZXJzbGFzdG5hbWVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3Vfc3RyZWV0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN1X3N0cmVldG51bWJlclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdV9zdWl0ZW51bWJlclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdV9uZWlnaGJvcmhvb2RcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3VfYWRkcmVzc3JlZmVyZW5jZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdV9jb3VudHJ5XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN1X3N0YXRlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN1X2NpdHlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3VfY291bnR5XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN1X3ppcGNvZGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3VfZW1haWxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3VfcGhvbmVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3VfbW9iaWxlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN1X3N0YXR1c1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdV9kYXRlXCIsXG4gICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgXCJmaWVsZHNcIiA6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1X3N0YXR1c29wdGlvbnMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkFjdGl2b1wiLFwidmFsdWVcIjpcIkFcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibGFiZWxcIjpcIkluYWN0aXZvXCIsXCJ2YWx1ZVwiOlwiSVwifVxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oYW5ndWxhcil7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIFxuICAgIHJldHVybiBhbmd1bGFyLm1vZHVsZSgnYXBwLnN1cHBsaWVyLmFkZCcsW10pXG5cbiAgICAuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJyxcbiAgICBmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdzdXBwbGllckFkZCcsIHtcbiAgICAgICAgICAgIHVybDonL3N1cHBsaWVyL2FkZCcsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybCA6ICdhcHAvc3VwcGxpZXIvbW9kdWxlcy9zdXBwbGllci5hZGQvc3VwcGxpZXIuYWRkLnZpZXcuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyIDogJ3N1cHBsaWVyQWRkQ3RybCcsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgcmVxdWlyZXNMb2dpbjogdHJ1ZVxuICAgICAgICAgICAgfSAgICBcbiAgICAgICAgfSk7XG4gICAgfV0pXG5cbiAgICAuZmFjdG9yeSgnc3VwcGxpZXJBZGRGYWMnLHJlcXVpcmUoJy4vc3VwcGxpZXIuYWRkLmZhYycpKVxuXG4gICAgLmNvbnRyb2xsZXIoJ3N1cHBsaWVyQWRkQ3RybCcscmVxdWlyZSgnLi9zdXBwbGllci5hZGQuY3RybCcpKVxuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiIDogXCJhZ3JlZ2FyIHByb3ZlZWRvclwiLFxuICAgICAgICAgICAgICAgIH0iLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbihhbmd1bGFyKXtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgXG4gICAgcmV0dXJuIFsnJHNjb3BlJywgJ3N1cHBsaWVyQWRkRmFjJywgJyRsb2NhdGlvbicsICdpMThuRmlsdGVyJywgJyRpbnRlcnZhbCcsXG4gICAgZnVuY3Rpb24gKCRzY29wZSwgc3VwcGxpZXJBZGRGYWMsICRsb2NhdGlvbiwgaTE4bkZpbHRlciwgJGludGVydmFsKSB7XG4gICAgICAgICRzY29wZS5mbURhdGEgPSB7fTtcblxuICAgICAgICAkc2NvcGUub25TdWJtaXQgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgc3VwcGxpZXJBZGRGYWMuYWRkKCRzY29wZS5mbURhdGEpLnRoZW4oZnVuY3Rpb24ocHJvbWlzZSl7XG4gICAgICAgICAgICAgICAgaWYocHJvbWlzZS5kYXRhID09IFwiMVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvc3VwcGxpZXInKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLmdldFN0YXRlcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJHNjb3BlLnN1X3N0YXRlb3B0aW9ucyA9IFtdO1xuICAgICAgICAgICAgJHNjb3BlLnN1X2NpdHlvcHRpb25zID0gW107XG4gICAgICAgICAgICAkc2NvcGUuc3VfY291bnR5b3B0aW9ucyA9IFtdO1xuICAgICAgICAgICAgJGludGVydmFsKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgc3VwcGxpZXJBZGRGYWMuZ2V0U3RhdGVzKCRzY29wZS5mbURhdGEuc3VfY291bnRyeSkudGhlbihmdW5jdGlvbihwcm9taXNlKXtcbiAgICAgICAgICAgICAgICAgICAgaWYoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YS5nZW9uYW1lcykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5zdV9zdGF0ZW9wdGlvbnMgPSBwcm9taXNlLmRhdGEuZ2VvbmFtZXM7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyRzY29wZS51cGRhdGVGYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSwwLDEpO1xuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLmdldENpdHlDb3VudHkgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICRzY29wZS5zdV9jaXR5b3B0aW9ucyA9IFtdO1xuICAgICAgICAgICAgJHNjb3BlLnN1X2NvdW50eW9wdGlvbnMgPSBbXTtcbiAgICAgICAgICAgICRpbnRlcnZhbChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHN1cHBsaWVyQWRkRmFjLmdldFN0YXRlcygkc2NvcGUuZm1EYXRhLnN1X3N0YXRlKS50aGVuKGZ1bmN0aW9uKHByb21pc2Upe1xuICAgICAgICAgICAgICAgICAgICBpZihhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhLmdlb25hbWVzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnN1X2NpdHlvcHRpb25zID0gcHJvbWlzZS5kYXRhLmdlb25hbWVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnN1X2NvdW50eW9wdGlvbnMgPSBwcm9taXNlLmRhdGEuZ2VvbmFtZXM7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyRzY29wZS51cGRhdGVGYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSwwLDEpO1xuICAgICAgICB9O1xuICAgICAgICBcbiAgICAgICAgJHNjb3BlLnN1X3N0YXR1c29wdGlvbnMgPSBpMThuRmlsdGVyKFwic3VwcGxpZXIuZmllbGRzLnN1X3N0YXR1c29wdGlvbnNcIik7XG5cbiAgICAgICAgJHNjb3BlLiRvbignJHZpZXdDb250ZW50TG9hZGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLy8gdGhpcyBjb2RlIGlzIGV4ZWN1dGVkIGFmdGVyIHRoZSB2aWV3IGlzIGxvYWRlZFxuICAgICAgICAgICAgXG4gICAgICAgICAgICBzdXBwbGllckFkZEZhYy5nZXRDb3VudHJpZXMoKS50aGVuKGZ1bmN0aW9uKHByb21pc2Upe1xuICAgICAgICAgICAgICAgIGlmKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEuZ2VvbmFtZXMpKSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5zdV9jb3VudHJ5b3B0aW9ucyA9IHByb21pc2UuZGF0YS5nZW9uYW1lcztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyRzY29wZS51cGRhdGVGYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgfSk7XG4gICAgfV07XG4gICAgXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRodHRwJywgJyRxJywgICckc3RhdGVQYXJhbXMnLCBmdW5jdGlvbiAoJGh0dHAsICRxLCAkc3RhdGVQYXJhbXMpIHtcbiAgICAgICAgdmFyIGZhY3RvcnkgPSB7fTtcbiAgICAgICAgZmFjdG9yeS5hZGQgPSBmdW5jdGlvbiAoc3VfanNvbmIpIHtcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gJGh0dHAucG9zdCgnbW9kdWxlcy9zdXBwbGllci9tb2R1bGVzL3N1cHBsaWVyLmFkZC9zdXBwbGllci5hZGQubWRsLmFkZC5waHAnLCB7XG4gICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgIHN1X2pzb25iOiBzdV9qc29uYlxuICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICBmYWN0b3J5LmdldENvdW50cmllcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gJGh0dHAuZ2V0KCdodHRwOi8vYXBpLmdlb25hbWVzLm9yZy9jb3VudHJ5SW5mb0pTT04/dXNlcm5hbWU9YWxlamFuZHJvbHNjYScpXG4gICAgICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICBmYWN0b3J5LmdldFN0YXRlcyA9IGZ1bmN0aW9uIChzdV9jb3VudHJ5KSB7XG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9ICRodHRwLmdldCgnaHR0cDovL2FwaS5nZW9uYW1lcy5vcmcvY2hpbGRyZW5KU09OP2dlb25hbWVJZD0nICsgc3VfY291bnRyeSArICcmdXNlcm5hbWU9YWxlamFuZHJvbHNjYScpXG4gICAgICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICBmYWN0b3J5LmdldENpdHlDb3VudHkgPSBmdW5jdGlvbiAoc3Vfc3RhdGUpIHtcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gJGh0dHAuZ2V0KCdodHRwOi8vYXBpLmdlb25hbWVzLm9yZy9jaGlsZHJlbkpTT04/Z2VvbmFtZUlkPScgKyBzdV9zdGF0ZSArICcmdXNlcm5hbWU9YWxlamFuZHJvbHNjYScpXG4gICAgICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZmFjdG9yeTtcbiAgICB9XTtcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oYW5ndWxhcil7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIFxuICAgIHJldHVybiBhbmd1bGFyLm1vZHVsZSgnYXBwLnN1cHBsaWVyLnVwZGF0ZScsW10pXG5cbiAgICAuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJyxcbiAgICBmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdzdXBwbGllclVwZGF0ZScsIHtcbiAgICAgICAgICAgIHVybDonL3N1cHBsaWVyL3VwZGF0ZS86c3VfaWQnLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmwgOiAnYXBwL3N1cHBsaWVyL21vZHVsZXMvc3VwcGxpZXIudXBkYXRlL3N1cHBsaWVyLnVwZGF0ZS52aWV3Lmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlciA6ICdzdXBwbGllclVwZGF0ZUN0cmwnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHJlcXVpcmVzTG9naW46IHRydWVcbiAgICAgICAgICAgIH0gICAgXG4gICAgICAgIH0pO1xuICAgIH1dKVxuXG4gICAgLmZhY3RvcnkoJ3N1cHBsaWVyVXBkYXRlRmFjJyxyZXF1aXJlKCcuL3N1cHBsaWVyLnVwZGF0ZS5mYWMnKSlcblxuICAgIC5jb250cm9sbGVyKCdzdXBwbGllclVwZGF0ZUN0cmwnLHJlcXVpcmUoJy4vc3VwcGxpZXIudXBkYXRlLmN0cmwnKSlcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIiA6IFwiYWN0dWFsaXphciBwcm92ZWVkb3JcIixcbiAgICAgICAgICAgICAgICB9IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckc2NvcGUnLCAnc3VwcGxpZXJVcGRhdGVGYWMnLCAnJGxvY2F0aW9uJywgJ2kxOG5GaWx0ZXInLCAnJGludGVydmFsJyxcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgc3VwcGxpZXJVcGRhdGVGYWMsICRsb2NhdGlvbiwgaTE4bkZpbHRlciwgJGludGVydmFsKSB7XG5cbiAgICAgICAgICAgICRzY29wZS5vblN1Ym1pdCA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgIHN1cHBsaWVyVXBkYXRlRmFjLnVwZGF0ZSgkc2NvcGUuZm1EYXRhKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9taXNlLmRhdGEgPT0gXCIxXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvc3VwcGxpZXInKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS51cGRhdGVGYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgJHNjb3BlLmdldFN0YXRlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUuc3Vfc3RhdGVvcHRpb25zID0gW107XG4gICAgICAgICAgICAgICAgJHNjb3BlLnN1X2NpdHlvcHRpb25zID0gW107XG4gICAgICAgICAgICAgICAgJHNjb3BlLnN1X2NvdW50eW9wdGlvbnMgPSBbXTtcbiAgICAgICAgICAgICAgICAkaW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBzdXBwbGllclVwZGF0ZUZhYy5nZXRTdGF0ZXMoJHNjb3BlLmZtRGF0YS5zdV9jb3VudHJ5KS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YS5nZW9uYW1lcykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuc3Vfc3RhdGVvcHRpb25zID0gcHJvbWlzZS5kYXRhLmdlb25hbWVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyRzY29wZS51cGRhdGVGYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSwgMCwgMSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICRzY29wZS5nZXRDaXR5Q291bnR5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICRzY29wZS5zdV9jaXR5b3B0aW9ucyA9IFtdO1xuICAgICAgICAgICAgICAgICRzY29wZS5zdV9jb3VudHlvcHRpb25zID0gW107XG4gICAgICAgICAgICAgICAgJGludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgc3VwcGxpZXJVcGRhdGVGYWMuZ2V0U3RhdGVzKCRzY29wZS5mbURhdGEuc3Vfc3RhdGUpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhLmdlb25hbWVzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5zdV9jaXR5b3B0aW9ucyA9IHByb21pc2UuZGF0YS5nZW9uYW1lcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuc3VfY291bnR5b3B0aW9ucyA9IHByb21pc2UuZGF0YS5nZW9uYW1lcztcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8kc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sIDAsIDEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkc2NvcGUuc3Vfc3RhdHVzb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJzdXBwbGllci5maWVsZHMuc3Vfc3RhdHVzb3B0aW9uc1wiKTtcblxuICAgICAgICAgICAgJHNjb3BlLiRvbignJHZpZXdDb250ZW50TG9hZGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIC8vIHRoaXMgY29kZSBpcyBleGVjdXRlZCBhZnRlciB0aGUgdmlldyBpcyBsb2FkZWRcbiAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgc3VwcGxpZXJVcGRhdGVGYWMuZGF0YSgpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNPYmplY3QoYW5ndWxhci5mcm9tSnNvbihwcm9taXNlLmRhdGEpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmZtRGF0YSA9IGFuZ3VsYXIuZnJvbUpzb24ocHJvbWlzZS5kYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBzdXBwbGllclVwZGF0ZUZhYy5nZXRDb3VudHJpZXMoKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YS5nZW9uYW1lcykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuc3VfY291bnRyeW9wdGlvbnMgPSBwcm9taXNlLmRhdGEuZ2VvbmFtZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vJHNjb3BlLnVwZGF0ZUZhaWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1cHBsaWVyVXBkYXRlRmFjLmdldFN0YXRlcygkc2NvcGUuZm1EYXRhLnN1X2NvdW50cnkpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YS5nZW9uYW1lcykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnN1X3N0YXRlb3B0aW9ucyA9IHByb21pc2UuZGF0YS5nZW9uYW1lcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyRzY29wZS51cGRhdGVGYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1cHBsaWVyVXBkYXRlRmFjLmdldENpdHlDb3VudHkoJHNjb3BlLmZtRGF0YS5zdV9zdGF0ZSkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhLmdlb25hbWVzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuc3VfY2l0eW9wdGlvbnMgPSBwcm9taXNlLmRhdGEuZ2VvbmFtZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5zdV9jb3VudHlvcHRpb25zID0gcHJvbWlzZS5kYXRhLmdlb25hbWVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vJHNjb3BlLnVwZGF0ZUZhaWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfV07XG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKGFuZ3VsYXIpe1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBcbiAgICByZXR1cm4gWyckaHR0cCcsICckcScsICAnJHN0YXRlUGFyYW1zJywgZnVuY3Rpb24oJGh0dHAsICRxLCAkc3RhdGVQYXJhbXMpe1xuICAgICAgICB2YXIgZmFjdG9yeSA9IHt9O1xuICAgICAgICBmYWN0b3J5LmRhdGEgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKFxuICAgICAgICAgICAgICAgICRodHRwLnBvc3QoJ21vZHVsZXMvc3VwcGxpZXIvbW9kdWxlcy9zdXBwbGllci51cGRhdGUvc3VwcGxpZXIudXBkYXRlLm1kbC5nZXRzdXBwbGllci5waHAnLCB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICAgICAgc3VfaWQ6ICRzdGF0ZVBhcmFtcy5zdV9pZFxuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcInN0YXR1c1wiOiBmYWxzZX07XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeS51cGRhdGUgPSBmdW5jdGlvbihzdV9qc29uYikge1xuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoXG4gICAgICAgICAgICAgICAgJGh0dHAucG9zdCgnbW9kdWxlcy9zdXBwbGllci9tb2R1bGVzL3N1cHBsaWVyLnVwZGF0ZS9zdXBwbGllci51cGRhdGUubWRsLnVwZGF0ZS5waHAnLCB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICAgICAgc3VfaWQ6ICRzdGF0ZVBhcmFtcy5zdV9pZCxcbiAgICAgICAgICAgICAgICAgICAgc3VfanNvbmI6IHN1X2pzb25iXG4gICAgICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZyl7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1wic3RhdHVzXCI6IGZhbHNlfTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICBmYWN0b3J5LmdldENvdW50cmllcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHByb21pc2UgPSAkaHR0cC5nZXQoJ2h0dHA6Ly9hcGkuZ2VvbmFtZXMub3JnL2NvdW50cnlJbmZvSlNPTj91c2VybmFtZT1hbGVqYW5kcm9sc2NhJylcbiAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XCJzdGF0dXNcIjogZmFsc2V9O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeS5nZXRTdGF0ZXMgPSBmdW5jdGlvbihzdV9jb3VudHJ5KSB7XG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9ICRodHRwLmdldCgnaHR0cDovL2FwaS5nZW9uYW1lcy5vcmcvY2hpbGRyZW5KU09OP2dlb25hbWVJZD0nK3N1X2NvdW50cnkrJyZ1c2VybmFtZT1hbGVqYW5kcm9sc2NhJylcbiAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcInN0YXR1c1wiOiBmYWxzZX07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICBmYWN0b3J5LmdldENpdHlDb3VudHkgPSBmdW5jdGlvbihzdV9zdGF0ZSkge1xuICAgICAgICAgICAgdmFyIHByb21pc2UgPSAkaHR0cC5nZXQoJ2h0dHA6Ly9hcGkuZ2VvbmFtZXMub3JnL2NoaWxkcmVuSlNPTj9nZW9uYW1lSWQ9JytzdV9zdGF0ZSsnJnVzZXJuYW1lPWFsZWphbmRyb2xzY2EnKVxuICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpe1xuICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1wic3RhdHVzXCI6IGZhbHNlfTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBmYWN0b3J5O1xuICAgIH1dO1xuICAgIFxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckc2NvcGUnLCAnc3VwcGxpZXJGYWMnLCAnaTE4bkZpbHRlcicsXG4gICAgICAgIGZ1bmN0aW9uICgkc2NvcGUsIHN1cHBsaWVyRmFjLCBpMThuRmlsdGVyKSB7XG5cbiAgICAgICAgICAgICRzY29wZS5sYWJlbHMgPSBPYmplY3Qua2V5cyhpMThuRmlsdGVyKFwic3VwcGxpZXIubGFiZWxzXCIpKTtcbiAgICAgICAgICAgICRzY29wZS5jb2x1bW5zID0gaTE4bkZpbHRlcihcInN1cHBsaWVyLmNvbHVtbnNcIik7XG4gICAgICAgIFxuICAgICAgICAgICAgLy8gZm9ybWF0SXRlbSBldmVudCBoYW5kbGVyXG4gICAgICAgICAgICB2YXIgc3VfaWQ7XG4gICAgICAgICAgICAkc2NvcGUuZm9ybWF0SXRlbSA9IGZ1bmN0aW9uIChzLCBlLCBjZWxsKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoZS5wYW5lbC5jZWxsVHlwZSA9PSB3aWptby5ncmlkLkNlbGxUeXBlLlJvd0hlYWRlcikge1xuICAgICAgICAgICAgICAgICAgICBlLmNlbGwudGV4dENvbnRlbnQgPSBlLnJvdyArIDE7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcy5yb3dzLmRlZmF1bHRTaXplID0gMzA7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBhZGQgQm9vdHN0cmFwIGh0bWxcbiAgICAgICAgICAgICAgICBpZiAoKGUucGFuZWwuY2VsbFR5cGUgPT0gd2lqbW8uZ3JpZC5DZWxsVHlwZS5DZWxsKSAmJiAoZS5jb2wgPT0gMCkpIHtcbiAgICAgICAgICAgICAgICAgICAgc3VfaWQgPSBlLnBhbmVsLmdldENlbGxEYXRhKGUucm93LCAxLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGUuY2VsbC5zdHlsZS5vdmVyZmxvdyA9ICd2aXNpYmxlJztcbiAgICAgICAgICAgICAgICAgICAgZS5jZWxsLmlubmVySFRNTCA9ICc8ZGl2IGNsYXNzPVwiYnRuLWdyb3VwIGJ0bi1ncm91cC1qdXN0aWZpZWRcIiByb2xlPVwiZ3JvdXBcIiBhcmlhLWxhYmVsPVwiLi4uXCI+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYnRuLWdyb3VwXCIgcm9sZT1cImdyb3VwXCI+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cIiMvc3VwcGxpZXIvdXBkYXRlLycrIHN1X2lkICsgJ1wiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0IGJ0bi14c1wiIG5nLWNsaWNrPVwiZWRpdCgkaXRlbS5zdV9pZClcIj5FZGl0YXI8L2E+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+JztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAgICAgLy8gYmluZCBjb2x1bW5zIHdoZW4gZ3JpZCBpcyBpbml0aWFsaXplZFxuICAgICAgICAgICAgJHNjb3BlLmluaXRHcmlkID0gZnVuY3Rpb24gKHMsIGUpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8ICRzY29wZS5sYWJlbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbCA9IG5ldyB3aWptby5ncmlkLkNvbHVtbigpO1xuICAgICAgICAgICAgICAgICAgICBjb2wuYmluZGluZyA9ICRzY29wZS5jb2x1bW5zW2ldO1xuICAgICAgICAgICAgICAgICAgICBjb2wuaGVhZGVyID0gaTE4bkZpbHRlcihcInN1cHBsaWVyLmxhYmVscy5cIiArICRzY29wZS5sYWJlbHNbaV0pO1xuICAgICAgICAgICAgICAgICAgICBjb2wud29yZFdyYXAgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgY29sLndpZHRoID0gMTUwO1xuICAgICAgICAgICAgICAgICAgICBzLmNvbHVtbnMucHVzaChjb2wpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICAvLyBjcmVhdGUgdGhlIHRvb2x0aXAgb2JqZWN0XG4gICAgICAgICAgICAkc2NvcGUuJHdhdGNoKCdnZ0dyaWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCRzY29wZS5nZ0dyaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIC8vIHN0b3JlIHJlZmVyZW5jZSB0byBncmlkXG4gICAgICAgICAgICAgICAgICAgIHZhciBmbGV4ID0gJHNjb3BlLmdnR3JpZDtcblxuICAgICAgICAgICAgICAgICAgICAvLyBjcmVhdGUgdG9vbHRpcFxuICAgICAgICAgICAgICAgICAgICB2YXIgdGlwID0gbmV3IHdpam1vLlRvb2x0aXAoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJuZyA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gbW9uaXRvciB0aGUgbW91c2Ugb3ZlciB0aGUgZ3JpZFxuICAgICAgICAgICAgICAgICAgICBmbGV4Lmhvc3RFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBodCA9IGZsZXguaGl0VGVzdChldnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFodC5yYW5nZS5lcXVhbHMocm5nKSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbmV3IGNlbGwgc2VsZWN0ZWQsIHNob3cgdG9vbHRpcFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChodC5jZWxsVHlwZSA9PSB3aWptby5ncmlkLkNlbGxUeXBlLkNlbGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm5nID0gaHQucmFuZ2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb2wgPSBmbGV4LmNvbHVtbnNbcm5nLmNvbF0uaGVhZGVyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2VsbEVsZW1lbnQgPSBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KGV2dC5jbGllbnRYLCBldnQuY2xpZW50WSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjZWxsQm91bmRzID0gd2lqbW8uUmVjdC5mcm9tQm91bmRpbmdSZWN0KGNlbGxFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEgPSB3aWptby5lc2NhcGVIdG1sKGZsZXguZ2V0Q2VsbERhdGEocm5nLnJvdywgcm5nLmNvbCwgdHJ1ZSkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlwQ29udGVudCA9IGNvbCArICc6IFwiPGI+JyArIGRhdGEgKyAnPC9iPlwiJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNlbGxFbGVtZW50LmNsYXNzTmFtZS5pbmRleE9mKCd3ai1jZWxsJykgPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlwLnNob3coZmxleC5ob3N0RWxlbWVudCwgdGlwQ29udGVudCwgY2VsbEJvdW5kcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXAuaGlkZSgpOyAvLyBjZWxsIG11c3QgYmUgYmVoaW5kIHNjcm9sbCBiYXIuLi5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGZsZXguaG9zdEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXAuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcm5nID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICRzY29wZS4kb24oJyR2aWV3Q29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAvLyB0aGlzIGNvZGUgaXMgZXhlY3V0ZWQgYWZ0ZXIgdGhlIHZpZXcgaXMgbG9hZGVkXG4gICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHN1cHBsaWVyRmFjLmRhdGEoKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmRhdGEgPSBuZXcgd2lqbW8uY29sbGVjdGlvbnMuQ29sbGVjdGlvblZpZXcocHJvbWlzZS5kYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1dO1xuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRodHRwJywgJyRxJywgIGZ1bmN0aW9uICgkaHR0cCwgJHEpIHtcbiAgICAgICAgdmFyIGZhY3RvcnkgPSB7fTtcbiAgICAgICAgZmFjdG9yeS5kYXRhID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoXG4gICAgICAgICAgICAgICAgJGh0dHAucG9zdCgnbW9kdWxlcy9zdXBwbGllci9zdXBwbGllci5tZGwuZ2V0c3VwcGxpZXJzLnBocCcsIHtcbiAgICAgICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgICAgICBwcm9jY2VzX2lkOiBuZXcgRGF0ZSgpLmdldE1pbGxpc2Vjb25kcygpXG4gICAgICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZmFjdG9yeTtcbiAgICB9XTtcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oYW5ndWxhcil7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIFxuICAgIHJldHVybiBhbmd1bGFyLm1vZHVsZSgnYXBwLnVzZXInLFtcbiAgICAgICAgcmVxdWlyZSgnLi9tb2R1bGVzL3VzZXIuYWRkJykubmFtZSxcbiAgICAgICAgcmVxdWlyZSgnLi9tb2R1bGVzL3VzZXIudXBkYXRlJykubmFtZSxcbiAgICAgICAgcmVxdWlyZSgnLi9tb2R1bGVzL3VzZXIucHJvZmlsZScpLm5hbWVcbiAgICBdKVxuXG4gICAgLmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsXG4gICAgZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgndXNlcicsIHtcbiAgICAgICAgICAgIHVybDonL3VzZXInLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmwgOiAnYXBwL3VzZXIvdXNlci52aWV3Lmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlciA6ICd1c2VyQ3RybCcsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgcmVxdWlyZXNMb2dpbjogdHJ1ZVxuICAgICAgICAgICAgfSAgICBcbiAgICAgICAgfSk7XG4gICAgfV0pXG5cbiAgICAuZmFjdG9yeSgndXNlckZhYycscmVxdWlyZSgnLi91c2VyLmZhYycpKVxuXG4gICAgLmNvbnRyb2xsZXIoJ3VzZXJDdHJsJyxyZXF1aXJlKCcuL3VzZXIuY3RybCcpKVxuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiIDogXCJ1c3Vhcmlvc1wiLFxuICAgICAgICAgICAgICAgICAgICBcImxhYmVsc1wiOntcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidXMtaWRcIjogXCJpZCB1c3VhcmlvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImdyLWlkXCI6IFwiaWQgZ3J1cG9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidXMtdXNlclwiOiBcInVzdWFyaW9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidXMtcGFzc3dvcmRcIjogXCJjb250cmFzZcOxYVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ1cy1uYW1lXCI6IFwibm9tYnJlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInVzLWZhdGhlcnNsYXN0bmFtZVwiOiBcImFwZWxsaWRvIHBhdGVybm9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidXMtbW90aGVyc2xhc3RuYW1lXCI6IFwiYXBlbGxpZG8gbWF0ZXJub1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ1cy1lbWFpbFwiOiBcImNvcnJlbyBlbGVjdHLDs25pY29cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidXMtcGhvbmVcIjogXCJ0ZWzDqWZvbm9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidXMtbW9iaWxlXCI6IFwibcOzdmlsXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInVzLXN0YXR1c1wiOiBcImVzdGF0dXNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidXMtZGF0ZVwiOiBcImZlY2hhXCJcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgXCJjb2x1bW5zXCI6W1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJ1c19pZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJncl9pZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ1c191c2VyXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInVzX3Bhc3N3b3JkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInVzX25hbWVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidXNfZmF0aGVyc2xhc3RuYW1lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInVzX21vdGhlcnNsYXN0bmFtZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ1c19lbWFpbFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ1c19waG9uZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ1c19tb2JpbGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidXNfc3RhdHVzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInVzX2RhdGVcIlxuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgfSIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKGFuZ3VsYXIpe1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBcbiAgICByZXR1cm4gYW5ndWxhci5tb2R1bGUoJ2FwcC51c2VyLmFkZCcsW10pXG5cbiAgICAuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJyxcbiAgICBmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCd1c2VyQWRkJywge1xuICAgICAgICAgICAgdXJsOicvdXNlci9hZGQnLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmwgOiAnYXBwL3VzZXIvbW9kdWxlcy91c2VyLmFkZC91c2VyLmFkZC52aWV3Lmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlciA6ICd1c2VyQWRkQ3RybCcsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgcmVxdWlyZXNMb2dpbjogdHJ1ZVxuICAgICAgICAgICAgfSAgICBcbiAgICAgICAgfSk7XG4gICAgfV0pXG5cbiAgICAuZmFjdG9yeSgndXNlckFkZEZhYycscmVxdWlyZSgnLi91c2VyLmFkZC5mYWMnKSlcblxuICAgIC5jb250cm9sbGVyKCd1c2VyQWRkQ3RybCcscmVxdWlyZSgnLi91c2VyLmFkZC5jdHJsJykpXG4gICAgXG59KShhbmd1bGFyKTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCIgOiBcImFncmVnYXIgdXN1YXJpb1wiLFxuICAgICAgICAgICAgICAgIH0iLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRzY29wZScsICd1c2VyQWRkRmFjJywgJyRsb2NhdGlvbicsXG4gICAgICAgIGZ1bmN0aW9uICgkc2NvcGUsIHVzZXJBZGRGYWMsICRsb2NhdGlvbikge1xuXG4gICAgICAgICAgICAkc2NvcGUub25TdWJtaXQgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICB1c2VyQWRkRmFjLmFkZCgkc2NvcGUuZm1EYXRhKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9taXNlLmRhdGEgPT0gXCIxXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvdXNlcicpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnVwZGF0ZUZhaWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAkc2NvcGUuJG9uKCckdmlld0NvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgLy8gdGhpcyBjb2RlIGlzIGV4ZWN1dGVkIGFmdGVyIHRoZSB2aWV3IGlzIGxvYWRlZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1dO1xuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbihhbmd1bGFyKXtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgXG4gICAgcmV0dXJuIFsnJGh0dHAnLCAnJHEnLCAgJyRzdGF0ZVBhcmFtcycsXG4gICAgZnVuY3Rpb24oJGh0dHAsICRxLCAkc3RhdGVQYXJhbXMpe1xuICAgICAgICB2YXIgZmFjdG9yeSA9IHt9O1xuICAgICAgICBmYWN0b3J5LmFkZCA9IGZ1bmN0aW9uKHVzX2pzb25iKSB7XG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9ICRodHRwLnBvc3QoJ21vZHVsZXMvdXNlci9tb2R1bGVzL3VzZXIuYWRkL3VzZXIuYWRkLm1vZGVsLnBocCcsIHtcbiAgICAgICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgICAgICB1c19qc29uYjogdXNfanNvbmJcbiAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpe1xuICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcInN0YXR1c1wiOiBmYWxzZX07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZmFjdG9yeTtcbiAgICB9XTtcbiAgICBcbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKGFuZ3VsYXIpe1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBcbiAgICByZXR1cm4gYW5ndWxhci5tb2R1bGUoJ2FwcC51c2VyLnByb2ZpbGUnLFtdKVxuXG4gICAgLmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsXG4gICAgZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgndXNlclByb2ZpbGUnLCB7XG4gICAgICAgICAgICB1cmw6Jy91c2VyL3Byb2ZpbGUnLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmwgOiAnYXBwL3VzZXIvbW9kdWxlcy91c2VyLnByb2ZpbGUvdXNlci5wcm9maWxlLnZpZXcuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyIDogJ3VzZXJQcm9maWxlQ3RybCcsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgcmVxdWlyZXNMb2dpbjogdHJ1ZVxuICAgICAgICAgICAgfSAgICBcbiAgICAgICAgfSk7XG4gICAgfV0pXG5cbiAgICAuY29udHJvbGxlcigndXNlclByb2ZpbGVDdHJsJyxyZXF1aXJlKCcuL3VzZXIucHJvZmlsZS5jdHJsJykpXG4gICAgXG59KShhbmd1bGFyKTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCIgOiBcInBlcmZpbCBkZWwgdXN1YXJpb1wiLFxuICAgICAgICAgICAgICAgIH0iLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbihhbmd1bGFyKXtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgXG4gICAgcmV0dXJuIFsnJHNjb3BlJywgJyRsb2NhdGlvbicsICdpMThuRmlsdGVyJywgJyRyb290U2NvcGUnLFxuICAgIGZ1bmN0aW9uICgkc2NvcGUsICRsb2NhdGlvbiwgaTE4bkZpbHRlciwgJHJvb3RTY29wZSkge1xuICAgICAgICAkc2NvcGUudXNlciA9ICRyb290U2NvcGUudXNlcjtcbiAgICAgICAgJHNjb3BlLiRvbignJHZpZXdDb250ZW50TG9hZGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLy8gdGhpcyBjb2RlIGlzIGV4ZWN1dGVkIGFmdGVyIHRoZSB2aWV3IGlzIGxvYWRlZFxuICAgICAgICAgfSk7XG4gICAgfV07XG4gICAgXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbihhbmd1bGFyKXtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgXG4gICAgcmV0dXJuIGFuZ3VsYXIubW9kdWxlKCdhcHAudXNlci51cGRhdGUnLFtdKVxuXG4gICAgLmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsXG4gICAgZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgndXNlclVwZGF0ZScsIHtcbiAgICAgICAgICAgIHVybDonL3VzZXIvdXBkYXRlLzp1c19pZCcsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybCA6ICdhcHAvdXNlci9tb2R1bGVzL3VzZXIudXBkYXRlL3VzZXIudXBkYXRlLnZpZXcuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyIDogJ3VzZXJVcGRhdGVDdHJsJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICByZXF1aXJlc0xvZ2luOiB0cnVlXG4gICAgICAgICAgICB9ICAgIFxuICAgICAgICB9KTtcbiAgICB9XSlcblxuICAgIC5mYWN0b3J5KCd1c2VyVXBkYXRlRmFjJyxyZXF1aXJlKCcuL3VzZXIudXBkYXRlLmZhYycpKVxuXG4gICAgLmNvbnRyb2xsZXIoJ3VzZXJVcGRhdGVDdHJsJyxyZXF1aXJlKCcuL3VzZXIudXBkYXRlLmN0cmwnKSlcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIiA6IFwiYWN0dWFsaXphciB1c3VhcmlvXCIsXG4gICAgICAgICAgICAgICAgfSIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgcmV0dXJuIFsnJHNjb3BlJywgJ3VzZXJVcGRhdGVGYWMnLCAnJGxvY2F0aW9uJyxcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgdXNlclVwZGF0ZUZhYywgJGxvY2F0aW9uKSB7XG5cbiAgICAgICAgICAgICRzY29wZS5vblN1Ym1pdCA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgIHVzZXJVcGRhdGVGYWMudXBkYXRlKCRzY29wZS5mbURhdGEpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb21pc2UuZGF0YSA9PSBcIjFcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy91c2VyJyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICRzY29wZS4kb24oJyR2aWV3Q29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAvLyB0aGlzIGNvZGUgaXMgZXhlY3V0ZWQgYWZ0ZXIgdGhlIHZpZXcgaXMgbG9hZGVkXG5cbiAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgdXNlclVwZGF0ZUZhYy5kYXRhKCkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc09iamVjdChhbmd1bGFyLmZyb21Kc29uKHByb21pc2UuZGF0YSkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZm1EYXRhID0gYW5ndWxhci5mcm9tSnNvbihwcm9taXNlLmRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cblxuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfV07XG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgcmV0dXJuIFsnJGh0dHAnLCAnJHEnLCAgJyRzdGF0ZVBhcmFtcycsIGZ1bmN0aW9uICgkaHR0cCwgJHEsICRzdGF0ZVBhcmFtcykge1xuICAgICAgICB2YXIgZmFjdG9yeSA9IHt9O1xuICAgICAgICBmYWN0b3J5LmRhdGEgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KCdtb2R1bGVzL3VzZXIvbW9kdWxlcy91c2VyLnVwZGF0ZS91c2VyLnVwZGF0ZS5tZGwuZ2V0VXNlci5waHAnLCB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICAgICAgdXNfaWQ6ICRzdGF0ZVBhcmFtcy51c19pZFxuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICBmYWN0b3J5LnVwZGF0ZSA9IGZ1bmN0aW9uICh1c19qc29uYikge1xuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoXG4gICAgICAgICAgICAgICAgJGh0dHAucG9zdCgnbW9kdWxlcy91c2VyL21vZHVsZXMvdXNlci51cGRhdGUvdXNlci51cGRhdGUubWRsLnVwZGF0ZS5waHAnLCB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICAgICAgdXNfaWQ6ICRzdGF0ZVBhcmFtcy51c19pZCxcbiAgICAgICAgICAgICAgICAgICAgdXNfanNvbmI6IHVzX2pzb25iXG4gICAgICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBmYWN0b3J5O1xuICAgIH1dO1xuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbihhbmd1bGFyKXtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgXG4gICAgcmV0dXJuIFsnJHNjb3BlJywgJ3VzZXJGYWMnLCAnaTE4bkZpbHRlcicsXG4gICAgZnVuY3Rpb24gKCRzY29wZSwgdXNlckZhYywgaTE4bkZpbHRlcikge1xuICAgICAgICBcbiAgICAgICAgJHNjb3BlLmxhYmVscyA9IE9iamVjdC5rZXlzKGkxOG5GaWx0ZXIoXCJ1c2VyLmxhYmVsc1wiKSk7XG4gICAgICAgICRzY29wZS5jb2x1bW5zID0gaTE4bkZpbHRlcihcInVzZXIuY29sdW1uc1wiKTtcblxuICAgICAgICAkc2NvcGUuZWRpdCA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNOdW1iZXIoaWQpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vRW1iZWQgdGhlIGlkIHRvIHRoZSBsaW5rXG4gICAgICAgICAgICAgICAgICAgIHZhciBsaW5rID0gXCIjL3VzZXIvdXBkYXRlL1wiICsgaWQ7XG4gICAgICAgICAgICAgICAgICAgIC8vT3BlbiB0aGUgbGlua1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24gPSBsaW5rO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLmR1cGxpY2F0ZSA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNOdW1iZXIoaWQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBsaW5rID0gXCIjL3VzZXIvZHVwbGljYXRlL1wiICsgaWQ7XG4gICAgICAgICAgICAgICAgICAgIC8vT3BlbiB0aGUgbGlua1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24gPSBsaW5rO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvLyBiaW5kIGNvbHVtbnMgd2hlbiBncmlkIGlzIGluaXRpYWxpemVkXG4gICAgICAgICRzY29wZS5pbml0R3JpZCA9IGZ1bmN0aW9uKHMsIGUpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgJHNjb3BlLmxhYmVscy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBjb2wgPSBuZXcgd2lqbW8uZ3JpZC5Db2x1bW4oKTtcbiAgICAgICAgICAgICAgICBjb2wuYmluZGluZyA9ICRzY29wZS5jb2x1bW5zW2ldO1xuICAgICAgICAgICAgICAgIGNvbC5oZWFkZXIgPSBpMThuRmlsdGVyKFwidXNlci5sYWJlbHMuXCIgKyAkc2NvcGUubGFiZWxzW2ldKTtcbiAgICAgICAgICAgICAgICBzLmNvbHVtbnMucHVzaChjb2wpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS4kb24oJyR2aWV3Q29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vIHRoaXMgY29kZSBpcyBleGVjdXRlZCBhZnRlciB0aGUgdmlldyBpcyBsb2FkZWRcbiAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgIHVzZXJGYWMuZGF0YSgpLnRoZW4oZnVuY3Rpb24ocHJvbWlzZSl7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBpZihhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZGF0YSA9IG5ldyB3aWptby5jb2xsZWN0aW9ucy5Db2xsZWN0aW9uVmlldyhwcm9taXNlLmRhdGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgfSk7XG4gICAgfV07XG4gICAgXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRodHRwJywgJyRxJywgIGZ1bmN0aW9uICgkaHR0cCwgJHEpIHtcbiAgICAgICAgdmFyIGZhY3RvcnkgPSB7fTtcbiAgICAgICAgZmFjdG9yeS5kYXRhID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoXG4gICAgICAgICAgICAgICAgJGh0dHAucG9zdCgnbW9kdWxlcy91c2VyL3VzZXIubWRsLmdldFVzZXJzLnBocCcsIHtcbiAgICAgICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZmFjdG9yeTtcbiAgICB9XTtcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oYW5ndWxhcil7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIFxuICAgIHJldHVybiBhbmd1bGFyLm1vZHVsZSgnYXBwLndvJyxbXG4gICAgICAgIHJlcXVpcmUoJy4vbW9kdWxlcy93by5hZGQnKS5uYW1lLFxuICAgICAgICByZXF1aXJlKCcuL21vZHVsZXMvd28udXBkYXRlJykubmFtZSxcbiAgICAgICAgcmVxdWlyZSgnLi9tb2R1bGVzL3dvLmR1cGxpY2F0ZScpLm5hbWVcbiAgICBdKVxuXG4gICAgLmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsXG4gICAgZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnd28nLCB7XG4gICAgICAgICAgICB1cmw6Jy93by86Y2xfaWQnLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmwgOiAnYXBwL3dvL3dvLnZpZXcuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyIDogJ3dvQ29udHJvbGxlcicsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgcmVxdWlyZXNMb2dpbjogdHJ1ZVxuICAgICAgICAgICAgfSAgICBcbiAgICAgICAgfSk7XG4gICAgfV0pXG5cbiAgICAuZmFjdG9yeSgnd29GYWN0b3J5JyxyZXF1aXJlKCcuL3dvLmZhYycpKVxuXG4gICAgLmNvbnRyb2xsZXIoJ3dvQ29udHJvbGxlcicscmVxdWlyZSgnLi93by5jdHJsJykpXG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgIFwidGl0bGVcIjogXCJPcmRlbmVzIGRlIFRyYWJham9cIixcbiAgICBcImxhYmVsc1wiOiB7XG4gICAgICAgIFwid28taWRcIjogXCJOby4gb3JkZW5cIixcbiAgICAgICAgXCJjbC1pZFwiOiBcImNsaWVudGVcIixcbiAgICAgICAgXCJ6by1pZFwiOiBcInpvbmFcIixcbiAgICAgICAgXCJ3by1vcmRlcmVkYnlcIjogXCJPcmRlbmFkbyBwb3JcIixcbiAgICAgICAgXCJ3by1hdHRlbnRpb25cIjogXCJBdGVuY2nDs25cIixcbiAgICAgICAgXCJtYS1pZFwiOiBcIk1hcXVpbmFcIixcbiAgICAgICAgXCJ3by1yZWxlYXNlXCI6IFwiUmVsZWFzZVwiLFxuICAgICAgICBcIndvLXBvXCI6IFwiT3JkZW4gZGUgY29tcHJhXCIsXG4gICAgICAgIFwid28tbGluZVwiOiBcIkxpbmVhXCIsXG4gICAgICAgIFwid28tbGluZXRvdGFsXCI6IFwiRGVcIixcbiAgICAgICAgXCJwci1pZFwiOiBcIlByb2R1Y3RvXCIsXG4gICAgICAgIFwid28tcXR5XCI6IFwiQ2FudGlkYWRcIixcbiAgICAgICAgXCJ3by1wYWNrYWdlcXR5XCI6IFwiQ2FudGlkYWQgeCBwYXF1ZXRlXCIsXG4gICAgICAgIFwid28tZXhjZWRlbnRxdHlcIjogXCJFeGNlZGVudGVcIixcbiAgICAgICAgXCJ3by1mb2xpb3NwZXJmb3JtYXRcIjogXCJGb2xpb3MgeCBmb3JtYXRvXCIsXG4gICAgICAgIFwid28tZm9saW9zc2VyaWVzXCI6IFwiU2VyaWVcIixcbiAgICAgICAgXCJ3by1mb2xpb3Nmcm9tXCI6IFwiRGVsXCIsXG4gICAgICAgIFwid28tZm9saW9zdG9cIjogXCJBbFwiLFxuICAgICAgICBcIndvLXR5cGVcIjogXCJUaXBvXCIsXG4gICAgICAgIFwid28tY29tbWl0bWVudGRhdGVcIjogXCJGZWNoYSBjb21wcm9taXNvXCIsXG4gICAgICAgIFwid28tcHJldmlvdXNpZFwiOiBcIklEIGFudGVyaW9yXCIsXG4gICAgICAgIFwid28tcHJldmlvdXNkYXRlXCI6IFwiRmVjaGEgYW50ZXJpb3JcIixcbiAgICAgICAgXCJ3by1ub3Rlc1wiOiBcIk5vdGFzXCIsXG4gICAgICAgIFwid28tcHJpY2VcIjogXCJQcmVjaW9cIixcbiAgICAgICAgXCJ3by1jdXJyZW5jeVwiOiBcIk1vbmVkYVwiLFxuICAgICAgICBcIndvLWVtYWlsXCI6IFwiRW52aWFyIENvcnJlb1wiLFxuICAgICAgICBcIndvLXN0YXR1c1wiOiBcIkVzdGF0dXNcIixcbiAgICAgICAgXCJ3by1kYXRlXCI6IFwiRmVjaGFcIlxuICAgIH0sXG4gICAgXCJjb2x1bW5zXCI6IFtcbiAgICAgICAgXCJ3b19pZFwiLFxuICAgICAgICBcImNsX2lkXCIsXG4gICAgICAgIFwiem9faWRcIixcbiAgICAgICAgXCJ3b19vcmRlcmVkYnlcIixcbiAgICAgICAgXCJ3b19hdHRlbnRpb25cIixcbiAgICAgICAgXCJtYV9pZFwiLFxuICAgICAgICBcIndvX3JlbGVhc2VcIixcbiAgICAgICAgXCJ3b19wb1wiLFxuICAgICAgICBcIndvX2xpbmVcIixcbiAgICAgICAgXCJ3b19saW5ldG90YWxcIixcbiAgICAgICAgXCJwcl9pZFwiLFxuICAgICAgICBcIndvX3F0eVwiLFxuICAgICAgICBcIndvX3BhY2thZ2VxdHlcIixcbiAgICAgICAgXCJ3b19leGNlZGVudHF0eVwiLFxuICAgICAgICBcIndvX2ZvbGlvc3BlcmZvcm1hdFwiLFxuICAgICAgICBcIndvX2ZvbGlvc3Nlcmllc1wiLFxuICAgICAgICBcIndvX2ZvbGlvc2Zyb21cIixcbiAgICAgICAgXCJ3b19mb2xpb3N0b1wiLFxuICAgICAgICBcIndvX3R5cGVcIixcbiAgICAgICAgXCJ3b19jb21taXRtZW50ZGF0ZVwiLFxuICAgICAgICBcIndvX3ByZXZpb3VzaWRcIixcbiAgICAgICAgXCJ3b19wcmV2aW91c2RhdGVcIixcbiAgICAgICAgXCJ3b19ub3Rlc1wiLFxuICAgICAgICBcIndvX3ByaWNlXCIsXG4gICAgICAgIFwid29fY3VycmVuY3lcIixcbiAgICAgICAgXCJ3b19lbWFpbFwiLFxuICAgICAgICBcIndvX3N0YXR1c1wiLFxuICAgICAgICBcIndvX2RhdGVcIlxuICAgIF1cbn0iLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbihhbmd1bGFyKXtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgXG4gICAgcmV0dXJuIGFuZ3VsYXIubW9kdWxlKCdhcHAud28uYWRkJyxbXSlcblxuICAgIC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLFxuICAgIGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcbiAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3dvQWRkJywge1xuICAgICAgICAgICAgdXJsOicvd28vYWRkLzpjbF9pZCcsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybCA6ICdhcHAvd28vbW9kdWxlcy93by5hZGQvd28uYWRkLnZpZXcuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyIDogJ3dvQWRkQ29udHJvbGxlcicsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgcmVxdWlyZXNMb2dpbjogdHJ1ZVxuICAgICAgICAgICAgfSAgICBcbiAgICAgICAgfSk7XG4gICAgfV0pXG5cbiAgICAuZmFjdG9yeSgnd29BZGRGYWN0b3J5JyxyZXF1aXJlKCcuL3dvLmFkZC5mYWMnKSlcblxuICAgIC5jb250cm9sbGVyKCd3b0FkZENvbnRyb2xsZXInLHJlcXVpcmUoJy4vd28uYWRkLmN0cmwnKSlcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgXCJ0aXRsZVwiOiBcIkFncmVnYXIgT3JkZW4gZGUgVHJhYmFqb1wiLFxuICAgIFwibGFiZWxzXCI6IHtcbiAgICAgICAgXCJjbC1pZFwiOiBcImNsaWVudGVcIixcbiAgICAgICAgXCJ6by1pZFwiOiBcInpvbmFcIixcbiAgICAgICAgXCJ3by1vcmRlcmVkYnlcIjogXCJPcmRlbmFkbyBwb3JcIixcbiAgICAgICAgXCJ3by1hdHRlbnRpb25cIjogXCJBdGVuY2nDs25cIixcbiAgICAgICAgXCJtYS1pZFwiOiBcIk1hcXVpbmFcIixcbiAgICAgICAgXCJ3by1yZWxlYXNlXCI6IFwiUmVsZWFzZVwiLFxuICAgICAgICBcIndvLXBvXCI6IFwiT3JkZW4gZGUgY29tcHJhXCIsXG4gICAgICAgIFwid28tbGluZVwiOiBcIkxpbmVhXCIsXG4gICAgICAgIFwid28tbGluZXRvdGFsXCI6IFwiRGVcIixcbiAgICAgICAgXCJwci1pZFwiOiBcIlByb2R1Y3RvXCIsXG4gICAgICAgIFwicHItcGFydG5vXCI6IFwiTm8uIGRlIHBhcnRlXCIsXG4gICAgICAgIFwicHItY29kZVwiOiBcIkNvZGlnb1wiLFxuICAgICAgICBcInByLW5hbWVcIjogXCJOb21icmVcIixcbiAgICAgICAgXCJ3by1xdHlcIjogXCJDYW50aWRhZFwiLFxuICAgICAgICBcIndvLXBhY2thZ2VxdHlcIjogXCJDYW50aWRhZCB4IHBhcXVldGVcIixcbiAgICAgICAgXCJ3by1leGNlZGVudHF0eVwiOiBcIkV4Y2VkZW50ZVwiLFxuICAgICAgICBcIndvLWZvbGlvc3BlcmZvcm1hdFwiOiBcIkZvbGlvcyB4IGZvcm1hdG9cIixcbiAgICAgICAgXCJ3by1mb2xpb3NzZXJpZXNcIjogXCJTZXJpZVwiLFxuICAgICAgICBcIndvLWZvbGlvc2Zyb21cIjogXCJEZWxcIixcbiAgICAgICAgXCJ3by1mb2xpb3N0b1wiOiBcIkFsXCIsXG4gICAgICAgIFwid28tdHlwZVwiOiBcIlRpcG9cIixcbiAgICAgICAgXCJ3by1pZFwiOiBcIk5vLiBvcmRlblwiLFxuICAgICAgICBcIndvLWRhdGVcIjogXCJGZWNoYVwiLFxuICAgICAgICBcIndvLWNvbW1pdG1lbnRkYXRlXCI6IFwiRmVjaGEgY29tcHJvbWlzb1wiLFxuICAgICAgICBcIndvLXByZXZpb3VzaWRcIjogXCJJRCBhbnRlcmlvclwiLFxuICAgICAgICBcIndvLXByZXZpb3VzZGF0ZVwiOiBcIkZlY2hhIGFudGVyaW9yXCIsXG4gICAgICAgIFwid28tbm90ZXNcIjogXCJOb3Rhc1wiLFxuICAgICAgICBcIndvLXByaWNlXCI6IFwiUHJlY2lvXCIsXG4gICAgICAgIFwid28tY3VycmVuY3lcIjogXCJNb25lZGFcIixcbiAgICAgICAgXCJ3by1lbWFpbFwiOiBcIkVudmlhciBDb3JyZW9cIixcbiAgICAgICAgXCJ3by1zdGF0dXNcIjogXCJFc3RhdHVzXCJcbiAgICB9LFxuICAgIFwiY29sdW1uc1wiOiBbXG4gICAgICAgIFwiY2xfaWRcIixcbiAgICAgICAgXCJ6b19pZFwiLFxuICAgICAgICBcIndvX29yZGVyZWRieVwiLFxuICAgICAgICBcIndvX2F0dGVudGlvblwiLFxuICAgICAgICBcIm1hX2lkXCIsXG4gICAgICAgIFwid29fcmVsZWFzZVwiLFxuICAgICAgICBcIndvX3BvXCIsXG4gICAgICAgIFwid29fbGluZVwiLFxuICAgICAgICBcIndvX2xpbmV0b3RhbFwiLFxuICAgICAgICBcInByX2lkXCIsXG4gICAgICAgIFwicHJfcGFydG5vXCIsXG4gICAgICAgIFwicHJfY29kZVwiLFxuICAgICAgICBcInByX25hbWVcIixcbiAgICAgICAgXCJ3b19xdHlcIixcbiAgICAgICAgXCJ3b19wYWNrYWdlcXR5XCIsXG4gICAgICAgIFwid29fZXhjZWRlbnRxdHlcIixcbiAgICAgICAgXCJ3b19mb2xpb3NwZXJmb3JtYXRcIixcbiAgICAgICAgXCJ3b19mb2xpb3NzZXJpZXNcIixcbiAgICAgICAgXCJ3b19mb2xpb3Nmcm9tXCIsXG4gICAgICAgIFwid29fZm9saW9zdG9cIixcbiAgICAgICAgXCJ3b190eXBlXCIsXG4gICAgICAgIFwid29faWRcIixcbiAgICAgICAgXCJ3b19kYXRlXCIsXG4gICAgICAgIFwid29fY29tbWl0bWVudGRhdGVcIixcbiAgICAgICAgXCJ3b19wcmV2aW91c2lkXCIsXG4gICAgICAgIFwid29fcHJldmlvdXNkYXRlXCIsXG4gICAgICAgIFwid29fbm90ZXNcIixcbiAgICAgICAgXCJ3b19wcmljZVwiLFxuICAgICAgICBcIndvX2N1cnJlbmN5XCIsXG4gICAgICAgIFwid29fZW1haWxcIixcbiAgICAgICAgXCJ3by1zdGF0dXNcIlxuICAgIF0sXG4gICAgXCJmaWVsZHNcIjoge1xuICAgICAgICB3b19mb2xpb3NwZXJmb3JtYXRvcHRpb25zOiBbXG4gICAgICAgICAgICB7IFwibGFiZWxcIjogXCIxXCIsIFwidmFsdWVcIjogMSB9LFxuICAgICAgICAgICAgeyBcImxhYmVsXCI6IFwiMlwiLCBcInZhbHVlXCI6IDIgfSxcbiAgICAgICAgICAgIHsgXCJsYWJlbFwiOiBcIjNcIiwgXCJ2YWx1ZVwiOiAzIH0sXG4gICAgICAgICAgICB7IFwibGFiZWxcIjogXCI0XCIsIFwidmFsdWVcIjogNCB9LFxuICAgICAgICAgICAgeyBcImxhYmVsXCI6IFwiNVwiLCBcInZhbHVlXCI6IDUgfSxcbiAgICAgICAgICAgIHsgXCJsYWJlbFwiOiBcIjZcIiwgXCJ2YWx1ZVwiOiA2IH0sXG4gICAgICAgICAgICB7IFwibGFiZWxcIjogXCI3XCIsIFwidmFsdWVcIjogNyB9LFxuICAgICAgICAgICAgeyBcImxhYmVsXCI6IFwiOFwiLCBcInZhbHVlXCI6IDggfSxcbiAgICAgICAgXSxcbiAgICAgICAgd29fY3VycmVuY3lvcHRpb25zOiBbXG4gICAgICAgICAgICB7IFwibGFiZWxcIjogXCJNWE5cIiwgXCJ2YWx1ZVwiOiBcIk1YTlwiIH0sXG4gICAgICAgICAgICB7IFwibGFiZWxcIjogXCJETExTXCIsIFwidmFsdWVcIjogXCJETExTXCIgfSxcbiAgICAgICAgXSxcbiAgICAgICAgd29fZW1haWxvcHRpb25zOiBbXG4gICAgICAgICAgICB7IFwibGFiZWxcIjogXCJTSVwiLCBcInZhbHVlXCI6IFwieWVzXCIgfSxcbiAgICAgICAgICAgIHsgXCJsYWJlbFwiOiBcIk5PXCIsIFwidmFsdWVcIjogXCJub1wiIH0sXG4gICAgICAgIF1cbiAgICB9XG59IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckc2NvcGUnLCAnd29BZGRGYWN0b3J5JywgJyRzdGF0ZVBhcmFtcycsICdpMThuRmlsdGVyJywgJyRmaWx0ZXInLCAnJGxvY2F0aW9uJyxcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgd29BZGRGYWN0b3J5LCAkc3RhdGVQYXJhbXMsIGkxOG5GaWx0ZXIsICRmaWx0ZXIsICRsb2NhdGlvbikge1xuICAgICAgICAgICAgJHNjb3BlLmZtRGF0YSA9IHt9O1xuICAgICAgICAgICAgLy8kc2NvcGUuZm1EYXRhID0ge1wiem9faWRcIjogXCIyXCIsIFwid29fb3JkZXJlZGJ5XCI6IFwiQWxlamFuZHJvXCIsIFwid29fYXR0ZW50aW9uXCI6IFwiTWFyY29cIiwgXCJtYV9pZFwiOiAxLCBcIndvX3JlbGVhc2VcIjogXCJyZWwwMDFcIiwgXCJ3b19wb1wiOiBcIkFCQzAwMVwiLCBcIndvX2xpbmVcIjogXCIxXCIsIFwid29fbGluZXRvdGFsXCI6IFwiNFwiLCBcInByX2lkXCI6IFwiMTVcIiwgXCJ3b19xdHlcIjogXCIxMDBcIiwgXCJ3b19wYWNrYWdlcXR5XCI6IFwiMTBcIiwgXCJ3b19leGNlZGVudHF0eVwiOiBcIjEwXCIsIFwid29fZm9saW9zcGVyZm9ybWF0XCI6IDEsIFwid29fZm9saW9zc2VyaWVzXCI6IFwiQVwiLCBcIndvX2ZvbGlvc2Zyb21cIjogXCIxXCIsIFwid29fZm9saW9zdG9cIjogXCIxMDBcIiwgXCJ3b19jb21taXRtZW50ZGF0ZVwiOiBcIjIwMTYtMDctMDFcIiwgXCJ3b19ub3Rlc1wiOiBcIkVzdGEgZXMgdW5hIG9yZGVuIGRlIHBydWViYVwiLCBcIndvX3ByaWNlXCI6IFwiOTkuOTlcIiwgXCJ3b19jdXJyZW5jeVwiOiBcIkRMTFNcIiwgXCJ3b19lbWFpbFwiOiBcInllc1wiIH07XG4gICAgICAgICAgICAkc2NvcGUuZm1EYXRhLndvX3R5cGUgPSBcIk5cIjsgLy9OLW5ldyxSLXJlcCxDLWNoYW5nZVxuICAgICAgICAgICAgJHNjb3BlLmZtRGF0YS53b19zdGF0dXMgPSAwOyAvLzAtQWN0aXZlXG4gICAgICAgICAgICAkc2NvcGUuZm1EYXRhLmNsX2lkID0gJHN0YXRlUGFyYW1zLmNsX2lkO1xuXG4gICAgICAgICAgICAkc2NvcGUud29fZm9saW9zcGVyZm9ybWF0b3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJ3by1hZGQuZmllbGRzLndvX2ZvbGlvc3BlcmZvcm1hdG9wdGlvbnNcIik7XG4gICAgICAgICAgICAkc2NvcGUud29fY3VycmVuY3lvcHRpb25zID0gaTE4bkZpbHRlcihcIndvLWFkZC5maWVsZHMud29fY3VycmVuY3lvcHRpb25zXCIpO1xuICAgICAgICAgICAgJHNjb3BlLndvX2VtYWlsb3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJ3by1hZGQuZmllbGRzLndvX2VtYWlsb3B0aW9uc1wiKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgJHNjb3BlLm9uU3VibWl0ID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgd29BZGRGYWN0b3J5LmFkZCgkc2NvcGUuZm1EYXRhKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9taXNlLmRhdGEucm93Q291bnQgPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvd28vJyskc3RhdGVQYXJhbXMuY2xfaWQpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnVwZGF0ZUZhaWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAkc2NvcGUuJG9uKCckdmlld0NvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgLy8gdGhpcyBjb2RlIGlzIGV4ZWN1dGVkIGFmdGVyIHRoZSB2aWV3IGlzIGxvYWRlZFxuICAgICAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB3b0FkZEZhY3RvcnkuZ2V0Wm9uZSgpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnpvX2lkb3B0aW9ucyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByb3dzID0gcHJvbWlzZS5kYXRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHJvd3MsIGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wdXNoKHsgXCJsYWJlbFwiOiByb3dzW2tleV1bJ3pvX2pzb25iJ11bJ3pvX25hbWUnXSwgXCJ2YWx1ZVwiOiByb3dzW2tleV1bJ3pvX2lkJ10gfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAkc2NvcGUuem9faWRvcHRpb25zKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHdvQWRkRmFjdG9yeS5nZXRNYWNoaW5lKCkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUubWFfaWRvcHRpb25zID0gW107XG4gICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJvd3MgPSBwcm9taXNlLmRhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2gocm93cywgZnVuY3Rpb24gKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnB1c2goeyBcImxhYmVsXCI6IHJvd3Nba2V5XVsnbWFfanNvbmInXVsnbWFfbmFtZSddLCBcInZhbHVlXCI6IHJvd3Nba2V5XVsnbWFfaWQnXSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sICRzY29wZS5tYV9pZG9wdGlvbnMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgd29BZGRGYWN0b3J5LmdldFByb2R1Y3QoKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5wcl9pZG9wdGlvbnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJvd3MgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3dzID0gcHJvbWlzZS5kYXRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHJvd3MsIGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wdXNoKHsgXCJsYWJlbFwiOiByb3dzW2tleV1bJ3ByX2lkJ10gKyAnXycgKyByb3dzW2tleV1bJ3ByX2pzb25iJ11bJ3ByX25hbWUnXSArICdfJyArIHJvd3Nba2V5XVsncHJfanNvbmInXVsncHJfY29kZSddLCBcInZhbHVlXCI6IHJvd3Nba2V5XVsncHJfaWQnXSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sICRzY29wZS5wcl9pZG9wdGlvbnMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuJHdhdGNoKFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJmbURhdGEucHJfaWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHByQ2hhbmdlKCBuZXdWYWx1ZSwgb2xkVmFsdWUgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHByb2R1Y3QgPSAkZmlsdGVyKCdmaWx0ZXInKShyb3dzLCB7IFwicHJfaWRcIjogbmV3VmFsdWUgfSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByb2R1Y3QubGVuZ3RoICE9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5wcmluZm8gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5wcmluZm8gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUucHJvZHVjdCA9IHByb2R1Y3RbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5mb2xpbyA9IChwcm9kdWN0WzBdWydwcl9qc29uYiddWydwcl9mb2xpbyddPT09J3llcycpID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1dO1xuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbihhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgcmV0dXJuIFsnJGh0dHAnLCAnJHEnLCAgJyRzdGF0ZVBhcmFtcycsIGZ1bmN0aW9uKCRodHRwLCAkcSwgJHN0YXRlUGFyYW1zKSB7XG4gICAgICAgIHZhciBmYWN0b3J5ID0ge307XG4gICAgICAgIGZhY3RvcnkuZ2V0Wm9uZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoXG4gICAgICAgICAgICAgICAgJGh0dHAucG9zdCgnL2FwaS96b25lL2NsX2lkJywge1xuICAgICAgICAgICAgICAgICAgICAvKiBQT1NUIHZhcmlhYmxlcyBoZXJlICovXG4gICAgICAgICAgICAgICAgICAgIGNsX2lkOiAkc3RhdGVQYXJhbXMuY2xfaWRcbiAgICAgICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkuZ2V0TWFjaGluZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoXG4gICAgICAgICAgICAgICAgJGh0dHAucG9zdCgnL2FwaS9tYWNoaW5lJywge1xuICAgICAgICAgICAgICAgICAgICAvKiBQT1NUIHZhcmlhYmxlcyBoZXJlICovXG4gICAgICAgICAgICAgICAgICAgIGNsX2lkOiAkc3RhdGVQYXJhbXMuY2xfaWRcbiAgICAgICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkuZ2V0UHJvZHVjdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoXG4gICAgICAgICAgICAgICAgJGh0dHAucG9zdCgnL2FwaS9wcm9kdWN0L2NsX2lkJywge1xuICAgICAgICAgICAgICAgICAgICAvKiBQT1NUIHZhcmlhYmxlcyBoZXJlICovXG4gICAgICAgICAgICAgICAgICAgIGNsX2lkOiAkc3RhdGVQYXJhbXMuY2xfaWQsXG4gICAgICAgICAgICAgICAgICAgIHByX3N0YXR1czogJ0EnXG4gICAgICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICBmYWN0b3J5LmFkZCA9IGZ1bmN0aW9uKHdvX2pzb25iKSB7XG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9ICRodHRwLnBvc3QoJy9hcGkvd28vYWRkJywge1xuICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICB3b19qc29uYjogd29fanNvbmJcbiAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZmFjdG9yeTtcbiAgICB9XTtcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oYW5ndWxhcil7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIFxuICAgIHJldHVybiBhbmd1bGFyLm1vZHVsZSgnYXBwLndvLmR1cGxpY2F0ZScsW10pXG5cbiAgICAuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJyxcbiAgICBmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCd3b0R1cGxpY2F0ZScsIHtcbiAgICAgICAgICAgIHVybDonL3dvL2R1cGxpY2F0ZS86Y2xfaWQvOndvX2lkJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsIDogJ2FwcC93by9tb2R1bGVzL3dvLmR1cGxpY2F0ZS93by5kdXBsaWNhdGUudmlldy5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXIgOiAnd29EdXBsaWNhdGVDb250cm9sbGVyJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICByZXF1aXJlc0xvZ2luOiB0cnVlXG4gICAgICAgICAgICB9ICAgIFxuICAgICAgICB9KTtcbiAgICB9XSlcblxuICAgIC5mYWN0b3J5KCd3b0R1cGxpY2F0ZUZhY3RvcnknLHJlcXVpcmUoJy4vd28uZHVwbGljYXRlLmZhYycpKVxuXG4gICAgLmNvbnRyb2xsZXIoJ3dvRHVwbGljYXRlQ29udHJvbGxlcicscmVxdWlyZSgnLi93by5kdXBsaWNhdGUuY3RybCcpKVxuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRzY29wZScsICd3b0R1cGxpY2F0ZUZhY3RvcnknLCAnJHN0YXRlUGFyYW1zJywgJ2kxOG5GaWx0ZXInLCAnJGZpbHRlcicsXG4gICAgICAgIGZ1bmN0aW9uICgkc2NvcGUsIHdvRHVwbGljYXRlRmFjdG9yeSwgJHN0YXRlUGFyYW1zLCBpMThuRmlsdGVyLCAkZmlsdGVyKSB7XG5cbiAgICAgICAgICAgICRzY29wZS53b19mb2xpb3NwZXJmb3JtYXRvcHRpb25zID0gaTE4bkZpbHRlcihcIndvLWFkZC5maWVsZHMud29fZm9saW9zcGVyZm9ybWF0b3B0aW9uc1wiKTtcbiAgICAgICAgICAgICRzY29wZS53b19jdXJyZW5jeW9wdGlvbnMgPSBpMThuRmlsdGVyKFwid28tYWRkLmZpZWxkcy53b19jdXJyZW5jeW9wdGlvbnNcIik7XG4gICAgICAgICAgICAkc2NvcGUud29fZW1haWxvcHRpb25zID0gaTE4bkZpbHRlcihcIndvLWFkZC5maWVsZHMud29fZW1haWxvcHRpb25zXCIpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAkc2NvcGUub25TdWJtaXQgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICB3b0R1cGxpY2F0ZUZhY3RvcnkuYWRkKCRzY29wZS5mbURhdGEpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb21pc2UuZGF0YS5yb3dDb3VudCA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3dvLycrJHN0YXRlUGFyYW1zLmNsX2lkKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS51cGRhdGVGYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgJHNjb3BlLiRvbignJHZpZXdDb250ZW50TG9hZGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIC8vIHRoaXMgY29kZSBpcyBleGVjdXRlZCBhZnRlciB0aGUgdmlldyBpcyBsb2FkZWRcbiAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgd29EdXBsaWNhdGVGYWN0b3J5LmdldERhdGEoKS50aGVuKGZ1bmN0aW9uKHByb21pc2Upe1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBpZihhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhKSAmJiBwcm9taXNlLmRhdGEubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmZtRGF0YSA9IHByb21pc2UuZGF0YVswXS53b19qc29uYjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZm1EYXRhLndvX3ByZXZpb3VzaWQgPSBwcm9taXNlLmRhdGFbMF0ud29faWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmZtRGF0YS53b19wcmV2aW91c2RhdGUgPSBwcm9taXNlLmRhdGFbMF0ud29fZGF0ZS5zdWJzdHJpbmcoMCwgMTApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgd29EdXBsaWNhdGVGYWN0b3J5LmdldFpvbmUoKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS56b19pZG9wdGlvbnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcm93cyA9IHByb21pc2UuZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChyb3dzLCBmdW5jdGlvbiAodmFsdWUsIGtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHVzaCh7IFwibGFiZWxcIjogcm93c1trZXldWyd6b19qc29uYiddWyd6b19uYW1lJ10sIFwidmFsdWVcIjogcm93c1trZXldWyd6b19pZCddIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgJHNjb3BlLnpvX2lkb3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB3b0R1cGxpY2F0ZUZhY3RvcnkuZ2V0TWFjaGluZSgpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLm1hX2lkb3B0aW9ucyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByb3dzID0gcHJvbWlzZS5kYXRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHJvd3MsIGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wdXNoKHsgXCJsYWJlbFwiOiByb3dzW2tleV1bJ21hX2pzb25iJ11bJ21hX25hbWUnXSwgXCJ2YWx1ZVwiOiByb3dzW2tleV1bJ21hX2lkJ10gfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAkc2NvcGUubWFfaWRvcHRpb25zKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHdvRHVwbGljYXRlRmFjdG9yeS5nZXRQcm9kdWN0KCkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUucHJfaWRvcHRpb25zID0gW107XG4gICAgICAgICAgICAgICAgICAgIHZhciByb3dzID0gW107XG4gICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcm93cyA9IHByb21pc2UuZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChyb3dzLCBmdW5jdGlvbiAodmFsdWUsIGtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHVzaCh7IFwibGFiZWxcIjogcm93c1trZXldWydwcl9pZCddICsgJ18nICsgcm93c1trZXldWydwcl9qc29uYiddWydwcl9uYW1lJ10gKyAnXycgKyByb3dzW2tleV1bJ3ByX2pzb25iJ11bJ3ByX2NvZGUnXSwgXCJ2YWx1ZVwiOiByb3dzW2tleV1bJ3ByX2lkJ10gfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAkc2NvcGUucHJfaWRvcHRpb25zKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLiR3YXRjaChcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZm1EYXRhLnByX2lkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBwckNoYW5nZSggbmV3VmFsdWUsIG9sZFZhbHVlICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcm9kdWN0ID0gJGZpbHRlcignZmlsdGVyJykocm93cywgeyBcInByX2lkXCI6IG5ld1ZhbHVlIH0sIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcm9kdWN0Lmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnByaW5mbyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnByaW5mbyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5wcm9kdWN0ID0gcHJvZHVjdFswXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmZvbGlvID0gKHByb2R1Y3RbMF1bJ3ByX2pzb25iJ11bJ3ByX2ZvbGlvJ109PT0neWVzJykgPyB0cnVlIDogZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfV07XG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgcmV0dXJuIFsnJGh0dHAnLCAnJHEnLCAgJyRzdGF0ZVBhcmFtcycsIGZ1bmN0aW9uICgkaHR0cCwgJHEsICRzdGF0ZVBhcmFtcykge1xuICAgICAgICB2YXIgZmFjdG9yeSA9IHt9O1xuICAgICAgICBmYWN0b3J5LmdldERhdGEgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KCcvYXBpL3dvL3dvX2lkJywge1xuICAgICAgICAgICAgICAgICAgICAvKiBQT1NUIHZhcmlhYmxlcyBoZXJlICovXG4gICAgICAgICAgICAgICAgICAgIGNsX2lkOiAkc3RhdGVQYXJhbXMuY2xfaWQsXG4gICAgICAgICAgICAgICAgICAgIHdvX2lkOiAkc3RhdGVQYXJhbXMud29faWRcbiAgICAgICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeS5nZXRab25lID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoXG4gICAgICAgICAgICAgICAgJGh0dHAucG9zdCgnL2FwaS96b25lL2NsX2lkJywge1xuICAgICAgICAgICAgICAgICAgICAvKiBQT1NUIHZhcmlhYmxlcyBoZXJlICovXG4gICAgICAgICAgICAgICAgICAgIGNsX2lkOiAkc3RhdGVQYXJhbXMuY2xfaWRcbiAgICAgICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeS5nZXRNYWNoaW5lID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoXG4gICAgICAgICAgICAgICAgJGh0dHAucG9zdCgnL2FwaS9tYWNoaW5lJywge1xuICAgICAgICAgICAgICAgICAgICAvKiBQT1NUIHZhcmlhYmxlcyBoZXJlICovXG4gICAgICAgICAgICAgICAgICAgIGNsX2lkOiAkc3RhdGVQYXJhbXMuY2xfaWRcbiAgICAgICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeS5nZXRQcm9kdWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoXG4gICAgICAgICAgICAgICAgJGh0dHAucG9zdCgnL2FwaS9wcm9kdWN0L2NsX2lkJywge1xuICAgICAgICAgICAgICAgICAgICAvKiBQT1NUIHZhcmlhYmxlcyBoZXJlICovXG4gICAgICAgICAgICAgICAgICAgIGNsX2lkOiAkc3RhdGVQYXJhbXMuY2xfaWQsXG4gICAgICAgICAgICAgICAgICAgIHByX3N0YXR1czogJ0EnXG4gICAgICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkuYWRkID0gZnVuY3Rpb24gKHdvX2pzb25iKSB7XG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9ICRodHRwLnBvc3QoJy9hcGkvd28vYWRkJywge1xuICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICB3b19qc29uYjogd29fanNvbmJcbiAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoY29uZmlnKSlcbiAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZmFjdG9yeTtcbiAgICB9XTtcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oYW5ndWxhcil7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIFxuICAgIHJldHVybiBhbmd1bGFyLm1vZHVsZSgnYXBwLndvLnVwZGF0ZScsW10pXG5cbiAgICAuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJyxcbiAgICBmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCd3b1VwZGF0ZScsIHtcbiAgICAgICAgICAgIHVybDonL3dvL3VwZGF0ZS86Y2xfaWQvOndvX2lkJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsIDogJ2FwcC93by9tb2R1bGVzL3dvLnVwZGF0ZS93by51cGRhdGUudmlldy5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXIgOiAnd29VcGRhdGVDb250cm9sbGVyJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICByZXF1aXJlc0xvZ2luOiB0cnVlXG4gICAgICAgICAgICB9ICAgIFxuICAgICAgICB9KTtcbiAgICB9XSlcblxuICAgIC5mYWN0b3J5KCd3b1VwZGF0ZUZhY3RvcnknLHJlcXVpcmUoJy4vd28udXBkYXRlLmZhYycpKVxuXG4gICAgLmNvbnRyb2xsZXIoJ3dvVXBkYXRlQ29udHJvbGxlcicscmVxdWlyZSgnLi93by51cGRhdGUuY3RybCcpKVxuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBcInRpdGxlXCI6IFwiQWN0dWFsaXphciBPcmRlbiBkZSBUcmFiYWpvXCIsXG4gICAgXCJsYWJlbHNcIjoge1xuICAgICAgICBcImNsLWlkXCI6IFwiY2xpZW50ZVwiLFxuICAgICAgICBcInpvLWlkXCI6IFwiem9uYVwiLFxuICAgICAgICBcIndvLW9yZGVyZWRieVwiOiBcIk9yZGVuYWRvIHBvclwiLFxuICAgICAgICBcIndvLWF0dGVudGlvblwiOiBcIkF0ZW5jacOzblwiLFxuICAgICAgICBcIm1hLWlkXCI6IFwiTWFxdWluYVwiLFxuICAgICAgICBcIndvLXJlbGVhc2VcIjogXCJSZWxlYXNlXCIsXG4gICAgICAgIFwid28tcG9cIjogXCJPcmRlbiBkZSBjb21wcmFcIixcbiAgICAgICAgXCJ3by1saW5lXCI6IFwiTGluZWFcIixcbiAgICAgICAgXCJ3by1saW5ldG90YWxcIjogXCJEZVwiLFxuICAgICAgICBcInByLWlkXCI6IFwiUHJvZHVjdG9cIixcbiAgICAgICAgXCJwci1wYXJ0bm9cIjogXCJOby4gZGUgcGFydGVcIixcbiAgICAgICAgXCJwci1jb2RlXCI6IFwiQ29kaWdvXCIsXG4gICAgICAgIFwicHItbmFtZVwiOiBcIk5vbWJyZVwiLFxuICAgICAgICBcIndvLXF0eVwiOiBcIkNhbnRpZGFkXCIsXG4gICAgICAgIFwid28tcGFja2FnZXF0eVwiOiBcIkNhbnRpZGFkIHggcGFxdWV0ZVwiLFxuICAgICAgICBcIndvLWV4Y2VkZW50cXR5XCI6IFwiRXhjZWRlbnRlXCIsXG4gICAgICAgIFwid28tZm9saW9zcGVyZm9ybWF0XCI6IFwiRm9saW9zIHggZm9ybWF0b1wiLFxuICAgICAgICBcIndvLWZvbGlvc3Nlcmllc1wiOiBcIlNlcmllXCIsXG4gICAgICAgIFwid28tZm9saW9zZnJvbVwiOiBcIkRlbFwiLFxuICAgICAgICBcIndvLWZvbGlvc3RvXCI6IFwiQWxcIixcbiAgICAgICAgXCJ3by10eXBlXCI6IFwiVGlwb1wiLFxuICAgICAgICBcIndvLWlkXCI6IFwiTm8uIG9yZGVuXCIsXG4gICAgICAgIFwid28tZGF0ZVwiOiBcIkZlY2hhXCIsXG4gICAgICAgIFwid28tY29tbWl0bWVudGRhdGVcIjogXCJGZWNoYSBjb21wcm9taXNvXCIsXG4gICAgICAgIFwid28tcHJldmlvdXNpZFwiOiBcIklEIGFudGVyaW9yXCIsXG4gICAgICAgIFwid28tcHJldmlvdXNkYXRlXCI6IFwiRmVjaGEgYW50ZXJpb3JcIixcbiAgICAgICAgXCJ3by1ub3Rlc1wiOiBcIk5vdGFzXCIsXG4gICAgICAgIFwid28tcHJpY2VcIjogXCJQcmVjaW9cIixcbiAgICAgICAgXCJ3by1jdXJyZW5jeVwiOiBcIk1vbmVkYVwiLFxuICAgICAgICBcIndvLWVtYWlsXCI6IFwiRW52aWFyIENvcnJlb1wiLFxuICAgICAgICBcIndvLXN0YXR1c1wiOiBcIkVzdGF0dXNcIlxuICAgIH0sXG4gICAgXCJjb2x1bW5zXCI6IFtcbiAgICAgICAgXCJjbF9pZFwiLFxuICAgICAgICBcInpvX2lkXCIsXG4gICAgICAgIFwid29fb3JkZXJlZGJ5XCIsXG4gICAgICAgIFwid29fYXR0ZW50aW9uXCIsXG4gICAgICAgIFwibWFfaWRcIixcbiAgICAgICAgXCJ3b19yZWxlYXNlXCIsXG4gICAgICAgIFwid29fcG9cIixcbiAgICAgICAgXCJ3b19saW5lXCIsXG4gICAgICAgIFwid29fbGluZXRvdGFsXCIsXG4gICAgICAgIFwicHJfaWRcIixcbiAgICAgICAgXCJwcl9wYXJ0bm9cIixcbiAgICAgICAgXCJwcl9jb2RlXCIsXG4gICAgICAgIFwicHJfbmFtZVwiLFxuICAgICAgICBcIndvX3F0eVwiLFxuICAgICAgICBcIndvX3BhY2thZ2VxdHlcIixcbiAgICAgICAgXCJ3b19leGNlZGVudHF0eVwiLFxuICAgICAgICBcIndvX2ZvbGlvc3BlcmZvcm1hdFwiLFxuICAgICAgICBcIndvX2ZvbGlvc3Nlcmllc1wiLFxuICAgICAgICBcIndvX2ZvbGlvc2Zyb21cIixcbiAgICAgICAgXCJ3b19mb2xpb3N0b1wiLFxuICAgICAgICBcIndvX3R5cGVcIixcbiAgICAgICAgXCJ3b19pZFwiLFxuICAgICAgICBcIndvX2RhdGVcIixcbiAgICAgICAgXCJ3b19jb21taXRtZW50ZGF0ZVwiLFxuICAgICAgICBcIndvX3ByZXZpb3VzaWRcIixcbiAgICAgICAgXCJ3b19wcmV2aW91c2RhdGVcIixcbiAgICAgICAgXCJ3b19ub3Rlc1wiLFxuICAgICAgICBcIndvX3ByaWNlXCIsXG4gICAgICAgIFwid29fY3VycmVuY3lcIixcbiAgICAgICAgXCJ3b19lbWFpbFwiLFxuICAgICAgICBcIndvLXN0YXR1c1wiXG4gICAgXSxcbiAgICBcImZpZWxkc1wiOiB7XG4gICAgICAgIHdvX2ZvbGlvc3BlcmZvcm1hdG9wdGlvbnM6IFtcbiAgICAgICAgICAgIHsgXCJsYWJlbFwiOiBcIjFcIiwgXCJ2YWx1ZVwiOiAxIH0sXG4gICAgICAgICAgICB7IFwibGFiZWxcIjogXCIyXCIsIFwidmFsdWVcIjogMiB9LFxuICAgICAgICAgICAgeyBcImxhYmVsXCI6IFwiM1wiLCBcInZhbHVlXCI6IDMgfSxcbiAgICAgICAgICAgIHsgXCJsYWJlbFwiOiBcIjRcIiwgXCJ2YWx1ZVwiOiA0IH0sXG4gICAgICAgICAgICB7IFwibGFiZWxcIjogXCI1XCIsIFwidmFsdWVcIjogNSB9LFxuICAgICAgICAgICAgeyBcImxhYmVsXCI6IFwiNlwiLCBcInZhbHVlXCI6IDYgfSxcbiAgICAgICAgICAgIHsgXCJsYWJlbFwiOiBcIjdcIiwgXCJ2YWx1ZVwiOiA3IH0sXG4gICAgICAgICAgICB7IFwibGFiZWxcIjogXCI4XCIsIFwidmFsdWVcIjogOCB9LFxuICAgICAgICBdLFxuICAgICAgICB3b19jdXJyZW5jeW9wdGlvbnM6IFtcbiAgICAgICAgICAgIHsgXCJsYWJlbFwiOiBcIk1YTlwiLCBcInZhbHVlXCI6IFwiTVhOXCIgfSxcbiAgICAgICAgICAgIHsgXCJsYWJlbFwiOiBcIkRMTFNcIiwgXCJ2YWx1ZVwiOiBcIkRMTFNcIiB9LFxuICAgICAgICBdLFxuICAgICAgICB3b19lbWFpbG9wdGlvbnM6IFtcbiAgICAgICAgICAgIHsgXCJsYWJlbFwiOiBcIlNJXCIsIFwidmFsdWVcIjogXCJ5ZXNcIiB9LFxuICAgICAgICAgICAgeyBcImxhYmVsXCI6IFwiTk9cIiwgXCJ2YWx1ZVwiOiBcIm5vXCIgfSxcbiAgICAgICAgXVxuICAgIH1cbn0iLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRzY29wZScsICd3b1VwZGF0ZUZhY3RvcnknLCAnJHN0YXRlUGFyYW1zJywgJ2kxOG5GaWx0ZXInLCAnJGZpbHRlcicsJyRsb2NhdGlvbicsXG4gICAgICAgIGZ1bmN0aW9uICgkc2NvcGUsIHdvVXBkYXRlRmFjdG9yeSwgJHN0YXRlUGFyYW1zLCBpMThuRmlsdGVyLCAkZmlsdGVyLCAkbG9jYXRpb24pIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgJHNjb3BlLndvX2ZvbGlvc3BlcmZvcm1hdG9wdGlvbnMgPSBpMThuRmlsdGVyKFwid28tYWRkLmZpZWxkcy53b19mb2xpb3NwZXJmb3JtYXRvcHRpb25zXCIpO1xuICAgICAgICAgICAgJHNjb3BlLndvX2N1cnJlbmN5b3B0aW9ucyA9IGkxOG5GaWx0ZXIoXCJ3by1hZGQuZmllbGRzLndvX2N1cnJlbmN5b3B0aW9uc1wiKTtcbiAgICAgICAgICAgICRzY29wZS53b19lbWFpbG9wdGlvbnMgPSBpMThuRmlsdGVyKFwid28tYWRkLmZpZWxkcy53b19lbWFpbG9wdGlvbnNcIik7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICRzY29wZS5vblN1Ym1pdCA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgIHdvVXBkYXRlRmFjdG9yeS51cGRhdGUoJHNjb3BlLmZtRGF0YSkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocHJvbWlzZS5kYXRhLnJvd0NvdW50ID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3dvLycrJHN0YXRlUGFyYW1zLmNsX2lkKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS51cGRhdGVGYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgJHNjb3BlLiRvbignJHZpZXdDb250ZW50TG9hZGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIC8vIHRoaXMgY29kZSBpcyBleGVjdXRlZCBhZnRlciB0aGUgdmlldyBpcyBsb2FkZWRcbiAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgd29VcGRhdGVGYWN0b3J5LmdldERhdGEoKS50aGVuKGZ1bmN0aW9uKHByb21pc2Upe1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBpZihhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhKSAmJiBwcm9taXNlLmRhdGEubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmZtRGF0YSA9IHByb21pc2UuZGF0YVswXS53b19qc29uYjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUud29faWQgPSBwcm9taXNlLmRhdGFbMF0ud29faWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLndvX2RhdGUgPSBwcm9taXNlLmRhdGFbMF0ud29fZGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHdvVXBkYXRlRmFjdG9yeS5nZXRab25lKCkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuem9faWRvcHRpb25zID0gW107XG4gICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJvd3MgPSBwcm9taXNlLmRhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2gocm93cywgZnVuY3Rpb24gKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnB1c2goeyBcImxhYmVsXCI6IHJvd3Nba2V5XVsnem9fanNvbmInXVsnem9fbmFtZSddLCBcInZhbHVlXCI6IHJvd3Nba2V5XVsnem9faWQnXSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sICRzY29wZS56b19pZG9wdGlvbnMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgd29VcGRhdGVGYWN0b3J5LmdldE1hY2hpbmUoKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5tYV9pZG9wdGlvbnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcm93cyA9IHByb21pc2UuZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChyb3dzLCBmdW5jdGlvbiAodmFsdWUsIGtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHVzaCh7IFwibGFiZWxcIjogcm93c1trZXldWydtYV9qc29uYiddWydtYV9uYW1lJ10sIFwidmFsdWVcIjogcm93c1trZXldWydtYV9pZCddIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgJHNjb3BlLm1hX2lkb3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB3b1VwZGF0ZUZhY3RvcnkuZ2V0UHJvZHVjdCgpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnByX2lkb3B0aW9ucyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICB2YXIgcm93cyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3MgPSBwcm9taXNlLmRhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2gocm93cywgZnVuY3Rpb24gKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnB1c2goeyBcImxhYmVsXCI6IHJvd3Nba2V5XVsncHJfaWQnXSArICdfJyArIHJvd3Nba2V5XVsncHJfanNvbmInXVsncHJfbmFtZSddICsgJ18nICsgcm93c1trZXldWydwcl9qc29uYiddWydwcl9jb2RlJ10sIFwidmFsdWVcIjogcm93c1trZXldWydwcl9pZCddIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgJHNjb3BlLnByX2lkb3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS4kd2F0Y2goXG4gICAgICAgICAgICAgICAgICAgICAgICBcImZtRGF0YS5wcl9pZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gcHJDaGFuZ2UoIG5ld1ZhbHVlLCBvbGRWYWx1ZSApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcHJvZHVjdCA9ICRmaWx0ZXIoJ2ZpbHRlcicpKHJvd3MsIHsgXCJwcl9pZFwiOiBuZXdWYWx1ZSB9LCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJvZHVjdC5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5wcmluZm8gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5wcmluZm8gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUucHJvZHVjdCA9IHByb2R1Y3RbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5mb2xpbyA9IChwcm9kdWN0WzBdWydwcl9qc29uYiddWydwcl9mb2xpbyddPT09J3llcycpID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1dO1xuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRodHRwJywgJyRxJywgICckc3RhdGVQYXJhbXMnLCBmdW5jdGlvbiAoJGh0dHAsICRxLCAkc3RhdGVQYXJhbXMpIHtcbiAgICAgICAgdmFyIGZhY3RvcnkgPSB7fTtcbiAgICAgICAgZmFjdG9yeS5nZXREYXRhID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoXG4gICAgICAgICAgICAgICAgJGh0dHAucG9zdCgnL2FwaS93by93b19pZCcsIHtcbiAgICAgICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgICAgICBjbF9pZDogJHN0YXRlUGFyYW1zLmNsX2lkLFxuICAgICAgICAgICAgICAgICAgICB3b19pZDogJHN0YXRlUGFyYW1zLndvX2lkXG4gICAgICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkuZ2V0Wm9uZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKFxuICAgICAgICAgICAgICAgICRodHRwLnBvc3QoJy9hcGkvem9uZS9jbF9pZCcsIHtcbiAgICAgICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgICAgICBjbF9pZDogJHN0YXRlUGFyYW1zLmNsX2lkXG4gICAgICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkuZ2V0TWFjaGluZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKFxuICAgICAgICAgICAgICAgICRodHRwLnBvc3QoJy9hcGkvbWFjaGluZScsIHtcbiAgICAgICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgICAgICBjbF9pZDogJHN0YXRlUGFyYW1zLmNsX2lkXG4gICAgICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkuZ2V0UHJvZHVjdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKFxuICAgICAgICAgICAgICAgICRodHRwLnBvc3QoJy9hcGkvcHJvZHVjdC9jbF9pZCcsIHtcbiAgICAgICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgICAgICBjbF9pZDogJHN0YXRlUGFyYW1zLmNsX2lkLFxuICAgICAgICAgICAgICAgICAgICBwcl9zdGF0dXM6ICdBJ1xuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICBmYWN0b3J5LnVwZGF0ZSA9IGZ1bmN0aW9uICh3b19qc29uYikge1xuICAgICAgICAgICAgdmFyIHByb21pc2UgPSAkaHR0cC5wb3N0KCcvYXBpL3dvL3VwZGF0ZScsIHtcbiAgICAgICAgICAgICAgICAvKiBQT1NUIHZhcmlhYmxlcyBoZXJlICovXG4gICAgICAgICAgICAgICAgd29fanNvbmI6IHdvX2pzb25iLFxuICAgICAgICAgICAgICAgIHdvX2lkOiAkc3RhdGVQYXJhbXMud29faWRcbiAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGZhY3Rvcnk7XG4gICAgfV07XG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgcmV0dXJuIFsnJHNjb3BlJywgJ3dvRmFjdG9yeScsICckbG9jYXRpb24nLCAnaTE4bkZpbHRlcicsICckc3RhdGVQYXJhbXMnLFxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCB3b0ZhY3RvcnksICRsb2NhdGlvbiwgaTE4bkZpbHRlciwgJHN0YXRlUGFyYW1zKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICRzY29wZS5sYWJlbHMgPSBPYmplY3Qua2V5cyhpMThuRmlsdGVyKFwid28ubGFiZWxzXCIpKTtcbiAgICAgICAgICAgICRzY29wZS5jb2x1bW5zID0gaTE4bkZpbHRlcihcIndvLmNvbHVtbnNcIik7XG5cbiAgICAgICAgICAgICRzY29wZS5lZGl0ID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNOdW1iZXIoaWQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBsaW5rID0gXCIjL3dvL3VwZGF0ZS9cIiArIGlkO1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24gPSBsaW5rO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICRzY29wZS5kdXBsaWNhdGUgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc051bWJlcihpZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGxpbmsgPSBcIiMvd28vZHVwbGljYXRlL1wiICsgaWQ7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IGxpbms7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gZm9ybWF0SXRlbSBldmVudCBoYW5kbGVyXG4gICAgICAgICAgICB2YXIgd29faWQ7XG4gICAgICAgICAgICAkc2NvcGUuZm9ybWF0SXRlbSA9IGZ1bmN0aW9uIChzLCBlLCBjZWxsKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoZS5wYW5lbC5jZWxsVHlwZSA9PSB3aWptby5ncmlkLkNlbGxUeXBlLlJvd0hlYWRlcikge1xuICAgICAgICAgICAgICAgICAgICBlLmNlbGwudGV4dENvbnRlbnQgPSBlLnJvdyArIDE7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcy5yb3dzLmRlZmF1bHRTaXplID0gMzA7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBhZGQgQm9vdHN0cmFwIGh0bWxcbiAgICAgICAgICAgICAgICBpZiAoKGUucGFuZWwuY2VsbFR5cGUgPT0gd2lqbW8uZ3JpZC5DZWxsVHlwZS5DZWxsKSAmJiAoZS5jb2wgPT0gMCkpIHtcbiAgICAgICAgICAgICAgICAgICAgd29faWQgPSBlLnBhbmVsLmdldENlbGxEYXRhKGUucm93LCAxLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGUuY2VsbC5zdHlsZS5vdmVyZmxvdyA9ICd2aXNpYmxlJztcbiAgICAgICAgICAgICAgICAgICAgZS5jZWxsLmlubmVySFRNTCA9ICc8ZGl2IGNsYXNzPVwiYnRuLWdyb3VwIGJ0bi1ncm91cC1qdXN0aWZpZWRcIiByb2xlPVwiZ3JvdXBcIiBhcmlhLWxhYmVsPVwiLi4uXCI+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJ0bi1ncm91cFwiIHJvbGU9XCJncm91cFwiPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiIy93by91cGRhdGUvJyArICRzdGF0ZVBhcmFtcy5jbF9pZCArICcvJyArIHdvX2lkICsgJ1wiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0IGJ0bi14c1wiPicgKyBpMThuRmlsdGVyKFwiZ2VuZXJhbC5sYWJlbHMuZWRpdFwiKSArICc8L2E+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJ0bi1ncm91cFwiIHJvbGU9XCJncm91cFwiPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiIy93by9kdXBsaWNhdGUvJyArICRzdGF0ZVBhcmFtcy5jbF9pZCArICcvJyArIHdvX2lkICsgJ1wiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0IGJ0bi14c1wiPicgKyBpMThuRmlsdGVyKFwiZ2VuZXJhbC5sYWJlbHMuZHVwbGljYXRlXCIpICsgJzwvYT5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+JztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAgICAgLy8gYmluZCBjb2x1bW5zIHdoZW4gZ3JpZCBpcyBpbml0aWFsaXplZFxuICAgICAgICAgICAgJHNjb3BlLmluaXRHcmlkID0gZnVuY3Rpb24gKHMsIGUpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8ICRzY29wZS5jb2x1bW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjb2wgPSBuZXcgd2lqbW8uZ3JpZC5Db2x1bW4oKTtcbiAgICAgICAgICAgICAgICAgICAgY29sLmJpbmRpbmcgPSAkc2NvcGUuY29sdW1uc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgY29sLmhlYWRlciA9IGkxOG5GaWx0ZXIoXCJ3by5sYWJlbHMuXCIgKyAkc2NvcGUubGFiZWxzW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgcy5jb2x1bW5zLnB1c2goY29sKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICBcbiAgICAgICAgICAgIC8vIGNyZWF0ZSB0aGUgdG9vbHRpcCBvYmplY3RcbiAgICAgICAgICAgICRzY29wZS4kd2F0Y2goJ2dnR3JpZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoJHNjb3BlLmdnR3JpZCkge1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIHN0b3JlIHJlZmVyZW5jZSB0byBncmlkXG4gICAgICAgICAgICAgICAgICAgIHZhciBmbGV4ID0gJHNjb3BlLmdnR3JpZDtcblxuICAgICAgICAgICAgICAgICAgICAvLyBjcmVhdGUgdG9vbHRpcFxuICAgICAgICAgICAgICAgICAgICB2YXIgdGlwID0gbmV3IHdpam1vLlRvb2x0aXAoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJuZyA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gbW9uaXRvciB0aGUgbW91c2Ugb3ZlciB0aGUgZ3JpZFxuICAgICAgICAgICAgICAgICAgICBmbGV4Lmhvc3RFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBodCA9IGZsZXguaGl0VGVzdChldnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFodC5yYW5nZS5lcXVhbHMocm5nKSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbmV3IGNlbGwgc2VsZWN0ZWQsIHNob3cgdG9vbHRpcFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChodC5jZWxsVHlwZSA9PSB3aWptby5ncmlkLkNlbGxUeXBlLkNlbGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm5nID0gaHQucmFuZ2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb2wgPSBmbGV4LmNvbHVtbnNbcm5nLmNvbF0uaGVhZGVyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2VsbEVsZW1lbnQgPSBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KGV2dC5jbGllbnRYLCBldnQuY2xpZW50WSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjZWxsQm91bmRzID0gd2lqbW8uUmVjdC5mcm9tQm91bmRpbmdSZWN0KGNlbGxFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEgPSB3aWptby5lc2NhcGVIdG1sKGZsZXguZ2V0Q2VsbERhdGEocm5nLnJvdywgcm5nLmNvbCwgdHJ1ZSkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlwQ29udGVudCA9IGNvbCArICc6IFwiPGI+JyArIGRhdGEgKyAnPC9iPlwiJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNlbGxFbGVtZW50LmNsYXNzTmFtZS5pbmRleE9mKCd3ai1jZWxsJykgPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlwLnNob3coZmxleC5ob3N0RWxlbWVudCwgdGlwQ29udGVudCwgY2VsbEJvdW5kcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXAuaGlkZSgpOyAvLyBjZWxsIG11c3QgYmUgYmVoaW5kIHNjcm9sbCBiYXIuLi5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGZsZXguaG9zdEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXAuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcm5nID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICRzY29wZS4kb24oJyR2aWV3Q29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAvLyB0aGlzIGNvZGUgaXMgZXhlY3V0ZWQgYWZ0ZXIgdGhlIHZpZXcgaXMgbG9hZGVkXG5cbiAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICB3b0ZhY3RvcnkuZ2V0RGF0YSgpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcblxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGV4cG9zZSBkYXRhIGFzIGEgQ29sbGVjdGlvblZpZXcgdG8gZ2V0IGV2ZW50c1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmRhdGEgPSBuZXcgd2lqbW8uY29sbGVjdGlvbnMuQ29sbGVjdGlvblZpZXcocHJvbWlzZS5kYXRhKTtcblxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfV07XG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgcmV0dXJuIFsnJGh0dHAnLCAnJHEnLCAgJyRzdGF0ZVBhcmFtcycsIGZ1bmN0aW9uICgkaHR0cCwgJHEsICRzdGF0ZVBhcmFtcykge1xuICAgICAgICB2YXIgZmFjdG9yeSA9IHt9O1xuICAgICAgICBmYWN0b3J5LmdldERhdGEgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KCcvYXBpL3dvL2NsX2lkJywge1xuICAgICAgICAgICAgICAgICAgICAvKiBQT1NUIHZhcmlhYmxlcyBoZXJlICovXG4gICAgICAgICAgICAgICAgICAgIHByb2NjZXNfaWQ6IG5ldyBEYXRlKCkuZ2V0TWlsbGlzZWNvbmRzKCksXG4gICAgICAgICAgICAgICAgICAgIGNsX2lkOiAkc3RhdGVQYXJhbXMuY2xfaWRcbiAgICAgICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGZhY3Rvcnk7XG4gICAgfV07XG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKGFuZ3VsYXIpe1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBcbiAgICByZXR1cm4gYW5ndWxhci5tb2R1bGUoJ2FwcC53b3JrZmxvdycsW1xuICAgIF0pXG5cbiAgICAuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJyxcbiAgICBmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCd3b3JrZmxvdycsIHtcbiAgICAgICAgICAgIHVybDonL3dvcmtmbG93JyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsIDogJ2FwcC93b3JrZmxvdy93b3JrZmxvdy52aWV3Lmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlciA6ICd3b3JrZmxvd0NvbnRyb2xsZXInLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHJlcXVpcmVzTG9naW46IHRydWVcbiAgICAgICAgICAgIH0gICAgXG4gICAgICAgIH0pO1xuICAgIH1dKVxuXG4gICAgLmZhY3RvcnkoJ3dvcmtmbG93RmFjdG9yeScscmVxdWlyZSgnLi93b3JrZmxvdy5mYWMnKSlcblxuICAgIC5jb250cm9sbGVyKCd3b3JrZmxvd0NvbnRyb2xsZXInLHJlcXVpcmUoJy4vd29ya2Zsb3cuY3RybCcpKVxuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBcInRpdGxlXCI6IFwiRmx1am8gZGUgVHJhYmFqb1wiLFxuICAgIFwibGFiZWxzXCI6IHtcbiAgICAgICAgXCJ3by1pZFwiOiBcIk5vLiBvcmRlblwiLFxuICAgICAgICBcImNsLWlkXCI6IFwiY2xpZW50ZVwiLFxuICAgICAgICBcImNsLWNvcnBvcmF0ZW5hbWVcIjogXCJSYXrDs24gc29jaWFsXCIsXG4gICAgICAgIFwiY2wtZmF0aGVyc2xhc3RuYW1lXCI6IFwiQXBlbGxpZG8gcGF0ZXJub1wiLFxuICAgICAgICBcImNsLW1vdGhlcnNsYXN0bmFtZVwiOiBcIkFwZWxsaWRvIG1hdGVybm9cIixcbiAgICAgICAgXCJ6by1pZFwiOiBcInpvbmFcIixcbiAgICAgICAgXCJ3by1vcmRlcmVkYnlcIjogXCJPcmRlbmFkbyBwb3JcIixcbiAgICAgICAgXCJ3by1hdHRlbnRpb25cIjogXCJBdGVuY2nDs25cIixcbiAgICAgICAgXCJtYS1pZFwiOiBcIk1hcXVpbmFcIixcbiAgICAgICAgXCJ3by1yZWxlYXNlXCI6IFwiUmVsZWFzZVwiLFxuICAgICAgICBcIndvLXBvXCI6IFwiT3JkZW4gZGUgY29tcHJhXCIsXG4gICAgICAgIFwid28tbGluZVwiOiBcIkxpbmVhXCIsXG4gICAgICAgIFwid28tbGluZXRvdGFsXCI6IFwiRGVcIixcbiAgICAgICAgXCJwci1pZFwiOiBcIlByb2R1Y3RvXCIsXG4gICAgICAgIFwid28tcXR5XCI6IFwiQ2FudGlkYWRcIixcbiAgICAgICAgXCJ3by1wYWNrYWdlcXR5XCI6IFwiQ2FudGlkYWQgeCBwYXF1ZXRlXCIsXG4gICAgICAgIFwid28tZXhjZWRlbnRxdHlcIjogXCJFeGNlZGVudGVcIixcbiAgICAgICAgXCJ3by1mb2xpb3NwZXJmb3JtYXRcIjogXCJGb2xpb3MgeCBmb3JtYXRvXCIsXG4gICAgICAgIFwid28tZm9saW9zc2VyaWVzXCI6IFwiU2VyaWVcIixcbiAgICAgICAgXCJ3by1mb2xpb3Nmcm9tXCI6IFwiRGVsXCIsXG4gICAgICAgIFwid28tZm9saW9zdG9cIjogXCJBbFwiLFxuICAgICAgICBcIndvLXR5cGVcIjogXCJUaXBvXCIsXG4gICAgICAgIFwid28tY29tbWl0bWVudGRhdGVcIjogXCJGZWNoYSBjb21wcm9taXNvXCIsXG4gICAgICAgIFwid28tcHJldmlvdXNpZFwiOiBcIklEIGFudGVyaW9yXCIsXG4gICAgICAgIFwid28tcHJldmlvdXNkYXRlXCI6IFwiRmVjaGEgYW50ZXJpb3JcIixcbiAgICAgICAgXCJ3by1ub3Rlc1wiOiBcIk5vdGFzXCIsXG4gICAgICAgIFwid28tcHJpY2VcIjogXCJQcmVjaW9cIixcbiAgICAgICAgXCJ3by1jdXJyZW5jeVwiOiBcIk1vbmVkYVwiLFxuICAgICAgICBcIndvLWVtYWlsXCI6IFwiRW52aWFyIENvcnJlb1wiLFxuICAgICAgICBcIndvLXN0YXR1c1wiOiBcIkVzdGF0dXNcIixcbiAgICAgICAgXCJ3by1uZXh0c3RhdHVzXCI6IFwiQWN0dWFsaXphciBhOlwiLFxuICAgICAgICBcIndvLWRhdGVcIjogXCJGZWNoYVwiXG4gICAgfSxcbiAgICBcImNvbHVtbnNcIjogW1xuICAgICAgICBcIndvX2lkXCIsXG4gICAgICAgIFwiY2xfaWRcIixcbiAgICAgICAgXCJjbF9jb3Jwb3JhdGVuYW1lXCIsXG4gICAgICAgIFwiY2xfZmF0aGVyc2xhc3RuYW1lXCIsXG4gICAgICAgIFwiY2xfbW90aGVyc2xhc3RuYW1lXCIsXG4gICAgICAgIFwiem9faWRcIixcbiAgICAgICAgXCJ3b19vcmRlcmVkYnlcIixcbiAgICAgICAgXCJ3b19hdHRlbnRpb25cIixcbiAgICAgICAgXCJtYV9pZFwiLFxuICAgICAgICBcIndvX3JlbGVhc2VcIixcbiAgICAgICAgXCJ3b19wb1wiLFxuICAgICAgICBcIndvX2xpbmVcIixcbiAgICAgICAgXCJ3b19saW5ldG90YWxcIixcbiAgICAgICAgXCJwcl9pZFwiLFxuICAgICAgICBcIndvX3F0eVwiLFxuICAgICAgICBcIndvX3BhY2thZ2VxdHlcIixcbiAgICAgICAgXCJ3b19leGNlZGVudHF0eVwiLFxuICAgICAgICBcIndvX2ZvbGlvc3BlcmZvcm1hdFwiLFxuICAgICAgICBcIndvX2ZvbGlvc3Nlcmllc1wiLFxuICAgICAgICBcIndvX2ZvbGlvc2Zyb21cIixcbiAgICAgICAgXCJ3b19mb2xpb3N0b1wiLFxuICAgICAgICBcIndvX3R5cGVcIixcbiAgICAgICAgXCJ3b19jb21taXRtZW50ZGF0ZVwiLFxuICAgICAgICBcIndvX3ByZXZpb3VzaWRcIixcbiAgICAgICAgXCJ3b19wcmV2aW91c2RhdGVcIixcbiAgICAgICAgXCJ3b19ub3Rlc1wiLFxuICAgICAgICBcIndvX3ByaWNlXCIsXG4gICAgICAgIFwid29fY3VycmVuY3lcIixcbiAgICAgICAgXCJ3b19lbWFpbFwiLFxuICAgICAgICBcIndvX3N0YXR1c1wiLFxuICAgICAgICBcIndvX2RhdGVcIlxuICAgIF0sXG4gICAgXCJmaWVsZHNcIjoge1xuICAgICAgICB3b19zdGF0dXNvcHRpb25zOiBbXG4gICAgICAgICAgICB7IFwibGFiZWxcIjogXCJBY3Rpdm9cIiwgXCJ2YWx1ZVwiOiAwLCBcImRlc2NcIjogXCJPcmRlbiBBY3RpdmFcIiwgXCJ1c19ncm91cFwiOiBcInZlbnRhc1wiLCBcIndvX3ByZXZzdGF0dXNcIjogW10gfSxcbiAgICAgICAgICAgIHsgXCJsYWJlbFwiOiBcIkVuIGVzcGVyYSBkZSBtYXRlcmlhbFwiLCBcInZhbHVlXCI6IDEsIFwiZGVzY1wiOiBcIk5vIGhheSBtYXRlcmlhbCBlbiBlbCBhbG1hY8OpblwiLCBcInVzX2dyb3VwXCI6IFwiYWxtYWNlblwiLCBcIndvX3ByZXZzdGF0dXNcIjogWzAsIDcsIDEyXSB9LFxuICAgICAgICAgICAgeyBcImxhYmVsXCI6IFwiTWF0ZXJpYWwgZGlzcG9uaWJsZVwiLCBcInZhbHVlXCI6IDIsIFwiZGVzY1wiOiBcIkhheSBtYXRlcmlhbCBlbiBlbCBhbG1hY8OpbiBwZXJvIGF1biBubyBzZSBoYSBpbmljaWFkbyBlbCB0cmFiYWpvXCIsIFwidXNfZ3JvdXBcIjogXCJhbG1hY2VuXCIsIFwid29fcHJldnN0YXR1c1wiOiBbMCwgNywgMTJdIH0sXG4gICAgICAgICAgICB7IFwibGFiZWxcIjogXCJFbiBwcm9kdWNjacOzblwiLCBcInZhbHVlXCI6IDMsIFwiZGVzY1wiOiBcIkVuIHByb2R1Y2Npw7NuXCIsIFwidXNfZ3JvdXBcIjogXCJwcm9kdWNjaW9uXCIsIFwid29fcHJldnN0YXR1c1wiOiBbMiwgNywgMTJdIH0sXG4gICAgICAgICAgICB7IFwibGFiZWxcIjogXCJEZXRlbmlkb1wiLCBcInZhbHVlXCI6IDQsIFwiZGVzY1wiOiBcIkxhIG9yZGVuIHNlIGRldHV2byBlbiBwcm9kdWNjacOzblwiLCBcInVzX2dyb3VwXCI6IFwicHJvZHVjY2lvblwiLCBcIndvX3ByZXZzdGF0dXNcIjogWzNdIH0sXG4gICAgICAgICAgICB7IFwibGFiZWxcIjogXCJUZXJtaW5hZG9cIiwgXCJ2YWx1ZVwiOiA1LCBcImRlc2NcIjogXCJUZXJtaW5hZG8gZW4gcHJvZHVjY2nDs25cIiwgXCJ1c19ncm91cFwiOiBcInByb2R1Y2Npb25cIiwgXCJ3b19wcmV2c3RhdHVzXCI6IFszLCA0XSB9LFxuICAgICAgICAgICAgeyBcImxhYmVsXCI6IFwiRGVwYXJ0YW1lbnRvIGRlIGNhbGlkYWRcIiwgXCJ2YWx1ZVwiOiA2LCBcImRlc2NcIjogXCJJbnNwZWNjaW9uIGRlIGNhbGlkYWQgZW4gcHJvY2Vzb1wiLCBcInVzX2dyb3VwXCI6IFwiY2FsaWRhZFwiLCBcIndvX3ByZXZzdGF0dXNcIjogWzVdIH0sXG4gICAgICAgICAgICB7IFwibGFiZWxcIjogXCJSZWNoYXphZG8gcG9yIENhbGlkYWRcIiwgXCJ2YWx1ZVwiOiA3LCBcImRlc2NcIjogXCJSZWNoYXphZG8gcG9yIGNhbGlkYWRcIiwgXCJ1c19ncm91cFwiOiBcImNhbGlkYWRcIiwgXCJ3b19wcmV2c3RhdHVzXCI6IFs2XSB9LFxuICAgICAgICAgICAgeyBcImxhYmVsXCI6IFwiRW1wYXF1ZVwiLCBcInZhbHVlXCI6IDgsIFwiZGVzY1wiOiBcIkVuIHByb2Nlc28gZGUgZW1wYXF1ZVwiLCBcInVzX2dyb3VwXCI6IFwiZW1wYXF1ZVwiLCBcIndvX3ByZXZzdGF0dXNcIjogWzZdIH0sXG4gICAgICAgICAgICB7IFwibGFiZWxcIjogXCJMaXN0byBwYXJhIGVtYmFycXVlXCIsIFwidmFsdWVcIjogOSwgXCJkZXNjXCI6IFwiTGlzdG8gcGFyYSBlbWJhcnF1ZVwiLCBcInVzX2dyb3VwXCI6IFwiZW1wYXF1ZVwiLCBcIndvX3ByZXZzdGF0dXNcIjogWzhdIH0sXG4gICAgICAgICAgICB7IFwibGFiZWxcIjogXCJGYWN0dXJhZG9cIiwgXCJ2YWx1ZVwiOiAxMCwgXCJkZXNjXCI6IFwiRmFjdHVyYWRvXCIsIFwidXNfZ3JvdXBcIjogXCJhbG1hY2VuXCIsIFwid29fcHJldnN0YXR1c1wiOiBbOV0gfSxcbiAgICAgICAgICAgIHsgXCJsYWJlbFwiOiBcIk5vIHNlIHB1ZG8gZW50cmVnYXJcIiwgXCJ2YWx1ZVwiOiAxMSwgXCJkZXNjXCI6IFwiRWwgcHJvZHVjdG8gbm8gc2UgcHVkbyBlbnRyZWdhclwiLCBcInVzX2dyb3VwXCI6IFwiYWxtYWNlblwiLCBcIndvX3ByZXZzdGF0dXNcIjogWzEwXSB9LFxuICAgICAgICAgICAgeyBcImxhYmVsXCI6IFwiUmVjaGF6YWRvIHBvciBlbCBjbGllbnRlXCIsIFwidmFsdWVcIjogMTIsIFwiZGVzY1wiOiBcIkVsIHByb2R1Y3RvZnVlIHJlY2hhemFkbyBwb3IgZWwgY2xpZW50ZVwiLCBcInVzX2dyb3VwXCI6IFwiYWxtYWNlblwiLCBcIndvX3ByZXZzdGF0dXNcIjogWzEwXSB9LFxuICAgICAgICAgICAgeyBcImxhYmVsXCI6IFwiRW50cmVnYWRvXCIsIFwidmFsdWVcIjogMTMsIFwiZGVzY1wiOiBcIkVsIHByb2R1Y3RvIHNlIGVudHJlZ28gYWwgY2xpZW50ZSBjb24gw6l4aXRvXCIsIFwidXNfZ3JvdXBcIjogXCJhbG1hY2VuXCIsIFwid29fcHJldnN0YXR1c1wiOiBbMTAsIDExXSB9LFxuICAgICAgICAgICAgeyBcImxhYmVsXCI6IFwiQ2FuY2VsYXJcIiwgXCJ2YWx1ZVwiOiAxNCwgXCJkZXNjXCI6IFwiTGEgb3JkZW4gZGUgdHJhYmFqbyBmdWUgY2FuY2VsYWRhXCIsIFwidXNfZ3JvdXBcIjogXCJhZG1pblwiLCBcIndvX3ByZXZzdGF0dXNcIjogWzAsIDEsIDIsIDMsIDQsIDUsIDYsIDcsIDgsIDksIDEwLCAxMSwgMTIsIDEzXSB9XG4gICAgICAgIF1cbiAgICB9XG59IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckc2NvcGUnLCAnd29ya2Zsb3dGYWN0b3J5JywgJyRsb2NhdGlvbicsICdpMThuRmlsdGVyJywgJyRzdGF0ZVBhcmFtcycsICckZmlsdGVyJyxcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgd29ya2Zsb3dGYWN0b3J5LCAkbG9jYXRpb24sIGkxOG5GaWx0ZXIsICRzdGF0ZVBhcmFtcywgJGZpbHRlcikge1xuXG4gICAgICAgICAgICAkc2NvcGUuZm1EYXRhID0ge1xuICAgICAgICAgICAgICAgIFwid29fc3RhdHVzXCI6IDBcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICRzY29wZS5sYWJlbHMgPSBPYmplY3Qua2V5cyhpMThuRmlsdGVyKFwid29ya2Zsb3cubGFiZWxzXCIpKTtcbiAgICAgICAgICAgICRzY29wZS5jb2x1bW5zID0gaTE4bkZpbHRlcihcIndvcmtmbG93LmNvbHVtbnNcIik7XG5cbiAgICAgICAgICAgIC8vIGZvcm1hdHRlciB0byBhZGQgY2hlY2tib3hlcyB0byBib29sZWFuIGNvbHVtbnNcbiAgICAgICAgICAgICRzY29wZS5vblN1Ym1pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgZmxleCA9ICRzY29wZS5nZ0dyaWQ7XG4gICAgICAgICAgICAgICAgdmFyIGFyciA9IFtdXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmbGV4LnJvd3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZsZXguZ2V0Q2VsbERhdGEoaSwgZmxleC5jb2x1bW5zLmdldENvbHVtbignYWN0aXZlJykuaW5kZXgpID09PSB0cnVlKSBhcnIucHVzaChmbGV4LmdldENlbGxEYXRhKGksIGZsZXguY29sdW1ucy5nZXRDb2x1bW4oJ3dvX2lkJykuaW5kZXgpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgJHNjb3BlLndvX2lkID0gYXJyO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGFycilcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICAkc2NvcGUuaXRlbUZvcm1hdHRlciA9IGZ1bmN0aW9uIChwYW5lbCwgciwgYywgY2VsbCkge1xuXG4gICAgICAgICAgICAgICAgLy8gaGlnaGxpZ2h0IHJvd3MgdGhhdCBoYXZlICdhY3RpdmUnIHNldFxuICAgICAgICAgICAgICAgIGlmIChwYW5lbC5jZWxsVHlwZSA9PSB3aWptby5ncmlkLkNlbGxUeXBlLkNlbGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZsZXggPSBwYW5lbC5ncmlkO1xuICAgICAgICAgICAgICAgICAgICB2YXIgcm93ID0gZmxleC5yb3dzW3JdO1xuICAgICAgICAgICAgICAgICAgICBpZiAocm93LmRhdGFJdGVtLmFjdGl2ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2VsbC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnZ29sZCc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAocGFuZWwuY2VsbFR5cGUgPT0gd2lqbW8uZ3JpZC5DZWxsVHlwZS5Db2x1bW5IZWFkZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZsZXggPSBwYW5lbC5ncmlkO1xuICAgICAgICAgICAgICAgICAgICB2YXIgY29sID0gZmxleC5jb2x1bW5zW2NdO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNoZWNrIHRoYXQgdGhpcyBpcyBhIGJvb2xlYW4gY29sdW1uXG4gICAgICAgICAgICAgICAgICAgIGlmIChjb2wuZGF0YVR5cGUgPT0gd2lqbW8uRGF0YVR5cGUuQm9vbGVhbikge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBwcmV2ZW50IHNvcnRpbmcgb24gY2xpY2tcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbC5hbGxvd1NvcnRpbmcgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY291bnQgdHJ1ZSB2YWx1ZXMgdG8gaW5pdGlhbGl6ZSBjaGVja2JveFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNudCA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZsZXgucm93cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmbGV4LmdldENlbGxEYXRhKGksIGMpID09IHRydWUpIGNudCsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjcmVhdGUgYW5kIGluaXRpYWxpemUgY2hlY2tib3hcbiAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwuaW5uZXJIVE1MID0gJzxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIj4gJyArIGNlbGwuaW5uZXJIVE1MO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNiID0gY2VsbC5maXJzdENoaWxkO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2IuY2hlY2tlZCA9IGNudCA+IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYi5pbmRldGVybWluYXRlID0gY250ID4gMCAmJiBjbnQgPCBmbGV4LnJvd3MubGVuZ3RoO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBhcHBseSBjaGVja2JveCB2YWx1ZSB0byBjZWxsc1xuICAgICAgICAgICAgICAgICAgICAgICAgY2IuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZsZXguYmVnaW5VcGRhdGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZsZXgucm93cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmbGV4LnNldENlbGxEYXRhKGksIGMsIGNiLmNoZWNrZWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmbGV4LmVuZFVwZGF0ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgLy8gYXV0b3NpemUgY29sdW1uc1xuICAgICAgICAgICAgJHNjb3BlLml0ZW1zU291cmNlQ2hhbmdlZCA9IGZ1bmN0aW9uIChzZW5kZXIsIGFyZ3MpIHtcbiAgICAgICAgICAgICAgICBzZW5kZXIuYXV0b1NpemVDb2x1bW5zKCk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyBiaW5kIGNvbHVtbnMgd2hlbiBncmlkIGlzIGluaXRpYWxpemVkXG4gICAgICAgICAgICAkc2NvcGUuaW5pdEdyaWQgPSBmdW5jdGlvbiAocywgZSkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgJHNjb3BlLmNvbHVtbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbCA9IG5ldyB3aWptby5ncmlkLkNvbHVtbigpO1xuICAgICAgICAgICAgICAgICAgICBjb2wuYmluZGluZyA9ICRzY29wZS5jb2x1bW5zW2ldO1xuICAgICAgICAgICAgICAgICAgICBjb2wuaGVhZGVyID0gaTE4bkZpbHRlcihcIndvcmtmbG93LmxhYmVscy5cIiArICRzY29wZS5sYWJlbHNbaV0pO1xuICAgICAgICAgICAgICAgICAgICBzLmNvbHVtbnMucHVzaChjb2wpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIGNyZWF0ZSB0aGUgdG9vbHRpcCBvYmplY3RcbiAgICAgICAgICAgICRzY29wZS4kd2F0Y2goJ2dnR3JpZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoJHNjb3BlLmdnR3JpZCkge1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIHN0b3JlIHJlZmVyZW5jZSB0byBncmlkXG4gICAgICAgICAgICAgICAgICAgIHZhciBmbGV4ID0gJHNjb3BlLmdnR3JpZDtcblxuICAgICAgICAgICAgICAgICAgICAvLyBjcmVhdGUgdG9vbHRpcFxuICAgICAgICAgICAgICAgICAgICB2YXIgdGlwID0gbmV3IHdpam1vLlRvb2x0aXAoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJuZyA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gbW9uaXRvciB0aGUgbW91c2Ugb3ZlciB0aGUgZ3JpZFxuICAgICAgICAgICAgICAgICAgICBmbGV4Lmhvc3RFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBodCA9IGZsZXguaGl0VGVzdChldnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFodC5yYW5nZS5lcXVhbHMocm5nKSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbmV3IGNlbGwgc2VsZWN0ZWQsIHNob3cgdG9vbHRpcFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChodC5jZWxsVHlwZSA9PSB3aWptby5ncmlkLkNlbGxUeXBlLkNlbGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm5nID0gaHQucmFuZ2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb2wgPSBmbGV4LmNvbHVtbnNbcm5nLmNvbF0uaGVhZGVyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2VsbEVsZW1lbnQgPSBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KGV2dC5jbGllbnRYLCBldnQuY2xpZW50WSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjZWxsQm91bmRzID0gd2lqbW8uUmVjdC5mcm9tQm91bmRpbmdSZWN0KGNlbGxFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEgPSB3aWptby5lc2NhcGVIdG1sKGZsZXguZ2V0Q2VsbERhdGEocm5nLnJvdywgcm5nLmNvbCwgdHJ1ZSkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlwQ29udGVudCA9IGNvbCArICc6IFwiPGI+JyArIGRhdGEgKyAnPC9iPlwiJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNlbGxFbGVtZW50LmNsYXNzTmFtZS5pbmRleE9mKCd3ai1jZWxsJykgPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJuZy5jb2wgIT09IDApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlwLnNob3coZmxleC5ob3N0RWxlbWVudCwgdGlwQ29udGVudCwgY2VsbEJvdW5kcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXAuaGlkZSgpOyAvLyBjZWxsIG11c3QgYmUgYmVoaW5kIHNjcm9sbCBiYXIuLi5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGZsZXguaG9zdEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXAuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcm5nID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICRzY29wZS53b19zdGF0dXNvcHRpb25zID0gaTE4bkZpbHRlcihcIndvcmtmbG93LmZpZWxkcy53b19zdGF0dXNvcHRpb25zXCIpO1xuXG4gICAgICAgICAgICAkc2NvcGUuJG9uKCckdmlld0NvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICAvLyB0aGlzIGNvZGUgaXMgZXhlY3V0ZWQgYWZ0ZXIgdGhlIHZpZXcgaXMgbG9hZGVkXG4gICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgICRzY29wZS4kd2F0Y2goJ2ZtRGF0YS53b19zdGF0dXMnLCBmdW5jdGlvbiAobmV3VmFsdWUsIG9sZFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5hY3Rpb25zID0gW107XG4gICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUud29fc3RhdHVzb3B0aW9ucywgZnVuY3Rpb24gKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZS53b19wcmV2c3RhdHVzLmluY2x1ZGVzKG5ld1ZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHVzaCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sICRzY29wZS5hY3Rpb25zKVxuICAgICAgICAgICAgICAgICAgICB3b3JrZmxvd0ZhY3RvcnkuZ2V0RGF0YShuZXdWYWx1ZSkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGV4cG9zZSBkYXRhIGFzIGEgQ29sbGVjdGlvblZpZXcgdG8gZ2V0IGV2ZW50c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5kYXRhID0gbmV3IHdpam1vLmNvbGxlY3Rpb25zLkNvbGxlY3Rpb25WaWV3KHByb21pc2UuZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmRhdGEucGFnZVNpemUgPSA1O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1dO1xuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRodHRwJywgJyRxJywgICckc3RhdGVQYXJhbXMnLCBmdW5jdGlvbiAoJGh0dHAsICRxLCAkc3RhdGVQYXJhbXMpIHtcbiAgICAgICAgdmFyIGZhY3RvcnkgPSB7fTtcbiAgICAgICAgZmFjdG9yeS5nZXREYXRhID0gZnVuY3Rpb24gKHdvX3N0YXR1cykge1xuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoXG4gICAgICAgICAgICAgICAgJGh0dHAucG9zdCgnL2FwaS93b3JrZmxvdycsIHtcbiAgICAgICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgICAgICBwcm9jY2VzX2lkOiBuZXcgRGF0ZSgpLmdldE1pbGxpc2Vjb25kcygpLFxuICAgICAgICAgICAgICAgICAgICB3b19zdGF0dXM6IHdvX3N0YXR1c1xuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICBmYWN0b3J5LnVwZGF0ZSA9IGZ1bmN0aW9uICh3b19zdGF0dXMsIHdvX2lkKSB7XG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KCcvYXBpL3dvcmtmbG93L3VwZGF0ZScsIHtcbiAgICAgICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgICAgICBwcm9jY2VzX2lkOiBuZXcgRGF0ZSgpLmdldE1pbGxpc2Vjb25kcygpLFxuICAgICAgICAgICAgICAgICAgICB3b19zdGF0dXM6IHdvX3N0YXR1cyxcbiAgICAgICAgICAgICAgICAgICAgd29faWQ6IHdvX2lkXG4gICAgICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBmYWN0b3J5O1xuICAgIH1dO1xuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbihhbmd1bGFyKXtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgXG4gICAgcmV0dXJuIGFuZ3VsYXIubW9kdWxlKCdhcHAuem9uZScsW1xuICAgICAgICByZXF1aXJlKCcuL21vZHVsZXMvem9uZS5hZGQnKS5uYW1lLFxuICAgICAgICByZXF1aXJlKCcuL21vZHVsZXMvem9uZS51cGRhdGUnKS5uYW1lXG4gICAgXSlcblxuICAgIC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLFxuICAgIGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcbiAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3pvbmUnLCB7XG4gICAgICAgICAgICB1cmw6Jy96b25lLzpjbF9pZCcsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybCA6ICdhcHAvem9uZS96b25lLnZpZXcuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyIDogJ3pvbmVDdHJsJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICByZXF1aXJlc0xvZ2luOiB0cnVlXG4gICAgICAgICAgICB9ICAgIFxuICAgICAgICB9KTtcbiAgICB9XSlcblxuICAgIC5mYWN0b3J5KCd6b25lRmFjJyxyZXF1aXJlKCcuL3pvbmUuZmFjJykpXG5cbiAgICAuY29udHJvbGxlcignem9uZUN0cmwnLHJlcXVpcmUoJy4vem9uZS5jdHJsJykpXG4gICAgXG59KShhbmd1bGFyKTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCIgOiBcImRpcmVjY2lvbmVzIGRlIGVudmlvXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibGFiZWxzXCI6e1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJ6by1pZFwiIDogXCJpZCB6b25hXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsLWlkXCIgOiBcImlkIGNsaWVudGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiem8tem9uZVwiIDogXCJ6b25hXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInpvLWNvcnBvcmF0ZW5hbWVcIiA6IFwicmF6w7NuIHNvY2lhbFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ6by10aW5cIiA6IFwicmZjXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInpvLWltbWV4XCIgOiBcImltbWV4XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInpvLW5hbWVcIiA6IFwibm9tYnJlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInpvLWZhdGhlcnNsYXN0bmFtZVwiIDogXCJhcGVsbGlkbyBwYXRlcm5vXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInpvLW1vdGhlcnNsYXN0bmFtZVwiIDogXCJhcGVsbGlkbyBtYXRlcm5vXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInpvLXN0cmVldFwiOlwiY2FsbGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiem8tc3RyZWV0bnVtYmVyXCI6XCJudW1lcm8gZXh0ZXJpb3JcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiem8tc3VpdGVudW1iZXJcIjpcIm51bWVybyBpbnRlcmlvclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ6by1uZWlnaGJvcmhvb2RcIjpcImNvbG9uaWFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiem8tYWRkcmVzc3JlZmVyZW5jZVwiOlwicmVmZXJlbmNpYVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ6by1jb3VudHJ5XCI6XCJwYcOtc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ6by1zdGF0ZVwiOlwiZXN0YWRvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInpvLWNpdHlcIjpcImNpdWRhZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ6by1jb3VudHlcIjpcIm11bmljaXBpb1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ6by16aXBjb2RlXCI6XCJjb2RpZ28gcG9zdGFsXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInpvLWVtYWlsXCI6XCJjb3JyZW8gZWxlY3Ryw7NuaWNvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInpvLXBob25lXCI6XCJ0ZWzDqWZvbm9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiem8tbW9iaWxlXCI6XCJtw7N2aWxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiem8tc3RhdHVzXCI6XCJlc3RhdHVzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInpvLWRhdGVcIjpcImZlY2hhXCIsXG5cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgXCJjb2x1bW5zXCI6W1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJ6b19pZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbF9pZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ6b196b25lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInpvX2NvcnBvcmF0ZW5hbWVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiem9fdGluXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInpvX2ltbWV4XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInpvX25hbWVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiem9fZmF0aGVyc2xhc3RuYW1lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInpvX21vdGhlcnNsYXN0bmFtZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ6b19zdHJlZXRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiem9fc3RyZWV0bnVtYmVyXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInpvX3N1aXRlbnVtYmVyXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInpvX25laWdoYm9yaG9vZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ6b19hZGRyZXNzcmVmZXJlbmNlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInpvX2NvdW50cnlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiem9fc3RhdGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiem9fY2l0eVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ6b19jb3VudHlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiem9femlwY29kZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ6b19lbWFpbFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ6b19waG9uZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ6b19tb2JpbGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiem9fc3RhdHVzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInpvX2RhdGVcIixcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgIFwiZmllbGRzXCIgOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB6b19zdGF0dXNvcHRpb25zIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJBY3Rpdm9cIixcInZhbHVlXCI6XCJBXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcImxhYmVsXCI6XCJJbmFjdGl2b1wiLFwidmFsdWVcIjpcIklcIn1cbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKGFuZ3VsYXIpe1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBcbiAgICByZXR1cm4gYW5ndWxhci5tb2R1bGUoJ2FwcC56b25lLmFkZCcsW10pXG5cbiAgICAuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJyxcbiAgICBmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCd6b25lQWRkJywge1xuICAgICAgICAgICAgdXJsOicvem9uZS9hZGQvOmNsX2lkJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsIDogJ2FwcC96b25lL21vZHVsZXMvem9uZS5hZGQvem9uZS5hZGQudmlldy5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXIgOiAnem9uZUFkZEN0cmwnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHJlcXVpcmVzTG9naW46IHRydWVcbiAgICAgICAgICAgIH0gICAgXG4gICAgICAgIH0pO1xuICAgIH1dKVxuXG4gICAgLmZhY3RvcnkoJ3pvbmVBZGRGYWMnLHJlcXVpcmUoJy4vem9uZS5hZGQuZmFjJykpXG5cbiAgICAuY29udHJvbGxlcignem9uZUFkZEN0cmwnLHJlcXVpcmUoJy4vem9uZS5hZGQuY3RybCcpKVxuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiIDogXCJhZ3JlZ2FyIGRpcmVjY2nDs24gZGUgZW52aW9cIixcbiAgICAgICAgICAgICAgICB9IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckc2NvcGUnLCAnem9uZUFkZEZhYycsICckbG9jYXRpb24nLCAnaTE4bkZpbHRlcicsICckaW50ZXJ2YWwnLCAnJHN0YXRlUGFyYW1zJyxcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgem9uZUFkZEZhYywgJGxvY2F0aW9uLCBpMThuRmlsdGVyLCAkaW50ZXJ2YWwsICRzdGF0ZVBhcmFtcykge1xuICAgICAgICAgICAgJHNjb3BlLmZtRGF0YSA9IHt9O1xuICAgICAgICAgICAgJHNjb3BlLmZtRGF0YS5jbF9pZCA9ICRzdGF0ZVBhcmFtcy5jbF9pZDtcblxuICAgICAgICAgICAgJHNjb3BlLm9uU3VibWl0ID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgem9uZUFkZEZhYy5hZGQoJHNjb3BlLmZtRGF0YSkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocHJvbWlzZS5kYXRhID09IFwiMVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3pvbmUnKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS51cGRhdGVGYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgJHNjb3BlLmdldFN0YXRlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUuem9fc3RhdGVvcHRpb25zID0gW107XG4gICAgICAgICAgICAgICAgJHNjb3BlLnpvX2NpdHlvcHRpb25zID0gW107XG4gICAgICAgICAgICAgICAgJHNjb3BlLnpvX2NvdW50eW9wdGlvbnMgPSBbXTtcbiAgICAgICAgICAgICAgICAkaW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB6b25lQWRkRmFjLmdldFN0YXRlcygkc2NvcGUuZm1EYXRhLnpvX2NvdW50cnkpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhLmdlb25hbWVzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS56b19zdGF0ZW9wdGlvbnMgPSBwcm9taXNlLmRhdGEuZ2VvbmFtZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vJHNjb3BlLnVwZGF0ZUZhaWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LCAwLCAxKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJHNjb3BlLmdldENpdHlDb3VudHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnpvX2NpdHlvcHRpb25zID0gW107XG4gICAgICAgICAgICAgICAgJHNjb3BlLnpvX2NvdW50eW9wdGlvbnMgPSBbXTtcbiAgICAgICAgICAgICAgICAkaW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB6b25lQWRkRmFjLmdldFN0YXRlcygkc2NvcGUuZm1EYXRhLnpvX3N0YXRlKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YS5nZW9uYW1lcykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuem9fY2l0eW9wdGlvbnMgPSBwcm9taXNlLmRhdGEuZ2VvbmFtZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnpvX2NvdW50eW9wdGlvbnMgPSBwcm9taXNlLmRhdGEuZ2VvbmFtZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vJHNjb3BlLnVwZGF0ZUZhaWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LCAwLCAxKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICRzY29wZS56b19zdGF0dXNvcHRpb25zID0gaTE4bkZpbHRlcihcInpvbmUuZmllbGRzLnpvX3N0YXR1c29wdGlvbnNcIik7XG5cbiAgICAgICAgICAgICRzY29wZS4kb24oJyR2aWV3Q29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAvLyB0aGlzIGNvZGUgaXMgZXhlY3V0ZWQgYWZ0ZXIgdGhlIHZpZXcgaXMgbG9hZGVkXG4gICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB6b25lQWRkRmFjLmdldENsaWVudCgpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNPYmplY3QocHJvbWlzZS5kYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNsaWVudCA9IHByb21pc2UuZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgem9uZUFkZEZhYy5nZXRDb3VudHJpZXMoKS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhLmdlb25hbWVzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnpvX2NvdW50cnlvcHRpb25zID0gcHJvbWlzZS5kYXRhLmdlb25hbWVzO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8kc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1dO1xuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRodHRwJywgJyRxJywgICckc3RhdGVQYXJhbXMnLCBmdW5jdGlvbiAoJGh0dHAsICRxLCAkc3RhdGVQYXJhbXMpIHtcbiAgICAgICAgdmFyIGZhY3RvcnkgPSB7fTtcbiAgICAgICAgZmFjdG9yeS5nZXRDbGllbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KCdtb2R1bGVzL3pvbmUvbW9kdWxlcy96b25lLmFkZC96b25lLmFkZC5tZGwuZ2V0Q2xpZW50LnBocCcsIHtcbiAgICAgICAgICAgICAgICAgICAgLyogUE9TVCB2YXJpYWJsZXMgaGVyZSAqL1xuICAgICAgICAgICAgICAgICAgICBjbF9pZDogJHN0YXRlUGFyYW1zLmNsX2lkXG4gICAgICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkuYWRkID0gZnVuY3Rpb24gKHpvX2pzb25iKSB7XG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9ICRodHRwLnBvc3QoJ21vZHVsZXMvem9uZS9tb2R1bGVzL3pvbmUuYWRkL3pvbmUuYWRkLm1kbC5hZGQucGhwJywge1xuICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICB6b19qc29uYjogem9fanNvbmJcbiAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeS5nZXRDb3VudHJpZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9ICRodHRwLmdldCgnaHR0cDovL2FwaS5nZW9uYW1lcy5vcmcvY291bnRyeUluZm9KU09OP3VzZXJuYW1lPWFsZWphbmRyb2xzY2EnKVxuICAgICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeS5nZXRTdGF0ZXMgPSBmdW5jdGlvbiAoem9fY291bnRyeSkge1xuICAgICAgICAgICAgdmFyIHByb21pc2UgPSAkaHR0cC5nZXQoJ2h0dHA6Ly9hcGkuZ2VvbmFtZXMub3JnL2NoaWxkcmVuSlNPTj9nZW9uYW1lSWQ9JyArIHpvX2NvdW50cnkgKyAnJnVzZXJuYW1lPWFsZWphbmRyb2xzY2EnKVxuICAgICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeS5nZXRDaXR5Q291bnR5ID0gZnVuY3Rpb24gKHpvX3N0YXRlKSB7XG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9ICRodHRwLmdldCgnaHR0cDovL2FwaS5nZW9uYW1lcy5vcmcvY2hpbGRyZW5KU09OP2dlb25hbWVJZD0nICsgem9fc3RhdGUgKyAnJnVzZXJuYW1lPWFsZWphbmRyb2xzY2EnKVxuICAgICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IFwic3RhdHVzXCI6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGZhY3Rvcnk7XG4gICAgfV07XG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKGFuZ3VsYXIpe1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBcbiAgICByZXR1cm4gYW5ndWxhci5tb2R1bGUoJ2FwcC56b25lLnVwZGF0ZScsW10pXG5cbiAgICAuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJyxcbiAgICBmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCd6b25lVXBkYXRlJywge1xuICAgICAgICAgICAgdXJsOicvem9uZS91cGRhdGUvOmNsX2lkLzp6b19pZCcsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybCA6ICdhcHAvem9uZS9tb2R1bGVzL3pvbmUudXBkYXRlL3pvbmUudXBkYXRlLnZpZXcuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyIDogJ3pvbmVVcGRhdGVDdHJsJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICByZXF1aXJlc0xvZ2luOiB0cnVlXG4gICAgICAgICAgICB9ICAgIFxuICAgICAgICB9KTtcbiAgICB9XSlcblxuICAgIC5mYWN0b3J5KCd6b25lVXBkYXRlRmFjJyxyZXF1aXJlKCcuL3pvbmUudXBkYXRlLmZhYycpKVxuXG4gICAgLmNvbnRyb2xsZXIoJ3pvbmVVcGRhdGVDdHJsJyxyZXF1aXJlKCcuL3pvbmUudXBkYXRlLmN0cmwnKSlcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIiA6IFwiYWN0dWFsaXphciBkaXJlY2Npw7NuIGRlIGVudmlvXCIsXG4gICAgICAgICAgICAgICAgfSIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgcmV0dXJuIFsnJHNjb3BlJywgJ3pvbmVVcGRhdGVGYWMnLCAnJGxvY2F0aW9uJywgJ2kxOG5GaWx0ZXInLCAnJGludGVydmFsJywgJyRzdGF0ZVBhcmFtcycsXG4gICAgICAgIGZ1bmN0aW9uICgkc2NvcGUsIHpvbmVVcGRhdGVGYWMsICRsb2NhdGlvbiwgaTE4bkZpbHRlciwgJGludGVydmFsLCAkc3RhdGVQYXJhbXMpIHtcblxuICAgICAgICAgICAgJHNjb3BlLm9uU3VibWl0ID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgem9uZVVwZGF0ZUZhYy51cGRhdGUoJHNjb3BlLmZtRGF0YSkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocHJvbWlzZS5kYXRhID09IFwiMVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3pvbmUvJyArICRzdGF0ZVBhcmFtcy5jbF9pZCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICRzY29wZS5nZXRTdGF0ZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnpvX3N0YXRlb3B0aW9ucyA9IFtdO1xuICAgICAgICAgICAgICAgICRzY29wZS56b19jaXR5b3B0aW9ucyA9IFtdO1xuICAgICAgICAgICAgICAgICRzY29wZS56b19jb3VudHlvcHRpb25zID0gW107XG4gICAgICAgICAgICAgICAgJGludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgem9uZVVwZGF0ZUZhYy5nZXRTdGF0ZXMoJHNjb3BlLmZtRGF0YS56b19jb3VudHJ5KS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YS5nZW9uYW1lcykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuem9fc3RhdGVvcHRpb25zID0gcHJvbWlzZS5kYXRhLmdlb25hbWVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyRzY29wZS51cGRhdGVGYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSwgMCwgMSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICRzY29wZS5nZXRDaXR5Q291bnR5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICRzY29wZS56b19jaXR5b3B0aW9ucyA9IFtdO1xuICAgICAgICAgICAgICAgICRzY29wZS56b19jb3VudHlvcHRpb25zID0gW107XG4gICAgICAgICAgICAgICAgJGludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgem9uZVVwZGF0ZUZhYy5nZXRTdGF0ZXMoJHNjb3BlLmZtRGF0YS56b19zdGF0ZSkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEuZ2VvbmFtZXMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnpvX2NpdHlvcHRpb25zID0gcHJvbWlzZS5kYXRhLmdlb25hbWVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS56b19jb3VudHlvcHRpb25zID0gcHJvbWlzZS5kYXRhLmdlb25hbWVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyRzY29wZS51cGRhdGVGYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSwgMCwgMSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICRzY29wZS56b19zdGF0dXNvcHRpb25zID0gaTE4bkZpbHRlcihcInpvbmUuZmllbGRzLnpvX3N0YXR1c29wdGlvbnNcIik7XG5cbiAgICAgICAgICAgICRzY29wZS4kb24oJyR2aWV3Q29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAvLyB0aGlzIGNvZGUgaXMgZXhlY3V0ZWQgYWZ0ZXIgdGhlIHZpZXcgaXMgbG9hZGVkXG4gICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHpvbmVVcGRhdGVGYWMuZGF0YSgpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNPYmplY3QoYW5ndWxhci5mcm9tSnNvbihwcm9taXNlLmRhdGEpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmZtRGF0YSA9IGFuZ3VsYXIuZnJvbUpzb24ocHJvbWlzZS5kYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB6b25lVXBkYXRlRmFjLmdldENvdW50cmllcygpLnRoZW4oZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhLmdlb25hbWVzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS56b19jb3VudHJ5b3B0aW9ucyA9IHByb21pc2UuZGF0YS5nZW9uYW1lcztcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8kc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgem9uZVVwZGF0ZUZhYy5nZXRTdGF0ZXMoJHNjb3BlLmZtRGF0YS56b19jb3VudHJ5KS50aGVuKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShwcm9taXNlLmRhdGEuZ2VvbmFtZXMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS56b19zdGF0ZW9wdGlvbnMgPSBwcm9taXNlLmRhdGEuZ2VvbmFtZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8kc2NvcGUudXBkYXRlRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB6b25lVXBkYXRlRmFjLmdldENpdHlDb3VudHkoJHNjb3BlLmZtRGF0YS56b19zdGF0ZSkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkocHJvbWlzZS5kYXRhLmdlb25hbWVzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuem9fY2l0eW9wdGlvbnMgPSBwcm9taXNlLmRhdGEuZ2VvbmFtZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS56b19jb3VudHlvcHRpb25zID0gcHJvbWlzZS5kYXRhLmdlb25hbWVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vJHNjb3BlLnVwZGF0ZUZhaWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfV07XG5cbn0pKGFuZ3VsYXIpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgcmV0dXJuIFsnJGh0dHAnLCAnJHEnLCAgJyRzdGF0ZVBhcmFtcycsIGZ1bmN0aW9uICgkaHR0cCwgJHEsICRzdGF0ZVBhcmFtcykge1xuICAgICAgICB2YXIgZmFjdG9yeSA9IHt9O1xuICAgICAgICBmYWN0b3J5LmRhdGEgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KCdtb2R1bGVzL3pvbmUvbW9kdWxlcy96b25lLnVwZGF0ZS96b25lLnVwZGF0ZS5tZGwuZ2V0Wm9uZS5waHAnLCB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICAgICAgem9faWQ6ICRzdGF0ZVBhcmFtcy56b19pZFxuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICBmYWN0b3J5LnVwZGF0ZSA9IGZ1bmN0aW9uICh6b19qc29uYikge1xuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoXG4gICAgICAgICAgICAgICAgJGh0dHAucG9zdCgnbW9kdWxlcy96b25lL21vZHVsZXMvem9uZS51cGRhdGUvem9uZS51cGRhdGUubWRsLnVwZGF0ZS5waHAnLCB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICAgICAgem9faWQ6ICRzdGF0ZVBhcmFtcy56b19pZCxcbiAgICAgICAgICAgICAgICAgICAgem9fanNvbmI6IHpvX2pzb25iXG4gICAgICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkuZ2V0Q291bnRyaWVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHByb21pc2UgPSAkaHR0cC5nZXQoJ2h0dHA6Ly9hcGkuZ2VvbmFtZXMub3JnL2NvdW50cnlJbmZvSlNPTj91c2VybmFtZT1hbGVqYW5kcm9sc2NhJylcbiAgICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkuZ2V0U3RhdGVzID0gZnVuY3Rpb24gKHpvX2NvdW50cnkpIHtcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gJGh0dHAuZ2V0KCdodHRwOi8vYXBpLmdlb25hbWVzLm9yZy9jaGlsZHJlbkpTT04/Z2VvbmFtZUlkPScgKyB6b19jb3VudHJ5ICsgJyZ1c2VybmFtZT1hbGVqYW5kcm9sc2NhJylcbiAgICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnkuZ2V0Q2l0eUNvdW50eSA9IGZ1bmN0aW9uICh6b19zdGF0ZSkge1xuICAgICAgICAgICAgdmFyIHByb21pc2UgPSAkaHR0cC5nZXQoJ2h0dHA6Ly9hcGkuZ2VvbmFtZXMub3JnL2NoaWxkcmVuSlNPTj9nZW9uYW1lSWQ9JyArIHpvX3N0YXRlICsgJyZ1c2VybmFtZT1hbGVqYW5kcm9sc2NhJylcbiAgICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcInN0YXR1c1wiOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBmYWN0b3J5O1xuICAgIH1dO1xuXG59KShhbmd1bGFyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBbJyRzY29wZScsICd6b25lRmFjJywgJ2kxOG5GaWx0ZXInLFxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCB6b25lRmFjLCBpMThuRmlsdGVyKSB7XG5cbiAgICAgICAgICAgICRzY29wZS5sYWJlbHMgPSBPYmplY3Qua2V5cyhpMThuRmlsdGVyKFwiem9uZS5sYWJlbHNcIikpO1xuICAgICAgICAgICAgJHNjb3BlLmNvbHVtbnMgPSBpMThuRmlsdGVyKFwiem9uZS5jb2x1bW5zXCIpO1xuICAgICAgICBcbiAgICAgICAgICAgIC8vIGZvcm1hdEl0ZW0gZXZlbnQgaGFuZGxlclxuICAgICAgICAgICAgdmFyIHpvX2lkO1xuICAgICAgICAgICAgdmFyIGNsX2lkO1xuICAgICAgICAgICAgJHNjb3BlLmZvcm1hdEl0ZW0gPSBmdW5jdGlvbiAocywgZSwgY2VsbCkge1xuXG4gICAgICAgICAgICAgICAgaWYgKGUucGFuZWwuY2VsbFR5cGUgPT0gd2lqbW8uZ3JpZC5DZWxsVHlwZS5Sb3dIZWFkZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgZS5jZWxsLnRleHRDb250ZW50ID0gZS5yb3cgKyAxO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHMucm93cy5kZWZhdWx0U2l6ZSA9IDMwO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gYWRkIEJvb3RzdHJhcCBodG1sXG4gICAgICAgICAgICAgICAgaWYgKChlLnBhbmVsLmNlbGxUeXBlID09IHdpam1vLmdyaWQuQ2VsbFR5cGUuQ2VsbCkgJiYgKGUuY29sID09IDApKSB7XG4gICAgICAgICAgICAgICAgICAgIHpvX2lkID0gZS5wYW5lbC5nZXRDZWxsRGF0YShlLnJvdywgMSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBjbF9pZCA9IGUucGFuZWwuZ2V0Q2VsbERhdGEoZS5yb3csIDIsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgZS5jZWxsLnN0eWxlLm92ZXJmbG93ID0gJ3Zpc2libGUnO1xuICAgICAgICAgICAgICAgICAgICBlLmNlbGwuaW5uZXJIVE1MID0gJzxkaXYgY2xhc3M9XCJidG4tZ3JvdXAgYnRuLWdyb3VwLWp1c3RpZmllZFwiIHJvbGU9XCJncm91cFwiIGFyaWEtbGFiZWw9XCIuLi5cIj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidG4tZ3JvdXBcIiByb2xlPVwiZ3JvdXBcIj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiIy96b25lL3VwZGF0ZS8nKyBjbF9pZCArICcvJyArIHpvX2lkICsgJ1wiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0IGJ0bi14c1wiIG5nLWNsaWNrPVwiZWRpdCgkaXRlbS5jbF9pZClcIj5FZGl0YXI8L2E+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+JztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAgICAgLy8gYmluZCBjb2x1bW5zIHdoZW4gZ3JpZCBpcyBpbml0aWFsaXplZFxuICAgICAgICAgICAgJHNjb3BlLmluaXRHcmlkID0gZnVuY3Rpb24gKHMsIGUpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8ICRzY29wZS5sYWJlbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbCA9IG5ldyB3aWptby5ncmlkLkNvbHVtbigpO1xuICAgICAgICAgICAgICAgICAgICBjb2wuYmluZGluZyA9ICRzY29wZS5jb2x1bW5zW2ldO1xuICAgICAgICAgICAgICAgICAgICBjb2wuaGVhZGVyID0gaTE4bkZpbHRlcihcInpvbmUubGFiZWxzLlwiICsgJHNjb3BlLmxhYmVsc1tpXSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbC53b3JkV3JhcCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBjb2wud2lkdGggPSAxNTA7XG4gICAgICAgICAgICAgICAgICAgIHMuY29sdW1ucy5wdXNoKGNvbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIC8vIGNyZWF0ZSB0aGUgdG9vbHRpcCBvYmplY3RcbiAgICAgICAgICAgICRzY29wZS4kd2F0Y2goJ2dnR3JpZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoJHNjb3BlLmdnR3JpZCkge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgLy8gc3RvcmUgcmVmZXJlbmNlIHRvIGdyaWRcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZsZXggPSAkc2NvcGUuZ2dHcmlkO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNyZWF0ZSB0b29sdGlwXG4gICAgICAgICAgICAgICAgICAgIHZhciB0aXAgPSBuZXcgd2lqbW8uVG9vbHRpcCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgcm5nID0gbnVsbDtcblxuICAgICAgICAgICAgICAgICAgICAvLyBtb25pdG9yIHRoZSBtb3VzZSBvdmVyIHRoZSBncmlkXG4gICAgICAgICAgICAgICAgICAgIGZsZXguaG9zdEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGh0ID0gZmxleC5oaXRUZXN0KGV2dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWh0LnJhbmdlLmVxdWFscyhybmcpKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBuZXcgY2VsbCBzZWxlY3RlZCwgc2hvdyB0b29sdGlwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGh0LmNlbGxUeXBlID09IHdpam1vLmdyaWQuQ2VsbFR5cGUuQ2VsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBybmcgPSBodC5yYW5nZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvbCA9IGZsZXguY29sdW1uc1tybmcuY29sXS5oZWFkZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjZWxsRWxlbWVudCA9IGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQoZXZ0LmNsaWVudFgsIGV2dC5jbGllbnRZKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNlbGxCb3VuZHMgPSB3aWptby5SZWN0LmZyb21Cb3VuZGluZ1JlY3QoY2VsbEVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YSA9IHdpam1vLmVzY2FwZUh0bWwoZmxleC5nZXRDZWxsRGF0YShybmcucm93LCBybmcuY29sLCB0cnVlKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXBDb250ZW50ID0gY29sICsgJzogXCI8Yj4nICsgZGF0YSArICc8L2I+XCInO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2VsbEVsZW1lbnQuY2xhc3NOYW1lLmluZGV4T2YoJ3dqLWNlbGwnKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXAuc2hvdyhmbGV4Lmhvc3RFbGVtZW50LCB0aXBDb250ZW50LCBjZWxsQm91bmRzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpcC5oaWRlKCk7IC8vIGNlbGwgbXVzdCBiZSBiZWhpbmQgc2Nyb2xsIGJhci4uLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgZmxleC5ob3N0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpcC5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBybmcgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJHNjb3BlLiRvbignJHZpZXdDb250ZW50TG9hZGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIC8vIHRoaXMgY29kZSBpcyBleGVjdXRlZCBhZnRlciB0aGUgdmlldyBpcyBsb2FkZWRcbiAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgem9uZUZhYy5kYXRhKCkudGhlbihmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KHByb21pc2UuZGF0YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5kYXRhID0gbmV3IHdpam1vLmNvbGxlY3Rpb25zLkNvbGxlY3Rpb25WaWV3KHByb21pc2UuZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XTtcblxufSkoYW5ndWxhcik7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gWyckaHR0cCcsICckcScsICAnJHN0YXRlUGFyYW1zJywgZnVuY3Rpb24gKCRodHRwLCAkcSwgJHN0YXRlUGFyYW1zKSB7XG4gICAgICAgIHZhciBmYWN0b3J5ID0ge307XG4gICAgICAgIGZhY3RvcnkuZGF0YSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKFxuICAgICAgICAgICAgICAgICRodHRwLnBvc3QoJ21vZHVsZXMvem9uZS96b25lLm1kbC5nZXRab25lcy5waHAnLCB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFBPU1QgdmFyaWFibGVzIGhlcmUgKi9cbiAgICAgICAgICAgICAgICAgICAgcHJvY2Nlc19pZDogbmV3IERhdGUoKS5nZXRNaWxsaXNlY29uZHMoKSxcbiAgICAgICAgICAgICAgICAgICAgY2xfaWQ6ICRzdGF0ZVBhcmFtcy5jbF9pZFxuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJzdGF0dXNcIjogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZmFjdG9yeTtcbiAgICB9XTtcblxufSkoYW5ndWxhcik7Il19
