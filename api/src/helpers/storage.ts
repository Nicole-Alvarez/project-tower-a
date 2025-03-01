import { HonoDiskStorage } from "@hono-storage/node-disk";

export const storage = new HonoDiskStorage({
  dest: "./uploads",
  filename: (_: any, file: any) => `${file.name}`,
});
