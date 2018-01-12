module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.productPlotterFlexibles.update',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('productPlotterFlexiblesUpdate', {
            url:'/product/update/plotter/flexibles/:cl_id/:pr_id',
            template: require('./productPlotterFlexibles.update.view.html'),
            controller : 'productPlotterFlexiblesUpdateCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('productPlotterFlexiblesUpdateFac',require('./productPlotterFlexibles.update.fac'))

    .controller('productPlotterFlexiblesUpdateCtrl',require('./productPlotterFlexibles.update.ctrl'))

})(angular);