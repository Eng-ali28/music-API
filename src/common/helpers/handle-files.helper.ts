import { extname } from 'path';
export const checkFile = (req, file, callback) => {
  if (!file.mimetype.match(/^(png|jpeg|jpg|gif|mp3)$/)) {
    return callback(new Error(`Invalid file`));
  }
  return callback(null, true);
};
export const editFile = (req, file, callback) => {
  const name = file.originalName.split('.')[0];
  const extFile = extname(file.originalName);
  const randomName = `${Date.now()}${Math.round(
    Math.random() * 1000000,
  ).toString()}`;
  callback(null, `${name}${randomName}${extFile}`);
};
