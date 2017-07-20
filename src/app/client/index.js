module.exports = (function(angular){
    'use strict';
    //comment

    return angular.module('app.client',[
        require('./modules/client.add').name,
        require('./modules/client.update').name
    ])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('client', {
            url:'/client',
            template: require('./client.view.html'),
            controller : 'clientCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('clientFac',require('./client.fac'))

    .controller('clientCtrl',require('./client.ctrl'))
    
})(angular);
