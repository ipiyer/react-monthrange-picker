# react-monthrange-picker <sup>[![Version Badge][npm-version-svg]][package-url]</sup>

[![Coverage Status][coveralls-svg]][coveralls-url]
[![Build Status][travis-svg]][travis-url]
[![dependency status][deps-svg]][deps-url]
[![dev dependency status][dev-deps-svg]][dev-deps-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]
[![npm badge][npm-badge-png]][package-url]

![react-monthrange-picker    bottom](https://raw.githubusercontent.com/munichlinux/react-monthrange-picker/master/direction_bottom.gif)
![react-monthrange-picker  left](https://raw.githubusercontent.com/munichlinux/react-monthrange-picker/master/picker-corner.gif)

## Live Playground

For example of how to use [react-monthrange-picker](http://https://github.com/munichlinux/react-monthrange-picker) in your application look at [example application](http://https://github.com/munichlinux/monthrange-picker-example)

OR

For simple example:
* Clone the repository
* `npm install`
* `gulp dev`
* Visit http://localhost:9999/

## API

### `Calendar`
This component is designed to allow users to to select both start month and end month. It also has functionalities to
detect varies events like onYearChange, onRender, onSelect, onApply, onCancel, and calendar positioning.

#### `Props`

***selectedDateRange:***

[MomentRange](https://github.com/gf3/moment-range) object representing the current selected date range or initial date range of the calendar. Defaults to the current year.

```
  selectedDateRange: CustomPropTypes.MomentRangeType
```

***restrictionRange:***

[MomentRange](https://github.com/gf3/moment-range) object which restricts the calendar between start and the end date. Defaults between 2000 and 4 years from now.

```
  restrictionRange: CustomPropTypes.MomentRangeType
```

***direction:***

`direction` is the opening direction of the calendar.

```
  direction: React.PropTypes.oneOf(['top', 'left', 'right', 'bottom'])
```

***onYearChange:***

`onYearChange` is a callback fn triggered when the calendar year changes.

```
  onYearChange: React.PropTypes.func
```

***onRender:***

`onRender` is a callback fn triggered when the app rendered first.

```
  onRender: React.PropTypes.func
```

***onSelect:***

`onSelect` is a callback fn triggered when the user selection changes, the fn is called with the current selection range of type `CustomPropTypes.MomentRangeType`.

```
  onSelect: React.PropTypes.func
```

***onApply:***

`onApply` is a callback fn triggered when the user clicks the apply button.

```
  onApply: React.PropTypes.func
```

***onCancel:***

`onCancel` is a callback fn triggered when the user clicks the cancel button.

```
  onCancel: React.PropTypes.func
```

***display:***

`display` defaults to false, display true would show the calendar when rendered first.

```
  display: React.PropTypes.bool
```

## Theming

react-monthrange-picker comes with a set of SCSS variables that can be overridden to add your own project-specific theming. react-monthrange-picker also exports the style with the package.json, so you can bundle the css with [parcelify](https://github.com/rotundasoftware/parcelify). Checkout the [example app](https://github.com/munichlinux/react-monthrange-picker-example)




[npm-version-svg]: http://versionbadg.es/munichlinux/react-monthrange-picker.svg
[coveralls-url]: https://coveralls.io/github/munichlinux/react-monthrange-picker?branch=master
[coveralls-svg]: https://coveralls.io/repos/github/munichlinux/react-monthrange-picker/badge.svg?branch=master
[travis-svg]: https://travis-ci.org/munichlinux/react-monthrange-picker.svg
[travis-url]: https://travis-ci.org/munichlinux/react-monthrange-picker
[package-url]: https://npmjs.org/package/react-monthrange-picker
[deps-svg]: https://david-dm.org/munichlinux/react-monthrange-picker.svg
[deps-url]: https://david-dm.org/munichlinux/react-monthrange-picker
[dev-deps-svg]:https://david-dm.org/munichlinux/react-monthrange-picker/dev-status.svg
[dev-deps-url]: https://david-dm.org/munichlinux/react-monthrange-picker?type=dev
[npm-badge-png]: https://nodei.co/npm/react-monthrange-picker.png?downloads=true&stars=true
[license-image]: https://img.shields.io/npm/l/react-monthrange-picker.svg
[license-url]: LICENSE
[downloads-image]: https://img.shields.io/npm/dm/react-monthrange-picker.svg
[downloads-url]: https://npm-stat.com/charts.html?package=react-monthrange-picker
