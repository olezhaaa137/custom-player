//get elements

const player = document.querySelector('.player');
const video = player.querySelector('.viewer');

const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');

const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');

const fullScreen = player.querySelector('.fullscreen');

//build up our functions

function togglePlay() {
  video.paused ? video.play() : video.pause();
}

function updateButton() {
  const icon = this.paused ? '►' : '❚❚';
  toggle.textContent = icon;
}

function skip() {
  console.log(this.dataset.skip);
  video.currentTime += parseFloat(this.dataset.skip);
}

function handleRangeUpdate() {
  video[this.name] = this.value;
  console.log(this.value);
}

function updateProgress() {
  const percent = (video.currentTime / video.duration) * 100;
  progressBar.style.flexBasis = `${percent}%`;
}

function scrub(e) {
  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
  video.currentTime = scrubTime;
}

function changeToFullScreen() {
  if (video.requestFullscreen) {
    video.requestFullscreen().catch((err) => console.error(err));
  } else if (video.webkitEnterFullscreen) {
    video.webkitEnterFullscreen();
  }
}

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    player.requestFullscreen().catch((err) => console.error(err));
  } else {
    document.exitFullscreen().catch((err) => console.error(err));
  }
}

function toggleSound() {
  video.volume = video.volume == 0 ? 1 : 0;
  const volumeInput = player.querySelector('input[name="volume"]');
  if (volumeInput) {
    volumeInput.value = video.volume;
  }
}

function increasePlaybackRate() {
  const inputPlaybackRateElement = player.querySelector(
    'input[name="playbackRate"]',
  );
  if (inputPlaybackRateElement) {
    const currentRate = inputPlaybackRateElement.value;
    const maxRate = inputPlaybackRateElement.max;
    if (currentRate < maxRate) {
      inputPlaybackRateElement.value = +currentRate + 0.1;
      video.playbackRate = inputPlaybackRateElement.value;
    }
  }
}

function decreasePlaybackRate() {
  const inputPlaybackRateElement = player.querySelector(
    'input[name="playbackRate"]',
  );
  if (inputPlaybackRateElement) {
    const currentRate = inputPlaybackRateElement.value;
    const minRate = inputPlaybackRateElement.min;
    if (currentRate > minRate) {
      inputPlaybackRateElement.value = +currentRate - 0.1;
      video.playbackRate = inputPlaybackRateElement.value;
    }
  }
}
//hook up the event listeners

player.addEventListener('keydown', (e) => {
  if (e.keyCode == '32') {
    togglePlay();
  }
  if (e.keyCode == '77') {
    toggleSound();
  }
  if (e.keyCode == '70') {
    toggleFullScreen();
  }
  if (e.keyCode == '190') {
    increasePlaybackRate();
  }
  if (e.keyCode == '188') {
    decreasePlaybackRate();
  }
});

video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', updateProgress);

toggle.addEventListener('click', togglePlay);

skipButtons.forEach((button) => button.addEventListener('click', skip));

ranges.forEach((range) => range.addEventListener('change', handleRangeUpdate));
ranges.forEach((range) =>
  range.addEventListener('mousemove', handleRangeUpdate),
);

progress.addEventListener('click', scrub);

let mousedown = false;
progress.addEventListener('mousemove', (e) => mousedown && scrub(e));
progress.addEventListener('mousedown', () => (mousedown = true));
progress.addEventListener('mouseup', () => (mousedown = false));

fullScreen.addEventListener('click', changeToFullScreen);
