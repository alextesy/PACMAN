
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    var shape=new Object();
    var board;
    var score;
    var pac_color;
    var start_time;
    var time_elapsed;    
    var interval;
    var start_angle=0.15 * Math.PI;
    var end_angle=1.85 * Math.PI;
    var eyeX=5;
    var eyeY=-15;
    var currentPlayer;
    var mySound = new sound("resources/music/pacman_beginning.wav");
    var ghost1 = new Object();
    var ghost2 = new Object();
    var ghost3 = new Object();
    var ghost4 = new Object();
    var clockround = 0 ;
    var lost = false;
    var life = 3;

function setupghosts(){

    ghost1.i=0;
    ghost1.j=0;
    ghost2.i=0;
    ghost2.j=9;
    ghost3.i=9;
    ghost3.j=0;
    ghost4.i=9;
    ghost4.j=9;
}

    


function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.loop = true;
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}
function Start() {
    mySound.play();
    setupghosts();

    board = new Array();
    score = 0;
    pac_color="yellow";
    var cnt = 100;
    var food_remain = 50;
    var pacman_remain = 1;
    start_time= new Date();
    for (var i = 0; i < 10; i++) {
        board[i] = new Array();
        //put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
        for (var j = 0; j < 10; j++) {
            if((i==3 && j==3)||(i==3 && j==4)||(i==3 && j==5)||(i==6 && j==1)||(i==6 && j==2))
            {
                board[i][j] = 4;
            }
            else if((i==0 && j==0)||(i==0 && j==9)||(i==9 && j==0)||(i==9 && j==9))
            {
                board[i][j] = 3;
            }
            else{
            var randomNum = Math.random();
            if (randomNum <= 1.0 * food_remain / cnt) {
                food_remain--;
                board[i][j] = 1;
            } else if (randomNum < 1.0 * (pacman_remain + food_remain) / cnt) {
                shape.i=i;
                shape.j=j;
                pacman_remain--;
                board[i][j] = 2;
            } else {
                board[i][j] = 0;
            }
            cnt--;
            }
            }
    }
    while(food_remain>0){
        var emptyCell = findRandomEmptyCell(board,9,0);
        board[emptyCell[0]][emptyCell[1]] = 1;
        food_remain--;
    }
    keysDown = {};
    addEventListener("keydown", function (e) {
        keysDown[e.keyCode] = true;
    }, false);

    addEventListener("keyup", function (e) {
        keysDown[e.keyCode] = false;
    }, false);
    interval=setInterval(UpdatePosition, 125);
}


 function findRandomEmptyCell(board,max,min){
     var i = min+Math.floor((Math.random() * max) + 1);
     var j = min+Math.floor((Math.random() * max) + 1);
    while(board[i][j]!=0)
    {
         i = min+Math.floor((Math.random() * max) + 1);
         j = min+Math.floor((Math.random() * max) + 1);
    }
    return [i,j];             
 }
 
function GetKeyPressed() {
    if (keysDown[38]) {
        end_angle=1.3 * Math.PI;
        start_angle=1.7 * Math.PI;
        eyeX=15;
        eyeY=-10;
        return 1; /*UP*/ 
    }
    if (keysDown[40]) {
        end_angle=0.35 * Math.PI;
        start_angle=0.65*Math.PI 
        eyeX=15;
        eyeY=15;
        return 2;/*DOWN */
    }
    if (keysDown[37]) { 
        start_angle=1.15 * Math.PI;
        end_angle=0.85*Math.PI
        eyeX=-5;
        eyeY=-15;
        return 3;/*LEFT */
    }
    if (keysDown[39]) { 
        start_angle=0.15 * Math.PI;
        end_angle=1.85 * Math.PI;
        eyeX=5;
        eyeY=-15;
        return 4;/*RIGHT */
    }
}

