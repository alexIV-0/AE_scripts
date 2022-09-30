/*
	remove all mask from selected layer
	+shift - dublicate and delite all macks
*/
function removeMask(){
	var k = ScriptUI.environment.keyboardState; 
	var sLayers = app.project.activeItem.selectedLayers;

	for (var n=0; n < sLayers.length; n++){
		if (k.shiftKey) {
			newLay = sLayers[n].duplicate();
			numMask = newLay.property("ADBE Mask Parade").numProperties;
		} else {
			newLay = sLayers[n];
			numMask = sLayers[n].property("ADBE Mask Parade").numProperties;
		}
		
		for (var i=1 ; i <= numMask; i++){
			newLay.mask(1).remove();
		}
		
		if (k.shiftKey) {
			sLayers[n].selected = false;
			newLay.selected = true;
		}
	}
}
app.beginUndoGroup ("-=dublicate or remove mask=-");
removeMask()
app.endUndoGroup();