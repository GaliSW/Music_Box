var tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var app = new Vue({
    el: "#app",
    data: {
        sidebar: {},
        HotRecording: {},
        HotClick: {},
        banner: {},
        vedioListData: {},
        myVideoId: "",
        player: null,
        member_id: "",
        customer_id: "",
        recommendMessage: "",
    },
    computed: {},
    methods: {
        initYoutube() {
            const _ = this;
            this.player = new YT.Player("player", {
                // width: 600,
                // height: 400,
                videoId: _.myVideoId,
                events: {
                    onReady: _.onPlayerReady,
                    onStateChange: _.onPlayerStateChange,
                },
            });
        },
        onPlayerReady(evt) {
            console.log("Player ready");
            evt.target.mute().playVideo();
        },
        onPlayerStateChange(evt) {
            console.log("Player state changed", evt);
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

            let VideoId = $($event.target).data("videoid");

            //此API在同一個歌曲編號的狀況下，再打一次為取消收藏
            axios
                .get(
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
    },
    created() {
        if (
            sessionStorage.getItem("mfree") == undefined &&
            sessionStorage.getItem("mindx") == undefined
        ) {
            sessionStorage.setItem("mfree", 0); //設置試用次數
        }
        let member_id = sessionStorage.getItem("mindx");
        let customer_id = sessionStorage.getItem("cindx");
        this.member_id = member_id;
        this.customer_id = customer_id;
        let vm = this;

        //GET請求
        const promise1 = new Promise((resolve, reject) => {
            axios
                .get(
                    `https://funday.asia/API/musicboxweb/defaultList.asp?member_id=${this.member_id}`
                )
                .then((res) => {
                    console.log(res);
                    vm.sidebar = res.data.Category;
                    vm.HotRecording = res.data["Hot Recording"];
                    vm.HotClick = res.data["Hot Click"];
                    vm.banner = res.data.Banner[0];
                    vm.myVideoId = this.banner.Video.split("/")[3];
                    console.log(vm.myVideoId);
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
                    resolve("Success");
                })
                .catch((error) => console.log(error));
        });

        promise1.then((successMessage) => {
            vm.initYoutube();
        });
    },
});
