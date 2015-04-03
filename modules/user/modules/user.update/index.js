module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.user.update',[])

    .config(['$stateProvider', '$urlRouterProvider','USER_ROLES',
    function($stateProvider, $urlRouterProvider, USER_ROLES) {
        $stateProvider.state('userUpdate', {
            url:'/user/update/:us_id',
            templateUrl : 'modules/user/modules/user.update/views/user.update.view.html',
            controller : 'userUpdateCtrl',
            data: {
                authorizedRoles: [USER_ROLES.admin,USER_ROLES.editor]
            }    
        });
    }])

    .factory('userUpdateFac',require('./services/user.update.fac'))

    .controller('userUpdateCtrl',require('./controllers/user.update.ctrl'))

})(angular);