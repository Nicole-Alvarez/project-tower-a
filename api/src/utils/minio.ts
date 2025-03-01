import * as Minio from "minio";
import { removeFileAfterDelay, sleep } from "./utils";
import path from "path";

const minioClient = new Minio.Client({
  endPoint: "minioapi.tundra.dxform.ph",
  port: 443,
  useSSL: true,
  accessKey: "2zqguFx5wanjjCaDBM9h",
  secretKey: "v3az1L1bwgot20lgKD7CSptRImaEgngTkUHuA0fD",
});

export const bucket = "lms";

export default minioClient;

export const getSignedUrl = async (filePrefix: string) => {
  return await minioClient.presignedGetObject(bucket, filePrefix, 60 * 60);
};

export const uploadImage = async (file: string, destination: string) => {
  await sleep(1500);
  await minioClient.fPutObject(
    bucket,
    `images/${destination}`,
    file
  );
  const filePaths = destination.split("/");
  const originalFileName = filePaths[filePaths.length - 1];
  removeFileAfterDelay(file, 1000)
  const signedUrl = await getSignedUrl(`images/${destination}`);
  return { signedUrl, originalFileName };
};

export const uploadVideo = async (file: string, destination: string) => {
  const upload = await minioClient.fPutObject(
    bucket,
    `video/${destination}`,
    file
  );
  const filePaths = destination.split("/");
  const originalFileName = filePaths[filePaths.length - 1];
  removeFileAfterDelay(file, 1000)
  const signedUrl = await getSignedUrl(`video/${destination}`);
  return { upload, signedUrl, originalFileName };
};

export const removeObject = async (destination: string) => {
  return await minioClient.removeObject(bucket, destination)
}

export const uploadUserImage = async (file: File) => {
  await sleep(1500);
  const filePath = path.join(__dirname, `../../uploads/${file.name}`);
  const objectName = `images/${Date.now()} - ${Math.round(Math.random() * 1E9)} - ${file.name}`;
  await minioClient.fPutObject(
    bucket,
    objectName,
    filePath
  );
  removeFileAfterDelay(filePath, 1000)
  const signedUrl = await getSignedUrl(objectName);
  return { signedUrl, objectName };
};

