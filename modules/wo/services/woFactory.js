'use strict';

module.exports = function($http, $q){
        var factory = {};
        factory.getData = function() {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('modules/wo/models/woModel.php', {
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