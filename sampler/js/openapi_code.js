var VKSAMPLER = {};
VKSAMPLER.sampler = {};
VKSAMPLER.tracks = [];
VKSAMPLER.track_list = document.getElementById('track_list');
VKSAMPLER.sampler.startOnNext = document.getElementById('playOnNext');
VKSAMPLER.player = document.getElementById('player');
VKSAMPLER.player.controls = true;

VKSAMPLER.nextTrack = function(){

    var trackCount = VKSAMPLER.tracks.length;
    var newIndex = Math.floor(Math.random() * (trackCount - 0 + 1)) + 0;
    console.log(newIndex);
    var newTrack = VKSAMPLER.tracks[newIndex];
    if(newTrack) VKSAMPLER.loadTrack(newTrack);

};

document.onkeypress = function(e) {

    if (e.keyCode === 13) {
        e.preventDefault();
        VKSAMPLER.nextTrack();
        console.log('enter');
    }

};




VKSAMPLER.searchForm = document.getElementsByName('search_query')[0];
VKSAMPLER.searchCount = document.getElementsByName('search_count')[0];
VKSAMPLER.searchBtn = document.getElementById('searchBtn');

VKSAMPLER.setOffline = function(checker){
    var search_form = document.getElementsByClassName('search_form')[0];
    if(checker.checked){

        search_form.style.display = 'block';
        toggleHelp();
        VKSAMPLER.searchForm.style.display = 'none';
        VKSAMPLER.searchCount.style.display = 'none';
        VKSAMPLER.searchBtn.style.display = 'none';

    }
    else {

        VKSAMPLER.searchForm.style.display = 'inline-block';
        VKSAMPLER.searchCount.style.display = 'inline-block';
        VKSAMPLER.searchBtn.style.display = 'inline-block';

    }
};

VKSAMPLER.searchForm.onfocus = function(){

    document.onkeydown = false;
    document.onkeyup = false;

};

VKSAMPLER.searchCount.onfocus = function(){

    document.onkeydown = false;
    document.onkeyup = false;

};

VKSAMPLER.fileLoader = {

    loader: document.getElementById('loadFiles'),
    loadedFiles: []

};

//



VKSAMPLER.fileLoader.loader.onchange = function(e) {
    VKSAMPLER.track_list.innerHTML = '';
    VKSAMPLER.tracks = [];
    var files = e.target.files;
//    freader.readAsDataURL(files[0]);
    for(var i = 0, len = files.length; i < len; i+=1){
        if(files[i].type == 'audio/mp3' || files[i].type == 'audio/wav'){

            (function(){

                var freader = new FileReader();
                freader.readAsDataURL(files[i]);
                var nTrack = { artist: files[i].name, title: '', url: ''};

                freader.onloadend = function(e) {
                    nTrack.url = e.target.result;
                    VKSAMPLER.tracks.push(nTrack);
                    console.dir(VKSAMPLER.tracks);
                    var title = document.createElement('div');
                    title.className = 'track';
                    title.innerHTML = nTrack.artist + ' - ' + nTrack.title;
                    title.onclick = function(){

                        VKSAMPLER.loadTrack(nTrack);

                    };
                    VKSAMPLER.track_list.appendChild(title);
                };

            }());

        }

    }
    console.dir(files);
};

VKSAMPLER.customSamples = {};

VKSAMPLER.isPressed = { key: false, pressed: false, keys: {} };

VKSAMPLER.stopPlay = false;

VKSAMPLER.setContinuePlay = function(checker){

    VKSAMPLER.stopPlay = checker.checked;

};

window.onload = function() { // когда вся страница загрузиться
    // инициализируем "приложение"
    window.vkAsyncInit = function() {
        VK.init({
            apiId: 4267122, // заменяем на id своего приложения
            nameTransportPath: '/xd_receiver.html'    // заменяем на ссылку к файлу xd_receiver.html на вашем сервере
        });
    };
    (function() {
        var el = document.createElement('script');
        el.type = 'text/javascript';
        el.src = 'http://vkontakte.ru/js/api/openapi.js';
        el.charset="windows-1251";
        el.async = true;
        document.getElementById('vk_api_transport').appendChild(el);
    }());
};

