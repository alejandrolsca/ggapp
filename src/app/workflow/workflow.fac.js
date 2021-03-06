module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q',  '$stateParams', function ($http, $q, $stateParams) {
        var factory = {};
        factory.getData = function (wo_status, interval) {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/workflow', {
                    /* POST variables here */
                    procces_id: new Date().getMilliseconds(),
                    wo_status: wo_status,
                    interval: interval
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        factory.updatecancellation = function (wo_status, wo_updatedby, wo_cancellationnotes, wo_id ) {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/workflow/updatecancellation', {
                    /* POST variables here */
                    procces_id: new Date().getMilliseconds(),
                    wo_status: wo_status,
                    wo_updatedby: wo_updatedby,
                    wo_cancellationnotes: wo_cancellationnotes,
                    wo_id: wo_id
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        factory.update = function (wo_status, wo_updatedby, wo_id, wo_cancellationnotes) {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/workflow/update', {
                    /* POST variables here */
                    procces_id: new Date().getMilliseconds(),
                    wo_status: wo_status,
                    wo_updatedby: wo_updatedby,
                    wo_id: wo_id
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        factory.getWoPrint = function (wo_id) {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/wo/print', {
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
        return factory;
    }];

})(angular);