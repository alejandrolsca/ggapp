module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.tlr',[
    ])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('tlr', {
            url:'/tlr',
            template: require('./traffic-light-report.view.html'),
            controller : 'tlrController',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('tlrFactory',require('./traffic-light-report.fac'))

    .controller('tlrController',require('./traffic-light-report.ctrl'))

})(angular);