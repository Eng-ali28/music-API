import appConfig from 'src/config/app.config';

export const albumMusicianFileUrl = (response: any, folderName: string) => {
  if (!response) return;
  if (response.data && Array.isArray(response.data)) {
    for (let element of response.data) {
      if (element.image) {
        element.image = `${appConfig().baseUrl}/${folderName}/${element.image}`;
      }
      if (element.musician && element.musician.image) {
        element.musician.image = `${appConfig().baseUrl}/musician/${
          element.musician.image
        }`;
      }
      if (element.music && element.music.length !== 0) {
        for (let music of element.music) {
          if (music.tempImg) {
            music.tempImg = `${appConfig().baseUrl}/music/${music.tempImg}`;
          }
          if (music.source) {
            music.source = `${appConfig().baseUrl}/music/${music.source}`;
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
    if (response.data.musician && response.data.musician.image) {
      response.data.musician.image = `${appConfig().baseUrl}/musician/${
        response.data.musician.image
      }`;
    }
    if (response.data.music && response.data.music.length !== 0) {
      for (let music of response.data.music) {
        if (music.tempImg) {
          music.tempImg = `${appConfig().baseUrl}/music/${music.tempImg}`;
        }
        if (music.source) {
          music.source = `${appConfig().baseUrl}/music/${music.source}`;
        }
      }
    }
  }
};
