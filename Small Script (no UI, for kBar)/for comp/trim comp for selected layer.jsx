function trim(){
    var myComp = app.project.activeItem;
    var myLayer = app.project.activeItem.selectedLayers[0];
    if (myLayer == undefined) return;
    if (myLayer instanceof AVLayer && myLayer.source instanceof CompItem) { 
        dur=myLayer.outPoint-myLayer.inPoint;
        tStart=myLayer.inPoint;
        tIn=myLayer.inPoint-myLayer.startTime;
        myLayer.source.duration=dur;
        myLayer.inPoint=myLayer.startTime;
        myLayer.startTime=tStart;
        myLayer.outPoint=tStart+dur;
        for (var i=1 ; i<=myLayer.source.numLayers; i++) {
            lIn=myLayer.source.layer(i).startTime-tIn;
            myLayer.source.layer(i).startTime = lIn;
            }
        }
    else {
        myComp.duration=myLayer.outPoint;
        }
    }
    app.beginUndoGroup ("-=Trim Comp to sel Layer=-"); 
    trim();
    app.endUndoGroup();
    