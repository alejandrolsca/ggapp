module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.productLaserGeneral.add',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('productLaserGeneralAdd', {
            url:'/product/add/laser/general/:cl_id',
            template: require('./productLaserGeneral.add.view.html'),
            controller : 'productLaserGeneralAddCtrl',
            data: {
                requiresLogin: true,
                roles: [
                    'admin',
                    'sales'
                ]
            }    
        });
    }])

    .factory('productLaserGeneralAddFac',require('./productLaserGeneral.add.fac'))

    .controller('productLaserGeneralAddCtrl',require('./productLaserGeneral.add.ctrl'))

})(angular);