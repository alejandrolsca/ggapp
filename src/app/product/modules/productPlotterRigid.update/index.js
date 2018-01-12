module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.productPlotterRigid.update',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('productPlotterRigidUpdate', {
            url:'/product/update/plotter/rigid/:cl_id/:pr_id',
            template: require('./productPlotterRigid.update.view.html'),
            controller : 'productPlotterRigidUpdateCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('productPlotterRigidUpdateFac',require('./productPlotterRigid.update.fac'))

    .controller('productPlotterRigidUpdateCtrl',require('./productPlotterRigid.update.ctrl'))

})(angular);