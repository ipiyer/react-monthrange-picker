(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ReactDOM = require("react-dom"),
    React = require("react"),
    $ = require("jquery"),
    _ = require("lodash");

var moment = require("moment");
require("moment-range");

var CustomPropTypes = require('./utils/custom_prop_types');

var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

var YearBase = function (_React$Component) {
  _inherits(YearBase, _React$Component);

  function YearBase(props) {
    _classCallCheck(this, YearBase);

    var _this = _possibleConstructorReturn(this, (YearBase.__proto__ || Object.getPrototypeOf(YearBase)).call(this, props));

    _this.state = {
      currYear: _this.props.currYear.format("YYYY")
    };
    return _this;
  }

  _createClass(YearBase, [{
    key: "changeYear",
    value: function changeYear(n) {
      var year = this.state.currYear;
      if (n < 0 && year == this.props.restrictionRange.start.format("YYYY") || n > 0 && year == this.props.restrictionRange.end.format("YYYY")) {
        return false;
      }
      this.props.currYear.add(n, 'y');
      var currYear = this.props.currYear.format("YYYY");

      this.setState({ currYear: currYear });

      if (this.props.onYearChange) {
        this.props.onYearChange(currYear);
      }
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      this.setState({ currYear: nextProps.currYear.format("YYYY") });
    }
  }, {
    key: "selectMonth",
    value: function selectMonth(e) {
      e.preventDefault();
      e.stopPropagation();
      var target = $(e.target);
      var selectedMonth = parseInt(target.data("idx"), 10);
      // this is either start or end of the moment range;
      this.date.month(selectedMonth).year(this.state.currYear);
      this.props.onSelect(this.props.selectedDateRange);
    }
  }, {
    key: "render",
    value: function render() {
      var currYear = this.state.currYear;
      var _selectedRange = this.props.selectedDateRange;

      var newDate = new Date();
      newDate.setYear(currYear);
      newDate.setDate(1);

      var that = this;

      var months = MONTHS.map(function (month, idx) {
        newDate.setMonth(idx);
        var selection = "";
        if (currYear === that.date.format("YYYY") && month === that.date.format("MMM")) {
          selection = "selected";
        } else if (_selectedRange.contains(newDate, true)) {
          selection = "highlight";
        }

        return React.createElement(
          "span",
          { key: Date.now() + idx, className: selection + " month" },
          React.createElement(
            "a",
            {
              className: "cal-month",
              href: "#",
              "data-idx": idx,
              onClick: that.selectMonth.bind(that),
              "data-month": month },
            month
          )
        );
      });

      return React.createElement(
        "div",
        { className: "" },
        React.createElement(
          "div",
          { className: "head" },
          React.createElement(
            "h5",
            { className: "title clearfix" },
            React.createElement(
              "button",
              {
                className: "btn btn-plain year-down",
                onClick: this.changeYear.bind(this, -1) },
              React.createElement("i", { className: "fa fa-chevron-circle-left" })
            ),
            React.createElement(
              "span",
              { className: "text" },
              currYear
            ),
            React.createElement(
              "button",
              {
                className: "btn btn-plain year-up",
                onClick: this.changeYear.bind(this, 1) },
              React.createElement("i", { className: "fa fa-chevron-circle-right" })
            )
          )
        ),
        React.createElement(
          "div",
          { className: "months" },
          React.createElement(
            "div",
            { className: "clearfix" },
            months
          )
        )
      );
    }
  }]);

  return YearBase;
}(React.Component);

YearBase.propTypes = {
  restrictionRange: CustomPropTypes.MomentRangeType,
  currYear: CustomPropTypes.MomentType,
  selectedDateRange: CustomPropTypes.MomentRangeType
};

var YearStart = function (_YearBase) {
  _inherits(YearStart, _YearBase);

  function YearStart(props) {
    _classCallCheck(this, YearStart);

    var _this2 = _possibleConstructorReturn(this, (YearStart.__proto__ || Object.getPrototypeOf(YearStart)).call(this, props));

    _this2.date = _this2.props.selectedDateRange.start;
    return _this2;
  }

  _createClass(YearStart, [{
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      this.date = nextProps.selectedDateRange.start;
      _get(YearStart.prototype.__proto__ || Object.getPrototypeOf(YearStart.prototype), "componentWillReceiveProps", this).call(this, nextProps);
    }
  }]);

  return YearStart;
}(YearBase);

