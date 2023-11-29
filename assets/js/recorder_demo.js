var app = new Vue({
    el: "#app",
    data: {
        recBlob: [],
        audioContext: "",
        rec: {},
    },
    computed: {},

    methods: {
        // ==========================================
        // == 錄音裝置請求 (audio設置)
        // ==========================================
        showDialog() {
            if (!/mobile/i.test(navigator.userAgent)) {
                return;
            }
            app.dialogCancel();
            // console.log("show");
            let div = document.createElement("div");
            document.body.appendChild(div);
            div.innerHTML =
                "" +
                '<div class="waitDialog">' +
                '<div class="waitDialog-1">' +
                '<div style="flex:1;"></div>' +
                '<div class="waitDialog-2">' +
                '<div style="padding-bottom:10px;">錄音功能需要麥克風權限，請允許；如果未看到任何請求，請點擊忽略</div>' +
                '<div style="text-align:center;"><a onclick="waitDialogClick()" style="color:#0B1">忽略</a></div>' +
                "</div>" +
                '<div style="flex:1;"></div>' +
                "</div>" +
                "</div>";
        },

        createDelayDialog() {
            this.dialogInt = setTimeout(() => {
                app.showDialog();
            }, 8000);
        },

        dialogCancel() {
            clearTimeout(this.dialogInt);
            const elems = document.querySelectorAll(".waitDialog");
            for (let i = 0; i < elems.length; i++) {
                elems[i].parentNode.removeChild(elems[i]);
            }
        },
        // ==========================================
        // == browser 錄音充許開啟 (audio設置)
        // ==========================================
        recOpen() {
            return new Promise((resolve, reject) => {
                let newRec = Recorder({
                    type: "mp3",
                    sampleRate: 44100,
                    bitRate: 48,
                    onProcess: function (
                        buffers,
                        powerLevel,
                        bufferDuration,
                        bufferSampleRate,
                        newBufferIdx,
                        asyncEnd
                    ) {},
                });
                app.createDelayDialog(); // 防止特異 browser 設定狀況
                newRec.open(
                    function () {
                        app.dialogCancel();
                        app.rec = newRec;
                        app.wave = Recorder.FrequencyHistogramView({
                            elem: ".recwave",
                        });
                    },
                    function (msg, isUserNotAllow) {
                        alert("未偵測到錄音裝置");
                        app.dialogCancel();
                        location.reload();
                    }
                );

                window.waitDialogClick = function () {
                    app.dialogCancel();
                };
                resolve();
            });
        },
        // ==========================================
        // == browser 錄音充許關閉 (釋放資源) (audio設置)
        // ==========================================
        recClose() {
            if (app.rec) {
                app.rec.close();
                // (window.URL || webkitURL).revokeObjectURL(audio.src);
            }
        },
        // ==========================================
        // == 開始錄音(audio設置)
        // ==========================================
        async recStart() {
            app.recBlob = [];
            app.rec && Recorder.IsOpen() ? app.rec.start() : app.recOpen();
        },

        // ==========================================
        // == 结束錄音，得到音頻文件 (audio設置)
        // ==========================================
        recStop() {
            if (!(app.rec && Recorder.IsOpen())) {
                return;
            }
            app.rec.stop(function (blob, duration) {
                app.recBlob.push(blob);

                // CREATE AUDIO ELE v
                if (!app.recBlob) {
                    return;
                }

                // 加載 audio 物件 v
                const audio = document.createElement("audio");
                // audio.controls = true; // true => 產生可操控介面
                audio.setAttribute("id", "myAudio0");
                audio.preload;
                window.parent.document.getElementById("audioBox").append(audio);
                // document.getElementById("audioBox").append(audio);

                //簡單利用URL生成播放地址，注意不用了時需要revokeObjectURL，否則霸占暫存
                audio.src = URL.createObjectURL(app.recBlob[0]);
                const message = blob;
                window.parent.postMessage({ type: "blob", data: message }, "*");

                // var a = document.createElement("a");
                // a.download = "YT15%";
                // a.href = audio.src;
                // // For Firefox https://stackoverflow.com/a/32226068
                // document.body.appendChild(a);
                // a.click();
                // a.remove();
            });
        },
        // ==========================================
        // === 錄音提醒 ===
        // ==========================================
        // recAlert(){

        // },
        // ==========================================
        // === 開始錄音&倒數GIF ===
        // ==========================================
        goRec() {
            this.singleMode = false; //單句模式初始化
            this.recAlert = false;
            this.canCloseRec = false;
            //介面改變
            if (this.tutorExist) {
                this.tutor = false;
                this.tutorMb = false;
                this.tutorMark();
                const teacherBtn = document.querySelector(".teacherBtn");
                teacherBtn.classList.add("none");
                player2.pauseVideo();
                player3.pauseVideo();
            }
            //init 字幕區塊

            //字幕滾動區
            const listWindowContent = document.querySelector(".subtitle_items");
            //字幕視窗高度
            const listWindowHeight = listWindowContent.offsetHeight;
            //字幕視窗上方與瀏覽器距離
            const listWindowTop = listWindowContent.offsetTop;
            //滾動觸發
            const listWindowBottom = listWindowHeight - listWindowTop;

            //字幕區塊高(每句高度都不同)
            const sutitleBlkHeight =
                document.getElementById("sIndex0").offsetHeight;
            //正在播放的字幕與瀏覽器距離 (會隨歌曲撥放而跳句)
            const sutitleBlkTop = document.getElementById("sIndex0").offsetTop;

            listWindowContent.scrollTo({
                top: sutitleBlkTop, //包含上下行距
            });

            this.ch_content = "";
            this.en_content = "";
            if (
                this.nowPlaying > 0 &&
                document.querySelector(".subtitle_items li.active") !== null
            ) {
                document
                    .querySelector(".subtitle_items li.active")
                    .classList.remove("active");
            }
            if (!(app.rec && Recorder.IsOpen())) {
                app.recOpen();
            }
            player.playVideo();
            player.unMute();
            player.pauseVideo();
            player.seekTo(0);
            this.recMode = true;
            document.getElementById("singer_list").checked = true;
            const countDown = document.querySelector(".countDown");
            const countDown_wrapper =
                document.querySelector(".countDown_wrapper");
            countDown_wrapper.classList.remove("none");
            countDown.classList.remove("none");
            const img = document.querySelector(".countDownImg");
            img.src =
                "https://funday.asia/NewMylessonmobile/MusicBox/svg/countdown-compressor.gif";

            const promise = new Promise((resolve, reject) => {
                setTimeout(() => {
                    countDown_wrapper.classList.add("none");
                    countDown.classList.add("none");
                    resolve();
                    // openRec();
                }, 4500);
            });
            promise.then(async (value) => {
                await app.recStart();
                player.playVideo();
                setTimeout(() => {
                    app.recStop();
                    player.pauseVideo();
                }, app.vdTime * 1000);
            });
        },
        // ==========================================
        // === 結束錄音 ===
        // ==========================================
        recEnd() {
            const img = document.querySelector(".countDownImg");
            img.src = "";
            const function01 = document.querySelector(".function01");
            const function02 = document.querySelector(".function02");
            function01.classList.add("none");
            function02.classList.remove("none");
            this.playstate = 0;
            player.pauseVideo();
            player.seekTo(0);
            this.nowPlaying = -1;
            this.mode = 0;
            app.recBlob = [];
            this.recStop();
        },
        // ==========================================
        // === 重新錄音&倒數GIF ===
        // ==========================================
        reRec() {
            //刪除舊音檔
            app.isUpload = false;
            app.nowPlaying = -1;
            app.audioPlayMode = 0;
            app.singleMode = false;
            // this.recEnd();
            app.recOpen();
            player.pauseVideo();
            player.seekTo(0);
            const idName = "myAudio0";
            const audio = document.getElementById(idName);
            audio.remove();
            const countDown = document.querySelector(".countDown");
            const countDown_wrapper =
                document.querySelector(".countDown_wrapper");
            const function01 = document.querySelector(".function01");
            const function02 = document.querySelector(".function02");
            countDown_wrapper.classList.remove("none");
            countDown.classList.remove("none");
            const img = document.querySelector(".countDownImg");
            function01.classList.remove("none");
            function02.classList.add("none");
            img.src =
                "https://funday.asia/NewMylessonmobile/MusicBox/svg/countdown-compressor.gif";

            const promise = new Promise((resolve, reject) => {
                setTimeout(() => {
                    countDown_wrapper.classList.add("none");
                    countDown.classList.add("none");
                    resolve();
                }, 4500);
            });
            promise.then(async (value) => {
                await app.recStart();
                player.playVideo().unMute();
                setTimeout(() => {
                    app.recStop();
                    player.pauseVideo();
                }, app.vdTime * 1000);
            });
        },
        // ==========================================
        // == 錄音上傳
        // ==========================================

        fnReverb(audio) {
            var OfflineAudioContext =
                window.OfflineAudioContext || window.webkitOfflineAudioContext;
            class SimpleReverb extends Effect {
                constructor(context) {
                    super(context);
                    this.name = "SimpleReverb";
                }

                setup(reverbTime = 1) {
                    this.effect = this.context.createConvolver();

                    this.reverbTime = reverbTime;

                    this.attack = 0.0001;
                    this.decay = 0.1;
                    this.release = reverbTime;

                    this.wet = this.context.createGain();
                    this.input.connect(this.wet);
                    this.wet.connect(this.effect);
                    this.effect.connect(this.output);
                }

                renderTail() {
                    const tailContext = new OfflineAudioContext(
                        2,
                        this.context.sampleRate * this.reverbTime,
                        this.context.sampleRate
                    );
                    tailContext.oncomplete = (buffer) => {
                        this.effect.buffer = buffer.renderedBuffer;
                    };

                    const tailOsc = new Noise(tailContext, 1);
                    tailOsc.init();
                    tailOsc.connect(tailContext.destination);
                    tailOsc.attack = this.attack;
                    tailOsc.decay = this.decay;
                    tailOsc.release = this.release;

                    tailOsc.on({ frequency: 500, velocity: 1 });
                    tailContext.startRendering();
                    setTimeout(() => {
                        tailOsc.off();
                    }, 20);
                }

                set decayTime(value) {
                    let dc = value / 3;
                    this.reverbTime = value;
                    this.attack = 0;
                    this.decay = 0;
                    this.release = dc;
                    return this.renderTail();
                }
            }

            class AdvancedReverb extends SimpleReverb {
                constructor(context) {
                    super(context);
                    this.name = "AdvancedReverb";
                }

                setup(reverbTime = 1, preDelay = 0.03) {
                    this.effect = this.context.createConvolver();

                    this.reverbTime = reverbTime;

                    this.attack = 0.001;
                    this.decay = 0.1;
                    this.release = reverbTime;

                    this.preDelay = this.context.createDelay(reverbTime);
                    this.preDelay.delayTime.setValueAtTime(
                        preDelay,
                        this.context.currentTime
                    );

                    this.multitap = [];

                    for (let i = 2; i > 0; i--) {
                        this.multitap.push(
                            this.context.createDelay(reverbTime)
                        );
                    }
                    this.multitap.map((t, i) => {
                        if (this.multitap[i + 1]) {
                            t.connect(this.multitap[i + 1]);
                        }
                        t.delayTime.setValueAtTime(
                            0.001 + i * (preDelay / 2),
                            this.context.currentTime
                        );
                    });

                    this.multitapGain = this.context.createGain();
                    this.multitap[this.multitap.length - 1].connect(
                        this.multitapGain
                    );

                    this.multitapGain.gain.value = 1;

                    this.multitapGain.connect(this.output);

                    this.wet = this.context.createGain();

                    this.input.connect(this.wet);
                    this.wet.connect(this.preDelay);
                    this.wet.connect(this.multitap[0]);
                    this.preDelay.connect(this.effect);
                    this.effect.connect(this.output);
                }
                renderTail() {
                    const tailContext = new OfflineAudioContext(
                        2,
                        this.context.sampleRate * this.reverbTime,
                        this.context.sampleRate
                    );
                    tailContext.oncomplete = (buffer) => {
                        this.effect.buffer = buffer.renderedBuffer;
                    };
                    const tailOsc = new Noise(tailContext, 1);
                    const tailLPFilter = new Filter(
                        tailContext,
                        "lowpass",
                        2000,
                        0.2
                    );
                    const tailHPFilter = new Filter(
                        tailContext,
                        "highpass",
                        500,
                        0.1
                    );

                    tailOsc.init();
                    tailOsc.connect(tailHPFilter.input);
                    tailHPFilter.connect(tailLPFilter.input);
                    tailLPFilter.connect(tailContext.destination);
                    tailOsc.attack = this.attack;
                    tailOsc.decay = this.decay;
                    tailOsc.release = this.release;

                    tailContext.startRendering();

                    tailOsc.on({ frequency: 500, velocity: 1 });
                    setTimeout(() => {
                        tailOsc.off();
                    }, 20);
                }

                set decayTime(value) {
                    // let dc = value / 3;
                    this.reverbTime = 1;
                    this.attack = 2;
                    this.decay = 0;
                    this.release = 1;
                    return this.renderTail();
                }
            }

            class DynamicsCompressor extends Effect {
                constructor(context) {
                    super(context);
                    this.name = "DynamicsCompressor";
                    this._comp = this.context.createDynamicsCompressor();
                    this.input.connect(this._comp);
                    this._comp.connect(this.output);
                }

                set threshold(value) {
                    this._comp.threshold.setValueAtTime(
                        value,
                        this.context.currentTime
                    );
                }

                set ratio(value) {
                    this._comp.ratio.setValueAtTime(
                        value,
                        this.context.currentTime
                    );
                }

                set attack(value) {
                    this._comp.attack.setValueAtTime(
                        value,
                        this.context.currentTime
                    );
                }

                set release(value) {
                    this._comp.release.setValueAtTime(
                        value,
                        this.context.currentTime
                    );
                }

                set knee(value) {
                    this._comp.knee.setValueAtTime(
                        value,
                        this.context.currentTime
                    );
                }

                process(inputs, outputs) {
                    const input = inputs[0];
                    const output = outputs[0];

                    for (let i = 0; i < input.length; i++) {
                        const value = input[i];
                        output[i] = this._comp.process([value]);
                    }

                    return true;
                }
            }

            const context = new AudioContext();
            const source = context.createMediaElementSource(audio);

            let filter = new Filter(context, "lowpass", 24000, 0.8);
            filter.setup();
            let reverb = new AdvancedReverb(context);
            reverb.setup(1.5, 0.01);
            reverb.renderTail();
            reverb.wet.gain.value = 1;
            source.connect(reverb.input);
            reverb.connect(context.destination);

            const compressor = new DynamicsCompressor(context);
            source.connect(compressor.input);
            compressor.connect(context.destination);
            compressor.threshold = -86;
            compressor.ratio = 1;
            compressor.attack = 0.3;
            compressor.release = 0.25;
            compressor.knee = 30;
            return context;
        },
    },
    async created() {},
});
