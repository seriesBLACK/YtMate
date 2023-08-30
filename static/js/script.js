const videoEl = document.querySelector('.video');
const audioEl = document.querySelector('.audio');
const selectEl = document.querySelector('.select');
const dispalyEl = document.querySelector('.dispaly');
const urlInputEl = document.getElementById("urlInput");
const progressEl = document.getElementById("progress");
const progressBarEl = document.getElementById("progressBar");
let intervalId;

audioType = () => {
  videoEl.classList.remove('selected')
  audioEl.classList.add('selected')
  dispalyEl.value = 'audio';
};

videoType = () => {
  selectEl.classList.remove('dispaly')
  audioEl.classList.remove('selected')
  videoEl.classList.add('selected')
  dispalyEl.value = 'video'; //to choose the type of data to download
};

//start the interval when the downlaod button is clicked
function startInterval() {
  if (urlInputEl.value == "") return
  progressEl.innerText = "Initializing ...";

  intervalId = setInterval(updateProgress, 1500)

};

function convert_bytes_to_readable(speed_bytes) {
  if (speed_bytes < 1024) {
    return `downloading speed ${speed_bytes.toFixed(2)} B/s`
  } else if (speed_bytes < 1024 * 1024) {
    return `speed: ${Math.round(speed_bytes / 1024)} K/s`
  } else { return `speed: ${Math.round(speed_bytes / (1024 * 1024))} MB/s` }
};

//fetch the downloading data from the back-end
function updateProgress() {
  fetch('/progress')
    .then(response => response.json())
    .then(data => {
      const readAbleSpeed = convert_bytes_to_readable(data.progress[1]);
      progressEl.innerText = readAbleSpeed;
      progressBarEl.value = data.progress[0];
      if (data.progress == "download is done") {
        console.log("done")
        progressEl.innerText = "downloaded";

        clearInterval(intervalId)//stop the interval when download in over
      }
    })

    .catch(error => {
      console.error('Error fetching progress:', error);
    });
}


