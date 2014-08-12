'use strict';

module.exports = function($http, $q, $stateParams){
        var factory = {};
        factory.data = function() {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('modules/client/modules/client.update/models/client.model.php', {
                    /* POST variables here */
                    cl_id: $stateParams.cl_id
                }).success(function(data, status, headers, config){
                    return data;
                }).error(function (data, status, headers, config) {
                    return {"status": false};
                })
            );
            return deferred.promise;
        };
        factory.update = function(cl_jsonb) {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('modules/client/modules/client.update/models/client.update.model.php', {
                    /* POST variables here */
                    cl_id: $stateParams.cl_id,
                    cl_jsonb: cl_jsonb
                }).success(function(data, status, headers, config){
                    return data;
                }).error(function (data, status, headers, config) {
                    return {"status": false};
                })
            );
            return deferred.promise;
        };
        return factory;
    };