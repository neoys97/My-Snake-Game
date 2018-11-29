$(document).ready(function(){
    var canvas = $("#canvas")[0];
	var cw = 10; //dimension of each "snake-cell" and food

	if ("ontouchstart" in document.documentElement) { //return true if the device is touch-enabled
		canvas.width = 675;
        canvas.height = 675;
        cw = 15;
    } else {
        $(".arrows_container").hide() //hide the arrows if the deveice is not touch-screen
	}
	
    var ctx = canvas.getContext("2d");
	var w = $("#canvas").width();
	var h = $("#canvas").height();
	
	var d; //to store direction of snake
	var food; //to store food coordinate
	var score; 
	
    var snake_array; //an array of cells to make up the snake
    
    function init()
    {
		d = "right"; //default direction
		create_snake(); //create an initial snake with length 5
		create_food(); //randomly generate food coordinate
		//initialise score = 0
		score = 0;
		
		//The movement of the snake is created by painting each frame
		//every 60ms repeatedly
		if(typeof game_loop != "undefined") clearInterval(game_loop);
		game_loop = setInterval(paint, 60);
    }

    function create_snake()
	{
		var length = 5; //Length of the snake
		snake_array = []; //Empty array to start with
		for(var i = length-1; i>=0; i--)
		{
			//This creates a horizontal snake starting from the top left, coordinate (0,0)
			snake_array.push({x: i, y:0});
		}
	}
	
	function create_food()
	{
		food = {
            //randomly generate x-coordinate of the food
            x: Math.round(Math.random()*(w-cw)/cw), 
            //randomly generate y-coordinate of the food
			y: Math.round(Math.random()*(h-cw)/cw), 
		};
    }
    
    function paint()
	{
        //painting the background with white colour
		ctx.fillStyle = "white";
        ctx.fillRect(0, 0, w, h);
        //outlining the border of the canvas with black color
		ctx.strokeStyle = "black";
        ctx.strokeRect(0, 0, w, h);

        //We move the snake by removing the last most cell 
        //and insert it to the front of the head cell

        //we first find the coordinate of the head cell
		var nx = snake_array[0].x;
		var ny = snake_array[0].y;
		//then we determine the coordinate of the next cell
		//by reading the direction input by the player
		if(d == "right") nx++; //next cell coordinate = (nx+1, ny)
		else if(d == "left") nx--; //next cell coordinate = (nx-1, ny)
		else if(d == "up") ny--; //next cell coordinate = (nx, ny-1)
        else if(d == "down") ny++; //next cell coordinate = (nx, ny+1)

        //when snake collides with the boundaries or itself, the game is over
        if(nx == -1 || nx == w/cw || ny == -1 || ny == h/cw || check_collision(nx, ny, snake_array))
		{
			//restart game
			init();
			return;
		}
        
        //when the snake collides (eats) the food, instead of moving the last cell to
        //front most, we add a new cell to the front most instead
		if(nx == food.x && ny == food.y)
		{
			var tail = {x: nx, y: ny};
			score++;
			//Create new food
			create_food();
        }
        //otherwise, move the snake as suggested previously
		else
		{
			var tail = snake_array.pop(); //pops out the last cell
			tail.x = nx; tail.y = ny;
		}
		snake_array.unshift(tail); //insert the cell to the front most of the snake
        
        //painting the whole snake cell by cell
		for(var i = 0; i < snake_array.length; i++)
		{
			var c = snake_array[i];
			paint_cell(c.x, c.y);
        }
        
        //paint the food
		paint_cell(food.x, food.y);
		//paint the score
		var score_text = "Score: " + score;
		ctx.fillText(score_text, 5, h-5);
    }
    
    //general function to paint a cell of dimension cw*cw given the coordinate
	function paint_cell(x, y)
	{
		ctx.fillStyle = "blue";
		ctx.fillRect(x*cw, y*cw, cw, cw);
		ctx.strokeStyle = "white";
		ctx.strokeRect(x*cw, y*cw, cw, cw);
	}
	//function to check collision between the snake and itself
	function check_collision(x, y, array)
	{
		//this function will check if the provided x or y-coordinates exist
		//in an array of cells or not
		for(var i = 0; i < array.length; i++)
		{
			if(array[i].x == x && array[i].y == y)
			 return true;
		}
		return false;
    }

    //keyboard control
	$(document).keydown(function(e){
		var key = e.which;
		//We will add another condition to prevent reverse gear
		if(key == "37" && d != "right") d = "left";
		else if(key == "38" && d != "down") d = "up";
		else if(key == "39" && d != "left") d = "right";
		else if(key == "40" && d != "up") d = "down";
	})
	
	$("#up").on("tap", function(){
        if (d != "down") d = "up";
    })

    $("#down").on("tap", function(){
        if (d != "up") d = "down";
    })

    $("#left").on("tap", function(){
        if (d != "right") d = "left";
    })

    $("#right").on("tap", function(){
        if (d != "left") d = "right";
	})
	
    init();
});