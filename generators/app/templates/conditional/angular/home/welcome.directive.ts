/// <reference path="../../typescript_components/angularjs/angular.d.ts" />

(() => {
    'use strict';

    var directiveId = "siteWelcome";

    angular
        .module('app.home')
        .directive(directiveId, SiteWelcome);

    SiteWelcome.$inject = ['homeService', 'constants' ];

    function SiteWelcome(homeService, constants) {
           var controller = function () {

               var vm = this;

               function init() {
                   homeService.getWebTitle(constants).then(
                       function (title: string) {
                           vm.webTitle = title;
                       });
               }


               init();

               
           };



           return {
            restrict: 'E',         
            replace: true,
            template: '<span>Welcome to the site <b>{{vm.webTitle}}</b></span>',
            controller: controller,
            controllerAs: 'vm',
            bindToController: true, 
            scope: {

            }
           }



        };
        

    



})(); 