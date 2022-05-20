var tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var app = new Vue({
  el: "#app",
  data: {
    allVideoData: {}, //相關推薦
    categoryId: {}, //分類id
    videoId: {}, //API內該篇影片id
    related: {}, //相關推薦
    subTitle: {}, //歌詞細節
    songInfo: {}, //日前歌曲資訊
    ytId: "",  //youtubeId
	ytTutor_url:'', //老師解說youtubeURL
    player: null, //YT撥放器
	teacher_player:null, //老師解說YT撥放器
    playstate: 0, //播放狀態 0:暫停 1:播放 , 
    captions:1 , //字幕狀態 0:關閉 1:英文 2:中文 3:中英,
    playMethods:1, //1:循環 2.單曲 3.單句
	playRadom:true, //隨機撥放
	currentTime:0, //目前播放時間
	allTime:0, //整首歌的時間
	startTimeArr:[], //播放時間陣列,
	//tutortimeArr:[],//老師講解時間列表
	nowPlaying:0, //目前播放的歌詞行數
	ch_content:'', //目前中文字幕
	en_content:'', //目前英文字幕,
	timer:null, //setInterval計時器
	others:{}, //其他撥放清單,
	tutor:false,  //老師講解打開
	paragraph:false, //老師講解分段
	subtitle_en:[], //英文歌詞組成span
	keyWordResult:{}, //字典搜尋結果
	DrWordModal:false,//字典modal開關
	DrWord:'',//字本人
	member_id:'',
	customer_id:''
  },
  computed:{

  },
  watch:{
	currentTime: function(val,oldVal){
		//比對到歌詞秒數陣列
		if(this.startTimeArr.indexOf(this.currentTime) !== -1){
			//增加播放行數
			this.nowPlaying ++;
			console.log('行數+1')

			let subtitleIndex = this.startTimeArr.indexOf(this.currentTime);
			this.ch_content = this.subTitle[subtitleIndex].ch_content;
			this.en_content = this.subTitle[subtitleIndex].en_content;
			
		}	
	},
	nowPlaying:function(){
		
		if(this.nowPlaying!=0){
			if($('.subtitle_items li.active').length==0) return;
			//字幕滾動區
			const listWindowContent = document.querySelector('.subtitle_items');
			//字幕視窗高度
			const listWindowHeight = listWindowContent.offsetHeight;
			//字幕視窗上方與瀏覽器距離
			const listWindowTop = listWindowContent.offsetTop;
			//滾動觸發
			const listWindowBottom = listWindowHeight - listWindowTop;

			//字幕區塊高(每句高度都不同)
			const sutitleBlkHeight =  document.querySelector('.subtitle_items li.active').offsetHeight;
			//正在播放的字幕與瀏覽器距離 (會隨歌曲撥放而跳句)
			const sutitleBlkTop = document.querySelector('.subtitle_items li.active').offsetTop + sutitleBlkHeight;

			if (this.playMethods == 3) return //單句模式不滾動
			//提前觸發

			if (sutitleBlkTop > listWindowBottom-200 ) {
				listWindowContent.scrollBy({
					top: sutitleBlkHeight,
					behavior: "smooth",
				});
			}
		}
	},
	paragraph: async function(val,oldVal){
		await this.fnTutor();
	}
  },
  methods: {
    initYoutube() {
		const _ = this;
		console.log("initYoutube");
		console.log(_.ytId);
		this.player = new YT.Player("player", {
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
			videoId: _.ytId,
			events: {
				onReady: _.onPlayerReady,
				onStateChange: _.onPlayerStateChange, //偵測播放狀態
				onError: _.onPlayerError,
			},
		});

		this.teacher_player = new YT.Player("teacher_player",{
			playerVars: {
				playsinline: 1,
				controls: 1,
				rel: 0,
				fs: 0,
				showinfo: 0, //隱藏影片資訊
				modestbranding: 1, //隱藏logo
				fs: 0, //隱藏全螢幕按鈕
				cc_lang_pref: "en",
				cc_load_policy: 0, //隱藏字幕
				iv_load_policy: 3, //隱藏註釋
				autohide: 0, //播放時隱藏控制器
			},
			//videoId: _.ytId,
			events: {
				// onReady: _.onPlayerReady,
				// onStateChange: _.onPlayerStateChange, //偵測播放狀態
				// onError: _.onPlayerError,
			}
		});
    },
    onPlayerReady(evt) {
		console.log("Player ready");

		//取得影片長度 秒
		const time = this.player.getDuration();
		let min = Math.floor(time / 60);
		let sec = (time % 60).toFixed(0);

		if (min < 10 && sec < 10) {
			this.allTime = `0${min}:0${sec}`;
		} else if (min < 10 && sec == 10) {
			this.allTime = `0${min}:${sec}`;
		} else if (min < 10 && sec > 10) {
			this.allTime = `0${min}:${sec}`;
		} else if (min > 10 && sec < 10) {
			this.allTime = `${min}:0${sec}`;
		} else {
			this.allTime = `${min}:${sec}`;
		}

		this.timer = setInterval(this.fnTimeChecking, 500);
		
		//老師講解
		this.fnTutor();
    },
    onPlayerStateChange(e) {
//		console.log("Player state changed", e.data);
		//-1:未開始 0:結束 1:正在播放 2:已暫停 3:緩衝 5:已插入影片
		if (e.data == 1) { this.playstate = 1;  this.timer = setInterval(this.fnTimeChecking, 500)}
		if (e.data == 2) { this.playstate = 0;  clearInterval(this.timer)}
		if (e.data == 0) {
			
			//播放方式 1:循環
			if(this.playMethods == 1){
				this.fnPlayListRepeat(e);
			}
			
			//單曲模式
			if(this.playMethods == 2){
				this.fnSingleSongRepeat(e)
			}

			//隨機撥放模式
			if(this.playRadom == true && this.playMethods == 1){
				this.fnPlayListRamdom(e)
			}
		}
		
    },
    onPlayerError(evt) {
		console.log("error");
		console.log(evt);
    },
	//取得影片時間軸 每500毫秒檢查一次
	fnTimeChecking() {
	
    	//取得目前時間 秒
		const time = this.player.getCurrentTime();
    	//取得影片長度 秒
		const allTime = this.player.getDuration();
		this.currentTime = time;

		if (time < allTime) {
			let currentTime = (time / allTime) * 100;
			//撥放進度條統一
			document.querySelector(".goTime_bar").style.width = `${currentTime}%`;
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
		if(this.playMethods == 3){
			this.fnSentenceRepeat();
		}
	},
	//控制播放狀態
    fnPlay(state) {
		this.playstate = state;
		if (state == 1) { this.player.playVideo(); }
		if (state == 0) { this.player.pauseVideo(); }
    },
	//控制字幕狀態
	fnCaptions(e){
		//字幕狀態 0:關閉 1:英文 2:中文 3:中英,
		if(e == 0) {this.captions += 1}  
		if(e == 1) {this.captions += 1}
		if(e == 2) {this.captions += 1}
		if(e == 3) {this.captions = 0}
	},
	//控制播放狀態
	fnPlayMethods(e){
		console.log(e)
		//播放方式 1:循環 2:單曲 3:單句,
		if(e == 1) {this.playMethods += 1;}
		if(e == 2) {this.playMethods += 1;}
		if(e == 3) {this.playMethods = 1;}
	},
	//按歌詞播放某一段
	fnSeekTo(event){
		let gotoTime = $(event.target).parents('li').data('seek');
		let nowplayingLyric = $(event.target).parents('li').data('count');
		this.nowPlaying = nowplayingLyric;  //把播放句子的index重新指定
		if(this.playstate ==0){
			this.player.seekTo(gotoTime);
			this.player.playVideo();
		}else{
			this.player.seekTo(gotoTime);
		}
	},
    fnTimeBar(e) {
      console.log("a");
    },
	//單句循環模式
	fnSentenceRepeat(){
		//找到目前撥放的句數與下一句的句數
		let sentence_start = $('.subtitle_items li[data-count="'+ this.nowPlaying +'"]').data('seek');
		let sentence_end = this.startTimeArr[this.nowPlaying];
		this.playRadom = false; 
		//console.log('現在播放句數:'+this.nowPlaying ,'目前播放時間:'+ this.currentTime, '該句撥放結束時間:'+sentence_end, '前往句數'+sentence_start)

		if(this.currentTime == sentence_end){
			this.player.seekTo(sentence_start);
			//回到該被重複的句數
			this.nowPlaying -= 1; 
		}
	},
	//單曲循環模式
	fnSingleSongRepeat(e){
		this.playRadom = false;
		//單曲模式 + 撥放結束 + 老師講解關閉
		if (this.playMethods == 2 && e.data === YT.PlayerState.ENDED && this.tutor==false) {
			this.player.seekTo(0);
			this.player.playVideo();
		}
	},
	//循環播放清單
	fnPlayListRepeat(e){
		console.log('循環')
		this.playRadom = true;
		if (this.playMethods == 1 && e.data === YT.PlayerState.ENDED) { 
			location.href = `./video.html?categoryId=${this.categoryId}&?videoId=${this.others.next_id}`;
		}
	},
	//隨機播放清單
	fnPlayListRamdom(){
		console.log('隨機')
		if (this.playMethods == 1 && e.data === YT.PlayerState.ENDED) { 
			location.href = `./video.html?videoId=${this.others.random_id}&categoryId=${this.categoryId}`;
			console.log('隨機撥放')	
		}
	},
	//下一首
	fnGoNext(){
		location.href = `./video.html?categoryId=${this.categoryId}&videoId=${this.others.next_id}`;
	},
	//下一首
	fnGoPrev(){
		location.href = `./video.html?categoryId=${this.categoryId}&videoId=${this.others.previous_id}`;
	},
	//老師講解目前沒有要開發
	fnTutor(){
		//tutor:true,  老師講解打開
		//paragraph:false 老師講解分段
		if(this.tutor == true && this.paragraph == false){
			console.log('老師講解打開 + 整首');
			//播放完畢
			if(currentTime == allTime){
				this.subTitle.forEach((item)=>{
					if(item.Tutortime!==''){
						let seekTutorTime;
						seekTutorTime = parseFloat(Math.round(item.Tutortim.split(':')[0]))*60 + parseFloat(parseFloat(item.Tutortim.split(':')[1]).toFixed(2));
						this.player.seekTo(seekTutorTime);
					}
				});
			}
		}

		if(this.tutor==true && this.paragraph==true){
			console.log('老師講解打開 + 分段')
			
		}
	},
	//youtube iframe API
    getVideo() {
      let vm = this;
      const promise1 = new Promise((resolve, reject) => {
        //內頁歌曲
        axios
          .get("https://funday.asia/api/MusicboxWeb/MusicboxJson.asp?indx=" + vm.videoId)
          .then((res) => {
			  console.log(res.data)
			  console.log(res)
            vm.subTitle = res.data.data;
			vm.others = res.data.others;
            vm.songInfo = res.data.info;
            vm.ytId = vm.songInfo.url.split("/")[3];
			vm.ytTutor_url = `https://www.youtube.com/embed/${vm.songInfo.tutor_url.split("/")[3]}?enablejsapi=1&controls=0&showinfo=0&autoplay=1&rel=0`;

			//字串時間
			vm.startTimeArr = vm.subTitle.map((ele,idx,array)=>{
				return ele.time.split(":")[0]+':'+ ele.time.split(':')[1].split('.')[0];
			});

			//給字典用
			for (let i = 0; i < this.subTitle.length; i++) {
				let en = this.subTitle[i].en_content.split(" ");
				this.subtitle_en[i] = en;
			}
            resolve("Success");
          })
          .catch((error) => console.log(error));
      });

      promise1.then((successMessage) => {
        console.log(successMessage);
        window.onYouTubePlayerAPIReady = function () {
          vm.initYoutube();
        };
      });
    },
	getPageData(){
		let vm = this;
		let hash = window.location.href;
		let member_id = sessionStorage.getItem("mindx");
		let customer_id = sessionStorage.getItem("cindx");
	
		this.member_id = member_id;
		this.customer_id = customer_id;
	
		hash = hash.split("?")[1];
		hash = hash.split("&"); //['categoryId=1','videoId=1050']
	
		vm.categoryId = hash[0].split("=")[1];
		vm.videoId = hash[1].split("=")[1];
	   
		//GET請求 相關連結
		axios
		  .get(`https://funday.asia/API/musicboxweb/defaultList.asp?member_id=${this.member_id}`)
		  .then((res) => {
			vm.sidebar = res.data.Category;
			vm.data = res.data;
			//console.log(res.data)
			let result = vm.sidebar.map((element, index, array) => {
			  //只顯示八筆資料
			  return {
				title: element.Category,
				id: element.CategoryId,
				data: res.data[element.Category].slice(0, 8),
			  };
			});
	
			vm.allVideoData = result;
	
			//熱門歡唱/熱門點閱的相關影片
			if (
			  vm.categoryId == "Hot%20Recording" ||
			  vm.categoryId == "Hot%20Click"
			) {
			  if (vm.categoryId == "Hot%20Recording") {
				vm.related = {
				  title: "Hot Recording",
				  data: vm.data["Hot Recording"].slice(0, 8),
				};
			  }
			  if (vm.categoryId == "Hot%20Click") {
				vm.related = {
				  title: "Hot Click",
				  data: vm.data["Hot Click"].slice(0, 8),
				};
			  }
			} else {
			  //相關影片
			  let related = {};
			  this.allVideoData.forEach((element) => {
				if (element.id === this.categoryId) {
				  //console.log(element);
				  related = element;
				}
			  });
			  vm.related = related;
			}
		  })
		  .catch((error) => console.log(error));
	},
	//開始錄音 
	startRecord(){
		location.href = `./video_dubbing.html?categoryId=${this.categoryId}&videoId=${this.videoId}`;
	},
	//搜尋單字
	fnSearchWord(target,evt){
		let vm = this;
		vm.DrWord = target;
		const str = target
		.replace(".", "")
		.replace("?", "")
		.replace("!", "")
		.replace(",", "");
		$('.Dr_title .word h3').html(str);
		const md5str = md5(`${str}|Funday1688`);
		
		axios
		.get(`https://funday.asia/api/dr.eye.asp?keyword=${str}&Fundaykey=${md5str}`)
		.then((res) => {
			vm.keyWordResult = res.data;
			let keys = Object.keys(vm.keyWordResult);
			let re = /@/gi;
			let re2 = /,/gi;
			
			for(var i=0; i<keys.length; i++){
				let fixWord = [];
				for(var j =0; j<vm.keyWordResult[keys[i]].text.length; j++){
					fixWord.push(vm.keyWordResult[keys[i]].text[j].toString().replace(re,'').replace(re2,' ')) 
				}
				vm.keyWordResult[keys[i]].text = fixWord;
			}

			if(window.offsetWidth > 600){
				$('.DrWord').css({right:25,top:evt.pageY+10})
			}
		
			this.DrWordModal = true;
		})
		.catch((error) => console.log(error));
		
		if(this.customer_id){
			//查詢是否有收錄過該字詞
			this.getDrWordModal();
		}
		
	},
	//查詢已收錄字典
	getDrWordModal(e){
		//api/Articla/CheckWords 
		axios
		.get(`https://funday.asia/NewMylessonmobile/api/vocabulary?customer_id=${this.customer_id}&member_id=${this.member_id}&Enkeyword=${this.DrWord}&Chkeyword=`)
		.then((res) => {
			console.log(res.data.En_word)
			if(res.data.En_word==''){
				console.log('n')
				$('.collect .icon .fas.fa-heart').hide();
				$('.collect .icon .far.fa-heart').show();
			}else{
				console.log('y')
				$('.collect .icon .fas.fa-heart').show();
				$('.collect .icon .far.fa-heart').hide();
			}
		})
		.catch((error) => console.log(error));
	},
	//會員單字收錄
	fnWordsCollect(e){
		//api/Article/WordsCollect
		if(!this.member_id){ 
			alert('請先登入'); 
			$('#myModal07').modal('show');
			return;
		}
		axios
		.get(`https://funday.asia/NewMylessonmobile/C/api/vocabulary/join?customer_id=${this.customer_id}&member_id=${this.member_id}&Enkeyword=${this.DrWord}&Chkeyword=`)
		.then((res) => {
				
			alert(res.data.StateMessage);
			$('.collect .icon .fas.fa-heart').show();
			$('.collect .icon .far.fa-heart').hide();
		})
		.catch((error) => console.log(error));
	},
	//刪除單字
	deleteWord($event){
		//api/Article/WordsCollectSort 取得該單字的order
		//取得後再刪除
		//api/Article/DeleteWordsCollect  刪除

		console.log($event)
		axios
		.get(`https://funday.asia/NewMylessonmobile/D/api/vocabulary/join?customer_id=${this.customer_id}&member_id=${this.member_id}&Enkeyword=${this.DrWord}&Chkeyword=`)
		.then((res) => {
			alert(res.data.ReturnMessage);
			$('.collect .icon .fas.fa-heart').hide();
			$('.collect .icon .far.fa-heart').show();
		})
		.catch((error) => console.log(error));
	},
	fnCloseDrWordModal(){
		$('.DrWordModal').removeClass('active');
	},
	//收藏該篇歌曲
	fnAddToCollection($event){
		//判斷是否登入
		if(!this.member_id){ 
			alert('請先登入'); 
			$('#myModal07').modal('show');
			return
		}
		
		//取得點擊到的該篇影片id
		let VideoId =  $($event.target).data('videoid');
		//此API在同一個歌曲編號的狀況下，再打一次為取消收藏
		axios
		.get(`https://funday.asia/api/MusicboxWeb/Behavior.asp?member_id=${this.member_id}&ref_id=${VideoId}&action=favorite`)
		.then((res) => {
			if(res.data.State==1){
				//新增成功
				$($event.target).addClass('favorites');
			}

			if(res.data.State==2){
				//刪除成功
				$($event.target).removeClass('favorites');
			}
		})
		.catch((error) => console.log(error));
	},
	fnLike(){
		if(!this.member_id){ 
			alert('請先登入'); 
			$('#myModal07').modal('show');
			return;
		}
		// axios
		// .get(`https://funday.asia/api/MusicboxWeb/Behavior.asp?member_id=${this.member_id}&ref_id=${VideoId}&action=promote&${p_member_id}`)
		// .then((res) => {
			
		// })
		// .catch((error) => console.log(error));


	}
  },
  created() {
   
	this.getPageData()
    this.getVideo();
  },
});


