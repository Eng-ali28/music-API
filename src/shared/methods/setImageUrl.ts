import appConfig from 'src/config/app.config';

export const setImageUrl = (response: any, folderName: string) => {
  if (!response) return;
  if (response.data && Array.isArray(response.data)) {
    for (let element of response.data) {
      if (element.image) {
        element.image = `${appConfig().baseUrl}/${folderName}/${element.image}`;
      }
      if (element.singer && element.singer.image) {
        element.singer.image = `${appConfig().baseUrl}/${folderName}/${
          element.singer.image
        }`;
      }
    }
  } else {
    if (response.image) {
      response.image = `${appConfig().baseUrl}/${folderName}/${response.image}`;
    }
    if (response.singer && response.singer.image) {
      response.singer.image = `${appConfig().baseUrl}/${folderName}/${
        response.singer.image
      }`;
    }
  }
};
