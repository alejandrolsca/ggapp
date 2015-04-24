module.exports = (function(angular){
    'use strict';
    
    return function($http, $q, $stateParams, $interval){
        var factory = {};
        factory.getClient = function() {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('modules/product/modules/productOffsetGeneral.add/productOffsetGeneral.add.mdl.getClient.php', {
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
        factory.add = function(pr_jsonb) {
            var promise = $http.post('modules/product/modules/productOffsetGeneral.add/productOffsetGeneral.add.mdl.add.php', {
                    /* POST variables here */
                    pr_jsonb: pr_jsonb
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