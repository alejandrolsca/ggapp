module.exports = (function(angular){
    'use strict';
    
    return function($http, $q){
        var factory = {};
        factory.getLogin = function(user) {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('modules/home/models/homeModel.php', {
                        /* POST variables here */
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