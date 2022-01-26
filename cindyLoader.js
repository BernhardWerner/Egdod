function loadCindyScript(codeString, scriptId = "csinit"){
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

