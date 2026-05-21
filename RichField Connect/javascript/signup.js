// ================================
// SIGNUP.JS
// ================================

// Wait until page is fully loaded
$(document).ready(function() {

    // ================================
    // STEP 1 - FIND ALL OUR INPUTS
    // ================================
    var nameInput = $("#fullName");
    var studentNumberInput = $("#studentNumber");
    var campusInput = $("#campus");
    var emailInput = $("#email");
    var passwordInput = $("#password");
    var confirmPasswordInput = $("#confirmPassword");
    var interestsInput = $("#interests");
    var bioInput = $("#bio");

    // ================================
    // STEP 2 - ERROR FUNCTIONS
    // ================================

    // Shows a red border and error message
    function showError(input, errorId, message) {
        input.addClass("error");
        $("#" + errorId).text(message);
    }

    // Removes red border and error message
    function clearError(input, errorId) {
        input.removeClass("error");
        $("#" + errorId).text("");
    }

    // ================================
    // STEP 3 - LIVE PREVIEW + VALIDATION
    // Both happen in the same listener
    // ================================

    // NAME - preview and validate together
    nameInput.on("keyup", function() {
        var typedName = nameInput.val();

        // PREVIEW
        if (typedName !== "") {
            $("#previewName").text(typedName);
        } else {
            $("#previewName").text("Your Name");
        }

        // VALIDATION
        if (typedName.trim() === "") {
            showError(nameInput, "nameError",
                "Full name is required");
        } else {
            clearError(nameInput, "nameError");
        }
    });

    // STUDENT NUMBER - validate only
    studentNumberInput.on("keyup", function() {
        var studentNum = studentNumberInput.val().trim();
        if (studentNum === "") {
            showError(studentNumberInput,
                "studentNumberError",
                "Student number is required");
        } else if (isNaN(studentNum)) {
            showError(studentNumberInput,
                "studentNumberError",
                "Student number must be numeric");
        } else {
            clearError(studentNumberInput,
                "studentNumberError");
        }
    });

    // CAMPUS - preview and validate together
    campusInput.on("change", function() {
        var selectedCampus = campusInput.val();

        // PREVIEW
        if (selectedCampus !== "") {
            $("#previewCampus").html(
                '<i class="fa-solid fa-location-dot"></i> '
                + selectedCampus
            );
        }

        // VALIDATION
        if (selectedCampus === "") {
            showError(campusInput, "campusError",
                "Please select your campus");
        } else {
            clearError(campusInput, "campusError");
        }
    });

    // EMAIL - validate only
    emailInput.on("keyup", function() {
        var email = emailInput.val().trim();
        if (email === "") {
            showError(emailInput, "emailError",
                "Email is required");
        } else if (!email.includes("@") ||
                   !email.includes(".")) {
            showError(emailInput, "emailError",
                "Enter a valid email address");
        } else {
            clearError(emailInput, "emailError");
        }
    });

    // PASSWORD - validate only
    passwordInput.on("keyup", function() {
        var password = passwordInput.val();
        if (password === "") {
            showError(passwordInput, "passwordError",
                "Password is required");
        } else if (password.length < 8) {
            showError(passwordInput, "passwordError",
                "Password must be at least 8 characters");
        } else {
            clearError(passwordInput, "passwordError");
        }
    });

    // CONFIRM PASSWORD - validate only
    confirmPasswordInput.on("keyup", function() {
        if (confirmPasswordInput.val() !==
            passwordInput.val()) {
            showError(confirmPasswordInput,
                "confirmPasswordError",
                "Passwords do not match");
        } else {
            clearError(confirmPasswordInput,
                "confirmPasswordError");
        }
    });

    // INTERESTS - preview and validate together
    interestsInput.on("keyup", function() {
        var typedInterests = interestsInput.val();
        var interestsArray = typedInterests.split(",");

        // PREVIEW - clear and rebuild tags
        $("#previewInterests").html("");
        $.each(interestsArray, function(index, interest) {
            var cleanInterest = interest.trim();
            if (cleanInterest !== "") {
                $("#previewInterests").append(
                    '<span class="interest-tag">'
                    + cleanInterest +
                    '</span>'
                );
            }
        });

        // VALIDATION
        if (typedInterests.trim() === "") {
            showError(interestsInput, "interestsError",
                "Please enter at least one interest");
        } else {
            clearError(interestsInput, "interestsError");
        }
    });

    // BIO - preview and validate together
    bioInput.on("keyup", function() {
        var typedBio = bioInput.val();

        // PREVIEW
        if (typedBio !== "") {
            $("#previewBio").text(typedBio);
        } else {
            $("#previewBio").text("Your bio will appear here...");
        }

        // VALIDATION
        if (typedBio.trim() === "") {
            showError(bioInput, "bioError",
                "Please enter a short bio");
        } else {
            clearError(bioInput, "bioError");
        }
    });

    // ================================
    // STEP 4 - FORM SUBMISSION
    // ================================
    $("#signupForm").on("submit", function(e) {

        // Stops page from refreshing
        e.preventDefault();

        // Get all values
        var name = nameInput.val().trim();
        var studentNumber = studentNumberInput.val().trim();
        var campus = campusInput.val();
        var email = emailInput.val().trim();
        var password = passwordInput.val();
        var confirmPassword = confirmPasswordInput.val();
        var interests = interestsInput.val().trim();
        var bio = bioInput.val().trim();

        // Start assuming form is valid
        var isValid = true;

        // Check every field
        if (name === "") {
            showError(nameInput, "nameError",
                "Full name is required");
            isValid = false;
        }

        if (studentNumber === "" ||
            isNaN(studentNumber)) {
            showError(studentNumberInput,
                "studentNumberError",
                "Valid student number is required");
            isValid = false;
        }

        if (campus === "") {
            showError(campusInput, "campusError",
                "Please select your campus");
            isValid = false;
        }

        if (email === "" || !email.includes("@")) {
            showError(emailInput, "emailError",
                "Valid email is required");
            isValid = false;
        }

        if (password === "" || password.length < 8) {
            showError(passwordInput, "passwordError",
                "Password must be at least 8 characters");
            isValid = false;
        }

        if (confirmPassword !== password) {
            showError(confirmPasswordInput,
                "confirmPasswordError",
                "Passwords do not match");
            isValid = false;
        }

        if (interests === "") {
            showError(interestsInput, "interestsError",
                "Please enter at least one interest");
            isValid = false;
        }

        if (bio === "") {
            showError(bioInput, "bioError",
                "Please enter a short bio");
            isValid = false;
        }

        // Only save if everything is valid
        if (isValid) {

            // Create user data object
            var userData = {
                name: name,
                studentNumber: studentNumber,
                campus: campus,
                email: email,
                interests: interests,
                bio: bio
            };

            // Save to localStorage
            localStorage.setItem("richfieldUser",
                JSON.stringify(userData));

            // Send user to profile page
            window.location.href = "profile.html";
        }
    });

}); // END of document ready