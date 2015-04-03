module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.user.profile',[])

    .config(['$stateProvider', '$urlRouterProvider','USER_ROLES',
    function($stateProvider, $urlRouterProvider, USER_ROLES) {
        $stateProvider.state('userProfile', {
            url:'/user/profile',
            templateUrl : 'modules/user/modules/user.profile/views/user.profile.view.html',
            controller : 'userProfileCtrl',
            data: {
                authorizedRoles: [USER_ROLES.admin,USER_ROLES.editor]
            }    
        });
    }])

    .controller('userProfileCtrl',require('./controllers/user.profile.ctrl'))
    
})(angular);
