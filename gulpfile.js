//plugins
var gulp = require('gulp'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    notify = require('gulp-notify'),
    sass = require('gulp-sass'),
    notify = require('gulp-notify'),
    cleanCSS = require('gulp-clean-css'),
    htmlreplace = require('gulp-html-replace'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    browserify = require('browserify'),
    watchify = require('watchify'),
    //Gulp Configuration
    config = require('./gulp/config')

gulp.task('vendorjs', function () {
    return gulp.src(config.js.vendor)
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest(config.js.dev))
        .pipe(notify({
            title: "vendor js",
            message: "<%= file.relative %> done!.",
            onLast: false,
        }))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(config.js.www))
        .pipe(notify({
            title: "vendor js",
            message: "<%= file.relative %> done!.",
            onLast: true,
        }));
});

gulp.task('customjs', function () {
    return gulp.src(config.js.custom)
        .pipe(concat('custom.js'))
        .pipe(gulp.dest(config.js.dev))
        .pipe(notify({
            title: "custom js",
            message: "<%= file.relative %> done!.",
            onLast: false,
        }))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(config.js.www))
        .pipe(notify({
            title: "custom js",
            message: "<%= file.relative %> done!.",
            onLast: true,
        }));
});

gulp.task('appjs', function () {
    return bundle(config.js.app, true);
});

gulp.task('vendorcss', function () {
    return gulp.src(config.css.vendor)
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest(config.css.dev))
        .pipe(cleanCSS({ debug: true }, function (details) {
            console.log(details.name + ': ' + details.stats.originalSize);
            console.log(details.name + ': ' + details.stats.minifiedSize);
        }))
        .pipe(notify({
            title: "vendor css",
            message: "<%= file.relative %> done!.",
            onLast: false,
        }))
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest(config.css.www))
        .pipe(notify({
            title: "vendor css",
            message: "<%= file.relative %> done!.",
            onLast: true,
        }))
});

gulp.task('customcss', function () {
    return gulp.src(config.css.custom)
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('custom.css'))
        .pipe(gulp.dest(config.css.dev))
        .pipe(cleanCSS({ debug: true }, function (details) {
            console.log(details.name + ': ' + details.stats.originalSize);
            console.log(details.name + ': ' + details.stats.minifiedSize);
        }))
        .pipe(notify({
            title: "custom css",
            message: "<%= file.relative %> done!.",
            onLast: false,
        }))
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest(config.css.www))
        .pipe(notify({
            title: "custom css",
            message: "<%= file.relative %> done!.",
            onLast: true,
        }))
});

gulp.task('vendorfonts', function () {
    return gulp.src(config.fonts.vendor)
        .pipe(gulp.dest(config.fonts.dev))
        .pipe(notify({
            title: "vendor fonts",
            message: "<%= file.relative %> done!.",
            onLast: false,
        }))
        .pipe(gulp.dest(config.fonts.www))
        .pipe(notify({
            title: "vendor fonts",
            message: "<%= file.relative %> done!.",
            onLast: false,
        }))
});

gulp.task('customfonts', function () {
    return gulp.src(config.fonts.custom)
        .pipe(gulp.dest(config.fonts.dev))
        .pipe(notify({
            title: "vendor fonts",
            message: "<%= file.relative %> done!.",
            onLast: false,
        }))
        .pipe(gulp.dest(config.fonts.www))
        .pipe(notify({
            title: "custom fonts",
            message: "<%= file.relative %> done!.",
            onLast: false,
        }))
});

gulp.task('vendorimg', function () {
    return gulp.src(config.img.vendor)
        .pipe(gulp.dest(config.img.dev))
        .pipe(notify({
            title: "vendor img",
            message: "<%= file.relative %> done!.",
            onLast: false,
        }))
        .pipe(gulp.dest(config.img.www))
        .pipe(notify({
            title: "vendor img",
            message: "<%= file.relative %> done!.",
            onLast: false,
        }))
});

