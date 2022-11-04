function toCopyRight() {
    window.open("https://music.funday.asia/copyright/copyright.html");
}
//預載圖片
var img = new Image();
// img.src="../img/input_radio_do.svg"

//頁籤效果
$(function () {
    google.accounts.id.initialize({
        client_id:
            "424336502494-0lqsgtdqhq1eq58dspl52uc13k168uon.apps.googleusercontent.com",
        callback: handleCredentialResponse,
    });

    google.accounts.id.renderButton(document.getElementById("google_signup"), {
        theme: "outline",
        size: "large",
        width: "318px",
    });
    if (localStorage.getItem("fdtk")) {
        const token = localStorage.getItem("fdtk");
        document.querySelector(".subWeb").innerHTML = "";
        str_pc = `<a href="https://tube.funday.asia?fdtk=${token}" target="_blank">FunTube</a>
                <a href="https://dic.funday.asia?fdtk=${token}" target="_blank">FunDictionary</a>
                <a href="https://funday.asia/api/SSO.asp?fdtk=${token}" target="_blank">FunDay</a>
            `;
        document
            .querySelector(".subWeb")
            .insertAdjacentHTML("afterbegin", str_pc);
    }
    if (
        location.search.indexOf("fdtk") > -1 &&
        location.search.split("=")[1] !== "" &&
        !sessionStorage.getItem("mindx")
    ) {
        //判斷token
        const token = location.search.split("=")[1];
        tokenCheck(token);
    } else {
        if (localStorage.getItem("fdtk") && !sessionStorage.getItem("mindx")) {
            const token = localStorage.getItem("fdtk");
            tokenCheck(token);
        } else {
            return false;
        }
    }
    //* === Token check ===
    function tokenCheck(token) {
        axios
            .get(`https://webaspapi.funday.asia/api/User/Login?Token=${token}`)
            .then((res) => {
                console.log(res, "hasToken");
                if (res.data.IsSuccess) {
                    sessionStorage.setItem("mindx", res.data.Content.Mindx);
                    sessionStorage.setItem("cindx", res.data.Content.Cindx);
                    localStorage.setItem("fdtk", token);
                    location.href = "http://music.funday.asia";
                } else {
                    return false;
                }
            });
    }

    // 預設顯示第一個 Tab
    var _showTab = 0;
    $(".switch_tab").each(function () {
        // 目前的頁籤區塊
        var $tab = $(this);

        var $defaultLi = $("ul.tabs li", $tab).eq(_showTab).addClass("active");
        $($defaultLi.find("a").attr("href")).siblings().hide();

        // 當 li 頁籤被點擊時...
        // 若要改成滑鼠移到 li 頁籤就切換時, 把 click 改成 mouseover
        $("ul.tabs li", $tab)
            .click(function () {
                // 找出 li 中的超連結 href(#id)
                var $this = $(this),
                    _clickTab = $this.find("a").attr("href");
                // 把目前點擊到的 li 頁籤加上 .active
                // 並把兄弟元素中有 .active 的都移除 class
                $this
                    .addClass("active")
                    .siblings(".active")
                    .removeClass("active");
                // 淡入相對應的內容並隱藏兄弟元素
                $(_clickTab).stop(false, true).fadeIn().siblings().hide();

                return false;
            })
            .find("a")
            .focus(function () {
                this.blur();
            });
    });
});
//scroll to bottom

$(window).scroll(function () {
    var h = document.body.scrollHeight; //網頁文檔的高度
    var c = $(document).scrollTop(); //滾動條距離網頁頂部的高度
    var wh = $(window).height(); //頁面可視化區域高度
    if (window.innerWidth > 549) {
        if (Math.ceil(wh + c) >= h - 34) {
            // $(".ad_blk").css({ bottom: "34px" });
            $(".message_board_blk").css({ bottom: "36px" });
        } else {
            // $(".ad_blk").css({ bottom: "0px" });
            $(".message_board_blk").css({ bottom: "0px" });
        }
    } else {
        if (Math.ceil(wh + c) >= h - 34) {
            $(".ad_blk_index").css({ bottom: "104px" });
            $(".message_board_blk").css({ bottom: "52px " });
        } else {
            $(".ad_blk_index").css({ bottom: "56px" });
            $(".message_board_blk").css({ bottom: "0px" });
        }
    }
});

//logoChange
$(function () {
    setInterval(() => {
        if ($("#logoImg").hasClass("none")) {
            $("#logoImg").removeClass("none");
            $("#logoText").addClass("none");
        } else {
            $("#logoText").removeClass("none");
            $("#logoImg").addClass("none");
        }
    }, 6000);
});

//Podcast
$(".pop_close").click(() => {
    $(".podcast_pop").toggle();
});
$(".podcast").click(() => {
    $(".podcast_pop").toggle();
});
$(".podcast_mobile").click(() => {
    $(".podcast_pop").toggle();
});
// setInterval(() => {
//     $(".message_board_blk").css("transform", "rotateX(180deg)");
//     setTimeout(() => {
//         $(".message_board_blk").css("transform", "unset");
//     }, 2000);
// }, 5000);
//愛心的點擊變色
// $(".heart").click(function(){
// 	var $this = $(this);
//   $this.toggleClass("favorites");
// });

