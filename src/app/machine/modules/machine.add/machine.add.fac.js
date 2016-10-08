module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q',  '$stateParams',
        function ($http, $q, $stateParams) {
            var factory = {};
            factory.add = function (ma_jsonb) {
                var promise = $http.post('/api/machine/add', {
                    /* POST variables here */
                    ma_jsonb: ma_jsonb
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    
                    return { "status": false };
                });
                return promise;
            };
            return factory;
        }];

})(angular);