
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    var shape=new Object();
    var movcandy = new Object();
    movcandy.last = 0;
    var board = 
    [[0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,4,4,0,0,0,0,4,4,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0],
    [0,4,0,0,0,0,0,0,0,0,4,0],
    [0,4,0,0,0,4,0,0,0,0,4,0],
    [0,0,0,0,0,4,0,0,0,0,0,0],
    [0,0,0,0,0,4,0,0,0,0,0,0],
    [0,4,0,0,0,4,0,0,0,0,4,0],
    [0,4,0,0,0,0,0,0,0,0,4,0],
    [0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,4,4,0,0,0,0,4,4,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0]];
    var board_size = board.length;
    var candy = true;
    var score;
    var pac_color;
    var start_time;
    var time_elapsed;    
    var interval;
    
    var start_angle=0.15 * Math.PI;
    var end_angle=1.85 * Math.PI;
    var eyeX=5;
    var eyeY=-15;
//setup game: 
    var foodnum = 90;
    var gametime = 60;
    var ghostnum =3;
    var ghostarr;
    var color1;
    var color2;
    var color3;
    var distance;
    var speed =3;

    setupgame(3,90,60,"black","yellow","green","Easy");
    var currentPlayer;
    var mySound = new sound("resources/music/pacman_beginning.wav");
    var clockround;
    var lost = false;
    var life = 3;

function setupgame(ghostnum,foodnum,time,color1,color2,color3,difficulty){

    this.ghostnum =ghostnum;
    this.foodnum = foodnum;
    ghostarr = new Array;
    this.color1 = color1;
    this.color2 = color2;
    this.color3 = color3;

    if(difficulty=='Easy'){
        distance =3;
        speed = 4;
    }
    if(difficulty=='Medium'){
        distance =5;
        speed = 3;
    }
    if(difficulty=='Hard'){
        distance =8;
        speed = 2;
    }
}


function setupghosts(){

    //
    ghostarr[0] = new Object();
    ghostarr[0].i =0;
    ghostarr[0].j=0;
    ghostarr[0].last = 0;
    board[0][0]=3;
    //
    if(ghostnum>=2){
        ghostarr[1] = new Object();
        ghostarr[1].i=0;
        ghostarr[1].j=board_size-1;
        ghostarr[1].last = 0;
        board[0][board_size-1]=3;
    }
    //
    if(ghostnum == 3){
        ghostarr[2] = new Object();
        ghostarr[2].i=board_size-1;
        ghostarr[2].j=board_size-1;
        ghostarr[2].last = 0;
        board[board_size-1][board_size-1] = 3;
    }
    //

}

