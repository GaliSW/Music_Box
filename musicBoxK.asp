<%@LANGUAGE="VBSCRIPT" CODEPAGE="65001"%>
<!-- #include virtual="include/DBconnectionintro.asp"-->  
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<%
response.Buffer = true   
session.CodePage = 65001   
response.Charset = "utf-8"  


musicNo=request("musicNo")
'musicNo=876
m_id=session("indx")
c_id=session("ip_indx")


'm_id=1179
'm_id=69231
'c_id=411

if m_id="" then
	Response.Redirect("../../../")
	'response.write "<script>alert('請先登入會員');history.go(-1);</script>"
	'response.end()
end if

if musicNo="" then
	sql="SELECT  top 1 a.indx FROM  MusicBox a  where a.ready=1 order by a.ndate desc,a.indx desc"
	rs.open sql,connection,1,3
	if not rs.eof then
		musicNo=rs("indx")
	end if
	rs.close
end if

%>
<head>
	<meta charset="utf-8">
    <meta name="viewport" content="width=device-width,height=device-height,minimum-scale=1,maximum-scale=1,user-scalable=no"/>
	<link rel="stylesheet" href="https://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.css">
	<script src="https://code.jquery.com/jquery-1.11.3.min.js"></script>
	<script src="https://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.js"></script>
	<link href="https://fonts.googleapis.com/css?family=Lora:700" rel="stylesheet">
    <script src="../../js/jquery.cookie.js"></script>    
    <script src="../../../Joinus/joinus.js?a"></script>
    <script src="../../js/Uinfo.js"></script>
	<script src='../../../../times.js?1090828'></script>	
	<script src="./js/jquery.doubletap.js"></script>	
	<script src="https://funday.asia/NewMylessonmobile/MusicBox/js/recorder.mp3.min.js"></script>
        <script type="text/javascript" language="javascript" src="../app/app.js"></script>
    <script>
	 AndroidBackP='{"type":"9","url":"https://funday.asia/NewMylessonmobile/Musicbox/list.asp"}';
	 AndroidBack(AndroidBackP);

	var Me=new User();
	<%if session("indx")<>"" then%>
		if(Me.Ispay==1 && Me.EnddateChk()>=0 ){
			display(<%=musicNo%>,6)  
		}
	<%end if%>

    </script> 
	<link rel="stylesheet" href="./css/mediaelementplayer.min.css" />
	
<style>
html{
	user-select: none;
}
.fontTc{
	font-family:PingFangTC-Regular,'Microsoft JhengHei',sans-serif;
}
.fontEn{
	font-family: 'Big Caslon', 'Book Antiqua', 'Palatino Linotype', Georgia, serif;
}
.animateTitle {
    animation-duration: 3s; 
    animation-delay: 0s;
    animation-name: rotateX;
    animation-iteration-count: infinite;
    animation-direction: alternate;
}
@-webkit-keyframes rotateX {
    0%{
       transform: rotateX(90deg);
       z-index:1;
    }
  
    100% {
      transform: rotateX(0deg);
      z-index:0;
      display:none;
    }
}
.displayNone{
	display:none;
}
.displayBlock{
	display:block;
}

.animate-showModeTxt{
    position:relative;-webkit-animation:animateShow 2s;animation:animateShow 2s
}

.animate-hide{
	opacity:0;
    position:relative;-webkit-animation:animateHide 1s;animation:animateHide 1s
}
@-webkit-keyframes animateHide{from{opacity:1;display:block;} to{opacity:0;display:none;}}
@keyframes animateHide{from{opacity:1;display:block;} to{opacity:0;display:none;}}

.animate-show{
	opacity:1;
	display:block;
    position:relative;-webkit-animation:animateShow 1s;animation:animateShow 1s
}
@-webkit-keyframes animateShow{from{opacity:0} to{opacity:1}}
@keyframes animateShow{from{opacity:0} to{opacity:1}}

.animate-contentShow{
	opacity:1;
	display:block;
    position:relative;-webkit-animation:animateContentShow 1s;animation:animateContentShow 1s
}
@-webkit-keyframes animateContentShow{from{height:0;opacity:0} to{height:100%;opacity:1}}
@keyframes animateContentShow{from{height:0;opacity:0} to{height:100%;opacity:1}}


.ui-page{
	overflow-y: auto;
	height:100%;
	-webkit-overflow-scrolling: touch;
}

::-webkit-scrollbar {
    width: 2px;
    background-color: #232733;
}

::-webkit-scrollbar-thumb {
    background-color: #232733;
    border-radius: 1px;
}

::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 3px rgba(0,0,0,0.3);
    background-color: #232733;
    border-radius: 1px;
}

.tutorial{
	right: 0px;
	float: right;
	padding: 4px 10px 1.5% 0;
	background:url("svg/btn-tutorial-default.svg");
	background-position: center;
    background-repeat: no-repeat;
	width:25px;
	height:25px;
}
.navstar{
	right: 0px;
	float: right;
	padding: 4px 0 1.5% 0;
	background:url("svg/btn-navstar-default.svg");
	background-position: center;
    background-repeat: no-repeat;
	width:25px;
	height:25px;
}
.navstarJ{
	right: 0px;
	float: right;
	padding: 4px 0 1.5% 0;
	background:url("svg/btn-navstar-clicked.svg");
	background-position: center;
    background-repeat: no-repeat;
	width:25px;
	height:25px;
}
.sentence{
	position: relative;
	width: 100%;
	height: 75px;
	margin:20px 0 0 0;
	display: flex;
	align-content: center;
	justify-content: center;
	flex-direction: column;
	background-color: rgb(34, 34, 34);
}
.SentenceMask{
	display: block; position:absolute;  width: 100%; background-color: rgb(34, 34, 34);margin-top:50px;/*color: #FFFFFF;opacity:0.3;*/color:#696969;	
}
.sentenceF{
	color:#FFFFFF;
}
.highlight{
	/*padding: 10px 0px 10px 0px;*/
    background-color: rgb(255,255,255,0.8);
    color: #000000;
    opacity: 1;
}
.highlightF{
	padding: 0px;
    color: #FFFFFF;
    background: rgb(34,34,34);
}
.DrWord_highlight{
	background-color: #f5a623;
	color: #000000;
}
.DrWord{
	width: 100vw;
	height: calc(100vh * 0.45);
	opacity: 0.85;
	border-radius: 20px 20px 0 0;
	box-shadow: 0 -1px 4px 0 rgba(0, 0, 0, 0.25);
	background-color: #4a4a4a;
	position: fixed;
	bottom:0px;
	z-index:4;
	display:none;
	/*font-family: 'Arial','PingFang','微軟正黑體','sans-serif';*/
	font-family: 'Lucida Grande',Helvetica,Arial,Verdana,'PingFang TC','Heiti TC','微軟正黑體',sans-serif
}
.scrollbar{
	width: 30px;
	height: 300px;
	margin: 0 auto;
}
.Dr_Star{
	float: left;
	width: 60px;
	height: 20px;
	background-image: url(./img/collect.gif);
	background-size: 60px 20px;
	margin-left: 15px;
	margin-top: 7px;
}
.Dr_StarJ{
	background-image: url(./img/collected.png);
}
.Dr_title{
	position: relative;
    margin: 0 auto;
    width: 90%;
	padding: 1.5% 0px 1.5% 0px;
    height: 10%;
    overflow: hidden;
	font-size: 20px;
	line-height: 30px;
	color:#FFFFFF;
}
.Dr_title span{
	font-weight:bold;
	font-size: 1.2em;
	float: left;
}
.Dr_content{
	position: relative;
    margin: 0 auto;
    width: 90%;
	padding: 0px 0px 5% 0px;
    height: 75%;
	overflow-x: hidden;
    overflow-y: auto;
	word-wrap: break-word;
  	font-size: 16px;
	line-height: 25px;
	color:#FFFFFF;
}
.playerbar{
	width: 100vw;
	height: 60px;
	position: fixed;
	bottom:0px;
	z-index:4;
	pointer-events:none;
}
.Rectangle{
	width: 100%;
	height: 60px;
	border-radius: 25px;
	background-image: linear-gradient(99deg, rgba(252,156,87,0.6), rgba(255,108,2,0.6));
	position:absolute;
	top:0px;
	left:0px;
	display: flex;
    align-items: center;
    justify-content: center;
	visibility:hidden;
}
.repeat-icon,.mute-icon,.preArrow-icon,.player-icon,.nextArrow-icon,.upload-icon,.record-icon{
	width:calc(100vw / 7 - 4px);
	height:60px;
	position: relative;
	z-index:2;
	display: flex;
    align-items: center;
    justify-content: center;
	pointer-events:all;
}
.repeat-icon{
	float:left;
	left:0px;
}
.record-icon{
	float:right;
	right:0px;
}
.mute-icon,.preArrow-icon,.player-icon,.nextArrow-icon,.upload-icon{
	float:left;
}
.recordsvg-Bg{
	background: #FFFFFF;
    border-radius: 40px 0 0 0;
}
#countdownPage,#recPage,#uploadPage,#DrWordPage{
	width: 100%;height: 100vh;
	position: fixed;
	z-index:3;
	cursor: pointer;
}
#countdownPage{
	z-index:99;
}
#uploadPage{
	z-index:5;
	display: flex;
    align-items: center;
    justify-content: center;
}
.uploadDiv{
	width: 216px;
	height: 187px;
	border-radius: 17px;
	-webkit-backdrop-filter: blur(5px);
	backdrop-filter: blur(5px);
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.31);
	background-color: rgba(242, 242, 242, 0.8);
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
}
.uploadLoading{
	font-size: 17px;
	font-weight: normal;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spacing: normal;
	text-align: center;
	color: #000000;
}
#parent{width:80%; height:3px;background: #d8d8d8; margin-top:10px;} 
#son {width:0; height:3px; background-color: #fc9c57; } 
#proess{text-align:center; line-height:10px; font-size: 0.8em; font-weight:bold;margin-top:10px;}
</style>

