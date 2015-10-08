/// <reference path="../../typescript_components/angularjs/angular.d.ts" />

(() => {
    'use strict';

    var serviceId = "homeService";

    angular
        .module('app.home')
        .factory(serviceId,
        [
            'loggerService'
            ,'dataService'
            ,HomeService
        ]);


    function HomeService(loggerService, dataService) {
        return {
            serviceCall: serviceCall,
            getWebTitle: getWebTitle
        };
        function serviceCall() {
            
            return " from " + serviceId;
        }

        function getWebTitle(vm, constants) {
            loggerService.log("getWebTitle called", "Retrieving web title");
            var url = constants.baseUrl + "/_api/web?$select=title";

            dataService.get(url,
                function (data) {
                    vm.webTitle = data.d.Title;
                },
                function (response) {
                    vm.webTitle = response.statusText;
                });
        }

    }
        


})(); 