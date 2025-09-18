'use strict';

import musicService from './musicservice.js';

const _service = new musicService('https://seido-webservice-307d89e1f16a.azurewebsites.net/api');

const _pageSize = 10;
let _pageNr = 0;
let _filter = '';

const container = document.querySelector('.TableContainer');
const matchCount = document.querySelector('#matchCount');
const searchInput = document.querySelector('#searchInput');
const btnSearch = document.querySelector('#btnSearch');
const btnPrev = document.querySelector('#btnPrev');
const btnNext = document.querySelector('#btnNext');
const detailView = document.querySelector('#detailView');
const groupName = document.querySelector('#groupName');
const groupGenre = document.querySelector('#groupGenre');
const groupYear = document.querySelector('#groupYear');
const artistList = document.querySelector('#artistList');
const albumList = document.querySelector('#albumList');
const btnCloseDetail = document.querySelector('#btnCloseDetail');
const mainView = document.querySelector('#mainView');

let _totalResults = 0;

btnSearch.addEventListener('click', () => {
  _filter = searchInput.value.trim();
  _pageNr = 0;
  drawTable();
});

btnPrev.addEventListener('click', () => {
  if (_pageNr > 0) {
    _pageNr--;
    drawTable();
  }
});

btnNext.addEventListener('click', () => {
  if ((_pageNr + 1) * _pageSize < _totalResults) {
    _pageNr++;
    drawTable();
  }
});

btnCloseDetail.addEventListener('click', () => {
  detailView.classList.add('d-none');
  mainView.classList.remove('d-none');
});

async function drawTable() {
  container.innerHTML = '';
  matchCount.innerText = '';

  try {
    const data = await _service.readMusicGroupsAsync(_pageNr, false, _filter, _pageSize);
    _totalResults = data.dbItemsCount ?? 0;
    const groups = Array.isArray(data.pageItems) ? data.pageItems : [];

    if (groups.length === 0) {
      container.innerHTML = '<tr><td colspan="4">No music groups found.</td></tr>';
      matchCount.innerText = 'Total: 0 results';
      return;
    }

    for (const group of groups) {
      const id = group.id ?? group.musicGroupId;
      const name = group.name ?? group.groupName ?? 'Unnamed group';
      const genre = group.strGenre ?? 'Unknown';
      const year = group.yearActive ?? group.establishedYear ?? 'Unknown';

      const row = document.createElement('tr');

      row.innerHTML = `
        <td>${name}</td>
        <td>${genre}</td>
        <td>${year}</td>
        <td><button class="btn btn-sm btn-outline-primary" data-id="${id}">Show Details</button></td>
      `;

      row.querySelector('button').addEventListener('click', () => showDetail(id));
      container.appendChild(row);
    }

    matchCount.innerText = `Total: ${_totalResults} results`;

  } catch (error) {
    container.innerHTML = `<tr><td colspan="4">Error fetching data: ${error.message}</td></tr>`;
    matchCount.innerText = '';
    console.error('drawTable error:', error);
  }
}

async function showDetail(id) {
  try {
    const group = await _service.readMusicGroupAsync(id, false);
    if (!group) return;

    groupName.innerText = group.name ?? group.groupName ?? 'No name';
    groupGenre.innerText = group.strGenre ?? group.genre ?? 'Unknown';
    groupYear.innerText = group.establishedYear ?? group.yearActive ?? 'Unknown';

    artistList.innerHTML = '';
    if (Array.isArray(group.artists) && group.artists.length > 0) {
      for (const artist of group.artists) {
        const firstName = artist.firstName ?? '';
        const lastName = artist.lastName ?? '';
        const artistName = (firstName + ' ' + lastName).trim() || 'Unnamed artist';
        const li = document.createElement('li');
        li.textContent = artistName;
        li.classList.add('list-group-item');
        artistList.appendChild(li);
      }
    } 
    else {
      artistList.innerHTML = '<li class="list-group-item">No members listed</li>';
    }

    albumList.innerHTML = '';
    if (Array.isArray(group.albums) && group.albums.length > 0) {
      for (const album of group.albums) {
        const albumName = album.name ?? 'Untitled album';
        const releaseYear = album.releaseYear ? ` (${album.releaseYear})` : '';
        const li = document.createElement('li');
        li.textContent = albumName + releaseYear;
        li.classList.add('list-group-item');
        albumList.appendChild(li);
      }
    } else {
      albumList.innerHTML = '<li class="list-group-item">No albums listed</li>';
    }

    mainView.classList.add('d-none');
    detailView.classList.remove('d-none');

  } catch (error) {
    alert('Could not fetch details: ' + error.message);
    console.error('showDetail error:', error);
  }
}

drawTable();
