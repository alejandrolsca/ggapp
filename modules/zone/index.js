module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.zone',[
        require('./modules/zone.add').name,
        require('./modules/zone.update').name
    ])

    .config(['$stateProvider', '$urlRouterProvider','USER_ROLES',
    function($stateProvider, $urlRouterProvider, USER_ROLES) {
        $stateProvider.state('zone', {
            url:'/zone/:cl_id',
            templateUrl : 'modules/zone/views/zone.view.html',
            controller : 'zoneCtrl',
            data: {
                authorizedRoles: [USER_ROLES.admin,USER_ROLES.editor]
            }    
        });
    }])

    .factory('zoneFac',require('./services/zone.fac'))

    .controller('zoneCtrl',require('./controllers/zone.ctrl'))
    
})(angular);
