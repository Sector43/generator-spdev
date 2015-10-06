/// <vs BeforeBuild='default' />
///

/*TODO: 
- dynamically write .csproj, elements.xml and *.spdata files to reflect generated files
    - currently user must manually include new output files in VS and add to Elements
- fix: concatenate and uglify in prod requires manually rewriting script tags in html/aspx/other(?) to reflect correct output files
- option to upload output files to SP for debugging
- any way to display message in VS that gulp tasks are done?
- mangle JS files for prod


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
var filenames = require("gulp-filenames");
var fs = require('fs');

gutil.log("Running Gulp");
var approot = "deploy";
var scriptroot = "deploy/scripts";

var config = {
    mode: "development",

    //#region Default out paths (can be overridden in any given section)
    baseout: approot,
    fontout: approot + '/fonts',
    cssout: approot + '/css',
    htmlout: approot,
    scriptout: scriptroot,
    mapout: 'maps',
    aspxout: approot,

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
        ]
    },

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
        ],
        scriptout: scriptroot
    },
    //#endregion Third-party libraries

    //#region Application files
    root: {
        name: 'root',
        foldername: '',
        bundle: 'app.min.js',
        scriptsrc: [
            'source/*.js'
        ],
        aspxsrc: [
            'source/default.aspx'
        ],
        stylesrc: [//start with files in the order they need to be in the output file, leave the *.js and ! at the end to catch anything where the final file order doesn't matter
            'source/**/*.css',
            '!source/**/*.min.css*/'
        ]

        //shared app files
    },

    sharedControllers: {
        name: 'sharedControllers',
        foldername: 'shared',
        scriptsrc: [
            'source/shared/Controllers/*.js'
        ],
        bundle : 'sharedControllers.min.js'
    },

    sharedDirectives: {
        name: 'sharedDirectives',
        foldername: 'shared',
        scriptsrc: [
            'source/shared/Directives/*.js'
        ],
        bundle: 'sharedDirectives.min.js'
    },

    sharedServices: {
        name: 'sharedServices',
        foldername: 'shared',
        scriptsrc: [
            'source/shared/Services/*.js'
        ],
        bundle: 'sharedServices.min.js'
    },

    sharedViews: {
        name: 'sharedViews',
        foldername: 'shared',
        htmlsrc: [
            'source/shared/Views/*.html'
        ]        
    },

    
    //#endregion Application files

    //#region Home files
    angularHome: {
        name: 'angularHome',
        foldername: 'home',
        bundle: 'home.min.js',
        scriptsrc: [ //start with files in the order they need to be in the output file, leave the *.js and ! at the end to catch anything where the final file order doesn't matter


            'source/home/*.js'
        ],
        htmlsrc: [
            'source/home/*.html'
        ]
    },

    images: {
        name: 'images',
        foldername: 'images',
        imagesrc: [
            'source/images/*.*'
        ]
    }

    
    

    //#endregion Home files

};

//var sections = [
   //     'jquery',
   //     'bootstrap',
   //     'angular',
   //     'modernizr',
   //     'root',
   //     'home',
   //     'shared'
//];

var sections = [<%= spdev_sections %>, 'root'];

//#endregion configuration

//#region utilities

function getFolderName(sectionObj) {
    var foldername = '';
    if (sectionObj
        && "undefined" !== typeof sectionObj.foldername) {
        foldername = sectionObj.foldername;
    }

    return foldername;
}

function getOutPath(foldername, prop, sectionObj) {
    var out = config[prop];

    if ("undefined" !== typeof sectionObj[prop]) {
        out = sectionObj[prop];
    }

    return ("undefined" === typeof foldername
            || "" === foldername)
               ? out
               : approot + "/" + foldername;

}

function isInvalidSection(oneSection, targetProp) {
    return ("undefined" === typeof oneSection
        || null === oneSection
        || "undefined" === typeof oneSection[targetProp]
        || 0 === oneSection[targetProp].length);
        
}

function writeFile(filepath, filename, contents, cb) {
    
    fs.writeFile(filepath + "/" + filename, contents, cb);
}

//#endregion utilities

//#region Processors

function processScripts(oneSection) {
    gutil.log("Running processScripts in mode: " + config.mode + " for section: " + oneSection.name);
    if (isInvalidSection(oneSection, "scriptsrc")) {
        gutil.log("Skipping Script processing - no scriptsrc specified");
        return null;
    }

    var foldername = getFolderName(oneSection);
    var scriptout = getOutPath(foldername, "scriptout", oneSection);

    if ("undefined" !== typeof oneSection.scriptout) {
        scriptout = (foldername === "")
            ? oneSection.scriptout
            : foldername + "/" + oneSection.scriptout;        
    }
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
           // .pipe(filenames("javascript-" + oneSection.name))
            .pipe(sourcemaps.write(config.mapout))
            .pipe(gulp.dest(scriptout));


    } catch (err) {
        gutil.log(err);
    }
    return null;

}

function processStyles(oneSection) {
    if (isInvalidSection(oneSection, "stylesrc")) {
        gutil.log("Skipping Style processing - no stylesrc specified");
        return null;
    }
    var foldername = getFolderName(oneSection);
    var cssout = getOutPath(foldername, "cssout", oneSection);
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
    if (isInvalidSection(oneSection, "htmlsrc")) {
        gutil.log("Skipping HTML processing - no htmlsrc specified");
        return null;
    }

    var foldername = getFolderName(oneSection);
    var htmlout = getOutPath(foldername, "htmlout", oneSection);

    gutil.log("Processing Html to folder " + htmlout);
   
    del([
        htmlout + "/*.html"
    ]);

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
    if (isInvalidSection(oneSection, "fontsrc")) {
        gutil.log("Skipping Font processing - no fontsrc specified");
        return null;
    }

    var foldername = getFolderName(oneSection);
    var fontout = getOutPath(foldername, "fontout", oneSection);

    gutil.log("Processing Fonts to folder " + fontout);

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
    if (isInvalidSection(oneSection, "aspxsrc")) {
        gutil.log("Skipping Aspx processing - no aspxsrc specified");
        return null;
    }

    var foldername = getFolderName(oneSection);
    var aspxout = getOutPath(foldername, "aspxout", oneSection);

    gutil.log("Processing Aspx to folder " + aspxout);

    del([
        aspxout + "/*.aspx"
    ]);

    gulp.src(oneSection.aspxsrc)
         .pipe(gulp.dest(aspxout));

    return null;
}

function processFonts(oneSection) {
    if (isInvalidSection(oneSection, "imagesrc")) {
        gutil.log("Skipping Font processing - no fontsrc specified");
        return null;
    }
    var foldername = getFolderName(oneSection);
    var fontout = getOutPath(foldername, "imagesrc", oneSection);
    
    del(
        oneSection.fontout + "/*.*"        
    );

    gulp.src(oneSection.fontsrc)
        .pipe(gulp.dest(fontout));
    return null;

}

function processImages(oneSection) {
    if (isInvalidSection(oneSection, "imagesrc")) {
        gutil.log("Skipping Image processing - no imagesrc specified");
        return null;
    }

    var foldername = getFolderName(oneSection);
    var imageout = getOutPath(foldername, "imageout", oneSection);

    gutil.log("Processing Images to folder " + imageout);

    del([
        imageout + "/*.png",
        imageout + "/*.jpg",
        imageout + "/*.jpeg",
        imageout + "/*.gif"
    ]);

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

