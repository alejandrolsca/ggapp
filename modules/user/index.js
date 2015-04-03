module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.user',[
        require('./modules/user.add').name,
        require('./modules/user.update').name,
        require('./modules/user.profile').name
    ])

    .config(['$stateProvider', '$urlRouterProvider','USER_ROLES',
    function($stateProvider, $urlRouterProvider, USER_ROLES) {
        $stateProvider.state('user', {
            url:'/user',
            templateUrl : 'modules/user/views/user.view.html',
            controller : 'userCtrl',
            data: {
                authorizedRoles: [USER_ROLES.admin,USER_ROLES.editor]
            }    
        });
    }])

    .factory('userFac',require('./services/user.fac'))

    .controller('userCtrl',require('./controllers/user.ctrl'))

})(angular);