module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.productOffsetPaginated.add',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('productOffsetPaginatedAdd', {
            url:'/product/add/offset/paginated/:cl_id',
            template: require('./productOffsetPaginated.add.view.html'),
            controller : 'productOffsetPaginatedAddCtrl',
            data: {
                requiresLogin: true,
                roles: [
                    'admin',
                    'sales'
                ]
            }    
        });
    }])

    .factory('productOffsetPaginatedAddFac',require('./productOffsetPaginated.add.fac'))

    .controller('productOffsetPaginatedAddCtrl',require('./productOffsetPaginated.add.ctrl'))

})(angular);