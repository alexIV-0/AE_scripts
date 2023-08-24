(function (_thisObj) {
    // переменная для слешей в путях файлов
    if ($.os.match(/Windows/)) {
        var _S = '\\';
    } else if ($.os.match(/Mac/)) {
        var _S = '/';
    }

    function isSecurityPrefSet() {
        try {
            var securitySetting = app.preferences.getPrefAsLong(
                'Main Pref Section',
                'Pref_SCRIPTING_FILE_NETWORK_SECURITY'
            );
            return Boolean(securitySetting);
        } catch (e) {
            alert(
                'Error 01 in ' +
                    arguments.callee.name +
                    '\n\nUnable to call Preferences.\n\nMore info:\n' +
                    e
            );
            return false;
        }
    }

    function getUserDataFolder() {
        if (!isSecurityPrefSet()) {
            alert(
                "Network access disabled. To allow, please go to Preferences > General and check off 'Allow Scripts to Write Files and Access Network' to resolve."
            );
            try {
                app.executeCommand(app.findMenuCommandId('General...'));
            } catch (e) {
                alert(e);
            }
            if (!isSecurityPrefSet()) {
                return null;
            }
        }

        var scriptName = 'qMenu';
        var version = app.version.split('.')[0];
        var userDataFolder = Folder.userData;

        var pathFolder = new Folder(
            userDataFolder.toString() + _S + 'aescripts' + _S + 'qMenu' + _S + version
        );
        var scriptFolderInUserData = new Folder(pathFolder);
        if (!scriptFolderInUserData.exists) {
            var tryCreateFolder = scriptFolderInUserData.create();
            if (!tryCreateFolder) {
                alert(
                    'Error creating ' +
                        scriptName +
                        " files.\nCouldn't create folder " +
                        scriptName +
                        ' in ' +
                        userDataFolder.toString()
                );
                scriptFolderInUserData = Folder.temp;
                return scriptFolderInUserData.toString();
            }
        }

        scriptFolderInUserData = Folder(pathFolder);
        if (!scriptFolderInUserData.exists) {
            scriptFolderInUserData = scriptFolderInUserData.create();
        }
        var str = scriptFolderInUserData.fsName.toString();
        return str;
    }

    var optionFolder = getUserDataFolder();
    // переменная для папки с иконками
    var iconFolder = Folder(optionFolder + _S + 'icons');
    if (!iconFolder.exists) {
        iconFolder.create();
    }

    /*
         __ __ __
         || || ||
         || || ||
         \\_// ||
                 
    */
    // создаем или считываем иконки
    var iconPlugin = File(iconFolder.fsName + _S + 'plugin.png');
    if (!iconPlugin.exists) {
        createResourceFile('plugin', iconPlugin);
        iconPlugin = File(iconFolder.fsName + _S + 'plugin.png');
    }
    iconPlugin = iconPlugin.fsName;

    var qm_UI_main, mainGropUI, textGroup, optionIcon, listBox;

    function buildUI(_thisObj) {
        qm_UI_main =
            _thisObj instanceof Panel
                ? _thisObj
                : new Window('dialog', 'qMunu_alexIV', undefined, {
                      // independent: true,
                      resizeable: true,
                      borderless: true,
                      closeOnKey: 'Escape',
                  });
        // qm_UI_main.orientation = "row";
        // qm_UI_main.spacing = 20;
        qm_UI_main.margins = 1;
        // qm_UI_main.alignment = ["fill","fill"];
        if (qm_UI_main != null) {
            mainGropUI = qm_UI_main.add(
                "group { orientation: 'column', alignment: ['fill','fill'], alignChildren: ['fill','fill'], margins: 0, spacing: 0}"
            );
            textGroup = mainGropUI.add(
                "group {alignment: ['fill', 'top'], margins: 0, spacing: 0}"
            );
            inputText = textGroup.add(
                "edittext {text: 'type enifing', alignment: ['fill','top'], margins: 0}"
            );

            listBox = mainGropUI.add(
                "listbox {alignment: ['fill','fill'], properties: {multiselect: false, numberOfColumns: 2}}"
            );
        }
        mainGropUI.minimumSize.width = 220;
        mainGropUI.minimumSize.height = 300;
        // listBox.maximumSize.height = 300;
        inputText.active = true;

        // qm_UI_main.layout.resize();
        qm_UI_main.layout.layout(true);

        inputText.onChanging = function (e) {
            var allCommandArr = [];
            var max = Math.floor(Math.random() * (10 - 1 + 1) + 1);
            var i = 0;
            while (i < max) {
                allCommandArr.push('name ' + i);
                i++;
            }

            createListBox(allCommandArr);
            // qm_UI_main.layout.layout(true);
            // qm_UI_main.update();
            // qm_UI_main.layout.resize();
        };

        function createListBox(_arr) {
            listBox.removeAll();
            for (var eff = 0; eff < _arr.length; eff++) {
                try {
                    var newItem = listBox.add('item', '');

                    newItem.image = iconPlugin;
                    newItem.subItems[0].text = _arr[eff];
                    newItem.checked = true;
                    // qm_UI_main.layout.layout(true);
                    // newItem.text = _arr[eff];
                    // newItem.text = 'E';

                    // newItem.type_Element = _type;
                    // newItem.match_Name = qMenu____allEffects[_arr[eff]].matchName;
                } catch (e) {}
            }
            // var z = qm_UI_main;
            // var z2 = listBox;
            // qm_UI_main.size.height = (_arr.length * 23) + 2;
            // listBox.size.height = listBox.maximumSize.height = (_arr.length * 23) + 1;
            listBox.selection = 0;

            // qm_UI_main.layout.layout(true);
            // qm_UI_main.layout.resize();
            // qm_UI_main.update();
        }

        // qm_UI_main.onShow = function () {
        //     inputText.onChanging = function () {
        //         listBox.active = false;
        //         listBox.active = true;
        //     };
        //     // qm_UI_main.update();
        //     // qm_UI_main.layout.resize();
        //     // qm_UI_main.minimumSize = qm_UI_main.preferredSize;
        //     // qm_UI_main.layout.layout( true );
        // };

        if (qm_UI_main != null) {
            if (qm_UI_main instanceof Window) {
                qm_UI_main.center();
                qm_UI_main.show();
            } else {
                qm_UI_main.layout.layout(true);
            }
        }
        // ============================================================
        // ============================================================
    }
    buildUI(_thisObj);

    function createResourceFile(_filename, _path) {
        var allIcon = {
            plugin: '\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x12\x00\x00\x00\x12\b\x06\x00\x00\x00V\u00CE\u008EW\x00\x00\x00\tpHYs\x00\x00\x00\x01\x00\x00\x00\x01\x018"\u00F4@\x00\x00\x00$zTXtCreator\x00\x00x\u009CsL\u00C9OJUpL+I-RpMKKM.)\x06\x00Az\x06\u00CE\u00E7\u00CDsf\x00\x00\x02AIDAT8\u008D\u0095\u0092\u00CFJ[A\x14\u0087\u00BF3\u0099\u008E%W\u00B0\u00CD\u009F\u0096\u00D6\u0094J\x17.\u0082\x01-\u00DC\u0086\u00D6E]\u00A5 \u00D6\u00D2\u00C6n\u00C5B7\t\u00B8\u00F1\x01\\\x1B\u00CC"t\u00E5\x03\u00A8\u00E0;\u00F8\x06!\u00D9HD$\x1B)"m\u0093\u00A2R\u00D3&\u0098;]xM\u00D5\u00A6\u00A9\u00FEVg\u00CE9\u00F3\u009D\u00DFaF\x00\x01n\x03\u00F7\u0080G@\u00C4\u00CF\u00D5\u0080\u00CF\u00C07\u00CE\x14\x01b@\u00D4?\u009F\u00D7\u00BF\x02\u00BF\x02\u0080\x06\u00C2\u00C0Sc\u00CC[\x11y\u00A7\u0094\x1A\u00D7Z\u00DFo\u00B7\u00DB?\u0080#\x7F\u00D0(\u00F0\x06H\x03\u00E3>\u00F8\x04\u00F8\x0E\u00FC\u00D4\u00C0\x1D\u00E0\t\u0090*\x14\n\x19\x7F\x1A\u00D6\u00DA\u00E7\x0B\x0B\x0B\u00D2l6O\x00Ok\u00FD\u00AAP(dED\u00FC\u0096\x17\u00F3\u00F3\u00F3x\u009EW\x03Z\x1AH\x00/\u0081i.HDh\u00B7\u00DBS@\x0B\u00F0<\u00CF\u009B\u00963qa\u00D8\x14\u00F0\x050:\x10\b\u00BC\u00B7\u00D6\u00BE\u00F6\u00F7\u00BF$\u00A5\u00D4C\u00A5\u00D4\x07?v\u00AE\u00D6E\u00E41\u00F0\x11x \u00F9|\u00BE\x19\f\x06\u00CD\u00D5\u00A6\u00EB\u00E8\u00F4\u00F4\u00B4cN{\u009Ew\u00ABWc\u00A9T\u00A2^\u00AF\u00E3\u00BA.\u00D1h\u00F4R]k}\u00BE\u00A2(k\u00ADt\u00834\x1A\r\u0096\u0097\u0097;\u00F1\u00EE\u00EEnOw\u00BA[\u00D2Z\u00CB\u00EA\u00EA*\u00FD\u00FD\u00FD$\u0093I\u0092\u00C9dOHWP\u00ADVc}}\u009D\u009D\u009D\x1D\u0086\u0087\u0087)\x16\u008BT*\x15*\u0095\n\u0099L\u0086\u00CD\u00CDM\u00B6\u00B7\u00B7Y\\\\$\x14\nu\u00EE\u00A9\u00AB\u00A0H$B<\x1E\u00C7\x18C6\u009B\u00C5u]\u00E6\u00E6\u00E6\x18\x18\x18`ee\u0085\u00C9\u00C9Ir\u00B9\u00DC%HW\x10@\u00B9\\fdd\x04c\u00FE<f8\x1CF)\u00C5\u00E0\u00E0 }}}\u00FF_\u00AD^\u00AF\u00B3\u00B7\u00B7G*\u0095\u00A2\u00D5jqpp@\u00B5Z\u00C5q\x1C\u008E\u008F\u008F)\x16\u008B4\x1A\r&&&z;*\u0097\u00CB\u0084B!\x12\u0089\x04\u00FB\u00FB\u00FB\u00AC\u00AD\u00AD!"\u00CC\u00CE\u00CE266\u00C6\u00D6\u00D6\x16\u00AE\u00EB\u00FE\u00E5Hr\u00B9\u009Cu\x1C\u0087j\u00B5\u00CA\u00D0\u00D0\x10KKK\u00CC\u00CC\u00CC\x10\u008F\u00C7\u00BBm\u00DDU\u00D6Z\u00B4\u0088\u00D8\u00C3\u00C3C\u00D9\u00D8\u00D8 \x16\u008B\u0091N\u00A7o\x04\u00E98\u00CA\u00E7\u00F3\u00AD`0\u00F8\u00CF\u00DF}]Gb\u008C\u00F9d\u00AD}\x06\u00DC\x05\x027dx\u00C0\u0091R\u00AA\u00F4\x1B){\u00C8A\x07\u00C4Gp\x00\x00\x00\x00IEND\u00AEB`\u0082',
        };

        var resourceFile = File(_path);
        if (!resourceFile.exists) {
            resourceFile.encoding = 'BINARY';
            resourceFile.open('w');
            resourceFile.write(allIcon[_filename]);
            resourceFile.close();
        }
    }
})(this);
