import yaml from 'js-yaml';

const parseJSON = (data) => JSON.parse(data);

const parseYAML = (data) => yaml.load(data);

const parseFile = (fileData, fileExtension) => {
  switch (fileExtension) {
    case 'json':
      return parseJSON(fileData);

    case 'yml':
      return parseYAML(fileData);

    default:
      throw new Error(`No parser for file with .${fileExtension} extension.`);
  }
};

export default parseFile;
