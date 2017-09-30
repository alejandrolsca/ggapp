module.exports = (function(angular){
    'use strict';
    
    return ['$http', '$q',  '$stateParams', function($http, $q, $stateParams){
        var factory = {};
        factory.add = function(mt_jsonb) {
            var promise = $http.post('/api/material/add', {
                    /* POST variables here */
                    mt_jsonb: mt_jsonb
            }).success(function(data, status, headers, config){
                return data;
            }).error(function (data, status, headers, config) {
                return {"status": false};
            });
            return promise;
        };
        factory.getSuppliers = function () {
            var promise = $http.post('/api/supplier/', {
                /* POST variables here */
                procces_id: new Date().getMilliseconds()
            }).success(function (data, status, headers, config) {
                return data;
            }).error(function (data, status, headers, config) {

                return { "status": false };
            });
            return promise;
        };
        return factory;
    }];
    
})(angular);