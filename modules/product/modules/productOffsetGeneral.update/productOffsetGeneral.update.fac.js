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
                    var stackError = JSON.stringify({                     status: data.status,                     error: data.error,                     errorType: data.type,                     config: config                 },null,4);                 $alerts.error('Wooops! an error has ocurred.',stackError);                 return { "status": false };
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
                    var stackError = JSON.stringify({                     status: data.status,                     error: data.error,                     errorType: data.type,                     config: config                 },null,4);                 $alerts.error('Wooops! an error has ocurred.',stackError);                 return { "status": false };
                })
                );
            return deferred.promise;
        };
        factory.getCountries = function () {
            var promise = $http.jsonp('http://api.geonames.org/countryInfoJSON?username=alejandrolsca&callback=JSON_CALLBACK')
                .success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    var stackError = JSON.stringify({                     status: data.status,                     error: data.error,                     errorType: data.type,                     config: config                 },null,4);                 $alerts.error('Wooops! an error has ocurred.',stackError);                 return { "status": false };
                });
            return promise;
        };
        factory.getStates = function (pr_country) {
            var promise = $http.jsonp('http://api.geonames.org/childrenJSON?geonameId=' + pr_country + '&username=alejandrolsca&callback=JSON_CALLBACK')
                .success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    var stackError = JSON.stringify({                     status: data.status,                     error: data.error,                     errorType: data.type,                     config: config                 },null,4);                 $alerts.error('Wooops! an error has ocurred.',stackError);                 return { "status": false };
                });
            return promise;
        };
        factory.getCityCounty = function (pr_state) {
            var promise = $http.jsonp('http://api.geonames.org/childrenJSON?geonameId=' + pr_state + '&username=alejandrolsca&callback=JSON_CALLBACK')
                .success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    var stackError = JSON.stringify({                     status: data.status,                     error: data.error,                     errorType: data.type,                     config: config                 },null,4);                 $alerts.error('Wooops! an error has ocurred.',stackError);                 return { "status": false };
                });
            return promise;
        };
        return factory;
    }];

})(angular);