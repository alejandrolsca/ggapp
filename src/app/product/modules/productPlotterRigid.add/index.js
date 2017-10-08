module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.productPlotterRigid.add',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('productPlotterRigidAdd', {
            url:'/product/add/plotter/rigid/:cl_id',
            template: require('./productPlotterRigid.add.view.html'),
            controller : 'productPlotterRigidAddCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('productPlotterRigidAddFac',require('./productPlotterRigid.add.fac'))

    .controller('productPlotterRigidAddCtrl',require('./productPlotterRigid.add.ctrl'))

})(angular);