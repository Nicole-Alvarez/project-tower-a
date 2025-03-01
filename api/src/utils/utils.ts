import { unlink } from "fs";

export function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  
export async function removeFileAfterDelay(file: string, delay: number) {
  await sleep(delay)
  unlink(file,(err) => {
    if (err) throw err;
    console.log('temp file was deleted');
  })
}