function Draw(position) {
    canvas.width=canvas.width; //clean board
    
    lblScore.value = score;
    lblTime.value = time_elapsed;
    document.getElementById("lblUsername").innerHTML = currentPlayer[1][1]+' '+currentPlayer[1][2];

    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            var center = new Object();
            center.x = i * 60 + 30;
            center.y = j * 60 + 30;
           
            
            if (board[i][j] == 2) {
                context.beginPath();
                
                context.arc(center.x, center.y, 30,start_angle , end_angle); // half circle
                context.lineTo(center.x, center.y);
                context.fillStyle = pac_color; //color 
                context.fill();
                context.beginPath();
                context.arc(center.x + eyeX, center.y +eyeY, 5, 0, 2 * Math.PI); // circle
                context.fillStyle = "black"; //color 
                context.fill();
            } else if (board[i][j] == 1) {
                context.beginPath();
                context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
                context.fillStyle = "black"; //color 
                context.fill();
            }
            else if (board[i][j] == 4) {
                context.beginPath();
                context.rect(center.x-30, center.y-30, 60, 60);
                context.fillStyle = "grey"; //color 
                context.fill();
            }
            else if(board[i][j]==3){
                context.beginPath();
                context.rect(center.x-30, center.y-30,60,60);
                context.fillStyle = "blue"; //color
                context.fill();
            }
        }
    }

   
}
function pacmanDirection(){}

function UpdatePosition() {
    board[shape.i][shape.j]=0;
    var x = GetKeyPressed()
    if(x==1)
    {
        if(shape.j>0 && board[shape.i][shape.j-1]!=4)
        {
            shape.j--;
        }
    }
    if(x==2)
    {
        if(shape.j<9 && board[shape.i][shape.j+1]!=4)
        {
            shape.j++;
        }
    }
    if(x==3)
    {
        if(shape.i>0 && board[shape.i-1][shape.j]!=4)
        {
            shape.i--;
        }
    }
    if(x==4)
    {
        if(shape.i<9 && board[shape.i+1][shape.j]!=4)
        {
            shape.i++;
        }
    }
    if(board[shape.i][shape.j]==1)
    {
        score++;
    }
    board[shape.i][shape.j]=2;
    clockround++;   // ghost move each second
    if(clockround == 3){
        packdist(ghost1,shape.i,shape.j);
        packdist(ghost2,shape.i,shape.j);
        packdist(ghost3,shape.i,shape.j);
        packdist(ghost4,shape.i,shape.j);
        clockround=0;
    }
    var currentTime=new Date();
    time_elapsed=(currentTime-start_time)/1000;
    if(lost){
        window.clearInterval(interval);
        life--;
        if(life>0){
            lost=false;
            Start()
        }
        else
            window.alert("game over!!")
    }
    if(score>=20&&time_elapsed<=10)
    {
        pac_color="green";
    }
    if(score==50)
    {
        mySound.stop();
        window.clearInterval(interval);
        window.alert("Game completed");
    }
    else
    {
        Draw(x);
    }
}

function packdist(ghost,xp,yp){
    xi = ghost.i;
    yi = ghost.j;
    var up = 1000;
    var down = 1000;
    var left = 1000;
    var right = 1000;
    var min = 999;

    if((yi<9 )&& ( board[xi,yi+1]!=4 ) && (board[xi,yi+1]!=3))
        up = Math.pow((Math.pow(xi-xp,2)+Math.pow(yi+1-yp,2)),0.5);
    if((yi>0 )&&( board[xi,yi-1]!=4 )&& (board[xi,yi-1]!=3))
        down = Math.pow((Math.pow(xi-xp,2)+Math.pow(yi-1-yp,2)),0.5);
    if((xi>0) && (board[xi-1,yi]!=4 )&& (board[xi-1,yi]!=3))
        left = Math.pow((Math.pow(xi-xp-1,2)+Math.pow(yi+1-yp,2)),0.5);
    if((xi<9 )&&( board[xi+1,yi]!=4 )&&( board[xi+1,yi]!=3))
        right = Math.pow((Math.pow(xi-xp+1,2)+Math.pow(yi+1-yp,2)),0.5);
    
    var min = Math.min(min,up,down,left,right);    
    if(min == up)
    {
        board[xi][yi] = 0;
        if(board[xi][yi+1] ==2)
            lost = true;
        board[xi][yi+1] = 3;
        ghost.j = yi+1; 
    }
    if(min == down)
    {
        board[xi][yi] = 0;
        if(board[xi][yi-1] ==2)
            lost = true;
        board[xi][yi-1] = 3;
        ghost.j = yi-1;
    }
    if(min == left)
    {
        board[xi][yi] = 0;
        if(board[xi-1][yi] == 2)
            lost = true;
        board[xi-1][yi] = 3;
        ghost.i = xi-1;
    }
    if(min == right)
    {
        board[xi][yi] = 0;
        if(board[xi+1][yi] ==2)
            lost = true;
        board[xi+1][yi] = 3;
        ghost.i = xi+1;
    }

}












