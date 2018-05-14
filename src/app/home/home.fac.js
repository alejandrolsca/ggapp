module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q',  function ($http, $q) {
        var factory = {};
        factory.getDelivered = function (fromDate, toDate) {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/dashboard/deliveredwo', {
                    /* POST variables here */
                    procces_id: new Date().getMilliseconds(),
                    fromDate: fromDate,
                    toDate: toDate
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