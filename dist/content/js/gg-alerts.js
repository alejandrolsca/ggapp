(function (angular) {
    'use strict';

    angular.module('gg-alerts', ['ui.bootstrap'], function ($provide) {
        'use strict';
        $provide.factory('$alerts', ['$rootScope', '$uibModal',
            function ($rootScope, $uibModal) {

                var factory = {
                    alert: function (mode, title, text) {

                        var modalData = {
                            mode: mode || 'info',
                            title: title || 'title',
                            text: text || 'text'
                        };

                        var modalInstance = $uibModal.open({
                            template: '<div class="modal-body" style="padding:0px">'+ 
                                        '<div class="alert alert-{{data.mode}}" style="margin-bottom:0px">'+
                                            '<button type="button" class="close" data-ng-click="close()" >'+
                                                '<span class="glyphicon glyphicon-remove-circle"></span>'+
                                            '</button>'+
                                            '<div class="row">'+
                                                '<span class="col-sm-12"><strong>{{data.title}}</strong></span>'+
                                                '<pre class"col-sm-12">{{data.text}}</pre>'+
                                            '</div>'+
                                        '</div>'+
                                        '</div>',
                            controller: 'ModalAlertController',
                            backdrop: true,
                            keyboard: true,
                            backdropClick: true,
                            size: 'lg',
                            resolve: {
                                data: function () {
                                    return modalData;
                                }
                            }
                        });

                        modalInstance.result.then(function (data) {
                            $rootScope.$broadcast('modal-alert-closed', { 'data': data });
                        });

                    },
                    info: function (title, text) {
                        factory.alert('info', title, text);
                    },
                    error: function (title, text) {
                        factory.alert('danger', title, text);
                    },
                    warn: function (title, text) {
                        factory.alert('warning', title, text);
                    },
                    success: function (title, text) {
                        factory.alert('success', title, text);
                    }
                };

                return factory;

            }]);
    }).controller('ModalAlertController', ['$scope', '$uibModalInstance', 'data', function ($scope, $uibModalInstance, data) {
        $scope.data = data;

        $scope.close = function () {
            $uibModalInstance.close($scope.data);
        };
    }])

})(angular)