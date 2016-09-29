const ReactDOM = require("react-dom"),
  React = require("react"),
  $ = require("jquery");

var moment = require("moment");
require("moment-range");

const CustomPropTypes = require('./utils/custom_prop_types.jsx');

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
      return;
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
        <span key={Date.now() + idx} className={selection + " col-xs-3 month"}>
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
      <div className="year">
        <div className="head">
          <h5>
            <button className='btn' onClick={this.changeYear.bind(this, -1)}>
              <i className="year-down fa fa-chevron-circle-left"></i>
            </button>
            <span className="text">{currYear}</span>
            <button className='btn' onClick={this.changeYear.bind(this, 1)}>
              <i className="year-up fa fa-chevron-circle-right"></i>
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
  getInitialState: function() {
    return {selectedDateRange: this.props.selectedDateRange};
  },
  selectMonth: function(newDateRange) {
    if (newDateRange.start > newDateRange.end) {
      newDateRange.end = newDateRange.start.clone();
    }
    // this.props.selectedDateRange = newDateRange; let _newDateRange =
    // newDateRange.clone(); console.log(_newDateRange);

    if (this.props.onSelect) {
      this.props.onSelect(newDateRange);
    }
    this.setState({selectedDateRange: newDateRange});
  },
  render: function() {
    let _selectedRange = this.state.selectedDateRange.clone();
    let startDate = _selectedRange.start;
    let endDate = _selectedRange.end;
    console.log(_selectedRange);
    return (
      <div className="calendar">
        <div className="clearfix">
          <div className="col-xs-6">
            <YearStart
              {...this.props}
              onSelect={this.selectMonth}
              currYear={startDate.clone()}
              selectedDateRange={_selectedRange}></YearStart>
          </div>
          <div className="col-xs-6">
            <YearEnd
              {...this.props}
              onSelect={this.selectMonth}
              currYear={endDate.clone()}
              selectedDateRange={_selectedRange}></YearEnd>
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
      <div className="clicker">
        <button ref="date-range" className="btn btn-default" id="date-range">
          <i className="fa fa-calendar glyphicon glyphicon-calendar"></i>
          <span className="date-str">
            <strong>{startDate.format("MMM, YYYY")}</strong>
            -
            <strong>{endDate.format("MMM, YYYY")}</strong>
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
    onCancel: React.PropTypes.func
  },
  getDefaultProps: function() {
    let date = new Date();
    let startDate = new Date(date.getFullYear(), 0, 1);
    let endDate = new Date(date.getFullYear(), 11, 31);
    let minDate = new Date(2000, 0, 1);
    let maxDate = new Date(date.getFullYear() + 4, 11, 31);

    return {
      selectedDateRange: moment.range(startDate, endDate),
      restrictionRange: moment.range(minDate, maxDate)
    };
  },
  getInitialState: function() {
    return {popover: false};
  },
  handleClick: function(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log("click");
  },
  render: function() {
    return (
      <div className="month-picker">
        <Picker {...this.props}></Picker>
        <Calender {...this.props}></Calender>
      </div>
    );
  }
});

function onSelect(x) {
  // console.log(x)
}

ReactDOM.render(
  <App onYearChange={onSelect} onSelect={onSelect}></App>, document.getElementById("content"));
