module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q',  function ($http, $q) {
        var factory = {};
        factory.searchWoID = function (wo_id) {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/search/wo/id', {
                    /* POST variables here */
                    procces_id: new Date().getMilliseconds(),
                    wo_id: wo_id
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {         
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
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