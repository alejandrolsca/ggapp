module.exports = (function (angular) {
    'use strict';

    return angular.module('app.workflow2', [
    ])

        .config(['$stateProvider', '$urlRouterProvider',
            function ($stateProvider, $urlRouterProvider) {
                $stateProvider.state('workflow2', {
                    url: '/workflow2',
                    template: require('./workflow2.view.html'),
                    controller: 'workflow2Controller',
                    data: {
                        requiresLogin: true,
                        roles: [
                            'admin',
                            'finishing',
                            'packaging',
                            'production',
                            'quality_assurance',
                            'sales',
                            'warehouse'
                        ]
                    }
                });
            }])

        .factory('workflow2Factory', require('./workflow2.fac'))

        .controller('workflow2Controller', require('./workflow2.ctrl'))

})(angular);