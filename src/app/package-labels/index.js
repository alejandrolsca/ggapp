module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.packageLabels',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('packageLabels', {
            url:'/pkg-lbls/:cl_id',
            template: require('./package-labels.view.html'),
            controller : 'packageLabelsCtrl',
            data: {
                requiresLogin: true,
                roles: [
                    'admin',
                    'finishing',
                    'packaging'
                ]
            }    
        });
    }])

    .factory('packageLabelsFac',require('./package-labels.fac'))

    .controller('packageLabelsCtrl',require('./package-labels.ctrl'))

})(angular);