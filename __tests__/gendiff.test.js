import { readFile, createPath } from '../src/utils/file.js';
import genDiff from '../index.js';

const getFixturePath = (filepath) => createPath(['__fixtures__', filepath]);

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

const expectedDiffs = new Map();

beforeAll(() => {
  supportedFormats.forEach((format) => {
    expectedDiffs.set(format, readFile(getFixturePath(`${format}Diff.txt`)));
  });
});

test('json-formatter output is valid json', () => {
  const jsonDiff = genDiff(jsonFilePath1, jsonFilePath2, 'json');
  const parseJSON = () => JSON.parse(jsonDiff);

  expect(parseJSON).not.toThrow();
});

test('check genDiff with default formatter', () => {
  const stylishDiff = genDiff(jsonFilePath1, jsonFilePath2);

  expect(expectedDiffs.get('stylish')).toStrictEqual(stylishDiff);
});

test.each(combinations)(
  'diff (.%s .%s)-files formatted as %s',
  (extension1, extension2, format) => {
    const filePath1 = getFixturePath(`file1.${extension1}`);
    const filePath2 = getFixturePath(`file2.${extension2}`);

    const receivedDiff = genDiff(filePath1, filePath2, format);
    const expectedDiff = expectedDiffs.get(format);

    expect(receivedDiff).toStrictEqual(expectedDiff);
  },
);
