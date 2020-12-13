/*
 * Put <script src="egdod.js" data-scriptid="YOURINITSCRIPTID"></script> before your createCindy.
 */
(function(){
	var code = document.createTextNode(`

	///////////////////////////////////////////////////////////////////////////////////////////////////
	// This library needs egdodMath to work!
	///////////////////////////////////////////////////////////////////////////////////////////////////

	




	// ************************************************************************************************
	// Gets the current time from the computer clock converted to seconds.
	// ************************************************************************************************
	computerSeconds() := (
		regional(actualTime);

		actualTime = time();

		actualTime_1 * 3600 + actualTime_2 * 60 + actualTime_3 + actualTime_4 * 0.001;
	);

	// ************************************************************************************************
	// Sets up time-keeping variables. Will be automatically called when included.
	// Has to be called together with playanimation()!
	// ************************************************************************************************
	setupTime() := (
		timeBufferEABOW = computerSeconds();
		scriptStartTimeEABOW = timeBufferEABOW;
	);


	// ************************************************************************************************
	// Returns the duration ofthe last frame/tick in seconds.
	// Needs to run on every frame!
	// ************************************************************************************************
	deltaTime() := (
		regional(result);

		result = computerSeconds() - timeBufferEABOW;
		timeBufferEABOW = computerSeconds();

		result;
	);

	// ************************************************************************************************
	// Returns the current FPS with a given precision.
	// ************************************************************************************************
	fps(digits) := (
		0.1^digits * round(10^digits / deltaTime());
	);
	fps() := fps(0);


	// ************************************************************************************************
	// Easing functions.
	// ************************************************************************************************
	easeInSine(x)        := 1 - cos((x * pi) / 2);
	easeOutSine(x)       := sin((x * pi) / 2);
	easeInOutSine(x)     := -(cos(pi * x) - 1) / 2;
   
	easeInQuad(x)        := x^2;
	easeOutQuad(x)       := 1 - (1 - x)^2;
	easeInOutQuad(x)     := if(x < 0.5, 2 * x^2, 1 - (-2 * x + 2)^2 / 2);
	   
	easeInCubic(x)       := x^3;
	easeOutCubic(x)      := 1 - (1 - x)^3;
	easeInOutCubic(x)    := if( x < 0.5, 4 * x^3, 1 - (-2 * x + 2)^3 / 2);
	   
	easeInQuart(x)       := x^4;
	easeOutQuart(x)      := 1 - (1 - x)^4;
	easeInOutQuart(x)    := if(x < 0.5, 8 * x^4, 1 - (-2 * x + 2)^4 / 2);
	   
	easeInQuint(x)       := x^5;
	easeOutQuint(x)      := 1 - (1 - x)^5;
	easeInOutQuint(x)    := if(x < 0.5, 16 * x^5, 1 - (-2 * x + 2)^5 / 2);
   
	easeInExpo(x)        := if(x == 0, 0, 2^(10 * x - 10));
	easeOutExpo(x)       := if(x == 1, 1, 1 - 2^(-10 * x));
	easeInOutExpo(x)     := if(x == 0, 0, if(x == 1, 1, if(x < 0.5, 2^(20 * x - 10) / 2, (2 - 2^(-20 * x + 10)) / 2)));
   
	easeInCirc(x)        := 1 - sqrt(1 - x^2);
	easeOutCirc(x)       := sqrt(1 - (x - 1)^2);
	easeInOutCirc(x)     := if(x < 0.5, (1 - sqrt(1 - 4 * x^2)) / 2, (sqrt(1 - (-2 * x + 2)^2) + 1) / 2);

	easeInBack(x)        := 2.70158 * x^3 - 1.70158 * x^2;
	easeOutBack(x)       := 1 - easeInBack(1 - x);
	easeInOutBack(x)     := if(x < 0.5, 4 * x^2 * ((1.70158 * 1.525 + 1) * 2 * x - 1.70158 * 1.525) / 2, ((2 * x - 2)^2 * ((1.70158 * 1.525 + 1) * (2 * x - 2) + 1.70158 * 1.525) + 2) / 2);

	easeInElastic(x)     := if(x == 0, 0, if(x == 1, 1, -2^(10 * x - 10) * sin(2 * pi / 3 * (10 * x - 10.75))));
	easeOutElastic(x)    := 1 - easeInElastic(1 - x);
	easeInOutElastic(x)  := if(x == 0, 0, if(x == 1, 1, if(x < 0.5, -2^(20 * x - 10) * sin(4 * pi / 9 * (20 * x - 11.125)) / 2, 2^(-20 * x + 10) * sin(4 * pi / 9 * (20 * x - 11.125)) / 2 + 1)));



	// ************************************************************************************************
	// Basic animation functionlity.
	// ************************************************************************************************

	setupAnimationTrack(s, e) := {
		"start":    s,
		"end":      e,
		"duration": e - s,
		"timeLeft": e - s,
		"running":  false,
		"looping":  false
	}; 

	// Needs to run on every frame!
	updateAnimationTrack(track, delta) := (
		if(track.running & (computerSeconds() - scriptStartTimeEABOW >= track.start),
			track.timeLeft = track.timeLeft - delta;	
			if(track.timeLeft <= 0,
				if(track.looping,
					track.timeLeft = track.end - track.start;
				, // else //
					track.timeLeft = 0;
					track.running = false;		
				);
			);
		);
	);

	tween(obj, prop, from, to, track, easing) := (
		regional(t);

		t = 1 - track.timeLeft / track.duration;

		if(easing != "none",
			t = parse(easing + "(" + t + ")");
		);

		if(contains(keys(obj), prop),
			if(track.running, 
				obj_prop = lerp(from, to, t);
			);
		);
	);
	tween(obj, prop, from, to, track) := tween(obj, prop, from, to, track, "none");


	// ************************************************************************************************
	// Setting up several animation tracks with delay.
	// ************************************************************************************************
	setupAnimationCascade(number, start, duration, step) := (
		apply(0..number - 1,
			setupAnimationTrack(start + # * step, start + # * step + duration);	
		);
	);

	// ************************************************************************************************
	// Updating all tracks in a cascade. Has to run on every frame.
	// ************************************************************************************************
	updateAnimationCascade(cascade, delta) := (
		forall(cascade, track,
			updateAnimationTrack(track, delta);
		);
	);

	// ************************************************************************************************
	// Updating all tracks in a cascade. Has to run on every frame.
	// ************************************************************************************************
	runAnimationCascade(cascade) := forall(cascade, track, track.running = true);




	// ************************************************************************************************
	// Rendering various animation objects.
	// ************************************************************************************************
	// ************************************************************************************************
	// Text objects needs
	// x
	// y
	// text
	// percentVisible
	// size
	// color 
	// ************************************************************************************************
	drawTextObject(obj) := (
		drawtext([obj.x, obj.y], substring(obj.text, 0, round(obj.percentVisible * length(obj.text))), size->obj.size, color->obj.color, align->obj.align);
	);


	// ************************************************************************************************
	// Graph object needs
	// name // has to name of separate function; can't use lambda expressions
	// x
	// y
	// scale
	// start
	// stop
	// color
	// lineSize
	// ************************************************************************************************
	drawGraphObject(obj) := (
		plot(parse(obj.y + " + " + obj.scale + " * " + obj.name + "((x - " + obj.x + ") / " + obj.scale + ")"), x, start->obj.x + obj.start * obj.scale, stop->obj.x + obj.stop * obj.scale, color->obj.color, size->obj.lineSize);
	);

	// ************************************************************************************************
	// Line object needs
	// xStart
	// yStart
	// xEnd
	// yEnd
	// color
	// size
	// arrow
	// ************************************************************************************************
	drawLineObject(obj) := (
		draw([(obj.xStart, obj.yStart), (obj.xEnd, obj.yEnd)], color->obj.color, size->obj.size, arrow->obj.arrow > 0.5, alpha->obj.alpha);
	);


	// ************************************************************************************************
	// Circle object needs
	// pos
	// stroke (list of points, relative to pos)
	// lineColor
	// lineSize
	// fillColor
	// fillAlpha
	// ************************************************************************************************
	drawStrokeObject(obj) := (
		regional(absoluteStroke);
		absoluteStroke = apply(obj.stroke, obj.pos + #);
		fillpoly(absoluteStroke, color->obj.fillColor, alpha->obj.fillAlpha);
		connect(absoluteStroke, size->obj.lineSize, color->obj.lineColor);
	);


	

	// ************************************************************************************************
	// Draws quiver of line objects.
	// ************************************************************************************************
	drawQuiver(quiver) := forall(quiver, obj, drawLineObject(obj));


	// ************************************************************************************************
	// Draws grid.
	// ************************************************************************************************
	drawGrid(grid) := forall(grid, quiver, drawQuiver(quiver));


	// ************************************************************************************************
	// Animates every property of a line object that makes it appear.
	// ************************************************************************************************
	constructLineObject(obj, endPos, size, arrow, track) := (
		tween(obj, "xEnd", obj.xStart, endPos.x, track, "easeInOutCubic");
		tween(obj, "yEnd", obj.yStart, endPos.y, track, "easeInOutCubic");
		tween(obj, "alpha", 0, 1, track, "easeOutCirc");
		tween(obj, "size", 0, size, track, "easeOutCirc");
		if(arrow, tween(obj, "arrow", 0, 1, track, "easeInQuad"));
	);

	// ************************************************************************************************
	// Creates an "empty" line object which can be constructed afterwards.
	// ************************************************************************************************
	createRootLineObject(pos, color) := {
		"xStart": pos.x,
		"yStart": pos.y,
		"xEnd":   0,
		"yEnd":   0,
		"color":  color,
		"size":   0,
	  "arrow":  0,
	  "alpha":  0
	};

	// ************************************************************************************************
	// Initialises quiver of lines.
	// ************************************************************************************************
	createRootQuiver(roots, color) := (
		apply(roots,
			createRootLineObject(#, color);	
		);
	);

	// ************************************************************************************************
	// Extracts start and end points from quiver.
	// ************************************************************************************************
	getQuiverStartPoints(quiver) := (
		apply(quiver, obj, [obj.xStart, obj.yStart]);
	);
	getQuiverEndPoints(quiver) := (
		apply(quiver, obj, [obj.xEnd, obj.yEnd]);
	);

	// ************************************************************************************************
	// Animates every property of the line objects of a quiver via an animation cascade.
	// ************************************************************************************************
	constructQuiver(quiver, targets, size, arrow, cascade) := (
		forall(1..length(quiver),
		constructLineObject(quiver_#, targets_#, size, arrow, cascade_#);
		);
		);
		
	// ************************************************************************************************
	// Setting up grid lines.
	// ************************************************************************************************
	createRootGrid(pos, xOffset, yOffset, hNumber, vNumber, vDist, hDist, color) := (
		[
			createRootQuiver(apply(0..hNumber - 1, pos + [# * hDist, yOffset]), color),
			createRootQuiver(apply(0..vNumber - 1, pos + [xOffset, # * vDist]), color)
		];
	);

	// ************************************************************************************************
	// Creating a grid.
	// ************************************************************************************************
	constructGrid(grid, hLength, vLength, size, arrow, hCascade, vCascade) := (
		constructQuiver(grid.x, apply(getQuiverStartPoints(grid.x), # + [0, vLength]), size, arrow, hCascade);
		constructQuiver(grid.y, apply(getQuiverStartPoints(grid.y), # + [hLength, 0]), size, arrow, vCascade);
		);
		
		
		
	strokeSampleRateEABOW = 128;
	// ************************************************************************************************
	// Setting up a stroke object.
	// ************************************************************************************************
	createRootStrokeObject(pos, lineColor, fillColor, fillAlpha) := {
		"pos": pos,
		"stroke": apply(1..strokeSampleRateEABOW, [1,0]),
		"lineSize": 0,
		"lineColor": lineColor,
		"fillColor": fillColor,
		"fillAlpha": fillAlpha
	};
	
	// ************************************************************************************************
	// Zero strokes.
	// ************************************************************************************************
	zeroStrokeCenter() := apply(1..strokeSampleRateEABOW, [0,0]);
	zeroStrokeRight() := apply(1..strokeSampleRateEABOW, [1,0]);
	
	// ************************************************************************************************
	// Creates stroke around a circle.
	// ************************************************************************************************
	sampleCircle(rad, angle) := apply(0..strokeSampleRateEABOW - 1, rad * [cos(angle * # / (strokeSampleRateEABOW - 1)), sin(angle * # / (strokeSampleRateEABOW - 1))]);
	
	// ************************************************************************************************
	// Subdivides the distance between two points.
	// ************************************************************************************************
	subdivideSegment(p, q, n) := apply(1..n, lerp(p, q, # / (n + 1)));
	
	// ************************************************************************************************
	// Creates stroke around a polygon.
	// ************************************************************************************************
	samplePolygon(poly) := (
		regional(dists, effectiveNumber, splitNumbers, stepSize);
		
		dists = apply(consecutive(poly), dist(#_1, #_2));
		
		effectiveNumber = strokeSampleRateEABOW - length(poly) - 1;
		
		
		);
		
	// ************************************************************************************************
	// Draws a circle.
	// ************************************************************************************************
	constructCircleDraw(obj, rad, lineSize, track) := (
		tween(obj, "lineSize", 0, lineSize, track, "easeOutCirc");
		obj.stroke = sampleCircle(rad, lerp(0, 2 * pi, 1 - easeInOutCubic(track.timeLeft)));
	);

`);


	var scriptId = document.currentScript.dataset.scriptid;
	if (!scriptId) scriptId = 'csinit';

	var scriptElement = document.getElementById(scriptId);
	if (!scriptElement) {
		scriptElement = document.createElement("script");
		scriptElement.id = scriptId;
		scriptElement.type = "text/x-cindyscript";
		document.head.appendChild(scriptElement);
	}
	if (scriptElement.firstChild) {
		scriptElement.insertBefore(code, scriptElement.firstChild);
	} else {
		scriptElement.appendChild(code);
	}

})();
