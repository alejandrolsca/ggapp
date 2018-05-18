module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.earningsByStatus',[
    ])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('earningsByStatus', {
            url:'/earningsbystatus',
            template: require('./earnings-by-status.view.html'),
            controller : 'earningsByStatusCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('earningsByStatusFac',require('./earnings-by-status.fac'))

    .controller('earningsByStatusCtrl',require('./earnings-by-status.ctrl'))
    
})(angular);