var YearEnd = function (_YearBase2) {
  _inherits(YearEnd, _YearBase2);

  function YearEnd(props) {
    _classCallCheck(this, YearEnd);

    var _this3 = _possibleConstructorReturn(this, (YearEnd.__proto__ || Object.getPrototypeOf(YearEnd)).call(this, props));

    _this3.date = _this3.props.selectedDateRange.end;
    return _this3;
  }

  _createClass(YearEnd, [{
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      this.date = nextProps.selectedDateRange.end;
      _get(YearEnd.prototype.__proto__ || Object.getPrototypeOf(YearEnd.prototype), "componentWillReceiveProps", this).call(this, nextProps);
    }
  }]);

  return YearEnd;
}(YearBase);

var Calender = React.createClass({
  displayName: "Calender",

  propTypes: {
    selectedDateRange: CustomPropTypes.MomentRangeType,
    restrictionRange: CustomPropTypes.MomentRangeType
  },
  setStyle: function setStyle(props) {
    var style = _.cloneDeep(this.style);
    var position = $(".picker").offset();

    var elWidth = 700;
    var elHeight = 215;
    var left = position.left - (elWidth + 10);
    var top = position.top - elHeight / 2;

    style.top = top < 0 ? 0 : top + "px";
    style.left = left < 0 ? 0 : left + "px";

    style.display = props.display ? "block" : "none";

    this.style = style;
  },
  getInitialState: function getInitialState() {
    this.style = {
      width: "700px",
      top: 0 + "px",
      left: 0 + "px",
      display: "none"
    };

    return _.cloneDeep(this.props);
  },
  selectMonth: function selectMonth(newDateRange) {
    if (newDateRange.start > newDateRange.end) {
      newDateRange.end = newDateRange.start.clone();
    }

    if (this.props.onSelect) {
      this.props.onSelect(newDateRange);
    }
    this.state.selectedDateRange = newDateRange;
    this.setState(this.state);
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    this.setStyle(nextProps);
    this.setState(nextProps);
  },
  render: function render() {
    var _selectedRange = this.state.selectedDateRange.clone();
    var startDate = _selectedRange.start;
    var endDate = _selectedRange.end;
    return React.createElement(
      "div",
      { className: "wrap popover", style: this.style },
      React.createElement("div", { className: "arrow" }),
      React.createElement(
        "div",
        { className: "clearfix" },
        React.createElement(
          "div",
          { className: "calendar col-xs-10" },
          React.createElement(
            "div",
            { className: "clearfix" },
            React.createElement(
              "div",
              { className: "col-xs-6 year-start year" },
              React.createElement(YearStart, _extends({}, this.props, {
                onSelect: this.selectMonth,
                currYear: startDate.clone(),
                selectedDateRange: _selectedRange }))
            ),
            React.createElement(
              "div",
              { className: "col-xs-6 year-end year" },
              React.createElement(YearEnd, _extends({}, this.props, {
                onSelect: this.selectMonth,
                currYear: endDate.clone(),
                selectedDateRange: _selectedRange }))
            )
          )
        ),
        React.createElement(
          "div",
          { className: "shortcuts col-xs-2" },
          React.createElement(
            "div",
            { className: "head" },
            React.createElement(
              "h5",
              { className: "title" },
              "Shortcuts"
            )
          ),
          React.createElement(
            "button",
            {
              onClick: this.props.onApply,
              type: "button",
              className: "btn btn-default btn-block  btn-success" },
            "Apply"
          ),
          React.createElement(
            "button",
            {
              onClick: this.props.onCancel,
              type: "button",
              className: "btn btn-default btn-block  btn-default" },
            "Cancel"
          )
        )
      )
    );
  }
});

