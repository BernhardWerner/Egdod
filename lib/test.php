  <!DOCTYPE html>
<html lang="en">
 <head>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
    <meta charset="utf-8">
    <title>Egdod test</title>
    <script type="text/javascript" src="https://cindyjs.org/dist/v0.8/Cindy.js"></script>
    <script type="text/javascript" src="https://cindyjs.org/dist/v0.8/CindyGL.js"></script>
  </head>

<body style="font-family:Palatino; margin:0; font-size:16pt">







<script id='csinit' type='text/x-cindyscript'>
</script>
<script src="egdodNEW.js"></script>
<?php
  $fileContent = file_get_contents("egdod.cjs");
  echo "<h2>PHP is Fun!</h2>";
?>




<script id='csdraw' type='text/x-cindyscript'> 
</script>



<script id='cstick' type='text/x-cindyscript'>
</script>


<script id='csmousemove' type='text/x-cindyscript'>


</script>

<script id='csmousedown' type='text/x-cindyscript'>
</script>

<script id='csmousedrag' type='text/x-cindyscript'>
</script>

<script id='csmouseup' type='text/x-cindyscript'>
</script>

<!-- <script id='cskeydown' type='text/x-cindyscript'>
</script> -->


<canvas id="CSCanvas" align="left" valign="top" width="800" height="800" style="border:1px solid #000000;"></canvas>









<script>
  cindy = createCindy({canvasname:"CSCanvas",
    scripts:"cs*",
    images: {
    },
    use:["katex"]
  });

</script>






</body>

</html>