</head>


<body style="margin: 0;background-color:#222222" >
<div data-role="page"  style="background-color:#222222; overflow-y: hidden;height:100%;-webkit-overflow-scrolling: touch;" >
	<div id="all"  style="text-shadow: none;position:relative;margin: auto;min-width:300px;max-width:768px;background-color: #222222;font-size: 10px;">
		<header id="header"  style="z-index: 1;position:fixed;width:100%;margin-bottom: 20px;min-width:300px;max-width:768px;height:36px;top:0;background-color:#f42d54;box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.3);">
		<div style="position:relative;left:6.25%;width:87.5%;height:36px;">
			<div id="backContent1" onclick="history.back()" style="position:relative;float:left;width: 12.5%;height:36px">
				<svg style="position: absolute;top: 10px;left: 0;" width="9px" height="14px" viewBox="0 0 9 14" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
					<g  stroke="none" stroke-width="1" fill="blue" fill-rule="evenodd" stroke-linecap="square">
						<g  transform="translate(-19.000000, -11.000000)"  stroke="#ffffff" stroke-width="1.5">
							<g id="Top">
								<g id="back" fill="blue"  transform="translate(20.000000, 12.000000)">
									<path d="M5.86399104,0 L0,5.83288076" id="Line"></path>
									<path d="M6.06431479,5.84 L0,11.4658395" id="Line-Copy-5" transform="translate(3.032157, 8.652920) scale(-1, 1) translate(-3.032157, -8.652920) "></path>
								</g>
							</g>
						</g>
					</g>
				</svg>
			</div>
			<div id="title" data-value="0" style="top: 10px;width:100px;position:absolute;height: 26px;margin:0 auto;left:0;right:0;color: #ffffff;font-size:14px;text-align: center;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;"></div>
			<div class="displayNone" style="position:relative;float:right;width:15%;height:36px">
				<svg style="position: absolute;top: 10px;right: 0;" width="13px" height="14px" viewBox="0 0 13 14" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
					<g  stroke="none" stroke-width="1"  fill-rule="evenodd" opacity="1">
						<g transform="translate(-287.000000, -11.000000)" fill="#ffffff">
							<g id="Top">
								<g id="Material/Icons-black/share" transform="translate(281.000000, 6.000000)">
									<path d="M15.128,15.436747 L10.137,12.5200803 C10.172,12.3584337 10.2,12.1967871 10.2,12.0281124 C10.2,11.8594378 10.172,11.6977912 10.137,11.5361446 L15.072,8.64759036 C15.45,8.99899598 15.947,9.21686747 16.5,9.21686747 C17.662,9.21686747 18.6,8.2751004 18.6,7.10843373 C18.6,5.94176707 17.662,5 16.5,5 C15.338,5 14.4,5.94176707 14.4,7.10843373 C14.4,7.27710843 14.428,7.43875502 14.463,7.60040161 L9.528,10.4889558 C9.15,10.1375502 8.653,9.91967871 8.1,9.91967871 C6.938,9.91967871 6,10.8614458 6,12.0281124 C6,13.1947791 6.938,14.1365462 8.1,14.1365462 C8.653,14.1365462 9.15,13.9186747 9.528,13.5672691 L14.512,16.4909639 C14.477,16.6385542 14.456,16.7931727 14.456,16.9477912 C14.456,18.0793173 15.373,19 16.5,19 C17.627,19 18.544,18.0793173 18.544,16.9477912 C18.544,15.8162651 17.627,14.8955823 16.5,14.8955823 C15.968,14.8955823 15.492,15.1064257 15.128,15.436747 Z" id="Shape"></path>
								</g>
							</g>
						</g>
					</g>
				</svg>
			</div>
			<!--<div style="position:relative;margin-top:4px;width:70px;height:45px;float:right;right: -10px;"><iframe id="Flipswitch" name="Flipswitch" frameborder="0" width="100%" height="100%" src="./Flipswitch.asp?mode=0" scrolling="no" ></iframe></div><!-->	
			<input type="hidden" name="PlayMode" id="PlayMode" value="0" />
			<div class="navstar"></div>	
			<!--<div class="tutorial"></div><!-->		
		</div>
		</header>
		
		<div id="content2">
			<!--<div style="position:relative;background-color:black;padding:5px;"></div>-->
			<video id="player1"   style="width: 87.5%; height: 100%;position:relative;left:6.25%" preload="none" playsinline webkit-playsinline >
				<source type="video/youtube" />
			</video>
			<audio id="audio1"  ontimeupdate="updatetime1()" onended="audioClose()">
				<source type="audio/mpeg" />
			</audio>
			<!--<div style="position:relative;background-color:black;padding:5px;"></div>-->
			<span id="player1-mode"></span>
		<footer id="footer2"  style="z-index: 1;font-family: 'Big Caslon', 'Book Antiqua', 'Palatino Linotype', Georgia, serif;text-shadow: none;position:relative;width:100%;min-width:300px;max-width:768px;height:25px;background-color:#222222;overflow:hidden;">
			

			<!--
			<div style="position:absolute;left:6.25%;width:87.5%;height:40px;top:10px;">
				<div id="repeat" data-mode="1" style="position: relative;float:left;padding: 12px 6.25%;width: 12%;height: 16px;background-image:url('./img/repeat_no.png');background-position: center;background-repeat:no-repeat;background-size:20px 16px;"></div>
				<div id="shuffle" data-mode="0" style="position:relative;float: right;padding: 12px 6.25%;width: 12%;height:16px;background-image:url('./img/sequence.png');background-position: center;background-repeat:no-repeat;background-size:19px 14px;"></div>
				<div id="reSentence" data-value="0" style="font-family:PingFangTC-Regular,'Microsoft JhengHei',sans-serif;opacity:0.2;position:relative;margin:0 auto;padding: 12px 6.25%;width: 12%;height: 16px;background-size: 20px 21px;background-image:url('./img/player_reSentence.png');background-position:center;background-repeat:no-repeat;"></div>
			</div>
			<!-->
			<div class='eck1' style="position:absolute;left:16%;width:70%;top:15px">
				<div id="playProgressBottom" style="position:absolute;width:100%;height: 20px;left:0%;margin:0 auto;border-radius: 2.5px;background-color: #222222;"><div style="position:absolute;width: 100%;height:3px;top:0;background-color:grey;"></div></div>
				<div id="playProgress" style="position:absolute;width:0%;height:20px;left:0;margin:0 auto;border-radius: 2.5px;background-color:#222222"><div style="position:absolute;width: 100%;height:3px;top:0;background-color:#ffffff;"></div>
					<svg id="playProgressBall"  style="position:absolute;padding:10px;right:-15px;top:-13px" height="15" width="15"><circle cx="5" cy="5" r="5"  fill="#ffffff" /></svg>
				</div>
			</div>
			<div id="playIng" style="position:absolute;left:6.25%;width:6%;top:9px;text-align:left;color:#ffffff">0:00</div>
			<div id="playEnd" style="position:absolute;right:6.25%;width:6%;top:9px;text-align:right;color:#ffffff">4:30</div>
			<!--
			<div style="position:absolute;left:6.25%;width:87.5%;height:50px;top:90px;">
				<div id="preVideo" style="position:relative;float:left;padding: 15px 6.25%;width:16px;height:20px;background-image:url('./img/preArticle.png');background-position: center;background-repeat:no-repeat;background-size:16px 20px"></div>
				<div id="preSentence" style="position:relative;float:left;padding: 15px 6.25%;width:21px;height:20px;background-image:url('./img/preSentence.png');background-position: center;background-repeat:no-repeat;background-size:21px 20px"></div>
				<div id="player" style="position: absolute;margin: 0 auto;padding: 0 6.25%;left: 0;right: 0;width:50px;height:50px;background-image:url('./img/player_play.png');background-position: center;background-repeat:no-repeat;background-size:50px 50px"></div>
				<div id="nextVideo" style="position:relative;float:right;padding: 15px 6.25%;width:16px;height:20px;background-image:url('./img/nextArticle.png');background-position: center;background-repeat:no-repeat;background-size:16px 20px"></div>
				<div id="nextSentence" style="position:relative;float:right;padding: 15px 6.25%;width:21px;height:20px;background-image:url('./img/nextSentence.png');background-position: center;background-repeat:no-repeat;background-size:21px 20px"></div>
			</div>
			<!-->
		</footer>			
			<div id="lrcContent" style="overflow-y: auto;height:calc(100vh - 210px - 36px );">
				<!--<div style="position:relative;left:12.5%;width:75%;background-color:rgb(34, 34, 34);margin-top:55px">
					<div style="font-family: 'Big Caslon', 'Book Antiqua', 'Palatino Linotype', Georgia, serif;position:relative;font-size:15px;color:#ffffff;text-align:center">Boys only want love if it's torture</div>
					<div style="font-family: PingFangTC-Regular,'Microsoft JhengHei', sans-serif;position:relative;font-size:13px;color:#ffffff;text-align:center;margin-top:10px">男孩只想要讓人痛苦不已的愛情</div>
				</div>-->
			</div>

			<div id="modeTxt" style="opacity:0;position: fixed;color: #ffffff;background-color:#f74769;padding: 10px 30px;font-size: 15px;border-radius: 20px;text-align: center;width: 160px;bottom: 65px;left:50%;transform: translateX(-50%);pointer-events: none;">隨機撥放開啟</div>

			<div class="DrWord">
				<div class="Dr_title"></div>
				<div class="Dr_content"></div>
			</div>

			<div class="playerbar">
				<div class="Rectangle">
					<div class="mute-icon" data-value="0"><img src="svg/btn-unmute.svg" /></div>
					<div class="preArrow-icon" data-value="0"><img src="svg/btn-lastst-default.svg" /></div>
					<div class="player-icon" data-value="0"><img src="svg/recordplay.svg" /></div>
					<div class="nextArrow-icon" data-value="0"><img src="svg/btn-nextst-default.svg" /></div>
					<div class="upload-icon" data-value="0"><img src="svg/btn-upload-default.svg" /></div>
				</div>
				<div class="repeat-icon" data-value="0"><img src="svg/btn-repeat-off.svg" /></div>
				<div class="record-icon" data-value="0"><img src="svg/btn-record-off.svg" /></div>
				
			</div>

		</div>
		
	</div>	
