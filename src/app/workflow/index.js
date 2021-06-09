module.exports = (function (angular) {
    'use strict';

    return angular.module('app.workflow', [
        'app.constants'
    ])

        .config(['$stateProvider', '$urlRouterProvider', 'roles',
            function ($stateProvider, $urlRouterProvider, roles) {
                const allRoles = roles.map(roles => roles.value)
                $stateProvider.state('workflow', {
                    url: '/workflow',
                    template: require('./workflow.view.html'),
                    controller: 'workflowController',
                    data: {
                        requiresLogin: true,
                        roles: [
                            ...allRoles
                        ]
                    }
                });
            }])

        .factory('workflowFactory', require('./workflow.fac'))

        .controller('workflowController', require('./workflow.ctrl'))

})(angular);