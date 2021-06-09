module.exports = (function (angular) {
    'use strict';

    return angular.module('app.wo.view', ['app.constants'])

        .config(['$stateProvider', '$urlRouterProvider', 'roles',
            function ($stateProvider, $urlRouterProvider, roles) {
                const allRoles = roles.map(roles => roles.value)
                $stateProvider.state('woView', {
                    url: '/wo/view/:cl_id/:wo_id',
                    template: require('./wo.view.view.html'),
                    controller: 'woViewController',
                    data: {
                        requiresLogin: true,
                        roles: [
                            ...allRoles
                        ]
                    }
                });
            }])

        .factory('woViewFactory', require('./wo.view.fac'))

        .controller('woViewController', require('./wo.view.ctrl'))

})(angular);