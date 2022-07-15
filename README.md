# Egdod
 
For many years, I have been using the dynamic geometry software <a href="https://cindyjs.org/" target="_blank">CindyJS</a>&mdash;for my dissertation as well as my professional work. Over time, I collected a large set of methods, which are available as an external library here. Basically, a collection of all the auxiliary code I wrote over the last few years and which I copy-pasted from one project to the next. 

It's a work-in-progress and might be unusable by anyone but me. Most functions aren't properly documented yet, and the animation code in particular is currently not very user-friendly. But anyone is welcome to use it, give feedback or even contribute code.

## The main parts
1. A big part of it are common maths and array functionalities like linear interpolation, Bézier splines or shuffling of arrays.

2. A collection of UI elements: Buttons, sliders and toggles. CindyScript allows calling JavaScript, so it can relatively easy interact with all other website elements. But I thought it would be nice to have basic UI elements in CindyScript itself.

3. A collection of functions, which allow for maths animations, heavily inspired by Grant Sanderson's <a href="https://github.com/3b1b/manim" target="_blank">manim Animation Engine</a>. My library provides animation tracks which create individual time-tracking variables. These can then be used to animate any property. Moreover, there are additional objects which draw strokes for which there are pre-defined animations. These allow you to draw coordinate systems, circles, polygons, function graphs, etc. with relative ease. (Emphasis on *relative*…)

4. Some shader-friendly functions for use in the CindyGL plugin. E.g. Perlin noise or a few signed distance functions.


## How to use it
You can always copy-paste the content of `egdod.cjs` directly into your init-script.

If you want to load it without cluttering your file, it currently only works while running on a server. I.e., for local/offline tests, you might want to start a local server via `python -m http.server` in a terminal or any other method you are comfortable with. To make it then work…
1. Download both `cindyLoader.js` and `egdod.cjs` into the same directory your CindyJS file is in.
2. Add `<script type="text/javascript" src="cindyLoader.js"></script>` at the top of your CindyJS file.
3. Wrap the `createCindy` function the following way: 
  ```JavaScript
  fetch("egdod.cjs")
  .then(response => response.text())
  .then(data => {
    loadCindyScript(data);
    cindy = createCindy({
      canvasname:"CSCanvas",
      scripts:"cs*",
      // plus other stuff
    });
  });
  ```
The function `loadCindyScript` will take the code in `egdod.cjs` and add it **at the beginning** of the script with id `"csinit"`. If your init-script is named differently, you can pass a second argument to the function: `loadCindyScript(data, "yourCustomId")`.

When in doubt, you can also take a look at the files `test.html`, `showcase_animation.html` and `showcase_ui.html` which *should* always contain working examples.

## Final note
If you wondered where the name <i>Egdod</i> is coming from: it is the name of a character in the Neal Stephenson novels <a href="https://en.wikipedia.org/wiki/Reamde" target="_blank">Reamde</a> and <a href="https://en.wikipedia.org/wiki/Fall;_or,_Dodge_in_Hell" target="_blank">Fall; or, Dodge in Hell</a>.


