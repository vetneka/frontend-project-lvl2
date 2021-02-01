import yaml from 'js-yaml';

const parseToJSON = (data) => JSON.parse(data);

const parseToYAML = (data) => yaml.load(data);

const getFileParser = (fileExtension) => {
  switch (fileExtension) {
    case 'json':
      return parseToJSON;

    case 'yml':
      return parseToYAML;

    default:
      throw new Error(`No parser for file with .${fileExtension} extension.`);
  }
};

export default getFileParser;
