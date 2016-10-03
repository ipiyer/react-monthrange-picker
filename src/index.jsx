const ReactDOM = require("react-dom"),
  React = require("react"),
  $ = require("jquery"),
  _ = require("lodash");

var moment = require("moment");
require("moment-range");

const CustomPropTypes = require('./utils/custom_prop_types');

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];

class YearBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currYear: this.props.currYear.format("YYYY")
    };
  }
  changeYear(n) {
    let year = this.state.currYear;
    if ((n < 0 && year == this.props.restrictionRange.start.format("YYYY")) || (n > 0 && year == this.props.restrictionRange.end.format("YYYY"))) {
      return false;
    }
    this.props.currYear.add(n, 'y');
    let currYear = this.props.currYear.format("YYYY");

    this.setState({currYear: currYear})

    if (this.props.onYearChange) {
      this.props.onYearChange(currYear);
    }
  }
  componentWillReceiveProps(nextProps) {
    this.setState({currYear: nextProps.currYear.format("YYYY")});
  }

  selectMonth(e) {
    e.preventDefault();
    e.stopPropagation();
    let target = $(e.target);
    let selectedMonth = parseInt(target.data("idx"), 10);
    // this is either start or end of the moment range;
    this.date.month(selectedMonth).year(this.state.currYear);
    this.props.onSelect(this.props.selectedDateRange);
  }
  render() {
    let currYear = this.state.currYear;
    let _selectedRange = this.props.selectedDateRange;

    let newDate = new Date();
    newDate.setYear(currYear);
    newDate.setDate(1);

    var that = this;

    let months = MONTHS.map(function(month, idx) {
      newDate.setMonth(idx);
      let selection = "";
      if (currYear === that.date.format("YYYY") && month === that.date.format("MMM")) {
        selection = "selected";
      } else if (_selectedRange.contains(newDate, true)) {
        selection = "highlight";
      }

      return (
        <span key={Date.now() + idx} className={selection + " month"}>
          <a
            className="cal-month"
            href="#"
            data-idx={idx}
            onClick={that.selectMonth.bind(that)}
            data-month={month}>{month}</a>
        </span>
      );
    });

    return (
      <div className="">
        <div className="head">
          <h5 className="title clearfix">
            <button
              className='btn btn-plain year-down'
              onClick={this.changeYear.bind(this, -1)}>
              <i className="fa fa-chevron-circle-left"></i>
            </button>
            <span className="text">{currYear}</span>
            <button
              className='btn btn-plain year-up'
              onClick={this.changeYear.bind(this, 1)}>
              <i className="fa fa-chevron-circle-right"></i>
            </button>
          </h5>
        </div>
        <div className="months">
          <div className="clearfix">
            {months}
          </div>
        </div>
      </div>
    );
  }
}

YearBase.propTypes = {
  restrictionRange: CustomPropTypes.MomentRangeType,
  currYear: CustomPropTypes.MomentType,
  selectedDateRange: CustomPropTypes.MomentRangeType
};

class YearStart extends YearBase {
  constructor(props) {
    super(props);
    this.date = this.props.selectedDateRange.start;
  }
  componentWillReceiveProps(nextProps) {
    this.date = nextProps.selectedDateRange.start;
    super.componentWillReceiveProps(nextProps);
  }
}

class YearEnd extends YearBase {
  constructor(props) {
    super(props);
    this.date = this.props.selectedDateRange.end;
  }
  componentWillReceiveProps(nextProps) {
    this.date = nextProps.selectedDateRange.end;
    super.componentWillReceiveProps(nextProps);
  }

}

