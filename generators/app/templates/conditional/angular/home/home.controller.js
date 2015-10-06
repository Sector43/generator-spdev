/// <reference path="../../typescript_components/angularjs/angular.d.ts" />
(function () {
    'use strict';
    var controllerId = "homeController";
    angular
        .module('app')
        .controller(controllerId, [
        '$scope',
        HomeController]);
    function HomeController($scope) {
        var vm = this;
        $scope.temp = "sample value read from scope";
    }
})();
