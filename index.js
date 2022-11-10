const songs = document.querySelector('.songs');
const audio = document.querySelector('#audio');
const play = document.querySelector('#play-pause');
const progress = document.querySelector('#progress');

async function getToken() {
  try {
    const response = await fetch('https://blooming-reef-63913.herokuapp.com/api/token');
    const data = await response.json();
    getSongs(data.token);
  } catch (err) {
    console.error(err);
  }
}

async function getSongs(token) {
  const searchInputText = document.querySelector('#searchInput').value;
  const BASE_URL = 'https://api.spotify.com/v1/search';
  const QUERY = `?q=${searchInputText}`;
  const MISC = '&type=track&limit=30';
  const FULL_URL = BASE_URL + QUERY + MISC;
  const headers = {
    headers: {
      authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await fetch(FULL_URL, headers);
    const data = await response.json();
    displaySongs(data.tracks);
    console.log(data.tracks);
  } catch (err) {
    console.error(err);
  }
}

function displaySongs(tracks) {
  document.querySelectorAll('.song').forEach((song) => {
    song.remove();
  });

  tracks.items.forEach((track, index) => {
    createSong(track, index);
    console.log(track);
  });

  songs.classList.toggle('hide');
}

function getSongtitle(track) {
  const songTitleContainer = document.createElement('article');
  songTitleContainer.classList.add('song__title');
  const img = document.createElement('img');
  img.src = track.album.images[2].url;
  const songTitle = document.createElement('p');
  songTitle.innerText = track.name;

  songTitleContainer.append(img);
  songTitleContainer.append(songTitle);

  return songTitleContainer;
}

function getArtists(track) {
  const artist = document.createElement('p');
  let artistNames = '';

  track.artists.forEach((artist, index) => {
    const nextIndex = index + 1;
    artistNames = artistNames + artist.name;
    if (track.artists[nextIndex] !== undefined) {
      artistNames += ', ';
    }
  });

  artist.innerText = artistNames;

  return artist;
}

function createDuration(track) {
  const duration = document.createElement('p');
  const minutes = Math.floor(track.duration_ms / 1000 / 60);
  let seconds = String(Math.floor(track.duration_ms / 1000) % 60);
  if (seconds.length === 1) {
    seconds = '0' + seconds;
  }
  duration.innerText = minutes + ':' + seconds;

  return duration;
}

function playSong(track, artists) {
  console.log(track);
  songs.classList.toggle('hide');
  const SONG_URL = track.preview_url;

  document.querySelector('#song-title').innerText = track.name;
  console.log(artists);
  document.querySelector('#artist-name').innerText = artists.innerText;

  audio.setAttribute('src', SONG_URL);
  play.setAttribute('src', './images/pause.svg');
  audio.onloadedmetadata = function () {
    const duration = audio.duration;
    progress.setAttribute('max', duration);
    const minutes = Math.floor(duration / 60);
    let seconds = String(Math.floor(duration) % 60);
    if (seconds.length === 1) {
      seconds = '0' + seconds;
    }
    document.querySelector('#duration').innerText = minutes + ':' + seconds;
  };
  audio.play();
}

function createSong(track, index) {
  const songsBottom = document.querySelector('.songs__bottom');
  const article = document.createElement('article');
  article.classList.add('song', 'grid');

  const number = document.createElement('p');
  number.innerText = index + 1;

  const songTitleContainer = getSongtitle(track);

  const artists = getArtists(track);

  const album = document.createElement('p');
  const albumName = track.album.name;
  album.innerText = albumName;

  const dateAdded = document.createElement('p');
  dateAdded.innerText = track.album.release_date;

  const duration = createDuration(track);

  article.append(number);
  article.append(songTitleContainer);
  article.append(artists);
  article.append(album);
  article.append(dateAdded);
  article.append(duration);

  article.addEventListener('click', () => playSong(track, artists));

  songsBottom.append(article);
}

function updateTime(e) {
  const currentTime = audio.currentTime;
  progress.setAttribute('value', currentTime);
  const minutes = Math.floor(currentTime / 60);
  let seconds = String(Math.floor(currentTime) % 60);
  if (seconds.length === 1) {
    seconds = '0' + seconds;
  }
  document.querySelector('#currentTime').innerText = minutes + ':' + seconds;
}

document.querySelector('#search__button').addEventListener('click', getToken);

document.querySelector('.close').addEventListener('click', () => {
  document.querySelector('#searchInput').value = '';
  songs.classList.toggle('hide');
});

play.addEventListener('click', () => {
  if (play.getAttribute('src').includes('play')) {
    play.setAttribute('src', './images/pause.svg');
    audio.play();
  } else {
    play.setAttribute('src', './images/play.svg');
    audio.pause();
  }
});

audio.addEventListener('timeupdate', updateTime);
