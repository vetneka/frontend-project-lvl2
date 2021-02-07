import formatToStylish from './formatToStylish.js';
import formatToPlain from './formatToPlain.js';

const getDiffFormatter = (formatName) => {
  switch (formatName) {
    case 'stylish':
      return formatToStylish;

    case 'plain':
      return formatToPlain;

    default:
      throw new Error(`Unexpected format ${formatName}.`);
  }
};

export default getDiffFormatter;
