var DIR = {
    path: android.os.Environment.getExternalStorageDirectory().getPath(),
    mcpe: android.os.Environment.getExternalStorageDirectory().getPath() + "/games/com.mojang/",
    config: function () {
        var dir = this.mcpe + "flalConfig/";
        dir = java.io.File(dir);
        dir.mkdirs();
        return dir;
    },
    mapConfig: function () {
        var dir = this.mcpe + "minecraftWorlds/" + Level.getWorldDir() + "/.flalConfig/";
        dir = java.io.File(dir);
        dir.mkdirs();
        return dir;
    },
    mapAtual: function () {
        return this.mcpe + "minecraftWorlds/" + Level.getWorldDir();
    }
};

var ARQUIVO = {
    criar: function (localArquivo, textoArquivo) {
        var arquivo = new java.io.File(localArquivo);
        if (arquivo.exists()) {
            let fileOutputStream = new java.io.FileOutputStream(arquivo);
            let outputStreamWriter = new java.io.OutputStreamWriter(fileOutputStream);
            outputStreamWriter.write(textoArquivo.toString());
            outputStreamWriter.close();
            fileOutputStream.close();
        }
    },
    ler: function (localArquivo) {
        let arquivo = new java.io.File(localArquivo);
        if (!file.exists()) {
            return "";
        }
        let br = new java.io.BufferedReader(new java.io.BufferedReader(new java.io.FileInputStream(arquivo)));
        let read,
            text = "";
        while ((read = br.readLine()) != null) {
            text += read;
            break;
        }
        br.close();
        return text;
    },
    adicionar: function (localArquivo, textoArquivo) {
        var a = this.ler(localArquivo);
        if (a != false) {
            return this.criar(localArquivo, a + textoArquivo);
        } else {
            return a;
        }
    },
    deletar: function (localArquivo) {
        try {
            var arquivo = new java.io.File(localArquivo);
            if (!arquivo.exists()) {
                return true;
            }
            arquivo.delete();
            return true;
        } catch (e) {
            print("Erro: " + e);
            return false;
        }
    }
};

var JSONx = {
    criar: function (obj) {
        for (propriedade in obj) {
            if (typeof obj[propriedade] == "function") {
                obj[propriedade] = obj[propriedade].toString() + "/*functionConvert*/";
            }
        }
        return JSON.stringify(obj);
    },
    carregar: function (obj) {
        obj = JSON.parse(obj);
        for (propriedade in obj) {
            if (typeof obj[propriedade] == "string" && obj[propriedade].indexOf("/*functionConvert*/") > -1) {
                eval('obj[propriedade]=' + obj[propriedade]);
            }
        }
        return obj;
    },
    criarX: function (obj) {
        for (propriedade in obj) {
            if (obj[propriedade].constructor.name == "Array" || typeof obj[propriedade] == "object") {
                this.criarX(obj[propriedade]);
                continue;
            }
            if (typeof obj[propriedade] == "function") {
                obj[propriedade] = obj[propriedade].toString() + "/*functionConvert*/";
            }
        }
        return JSON.stringify(obj);
    },
    carregarX: function (obj) {
        if (typeof obj == "string") {
            obj = JSON.parse(obj);
        }
        for (propriedade in obj) {
            if (obj[propriedade].constructor.name == "Array" || typeof obj[propriedade] == "object") {
                this.carregarX(obj[propriedade]);
                continue;
            }
            if (typeof obj[propriedade] == "string" && obj[propriedade].indexOf("/*functionConvert*/") > -1) {
                eval('obj[propriedade]=' + obj[propriedade]);
            }
        }
        return obj;
    }
};

