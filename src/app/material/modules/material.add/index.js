module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.material.add',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('materialAdd', {
            url:'/material/add',
            template: require('./material.add.view.html'),
            controller : 'materialAddCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('materialAddFac',require('./material.add.fac'))

    .controller('materialAddCtrl',require('./material.add.ctrl'))

})(angular);