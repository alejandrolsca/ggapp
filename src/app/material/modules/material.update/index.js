module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.material.update',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('materialUpdate', {
            url:'/material/update/:mt_id',
            template: require('./material.update.view.html'),
            controller : 'materialUpdateCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('materialUpdateFac',require('./material.update.fac'))

    .controller('materialUpdateCtrl',require('./material.update.ctrl'))

})(angular);