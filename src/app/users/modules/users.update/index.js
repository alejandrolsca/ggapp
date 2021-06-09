module.exports = (function (angular) {
    'use strict';

    return angular.module('app.users.update', ['app.constants'])

        .config(['$stateProvider', '$urlRouterProvider',
            function ($stateProvider, $urlRouterProvider) {
                $stateProvider.state('usersUpdate', {
                    url: '/users/update/:user_id',
                    template: require('./users.update.view.html'),
                    controller: 'usersUpdateCtrl',
                    data: {
                        requiresLogin: true,
                        roles: [
                            'owner'
                        ]
                    }
                });
            }])

        .factory('usersUpdateFac', require('./users.update.fac'))

        .controller('usersUpdateCtrl', require('./users.update.ctrl'))

})(angular);