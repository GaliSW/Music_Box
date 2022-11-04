function toVideo(item) {
    const id = item.id;
    const cate = item.attributes.name.value;
    // debugger;
    location.href = `video.html?categoryId=${cate}&videoId=${id}`;
    if (
        sessionStorage.getItem("mfree") !== undefined &&
        sessionStorage.getItem("mindx") == undefined
    ) {
        let useNum = Number(sessionStorage.getItem("mfree")) + 1;
        sessionStorage.setItem("mfree", useNum);
    }
}

$(function () {
    if ($(".home_page").length) {
        let $sideBarItem = $("#sidebar .channel_list"),
            headerHeight = $("#header").outerHeight(),
            targetId;

        // 綁定動作
        $sideBarItem.on("click", "a", function () {
            targetId = $(this).data("categoary-id");
            getTargetOffset(targetId);
        });
        // 取得目標的偏移
        function getTargetOffset(targetId) {
            if (!targetId) return;
            let targetEle = parseInt(
                $(
                    '.home_page .ga_title[data-categoary-id="' + targetId + '"]'
                ).offset().top
            );
            windowScroll(targetEle);
        }

        //視窗滾動
        function windowScroll(targetOffset) {
            var $body = window.opera
                ? document.compatMode == "CSS1Compat"
                    ? $("html")
                    : $("body")
                : $("html,body"); //修正 Opera 問題
            $body.animate({ scrollTop: targetOffset - headerHeight }, 500);
            return false;
        }
    }

    //$('.teacher_lecture.no_pad').clone().appendTo('.teacher_lecture.only_pad');
});

// 登入流程
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
    // 註冊bymail
    $(".sign-in input").on("click", function () {
        mailSignUp();
    });
    $(".login_now").on("click", function () {
        renderButton();
    });

    //登入bymail
    $(".login-in #login_by_mail").on("click", function (e) {
        mailLoginCheck();
    });

    //fb登入
    $(".login-in #login_by_fb").on("click", function () {
        fbLogin();
    });

    //fb註冊 取得對方手機
    $("#fb-signin").on("click", function () {
        fbLogin();
    });

    //google註冊流程
    $("#google-signin-submit").on("click", function () {
        googleSignUp();
    });
    //fb註冊流程
    $("#fb-signin-submit").on("click", function () {
        fbSignUp();
    });

    //註冊流程 簡訊驗證並且加入
    $("#sign-in-success").on("click", function () {
        joinCheck("new");
    });

    //註冊流程 修改手機號碼
    $("#sign-in-changePhone").on("click", function () {
        $("#myModal04").modal("show");
    });

    //註冊流程 修改手機 發送驗證碼
    $("#change_phone_send_sms").on("click", function () {
        changeMobile();
    });

    //註冊流程 修改手機 加入完成
    $("#sign-in-success-changephone").on("click", function () {
        joinCheck("origin");
    });

    //登出
    $("#header #logout").on("click", function () {
        logOut();
    });

    //忘記密碼
    $(".resend_pw input").on("click", function (e) {
        forgotPass();
    });

    //記住我
    $(".login_form #rememberCheck").on("click", function () {
        remember();
    });

    //我要推薦打開modal
    $("#open_recommend").on("click", function () {
        let member_id = sessionStorage.getItem("mindx");
        if (member_id == null) {
            // alert("請先登入會員");
            $("#myModal09").modal("hide");
            $("#myModal01").modal("show");
            return;
        } else {
            $("#myModal09").modal("show");
        }
    });
    $("#open_recommend_mb").on("click", function () {
        let member_id = sessionStorage.getItem("mindx");
        if (member_id == null) {
            // alert("請先登入會員");
            $("#myModal09").modal("hide");
            $("#myModal01").modal("show");
            return;
        } else {
            $("#myModal09").modal("show");
        }
    });

    //我要推薦 送出表單
    $(".button #sendRecommendMail").on("click", function () {
        recommand();
    });
});

