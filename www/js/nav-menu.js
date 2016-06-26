$(document).ready(function () {
    $(".navbar-nav li:not(.dropdown) a").click(function(event) {
        $(".navbar-collapse").collapse('hide');
    });
});