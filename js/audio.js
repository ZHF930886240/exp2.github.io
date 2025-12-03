// --- 1. 核心数据 ---
var musicList = [
  {
    title: "晴天",
    author: "周杰伦",
    src: "./mp3/music0.mp3",
    img: "./img/record0.jpg",
    bg: "./img/bg0.png",
    mv: "./mp4/video0.mp4"
  },
  {
    title: "七里香",
    author: "周杰伦",
    src: "./mp3/music1.mp3",
    img: "./img/record1.jpg",
    bg: "./img/bg1.png",
    mv: "./mp4/video1.mp4"
  },
  {
    title: "稻香",
    author: "周杰伦",
    src: "./mp3/music2.mp3",
    img: "./img/record2.jpg",
    bg: "./img/bg2.png",
    mv: "./mp4/video2.mp4"
  },
  {
    title: "夜曲",
    author: "周杰伦",
    src: "./mp3/music3.mp3",
    img: "./img/record3.jpg",
    bg: "./img/bg3.png",
    mv: "./mp4/video3.mp4"
  }
];

// --- 2. 获取元素 ---
var audio = new Audio();
var body = document.getElementById('pageBody');
var playPauseBtn = document.getElementById('playPause');
var prevBtn = document.getElementById('before-music');
var nextBtn = document.getElementById('last-music');
var recordImg = document.querySelector('.record-img');
var titleDom = document.querySelector('.music-title');
var authorDom = document.querySelector('.author-name');
var progressContainer = document.querySelector('.progress');
var playedTimeDom = document.querySelector('.played-time');
var audioTimeDom = document.querySelector('.audio-time');
var volumeSlider = document.getElementById('volumn-togger');
var volumeIcon = document.getElementById('volumn');
var playModeBtn = document.getElementById('playMode');
var listBtn = document.getElementById('list');
var mvBtn = document.getElementById('MV');
var playlistContainer = document.querySelector('.playlist-container');
var playlistUl = document.getElementById('playlist-ul');
var videoModal = document.querySelector('.video-modal');
var videoPlayer = document.getElementById('mv-player');
var closeVideoBtn = document.querySelector('.close-video');

// 倍速相关元素
var speedDisplay = document.getElementById('speed-display');
var speedOptions = document.querySelectorAll('.speed-options div');

var progressFill = document.createElement('div');
progressFill.className = 'progress-fill';
progressContainer.appendChild(progressFill);

// --- 3. 状态变量 ---
var currentIndex = 0;
var isPlaying = false;
var isMuted = false;
var lastVolume = 0.7;

// 模式: 0=单曲(mode1), 1=列表(mode2), 2=随机(mode3)
var playMode = 1;
var modeImages = [
  "url('./img/mode1.png')",
  "url('./img/mode2.png')",
  "url('./img/mode3.png')"
];

// --- 4. 核心函数 ---

function loadMusic(index) {
  var song = musicList[index];
  audio.src = song.src;
  titleDom.innerText = song.title;
  authorDom.innerText = song.author;

  recordImg.style.backgroundImage = `url('${song.img}')`;
  body.style.backgroundImage = `url('${song.bg}')`;

  progressFill.style.width = "0%";
  playedTimeDom.innerText = "00:00";

  renderPlaylist();

  audio.addEventListener('loadedmetadata', function () {
    audioTimeDom.innerText = transTime(audio.duration);
  });
}

function playMusic() {
  audio.play().then(() => {
    isPlaying = true;
    playPauseBtn.style.backgroundImage = "url('./img/暂停.png')";
    recordImg.classList.add('rotate');
    recordImg.style.animationPlayState = 'running';
  }).catch(e => console.log("需交互", e));
}

function pauseMusic() {
  audio.pause();
  isPlaying = false;
  playPauseBtn.style.backgroundImage = "url('./img/继续播放.png')";
  recordImg.style.animationPlayState = 'paused';
}

function getNextIndex() {
  if (playMode === 2) {
    let newIndex = Math.floor(Math.random() * musicList.length);
    if (newIndex === currentIndex && musicList.length > 1) {
      newIndex = (currentIndex + 1) % musicList.length;
    }
    return newIndex;
  } else {
    return (currentIndex + 1) % musicList.length;
  }
}

function getPrevIndex() {
  if (playMode === 2) {
    return Math.floor(Math.random() * musicList.length);
  } else {
    return (currentIndex - 1 + musicList.length) % musicList.length;
  }
}

function nextMusic() {
  currentIndex = getNextIndex();
  loadMusic(currentIndex);
  if (isPlaying) playMusic(); else playMusic();
}

function prevMusic() {
  currentIndex = getPrevIndex();
  loadMusic(currentIndex);
  if (isPlaying) playMusic(); else playMusic();
}

audio.addEventListener('ended', function () {
  if (playMode === 0) { // 单曲
    audio.currentTime = 0;
    playMusic();
  } else { // 列表或随机 -> 下一首
    nextMusic();
  }
});

