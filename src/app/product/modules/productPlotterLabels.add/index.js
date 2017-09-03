module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.productPlotterLabels.add',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('productPlotterLabelsAdd', {
            url:'/product/add/plotter/labels/:cl_id',
            template: require('./productPlotterLabels.add.view.html'),
            controller : 'productPlotterLabelsAddCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('productPlotterLabelsAddFac',require('./productPlotterLabels.add.fac'))

    .controller('productPlotterLabelsAddCtrl',require('./productPlotterLabels.add.ctrl'))

})(angular);