import stylishFormatter from './stylish.js';
import plainFormatter from './plain.js';
import jsonFormatter from './json.js';

const getDiffFormatter = (formatName) => {
  switch (formatName) {
    case 'stylish':
      return stylishFormatter;

    case 'plain':
      return plainFormatter;

    case 'json':
      return jsonFormatter;

    default:
      throw new Error(`Unexpected format: ${formatName}.`);
  }
};

export default getDiffFormatter;
