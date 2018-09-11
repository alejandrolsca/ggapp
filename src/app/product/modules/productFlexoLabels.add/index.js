module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.productFlexoLabels.add',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('productFlexoLabelsAdd', {
            url:'/product/add/flexo/labels/:cl_id',
            template: require('./productFlexoLabels.add.view.html'),
            controller : 'productFlexoLabelsAddCtrl',
            data: {
                requiresLogin: true,
                roles: [
                    'admin',
                    'sales'
                ]
            }    
        });
    }])

    .factory('productFlexoLabelsAddFac',require('./productFlexoLabels.add.fac'))

    .controller('productFlexoLabelsAddCtrl',require('./productFlexoLabels.add.ctrl'))

})(angular);