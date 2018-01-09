module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.product.update',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('productUpdate', {
            url:'/product/update/:pr_id',
            template: require('./product.update.view.html'),
            controller : 'productUpdateCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('productUpdateFac',require('./product.update.fac'))

    .controller('productUpdateCtrl',require('./product.update.ctrl'))

})(angular);