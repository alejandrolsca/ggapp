module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.user.add',[])

    .config(['$stateProvider', '$urlRouterProvider','USER_ROLES',
    function($stateProvider, $urlRouterProvider, USER_ROLES) {
        $stateProvider.state('userAdd', {
            url:'/user/add',
            templateUrl : 'modules/user/modules/user.add/views/user.add.view.html',
            controller : 'userAddCtrl',
            data: {
                authorizedRoles: [USER_ROLES.admin,USER_ROLES.editor]
            }    
        });
    }])

    .factory('userAddFac',require('./services/user.add.fac'))

    .controller('userAddCtrl',require('./controllers/user.add.ctrl'))
    
})(angular);
