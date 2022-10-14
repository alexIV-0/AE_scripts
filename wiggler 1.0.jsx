/*  
    a Tool 
    v0.3
    AutoCrop - функция скопирована из скрипта AutoCrop 2015
    AutoFader - по маркеру, по слою (выше/ниже лежащему), по началу/концу слоя. + их различные сочетания. Полностью написан мною 
    Wiggler - Простой виггл с возможностью раздеения параметра (если есть возможность). отдельно умеет зацикливать вигл. полностью написаный мною. 
    
    v0.4
    убрал AutoCrop в отдельную функцию для кBar в 1 кнопку без интерфейса
    AutoFader - без изменений
    Wiggler - добавил функцию пропорциональных изменений. т.е. что бы равномерно изменялись любые x,y,z параметры. (для Scale например)

    v.0.4.2
    на каждый параметр накидывается индивидуальный вигл

    v.0.4.3
    пофиксил баг с накидыванием вигла на свойство любого эффекта

    v.0.5
    добавил кнопки для быстрого накидывания вигла на Position, Rotation и Scale
    так же добавил выпадающий список для выбора разделения амплитуды и/или частоты

    v.0.6
    переделываю интерфейс

    v 1.0
    добавил проверку на то, что выбрано несколько свойств на одном слое. в этом случае все выбранные свойства будут ссылаться на одни и те же контроллеры (˜160 строка)
    надо добавить (или переписать) что бы имена при создании не
*/