// =============================== 註冊 ================================
// mail註冊
async function mailSignUp() {
    const mail = document.querySelector("input[name='account_mail']").value;
    const regex =
        /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    if (!regex.test(mail)) {
        alert("信箱格式錯誤");
        return false;
    }
    const pass = document.querySelector("input[name='account_mobile']").value;
    if (pass == "") {
        alert("請填寫密碼");
        return false;
    }
    const name = document.querySelector("input[name='account_name']").value;

    if (name == "") {
        alert("請填寫中文姓名");
        return false;
    }

    const enCheck = /[a-zA-Z]/;
    if (enCheck.test(name)) {
        alert("請輸入中文姓名");
    }

    const sexColumn = document.querySelector(
        "input[name='account_gender']:checked"
    );
    if (sexColumn == null) {
        alert("請選擇性別");
        return false;
    }
    const sex = sexColumn.value;
    let adId = 59;
    if (sessionStorage.getItem("ADid")) {
        adId = sessionStorage.getItem("ADid");
    }
    const json = JSON.stringify({
        ID: mail,
        realname: name,
        sex: sex,
        tel: pass,
        ADid: adId,
    });
    // console.log(adId);
    await axios
        .post("https://funday.asia/api/Application.asp", json)
        .then((res) => {
            // console.log(res);
            if (res.data.StateId == 0) {
                alert("此帳號已註冊，請進行登入");
                $("#myModal02").modal("hide");
                $("#myModal07").modal("show");
            } else {
                document.cookie = `phone = ${pass}`;
                sessionStorage.setItem("phone", pass);
                $("#myModal03").modal("show");
            }
        });
}

//FB加入
function fbLogin(fbLogin) {
    // const returnUrl = window.location.href;
    // console.log(returnUrl.split("?")[0]);
    // location.href = `https://funday.asia/api/FBOauth.asp?returnurl=${returnUrl}`;
    // axios.post("https://funday.asia/api/FBOauth.asp").then((res) => {
    //     console.log(res);
    // });
    FB.getLoginStatus(
        function (response) {
            if (response.status == "connected") {
                GetFbProfile(fbLogin);
                //跑fb 註冊流程
                $("#myModal10").modal("show");
            } else if (
                response.status === "not_authorized" ||
                response.status === "unknown"
            ) {
                //未授權或用戶登出FB網站才讓用戶執行登入動作
                FB.login(function (response) {
                    if (response.status === "connected") {
                        GetFbProfile();
                        $("#myModal10").modal("show");
                    } else {
                        alert("Facebook帳號無法登入");
                    }
                });
            }
        },
        { scope: "email" }
    );
}

// 拿fb個資
function GetFbProfile(fbLogin) {
    //FB.api()使用說明：https://developers.facebook.com/docs/javascript/reference/FB.api
    //取得用戶個資
    FB.api("/me", "GET", { fields: "id,email" }, function (user) {
        //user物件的欄位：https://developers.facebook.com/docs/graph-api/reference/user
        if (user.error) {
            // console.log(response);
        } else {
            // console.log(user);
            sessionStorage.setItem("id", `FB${user.id}`);
            sessionStorage.setItem("email", `${user.email}`);
            if (fbLogin !== "fbLogin") {
                // loginTo(myModal01, myModal06);
                $("#myModal01").modal("hide");
                $("#myModal10").modal("show");
            }
        }
    });
}

