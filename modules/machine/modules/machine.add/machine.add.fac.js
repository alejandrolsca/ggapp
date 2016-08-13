module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q', '$alerts', '$stateParams',
        function ($http, $q, $alerts, $stateParams) {
            var factory = {};
            factory.add = function (ma_jsonb) {
                var promise = $http.post('modules/machine/modules/machine.add/machine.add.mdl.add.php', {
                    /* POST variables here */
                    ma_jsonb: ma_jsonb
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    var stackError = JSON.stringify({
                        status: data.status,
                        error: data.error,
                        errorType: data.type,
                        config: config
                    }, null, 4);
                    $alerts.error('Wooops! an error has ocurred.', stackError);
                    return { "status": false };
                });
                return promise;
            };
            return factory;
        }];

})(angular);