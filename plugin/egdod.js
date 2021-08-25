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

    function cList(arr) {
        return {ctype: "list", value: arr}
    }

    function cPoint(arr) {
        return cList([cReal(arr[0]), cReal(arr[1])])
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
        let points = call("screenbounds", [], {}).value.map(p => [p.value[0].value.real, p.value[1].value.real]);

        return {
            ctype: "JSON",
            value: {
                tl: cPoint(points[0]),
                tr: cPoint(points[1]),
                br: cPoint(points[2]),
                bl: cPoint(points[3]),
                center: cPoint([0.5 * (points[0][0] + points[2][0]), 0.5 * (points[0][1] + points[2][1])]),
                width: cReal(points[1][0] - points[0][0]),
                height: cReal(points[1][0] - points[2][0]),
                left: cReal(points[0][0]),
                top: cReal(points[0][1]),
                right: cReal(points[2][0]),
                bottom: cReal(points[2][1])
            }
        }
    });

});