module.exports = (function (angular) {
    'use strict';

    return angular.module('app.printruns', [
    ])

        .config(['$stateProvider', '$urlRouterProvider',
            function ($stateProvider, $urlRouterProvider) {
                $stateProvider.state('printruns', {
                    url: '/printruns',
                    template: require('./printruns.view.html'),
                    controller: 'printrunsCtrl',
                    data: {
                        requiresLogin: true,
                        roles: [
                            'admin',
                            'admin_support'
                        ]
                    }
                });
            }])

        .factory('printrunsFac', require('./printruns.fac'))

        .controller('printrunsCtrl', require('./printruns.ctrl'))

})(angular);
