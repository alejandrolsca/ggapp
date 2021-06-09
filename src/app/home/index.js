module.exports = (function (angular) {
    'use strict';

    return angular.module('app.home', ['app.constants'])

        .config(['$stateProvider', '$urlRouterProvider', 'roles',
            function ($stateProvider, $urlRouterProvider, roles) {
                const allRoles = roles.map(roles => roles.value)
                $stateProvider.state('home', {
                    url: '/home',
                    template: require('./home.view.html'),
                    controller: 'homeCtrl',
                    data: {
                        requiresLogin: true,
                        roles: [
                            ...allRoles
                        ]
                    }
                });
            }])

        .factory('homeFac', require('./home.fac'))

        .controller('homeCtrl', require('./home.ctrl'))

})(angular);