const id = getAllUrlParams().id;
//console.log(id);

api.GET_ITEM("Users", id, function(res) {
    $("#username").text(res.username);
    $("#bio").text(res.bio);
})