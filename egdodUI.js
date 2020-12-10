/*
 * Put <script src="egdod.js" data-scriptid="YOURINITSCRIPTID"></script> before your createCindy.
 */
(function(){
	var code = document.createTextNode(`

		///////////////////////////////////////////////////////////////////////////////////////////////////
		// Basic math and logic functionality /////////////////////////////////////////////////////////////
		///////////////////////////////////////////////////////////////////////////////////////////////////

		///////////////////////////////////////////////////////////////////////////////////////////////////
		// Array functionality ////////////////////////////////////////////////////////////////////////////
		///////////////////////////////////////////////////////////////////////////////////////////////////

		///////////////////////////////////////////////////////////////////////////////////////////////////
		// Miscellaneous //////////////////////////////////////////////////////////////////////////////////
		///////////////////////////////////////////////////////////////////////////////////////////////////

		///////////////////////////////////////////////////////////////////////////////////////////////////
		// UI elements ////////////////////////////////////////////////////////////////////////////////////
		///////////////////////////////////////////////////////////////////////////////////////////////////


		// ************************************************************************************************
		// Gets the ALICE and Toolbox colours.
		// ************************************************************************************************
		toolColorTable = dict(blue      -> [(2, 88,155),  (0, 70,124),  (0, 50, 89),   (0, 27, 48),   (0,  5,  9)]   / 255,
		                      red       -> [(255,193,148), (247,156, 90),   (227,114, 34),   (172, 76,  8),   (114, 47,  0)]    / 255,
		                      green     -> [(237,247, 81),  (215,228, 15),   (162,173,  0),   (119,127,  0),   (61, 65,  0)]   / 255,
		                      grey      -> [(224,224,224), (172,172,172), (128,128,128), (78,78,78),   (35,35,35)]   / 255
		);
		toolColor(name, bright) := get(toolColorTable, name)_(3 - bright);
		toolColor(name)         := get(toolColorTable, name)_3;

		aliceColorTable = dict(blue      -> [(82,136,188),  (48,110,171),  (12,90,166),   (9,69,128),   (5,54,100)]   / 255,
		                       orange    -> [(255,185,99),  (255,166,57),  (255,140,0),   (197,108,0),  (155,85,0)]   / 255,
		                       violet    -> [(179,109,212), (158,62,204),  (145,19,204),  (123,5,178),  (95,3,138)]   / 255,
		                       turquoise -> [(90,177,171),  (24,156,146),  (0,128,119),   (0,95,88),    (0,60,56)]    / 255,
		                       red       -> [(253,105,109), (236,62,66),   (215,19,24),   (173,6,10),   (133,0,3)]    / 255,
		                       green     -> [(131,222,92),  (99,204,53),   (67,186,16),   (48,150,5),   (34,116,0)]   / 255,
		                       minion    -> [(255,242,153), (255,237,114), (245,224,80),  (221,198,44), (170,151,22)] / 255,
		                       brown     -> [(186,104,43),  (152,74,16),   (117,50,0),    (80,34,0),    (42,18,0)]    / 255,
		                       pink      -> [(255,246,255), (253,181,253), (248,131,248), (240,90,240), (225,52,225)] / 255,
		                       grey      -> [(224,224,224), (172,172,172), (128,128,128), (78,78,78),   (36,35,35)]   / 255
		);
		aliceColor(name, bright) := get(aliceColorTable, name)_(3 - bright);
		aliceColor(name)         := get(aliceColorTable, name)_3;


		// ************************************************************************************************
		// Gets color value out of a gradient. Gradient time values have to be between 0 and 1.
		// ************************************************************************************************
		evalGradient(grad, time) := (
			regional(index);
			
			grad = sort(grad, #.t);

			time = clamp(time, 0, 1);

			index = 1;
			forall(1..(length(grad) - 1),
				if(time > grad_#.t, index = #);
			);

			lerp(grad_index.color, grad_(index + 1).color, time, grad_index.t, grad_(index + 1).t);
		);



		// ************************************************************************************************
		// Checks whether float a lies between floats c and d.
		// ************************************************************************************************
		between(a, c, d) := (a >= c) & (a <= d);


		// ************************************************************************************************
		// Clamps x between the values a and b.
		// ************************************************************************************************
		clamp(x, a, b) := if(a <= b, min(max(x, a), b), min(max(x, b), a));

		// ************************************************************************************************
		// t-conorm dual to normal multiplication. (I.e. Hamacher p with p = 1).
		// ************************************************************************************************
		oplus(x, y) := x + y - x * y;



		
		// ************************************************************************************************
		// Takes two arrays of the same length and pairs elements with the same index together.
		// ************************************************************************************************
		zip(a, b) := transpose([a, b]);


		// *************************************************************************************************
		// Computes the binomial n over k.
		// *************************************************************************************************
		binom(n, k) := (
		    if((n < 0) % (k < 0) % (k > n),
		        err("binom: wrong numbers")
		    , // else //
		        faculty(n) / faculty(k) / faculty(n - k)
		    );
		);

		// *************************************************************************************************
		// Removes the first i elements of a list.
		// *************************************************************************************************
		bite(list, i) := list_((i + 1)..length(list));
		bite(list) := bite(list, 1);

		// *************************************************************************************************
		// Given a list of points, this returns the box circumscribing the points.
		// *************************************************************************************************
		box(list) := (
		    regional(bl, diag);

		    bl   = min(list);
		    diag = max(list) - bl;
		    expandrect(bl, diag.x, diag.y);
		);

		// *************************************************************************************************
		// Intersecting and joining a list of lists.
		// *************************************************************************************************
		cap(list) := (
		    regional(res);
		    if(list == [],
		        [];
		    , // else //
		        res = list_1;
		        forall(bite(list),
		            res = res ~~ #;
		        );

		        res;
		    );
		);
		cup(list) := set(flatten(list));




		// ************************************************************************************************
		// Computes a circle (center and radius) from three points.
		// ************************************************************************************************
		circ(a, b, c) := (
		    regional(m1, m2, p1, p2, mid, dist);

		    m1   = (a + b) / 2;
		    m2   = (b + c) / 2;
		    p1   = perp(join(a, b), m1);
		    p2   = perp(join(b, c), m2);
		    mid  = meet(p1, p2);
		    dist = if(mid.homog_3 == 0, 10000000, |mid.xy, a.xy|);
		    [mid, dist];
		);

		// *************************************************************************************************
		// Computes the angle at q from p to r. The result lies in [0, 2 * pi].
		// *************************************************************************************************
		computeangle(p, q, r) := (
		    regional(x, y, s, w);

		     x = p - q;
		     y = r - q;
		     s = (x * y) / (abs(x) * abs(y));
		     s = if(s < -1, -1, if(s > 1, 1, s));
		     w = arccos(s) + 0;

		     if(perp(x) * y >= 0, w, 2*pi - w);
		);

		// *************************************************************************************************
		// Generates all triples of consecutive elements of a list.
		// *************************************************************************************************
		consectriples(list) := (
		    regional(res);

		    res = [];
		    if(length(list) <= 2,
		        res = [];
		    , // else //
		        forall(1..(length(list) - 2),
		            res = res :> list_[#, # + 1, # + 2];
		        );
		    );
		);

		// *************************************************************************************************
		// Returns a list of length n where every entry is the object x.
		// *************************************************************************************************
		const(n, x) := if(n == 0, [], apply(1..n, x));


		// *************************************************************************************************
		// Creates a rectangle (as a list of its vertices) of width w and height h with at position pos.
		// The value c gives the position in relation to the rectangle according to the number pad on a key-
		// board: E.g. 2 means the position is in the center of the bottom side, 5 means the center and 7
		// means the top left corner.
		// No c results in positioning the rectangle with pos in its lower left corner. I.e. c = 1 by
		// default.
		// *************************************************************************************************
		expandrect(pos, c, w, h) := (
		    regional(d, e, shift);

		    d     = 0.5 * [w, h];
		    e     = (d_1, -d_2);
		    shift = compass()_c;
		    shift = (0.5 * w * shift.x, 0.5 * h * shift.y);
		    apply([-d, e, d, -e], pos + # + shift); //LU, RU, RO, LO
		);
		expandrect(pos, w, h) := expandrect(pos, 1, w, h);
		// Uses rect object; see below.
		expandrect(r) := expandrect(r.xy, r.c, r.w, r.h);

		compass() := apply(directproduct([1, 0, -1], [1, 0, -1]), reverse(#));

		// *************************************************************************************************
		// The faculty of the positive number n.
		// *************************************************************************************************
		faculty(n) := if(n <= 0, 1, n * faculty(n - 1));

		// *************************************************************************************************
		// Finds first index at which x appears in list. Returns 0, when x is not in list.
		// *************************************************************************************************
		findin(list, x) := (
		    regional(occs);

		    occs = select(1..length(list), list_# == x);
		    if(length(occs) == 0, 0, occs_1);
		);

		// ************************************************************************************************
		// Returns the number of elements in list that are equal to x.
		// ************************************************************************************************
		frequency(list, x) := length(select(list, # == x));


		// *************************************************************************************************
		// Checks, whether two line segments intersect.
		// *************************************************************************************************
		intersect(a, b) := (
		      area(a_1, a_2, b_1) * area(a_1, a_2, b_2) < 0
		    & area(b_1, b_2, a_1) * area(b_1, b_2, a_2) < 0
		);

		// *************************************************************************************************
		// Checks whether a list is constant or constant with a specific value.
		// *************************************************************************************************
		isconst(list) := (
		         list == const(length(list), list_1);
		);
		isconst(list, x) := (
		         list == const(length(list), x);
		);

		// *************************************************************************************************
		// For two lists consisting of distinct elements this function returns the permutation mapping the
		// first list to the second. It does it such that list1_result = list2.
		// Please make sure yourself, that the lists are compatible, i.e. that such a permutation exists.
		// *************************************************************************************************
		findperm(list1, list2) := (
		    apply(list2, e, select(1..length(list1), list1_# == e)_1);
		);

		// *************************************************************************************************
		// Removes last i elements of an array.
		// *************************************************************************************************
		pop(list) := list_(1..(length(list) - 1));
		pop(list, i) := list_(1..(length(list) - i));

		// *************************************************************************************************
		// Provides a list of all integers 1...n randomly sorted.
		// *************************************************************************************************
		randomindex(n) := randsort(1..n);

		// *************************************************************************************************
		// Sorts a list randomly.
		// *************************************************************************************************
		randsort(list) := (
		regional(l, temp, i);

		l = length(list);

		while(l > 0,
			i = randomint(m) + 1;

			temp = list_m;
			list_l = list_i;
			list_i = temp;
			l = l - 1;
		);

		list;
	);

		// *************************************************************************************************
		// Chooses randomly k elements of a list.
		// *************************************************************************************************
		randchoose(list, k) := (
				regional(res, i);

				if(k > length(list),
					randsort(list);
				, // else //
					res = [];
					forall(1..k,
						i = randomint(length(list) - 1) + 1;
						res = res :> list_i;
						list = remove(list, i);
					);

					res;
				);
		);

		randchoose(list)    := randsort(list, 1);

		// ************************************************************************************************
		// Draws a rectangle with rounded corners.
		// ************************************************************************************************
		roundedrectangle(tl, w, h, r) := roundedrectangle(tl, tl + [w,-h], r);
		roundedrectangle(tl, br, r) := (
			regional(tr, bl);
			tr = [br.x, tl.y];
			bl = [tl.x, br.y];
			r = min([r, |tl.x-br.x|/2, |tl.y-br.y|/2]);
			//rounded corners
			circle(tl.xy + [r,-r], r)
				++ circle(bl.xy + [r,r], r)
				++ circle(br.xy + [-r,r], r)
				++ circle(tr.xy + [-r,-r], r)
			//rectangle
				++ polygon([tl.xy + [r,0], tr.xy + [-r,0], br.xy + [-r,0], bl.xy + [r,0]])
				++ polygon([tl.xy + [0,-r], tr.xy + [0,-r], br.xy + [0,r], bl.xy + [0,r]]);
		);

		// *************************************************************************************************
		// Computes the signed distance of x to the line a-b.
		// *************************************************************************************************
		triangleheight(a, b, x) := if(a ~= b, dist(x, a), det(a :> 1, b :> 1, x :> 1) / dist(a, b));


		// ************************************************************************************************
		// Draws and handles button. They have to be a JSON with the following keys and value-types:
		// button = {
		//   "position": (2D vector),
		//   "size":     (2D vector),
		//   "label":    (String),
		//   "textSize": (float),
		//   "colors":   (array with 3 colour vectors),
		//   "corner":   (float),
		//   "pressed":  (bool)
		// };
		// ************************************************************************************************
		drawButton(button) := (
		    if(button.pressed,
		        fill(roundedrectangle(button.position + 0.5 * (-button.size.x, button.size.y), button.size.x, button.size.y, button.corner), color -> (button.colors)_2);
		        fill(roundedrectangle(button.position + 0.5 * (-button.size.x, button.size.y) + (0, -0.2), button.size.x, button.size.y, button.corner), color -> (button.colors)_1);
		            drawtext(button.position + (0, -0.6 * button.textSize / 35) + (0, -0.2), button.label, align->"mid", size->button.textSize, color->(1, 1, 1), bold->true);
		    , // else //
		        fill(roundedrectangle(button.position + 0.5 * (-button.size.x, button.size.y) + (0, -0.2), button.size.x, button.size.y, button.corner), color -> (button.colors)_3);
		        fill(roundedrectangle(button.position + 0.5 * (-button.size.x, button.size.y), button.size_1, button.size_2, button.corner), color -> (button.colors)_2);
		        drawtext(button.position + (0, -0.6 * button.textSize / 35), button.label, align->"mid", size->button.textSize, color->(1, 1, 1), bold->true);
		    );
		);


		// Boilerplate code for button functionality. Call via
		// if(mouseInButton(button),
		// 	SOME CODE
		// );
		// in the mousedownscript and mouseupscript. The property button.pressed has to be set/updated manually; allowing for both switch- and toggle-buttons.
		mouseInButton(button) := (
		  dist(mouse().x, button.position.x) < 0.5 * button.size.x
		& dist(mouse().y, button.position.y) < 0.5 * button.size.y;
		);







		// *************************************************************************************************
		// Computes logarithms to p digits after the decimal point.
		// *************************************************************************************************
		arbiLog(x, b, p) := 10^(-p) * round(10^p * log(x) / log(b));
		log2(x, p)       := arbiLog(x, 2, p);
		log2(x)          := log2(x, 6);



		// *************************************************************************************************
		// The Kaylee way to scale probabilities.
		// *************************************************************************************************
		fuzzyScale(x, c) := c * x / ((c - 1) * x + 1);
		fuzzyVectorScale(x, c) := apply(x, fuzzyScale(#, c));


		// *************************************************************************************************
		// Computes the fractional part of a float.
		// *************************************************************************************************
		residual(x) := x - floor(x);
		fract(x)    := residual(x);




		// *************************************************************************************************
		// Returns the middle of three numbers.
		// Call it as mid(x, min_value, max_value) to clamp x in the interval [min_value, max_value].
		// *************************************************************************************************
		mid(a, b, c) := [a,b,c]--[min([a,b,c]),max([a,b,c])];





		// *************************************************************************************************
		// Draws text with border.
		// *************************************************************************************************
		drawwithborder(pos, txt, size, align, color, bordercolor, bordersize) := (
		  forall(bordersize * apply(1..8, [sin(2 * pi * #/ 8), cos(2 * pi * #/ 8)]), o,
		         drawtext(pos, txt, color -> bordercolor, offset -> o, size -> size, align -> align);
		        );
		  drawtext(pos, txt, color -> color, size -> size, align -> align);
		);

		// *************************************************************************************************
		// Checks, whether the distance of a point is less than eps to a segment (given by two points).
		// *************************************************************************************************
		closeToSegment(p, seg, eps) := (
		  (abs(triangleheight(seg_1, seg_2, p)) < eps)
		  & ((seg_2 - seg_1) * (p - seg_1) >= -0.5 * eps * abs(seg_2 - seg_1) * abs(p - seg_1))
		  & ((seg_1 - seg_2) * (p - seg_2) >= -0.5 * eps * abs(seg_1 - seg_2) * abs(p - seg_2));
		);



		// *************************************************************************************************
		// Removes the i-th element of an array.
		// *************************************************************************************************
		remove(arr, i) := (
		   if(i <= 1,
		    bite(arr);
		  ,if(i >= length(arr),
		    pop(arr);
		  , // else //
		    arr_((1..(i - 1)) ++ ((i + 1)..length(arr)));
		  ));
		);


		// *************************************************************************************************
		// Creates and handles rectangle objects.
		// *************************************************************************************************
		rect(x, y, c, w, h) := {"x": x, "y": y, "w": w, "h": h, "c": c, "xy": [x, y]};
		rect(x, y, w, h) := rect(x, y, 1, w, h);
		rect(pos, w, h)  := rect(pos.x, pos.y, w, h);
		drawRect(rect, size, color, alpha) := drawpoly(expandrect(rect), size -> size, color -> color, alpha -> alpha);
		fillRect(rect, color, alpha) := fillpoly(expandrect(rect), color -> color, alpha -> alpha);

		rectContainsPoint(rect, point) := (
		  regional(expanded);

		  expanded = expandrect(rect);

		    point.x > (expanded_1).x
		  & point.x < (expanded_2).x
		  & point.y > (expanded_1).y
		  & point.y < (expanded_3).y
		);





		// *************************************************************************************************
		// Removes elements from a that lie in b.
		// *************************************************************************************************
		setMinus(a, b) := select(a, !contains(b, #));




		// *************************************************************************************************
		// Linear interpolation between x and y.
		// *************************************************************************************************
		lerp(x, y, t) := t * y + (1 - t) * x;
		inverseLerp(x, y, p) := if(dist(y, x) != 0, min(1, max(0, dist(p, x) / dist(y, x))), 0);
		// Lerp relative to t in interval [a, b].
		lerp(x, y, t, a, b) := lerp(x, y, inverseLerp(a, b, t));




		// *************************************************************************************************
		// Computes signed area of simple polygons (i.e. not self intersecting.)
		// *************************************************************************************************
		areaOfPolygon(points) := (
		  0.5 * abs(sum(apply(1..(length(points) - 1),
		    (points_#).x * (points_(# + 1)).y - (points_(# + 1)).x * (points_#).y;
		  )));
		);












		// *************************************************************************************************
		// Creates and handles slider UI element. Has to be a JSON object with the following keys and value-types.
		// slider = {
		//   "position":    (2D vector),
		//   "length":      (float),
		//   "size":        (float),
		//   "vertical":    (bool),
		//   "color":       (color vector),
		//   "startLabel":  (string),
		//   "endLabel":    (string),
		//   "labelSize":   (float),
		//   "value":       (float),
		//   "bulbSize":    (float)
		// };
		// *************************************************************************************************
		sliderEnds(slider) := [slider.position, slider.position + if(slider.vertical, [0, -slider.length], [slider.length, 0])];

		drawSlider(slider) := (
		  regional(endPoints, startOffest, endOffset);

		  endPoints = sliderEnds(slider);

		  draw(endPoints, size -> slider.size, color -> slider.color);
		  fillcircle(lerp(endPoints_1, endPoints_2, slider.value), slider.bulbSize, color -> slider.color);
		  fillcircle(lerp(endPoints_1, endPoints_2, slider.value), 0.7 * slider.bulbSize, color -> (1,1,1));

		  startOffset = if(slider.vertical,
		    [0, 1.2 * slider.bulbSize + 0.2];
		  , // else //
		    [-1.2 * slider.bulbSize, -0.015 * slider.labelSize];
		  );
		  endOffset = if(slider.vertical,
		    [0, -1.2 * slider.bulbSize - 0.05 * slider.labelSize];
		  , // else //
		    [1.2 * slider.bulbSize, -0.015 * slider.labelSize];
		  );
		  drawtext(endPoints_1 + startOffset, slider.startLabel, align -> if(slider.vertical, "mid", "right"), size -> slider.labelSize);
		  drawtext(endPoints_2 + endOffset,   slider.endLabel,   align -> if(slider.vertical, "mid", "left"),   size -> slider.labelSize);
		);

		catchSlider(slider) := (
		  regional(endPoints);

		  endPoints = sliderEnds(slider);

		  if(closeToSegment(mouse().xy, endPoints, slider.bulbSize),
		    slider.value = if(slider.vertical,
		      inverseLerp((endPoints_1).y, (endPoints_2).y, mouse().y);
		    , // else //
		      inverseLerp((endPoints_1).x, (endPoints_2).x, mouse().x);
		    );
		  );
		);

		// *************************************************************************************************
		// Creates and handles selector UI element. Has to be a JSON object with the following keys and value-types.
		// selector = {
		//   "position":    (2D vector),
		//   "length":      (float),
		//   "size":        (float),
		//   "vertical":    (bool),
		//   "color":       (color vector),
		//   "textSize":    (float),
		//   "content":			(array),
		//   "index":       (int),
		//   "bulbSize":    (float)
		// };
		// *************************************************************************************************
		drawSelector(selector) := (
			regional(endPoints);

		  endPoints = sliderEnds(selector);

		  draw(endPoints, size -> selector.size, color -> selector.color);
		  fillcircle(lerp(endPoints_1, endPoints_2, selector.index, 1, length(selector.content)), selector.bulbSize, color -> selector.color);
		  fillcircle(lerp(endPoints_1, endPoints_2, selector.index, 1, length(selector.content)), 0.7 * selector.bulbSize, color -> (1,1,1));

			forall(1..length(selector.content),
		    drawwithborder(lerp(endPoints_1, endPoints_2, #, 1, length(selector.content)) + (0, -0.015 * selector.textSize), selector.content_#, selector.textSize, "mid", [0,0,0], [1,1,1], 2);
		  );

		);

		catchSelector(selector) := (
			regional(endPoints);

			endPoints = sliderEnds(selector);

			if(closeToSegment(mouse().xy, endPoints, selector.bulbSize),
		  	forall(1..length(selector.content),
			    if(dist(mouse().xy, lerp(endPoints_1, endPoints_2, #, 1, length(selector.content))) < selector.bulbSize,
						selector.index = #;
					);
			  );
		  );
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
