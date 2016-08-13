module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q', '$alerts', '$stateParams',
        function ($http, $q, $alerts, $stateParams) {
            var factory = {};
            factory.updateData = function () {
                var promise = $http.post('modules/wo/modules/woUpdate/wo.update.mdl.update.php', {
                    /* POST variables here */
                    wo_id: $stateParams.wo_id
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