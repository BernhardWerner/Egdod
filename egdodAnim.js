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

	trackStarted(track) := computerSeconds() - scriptStartTimeEABOW >= track.start;

	// Needs to run on every frame!
	updateAnimationTrack(track, delta) := (
		if(track.running & trackStarted(track),
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
	// Text objects needs
	// x
	// y
	// text
	// percentVisible
	// size
	// color 
	// ************************************************************************************************
	drawTextObject(obj) := (
		drawtext(obj.pos, substring(obj.text, 0, round(obj.percentVisible * length(obj.text))), size->obj.size, color->obj.color, align->obj.align);
	);


	// ************************************************************************************************
	// Graph object needs
	// name // has to name of separate function; can't use lambda expressions
	// pos
	// scale
	// start
	// stop
	// color
	// lineSize
	// ************************************************************************************************
	drawGraphObject(obj) := (
		plot(parse(obj.pos.y + " + " + obj.scale + " * " + obj.name + "((x + " + (-obj.pos.x) + ") / " + obj.scale + ")"), x, start->obj.pos.x + obj.start * obj.scale, stop->obj.pos.x + obj.stop * obj.scale, color->obj.color, size->obj.lineSize);
	);

	// ************************************************************************************************
	// Line object needs
	// start
	// end
	// color
	// size
	// arrow
	// ************************************************************************************************
	drawLineObject(obj) := (
		draw([obj.start, obj.end], color->obj.color, size->obj.size, arrow->obj.arrow > 0.5, alpha->obj.alpha);
	);


	// ************************************************************************************************
	// Circle object needs
	// pos
	// stroke (list of points, relative to pos)
	// drawPercent
	// lineColor
	// lineSize
	// fillColor
	// fillAlpha
	// arrow
	// arrowSize
	// ************************************************************************************************
	drawStrokeObject(obj) := (
		regional(absoluteStroke, ratio);
		absoluteStroke = apply(obj.stroke, obj.pos + #);
		ratio = 1..ceil(obj.drawPercent * length(absoluteStroke));
		fillpoly(absoluteStroke_ratio, color->obj.fillColor, alpha->obj.fillAlpha);
		connect(absoluteStroke_ratio, size->obj.lineSize, color->obj.lineColor);
		if(obj.arrow & length(ratio) > 3, connect(arrowTip(absoluteStroke_(ratio_(-1)), absoluteStroke_(ratio_(-1)) - absoluteStroke_(ratio_(-3)), obj.arrowSize), size->obj.lineSize, color->obj.lineColor));
	);
	arrowTipAngleEABOW = pi/ 6;
	arrowTip(tipPos, dir, size) := (
		if(abs(dir) > 0, dir = dir / abs(dir));

		[
			tipPos - size * rotation(arrowTipAngleEABOW) * dir,
			tipPos,
			tipPos - size * rotation(-arrowTipAngleEABOW) * dir
		];		
	);


	// ************************************************************************************************
	// Flipbook object needs
	// pos
	// scale
	// flipbook
	// index
	// ************************************************************************************************
	drawFlipbookObject(obj) := (
		drawimage(obj.pos + obj.scale * 0.5 * [-1, -1], obj.pos + obj.scale * 0.5 * [1, -1], obj.flipbook_(obj.index));
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
	// Cycles through flipbook of a flipbook object. Flipbook pages are equdistantly 
	// spread across animation track as key frames.
	// ************************************************************************************************
	animateFlipbook(obj, track) := (
		regional(n);
		n = length(obj.flipbook);

		obj.index = floor(lerp(1, n + 0.9999, track.timeLeft, track.start, track.end));
	);


	// ************************************************************************************************
	// Animates every property of a line object that makes it appear.
	// ************************************************************************************************
	constructLineObject(obj, endPos, size, arrow, track) := (
		tween(obj, "end", obj.start, endPos, track, "easeInOutCubic");
		tween(obj, "alpha", 0, 1, track, "easeOutCirc");
		tween(obj, "size", 0, size, track, "easeOutCirc");
		if(arrow, tween(obj, "arrow", 0, 1, track, "easeInQuad"));
	);

	// ************************************************************************************************
	// Creates an "empty" line object which can be constructed afterwards.
	// ************************************************************************************************
	createRootLineObject(pos, color) := {
		"start": pos,
		"end":   0,
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
		apply(quiver, obj, obj.start);
	);
	getQuiverEndPoints(quiver) := (
		apply(quiver, obj, obj.end);
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
		
		
		
	strokeSampleRateEABOW = 64;
	// ************************************************************************************************
	// Setting up a stroke object.
	// ************************************************************************************************
	createRootStrokeObject(pos, lineColor, fillColor, fillAlpha) := {
		"pos": pos,
		"stroke": apply(1..strokeSampleRateEABOW, [1,0]),
		"drawPercent": 0,
		"lineSize": 0,
		"lineColor": lineColor,
		"fillColor": fillColor,
		"fillAlpha": fillAlpha,
		"arrow": false,
		"arrowSize": 0
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
	samplePolygon(poly, closed) := (
		regional(pairs, dists, totalDist, effectiveNumber, splitNumbers, stepSize);
		
		if(closed, 
			pairs = cycle(poly);
		, // else //
			pairs = consecutive(poly);
		);
		
		dists = apply(pairs, dist(#_1, #_2));
		totalDist = sum(dists);
		
		effectiveNumber = strokeSampleRateEABOW - length(poly) - 1;
		splitNumbers = [];

		forall(1..length(poly) - 1,
			splitNumbers = splitNumbers :> floor(effectiveNumber * dists_# / totalDist);	
		);

		splitNumbers = splitNumbers :> effectiveNumber - sum(splitNumbers);
		
		flatten(apply(1..length(pairs), pairs_#_1 <: subDivideSegment(pairs_#_1, pairs_#_2, splitNumbers_#))) ++ if(closed, [poly_1], []);
		
	);
		

	// ************************************************************************************************
	// Creates stroke as Bezier curves.
	// ************************************************************************************************
	sampleBezierLin(a, b) := (
		regional(t);
		apply(0..strokeSampleRateEABOW - 1, 
			t = # / (strokeSampleRateEABOW - 1);

			t*b + (1-t)*a;
		);
	);
	sampleBezierQuad(a, b, c) := (
		regional(t);
		apply(0..strokeSampleRateEABOW - 1, 
			t = # / (strokeSampleRateEABOW - 1);

			t^2*c + 2*t*(1-t)*b + (1-t)^2*a;
		);
	);
	sampleBezierCube(a, b, c, d) := (
		regional(t);
		apply(0..strokeSampleRateEABOW - 1, 
			t = # / (strokeSampleRateEABOW - 1);

			t^3*d + 3*t^2*(1-t)*c + 3*t*(1-t)^2*b + (1-t)^3*a;
		);
	);



	// ************************************************************************************************
	// Draws a stroke object as a stroke.
	// ************************************************************************************************
	constructStrokeDraw(obj, lineSize, arrowSize, track) := (
		tween(obj, "lineSize", 0, lineSize, track, "easeOutCirc");
		tween(obj, "drawPercent", 0, 1, track, "easeInOutCubic");
		if(obj.arrow,
			tween(obj, "arrowSize", 0, arrowSize, track);	
		);
	);

	// ************************************************************************************************
	// Grows a circle.
	// ************************************************************************************************
	constructCircleGrow(obj, rad, lineSize, track) := (
		tween(obj, "lineSize", 0, lineSize, track);
		obj.stroke = sampleCircle(lerp(0, rad, 1 - easeOutQuad(track.timeLeft / track.duration)), 2 * pi);
		);
		
		
	
	// ************************************************************************************************
	// Transformation matrices.
	// ************************************************************************************************
	rotation(alpha) := [[cos(alpha), -sin(alpha)], [sin(alpha), cos(alpha)]];

	
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
