/*
 * Put <script src="egdod.js" data-scriptid="YOURINITSCRIPTID"></script> before your createCindy.
 */
(function(){
	var code = document.createTextNode(`
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// This library is intended to be used with CindyGL! But it doesnt have to...
	// It also needs egdodMath to work!
	///////////////////////////////////////////////////////////////////////////////////////////////////

		// *************************************************************************************************
		// Standard smmothstep function.
		// *************************************************************************************************
		smoothstep(x) := x * x * (3 - 2 * x);



		// *************************************************************************************************
		// Computes a random value in the interval [0,1] at a x,y position.
		// *************************************************************************************************
		randomValue(pos) := fract(sin(pos * [12.9898, 78.233]) * 43758.5453123);

		randomGradient(pos) := [2 * fract(sin(pos * (127.1,311.7)) * 43758.5453) - 1, 
			                    2 * fract(sin(pos * (269.5,183.3)) * 43758.5453) - 1 ];

		// *************************************************************************************************
		// Gives random smooth noise based on a point in the plane.
		// *************************************************************************************************
		perlinNoise(coords, octaves, persistence, lactunarity) := (

		);
		perlinNoise(coords) := (
			regional(iPoint, fPoint);
			
			iPoint = [floor(coords.x), floor(coords.y)];
			fPoint = [fract(coords.x), fract(coords.y)];

			0.5 * lerp(
					lerp(
						randomGradient(iPoint) * (fPoint), 
						randomGradient(iPoint + [1,0]) * (fPoint - [1,0]), 
					smoothstep(fPoint.x)),
					lerp(
						randomGradient(iPoint + [0,1]) * (fPoint - [0,1]),
						randomGradient(iPoint + [1,1]) * (fPoint - [1,1]),
					smoothstep(fPoint.x)),
				smoothstep(fPoint.y)) + 0.5;
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
