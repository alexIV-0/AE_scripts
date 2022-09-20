
function run(thisObj){

    //MAIN 01 ============= создание всех пресетов, картинок и настроек ==========================
    function getUserDataFolder() {
        if(!isSecurityPrefSet()) {
          alert("Network access disabled. To allow, please go to Preferences > General and check off 'Allow Scripts to Write Files and Access Network' to resolve.");
          try {
            app.executeCommand(app.findMenuCommandId("General..."));
          } catch (e) {
            alert(e);
          }
          if(!isSecurityPrefSet()){
            return null;
          }
        }
    
        var scriptName = "Converter";
        var userDataFolder = Folder.userData;
        var scriptFolderInUserData = new Folder(userDataFolder.toString() + "/ADME/Converter");
        if(!scriptFolderInUserData.exists) {
          scriptFolderInUserData = scriptFolderInUserData.create();
          if(!scriptFolderInUserData) {
            alert("Error creating " + scriptName + " files.\nCouldn't create folder " + scriptName + " in " + userDataFolder.toString());
            scriptFolderInUserData = Folder.temp;
            return  scriptFolderInUserData.toString();
          }
        }
        scriptFolderInUserData = new Folder(scriptFolderInUserData.toString());
        if(!scriptFolderInUserData.exists) {
          scriptFolderInUserData = scriptFolderInUserData.create();
        }
        return  scriptFolderInUserData.toString();
        }
    
        function createResourceFile(filename, binaryString, resourceFolder, replaceExisting, binnary) {
        if(!isSecurityPrefSet()) {
          alert("Network access disabled. To allow, please go to Preferences > General and check off 'Allow Scripts to Write Files and Access Network' to resolve.");
          try {
            app.executeCommand(app.findMenuCommandId("General..."));
          } catch (e) {
            alert(e);
          }
          if(!isSecurityPrefSet())
          return  null;
        }
        if(replaceExisting === undefined){
          replaceExisting = false;
        }
        var myFolder = new Folder(resourceFolder);
        if(!Folder(myFolder).exists){
          myFolder.create();
        }
        var myFile = new File(resourceFolder + "/" + filename);
        if(myFile.exists && replaceExisting === true){
          myFile.remove();
        }
        if(!myFile.exists){
          if(binnary === undefined){
            myFile.encoding = "BINARY";
          }
          myFile.open("w");
          myFile.write(binaryString);
          myFile.close();
        }
        return  myFile;
        }
    
        function getFileFromUserFolder(fileName, folderName){
        var userDataFolder = getUserDataFolder();
        if(userDataFolder !== null) {
          if(folderName === undefined) {
            var folderName = "/presets";
          } else if(!(typeof folderName == "string")) {
            alert("Error 02 in " + arguments.callee.name + "\n\nFolder Name " + folderName.toString() + " isn't a String. Please check it");
            return null;
          } else if(folderName[0] !== "/") {
            folderName = "/" + folderName;
          }
          var scriptFolderInUserData = new Folder(userDataFolder + folderName);
          if(fileName === undefined) {
            alert("Error 03 in " + arguments.callee.name + "\n\nFile Name " + fileName.toString() + " isn't a String. Please check it");
            return null;
          } else if(!(typeof fileName == "string")) {
            alert("Error 04 in " + arguments.callee.name + "\n\nFile Name " + fileName.toString() + " isn't a String. Please check it");
            return null;
          } else if(fileName.toString()[0] !== "/") {
            fileName = "/" + fileName.toString();
          }
          var presetFile = new File(scriptFolderInUserData.toString() + fileName);
          if(!presetFile.exists){
            alert("Error 05 in " + arguments.callee.name + "\n\nPreset File named "  + fileName + " doesn't exists");
            return null;
          }
          return presetFile;
        } else {
          alert("Error 01 in " + arguments.callee.name + ".\n\nUnable to reach folder " + scriptName + " in " + Folder.userData.toString());
          return null;
        }
        }
    
        function isSecurityPrefSet() {
            try {
              var securitySetting = app.preferences.getPrefAsLong("Main Pref Section","Pref_SCRIPTING_FILE_NETWORK_SECURITY");
              return  Boolean(securitySetting);
            } catch (e) {
              alert("Error 01 in " + arguments.callee.name + "\n\nUnable to call Preferences.\n\nMore info:\n" + e);
              return  false;
            }
          }
      
      
        function createPress() { //тестовая картинка или пресет. в переменную указываем только сам бинарный код
          var binarStr = "RIFX\x00\x00\x15\u008CFaFXhead\x00\x00\x00\x10\x00\x00\x00\x03\x00\x00\x00D\x00\x00\x00\x01\x01\x00\x00\x00LIST\x00\x00\x15hbescbeso\x00\x00\x008\x00\x00\x00\x01\x00\x00\x00\x01\x00\x00\x00\x00\x00\x00]\u00A8\x00\x1D\u00F8R\x00\x00\x00\x00\x00d\x00d\x00d\x00d?\u00F0\x00\x00\x00\x00\x00\x00?\u00F0\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\u00FF\u00FF\u00FF\u00FFLIST\x00\x00\x00\u00ACtdsptdot\x00\x00\x00\x04\u00FF\u00FF\u00FF\u00FFtdpl\x00\x00\x00\x04\x00\x00\x00\x02LIST\x00\x00\x00@tdsitdix\x00\x00\x00\x04\u00FF\u00FF\u00FF\u00FFtdmn\x00\x00\x00(ADBE Effect Parade\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00LIST\x00\x00\x00@tdsitdix\x00\x00\x00\x04\x00\x00\x00\x00tdmn\x00\x00\x00(Pseudo/PSE Effect Name\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00tdsn\x00\x00\x00\x07Number\x00\x00LIST\x00\x00\x00dtdsptdot\x00\x00\x00\x04\u00FF\u00FF\u00FF\u00FFtdpl\x00\x00\x00\x04\x00\x00\x00\x01LIST\x00\x00\x00@tdsitdix\x00\x00\x00\x04\u00FF\u00FF\u00FF\u00FFtdmn\x00\x00\x00(ADBE End of path sentinel\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00LIST\x00\x00\x13\u00ECsspcfnam\x00\x00\x000\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00LIST\x00\x00\b@parTparn\x00\x00\x00\x04\x00\x00\x00\ntdmn\x00\x00\x00(Pseudo/PSE Effect Name-0000\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00pard\x00\x00\x00\u0094\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x02\x00\x00\x00\x00\x00\x00\x00\x0E\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\u00FF\u00FF\u00FF\u00FF\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00tdmn\x00\x00\x00(Pseudo/PSE Effect Name-0001\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00pard\x00\x00\x00\u0094\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\nNumber\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\u00CB\x18\u0096\u0080K\x18\u0096\u0080\u00C2\u00C8\x00\x00B\u00C8\x00\x00?\u0080\x00\x00\x00\x02\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00tdmn\x00\x00\x00(Pseudo/PSE Effect Name-0002\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00pard\x00\x00\x00\u0094\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\nMultiplier\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00?\u0080\x00\x00G\u00C3P\x00?\u0080\x00\x00A \x00\x00?\u0080\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00tdmn\x00\x00\x00(Pseudo/PSE Effect Name-0003\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00pard\x00\x00\x00\u0094\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\rOther\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00tdmn\x00\x00\x00(Pseudo/PSE Effect Name-0004\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00pard\x00\x00\x00\u0094\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\nDecimal Digits\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00A \x00\x00\x00\x00\x00\x00A \x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00tdmn\x00\x00\x00(Pseudo/PSE Effect Name-0005\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00pard\x00\x00\x00\u0094\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x043 character separator\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00pdnm\x00\x00\x00\x01\x00\x00tdmn\x00\x00\x00(Pseudo/PSE Effect Name-0006\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00pard\x00\x00\x00\u0094\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x07Separator\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x01\x00\x03\x00\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00pdnm\x00\x00\x00\x12,|.|`|space (\" \")\x00tdmn\x00\x00\x00(Pseudo/PSE Effect Name-0007\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00pard\x00\x00\x00\u0094\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x04Decimal Comma\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00pdnm\x00\x00\x00\x01\x00\x00tdmn\x00\x00\x00(Pseudo/PSE Effect Name-0008\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00pard\x00\x00\x00\u0094\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x04Right Symbol\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00pdnm\x00\x00\x00\x01\x00\x00tdmn\x00\x00\x00(Pseudo/PSE Effect Name-0009\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00pard\x00\x00\x00\u0094\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x0E\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00LIST\x00\x00\x0B`tdgptdsb\x00\x00\x00\x04\x00\x00\x00\x01tdsn\x00\x00\x00\x07Number\x00\x00tdmn\x00\x00\x00(Pseudo/PSE Effect Name-0000\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00LIST\x00\x00\x00\u00DAtdbstdsb\x00\x00\x00\x04\x00\x00\x00\x03tdsn\x00\x00\x00\x01\x00\x00tdb4\x00\x00\x00|\u00DB\u0099\x00\x01\x00\x01\x00\x00\x00\x01\x00\x00\x00\x00\x02X?\x1A6\u00E2\u00EB\x1CC-?\u00F0\x00\x00\x00\x00\x00\x00?\u00F0\x00\x00\x00\x00\x00\x00?\u00F0\x00\x00\x00\x00\x00\x00?\u00F0\x00\x00\x00\x00\x00\x00\x00\x00\x00\x04\x04\u00C0\u00C0\u00C0\u00FF\u00C0\u00C0\u00C0\x00\x00\x00\x00\u0080\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00cdat\x00\x00\x00(\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00tdpi\x00\x00\x00\x04\x00\x00\x00\x0Etdmn\x00\x00\x00(Pseudo/PSE Effect Name-0001\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00LIST\x00\x00\x00\u00F4tdbstdsb\x00\x00\x00\x04\x00\x00\x00\x01tdsn\x00\x00\x00\x07Number\x00\x00tdb4\x00\x00\x00|\u00BD\u0099\x00\x01\x00\x01\x00\x00\x00\x01\x00\u00FF\x00\x00]\u00A8\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00cdat\x00\x00\x00(?\u00F0\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00tdum\x00\x00\x00\b\u00C0Y\x00\x00\x00\x00\x00\x00tduM\x00\x00\x00\b@Y\x00\x00\x00\x00\x00\x00tdmn\x00\x00\x00(Pseudo/PSE Effect Name-0002\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00LIST\x00\x00\x00\u00F8tdbstdsb\x00\x00\x00\x04\x00\x00\x00\x01tdsn\x00\x00\x00\x0BMultiplier\x00\x00tdb4\x00\x00\x00|\u00BD\u0099\x00\x01\x00\x01\x00\x00\x00\x01\x00\u00FF\x00\x00]\u00A8\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00cdat\x00\x00\x00(?\u00F0\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00tdum\x00\x00\x00\b?\u00F0\x00\x00\x00\x00\x00\x00tduM\x00\x00\x00\b@$\x00\x00\x00\x00\x00\x00tdmn\x00\x00\x00(Pseudo/PSE Effect Name-0003\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00LIST\x00\x00\x00\u00D2tdbstdsb\x00\x00\x00\x04\x00\x00\x00\x01tdsn\x00\x00\x00\x06Other\x00tdb4\x00\x00\x00|\u00BD\u0099\x00\x01\x00\x01\x00\x00\x00\x01\x00\x04\x00\x00]\u00A8\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00cdat\x00\x00\x00(\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00tdmn\x00\x00\x00(Pseudo/PSE Effect Name-0004\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00LIST\x00\x00\x00\u00FCtdbstdsb\x00\x00\x00\x04\x00\x00\x00\x01tdsn\x00\x00\x00\x0FDecimal Digits\x00\x00tdb4\x00\x00\x00|\u00BD\u0099\x00\x01\x00\x01\x00\x00\x00\x01\x00\u00FF\x00\x00]\u00A8\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00cdat\x00\x00\x00(\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00tdum\x00\x00\x00\b\x00\x00\x00\x00\x00\x00\x00\x00tduM\x00\x00\x00\b@$\x00\x00\x00\x00\x00\x00tdmn\x00\x00\x00(Pseudo/PSE Effect Name-0005\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00LIST\x00\x00\x00\u00E2tdbstdsb\x00\x00\x00\x04\x00\x00\x00\x01tdsn\x00\x00\x00\x163 character separator\x00tdb4\x00\x00\x00|\u00DB\u0099\x00\x01\x00\x01\x00\x00\x00\x01\x00\x04\x00\x00]\u00A8?\x1A6\u00E2\u00EB\x1CC-?\u00F0\x00\x00\x00\x00\x00\x00?\u00F0\x00\x00\x00\x00\x00\x00?\u00F0\x00\x00\x00\x00\x00\x00?\u00F0\x00\x00\x00\x00\x00\x00\x00\x00\x00\x04\x04\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00cdat\x00\x00\x00(?\u00F0\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00tdmn\x00\x00\x00(Pseudo/PSE Effect Name-0006\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00LIST\x00\x00\x00\u00D6tdbstdsb\x00\x00\x00\x04\x00\x00\x00\x01tdsn\x00\x00\x00\nSeparator\x00tdb4\x00\x00\x00|\u00DB\u0099\x00\x01\x00\x01\x00\x00\x00\x01\x00\x04\x00\x00]\u00A8?\x1A6\u00E2\u00EB\x1CC-?\u00F0\x00\x00\x00\x00\x00\x00?\u00F0\x00\x00\x00\x00\x00\x00?\u00F0\x00\x00\x00\x00\x00\x00?\u00F0\x00\x00\x00\x00\x00\x00\x00\x00\x00\x04\x04\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00cdat\x00\x00\x00(?\u00F0\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00tdmn\x00\x00\x00(Pseudo/PSE Effect Name-0007\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00LIST\x00\x00\x00\u00DAtdbstdsb\x00\x00\x00\x04\x00\x00\x00\x01tdsn\x00\x00\x00\x0EDecimal Comma\x00tdb4\x00\x00\x00|\u00DB\u0099\x00\x01\x00\x01\x00\x00\x00\x01\x00\x04\x00\x00]\u00A8?\x1A6\u00E2\u00EB\x1CC-?\u00F0\x00\x00\x00\x00\x00\x00?\u00F0\x00\x00\x00\x00\x00\x00?\u00F0\x00\x00\x00\x00\x00\x00?\u00F0\x00\x00\x00\x00\x00\x00\x00\x00\x00\x04\x04\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00cdat\x00\x00\x00(\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00tdmn\x00\x00\x00(Pseudo/PSE Effect Name-0008\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00LIST\x00\x00\x00\u00DAtdbstdsb\x00\x00\x00\x04\x00\x00\x00\x01tdsn\x00\x00\x00\rRight Symbol\x00\x00tdb4\x00\x00\x00|\u00DB\u0099\x00\x01\x00\x01\x00\x00\x00\x01\x00\x04\x00\x00]\u00A8?\x1A6\u00E2\u00EB\x1CC-?\u00F0\x00\x00\x00\x00\x00\x00?\u00F0\x00\x00\x00\x00\x00\x00?\u00F0\x00\x00\x00\x00\x00\x00?\u00F0\x00\x00\x00\x00\x00\x00\x00\x00\x00\x04\x04\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00cdat\x00\x00\x00(?\u00F0\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00tdmn\x00\x00\x00(Pseudo/PSE Effect Name-0009\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00LIST\x00\x00\x00\u00E0tdbstdsb\x00\x00\x00\x04\x00\x00\x00\x01tdsn\x00\x00\x00\x07Number\x00\x00tdb4\x00\x00\x00|\u00BD\u0099\x00\x01\x00\x01\x00\x00\x00\x01\x00\x04\x00\x00]\u00A8\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00cdat\x00\x00\x00(\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00tdpi\x00\x00\x00\x04\x00\x00\x00\x0Etdmn\x00\x00\x00(ADBE Group End\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00{\"controlName\":\"Number\",\"matchname\":\"Pseudo/PSE Effect Name\",\"controlArray\":[{\"index\":0,\"name\":\"Number\",\"hold\":false,\"parent\":null,\"type\":\"slider\",\"keyframes\":true,\"invisible\":false,\"default\":1,\"smin\":-100,\"smax\":100,\"vmin\":-10000000,\"vmax\":10000000,\"precision\":2,\"percent\":false,\"pixel\":false},{\"index\":1,\"name\":\"Multiplier\",\"hold\":false,\"parent\":null,\"type\":\"slider\",\"keyframes\":true,\"invisible\":false,\"default\":\"1\",\"smin\":1,\"smax\":10,\"vmin\":1,\"vmax\":100000,\"precision\":0,\"percent\":false,\"pixel\":false},{\"index\":2,\"name\":\"Other\",\"parent\":null,\"type\":\"group\",\"container\":null,\"invisible\":false,\"activeGroup\":true},{\"index\":0,\"name\":\"Decimal Digits\",\"hold\":false,\"parent\":null,\"type\":\"slider\",\"keyframes\":true,\"invisible\":false,\"default\":0,\"smin\":0,\"smax\":10,\"vmin\":0,\"vmax\":10,\"precision\":0,\"percent\":false,\"pixel\":false},{\"index\":1,\"name\":\"3 character separator\",\"hold\":true,\"parent\":null,\"type\":\"checkbox\",\"keyframes\":true,\"invisible\":false,\"default\":true,\"label\":\"\"},{\"index\":2,\"name\":\"Separator\",\"hold\":true,\"parent\":null,\"type\":\"popup\",\"keyframes\":true,\"invisible\":false,\"default\":1,\"options\":\",|.|`|space (\\\" \\\")\",\"active\":true},{\"index\":3,\"name\":\"Decimal Comma\",\"hold\":true,\"parent\":null,\"type\":\"checkbox\",\"keyframes\":true,\"invisible\":false,\"default\":false,\"label\":\"\"},{\"index\":4,\"name\":\"Right Symbol\",\"hold\":true,\"parent\":null,\"type\":\"checkbox\",\"keyframes\":true,\"invisible\":false,\"default\":true,\"label\":\"\"},{\"type\":\"endgroup\"}]}";
            getUserDataFolder();
            var pathUserData = getUserDataFolder();
            createResourceFile ("Converter.ffx", binarStr, pathUserData); // название, бинарный код, папка для созранения.
        }
        createPress();
    
    //MAIN 01 end =================================================================================
    
    
    
    function applyPreset(file, layer, name){
            layer.selected = true;
            layer.applyPreset(file);
            layer.selected = false;
        }
    
    
    function converter (_text1, _text2, _formula, _layerName1, _layerName2) {
    
    var userDataFolder = Folder.userData;
    var pressPath = new File(userDataFolder.toString() + "/ADME/Converter/Converter.ffx");  
    
    if (_text1 != "$ ") var undo = " to " + _layerName2
    else var undo = "";
    app.beginUndoGroup("-="+_layerName1 + undo + "=-");
    
    try {
    
    var tempStartingComp = app.project.activeItem;
    if (!tempStartingComp || !(tempStartingComp instanceof CompItem)) {
      alert("Please select a composition first");
      return;
    }
    
    var selLay = tempStartingComp.selectedLayers;
    
    // CREATE FOLDER HIERARCHY START
    // CREATE FOLDER HIERARCHY END
    
    // CREATE COMPOSITIONS START
      var compcode_comp = tempStartingComp;
    // CREATE COMPOSITIONS END
    
    // Working with comp "-------", varName "compcode_comp";
      compcode_comp.openInViewer();
      var controlLayer = compcode_comp.layers.addText(_text1);
        controlLayer.name = _layerName1 + " (Control)";
        //controlLayer.outPoint = 12.4833203125;
        if (selLay.length >= 1 ) controlLayer.moveBefore(selLay[0]);
        else controlLayer.moveToBeginning();
        controlLayer.startTime = compcode_comp.time;
        var controlLayer_TextProp = controlLayer.property("ADBE Text Properties").property("ADBE Text Document");
        var controlLayer_TextDocument = controlLayer_TextProp.value;
          controlLayer_TextDocument.font = "DINPro-Bold";
          controlLayer_TextDocument.fontSize = 100;
          controlLayer_TextDocument.applyFill = true;
          controlLayer_TextDocument.fillColor = [1,0.80000001192093,0];
          controlLayer_TextDocument.applyStroke = false;
          controlLayer_TextDocument.justification = ParagraphJustification.RIGHT_JUSTIFY;
          controlLayer_TextDocument.tracking = 0;
          if (parseFloat(app.version) >= 13.2 ) {
            controlLayer_TextDocument.verticalScale = 1;
            controlLayer_TextDocument.horizontalScale = 1;
            controlLayer_TextDocument.baselineShift = 0;
            controlLayer_TextDocument.tsume = 0;
          }
          if (parseFloat(app.version) >= 13.6 ) {
            controlLayer_TextDocument.leading = 120.000007629395;
            controlLayer_TextDocument.autoLeading = true;
          }
          controlLayer_TextProp.setValue(controlLayer_TextDocument);
        //controlLayer.property("ADBE Effect Parade").addProperty("Pseudo/0.5476277843744679");
        //controlLayer.property("ADBE Effect Parade").property(1).name = "Number";
        applyPreset(pressPath, controlLayer, "Number");
     
        controlLayer.property("ADBE Transform Group").property("ADBE Position").setValue([1129.3515625,567.952758789062,0]);
        if (_text1 != "$ ") {
            var secondLayer = compcode_comp.layers.addText(_text2);
            secondLayer.name = _layerName2;
            //secondLayer.outPoint = 12.4833203125;
            secondLayer.moveAfter(controlLayer);
            secondLayer.startTime = compcode_comp.time;
            var secondLayer_TextProp = secondLayer.property("ADBE Text Properties").property("ADBE Text Document");
            var secondLayer_TextDocument = secondLayer_TextProp.value;
              secondLayer_TextDocument.font = "DINPro-Regular";
              secondLayer_TextDocument.fontSize = 75;
              secondLayer_TextDocument.applyFill = true;
              secondLayer_TextDocument.fillColor = [0.92156994342804,0.92156994342804,0.92156994342804];
              secondLayer_TextDocument.applyStroke = false;
              secondLayer_TextDocument.justification = ParagraphJustification.RIGHT_JUSTIFY;
              secondLayer_TextDocument.tracking = 0;
              if (parseFloat(app.version) >= 13.2 ) {
                secondLayer_TextDocument.verticalScale = 1;
                secondLayer_TextDocument.horizontalScale = 1;
                secondLayer_TextDocument.baselineShift = 0;
                secondLayer_TextDocument.tsume = 0;
              }
              if (parseFloat(app.version) >= 13.6 ) {
                secondLayer_TextDocument.leading = 120.000007629395;
                secondLayer_TextDocument.autoLeading = true;
              }
              secondLayer_TextProp.setValue(secondLayer_TextDocument);
            applyPreset(pressPath, secondLayer, "Number");
    
            secondLayer.property("ADBE Transform Group").property("ADBE Position").setValue([0 ,87.0369873046875,0]);
    
            secondLayer.selected = false;
        }
        controlLayer.selected = true;
      // Apply parents
      if (_text1 != "$ ") { secondLayer.setParentWithJump(controlLayer);}
    
    
    // Apply expressions to properties
        if (_text1 != "$ ") {
            try {
                secondLayer.property("ADBE Text Properties").property("ADBE Text Document").expression = "n=effect(\"Number\")(\"Number\")*effect(\"Number\")(\"Multiplier\");\nNum=n.toFixed(\'\'+effect(\"Number\")(\"Decimal Digits\"));\nNeg=0;\nx=\'\'+Num;\nif (x.substring(0,1)==\'-\'){\n Neg=1;\n  y=\'-\';}\nelse\n \n  y=\'?\';\nx=x.substring(Neg,x.length);\nif(effect(\"Number\")(\"Decimal Digits\")<=0)\n {dDigits=x;\n fDigits=\'\';\n dDot=\'\'\n }\nelse {\n dDigits=x.substring(0,x.indexOf(\'.\'));\n  fDigits=x.substring((x.indexOf(\'.\')+1),x.length)\n  if(effect(\"Number\")(\"Decimal Comma\")==0) {dDot=\'.\'}\n else {dDot=\',\'}\n }\nif(Neg==0){\nNeg=\'\';}\nelse{if((dDigits==0)&(effect(\"Number\")(\"Decimal Digits\")<1))\n{Neg=\'\';}\nelse\nNeg=\'-\';}\n\nif(effect(\"Number\")(\"3 character separator\")==1) {\n  LOD=dDigits;\n  s = effect(\"Number\")(\"Separator\");\n  if (s == 1) dSep = \",\"\n  else if (s == 2) dSep = \".\"\n else if (s == 3) dSep = \"`\"\n else if (s == 4) dSep = \" \"\n \n  x=dDigits.length;\n dTemp=\'\';\n while(x>3){\n dTemp=dSep+dDigits.substring(x-3,x)+dTemp;\n  x=x-3;\n  }\n dDigits=dDigits.substring(0,x)+dTemp;\n }\n\nif(effect(\"Number\")(\"Right Symbol\")==1){\nRight=text.sourceText;}\nelse{\nRight=\'\';\n}\n\n\nNeg+dDigits+ dDot+fDigits+Right";
              } catch (err) {}
              try {
                secondLayer.property("ADBE Effect Parade").property(1).property("Pseudo/PSE Effect Name-0001").expression = "try{\nn=thisLayer.parent.effect(\"Number\")(\"Number\");\n" + _formula + " \n} catch (err) {value}";
              } catch (err) {}
              try {
                secondLayer.property("ADBE Effect Parade").property(1).property("Pseudo/PSE Effect Name-0002").expression = "try{\nthisLayer.parent.effect(\"Number\")(\"Multiplier\")\n} catch (err) {value}";
              } catch (err) {}
              try {
                secondLayer.property("ADBE Effect Parade").property(1).property("Pseudo/PSE Effect Name-0004").expression = "try {\nn=effect(\"Number\")(\"Number\");\nif (n >= -99.9 && n <= 99.9) 1\nelse 0\n} catch (err) {value}";
              } catch (err) {}
              try {
                secondLayer.property("ADBE Effect Parade").property(1).property("Pseudo/PSE Effect Name-0005").expression = "try{\nthisLayer.parent.effect(\"Number\")(\"3 character separator\")\n} catch (err) {value}";
              } catch (err) {}
              try {
                secondLayer.property("ADBE Effect Parade").property(1).property("Pseudo/PSE Effect Name-0006").expression = "try{\nthisLayer.parent.effect(\"Number\")(\"Separator\")\n} catch (err) {value}";
              } catch (err) {}
              try {
                secondLayer.property("ADBE Effect Parade").property(1).property("Pseudo/PSE Effect Name-0007").expression = "try{\nthisLayer.parent.effect(\"Number\")(\"Decimal Comma\")\n} catch (err) {value}";
              } catch (err) {}
              try {
                secondLayer.property("ADBE Effect Parade").property(1).property("Pseudo/PSE Effect Name-0008").expression = "try{\nthisLayer.parent.effect(\"Number\")(\"Right Symbol\")\n} catch (err) {value}";
              } catch (err) {}
          }
          if (_text1 != "$ ") {var exp = "Neg+dDigits+dDot+fDigits+Right"}
          else {var exp = "Neg+Right+dDigits+dDot+fDigits"}
          try {
            controlLayer.property("ADBE Text Properties").property("ADBE Text Document").expression = "n=effect(\"Number\")(\"Number\")*effect(\"Number\")(\"Multiplier\");\nNum=n.toFixed(\'\'+effect(\"Number\")(\"Decimal Digits\"));\nNeg=0;\nx=\'\'+Num;\nif (x.substring(0,1)==\'-\'){\n Neg=1;\n  y=\'-\';}\nelse\n \n  y=\'?\';\nx=x.substring(Neg,x.length);\nif(effect(\"Number\")(\"Decimal Digits\")<=0)\n {dDigits=x;\n fDigits=\'\';\n dDot=\'\'\n }\nelse {\n dDigits=x.substring(0,x.indexOf(\'.\'));\n  fDigits=x.substring((x.indexOf(\'.\')+1),x.length)\n  if(effect(\"Number\")(\"Decimal Comma\")==0) {dDot=\'.\'}\n else {dDot=\',\'}\n }\nif(Neg==0){\nNeg=\'\';}\nelse{if((dDigits==0)&(effect(\"Number\")(\"Decimal Digits\")<1))\n{Neg=\'\';}\nelse\nNeg=\'-\';}\n\nif(effect(\"Number\")(\"3 character separator\")==1) {\n  LOD=dDigits;\n  s = effect(\"Number\")(\"Separator\");\n  if (s == 1) dSep = \",\"\n  else if (s == 2) dSep = \".\"\n else if (s == 3) dSep = \"`\"\n else if (s == 4) dSep = \" \"\n \n  x=dDigits.length;\n dTemp=\'\';\n while(x>3){\n dTemp=dSep+dDigits.substring(x-3,x)+dTemp;\n  x=x-3;\n  }\n dDigits=dDigits.substring(0,x)+dTemp;\n }\n\nif(effect(\"Number\")(\"Right Symbol\")==1){\nRight=text.sourceText;}\nelse{\nRight=\'\';\n}\n\n\n"+exp;
          } catch (err) {}
          try {
            controlLayer.property("ADBE Effect Parade").property(1).property("Pseudo/PSE Effect Name-0004").expression = "try {\nn=effect(\"Number\")(\"Number\");\nif (n >= -99.9 && n <= 99.9) 1\nelse 0\n} catch (err) {value}";
          } catch (err) {}
    
    compcode_comp.openInViewer();
    
    return {
      compItem : compcode_comp
    };
    
    } catch (e) {
      alert (e.toString() + "\nScript File: " + File.decode(e.fileName).replace(/^.*[\|\/]/, '') + 
        "\nFunction: " + arguments.callee.name + 
        "\nError on Line: " + e.line.toString());
    }
    app.endUndoGroup();
    }
    
    
    
    
    
    
    
    
    //=================================================================
    //=================================================================
    //============== построение интерфейса ============================
    //=================================================================
    //=================================================================
    
    function buildUI (thisObj) {//начинаем функцию построения интерфейса
        //собственно главное окошко для нашей панельки
        myPalette = (thisObj instanceof Panel) ? thisObj : new Window("palette", "Converter | ADME", undefined, {resizeable: true});
        if (myPalette != null) {
            var res = "group {orientation:'column', alignment:['fill', 'fill'] \
            grp1:Group {orientation:'row', alignment:['fill', 'fill'], alignChildren:['fill', 'fill'], \
                Length:Panel {text:'Length', margins:[2, 8, 2, 2], spacing:2, orientation:'row', alignment:['fill', 'fill'], alignChildren:['fill', 'fill'],  \
                    ft:Button {text:'Ft -> m', helpTip:'Foot to Meter'}, \
                    inch:Button {text:'in -> cm', helpTip:'Inches to Centimeters'}, \
                    mile:Button {text:'Mi -> km', helpTip:'Miles in Kilometers'}}, \
                Mass:Panel {text:'Mass', margins:[2, 8, 2, 2], spacing:2, orientation:'row', alignment:['fill', 'fill'], alignChildren:['fill', 'fill'],  \
                    oz:Button {text:'Oz -> g', helpTip:'Ounce to Gram'}, \
                    pound:Button {text:'lb -> kg', helpTip:'Pound to Kilogram'}}}, \
            grp2:Group {orientation:'row', alignment:['fill', 'fill'], alignChildren:['fill', 'fill'], \
                Speed:Panel {text:'Speed', margins:[2, 8, 2, 2], spacing:2, orientation:'row', alignment:['fill', 'fill'], alignChildren:['fill', 'fill'],  \
                    mph:Button {text:'mph -> kph', helpTip:'Miles per hour to kilometr per hour'}, \
                    mis:Button {text:'mi/s -> km/s', helpTip:'Miles per second to Kilometr per second'}}, \
                Other:Panel {text:'Other', margins:[2, 8, 2, 2], spacing:2, orientation:'row', alignment:['fill', 'fill'], alignChildren:['fill', 'fill'],  \
                    dollar:Button {text:'Dollar'}, \
                    Fr:Button {text:'F -> C', helpTip:'Fahrenheit to Celsius'}, \
                    gal:Button {text:'Gal -> L', helpTip:'Gallon to Liter'}}}}"
            
        //rTxt:StaticText {text:'Reduce', properties:{multiline:true}}}, \
            myPalette.grp = myPalette.add(res);  //добавляем в нашу панельку только что созданные  кнопки интерфейса
            myPalette.margins = 5;
            myPalette.spacing = 2;
            myPalette.layout.layout(true);
            //myPalette.grp.minimumSize = myPalette.grp.size;
    
    
            myPalette.grp.grp1.Length.ft.onClick = function(){
                //converter (_text1, _text2, _formula, _layerName1, _layerName2)
                converter(" ft", " m", "n/3.281", "Foot", "Meter");
            }
    
            myPalette.grp.grp1.Length.inch.onClick = function(){
                converter(" in", " cm", "n*2.54", "Inches", "Centimeter");
            }
            myPalette.grp.grp1.Length.mile.onClick = function(){
                converter(" mi", " km", "n*1.609", "Mile", "Kilometer");
            }
            myPalette.grp.grp1.Mass.oz.onClick = function(){
                converter(" oz", " g", "n* 28.35", "Ounce", "Gramms");
            }
            myPalette.grp.grp1.Mass.pound.onClick = function(){
                converter(" lb", " kg", "n/2.205", "Pound", "Kilogram");
            }
            myPalette.grp.grp2.Speed.mph.onClick = function(){
                converter(" mph", " kph", "n*1.609", "Mph", "Kph");
            }
            myPalette.grp.grp2.Speed.mis.onClick = function(){
                converter(" mi/s", " km/s", "n*1.609", "Mi/s", "Km/s");
            }
            myPalette.grp.grp2.Other.dollar.onClick = function(){
                converter("$ ", "", 1, "Dollar", "");
            }
            myPalette.grp.grp2.Other.Fr.onClick = function(){
                converter(" °F", " °C", "(n-32)*5/9;", "Fahrenheit", "Celsius");
            }
            myPalette.grp.grp2.Other.gal.onClick = function(){
                converter(" gal", " L", "n*3.785", "Gallon", "Liter");
            }
            /*
            myPalette.grp.grp1.Length.ft.helpTip = "Foot to Meter";
            myPalette.grp.grp1.Length.inch.helpTip = "Inch to CantisecondLayer";
            myPalette.grp.grp1.Length.mile.helpTip = "Mile to KilosecondLayer";
            myPalette.grp.grp1.Mass.oz.helpTip = "Ounce to Gram";
            myPalette.grp.grp1.Mass.poun.helpTip = "Pound to Kilogram";
            myPalette.grp.grp2.Speed.mph.helpTip = "Miles per hour to kilometr per hour";
            myPalette.grp.grp2.Speed.helpTip = "Miles per second to Kilometr per second";
            myPalette.grp.grp2.Other.dollar = "Dollar";
            myPalette.grp.grp2.Other.Fr.helpTip = "Fahrenheit to Celsius";
            myPalette.grp.grp2.Other.gal.helpTip = "Gallon to Liter";
    */
        //////////// запуск скрипта ////////////
        //butMain.onClick = function() {//задаем папку для коллекта
    
        //}
        ////////////////////////////////////////////////
    
       
    
        myPalette.layout.layout(true);
            myPalette.layout.resize();
            myPalette.onResizing = myPalette.onResize = function() {
                myPalette.layout.resize();
            };
        
            if (myPalette != null) {
                if (myPalette instanceof Window) {
                    myPalette.center();
                    myPalette.show();
                } else {
                myPalette.layout.layout(true);
                }
            }
        }
    }
    buildUI(thisObj);
    }
    run(this)