// ============================= 註冊流程檢查:簡訊驗證 ===============================
function joinCheck(status) {
    if (status == "origin") {
        const number = document.getElementById("check_account_mobile").value;
        const json = JSON.stringify({
            chk: number,
        });
        axios
            .post("https://funday.asia/api/JoinCheck.asp", json)
            .then((res) => {
                // console.log(res);
                // console.log(number);
                if (res.data.StateId == 0) {
                    alert("驗證碼錯誤");
                } else {
                    alert("成功加入");
                    $("#myModal07").modal("show");
                    location.href = "https://music.funday.asia/thankyou.html";
                    // let hash = window.location.href;
                    // if (hash.indexOf("landing") > -1) {
                    //     location.href = `https://music.funday.asia/`;
                    // } else {
                    //     window.location.reload();
                    // }
                }
            });
    } else if (status == "new") {
        //修改手機號碼 新手機號碼
        const number = document.getElementById("new_account_mobile").value;
        const json = JSON.stringify({
            chk: number,
        });
        axios
            .post("https://funday.asia/api/JoinCheck.asp", json)
            .then((res) => {
                // console.log(res);
                // console.log(number);
                if (res.data.StateId == 0) {
                    alert("驗證碼錯誤");
                } else {
                    alert("成功加入");
                    $("#myModal07").modal("show");
                    location.href = "https://music.funday.asia/thankyou.html";
                    // let hash = window.location.href;
                    // if (hash.indexOf("landing") > -1) {
                    //     location.href = `https://music.funday.asia/`;
                    // } else {
                    //     window.location.reload();
                    // }
                }
            });
    }
}

// ================================ 修改手機&重發驗證信 ================================
function changeMobile() {
    const newPhone = document.getElementById("new_mobile_number").value;
    const oldPhone = sessionStorage.getItem("phone");
    // console.log(newPhone);
    if (newPhone == "") {
        alert("請輸入手機號碼");
    } else {
        // console.log(oldPhone);
        const json = JSON.stringify({
            EditTel: newPhone,
            Tel: oldPhone,
        });
        axios
            .post("https://funday.asia/api/TelResend.asp", json)
            .then((res) => {
                // console.log(res);
            });
    }
}

// ********************************FB註冊********************************
async function fbSignUp() {
    const fbid = sessionStorage.getItem("id");
    const mail = sessionStorage.getItem("email");
    const pass = document.getElementById("fb_account_mobile").value;
    if (pass == "") {
        alert("請填寫密碼");
        return false;
    }
    const name = document.getElementById("fb_account_name").value;
    if (name == "") {
        alert("請填寫中文姓名");
        return false;
    }
    const sexColumn = document.querySelector(
        "input[name='account_gender']:checked"
    );
    if (sexColumn == null) {
        alert("請選擇性別");
        return false;
    }
    const sex = sexColumn.value;
    let adId = 59;
    if (sessionStorage.getItem("ADid")) {
        adId = sessionStorage.getItem("ADid");
    }
    // console.log(adId);
    const json = JSON.stringify({
        ID: fbid,
        FBFemail: mail,
        realname: name,
        sex: sex,
        tel: pass,
        ADid: adId,
    });
    await axios
        .post("https://funday.asia/api/Application.asp", json)
        .then((res) => {
            // console.log(res);
            if (res.data.StateId == 0) {
                alert("此帳號已註冊，請進行登入");
                //loginTo(myModal06, myModal09);
                $("#myModal10").modal("hide");
                $("#myModal07").modal("show");
            } else {
                document.cookie = `phone = ${pass}`;
                sessionStorage.setItem("phone", pass);
                //loginTo(myModal06, myModal03);
                //簡訊驗證
                $("#myModal10").modal("hide");
                // $("#myModal10").css("display", "none");
                $("#myModal03").modal("show");
            }
        });
}

