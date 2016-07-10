var gulp = require('gulp');
var gutil = require('gulp-util');
var watchify = require('watchify');
var browserify = require('browserify');
var uglifyify = require('uglifyify');
var uglify = require('gulp-uglify');
var notify = require('gulp-notify');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

function handleErrors(error) {
    var args = Array.prototype.slice.call(arguments);
    notify.onError({
        title: 'Compile Error',
        message: error.message
    }).apply(this, args);
    this.emit('end'); // Keep gulp from hanging on this task
}

function buildScript(file, watch) {

    var props = {
        entries: [file],
        debug: true,
        transform: [] //will transform the source code before the parsing
    };

    // watchify() if watch requested, otherwise run browserify() once 
    var bundler = watch ? watchify(browserify(props)) : browserify(props);

    function rebundle() {
        var stream = bundler.bundle();
        return stream
            .on('error', handleErrors)
            .pipe(source(file)) // gives streaming vinyl file object
            .pipe(buffer()) // <----- convert from streaming to buffered vinyl file object
            .pipe(rename({ basename: 'bundle', extname: '.js' }))
            .pipe(gulp.dest('./www/js'))
            .pipe(uglify()) // now gulp-uglify works 
            .pipe(rename({ basename: 'bundle', extname: '.min.js' }))
            .pipe(gulp.dest('./www/js'));
    }

    // listen for an update and run rebundle
    bundler.on('update', function () {
        rebundle();
        gutil.log('Rebundle...');
    });

    // run it once the first time buildScript is called
    return rebundle();
}

// run once
gulp.task('scripts', function () {
    return buildScript('app.js', false);
});

gulp.task('html', function () {
    return gulp.src([
        'modules/**/*.html',
    ], { base: 'modules' })
        .pipe(gulp.dest('www/modules'));
});

gulp.task('new', function () {
    if (!!gutil.env.module && (typeof (gutil.env.module) !== 'boolean')) {
        return gulp.src([
            'tpl/module/**/*',
        ], { base: 'tpl' })
            .pipe(gulp.dest('modules/'+gutil.env.module));
    } else {
        gutil.log("Please provide a module name with --modname 'module.name'")
    }

});

var watcher = gulp.watch('modules/**/*.html', ['html']);
watcher.on('change', function (event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
});

// run 'scripts' task first, then watch for future changes
gulp.task('default', ['html', 'scripts'], function () {
    return buildScript('app.js', true);
});