module.exports = (function(angular){
    'use strict';
    
    return function($http, $q , $stateParams){
        var factory = {};
        factory.getClient = function() {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('modules/wo/modules/woAdd/models/wo.getClient.model.php', {
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
        factory.addData = function() {
            var promise = $http.post('modules/wo/modules/woAdd/models/wo.add.model.php', {
                    /* POST variables here */
            }).success(function(data, status, headers, config){
                return data;
            }).error(function (data, status, headers, config) {
                return {"status": false};
            });
            return promise;
        };
        return factory;
    };
    
})(angular);