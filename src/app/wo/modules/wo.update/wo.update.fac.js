module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q',  '$stateParams', 'authService', function ($http, $q, $stateParams, authService) {
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
                })
            );
            return deferred.promise;
        };
        factory.update = function (wo_jsonb) {
            const { us_group } = authService.profile()
            var promise = $http.post('/api/wo/update', {
                /* POST variables here */
                procces_id: new Date().getMilliseconds(),
                us_group: us_group,
                cl_id: $stateParams.cl_id,
                wo_id: $stateParams.wo_id,
                wo_jsonb: wo_jsonb
            }).success(function (data, status, headers, config) {
                return data;
            })

            return promise;
        };
        return factory;
    }];

})(angular);