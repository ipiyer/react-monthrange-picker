import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import moment from 'moment';

import Calendar from '../../src/calendar';

require('moment-range');

describe('<Calendar/>', () => {
  const selectedDateRange = moment.range(new Date(2016, 3, 1), new Date(2016, 11, 31));
  const restrictionRange = moment.range(new Date(2016, 0, 1), new Date(2017, 11, 31));

  describe('callback', () => {
    it('receive callback for month selection', () => {
      sinon.spy(Calendar.prototype, 'selectMonth');

      const applyFn = () => {};
      const cancelFn = () => {};
      const onSelect = sinon.spy();

      const wrapper = mount(<Calendar
        selectedDateRange={selectedDateRange}
        restrictionRange={restrictionRange}
        display={false}
        onApply={applyFn}
        onSelect={onSelect}
        onCancel={cancelFn}
        direction={'top'}
      />);
      const callbackRange = moment.range(new Date(2016, 3, 1), new Date(2016, 11, 31));

      wrapper.find('.calendar').render();
      wrapper.find('.year-start .cal-month').at(3).simulate('click');
      expect(Calendar.prototype.selectMonth).to.have.property('callCount', 1);
      expect(Calendar.prototype.selectMonth.calledWith(sinon.match(callbackRange)))
      .to.equal(true);
      expect(onSelect).to.have.property('callCount', 1);
      expect(onSelect.calledWith(sinon.match(callbackRange))).to.equal(true);
      Calendar.prototype.selectMonth.restore();
    });
    it('test start greater than end month', () => {
      const dateRange = moment.range(new Date(2016, 1, 1), new Date(2016, 4, 31));

      const applyFn = () => {};
      const cancelFn = () => {};
      const onSelect = sinon.spy();

      const wrapper = mount(<Calendar
        selectedDateRange={dateRange}
        restrictionRange={restrictionRange}
        display={false}
        onApply={applyFn}
        onSelect={onSelect}
        onCancel={cancelFn}
        direction={'top'}
      />);

      const callbackRange = moment.range(new Date(2016, 5, 1), new Date(2016, 5, 1));
      wrapper.find('.year-start .cal-month').at(5).simulate('click');
      expect(onSelect.calledWith(sinon.match(val => val.isSame(callbackRange)))).to.equal(true);
    });
  });

  describe('direction', () => {
    it('top', () => {
      const applyFn = () => {};
      const cancelFn = () => {};
      const onSelect = () => {};


      const wrapper = mount(<Calendar
        selectedDateRange={selectedDateRange}
        restrictionRange={restrictionRange}
        display={false}
        onApply={applyFn}
        onSelect={onSelect}
        onCancel={cancelFn}
        direction={'top'}
      />);

      expect(wrapper.find('.top')).to.have.length(1);
    });
    it('bottom', () => {
      const applyFn = () => {};
      const cancelFn = () => {};
      const onSelect = () => {};


      const wrapper = mount(<Calendar
        selectedDateRange={selectedDateRange}
        restrictionRange={restrictionRange}
        display={false}
        onApply={applyFn}
        onSelect={onSelect}
        onCancel={cancelFn}
        direction={'bottom'}
      />);

      expect(wrapper.find('.bottom')).to.have.length(1);
    });
    it('left', () => {
      const applyFn = () => {};
      const cancelFn = () => {};
      const onSelect = () => {};


      const wrapper = mount(<Calendar
        selectedDateRange={selectedDateRange}
        restrictionRange={restrictionRange}
        display={false}
        onApply={applyFn}
        onSelect={onSelect}
        onCancel={cancelFn}
        direction={'left'}
      />);

      expect(wrapper.find('.left')).to.have.length(1);
    });
    it('right', () => {
      const applyFn = () => {};
      const cancelFn = () => {};
      const onSelect = () => {};


      const wrapper = mount(<Calendar
        selectedDateRange={selectedDateRange}
        restrictionRange={restrictionRange}
        display={false}
        onApply={applyFn}
        onSelect={onSelect}
        onCancel={cancelFn}
        direction={'right'}
      />);

      expect(wrapper.find('.popover.right')).to.have.length(1);
    });
  });
  describe('Prop change', () => {
    it('rerender with different props', () => {
      const dateRange = moment.range(new Date(2016, 1, 1), new Date(2016, 4, 31));

      const applyFn = () => {};
      const cancelFn = () => {};
      const onSelect = sinon.spy();

      const wrapper = mount(<Calendar
        selectedDateRange={dateRange}
        restrictionRange={restrictionRange}
        display={false}
        onApply={applyFn}
        onSelect={onSelect}
        onCancel={cancelFn}
        direction={'top'}
      />);

      const changeDateRange = moment.range(new Date(2016, 5, 1), new Date(2016, 11, 31));

      wrapper.setProps({ selectedDateRange: changeDateRange, restrictionRange });

      expect(wrapper.find('.year-start .month').at(5).hasClass('selected')).to.equal(true);
    });
  });
});
