module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.paper.update',[])

    .config(['$stateProvider', '$urlRouterProvider','USER_ROLES',
    function($stateProvider, $urlRouterProvider, USER_ROLES) {
        $stateProvider.state('paperUpdate', {
            url:'/paper/update/:pa_id',
            templateUrl : 'modules/paper/modules/paper.update/paper.update.view.html',
            controller : 'paperUpdateCtrl',
            data: {
                authorizedRoles: [USER_ROLES.admin,USER_ROLES.editor]
            }    
        });
    }])

    .factory('paperUpdateFac',require('./paper.update.fac'))

    .controller('paperUpdateCtrl',require('./paper.update.ctrl'))

})(angular);