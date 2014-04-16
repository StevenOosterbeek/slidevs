var http = require('http'),
    fs = require('fs'),
    path = require('path'),
    es = require('event-stream'),
    rimraf = require('rimraf'),
    async = require('async'),
    colors = require('colors');

module.exports = slidevs;

// Create slidev
function slidevs(inputSettings) {

    settings = {
        name: inputSettings.name.toLowerCase().replace(' ', '-') || 'slidevs-presentation',
        layout: inputSettings.layout.toLowerCase().replace('.html', '').replace('/', '') + '.html' || 'layout.html',
        slidesFolder: inputSettings.slidesFolder.toLowerCase().replace(' ', '') || '/slides',
        notes: inputSettings.notes || false,
        port: inputSettings.port || 5000,
        thisFolder: path.dirname(module.parent.filename),
        slidevsFolder: path.dirname(module.parent.filename) + '/.slidevs'
    };

    return {
        name: function() {
            return settings.name;
        }(),
        layout: function() {
            return settings.layout;
        }(),
        slidesFolder: function() {
            return settings.slidesFolder;
        }(),
        notes: function() {
            return settings.notes;
        }(),
        port: function() {
            return settings.port;
        }(),
        thisFolder: function() {
            return settings.thisFolder;
        }(),
        slidevsFolder: function() {
            return settings.slidevsFolder;
        }(),
        start: function() {
            startSlidevs(this);
        }
    };

}

// Start slidevs
function startSlidevs(slidevs) {

    console.log('\n# Starting slidevs'.yellow);

    async.waterfall([
        function(startCallback) {
            buildSlidevs(slidevs, startCallback);
        },
        function(slidevs, startCallback) {
            createSlidevsServer(slidevs, startCallback);
        }
    ], function(err, finalSlidev) {
        if(err) showError('start async', err);
        console.log('\n\nSLIDEVS'.yellow + ' ######################################################\n'.grey);
        console.log('Your slidev \''.green + finalSlidev.name.green  + '\' has been created!'.green);
        console.log('Slides:'.bold , finalSlidev.slides.cyan);
        console.log('Controls:'.bold , finalSlidev.controls.cyan);
        console.log('\n#########################################################\n\n'.grey);
    });

}

// Build slidevs
function buildSlidevs(slidevs, startCallback) {

    console.log('\n=> Starting build'.grey);

    async.waterfall([
        function(buildCallback) {
            checkSlidevsFolder(slidevs, buildCallback);
        },
        function(slidevs, buildCallback) {
            prepareSlides(slidevs, buildCallback);
        },
        function(slidevs, buildCallback) {
            concatSlidevs(slidevs, buildCallback);
        }
    ], function(err, slidevs) {
        if(err) showError('build async', err);
        else {
            console.log('\nDone building');
            startCallback(null, slidevs);
        }
    });

}

// Manage hidden slidevs folder
function checkSlidevsFolder(slidevs, buildCallback) {

    console.log('\nChecking folder');

    function createSlidevsFolder() {
        fs.mkdir(slidevs.slidevsFolder, [], function(err) {
            if(err) showError('creating a hidden slidevs folder' + err);
            else buildCallback(null, slidevs);
        });
    }

    fs.exists(slidevs.slidevsFolder, function(exists) {
        if(exists) {
            rimraf(slidevs.slidevsFolder, function(err) {
                if(err) showError('deleting the hidden slidevs folder', err);
                createSlidevsFolder();
            });
        } else createSlidevsFolder();
    });

}

// Concat slides
function prepareSlides(slidevs, buildCallback) {

    console.log('\nPreparing slides');

    var tmpSlidesFolder = slidevs.slidevsFolder + '/.slides-tmp';
    fs.mkdir(tmpSlidesFolder, 0777, function(err) {
        if (err) showError('creating hidden slides folder', err);
        else {
            fs.readdir(slidevs.thisFolder + slidevs.slidesFolder, function(err, slides) {
                if (err) showError('preparing the slides', err);
                if (slides.length < 2) showError('preparing the slides', 'You need at least two slides!');
                else {

                    concatSlides = function() {
                        slides.forEach(function(slide, index) {
                            fs.readFile(tmpSlidesFolder + '/' + slide, function(err, data) {
                                if (err) showError('getting a slide for concatting', err);
                                else {
                                    fs.appendFile(tmpSlidesFolder + '/slides.html', (data.toString() + '\n'), function(err) {
                                        if (err) showError('adding slide to temporary slides file', err);
                                        else {
                                            fs.unlink(tmpSlidesFolder + '/' + slide, function(err) {
                                                if (err) showError('deleting temporary slide file', err);
                                            });
                                        }
                                    });
                                }
                            });
                            if ((index + 1) === slides.length) buildCallback(null, slidevs);
                        });
                    };

                    slides.forEach(function(slide, index) {

                        var slideFile = fs.createReadStream(slidevs.thisFolder + slidevs.slidesFolder + '/' + slide),
                            tmpSlideFile = fs.createWriteStream(tmpSlidesFolder + '/' + slide);

                        slideFile
                            .pipe(es.through(function(s) {
                                var slide = s.toString();
                                var resultSlide = '<div class="slide ' + (index + 1) + '">\n' + slide;
                                this.emit('data', resultSlide);
                            }, function() {
                                this.emit('data', '\n</div>');
                                this.emit('end');
                            }))
                            .pipe(tmpSlideFile)
                            .on('error', function(err) {
                                showError('piping a slide to his temporary file', err);
                            })
                            .on('finish', function() {
                                if ((index + 1) === slides.length) concatSlides();
                            });

                    });

                }
            });
        }
    });
}

// Create slidevs presentation
function concatSlidevs(slidevs, buildCallback) {

    console.log('\nConcating presentation');
    buildCallback(null, slidevs);

    // var layout = fs.createReadStream(path.dirname(module.parent.filename) + '/' + slidevs.layout);
    // slidevsIndex = fs.createWriteStream(path.dirname(module.parent.filename) + '/.slidevs' + '/index.html');

    // layout.pipe(es.split('\n'))
    //     .pipe(es.mapSync(function(line) {
    //         return line.split('\t');
    //     }))
    //     .pipe(es.mapSync(function(line) {
    //         console.log('Line:', line[0]);
    //         if(line[0].indexOf('[# Slides #]') > 0) {
    //             console.log('Place slides here!');
    //         }
    //         return line;
    //     }))
    //     .pipe(es.join('\n'))
    //     .pipe(es.wait())
    //     .pipe(slidevsIndex)
    //     .on('error', function(error) {
    //         showError('importing slides', error);
    //     })
    //     .on('finish', function() {
    //         callback(null, slidevs);
    //     });

}

// Create server
function createSlidevsServer(slidevs, startCallback) {

    console.log('\n=> Creating slidevs server'.grey);

    var uri = {
            slides: '/' + slidevs.name,
            controls: '/' + slidevs.name + '/controls'
        };

    var finalSlidev = {
        name: slidevs.name,
        slides: 'http://localhost:3000' + uri.slides,
        controls: 'http://localhost:3000' + uri.controls
    };

    startCallback(null, finalSlidev);

}

// Global error function
function showError(location, message) {
    console.log('\n\nSLIDEVS'.yellow + ' ######################################################\n'.grey);
    console.log('Something went wrong during '.red + location.red + ':\n'.red + message);
    console.log('\n#########################################################\n\n'.grey);
}