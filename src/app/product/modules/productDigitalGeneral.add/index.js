module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.productDigitalGeneral.add',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('productDigitalGeneralAdd', {
            url:'/product/add/digital/general/:cl_id',
            template: require('./productDigitalGeneral.add.view.html'),
            controller : 'productDigitalGeneralAddCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('productDigitalGeneralAddFac',require('./productDigitalGeneral.add.fac'))

    .controller('productDigitalGeneralAddCtrl',require('./productDigitalGeneral.add.ctrl'))

})(angular);