(function parentToLastSelected () {
	app.beginUndoGroup("Parent Selected to Last Selected");

	var thisComp = app.project.activeItem;
	var l=thisComp.selectedLayers.length;
	var ind=thisComp.selectedLayers[0].index;
	for (var i = 1; i < l; i++){
		curLayer = thisComp.selectedLayers[i];
		curLayer.parent = thisComp.layer(ind);
	}

	app.endUndoGroup();
})();