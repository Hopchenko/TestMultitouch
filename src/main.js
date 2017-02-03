(function () {
	'use strict';
	//screen sizes
	var pageWidth = 0;
	var pageHeight = 0;
	var screenWidth = 0;
	var screenHeight = 0;

	//Variables
	var app;
	var canvas;
	var graphics;
	var touches = [];
	var color = 0xffffff;
	var self;

	//variables for fps counting
	var fps;
	var lastLoop;
	var thisLoop;
	//varibles for displaying stats on screen
	var fpsOnScreen;
	var amountOfTouchesOnScreen;
	//technical variables
	var i, j, k;
	i = j = k = 0;

	//Styles
	var textStyle = {
		fontSize: 20,
		fill: '#fff'
	};

	//Logging data variables
	new Clipboard('.btn');
	var clipboardBar;
	var log = [];
	var statistic = '';
	var currentDate;
	var logItem;


	function Application(renderer) {
		this.renderer = renderer;
		console.log(this);
	}

	Application.prototype.initialize = function () {
		var self = this;
		pageWidth = window.innerWidth;
		pageHeight = window.innerHeight;
		screenHeight = screen.height;
		screenWidth = screen.width;

		//Creation of our scene
		app = new PIXI.Application(pageWidth, pageHeight, {
			backgroundColor: 0x1099bb,
			antialias: true
		});
		document.body.appendChild(app.view);

		app.stage.interactive = true;

		canvas = document.querySelector('canvas');
		clipboardBar = document.querySelector('#bar');
		//set up event listeners
		canvas.addEventListener('touchstart', function (event) {
			touches = event.touches;
			event.preventDefault();
		});
		canvas.addEventListener('touchmove', function (event) {
			touches = event.touches;
			event.preventDefault();
		});
		canvas.addEventListener('touchend', function () {
			touches = [];
		});

		//there we set intervals for displaying stats

		var fpsInterval = setInterval(function () {
			self.renderer.renderFps();
		}, 500);
		var statsInterval = setInterval(function () {
			setData(fps, touches.length);
		}, 250);
		var int = setInterval(function () {
			setDataToBar();
		}, 1000);
		document.querySelector('#stop').addEventListener('touchstart', function () {
			clearInterval(int)
		});
	};
	Application.prototype.gameLoop = function () {
		//calculate fps
		thisLoop = new Date();
		fps = Math.round(1000 / (thisLoop - lastLoop));
		lastLoop = thisLoop;

		self = this;
		if (touches.length !== 0) {
			self.renderer.renderTouches();
		} else {
			graphics.clear();
		}
		self.renderer.renderAmountTouches();


		requestAnimationFrame(self.gameLoop.bind(this));
	};


	function Renderer() {
		graphics = new PIXI.Graphics();

	}

	Renderer.prototype.initialize = function () {
		app.stage.addChild(graphics);
		//adding fps to screen
		fpsOnScreen = new PIXI.Text('FPS: ');
		fpsOnScreen.style = textStyle;
		fpsOnScreen.x = 50;
		fpsOnScreen.y = 50;
		app.stage.addChild(fpsOnScreen);
		//adding touches to screen
		amountOfTouchesOnScreen = new PIXI.Text('Touches: ');
		amountOfTouchesOnScreen.style = textStyle;
		amountOfTouchesOnScreen.x = 50;
		amountOfTouchesOnScreen.y = 100;
		app.stage.addChild(amountOfTouchesOnScreen);
	};

	Renderer.prototype.renderTouches = function () {
		graphics.clear();
		for (i = 0; i < touches.length; i++) {
			graphics.lineStyle(0);
			graphics.beginFill(color);
			graphics.drawCircle(touches[i].screenX, touches[i].screenY, 30);
			graphics.endFill();

		}
	};

	Renderer.prototype.renderFps = function () {
		fpsOnScreen.text = 'FPS: ' + fps;
	};

	Renderer.prototype.renderAmountTouches = function () {
		amountOfTouchesOnScreen.text = 'Touches: ' + touches.length;
	};

	function setDataToBar() {
		for (j = 0; i < log.length; i++) {
			statistic += log[i] + '\n';
		}
		console.log(statistic);
		clipboardBar.innerText = statistic;
	}

	function setData(fps, touches) {
		currentDate = (new Date).toTimeString();
		currentDate = currentDate.slice(0, 8);
		logItem = currentDate + '; FPS: ' + fps + '; Touches: ' + touches;
		if (log.length < 400) {
			log.push(logItem);
		} else {
			log.shift();
			log.push(logItem);
		}
	}


	var renderer = new Renderer();
	var application = new Application(renderer);

	application.initialize();
	renderer.initialize();
	application.gameLoop();
}());



