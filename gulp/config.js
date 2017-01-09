// Define base folders
var dev = './src';
var www = './dist';

module.exports = {
    server: {
        port: 3000,
        dev: {
            "name": "/dev",
            "src": dev
        },
        www: {
            "name": "/www",
            "src": www
        }
    },
    js: {
        vendor: [
            './bower_components/angular/angular.js',
            './bower_components/angular-ui-router/release/angular-ui-router.js',
            './bower_components/angular-animate/angular-animate.js',
            './bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
            './bower_components/qrcode/lib/qrcode.js',
            './bower_components/angular-qr/src/angular-qr.js',
            './bower_components/wijmo/Dist/controls/wijmo.js',
            './bower_components/wijmo/Dist/controls/wijmo.chart.js',
            './bower_components/wijmo/Dist/controls/wijmo.grid.js',
            './bower_components/wijmo/Dist/controls/wijmo.grid.filter.js',
            './bower_components/wijmo/Dist/controls/wijmo.grid.sheet.js',
            './bower_components/wijmo/Dist/controls/wijmo.grid.xlsx.js',
            './bower_components/wijmo/Dist/controls/wijmo.xlsx.js',            
            './bower_components/wijmo/Dist/controls/wijmo.pdf.js',            
            './bower_components/wijmo/Dist/controls/wijmo.grid.pdf.js',            
            './bower_components/wijmo/Dist/controls/wijmo.grid.grouppanel.js',
            './bower_components/wijmo/Dist/controls/wijmo.input.js',
            './bower_components/wijmo/Dist/interop/angular/wijmo.angular.js',
            './bower_components/jquery/dist/jquery.js',
            './bower_components/bootstrap/js/dropdown.js',
            './bower_components/bootstrap/js/collapse.js',
            './bower_components/bootstrap/js/tooltip.js',
            './bower_components/bootstrap/js/popover.js',
            './bower_components/bootstrap/js/modal.js',
            './bower_components/bootstrap/js/tab.js',
            './bower_components/auth0-lock/build/lock.js',
            './bower_components/angular-lock/dist/angular-lock.js',
            './bower_components/angular-jwt/dist/angular-jwt.js',
            './bower_components/moment/moment.js'
        ],
        custom: [
            dev + '/scripts/**/*.js'
        ],
        app: dev + '/app/app.js',
        dev: dev + '/content/js',
        www: www + '/content/js',
    },
    css: {
        vendor: [
            './bower_components/bootstrap/dist/css/bootstrap.css',
            './bower_components/animate.css/animate.css',
            './bower_components/wijmo/Dist/styles/wijmo.css'
        ],
        custom: [
            dev + '/sass/**/*.scss'
        ],
        dev: dev + '/content/css',
        www: www + '/content/css'
    },
    fonts: {
        vendor: [
            './bower_components/bootstrap/dist/fonts/**/*',
        ],
        custom: [
            dev + '/fonts/**/*'
        ],
        dev: dev + '/content/fonts',
        www: www + '/content/fonts'
    },
    img: {
        vendor: [

        ],
        custom: [
            dev + '/img/**/*'
        ],
        dev: dev + '/content/img',
        www: www + '/content/img'

    },
    html: {
        vendor: [

        ],
        custom: [
            dev + '/**/*.html',
            '!' + dev + '/index.html',
        ],
        index: dev + '/index.html',
        dev: dev + '/',
        www: www + '/',
    },
}