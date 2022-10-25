$(function () {
    var playerTrack = $("#player-track"),
        bgArtwork = $("#bg-artwork"),
        bgArtworkUrl,
        albumName = $("#album-name"),
        trackName = $("#track-name"),
        albumArt = $("#album-art"),
        sArea = $("#s-area"),
        seekBar = $("#seek-bar"),
        trackTime = $("#track-time"),
        insTime = $("#ins-time"),
        sHover = $("#s-hover"),
        expandPlayer = $("#album-art"),
        iart = expandPlayer.find("i"),
        closePlayer = $("#album-art.active"),
        iartclose = closePlayer.find("i"),
        playPauseButton = $("#play-pause-button"),
        i = playPauseButton.find("i"),
        tProgress = $("#current-time"),
        tTime = $("#track-length"),
        seekT,
        seekLoc,
        seekBarPos,
        cM,
        ctMinutes,
        ctSeconds,
        curMinutes,
        curSeconds,
        durMinutes,
        durSeconds,
        playProgress,
        bTime,
        nTime = 0,
        buffInterval = null,
        tFlag = false,
        albums = [
            "Just A Gent",
            "Just A Gent",
            "Just A Gent",
            "Just A Gent",
            "Just A Gent",
            "Just A Gent",
            "Just A Gent",
            "Just A Gent",
            "Just A Gent",
            "Just A Gent",
            "Just A Gent",
            "Just A Gent",
            "Just A Gent",
            "Just A Gent",
            "Just A Gent"
        ],
        trackNames = [
            "Intro",
            "Lightspeed",
            "Island Fever",
            "Trip to Mars",
            "Aliens",
            "Cosmos",
            "Don't wait for me",
            "Feel Celeste",
            "No Time Limit",
            "Nova",
            "Out Of Order",
            "Sleeptalking",
            "Know",
            "W.W.H.T.",
            "Planet Oasis"
        ],
        albumArtworks = ["_1", "_1", "_1", "_1","_1", "_1", "_1", "_1","_1", "_1", "_1", "_1","_1", "_1", "_1"],
        trackUrl = [
            "https://audio.jukehost.co.uk/ijWIV8f7U1QqRkmoddXlHREO0Kxt4rnK",
            "https://audio.jukehost.co.uk/ZC82WUXZC0vf9AyoCLBozbotZ6pbB13Q",
            "https://audio.jukehost.co.uk/fKm0FIuL3oPSjxpJk1dIiHVczMeQNfd6",
            "https://audio.jukehost.co.uk/HqTz0DlhAfCDn4pSol1RZ7wlUf95MGBl",
            "https://audio.jukehost.co.uk/nyIXEP35MZQZiXKi9YqO8pVNqZDNG9ZQ",
            "https://audio.jukehost.co.uk/oTilq15vyY4n3wEwUyhwbmjThXix3UFn",
            "https://audio.jukehost.co.uk/nfcWJgtJEQZ0Pep33eVEfxHFiVHpgm5K",
            "https://audio.jukehost.co.uk/rFOwpOG7dZm2MpEeYPwlJuk0YJanxwhv",
            "https://audio.jukehost.co.uk/0EYI7zO460n21YTwA1ZrOGAxHWtMVZZu",
            "https://audio.jukehost.co.uk/5cjXONL4WSlyXcjJEokmeSESimtLtxD6",
            "https://audio.jukehost.co.uk/7rjKIMS5ELvSXB7t0Y64hJuuQeWOupDm",
            "https://audio.jukehost.co.uk/zPlJ9yiaPpfA6xlX59iM8lx6ixK7bfqm",
            "https://audio.jukehost.co.uk/Nt8bSi2COSsXoQpCfo1aGffNQLEkDMSb",
            "https://audio.jukehost.co.uk/mEiI0y0I6yzbHqSy5Dexz1E6lYa2Nhmx",
            "https://audio.jukehost.co.uk/niuZ3Qfb5mH327EhqTSsVUsPUqslDi0V"
        ],
        playPreviousTrackButton = $("#play-previous"),
        playNextTrackButton = $("#play-next"),
        currIndex = -1;

    function playPause() {
        setTimeout(function () {
            if (audio.paused) {
                albumArt.addClass("active");
                checkBuffering();
                i.attr("class", "fas fa-pause");
                audio.play();
            } else {
                albumArt.removeClass("active");
                clearInterval(buffInterval);
                albumArt.removeClass("buffering");
                i.attr("class", "fas fa-play");
                audio.pause();
            }
            }, 300);
    }

    function expandMediaPlayer() {
        setTimeout(function () {
            if (playerTrack.hasClass("active")) {
                playerTrack.removeClass("active");
            } else {
                playerTrack.addClass("active");
            }
        }, 300);
    }

    function closeMediaPlayer() {
        setTimeout(function () {
            playerTrack.removeClass("active");
        }, 300);
    }

    function showHover(event) {
        seekBarPos = sArea.offset();
        seekT = event.clientX - seekBarPos.left;
        seekLoc = audio.duration * (seekT / sArea.outerWidth());

        sHover.width(seekT);

        cM = seekLoc / 60;

        ctMinutes = Math.floor(cM);
        ctSeconds = Math.floor(seekLoc - ctMinutes * 60);

        if (ctMinutes < 0 || ctSeconds < 0) return;

        if (ctMinutes < 0 || ctSeconds < 0) return;

        if (ctMinutes < 10) ctMinutes = "0" + ctMinutes;
        if (ctSeconds < 10) ctSeconds = "0" + ctSeconds;

        if (isNaN(ctMinutes) || isNaN(ctSeconds)) insTime.text("--:--");
        else insTime.text(ctMinutes + ":" + ctSeconds);

        insTime.css({ left: seekT, "margin-left": "-21px" }).fadeIn(0);
    }

    function hideHover() {
        sHover.width(0);
        insTime.text("00:00").css({ left: "0px", "margin-left": "0px" }).fadeOut(0);
    }

    function playFromClickedPos() {
        audio.currentTime = seekLoc;
        seekBar.width(seekT);
        hideHover();
    }

    function updateCurrTime() {
        nTime = new Date();
        nTime = nTime.getTime();

        if (!tFlag) {
            tFlag = true;
            trackTime.addClass("active");
        }

        curMinutes = Math.floor(audio.currentTime / 60);
        curSeconds = Math.floor(audio.currentTime - curMinutes * 60);

        durMinutes = Math.floor(audio.duration / 60);
        durSeconds = Math.floor(audio.duration - durMinutes * 60);

        playProgress = (audio.currentTime / audio.duration) * 100;

        if (curMinutes < 10) curMinutes = "0" + curMinutes;
        if (curSeconds < 10) curSeconds = "0" + curSeconds;

        if (durMinutes < 10) durMinutes = "0" + durMinutes;
        if (durSeconds < 10) durSeconds = "0" + durSeconds;

        if (isNaN(curMinutes) || isNaN(curSeconds)) tProgress.text("00:00");
        else tProgress.text(curMinutes + ":" + curSeconds);

        if (isNaN(durMinutes) || isNaN(durSeconds)) tTime.text("00:00");
        else tTime.text(durMinutes + ":" + durSeconds);

        if (
            isNaN(curMinutes) ||
            isNaN(curSeconds) ||
            isNaN(durMinutes) ||
            isNaN(durSeconds)
        )
            trackTime.removeClass("active");
        else trackTime.addClass("active");

        seekBar.width(playProgress + "%");

        if (playProgress == 100) {
            i.attr("class", "fa fa-play");
            seekBar.width(0);
            tProgress.text("00:00");
            albumArt.removeClass("buffering").removeClass("active");
            clearInterval(buffInterval);
        }
    }

    function checkBuffering() {
        clearInterval(buffInterval);
        buffInterval = setInterval(function () {
            if (nTime == 0 || bTime - nTime > 1000) albumArt.addClass("buffering");
            else albumArt.removeClass("buffering");

            bTime = new Date();
            bTime = bTime.getTime();
        }, 100);
    }

    function selectTrack(flag) {
        if (flag == 0 || flag == 1) ++currIndex;
        else --currIndex;

        if (currIndex > -1 && currIndex < albumArtworks.length) {
            if (flag == 0) i.attr("class", "fa fa-play");
            else {
                albumArt.removeClass("buffering");
                i.attr("class", "fa fa-pause");
            }

            seekBar.width(0);
            trackTime.removeClass("active");
            tProgress.text("00:00");
            tTime.text("00:00");

            currAlbum = albums[currIndex];
            currTrackName = trackNames[currIndex];
            currArtwork = albumArtworks[currIndex];

            audio.src = trackUrl[currIndex];

            nTime = 0;
            bTime = new Date();
            bTime = bTime.getTime();

            if (flag != 0) {
                audio.play();
                playerTrack.addClass("active");
                albumArt.addClass("active");

                clearInterval(buffInterval);
                checkBuffering();
            }

            albumName.text(currAlbum);
            trackName.text(currTrackName);
            albumArt.find("img.active").removeClass("active");
            $("#" + currArtwork).addClass("active");

            bgArtworkUrl = $("#" + currArtwork).attr("src");

            bgArtwork.css({ "background-image": "url(" + bgArtworkUrl + ")" });
        } else {
            if (flag == 0 || flag == 1) --currIndex;
            else ++currIndex;
        }
    }

    function initPlayer() {
        audio = new Audio();

        selectTrack(0);

        audio.loop = false;

        expandPlayer.on("click", expandMediaPlayer);
        closePlayer.on("click", closeMediaPlayer);

        playPauseButton.on("click", playPause);

        sArea.mousemove(function (event) {
            showHover(event);
        });

        sArea.mouseout(hideHover);

        sArea.on("click", playFromClickedPos);

        $(audio).on("timeupdate", updateCurrTime);

        playPreviousTrackButton.on("click", function () {
            selectTrack(-1);
        });
        playNextTrackButton.on("click", function () {
            selectTrack(1);
        });
        audio.addEventListener('ended',function(){
              selectTrack(1);
        });
    }

    initPlayer();
});
