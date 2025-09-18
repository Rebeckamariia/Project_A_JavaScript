'use strict';
 
//WebApi service broken out in a class to give CRUD musicGroup, Album and Artist
function musicService (url) {
 
    //constructor
    this.url = url;
 
    //#region generic CRUD methods, in function cannot ber private
    this._myFetch = async function (url, method = null, body = null) {
      try {
   
        method ??= 'GET';
        let res = await fetch(url, {
          method: method,
          headers: { 'content-type': 'application/json' },
          body: body ? JSON.stringify(body) : null
        });
   
        if (res.ok) {
   
          console.log(`\n${method} Request successful @ ${url}`);
   
          //get the data from server
          let data = await res.json();
          return data;
        }
        else {
   
          //typcially you would log an error instead
          console.log(`Failed to recieved data from server: ${res.status}`);
          alert(`Failed to recieved data from server: ${res.status}`);
        }
      }
      catch (err) {
   
        //typcially you would log an error instead
        console.log(`Failed to recieved data from server: ${err.message}`);
        alert(`Failed to recieved data from server: ${err.message}`);
      }
    }
 
    this._readItemsAsync = async function (reqUrl, pageNr, flat, filter, pageSize)
    {
      reqUrl += `?flat=${flat}&pageNr=${pageNr}&pageSize=${pageSize}`;
      if (filter != null)
      {
        reqUrl += `&filter=${filter}`
      }
      let data = await this._myFetch(reqUrl);
      return data;
    }
   
    this._readItemAsync = async function (reqUrl, id, flat)
    {
      reqUrl += `?flat=${flat}&id=${id}`;
      let data = await this._myFetch(reqUrl);
      return data;
    }
 
    this._readItemDtoAsync = async function (reqUrl, id, flat)
    {
      reqUrl += `?id=${id}`;
      let data = await this._myFetch(reqUrl);
      return data;
    }
 
    this._updateItemAsync = async function (reqUrl, id, newItem)
    {
      reqUrl += `/${id}`;
      let data = await this._myFetch(reqUrl, 'PUT', newItem);
      return data;
    }
 
    this._createItemAsync = async function (reqUrl, newItem)
    {
      let data = await this._myFetch(reqUrl, 'POST', newItem);
      return data;
    }
 
    this._deleteItemAsync = async function (reqUrl, id)
    {
      reqUrl += `/${id}`;
      let data = await this._myFetch(reqUrl, 'DELETE');
      return data;
    }
 
    this._upsertItemAsync = async function (reqUrl, newItem)
    {
      let data = await this._myFetch(reqUrl, 'POST', newItem);
      return data;
    }
    //#endregion
 
    this.readInfoAsync = async function readInfoAsync()
    {
      return await this._myFetch(`${this.url}/Guest/Info`);
    }
 
    //#region CRUD MusicGroup
    //using traditional function syntax (like in C#)
    this.readMusicGroupsAsync = async function (pageNr, flat=false, filter=null, pageSize=10)
    {
      return await this._readItemsAsync(`${this.url}/MusicGroup/Read`, pageNr, flat, filter, pageSize);
    }
   
    //using JavaScrip's ability to asign a function to a variable or property (like c# delegate)
    this.readMusicGroupAsync = async (id, flat=true) => this._readItemAsync(`${this.url}/MusicGroup/ReadItem`, id, flat);
   
    this.readMusicGroupDtoAsync = async (id) => this._readItemDtoAsync(`${this.url}/MusicGroup/ReadItemDto`, id);
   
    this.updateMusicGroupAsync = async (id, newItem) => this._updateItemAsync(`${this.url}/MusicGroup/UpdateItem`, id, newItem);
 
    this.createMusicGroupAsync = async (newItem) => this._createItemAsync(`${this.url}/MusicGroup/CreateItem`, newItem);
 
    this.deleteMusicGroupAsync = async (id) => this._deleteItemAsync(`${this.url}/MusicGroup/DeleteItem`, id);
    //#endregion
 
    //#region CRUD Album
    this.readAlbumsAsync = async (pageNr, flat=false, filter=null, pageSize=10) => this._readItemsAsync(`${this.url}/Album/Read`, pageNr, flat, filter, pageSize);
   
    this.readAlbumAsync  = async (id, flat=true) => this._readItemAsync(`${this.url}/Album/ReadItem`, id, flat);
 
    this.readAlbumDtoAsync = async (id) => this._readItemDtoAsync(`${this.url}/Album/ReadItemDto`, id);
 
    this.updateAlbumAsync = async (id, newItem) => this._updateItemAsync(`${this.url}/Album/UpdateItem`, id, newItem);
 
    this.createAlbumAsync = async (newItem) => this._createItemAsync(`${this.url}/Album/CreateItem`, newItem);
 
    this.deleteAlbumAsync = async (id) => this._deleteItemAsync(`${this.url}/Album/DeleteItem`, id);
    //#endregion
   
    //#region CRUD Artist
    this.readArtistsAsync = async (pageNr, flat=false, filter=null, pageSize=10) => this._readItemsAsync(`${this.url}/Artist/Read`, pageNr, flat, filter, pageSize);
   
    this.readArtistAsync = async (id, flat=true) => this._readItemAsync(`${this.url}/Artist/ReadItem`, id, flat);
 
    this.readArtistDtoAsync = async (id, flat=true) => this._readItemDtoAsync(`${this.url}/Artist/ReadItemDto`, id);
   
    this.updateArtistAsync = async (id, newItem) => this._updateItemAsync(`${this.url}/Artist/UpdateItem`, id, newItem);
 
    this.upsertArtistAsync = async (newItem) => this._upsertItemAsync(`${this.url}/Artist/UpsertItem`, newItem);
 
    this.deleteArtistAsync = async (id) => this._deleteItemAsync(`${this.url}/Artist/DeleteItem`, id);
    //#endregion
}
 
export default musicService;