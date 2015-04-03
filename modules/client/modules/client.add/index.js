module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.client.add',[])

    .config(['$stateProvider', '$urlRouterProvider','USER_ROLES',
    function($stateProvider, $urlRouterProvider, USER_ROLES) {
        $stateProvider.state('clientAdd', {
            url:'/client/add',
            templateUrl : 'modules/client/modules/client.add/views/client.add.view.html',
            controller : 'clientAddCtrl',
            data: {
                authorizedRoles: [USER_ROLES.admin,USER_ROLES.editor]
            }    
        });
    }])

    .factory('clientAddFac',require('./services/client.add.fac'))

    .controller('clientAddCtrl',require('./controllers/client.add.ctrl'))

})(angular);