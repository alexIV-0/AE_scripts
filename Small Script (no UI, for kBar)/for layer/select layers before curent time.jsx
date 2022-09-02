/*
	Select all the layers that are currently active
	+shift - adds selection to already selected layers
*/

function selectLayLeft () {
	var k = ScriptUI.environment.keyboardState; 
	var comp = app.project.activeItem;
	var t = comp.time;
	for (var i=1; i <= comp.numLayers; i++){
		var lay = comp.layer(i);
        //if (t > lay.outPoint && lay.shy == false) lay.selected = true
        if (t > lay.outPoint) lay.selected = true
		else if (!k.shiftKey && lay.selected) lay.selected = false
	};
}

app.beginUndoGroup ("-=selected Layers=-");
selectLayLeft(); 
app.endUndoGroup();