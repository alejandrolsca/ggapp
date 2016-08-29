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