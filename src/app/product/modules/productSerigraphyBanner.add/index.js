module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.productSerigraphyBanner.add',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('productSerigraphyBannerAdd', {
            url:'/product/add/serigraphy/banner/:cl_id',
            template: require('./productSerigraphyBanner.add.view.html'),
            controller : 'productSerigraphyBannerAddCtrl',
            data: {
                requiresLogin: true,
                roles: [
                    'admin',
                    'sales'
                ]
            }    
        });
    }])

    .factory('productSerigraphyBannerAddFac',require('./productSerigraphyBanner.add.fac'))

    .controller('productSerigraphyBannerAddCtrl',require('./productSerigraphyBanner.add.ctrl'))

})(angular);