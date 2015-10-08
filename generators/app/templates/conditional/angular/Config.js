(function () {
    'use strict';

    angular
        .module('app')
        .config(Config);

    Config.$inject = ['constants', '$routeProvider', '$httpProvider' ];


    function Config(constants, $routeProvider, $httpProvider) {
        baseConfig(constants, $httpProvider);
        setRoutes($routeProvider);

    };

    function baseConfig(constants, $httpProvider) {
        $httpProvider.defaults.headers.common.Accept = "application/json;odata=verbose";
        recordAppStart(constants);
    }

    function recordAppStart(constants) {
        console.log("App initiating at " + new Date().toString() + ".  Version = " + constants.version);
        console.log("base URL: " + constants.baseUrl);
    }

    function setRoutes($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'home/home.html',
                controller: 'homeController',
                controllerAs : 'vm'
            })
            
            .otherwise({ redirectTo: '/' });
        };



    

})();
