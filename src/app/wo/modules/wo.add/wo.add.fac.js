module.exports = (function(angular) {
    'use strict';

    return ['$http', '$q',  '$stateParams', function($http, $q, $stateParams) {
        var factory = {};
        factory.getClient = function() {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/client/cl_id', {
                    /* POST variables here */
                    procces_id: new Date().getMilliseconds(),
                    cl_id: $stateParams.cl_id
                }).success(function(data, status, headers, config) {
                    return data;
                }).error(function(data, status, headers, config) {
                    
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        factory.getZone = function() {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/zone/cl_id', {
                    /* POST variables here */
                    procces_id: new Date().getMilliseconds(),
                    cl_id: $stateParams.cl_id
                }).success(function(data, status, headers, config) {
                    return data;
                }).error(function(data, status, headers, config) {
                    
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        factory.getMachine = function(ma_process) {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/machine/process', {
                    /* POST variables here */
                    procces_id: new Date().getMilliseconds(),
                    ma_process: ma_process,
                    ma_status: 'A'
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
                    procces_id: new Date().getMilliseconds(),
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
        factory.getProductInfo = function() {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/product/info', {
                    /* POST variables here */
                    procces_id: new Date().getMilliseconds(),
                    pr_id: $stateParams.pr_id,
                    pr_status: 'A'
                }).success(function(data, status, headers, config) {
                    return data;
                }).error(function(data, status, headers, config) {    
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        factory.getProductInfoInks = function(in_id) {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/product/info/inks', {
                    /* POST variables here */
                    procces_id: new Date().getMilliseconds(),
                    in_id: in_id,
                    in_status: 'A'
                }).success(function(data, status, headers, config) {
                    return data;
                }).error(function(data, status, headers, config) {    
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        factory.getProductInfoMaterial = function(mt_id) {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/product/info/material', {
                    /* POST variables here */
                    procces_id: new Date().getMilliseconds(),
                    mt_id: mt_id,
                    mt_status: 'A'
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