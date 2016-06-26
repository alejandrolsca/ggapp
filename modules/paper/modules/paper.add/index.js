module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.paper.add',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('paperAdd', {
            url:'/paper/add',
            templateUrl : 'modules/paper/modules/paper.add/paper.add.view.html',
            controller : 'paperAddCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('paperAddFac',require('./paper.add.fac'))

    .controller('paperAddCtrl',require('./paper.add.ctrl'))

})(angular);