module.exports = (function (angular) {
    'use strict';

    return ['$q','store', 'jwtHelper',
        function ($q, store, jwtHelper) {
            return {
                'request': function (config) {
                    // if user is athenticated, add the profile to the headers
                    var token = store.get('token');
                    if (token) {
                        if (!jwtHelper.isTokenExpired(token)) {
                                config.headers.profile = JSON.stringify(store.get('profile'));
                                return config;
                        } else {
                            // if not profile not available, return config with no changes
                            return config;
                        }
                    }
                    return config;
                },

                'requestError': function (config) {
                    return config;
                }
            }
        }]

})(angular)