// получаем данные о пользователе. id пользователя считываем из переменной 1280
function getInitData() {
    var code;
    code = 'return {'
    code += 'me: API.getProfiles({uids: API.getVariable({key: 1280}), fields: "photo"})[0]';
    code += '};';
    VK.Api.call('execute', {'code': code}, onGetInitData);
}
// данные получены
function onGetInitData(data) {
    var r;
    if (data.response) {
        r = data.response;
        if (r.me) {
//            ge('openapi_user').innerHTML = r.me.first_name + ' ' + r.me.last_name;
            ge('openapi_userlink').href = '/id' + r.me.uid;
            ge('openapi_userphoto').src = r.me.photo;
        }
    }
}

// авторизуемся
function loginOpenAPI(){
    doLogin();
    // и вызываем функцию getInitData()
    getInitData();
    toggleHelp();
    return false;
}

function getAudio(){

    var query = VKSAMPLER.searchForm.value;
    var count = parseInt(VKSAMPLER.searchCount.value);
    VK.Api.call('audio.search', { q: query, count: count}, function(res){
        VKSAMPLER.track_list.innerHTML = '';
        VKSAMPLER.tracks = res.response.slice(1);
        VKSAMPLER.tracks.forEach(function(track){

            var title = document.createElement('div');
            title.className = 'track';
            title.innerHTML = track.artist + ' - ' + track.title;
            title.onclick = function(){

                VKSAMPLER.loadTrack(track);

            };
            VKSAMPLER.track_list.appendChild(title);
        });
        console.dir(VKSAMPLER.tracks);

    });
    return false;
}

VKSAMPLER.loadTrack = function(track){
    VKSAMPLER.customSamples = {};
    VKSAMPLER.player.src = track.url;
    VKSAMPLER.player.load();
    VKSAMPLER.player.onloadeddata = function(){
        var duration = VKSAMPLER.player.duration;
        var timeDivider = duration/26;
        if(VKSAMPLER.sampler.startOnNext.checked){
            VKSAMPLER.player.play();
        }
        else {
            VKSAMPLER.player.currentTime = duration-1;
            VKSAMPLER.player.play();
            VKSAMPLER.player.pause();
            VKSAMPLER.player.currentTime = 1;
        }

        VKSAMPLER.player.loop = true;
        document.onkeydown = function(e){
            if(64 < e.keyCode && e.keyCode < 91 && VKSAMPLER.isPressed.key != e.keyCode){
                if(VKSAMPLER.stopPlay) VKSAMPLER.player.pause();
                var sampleStartTime = parseInt((e.keyCode - 65)*timeDivider);
                sampleStartTime < 0 ? VKSAMPLER.player.currentTime = 0 : VKSAMPLER.player.currentTime = sampleStartTime;
                VKSAMPLER.player.play();
                VKSAMPLER.isPressed.keys[e.keyCode] = true;
                VKSAMPLER.isPressed.key = e.keyCode;
            }
            if(e.keyCode == 32){
                e.preventDefault();
                VKSAMPLER.player.paused ? VKSAMPLER.player.play() : VKSAMPLER.player.pause();
            }
            if(e.keyCode > 47 && e.keyCode < 65 && VKSAMPLER.isPressed.key != e.keyCode){
                e.preventDefault();
                if(e.shiftKey){

                    VKSAMPLER.customSamples[e.keyCode] = VKSAMPLER.player.currentTime;

                }
                else if(VKSAMPLER.customSamples[e.keyCode]){
                    VKSAMPLER.isPressed.keys[e.keyCode] = true;
                    VKSAMPLER.isPressed.key = e.keyCode;
                    VKSAMPLER.player.currentTime = VKSAMPLER.customSamples[e.keyCode];
                    VKSAMPLER.player.play();

                }

            }

        };
        document.onkeyup = function(e){
            if(47 < e.keyCode && e.keyCode < 91 && VKSAMPLER.isPressed.key == e.keyCode){
                if(VKSAMPLER.stopPlay) VKSAMPLER.player.pause();
                VKSAMPLER.isPressed.keys[e.keyCode] = false;
                VKSAMPLER.isPressed.key = false;

            }

        };
    };


};

var help = document.getElementById('help');

function toggleHelp(){

    if(help.style.display == 'none'){ help.style.display = 'block' }
    else{help.style.display = 'none'}

}