var STRING = {
    lastchar: function (texto) {
        if (texto.length > 0) {
            return texto[texto.length - 1];
        }
        return '';
    },
    last2char: function (texto) {
        if (texto.length > 1) {
            var c1 = texto[texto.length - 1];
            var c2 = texto[texto.length - 2];
            return c2 + c1;
        } else if (texto.length == 1) {
            return texto[texto.length - 1];
        }
        return '';
    },
    isFunction: function (texto) {
        if (texto.indexOf("/*functionConvert*/") != -1) {
            return true;
        }
        return false;
    },
    toFunction: function (textoFunction) {
        if (textoFunction.indexOf("/*functionConvert*/") != -1) {
            eval("textoFunction=" + textoFunction);
            return textoFunction;
        }
        return false;
    },
    toTime: function (time) {
        time = time.split(":");
        var l = time.length;
        for (n in time) {
            time[n] = parseInt(time[n]);
        }
        if (l > 3 || l < 1) {
            return false;
        } else if (l == 3) {
            return (time[0] * Math.pow(60, 2)) + (time[1] = time[1] * 60) + time[2];
        } else if (l == 2) {
            return (time[0] * 60) + time[1];
        }
        return parseInt(time.join());
    },
    functionToString: function (functionToConvert) {
        return functionToConvert.toString() + "/*functionConvert*/";
    }
};

var MEDIAPLAYER = {
    _MediaPlayer: android.media.MediaPlayer,
    _Runnable: java.lang.Runnable,
    _Thread: java.lang.Thread,
    mediaPlayers: [],
    construir: function (id, localArquivo, looping, startFrom) {
        try {
            var m = new this._MediaPlayer;
            m.setDataSource(localArquivo);
            m.prepare();
            if (looping == true || looping == false) {
                m.setLooping(looping);
            }
            if (typeof startFrom == "number") {
                m.seekTo(parseInt(startFrom));
            } else if (typeof startFrom == "string") {
                m.seekTo(this.stringToTime(startFrom));
            }
            this.mediaPlayers[id] = m;
            return m;
        } catch (e) {
            print("Erro: " + e);
        }
    },
    play: function (id) {
        try {
            var m = this.mediaPlayers[id];
            if (!m.isPlaying()) {
                m.start();
            }
        } catch (e) {
            this.messageIdNotFound();
        }
    },
    pause: function (id) {
        try {
            var m = this.mediaPlayers[id];
            if (m.isPlaying()) {
                m.pause();
            }
        } catch (e) {
            this.messageIdNotFound();
        }
    },
    stop: function (id) {
        try {
            this.mediaPlayers[id].stop();
            this.mediaPlayers[id].prepare();
            this.mediaPlayers[id].seekTo(0);
        } catch (e) {
            this.messageIdNotFound();
        }
    },
    switchSrc: function (id, localArquivo, looping, startFrom) {
        try {
            var m = this.mediaPlayers[id];
            m.stop();
            m.reset();
            m.setDataSource(localArquivo);
            m.prepare();
            if (looping == true || looping == false) {
                m.setLooping(looping);
            }
            if (typeof startFrom == "number") {
                m.seekTo(parseInt(startFrom));
            }
        } catch (e) {
            this.messageIdNotFound();
        }
    },
    release: function (id) {
        try {
            var m = this.mediaPlayers[id];
            m.stop();
            m.release();
        } catch (e) {
            this.messageIdNotFound();
        }
    },
    getDuration: function (id) {
        try {
            return this.mediaPlayers[id].getDuration();
        } catch (e) {
            print(e);
        }
    },
    getCurrentPosition: function (id) {
        try {
            return this.mediaPlayers[id].getCurrentPosition();
        } catch (e) {
            print(e);
        }
    },
    setVolume: function (id, volume) {
        try {
            var m = this.mediaPlayers[id];
            m.setVolume(volume, volume);
        } catch (e) {
            this.messageIdNotFound();
        }
    },
    setLooping: function (id, loop) {
        try {
            var m = this.mediaPlayers[id];
            if (m.isLooping() == !loop) {
                m.setLooping(loop);
            }
        } catch (e) {
            print("Erro: " + e);
        }
    },
    isLooping: function (id) {
        try {
            return this.mediaPlayers[id].isLooping();
        } catch (e) {
            print("Erro: " + e);
        }
    },
    isPlaying: function (id) {
        try {
            return this.mediaPlayers[id].isPlaying();
        } catch (e) {
            print("Erro: " + e);
        }
    },
    goTo: function (id, time) {
        try {
            var m = this.mediaPlayers[id];
            if (typeof time == "string") {
                time = this.stringToTime(time);
            }
            m.seekTo(time);
        } catch (e) {
            this.messageIdNotFound();
        }
    },
    repeatAB: function (id, a, b) { //Funciona incorretamente
        try {
            new this._Thread(new this._Runnable() {
                run: function () {
                    var m = MEDIAPLAYER.mediaPlayers[id];
                    var n = m.getCurrentPosition();
                    if (typeof a == "string") {
                        a = MEDIAPLAYER.stringToTime(a);
                    }
                    if (typeof b == "string") {
                        b = MEDIAPLAYER.stringToTime(b);
                    }
                    var i = b - n;
                    MEDIAPLAYER.mediaPlayers["isRepeat"] = true;
                    if (i < 0) {
                        MEDIAPLAYER._Thread.sleep(i);
                    }
                    m.seekTo(a);
                    if (MEDIAPLAYER.mediaPlayers["isRepeat"]) {
                        MEDIAPLAYER.repeatAB(id, a, b);
                    }
                }
            }).start();
        } catch (e) {
            print(e);
        }
    },
    onFinish: function (id, func) {
        try {
            var m = this.mediaPlayers[id];
            m.setOnCompletionListener(new this._MediaPlayer.OnCompletionListener() {
                onCompletion: function () {
                    func();
                }
            });
        } catch (e) {
            print(e);
        }
    },
    stringToTime: function (time) {
        time = time.split(":");
        var l = time.length;
        for (n in time) {
            time[n] = parseInt(time[n]);
        }
        if (l > 3 || l < 1) {
            return false;
        } else if (l == 3) {
            return (time[0] * Math.pow(60, 2)) + (time[1] = time[1] * 60) + time[2];
        } else if (l == 2) {
            return (time[0] * 60) + time[1];
        }
        return parseInt(time.join());
    },
    messageIdNotFound: function () {
        print("Id not found");
    }
};

