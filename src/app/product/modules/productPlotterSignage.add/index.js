module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.productPlotterSignage.add',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('productPlotterSignageAdd', {
            url:'/product/add/plotter/signage/:cl_id',
            template: require('./productPlotterSignage.add.view.html'),
            controller : 'productPlotterSignageAddCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('productPlotterSignageAddFac',require('./productPlotterSignage.add.fac'))

    .controller('productPlotterSignageAddCtrl',require('./productPlotterSignage.add.ctrl'))

})(angular);