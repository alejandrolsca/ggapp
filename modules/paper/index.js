module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.paper',[
        require('./modules/paper.add').name,
        require('./modules/paper.update').name
    ])

    .config(['$stateProvider', '$urlRouterProvider','USER_ROLES',
    function($stateProvider, $urlRouterProvider, USER_ROLES) {
        $stateProvider.state('paper', {
            url:'/paper',
            templateUrl : 'modules/paper/paper.view.html',
            controller : 'paperCtrl',
            data: {
                authorizedRoles: [USER_ROLES.admin,USER_ROLES.editor]
            }    
        });
    }])

    .factory('paperFac',require('./paper.fac'))

    .controller('paperCtrl',require('./paper.ctrl'))
    
})(angular);
