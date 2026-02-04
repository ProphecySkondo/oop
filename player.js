(() => {
  const VIDEO_ID = "5vN1UvKq15k";

  const poster = document.getElementById("video-poster");
  const overlay = document.getElementById("video-overlay");

  // Thumbnail before the iframe fully loads
  poster.style.backgroundImage = `url("https://i.ytimg.com/vi/${VIDEO_ID}/maxresdefault.jpg")`;

  let player;

  window.onYouTubeIframeAPIReady = function () {
    player = new YT.Player("video-background", {
      videoId: VIDEO_ID,
      playerVars: {
        autoplay: 1,
        mute: 1,
        controls: 0,
        modestbranding: 1,
        rel: 0,
        playsinline: 1,
        disablekb: 1,
        fs: 0,
        showinfo: 0
      },
      events: {
        onReady: (e) => {
          // Force mute + play (most reliable autoplay method)
          e.target.mute();
          e.target.playVideo();

          // Hide overlay + poster once it starts
          overlay.style.display = "none";
          poster.style.display = "none";
        },

        onStateChange: (e) => {
          // Manual loop (reliable)
          if (e.data === YT.PlayerState.ENDED) {
            e.target.seekTo(0);
            e.target.playVideo();
          }
        }
      }
    });
  };

  // If autoplay fails for any reason, show click-to-play fallback
  function showClickFallback() {
    overlay.style.display = "flex";
    overlay.innerHTML = `
      <button id="play-button" class="play-btn">▶ Click to Play</button>
    `;

    document.getElementById("play-button").onclick = () => {
      player.mute();
      player.playVideo();
      overlay.style.display = "none";
      poster.style.display = "none";
    };
  }

  // Safety fallback after 2 seconds
  setTimeout(() => {
    if (!player) return;
    const state = player.getPlayerState?.();
    // If not playing, show fallback
    if (state !== 1) showClickFallback();
  }, 2000);
})();
