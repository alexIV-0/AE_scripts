function cropLay(){
    var comp = app.project.activeItem;
    var sLayers = comp.selectedLayers;
    var stTime = comp.workAreaStart;
    var outTime = stTime + comp.workAreaDuration;
    for (var i = 0; i < sLayers.length; i++){
        if (sLayers[i].inPoint < stTime) sLayers[i].inPoint = stTime;
        if (sLayers[i].outPoint > outTime) sLayers[i].outPoint = outTime;
    }
}
app.beginUndoGroup ("-=crop layers to work area=-"); 
cropLay();
app.endUndoGroup();