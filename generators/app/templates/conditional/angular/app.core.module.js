(function () {
    'use strict';

    //define global dependencies used across the application
    angular
        .module('app.core', [

            //Angular
          'ngRoute'
          ,'ui.bootstrap'
          , 'ngSanitize'

          //Shared
          ,'blocks.utils'
          ,'blocks.logger'
          ,'blocks.data'
        ]);   
})();