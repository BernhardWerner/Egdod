/*
 * Put <script src="egdod.js" data-scriptid="YOURINITSCRIPTID"></script> before your createCindy.
 */
(function(){
	var code = document.createTextNode(`

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
		// Draws text with border.
		// *************************************************************************************************
		drawwithborder(pos, txt, size, align, color, bordercolor, bordersize) := (
		  forall(bordersize * apply(1..8, [sin(2 * pi * #/ 8), cos(2 * pi * #/ 8)]), o,
		         drawtext(pos, txt, color -> bordercolor, offset -> o, size -> size, align -> align);
		        );
		  drawtext(pos, txt, color -> color, size -> size, align -> align);
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
