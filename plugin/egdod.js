CindyJS.registerPlugin(1, "egdod", function(api) {

    function call(name, args, modifs) {
        return api.evaluate({
            ctype : "function",
            oper : name + "$" + args.length,
            args : args,
            modifs : modifs
        });
    }


    api.defineFunction("test", 1, function(args, modifs) {

        call("draw", args, modifs);




    });

});