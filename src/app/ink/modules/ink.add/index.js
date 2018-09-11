module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.ink.add',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('inkAdd', {
            url:'/ink/add',
            template: require('./ink.add.view.html'),
            controller : 'inkAddCtrl',
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

    .factory('inkAddFac',require('./ink.add.fac'))

    .controller('inkAddCtrl',require('./ink.add.ctrl'))

})(angular);