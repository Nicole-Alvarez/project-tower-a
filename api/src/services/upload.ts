import { uploadImage, uploadVideo } from "../utils/minio";

export const uploadSingleImage = async (file: File, path = "") => {
  const filePath = `./uploads/${file?.name}`;
  const epoch = Date.now();
  const newFileName = `${path}/${epoch}-${file?.name}`;
  return await uploadImage(filePath, newFileName);
};

export const uploadSingleVideo = async (file: File, path = "") => {
  const filePath = `./uploads/${file?.name}`;
  const epoch = Date.now();
  const newFileName = `${path}/${epoch}-${file?.name}`;
  return await uploadVideo(filePath, newFileName);
};
