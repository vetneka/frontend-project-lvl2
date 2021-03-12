import fs from 'fs';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

import genDiff from '../index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

const readFile = (filename) => {
  const absolutePath = getFixturePath(filename);
  return fs.readFileSync(absolutePath).toString();
};

const jsonFilePath1 = getFixturePath('file1.json');
const jsonFilePath2 = getFixturePath('file2.json');

const yamlFilePath1 = getFixturePath('file1.yml');
const yamlFilePath2 = getFixturePath('file2.yml');

const formatters = ['stylish', 'plain', 'json'];

const testFormatter = (type) => {
  describe(`${type} formatter`, () => {
    const diff = readFile(`${type}Diff.txt`);

    it('json files', () => {
      expect.hasAssertions();
      expect(genDiff(jsonFilePath1, jsonFilePath2, `${type}`)).toStrictEqual(diff);
    });

    it('yml files', () => {
      expect.hasAssertions();
      expect(genDiff(yamlFilePath1, yamlFilePath2, `${type}`)).toStrictEqual(diff);
    });

    it('json and yaml files', () => {
      expect.hasAssertions();
      expect(genDiff(jsonFilePath1, yamlFilePath2, `${type}`)).toStrictEqual(diff);
    });
  });
};

formatters.forEach(testFormatter);
