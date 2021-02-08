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
  '[{"name":"common","status":"unchanged","currentValue":[{"name":"follow","status":"added","currentValue":false,"previewValue":"","type":"primitive"},{"name":"setting1","status":"unchanged","currentValue":"Value 1","previewValue":"","type":"primitive"},{"name":"setting2","status":"removed","currentValue":200,"previewValue":"","type":"primitive"},{"name":"setting3","status":"updated","currentValue":null,"previewValue":true,"type":"primitive"},{"name":"setting4","status":"added","currentValue":"blah blah","previewValue":"","type":"primitive"},{"name":"setting5","status":"added","currentValue":{"key5":"value5"},"previewValue":"","type":"object"},{"name":"setting6","status":"unchanged","currentValue":[{"name":"doge","status":"unchanged","currentValue":[{"name":"wow","status":"updated","currentValue":"so much","previewValue":"","type":"primitive"}],"previewValue":"","type":"array"},{"name":"key","status":"unchanged","currentValue":"value","previewValue":"","type":"primitive"},{"name":"ops","status":"added","currentValue":"vops","previewValue":"","type":"primitive"}],"previewValue":"","type":"array"}],"previewValue":"","type":"array"},{"name":"group1","status":"unchanged","currentValue":[{"name":"baz","status":"updated","currentValue":"bars","previewValue":"bas","type":"primitive"},{"name":"foo","status":"unchanged","currentValue":"bar","previewValue":"","type":"primitive"},{"name":"nest","status":"updated","currentValue":"str","previewValue":{"key":"value"},"type":"primitive"}],"previewValue":"","type":"array"},{"name":"group2","status":"removed","currentValue":{"abc":12345,"deep":{"id":45}},"previewValue":"","type":"object"},{"name":"group3","status":"added","currentValue":{"fee":100500,"deep":{"id":{"number":45}}},"previewValue":"","type":"object"}]'
);

describe('compare flat files (JSON)', () => {
  it('test 1', () => {
    expect.hasAssertions();

    const filepath1 = getFixturePath('file1.json');
    const filepath2 = getFixturePath('file2.json');

    expect(genDiff(filepath1, filepath2)).toStrictEqual(deepDiff);
  });
});

describe('compare flat files (YAML)', () => {
  it('test 1', () => {
    expect.hasAssertions();

    const filepath1 = getFixturePath('file1.yml');
    const filepath2 = getFixturePath('file2.yml');

    expect(genDiff(filepath1, filepath2)).toStrictEqual(deepDiff);
  });
});

describe('plain formatter', () => {
  it('json files', () => {
    expect.hasAssertions();

    const filepath1 = getFixturePath('file1.yml');
    const filepath2 = getFixturePath('file2.yml');

    expect(genDiff(filepath1, filepath2, 'plain')).toStrictEqual(plainDiff);
  });

  it('yml files', () => {
    expect.hasAssertions();

    const filepath1 = getFixturePath('file1.yml');
    const filepath2 = getFixturePath('file2.yml');

    expect(genDiff(filepath1, filepath2, 'plain')).toStrictEqual(plainDiff);
  });
});

describe('json formatter', () => {
  it('json files', () => {
    expect.hasAssertions();

    const filepath1 = getFixturePath('file1.yml');
    const filepath2 = getFixturePath('file2.yml');

    expect(genDiff(filepath1, filepath2, 'json')).toStrictEqual(jsonDiff);
  });

  it('yml files', () => {
    expect.hasAssertions();

    const filepath1 = getFixturePath('file1.yml');
    const filepath2 = getFixturePath('file2.yml');

    expect(genDiff(filepath1, filepath2, 'json')).toStrictEqual(jsonDiff);
  });
});
