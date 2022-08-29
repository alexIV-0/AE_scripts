app.beginUndoGroup("remove Parent"); 
var sLayers = app.project.activeItem.selectedLayers;
for (var i=0; i<sLayers.length; i++){ 
    sLayers[i].parent = null;
}
app.endUndoGroup();