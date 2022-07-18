/*
	ver. 3.0 полностью переписан алгоритм проверок. 
	Теперь проверяем на текст каждую секунду и если есть текст - записываем его.
	так же постоянно сравниваем с предыдущим текстом, чтобы исключить повторения.

	ver. 3.1
	добавлена возможность считывание выключенного текста, который является trakMATTE для нижележащего слоя 
*/

Array.prototype.indexOf = 
function(elem)
{
	for (var i = 0; i < this.length; i++)
		if (this[i] == elem)
			return i;
	
	return -1;
}


function findText(cmp, t)
{
  	var res = [];
  	for (var i = 1; i <= cmp.numLayers; i++)
  	{
    	var l = cmp.layer(i);
    	if (l.inPoint < t && l.outPoint > t ) 
    	{
    	  //continue;
    		if (l.activeAtTime(t) && l instanceof AVLayer && l.source instanceof CompItem)
    		{
    		  res = res.concat(findText(l.source, t - l.startTime));
    		  continue;
    		}
    		if (!(l instanceof TextLayer) || (!l.activeAtTime(t) && !l.isTrackMatte))
    		  continue;
    		res.push(l.text.sourceText.value.text.replace(/\r/g," "));
  		}
}
  return res;
}

function main()
{
    if (!app.project.file) { //если проект не сохранен, выдается сообщение о сохранении
        alert ("Сохраните проект");
        return;
    }
	else var projName = app.project.file.displayName;
	var cmp = app.project.activeItem;
	if (!(cmp instanceof CompItem))
	{
		alert("select comp plz");
		return;
	}
	var step = 1;
	var texts = [];
	for (var t = 0; t < cmp.duration; t += step)
		texts = texts.concat(findText(cmp, t));

	//var res = texts.filter( (elem, id, arr) => arr.indexOf(elem) == id );
	//не прокатило.
	
	var res = [];
	for (var i = 0; i < texts.length; i++)
		if (texts.indexOf(texts[i]) == i)
			res.push(texts[i]);

	//res = res.join("\r");
	//вот отсюда можно дописывать сохранение. texts — Массив из строк.

        projName = projName.substr(0, projName.lastIndexOf("."));
        var promptPath = "Save .txt file";
        if ($.os.match(/Windows/)) {
        var defaultName = "/Desktop/" + projName + ".txt";
    } else if ($.os.match(/Mac/)) {
        var defaultName = "~/Desktop/" + projName + ".txt";
    } else {
        var defaultName = projName + ".txt";
        }
    var extension = "Text:*.txt";
        // create txt file
        var tempFile = new File (defaultName);
        var myFile = tempFile.saveDlg(promptPath,extension); // create save dialog
        if (myFile != null) {
            myFile.open("w"); // open file
            // function which generate txt file text
            //myFile.write(res);
            for (var i = 0; i < res.length; i++) {
  				myFile.write(res[i] + "\r");
            }
            myFile.changePath(myFile); // save in path
            myFile.close(); // close file
            }
            
        //alert (res);
	//texts.join("\r");
}

app.beginUndoGroup ("-=Save Text to TXT=-");
main();
app.endUndoGroup();