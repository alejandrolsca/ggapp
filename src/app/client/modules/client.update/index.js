module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.client.update',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('clientUpdate', {
            url:'/client/update/:cl_id',
            template: require('./client.update.view.html'),
            controller : 'clientUpdateCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('clientUpdateFac',require('./client.update.fac'))

    .controller('clientUpdateCtrl',require('./client.update.ctrl'))

})(angular);