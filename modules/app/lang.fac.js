module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q', '$alerts', function ($http, $q, $alerts) {
        var factory = {};
        factory.setLang = function (newLang) {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('modules/app/lang.mdl.setLang.php', {
                    lang: newLang
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    var stackError = JSON.stringify({                     status: data.status,                     error: data.error,                     errorType: data.type,                     config: config                 },null,4);                 $alerts.error('Wooops! an error has ocurred.',stackError);                 return { "status": false };
                })
                );
            return deferred.promise;
        };
        factory.getLang = function () {
            var deferred = $q.defer();
            deferred.resolve(
                $http.get('modules/app/lang.mdl.getLang.php')
                    .success(function (data, status, headers, config) {
                        return data;
                    }).error(function (data, status, headers, config) {
                        var stackError = JSON.stringify({                     status: data.status,                     error: data.error,                     errorType: data.type,                     config: config                 },null,4);                 $alerts.error('Wooops! an error has ocurred.',stackError);                 return { "status": false };
                    })
                );
            return deferred.promise;
        };
        return factory;
    }];

})(angular);