test_fileInFolder()

function test_fileInFolder(){
    var folder = Folder.desktop;
    var allFiles = folder.getFiles();
    var onlyFiles = [];

    for (var i = 0; i < allFiles.length; i++){
        var curentItem = allFiles[i];
        if (curentItem instanceof File){
            onlyFiles.push(curentItem);
        }
    }

    alert(onlyFiles)
}