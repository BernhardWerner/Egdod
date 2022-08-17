function loadCindyScript(codeString, scriptId = "csinit") {
	var codeNode = document.createTextNode(codeString);

	var scriptElement = document.getElementById(scriptId);
	if (!scriptElement) {
		scriptElement = document.createElement("script");
		scriptElement.id = scriptId;
		scriptElement.type = "text/x-cindyscript";
		document.head.appendChild(scriptElement);
	}
	if (scriptElement.firstChild) {
		scriptElement.insertBefore(codeNode, scriptElement.firstChild);
	} else {
		scriptElement.appendChild(codeNode);
	}
};

importThreshold = 32;
importCounter = 0;

function startCindy(dict) {
	if(!dict.hasOwnProperty("import")) return createCindy(dict);

	libraries = dict.import;
	if(importCounter >= importThreshold || libraries.length <= 0) return createCindy(dict);

	library = libraries.pop();
	if(dict.hasOwnProperty("initscript")) {
		initId = dict.initscript;
	} else {
		initId = dict.scripts.replace("*", "init"); 
	}
	console.log("Loading " + library + " into " + initId + " ...");
	fetch(library + ".cjs")
	.then(response => response.text())
	.then(data => {
		loadCindyScript(data, initId);
		importCounter += 1;
		console.log(library + " loaded!");
		startCindy(dict);
	});
};