var Picker = React.createClass({
  displayName: "Picker",

  propTypes: {
    selectedDateRange: CustomPropTypes.MomentRangeType
  },
  render: function render() {
    var startDate = this.props.selectedDateRange.start;
    var endDate = this.props.selectedDateRange.end;

    return React.createElement(
      "div",
      { className: "picker" },
      React.createElement(
        "button",
        {
          onClick: this.props.onClick,
          ref: "date-range",
          className: "btn btn-default",
          id: "date-range" },
        React.createElement("i", { className: "fa fa-calendar glyphicon glyphicon-calendar" }),
        React.createElement(
          "span",
          { className: "date-str" },
          React.createElement(
            "strong",
            { className: "date" },
            startDate.format("MMM, YYYY")
          ),
          "-",
          React.createElement(
            "strong",
            { className: "date" },
            endDate.format("MMM, YYYY")
          )
        ),
        React.createElement("i", { className: "fa fa-angle-down" })
      )
    );
  }
});

var App = React.createClass({
  displayName: "App",

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
  onSelect: function onSelect(newDateRange) {
    // so that if the user clicks cancel it doesn't change.
    this._selectedDateRange = newDateRange;
    if (this.props.onSelect) {
      this.props.onSelect(_.cloneDeep(newDateRange));
    }
  },
  onApply: function onApply() {
    if (this.props.onApply) {
      this.state.selectedDateRange = this.props.onApply(this._selectedDateRange);
    } else {
      // what ever was selected currently gets applied
      this.state.selectedDateRange = this._selectedDateRange;
    }
    this.state.display = false;
    this.setState(this.state);
  },
  onCancel: function onCancel() {
    this.state.display = false;
    this.setState(this.state);
  },
  getDefaultProps: function getDefaultProps() {
    var date = new Date();
    var startDate = new Date(date.getFullYear(), 0, 1);
    var endDate = new Date(date.getFullYear(), 11, 31);
    var minDate = new Date(2000, 0, 1);
    var maxDate = new Date(date.getFullYear() + 4, 11, 31);

    return {
      selectedDateRange: moment.range(startDate, endDate),
      restrictionRange: moment.range(minDate, maxDate),
      display: false
    };
  },
  getInitialState: function getInitialState() {
    return _.cloneDeep(this.props);
  },
  handleClick: function handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    if (this.state.display) {
      return;
    }
    this.state.display = true;
    this.setState(this.state);
  },
  render: function render() {
    return React.createElement(
      "div",
      { className: "month-picker" },
      React.createElement(Picker, _extends({}, this.state, { onClick: this.handleClick })),
      React.createElement(Calender, _extends({}, this.state, {
        onSelect: this.onSelect,
        onApply: this.onApply,
        onCancel: this.onCancel }))
    );
  }
});

module.exports = App;
var f = false;
ReactDOM.render(React.createElement(App, { display: f }), document.getElementById("content"));

},{"./utils/custom_prop_types":2,"jquery":"jquery","lodash":"lodash","moment":"moment","moment-range":"moment-range","react":"react","react-dom":"react-dom"}],2:[function(require,module,exports){
"use strict";

var moment = require('moment');
require("moment-range");

function isMomentRange(val) {
  return val && val.start && val.end && moment.isMoment(val.start) && moment.isMoment(val.end);
}

var MomentType = function MomentType(props, propName) {
  var val = props[propName];

  if (!val) {
    return null;
  } else if (moment.isMoment(val)) {
    return null;
  }
  return new Error("'" + propName + "' must be a moment");
};

var MomentRangeType = function MomentRangeType(props, propName) {
  var val = props[propName];

  if (!val) {
    return null;
  } else if (isMomentRange(val)) {
    return null;
  }
  return new Error("'" + propName + "' must be a moment range");
};

module.exports = {
  MomentType: MomentType,
  MomentRangeType: MomentRangeType
};

},{"moment":"moment","moment-range":"moment-range"}]},{},[1])


//# sourceMappingURL=bundle.js.map
