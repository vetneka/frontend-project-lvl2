import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

import genDiff from '../index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

const deepDiff = (
  `{
    common: {
      + follow: false
        setting1: Value 1
      - setting2: 200
      - setting3: true
      + setting3: null
      + setting4: blah blah
      + setting5: {
            key5: value5
        }
        setting6: {
            doge: {
              - wow: 
              + wow: so much
            }
            key: value
          + ops: vops
        }
    }
    group1: {
      - baz: bas
      + baz: bars
        foo: bar
      - nest: {
            key: value
        }
      + nest: str
    }
  - group2: {
        abc: 12345
        deep: {
            id: 45
        }
    }
  + group3: {
        fee: 100500
        deep: {
            id: {
                number: 45
            }
        }
    }
}`
);

const plainDiff = (
  `Property 'common.follow' was added with value: false
Property 'common.setting2' was removed
Property 'common.setting3' was updated. From true to null
Property 'common.setting4' was added with value: 'blah blah'
Property 'common.setting5' was added with value: [complex value]
Property 'common.setting6.doge.wow' was updated. From '' to 'so much'
Property 'common.setting6.ops' was added with value: 'vops'
Property 'group1.baz' was updated. From 'bas' to 'bars'
Property 'group1.nest' was updated. From [complex value] to 'str'
Property 'group2' was removed
Property 'group3' was added with value: [complex value]`
);

const jsonDiff = (
  '[{"key":"common","type":"nested","childrens":[{"key":"follow","type":"added","prevValue":false,"childrens":null},{"key":"setting1","type":"unchanged","prevValue":"Value 1","childrens":null},{"key":"setting2","type":"removed","prevValue":200,"childrens":null},{"key":"setting3","type":"changed","prevValue":true,"nextValue":null,"childrens":null},{"key":"setting4","type":"added","prevValue":"blah blah","childrens":null},{"key":"setting5","type":"added","prevValue":{"key5":"value5"},"childrens":null},{"key":"setting6","type":"nested","childrens":[{"key":"doge","type":"nested","childrens":[{"key":"wow","type":"changed","prevValue":"","nextValue":"so much","childrens":null}]},{"key":"key","type":"unchanged","prevValue":"value","childrens":null},{"key":"ops","type":"added","prevValue":"vops","childrens":null}]}]},{"key":"group1","type":"nested","childrens":[{"key":"baz","type":"changed","prevValue":"bas","nextValue":"bars","childrens":null},{"key":"foo","type":"unchanged","prevValue":"bar","childrens":null},{"key":"nest","type":"changed","prevValue":{"key":"value"},"nextValue":"str","childrens":null}]},{"key":"group2","type":"removed","prevValue":{"abc":12345,"deep":{"id":45}},"childrens":null},{"key":"group3","type":"added","prevValue":{"fee":100500,"deep":{"id":{"number":45}}},"childrens":null}]'
);

describe('stylish formatter', () => {
  it('json files', () => {
    expect.hasAssertions();

    const filepath1 = getFixturePath('file1.json');
    const filepath2 = getFixturePath('file2.json');

    expect(genDiff(filepath1, filepath2, 'stylish')).toStrictEqual(deepDiff);
  });

  it('yml files', () => {
    expect.hasAssertions();

    const filepath1 = getFixturePath('file1.yml');
    const filepath2 = getFixturePath('file2.yml');

    expect(genDiff(filepath1, filepath2, 'stylish')).toStrictEqual(deepDiff);
  });

  it('json and yaml files', () => {
    expect.hasAssertions();

    const filepath1 = getFixturePath('file1.json');
    const filepath2 = getFixturePath('file2.yml');

    expect(genDiff(filepath1, filepath2, 'stylish')).toStrictEqual(deepDiff);
  });
});

describe('plain formatter', () => {
  it('json files', () => {
    expect.hasAssertions();

    const filepath1 = getFixturePath('file1.json');
    const filepath2 = getFixturePath('file2.json');

    expect(genDiff(filepath1, filepath2, 'plain')).toStrictEqual(plainDiff);
  });

  it('yml files', () => {
    expect.hasAssertions();

    const filepath1 = getFixturePath('file1.yml');
    const filepath2 = getFixturePath('file2.yml');

    expect(genDiff(filepath1, filepath2, 'plain')).toStrictEqual(plainDiff);
  });

  it('json and yaml files', () => {
    expect.hasAssertions();

    const filepath1 = getFixturePath('file1.json');
    const filepath2 = getFixturePath('file2.yml');

    expect(genDiff(filepath1, filepath2, 'plain')).toStrictEqual(plainDiff);
  });
});

describe('json formatter', () => {
  it('json files', () => {
    expect.hasAssertions();

    const filepath1 = getFixturePath('file1.json');
    const filepath2 = getFixturePath('file2.json');

    expect(genDiff(filepath1, filepath2, 'json')).toStrictEqual(jsonDiff);
  });

  it('yml files', () => {
    expect.hasAssertions();

    const filepath1 = getFixturePath('file1.yml');
    const filepath2 = getFixturePath('file2.yml');

    expect(genDiff(filepath1, filepath2, 'json')).toStrictEqual(jsonDiff);
  });

  it('json and yaml files', () => {
    expect.hasAssertions();

    const filepath1 = getFixturePath('file1.json');
    const filepath2 = getFixturePath('file2.yml');

    expect(genDiff(filepath1, filepath2, 'json')).toStrictEqual(jsonDiff);
  });
});
