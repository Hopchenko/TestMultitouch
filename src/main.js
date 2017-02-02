new Clipboard('.btn');

//declare global variables
var pageWidth = 0,
	pageHeight = 0,
	screenHeight = 0,
	screenWidth = 0,
	canvas = null,
	app = null,
	fps = 0,
	basicText = '',
	touches = [],
	screenFps = 0,
	lastLoop = null,
	thisLoop = null,
	color = '',
	i = 0,
	touchesCount = 0,
	screenTouchesCount,
	graphics = new PIXI.Graphics(),
	clipboardBar = null,
	currentDate,
	logData,
	statistic,
	data = [];


(function initializeApp() {
	pageWidth = window.innerWidth;
	pageHeight = window.innerHeight;
	screenHeight = screen.height;
	screenWidth = screen.width;
	app = new PIXI.Application(pageWidth, pageHeight, {backgroundColor: 0x1099bb, antialias: true});
	document.body.appendChild(app.view);
	app.stage.interactive = true;
	canvas = document.querySelector('canvas');
	clipboardBar = document.querySelector('#bar');

	setInterval(function () {
		setData(fps,touchesCount);
	},250);
	var int = setInterval(function () {
		setDataToBar();
	},1000);
	//We use comfortable interval for display FPS
	setInterval(renderScreenFps, 250);
	gameLoop();


//Implementation of touches visualization
	document.querySelector('#stop').addEventListener('touchstart',function () {
		clearInterval(int)
	});
	canvas.addEventListener('touchmove', function (event) {
		touches = event.touches;
		event.preventDefault();
	});
	canvas.addEventListener('touchend', function () {
		touches = [];
		color = getRandomHexColor();
	});
}());

function setDataToBar() {
	statistic = '';
	for (var i = 0; i < data.length; i++) {
		statistic += data[i] + '\n';
	}
	clipboardBar.innerText = statistic;
}

function setData(fps, touches) {
	currentDate = (new Date).toTimeString();
	currentDate = currentDate.slice(0,8);
	logData = currentDate + '; FPS: ' + fps + '; Touches: ' + touches;
	if (data.length < 400) {
		data.push(logData);
	} else {
		data.shift();
		data.push(logData);
	}
	
	console.log(data);
}


//add "show full screen" text to page
basicText = new PIXI.Text('Tap to set full screen.');
basicText.anchor.set(0.5, 0.5);
basicText.style = {
	fontSize: 60,
	fill: '#fff'
};
basicText.x = pageWidth / 2;
basicText.y = pageHeight / 2;
app.stage.addChild(basicText);

//show fps on page


//set up full screen app;
canvas.addEventListener('touchstart', function setFullScreen(event) {
	app.stage.removeChild(basicText);
	// code below works with desktop browsers
	// app.renderer.resize(screenWidth, screenHeight);
	// var el = document.documentElement,
	// 	rfs = el.requestFullscreen
	// 		|| el.webkitRequestFullScreen
	// 		|| el.mozRequestFullScreen
	// 		|| el.msRequestFullscreen
	// 	;
	//
	// rfs.call(el);
	canvas.removeEventListener('touchstart', setFullScreen)
});


function getRandomHexColor() {
	return '0x' + Math.random().toString(16).slice(2, 8).toUpperCase();
}

function renderScreenFps() {
	app.stage.removeChild(screenFps);
	screenFps = new PIXI.Text('FPS: ' + fps);
	screenFps.style = {
		fontSize: 20,
		fill: '#fff'
	};
	screenFps.x = 50;
	screenFps.y = 50;
	app.stage.addChild(screenFps);
}

function renderCountOfActiveTouches() {
	touchesCount = touches.length;
	app.stage.removeChild(screenTouchesCount);
	screenTouchesCount = new PIXI.Text('ACTIVE TOUCHES: ' + touchesCount);
	screenTouchesCount.style = {
		fontSize: 20,
		fill: '#fff'
	};
	screenTouchesCount.x = 50;
	screenTouchesCount.y = 100;
	app.stage.addChild(screenTouchesCount);
}

function renderTouches() {
	graphics.clear();
	for (i = 0; i < touches.length; i++) {
		graphics.lineStyle(0);
		graphics.beginFill(color);
		graphics.drawCircle(touches[i].screenX, touches[i].screenY, 30);
		graphics.endFill();
		app.stage.addChild(graphics);
	}
}


function gameLoop() {
	//there we count fps
	thisLoop = new Date();
	fps = Math.round(1000 / (thisLoop - lastLoop));
	lastLoop = thisLoop;
	renderTouches();
	renderCountOfActiveTouches();
	requestAnimationFrame(gameLoop);
}




