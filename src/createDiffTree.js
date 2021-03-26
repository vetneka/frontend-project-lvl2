import _ from 'lodash';
import nodeTypes from './consts.js';

const createDiffTree = (obj1, obj2) => {
  const unitedKeys = _.union(Object.keys(obj1), Object.keys(obj2));
  const sortedUnitedKeys = _.sortBy(unitedKeys);

  return sortedUnitedKeys.map((key) => {
    const value1 = obj1[key];
    const value2 = obj2[key];

    if (!_.has(obj1, key)) {
      return {
        key,
        type: nodeTypes.added,
        prevValue: value2,
      };
    }

    if (!_.has(obj2, key)) {
      return {
        key,
        type: nodeTypes.removed,
        prevValue: value1,
      };
    }

    if (value1 === value2) {
      return {
        key,
        type: nodeTypes.unchanged,
        prevValue: value1,
      };
    }

    if (_.isObject(value1) && _.isObject(value2)) {
      return {
        key,
        type: nodeTypes.nested,
        children: createDiffTree(value1, value2),
      };
    }

    return {
      key,
      type: nodeTypes.changed,
      prevValue: value1,
      nextValue: value2,
    };
  });
};

export default createDiffTree;