// =============================== 登出 ================================
//funday登出
function logOut() {
    sessionStorage.clear("id,email,phone,mindx,cindx");
    localStorage.removeItem("fdtk");
    $("#header #login_blk").show();
    $("#header #menu").hide();
    window.location.reload();
}
//fb登出
function fbLogout() {
    FB.getLoginStatus(function (response) {
        if (response && response.status === "connected") {
            FB.logout(function (response) {
                document.location.reload();
            });
        }
    });
}
//=============================== 忘記密碼 ================================
async function forgotPass() {
    const phoneColumn = document.getElementById("forgot_account_mobile");
    if (!phoneColumn.value) {
        alert("請輸入手機號碼");
        return;
    }
    const phone = phoneColumn.value;
    await axios
        .get(`https://funday.asia/api/PwdSend.asp?tel=${phone}`)
        .then((res) => {
            if (res.data.State == 0) {
                alert("此號碼尚未註冊");
            } else {
                $("#myModal08").modal("hide");
            }
        });
}
// =============================== 登入 ================================
// email登入
async function mailLoginCheck() {
    const account = document.getElementById("login_account").value;
    const pass = document.getElementById("login_pass").value;

    if (!account.length && !pass.length) {
        alert("請輸入帳號密碼");
        return;
    }

    await axios
        .get(
            `https://webaspapi.funday.asia/api/User/Login?ID=${account}&Password=${pass}`
        )
        .then((res) => {
            // console.log(res);
            if (res.data.IsSuccess) {
                // 切換登入狀態
                $("#header #login_blk").hide();
                $("#header #menu").show();
                $("#myModal07").modal("hide");
                sessionStorage.removeItem("mfree");
                sessionStorage.setItem("mindx", res.data.Content.Mindx);
                sessionStorage.setItem("cindx", res.data.Content.Cindx);
                sessionStorage.setItem("nickName", res.data.Content.Nickname);
                sessionStorage.setItem("sex", res.data.Content.Sex);
                sessionStorage.setItem("pic", res.data.Content.Pic);
                localStorage.setItem("fdtk", res.data.Content.Token);

                let hash = window.location.href;
                if (hash.indexOf("landing") > -1) {
                    location.href = `https://music.funday.asia/`;
                } else {
                    window.location.reload();
                }
            } else {
                alert("帳號或密碼錯誤");
            }
        });
}

//fb 登入檢查
function fbLoginCheck() {
    //檢查是否已經在funday用fb註冊
    fbLogin("fbLogin");

    // setTimeout(() => {
    //     const id = sessionStorage.getItem("id");
    //     if (id == null) {
    //         alert("此Facebook帳號尚未註冊");
    //     } else {
    //         const json = JSON.stringify({
    //             ID: "",
    //             password: "",
    //             FBID: id,
    //         });
    //         axios
    //             .post("https://funday.asia/api/Member.asp", json)
    //             .then((res) => {
    //                 console.log(res);
    //                 if (res.data.StateId == 0) {
    //                     alert("此Facebook帳號尚未註冊");
    //                 } else {
    //                     $("#myModal07").modal("hide");
    //                     document
    //                         .getElementById("login_blk")
    //                         .classList.add("none");
    //                     document
    //                         .getElementById("menu")
    //                         .classList.remove("none");
    //                     sessionStorage.setItem("mindx", res.data.mindx);
    //                     sessionStorage.setItem("cindx", res.data.cindx);
    //                     // location.reload();
    //                 }
    //             });
    //     }
    // }, 2000);
}

//記住我
function remember() {
    const remember_btn = document.getElementById("rememberCheck");
    const account = document.getElementById("login_account");
    const pass = document.getElementById("login_pass");
    const encodePw = btoa(pass.value);
    // console.log(encodePw);
    // console.log(atob(encodePw))
    if (remember_btn.checked) {
        sessionStorage.setItem("account", account.value);
        sessionStorage.setItem("pass", encodePw);
    } else {
        sessionStorage.clear("account", account.value);
        sessionStorage.clear("pass", encodePw);
    }
}

//我要推薦
function recommand() {
    //  https://funday.asia/api/MusicboxWeb/PromoteSong.asp
    let member_id = sessionStorage.getItem("mindx"),
        recommendMessage = document.querySelector(
            'textarea[name="my_recommend"]'
        ).value,
        isClick = false;

    if (!recommendMessage) {
        alert("請勿輸入空白");
    }
    if (isClick == true) return;

    const json = JSON.stringify({
        member_id: member_id,
        message: recommendMessage,
    });

    axios
        .post(`https://funday.asia/api/MusicboxWeb/PromoteSong.asp`, json)
        .then((res) => {
            alert(res.data.message);
            isClick = true;
            $("#myModal09").modal("hide");
        })
        .catch((error) => console.log(error));
}

