module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q',  '$stateParams', function ($http, $q, $stateParams) {
        var factory = {};
        factory.getData = function (wo_id, zo_zone, wo_release, wo_po, pr_name, wo_date) {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/wo/cl_id', {
                    /* POST variables here */
                    procces_id: new Date().getMilliseconds(),
                    cl_id: $stateParams.cl_id,
                    wo_id: wo_id,
                    zo_zone: zo_zone,
                    wo_release: wo_release,
                    wo_po: wo_po,
                    pr_name: pr_name,
                    wo_date: wo_date
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