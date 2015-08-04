'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

// load plugins
var $ = require('gulp-load-plugins')();

gulp.task('scripts', function() {
    return gulp.src('hosts/**/*.js')
        .pipe($.jshint())
        .pipe($.jshint.reporter(require('jshint-stylish')))
        .pipe($.size());
});

var otherHosts = [
    'component_a.dev',
    'component_b.dev',
];

otherHosts.forEach(function(host, index) {
    gulp.task(host, function() {
        gulp.src('hosts/' + host)
            .pipe($.webserver({
                host: host,
                port: 8501 + index
            }));
    });
});

gulp.task('serve', function() {
    setTimeout(function () {
        // Main host
        browserSync.init(null, {
            server: {
                baseDir: 'hosts/integrator.dev'
            },
            debugInfo: false,
            open: "external",
            host: "integrator.dev",
            port: 3002
        });
    }, 1000); // Make sure that the otherHosts are up
});

gulp.task('watch', otherHosts.concat(['serve']), function() {
    // watch for changes
    gulp.watch(['hosts/**/*.html', 'hosts/**/*.js'], reload);
    gulp.watch(['hosts/**/*.js'], ['scripts']);
});

gulp.task('default', ['watch']);