var credentials ={};
credentials["a"]=["a","a"];

$(document).ready(function (){
    wellcome();
});

function wellcome() {
    mySound.stop();

    $("#wrapper").children().hide();
    $("#wellcome").show();
}
function login(){
    mySound.stop();

    $("#wrapper").children().hide();
    $("#login").show();

}

function checkUser(){
    var nameValue = document.getElementById("userName").value;
    var passValue=document.getElementById("passWord2").value;
    if(nameValue in credentials){
        if(credentials[nameValue][0]==passValue){
            $("#wrapper").children().hide();
            $("#game").show();
            currentPlayer=[nameValue,credentials[nameValue]]
            Start()
           return;
        }
        else
           alert("Username or Password is not right");
           
    }
    else
    alert("Username or Password is not right");
    
}

function register() {
    mySound.stop();

        $('#wrapper').children().hide();
        $('#registerdiv').show();
        $.validator.addMethod("pwcheck", function(value) {
            return /^[A-Za-z0-9\d=!\-@._*]*$/.test(value) // consists of only these
            && /[a-z]/.test(value) // has a lowercase letter
            && /\d/.test(value) // has a digit
            });
            $(function() {
            // Initialize form validation on the registration form.
            // It has the name attribute "registration"
            $("form[name='registration']").validate({
            // Specify validation rules
            rules: {
            // The key name on the left side is the name attribute
            // of an input field. Validation rules are defined
            // on the right side
            firstname: {
            pattern: "^[a-zA-Z_]*$",
            required: true
            } ,
            lastname:{
            pattern: "^[a-zA-Z_]*$",
            required: true
            },
            email: {
            required: true,
            // Specify that email should be validated
            // by the built-in "email" rule
            email: true
            },
            password: {
            required: true,
            pwcheck: true,
            minlength: 8
            }
            },
            // Specify validation error messages
            messages: {
            firstname:{
            pattern: "please enter letters only",
            required: "Please enter your firstname"
            },
            lastname:{
            pattern: "please enter letters only",
            required: "Please enter your lastname"
            },
            password: {
            required: "Please provide a passwords",
            pwcheck:"Please provide letters and digits",
            minlength: "Your password must be at least 8 characters long"
            },
            email: "Please enter a valid email address"
            },
            // Make sure the form is submitted to the destination defined
            // in the "action" attribute of the form when valid
            submitHandler: function(form) {
            form.submit();
            }
            });
            });
            
            
            
      };

      
        
        function submit(){
            var username = document.getElementById('username').value;
            var password = document.getElementById('password').value;
            var name= document.getElementById('firstname').value;
            var lastname= document.getElementById('lastname').value;
            var email= document.getElementById('email').value;

            if(!(username in credentials)){
            credentials[username]=[password,name,lastname,email];
            var str=JSON.stringify(credentials);
            alert("You have been registered successfuly, please procede to login");
            }
            else
            alert("already exist")
            }

        function modelopen(){
                    // Get the modal
            var modal = document.getElementById('myModal');
            var menu=document.getElementById('menu');
// Get the button that opens the modal
            var btn = document.getElementById("about");

// Get the <span> element that closes the modal
            var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal 
            modal.style.display = "block";
            

// When the user clicks on <span> (x), close the modal
            span.onclick = function() {
                modal.style.display = "none";
            }

            // When the user clicks anywhere outside of the modal, close it
            window.onclick = function(event) {
                if (event.target == modal) {
                    modal.style.display = "none";
                }
        }
        }

        
                
      