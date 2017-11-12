module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.productSerigraphyFlexibles.add',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('productSerigraphyFlexiblesAdd', {
            url:'/product/add/serigraphy/flexibles/:cl_id',
            template: require('./productSerigraphyFlexibles.add.view.html'),
            controller : 'productSerigraphyFlexiblesAddCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('productSerigraphyFlexiblesAddFac',require('./productSerigraphyFlexibles.add.fac'))

    .controller('productSerigraphyFlexiblesAddCtrl',require('./productSerigraphyFlexibles.add.ctrl'))

})(angular);