module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.ink.update',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('inkUpdate', {
            url:'/ink/update/:in_id',
            template: require('./ink.update.view.html'),
            controller : 'inkUpdateCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('inkUpdateFac',require('./ink.update.fac'))

    .controller('inkUpdateCtrl',require('./ink.update.ctrl'))

})(angular);