function renderPlaylist() {
  playlistUl.innerHTML = "";
  musicList.forEach((song, index) => {
    var li = document.createElement('li');
    li.innerText = `${index + 1}. ${song.title} - ${song.author}`;
    if (index === currentIndex) li.classList.add('active');
    li.onclick = function () {
      currentIndex = index;
      loadMusic(currentIndex);
      playMusic();
    };
    playlistUl.appendChild(li);
  });
}

function updateVolumeUI(val) {
  var percentage = val + '%';
  volumeSlider.style.background = `linear-gradient(to right, #2ecc71 0%, #2ecc71 ${percentage}, rgba(255,255,255,0.2) ${percentage}, rgba(255,255,255,0.2) 100%)`;
}

// --- 5. 事件绑定 ---

window.onload = function () {
  playModeBtn.style.backgroundImage = modeImages[playMode];
  let vol = volumeSlider.value;
  audio.volume = vol / 100;
  updateVolumeUI(vol);
  loadMusic(currentIndex);
};

playPauseBtn.onclick = () => isPlaying ? pauseMusic() : playMusic();
prevBtn.onclick = prevMusic;
nextBtn.onclick = nextMusic;

playModeBtn.onclick = () => {
  playMode = (playMode + 1) % 3;
  playModeBtn.style.backgroundImage = modeImages[playMode];
};

volumeIcon.onclick = () => {
  if (isMuted) {
    audio.volume = lastVolume;
    volumeSlider.value = lastVolume * 100;
    volumeIcon.style.backgroundImage = "url('./img/音量.png')";
    isMuted = false;
  } else {
    lastVolume = audio.volume > 0 ? audio.volume : 0.7;
    audio.volume = 0;
    volumeSlider.value = 0;
    volumeIcon.style.backgroundImage = "url('./img/静音.png')";
    isMuted = true;
  }
  updateVolumeUI(volumeSlider.value);
};

volumeSlider.oninput = function () {
  let val = this.value;
  audio.volume = val / 100;
  updateVolumeUI(val);
  if (val > 0 && isMuted) {
    isMuted = false;
    volumeIcon.style.backgroundImage = "url('./img/音量.png')";
  } else if (val == 0) {
    isMuted = true;
    volumeIcon.style.backgroundImage = "url('./img/静音.png')";
  }
};

audio.ontimeupdate = () => {
  if (audio.duration) {
    let percent = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width = percent + "%";
    playedTimeDom.innerText = transTime(audio.currentTime);
  }
};

progressContainer.onclick = (e) => {
  if (audio.duration) {
    audio.currentTime = (e.offsetX / progressContainer.clientWidth) * audio.duration;
  }
};

// ★★★ 播放列表：悬停显示逻辑 ★★★
let playlistTimeout;

// 鼠标移入图标 -> 显示列表
listBtn.addEventListener('mouseenter', () => {
  clearTimeout(playlistTimeout); // 清除隐藏倒计时
  playlistContainer.classList.remove('hidden');
});

// 鼠标离开图标 -> 准备隐藏（给300ms缓冲期）
listBtn.addEventListener('mouseleave', () => {
  playlistTimeout = setTimeout(() => {
    playlistContainer.classList.add('hidden');
  }, 300);
});

// 鼠标进入列表本身 -> 取消隐藏（保持显示）
playlistContainer.addEventListener('mouseenter', () => {
  clearTimeout(playlistTimeout);
});

// 鼠标离开列表本身 -> 隐藏
playlistContainer.addEventListener('mouseleave', () => {
  playlistContainer.classList.add('hidden');
});


// ★★★ 倍速功能：点击菜单项逻辑 ★★★
speedOptions.forEach(option => {
  option.addEventListener('click', function () {
    // 1. 获取点击的速度值
    let rate = this.getAttribute('data-speed');

    // 2. 设置音频倍速
    audio.playbackRate = rate;

    // 3. 更新按钮文字
    speedDisplay.innerText = rate + "X";

    // 4. 更新选中样式 (高亮)
    speedOptions.forEach(opt => opt.classList.remove('active'));
    this.classList.add('active');
  });
});


mvBtn.onclick = () => {
  pauseMusic();
  let song = musicList[currentIndex];
  videoPlayer.src = song.mv;
  videoModal.classList.remove('hidden');
  videoPlayer.play();
};

closeVideoBtn.onclick = () => {
  videoPlayer.pause();
  videoModal.classList.add('hidden');
};

function transTime(value) {
  var h = parseInt(value / 3600);
  value %= 3600;
  var m = parseInt(value / 60);
  var s = parseInt(value % 60);
  return (h > 0 ? formatTime(h + ':' + m + ':' + s) : formatTime(m + ':' + s));
}

function formatTime(value) {
  var s = value.split(':');
  var time = '';
  for (var i = 0; i < s.length; i++) {
    time += (s[i].length == 1 ? '0' + s[i] : s[i]) + (i == s.length - 1 ? '' : ':');
  }
  return time;
}