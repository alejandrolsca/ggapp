module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q',  '$stateParams', function ($http, $q, $stateParams) {
        var factory = {};
        factory.data = function () {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/product/pr_id', {
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
        factory.getClient = function () {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/product/client', {
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
        factory.getInks = function (in_type) {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/product/ink', {
                    /* POST variables here */
                    procces_id: new Date().getMilliseconds(),
                    in_type: in_type
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        factory.getMaterials = function (mt_type) {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/product/material', {
                    /* POST variables here */
                    procces_id: new Date().getMilliseconds(),
                    mt_type: mt_type
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        factory.update = function (pr_jsonb) {
            var promise = $http.post('/api/product/update', {
                /* POST variables here */
                pr_id: $stateParams.pr_id,
                pr_jsonb: pr_jsonb
            }).success(function (data, status, headers, config) {
                return data;
            }).error(function (data, status, headers, config) {
                return { "status": false };
            });
            return promise;
        };
        factory.getTariffCodes = function () {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/tariffcode', {
                    /* POST variables here */
                    procces_id: new Date().getMilliseconds(),
                    tc_status: 'A'
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