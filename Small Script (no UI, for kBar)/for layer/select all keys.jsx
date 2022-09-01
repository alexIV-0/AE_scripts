/*
    Select all keys on all layers in the composition
    Or select all keys only on selected layers
*/
function selectProp (_layer) {
    for (var i = 1; i <= _layer.numProperties; i++){
        var curProp = _layer.property(i);
        if (curProp.numProperties > 0) {
            selectProp(curProp)
        };
        if (curProp.numKeys > 0) {
            curProp.selected = true
        };
    }
}

function selectKeys(){
    var proj = app.project;
    var curComp = proj.activeItem;
    var num = curComp.numLayers;
    if (curComp.selectedLayers.length != 0 ){
        for (var i = 0; i < curComp.selectedLayers.length; i++){
            var lay = curComp.selectedLayers[i];
            selectProp(lay);
        }
    } else {
        for (var i = 1; i <= curComp.numLayers; i++){
            var lay = curComp.layer(i);
            selectProp(lay);
        }
    }
}

app.beginUndoGroup ("-=Select All Keys=-");
selectKeys();
app.endUndoGroup();