CindyJS.registerPlugin(1, "egdod", function(api) {


    
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // API bindings
    ////////////////////////////////////////////////////////////////////////////////////////////////////

    /** @type {CindyJS.anyval} */
    let nada = api.nada;

    /** @type {function(CindyJS.anyval):CindyJS.anyval} */
    let evaluate = api.evaluate;

    /** @type {function(string,number,CindyJS.op)} */
    let defOp = api.defineFunction;
    
    let extractPoint = api.extractPoint;



    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Internal helper stuff
    ////////////////////////////////////////////////////////////////////////////////////////////////////














    // Calls a Cindyscript function
    function call(name, args, modifs) {
        return evaluate({
            ctype : "function",
            oper : name + "$" + args.length,
            args : args,
            modifs : modifs
        });
    }

    // Return Cindy-compliant variables
    
    function cComplex(x,y) {
        return {ctype: "number", value: {real: x, imag: y}}
    }

    function cReal(x) {
        return cComplex(x, 0);
    }
    
    function cBool(bool) {
        return {ctype: "boolean", value: bool}
    }

    function cList(arr) {
        return {ctype: "list", value: arr}
    }

    function cJSON(dict) {
        return {ctype: "JSON", value: dict}
    }

    function cPoint(arr) {
        return cList(arr.map(x => cReal(x)))
    }

    // Turns point into list of homogeneous coordinates
    function homog(p) {
        if(p.ok) return [p.x, p.y, 1]
        return nada
    }


    // Translates canvas (pixel) coordinates to Cindy coordinates
    function canvasToCindy(px, py) {
        var virtualwidth = 0;
        var virtualheight = 0;

        if(api.config.ports) {
            var port = api.config.ports;

            if (port.virtualwidth) virtualwidth = port.virtualwidth;
            if (port.virtualheight) virtualheight = port.virtualheight;
        }

        
        vscale = 1;

        if (virtualwidth || virtualheight) {
            var canvas = api.instance.canvas;

            vscale = Math.max(
                virtualwidth ? virtualwidth / canvas.width : 0,
                virtualheight ? virtualheight / canvas.height : 0
            );
        }



        var matrix = api.getInitialMatrix();
        var xx = px * vscale - matrix.tx;
        var yy = py * vscale + matrix.ty;
        var x = (xx * matrix.d - yy * matrix.b) / matrix.det;
        var y = -(-xx * matrix.c + yy * matrix.a) / matrix.det;
        return [x, y, 1];
    }

    function getCanvasCoordinates() {
        var canvas = api.instance.canvas;

        return [canvasToCindy(0, canvas.clientHeight), canvasToCindy(canvas.clientWidth, 0)];
    }

    function computerSeconds() {
        var date = new Date()
        var time = date.getTime();

        return time / 1000;
    }

    
    let timeBuffer = 0;
    let scriptStartTime = 0;
    

    function now() {
        return computerSeconds() - scriptStartTime;
    }


    function trackStarted(track, delay = 0) {
        return now() >= track.start.value.real + delay;
    }

    function compass(i) {
        if(0 < i && i < 10) return [[-1,-1], [0,-1], [1,-1], [-1,0], [0,0], [1,0], [-1,1], [0,1], [1,1]][i - 1];
        return [-1, -1]
    }


    function lerp(x, y, t) {
        return (1 - t) * x + t * y;
    }
    // Scalars only!
    function inverseLerp(x, y, p) {
        return (y - p) / (y - x);
    }
    function rangedLerp(x, y, t, a, b) {
        return lerp(x, y, inverseLerp(a, b, t));
    }

    function range(start, end) {
        return (new Array(end - start + 1)).fill(undefined).map((_, i) => i + start);
    }

    
    








    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // CindyScript functions
    ////////////////////////////////////////////////////////////////////////////////////////////////////

    // *************************************************************************************************
    // Prints ctype of variable
    // *************************************************************************************************
    defOp("debugCtype", 1, function(args, modifs) {
        return {
            ctype: "string",
            value: evaluate(args[0]).ctype
        }
    });

    // *************************************************************************************************
    // Prints value of variable
    // *************************************************************************************************
    defOp("debugValue", 1, function(args, modifs) {
        return {
            ctype: "string",
            value: evaluate(args[0]).value
        }
    });


    // *************************************************************************************************
    // Gives the sign of a real numer or a list of real numbers as 1, 0 or +1
    // *************************************************************************************************
    defOp("sign", 1, function(args, modifs) {
        var x = evaluate(args[0]);   
        if(x.ctype == "number" && x.value.imag == 0) return cReal(Math.sign(x.value.real));
        console.log("Wrong type in sign.");
        return nada;
    });



    // *************************************************************************************************
    // Information about the canvas.
    // *************************************************************************************************
    defOp("canvas", 0, function(args, modis) {
        

        var points = getCanvasCoordinates();

        return cJSON({
            topLeft: cPoint([points[0][0], points[1][1], 1]),
            topRight: cPoint(points[1].concat([1])),
            bottomRight: cPoint([points[1][0], points[0][1], 1]),
            bottomLeft: cPoint(points[0].concat([1])),
            center: cPoint([0.5 * (points[0][0] + points[1][0]), 0.5 * (points[0][1] + points[1][1]), 1]),
            width: cReal(points[1][0] - points[0][0]),
            height: cReal(points[1][1] - points[0][1]),
            left: cReal(points[0][0]),
            top: cReal(points[1][1]),
            right: cReal(points[1][0]),
            bottom: cReal(points[0][1]),
            x: cReal(points[0][0]),
            y: cReal(points[0][1])
        });
    });


    // *************************************************************************************************
    // Sets up an animation track with given start and end time.
    // *************************************************************************************************
    defOp("setupAnimationTrack", 2, function(args, modifs) {
        var s = evaluate(args[0]).value.real;
        var e = evaluate(args[1]).value.real;

        var looping = modifs.hasOwnProperty("looping") ? evaluate(modifs.looping) : cBool(false);
        
        
        return cJSON({
            start:    cReal(s),
            end:      cReal(e),
            duration: cReal(e - s),
            timeLeft: cReal(e - s),
            progress: cReal(0),
            running:  cBool(true),
            looping:  looping
        });
    });

    // *************************************************************************************************
    // Updates animation track with delta time variable.
    // *************************************************************************************************
    defOp("updateAnimationTrack", 2, function(args, modifs) {
        var track = evaluate(args[0]).value;
        var delta = evaluate(args[1]).value.real;

        if(track.running.value && trackStarted(track)) {
            track.timeLeft.value.real -= delta;

            if(track.timeLeft.value.real <= 0) {
                if(track.looping.value) {
                    track.timeLeft.value.real = track.end.value.real - track.start.value.real;
                } else {
                    track.timeLeft.value.real = 0;
                    track.running.value = false;
                }
            };
            track.progress.value.real = 1 - track.timeLeft.value.real / track.duration.value.real;

        };
    });




    // *************************************************************************************************
    // Computes time of last frame. 
    // Has to run at every frame if it should be usedto control animations. Call it at top of tickscript.
    // *************************************************************************************************
    defOp("deltaTime", 0, function(args, modifs) {
        var result = computerSeconds() - timeBuffer;
        timeBuffer = computerSeconds();

        return cReal(result);
    });



    // *************************************************************************************************
    // Time since start. 
    // *************************************************************************************************
    defOp("now", 0, function(args, modifs) {
        return cReal(now());
    });



    // *************************************************************************************************
    // Sets up time variables. 
    // *************************************************************************************************
    defOp("setupTime", 0, function(args, modifs) {
        timeBuffer = computerSeconds();
        scriptStartTime = timeBuffer;
    });

    // *************************************************************************************************
    // Transforms a rectangle JSON with x, y, width, height into a polygon with its four vertices.
    // Sorted bottom left, bottom right, top right, top left.
    // *************************************************************************************************
    defOp("expandRect", 1, function(args, modifs) {
        var rect = evaluate(args[0]).value;
        return cList([
            cList([rect.x, rect.y, cReal(1)]),
            cList([cReal(rect.x.value.real + rect.width.value.real), rect.y, cReal(1)]),
            cList([cReal(rect.x.value.real + rect.width.value.real), cReal(rect.y.value.real + rect.height.value.real), cReal(1)]),
            cList([rect.x, cReal(rect.y.value.real + rect.height.value.real), cReal(1)])
        ]);
    });
    



    // *************************************************************************************************
    // Transforms a rectangle JSON with x, y, width, height into a polygon with its four vertices.
    // *************************************************************************************************
    defOp("poissonDiscSampling", 3, function(args, modifs) {
        var rect = evaluate(args[0]).value;
        var x = evaluate(rect.x).value.real;
        var y = evaluate(rect.y).value.real;
        var width = evaluate(rect.width).value.real;
        var height = evaluate(rect.height).value.real;
        var dist = evaluate(args[1]).value.real;
        var numberOfPoints = evaluate(args[2]).value.real;
        var searchThreshold = modifs.hasOwnProperty("searchThreshold") ? evaluate(modifs.searchThreshold) : 32;

        var cellSize = dist;
        var hSize = Math.ceil(width / cellSize);
        var vSize = Math.ceil(height / cellSize);
        var oldPoints = Array(vSize).fill(null).map(() => Array(hSize).fill(null).map(() => Array(0)));
        var result = [];


        
        var numberOfSearches = 0;

        while(result.length < numberOfPoints && numberOfSearches < searchThreshold) {
            var candidate = [lerp(0, width, Math.random()), lerp(0, height, Math.random())];
            var candidateValid = true;
            var xIndex = Math.floor(candidate[0] / cellSize);
            var yIndex = Math.floor(candidate[1] / cellSize);


            scanSize = 1;

            neighbors:
            for(let i = Math.max(xIndex - scanSize, 0); i <= Math.min(xIndex + scanSize, hSize - 1); i++) {
                for(let j = Math.max(yIndex - scanSize, 0); j <= Math.min(yIndex + scanSize, vSize - 1); j++) {
                    for(let k in oldPoints[j][i]) {
                        if(Math.pow(oldPoints[j][i][k][0] - candidate[0], 2) + Math.pow(oldPoints[j][i][k][1] - candidate[1], 2) < Math.pow(dist, 2)) {
                            candidateValid = false;
                            break neighbors;
                        }   
                    }
                    
                }
            }        
            if(candidateValid) {
                oldPoints[yIndex][xIndex].push(candidate);
                result.push(candidate);
                numberOfSearches = 0;
            } else {
                numberOfSearches++;
            }

        }



        return cList(result.map(point => cList([point[0] + x, point[1] + y, 1].map(c => cReal(c)))))
        

        

    })




    // *************************************************************************************************
    // The squared (Euclidean) distance between two numbers or vectors.
    // *************************************************************************************************
    defOp("squaredDist", 2, function(args, modifs) {
        a = evaluate(args[0]);
        b = evaluate(args[1]);

        if(a.ctype == "number" && b.ctype == "number") {
            return cReal(Math.pow(b.value.real - a.value.real, 2) + Math.pow(b.value.imag - a.value.imag, 2));
        }
        if(a.ctype == "list" && b.ctype == "list") {
            if(a.value.length != b.value.length) {
                console.log("Missmatched array lengths in squaredDist.");
                return nada;
            }
            return cReal(a.value.map((currEntry, index) => Math.pow(b.value[index].value.real - currEntry.value.real, 2)).reduce((sum, currValue) => sum + currValue), 0);

        }
        console.log("Type missmatch in squaredDist.");
        return nada;
    });



    // *************************************************************************************************
    // Linear inpterpolation and its variants for numbers and (nested) arrays of numbers.
    // *************************************************************************************************
    defOp("lerp", 3, function(args, modifs) {
        var x = evaluate(args[0]);
        var y = evaluate(args[1]);
        var t = evaluate(args[2]);

        if(t.ctype != "number") {
            console.log("Wrong type in lerp.");
            return nada;
        }

        if(x.ctype == "number" && y.ctype == "number") return cComplex(lerp(x.value.real, y.value.real, t.value.real), lerp(x.value.imag, y.value.imag, t.value.real));

        if(x.ctype == "list" && y.ctype == "list") {
            if(x.value.length != y.value.length) {
                console.log("Missmatched array lengths in lerp.");
                return nada;
            }
            return cList(x.value.map((currEntry, index) => call("lerp", [x.value[index], y.value[index], t], {})));

        }

        console.log("Type missmatch in lerp.");
        return nada;          
    });
































});





