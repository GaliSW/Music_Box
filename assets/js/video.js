var app = new Vue({
    el: "#app",
    data: {
        categoryId: {}, //分類id
        videoId: {}, //API內該篇影片id
        related: {}, //相關推薦
        likeData: {},
        subTitle: {}, //歌詞細節
        songInfo: {}, //日前歌曲資訊
        ytUrl: "", //youtubeId
        ytTutor_url: "", //老師解說youtubeURL
        player: null, //YT撥放器
        teacher_player: null, //老師解說YT撥放器
        playstate: 0, //播放狀態 0:暫停 1:播放 ,
        captions: 1, //字幕狀態 0:關閉 1:英文 2:中文 3:中英,
        playMethods: 1, //1:循環 2.單曲 3.單句
        playRadom: true, //隨機撥放
        currentTime: "00:00", //目前播放時間
        allTime: "00:00", //整首歌的時間
        startTimeArr: [], //播放時間陣列,
        tutortimeArr: [], //老師講解時間列表
        nowPlaying: -1, //目前播放的歌詞行數
        ch_content: "", //目前中文字幕
        en_content: "", //目前英文字幕,
        timer: null, //setInterval計時器
        others: {}, //其他撥放清單,
        tutor: false, //老師講解打開
        paragraph: false, //老師講解分段
        subtitle_en: [], //英文歌詞組成span
        keyWordResult: {}, //字典搜尋結果
        baseForm: {}, //kk音標
        DrWordModal: false, //字典modal開關
        DrWord: "", //字本人
        member_id: "",
        customer_id: "",
        singleMode: false, //單句模式
        repeat: 0, //播放配音單句模式
        progress: "0%",
        recBlob: [], //單一錄音檔案
        dialogInt: "",
        rec: {},
        wave: {},
        vdTime: 0,
        dictionary: false, //是否開啟字典
        fburl: "", //臉書分享網址
        lineurl: "", //Line分享網址
        twitterurl: "", //Line分享網址
        emailurl: "", //ig分享網址
        whatsurl: "", //whats app分享網址
        linkedinurl: "", //linkedin分享網址
        URL: "", //本頁網址
        findPara: false, //是否點擊跳句
        nowTab: 0, //目前tab頁面 0:字幕 1:配音列表
        recMode: false, //歡唱模式
        audioPlayMode: 0, //播放錄音模式 0:同步 1:錄音聲音 2:影片聲音
        audioTime: 0, //音檔長度陣列
        audioTimer: "", //計時器
        audioStatus: false, //是否正在播放配音
        sid: "", //計時器Interval
        nowPlayAudioIndex: -1, //正在播放的音檔編號
        hint: "", //模式提示
    },
    computed: {},
    watch: {
        currentTime: function (val, oldVal) {
            //比對到歌詞秒數陣列
            if (
                this.startTimeArr.indexOf(this.currentTime) !== -1 &&
                !this.singleMode &&
                !this.findPara
            ) {
                //增加播放行數
                this.nowPlaying++;
                // console.log(this.nowPlaying);
                let subtitleIndex = this.startTimeArr.indexOf(this.currentTime);
                // console.log(subtitleIndex);
                // console.log(this.subTitle[subtitleIndex].ch_content);
                this.ch_content = this.subTitle[subtitleIndex].ch_content;
                this.en_content = this.subTitle[subtitleIndex].en_content;
            } else {
                setTimeout(() => {
                    this.findPara = false;
                }, 500);
            }
        },
        nowPlaying: function () {
            if (this.nowPlaying != -1 && !this.findPara) {
                if ($(".subtitle_items li.active").length == 0) return;
                if (this.DrWordModal) return;
                //字幕滾動區
                const listWindowContent =
                    document.querySelector(".subtitle_items");
                //字幕視窗高度
                const listWindowHeight = listWindowContent.offsetHeight;
                //字幕視窗上方與瀏覽器距離
                const listWindowTop = listWindowContent.offsetTop;
                //滾動觸發
                const listWindowBottom = listWindowHeight - listWindowTop;

                //字幕區塊高(每句高度都不同)
                const sutitleBlkHeight = document.querySelector(
                    ".subtitle_items li.active"
                ).offsetHeight;
                //正在播放的字幕與瀏覽器距離 (會隨歌曲撥放而跳句)
                const sutitleBlkTop =
                    document.querySelector(".subtitle_items li.active")
                        .offsetTop + sutitleBlkHeight;

                if (this.singleMode) return; //單句模式不滾動
                //提前觸發
                if (this.repeat == 0 || !this.singleMode) {
                    listWindowContent.scrollTo({
                        top: sutitleBlkTop, //包含上下行距
                        behavior: "smooth",
                    });
                }
                // if (sutitleBlkTop > listWindowBottom - 200) {
                //     listWindowContent.scrollBy({
                //         top: sutitleBlkHeight,
                //         behavior: "smooth",
                //     });
                // }
            }
        },
        paragraph: async function (val, oldVal) {
            await this.fnTutor();
        },
        hint: function (val, oldVal) {
            clearTimeout(disable);
            document.querySelector(".hint").style.visibility = "visible";
            document.querySelector(".hint").style.opacity = 1;
            disable();
            function disable() {
                setTimeout(() => {
                    document.querySelector(".hint").style.visibility = "hidden";
                    document.querySelector(".hint").style.opacity = 0;
                }, 1500);
            }
        },
    },
    methods: {
        //youtube iframe API
        getVideo() {
            let vm = this;
            //內頁歌曲
            axios
                .get(
                    "https://funday.asia/api/MusicboxWeb/MusicboxJson.asp?indx=" +
                        vm.videoId
                )
                .then((res) => {
                    vm.subTitle = res.data.data;
                    vm.others = res.data.others;
                    vm.songInfo = res.data.info;
                    console.log(vm.songInfo);
                    //字串時間
                    vm.startTimeArr = vm.subTitle.map((ele, idx, array) => {
                        return (
                            ele.time.split(":")[0] +
                            ":" +
                            ele.time.split(":")[1].split(".")[0]
                        );
                    });

                    //給字典用
                    for (let i = 0; i < this.subTitle.length; i++) {
                        let en = this.subTitle[i].en_content.split(" ");
                        this.subtitle_en[i] = en;
                    }

                    // 取得 youtube 網址轉換
                    const youtubeId =
                        vm.songInfo.url.split("https://youtu.be/")[1];
                    //老師解說YtUrl
                    vm.ytTutor_url = `https://www.youtube-nocookie.com/embed/${
                        vm.songInfo.tutor_url.split("/")[3]
                    }?enablejsapi=1&controls=0&showinfo=0&autoplay=1&rel=0`;

                    //初始化Youtube
                    const _ = this;
                    const youtubeUrl = `https://www.youtube-nocookie.com/embed/${youtubeId}?enablejsapi=1&controls=0&showinfo=0&autoplay=0&rel=0&cc_lang_pref=en&cc_load_policy=0`;
                    this.ytUrl = youtubeUrl;
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
                            // videoId: _.ytId,
                            events: {
                                onReady: onPlayerReady,
                                onStateChange: onPlayerStateChange, //偵測播放狀態
                                onError: onPlayerError,
                            },
                        });
                        player2 = new YT.Player("teacher_player", {
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
                            // videoId: _.ytId,
                            events: {
                                onReady: onPlayerReady2,
                                onStateChange: onPlayerStateChange2, //偵測播放狀態
                                onError: onPlayerError2,
                            },
                        });
                        player3 = new YT.Player("teacher_player2", {
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
                            // videoId: _.ytId,
                            events: {
                                onReady: onPlayerReady3,
                                onStateChange: onPlayerStateChange3, //偵測播放狀態
                                onError: onPlayerError3,
                            },
                        });
                    };

                    function onPlayerReady(evt) {
                        //取得影片長度 秒
                        const time = player.getDuration();
                        app.vdTime = time;
                        let min = Math.floor(time / 60);
                        let sec = (time % 60).toFixed(0);

                        if (min < 10 && sec < 10) {
                            app.allTime = `0${min}:0${sec}`;
                        } else if (min < 10 && sec == 10) {
                            app.allTime = `0${min}:${sec}`;
                        } else if (min < 10 && sec > 10) {
                            app.allTime = `0${min}:${sec}`;
                        } else if (min > 10 && sec < 10) {
                            app.allTime = `${min}:0${sec}`;
                        } else {
                            app.allTime = `${min}:${sec}`;
                        }
                    }
                    function onPlayerStateChange(e) {
                        //		console.log("Player state changed", e.data);
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
                    function onPlayerError(evt) {
                        console.log("error");
                        console.log(evt);
                    }
                    function onPlayerReady2(evt) {
                        //取得影片長度 秒
                        console.log(player2);
                        // player2.mute().playVideo();
                    }
                    function onPlayerStateChange2(e) {
                        console.log("Player2 state changed", e.data);
                    }
                    function onPlayerError2(evt) {
                        console.log("error");
                        console.log(evt);
                    }
                    function onPlayerReady3(evt) {
                        //取得影片長度 秒
                        console.log(player2);
                        // player2.mute().playVideo();
                    }
                    function onPlayerStateChange3(e) {
                        console.log("Player3 state changed", e.data);
                    }
                    function onPlayerError3(evt) {
                        console.log("error");
                        console.log(evt);
                    }
                })
                .catch((error) => console.log(error));
        },
        //取得影片時間軸 每500毫秒檢查一次
        fnTimeChecking() {
            //取得目前時間 秒
            const time = player.getCurrentTime();
            //取得影片長度 秒
            const allTime = player.getDuration();
            this.currentTime = time;
            // console.log(time);

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
                } else if (min > 10 && sec < 10) {
                    this.currentTime = `${min}:0${sec}`;
                } else {
                    this.currentTime = `${min}:${sec}`;
                }
            }
            //單句模式
            if (this.singleMode) {
                this.fnSentenceRepeat();
            }
        },
        //控制播放狀態
        fnPlay(state) {
            this.audioStatus = false;
            this.playstate = state;
            if (state == 1) {
                player.unMute().playVideo();
                player3.playVideo();
            }
            if (state == 0) {
                player.pauseVideo();
            }
        },
        //控制字幕狀態
        fnCaptions(e) {
            //字幕狀態 0:關閉 1:中英 2:英文 3:中文,
            if (e == 0) {
                this.captions += 1;
                this.hint = "字幕模式:英文及中文";
            }
            if (e == 1) {
                this.captions += 1;
                this.hint = "字幕模式:英文";
            }
            if (e == 2) {
                this.captions += 1;
                this.hint = "字幕模式:中文";
            }
            if (e == 3) {
                this.captions = 0;
                this.hint = "字幕模式:無字幕";
            }
        },
        //控制播放狀態
        fnPlayMethods(e) {
            //播放方式 1:循環 2:單曲 3:單句,
            if (e == 1) {
                this.playMethods = 2;
                this.playRadom = false;
                this.hint = "播放模式:單曲";
            }
            if (e == 2) {
                this.playMethods = 3;
                this.playRadom = true;
                this.hint = "播放模式:隨機";
            }
            if (e == 3) {
                this.playMethods = 1;
                this.playRadom = false;
                this.hint = "播放模式:循環";
            }
            if (e == 4) {
                this.singleMode = true;
                this.hint = "單句模式:開啟";
            }
            if (e == 5) {
                this.singleMode = false;
                this.hint = "單句模式:關閉";
            }
        },
        //按歌詞播放某一段
        fnSeekTo(event) {
            if (this.recMode) return;

            this.findPara = true;
            let gotoTime = $(event.target).data("seek");
            let nowplayingLyric = $(event.target).data("count");
            console.log(nowplayingLyric);
            console.log(this.subTitle[nowplayingLyric]);
            this.ch_content = this.subTitle[nowplayingLyric].ch_content;
            this.en_content = this.subTitle[nowplayingLyric].en_content;
            this.nowPlaying = nowplayingLyric; //把播放句子的index重新指定
            if (this.playstate == 0) {
                player.seekTo(gotoTime);
                player.unMute().playVideo();
            } else {
                player.seekTo(gotoTime);
            }
        },
        fnTimeBar(e) {
            console.log("a");
        },
        //單句循環模式
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
                if (document.getElementById("myAudio0") !== null) {
                    const idName = "myAudio0";
                    const audio = document.getElementById(idName);
                    if (!audio.ended) {
                        setTimeout(() => {
                            audio.currentTime = seekTime;
                            audio.play();
                        }, 10);
                    }
                }

                player.seekTo(seekTime);
                //回到該被重複的句數
                this.nowPlaying = nowIndex;
            }
        },

        //單曲循環模式
        fnSingleSongRepeat(e) {
            this.playRadom = false;
            //單曲模式 + 撥放結束 + 老師講解關閉
            if (
                this.playMethods == 2 &&
                e.data === YT.PlayerState.ENDED &&
                this.tutor == false
            ) {
                player.seekTo(0);
                player.playVideo();
            }
        },
        //循環播放清單
        fnPlayListRepeat(e) {
            console.log("循環");
            this.playRadom = true;
            if (this.playMethods == 1 && e.data === YT.PlayerState.ENDED) {
                location.href = `./video.html?categoryId=${this.categoryId}&videoId=${this.others.next_id}`;
            }
        },
        //隨機播放清單
        fnPlayListRamdom() {
            console.log("隨機");
            if (this.playMethods == 1 && e.data === YT.PlayerState.ENDED) {
                location.href = `./video.html?categoryId=${this.categoryId}&videoId=${this.others.random_id}`;
                console.log("隨機撥放");
            }
        },
        //下一首
        fnGoNext() {
            location.href = `./video.html?categoryId=${this.categoryId}&videoId=${this.others.next_id}`;
        },
        //下一首
        fnGoPrev() {
            location.href = `./video.html?categoryId=${this.categoryId}&videoId=${this.others.previous_id}`;
        },
        //老師講解目前沒有要開發
        // fnTutor() {
        //     //tutor:true,  老師講解打開
        //     //paragraph:false 老師講解分段
        //     if (this.tutor == true && this.paragraph == false) {
        //         console.log("老師講解打開 + 整首");
        //         //播放完畢
        //         if (currentTime == allTime) {
        //             this.subTitle.forEach((item) => {
        //                 if (item.Tutortime !== "") {
        //                     let seekTutorTime;
        //                     seekTutorTime =
        //                         parseFloat(
        //                             Math.round(item.Tutortim.split(":")[0])
        //                         ) *
        //                             60 +
        //                         parseFloat(
        //                             parseFloat(
        //                                 item.Tutortim.split(":")[1]
        //                             ).toFixed(2)
        //                         );
        //                     player.seekTo(seekTutorTime);
        //                 }
        //             });
        //         }
        //     }

        //     if (this.tutor == true && this.paragraph == true) {
        //         console.log("老師講解打開 + 分段");
        //     }
        // },
        fnTutor() {
            if (this.tutor) {
                this.tutor = false;
            } else {
                this.tutor = true;
            }
        },
        //切換配音tab
        tabChange() {
            if (this.nowTab == 0) {
                this.nowTab = 1;
                let timeArr = [];
                for (let i = 0; i < this.likeData.length; i++) {
                    let duration;
                    let time = document.getElementById(`audio${i}`).duration;

                    let min = Math.floor(time / 60);
                    let sec = (time % 60).toFixed(0);
                    if (min < 10 && sec < 10) {
                        duration = `0${min}:0${sec}`;
                    } else if (min < 10 && sec == 10) {
                        duration = `0${min}:${sec}`;
                    } else if (min < 10 && sec > 10) {
                        duration = `0${min}:${sec}`;
                    } else if (min > 10 && sec < 10) {
                        duration = `${min}:0${sec}`;
                    } else {
                        duration = `${min}:${sec}`;
                    }
                    timeArr.push(duration);
                }
                this.audioTime = timeArr;
            } else {
                this.nowTab = 0;
            }
        },
        //取得相關推薦資料
        getPageData() {
            let vm = this;

            let hash = window.location.href;
            this.URL = hash;
            hash = hash.split("?")[1];
            console.log(hash);
            // ===產生分享網址===
            // *FB
            this.fburl = `javascript: void(window.open('http://www.facebook.com/share.php?u='.concat(encodeURIComponent('https://newb2b.funday.asia/mylesson/video_project/video.html?${hash}'))));`;
            //*Line
            this.lineurl = `https://social-plugins.line.me/lineit/share?url=https://newb2b.funday.asia/mylesson/video_project/video.html?${hash}`;
            //*twitter
            this.twitterurl = `https://twitter.com/intent/tweet?url=https://newb2b.funday.asia/mylesson/video_project/video.html?${hash}}`;
            //*email
            this.emailurl = `mailto:?to=&subject=Funtube&body=https://newb2b.funday.asia/mylesson/video_project/video.html?${hash}`;
            //*Whatsapp
            this.whatsurl = `https://api.whatsapp.com/send?text=https://newb2b.funday.asia/mylesson/video_project/video.html?${hash}`;
            //*Linkedin
            this.linkedinurl = `https://www.linkedin.com/shareArticle?mini=true&title=Funtube&url=https://newb2b.funday.asia/mylesson/video_project/video.html?${hash}`;

            hash = hash.split("&"); //['categoryId=1','videoId=1050']

            vm.categoryId = hash[0].split("=")[1];
            vm.videoId = hash[1].split("=")[1];

            //GET請求 相關連結
            axios
                .get(
                    `https://funday.asia/api/MusicboxWeb/ClassifyPg.asp?CategoryId=${this.categoryId}&member_id=${this.member_id}`
                )
                .then((res) => {
                    vm.related = res.data[Object.keys(res.data)].slice(0, 8);
                })
                .catch((error) => console.log(error));
        },
        //手機版進入歡唱選項
        choose(status) {
            player.pauseVideo();
            switch (status) {
                case 0:
                    document
                        .querySelector(".chooseBlk")
                        .classList.remove("none");
                    break;
                case 1:
                    document.querySelector(".chooseBlk").classList.add("none");
                    player.seekTo(0);
                    this.currentTime = "00:00";
                    this.startRecord();
                    break;
                case 2:
                    document.querySelector(".chooseBlk").classList.add("none");
                    break;
            }
        },
        //開始錄音
        startRecord() {
            if (sessionStorage.getItem("mindx") == undefined) {
                // alert("請先登入會員");
                $("#myModal09").modal("hide");
                $("#myModal07").modal("show");
            } else {
                player.seekTo(0);
                this.currentTime = "00:00";
                this.goRec();
            }
        },
        //搜尋單字
        fnSearchWord(target, evt) {
            if (this.recMode) return;
            if (document.querySelector(".select") !== null) {
                document.querySelector(".select").classList.remove("select");
            }
            let vm = this;
            vm.DrWordModal = true;
            vm.DrWord = target;
            console.log(evt.target);
            evt.target.classList.add("select");
            const str = target
                .replace(".", "")
                .replace("?", "")
                .replace("!", "")
                .replace(";", "")
                .replace("’", "'")
                .replace(")", "")
                .replace("(", "")
                .replace('"', "")
                .replace("--", "")
                .replace(",", "");
            $(".Dr_title .word h3").html(str);
            const md5str = md5(`${str}|Funday1688`);

            axios
                .get(
                    `https://funday.asia/api/dr.eye.asp?keyword=${str}&Fundaykey=${md5str}`
                )
                .then((res) => {
                    vm.keyWordResult = res.data;
                    vm.baseForm = res.data.baseform.text;
                    let keys = Object.keys(vm.keyWordResult);
                    let re = /@/gi;
                    let re2 = /,/gi;

                    for (var i = 0; i < keys.length; i++) {
                        let fixWord = [];
                        for (
                            var j = 0;
                            j < vm.keyWordResult[keys[i]].text.length;
                            j++
                        ) {
                            fixWord.push(
                                vm.keyWordResult[keys[i]].text[j]
                                    .toString()
                                    .replace(re, "")
                                    .replace(re2, " ")
                            );
                        }
                        vm.keyWordResult[keys[i]].text = fixWord;
                    }

                    if (window.innerWidth > 600) {
                        $(".DrWord").css({ right: 50, top: evt.pageY - 20 });
                    }

                    this.DrWordModal = true;
                })
                .catch((error) => console.log(error));

            if (this.customer_id) {
                //查詢是否有收錄過該字詞
                this.getDrWordModal();
            }
        },
        //查詢已收錄字典
        getDrWordModal(e) {
            //api/Articla/CheckWords
            axios
                .get(
                    `https://funday.asia/NewMylessonmobile/api/vocabulary?customer_id=${this.customer_id}&member_id=${this.member_id}&Enkeyword=${this.DrWord}&Chkeyword=`
                )
                .then((res) => {
                    console.log(res.data.En_word);
                    if (res.data.En_word == "") {
                        console.log("n");
                        $(".collect .icon .fas.fa-heart").hide();
                        $(".collect .icon .far.fa-heart").show();
                    } else {
                        console.log("y");
                        $(".collect .icon .fas.fa-heart").show();
                        $(".collect .icon .far.fa-heart").hide();
                    }
                })
                .catch((error) => console.log(error));
        },
        //會員單字收錄
        fnWordsCollect(e) {
            //api/Article/WordsCollect
            if (!this.member_id) {
                // alert("請先登入");
                $("#myModal07").modal("show");
                return;
            }
            axios
                .get(
                    `https://funday.asia/NewMylessonmobile/C/api/vocabulary/join?customer_id=${this.customer_id}&member_id=${this.member_id}&Enkeyword=${this.DrWord}&Chkeyword=`
                )
                .then((res) => {
                    // alert(res.data.StateMessage);
                    $(".collect .icon .fas.fa-heart").show();
                    $(".collect .icon .far.fa-heart").hide();
                })
                .catch((error) => console.log(error));
        },
        //刪除單字
        deleteWord($event) {
            //api/Article/WordsCollectSort 取得該單字的order
            //取得後再刪除
            //api/Article/DeleteWordsCollect  刪除

            console.log($event);
            axios
                .get(
                    `https://funday.asia/NewMylessonmobile/D/api/vocabulary/join?customer_id=${this.customer_id}&member_id=${this.member_id}&Enkeyword=${this.DrWord}&Chkeyword=`
                )
                .then((res) => {
                    // alert(res.data.ReturnMessage);
                    $(".collect .icon .fas.fa-heart").hide();
                    $(".collect .icon .far.fa-heart").show();
                })
                .catch((error) => console.log(error));
        },
        //關閉字典
        fnCloseDrWordModal() {
            this.DrWordModal = false;
            document.querySelector(".select").classList.remove("select");
            $(".DrWordModal").removeClass("active");
        },
        //收藏該篇歌曲
        fnAddToCollection($event) {
            //判斷是否登入
            if (!this.member_id) {
                // alert("請先登入");
                $("#myModal07").modal("show");
                return;
            }

            //取得點擊到的該篇影片id
            let VideoId = $($event.target).data("videoid");
            //此API在同一個歌曲編號的狀況下，再打一次為取消收藏
            axios
                .post(
                    `https://funday.asia/api/MusicboxWeb/Behavior.asp?member_id=${this.member_id}&ref_id=${VideoId}&action=favorite`
                )
                .then((res) => {
                    if (res.data.State == 1) {
                        //新增成功
                        $($event.target).addClass("favorites");
                    }

                    if (res.data.State == 2) {
                        //刪除成功
                        $($event.target).removeClass("favorites");
                    }
                })
                .catch((error) => console.log(error));
        },
        fnLike(PromoteId, VideoId, $event) {
            if (!this.member_id) {
                // alert("請先登入");
                $("#myModal07").modal("show");
                return;
            }

            axios
                .post(
                    `https://funday.asia/api/MusicboxWeb/Behavior.asp?member_id=${this.member_id}&ref_id=${VideoId}&p_member_id=${PromoteId}&action=promote`
                )
                .then((res) => {
                    if (res.data.State == 1) {
                        $($event.target).find(".img").addClass("click");
                        this.getLikeData();
                    }
                    if (res.data.State == 2) {
                        $($event.target).find(".img").removeClass("click");
                        this.getLikeData();
                    }
                })
                .catch((error) => console.log(error));
        },
        getLikeData() {
            axios
                .get(
                    `https://funday.asia/api/MusicboxWeb/RecordingList.asp?indx=${this.videoId}&member_id=${this.member_id}`
                )
                .then((res) => {
                    console.log(res);
                    if (res.data[Object.keys(res.data)][0].Id == "") return;
                    this.likeData = res.data[Object.keys(res.data)];
                })
                .catch((error) => console.log(error));
        },
        //我的收藏
        toMyFav() {
            if (!this.member_id) {
                // alert("請先登入");
                $("#myModal07").modal("show");
                return;
            } else {
                location.href = "./video_collect.html";
            }
        },
        // ==========================================
        // === 分享 ===
        // ==========================================
        share() {
            document.querySelector(".share_blk").classList.toggle("none");
        },
        shareClose() {
            document.querySelector(".share_blk").classList.toggle("none");
        },
        copyURL() {
            var url = document.getElementById("copyUrl");
            url.select();
            document.execCommand("copy");
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
        back() {
            this.recMode = false;
            this.recEnd();
            player.seekTo(0);
            this.currentTime = "00:00";
            player.stopVideo();
        },
        // ==========================================
        // === 開始錄音&倒數GIF ===
        // ==========================================
        goRec() {
            //介面改變
            app.recOpen();
            player.playVideo();
            player.unMute();
            player.pauseVideo();
            player.seekTo(0);
            this.recMode = true;
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
            this.audioPlayMode = 0;
            player.pauseVideo();
            player.unMute();
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
            countDown_wrapper.classList.remove("none");
            countDown.classList.remove("none");
            const img = document.querySelector(".countDownImg");
            function01.classList.remove("none");
            function02.classList.add("none");
            img.src =
                "https://funday.asia/NewMylessonmobile/MusicBox/svg/countdown-compressor.gif";
            setTimeout(() => {
                countDown_wrapper.classList.add("none");
                countDown.classList.add("none");

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
            if (!app.singleMode) {
                app.singleMode = true;
            } else {
                app.singleMode = false;
            }
        },
        playMode(mode) {
            this.audioPlayMode = mode;
            const idName = "myAudio0";
            const audio = document.getElementById(idName);
            switch (mode) {
                case 0:
                    audio.muted = false;
                    player.unMute();
                    break;
                case 1:
                    audio.muted = true;
                    player.unMute();
                    break;
                case 2:
                    audio.muted = false;
                    player.mute();
                    break;
            }
        },
        //控制播放狀態
        fnPlayAudio(state) {
            let vm = this;
            vm.playstate = state;
            const idName = "myAudio0";
            const audio = document.getElementById(idName);

            if (state == 1) {
                switch (vm.audioPlayMode) {
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
        //播放配音列表
        playAudio(index) {
            if (!this.audioStatus) {
                player.seekTo(0);
                this.audioStatus = true;
            } else if (this.recMode) {
                return;
            }
            //點選別的音檔 init原先音檔
            if (
                this.nowPlayAudioIndex !== index &&
                this.nowPlayAudioIndex !== -1
            ) {
                document.getElementById(
                    `audio${this.nowPlayAudioIndex}`
                ).currentTime = 0;
                document
                    .getElementById(`audio${this.nowPlayAudioIndex}`)
                    .pause();
                document
                    .querySelector(`.audioTimer${this.nowPlayAudioIndex}`)
                    .classList.add("none");

                document
                    .querySelector(`.audioLength${this.nowPlayAudioIndex}`)
                    .classList.remove("none");
                document
                    .getElementById(`audioPlay${this.nowPlayAudioIndex}`)
                    .classList.remove("click");
                player.seekTo(0);
                this.goTimer(false);
            }
            const audio = document.getElementById(`audio${index}`);
            const audioPlay = document.getElementById(`audioPlay${index}`);
            const time = audio.duration - audio.currentTime;
            this.nowPlayAudioIndex = index;
            if (audioPlay.classList.contains("click")) {
                audioPlay.classList.remove("click");
                player.pauseVideo();
                audio.pause();
                this.goTimer(false);
            } else {
                if (audio.ended) {
                    player.seekTo(0);
                }
                audioPlay.classList.add("click");
                player.mute().playVideo();
                audio.play();
                // === 秒數倒數 ===
                let timer = Math.round(time * 10) / 10;
                this.goTimer(true, timer, index);
                document
                    .querySelector(`.audioTimer${index}`)
                    .classList.remove("none");

                document
                    .querySelector(`.audioLength${index}`)
                    .classList.add("none");
            }
        },
        //配音時間倒數
        goTimer(status, timer, index) {
            // var sid;
            if (status) {
                this.sid = setInterval(() => {
                    if (timer > 0) {
                        timer -= 0.1;
                        timer = Math.round(timer * 10) / 10;
                    } else {
                        clearInterval(this.sid);
                        player.pauseVideo();
                        document
                            .querySelector(`.audioTimer${index}`)
                            .classList.add("none");
                        document
                            .querySelector(`.audioLength${index}`)
                            .classList.remove("none");
                        document
                            .getElementById(`audioPlay${index}`)
                            .classList.remove("click");
                        this.audioTimer = "";
                        this.audioStatus = false;
                    }
                    app.timeStr(timer, true, "分", "秒");
                }, 100);
            } else {
                clearInterval(this.sid);
                // this.audioTimer = "";
            }
        },
        // === 秒數計算 ===
        timeStr(time, decimal, f1, f2) {
            let m = Math.floor(time / 60);
            let s = m > 0 ? Math.floor(time - m * 60) : Math.floor(time);
            if (String(s).length < 2 && f2 === "") s = "00" + s; // f2 === 0 為「只在時間軸上補零，錄音倒數不補」意思
            let ss = time - m * 60 - s;
            ss = Math.round(ss * 10) / 10;
            ss = String(ss).substr(1) || ".0";
            //
            // console.log(s);
            let str = "";
            if (m >= 10 && s >= 10) {
                str = `${m}:${s}`;
            } else if (m >= 10 && s < 10) {
                str = `${m}:0${s}`;
            } else if (m < 10 && s >= 10) {
                str = `0${m}:${s}`;
            } else if (m < 10 && s < 10) {
                str = `0${m}:0${s}`;
            }
            // if (m < 10 && m > 0) str += "0" + m + ":";
            // if (m <= 0) str += "00:"; // f2 === 0 為「只在時間軸上補零，錄音倒數不補」意思
            // if (s < 10) {
            //     str += "00:0" + s;
            // } else {
            //     str += s;
            // }
            // if (decimal) str += ss;
            // str += f2;
            this.audioTimer = str;
        },
    },
    created() {
        let member_id = sessionStorage.getItem("mindx");
        let customer_id = sessionStorage.getItem("cindx");
        this.member_id = member_id;
        this.customer_id = customer_id;
        var player;
        var player2;
        var player_teacher_mobile;
        this.getPageData();
        this.getVideo();
        this.getLikeData();
    },
});
