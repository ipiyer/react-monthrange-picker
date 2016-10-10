import moment from 'moment';

require('moment-range');

function isMomentRange(val) {
  return val && val.start && val.end && moment.isMoment(val.start) && moment.isMoment(val.end);
}

const chainablePropType = (predicate) => {
  const propType = (props, propName, componentName) => {
    // don't do any validation if empty
    if (props[propName] == null) {
      return false;
    }

    return predicate(props, propName, componentName);
  };

  propType.isRequired = (props, propName, componentName) => {
    // warn if empty
    if (props[propName] == null) {
      return new Error(`Required prop \`${propName}\` was not specified in \`${componentName}\`.`);
    }

    return predicate(props, propName, componentName);
  };

  return propType;
};

const MomentType = (props, propName) => {
  const val = props[propName];
  if (!val) {
    return null;
  } else if (moment.isMoment(val)) {
    return null;
  }
  return new Error(`'${propName}' must be a moment`);
};

const MomentRangeType = (props, propName) => {
  const val = props[propName];

  if (!val) {
    return null;
  } else if (isMomentRange(val)) {
    return null;
  }
  return new Error(`'${propName}' must be a moment range`);
};

module.exports = {
  MomentType: chainablePropType(MomentType),
  MomentRangeType: chainablePropType(MomentRangeType),
};
