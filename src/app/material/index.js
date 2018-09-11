module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.material',[
        require('./modules/material.add').name,
        require('./modules/material.update').name
    ])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('material', {
            url:'/material',
            template: require('./material.view.html'),
            controller : 'materialCtrl',
            data: {
                requiresLogin: true,
                roles: [
                    'admin',
                    'sales',
                    'warehouse'
                ]
            }    
        });
    }])

    .factory('materialFac',require('./material.fac'))

    .controller('materialCtrl',require('./material.ctrl'))
    
})(angular);
