/*
 * Put <script src="egdod.js" data-scriptid="YOURINITSCRIPTID"></script> before your createCindy.
 */
(function(){
	var code = document.createTextNode(`


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
		// The faculty of the positive number n.
		// *************************************************************************************************
		faculty(n) := if(n <= 0, 1, n * faculty(n - 1));

		



		// *************************************************************************************************
		// Checks, whether two line segments intersect.
		// *************************************************************************************************
		intersect(a, b) := (
		      area(a_1, a_2, b_1) * area(a_1, a_2, b_2) < 0
		    & area(b_1, b_2, a_1) * area(b_1, b_2, a_2) < 0
		);


		
		// *************************************************************************************************
		// Computes the signed distance of x to the line a-b.
		// *************************************************************************************************
		triangleheight(a, b, x) := if(a ~= b, dist(x, a), det(a :> 1, b :> 1, x :> 1) / dist(a, b));




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
		// Checks, whether the distance of a point is less than eps to a segment (given by two points).
		// *************************************************************************************************
		closeToSegment(p, seg, eps) := (
		  (abs(triangleheight(seg_1, seg_2, p)) < eps)
		  & ((seg_2 - seg_1) * (p - seg_1) >= -0.5 * eps * abs(seg_2 - seg_1) * abs(p - seg_1))
		  & ((seg_1 - seg_2) * (p - seg_2) >= -0.5 * eps * abs(seg_1 - seg_2) * abs(p - seg_2));
		);




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
