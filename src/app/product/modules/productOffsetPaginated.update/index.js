module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.productOffsetPaginated.update',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('productOffsetPaginatedUpdate', {
            url:'/product/update/offset/paginated/:cl_id/:pr_id',
            template: require('./productOffsetPaginated.update.view.html'),
            controller : 'productOffsetPaginatedUpdateCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('productOffsetPaginatedUpdateFac',require('./productOffsetPaginated.update.fac'))

    .controller('productOffsetPaginatedUpdateCtrl',require('./productOffsetPaginated.update.ctrl'))

})(angular);