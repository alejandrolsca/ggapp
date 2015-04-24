module.exports = (function(angular){
    'use strict';
    
    return function($http, $q, $stateParams){
        var factory = {};
        factory.data = function() {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('modules/product/modules/productOffsetGeneral.update/productOffsetGeneral.update.mdl.getproductOffsetGeneral.php', {
                    /* POST variables here */
                    pr_id: $stateParams.pr_id
                }).success(function(data, status, headers, config){
                    return data;
                }).error(function (data, status, headers, config) {
                    return {"status": false};
                })
            );
            return deferred.promise;
        };
        factory.update = function(pr_jsonb) {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('modules/product/modules/productOffsetGeneral.update/productOffsetGeneral.update.mdl.update.php', {
                    /* POST variables here */
                    pr_id: $stateParams.pr_id,
                    pr_jsonb: pr_jsonb
                }).success(function(data, status, headers, config){
                    return data;
                }).error(function (data, status, headers, config) {
                    return {"status": false};
                })
            );
            return deferred.promise;
        };
        factory.getCountries = function() {
            var promise = $http.get('http://api.geonames.org/countryInfoJSON?username=alejandrolsca')
            .success(function(data, status, headers, config){
                return data;
            }).error(function (data, status, headers, config) {
                return {"status": false};
            });
            return promise;
        };
        factory.getStates = function(pr_country) {
            var promise = $http.get('http://api.geonames.org/childrenJSON?geonameId='+pr_country+'&username=alejandrolsca')
            .success(function(data, status, headers, config){
                return data;
            }).error(function(data, status, headers, config) {
                return {"status": false};
            });
            return promise;
        };
        factory.getCityCounty = function(pr_state) {
            var promise = $http.get('http://api.geonames.org/childrenJSON?geonameId='+pr_state+'&username=alejandrolsca')
            .success(function(data, status, headers, config){
                return data;
            }).error(function(data, status, headers, config) {
                return {"status": false};
            });
            return promise;
        };
        return factory;
    };
    
})(angular);