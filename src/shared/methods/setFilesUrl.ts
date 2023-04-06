import appConfig from 'src/config/app.config';

export const setFilesUrl = (response: any, folderName: string) => {
  if (!response) return;
  if (response.data && Array.isArray(response.data)) {
    for (let element of response.data) {
      if (element.source) {
        element.source = `${appConfig().baseUrl}/${folderName}/${
          element.source
        }`;
      }
      if (element.tempImg) {
        element.tempImg = `${appConfig().baseUrl}/${folderName}/${
          element.tempImg
        }`;
      }
    }
  } else {
    if (response.source) {
      response.source = `${appConfig().baseUrl}/${folderName}/${
        response.source
      }`;
    }
    if (response.tempImg)
      response.tempImg = `${appConfig().baseUrl}/${folderName}/${
        response.tempImg
      }`;
  }
};
