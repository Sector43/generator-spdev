/// <reference path="../../typescript_components/angularjs/angular.d.ts" />
(function () {
    'use strict';
    var controllerId = "homeController";
    angular
        .module('app.home')
        .controller(controllerId, HomeController);
    HomeController.$inject = ['homeService'];
    function HomeController(homeService) {
        var vm = this;
        vm.temp = "This is a sample value read from a controller variable to validate Angular is configured properly";
        vm.message = message;
        vm.name = 'home';
        init();
        //functions
        function message() {
            return "Hello World" + homeService.serviceCall();
        }
        function init() {
            //homeService.getWebTitle(constants).then(
            //    function (title: string) {
            //        vm.webTitle = title;
            //    });
        }
    }
})();
