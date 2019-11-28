module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.users',[
        require('./modules/users.update').name
    ])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('users', {
            url:'/users',
            template: require('./users.view.html'),
            controller : 'usersCtrl',
            data: {
                requiresLogin: true,
                roles: [
                    'owner'
                ]
            }    
        });
    }])

    .factory('usersFac',require('./users.fac'))

    .controller('usersCtrl',require('./users.ctrl'))

})(angular);