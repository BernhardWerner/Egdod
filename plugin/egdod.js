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
    // Helper functions
    ////////////////////////////////////////////////////////////////////////////////////////////////////

    function call(name, args, modifs) {
        return evaluate({
            ctype : "function",
            oper : name + "$" + args.length,
            args : args,
            modifs : modifs
        });
    }

    function cReal(x) {
        return {ctype: "number", value: {real: x, imag: 0}}
    }

    function cBool(x) {
        return {ctype: "boolean", value: x}
    }

    function cList(arr) {
        return {ctype: "list", value: arr}
    }

    function cPoint(arr) {
        return cList([cReal(arr[0]), cReal(arr[1])])
    }

    function xy(p) {
        if(p.ok) return [p.x, p.y]
        return nada
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
        let x = evaluate(args[0]);   
        if(x.ctype == "number" && x.value.imag == 0) return cReal(Math.sign(x.value.real));
        console.log("Type missmatch in sign.");
        return nada;
    });



    // *************************************************************************************************
    // Information about the canvas.
    // *************************************************************************************************
    defOp("canvas", 0, function(args, modis) {
        let points = call("screenbounds", [], {}).value.map(p => extractPoint(p));

        return {
            ctype: "JSON",
            value: {
                tl: cPoint(xy(points[0])),
                tr: cPoint(xy(points[1])),
                br: cPoint(xy(points[2])),
                bl: cPoint(xy(points[3])),
                center: cPoint([0.5 * (points[0].x + points[2].x), 0.5 * (points[0].y + points[2].y)]),
                width: cReal(points[1].x - points[0].x),
                height: cReal(points[1].x - points[2].x),
                left: cReal(points[0].x),
                top: cReal(points[0].y),
                right: cReal(points[2].x),
                bottom: cReal(points[2].y)
            }
        }
    });


    // *************************************************************************************************
    // Sets up an animation track with given start and end time.
    // *************************************************************************************************
    defOp("setupAnimationTrack", 2, function(args, modifs) {
        let s = evaluate(args[0]).value.real;
        let e = evaluate(args[1]).value.real;

        let looping = modifs.hasOwnProperty("looping") ? evaluate(modifs.looping) : cBool(false);
        
        
        return {
            ctype: "JSON",
            value: {
                start:    cReal(s),
                end:      cReal(e),
                duration: cReal(e - s),
                timeLeft: cReal(e - s),
                progress: cReal(0),
                running:  cBool(true),
                looping:  looping
            }
        }
    });

    defOp("updateAnimationTrack", 2, function(args, modifs) {
        let track = evaluate(args[0]).value;
        let delta = evaluate(args[1]).value.real;

        track.duration.value.real -= delta;
       
    });

});