</div>	

<script src="./js/mediaelement-and-player.js"></script>
<script>

// ====================================
// == for PC 「搜尋音樂」介面 v
// ====================================
if( /rwd/i.test(location.href) ){
	const date = new Date().getTime();
	const cssRef = document.createElement('link');
	const cssName = './css/rwd_sing.css?' + date;
	cssRef.setAttribute('rel', 'stylesheet');
	cssRef.setAttribute('type', 'text/css');
	cssRef.setAttribute('href', cssName);
	document.getElementsByTagName('head')[0].append(cssRef);
	//
	setTimeout(function(){
		const cut = $('#mep_0').height() + $('#footer2').height() + $('.playerbar').height();
		const height = $(window).height() - cut;
		console.log( $(window).height() , 'ww');
		$('#lrcContent').css({height});
	},500);
};

// -- 搜尋音樂 END ----------------------------------

var rec;
var rec_state='0';
var u = navigator.userAgent;
var mFile='';
var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
var isiOS = u.match(/(iphone);?/i);
var isPC = !u.match(/iphone|ipad|android/i);

function PlayListMode(){
	if($("#PlayMode").val()==0){ //歡唱
		location.href='./musicboxK.asp?musicNo=<%=musicNo%>'
	}else{ //一般
		location.href='./musicbox.asp?musicNo=<%=musicNo%>'
	}	
}

if (isAndroid==false){
	$('#reSentence').hide()
}

$(window).resize(function() {
  $('span').text(x+=1);
});

	function jquery_onboardingPage(num){
		$.ajax({
		   url: '../../NewMylessonMobile/onboarding/onboarding.asp?pg='+num,
		   type:'GET',
		   dateType:'html',
		   error: function(data){
			   //alert('data  error');
			   },
		   success:function(data){
				$('#onboardingPage').css('display','')
				$('#onboardingPage').append(data)
		   }			   
		});
	}
	

