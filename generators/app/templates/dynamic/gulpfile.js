/// <vs BeforeBuild='default' />
///

/*TODO: 
- fix: concatenate and uglify in prod requires manually rewriting script tags in html/aspx/other(?) to reflect correct output files
- option to upload output files to SP for debugging
- any way to display message in VS that gulp tasks are done?
- uglify JS files for prod


*/

//#region configuration
// include plug-ins
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var del = require('del');
var minifyCSS = require('gulp-minify-css');
var copy = require('gulp-copy');
var bower = require('gulp-bower');
var sourcemaps = require('gulp-sourcemaps');
var htmlmin = require('gulp-html-minifier');
var gutil = require('gulp-util');


gutil.log("Running Gulp");
var approot = "app";
var baseout = approot;

var config = {
    mode: "development",

    //#region Out paths
    // (can be overridden in any given section by defining variable with same name)
    
    fontout: baseout + '/fonts',
    cssout: baseout + '/css',
    htmlout: baseout,
    scriptout: baseout + "/scripts",
    mapsout: approot + '/maps',
    aspxout: baseout,
    foldername : '',

    //#endregion Out paths

    //#region Third-party libraries

    jquery: {
        name: 'jquery',
        bundle: 'jquery-bundle.min.js',
        scriptsrc: [
            'bower_components/jquery/dist/jquery.min.js'
        ]
    },

    bootstrap: {
        name: 'bootstrap',
        bundle: 'bootstrap-bundle.min.js',
        scriptsrc: [
            'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
            'bower_components/respond-minmax/dest/respond.min.js'
        ],
        stylesrc: [
            'bower_components/bootstrap/dist/css/bootstrap.css'
        ],
        fontsrc: [
            'bower_components/bootstrap/dist/fonts/*.*'
        ]},

    angular: {
        name: 'angular',
        bundle: 'angular-bundle.min.js',
        scriptsrc: [
            'bower_components/angular/angular.min.js',
            'bower_components/angular-route/angular-route.min.js',
            'bower_components/angular-sanitize/angular-sanitize.min.js'
        ]
    },

    modernizr: {
        name: 'modernizr',
        bundle: 'modernizer.min.js',
        scriptsrc: [
            'bower_components/modernizr/modernizr.js'
        ]
    },
    //#endregion Third-party libraries

    //#region Application files
    root: {
        name: 'root',
        bundle: 'app.min.js',
        scriptsrc: [
            approot + '/*.js'
        ],
        aspxsrc: [
            approot + '/default.aspx'
        ],
        stylesrc: [//start with files in the order they need to be in the output file, leave the *.xx and ! at the end to catch anything where the final file order doesn't matter
            approot + '/**/*.css',
            !approot + '/**/*.min.css*/'
        ]

        
    },

   
    
    //#endregion Application files

    //#region Images
    images: {
        name: 'images',
        imagesrc: [
            approot + '/images/*.*'
        ]
    },
    //#endregion Images

    //#region Angular Home files
    angularHome: {
        name: 'angularHome',
        foldername: 'home',
        bundle: 'home.min.js',
        scriptsrc: [ //start with files in the order they need to be in the output file, leave the *.js and ! at the end to catch anything where the final file order doesn't matter


            approot + '/home/*.js'
        ],
        htmlsrc: [
            approot + '/home/*.html'
        ]
    },
    //#endregion Angular Home files    
    
    //#region Angular shared files
    sharedControllers: {
        name: 'sharedControllers',
        scriptout: 'shared',
        scriptsrc: [
            approot + '/shared/Controllers/*.js'
        ],
        bundle: 'sharedControllers.min.js'
    },

    sharedDirectives: {
        name: 'sharedDirectives',
        scriptout: 'shared',
        scriptsrc: [
            approot + '/shared/Directives/*.js'
        ],
        bundle: 'sharedDirectives.min.js'
    },

    sharedServices: {
        name: 'sharedServices',
        scriptout: 'shared',
        scriptsrc: [
            approot + '/shared/Services/*.js'
        ],
        bundle: 'sharedServices.min.js'
    },

    sharedViews: {
        name: 'sharedViews',
        htmlout: 'shared',
        htmlsrc: [
            approot + '/shared/Views/*.html'
        ]
    },
    //#endregion Angular shared files
};



