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

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // CindyScript functions
    ////////////////////////////////////////////////////////////////////////////////////////////////////


    // *************************************************************************************************
    // Gives the sign of a real numer or a list of real numbers as 1, 0 or +1
    // *************************************************************************************************
    defOp("sign", 1, function(args, modifs) {
        let x = evaluate(args[0]);   
        console.log(x); 
        if(x.ctype == "number" && x.value.imag == 0) return cReal(Math.sign(x.value.real));
        console.log("Type missmatch in sign.");
        return nada;
    });

});