module.exports = (function (angular) {
    'use strict';

    return angular.module('app.machinesProductivity', [
    ])

        .config(['$stateProvider', '$urlRouterProvider',
            function ($stateProvider, $urlRouterProvider) {
                $stateProvider.state('machinesProductivity', {
                    url: '/machinesproductivity',
                    template: require('./machines-productivity.view.html'),
                    controller: 'machinesProductivityCtrl',
                    data: {
                        requiresLogin: true,
                        roles: [
                            'admin',
                            'admin_support'
                        ]
                    }
                });
            }])

        .factory('machinesProductivityFac', require('./machines-productivity.fac'))

        .controller('machinesProductivityCtrl', require('./machines-productivity.ctrl'))

})(angular);
