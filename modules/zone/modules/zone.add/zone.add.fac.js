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