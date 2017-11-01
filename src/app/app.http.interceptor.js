module.exports = (function (angular) {
    'use strict';

    return ['$q', '$injector', 'authService',
        function ($q, $injector, authService) {
            return {
                'request': function (config) {
                    // if user is athenticated, add the profile to the headers

                    if (!!authService.userProfile) {
                        config.headers.profile = JSON.stringify(authService.userProfile);
                    }
                    return config;
                },

                'requestError': function (rejection) {
                    // do something on error
                    console.log('requestError: ',rejection)
                    return $q.reject(rejection);
                },
                'responseError': function (rejection) {
                    console.log('responseError: ',rejection)
                    // do something on error
                    var alerts = $injector.get('$alerts');
                    if(rejection.status !== 401) {
                        alerts.error('Wooops! an error has ocurred.', JSON.stringify(rejection, null, 4));
                    }
                    return $q.reject(rejection);
                }
            }
        }]

})(angular)