var M = MEDIAPLAYER;

var ENT = {
    getAll: function () {
        return Entity.getAll();
    },
    position: function (e) {
        if (Entity.getAll().indexOf(e) != -1) {
            return {
                x: Entity.getX(e),
                y: Entity.getY(e),
                z: Entity.getZ(e)
            };
        }
        return false;
    },
    vel: function (e) {
        if (Entity.getAll().indexOf(e) != -1) {
            return {
                x: Entity.getVelX(e),
                y: Entity.getVelY(e),
                z: Entity.getVelZ(e)
            };
        }
        return false;
    },
    getIdType: function (e) {
        return Entity.getEntityTypeId(e);
    },
    vida: function (e, v, m) {
        if (v == undefined && m == undefined) {
            return Entity.getHealth(e);
        } else if (typeof v == "number" && m == undefined) {
            Entity.setHealth(e, v);
        } else if (typeof v == "number" && typeof m == "number") {
            Entity.setMaxHealth(e, m);
            Entity.setHealth(e, v);
        } else if (v == "atual" || v == 0 && typeof m == "number") {
            Entity.setMaxHealth(e, m);
        } else if (v == "max") {
            return Entity.getMaxHealth(e);
        }
    },
    nameTag: function (e, n) {
        if (n == undefined) {
            return Entity.getNameTag(e);
        } else if (typeof n == "string") {
            Entity.setNameTag(e, n);
        }
    },
    immobile: function (e, b) {
        if (e != undefined && b != undefined) {
            Entity.setImmobile(e, b);
        }
    },
    animalAge: function (e, n) {
        if (n == undefined) {
            return Entity.getAnimalAge(e);
        } else if (typeof n == "number") {
            Entity.setAnimalAge(e, n);
        }
    }
};
