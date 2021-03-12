import yaml from 'js-yaml';

const parseJSON = (data) => JSON.parse(data);

const parseYAML = (data) => yaml.load(data);

const getFileParser = (fileExtension) => {
  switch (fileExtension) {
    case 'json':
      return parseJSON;

    case 'yml':
      return parseYAML;

    default:
      throw new Error(`No parser for file with .${fileExtension} extension.`);
  }
};

export default getFileParser;
