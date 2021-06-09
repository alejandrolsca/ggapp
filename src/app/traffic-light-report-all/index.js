module.exports = (function (angular) {
    'use strict';

    return angular.module('app.tlrAll', [
        'app.constants'
    ])

        .config(['$stateProvider', '$urlRouterProvider', 'roles',
            function ($stateProvider, $urlRouterProvider, roles) {
                const allRoles = roles.map(roles => roles.value)
                $stateProvider.state('tlrAll', {
                    url: '/tlr-all/',
                    template: require('./traffic-light-report-all.view.html'),
                    controller: 'tlrAllController',
                    data: {
                        requiresLogin: true,
                        roles: [
                            ...allRoles
                        ]
                    }
                });
            }])

        .factory('tlrAllFactory', require('./traffic-light-report-all.fac'))

        .controller('tlrAllController', require('./traffic-light-report-all.ctrl'))

})(angular);