/*****Event[playProgress]*****/
// 在footer裡面的播放條
$('.mejs-controls').css('display','none')

	$(document).on('vmouseup', '#playProgressBottom', function(event){
		ballgo = 0
	})
	
	$(document).on('vmouseup', '#playProgress', function(event){
		ballgo = 0
	})
	
	$(document).on('vmouseup', '#playProgressBall', function(event){
		ballgo = 0
	})
	
	$(document).on('vmousedown', '#playProgressBall', function(event){
		ballgo = 1
	})
	
	$(document).on('click', '#playProgress', function(event){
		repeatNo=1
		var tmp = ((( event.clientX - $(window).width() * 0.15 ) / ( $(window).width() * 0.7 )).toFixed(2))
		$("#player1")[0].player.setCurrentTime((videoDuration*tmp))
		if(audioPlayChk())
			document.getElementById('audio1').currentTime=$("#player1")[0].player.getCurrentTime();
	})
	
	$(document).on('click', '#playProgressBottom', function(event){
		repeatNo=1
		var tmp = ((( event.clientX - $(window).width() * 0.15 ) / ( $(window).width() * 0.7 )).toFixed(2)) 
		$("#player1")[0].player.setCurrentTime((videoDuration*tmp))
		if(audioPlayChk())
			document.getElementById('audio1').currentTime=$("#player1")[0].player.getCurrentTime();
	})
	
	$(document).on('vmousemove', '#playProgress', function(event){
		repeatNo=1
		if ((ballgo==1)&&(event.clientX <  ($(window).width()*0.85))){
			
			var tmp = ((( event.clientX - $(window).width() * 0.15 ) / ( $(window).width() * 0.7 )).toFixed(2)) 
			
			$("#player1")[0].player.setCurrentTime((videoDuration*tmp))
			if(audioPlayChk())
				document.getElementById('audio1').currentTime=$("#player1")[0].player.getCurrentTime();
		}
	})


