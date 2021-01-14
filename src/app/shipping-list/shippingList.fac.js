module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q', '$stateParams', function ($http, $q, $stateParams) {
        var factory = {};
        factory.getData = function () {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/shippinglist', {
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
        }
        factory.cancelSL = function (wo_id, sl_id) {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/shippinglist/cancel', {
                    /* POST variables here */
                    wo_id: wo_id,
                    sl_id: sl_id
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {

                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        factory.addExportationInvoice = function (zo_id, wo_id, ei_createdby) {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/exportationinvoice/add', {
                    /* POST variables here */
                    cl_id: $stateParams.cl_id,
                    zo_id: zo_id,
                    wo_id: wo_id,
                    ei_createdby: ei_createdby
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