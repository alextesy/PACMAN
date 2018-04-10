var userList=['alex'];
var passList=['12345'];

$(document).ready(function() {
    $("#wrapper").children().hide();
    $("#wellcome").show();
    
});

function login(){
    $("#wrapper").children().hide();
    $("#login").show();
}

function checkUser(){
    var nameValue = document.getElementById("userName").value;
    var passValue=document.getElementById("passWord").value;
    for(var i=0;i<userList.length;i++){
        if(userList[i]==nameValue){
            if(passList[i]==passValue){
                $("#wrapper").children().hide();
                Start()
                return;
            }
            else
                break;
        }
    }
    alert("Username not right")
}