// user api
const documentID = '1083854980754194432';

function showCreateUserForm() {
    $("#userForm").addClass("d-block").removeClass("d-none");
    $("#create-user-button").addClass("d-none").removeClass("d-block");
    $("#login-button").addClass("d-none").removeClass("d-block");
}

function showLoginForm() {
    $("#loginForm").addClass("d-block").removeClass("d-none");
    $("#create-user-button").addClass("d-none").removeClass("d-block");
    $("#login-button").addClass("d-none").removeClass("d-block");
}

function cancelForm() {
    $("#loginForm").addClass("d-none").removeClass("d-block");
    $("#userForm").addClass("d-none").removeClass("d-block");
    $("#create-user-button").addClass("d-block").removeClass("d-none");
    $("#login-button").addClass("d-block").removeClass("d-none");
}

function validation(username, password, email) {
    let response;

    if (username == "") {
        response = false;
    } else if (password == null) {
        response = false;
    } else if (email == "") {
        response = false;
    } else {
        response = true;
    }

    return response;
}

function createNewUser() {
    // Get the form input values
    const username = $("#username").val();
    const password = $("#password").val() || null;
    const email = $("#email").val() || null;
    const firstName = $("#firstName").val() || null;
    const bio = $("#bio").val() || null;
    let isValid = validation(username, password, email);

    if (isValid) {
        // Get the current data from the JSON blob
        api.GET(documentID, function(response) {
            // Generate a random 6 digit number that is not already in use
            let id = Math.floor(Math.random() * 900000) + 100000;
            while (response.data.some(post => post.id === id)) {
            id = Math.floor(Math.random() * 900000) + 100000;
            }

            // Create a data object with the form input values and assigned ID
            const newData = {
            username,
            email,
            password,
            bio,
            firstName,
            id
            };

            // Send an UPDATE request
            api.UPDATE(documentID, newData);
        });
    } else {
        alert("Input not valid");
    }
}

function login() {
    const loginUsername = $("#loginUsername").val();
    const loginPassword = $("#loginPassword").val();

    api.GET(documentID, function(response) {
        for (let i = 0; i < response.data.length; i++) {
            const element = response.data[i];
            
            if (loginUsername == element.username && loginPassword == element.password) {
                $("#loginDetails").html(`
                    <div class="col-10 offset-1">
                        <h1 class="text-center">${element.username}</h1>
                        <h3>Email</h3>
                        <p class="offset-1">${element.email}</p>
                        <h3>First Name</h3>
                        <p class="offset-1">${element.firstName}</p>
                        <h3>Biography</h3>
                        <p class="offset-1">${element.bio}</p>
                    </div>
                `);
            }
        }
    });
}

function submitForm(isNewUser) {
    if (isNewUser == "new") {
        createNewUser();
    } else if (isNewUser == "old") {
        login();
    }
    $("#loginForm").addClass("d-none").removeClass("d-block");
    $("#userForm").addClass("d-none").removeClass("d-block");
    $("#create-user-button").addClass("d-block").removeClass("d-none");
    $("#login-button").addClass("d-block").removeClass("d-none");
}