function ST(thisObj){

    //=== нажатия кнопок мыши =============
    function specialKey (_function, _key, _dSep){                
        if (_function == "AF") {
            if ($.os.match(/Windows/)) {
                if (_key.shiftKey == true) return "ease";
                else if (_key.ctrlKey == true) return "easeIn";
                else if (_key.altKey == true) return "easeOut";
                else return "linear";
            }
            else if ($.os.match(/Mac/)) {
                if (_key.shiftKey == true) return "ease";
                else if (_key.metaKey == true) return "easeOut";
                else if (_key.altKey == true) return "easeIn";
                else return "linear";
            }
        }
        else if (_function == "Wiggle"){
            if ($.os.match(/Windows/)) {
                if ((_key.shiftKey == true && _key.altKey == true) || _dSep == 3) return "friq_amp";
                else if (_key.shiftKey == true || _dSep == 1) return "friq";
                else if (_key.altKey == true || _dSep == 2) return "amp";
                else return "false";
            }
            else if ($.os.match(/Mac/)) {
                if ((_key.shiftKey == true && _key.metaKey == true) || _dSep == 3) return "friq_amp";
                else if (_key.shiftKey == true || _dSep == 1) return "friq";
                else if (_key.metaKey == true || _dSep == 2) return "amp";
                else return "false"
            }
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////
    ////////// все, что относится к функции WIGGLER //////////////////////////////////////////
    //W 01 MAIN ===== основная функция для выставления всех значений Wiggler`a ============
    function wigglFunction (_dSep, _pushButton, _wLoop, _seed , _wLock){
        if ( typeof _wLock == "undefined"){
            _wLock = false;
        }
        //var wLock = _anTool.grp.pPanelW.gGrpMain.gGrpW.gGrpChb.gGroup2.chBoxP.value;
        var key = specialKey ("Wiggle", ScriptUI.environment.keyboardState, _dSep);

        var selComp = app.project.activeItem;

        if (selComp == 0){ //проверка если ни одного слоя не выбрано
            alert("Select Layer");
            return;
        }
        var selLayers = selComp.selectedLayers;
        //var selProperties = [];
        var selProperties = selComp.selectedProperties;
        //alert (selProperties);
        if (_pushButton == "all") {selProperties = selComp.selectedProperties;}
        else {
            for (var s=0; s < selProperties.length; s++) {
                selProperties[s].selected = false;
            }
            var strParam = "ADBE " + _pushButton;
            for (var i=0 ; i < selLayers.length; i++){
                selProperties.push(selLayers[i].property("ADBE Transform Group").property(strParam));
                selLayers[i].property("ADBE Transform Group").property(strParam).selected = true;
            }
        }

        if(selLayers == 0 || selProperties == 0){ //проверка если ни одного слоя не выбрано
            alert("No layers selected.");
            return;
        }

        app.beginUndoGroup ("-=Wiggler=-");

        var arrOfAll = arrOfAllPropAndLayers (selLayers, selProperties); //переменная для всех массивов параметров, путей, слоев
        var arrOfProp = arrOfAll.prop; //массив всех выбранных свойств
        var arrOfLayers = arrOfAll.layer; //массив всех выбранных слоев
        //var arrOfSelProp = arrOfAll.selectProp;

        var nLayers = createNull(selComp, selLayers); //слой, где будут находиться контроллеры
        var effectLayer = nLayers.layer; //слой для контроллеров
        var exprLayer = nLayers.expression; //строка для экспрешена, куда будет ссылка на контроллеры, либо ничего (если выбран только один слой), либо "thisComp.layer(...)." 

        writeWiggleExpression(_wLoop, key, arrOfAll, exprLayer, _seed, _wLock);
        createWiggleControlEffect(_wLoop, key, arrOfAll, effectLayer, _seed, _wLock);
        //writeWiggleExpression(wLoop, wLock, key, arrOfAll, exprLayer);
        //createWiggleControlEffect(wLoop, wLock, key, arrOfAll, effectLayer);
        
        app.endUndoGroup();
    }

    //= Wigler 02 ==== создание нуль-объекта для свойств на нескольких слоях =======
    function createNull(_selComp,_selLayers) {
        var lastW = 0;
        if (_selLayers.length == 1) { //если выделен только один слой - все эффекты будут на нем, если больше - создаем нуль-объект
            return {'expression':"", 'layer':_selLayers[0]};
        }
        else {
            for (var i = 1; i <= _selComp.numLayers; i += 1) {
                var lay = _selComp.layer(i).name;
                var am = lay.indexOf("Wiggle Controls ");
                if (am != -1) {
                    ao = lay.split(" ");
                    am = parseInt(ao[2]);
                    if (am > lastW) {
                        lastW = am;
                    }
                }
            }
            var newNullW = _selComp.layers.addNull();
            newNullW.startTime = 0;
            newNullW.enabled = false;
            newNullW.source.name = "Wiggle Controls " + (lastW + 1);
            return {'expression':"thisComp.layer(\"" + newNullW.name + "\").", 'layer':newNullW};
        }
    }
    //= Wigler 02 ==================================================================

    //= wigler 03 - прописываем экспрешен в выбранные свойства =====================
    function writeWiggleExpression(_wLoop, _key, _arrOfAll, _exprLayer, _seed, _wLock){
        var arrOfProp = _arrOfAll.prop; //массив всех выбранных свойств
        var arrOfLayers = _arrOfAll.layer; //массив всех выбранных слоев
        var expressionStr, fX, fY, fZ, aX, aY, aZ, effNameSD;
        /*
        for (var e=0; e < arrOfProp.length; e++){
            if (arrOfProp[e].value.length >= 2 && _key != "false"){
                effNameSD = (effNameSD) ? effNameSD + ", " : "";
                effNameSD = effNameSD + arrOfProp[e].name;
            }
        }
        */
        //метка, что слой для всех выделенных свойств - один
        //изначально исходим из того что слой один
        var oneLayer = true; 
        var i = 0;
        while (i < arrOfLayers.length-1 && arrOfLayers.length > 2){
            if (arrOfLayers[i].index != arrOfLayers[i+1].index) {
                oneLayer = false;
            }
            i++
        }
        
        i = 0;

        while ( i < arrOfProp.length){ //цикл по количеству выбранных свойств
            // условие, если свойство можно разделить
            if (oneLayer == true){
                effNameSD = arrOfProp[0].name;
            } else {
                effNameSD = arrOfProp[i].name;
            }
            expressionStr = "//wiggler\ntry{\n";
            if (_seed) {
                expressionStr = expressionStr + "seed = "  + _exprLayer + "effect(\"W_seed - " + effNameSD + "\")(1);\nseedRandom(seed, true);\n"
            }
            if (_key != "false"){
                // разделяем частоту (friq)
                if (_key == "friq" || _key.split("_")[0] == "friq") {
                        // Separate Demension X
                        expressionStr = expressionStr + "friq_X  = " + _exprLayer + "effect(\"W_friq_X - " + effNameSD + "\")(1);\n";
                        fX = "friq_X,";
                        // Separate Demension Y
                        //expressionStr = (expressionStr) ? expressionStr : ""; 
                        expressionStr = expressionStr + "friq_Y  = " + _exprLayer + "effect(\"W_friq_Y - " + effNameSD + "\")(1);\n";
                        fY = "friq_Y,";
                    //если слой 3D
                    if (arrOfLayers[i].threeDLayer == true) { 
                        //expressionStr = (expressionStr) ? expressionStr : ""; 
                        expressionStr = expressionStr + "friq_Z  = " + _exprLayer + "effect(\"W_friq_Z - " + effNameSD + "\")(1);\n";
                        fZ = "friq_Z,";
                    }
                } else { //если friq разделять не надо, создается один контроллер
                    expressionStr = expressionStr + "friq = " + _exprLayer + "effect(\"W_friq - " + effNameSD + "\")(1);\n";
                    fX = fY = fZ = "friq,";
                }

                // разделяем амплетуду (amp)
                if (_key == "amp" || _key.split("_")[1] == "amp") {
                        expressionStr = expressionStr + "amp_X  = " + _exprLayer + "effect(\"W_amp_X - " + effNameSD + "\")(1);\n";
                        aX = "amp_X";
                        expressionStr = expressionStr + "amp_Y  = " + _exprLayer + "effect(\"W_amp_Y - " + effNameSD + "\")(1);\n";
                        aY = "amp_Y";
                    if (arrOfLayers[i].threeDLayer == true) {
                        expressionStr = expressionStr + "amp_Z  = " + _exprLayer + "effect(\"W_amp_Z - " + effNameSD + "\")(1);\n";
                        aZ = "amp_Z";
                    }
                } else { //если amp разделять не надо, создается один контроллер
                    expressionStr = expressionStr + "amp = " + _exprLayer + "effect(\"W_amp - " + effNameSD + "\")(1);\n";
                    aX = aY = aZ = "amp";
                }

                //на этом месте мы создали слайдеры, если их не было
                //и прописали их в экспрешене, 
                //friq = effect("W_friq")(1);
                //amp_X = effect("W_amp_X")(1);
                //amp_Y = effect("W_amp_Y")(1);

                if (_wLoop) {
                    expressionStr = expressionStr + "loopTime = " + _exprLayer + "effect(\"W_LoopTime\")(1);\nt = time%loopTime;\n";
                    expressionStr = expressionStr + "wX1 = wiggle(" + fX + aX + ", 1, 0.5, t);\nwX2 = wiggle ("+ fX + aX + ", 1, 0.5, t - loopTime);\nx = linear(t, 0, loopTime, wX1, wX2);\n";
                    expressionStr = expressionStr + "wY1 = wiggle(" + fY + aY + ", 1, 0.5, t);\nwY2 = wiggle ("+ fY + aY + ", 1, 0.5, t - loopTime);\ny = linear(t, 0, loopTime, wY1, wY2);\n";
                    if (arrOfLayers[i].threeDLayer == true && _wZ) {
                        expressionStr = expressionStr + "wZ1 = wiggle(" + fZ + aZ + ", 1, 0.5, t);\nwZ2 = wiggle ("+ fZ + aZ + ", 1, 0.5, t - loopTime);\nz = linear(t, 0, loopTime, wZ1, wZ2);\n";
                    }
                } else {
                        expressionStr = expressionStr + "x = wiggle(" + fX + aX + ");\n";
                    if (!_wLock) {
                        expressionStr = expressionStr + "y = wiggle(" + fY + aY + ");\n";
                        if (arrOfLayers[i].threeDLayer == true) {
                            expressionStr = expressionStr + "z = wiggle(" + fZ + aZ + ");\n";
                        }
                    }
                }
                //на этом этапе мы прописали wiggle для всех раздеренных свойств если включены галочки
                //осталось прописать последнюю строку

                //короткая запись if () else, т.е. в переменную х исходя из условия (!_wX) записываем или value, или w[0]
                if (!_wLock) {
                    var x = "x[0]"; 
                    var y = ",y[1]";
                    if (arrOfLayers[i].threeDLayer == true){
                        var z = ",z[2]";
                    } else {
                        var z = "";
                    }
                } else {
                    var x = "x[0]";
                    var y = ",x[0]";
                    var z = (arrOfLayers[i].threeDLayer == true) ? ",x[0]" : "";
                }                        
                expressionStr = expressionStr + "[" + x + y + z + "]";
            } else {  //если свойство разделить нельзя или не надо, то просто 
                //начинаем создавать экспрешен
                expressionStr = expressionStr + "friq = " + _exprLayer + "effect(\"W_friq - " + effNameSD + "\")(1);\namp = " + _exprLayer + "effect(\"W_amp - " + effNameSD + "\")(1);\n";
                if (_wLoop) {
                    expressionStr = expressionStr + "loopTime = " + _exprLayer + "effect(\"W_LoopTime\")(1);\nt = time%loopTime;\nw1 = wiggle(friq, amp, 1, 0.5, t);\nw2 = wiggle(friq, amp, 1, 0.5, t-loopTime);\n"
                }

                if (arrOfProp[i].value.length >= 2 && _wLock) { //если хотя бы одной галочки не хватает - модифицируем
                    if (_wLoop) {
                        expressionStr = expressionStr + "w = linear(t, 0, loopTime, w1, w2);\n"
                    } else {
                        expressionStr = expressionStr + "w = wiggle(friq, amp);\n";
                    }
                    //короткая запись if () else, т.е. в переменную х исходя из условия (!_wX) записываем или value, или w[0]
                    // if (!_wX) {value[0]} else {w[0]}
                    if (!_wLock){
                        var x = "w[0]"; 
                        var y =  ",w[1]";
                        if (arrOfLayers[i].threeDLayer == true){
                            var z = ",w[2]";
                        } else {
                            var z = "";
                        }
                    }
                    else {
                        var x = "w[0]"
                        var y = ",w[0]";
                        var z = (arrOfLayers[i].threeDLayer == true) ? ",w[0]" : "";
                    }
                    
                    expressionStr = expressionStr + "[" + x + y + z + "]";
                } else {
                    if (_wLoop) {
                        expressionStr = expressionStr + "linear(t, 0, loopTime, w1, w2)"
                    } else {
                        expressionStr = expressionStr + "wiggle(friq, amp)"
                    }
                }                
            }
            expressionStr = expressionStr + "\n} catch (e) {value}";
            arrOfProp[i].expression = expressionStr;
            i++;
        }
    }
    //= wigler 03 End ==============================================================

    //= wigler 04 - создаем контроллеры ============================================
    function createWiggleControlEffect(_wLoop, _key, _arrOfAll, _effectLayer, _seed, _wLock){
        var arrOfProp = _arrOfAll.prop; //массив всех выбранных свойств
        var arrOfLayers = _arrOfAll.layer; //массив всех выбранных слоев

        var effNameSD;
        
        for (var i=0; i < arrOfProp.length; i++){ //цикл по количеству выбранных свойств
            try{
                if (arrOfProp[i].name != undefined) {effNameSD = arrOfProp[i].name;}
            } catch (e) {}
            if (_key != "false" && arrOfProp[i].value.length >= 2) {            
                    // условие, если свойство можно разделить
                    if (arrOfProp[i].value.length >= 2){
                        // создаем дополнительные слайдеры для разделения
                        // разделяем частоту (friq)
                        if ((_key == "friq" || _key.split("_")[0] == "friq") && !_wLock) {
                            if (!testEffect(_effectLayer, "W_friq_X - " + effNameSD)){ 
                                createEffect(_effectLayer, "W_friq_X - " + effNameSD, "Slider", 1);
                            } 
                            if (!testEffect(_effectLayer, "W_friq_Y - " + effNameSD)) { 
                                createEffect(_effectLayer, "W_friq_Y - " + effNameSD, "Slider", 1);
                            }
                            //если слой 3D и включена галочка
                            if (arrOfLayers[i].threeDLayer == true && !testEffect(_effectLayer, "W_friq_Z - " + effNameSD)) {
                                createEffect(_effectLayer, "W_friq_Z - " + effNameSD, "Slider", 1);
                            }
                        } else { //если friq разделять не надо, создается один контроллер
                            if (!testEffect(_effectLayer, "W_friq - " + effNameSD)){ //если нет контроллера - создаем его
                                createEffect(_effectLayer, "W_friq - " + effNameSD, "Slider", 1);
                            }
                        }

                        // разделяем амплетуду (amp)
                        if ((_key == "amp" || _key.split("_")[1] == "amp") && !_wLock) {
                            if (!testEffect(_effectLayer,"W_amp_X - " + effNameSD)){
                                createEffect(_effectLayer, "W_amp_X - " + effNameSD, "Slider", 20);
                            }
                            if (!testEffect(_effectLayer,"W_amp_Y - " + effNameSD)){
                                createEffect(_effectLayer, "W_amp_Y - " + effNameSD, "Slider", 20);
                            }
                            if (arrOfLayers[i].threeDLayer == true && !testEffect(_effectLayer, "W_amp_Z - " + effNameSD)) {
                                createEffect(_effectLayer, "W_amp_Z - " + effNameSD, "Slider", 20);
                            }
                        } else { //если amp разделять не надо, создается один контроллер
                            if (!testEffect(_effectLayer, "W_amp - " + effNameSD)){ //если нет контроллера - создаем его
                                createEffect(_effectLayer, "W_amp - " + effNameSD, "Slider", 20);
                            }
                        }
                    }
            } else {    //если свойство разделить нельзя или не надо, то просто 
                //создаем просто 2 слайдера.
                if (!testEffect(_effectLayer, "W_friq - " + effNameSD)){ //если нет контроллера - создаем его
                    createEffect(_effectLayer, "W_friq - " + effNameSD, "Slider", 1);
                }
                if (!testEffect(_effectLayer,"W_amp - " + effNameSD)){
                    createEffect(_effectLayer, "W_amp - " + effNameSD, "Slider", 20);
                } 

            }
        }
        if (_seed && !testEffect(_effectLayer, "W_seed - " + effNameSD)){ 
            createEffect(_effectLayer, "W_seed - " + effNameSD, "Slider", 1);
        }
        if (_wLoop && !testEffect(_effectLayer,"W_LoopTime")) { //если нужен loop
            createEffect(_effectLayer, "W_LoopTime", "Slider", 5);
        }
    }
    //= wigler 04 End ==============================================================
    //////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////



    //////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////
    ////////// все, что относится к функции AutoFader //////////////////////////////////////////
    //AF 01 ===== функция выставление значений и прописывание экспрешенов ============
    function addExpression(_name, _animation, _interpolation){
        app.beginUndoGroup ("-=AvtoFade  " + _animation + "=-");
            var curComp = app.project.activeItem;
            var selLayers = curComp.selectedLayers;
            var firstString;
            if(selLayers == 0 ){
                alert("No layers selected.");
                return;
            }
            for(var i = 0; i < selLayers.length; i++){
                var layer = selLayers[i];
                var opacity = layer.property("ADBE Transform Group").property("ADBE Opacity");

                var FadeExpress = testExpress(opacity); // проверяем на наличие экспрешенов на слое
                if (FadeExpress.split("\n")[0].substr(3,3) == "mar" || FadeExpress.split("\n")[0].substr(3,3) == "lay" || FadeExpress.split("\n")[0].substr(3,3) == "non" || FadeExpress.split("\n")[0].substr(3,2) == "IO") {
                    if (_animation.toLowerCase() == "in"){
                        firstString =  _name + ", " + _interpolation + ";" + FadeExpress.split("\n")[1].substr(3); //например: "layer, linear; + вся вторая строка"
                    }
                    else if (_animation.toLowerCase() == "out") {
                        firstString = FadeExpress.split("\n")[0].substr(3) + ";" + _name + ", " + _interpolation //например: "вся первая строка; layer, linear"
                    } 
                
                }

                else {
                    if (_animation.toLowerCase() == "in"){
                        firstString =  _name + ", " + _interpolation + ";" + "non";
                    }
                    else if (_animation.toLowerCase() == "out") {
                        firstString = "non"+ ";" + _name + ", " + _interpolation
                    } 

                }
                /*
                if (FadeExpress != "false") { //т.е. если экспрешен уже был однажды применен и там есть значения
                    fadeE1 = FadeExpress.split("\n")[0].substr(3).split(",")[0];
                    fadeE2 = FadeExpress.split("\n")[1].substr(3).split(",")[0];
                }
                else {
                    fadeE1 = fadeE2 = "non";
                }
                */
                var n1 = firstString.split(";")[0].split(",")[0];
                var n2 = firstString.split(";")[1].split(",")[0];
                
                if (_name == "marker") {
                    if (!testMarker(layer, _animation.toLowerCase())) createMarker(layer, _animation); //проверяем на наличие маркера
                }                            
                else delMarker(layer, _animation.toLowerCase());

                if (_name == "layer") {
                    if (!testEffect(layer, "Upper") && (n1 == "layer" || n2 == "layer")) createEffect(layer, "Upper", "Checkbox", false);
                }
                else delEffect(layer, "Upper");

                if (_name == "IO") {
                    if (!testEffect(layer, "Time"+_animation) && (n1 == "IO" || n2 == "IO")) {
                        createEffect(layer, "Time"+_animation, "Slider", 1);
                    }
                }
                else {
                    if (testEffect(layer, "TimeIn")) delEffect(layer, "TimeIn");
                    else if (testEffect(layer, "TimeOut")) delEffect(layer, "TimeOut");
                }
                opacity.expression = createExpress (firstString);
            
            }
        app.endUndoGroup();
    }
    //AF 01 -- конец функция выставление значений и прописывание экспрешенов ---------
    /*
        //AF 02 == функция прописывания экспрешенов In или Out==========

        //AF 02 end  --------------------------------------------------------
    */
    //== функция для составления экспрешена ==============
    function createExpress (_string) {
        /*
        варианты:
        marker, linear; non
        non; layer, linear
        layer, ease; marker, linear
        */
        firstString = _string.split(";")[0];
        secondString = _string.split(";")[1];
        textExpress = "// " + firstString + "\n// " + secondString + "\ntry{\n";
        
        if (firstString != "non" && secondString == "non") {
            if (firstString.split(",")[0] == "layer") textExpress = textExpress + "if (effect(\"Upper\")(\"Checkbox\") == true) n = index-1;\nelse n =index+1;\nt1 = thisComp.layer(n).outPoint;\n";
            else if (firstString.split(",")[0] == "marker") textExpress = textExpress + "t1 = marker.key(\"in\").time;\n";
            else if (firstString.split(",")[0] == "IO") textExpress = textExpress + "t1 = inPoint + effect(\"TimeIn\")(1);\n";
            textExpress = textExpress + firstString.split(",")[1] + "(time, inPoint, t1, 0, value);";

        }
        

        if (firstString == "non" && secondString != "non") {
            if (secondString.split(",")[0] == "layer") textExpress = textExpress + "if (effect(\"Upper\")(\"Checkbox\") == true) n = index+1;\nelse n =index-1;\nt1 = thisComp.layer(n).inPoint;\n"
            else if (secondString.split(",")[0] == "marker") textExpress = textExpress + "t1 = marker.key(\"out\").time;\n"
            else if (secondString.split(",")[0] == "IO") textExpress = textExpress + "t1 = outPoint - effect(\"TimeOut\")(1);\n"
            textExpress = textExpress + secondString.split(",")[1] + "(time, t1, outPoint, value, 0);";
        }

        if (firstString != "non" && secondString != "non") { //когда есть оба значения
            //-- первое значение Layer
            if (firstString.split(",")[0] == "layer") {
                if (secondString.split(",")[0] == "layer") textExpress = textExpress + "if (effect(\"Upper\")(\"Checkbox\") == true) {n1 = index-1; n2 = index+1;}\nelse {n1 = index+1; n2 = index-1;}\nt1 = thisComp.layer(n1).outPoint;\nt2 = thisComp.layer(n2).inPoint;\n";
                else if (secondString.split(",")[0] == "marker") textExpress = textExpress + "if (effect(\"Upper\")(\"Checkbox\") == true) n = index-1;\nelse n = index+1;\nt1 = thisComp.layer(n).outPoint;\nt2 = marker.key(\"out\").time;\n";
                else if (secondString.split(",")[0] == "IO") textExpress = textExpress + "if (effect(\"Upper\")(\"Checkbox\") == true) n = index-1;\nelse n = index+1;\nt1 = thisComp.layer(n).outPoint;\nt2 = outPoint - effect(\"TimeOut\")(1);\n";
            }
            //--- первое значение Marker
            if (firstString.split(",")[0] == "marker") {
                if (secondString.split(",")[0] == "marker") textExpress = textExpress + "t1 = marker.key(\"in\").time;\nt2 = marker.key(\"out\").time;\n";
                else if (secondString.split(",")[0] == "layer") textExpress = textExpress + "if (effect(\"Upper\")(\"Checkbox\") == true) n = index+1;\nelse n = index-1;\nt1 = marker.key(\"in\").time;\nt2 = thisComp.layer(n).inPoint;\n";
                else if (secondString.split(",")[0] == "IO") textExpress = textExpress + "t1 = marker.key(\"in\").time;\nt2 = outPoint - effect(\"TimeOut\")(1);\n";
            }
            //--- первое значение IO
            if (firstString.split(",")[0] == "IO") {
                if (secondString.split(",")[0] == "marker") textExpress = textExpress + "t1 = inPoint + effect(\"TimeIn\")(1);\nt2 = marker.key(\"out\").time;\n";
                else if (secondString.split(",")[0] == "layer") textExpress = textExpress + "if (effect(\"Upper\")(\"Checkbox\") == true) n = index+1;\nelse n = index-1;\nt1 = inPoint + effect(\"TimeIn\")(1);\nt2 = thisComp.layer(n).inPoint;\n";
                else if (secondString.split(",")[0] == "IO") textExpress = textExpress + "t1 = inPoint + effect(\"TimeIn\")(1);\nt2 = outPoint - effect(\"TimeOut\")(1);\n";
            }

            textExpress = textExpress + "if (time < t1)" + firstString.split(",")[1] + "(time, inPoint, t1, 0, value);\nelse" + secondString.split(",")[1] + "(time, t2, outPoint, value, 0)";
        }

        textExpress = textExpress + "\n} catch (err) {value}"
        return textExpress;
    }

    // ===== Удаляем маркеры, эффекты и экспрешены ===========
    function delitEffExp (_func) {
        app.beginUndoGroup ("-=" + _func + " delet=-");
        var curComp = app.project.activeItem;
        var selLayers = curComp.selectedLayers;
        if(selLayers.length == 0){
            alert("No layers selected.");
            return;
        }
        for(var i = 0; i < selLayers.length; i++){
            if (_func == "AutoFade") {
                delEffect(selLayers[i], "TimeOut");
                delEffect(selLayers[i], "TimeIn");
                delEffect(selLayers[i], "Upper");
                delMarker(selLayers[i], "in");
                delMarker(selLayers[i], "out");
                selLayers[i].property("ADBE Transform Group").property("ADBE Opacity").expression = ""
            } else if (_func == "Wiggler"){
                var effects = selLayers[i].property("ADBE Effect Parade");
                for (var e = effects.numProperties; e > 0 ; e--){
                    var effName = effects.property(e).name;
                    var z = effName.substr(0, 2);
                    if (effName.substr(0, 2) == "W_"){
                        delEffect(selLayers[i], effName);
                    }
                }
                delWiggleExpressions(selLayers[i]);
            }
        }
        app.endUndoGroup();
    }

    function delWiggleExpressions(prop){
        var str = "";
        for (var i = 1; i <= prop.numProperties; i++) {
            var aaa = prop.property(i);
            //if (aaa.matchName != "ADBE Effect Parade" || aaa.matchName != "ADBE Transform Group")
            if (prop.property(i).propertyType != PropertyType.PROPERTY) {
                delWiggleExpressions(prop.property(i));
                continue;
            }
            if (!prop.property(i).expressionEnabled) {continue;}
            if (prop.property(i).expressionEnabled){
                var express = testExpress(prop.property(i)).split("\n")[0];
                if (express.split("\n")[0] == "//wiggler") {
                    prop.property(i).expression = "";
                }
            }
            

        }
        return str;
    }
    //-- конец функции удаления ---------------------------------------------


    //////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////

    //All 01 == полный путь до свойства. должно быть только одно, т.е. сюда надо передавать по одному
    function propertyPath(_corProp){ 
            var currProp = _corProp;    //последнее свойство    
            if (currProp === null) 
                return;
            var scriptCode = "", exprCode = "";
            var name, compactName, compactScriptName;
            while (currProp.parentProperty !== null)
            {
                name = "\"" + ((currProp.matchName !== "") ? currProp.matchName : currProp.name) + "\"";
                compactScriptName = ("(" + name + ")");
                scriptCode = ".property" + "(" + name + ")" + scriptCode;
                currProp = currProp.parentProperty;
            }
            return scriptCode;
    }
    //All 01 end ===================================================================================

    //All 02 == в функцию передается выбранный слой =============================================
    function lastProp(_selProp) { 
        var deepestProp, numDeepestProps = 0, deepestPropDepth = 0;
        var prop;                   
            prop = _selProp;
            if (prop.propertyDepth >= deepestPropDepth) {
                if (prop.propertyDepth > deepestPropDepth)
                    numDeepestProps = 0;
                    deepestProp = prop;
                    numDeepestProps++;
                    deepestPropDepth = prop.propertyDepth;
            }
        return (numDeepestProps > 1) ? null : deepestProp;
    }
    //All 02 end ====================================================================================

    //All 03 == функция для создания массивов выбранных свойств, полных путей, слоев, на которых находятся выбранные свойства
    function arrOfAllPropAndLayers (_selLayers) {        
            var arrOfProp = []; //массив для всех выбранных свойств
            var arrOfFullPathOfProp = []; //массив для полных путей до выбранного массива
            var arrOfLayers = []; //массив для слоев, на которых находятся выбранные свойства
            for(var i=0; i<_selLayers.length; i++){ /// цикл по выделенным слоям
                var myLayer = _selLayers[i];
                var selProp = myLayer.selectedProperties;
                for (var n=0; n < selProp.length; n++ ){
                    if (selProp[n].propertyType == PropertyType.PROPERTY && selProp[n].canVaryOverTime && selProp[n].propertyValueType != PropertyValueType.CUSTOM_VALUE && selProp[n].propertyValueType != PropertyValueType.SHAPE && selProp[n].propertyValueType != PropertyValueType.TEXT_DOCUMENT) {
                        corProp = lastProp(selProp[n]);
                        scriptStr = propertyPath(corProp);
                        arrOfProp.push(corProp);
                        arrOfFullPathOfProp.push("app.project.activeItem.layer("+myLayer.index+")"+scriptStr);
                        arrOfLayers.push(myLayer);
                    }
                }
            }
            return {'prop':arrOfProp, 'path':arrOfFullPathOfProp, 'layer':arrOfLayers};
    }
    //на выходе получаем массив с выбранными свойствами, со всеми слоями и полными путями до выбранных свойств
    //All 03 end ==================================================================================================

    //All 04 ====== Wigler - прописываем экспрешен в выбранные свойства ==========================

    //All 04 end ============================================================================



    //All 05 === функция на наличие экспрешенов на выбранном параметре ==========
    function testExpress(_property) {
        var FadeExpress ;
        if (_property.expressionEnabled == true) FadeExpress = _property.expression;
        else FadeExpress = "false";
        return FadeExpress;
    }
    //All 05 end ============================================================================

    //All 06 == функция проверки на наличие маркера ============================
    function testMarker(_layer, _animation) {
        if (_layer.property("Marker") == undefined) return false;
        for (var i=1; i <= _layer.marker.numKeys; i++){
            if (_layer.property("Marker").keyValue(i).comment == _animation) return true;
        }
        return false;
    }
    //All 06 end ============================================================================

    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //++++++++++++++++++++++++++++ просто выделение для изменение времени перехода +++++++++++++++++++++++++++++++++++++++++++++++++
    //All 07 == функция создания маркера ============================
    function createMarker(_layer, _animation) { 
        var fadeTime = 1;
        if (_animation == "in") markerTime = _layer.inPoint+fadeTime;
        else if (_animation == "out") markerTime = _layer.outPoint-fadeTime;
        _layer.property("Marker").setValueAtTime (markerTime, new MarkerValue (_animation));
    }
    //All 07 end ============================================================================

    //All 08 == функция удаления маркера ============================
    function delMarker(_layer, _animation) {
        if (_layer.property("Marker") == undefined) return;
        for (var i=1; i <= _layer.marker.numKeys; i++){
            if (_layer.property("Marker").keyValue(i).comment == _animation) _layer.property("Marker").removeKey(i);
        }
    }
    //All 08 end ============================================================================

    //== 09 функция проверки эффекта ============================
    function testEffect (_layer, _name){
        var eff = false;
        var effects = _layer.property("ADBE Effect Parade");
        for(var i = 1; i <= effects.numProperties; i++){
            if(effects.property(i).name == _name) {
                eff = true;
                break;
            }
        }
        return eff;
    }
    //All 09 end ============================================================================

    //All 10 == функция удаления эффекта ============================
    function delEffect(_layer, _name) {
        if (_layer.property("ADBE Effect Parade").numProperties == 0) return;
        for (var i=1; i <= _layer.property("ADBE Effect Parade").numProperties; i++){
            if (_layer.property("ADBE Effect Parade").property(i).name == _name) _layer.property("ADBE Effect Parade").property(i).remove();
        }
    }
    //All 10 end ============================================================================
            
    //All 11 == функция создания эффекта ============================
    function createEffect(_layer, _name, _effControl, val) { 
        var effect = _layer.property("ADBE Effect Parade").addProperty("ADBE " + _effControl + " Control");
        effect.name = _name;
        effect.property(1).setValue(val);
    }
    //All 11 end ============================================================================

    //All 12 == функция проверки параметра на соответствие определенному типу контроллера ============================
        function testProp (_prop) { 
            if (_prop.value.length >= 2 && _prop.unitsText == "pixel") return "Point";
            else if (_prop.value.length >= 2 && _prop.unitsText == "persent") return "Scale";
            else if (_prop.value.length == undefined && _prop.unitsText == "persent") return "Opacity";
            else if (_prop.value.length == undefined && _prop.unitsText == "degrees") return "Rotation";
            else if (_prop.value.length == undefined && _prop.unitsText == "") return "CheckBox";
            else if (_prop.value.length == 4 && _prop.unitsText == "") return "Color";
            else if (_prop.value.length == undefined && _prop.unitsText == "") return "Slider";
            else return "";
        }
    //All 12 end ============================================================================


    function buildUI( thisObj ) {
        var anTool = ( thisObj instanceof Panel ) ? thisObj : new Window( "palette", "Wiggler MG©", undefined, { independent: true, resizeable: true} );
        if ( anTool != null ) {
            var res = "group { \
                orientation:'column', \
                alignment:['fill', 'top'], alignChildren:['fill', 'top'],\
                panelAF:Panel {text:'Auto Fade', margins:[2, 5, 2, 2], spacing:2, \
                    groupAF:Group {alignment:['fill', 'top'], margins:[0, 5, 0, 1], spacing:'2', \
                        ButtonM:Button {text:'M', alignment:['fill', 'center'], size:[25, 22], helpTip: 'LMB - add faleIn by marker\\rRMB - add fadeOut by marker'}, \
                        ButtonL:Button {text:'L', alignment:['fill', 'center'], size:[25, 22], helpTip: 'LMB - add faleIn by previos/next layer\\rRMB - add fadeOut by previos/next layer'}, \
                        ButtonIO:Button {text:'I/O', alignment:['fill', 'center'], size:[25, 22], helpTip: 'LMB - add faleIn by slider\\rRMB - add fadeOut by slider'}, \
                        ButtonD:Button {text:'-', alignment:['fill', 'center'], size:[25, 22], helpTip: 'delite all fadeIn/fadeOut expression'}}},\
                pPanelW:Panel {text:'Wiggler', orientation:'column', margins:[0, 8, 0, 1], spacing:2, \
                    gGrpMain:Group {alignment:['fill', 'fill'], spacing:2, \
                        gGrpW:Group {alignment:['fill', 'fill'], spacing:2,\
                            gGrpButt:Group {alignment:['fill', 'fill'], margins:[4, 0, 4, 0],\
                                btButtW:Button {text:'Wiggle', helpTip:'+Shift - separate Friq \\r+Alt - separate Amp', alignment:['fill', 'fill'], size:[45, 36]},\
                            }, \
                            gGrpChb:Group {orientation:'column', margins:[0, 0, 0, 0], spacing:0, \
                                gGroup2:Group {alignment:['fill', 'fill'], alignChildren:['center', 'top'], \
                                    chBoxL:Checkbox {text:'Loop', helpTip: 'loops the parameter \\rand adds a slider to control the looping time'}, \
                                    chSeed:Checkbox {text:'cSeed', helpTip: 'add slider for comtrol \\rcastom seed for wiggle'}}, \
                                gSepar:Group {alignment:['fill', 'fill'], enabled:true, margins:[2, 0, 4, 0],\
                                    ddSep:DropDownList {alignment:['fill', 'fill'], properties:{items: ['General', 'Separate FREQ', 'Separate AMP', 'Separate FREQ & AMP']}}, \
                                }, \
                            }, \
                        }, \
                    }, \
                    gParam:Group {orientation:'row', margins:[4, 4, 4, 2], alignment:['fill', 'top'], spacing:2, \
                        bPos:Button {text:'P', alignment:['fill', 'center'], helpTip: 'add wiggle on\\rPosition property',size:[25, 22]}, \
                        bRot:Button {text:'R', alignment:['fill', 'center'], helpTip: 'add wiggle on\\rRotation property', size:[25, 22]}, \
                        bScale:Button {text:'S', alignment:['fill', 'center'], helpTip: 'Left Butt - uniform scale\\rRight Butt - different scale', size:[25, 22]}, \
                        delButt:Button {text:'-', alignment:['fill', 'center'], helpTip: 'delite wiggle expression\\rand effect on this layer', size:[25, 22]}, \
                    }, \
                }, \
            }";

            anTool.grp = anTool.add( res );  //добавляем в нашу панельку только что созданные  кнопки интерфейса
            anTool.layout.layout( true );
            anTool.grp.minimumSize = anTool.grp.size;
            anTool.onResizing = anTool.onResize = function() {
                anTool.layout.resize();
            };

            var separateDDList = anTool.grp.pPanelW.gGrpMain.gGrpW.gGrpChb.gSepar.ddSep;
            separateDDList.selection = 0;

            var wLoop = anTool.grp.pPanelW.gGrpMain.gGrpW.gGrpChb.gGroup2.chBoxL;
            var seed = anTool.grp.pPanelW.gGrpMain.gGrpW.gGrpChb.gGroup2.chSeed;

            if ( anTool != null ) {
                if ( anTool instanceof Window ) {
                    anTool.center();
                    anTool.show();
                } else {
                    anTool.layout.layout( true );
                }
            }
        }

        //---------- запускаем функцию Wiggl ---------------------------------------------------------
        anTool.grp.pPanelW.gGrpMain.gGrpW.gGrpButt.btButtW.onClick = function(){
            //alert (wLoop + "\n" + wX +"\n" + wY +"\n" + wZ +"\n" + shiftKey);
            wigglFunction (separateDDList.selection.index, "all", wLoop.value, seed.value);
        };

        anTool.grp.pPanelW.gParam.bPos.onClick = function(){
            wigglFunction (separateDDList.selection.index, "Position", wLoop.value, seed.value);
        };

        anTool.grp.pPanelW.gParam.bRot.onClick = function(){
            wigglFunction (separateDDList.selection.index, "Rotate Z", wLoop.value, seed.value);
        };

        anTool.grp.pPanelW.gParam.bScale.addEventListener ("mousedown", function(p){
            if (p.button === 0) {
                wigglFunction (separateDDList.selection.index, "Scale", wLoop.value, seed.value, true); //передаем саму панельку, параметр, одинаковое изменение по обоим осям
            } else if(p.button === 2){
                wigglFunction (separateDDList.selection.index, "Scale", wLoop.value, seed.value);
            }
        });
        anTool.grp.pPanelW.gParam.delButt.onClick = function(){
            delitEffExp ("Wiggler");
        };
        //---------- запускаем функцию Auto Fade ----------------------------------------------------
        anTool.grp.panelAF.groupAF.ButtonM.addEventListener ("mousedown", function(p){
            if (p.button === 0) {
                addExpression("marker","in",specialKey("AF", ScriptUI.environment.keyboardState)); 
            } else if(p.button === 2){
                addExpression("marker","out",specialKey("AF", ScriptUI.environment.keyboardState)); 
            }
        });
        anTool.grp.panelAF.groupAF.ButtonL.addEventListener ("mousedown", function(p){
            if (p.button === 0) {
                addExpression("layer", "in", specialKey("AF", ScriptUI.environment.keyboardState)); 
            } else if(p.button === 2){
                addExpression("layer","out", specialKey("AF", ScriptUI.environment.keyboardState)); 
            }
        });
        anTool.grp.panelAF.groupAF.ButtonIO.addEventListener ("mousedown", function(p){
            if (p.button === 0) {
                addExpression("IO", "In", specialKey("AF", ScriptUI.environment.keyboardState)); 
            } else if(p.button === 2){
                addExpression("IO","Out", specialKey("AF", ScriptUI.environment.keyboardState)); 
            }
        });
        anTool.grp.panelAF.groupAF.ButtonD.onClick = function(){ delitEffExp ("AutoFade")};
        //-------------------------------------
    }
buildUI( thisObj );
}


ST(this);