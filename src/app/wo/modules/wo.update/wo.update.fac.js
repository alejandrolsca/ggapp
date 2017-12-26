module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q',  '$stateParams', function ($http, $q, $stateParams) {
        var factory = {};
        factory.getData = function () {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/wo/wo_id', {
                    /* POST variables here */
                    procces_id: new Date().getMilliseconds(),
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
        factory.getClient = function() {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/client/cl_id', {
                    /* POST variables here */
                    procces_id: new Date().getMilliseconds(),
                    cl_id: $stateParams.cl_id,
                    cl_status: 'A,I'
                }).success(function(data, status, headers, config) {
                    return data;
                }).error(function(data, status, headers, config) {
                    
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
                    procces_id: new Date().getMilliseconds(),
                    cl_id: $stateParams.cl_id,
                    zo_status: 'A,I'
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
        factory.getProduct = function (pr_id) {
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
                    
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        factory.getProductInfo = function(pr_id) {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/product/info', {
                    /* POST variables here */
                    procces_id: new Date().getMilliseconds(),
                    pr_id: pr_id,
                    pr_status: 'A,I'
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
                    in_status: 'A,I'
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
                    mt_status: 'A,I'
                }).success(function(data, status, headers, config) {
                    return data;
                }).error(function(data, status, headers, config) {    
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        factory.update = function (wo_jsonb) {
            var promise = $http.post('/api/wo/update', {
                /* POST variables here */
                procces_id: new Date().getMilliseconds(),
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