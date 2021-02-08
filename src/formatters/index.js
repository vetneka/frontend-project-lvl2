import formatToStylish from './formatToStylish.js';
import formatToPlain from './formatToPlain.js';
import formatToJSON from './formatToJSON.js';

const getDiffFormatter = (formatName) => {
  switch (formatName) {
    case 'stylish':
      return formatToStylish;

    case 'plain':
      return formatToPlain;

    case 'json':
      return formatToJSON;

    default:
      throw new Error(`Unexpected format: ${formatName}.`);
  }
};

export default getDiffFormatter;
