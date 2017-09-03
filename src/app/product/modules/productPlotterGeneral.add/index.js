module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.productPlotterGeneral.add',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('productPlotterGeneralAdd', {
            url:'/product/add/plotter/general/:cl_id',
            template: require('./productPlotterGeneral.add.view.html'),
            controller : 'productPlotterGeneralAddCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('productPlotterGeneralAddFac',require('./productPlotterGeneral.add.fac'))

    .controller('productPlotterGeneralAddCtrl',require('./productPlotterGeneral.add.ctrl'))

})(angular);