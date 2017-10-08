module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.productPlotterBanner.add',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('productPlotterBannerAdd', {
            url:'/product/add/plotter/banner/:cl_id',
            template: require('./productPlotterBanner.add.view.html'),
            controller : 'productPlotterBannerAddCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('productPlotterBannerAddFac',require('./productPlotterBanner.add.fac'))

    .controller('productPlotterBannerAddCtrl',require('./productPlotterBanner.add.ctrl'))

})(angular);