var sections = ['angular', 'angularHome','bootstrap','modernizr','jquery','angularShared', 'root'];

//#endregion configuration

//#region utilities

function sectionHasProperty(oneSection, targetProp) {
    return ("undefined" !== typeof oneSection
        && null !== oneSection
        && "undefined" !== typeof oneSection[targetProp]
        && 0 !== oneSection[targetProp].length);

}

//function getFolderName(sectionObj) {   
//    if (sectionHasProperty(sectionObj, 'foldername')) {
//        return sectionObj.foldername; 
//    } else{
//        return '';
//    }

   
//}

function getsectionValueOrDefault(propName, sectionObj) {
    //use section-specific value if provided, otherwise fallback on default

    if (sectionHasProperty(sectionObj, propName)) {
        return sectionObj[propName];
    }

    return config[propName];

}



function writeFile(filepath, filename, contents, cb) {
    
    fs.writeFile(filepath + "/" + filename, contents, cb);
    cb();
}

//#endregion utilities

//#region Processors

function processScripts(oneSection) {
    gutil.log("Running processScripts in mode: " + config.mode + " for section: " + oneSection.name);
    if (!sectionHasProperty(oneSection, "scriptsrc")) {
        gutil.log("Skipping Script processing - no scriptsrc specified");
        return null;
    }

   // var foldername = getsectionValueOrDefault('folderName', oneSection);
    var scriptout = getsectionValueOrDefault("scriptout", oneSection);
    gutil.log("Processing scripts to folder " + scriptout);

    
    gutil.log("scriptout=" + scriptout);
  
    try {
        del([
            scriptout + "/" + oneSection.bundle,
            scriptout + "/" + config.mapout + "/" + oneSection.bundle + ".map"
        ]);

        gulp.src(oneSection.scriptsrc)
            .pipe(sourcemaps.init())
            .pipe(config.mode === 'production' ? concat(oneSection.bundle, { newLine: '\n\n' }) : gutil.noop())
            .pipe(config.mode === 'production' ? uglify() : gutil.noop())            
            .pipe(sourcemaps.write(config.mapout))
            .pipe(gulp.dest(scriptout));


    } catch (err) {
        gutil.log(err);
    }
    return null;

}

function processStyles(oneSection) {
    gutil.log("Running processStyles in mode: " + config.mode + " for section: " + oneSection.name);
    if (!sectionHasProperty(oneSection, "stylesrc")) {
        gutil.log("Skipping Script processing - no stylesrc specified");
        return null;
    }
    //var foldername = getFolderName(oneSection);
    var cssout = getsectionValueOrDefault("cssout", oneSection);
    gutil.log("Processing CSS to folder " + cssout);
   
    var outfile = oneSection.name + ".css";
    var outfilemin = oneSection.name + ".min.css";
    
    
    del([
        cssout + "/" + outfile,
        cssout + "/" + outfilemin
    ]);
    
    gulp.src(oneSection.stylesrc)
            .pipe(concat(outfile))
            .pipe(gulp.dest(cssout))
            .pipe(minifyCSS())
            .pipe(concat(outfilemin))
            .pipe(gulp.dest(cssout));
    return null;

}

function processHtml(oneSection) {
    gutil.log("Running processHtml in mode: " + config.mode + " for section: " + oneSection.name);
    if (!sectionHasProperty(oneSection, "htmlsrc")) {
        gutil.log("Skipping Script processing - no htmlsrc specified");
        return null;
    }
    //var foldername = getFolderName(oneSection);
    var htmlout = getsectionValueOrDefault("htmlout", oneSection);
    gutil.log("Processing Html to folder " + htmlout);

    
   
    //del([
    //    htmlout + "/*.html"
    //]);

    if (config.mode !== "development") {
        gulp.src(oneSection.htmlsrc)
            .pipe(htmlmin({
                collapseWhitespace: true,
                removeComments: true,
                conservativeCollapse: true,
                preserveLineBreaks: true,
                collapseBooleanAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                removeIgnored: true,
                caseSensitive: true,
                maxLineLength: 120
            }))
            .pipe(gulp.dest(htmlout));
    } else {
        gulp.src(oneSection.htmlsrc)
        .pipe(gulp.dest(htmlout));
    }
    return null;
}

