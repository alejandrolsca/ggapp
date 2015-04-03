module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.zone.update',[])

    .config(['$stateProvider', '$urlRouterProvider','USER_ROLES',
    function($stateProvider, $urlRouterProvider, USER_ROLES) {
        $stateProvider.state('zoneUpdate', {
            url:'/zone/update/:cl_id',
            templateUrl : 'modules/zone/modules/zone.update/views/zone.update.view.html',
            controller : 'zoneUpdateCtrl',
            data: {
                authorizedRoles: [USER_ROLES.admin,USER_ROLES.editor]
            }    
        });
    }])

    .factory('zoneUpdateFac',require('./services/zone.update.fac'))

    .controller('zoneUpdateCtrl',require('./controllers/zone.update.ctrl'))

})(angular);