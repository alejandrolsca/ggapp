module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.productSerigraphyBanner.update',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('productSerigraphyBannerUpdate', {
            url:'/product/update/serigraphy/banner/:cl_id/:pr_id',
            template: require('./productSerigraphyBanner.update.view.html'),
            controller : 'productSerigraphyBannerUpdateCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('productSerigraphyBannerUpdateFac',require('./productSerigraphyBanner.update.fac'))

    .controller('productSerigraphyBannerUpdateCtrl',require('./productSerigraphyBanner.update.ctrl'))

})(angular);