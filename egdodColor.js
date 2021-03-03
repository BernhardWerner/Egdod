/*
 * Put <script src="egdod.js" data-scriptid="YOURINITSCRIPTID"></script> before your createCindy.
 */
(function(){
	var code = document.createTextNode(`

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
		                       teal      -> [(90,177,171),  (24,156,146),  (0,128,119),   (0,95,88),    (0,60,56)]    / 255,
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
		// Gradient has to be an array of JSONs with keys color and t.
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
		// Color transformation
		// ************************************************************************************************
		rgb2hsv(vec) := (
			regional(cMax, cMin, delta, maxIndex, h, s);

			maxIndex = 1;
			cMax = vec_1;
			forall(2..3, 
				if(vec_# > cMax,
					maxIndex = #;
					cMax = vec_#;
				);
			);

			cMin = min(vec);
			delta = cMax - cMin;

			h =  if(delta ~= 0,
					0;
				,if(maxIndex == 1,
					mod((vec_2 - vec_3) / delta, 6);
				,if(maxIndex == 2,
					2 + (vec_3 - vec_1) / delta
				,if(maxIndex == 3,
					4 + (vec_1 - vec_2) / delta
					
				)))) / 6;

			s = if(cMax ~= 0, 0, delta / cMax);

			[h, s, cMax];

		);

		hsv2rgb(vec) := (
			regional(c, x, m, r, g, b);

			vec_1 = vec_1 * 6;
			c = vec_2 * vec_3;
			x = c * (1 - abs(mod(vec_1, 2) - 1));
			m = vec_3 - c;

			[r, g, b] =  if(vec_1 < 1, 
							[c, x, 0];
						,if(vec_1 < 2, 
							[x, c, 0];
						,if(vec_1 < 3, 
							[0, c, x];
						,if(vec_1 < 4, 
							[0, x, c];
						,if(vec_1 < 5, 
							[x, 0, c];
						,if(vec_1 < 6, 
							[c, 0, x];
						))))));

			[r + m, g + m, b + m];
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
