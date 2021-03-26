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

const supportedExtensions = ['json', 'yml'];
const supportedFormats = ['stylish', 'plain', 'json'];

const getCombinations = (formats, extensions) => {
  const extensionCombinations = extensions
    .flatMap((extension1) => extensions.map((extension2) => [extension1, extension2]));

  return extensionCombinations
    .flatMap((extensionCombo) => formats.map((format) => [...extensionCombo, format]));
};

const combinations = getCombinations(supportedFormats, supportedExtensions);

const expectedDiffs = {};

beforeAll(() => {
  supportedFormats.forEach((format) => {
    expectedDiffs[format] = readFile(`${format}Diff.txt`);
  });
});

test('json-formatter output is valid json', () => {
  const jsonDiff = genDiff(jsonFilePath1, jsonFilePath2, 'json');
  const parseJSON = () => JSON.parse(jsonDiff);

  expect(parseJSON).not.toThrow();
});

test('check genDiff with default formatter', () => {
  const stylishDiff = genDiff(jsonFilePath1, jsonFilePath2);

  expect(expectedDiffs.stylish).toStrictEqual(stylishDiff);
});

test.each(combinations)(
  'diff (.%s .%s)-files formatted as %s',
  (extension1, extension2, format) => {
    const filePath1 = getFixturePath(`file1.${extension1}`);
    const filePath2 = getFixturePath(`file2.${extension2}`);

    const receivedDiff = genDiff(filePath1, filePath2, format);
    const expectedDiff = expectedDiffs[format];

    expect(receivedDiff).toStrictEqual(expectedDiff);
  },
);