const Calender = React.createClass({
  propTypes: {
    selectedDateRange: CustomPropTypes.MomentRangeType,
    restrictionRange: CustomPropTypes.MomentRangeType
  },
  setStyle: function(props) {
    let style = _.cloneDeep(this.style);
    let position = $(".picker").offset();

    let elWidth = 700;
    let elHeight = 215;
    let left = position.left - (elWidth + 10);
    let top = position.top - (elHeight / 2);

    style.top = top < 0
      ? 0
      : top + "px";
    style.left = left < 0
      ? 0
      : left + "px";

    style.display = props.display
      ? "block"
      : "none";

    this.style = style;
  },
  getInitialState: function() {
    this.style = {
      width: "700px",
      top: 0 + "px",
      left: 0 + "px",
      display: "none"
    };

    return _.cloneDeep(this.props);
  },
  selectMonth: function(newDateRange) {
    if (newDateRange.start > newDateRange.end) {
      newDateRange.end = newDateRange.start.clone();
    }

    if (this.props.onSelect) {
      this.props.onSelect(newDateRange);
    }
    this.state.selectedDateRange = newDateRange;
    this.setState(this.state);
  },
  componentWillReceiveProps: function(nextProps) {
    this.setStyle(nextProps);
    this.setState(nextProps);
  },
  render: function() {
    let _selectedRange = this.state.selectedDateRange.clone();
    let startDate = _selectedRange.start;
    let endDate = _selectedRange.end;
    return (
      <div className="wrap popover" style={this.style}>
        <div className="arrow"></div>
        <div className="clearfix">
          <div className="calendar col-xs-10">
            <div className="clearfix">
              <div className="col-xs-6 year-start year">
                <YearStart
                  {...this.props}
                  onSelect={this.selectMonth}
                  currYear={startDate.clone()}
                  selectedDateRange={_selectedRange}></YearStart>
              </div>
              <div className="col-xs-6 year-end year">
                <YearEnd
                  {...this.props}
                  onSelect={this.selectMonth}
                  currYear={endDate.clone()}
                  selectedDateRange={_selectedRange}></YearEnd>
              </div>
            </div>
          </div>
          <div className="shortcuts col-xs-2">
            <div className="head">
              <h5 className="title">Shortcuts</h5>
            </div>
            <button
              onClick={this.props.onApply}
              type="button"
              className="btn btn-default btn-block  btn-success">Apply</button>
            <button
              onClick={this.props.onCancel}
              type="button"
              className="btn btn-default btn-block  btn-default">Cancel</button>
          </div>
        </div>
      </div>
    );
  }
});

const Picker = React.createClass({
  propTypes: {
    selectedDateRange: CustomPropTypes.MomentRangeType
  },
  render: function() {
    let startDate = this.props.selectedDateRange.start;
    let endDate = this.props.selectedDateRange.end;

    return (
      <div className="picker">
        <button
          onClick={this.props.onClick}
          ref="date-range"
          className="btn btn-default"
          id="date-range">
          <i className="fa fa-calendar glyphicon glyphicon-calendar"></i>
          <span className="date-str">
            <strong className='date'>{startDate.format("MMM, YYYY")}</strong>
            -
            <strong className='date'>{endDate.format("MMM, YYYY")}</strong>
          </span>
          <i className="fa fa-angle-down"></i>
        </button>
      </div>
    );
  }
});

const App = React.createClass({
  propTypes: {
    selectedDateRange: CustomPropTypes.MomentRangeType,
    restrictionRange: CustomPropTypes.MomentRangeType,
    onYearChange: React.PropTypes.func,
    onRender: React.PropTypes.func, // called after the initial render of the
    onSelect: React.PropTypes.func,
    onApply: React.PropTypes.func,
    onCancel: React.PropTypes.func,
    display: React.PropTypes.bool
  },
  onSelect: function(newDateRange) {
    // so that if the user clicks cancel it doesn't change.
    this._selectedDateRange = newDateRange;
    if (this.props.onSelect) {
      this.props.onSelect(_.cloneDeep(newDateRange));
    }
  },
  onApply: function() {
    if (this.props.onApply) {
      this.state.selectedDateRange = this.props.onApply(this._selectedDateRange);
    } else {
      // what ever was selected currently gets applied
      this.state.selectedDateRange = this._selectedDateRange;
    }
    this.state.display = false;
    this.setState(this.state);
  },
  onCancel: function() {
    this.state.display = false;
    this.setState(this.state);
  },
  getDefaultProps: function() {
    let date = new Date();
    let startDate = new Date(date.getFullYear(), 0, 1);
    let endDate = new Date(date.getFullYear(), 11, 31);
    let minDate = new Date(2000, 0, 1);
    let maxDate = new Date(date.getFullYear() + 4, 11, 31);

    return {
      selectedDateRange: moment.range(startDate, endDate),
      restrictionRange: moment.range(minDate, maxDate),
      display: false
    };
  },
  getInitialState: function() {
    return _.cloneDeep(this.props);
  },
  handleClick: function(e) {
    e.preventDefault();
    e.stopPropagation();
    if (this.state.display) {
      return;
    }
    this.state.display = true;
    this.setState(this.state);
  },
  render: function() {
    return (
      <div className="month-picker">
        <Picker {...this.state} onClick={this.handleClick}></Picker>
        <Calender
          {...this.state}
          onSelect={this.onSelect}
          onApply={this.onApply}
          onCancel={this.onCancel}></Calender>
      </div>
    );
  }
});

module.exports = App;
var f = false;
ReactDOM.render(
  <App display={f}></App>, document.getElementById("content"));
