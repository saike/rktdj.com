var $ = $ || {};
(function() {

    function is_touch_device() {
        return !!('ontouchstart' in window) || (!!('onmsgesturechange' in window) && !!window.navigator.maxTouchPoints);
    }

    var video = document.getElementById('videobg');
    if(is_touch_device())  video.style.display = 'none';

    var albums = [{name: "vol1", tracks: [1, 2, 3, 4]}, {name: "rktdjcom", tracks: [1, 2, 3]}, {name: "proxydigil", tracks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]}, { name: 'churban', tracks: [0, 1, 2, 3, 4, 5, 6, 7] }];

    //get random rgb color
    function randomColor() {

        return 'rgb(' + Math.floor(Math.random() * 230) + ',' + Math.floor(Math.random() * 230) + ',' + Math.floor(Math.random() * 230) + ')';

    }


    //Audio Player Class
    var Player = {

        isPlay: false,
        playlist: [],
        trackNumber: 0,
        currentTrack: "",
        audio: document.getElementById('player'),
        init: function() {

            var coverKeeper = document.getElementById('coverKeeper');

            var container = document.body;
            container.style.backgroundColor = randomColor();

            var player = this;

            //on track ended play next track
            player.audio.addEventListener("ended", function(event) {

                event.preventDefault();
                console.log("track ended!");
                player.nextTrack();

            }, false);

            //create album covers
            albums.forEach(function(album) {

                var albumCover = document.createElement('div'),
                    controlsContainer = document.createElement('div');

                albumCover.className = "album-cover";
                albumCover.id = album.name;
                controlsContainer.className = "album-label";
                controlsContainer.innerHTML = album.name;
                albumCover.appendChild(controlsContainer);
                albumCover.onclick = function() {

                    player.playAlbum(album);

                };

                albumCover.style.backgroundColor = randomColor();

                albumCover.onmouseover = function() {

                    $(this).animate({backgroundColor: randomColor()}, 20);
                };
                albumCover.onmouseout = function() {

                    $(this).animate({backgroundColor: randomColor()}, 20);
                    $(container).animate({backgroundColor: randomColor()}, 20);

                };

                album.container = albumCover;
                coverKeeper.appendChild(albumCover);
            });
        },
        startPlay: function(track) {
            $("#play").hide();
            $("#pause").show();
            var audioSrc = this.playlist[track];
            var audioDom = this.audio;
            $(audioDom).empty();
            var trackSource1 = document.createElement('source');
            trackSource1.type = 'audio/ogg';
            trackSource1.src = audioSrc + ".ogg";
            var trackSource2 = document.createElement('source');
            $(audioDom).append(trackSource2);
            trackSource2.type = 'audio/mpeg';
            trackSource2.src = audioSrc + ".mp3";
            $(audioDom).append(trackSource1);
            audioDom.load();
            audioDom.play();
            this.currentTrack = audioSrc;
            console.log("current track: " + this.currentTrack);
        },
        addTrack: function(track) {

            this.playlist.push(track);

        },
        prevTrack: function() {

            var newTrack = this.playlist.indexOf(this.currentTrack) - 1;
            if (newTrack < 0) {

                newTrack = this.playlist.length - 1;

            }
            this.startPlay(newTrack);

        },
        nextTrack: function() {
            var newTrack = this.playlist.indexOf(this.currentTrack) + 1;
            if (newTrack >= this.playlist.length) {

                newTrack = 0;

            }
            this.startPlay(newTrack);

        },
        stopPlay: function() {

            var audio = this.audio;
            audio.pause();

        },
        resumePlay: function() {

            this.audio.play();

        },
        playAlbum: function(album) {

            var player = this;
            //empty playlist
            player.playlist = [];

            //empty audio
            $(player.audio).empty();

            //reset albums
            albums.forEach(function(alb) {
                var controlsContainer = $(alb.container).children()[0];
                controlsContainer.innerHTML = alb.name;
                $(controlsContainer).removeClass("album-label-active");
                alb.container.onclick = function() {

                    player.playAlbum(alb);

                };
            });

            var curAlbum = album;

            //prevent more clicks on cover
            curAlbum.container.onclick = false;

            if (curAlbum) {

                //add tracks to playlist
                curAlbum.tracks.forEach(function(track) {

                    var audioSrc = "albums/" + curAlbum.name + "/" + track;

                    player.addTrack(audioSrc);

                });

                //start play first track
                player.startPlay(0);

                //move album label up for controls
                var controlsContainer = $(album.container).children()[0];
                $(controlsContainer).addClass("album-label-active");

                //insert controls
                var controls = document.createElement('div');
                controls.className = "controls";

                //previus track button
                var prevbtn = document.createElement('i');
                prevbtn.className = "prev-button icon-white icon-fast-backward album-controls";
                prevbtn.onclick = function() { player.prevTrack(); };

                controls.appendChild(prevbtn);

                //pause button
                var pauseBtn = document.createElement('i');
                pauseBtn.className = "pause-button icon-white icon-pause album-controls";
                pauseBtn.id = "pause";
                pauseBtn.onclick = function() {
                    player.stopPlay();
                    $(this).hide();
                    $("#play").show();
                };
                controls.appendChild(pauseBtn);

                //play button
                var playBtn = document.createElement('i');
                playBtn.id = "play";
                playBtn.className = "play-button icon-white icon-play album-controls";
                playBtn.style.display = "none";
                playBtn.onclick = function() {

                    player.resumePlay();
                    $("#pause").show();
                    $(this).hide();

                };
                controls.appendChild(playBtn);

                //next track button
                var nextbtn = document.createElement('i');
                nextbtn.className = "prev-button icon-white icon-fast-forward album-controls";
                nextbtn.onclick = function() { player.nextTrack(); };
                controls.appendChild(nextbtn);

                controlsContainer.appendChild(controls);


            }
        }

    };

    Player.init();

}());



