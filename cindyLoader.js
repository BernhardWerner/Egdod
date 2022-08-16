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

function importCindyScript(scripts) {
	if(importCounter < importThreshold & scripts.length > 0) {
		fetch(scripts[0] + ".cjs")
		.then(response => response.text())
		.then(data => {
			loadCindyScript(data);
			scripts.shift();
			importCounter += 1;
			importCindyScript(scripts);
		});
	};
}
