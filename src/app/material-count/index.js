module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.materialCount',[
    ])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('materialCount', {
            url:'/materialcount',
            template: require('./material-count.view.html'),
            controller : 'materialCountCtrl',
            data: {
                requiresLogin: true,
                roles: [
                    'owner',
                    'admin_support'
                ]
            }    
        });
    }])

    .factory('materialCountFac',require('./material-count.fac'))

    .controller('materialCountCtrl',require('./material-count.ctrl'))
    
})(angular);
