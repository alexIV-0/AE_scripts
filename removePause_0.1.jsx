/*
    Select one layer on timeline whith audio track
    ** sec. pause - minimum pauses that the script will look for
    ** frame trim - how many frames will the pause be clipped at the beginning and at the end

*/
    

function run(thisObj){

    //объект со всеми текстами в проекте
    var UI_txt = {
        nameUI:{ //именя всех окошек
            main: "Remove Pauses",
        },
        main: { //кнопки в основной менюшке
            aButt_pause:{
                helpTip1: "value in SECONDS.\rthe minimum pause value by which we will set markers",
                helpTip2: "value in FRAMES\rHow many frames will the void be trimmed\rfrom the beginning and from the end",
                stText1: "Second pause",
                stText2: "Frames for trimming"
            },
            remPaus:{
                text: "Remove pause",
                helpTip: "remove the pauses in the selected layers,\rcreate the composition \"Main\"\rand open it"
            },
        },
        audToComp: {
            turnOn: "Turn on audio on the selected layer",
            compNotSel: "Composition not selected",
            selLay: "Select one layer on timeline",
            selAud: "select AUDIO layer",
            notComp: "not a composition or layer without audio",
        },
    }


    if ($.os.match(/Windows/)) { var _S = "\\"}
    else if ($.os.match(/Mac/)) { var _S = "/"}











    /*
          ___  __ __ ____   __   ___      ______   ___        ___   ___   ___  ___ ____ 
         // \\ || || || \\  ||  // \\     | || |  // \\      //    // \\  ||\\//|| || \\
         ||=|| || || ||  )) || ((   ))      ||   ((   ))    ((    ((   )) || \/ || ||_//
         || || \\_// ||_//  ||  \\_//       ||    \\_//      \\__  \\_//  ||    || ||   
                                                                                        
    */
    function getFolder (_name){ //функция создания папки
        var bFolder; //задаем переменную для новой папки
        for (var i=1; i<=app.project.numItems; i++){    //задаем цикл проверки на наличие папки с данным именем
            if (app.project.item(i).name == _name && app.project.item(i) instanceof FolderItem){ //проверяем совпадает ли имя элемента - с именем заданной папки и является ли этот элемент папкой
                bFolder = app.project.item(i); //если такая папка уже существует - присваеваем её индекс переменной bFolder
            }
        }
        if (!bFolder) bFolder=app.project.items.addFolder(_name); //если указанной папки не найдено - создаем
        return bFolder; 
    }   //далее будет действовать 1 условие, т.к. папку уже создали

    

    function createMarker_on_Layer(_comp, _layer) {

        var command = app.findMenuCommandId("Convert Audio to Keyframes");
        if (_layer.audioEnabled == false) {
            alert (UI_txt.audToComp.turnOn);
        } else {
            _layer.solo = true;
        }
        _comp.frameRate = 25;

            app.executeCommand(command);
        var audioAmp = _comp.layer(1);
        var audKey = audioAmp.effect("Both Channels")("Slider");
        var zero = 0;
        var val = 1;
        var setSec = app.settings.haveSetting("removePaused_alexIV", "sec");
        if (setSec == true || setSec == "true") {
            var sec = Number(app.settings.getSetting("removePaused_alexIV", "sec"));
        } else {
            var sec = 1.2;
        }
        var pause = Math.floor(_comp.frameRate*sec);
        var setFrames = app.settings.haveSetting("removePaused_alexIV", "frames");
        if (setFrames == true || setFrames == "true") {
            var addCut = Number(app.settings.getSetting("removePaused_alexIV", "frames"));
        } else {
            var addCut = 15;
        }
        var inP = Number(_comp.frameRate * _layer.inPoint);
        var outP = Number(_comp.frameRate * _layer.outPoint);
        for (var i = inP + 2; i < outP; i++){
            var key = audKey.keyValue( i ); 
            if (key < 0.05){
                zero++;
            }
            else if (zero >= pause) {
                var mTime = audKey.keyTime(i - zero + addCut);
                var vv = new MarkerValue(val.toString() + ";" + (zero - addCut*2));
                _layer.marker.setValueAtTime (mTime, vv);
              
                val ++;
                zero = 0;
            } else {
                zero = 0;
            }
        }
        _layer.solo = false;
        audioAmp.source.parentFolder.remove();
        //audioAmp.remove();
    }





    function audioToComp(_shift){

        app.beginUndoGroup ("-=comp from audio=-"); 

        var activeComp = app.project.activeItem;
        if (activeComp == undefined) {
            alert(UI_txt.audToComp.compNotSel);
            return;
         }
        var aLey = activeComp.selectedLayers;
        if (aLey.length == 0 || aLey == undefined) {
           alert(UI_txt.audToComp.selLay);
           return;
        }
            aLey = aLey[0];

        if (aLey.hasAudio == false && aLey.hasVideo == true) {
            alert(UI_txt.audToComp.selAud);
            return;
        } 
    
        if (aLey.source.mainSource instanceof FileSource || aLey.source instanceof CompItem || aLey.source instanceof FootageItem ){
            var audioFile = aLey.source;
        }

        if (aLey.property("Marker").numKeys == 0) {
            createMarker_on_Layer(activeComp, aLey);
            if (aLey.property("Marker").numKeys == 0) {return;} //если все же не получилось добавить маркеры
        } 
        var numMark = aLey.property("Marker").numKeys;

        var compFolder = getFolder("Comp Folder");
        var stTimeAudio, dur, timeMarker, timeMarkerBefore = 0;
        
        var mainComp = app.project.items.addComp(aLey.name, 1920, 1080, 1, audioFile.duration, 25);

        // сам цикл по созданию композиций
        for (var i = 1; i <= numMark+1; i++) { 
            var newComp = app.project.items.addComp("Scene " + i, mainComp.width, mainComp.height, 1, audioFile.duration, mainComp.frameRate);
                newComp.parentFolder = compFolder;
            mainComp.layers.add(newComp); //добавляем новую композицию с ОСНОВНУЮ 
            if (i==1) { //изменения для первой композиции
                // dur = Math.round(aLey.property("Marker").keyTime(i)/mainComp.frameDuration)*mainComp.frameDuration; //длительность композиции, от начала до 1 маркера
                dur = aLey.property("Marker").keyTime(i) - aLey.inPoint; //длительность композиции, от начала слоя до 1 маркера
                stTimeAudio = 0;
                newComp.duration = dur; //меняем длительность композиции
            }
            else { //для всех других композиций
                try{
                    var keyComm=aLey.property("Marker").keyValue(i-1).comment.split(";");
                    var numComm = currentFormatToTime(keyComm[1], mainComp.frameRate);
                } catch (e) {
                    var numComm = 0;
                }
                timeMarkerBefore = Math.round(aLey.property("Marker").keyTime(i-1)/mainComp.frameDuration)*mainComp.frameDuration;
                if ( i <= numMark) {
                    timeMarker = Math.round(aLey.property("Marker").keyTime(i)/mainComp.frameDuration)*mainComp.frameDuration;
                    dur = timeMarker-timeMarkerBefore; //длительность композиции
                }
                else {
                    dur = audioFile.duration - timeMarkerBefore; //длительность последней композиции
                }
                stTimeAudio = 0-timeMarkerBefore-numComm; //для смещения аудио в композиции по маркеру         
                //mainComp.layer(newComp.name).startTime = timeMarkerBefore; //смещаем эту композицию на тайм лайне, на время маркера
                mainComp.layer(newComp.name).startTime = mainComp.layer(2).outPoint; //смещаем эту композицию на тайм лайне, на время маркера
                newComp.duration = dur - numComm; //меняем длительность композиции
            }
            

            aLey.copyToComp(newComp); //добавляем в прекомпоз аудио файл
            var preCompAudio = newComp.layer(1);
            mainComp.layer(1).audioEnabled = false;
            preCompAudio.startTime = stTimeAudio; //смещаем его, что бы в каждой композиции был свой звук
            preCompAudio.inPoint = 0;
            preCompAudio.outPoint = newComp.duration;
            mainComp.layer(1).audioEnabled = true;
        } 
        
        mainComp.duration = mainComp.layer(1).outPoint;
        
        if (_shift == false) {
            aLey.remove(); //удаляем с таймлинии аудиофайл
            activeComp.remove();
            mainComp.openInViewer();
        }
        

        app.endUndoGroup();

        if (typeof aLey == "undefined") {
            aLey = "";
        }
        return {
            comp: mainComp, // новая созданная композиция "Main"
            audioItem: audioFile, //оригинальный аудио файл в окне Project
            compFolder: compFolder, //папка, куда складываются прекомпозы "Scene 1"
            startComp: activeComp, //композиция, откуда начали весь процесс
            originalLayer: aLey,
        }
    }







    
    /*
           ||\\   //||     //      || ||    ||        ||     || ||        \\             // || ||    ||
           || \\ // ||    // \\       ||\\  ||        ||     ||            \\           //     ||\\  ||
           ||  \\   ||   //   \\   || || \\ ||        ||     || ||          \\   //    //   || || \\ ||
           ||       ||  //=====\\  || ||  \\||        ||     || ||           \\ // \\ //    || ||  \\||
           ||       || //       \\ || ||    ||         \\====|| ||            \\    \\      || ||    ||
    */

        //начинаем функцию построения интерфейса
    function build_pauseRemove_UI (thisObj) {
        
        //собственно главное окошко для нашей панельки
        z_RemovePauses_UI = (thisObj instanceof Panel) ? thisObj : new Window("palette", UI_txt.nameUI.main, undefined, {resizeable: true});
        if (z_RemovePauses_UI != null) {             
            var res = 
            "group { orientation:'column', alignment:['fill', 'fill'], alignChildren:['fill', 'fill'], margins:[2, 2, 2, 2], spacing:2,\
                audL:Panel {alignment:['fill', 'top'], orientation: 'row', alignChildren:['fill', 'top'],  margins:[2, 2, 2, 2], spacing:2,\
                    butt1:Button {alignment:['fill', 'fill']}, \
                    opt: Group { alignment:['fill', 'top'], orientation: 'column', margins:[0, 0 , 0, 0], spacing: 0,\
                        optSec:Group {alignment:['fill', 'top'], alignChildren:['fill', 'top'],  margins:[0, 0 , 0, 0], spacing:2,\
                            txt1: EditText {alignment:['left', 'top'], size: [40, 20], justify: 'right'}, \
                            stText1: StaticText {alignment:['left', 'center'], size: [110, 16]},\
                        },\
                        optFrame:Group {alignment:['fill', 'top'], alignChildren:['fill', 'top'],  margins:[0, 0 , 0, 0], spacing:2,\
                            txt1: EditText {alignment:['left', 'top'], size: [40, 20], justify: 'right'}, \
                            stText1: StaticText {alignment:['left', 'center'], size: [110, 16]},\
                        },\
                    },\
                },\
            }";
            //rTxt:StaticText {text:'Reduce', properties:{multiline:true}}}, \

        
    
            z_RemovePauses_UI.grp = z_RemovePauses_UI.add(res);  //добавляем в нашу панельку только что созданные  кнопки интерфейса
            z_RemovePauses_UI.margins = 10;
            z_RemovePauses_UI.spacing = 3;
            z_RemovePauses_UI.layout.layout(true);
            z_RemovePauses_UI.grp.minimumSize = z_RemovePauses_UI.grp.size;

            z_RemovePauses_UI.layout.layout(true);
            z_RemovePauses_UI.layout.resize();
            z_RemovePauses_UI.onResizing = z_RemovePauses_UI.onResize = function() {
                z_RemovePauses_UI.layout.resize();
            };
            


            var remPaus = z_RemovePauses_UI.grp.audL.butt1;     //разбиваем звук по композициям по тишине
                remPaus.text = UI_txt.main.remPaus.text;
                remPaus.helpTip = UI_txt.main.remPaus.helpTip;
            var sec = z_RemovePauses_UI.grp.audL.opt.optSec.txt1; //значение в секундах по которому будем определять паузы в голосе
                sec.text = "1.2";
                sec.helpTip = UI_txt.main.aButt_pause.helpTip1;
                z_RemovePauses_UI.grp.audL.opt.optSec.stText1.text = UI_txt.main.aButt_pause.stText1;
                z_RemovePauses_UI.grp.audL.opt.optSec.stText1.helpTip = UI_txt.main.aButt_pause.helpTip1;

            var frame = z_RemovePauses_UI.grp.audL.opt.optFrame.txt1; //значение в кадрах, на которые будем подрезать паузу с начала и с конца
                frame.text = "15";
                frame.helpTip = UI_txt.main.aButt_pause.helpTip2;
                z_RemovePauses_UI.grp.audL.opt.optFrame.stText1.text = UI_txt.main.aButt_pause.stText2;
                z_RemovePauses_UI.grp.audL.opt.optFrame.stText1.helpTip = UI_txt.main.aButt_pause.helpTip2;

            
            if (z_RemovePauses_UI != null) {
                if (z_RemovePauses_UI instanceof Window) {
                    z_RemovePauses_UI.center();
                    z_RemovePauses_UI.show();
                } else {
                    z_RemovePauses_UI.layout.layout(true);
                }
            }
        }
        

               
        

       

        // всякие галочки в настройках, которые сохранены
        var settingNameArr = ["sec", "frames"];
        var valueNameArr = [sec, frame];
        for (var i=0; i < settingNameArr.length; i++){
            var sett = settingNameArr[i];
            var param = valueNameArr[i];
            var zz = app.settings.haveSetting("removePaused_alexIV", sett);
            if (zz == true || zz == "true") {
                var zar1 = app.settings.getSetting("removePaused_alexIV",sett);
                param.text = zar1;
                // var zar2 = ('true' == ''+zar1); //прикольный способ сделать из строки булевую операцию
            }
        }

        sec.onChange = function() {
            var val1 = Number(sec.text);
            if (isNaN(val1) || val1 <= 0) {
                alert("Error in determining the pause in seconds\r(the first line)\rEnter only numbers, you can use fractions.\r1 sec = 1\the value will be reset to the default value = 1.2");
                app.settings.saveSetting("removePaused_alexIV","sec", 1.2);
                sec.text = "1.2"
            } else {
                app.settings.saveSetting("removePaused_alexIV","sec",val1);
            }
        }

        frame.onChange = function() {
            var val2 = Number(frame.text);
            if (isNaN(val2) || val2 < 0) {
                alert("Error in determining the number of frames to crop\r(the second line)\rEnter only numbers.\rThe value will be reset by default to 15 frames");
                app.settings.saveSetting("removePaused_alexIV","frames", 15);
                frame.text = "15";
            } else {
                app.settings.saveSetting("removePaused_alexIV","frames",val2);
            }
        }
        
        //действия на кнопки
        remPaus.onClick = function(){ 
            var activeComp = app.project.activeItem;
            if (activeComp == undefined) {
                alert(UI_txt.audToComp.compNotSel);
                return;
            }
            var aLey = activeComp.selectedLayers;
            if (aLey.length == 0 || aLey == undefined) {
                alert(UI_txt.audToComp.selLay);
                return;
            }
                aLey = aLey[0];
            if ((aLey.hasAudio == false && aLey.hasVideo == true) || aLey.source instanceof CompItem) {
                alert( UI_txt.audToComp.selAud + ",\r" + UI_txt.audToComp.notComp);
                return;
            } 

            var key = ScriptUI.environment.keyboardState.shiftKey;
            var curObj = audioToComp(key);
            if (curObj != null) {
                var toRender = [{
                    audioItem: curObj.audioItem,
                    fullFilePath: curObj.audioItem.mainSource.file.fsName,
                    fullFolderPath: curObj.audioItem.mainSource.file.parent,
                    'typeof': "comp",
                    item: curObj.comp
                }];         
            }

        }

    }
    build_pauseRemove_UI(thisObj);
}
run(this)