setInterval(function(){
    $("h1").css("color", "#" + Math.floor(Math.random()*16777215).toString(16));
},1000);