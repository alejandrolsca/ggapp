module.exports = (function (angular) {
    'use strict';

    return angular.module('app.finishesCount', [
    ])

        .config(['$stateProvider', '$urlRouterProvider',
            function ($stateProvider, $urlRouterProvider) {
                $stateProvider.state('finishesCount', {
                    url: '/finishescount',
                    template: require('./finishes-count.view.html'),
                    controller: 'finishesCountCtrl',
                    data: {
                        requiresLogin: true,
                        roles: [
                            'admin',
                            'admin_support'
                        ]
                    }
                });
            }])

        .factory('finishesCountFac', require('./finishes-count.fac'))

        .controller('finishesCountCtrl', require('./finishes-count.ctrl'))

})(angular);
