module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.status',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('status', {
            url:'/status',
            templateUrl : 'app/status/status.view.html',
            controller : 'statusCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('statusFac',require('./status.fac'))

    .controller('statusCtrl',require('./status.ctrl'))

})(angular);