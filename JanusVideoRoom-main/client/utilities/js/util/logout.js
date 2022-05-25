function logout(isProfilePage){
    window.sessionStorage.removeItem("auth-token");
    window.sessionStorage.removeItem("userInfo");
    if( isProfilePage) window.location = "index.html";
    else window.location.reload();
}

function navbarToggle(){

    if(window.sessionStorage.getItem("auth-token") == null){
        var notLoggedUserMenu = document.querySelector('#notLoggedUser');
        var cloneMenu = document.importNode(notLoggedUserMenu.content, true); 
        $("#navcol-1").append(cloneMenu);
    } else {
        var loggedUserMenu = document.querySelector('#loggedUser');
        var cloneMenu = document.importNode(loggedUserMenu.content, true); 
        $("#navcol-1").append(cloneMenu);
    }
}