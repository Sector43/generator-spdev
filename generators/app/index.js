'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var cheerio = require('cheerio');
    

var spDataItemId1 = _guidGen();
var featureId1 = _guidGen();
var projectGUID = _guidGen();
var packageId = _guidGen();
var appId = _guidGen();
var appVersion = "0.0.1";
var appName = "my test app";
var libraries = "";
var gitUrl = "http://git/url/goes.here";
var author = "David Mann";
var appLicense = "MIT";
var siteUrl = "http://intranet.wingtip.com";


module.exports = yeoman.generators.Base.extend({
    prompting: function() {

        var done = this.async();

        // Have Yeoman greet the user.
        this.log(yosay(
            'Welcome weary developer to the new world of SharePoint development.  Rest a moment whilst I prepare thy masterpiece.'
        ));

        var prompts = [
            {
                type: 'input',
                name: 'appName',
                message: 'What is the name of the Add-in?',
                default: appName
            },
            {
                type: 'input',
                name: 'authorName',
                message: 'What is your name?',
                default: author
            },
			{
			  type: 'input',
			  name: 'siteUrl',
			  message: 'URL of debugging site?',
			  default: siteUrl
			},
            {
                type: 'checkbox',
                name: 'libraries',
                message: 'Which libraries would you like to include?',
                choices: [
                    {
                        name: 'Angular',
                        value: "'angular'",
                        checked: true
                    },
                    {
                        name: 'Bootstrap',
                        value: "'bootstrap'",
                        checked: true
                    },                    
                    {
                        name: 'JQuery',
                        value: "'jquery'",
                        checked: true
                    }
                ]
            },
            {
                type: 'confirm',
                name: 'angularShared',
                message: 'Include "shared" section for Angular to support services, directives, etc used across the application?',
                default: true,
                when: function(answers) {
                    for (var i = 0; i < answers.libraries.length; i++) {
                        if (answers.libraries[i].indexOf('angular') > -1) {
                            return true;
                        }
                    }
                    return false;
                }
            }
        ];


        this.prompt(prompts, function(props) {
            this.props = props;
            appName = props.appName.replace(/ /g, "-");
            author = props.authorName;
            libraries = props.libraries;
			siteUrl = props.siteUrl;
            if (props.angularShared) {
                libraries.push("'angularShared'");
            }


            done();
        }.bind(this));


    },

    writing: {
        dynamicfiles: function() {
            this.log(chalk.yellow("included libraries = " + libraries));

            this.fs.copyTpl(
                this.templatePath('dynamic/**/*.*'),
                this.destinationPath(''),
                {
                    spdev_projName: appName,
                    spdev_gitUrl: gitUrl,
                    spdev_author: author,
                    spdev_license: appLicense,
                    spdev_appVersion: appVersion,
                    spdev_appId: appId,
                    spdev_projectGUID: projectGUID,
                    spdev_spDataItemId1: spDataItemId1,
                    spdev_featureId1: featureId1,
                    spdev_packageId: packageId,
                    spdev_sections: libraries,
					spdev_siteUrl : siteUrl
                }
            );
        },

        staticfiles: function() {

            this.directory('static', '/');

        },


        conditionalFiles: function() {
            console.log("Processing Conditional Files");
            if (this._libraryIsSelected('angular')) {
				console.log("Adding Angular support");
                this.fs.copy(this.sourceRoot() + '\\conditional\\angular\\config.route.js', this.destinationRoot() + "\\app\\config.route.js");
				this.directory('conditional/angular/home', '/app/home');
				if (this._libraryIsSelected('angularShared')) {
					console.log("Adding Angular shared elements");
					this.directory('conditional/angular/shared', '/app/shared');					
				}
            }
			console.log("Done processing Conditional Files...");
        }


    },


    install: function() {
	
        this.log(chalk.yellow("Finishing configuration - downloading dependencies.  This could take several minutes"));
        this.installDependencies();
		
    },


    end: {
        setUpProjectFiles: function() {
            this.log(chalk.yellow("Scaffolding set up, doing a little housecleaning..."));
            this.fs.move('_ProjName_.csproj', appName + '.csproj');
			this.fs.move('_ProjName_.csproj.user', appName + '.csproj.user');
            this.fs.move('_ProjName_.sln', appName + '.sln');
            this.fs.commit(function() {});

            var contents = this.fs.read(this.destinationRoot() + "/" + appName + '.csproj');
            var csProj = cheerio.load(contents, {
                xmlMode: true
            });
           


            if (this._libraryIsSelected('angular')) {
                csProj('#IncludedFilesRoot').prepend("<Content Include='app\\config.route.js' />");

            } else {
                console.log("error");
            }

            

            csProj('#IncludedFilesRoot').removeAttr('id');
            this.fs.write(this.destinationRoot() + "/" + appName + '.csproj', csProj.xml());
            this.fs.commit(function () { });

        },

        finalize: function() {
            this.log(chalk.yellow("Finishing configuration - running tsd"));
            var done = this.async();
            var self = this;
            this.spawnCommand('gulp', ['initialBuild']).on("close", function() {
                self.spawnCommand('tsd', ['reinstall']).on("close", function() {

                    self.log(yosay(
                        'Alas!  My work here is done.'
                    ));
                    done;
                });
            });
        }

    },

 _libraryIsSelected: function(target) {
    for (var i = 0; i < libraries.length; i++) {        
        if (libraries[i].indexOf(target) > -1) {
            return true;
        }        
	}
	return false;
}

});




function _guidGen() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
