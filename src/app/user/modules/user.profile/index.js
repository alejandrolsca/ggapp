module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.user.profile',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('userProfile', {
            url:'/user/profile',
            template: require('./user.profile.view.html'),
            controller : 'userProfileCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .controller('userProfileCtrl',require('./user.profile.ctrl'))
    
})(angular);
