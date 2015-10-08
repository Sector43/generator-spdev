/// <reference path="../../typescript_components/angularjs/angular.d.ts" />
(function () {
    'use strict';
    var controllerId = "homeController";
    angular
        .module('app.home')
        .controller(controllerId, [
        '$scope',
        'homeService',
        'constants',
        HomeController]);
    function HomeController($scope, homeService, constants) {
        var vm = this;
        vm.temp = "This is a sample value read from a controller variable to validate Angular is configured properly";
        vm.message = message;
        vm.name = 'home';
        vm.webTitle = "";
        init();
        //functions
        function init() {
            homeService.getWebTitle(vm, constants);
        }
        function message() {
            return "Hello World" + homeService.serviceCall();
        }
    }
})();
