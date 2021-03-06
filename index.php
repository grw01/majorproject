

<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8" />
	<title>Magnetosphere Data Visualisation</title>
	<?php
	  require_once "requirements.php";

		//TEMP-COMMENT       //getDataFromFTP is infeasible,
		                     //too much data to put in a file
		//getDataFromFTP(); //Could move to async-update.php and add ajax call
		//updateDatabaseTable("magnetometer", date("Y"));
	?>
</head>
<body>
	<header class="center-children">
		<h1>Magnetosphere Data Visualisation</h1>
	</header>
	<main>
		<div id="canvasDiv" class="center-children">
			<div class="align-left">
				<h3 id="Y-title">Intensity<div>(×1000)</div></h3>
			</div>
			<!--HighDef canvas created using JS
			<canvas id="dataCanvas">
				<p>Your browser does not support the required functionality to view this display.</p>
			</canvas>-->
		</div>
		<div class="center-children">
			<h3>Hours</h3>
		</div>
		<div class="center-children">
			<?php
				require_once "php/includes/select-drop-down.php";
			?>
		</div>
		<p>

		</p>
	</main>
</body>

</html>
