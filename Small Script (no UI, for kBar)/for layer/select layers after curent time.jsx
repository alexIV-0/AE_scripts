/*
	Select all the layers that are currently active
	+shift - adds selection to already selected layers
*/

function selectLayRight () {
	var k = ScriptUI.environment.keyboardState; 
	var comp = app.project.activeItem;
	var t = comp.time;
	for (var i=1; i <= comp.numLayers; i++){
		var lay = comp.layer(i);
        //if (t < lay.inPoint && lay.shy == false) lay.selected = true
        if (t < lay.inPoint) lay.selected = true
		else if (!k.shiftKey && lay.selected) lay.selected = false
	};
}

app.beginUndoGroup ("-=selected Layers=-");
selectLayRight(); 
app.endUndoGroup();