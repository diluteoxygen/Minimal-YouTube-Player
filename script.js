function getVideoId(youtubeUrl) {
    if (youtubeUrl.startsWith("https://youtu.be/")) {
      var urlParts = youtubeUrl.split("/");
      return urlParts[urlParts.length - 1];
    }
    var videoId1 = youtubeUrl.split("v=")[1];

    return videoId1.split("&")[0];
  }

  function playVideo() {
    var youtubeUrl = document.getElementById("youtube-url").value;

    var videoId = getVideoId(youtubeUrl);

    var iframe = document.createElement("iframe");
    iframe.src = "https://www.youtube.com/embed/" + videoId + "?autoplay=1";

    iframe.width = "100%";
    iframe.height = 540;

    var player = document.getElementById("player");
    player.innerHTML = "";
    player.appendChild(iframe);

    player.style.display = "block";
    var searchContainer = document.getElementById("search-container");
    searchContainer.style.transform = "translateY(0)";
  }