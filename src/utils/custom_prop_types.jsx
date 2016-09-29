"use strict";

var moment = require('moment');
require("moment-range");

function isMomentRange(val) {
  return val && val.start && val.end && moment.isMoment(val.start) && moment.isMoment(val.end);
}

const MomentType = (props, propName) => {
  let val = props[propName];

  if (!val) {
    return null;
  } else if (moment.isMoment(val)) {
    return null;
  }
  return new Error(`'${propName}' must be a moment`);
};

const MomentRangeType = (props, propName) => {
  let val = props[propName];

  if (!val) {
    return null;
  } else if (isMomentRange(val)) {
    return null;
  }
  return new Error(`'${propName}' must be a moment range`);
};

module.exports = {
  MomentType: MomentType,
  MomentRangeType: MomentRangeType
};
