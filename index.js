async function getToken() {
  const response = await fetch('https://blooming-reef-63913.herokuapp.com/api/token');
  const data = await response.json();
  getSongs(data.token);
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

  const response = await fetch(FULL_URL, headers);
  const data = await response.json();

  console.log(data.tracks);
  displaySongs(data.tracks);
}

function displaySongs(tracks) {
  document.querySelectorAll('song').forEach((song) => {
    song.remove();
  });

  tracks.items.forEach((track, index) => {
    createSong(track, index);
    console.log(track);
  });
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

function createSong(track, index) {
  const songs = document.querySelector('.songs');
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

  const duration = document.createElement('p');
  const minutes = Math.floor((track.duration_ms/1000)/60);
  let seconds = String(Math.floor(track.duration_ms/1000)%60)
  console.log(seconds.length)
  if (seconds.length === 1) {
    seconds = '0' + seconds;
  }
  duration.innerText = minutes + ':' + seconds;

  article.append(number);
  article.append(songTitleContainer);
  songs.append(article);
  article.append(artists);
  article.append(album);
  article.append(dateAdded);
  article.append(duration);

}

document.querySelector('#search__button').addEventListener('click', getToken);
