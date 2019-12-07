module.exports = (function (angular) {
    'use strict';

    return ['$q', '$injector', 'notyf',
        function ($q, $injector, notyf) {
            return {
                'request': function (config) {
                    // if user is athenticated, add the profile to the headers
                    const authService = $injector.get('authService')
                    const { username } = authService.profile()
                    if (!!username) {
                        config.headers.username = username;
                    }
                    return config;
                },

                'requestError': function (rejection) {
                    // do something on error
                    return $q.reject(rejection);
                },
                'responseError': function (rejection) {
                    // do something on error
                    var alerts = $injector.get('$alerts');
                    if (rejection.status !== 401) {
                        switch (rejection.status) {
                            case 601:
                                notyf.error('La orden de trabajo no esta activa ó necesita privilegios adicionales para realizar esta acción. Por favor contacte al propietario.')
                                break;
                            default:
                                alerts.error('¡Ups! algo salio mal.', JSON.stringify(rejection, null, 4));
                                break;
                        }
                    }
                    return $q.reject(rejection);
                }
            }
        }]

})(angular)