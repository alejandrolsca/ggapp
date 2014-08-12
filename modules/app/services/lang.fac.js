'use strict';

module.exports = function($http, $q) {
    var factory = {};
    factory.setLang = function(newLang) {
        var deferred = $q.defer();
        deferred.resolve(
            $http.post('modules/app/models/lang.set.model.php', {
                lang: newLang
            }).success(function(data, status, headers, config){
                return data;
            }).error(function (data, status, headers, config) {
                return {"status": false};
            })
        );
        return deferred.promise;
    };
    factory.getLang = function() {
        var deferred = $q.defer();
        deferred.resolve(
            $http.get('modules/app/models/lang.get.model.php')
            .success(function(data, status, headers, config){
                return data;
            }).error(function (data, status, headers, config) {
                return {"status": false};
            })
        );
        return deferred.promise;
    };
    return factory;
};