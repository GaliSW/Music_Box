﻿var tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
// import Filter from "../../node_modules/bad-words/lib/badwords.js";
import badWordsPlus from "https://cdn.skypack.dev/bad-words-plus";
import zhBadWords from "./words.js";

var app = new Vue({
    el: "#app",
    data: {
        pre_height: true,
        sidebar: {},
        HotRecording: {},
        HotClick: {},
        banner: {},
        vedioListData: {},
        myVideoId: "",
        ytUrl: "",
        player: null,
        member_id: "",
        customer_id: "",
        pic: "",
        sex: "",
        nickname: "",
        recommendMessage: "",
        radio: false,
        stream: "", //廣播
        podcast: false,
        board: false, //留言板開關
        emoji: false, //emoji開關
        boardContent: {}, //留言板內容
        boardMessage: {}, //留言板跑馬燈訊息
        boardNow: 0, //留言板顯示訊息
        messageObj: {}, //發送者訊息
        userPic: "",
        userImg: "", //發送者頭像
        userName: "", //發送者姓名
        message: "", //發送者訊息
        userSex: "", //發送者性別
        notifications: "", //推波
        alert: "", //留言板錯誤訊息
        notiStatus: "", //手機板推播訊息
        notiSex: "", //手機版推播性別
        notiName: "", //手機版推播姓名
        notiPic: "", //手機版推播頭像
        notiIndex: -1, //手機版推播則數
        notiChange: false, //手機版推播動畫開關
        ads: true, //廣告預設開啟
        logoIndex: 0, //Logo切換
        firstClick: false, //是否第一次點擊頁面
        tab: true,
        componentKey: 0,
        isClick: false, //收藏是否點擊
        ADid: "", //廣告參數
        vdOpen: false, //新手上路是否開啟
        searchList: [],
    },
    watch: {
        alert: function (val, oldVal) {
            if (val == "") {
                return false;
            }
            clearTimeout(disable);
            document.querySelector(".alertHint").style.visibility = "visible";
            document.querySelector(".alertHint").style.opacity = 1;
            disable();
            function disable() {
                setTimeout(() => {
                    document.querySelector(".alertHint").style.visibility =
                        "hidden";
                    document.querySelector(".alertHint").style.opacity = 0;
                }, 1500);
            }
        },
    },
    computed: {},
    methods: {
        getData() {
            let vm = this;
            //GET請求首頁資料
            const promise1 = new Promise((resolve, reject) => {
                axios
                    .get(
                        `https://funday.asia/API/musicboxweb/defaultList.asp?member_id=${
                            this.member_id
                        }&timestamp=${new Date().getTime()}`
                    )
                    .then((res) => {
                        vm.sidebar = res.data.Category;
                        vm.HotRecording = res.data["Hot Recording"];
                        vm.HotClick = res.data["Hot Click"];
                        vm.banner = res.data.Banner[0];
                        vm.myVideoId = this.banner.Video.split("/")[3];
                        // console.log(vm.myVideoId);
                        let result = vm.sidebar.map((element, index, array) => {
                            //只顯示四筆資料
                            return {
                                title: element.Category,
                                id: element.CategoryId,
                                data: res.data[element.Category]
                                    .map((ele2, idx, array) => {
                                        return {
                                            ...ele2,
                                            categoryId: element.CategoryId,
                                        };
                                    })
                                    .slice(0, 4),
                            };
                        });
                        vm.vedioListData = result;
                        // alert(result[0].data[0].Bookmark);
                        for (let i = 0; i < vm.sidebar.length; i++) {
                            if (
                                vm.sidebar[i].Category ==
                                "Folk/Country民歌/鄉村"
                            ) {
                                vm.sidebar[i].Category = "Country鄉村";
                            }
                            if (vm.sidebar[i].Category == "Rap饒舌樂") {
                                vm.sidebar[i].Category = "";
                            }
                            if (
                                vm.sidebar[i].Category ==
                                "Teacher's Notes老師解說"
                            ) {
                                vm.sidebar[i].Category = "老師解說";
                            }
                        }
                        resolve("Success");
                    })
                    .catch((error) => console.log(error));
            });

            promise1.then((successMessage) => {
                vm.initYoutube();
                this.pre_height = false;
            });
        },
        initYoutube() {
            const _ = this;

            // const youtubeUrl = `https://www.youtube.com/embed/${app.myVideoId}?enablejsapi=1`;
            const youtubeUrl = `https://www.youtube.com/embed/${app.myVideoId}?enablejsapi=1&controls=0&showinfo=0&autoplay=1&rel=0&mute=1&loop=1`;
            this.ytUrl = youtubeUrl;
            this.player = new YT.Player("player", {
                playerVars: {
                    autoplay: 1,
                    mute: 1,
                    playsinline: 1,
                    loop: 1,
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
                videoId: _.myVideoId,
                events: {
                    onReady: _.onPlayerReady,
                    onStateChange: _.onPlayerStateChange,
                },
            });
        },
        onPlayerReady(evt) {
            // evt.target.mute();
            evt.target.playVideo();
        },
        onPlayerStateChange(evt) {
            if (evt.data == 0) {
                evt.target.seekTo(0);
                evt.target.playVideo();
            }
            if (evt.data == 1) {
                evt.target.setVolume(100);
            }
        },
        bannerToUrl() {
            if (
                sessionStorage.getItem("free") !== undefined &&
                sessionStorage.getItem("mindx") == undefined
            ) {
                let useNum = Number(sessionStorage.getItem("free")) + 1;
                sessionStorage.setItem("free", useNum);
            }
            window.location.href = `./video.html?categoryId=${this.banner.CategoryId}&videoId=${this.banner.Id}`;
        },
        //收藏該篇歌曲
        fnAddToCollection($event) {
            if (!this.member_id) {
                alert("請先登入");
                $("#myModal07").modal("show");
                return;
            }
            if (this.isClick) return;
            let VideoId = $($event.target).data("videoid");
            this.isClick = true;
            //此API在同一個歌曲編號的狀況下，再打一次為取消收藏
            axios
                .get(
                    `https://funday.asia/api/MusicboxWeb/Behavior.asp?member_id=${this.member_id}&ref_id=${VideoId}&action=favorite`
                )
                .then((res) => {
                    if (res.data.State == 1) {
                        //新增成功
                        $($event.target).addClass("favorites");
                        app.isClick = false;
                    }

                    if (res.data.State == 2) {
                        //刪除成功
                        // console.log(res);
                        $($event.target).removeClass("favorites");
                        app.isClick = false;
                    }
                })
                .catch((error) => console.log(error));
        },
        //播放radio
        fnRadio() {
            const audio = document.getElementById("Fun_audio");
            if (this.radio) {
                this.stream = "";
                this.radio = false;
                audio.pause();
            } else {
                this.stream = "https://s1.phx.icastcenter.com:9008/stream";
                this.radio = true;
                setTimeout(() => {
                    audio.play();
                }, 1000);
            }
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
        //推播
        notification() {
            "use strict";
            function getNotification() {
                axios
                    .get("https://funday.asia/api/musicboxweb/RealTimeList.asp")
                    .then((response) => {
                        // console.log(response.data.reverse());
                        if (response.data.length !== 0) {
                            const length = response.data.length;
                            if (length < 10) {
                                app.notifications = response.data;
                            } else {
                                app.notifications = response.data.slice(0, 9);
                            }
                            // if(window.innerHeight < )
                            if (app.notiIndex < app.notifications.length - 1) {
                                app.notiIndex++;

                                app.notiName =
                                    app.notifications[app.notiIndex].Nickname;
                                app.notiStatus =
                                    app.notifications[app.notiIndex].Status;
                                app.notiSex =
                                    app.notifications[app.notiIndex].Sex;
                                app.notiPic =
                                    app.notifications[app.notiIndex].Pic;
                                app.notiChange = true;
                            } else {
                                // console.log("123");
                                app.notiIndex = 0;
                                app.notiName =
                                    app.notifications[app.notiIndex].Nickname;
                                app.notiStatus =
                                    app.notifications[app.notiIndex].Status;
                                app.notiSex =
                                    app.notifications[app.notiIndex].Sex;
                                app.notiPic =
                                    app.notifications[app.notiIndex].Pic;

                                app.notiChange = true;
                            }
                        }
                        setTimeout(() => {
                            app.notiChange = false;
                        }, 2000);
                    })
                    .catch((error) => console.log(error));
            }
            getNotification();
            setInterval(getNotification, 10000);
        },
        //留言板

        //取得留言訊息
        getMessage() {
            //GET留言板資料
            function get() {
                axios
                    .get(
                        `https://musicapi.funday.asia/api/BulletinBoard/BulletinBoardLastThirtyRecords
                `
                    )
                    .then((res) => {
                        app.boardContent = res.data.content.reverse();
                        app.boardMessage = res.data.content;
                        app.fnBoardMessage();
                    })
                    .catch((error) => console.log(error));
            }
            get(); //優先執行一次
            setInterval(() => {
                get();
            }, 5000);
        },

        //留言板開關
        fnBoardToggle() {
            if (this.board) {
                document.body.style.overflowY = "scroll";
            } else {
                document.body.style.overflowY = "hidden";
                this.fnBoardOpen();
            }
            this.board = !this.board;
            this.emoji = false;
        },

        //當前留言板顯示訊息
        fnBoardMessage() {
            if (this.boardNow < this.boardContent.length - 1) {
                this.boardNow++;
            } else {
                this.boardNow = 0;
            }
        },

        //留言板開啟時滾動至最底
        fnBoardOpen() {
            const scroll = document.querySelector(".board_open .content");
            scroll.scrollTo(0, scroll.scrollHeight);
        },

        //訊息加入貼圖
        addEmoji(evt) {
            const input = document.getElementById("message");
            const emoji = evt.target.innerHTML;
            input.focus();
            var prefix = input.value.substring(0, input.selectionStart);
            var suffix = input.value.substring(input.selectionEnd);
            input.value = prefix + emoji + suffix;
        },

        //送出訊息與過濾
        send() {
            //判斷是否登入
            if (!this.member_id) {
                // alert("請先登入");
                $("#myModal07").modal("show");
                return;
            }
            const input = document.getElementById("message");

            // 超過限制的字數
            var maxChars = 200;
            if (input.value.length > maxChars) {
                input.style.outline = "1px solid #E84149";
                input.style.boxShadow = " 0px 0px 0px 4px rgb(232, 65, 73,0.1)";
                app.alert = "超過字數限制(200字)";
                return false;
            } else if (input.value.length == 0) {
                // 未填寫內容
                // input.style.outline = "1px solid #E84149";
                input.style.borderRadius = "100px";
                input.style.boxShadow = " 0px 0px 0px 4px rgb(232, 65, 73,0.5)";
                input.setAttribute("placeholder", "請填寫內容");
                input.classList.add("input_change");
                // app.alert = "請填寫內容";
                return false;
            } else {
                input.style.outline = "none";
                app.alert = "";
            }

            let text; // 過濾後的文字
            //判斷是否有英文

            let chineseList = zhBadWords.words;
            if (/[a-z]/i.test(input.value)) {
                zhFilter(input.value);
                enFilter(text);
            } else {
                zhFilter(input.value);
            }

            // === 過濾中文髒話 ===
            function zhFilter(str) {
                for (let i = 0; i < chineseList.length; i++) {
                    if (str.indexOf(chineseList[i]) > -1) {
                        // console.log(str.indexOf(chineseList[i]));
                        str = replaceWord(str, chineseList[i]);
                    }
                }
                text = str;
            }

            function replaceWord(str, target) {
                let t = "";
                var placeHolder = "*";
                for (var i = 0; i < target.length; i++) {
                    t += placeHolder;
                }
                return str.replace(new RegExp(target, "g"), t);
            }

            // === 過濾英文髒話 ===
            function enFilter(str) {
                var Filter = badWordsPlus;
                var customFilter = new Filter({ placeHolder: "*" });
                text = customFilter.clean(str);
            }
            // === 過濾前後空格 ===
            text = text.replace(/(^[\s]*)|([\s]*$)/g, "");

            // console.log(text);
            // const blk = document.getElementById("content_blk");
            const scroll = document.querySelector(".board_open .content");
            let sex;
            if (this.sex == 1) {
                sex = "male";
            } else {
                sex = "female";
            }
            // debugger;
            //輸入留言api
            axios
                .post(
                    `https://musicapi.funday.asia/api/BulletinBoard/BulletinBoardRecord?customer_id=${app.customer_id}&member_id=${app.member_id}&content=${text}`
                )
                .then((res) => {
                    this.getMessage();
                });
            input.value = "";
            scroll.scrollTo(0, scroll.scrollHeight);
        },

        //init input的狀態
        inputKeydown() {
            const input = document.getElementById("message");
            input.style.outline = "unset";
            input.setAttribute(
                "placeholder",
                "此留言板以交流為主，若有功能異常請使用回報問題按鈕"
            );
            input.classList.remove("input_change");
            input.style.boxShadow = " 0px 0px 0px 4px rgb(0 ,0, 0,0.1)";
        },

        firstClickPage() {
            this.firstClick = true;
        },

        //搜尋歌曲
        searchPC() {
            if (!this.member_id) {
                $("#myModal01").modal("show");
                return;
            } else {
                const keyword = document.getElementById("keyword").value;
                if (keyword == "") return;
                location.href = `video_category.html?keyword=${keyword}`;
            }
        },
        searchMB() {
            if (!this.member_id) {
                // alert("請先登入");
                $("#myModal01").modal("show");
                return;
            } else {
                const keyword = document.getElementById("keywordmb").value;
                if (keyword == "") return;
                location.href = `video_category.html?keyword=${keyword}`;
            }
        },
    },
    created() {
        //判斷是否有ADid
        if (sessionStorage.getItem("ADid")) {
            this.ADid = sessionStorage.getItem("ADid");
            console.log(this.ADid);
        }
        this.getMessage();
        // this.notification();
        // this.logoChange();
        let hash = window.location.href;
        sessionStorage.setItem("para", "");
        let mid = sessionStorage.getItem("mindx");
        if (hash.indexOf("fbAdd") > -1 && mid == undefined) {
            $("#myModal06").modal("show");
        }
        if (hash.indexOf("fbLogin") > -1) {
            // debugger;
            let token;
            if (hash.indexOf("fbAdd") > -1) {
                token = hash
                    .split("?")[2]
                    .split("&")[1]
                    .split("=")[1]
                    .replace("#", "")
                    .replace("_", "");
            } else {
                token = hash
                    .split("?")[1]
                    .split("&")[1]
                    .split("=")[1]
                    .replace("#", "")
                    .replace("_", "");
            }
            // alert(token);
            axios
                .get(`https://funday.asia/api/FBtoken.asp?token=${token}`)
                .then((res) => {
                    // console.log(res);
                    sessionStorage.setItem("id", `FB${res.data.id}`);
                    sessionStorage.setItem("email", `${res.data.email}`);
                    if (res.data.State == 1) {
                        const id = sessionStorage.getItem("id");
                        if (id == null) {
                            alert("此Facebook帳號尚未註冊");
                        } else {
                            axios
                                .get(
                                    `https://webaspapi.funday.asia/api/User/Login?FBID=${id}`
                                )
                                .then((res) => {
                                    // console.log(res);
                                    if (res.data.IsSuccess) {
                                        $("#myModal07").modal("hide");
                                        document
                                            .getElementById("login_blk")
                                            .classList.add("none");
                                        document
                                            .getElementById("menu")
                                            .classList.remove("none");
                                        sessionStorage.removeItem("mfree");
                                        sessionStorage.setItem(
                                            "mindx",
                                            res.data.Content.Mindx
                                        );
                                        sessionStorage.setItem(
                                            "cindx",
                                            res.data.Content.Cindx
                                        );
                                        sessionStorage.setItem(
                                            "nickName",
                                            res.data.Content.Nickname
                                        );
                                        sessionStorage.setItem(
                                            "sex",
                                            res.data.Content.Sex
                                        );
                                        sessionStorage.setItem(
                                            "pic",
                                            res.data.Content.Pic
                                        );
                                        localStorage.setItem(
                                            "fdtk",
                                            res.data.Content.Token
                                        );
                                        const url =
                                            sessionStorage.getItem("para");
                                        location.href = `https://music.funday.asia/`;
                                    } else {
                                        alert("此Facebook帳號尚未註冊");
                                    }
                                });
                        }
                    } else {
                        // const url = sessionStorage.getItem("para");
                        location.href = `https://music.funday.asia?fbAdd`;
                    }
                });
        }
        if (
            sessionStorage.getItem("mfree") == undefined &&
            sessionStorage.getItem("mindx") == undefined
        ) {
            sessionStorage.setItem("mfree", 0); //設置試用次數
        }
        if (sessionStorage.getItem("mindx") == undefined) {
            this.firstClick = false;
        } else {
            this.firstClick = true;
        }
        let member_id = sessionStorage.getItem("mindx");
        let customer_id = sessionStorage.getItem("cindx");
        let nickname = sessionStorage.getItem("nickName");
        let sex = sessionStorage.getItem("sex");
        let pic = sessionStorage.getItem("pic");
        this.member_id = member_id;
        this.customer_id = customer_id;
        this.nickname = nickname;
        if (pic == null || pic == "") {
            this.userPic = false;
        } else {
            this.userPic = true;
            this.pic = pic;
        }
        this.sex = sex;

        this.getData();
    },
});
