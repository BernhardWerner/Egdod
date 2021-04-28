
// <script src="../egdodColor.js"></script>
// <script src="../egdodArray.js"></script>
// <script src="../egdodUI.js"></script>
// <script src="../egdodMath.js"></script>
// <script src="../egdodAnim.js"></script>
// <script src="../egdodShader.js"></script>

let egdodList = [
    "Color",
    "Array",
    "UI",
    "Math",
    "Anim",
    "Shader",
];

for(script of egdodList) {
    let element = document.createElement('script');
    element.src = "egdod" + script + ".js";
    document.body.appendChild(element);

}