function processFonts(oneSection) {
    gutil.log("Running processFonts in mode: " + config.mode + " for section: " + oneSection.name);
    if (!sectionHasProperty(oneSection, "fontsrc")) {
        gutil.log("Skipping font processing - no fontsrc specified");
        return null;
    }
    //var foldername = getFolderName(oneSection);
    var fontout = getsectionValueOrDefault("fontout", oneSection);
    gutil.log("Processing fonts to folder " + fontout);




    del([
        fontout + "/*.eot",
        fontout + "/*.svg",
        fontout + "/*.ttf",
        fontout + "/*.eot",
        fontout + "/*.eot"
    ]);

   gulp.src(oneSection.fontsrc)
        .pipe(gulp.dest(fontout));
    
    return null;
}

function processAspx(oneSection) {
    gutil.log("Running processAspx in mode: " + config.mode + " for section: " + oneSection.name);
    if (!sectionHasProperty(oneSection, "aspxsrc")) {
        gutil.log("Skipping ASPX processing - no aspxsrc specified");
        return null;
    }
    //var foldername = getFolderName(oneSection);
    var aspxout = getsectionValueOrDefault("aspxout", oneSection);
    gutil.log("Processing ASPX to folder " + aspxout);



    //del([
    //    aspxout + "/*.aspx"
   // ]);

    gulp.src(oneSection.aspxsrc)
         .pipe(gulp.dest(aspxout));

    return null;
}



function processImages(oneSection) {
    gutil.log("Running processImages in mode: " + config.mode + " for section: " + oneSection.name);
    if (!sectionHasProperty(oneSection, "imagesrc")) {
        gutil.log("Skipping image processing - no imagesrc specified");
        return null;
    }
    //var foldername = getFolderName(oneSection);
    var imageout = getsectionValueOrDefault("imageout", oneSection);
    gutil.log("Processing images to folder " + imageout);



    

    gutil.log("Processing Images to folder " + imageout);

    //del([
    //    imageout + "/*.png",
    //    imageout + "/*.jpg",
    //    imageout + "/*.jpeg",
    //    imageout + "/*.gif"
    //]);

    gulp.src(oneSection.imagesrc)
         .pipe(gulp.dest(imageout));

    return null;
}

//#endregion Processors


//#region gulp tasks

gulp.task('jquery', [], function() {
    processScripts(config.jquery);
    processStyles(config.jquery);
});

gulp.task('bootstrap', [], function () {
    processScripts(config.bootstrap);
    processStyles(config.bootstrap);
    processFonts(config.bootstrap);
});

gulp.task('angular', [], function () {
    processScripts(config.angular);
    
});

gulp.task('modernizr', [], function () {
    processScripts(config.modernizr);
    
});

gulp.task('angularHome', [], function () {
    
    processScripts(config.angularHome);
    processStyles(config.angularHome);
    processHtml(config.angularHome);

    

});
gulp.task('root', [], function () {
    processScripts(config.root);
    processStyles(config.root);
    processHtml(config.root);
    processAspx(config.root);
});
gulp.task('images', [], function () {
    processImages(config.images);
    
});

gulp.task('angularShared', [], function () {
    processScripts(config.sharedControllers);
    processScripts(config.sharedDirectives);
    processScripts(config.sharedServices);
    
    processHtml(config.sharedViews);
});

gulp.task('production', [], function() {
    config.mode = "production";
    gulp.start("default");
       
           
});

//Set a default tasks
gulp.task('default', sections, function () {

});


//#endregion gulp tasks