/*****Event[Repeat & Shuffle]*****/
// 全部都是playerbar 的功能

	//單句重複   0:關閉  1:開啟
	$(document).on('click', '.repeat-icon', function(event){
		if($(this).attr("data-value")=="0"){
			$(this).attr("data-value","1").css('backgroundColor','white');
			//提示
			$("#modeTxt").text("單句重複開啟")
			$("#modeTxt").attr("class"," ")
			setTimeout(function(){ $("#modeTxt").toggleClass("animate-showModeTxt")}, 100);
			//換icon圖示
			$('.repeat-icon img').attr('src','svg/btn-repeat-on.svg')
		}else{		
			$(this).attr("data-value","0").removeAttr('style');
			//提示
			$("#modeTxt").text("單句重複關閉")
			$("#modeTxt").attr("class"," ")
			setTimeout(function(){ $("#modeTxt").toggleClass("animate-showModeTxt")}, 100);
			//換icon圖示
			$('.repeat-icon img').attr('src','svg/btn-repeat-off.svg')
		}	
	});
	
	//錄音檔播放切換(youtube或錄音檔)  0:關閉 1:開啟 2:錄音與影片一起播
	$(document).on('click', '.mute-icon', function(event){
		//播放錄音檔
		if($(this).attr("data-value")=="0"){
			$(this).attr("data-value","1")
			//提示
			$("#modeTxt").text("僅播錄製錄音檔聲音")
			$("#modeTxt").attr("class"," ")
			setTimeout(function(){ $("#modeTxt").toggleClass("animate-showModeTxt")}, 100);
			//youtube暫停
			$("#player1")[0].player.setMuted(true)
			//撥放器開啟
			document.getElementById('audio1').muted=false;
			//icon更換
			$('.mute-icon img').attr('src','svg/btn-muteyoutube.svg');

		//播放youtube
		}else if($(this).attr("data-value")=="1"){		
			$(this).attr("data-value","2")
			$("#modeTxt").text("僅播YouTube影片聲音")
			$("#modeTxt").attr("class"," ")
			setTimeout(function(){ $("#modeTxt").toggleClass("animate-showModeTxt")}, 100);
			$("#player1")[0].player.setMuted(false)
			document.getElementById('audio1').muted=true;
			$('.mute-icon img').attr('src','svg/btn-mutevoice.svg')	
		// 一起播
		}else{		
			$(this).attr("data-value","0")
			$("#modeTxt").text("影片與錄音檔同步播放")
			$("#modeTxt").attr("class"," ")
			setTimeout(function(){ $("#modeTxt").toggleClass("animate-showModeTxt")}, 100);			
			$("#player1")[0].player.setMuted(false)
			document.getElementById('audio1').muted=false;
			$('.mute-icon img').attr('src','svg/btn-unmute.svg')
		}
	});
	
	//上一句
	$(document).on('click', '.preArrow-icon', function(event){
		//lastSentence repeatNo 全域變數
		var tmp = parseInt(lastSentence)-2
		repeatNo=1
		if (tmp<0){tmp = 0}
		// youtubw播放
		$("#player1")[0].player.setCurrentTime( parseFloat(mp3sec[tmp]));
		//檢查是否有播放
		if(audioPlayChk()){ 
			//聲音播放
			document.getElementById('audio1').currentTime = $("#player1")[0].player.getCurrentTime();
		}
	});

	//下一句
	$(document).on('click', '.nextArrow-icon', function(event){
		var tmp = parseInt(lastSentence);
		//重複開啟
		repeatNo=1;
		if ( tmp>(mp3sec.length-1) ){tmp = mp3sec.length-1}
		$("#player1")[0].player.setCurrentTime( parseFloat(mp3sec[tmp]) )
		if(audioPlayChk()){
			//聲音播放
			document.getElementById('audio1').currentTime = $("#player1")[0].player.getCurrentTime();
		}
	});
	
	var Jumpnow=''; //要前往的秒數
	var ScrollStatus=0; // 滾動
	var ScrollupTimeout; //setTimeout計時器

	//歌詞雙擊
	$(document).on('dblclick', '.sentence',function(){
		//取得行數
		var tmp = parseInt($(this).attr("data-count"))-1;
		//全域變數 重複開啟
		repeatNo=1;
		//youtube暫停播放
		$("#player1")[0].player.pause();
		//聲音播放暫停
		document.getElementById('audio1').pause();

		$("#player1")[0].player.setCurrentTime( parseFloat(mp3sec[tmp]) )
		Jumpnow=$("#player1")[0].player.getCurrentTime()
	
		ScrollStatus = 0
		clearTimeout(ScrollupTimeout);
	});

	//todo 邏輯待整理
	$(document).on("scrollstart",function(){
		if(ballgo==0){
			ScrollStatus=1
			clearTimeout(ScrollupTimeout);
		}
	});
	$(document).on("scrollstop",function(){
		if(ballgo==0){
			ScrollupTimeout=setTimeout(function(){ ScrollStatus=0;}, 10000);
		}
	});	

	//檢查收藏功能
	function NavStarChk(id){
		$.ajax({
			type: 'POST',
			url: '../../NewMylessonmobile/api/MyMusicbox?member_id=<%=m_id%>&customer_id=<%=c_id%>&musicbox_id='+id ,
			cache:false,
			dateType:'json',
			success:function(data){
				$('.navstar').off('click');
				if(data.favorite=='0'){
					$('.navstar').on('click',function(){
						NavStarjoin(id,'C')
					})
				}else{
					$('.navstar').on('click',function(){
						NavStarjoin(id,'D')						
					})	
					$('.navstar').addClass('navstarJ');				
				}

				if(data.filename!=''){
					$('#audio1').attr('src',data.filename)
					$('.repeat-icon').show();
					$('.Rectangle').css('visibility','visible')
					$('.record-icon img').attr('src','svg/btn-record-off.svg');
					$('.record-icon').off();
					$('.record-icon').on('click', function(event){	
					$(".sentence").removeClass('highlight')
					$(".sentence").removeClass('highlightF')
					$("#lrcContent").animate({ "scrollTop": parseFloat(0) });	
					$("#player1")[0].player.setCurrentTime(parseFloat(0))						
					$("#player1")[0].player.play();
					$("#player1")[0].player.setMuted(true)				
						filetrash();
					});	
				}
			}			   
		});
	}

	//加入收藏
	function NavStarjoin(id,target){
		$.ajax({
			type: 'POST',
			url: '../../NewMylessonmobile/'+target+'/api/Musicbox/join?member_id=<%=m_id%>&customer_id=<%=c_id%>&musicbox_id='+id,
			cache:false,
			dateType:'json',
			success:function(data){
				$('.navstar').off('click');
				if(target=='C'){
					$('.navstar').on('click',function(){
						NavStarjoin(id,'D')						
					})						
					$('.navstar').addClass('navstarJ');
				}else{
					$('.navstar').on('click',function(){
						NavStarjoin(id,'C')
					})					
					$('.navstar').removeClass('navstarJ');
				}
			}			   
		});
	}

	NavStarChk(<%=musicNo%>)

	//字典收藏檢查
	function Dr_StarChk(En){
		$.ajax({
			type: 'POST',
			url: '../../NewMylessonmobile/api/vocabulary?member_id=<%=m_id%>&customer_id=<%=c_id%>&Enkeyword='+En ,
			cache:false,
			dateType:'json',
			success:function(data){
				$('.Dr_Star').off('click');
				if(data.En_word==''){
					$('.Dr_Star').on('click',function(){
						Dr_Starjoin(En,'','C')
					})
				}else{
					$('.Dr_Star').on('click',function(){
						Dr_Starjoin(En,'','D')						
					})	
					$('.Dr_Star').addClass('Dr_StarJ');				
				}
			}			   
		});
	}

	//字典收藏功能
	function Dr_Starjoin(En,Ch,target){
		$.ajax({
			type: 'POST',
			url: '../../NewMylessonmobile/'+target+'/api/vocabulary/join?member_id=<%=m_id%>&customer_id=<%=c_id%>&Enkeyword='+En+'&Chkeyword='+Ch,
			cache:false,
			dateType:'json',
			success:function(data){
				$('.Dr_Star').off('click');
				if(target=='C'){
					$('.Dr_Star').on('click',function(){
						Dr_Starjoin(En,'','D')						
					})						
					$('.Dr_Star').addClass('Dr_StarJ');
				}else{
					$('.Dr_Star').on('click',function(){
						Dr_Starjoin(En,'','C')
					})					
					$('.Dr_Star').removeClass('Dr_StarJ');
				}
			}			   
		});
	}

	//長按出現字典功能(pc/m)
	$(document).on('taphold','.Drsapn',function(){
		  //console.log(RemoveTag($(this).text()))
		$(this).addClass('DrWord_highlight')
		let words=RemoveTag($(this).text());
		let Strword=''
		let num=0
		var wordsTitle=''
		$.get('Dr.eye/?word='+words, function(result){
			$.ajax({
				type: 'POST',
				url: '../../newmylessonmobile/api/dr.eye?keyword='+words ,
				cache:false,
				dateType:'json',
				headers : {'Fundaykey':result.toLowerCase()},
				success: function(data){
					 	
					//console.log(data.baseform.text[0])
					//wordsTitle=data.baseform.text[0]
					//if(wordsTitle=='entryword'){
						wordsTitle=words
						
					//}
					$('.Dr_title').html('<span>'+wordsTitle+'</span><div class="Dr_Star"></div><img src="svg/dreye-logo.png" style="right: 0px;height: 15px;float: right; margin-top: 9px" />')

					let line_div='';
					let Title_div=''
					$.each(data, function(i,item){
						
						if(num>0){
							if(item.attr.length<=2){
							 	line_div='<div style="position: absolute;border-top: 1px solid;top: 50%; left: 15%  ; width: 80%;"></div>'
							}else{
								line_div='<div style="position: absolute;border-top: 1px solid;top: 50%; left: 25%  ; width: 70%;"></div>'
							}
							Strword=Strword+'<div style="position: relative;margin: 10px 0 10px 0;">'+item.attr+line_div+'</div>'
						}

						$.each(item.text, function(i,item2){
							//console.log(num+' '+i+' '+item2)
							if(num>0){
								try{								
									$.each(item2, function(i,item3){
										if(i==0){
											Title_div='<div style="font-weight: 900;color: #F5A623;margin: 10px 0 0px 0;">'+ReplaceKeyword(item3)+'</div>'
										}else{
											Title_div='<div style="margin: 5px 0 5px 0;">'+ReplaceKeyword(item3)+'</div>'
										}
										Strword=Strword+Title_div
										num++
									})
								}catch(e){
										if(num==1){
											Title_div='<div style="font-size: 0.8em;">'+ReplaceKeyword(item2)+' '
										}else if(ReplaceKeyword(item2)==''){
											Title_div=+ReplaceKeyword(item2)+' '+'</div>'
											Title_div=Title_div.replace('0','')
										}else{
											Title_div=ReplaceKeyword(item2)+' '
										}

										Strword=Strword+Title_div
										num++
								}
							}else{
								num++
							}
						})
					})

					$('.Dr_content').html(Strword)
					Dr_StarChk(wordsTitle)
					$('body').append('<div id="DrWordPage" ></div>')
					$('.DrWord').show();	
					$('.playerbar').hide();
				}
			});
  		});



	});
	
	//點擊一次取消字典功能(pc/m)
	$(document).on('click','#DrWordPage',function(){
		$('.DrWord').hide();	
		$('.playerbar').show();
		$('.DrWord_highlight').removeClass('DrWord_highlight')
		$('#DrWordPage').remove();
			
	})

	//錄音功能
	$('.record-icon').on('click', function(event){
		/**调用open打开录音请求好录音权限**/
		$("#player1")[0].player.setCurrentTime(parseFloat(0))	
		$("#player1")[0].player.play();
		$("#player1")[0].player.setMuted(true)
		$(".sentence").removeClass('highlight') //每句歌詞的高亮
		$(".sentence").removeClass('highlightF') //每句歌詞的背景色
		$("#lrcContent").animate({ "scrollTop": parseFloat(0) });
									
		recopen()		
	});
	//自製撥放器的播放鍵   0:暫停 1:播放
	$('.player-icon').on('click',function(event){
		//播放
		if($(this).attr("data-value")=="0"){
			$(this).attr("data-value","1")
			//youtube暫停
			$("#player1")[0].player.pause();
			//聲音檔暫停
			document.getElementById('audio1').pause();
			//若聲音檔播放
			if(audioPlayChk()){
				//取得youtube播放的影片時間給聲音檔
				document.getElementById('audio1').currentTime = parseFloat($("#player1")[0].player.getCurrentTime())	
				document.getElementById('audio1').play();
			}
			//youtube播放
			$("#player1")[0].player.play();
			//切換icon
			$('.player-icon img').attr('src','svg/recordpause.svg')
		}else{
			$("#player1")[0].player.pause();		
			document.getElementById('audio1').pause();	
			$(this).attr("data-value","0")		
			$('.player-icon img').attr('src','svg/recordplay.svg')
		}	
	})

	//上傳功能
	$('.upload-icon').on('click',function(event){
		if(mFile!=''){
			uploadFile(mFile);
		}else{
			$("#modeTxt").text("請重新錄製")
			$("#modeTxt").attr("class"," ")
			setTimeout(function(){ $("#modeTxt").toggleClass("animate-showModeTxt")}, 100);
		}
	})


	var context=0;
	
	//錄音功能
	var recorder='';
	function recopen(){
		//todo 待查這段的意思 確認一下是不是外掛
		if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) { 
			var constraints = { audio: true, video: false};

			navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
				let options=''
				if(isiOS){
					options = { mimeType: 'audio/wave' };
				}else{
					options = { mimeType: 'audio/ogg' };
				}

				recorder = Recorder({
					type:"mp3",sampleRate:16000,bitRate:16 //mp3格式，指定采样率hz、比特率kbps，其他参数使用默认配置；注意：是数字的参数必须提供数字，不要用字符串；需要使用的type类型，需提前把格式支持文件加载进来，比如使用wav格式需要提前加载wav.js编码引擎
				});

				recorder.open();

				$('body').append('<div id="countdownPage"></div>')
				$.ajax({
					url: 'record-countdown.asp',
					type:'GET',
					dateType:'html',
					success:function(data){
						$('#countdownPage').html(data)
						$('#countdownPage').show()
						$('.record-icon').off();
					}			   
				});	
			})
		}

	}

	var rec_function='';  //timer
	var auto_rec_timeout='';


	/**开始录音**/
	function recStart(){//打开了录音后才能进行start、stop调用
		var rec_m=0
		var rec_s=0
		var rec_ss='00'
		$('.record-icon img,.repeat-icon').hide();
		$('.record-icon').css('backgroundColor', '#fff');
		$('.record-icon').append('<div class="recordsvg-Bg" ><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="62" height="60" viewBox="0 0 62 60">    <defs>        <linearGradient id="c" x1="16.176%" y1="19.052%" y2="100%">            <stop offset="0%" stop-color="#FC9C57"/>            <stop offset="100%" stop-color="#FF6C02"/>        </linearGradient>        <rect id="b" width="20" height="20" x="21" y="16" rx="2"/>        <filter id="a" width="160%" height="160%" x="-30%" y="-30%" filterUnits="objectBoundingBox">            <feOffset in="SourceAlpha" result="shadowOffsetOuter1"/>            <feGaussianBlur in="shadowOffsetOuter1" result="shadowBlurOuter1" stdDeviation="2"/>            <feColorMatrix in="shadowBlurOuter1" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.248142483 0"/>        </filter>        <text id="e" fill="#FF6C02" font-family="ArialMT, Arial" font-size="12">            <tspan x="10.322" y="11" id="rec_time">0:00</tspan>        </text>        <filter id="d" width="125%" height="142.9%" x="-12.5%" y="-21.4%" filterUnits="objectBoundingBox">            <feOffset in="SourceAlpha" result="shadowOffsetOuter1"/>            <feGaussianBlur in="shadowOffsetOuter1" result="shadowBlurOuter1" stdDeviation="1"/>            <feColorMatrix in="shadowBlurOuter1" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.254507212 0"/>        </filter>    </defs>    <g fill="none" fill-rule="evenodd">        <path  d="M38 0h24v60H0V38C0 17.013 17.013 0 38 0z"/>        <g>            <use fill="#000" filter="url(#a)" xlink:href="#b"/>            <use fill="url(#c)" xlink:href="#b"/>        </g>        <g transform="translate(14 41)">            <g fill="#FF6C02">                <use filter="url(#d)" xlink:href="#e"/>                <use xlink:href="#e"/>            </g>            <circle cx="2.5" cy="7.5" r="2.5" fill="#D0021B"/>        </g>    </g></svg></div>');
		$('body').append('<div id="recPage" ></div>');
		
		rec_function = setInterval(function(){
			if(rec_s>=60){
				rec_m++;
				rec_s=0
			}
			if(rec_s<10){
				rec_ss='0'+rec_s
			}else{
				rec_ss=rec_s
			}
			$('#rec_time').html(rec_m+':'+rec_ss)
			rec_s++
		},1000)

		//開始錄音
		recorder.start();
		rec_state = '1';
		//暫停播放
		videoPause = true;

		/*取消單句播放*/
		$('.repeat-icon').attr("data-value","0")
		$('.repeat-icon img').attr('src','svg/btn-repeat-off.svg')

		/*取消靜音*/
		$('mute-icon').attr("data-value","0")
		$("#player1")[0].player.setMuted(false)
		$('.mute-icon img').attr('src','svg/btn-unmute.svg')
		
		//youtube播放
		$("#player1")[0].player.setCurrentTime(parseFloat(0))
		$("#player1")[0].player.play();

		//結束錄音
		$('.record-icon').on('click', function(event){
			clearInterval(rec_function);
			$('.record-icon').off();
			recStop();
		});
	};

	/**结束录音**/
	function recStop(){
		$('#recPage').remove();
		//youtube 暫停
		$("#player1")[0].player.setCurrentTime(parseFloat(0))
		$("#player1")[0].player.pause();

		clearTimeout(auto_rec_timeout);

		rec_state='0';
		
		recorder.stop(function(blob,duration){
			//console.log(blob,(window.URL||webkitURL).createObjectURL(blob),"时长:"+duration+"ms");
			var url = URL.createObjectURL(blob);   
			$('#audio1').attr('src',url)

			mFile = blob;
			//顯示播放操控
			$('.repeat-icon').show();
			$('.Rectangle').css('visibility','visible')
			$('.record-icon img').attr('src','svg/btn-record-off.svg');
 			$('.record-icon').off();
			$('.record-icon').on('click', function(event){
				//丟掉檔案				
				filetrash();
			});	

		});

		//功能鍵加回來
		$('.record-icon img,.repeat-icon').show();
		$('.record-icon').removeAttr('style');
		$('.recordsvg-Bg').remove();
	};

	function RemoveTag( strText ){ 
		var regEx = /[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\,|\<|\.|\>|\/|\?|\“|\”|\〝|\〞]/g; 	
		var regx=strText.replace(regEx, "");
		return regx; 
	} 

	function spanWord( strText ){ 
		var regEx = /\b/g; 
		var chstr='';
		var chstr2='';

		strText=escape(strText);
		chstr=strText.split("%20");

		for(w=0;w<chstr.length;w++){
			chstr2=chstr2+'<span class="Drsapn" > '+unescape(chstr[w])+'</span>'
		}

		return chstr2; 
	} 

	function ReplaceKeyword(Keyword){
		var ky
		ky=Keyword.replace('@','<span style="color:#F5A623;">')
		ky=ky.replace('@','</span>')
		return ky		
	}

	function filetrash(){
		document.getElementById('audio1').pause();
		$('#audio1').attr('src','')
		$('.record-icon img').attr('src','svg/btn-record-off.svg');
		$('.repeat-icon').hide();
		$('.Rectangle').css('visibility','hidden');
		context=0;
		//$('.record-icon').on('click', function(event){
			recopen();		
		//});		
	}

	function uploadFile(blob){
		var formData = new FormData();
		formData.append("upfile",blob,"<%=c_id%>-<%=m_id%>-<%=musicNo%>.mp3");
		formData.append('member_id', '<%=m_id%>');
		formData.append('customer_id', '<%=c_id%>');
		formData.append('musicbox_id', '<%=musicNo%>');
		var urls='https://funday.asia/newmylessonmobile/api/FunKTVUpload'
		/** 
		* 必須false才會避開jQuery對 formdata 的預設處理 
		* XMLHttpRequest會對 formdata 進行正確的處理 
		*/ 

		$('body').append('<div id="uploadPage" ><div class="uploadDiv"><img src="svg/icn-download.svg" /><div class="uploadLoading">檔案上傳中...</div><div id="parent"><div id="son"></div></div><div id="proess"></div></div></div>')		
		$.ajax({
			type: "POST",
			url: urls,
			contentType:false, //让xhr自动处理Content-Type header，multipart/form-data需要生成随机的boundary
			processData:false, //不要处理data，让xhr自动处理			
			data: formData ,
			processData : false, 
			//必須false才會自動加上正確的Content-Type 
			contentType : false , 
			xhr: function(){
				var xhr = $.ajaxSettings.xhr();
				if(onprogress && xhr.upload) {
					xhr.upload.addEventListener("progress" , onprogress, false);
					return xhr;
				}
			} 
		});

	}
	/**

	/**
	* 偵查附件上傳情況 ,這個方法大概0.05-0.1秒執行一次
	*/
	function onprogress(evt){
		var loaded = evt.loaded;     //已經上傳大小情況 
		var tot = evt.total;      //附件總大小 
		var per = Math.floor(100*loaded/tot);  //已經上傳的百分比 
		console.log(per+'%');
		$("#proess").html( per + "%" );
		$("#son").css("width" , per + "%");
		if(per>=100){
			setTimeout(function(){
			$('#uploadPage').remove()
			},2000)
		}
	}

   //$('video').addEventListener('load', mediaelementplayer, false);
	var videoPause='';
	var audioPause='';
	//影片播放
	$('video').mediaelementplayer({
		success: function (mediaElement, domObject) {
			mediaElement.load()
			$(".mejs-controls").css('display','none');
				mediaElement.addEventListener('timeupdate', function (e){
				videoDuration = mediaElement.duration
				videoPause=mediaElement.paused
				timeUpdate(e)
			}, false);
			var xml='<%=musicNo%>'
				
			jquery_lrc(xml)
				
		},
		error: function() {
			if ( parseInt(whichStart) >=(listIndx.length-1) ){whichStart=-1}
			var tmp =listIndx[parseInt(whichStart)+1]
			whichStart = parseInt(whichStart)+1
			jquery_lrc(tmp)
		}

	});
	

	$(document).on('click','#player',function(event){
		if( mp3Ing == true ){
			$("#player1")[0].player.pause()
			document.getElementById('audio1').pause();
			//$(this).css("background-image","url('./img/player_play.png')")
			mp3Ing = false
		}else{
			$("#player1")[0].player.play()
			if(audioPlayChk()){
				document.getElementById('audio1').currentTime=$("#player1")[0].player.getCurrentTime();
				document.getElementById('audio1').play();
			}
			//$(this).css("background-image","url('./img/player_pause.png')")
			mp3Ing = true
		}
	
	});

	var bool_changeSong = true;
	var bool_open = true;

	function updatetime1(){
		if($("#player1")[0].player.getCurrentTime() >= document.getElementById('audio1').duration){
			audioClose()
		}
	}
	//檢查錄音檔是否播放
	function audioPlayChk(){
		if(isNaN(document.getElementById('audio1').duration)){
			return false;
		}else if(($("#player1")[0].player.getCurrentTime() < document.getElementById('audio1').duration) ){
			return true;
		}else{
			return false;
		}
	}
	function audioClose(){
		$("#modeTxt").text("錄音檔結束")
		$("#modeTxt").attr("class"," ")
		$("#modeTxt").toggleClass("animate-showModeTxt")		
	}

	function timeUpdate(e){
		/*判斷自動停止錄音*/
		if(videoPause==true && rec_state=='2'){
			clearInterval(rec_function);
			$('.record-icon').off();
			recStop();
		}

		//todo不知道判斷什麼
		if( bool_open == true ){	
			bool_open = false

			$(".mejs-controls").css('display','none');
			
			if ( (parseInt($("#player1")[0].player.getCurrentTime()) >0.5 ) && (mp3Go == false) ){
				$( "#title" ).attr('class','animateTitle')
				$( "#title" ).text(title)
				$( "#title" ).attr("data-value","1")
				intervalFuc = setInterval(function (){ 
					if($( "#title" ).attr("data-value")=="0" ){
						$( "#title" ).text(title)
						$( "#title" ).attr("data-value","1")
					}else{
						$( "#title" ).text(author)
						$( "#title" ).attr("data-value","0")	
					}	
				},6000);
				mp3Go = true
			}
			
			var nowmp3sec = $("#player1")[0].player.getCurrentTime();

			if( ( Math.abs( accSub( parseFloat(nowmp3sec),parseFloat(videoDuration) ) ) < 0.5  ) && ( parseFloat(videoDuration)!=0 ) ) {
				var ArticleRepeat = 0
				var ArticleShuffle = $("#shuffle").attr("data-mode")
				
				if (ArticleRepeat==0){
					if (ArticleShuffle==1){
						var shuffleNo = Math.floor((Math.random() * listIndx.length) + 1)-1;
						for (i=0;i<10;++i){
							if (shuffleNo == parseInt(whichStart)){
								shuffleNo = Math.floor((Math.random() * listIndx.length)+ 1)-1;
							}else{
								break;
							}
						}
						var tmp =listIndx[shuffleNo]
						whichStart = shuffleNo
						jquery_lrc(tmp)
					}
					mp3Ing = false
					$("#player").css("background-image","url('./img/player_play.png')")		
				}else if ( (ArticleRepeat==1) &&(bool_changeSong==true) ){
					bool_changeSong = false
					if ( parseInt(whichStart) >=(listIndx.length-1) ){whichStart=-1}
					var tmp =listIndx[parseInt(whichStart)+1]
					whichStart = parseInt(whichStart)+1
					jquery_lrc(tmp)
					
				}else{
					$("#player1")[0].player.setCurrentTime(0);
					document.getElementById('audio1').currentTime = 0;
				}

			}else if( Math.abs( accSub( parseFloat(nowmp3sec),parseFloat(premp3sec) ) ) > 0.05  ){
				
				mp3Ing = true
				$(".sentence").removeClass('sentenceF')
				$("#player").css("background-image","url('./img/player_pause.png')")
				if(Jumpnow!=''){

					$("#player1")[0].player.setCurrentTime(Jumpnow);
					if(isNaN(Jumpnow)){						
						document.getElementById('audio1').currentTime=0
					}else{
						document.getElementById('audio1').currentTime=parseFloat($("#player1")[0].player.getCurrentTime())
					}

					$("#player1")[0].player.play();
					if(audioPlayChk()){
						document.getElementById('audio1').play();
					}

					Jumpnow=''
				}
				
				var minIng = Math.floor(($("#player1")[0].player.getCurrentTime())/60)
				var secIng = Math.round(($("#player1")[0].player.getCurrentTime())%60)	
				var minEnd = Math.floor((videoDuration)/60)
				var secEnd = Math.round((videoDuration)%60)
				if (secIng / 10 < 1){secIng="0"+secIng.toString()}
				if (secEnd / 10 < 1){secEnd="0"+secEnd.toString()}
				$("#playIng").text(minIng+":"+secIng)
				$("#playEnd").text(minEnd+":"+secEnd)
				var tmp =((Math.round($("#player1")[0].player.getCurrentTime()) / Math.round(videoDuration)).toFixed(2))*100
				$("#playProgress").css("width",tmp+"%")
				
				const vMobi = 75 + 20;
				var lrcContentHeight=parseInt(($("#lrcContent").outerHeight()/(vMobi)/2));
				for( i=0;i<=mp3sec.length;++i ){
					if( parseFloat($("#player1")[0].player.getCurrentTime()) > parseFloat($(".sentence:eq("+(i)+")").attr("data-start") ) ) {
						var data_end = ""
						if ( (i+1) >= mp3sec.length ){
							data_end = videoDuration
						}else{
							data_end = $(".sentence:eq("+(i+1)+")").attr("data-start")
						}
						if( ( parseFloat($("#player1")[0].player.getCurrentTime()) < parseFloat( data_end ) )  && ( lastSentence != i) ){ 
							lastSentence = i 
							if( ($('.repeat-icon').attr('data-value')=='1') && ((i-1)>0) && repeatNo==0 ){
								$("#player1")[0].player.setCurrentTime(mp3sec[i-2])
								if(audioPlayChk()){
									document.getElementById('audio1').currentTime=parseFloat($("#player1")[0].player.getCurrentTime());
									document.getElementById('audio1').play();
								}	
								lastSentence = i-1
								
							}else{
									if(ScrollStatus==0){
										$(".sentence").removeClass('highlight')
										$(".sentence").removeClass('highlightF')
										if(i<mp3sec.length){
											let st = 0;
											if( isPC ){
												// pc
												for( j = 0; j< i; j++){
													st = st + $('.sentence').eq(j).innerHeight();
												};
												const cut = $('.sentence').eq(i-1).innerHeight();
												$("#lrcContent").animate({ "scrollTop": st - cut });
											}else{
												// mobi & pad
												if(isiOS){
													$("#lrcContent").animate({ "scrollTop": parseFloat($(".sentence:eq("+(i)+")").height()+20)*(i-lrcContentHeight)+60+(vMobi) });
												}else{
													$("#lrcContent").animate({ "scrollTop": parseFloat($(".sentence:eq("+(i)+")").height()+20)*(i-lrcContentHeight)+60 });
												}
											}

										}

										$(".sentence:eq("+(i)+")").addClass('highlight');
										if(audioPlayChk()){
											document.getElementById('audio1').currentTime=parseFloat($("#player1")[0].player.getCurrentTime())
											document.getElementById('audio1').play();
										}											
									}								
								//console.log( i +' - '+mp3sec.length)
								repeatNo=0
							}
							//console.log( $("#player1")[0].player.getCurrentTime()+':'+parseFloat( data_end ))
						}else{
							if(rec_state=='1' && videoPause==false){
								rec_state='2' /*開始錄音*/
								recorder.start(600000);
							}
						}

						if(videoPause==true){
							document.getElementById('audio1').pause();
						}

					}
					
				}

			}else{
				mp3Ing = false
				$("#player").css("background-image","url('./img/player_play.png')")
			}	
	
			premp3sec = nowmp3sec
			bool_open = true
		}

		if(videoPause==false){
			$('.player-icon').attr("data-value","1")	
			$('.player-icon img').attr('src','svg/recordpause.svg')
		}else{
			$('.player-icon').attr("data-value","0")	
			$('.player-icon img').attr('src','svg/recordplay.svg')
			//$(".sentence").removeClass('highlight')
			$('.highlight').addClass('highlightF')
			$(".sentence").addClass('sentenceF')
			ScrollStatus=0
			clearTimeout(ScrollupTimeout);	
		}

	};	
		
		
		
  ////////////////
 /***Variable***/