// 登入判斷
window.onload = function () {
    const pass = sessionStorage.getItem("pass"),
        account = sessionStorage.getItem("account");

    //勾選記住我的選項
    if (pass) {
        document.getElementById("login_pass").value = atob(pass);
    }

    if (account) {
        document.getElementById("login_account").value = account;
    }
};

// ********************************google註冊********************************

function renderButton() {
    google.accounts.id.renderButton(document.getElementById("google_login"), {
        theme: "outline",
        size: "large",
        width: "360px",
    });
}

async function handleCredentialResponse(response) {
    const token = response.credential;
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
        atob(base64)
            .split("")
            .map(function (c) {
                return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
    );
    const data = await JSON.parse(jsonPayload);

    axios
        .post(
            ` https://funday.asia/api/GoogleOAuth/IDCheck.asp?id=${data.sub}&name=${data.name}&email=${data.email}`
        )
        .then((res) => {
            const state = res.data.State;
            if (state === "0") {
                sessionStorage.setItem("email", res.data.email);
                sessionStorage.setItem("gid", res.data.id);
                $("#myModal01").modal("hide");
                $("#myModal06").modal("show");
            } else {
                const id = res.data.id;
                axios
                    .get(
                        `https://webaspapi.funday.asia/api/User/Login?GoogleID=${id}`
                    )
                    .then((res) => {
                        $("#header #login_blk").hide();
                        $("#header #menu").show();
                        $("#myModal07").modal("hide");
                        sessionStorage.removeItem("mfree");
                        sessionStorage.setItem("mindx", res.data.Content.Mindx);
                        sessionStorage.setItem("cindx", res.data.Content.Cindx);
                        sessionStorage.setItem(
                            "nickName",
                            res.data.Content.Nickname
                        );
                        sessionStorage.setItem("sex", res.data.Content.Sex);
                        sessionStorage.setItem("pic", res.data.Content.Pic);
                        localStorage.setItem("fdtk", res.data.Content.Token);

                        let hash = window.location.href;
                        if (hash.indexOf("landing") > -1) {
                            location.href = `https://music.funday.asia/`;
                        } else {
                            window.location.reload();
                        }
                    });
            }
        });
}

async function googleSignUp() {
    const mail = sessionStorage.getItem("email");
    const gid = sessionStorage.getItem("gid");
    const pass = document.getElementById("google_account_mobile").value;
    if (pass == "") {
        alert("請填寫密碼");
        return false;
    }
    const name = document.getElementById("google_account_name").value;
    if (name == "") {
        alert("請填寫中文姓名");
        return false;
    }
    const sexColumn = document.querySelector(
        "input[name='account_gender']:checked"
    );
    if (sexColumn == null) {
        alert("請選擇性別");
        return false;
    }
    const sex = sexColumn.value;
    let adId = 59;
    if (sessionStorage.getItem("ADid")) {
        adId = sessionStorage.getItem("ADid");
    }
    const json = JSON.stringify({
        ID: gid,
        FBFemail: mail,
        realname: name,
        sex: sex,
        tel: pass,
        ADid: adId,
    });
    console.log(adId);
    await axios
        .post("https://funday.asia/api/Application.asp", json)
        .then((res) => {
            if (res.data.StateId === "0") {
                alert(res.data.StateMessage);
                renderButton();
                $("#myModal06").modal("hide");
                $("#myModal07").modal("show");
            } else {
                document.cookie = `phone = ${pass}`;
                sessionStorage.setItem("phone", pass);
                $("#myModal06").css("display", "none");
                $("#myModal03").modal("show");
            }
        });
}
