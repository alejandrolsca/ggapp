module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q', '$stateParams', function ($http, $q, $stateParams) {
        var factory = {};
        factory.getClient = function () {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/client/cl_id', {
                    /* POST variables here */
                    cl_id: $stateParams.cl_id
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        factory.getZone = function() {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/zone/cl_id', {
                    /* POST variables here */
                    cl_id: $stateParams.cl_id
                }).success(function(data, status, headers, config) {
                    return data;
                }).error(function(data, status, headers, config) {
                    
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        factory.searchRelease = function(wo_release) {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/wo/cl_id/wo_release', {
                    /* POST variables here */
                    cl_id: $stateParams.cl_id,
                    wo_release: wo_release
                }).success(function(data, status, headers, config) {
                    return data;
                }).error(function(data, status, headers, config) {
                    
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        // var countries = ['US', 'Germany', 'UK', 'Japan', 'Italy', 'Greece'];
        // var products = ['Widget', 'Gadget', 'Doohickey'];

        // factory.getCountries = function () {
        //     var deferred = $q.defer();
        //     deferred.resolve(function () {
        //         return countries;
        //     });
        //     return deferred.promise;
        // };
        // factory.getProducts = function () {
        //     var deferred = $q.defer();
        //     deferred.resolve(function () {
        //         return products;
        //     });
        //     return deferred.promise;
        // };
        // factory.getData = function (count) {
        //     var deferred = $q.defer();
        //     deferred.resolve((function () {
        //         var data = new wijmo.collections.ObservableArray(),
        //             i = 0,
        //             countryId,
        //             productId;

        //         for (var i = 0; i < count; i++) {
        //             countryId = Math.floor(Math.random() * countries.length);
        //             productId = Math.floor(Math.random() * products.length);
        //             data.push({
        //                 id: i,
        //                 countryId: countryId,
        //                 productId: productId,
        //                 date: new Date(2014, i % 12, i % 28),
        //                 amount: Math.random() * 10000,
        //                 active: i % 4 === 0
        //             });
        //         }
        //         return data;
        //     })());
        //     return deferred.promise;
        // };
        return factory;
    }];

})(angular);