module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q',  function ($http, $q) {
        var factory = {};
        factory.data = function (target_date, wo_currency, fromDate, toDate) {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post(`/api/earningsbystatus/${target_date}`, {
                    /* POST variables here */
                    procces_id: new Date().getMilliseconds(),
                    wo_currency: wo_currency,
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