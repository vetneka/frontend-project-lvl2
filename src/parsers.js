import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const parseJSON = (data) => JSON.parse(data);

const parseYAML = (data) => yaml.load(data);

const readFile = (filepath) => {
  const absolutePath = path.resolve(process.cwd(), filepath);
  const data = fs.readFileSync(absolutePath).toString();
  return data;
};

const getFileExtension = (filepath) => path.extname(filepath).slice(1);

const parseFile = (filePath) => {
  const fileExtension = getFileExtension(filePath);
  const dataFromFile = readFile(filePath);

  switch (fileExtension) {
    case 'json':
      return parseJSON(dataFromFile);

    case 'yml':
      return parseYAML(dataFromFile);

    default:
      throw new Error(`No parser for file with .${fileExtension} extension.`);
  }
};

export default parseFile;
