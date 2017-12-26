module.exports = (function(angular){
    'use strict';
    
    return ['$http', '$q',  '$stateParams', function($http, $q, $stateParams){
        var factory = {};
        factory.data = function() {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/supplier/su_id', {
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
                $http.post('/api/supplier/update', {
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
        factory.getCountries = function () {
            var promise = $http.post('/api/geonames/countries', {
                /* POST variables here */
            }).success(function (data, status, headers, config) {
                return data;
            }).error(function (data, status, headers, config) {

                return { "status": false };
            });
            return promise;
        };
        factory.getChilds = function (geonameId) {
            var promise = $http.post('/api/geonames/childs/geonameid', {
                /* POST variables here */
                geonameId: geonameId
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