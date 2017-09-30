module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.product',[
        require('./modules/productOffsetGeneral.add').name,
        require('./modules/productOffsetGeneral.update').name,
        require('./modules/productOffsetPaginated.add').name,
        //require('./modules/productOffsetPaginated.update').name
        require('./modules/productOffsetCounterfoil.add').name,
        require('./modules/productFlexoLabels.add').name,
        require('./modules/productFlexoRibbons.add').name,
        require('./modules/productPlotterFlexibles.add').name,        
        require('./modules/productPlotterRigid.add').name,        
        require('./modules/productPlotterBanner.add').name,
        require('./modules/productStampsGeneral.add').name,
        require('./modules/productStampsInkPad.add').name,
        require('./modules/productStampsInk.add').name
    ])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('product', {
            url:'/product/:cl_id',
            template: require('./product.view.html'),
            controller : 'productCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('productFac',require('./product.fac'))

    .controller('productCtrl',require('./product.ctrl'))
    
})(angular);
