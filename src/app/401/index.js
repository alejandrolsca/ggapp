module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.401',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('401', {
            url:'/401',
            template: require('./401.view.html'),
            controller : '401Ctrl',
            data: {
                requiresLogin: false
            }    
        });
    }])

    .controller('401Ctrl',require('./401.ctrl'))

})(angular);