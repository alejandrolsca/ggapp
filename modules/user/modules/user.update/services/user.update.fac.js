module.exports = (function(angular){
    'use strict';
    
    return function($http, $q, $stateParams){
        var factory = {};
        factory.data = function() {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('modules/user/modules/user.update/models/user.model.php', {
                    /* POST variables here */
                    us_id: $stateParams.us_id
                }).success(function(data, status, headers, config){
                    return data;
                }).error(function (data, status, headers, config) {
                    return {"status": false};
                })
            );
            return deferred.promise;
        };
        factory.update = function(us_jsonb) {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('modules/user/modules/user.update/models/user.update.model.php', {
                    /* POST variables here */
                    us_id: $stateParams.us_id,
                    us_jsonb: us_jsonb
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
    
})(angular);