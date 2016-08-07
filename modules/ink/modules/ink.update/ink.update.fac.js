module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q', '$alerts', '$stateParams', function ($http, $q, $alerts, $stateParams) {
        var factory = {};
        factory.data = function () {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('modules/ink/modules/ink.update/ink.update.mdl.getink.php', {
                    /* POST variables here */
                    in_id: $stateParams.in_id
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    var stackError = JSON.stringify({                     status: data.status,                     error: data.error,                     errorType: data.type,                     config: config                 },null,4);                 $alerts.error('Wooops! an error has ocurred.',stackError);                 return { "status": false };
                })
                );
            return deferred.promise;
        };
        factory.update = function (in_jsonb) {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('modules/ink/modules/ink.update/ink.update.mdl.update.php', {
                    /* POST variables here */
                    in_id: $stateParams.in_id,
                    in_jsonb: in_jsonb
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    var stackError = JSON.stringify({                     status: data.status,                     error: data.error,                     errorType: data.type,                     config: config                 },null,4);                 $alerts.error('Wooops! an error has ocurred.',stackError);                 return { "status": false };
                })
                );
            return deferred.promise;
        };
        factory.getSuppliers = function () {
            var promise = $http.get('modules/ink/modules/ink.add/ink.add.mdl.getSuppliers.php')
                .success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    var stackError = JSON.stringify({                     status: data.status,                     error: data.error,                     errorType: data.type,                     config: config                 },null,4);                 $alerts.error('Wooops! an error has ocurred.',stackError);                 return { "status": false };
                });
            return promise;
        };
        return factory;
    }];

})(angular);