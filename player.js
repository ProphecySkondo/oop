(() => {
  const VIDEO_ID = "5vN1UvKq15k";

  const poster = document.getElementById("video-poster");
  const overlay = document.getElementById("video-overlay");
  const playBtn = document.getElementById("play-button");

  // Show the video thumbnail before play (since autoplay is removed)
  poster.style.backgroundImage = `url("https://i.ytimg.com/vi/${VIDEO_ID}/hqdefault.jpg")`;

  let player;

  // Called automatically by YouTube IFrame API
  window.onYouTubeIframeAPIReady = function () {
    player = new YT.Player("video-background", {
      width: "640",
      height: "360",
      videoId: VIDEO_ID,
      playerVars: {
        controls: 0,
        modestbranding: 1,
        rel: 0,
        playsinline: 1,
        disablekb: 1,

        // We are NOT using autoplay.
        // We are NOT relying on loop=1.
        // JS will loop it manually when it ends.
      },
      events: {
        onStateChange: onPlayerStateChange,
        onError: onPlayerError,
      },
    });
  };

  function onPlayerStateChange(e) {
    // When video ends, restart it (manual loop)
    if (e.data === YT.PlayerState.ENDED) {
      try {
        player.seekTo(0);
        player.playVideo();
      } catch (err) {
        // ignore
      }
    }
  }

  function onPlayerError(err) {
    console.warn("YouTube Player Error:", err);
    showOverlay("▶ Play background video");
  }

  function hideOverlay() {
    overlay.style.display = "none";
    poster.style.display = "none";
  }

  function showOverlay(text) {
    overlay.style.display = "flex";
    poster.style.display = "";
    playBtn.disabled = false;
    playBtn.textContent = text || "▶ Play background video";
  }

  function startPlayback() {
    if (!player || typeof player.playVideo !== "function") {
      playBtn.disabled = true;
      playBtn.textContent = "Starting...";
      const check = setInterval(() => {
        if (player && typeof player.playVideo === "function") {
          clearInterval(check);
          startPlayback();
        }
      }, 150);
      return;
    }

    hideOverlay();

    try {
      player.playVideo();
    } catch (err) {
      console.warn("Play failed:", err);
      showOverlay("▶ Click to try again");
    }
  }

  playBtn.addEventListener("click", startPlayback);
})();
