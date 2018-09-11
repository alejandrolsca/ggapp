module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.productOffsetGeneral.add',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('productOffsetGeneralAdd', {
            url:'/product/add/offset/general/:cl_id',
            template: require('./productOffsetGeneral.add.view.html'),
            controller : 'productOffsetGeneralAddCtrl',
            data: {
                requiresLogin: true,
                roles: [
                    'admin',
                    'sales'
                ]
            }    
        });
    }])

    .factory('productOffsetGeneralAddFac',require('./productOffsetGeneral.add.fac'))

    .controller('productOffsetGeneralAddCtrl',require('./productOffsetGeneral.add.ctrl'))

})(angular);