gulp.task('customimg', function () {
    return gulp.src(config.img.custom)
        .pipe(gulp.dest(config.img.dev))
        .pipe(notify({
            title: "vendor img",
            message: "<%= file.relative %> done!.",
            onLast: false,
        }))
        .pipe(gulp.dest(config.img.www))
        .pipe(notify({
            title: "custom img",
            message: "<%= file.relative %> done!.",
            onLast: false,
        }))
});

gulp.task('customhtml', function () {
    return gulp.src(config.html.custom)
        .pipe(gulp.dest(config.html.www))
        .pipe(notify({
            title: "custom html",
            message: "<%= file.relative %> done!.",
            onLast: false,
        }));
});

gulp.task('indexhtml', function () {
    return gulp.src(config.html.index)
        .pipe(htmlreplace({
            'vendorcss': 'content/css/vendor.min.css',
            'customcss': 'content/css/custom.min.css',
            'vendorjs': 'content/js/vendor.min.js',
            'customjs': 'content/js/custom.min.js',
            'appjs': 'content/js/app.min.js'
        }))
        .pipe(gulp.dest(config.html.www))
        .pipe(notify({
            title: "index html",
            message: "<%= file.relative %> done!.",
            onLast: true,
        }));
});

gulp.task('watch', function (done) {
    gulp.watch(config.js.vendor, ['vendorjs']);
    gulp.watch(config.js.custom, ['customjs']);
    gulp.watch(config.css.vendor, ['vendorcss']);
    gulp.watch(config.css.custom, ['customcss']);
    gulp.watch(config.fonts.vendor, ['vendorfonts']);
    gulp.watch(config.fonts.custom, ['customfonts']);
    gulp.watch(config.img.vendor, ['vendorimg']);
    gulp.watch(config.img.custom, ['customimg']);
    gulp.watch(config.html.custom, ['customhtml']);
    gulp.watch(config.html.index, ['indexhtml']);

    var watchPaths = [
        config.js.vendor,
        config.js.custom,
        config.css.vendor,
        config.css.custom,
        config.fonts.vendor,
        config.fonts.custom,
        config.img.vendor,
        config.img.custom,
        config.html.custom,
        config.html.index
    ];

    gulp.watch(watchPaths)
        .on('change', function (file) {
            console.log('File ' + file.path + ' was ' + file.type + ', running tasks...');
            //livereload.changed(file.path);
        });

    //livereload.listen();
});

// Default Task
gulp.task('default', [
    'vendorjs',
    'customjs',
    'appjs',
    'vendorcss',
    'customcss',
    'vendorfonts',
    'customfonts',
    'vendorimg',
    'customimg',
    'customhtml',
    'indexhtml',
    'watch'
]);

///////////////////////////////////
function handleErrors(error) {
    var args = Array.prototype.slice.call(arguments);
    notify.onError({
        title: 'Compile Error',
        message: error.message
    }).apply(this, args);
    this.emit('end'); // Keep gulp from hanging on this task
}

function bundle(file, watch) {

    var props = {
        entries: [file],
        debug: true,
        transform: [] //will transform the source code before the parsing
    };

    // watchify() if watch requested, otherwise run browserify() once 
    var bundler = watch ? watchify(browserify(props)) : browserify(props);

    function rebundle() {
        console.log('rebundle...');
        var stream = bundler.bundle();
        stream
            .on('error', handleErrors)
            .pipe(source(file)) // gives streaming vinyl file object
            .pipe(buffer()) // <----- convert from streaming to buffered vinyl file object
            .pipe(rename({ dirname: '', basename: 'app', extname: '.js' }))
            .pipe(gulp.dest(config.js.dev))
            .pipe(notify({
                title: "watchify",
                message: "bundle <%= file.relative %> done!.",
                onLast: false,
            }))
            .pipe(uglify()) // now gulp-uglify works 
            .pipe(rename({ basename: 'app', extname: '.min.js' }))
            .pipe(gulp.dest(config.js.www))
            .pipe(notify({
                title: "watchify",
                message: "bundle <%= file.relative %> done!.",
                onLast: true,
            }));
    }

    // listen for an update and run rebundle
    bundler.on('update', function () {
        rebundle();
    });

    // run it once the first time buildScript is called
    return rebundle();
}