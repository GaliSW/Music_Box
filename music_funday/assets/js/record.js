var app = new Vue({
    el: "#app",
    data: {
        member_id: "",
        customer_id: "",
        categoryId: 0, //分類id
        videoId: 0,
        songDetal: {},
        others: {},
        songInfo: {},
        ytUrl: "",
        startTimeArr: [],
        timer: null, //setInterval計時器
        allTime: "00:00", //歌曲總長
        currentTime: "00:00", //目前撥放時間
        playstate: 0, //播放狀態 0:暫停 1:播放 ,
        videoList: {}, //相關推薦
        sidebar: {},
        nowPlaying: -1,
        player: null,
        recBlob: [], //單一錄音檔案
        dialogInt: "",
        rec: {},
        wave: {},
        mode: 0, //0:同步 1:錄音 2:影片
        repeat: 0, //0:單句關 1:單句開
        vdTime: 0,
        progress: "0%",
    },
    watch: {
        currentTime: function (val, oldVal) {
            //比對到歌詞秒數陣列

            if (
                this.startTimeArr.indexOf(this.currentTime) !== -1 &&
                this.repeat == 0
            ) {
                //增加播放行數
                this.nowPlaying++;
                console.log(this.nowPlaying);
            }
        },
        nowPlaying: function () {
            if (this.nowPlaying == 0) {
                return false;
            }
            //字幕滾動區
            const listWindowContent = document.querySelector(".subtitle");
            //字幕視窗高度
            const listWindowHeight = listWindowContent.offsetHeight;
            //字幕視窗上方與瀏覽器距離
            const listWindowTop = listWindowContent.offsetTop;
            //滾動觸發
            const listWindowBottom = listWindowHeight + listWindowTop;

            //字幕區塊高(每句高度都不同)
            const sutitleBlkHeight =
                document.querySelector(".sentence.now").offsetHeight;
            //正在播放的字幕與瀏覽器距離 (會隨歌曲撥放而跳句)
            const sutitleBlkTop =
                document.querySelector(".sentence.now").offsetTop +
                sutitleBlkHeight;

            if (this.playMethods == 3) return; //單句模式不滾動
            // console.log(sutitleBlkHeight);
            //提前100px觸發
            if (this.repeat == 0) {
                listWindowContent.scrollTo({
                    top: sutitleBlkTop - listWindowTop, //包含上下行距
                    behavior: "smooth",
                });
            }
        },
    },
    methods: {
        getVideoData() {
            let vm = this;
            axios
                .get(
                    "https://funday.asia/api/MusicboxWeb/MusicboxJson.asp?indx=" +
                        vm.videoId
                )
                .then((res) => {
                    vm.songDetal = res.data.data;
                    vm.others = res.data.others;
                    vm.songInfo = res.data.info;
                    vm.ytUrl = `https://www.youtube.com/embed/${
                        vm.songInfo.url.split("/")[3]
                    }?enablejsapi=1&controls=0&showinfo=0&autoplay=0`;
                    //"LqtWyDTSrsU"
                    //字串時間
                    vm.startTimeArr = vm.songDetal.map((ele, idx, array) => {
                        return (
                            ele.time.split(":")[0] +
                            ":" +
                            ele.time.split(":")[1].split(".")[0]
                        );
                    });
                    //初始化Youtube
                    const _ = this;
                    //掛載 youtube api

                    var tag = document.createElement("script");
                    tag.src = "https://www.youtube.com/iframe_api";
                    var firstScriptTag =
                        document.getElementsByTagName("script")[0];
                    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

                    window.onYouTubeIframeAPIReady = () => {
                        player = new YT.Player("player", {
                            playerVars: {
                                autoplay: 0,
                                playsinline: 1,
                                //loop: 1,
                                rel: 0, //2018後就沒用了
                                controls: 0,
                                overlay: 0,
                                showinfo: 0, //隱藏影片資訊
                                modestbranding: 1, //隱藏logo
                                fs: 0, //隱藏全螢幕按鈕
                                cc_lang_pref: "en",
                                cc_load_policy: 0, //隱藏字幕
                                iv_load_policy: 3, //隱藏註釋
                                autohide: 0, //播放時隱藏控制器
                            },
                            events: {
                                onReady: onPlayerReady,
                                onStateChange: onPlayerStateChange, //偵測播放狀態
                                onError: onPlayerError,
                            },
                        });
                    };
                    function onPlayerReady(e) {
                        let allSec = this.player.getDuration();
                        app.vdTime = allSec;
                        let allMin = Math.floor(allSec / 60).toFixed(0);
                        let sec = Number(allSec % 60);
                        if (sec == 0) {
                            sec = "00";
                        } else if (sec < 10) {
                            sec = "0" + sec;
                        }
                        app.allTime = `${allMin}:${sec}`;
                        app.timer = setInterval(this.fnTimeChecking, 100);
                    }
                    function onPlayerStateChange(e) {
                        //-1:未開始 0:結束 1:正在播放 2:已暫停 3:緩衝 5:已插入影片
                        if (e.data == 1) {
                            app.playstate = 1;
                            app.timer = setInterval(app.fnTimeChecking, 500);
                        }
                        if (e.data == 2) {
                            app.playstate = 0;
                            clearInterval(app.timer);
                        }
                        if (e.data == 0) {
                            //播放方式 1:循環
                            if (app.playMethods == 1) {
                                app.fnPlayListRepeat(e);
                            }

                            //單曲模式
                            if (app.playMethods == 2) {
                                app.fnSingleSongRepeat(e);
                            }

                            //隨機撥放模式
                            if (app.playRadom == true && app.playMethods == 1) {
                                app.fnPlayListRamdom(e);
                            }
                        }
                    }
                    function onPlayerError(e) {
                        console.log("error");
                    }
                    //取得影片時間軸 每500毫秒檢查一次
                })
                .catch((error) => console.log(error));

            // window.onYouTubePlayerAPIReady = function () {
            //     vm.initYoutube();
            // };
        },

        fnTimeChecking() {
            const idName = "myAudio0";
            const audio = document.getElementById(idName);
            //取得目前時間 秒
            const time = player.getCurrentTime();
            let initTime;
            if (time == 0) {
                initTime = "00:00";
            } else {
                initTime = time;
            }
            //取得影片長度 秒
            const allTime = player.getDuration();
            this.currentTime = initTime;

            if (time < allTime) {
                let currentTime = (time / allTime) * 100;
                //撥放進度條統一
                document.querySelector(
                    ".goTime_bar"
                ).style.width = `${currentTime}%`;
                let min = Math.floor(time / 60);
                let sec = (time % 60).toFixed(0);
                if (min < 10 && sec < 10) {
                    this.currentTime = `0${min}:0${sec}`;
                } else if (min < 10 && sec == 10) {
                    this.currentTime = `0${min}:${sec}`;
                } else if (min < 10 && sec > 10) {
                    this.currentTime = `0${min}:${sec}`;
                } else if (min >= 10 && sec < 10) {
                    this.currentTime = `${min}:0${sec}`;
                } else {
                    this.currentTime = `${min}:${sec}`;
                }
            }
            //單句模式
            if (this.repeat == 1 && this.nowPlaying > -1) {
                this.fnSentenceRepeat();
            }
        },
        fnSentenceRepeat() {
            //找到目前撥放的句數與下一句的句數
            const sentence_start = this.startTimeArr[this.nowPlaying];
            const nowIndex = this.nowPlaying;
            const seekTime =
                Number(sentence_start.slice(0, 2)) * 60 +
                Number(sentence_start.slice(3, 5));
            const sentence_end = this.startTimeArr[this.nowPlaying + 1];
            this.playRadom = false;
            //console.log('現在播放句數:'+this.nowPlaying ,'目前播放時間:'+ this.currentTime, '該句撥放結束時間:'+sentence_end, '前往句數'+sentence_start)
            if (this.currentTime == sentence_end) {
                const idName = "myAudio0";
                const audio = document.getElementById(idName);
                if (!audio.ended) {
                    setTimeout(() => {
                        audio.currentTime = seekTime;
                        audio.play();
                    }, 10);
                }

                player.seekTo(seekTime);
                //回到該被重複的句數
                this.nowPlaying = nowIndex;
            }
        },
        playMode(mode) {
            this.mode = mode;
            const idName = "myAudio0";
            const audio = document.getElementById(idName);
            switch (mode) {
                case 0:
                    audio.muted = false;
                    player.unMute();
                    break;
                case 1:
                    audio.muted = false;
                    player.mute();
                    break;
                case 2:
                    audio.muted = true;
                    player.unMute();
                    break;
            }
        },
        //控制播放狀態
        fnPlay(state) {
            let vm = this;
            vm.playstate = state;
            const idName = "myAudio0";
            const audio = document.getElementById(idName);

            if (state == 1) {
                switch (vm.mode) {
                    case 0:
                        audio.muted = false;
                        if (!audio.ended) {
                            setTimeout(() => {
                                audio.play();
                            }, 10);
                        }

                        player.unMute().playVideo();
                        break;
                    case 1:
                        audio.muted = false;
                        if (!audio.ended) {
                            setTimeout(() => {
                                audio.play();
                            }, 10);
                        }
                        player.mute().playVideo();
                        break;
                    case 2:
                        audio.muted = true;
                        if (!audio.ended) {
                            setTimeout(() => {
                                audio.play();
                            }, 10);
                        }
                        player.unMute().playVideo();
                        break;
                }
            }
            if (state == 0) {
                player.pauseVideo();
                audio.pause();
            }
        },
        //上一首
        fnGoPrev() {
            location.href = `./video.html?videoId=${this.others.previous_id}&categoryId=${this.categoryId}`;
        },
        fnGoNext() {
            location.href = `./video.html?videoId=${this.others.next_id}&categoryId=${this.categoryId}`;
        },

        getList() {
            let vm = this;
            let member_id = sessionStorage.getItem("mindx");
            let customer_id = sessionStorage.getItem("cindx");
            this.member_id = member_id;
            this.customer_id = customer_id;
            //GET請求 相關連結
            axios
                .get(
                    `https://funday.asia/api/MusicboxWeb/ClassifyPg.asp?CategoryId=${this.categoryId}&member_id=${this.member_id}`
                )
                .then((res) => {
                    console.log(res);
                    vm.videoList = res.data[Object.keys(res.data)].slice(0, 8);
                })
                .catch((error) => console.log(error));
        },
        // ==========================================
        // == 錄音裝置請求 (audio設置)
        // ==========================================
        showDialog() {
            if (!/mobile/i.test(navigator.userAgent)) {
                return;
            }
            dialogCancel();
            console.log("show");
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
            let newRec = Recorder({
                type: "mp3",
                sampleRate: 16000,
                bitRate: 16,
                onProcess: function (
                    buffers,
                    powerLevel,
                    bufferDuration,
                    bufferSampleRate,
                    newBufferIdx,
                    asyncEnd
                ) {},
            });

            this.createDelayDialog(); // 防止特異 browser 設定狀況
            newRec.open(
                function () {
                    app.dialogCancel();
                    // console.log(newRec);
                    // console.log(
                    //     Recorder.FrequencyHistogramView({
                    //         elem: ".recwave",
                    //     })
                    // );
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
        },
        // ==========================================
        // == browser 錄音充許關閉 (釋放資源) (audio設置)
        // ==========================================
        recClose() {
            if (app.rec) {
                app.rec.close();
            }
        },
        // ==========================================
        // == 開始錄音(audio設置)
        // ==========================================
        recStart() {
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
                // console.log("push", recBlob);

                // CREATE AUDIO ELE v
                if (!app.recBlob) {
                    return;
                }

                // 加載 audio 物件 v
                const audio = document.createElement("audio");
                audio.controls = true; // true => 產生可操控介面
                audio.setAttribute("id", "myAudio0");
                document.getElementById("audioBox").append(audio);

                //簡單利用URL生成播放地址，注意不用了時需要revokeObjectURL，否則霸占暫存
                audio.src = URL.createObjectURL(app.recBlob[0]);
                console.log(audio.src);
                // setTimeout(function () {
                //     URL.revokeObjectURL(audio.src);
                // }, 1000);
            });
        },

        // ==========================================
        // === 開始錄音&倒數GIF ===
        // ==========================================
        goRec() {
            //介面改變
            app.recOpen();
            player.playVideo();
            player.pauseVideo();
            const countDown = document.querySelector(".countDown");
            const countDown_wrapper =
                document.querySelector(".countDown_wrapper");
            const startBtn = document.querySelector(".startBtn");
            const stopBtn = document.querySelector(".stopBtn");
            const time_now = document.querySelector(".time_now");
            countDown_wrapper.classList.remove("none");
            countDown.classList.remove("none");
            const img = document.querySelector(".countDownImg");
            img.src =
                "https://funday.asia/NewMylessonmobile/MusicBox/svg/countdown-compressor.gif";

            const promise = new Promise((resolve, reject) => {
                setTimeout(() => {
                    countDown_wrapper.classList.add("none");
                    countDown.classList.add("none");
                    startBtn.classList.add("none");
                    stopBtn.classList.remove("none");
                    time_now.classList.remove("none");
                    resolve();
                    openRec();
                }, 4500);
            });
            promise.then((value) => {
                player.playVideo();
            });

            //錄音功能
            function openRec() {
                app.recStart();
                setTimeout(() => {
                    app.recStop();
                    this.player.pauseVideo();
                }, app.vdTime * 1000);
            }
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
            this.recStop();
        },
        // ==========================================
        // === 重新錄音&倒數GIF ===
        // ==========================================
        reRec() {
            //刪除舊音檔
            this.nowPlaying = -1;
            this.mode = 0;
            player.pauseVideo();
            player.seekTo(0);
            app.recBlob.splice(0, 1);
            const idName = "myAudio0";
            const audio = document.getElementById(idName);
            audio.remove();
            const countDown = document.querySelector(".countDown");
            const countDown_wrapper =
                document.querySelector(".countDown_wrapper");
            const function01 = document.querySelector(".function01");
            const function02 = document.querySelector(".function02");
            const stopBtn = document.querySelector(".stopBtn");
            const time_now = document.querySelector(".time_now");
            function01.classList.remove("none");
            function02.classList.add("none");
            countDown_wrapper.classList.remove("none");
            countDown.classList.remove("none");
            const img = document.querySelector(".countDownImg");
            img.src =
                "https://funday.asia/NewMylessonmobile/MusicBox/svg/countdown-compressor.gif";
            setTimeout(() => {
                countDown_wrapper.classList.add("none");
                countDown.classList.add("none");
                stopBtn.classList.remove("none");
                time_now.classList.remove("none");
                openRec();
                player.playVideo();
            }, 4500);

            function openRec() {
                app.recStart();
                setTimeout(() => {
                    app.recStop();
                    player.pauseVideo();
                }, app.vdTime * 1000);
            }
        },
        // ==========================================
        // == 錄音上傳
        // ==========================================
        uploadFile() {
            document.getElementById("uploadProgress").classList.remove("none");
            var formData = new FormData();
            const blob = this.recBlob[0];
            const cid = sessionStorage.getItem("cindx");
            const mid = this.member_id;
            const vid = this.videoId.replace("#", "");
            formData.append("upfile", blob, `${cid}-${mid}-${vid}.mp3`);
            formData.append("member_id", `${mid}`);
            formData.append("customer_id", `${cid}`);
            formData.append("musicbox_id", `${vid}`);

            //上傳api
            axios({
                method: "post",
                url: "https://funday.asia/newmylessonmobile/api/FunKTVUpload",
                data: formData,
                headers: {
                    "Content-Type": false,
                },
                //上傳進度顯示
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.lengthComputable) {
                        let complete =
                            ((progressEvent.loaded / progressEvent.total) *
                                100) |
                            (0 + "%");
                        app.progress = complete;
                        if (complete >= 100) {
                            app.progress = "100%";
                        }
                    }
                },
            })
                .then(function (response) {
                    setTimeout(function () {
                        document
                            .getElementById("uploadProgress")
                            .classList.add("none");
                    }, 1000);
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        // ==========================================
        // == 單句模式
        // ==========================================
        repeatMode(e) {
            if (app.repeat == 0) {
                e.target.classList.add("repeat_check");
                app.repeat = 1;
            } else {
                e.target.classList.remove("repeat_check");
                app.repeat = 0;
            }
        },
    },
    created() {
        let vm = this;
        let hash = window.location.href;
        var player;
        hash = hash.split("?")[1];
        hash = hash.split("&"); //['categoryId=1','videoId=1050']
        vm.categoryId = hash[0].split("=")[1];
        vm.videoId = hash[1].split("=")[1];

        this.getList();
        this.getVideoData();
    },
});
