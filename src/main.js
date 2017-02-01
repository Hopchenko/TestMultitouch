//declare global variables
var pageWidth = window.innerWidth,
	pageHeight = window.innerHeight,
	screenHeight = screen.height,
	screenWidth = screen.width,
	canvas,
	app,
	fps,
	basicText,
	touches = [],
	screenFps = 0,
	lastLoop = new Date(),
	color = getRandomHexColor(),
	touchesCount = 0,
	screenTouchesCount,
	graphics = new PIXI.Graphics();

app = new PIXI.Application(pageWidth, pageHeight, {backgroundColor: 0x1099bb, antialias: true});
document.body.appendChild(app.view);
app.stage.interactive = true;

//add "show full screen" text to page
basicText = new PIXI.Text('Push for set full screen');
basicText.anchor.set(0.5, 0.5);
basicText.style = {
	fontSize: 60,
	fill: '#fff'
};
basicText.x = pageWidth / 2;
basicText.y = pageHeight / 2;
app.stage.addChild(basicText);

//show fps on page


canvas = document.querySelector('canvas');

//set up full screen app;
canvas.addEventListener('touchstart', function setFullScreen(event) {
	app.stage.removeChild(basicText);
	//code below works with desktop browsers
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
function renderTouches() {
	graphics.clear();
	for (var i = 0; i < touches.length; i++) {
		graphics.lineStyle(0);
		graphics.beginFill(color);
		graphics.drawCircle(touches[i].screenX, touches[i].screenY, 30);
		graphics.endFill();
		app.stage.addChild(graphics);
	}
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

function gameLoop() {
	//there we count fps
	var thisLoop = new Date;
	fps = Math.round(1000 / (thisLoop - lastLoop));
	lastLoop = thisLoop;

	renderTouches();
	renderCountOfActiveTouches();

	requestAnimationFrame(gameLoop);
}
//We use comfortable interval for display FPS
setInterval(renderScreenFps, 250);
gameLoop();


//Implementation of touches visualization
canvas.addEventListener('touchmove', function (event) {
	touches = event.touches;
	event.preventDefault();
});
canvas.addEventListener('touchend', function () {
	touches = [];
	color = getRandomHexColor();
});

function initializApp() {

}

init();



