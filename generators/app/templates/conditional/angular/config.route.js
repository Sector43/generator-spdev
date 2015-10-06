(function () {
    'use strict';


    var app = angular.module('app');



    // config routes & their resolvers
    app.config(function ($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'home/home.html',
            controller: 'homeController'
        })
        .otherwise({ redirectTo: '/' });
    });




})();