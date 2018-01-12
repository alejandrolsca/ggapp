module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.productLaserGeneral.update',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('productLaserGeneralUpdate', {
            url:'/product/update/laser/general/:cl_id/:pr_id',
            template: require('./productLaserGeneral.update.view.html'),
            controller : 'productLaserGeneralUpdateCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('productLaserGeneralUpdateFac',require('./productLaserGeneral.update.fac'))

    .controller('productLaserGeneralUpdateCtrl',require('./productLaserGeneral.update.ctrl'))

})(angular);