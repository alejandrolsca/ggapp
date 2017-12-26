module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.tlrAll',[
    ])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('tlrAll', {
            url:'/tlr-all/',
            template: require('./traffic-light-report-all.view.html'),
            controller : 'tlrAllController',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('tlrAllFactory',require('./traffic-light-report-all.fac'))

    .controller('tlrAllController',require('./traffic-light-report-all.ctrl'))

})(angular);