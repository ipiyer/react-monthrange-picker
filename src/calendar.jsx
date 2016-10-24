import React from 'react';
import $ from 'jquery';
import _ from 'lodash';
import CustomPropTypes from './utils/custom_prop_types';
import { YearStart, YearEnd } from './year';

class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.selectMonthFn = this.selectMonth.bind(this);

    let positionTop;

    try {
      positionTop = props.position.top;
    } catch (e) {
      positionTop = 0;
    }

    let positionLeft;

    try {
      positionLeft = props.position.left;
    } catch (e) {
      positionLeft = 0;
    }

    this.calStyle = {
      width: '700px',
      top: `${positionTop}px`,
      left: `${positionLeft}px`,
      display: props.display ? 'block' : 'none',
    };

    this.arrowStyle = {};

    const { selectedDateRange, restrictionRange } = props;
    // using state here because on month selection
    // both yearstart and yearend gets re-rendered
    // rather than propagating to the App.
    // App component stores the current select so
    // that on apply it can just change the state
    // to the current stored selection.

    this.state = { selectedDateRange, restrictionRange };
  }
  componentDidMount() {
    this.$el = $(this.node);
    this.setStyle(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.setStyle(nextProps);

    const { selectedDateRange, restrictionRange } = _.cloneDeep(nextProps);

    this.state = { selectedDateRange, restrictionRange };
    this.setState(this.state);
  }
  setStyle(props) {
    let positionTop;

    try {
      positionTop = props.position.top;
    } catch (e) {
      positionTop = 0;
    }

    let positionLeft;

    try {
      positionLeft = props.position.left;
    } catch (e) {
      positionLeft = 0;
    }

    const calStyle = _.cloneDeep(this.calStyle);
    const arrowStyle = _.cloneDeep(this.arrowStyle);
    const picker = this.$el.siblings('.picker');
    const direction = this.props.direction;
    const adjustmentConstant = 10;

    const calDim = {
      height: this.$el.height(),
      width: this.$el.width(),
    };

    const pickerDim = {
      height: picker.height(),
      width: picker.width(),
    };

    if (direction === 'left' || direction === 'right') {
      calStyle.top = positionTop ? `${calStyle.top}px` : `-${calDim.height / 2}px`;
      if (direction === 'left') {
        const leftWidth = calDim.width + adjustmentConstant;

        calStyle.left = positionLeft ? `${calStyle.left}px` : `-${leftWidth}px`;
      } else {
        const rightWidth = pickerDim.width + adjustmentConstant;
        calStyle.left = positionLeft ? `${calStyle.left}px` : `${rightWidth}px`;
      }

      const arrowTop = Math.abs(parseInt(calStyle.top, 10)) + (pickerDim.height / 2);
      arrowStyle.top = `${arrowTop}px`;
    } else if (direction === 'top' || direction === 'bottom') {
      calStyle.left = positionLeft ? `${calStyle.left}px` : `-${(calDim.width - pickerDim.width) / 2}px`;

      if (direction === 'top') {
        const top = calDim.height + pickerDim.height;
        calStyle.top = positionTop ? `${calStyle.top}px` : `-${top}px`;
      } else {
        const top = pickerDim.height + adjustmentConstant;
        calStyle.top = positionTop ? `${calStyle.top}px` : `${top}px`;
      }
      const arrowLeft = Math.abs(parseInt(calStyle.left, 10)) + (pickerDim.width / 2);
      arrowStyle.left = `${arrowLeft}px`;
    }

    calStyle.display = props.display ? 'block' : 'none';

    this.calStyle = calStyle;
    this.arrowStyle = arrowStyle;
  }
  selectMonth(newDateRange) {
    const newDateRangeClone = newDateRange.clone();
    if (newDateRangeClone.start > newDateRangeClone.end) {
      newDateRangeClone.end.month(newDateRangeClone.start.month());
      newDateRangeClone.end.year(newDateRangeClone.start.year());
    }
    if (this.props.onSelect) {
      this.props.onSelect(newDateRangeClone);
    }

    this.state.selectedDateRange = newDateRangeClone;
    this.setState(this.state);
  }
  render() {
    const selectedRange = this.state.selectedDateRange.clone();
    const startDate = selectedRange.start;
    const endDate = selectedRange.end;
    const popOverClass = `${this.props.direction} popover`;

    return (
      <div ref={node => (this.node = node)} className={popOverClass} style={this.calStyle}>
        <div className="arrow" style={this.arrowStyle} />
        <div className="clearfix sec-wrap">
          <div className="calendar col-xs-10">
            <div className="clearfix">
              <div className="col-xs-6 year-start year">
                <YearStart
                  restrictionRange={this.props.restrictionRange}
                  onYearChange={this.props.onYearChange}
                  onSelect={this.selectMonthFn}
                  currYear={startDate.clone()}
                  selectedDateRange={selectedRange}
                />
              </div>
              <div className="col-xs-6 year-end year">
                <YearEnd
                  restrictionRange={this.props.restrictionRange}
                  onYearChange={this.props.onYearChange}
                  onSelect={this.selectMonthFn}
                  currYear={endDate.clone()}
                  selectedDateRange={selectedRange}
                />
              </div>
            </div>
          </div>
          <div className="shortcuts col-xs-2">
            <button
              onClick={this.props.onApply}
              type="button"
              className="btn btn-block btn-success"
            >
            Apply
            </button>
            <button
              onClick={this.props.onCancel}
              type="button"
              className="btn btn-default btn-block"
            >
            Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }
}

Calendar.propTypes = {
  selectedDateRange: CustomPropTypes.MomentRangeType.isRequired,
  restrictionRange: CustomPropTypes.MomentRangeType.isRequired,
  direction: React.PropTypes.oneOf(['top', 'left', 'right', 'bottom']).isRequired,
  display: React.PropTypes.bool.isRequired,
  onSelect: React.PropTypes.func.isRequired,
  onApply: React.PropTypes.func.isRequired,
  onCancel: React.PropTypes.func.isRequired,
  onYearChange: React.PropTypes.func,
  position: React.PropTypes.shape({
    top: React.PropTypes.number,
    left: React.PropTypes.number,
  }),
};

export default Calendar;
