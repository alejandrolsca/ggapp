module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.productPlotterFlexibles.add',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('productPlotterFlexiblesAdd', {
            url:'/product/add/plotter/flexibles/:cl_id',
            template: require('./productPlotterFlexibles.add.view.html'),
            controller : 'productPlotterFlexiblesAddCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('productPlotterFlexiblesAddFac',require('./productPlotterFlexibles.add.fac'))

    .controller('productPlotterFlexiblesAddCtrl',require('./productPlotterFlexibles.add.ctrl'))

})(angular);