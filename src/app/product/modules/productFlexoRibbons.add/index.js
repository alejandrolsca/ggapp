module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.productFlexoRibbons.add',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('productFlexoRibbonsAdd', {
            url:'/product/add/flexo/ribbons/:cl_id',
            template: require('./productFlexoRibbons.add.view.html'),
            controller : 'productFlexoRibbonsAddCtrl',
            data: {
                requiresLogin: true,
                roles: [
                    'admin',
                    'sales'
                ]
            }    
        });
    }])

    .factory('productFlexoRibbonsAddFac',require('./productFlexoRibbons.add.fac'))

    .controller('productFlexoRibbonsAddCtrl',require('./productFlexoRibbons.add.ctrl'))

})(angular);