module.exports = (function(angular){
    'use strict';
    
    return ['$http', '$q', '$alerts', '$stateParams', function($http, $q, $alerts, $stateParams){
        var factory = {};
        factory.add = function(pa_jsonb) {
            var promise = $http.post('modules/paper/modules/paper.add/paper.add.mdl.add.php', {
                    /* POST variables here */
                    pa_jsonb: pa_jsonb
            }).success(function(data, status, headers, config){
                return data;
            }).error(function (data, status, headers, config) {
                return {"status": false};
            });
            return promise;
        };
        factory.getSuppliers = function() {
            var promise = $http.get('modules/paper/modules/paper.add/paper.add.mdl.getSuppliers.php')
            .success(function(data, status, headers, config){
                return data;
            }).error(function (data, status, headers, config) {
                return {"status": false};
            });
            return promise;
        };
        return factory;
    }];
    
})(angular);