function Pacstartplace(){
    var xi = shape.i;
    var yi = shape.j;
    board[xi][yi] == 0;
    var cell = findRandomEmptyCell(board,board_size-3,2);
    var nxi = cell[0]; 
    var nyi = cell[1];
    shape.i=nxi;
    shape.j=nyi;
    board[nxi][nyi] = 2;
    
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
    $("#wrapper").children().hide();
    $("#game").show();
    funcLife();
    mySound.play();
    mySound.stop();
    setupghosts();
    clockround = 0;
    
    var food_remain = foodnum;
    score = 0;
    pac_color="yellow";
    var cnt = 100;
    var pacman_remain = 1;
    var candy_remain = 1;
    var drug_remain = 2;
    start_time= new Date();
    for (var i = 0; i < board_size; i++) {
        //board[i] = new Array();
        //put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
        for (var j = 0; j < board_size; j++) {
            //if((i==3 && j==3)||(i==3 && j==4)||(i==3 && j==5)||(i==6 && j==1)||(i==6 && j==2))
            if(board[i][j]==4)
            {
               //  do nothing;
            } 
            else if((i==0 && j==0)||(i==0 && j==board_size-1)||(i==board_size-1 && j==0)||(i==board_size-1 && j==board_size-1))
            {
                //  do nothing;
            }
            else if(board[i][j] !=4 && board[i][j] !=4 ) {
            var randomNum = Math.random();
            if (randomNum <= 1.0 * food_remain / cnt) {
                food_remain--;
                if(Math.random()<=0.3)
                    board[i][j] = 6;
                else if(Math.random()>=0.3 && Math.random()<=0.9)
                    board[i][j] = 1;
                else        
                    board[i][j] = 7;
            } else if (randomNum < 1.0 * (pacman_remain + food_remain) / cnt) {
                shape.i=i;
                shape.j=j;
                pacman_remain--;
                board[i][j] = 2;
            } else if (randomNum < 1.0 * (candy_remain+food_remain)/cnt) {
                movcandy.i=i;
                movcandy.j=j;
                candy_remain--;
                board[i][j] = 5; 
            }
            else if (randomNum < 1.0 * (drug_remain+food_remain)/cnt) {
                drug_remain--;
                board[i][j] = 8; 
            }
            else {
                board[i][j] = 0;
            }
            cnt--;
            }
            
            }
    }
    while(food_remain>0){
        var emptyCell = findRandomEmptyCell(board,board_size-1,0);
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
    interval=setInterval(UpdatePosition,125);
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

    for (var i = 0; i < board_size; i++) {
        for (var j = 0; j < board_size; j++) {
            var center = new Object();
            center.x = i * 60 + 30;
            center.y = j * 60 + 30;
           
            
            if (board[i][j] == 2) {
                context.beginPath();
                
                context.arc(center.x, center.y, 20,start_angle , end_angle); // half circle
                context.lineTo(center.x, center.y);
                context.fillStyle = pac_color; //color 
                context.fill();
                context.beginPath();
                context.arc(center.x + eyeX, center.y +eyeY, 5, 0, 2 * Math.PI); // circle
                context.fillStyle = "black"; //color 
                context.fill();
            } else if (board[i][j] == 1) {
                context.beginPath();
                context.arc(center.x, center.y, 12, 0, 2 * Math.PI); // circle
                context.fillStyle = color1; //color 
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
                context.rect(center.x-30, center.y-30,40,40);
                context.fillStyle = "blue"; //color
                context.fill();
            }
            else if(board[i][j]==5){
                context.beginPath();
                context.rect(center.x-30, center.y-30,40,40);
                context.fillStyle = "red"; //color
                context.fill();
            }
            else if(board[i][j]==6){
                context.beginPath();
                context.arc(center.x, center.y, 12, 0, 2 * Math.PI); // circle
                context.fillStyle = color2; //color 
                context.fill();
            }
            else if(board[i][j]==7){
                context.beginPath();
                context.arc(center.x, center.y, 12, 0, 2 * Math.PI); // circle
                context.fillStyle = color3; //color 
                context.fill();
            }
            else if(board[i][j]==8){

                var base_image = new Image();
                base_image.src = "resources/img/pill.png";
                context.drawImage(base_image,center.x, center.y,30,30);
                  
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
        if(shape.j>0 && board[shape.i][shape.j-1]!=4 && board[shape.i][shape.j-1]!=3)
        {
            shape.j--;
        }
    }
    if(x==2)
    {
        if(shape.j<board_size-1 &&  board[shape.i][shape.j+1]!=4 && board[shape.i][shape.j-1]!=3)
        {
            shape.j++;
        }
    }
    if(x==3)
    {
        if(shape.i>0 && board[shape.i-1][shape.j]!=4 && board[shape.i][shape.j-1]!=3)
        {
            shape.i--;
        }
    }
    if(x==4)
    {
        if(shape.i<board_size-1 && board[shape.i+1][shape.j]!=4 && board[shape.i][shape.j-1]!=3)
        {
            shape.i++;
        }
    }
    if(board[shape.i][shape.j]==1)
    {
        score++;
    }
    if(board[shape.i][shape.j]==1)
    {
        score++;
    }
    if(board[shape.i][shape.j]==1)
    {
        score = score+5;
    }
    if(board[shape.i][shape.j]==6)
    {
        score = score +15;
    }
    if(board[shape.i][shape.j]==7)
    {
        score = score +25;
    }
    if(board[shape.i][shape.j]==5)
    {   
        candy = false;
        score = score +50;
    }
    if(board[shape.i][shape.j]==8)
    {   
        life++;
        funcLife();
    }

    board[shape.i][shape.j]=2;
    clockround++;   // ghost move each second
    if(clockround == speed){
        for(var i = 0 ; i<ghostarr.length;i++ ){
        packdist(ghostarr[i],shape.i,shape.j);
        }
        if(candy)
            move_candy(movcandy);
        clockround=0;
    }
    var currentTime=new Date();
    time_elapsed=(currentTime-start_time)/1000;
    if(lost){
       
        life--;
        funcLife();
        if(life>0){
            lost=false;
            for(var i = 0 ;i<ghostarr.length;i++){
                board[ghostarr[i].i][ghostarr[i].j]=0;
            }
            Pacstartplace();
            setupghosts();
        
        }
        else{
            window.clearInterval(interval);
            window.alert("You Lost!!");
        }
    }
    if(score>=400&&time_elapsed<=10)
    {
        pac_color="green";
    }
    if(time_elapsed>gametime){
        window.clearInterval(interval);
        window.alert("You can do better!!");

    }
    if(score>=(foodnum*0.6*5+foodnum*0.3*15+foodnum*0.1*25)*1.3)
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


function move_candy(movcandy){
    xi = movcandy.i;
    yi = movcandy.j;
    var array = [];
    
    if((yi<board_size-1 )&&( board[xi][yi+1]!= 4 ) && (board[xi][yi+1]!= 3)&& (board[xi][yi+1]!= 2)){
        array.push('down');
    }
    if((yi>0 )&&( board[xi][yi-1]!= 4 )&& (board[xi][yi-1]!= 3)&& (board[xi][yi-1]!= 2)){
        array.push('up');
    }
    if((xi>0) && (board[xi-1][yi]!= 4 )&& (board[xi-1][yi]!= 3)&& (board[xi-1][yi]!= 2)){
        array.push('left');
    }
    if((xi<board_size-1 )&&( board[xi+1][yi]!= 4 )&&( board[xi+1][yi]!= 3)&& (board[xi+1][yi]!= 2)){
        array.push('right');
    }

    
    var move = array[Math.floor(Math.random()*array.length)];

    if(move == 'down')
    {
            board[xi][yi] = movcandy.last; 
            if((board[xi][yi+1]!=3 )&& (board[xi][yi+1]!=4))
                movcandy.last = board[xi][yi+1];
            board[xi][yi+1] = 5;
            movcandy.j = yi+1; 
    }
    else if(move == 'up')
    {
            board[xi][yi] = movcandy.last; 
            if((board[xi][yi-1]!=3) &&(board[xi][yi-1]!=4))    
                movcandy.last = board[xi][yi-1];
            board[xi][yi-1] = 5;
            movcandy.j = yi-1;
    }
    else if(move == 'left')
    {
            board[xi][yi] = movcandy.last; 
            if((board[xi-1][yi] !=3)&&(board[xi-1][yi]!=4))
                movcandy.last = board[xi-1][yi];
            board[xi-1][yi] = 5;
            movcandy.i = xi-1;
    }
    else if(move == 'right')
    {
            board[xi][yi] = movcandy.last; ;
            if((board[xi+1][yi]!=3 )&& (board[xi+1][yi]!=4))            
                movcandy.last = board[xi+1][yi];
            board[xi+1][yi] = 5;
            movcandy.i = xi+1;
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
    var array = [];
    
    if((yi<board_size-1)&&( board[xi][yi+1]!=4 ) && (board[xi][yi+1]!=3)&& (board[xi][yi+1]!=5)){
        down = Math.pow((Math.pow(xi-xp,2)+Math.pow(yi+1-yp,2)),0.5);
        array.push(down);
    }
    if((yi>0 )&&( board[xi][yi-1]!=4 )&& (board[xi][yi-1]!=3)&& (board[xi][yi-1]!=5)){
        up = Math.pow((Math.pow(xi-xp,2)+Math.pow(yi-1-yp,2)),0.5);
        array.push(up);
    }
    if((xi>0) && (board[xi-1][yi]!=4 )&& (board[xi-1][yi]!=3) && (board[xi-1][yi]!=5)){
        left = Math.pow((Math.pow(xi-xp-1,2)+Math.pow(yi-yp,2)),0.5);
        array.push(left);
    }
    if((xi<board_size-1)&&( board[xi+1][yi]!=4 )&&( board[xi+1][yi]!=3) && (board[xi+1][yi]!=5)){
        right = Math.pow((Math.pow(xi-xp+1,2)+Math.pow(yi-yp,2)),0.5);
        array.push(right);
    }
    
    var min = Math.min(min,up,down,left,right);
    //pop randon leagail move
    if(min >=distance){

        min = array[Math.floor(Math.random()*array.length)];
    }
  
    
    if(min == down)
    {
            board[xi][yi] = ghost.last; 
            if(board[xi][yi+1] ==2 )
                lost = true;
            if((board[xi][yi+1]!=3 )&& (board[xi][yi+1]!=4))
                ghost.last = board[xi][yi+1];
            board[xi][yi+1] = 3;
            ghost.j = yi+1; 
    }
    else if(min == up)
    {
            board[xi][yi] = ghost.last;
            if(board[xi][yi-1] == 2)
                lost= true;
            if((board[xi][yi-1]!=3) &&(board[xi][yi-1]!=4))    
                ghost.last = board[xi][yi-1];
            board[xi][yi-1] = 3;
            ghost.j = yi-1;
    }
    else if(min == left)
    {
            board[xi][yi] = ghost.last;
            if(board[xi-1][yi]==2)
                lost = true;
            if((board[xi-1][yi] !=3)&&(board[xi-1][yi]!=4))
                ghost.last = board[xi-1][yi];
            board[xi-1][yi] = 3;
            ghost.i = xi-1;
    }
    else if(min == right)
    {
            board[xi][yi] = ghost.last;
            if(board[xi+1][yi]==2)
                lost = true;
            if((board[xi+1][yi]!=3 )&& (board[xi+1][yi]!=4))            
                ghost.last = board[xi+1][yi];
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
    window.clearInterval(interval);
    $("#wrapper").children().hide();
    $("#wellcome").show();
}
function login(){
    mySound.stop();
    window.clearInterval(interval);
    $("#wrapper").children().hide();
    $("#login").show();

}

function checkUser(){
    var nameValue = document.getElementById("userName").value;
    var passValue=document.getElementById("passWord2").value;
    if(nameValue in credentials){
        if(credentials[nameValue][0]==passValue){
            loginSuccess();

            currentPlayer=[nameValue,credentials[nameValue]]
           return;
        }
        else
           alert("Username or Password is not right");
           
    }
    else
    alert("Username or Password is not right");
    
}
function loginSuccess(){
    var login=document.getElementById('login');
    var buttonGame = document.createElement('button');
    var buttonSetup = document.createElement('button');
    buttonGame.className="btn  primary ";
    buttonSetup.className="btn tertiary";
    buttonGame.textContent='Default Start';
    buttonGame.id='buttonGame';
    buttonSetup.textContent='Setup';
    buttonSetup.id='buttonSetup';
    buttonGame.setAttribute
    login.appendChild(buttonGame);
    login.appendChild(buttonSetup);
    buttonGame.onclick = function() {
        Start();
      };
    buttonSetup.onclick = function() {
        var login=document.getElementById('login');
            
        var form = document.createElement('form');
        form.id='setupForm';
        form.setAttribute('action', 'javascript:Setup()');
        

        var input1 = document.createElement('select');
        input1.setAttribute('id','numOfBalls');
        for(var i=50;i<=90;i++){
            var option1=document.createElement('option')
            option1.setAttribute('value',i);
            option1.text=i;
            input1.appendChild(option1);
        }
       
        /*input1.setAttribute('type', 'text');
        input1.setAttribute('placeholder', 'Name');
        input1.setAttribute('name', 'routename');
        input1.setAttribute('id', 'numofBalls');*/


        var Color1 = document.createElement('input');
        Color1.setAttribute('type', 'color');
        Color1.setAttribute('name', 'routedescription');
        Color1.setAttribute('id', 'Color1');

        var Color2 = document.createElement('input');
        Color2.setAttribute('type', 'color');
        Color2.setAttribute('name', 'routetags');
        Color2.setAttribute('id', 'Color2');

        var Color3 = document.createElement('input');
        Color3.setAttribute('type', 'color');
        Color3.setAttribute('name', 'routetags');
        Color3.setAttribute('id', 'Color3');

        var input2 = document.createElement('input');
        input2.setAttribute('type', 'text');
        input2.setAttribute('name', 'routename');
        input2.setAttribute('id', 'gameTime');

        var input3 = document.createElement('select');
        input3.setAttribute('id','numOfmonsters');
        for(var i=1;i<=3;i++){
            var option1=document.createElement('option')
            option1.setAttribute('value',i);
            option1.text=i;
            input3.appendChild(option1);
        }

        var startButton=document.createElement('button');
        startButton.setAttribute('id','startButton');
        startButton.className="btn tertiary";
        startButton.textContent='Start Game';
        startButton.onclick=function(){
            if(input2.value<60){
                alert('The minimum time for the game is 60 seconds');
            }
            setupgame(input3.value,input1.value,input2.value,Color1.value,Color2.value,Color3.value)//ghosts,food,time,color1-3
            Start();
        };

        form.appendChild(document.createTextNode('Choose the number of Balls'));
        form.appendChild(input1);
        form.appendChild(document.createElement('br'))
        form.appendChild(document.createTextNode('Choose the Color of The least significate ball'));
        form.appendChild(Color1);
        form.appendChild(document.createElement('br'))
        form.appendChild(document.createTextNode('Choose the Color of The average Ball'));
        form.appendChild(Color2);
        form.appendChild(document.createElement('br'))
        form.appendChild(document.createTextNode('Choose the Color of The most significate Ball'));
        form.appendChild(Color3);     
        form.appendChild(document.createElement('br'))
        form.appendChild(document.createTextNode('Choose Game Time'));
        form.appendChild(input2);     
        form.appendChild(document.createElement('br'))
        form.appendChild(document.createTextNode('Choose Number of Monsters'));
        form.appendChild(input3); 
        form.appendChild(document.createElement('br'))
        form.appendChild(startButton); 

        
        login.appendChild(form);
    };
}
function register() {
    mySound.stop();
    window.clearInterval(interval);
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
            },
            username:{
            required:true    
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

        function funcLife(){
            $('#life').empty();
            for(var i=0;i<life;i++){
                var DOM_img = document.createElement('img');
                DOM_img.src = "resources/img/life.png";
                document.getElementById("life").appendChild(DOM_img);
            }
        
        }
                
      