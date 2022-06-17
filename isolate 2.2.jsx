/*
	v2.1 
	глобальные переменные для временного хранения данных о стадии isolate, типа выполнялся или еще нет.
	скрытость слоя и заблокированность записываются в комментарий.

	v2.2 
	избавился от глобальных переменных, теперь в процессе выполнения скрипта создаются дополнительные свойства на слое и композиции и туда записываются все изменения. эти данные остаются только пока запущена программа, т.е. после перезагрузки их не станет, но они опять появятся если запустить скрипт. И теперь isolate будет работать в разных композициях по отдельности.
    
    a simple script without an interface to insert into kBar 
    Click - leaves the selected layers in the Viewer window, hides the remaining layers
    Shift + click - the same thing, + hides all layers on the timeline, leaving only the selected
    ones. Repeated click - returns everything back
*/
function isolate(){	
    var k = ScriptUI.environment.keyboardState;
    var nComp = app.project.activeItem;
    var sLayers=nComp.selectedLayers;
    var t=nComp.numLayers;
    var lay;
    //создаем дополнительное свойства у данной композиции
    if (typeof nComp.GlobalOnIsolate == "undefined") {
        nComp.GlobalOnIsolate = false;
    }
    if (typeof nComp.GlobalOnIsolateShy == "undefined") {
        nComp.GlobalOnIsolateShy = false;
    }
    //////// скрываем все слои
    if (nComp.GlobalOnIsolate == false) {
    //проверяем включен ли shyLayer до того как скрыть все слои
        if (nComp.hideShyLayers) {
            nComp.GlobalOnIsolateShy = true;
        } else {
            nComp.GlobalOnIsolateShy = false;
        }
        for (var i=1; i<=t; i++){
            lay = nComp.layer(i);
            if (typeof lay.GlobalOnIsolateLock == "undefined") {
                lay.GlobalOnIsolateLock = false;
            }
            if (typeof lay.GlobalOnIsolateShy == "undefined") {
                lay.GlobalOnIsolateShy = false;
            }
            //проверяем на "выбран ли слой"
            if (lay.selected) { //если слой выбран
                if (k.shiftKey && lay.enabled) {
                    lay.solo = true;
                }
            } else {
                //проверяем скрыт ли слой изначально
                if (lay.shy) {
                    lay.GlobalOnIsolateShy = true;
                } else {
                    lay.GlobalOnIsolateShy = false;
                    lay.shy = true;
                }
                //проверяем на "заблокирован ли слой" (замочек)
                if (lay.locked) {
                    lay.locked = false;
                    lay.GlobalOnIsolateLock = true;
                }	else lay.GlobalOnIsolateLock = false;
            }
            if (lay.GlobalOnIsolateLock) {
                lay.locked = true;
            }
            nComp.hideShyLayers = true;
            nComp.GlobalOnIsolate = true;
        }
    }
    ////// возвращаем все к первоначальному варианту
    else if(nComp.GlobalOnIsolate == true) {
        //nComp.hideShyLayers=false;
        for (var i=1; i<=t; i++){
            lay = nComp.layer(i);
            if (!lay.GlobalOnIsolateShy) {
                lay.shy = false;
            }
            if (lay.locked) {
                lay.locked = false;
            }
            if (lay.solo) {
                lay.solo = false;
            }
            if (lay.GlobalOnIsolateLock) {
                lay.locked = true;
            }
        }
        if (!nComp.GlobalOnIsolateShy){
            nComp.hideShyLayers = false;
        }
        nComp.GlobalOnIsolate = false;
    }	
}
app.beginUndoGroup ("-=isolate Layers=-");
isolate()
app.endUndoGroup();