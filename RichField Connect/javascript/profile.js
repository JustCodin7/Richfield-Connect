// ================================
// PROFILE.JS
// ================================

$(document).ready(function() {

    // ================================
    // STEP 1 - READ FROM LOCALSTORAGE
    // ================================

    var userData = JSON.parse(
        localStorage.getItem("richfieldUser")
    );

    // If no user data redirect to signup
    if (userData === null) {
        window.location.href = "signup.html";
        return;
    }

    // ================================
    // STEP 2 - FILL IN PROFILE DETAILS
    // ================================

    // Fill in name
    $("#profileName").text(userData.name);

    // Fill in campus
    // This handles BOTH possible HTML structures
    if ($("#profileCampus span").length > 0) {
        $("#profileCampus span").text(userData.campus);
    } else {
        $("#profileCampus").text(userData.campus);
    }

    // Fill in email
    if ($("#profileEmail span").length > 0) {
        $("#profileEmail span").text(userData.email);
    } else {
        $("#profileEmail").text(userData.email);
    }

    // Fill in student number
    if ($("#profileStudentNumber span").length > 0) {
        $("#profileStudentNumber span").text(
            userData.studentNumber
        );
    } else {
        $("#profileStudentNumber").text(
            userData.studentNumber
        );
    }

    // Fill in bio
    $("#profileBio").text(userData.bio);

    // ==================================
    // STEP 3 - FILL IN INTERESTS AS TAGS
    // ==================================

    var interestsArray = userData.interests.split(",");

    $("#profileInterests").html("");

    $.each(interestsArray, function(index, interest) {
        var cleanInterest = interest.trim();
        if (cleanInterest !== "") {
            $("#profileInterests").append(
                '<span class="interest-tag">'
                + cleanInterest +
                '</span>'
            );
        }
    });

    // ================================
    // STEP 4 - LOAD STATS
    // ================================

    var posts = JSON.parse(
        localStorage.getItem("richfieldPosts")
    ) || [];

    var userPosts = 0;
    var userLikes = 0;

    $.each(posts, function(index, post) {
        if (post.author === userData.name) {
            userPosts++;
            userLikes += post.likes;
        }
    });

// ANIMATED COUNTER - counts up to the number
function animateCounter(elementId, target) {
    var current = 0;
    // setInterval runs code repeatedly
    // every 50 milliseconds
    var timer = setInterval(function() {
        current++;
        $("#" + elementId).text(current);
        // When we reach target stop the timer
        if (current >= target) {
            clearInterval(timer);
        }
    }, 50);
}

// Only animate if there are stats to show
if (userPosts > 0) {
    animateCounter("postCount", userPosts);
} else {
    $("#postCount").text(0);
}

if (userLikes > 0) {
    animateCounter("likeCount", userLikes);
} else {
    $("#likeCount").text(0);
}
    // ================================
    // STEP 5 - BACK TO TOP BUTTON
    // ================================

    $(window).on("scroll", function() {
        if ($(window).scrollTop() > 200) {
            $("#backToTop").fadeIn();
        } else {
            $("#backToTop").fadeOut();
        }
    });

    $("#backToTop").on("click", function() {
        $("html, body").animate({ scrollTop: 0 }, 500);
    });


// ================================
// SLIDE TOGGLE FOR PROFILE SECTIONS
// ================================

// When a section heading is clicked
$(".toggle-heading").on("click", function() {

    // Slide the content open or closed
    $(this).next(".toggle-content").slideToggle(300);

    // Rotate the arrow icon
    $(this).find(".toggle-icon").toggleClass("rotated");
});





}); 