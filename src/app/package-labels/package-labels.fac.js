module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q', '$stateParams', function ($http, $q, $stateParams) {
        var factory = {};
        factory.searchWoId = function (wo_id) {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/pkglbls/wo_id', {
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