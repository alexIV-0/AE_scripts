﻿app.beginUndoGroup ("-=Remove Parametr Keys=-"); var myComp = app.project.activeItem.selectedLayers;var par = ["anchorPoint","position","scale","rotation","opacity"];for (var e=0; e < myComp.length; e++){	for (var p = 0; p < par.length; p++){		var selPar = myComp[e].transform.property(par[p]);		if (selPar.numKeys > 0){				parVal=myComp[e].transform.property(par[p]).value;				n=selPar.numKeys;			for (var i = 1; i <= n ; i++){	            selPar.removeKey(1);        	}        	selPar.setValue(parVal);		}	}}app.endUndoGroup();