(function () {
    'use strict';

    var app = angular.module('app', [
      'ngRoute',
      'ui.bootstrap',
      'ngSanitize'
    ]);

   app.config(['constants', config]);

    function config(constants) {
        console.log("App initiating at " + new Date().toString() + ".  Version = " + constants.version);
        console.log("base URL: " + constants.baseUrl);

    };


    




})();