//撥放的點擊變色
// $("ul.voice_items .digi .img").click(function(){
// 	var $this = $(this);
//   $this.toggleClass("click");
// });

//撥放bar裏的單句與單曲切換
// $(".buootn.cutover01").click(function(){
//   $(".buootn.cutover01 .cut01").toggle();
//   $(".buootn.cutover01 .cut02").toggle();
// });
// $(".buootn.cutover02").click(function(){
//   $(".buootn.cutover02 .cut01").toggle();
//   $(".buootn.cutover02 .cut02").toggle();
// });
//撥放bar裏的語言切換
// $(".buootn.cutover04 .cut01").click(function(){
//   $(".buootn.cutover04 .cut01").toggle();
//   $(".buootn.cutover04 .cut02").toggle();
// });
// $(".buootn.cutover04 .cut02").click(function(){
//   $(".buootn.cutover04 .cut02").toggle();
//   $(".buootn.cutover04 .cut03").toggle();
// });
// $(".buootn.cutover04 .cut03").click(function(){
//   $(".buootn.cutover04 .cut03").toggle();
//   $(".buootn.cutover04 .cut04").toggle();
// });
// $(".buootn.cutover04 .cut04").click(function(){
//   $(".buootn.cutover04 .cut04").toggle();
//   $(".buootn.cutover04 .cut01").toggle();
// });

//配音頁的設定
// $(".tool_bar .buootn.stop").click(function(){
//   $(".tool_bar .function01").hide();
//   $(".tool_bar .function02").show();
// });
// $(".tool_bar .buootn.todo_Go").click(function(){
//   $(".tool_bar .function01").show();
//   $(".tool_bar .function02").hide();
// });

//錄音頁-同步聲音的設定
$(".buootn.same .cut01").click(function () {
    $(".buootn.same .cut01").toggle();
    $(".buootn.same .cut02").toggle();
});
$(".buootn.same .cut02").click(function () {
    $(".buootn.same .cut02").toggle();
    $(".buootn.same .cut03").toggle();
});
$(".buootn.same .cut03").click(function () {
    $(".buootn.same .cut03").toggle();
    $(".buootn.same .cut01").toggle();
});

//老師解說的設定
// $(".buootn.cutover03").click(function(){
//   $(".buootn.cutover03 .cut01").toggle();
//   $(".buootn.cutover03 .cut02").toggle();
// });

// $('.teacher_lecture.no_pad .button.video_switch span').click(function(){
// 		$(".teacher_lecture.no_pad .teacher_video").slideToggle();
// 		if($(this).find('img').attr('src')=='images/web_icon/teacher_video_switch_icon.svg'){
// 			$(this).find('img').attr('src','images/web_icon/teacher_video_switch_icon_off.svg');
// 		}else{
// 			$(this).find('img').attr('src','images/web_icon/teacher_video_switch_icon.svg');
// 		}
// 		$(".teacher_lecture.no_pad .buootn.cutover03").toggleClass("off");
// 		$("#tab1 .subtitle_items").toggleClass("off");

// });

// $('.teacher_lecture.only_pad .button.video_switch span').click(function(){
// 		$(".teacher_lecture.only_pad .teacher_video").slideToggle();
// 		if($(this).find('img').attr('src')=='images/web_icon/teacher_video_switch_icon02.svg'){
// 			$(this).find('img').attr('src','images/web_icon/teacher_video_switch_icon02_off.svg');
// 		}else{
// 			$(this).find('img').attr('src','images/web_icon/teacher_video_switch_icon02.svg');
// 		}
// 		$(".teacher_lecture.only_pad .buootn.cutover03").toggleClass("off");
// });

//影片排序加上序號
var decimalNo = 1;
$("#tab1 span[class='decimal']").each(function () {
    if (decimalNo <= 9) {
        $(this).html("0" + decimalNo++);
    } else {
        $(this).html(decimalNo++);
    }
});

var decimalNo2 = 1;
$("#tab2 span[class='decimal']").each(function () {
    if (decimalNo2 <= 9) {
        $(this).html("0" + decimalNo2++);
    } else {
        $(this).html(decimalNo2++);
    }
});
function toggleFullScreen(elem) {
    // ## The below if statement seems to work better ## if ((document.fullScreenElement && document.fullScreenElement !== null) || (document.msfullscreenElement && document.msfullscreenElement !== null) || (!document.mozFullScreen && !document.webkitIsFullScreen)) {
    if (
        (document.fullScreenElement !== undefined &&
            document.fullScreenElement === null) ||
        (document.msFullscreenElement !== undefined &&
            document.msFullscreenElement === null) ||
        (document.mozFullScreen !== undefined && !document.mozFullScreen) ||
        (document.webkitIsFullScreen !== undefined &&
            !document.webkitIsFullScreen)
    ) {
        document.querySelector(".full_open").classList.toggle("none");
        document.querySelector(".full_close").classList.toggle("none");
        if (elem.requestFullScreen) {
            elem.requestFullScreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullScreen) {
            elem.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
    } else {
        document.querySelector(".full_open").classList.toggle("none");
        document.querySelector(".full_close").classList.toggle("none");
        if (document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}