////////////////
	var ballgo = 0	//Variable[event:playProgress](global)播放球
//////////////////////

	var title;
	var author;

	var mp3Go = false;  //不知道做什麼用的參數
	var videoDuration ;
	
	var  premp3sec = 0;
	
	var whichStart = 0 //Variable[event:.menuContent-click](global)要從哪篇開始
	var speedAdjust = 1

/*****Variable[function:onupdateTime](global)*****/
	var lastSentence = -1

	var repeatNo = 0
	var mp3Ing = false
	var playNoIng = 0	//Article now

/*****Variable[XML](global)*****/
	var mp3sec = new Array();
	var listIndx = new Array();
	var countListIndx = 0
	
	var pic = new Array()	
	var mp3A = new Array()	//learning

	/*****Variable[XML]*****/
	var lrc ,list;

	var xmlList = './xml/musicboxList.asp'
	jquery_list(xmlList)
	
	function jquery_list(url_str){
		$.get( url_str, function( data ) {
			list = data;
			getList();
		});
	}
	

	whichStart = '<%=request("whichStart")%>'
	whichStart = parseInt(whichStart)
	
	function jquery_lrc(url_str){
		$.get( "../../../musicbox/SRT.asp?indx="+url_str, function( data ) {
			lrc = data;
			getContent2()
		});
	}
	
		
	/***id=content的內容***/
	function getList(){
		$(list).find('lrc').each(function(){
			listIndx[countListIndx] = $(this).attr('indx')
			countListIndx = countListIndx + 1
		})
	}
	
	
	/***id=content2的內容***/
	function getContent2(){
		
		/***Initialize***/
		mp3sec.length = 0
		
		title = $(lrc).find('lrc').attr('Title')
		author = $(lrc).find('lrc').attr('singer_title')
		var Ysrc = 'https://www.youtube.com/watch?v='+$(lrc).find('lrc').attr('Yurl')+'&playsinline=1'
        //console.log(Ysrc)
		setTimeout(function(){
			$("#player1")[0].player.setSrc(Ysrc)
		}, 500);
				
		var contentEn = new Array();
		var contentTc = new Array();
		

		var countEn = 0,countTc = 0;
		
		$(lrc).find('lrclist').each(function(){
			contentEn[countEn] = $(this).attr('en_content')
			contentTc[countEn] = $(this).attr('ch_content')
			mp3sec[countEn] = $(this).attr('lrctime')
			
			var splitStart = mp3sec[countEn].split(":");
			mp3sec[countEn] = parseFloat(Math.round(splitStart[0]))*60 + parseFloat(parseFloat(splitStart[1]).toFixed(2));
			
			countEn = countEn + 1
		})
		
		if(contentEn.length == contentTc.length){
		
			$("#lrcContent").html('')
			tmp1 = '<div class="sentence sentenceF"  data-start="0" data-count="0" >'
			tmpTitle = '<div class="sentence-title" style="font-family: Helvetica, Arial,\'Microsoft JhengHei\', sans-serif;position:relative;font-size:20px;text-align:center;padding: 0 10px 0 10px;">'+spanWord(title)+'</div>'
			tmpAuthor = '<div class="sentence-title" style="font-family: Helvetica, Arial,\'Microsoft JhengHei\', sans-serif;position:relative;font-size:20px;text-align:center;margin-top:6px;padding: 0 10px 0 10px;">'+author+'</div>'
			var sentenmask='<div class="SentenceMask"></div>'
			$("#lrcContent").append(tmp1+tmpTitle+tmpAuthor+sentenmask+'</div>')

			for(i=0;i<contentEn.length;i++){
				
				var lrcEn = '<div class="sentence-en" style="font-family: Helvetica, Arial,\'Microsoft JhengHei\', sans-serif;position:relative;font-size:18px;text-align:center;padding: 0 10px 0 10px;">'+spanWord(contentEn[i])+'</div>'
				var lrcTc = '<div class="sentence-ch" style="font-family: Helvetica, Arial,\'Microsoft JhengHei\', sans-serif;position:relative;font-size:13px;text-align:center;margin-top:6px;padding: 0 10px 0 10px;">'+contentTc[i]+'</div>'

				$("#lrcContent").append('<div class="sentence sentenceF"  data-start="'+mp3sec[i]+'" data-count="'+(i+1)+'" >'+lrcEn+lrcTc+'</div>');
			}
			$("#lrcContent").append('<div style="position:relative;width:100%;height:50vh;"></div>');
		}
			
		if (mp3Go == true){
			setTimeout(function(){
				bool_changeSong = true
				mp3Ing = false
				$( "#player" ).trigger( "tap" );
			},800);
		}
		
		
	}
	
	function accSub(arg1,arg2){
		var r1,r2,m,n;
		try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
		try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
		m=Math.pow(10,Math.max(r1,r2));
		 //last modify by deeka
		 //動態控制精度長度
		 n=(r1>=r2)?r1:r2;
		 return ((arg1*m-arg2*m)/m).toFixed(n);
	}


</script>
</body>
</html>