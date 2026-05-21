// ================================
// MAIN.JS
// Back to top button
// ================================

$(document).ready(function() {

    // Show button when user scrolls down 200px
    $(window).on("scroll", function() {
        if ($(window).scrollTop() > 200) {
            $("#backToTop").fadeIn();
        } else {
            $("#backToTop").fadeOut();
        }
    });

    // Scroll smoothly to top when clicked
    $("#backToTop").on("click", function() {
        $("html, body").animate({ scrollTop: 0 }, 500);
    });

});