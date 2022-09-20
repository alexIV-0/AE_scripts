buildUI = function (thisObj) //начинаем функцию построения интерфейса
{
var myPalette = (thisObj instanceof Panel) ? thisObj : new Window("palette",  "BG Render", undefined, {resizeable:true}); //собственно главное окошко для нашей панельки

var res =  
			"Group {\
				orientation:'column',\
    			alignChildren: ['left', 'top'],\
    			margins: 0,\
    			spacing: 0,\
					line1 : Group {\
						name1: EditText {size: ['241', '20'] },\
						}\
					line2: Group {\
						name2: EditText {size: ['241', '16'], text: folder2, alignment: ['fill','top'] },\
						}\
					line3 : Group {\
						butt1: Button {size: ['74', '25'], text: 'BG Render'},\
						butt2: Button {size: ['74', '25'], text: 'add to RQ', alignment: ['fill','top']},\
						butt3: Button {size: ['74', '25'], text: 'Open', alignment: ['fill','top']},\
						}\
                      line4: Group {\
                           butt1: DropDownList {size: ['241','25']},\
                           }\
			}"

myPalette.grp = myPalette.add(res);  //добавляем в нашу панельку только что созданные  кнопки интерфейса

//--------вытаскиваем предыдущие настройки для папки по умолчанию-----
if (app.settings.haveSetting("lastFolder","path")==true) {        //проверяем - есть ли вообще такие настройки?
        var getFolder = app.settings.getSetting("lastFolder","path");   //если есть - присваиваем их переменной getFolder
        myPalette.grp.line2.name2.text = getFolder;         // вписываем в нашу панельку эти данные, т.е. путь к нашей последней папки
        }

var compStore = null; //создаем пустую переменную
if (app.activeViewer.type != ViewerType.VIEWER_COMPOSITION) { 
    //alert("Это можно не выводить. Просто во вьювере ничего не открыто"); 
    }
else {
	app.activeViewer.setActive(); 
        compStore = app.project.activeItem; //присваиваем переменной активную композицию
        }
    
var aComp = app.project.activeItem;
var tempComp = app.project.items.addComp ("temp", 720, 576, 1, 1, 25);
var myTempRQItem = app.project.renderQueue.items.add(tempComp) ;
var renderItem = new Array();
	for(var i=0; i<app.project.renderQueue.item(1).outputModules[1].templates.length; i++) {
	    if (app.project.renderQueue.item(1).outputModules[1].templates[i].indexOf("_HIDDEN") != 0){ //Don't add hidden templates.
    	myPalette.grp.line4.butt1.add("item",app.project.renderQueue.item(1).outputModules[1].templates[i]);
        }
        if (app.project.renderQueue.item(1).outputModules[1].templates[i] == app.project.renderQueue.item(1).outputModules[1].name){
         var defName = i;
     	}
	}
	tempComp.remove();
	myPalette.grp.line4.butt1.selection = defName; 
	var originalProject = app.project.items.length;
	if (originalProject == 0) {
        app.project.close(CloseOptions.DO_NOT_SAVE_CHANGES);
    }

if ( compStore != null ) { compStore.openInViewer(); } // Восстанавливаем текущую композицию

myPalette.grp.line1.name1.text.onChange = function () { //пока это не работает, но идея такая: брать имя либо слоя, либо композиции, но иметь возможность редактирования, т.е. при клике название выделяется.
		var activeComp = app.project.activeItem.name; //имя активной композиции
		var activeLayer = app.project.activeItem.selectedLayers; //имя активного слоя
		if (activeLayer.length == 1 ){  //если выбран 1 слой 
			this.text = activeLayer[0].name;   //вписываем имя слоя в текстовую ячейку для названия
			this.active = true;   //делаем его активным для редактирования
		}
		else {  //если выбрано больше 1 слоя или не выбрано вообще
			this.text = activeComp; //вписываем имя композиции в текстовую ячейку для названия
			this.active = true; //делаем его активным для редактирования 
		}
}

myPalette.grp.line3.butt3.onClick = function () { //указываем папку для рендера 3 кнопка("Open")
					var defaultFolder = myPalette.grp.line2.name2.text;
					if ($.os.indexOf("Windows") != -1){	// вот тут я не совсем понимаю, что это, т.к. просто скопировал это из другого скрипта
						defaultFolder = defaultFolder.replace("\\", "\\\\"); // но (On Windows, escape backslashes first) вот такой был коментарий на англ
                        }
					
					var folder = Folder.selectDialog("Output To Folder", defaultFolder); //указываем папку куда будем сохранять все файлы
					if (folder != null){ //если папка указана, т.е. мы её выбрали
						myPalette.grp.line2.name2.text = folder.fsName; //вписываем в текстовый слой этот путь
                        }
                    var setFolder = app.settings.saveSetting("lastFolder","path",folder.fsName); //сохраняем настройки. если мы потом укажем другую папку - она опять сохраниться, и при открытии программы уже будет выбрана
				}

myPalette.grp.line3.butt2.onClick = function () {   //добавляем выбранную композицию в Render Queue
				var pathFile = myPalette.grp.line2.name2.text;  //берем путь к файлу из текстового слоя 2
				var nameFile = myPalette.grp.line1.name1.text;  //берем имя файла из текстового слоя 1
				oM = app.project.renderQueue.items.add(app.project.activeItem); //добавляем активный проект в RQ
				oM.outputModule(1).file = new File(pathFile+"\\"+nameFile+".avi");  //указываем что будем сохранять в ту же папку с именем, которое мы вписали в текстовый слой 1
				oM.outputModule(1).applyTemplate(myPalette.grp.line4.butt1.selection);
				}
            
myPalette.grp.line3.butt1.onClick = function () { //функция рэндера из командной строки
                var originalProject = File(app.project.file.fsName); //присваиваем переменной имя открытого проекта (нам он потом понадобиться чтобы его открыть)
                app.project.save();  //сохраняем данный проект
	  			for (i=1; i<=app.project.renderQueue.items.length; i++) { //очищаем все файлы из Render Queue
 						   app.project.renderQueue.item(1).remove();
				}
				var pathFile = myPalette.grp.line2.name2.text;  //берем путь для файла из 2 строки
				var nameFile = myPalette.grp.line1.name1.text;  //берем имя для файла из 1 строки
                  oM = app.project.renderQueue.items.add(app.project.activeItem); //добавляем активный проект в RQ
				oM.outputModule(1).file = new File(pathFile+"\\"+nameFile+".avi");  //указываем что будем сохранять в ту же папку с именем, которое мы вписали в текстовый слой 1
				oM.outputModule(1).applyTemplate(myPalette.grp.line4.butt1.selection);
				var newaepPathName = pathFile + "\\" + nameFile +".aep"; //полный путь файла проекта с расширением
				var f = new File(newaepPathName); //создаем новый файл проекта, который и будем рендерить
				app.project.save(f); //сохраняем проект в только что созданый файл
				
                  var aeSupFilesPath = Folder.appPackage.fsName; // папка с программой, т.е. папка, где находиться файл запуска программы?
 
				var renderStr = new Array ("@ECHO OFF", "SETLOCAL enabledelayedexpansion", "ECHO.", "ECHO.BG Renderer", "ECHO.", "chcp 65001>NUL", "ECHO.Launching aerender...");  //создаем массив со строками, которые потом будем вписывать в cmd файл. всего не понимаю, единственное что понял это без "chcp 65001>NUL" - русские символы не будут правильно отображаться в командной строке
//-- далее начинаем заполнять остальной массив renserStr, т.е. добавлять данные для рендера из командной строки. Здесь используются команды для командной строки, которые записываюсть просто в виде строк, т.к. исполняться они будут в командной строке.
                   renderStr.push("START \"RENDERING: " + nameFile + "\" /B /WAIT /D \"" + aeSupFilesPath + "\" aerender.exe -mp -project \"" + newaepPathName + "\""); 
// 3? - \-часть регулярных выражений, которая экранирует стоящий после него символ и он игнорируется javascript`ом т.е. \" - это не начало или конец строки, а симвом " внутри строки. 
//поэтому строка запишится следующим образом: START "RENDERING: имя файла"/B /WAIT /D "путь до файла aerender.exe (т.е. С:\Program Files\Adobe\Adobe After Effects CS6\Support Files" aerender.exe) (не понимаю только почему файл aerender.exe записывается после кавычек) 
//-mp(использование всех ядер процессора для рендера) 
//-project "путь до файла проекта" 
//-comp "название композиции в after`e, которое будем выводить на рендер (в моем случае "Slide_out")"
//-output "путь и название файла, т.е. куда и как будем называть получившийся файл + расширение .avi"
				renderStr.push("RMDIR " + "\""+pathFile+"\\"+nameFile+".aep Logs\"" + " /s /q"); //удаляет папку с логами
				renderStr.push("del \"" + pathFile+"\\"+nameFile+".aep\""); //удаляет сам файл проекта
				renderStr.push("del %0"); // самоуничтожение .cmd
				//все, все строки готовы, осталось их записать в файл cmd
				var pathCmd = pathFile + "\\"+ nameFile + ".cmd"; //прописываем путь, куда будем сохранять cmd файл, и имя файла
				var cmdFile = new File(pathCmd); //создаем cmd файл в папке с проектом и названием как у проекта
				cmdFile.encoding = "UTF-8"; //устанавливаем кодировку "UTF-8". 
				cmdFile.open('w'); //открываем только что созданный файл для записи
				for (var i = 0; i < renderStr.length; i++) { //вписываем построчно весь массив renderStr
    				cmdFile.writeln(renderStr[i]); 
    				}
				cmdFile.close(); //закрываем файл
				cmdFile.execute(); //исполняем файл, т.е. запускам.
                //P.S - рендер файла будет происходить с настройками по умолчанию, т.е теми что у вас заданы в Output Module default
                  app.open(originalProject); //открываем оригинальный проект
				}


	
if(myPalette instanceof Window) {
    myPalette.center();
	myPalette.show();
	}
else {
myPalette.layout.layout(true);
	}
}

buildUI(this);
