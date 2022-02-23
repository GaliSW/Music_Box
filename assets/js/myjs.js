//logo及其他連結設定
// $("#logo").click(function(){
//     location.href='index.html';
// });

//預載圖片
	var img = new Image();
	img.src="../img/input_radio_do.svg"

//頁籤效果 
$(function(){
	// 預設顯示第一個 Tab
	var _showTab = 0;
	$('.switch_tab').each(function(){
		// 目前的頁籤區塊
		var $tab = $(this);

		var $defaultLi = $('ul.tabs li', $tab).eq(_showTab).addClass('active');
		$($defaultLi.find('a').attr('href')).siblings().hide();
		
		// 當 li 頁籤被點擊時...
		// 若要改成滑鼠移到 li 頁籤就切換時, 把 click 改成 mouseover
		$('ul.tabs li', $tab).click(function() {
			// 找出 li 中的超連結 href(#id)
			var $this = $(this),
				_clickTab = $this.find('a').attr('href');
			// 把目前點擊到的 li 頁籤加上 .active
			// 並把兄弟元素中有 .active 的都移除 class
			$this.addClass('active').siblings('.active').removeClass('active');
			// 淡入相對應的內容並隱藏兄弟元素
			$(_clickTab).stop(false, true).fadeIn().siblings().hide();

			return false;
		}).find('a').focus(function(){
			this.blur();
		});
	});
});

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
$(".buootn.same .cut01").click(function(){
  $(".buootn.same .cut01").toggle();
  $(".buootn.same .cut02").toggle();
});
$(".buootn.same .cut02").click(function(){
  $(".buootn.same .cut02").toggle();
  $(".buootn.same .cut03").toggle();
});
$(".buootn.same .cut03").click(function(){
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
	if(decimalNo <= 9){
		$(this).html("0"+decimalNo++); 
	}else{
		$(this).html(decimalNo++); 
	}	
 });
 
  var decimalNo2 = 1;
$("#tab2 span[class='decimal']").each(function () {   
	if(decimalNo2 <= 9){
		$(this).html("0"+decimalNo2++); 
	}else{
		$(this).html(decimalNo2++); 
	}	
 });