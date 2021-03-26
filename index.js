import { readFile, getFileExtension } from './src/utils/file.js';
import parseFile from './src/parsers.js';
import format from './src/formatters/index.js';
import createDiffTree from './src/createDiffTree.js';

const genDiff = (filepath1, filepath2, formatName = 'stylish') => {
  const fileExtension1 = getFileExtension(filepath1);
  const fileExtension2 = getFileExtension(filepath2);

  const fileContent1 = readFile(filepath1);
  const fileContent2 = readFile(filepath2);

  const obj1 = parseFile(fileContent1, fileExtension1);
  const obj2 = parseFile(fileContent2, fileExtension2);

  const diff = createDiffTree(obj1, obj2);

  const formattedDiff = format(diff, formatName);

  return formattedDiff;
};

export default genDiff;
