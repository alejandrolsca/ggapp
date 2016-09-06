var gulp = require('gulp');
var gutil = require('gulp-util');
var watchify = require('watchify');
var browserify = require('browserify');
var uglify = require('gulp-uglify');
var notify = require('gulp-notify');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var concat = require('gulp-concat');
var sass = require('gulp-sass');

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
            .pipe(rename({ dirname: '', basename:'app', extname: '.js' }))
            .pipe(gulp.dest('./client/app/content/js'))
            .pipe(uglify()) // now gulp-uglify works 
            .pipe(rename({ basename: 'app', extname: '.min.js' }))
            .pipe(gulp.dest('./client/app/content/js'));
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
gulp.task('sass', function () {
  return gulp.src('./client/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./client/app/content/css'))
});
 
gulp.task('sass:watch', function () {
  gulp.watch('./client/scss/**/*.scss', ['sass']);
});
/*
gulp.task('bundle.css', function () {
    gulp.src([
        './bower_components/wijmo/Dist/styles/wijmo.css', 
        './bower_components/bootstrap/dist/css/bootstrap.min.css',
        './bower_components/animate.css/animate.min.css',
        './client/scss/css/global.min.css',
        './client/scss/css/menu.min.css',
        './client/scss/css/navbar.min.css',
        './client/scss/css/animations.min.css'
    ])
        .pipe(concat('bundle.css'))
        .pipe(gulp.dest('./client/public/css'));
});

gulp.task('bundle.js', function () {
    gulp.src([
        './bower_components/angular/angular.min.js',
        './bower_components/angular-ui-router/release/angular-ui-router.min.js',
        './bower_components/angular-animate/angular-animate.min.js',
        './bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
        './bower_components/angular-qr/angular-qr.min.js',
        './bower_components/wijmo/Dist/controls/wijmo.min.js',
        './bower_components/wijmo/Dist/controls/wijmo.grid.min.js',
        './bower_components/wijmo/Dist/controls/wijmo.grid.filter.min.js',
        './bower_components/wijmo/Dist/interop/angular/wijmo.angular.min.js',
        './bower_components/jquery/dist/jquery.min.js',
        './bower_components/bootstrap/js/dropdown.js',
        './bower_components/bootstrap/js/collapse.js',
        './bower_components/bootstrap/js/tooltip.js',
        './bower_components/bootstrap/js/popover.js',
        './bower_components/bootstrap/js/modal.js',
        './bower_components/bootstrap/js/tab.js',
        './bower_components/qrcode/lib/qrcode.min.js',
        './bower_components/auth0-lock/build/lock.js',
        './bower_components/angular-lock/dist/angular-lock.js',
        './bower_components/angular-jwt/dist/angular-jwt.js',
        './client/content/js/gg-alerts.js',
        './client/content/js/gg-fields.js',
        './client/content/js/libphonenumber.js',
        './client/content/js/nav-menu.js' 
    ])
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest('./client/public/js'));
});
*/

gulp.task('scripts', function () {
    return buildScript('./client/app/app.js', false);
});

gulp.task('html', function () {
    return gulp.src([
        './client/app/**/*.html',
    ], { base: './client/app' })
        .pipe(gulp.dest('./client/public'));
});

gulp.task('new', function () {
    if (!!gutil.env.module && (typeof (gutil.env.module) !== 'boolean')) {
        return gulp.src([
            'tpl/module/**/*',
        ], { base: 'tpl' })
            .pipe(gulp.dest('modules/' + gutil.env.module));
    } else {
        gutil.log("Please provide a module name with --modname 'module.name'")
    }

});

var watcher = gulp.watch('./client/app/**/*.html', ['html']);
watcher.on('change', function (event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
});

// run 'scripts' task first, then watch for future changes
gulp.task('default', ['html', 'scripts', 'sass', 'sass:watch'], function () {
    return buildScript('./client/app/app.js', true);
});