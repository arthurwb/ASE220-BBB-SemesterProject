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
        sendTo = `document.location.href = '${location}'`;
    }
    $("body").append(`
    <div class="fixed-top fixed-bottom d-flex justify-content-center align-items-center" style="background-color: rgba(0, 0, 0, 0.8);">
        <div class="d-flex justify-content-center align-items-center rounded" style="background:#fd9f57; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);">
            <div class="text-center p-2 col text-center">
                ${text}
                <button class="alertButtonClass btn btn-primary d-block mx-5" style="color: black; padding: 0em 1em 0em 1em" type="button" onclick="${sendTo}">Close</button>
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

function signEvent(){
    const element = $('.signStatus').text();
    if (element.includes('Sign Out')) {
        deleteCookies();
        // alertUser("User logged out");
        document.location.reload();
    }
    if (element.includes('Sign In')) {
        document.location.href = 'user'
    }
}

//Function for clearing cookies
function deleteCookies() {
    var allCookies = document.cookie.split(';');
    
    // The "expire" attribute of every cookie is 
    // Set to "Thu, 01 Jan 1970 00:00:00 GMT"
    for (var i = 0; i < allCookies.length; i++)
        document.cookie = allCookies[i] + "=;expires="
        + new Date(0).toUTCString();
}
//check if a user is signed in
function checkSignedIn() {
    if (document.cookie.split("=")[1]) {
        api.GET_USER(document.cookie.split("=")[1], function(response) {
            axios.get(`${api.endpoint}getuserid/Users/${response.username}`,{}).then(function(res){
                $(".profileIMG").attr("src", `images/${res.data[0].profileImg}`);
                $(".profileIMG").attr("onclick", `location.href='profile?id=${res.data[0]._id}'`)
                $(".profileUsername").text(response.username)
            })
        })
    }
}

//Go to Own Profile Function
function goToSelfProfile(){
    let selfID
    let cookie = document.cookie.split("=")[1]
    if(cookie){
        api.GET_USER(cookie, function(response) {
            selfID = response._id;
            document.location.href = `profile?id=${selfID}`;
        });
    }
    else{
        window.location.href = 'user';
    }

}

function goHome(){
    document.location.href = '/'
}

function goTermsConditions(){
    document.location.href = '/Terms&Conditions';
}
function goAboutUs(){
    document.location.href = '/aboutUs';
}