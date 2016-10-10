import React from 'react';
import CustomPropTypes from './utils/custom_prop_types';

const Picker = function Picker(props) {
  const startDate = props.selectedDateRange.start;
  const endDate = props.selectedDateRange.end;

  return (
    <div className="picker">
      <button
        onClick={props.onClick}
        className="btn btn-default"
        id="date-range"
      >
        <i className="fa fa-calendar glyphicon glyphicon-calendar" />
        <span className="date-str">
          <strong className="date">{startDate.format('MMM, YYYY')}</strong>
          -
          <strong className="date">{endDate.format('MMM, YYYY')}</strong>
        </span>
        <i className="fa fa-angle-down" />
      </button>
    </div>
  );
};

Picker.propTypes = {
  selectedDateRange: CustomPropTypes.MomentRangeType.isRequired,
  onClick: React.PropTypes.func.isRequired,
};

export default Picker;
