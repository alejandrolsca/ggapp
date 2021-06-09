module.exports = (function (angular) {
    'use strict';

    return angular.module('app.zone.view', ['app.constants'])

        .config(['$stateProvider', '$urlRouterProvider', 'roles',
            function ($stateProvider, $urlRouterProvider, roles) {
                const allRoles = roles.map(roles => roles.value)
                $stateProvider.state('zoneView', {
                    url: '/zone/view/:cl_id/:zo_id',
                    template: require('./zone.view.view.html'),
                    controller: 'zoneViewCtrl',
                    data: {
                        requiresLogin: true,
                        roles: [
                            ...allRoles
                        ]
                    }
                });
            }])

        .factory('zoneViewFac', require('./zone.view.fac'))

        .controller('zoneViewCtrl', require('./zone.view.ctrl'))

})(angular);