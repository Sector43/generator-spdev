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
    
    scriptout: baseout + "/libs",
    mapsout: approot + '/maps',
    
    

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
    }
	};

    
    //#endregion Third-party libraries

   
    

   

var sections = [<%= spdev_sections %>];

//#endregion configuration

//#region utilities

function sectionHasProperty(oneSection, targetProp) {
    return ("undefined" !== typeof oneSection
        && null !== oneSection
        && "undefined" !== typeof oneSection[targetProp]
        && 0 !== oneSection[targetProp].length);

}


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



//#region gulp tasks

gulp.task('jquery', [], function() {
    processScripts(config.jquery);
});

gulp.task('bootstrap', [], function () {
    processScripts(config.bootstrap);
    processStyles(config.bootstrap);
    processFonts(config.bootstrap);
});

gulp.task('angular', [], function () {
    processScripts(config.angular);
    
});



gulp.task('production', [], function() {
    config.mode = "production";
    gulp.start("default");
       
           
});


gulp.task('initialBuild', sections, function () {

});

gulp.task('default', [], function () {

});


//#endregion gulp tasks

