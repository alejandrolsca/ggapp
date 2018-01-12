module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.productPlotterBanner.update',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('productPlotterBannerUpdate', {
            url:'/product/update/plotter/banner/:cl_id/:pr_id',
            template: require('./productPlotterBanner.update.view.html'),
            controller : 'productPlotterBannerUpdateCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('productPlotterBannerUpdateFac',require('./productPlotterBanner.update.fac'))

    .controller('productPlotterBannerUpdateCtrl',require('./productPlotterBanner.update.ctrl'))

})(angular);