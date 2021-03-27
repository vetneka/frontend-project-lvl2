import fs from 'fs';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const createPath = (pathnames) => path.resolve(__dirname, '..', '..', ...pathnames);

export const getFileExtension = (filepath) => path.extname(filepath).slice(1);

export const readFile = (filepath) => {
  const absolutePath = createPath([filepath]);
  const data = fs.readFileSync(absolutePath).toString();
  return data;
};
