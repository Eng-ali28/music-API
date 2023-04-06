import appConfig from 'src/config/app.config';

export const albumFileUrl = (response: any, folderName: string) => {
  if (!response) return;
  if (response.data && Array.isArray(response.data)) {
    for (let element of response.data) {
      if (element.image) {
        element.image = `${appConfig().baseUrl}/${folderName}/${element.image}`;
      }
      if (element.singer && element.singer.image) {
        element.singer.image = `${appConfig().baseUrl}/singer/${
          element.singer.image
        }`;
      }
      if (element.song && element.song.length !== 0) {
        for (let song of element.song) {
          if (song.tempImg) {
            song.tempImg = `${appConfig().baseUrl}/song/${song.tempImg}`;
          }
          if (song.source) {
            song.source = `${appConfig().baseUrl}/song/${song.source}`;
          }
        }
      }
    }
  } else if (response.image) {
    response.image = `${appConfig().baseUrl}/${folderName}/${response.image}`;

    if (response.singer && response.singer.image) {
      response.singer.image = `${appConfig().baseUrl}/singer/${
        response.singer.image
      }`;
    }
  } else {
    if (response.data.image) {
      response.data.image = `${appConfig().baseUrl}/${folderName}/${
        response.data.image
      }`;
    }
    if (response.data.singer && response.data.singer.image) {
      response.data.singer.image = `${appConfig().baseUrl}/singer/${
        response.data.singer.image
      }`;
    }
    if (response.data.song && response.data.song.length !== 0) {
      for (let song of response.data.song) {
        if (song.tempImg) {
          song.tempImg = `${appConfig().baseUrl}/song/${song.tempImg}`;
        }
        if (song.source) {
          song.source = `${appConfig().baseUrl}/song/${song.source}`;
        }
      }
    }
  }
};
