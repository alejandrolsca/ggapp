module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q', '$stateParams', function ($http, $q, $stateParams) {
        var factory = {};
        factory.getClient = function (cl_id) {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/exportationinvoice/client/cl_id', {
                    /* POST variables here */
                    cl_id: cl_id,
                    cl_status: 'A'
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {              
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        factory.getZone = function(cl_id) {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/zone/cl_id', {
                    /* POST variables here */
                    cl_id: cl_id,
                    zo_status: 'A'
                }).success(function(data, status, headers, config) {
                    return data;
                }).error(function(data, status, headers, config) {
                    
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        factory.searchWoId = function(cl_id, wo_id) {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/exportationinvoice/cl_id/wo_id', {
                    /* POST variables here */
                    cl_id: cl_id,
                    wo_id: wo_id
                }).success(function(data, status, headers, config) {
                    return data;
                }).error(function(data, status, headers, config) {
                    
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        factory.getEI = function() {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/exportationinvoice/ei_id', {
                    /* POST variables here */
                    ei_id: $stateParams.ei_id
                }).success(function(data, status, headers, config) {
                    return data;
                }).error(function(data, status, headers, config) {
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        return factory;
    }];

})(angular);