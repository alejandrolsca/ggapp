module.exports = (function (angular) {
    'use strict';

    return angular.module('app.user.profile', ['app.constants'])

        .config(['$stateProvider', '$urlRouterProvider', 'roles',
            function ($stateProvider, $urlRouterProvider, roles) {
                const allRoles = roles.map(roles => roles.value)
                $stateProvider.state('userProfile', {
                    url: '/user/profile',
                    template: require('./user.profile.view.html'),
                    controller: 'userProfileCtrl',
                    data: {
                        requiresLogin: true,
                        roles: [
                            ...allRoles,
                            'cardinal'
                        ]
                    }
                });
            }])

        .controller('userProfileCtrl', require('./user.profile.ctrl'))

})(angular);
