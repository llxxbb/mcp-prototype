import { Result, ok, err } from "neverthrow";
import { promises as fs } from "fs";
import path from "path";

export const checkDirectory = async (
  dirPath: string,
): Promise<Result<boolean, Error>> => {
  try {
    await fs.access(path.resolve(dirPath));
    return ok(true);
  } catch (e) {
    return e instanceof Error ? err(e) : err(new Error(String(e)));
  }
};

export const ensureDirectory = async (
  dirPath: string,
): Promise<Result<void, Error>> => {
  try {
    await fs.mkdir(path.resolve(dirPath), { recursive: true });
    return ok(undefined);
  } catch (e) {
    return e instanceof Error ? err(e) : err(new Error(String(e)));
  }
};
