import { Request } from 'express';
import { parse } from 'path';
import { generateRandomNumber } from 'src/shared/methods/generate-random';
export default () => {
  return {
    baseUrl: process.env.BASEURL,
    port: process.env.PORT,
    jwtSecret: process.env.JWT_SECRET,
    defaultStrategy: process.env.DEFAULT_STRATEGY,
    expirationToken: process.env.EXPIRE_TOKEN,
    destAudio: (req: Request, file: Express.Multer.File, cb) => {
      cb(null, `${process.cwd()}/uploads/audio/song`);
    },
    fileNameAudio: (req: Request, file: Express.Multer.File, cb) => {
      const ext = file.mimetype.split('/')[1];
      const nameOnly = parse(file.originalname).name;
      const filename = `audio-${generateRandomNumber(
        1000,
        999999,
      )}-${new Date().getTime()}-${nameOnly}.${ext}`;
      req.body.source = filename;
      cb(null, filename);
    },
    mailUser: process.env.MAIL_USER,
    mailPassword: process.env.MAIL_PASSWORD,
    mailHost: process.env.MAIL_HOST,
    frontendAndKeys: {
      host: process.env.URL_HOST,
      endPoints: ['auth/resest-password', 'auth/verify-email'],
    },
  };
};
