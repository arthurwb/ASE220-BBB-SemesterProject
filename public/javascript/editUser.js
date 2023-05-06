// user api
const documentID = 'Users';

function showCreateUserForm() {
    if (document.getElementById("loginErrorCode").style.visibility = 'visible'){
        document.getElementById("loginErrorCode").style.visibility = 'hidden';
    }
    $("#userForm").addClass("d-block").removeClass("d-none");
    $("#create-user-button").addClass("d-none").removeClass("d-block");
    $("#login-button").addClass("d-none").removeClass("d-block");
    $("#creationAlert").addClass("d-none").removeClass("d-block");
}

function showLoginForm() {
    if (document.getElementById("createAccoundErrorCode").style.visibility = 'visible'){
        document.getElementById("createAccoundErrorCode").style.visibility = 'hidden';
    }
    $("#loginForm").addClass("d-block").removeClass("d-none");
    $("#create-user-button").addClass("d-none").removeClass("d-block");
    $("#login-button").addClass("d-none").removeClass("d-block");
    $("#creationAlert").addClass("d-none").removeClass("d-block");
}

function cancelForm() {
    $("#loginForm").addClass("d-none").removeClass("d-block");
    $("#userForm").addClass("d-none").removeClass("d-block");
    $("#create-user-button").addClass("d-block").removeClass("d-none");
    $("#login-button").addClass("d-block").removeClass("d-none");
}

function alertUser(text, location) {
    let sendTo = ""
    if (!location) {
        sendTo = "document.location.reload();";
    } else {
        sendTo = `document.location.href = "${location}"`;
    }
    $("body").append(`
    <div class="fixed-top fixed-bottom d-flex justify-content-center align-items-center" style="background-color: rgba(0, 0, 0, 0.8);">
        <div class="d-flex justify-content-center align-items-center bg-warning rounded" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);">
            <div class="text-center p-2">
                ${text}
                <button class="btn btn-primary d-block" type="button" onclick="${sendTo}">Close</button>
            </div>
        </div>
    </div>
    `)
}

function validation(username, password, email) {
    let response;

    if (username == null) {
        response = false;
    } else if (password == null) {
        response = false;
    } else if (email == null) {
        response = false;
    } else {
        response = true;
    }

    return response;
}

function verification(flag) {
    // flag: true = success; false = fail
    const userCreationSuccess = `
    <div class="bg-success text-white p-2 m-1 text-center rounded">
        User Created!
    </div>
    `;
    const userCreationError = `
    <div class="bg-danger text-white p-2 m-1 text-center rounded">
            Invalid Input
    </div>
    `;

    if (flag) {
        $("#creationAlert").addClass("d-block").removeClass("d-none");
        $("#creationAlert").html(userCreationSuccess);
    } else {
        $("#creationAlert").addClass("d-block").removeClass("d-none");
        $("#creationAlert").html(userCreationError);
    }
}

function createNewUser() {
    
    // Get the form input values
    const username = $("#username").val() || null;
    const password = $("#password").val() || null;
    const email = $("#email").val() || null;
    const firstName = $("#firstName").val() || null;
    const bio = $("#bio").val() || null;
    const profileImg = "profile_img_8.png";
    let flag = false;
    if (validation(username, password, email)) {
        flag = true
        axios({
            method: 'post',
            url: '/api/data/auth/signup',
            data: {
                username:username,
                password:password,
                email:email,
                firstName:firstName,
                bio:bio,
                profileImg:profileImg
            },
                validateStatus:()=>true
        })
            .then(function (response) {
            console.log(response);
            document.location.href = document.location.origin;
            })
            .catch(function (error) {
            if (document.getElementById("loginErrorCode").style.visibility = 'visible'){
                document.getElementById("loginErrorCode").style.visibility = 'hidden';
                document.getElementById("createAccoundErrorCode").style.visibility = 'visible';
            }
            else{
                document.getElementById("createAccoundErrorCode").style.visibility = 'visible';
            }
            console.log(error);
            });
    } else {
        flag = false;
    }
    verification(flag);
}

async function deleteUser(index) {
    await database.delete(documentID, index);
    document.location.reload();
    alert("user has been deleted");
}

function login() {
    const username = $("#loginUsername").val() || null;
    const password = $("#loginPassword").val() || null;

    axios({
        method: 'post',
        url: '/api/data/auth/signin',
        config:{
        headers: {
            'Authorization': 'Bearer ' + ''
        }
        },
        data: {
            username:username,
            password:password
        },
            validateStatus:()=>true
    })
        .then(function (response){
        cookies.set('jwt',response.headers.authorization.replace('Bearer ',''))
        console.log(response.headers.authorization.replace('Bearer ',''));
        document.location.href = document.location.origin;
        })
        .catch(function (error) {
            if (document.getElementById("createAccoundErrorCode").style.visibility = 'visible'){
                document.getElementById("createAccoundErrorCode").style.visibility = 'hidden';
                document.getElementById("loginErrorCode").style.visibility = 'visible';
            }
            else{
                document.getElementById("loginErrorCode").style.visibility = 'visible';
            }
        console.log(error);
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
