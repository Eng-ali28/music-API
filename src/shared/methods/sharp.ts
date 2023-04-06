import * as sharp from 'sharp';
export const sharpPlace = async (
  buffer: Buffer,
  sizeX: number,
  sizeY: number,
  quality: number,
  path: string,
): Promise<void> => {
  await sharp(buffer)
    .resize(sizeX, sizeY)
    .webp({ quality })
    .toFile(`./uploads/images/${path}`);
};
