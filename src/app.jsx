import React from 'react';
import moment from 'moment';
import CustomPropTypes from './utils/custom_prop_types';
import Picker from './picker';
import Calendar from './calendar';

require('moment-range');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleClickFn = this.handleClick.bind(this);
    this.onSelectFn = this.onSelect.bind(this);
    this.onApplyFn = this.onApply.bind(this);
    this.onCancelFn = this.onCancel.bind(this);

    const { selectedDateRange, restrictionRange, display } = props;
    this.state = { selectedDateRange, restrictionRange, display };
    this.selectedDateRange = selectedDateRange.clone();
  }
  componentDidMount() {
    if (this.props.onRender) {
      this.props.onRender();
    }
  }
  componentWillReceiveProps(nextProps) {
    const localState = Object.assign({}, this.state, nextProps);
    this.setState(localState);
  }
  onSelect(newDateRange) {
    // so that if the user clicks cancel it doesn't change.
    this.selectedDateRange = newDateRange.clone();

    if (this.props.onSelect) {
      this.props.onSelect(this.selectedDateRange);
    }
  }
  onApply() {
    if (this.props.onApply) {
      this.props.onApply(this.selectedDateRange);
    }

    // what ever was selected currently gets applied
    this.state.selectedDateRange = this.selectedDateRange;

    this.state.display = false;
    this.setState(this.state);
  }
  onCancel() {
    this.state.display = false;
    if (this.props.onCancel) {
      this.props.onCancel();
    }
    this.setState(this.state);
  }
  handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    if (this.state.display) {
      return;
    }
    this.state.display = true;
    this.setState(this.state);
  }
  render() {
    return (
      <div className="month-picker">
        <Picker
          selectedDateRange={this.state.selectedDateRange.clone()} onClick={this.handleClickFn}
        />
        <Calendar
          selectedDateRange={this.state.selectedDateRange.clone()}
          restrictionRange={this.state.restrictionRange.clone()}
          display={this.state.display}
          onSelect={this.onSelectFn}
          onApply={this.onApplyFn}
          onCancel={this.onCancelFn}
          direction={this.props.direction}
          onYearChange={this.props.onYearChange}
          position={this.props.position}
        />
      </div>
    );
  }
}

App.propTypes = {
  selectedDateRange: CustomPropTypes.MomentRangeType,
  restrictionRange: CustomPropTypes.MomentRangeType,
  onYearChange: React.PropTypes.func,
  onRender: React.PropTypes.func, // called after the initial render of the
  onSelect: React.PropTypes.func,
  onApply: React.PropTypes.func,
  onCancel: React.PropTypes.func,
  display: React.PropTypes.bool,
  direction: React.PropTypes.oneOf(['top', 'left', 'right', 'bottom']),
  position: React.PropTypes.shape({
    top: React.PropTypes.number,
    left: React.PropTypes.number,
  }),
};

const date = new Date();
const startDate = new Date(date.getFullYear(), 0, 1);
const endDate = new Date(date.getFullYear(), 11, 31);
const minDate = new Date(2000, 0, 1);
const maxDate = new Date(date.getFullYear() + 4, 11, 31);


App.defaultProps = {
  selectedDateRange: moment.range(startDate, endDate),
  restrictionRange: moment.range(minDate, maxDate),
  display: false,
  direction: 'bottom',
};

export default { App, Calendar };
