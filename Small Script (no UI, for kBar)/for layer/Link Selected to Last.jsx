(function parentToFirstSelected () {
	app.beginUndoGroup("Parent Selected to First Selected");

	var thisComp = app.project.activeItem;
	var l=thisComp.selectedLayers.length;
	var lstop=l-1;
	var ind=thisComp.selectedLayers[lstop].index;
	for (var i = 0; i < lstop; i++){
		curLayer = thisComp.selectedLayers[i];
		curLayer.parent = thisComp.layer(ind);
	}

	app.endUndoGroup();
})();