               <div>
                    <iframe
                        type="text/html"
                        :src="bannerVd"
                        width="100%"
                        frameborder="0"
                        id="bannerVd"
                        enablejsapi="1"
                    >
                    </iframe>
               </div>
                <script>
                //youtube api
                var tag = document.createElement("script");
                tag.src = "https://www.youtube.com/iframe_api";
                var firstScriptTag = document.getElementsByTagName("script")[0];
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
                window.onYouTubeIframeAPIReady = () => {
                    var player;
                    player = new YT.Player("bannerVd", {
                        playerVars: {
                            playsinline: 1,
                            controls: 1,
                            rel: 0,
                            fs: 0,
                        },
                        events: {
                            onReady: onPlayerReady,
                        },
                    });
                };

                function onPlayerReady(e) {
                    e.target.mute().playVideo();
                }
                </script>
