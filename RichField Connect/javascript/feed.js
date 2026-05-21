// ================================
// FEED.JS
// ================================

// Wait until page is fully loaded
$(document).ready(function() {

    // ================================
    // STEP 1 - GET LOGGED IN USER
    // ================================

    // Read user data from localStorage
    var userData = JSON.parse(
        localStorage.getItem("richfieldUser")
    );

    // If no user found send to signup
    if (userData === null) {
        window.location.href = "signup.html";
        return;
    }

    // Show username in "Posting as" section
    $("#postingAsName").text(userData.name);

    // Fill in sidebar profile info
    $("#sidebarName").text(userData.name);
    $("#sidebarCampus").html(
        '<i class="fa-solid fa-location-dot"></i> '
        + userData.campus
    );

    // ================================
    // STEP 2 - LOAD EXISTING POSTS
    // ================================

    // Get posts from localStorage
    // If none exist use empty array []
    var posts = JSON.parse(
        localStorage.getItem("richfieldPosts")
    ) || [];

    // Display all existing posts on page load
    // This makes posts survive page refresh
    if (posts.length > 0) {

        // Hide the empty state message
        $("#emptyState").hide();

        // Loop through each post and display it
        $.each(posts, function(index, post) {
            displayPost(post);
        });

    }

    // Update sidebar stats
    updateStats();

    // ================================
    // STEP 3 - CREATE NEW POST
    // ================================

    $("#postBtn").on("click", function() {

        // Get what user typed in textarea
        var postText = $("#postContent").val().trim();

        // Validate - dont allow empty posts
        if (postText === "") {
            $("#postError").text(
                "Please write something before posting!"
            );
            return;
        }

        // Clear any error message
        $("#postError").text("");

        // Get current date and time
        var now = new Date();
        var dateString = now.toLocaleDateString();
        var timeString = now.toLocaleTimeString();

        // Create a post object
        var newPost = {
            id: now.getTime(),
            author: userData.name,
            date: dateString + " " + timeString,
            content: postText,
            likes: 0,
            liked: false
        };

        // Add new post to beginning of array
        // unshift adds to the START not the end
        posts.unshift(newPost);

        // Save updated posts to localStorage
        localStorage.setItem("richfieldPosts",
            JSON.stringify(posts)
        );

        // Display the new post on screen
        displayPost(newPost, true);

        // Hide empty state if showing
        $("#emptyState").hide();

        // Clear the textarea
        $("#postContent").val("");

        // Update sidebar stats
        updateStats();

    });

    // ================================
    // STEP 4 - DISPLAY A POST
    // This function creates the HTML 
    // for one post card
    // ================================

    function displayPost(post, isNew) {

        // Build the post card HTML
        var postHTML =
            '<div class="post-card" id="post-' + post.id + '">' +

                '<div class="post-header">' +
                    '<span class="post-author">' +
                        '<i class="fa-solid fa-user"></i> ' +
                        post.author +
                    '</span>' +
                    '<span class="post-date">' +
                        '<i class="fa-solid fa-clock"></i> ' +
                        post.date +
                    '</span>' +
                '</div>' +

                '<p class="post-content">' +
                    post.content +
                '</p>' +

                '<div class="post-actions">' +
                    '<button class="like-btn ' +
                        (post.liked ? 'liked' : '') +
                        '" data-id="' + post.id + '">' +
                        '<i class="fa-solid fa-heart"></i> ' +
                        (post.liked ? 'Liked' : 'Like') +
                    '</button>' +
                    '<span class="like-count" id="likes-' +
                        post.id + '">' +
                        post.likes + ' likes' +
                    '</span>' +
                    '<button class="delete-btn" data-id="' +
                        post.id + '">' +
                        '<i class="fa-solid fa-trash"></i> Delete' +
                    '</button>' +
                '</div>' +

            '</div>';

        // If new post add to TOP of feed with fadeIn
        // If loading existing post add to BOTTOM
        if (isNew) {
            $("#postsContainer").prepend(postHTML);
            $("#post-" + post.id).hide().fadeIn(500);
        } else {
            $("#postsContainer").append(postHTML);
        }
    }

    // ================================
    // STEP 5 - LIKE A POST
    // Using jQuery event delegation
    // because posts are added dynamically
    // ================================

    $("#postsContainer").on("click", ".like-btn",
        function() {

        // Get the post id from the button
        var postId = $(this).data("id");

        // Find this post in our array
        $.each(posts, function(index, post) {
            if (post.id == postId) {

                // Toggle liked state
                if (post.liked) {
                    // Unlike the post
                    post.liked = false;
                    post.likes--;
                } else {
                    // Like the post
                    post.liked = true;
                    post.likes++;
                }

                // Update the like button text
                var btn = $(".like-btn[data-id='" +
                    postId + "']");

                if (post.liked) {
                    btn.addClass("liked");
                    btn.html(
                        '<i class="fa-solid fa-heart"></i> Liked'
                    );
                } else {
                    btn.removeClass("liked");
                    btn.html(
                        '<i class="fa-solid fa-heart"></i> Like'
                    );
                }

                // Update like count on screen
                $("#likes-" + postId).text(
                    post.likes + " likes"
                );

                // Save updated posts to localStorage
                localStorage.setItem("richfieldPosts",
                    JSON.stringify(posts)
                );

                // Update sidebar stats
                updateStats();

                return false; // stops the loop
            }
        });
    });

    // ================================
    // STEP 6 - DELETE A POST
    // ================================

    $("#postsContainer").on("click", ".delete-btn",
        function() {

        // Ask user to confirm deletion
        var confirmDelete = confirm(
            "Are you sure you want to delete this post?"
        );

        // Only delete if user clicked OK
        if (confirmDelete) {

            // Get post id
            var postId = $(this).data("id");

            // Remove post card from screen smoothly
            $("#post-" + postId).fadeOut(400, function() {
                $(this).remove();

                // Show empty state if no posts left
                if ($("#postsContainer .post-card").length === 0) {
                    $("#emptyState").show();
                }
            });

            // Remove post from array
            posts = $.grep(posts, function(post) {
                return post.id != postId;
            });

            // Save updated posts to localStorage
            localStorage.setItem("richfieldPosts",
                JSON.stringify(posts)
            );

            // Update sidebar stats
            updateStats();
        }
    });

    // ================================
    // STEP 7 - UPDATE SIDEBAR STATS
    // ================================

    function updateStats() {

        // Count posts by this user
        var userPosts = 0;
        var userLikes = 0;

        $.each(posts, function(index, post) {
            if (post.author === userData.name) {
                userPosts++;
                userLikes += post.likes;
            }
        });

        // Update sidebar numbers
        $("#sidebarPostCount").text(userPosts);
        $("#sidebarLikeCount").text(userLikes);
    }

    // ================================
    // STEP 8 - BACK TO TOP BUTTON
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

}); // END of document ready