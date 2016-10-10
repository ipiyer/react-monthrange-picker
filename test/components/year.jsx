import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import moment from 'moment';

import { YearStart, YearEnd } from '../../src/year';

require('moment-range');

describe('<Year/>', () => {
  describe('<YearStart/>', () => {
    const restrictionRange = moment.range(new Date(2000, 0, 1),
    new Date(new Date().getFullYear() + 4), 11, 31);

    const yearStart = new Date();
    yearStart.setMonth(0);
    yearStart.setDate(1);

    const yearEnd = new Date();
    yearEnd.setMonth(11);
    yearEnd.setDate(31);

    it('datePoint should be the start of the moment-range', () => {
      const selectedDateRange = moment.range(yearStart, yearEnd);
      const currYear = moment(new Date());

      const wrapper = mount(
        <YearStart
          selectedDateRange={selectedDateRange}
          restrictionRange={restrictionRange}
          currYear={currYear}
          onSelect={() => {}}
        />);
      expect(wrapper.component.getInstance().datePoint).to.equal(selectedDateRange.start);
    });
    it('month selection should correspond to the start moment range', () => {
      const selectedDateRange = moment.range(yearStart, yearEnd);
      const currYear = moment(new Date());

      const wrapper = mount(
        <YearStart
          selectedDateRange={selectedDateRange}
          restrictionRange={restrictionRange}
          currYear={currYear}
          onSelect={() => {}}
        />);
      expect(wrapper.find('.selected')).to.have.length(1);
      expect(wrapper.find('.highlight')).to.have.length(11);

      expect(wrapper.find('.selected').text()).to.equal(selectedDateRange.start.format('MMM'));
    });
    it('title should match the start year', () => {
      const selectedDateRange = moment.range(yearStart, yearEnd);
      const currYear = moment(new Date());

      const wrapper = mount(
        <YearStart
          selectedDateRange={selectedDateRange}
          restrictionRange={restrictionRange}
          currYear={currYear}
          onSelect={() => {}}
        />);
      expect(wrapper.find('.title').text()).to.equal(selectedDateRange.start.format('YYYY'));
    });
    it('year change should should reflect the calendar selection', () => {
      const selectedDateRange = moment.range(yearStart, yearEnd);
      const currYear = moment(new Date());

      const wrapper = mount(
        <YearStart
          selectedDateRange={selectedDateRange}
          restrictionRange={restrictionRange}
          currYear={currYear}
          onSelect={() => {}}
        />);
      wrapper.find('.year-down').simulate('click');
      const prevYear = parseInt(selectedDateRange.start.format('YYYY'), 10) - 1;
      expect(wrapper.find('.title').text()).to.equal(String(prevYear));
      expect(wrapper.find('.selected')).to.have.length(0);
      expect(wrapper.find('.highlight')).to.have.length(0);

      wrapper.find('.year-up').simulate('click');
      expect(wrapper.find('.title').text()).to.equal(String(prevYear + 1));
      expect(wrapper.find('.selected')).to.have.length(1);
      expect(wrapper.find('.highlight')).to.have.length(11);

      wrapper.find('.year-up').simulate('click');
      expect(wrapper.find('.title').text()).to.equal(String(prevYear + 2));
      expect(wrapper.find('.selected')).to.have.length(0);
      expect(wrapper.find('.highlight')).to.have.length(0);
    });
    it('year change callback with current year passed', () => {
      const selectedDateRange = moment.range(yearStart, yearEnd);
      const currYear = moment(new Date());

      const onYearChange = sinon.spy();

      const wrapper = mount(
        <YearStart
          selectedDateRange={selectedDateRange}
          restrictionRange={restrictionRange}
          currYear={currYear}
          onSelect={() => {}}
          onYearChange={onYearChange}
        />);

      wrapper.find('.year-down').simulate('click');
      const yearDown = new Date().getFullYear() - 1;
      expect(onYearChange.calledWith(String(yearDown))).to.equal(true);

      wrapper.find('.year-up').simulate('click');
      expect(onYearChange.calledWith(String(yearDown + 1))).to.equal(true);
    });
    it('year change should should reflect the calendar selection', () => {
      const selectedDateRange = moment.range(yearStart, yearEnd);
      const currYear = moment(new Date());

      const onSelection = sinon.spy();

      const wrapper = mount(
        <YearStart
          selectedDateRange={selectedDateRange}
          restrictionRange={restrictionRange}
          currYear={currYear}
          onSelect={onSelection}
        />);

      wrapper.find('.year-down').simulate('click');
      wrapper.find('.cal-month').at(0).simulate('click');

      expect(onSelection).to.have.property('callCount', 1);
      expect(onSelection.calledWith(selectedDateRange)).to.equal(true);
    });
    it('prev year cannot go beyond restrictionRange.end', () => {
      const selectedDateRange = moment.range(yearStart, yearEnd);
      const currYear = moment(new Date());

      const onYearChange = sinon.spy();

      const customRestrictionRange = selectedDateRange.clone();


      const wrapper = mount(
        <YearStart
          selectedDateRange={selectedDateRange}
          restrictionRange={customRestrictionRange}
          currYear={currYear}
          onSelect={() => {}}
          onYearChange={onYearChange}
        />);

      wrapper.find('.year-down').simulate('click');

      expect(onYearChange).to.have.property('callCount', 0);
    });
    it('props change should update datepoint and current year', () => {
      const selectedDateRange = moment.range(yearStart, yearEnd);
      const currYear = moment(new Date());

      const wrapper = mount(
        <YearStart
          selectedDateRange={selectedDateRange}
          restrictionRange={restrictionRange}
          currYear={currYear}
          onSelect={() => {}}
        />);

      selectedDateRange.start.add(-1, 'y');
      currYear.add(-1, 'y');

      wrapper.setProps({
        selectedDateRange,
        restrictionRange,
        currYear,
        onSelect: () => {},
      });
      expect(wrapper.state().currYear).to.equal(currYear.format('YYYY'));
      expect(wrapper.node.datePoint).to.equal(selectedDateRange.start);
    });
  });
  describe('<YearEnd/>', () => {
    const restrictionRange = moment.range(new Date(2000, 0, 1),
    new Date(new Date().getFullYear() + 4), 11, 31);

    const yearStart = new Date();
    yearStart.setMonth(0);
    yearStart.setDate(1);

    const yearEnd = new Date();
    yearEnd.setMonth(11);
    yearEnd.setDate(31);

    it('datePoint should be the end of the moment-range', () => {
      const selectedDateRange = moment.range(yearStart, yearEnd);
      const currYear = moment(new Date());


      const wrapper = mount(
        <YearEnd
          selectedDateRange={selectedDateRange}
          restrictionRange={restrictionRange}
          currYear={currYear}
          onSelect={() => {}}
        />);
      expect(wrapper.component.getInstance().datePoint).to.equal(selectedDateRange.end);
    });
    it('props change should update datepoint and current year', () => {
      const selectedDateRange = moment.range(yearStart, yearEnd);
      const currYear = moment(new Date());

      const wrapper = mount(
        <YearEnd
          selectedDateRange={selectedDateRange}
          restrictionRange={restrictionRange}
          currYear={currYear}
          onSelect={() => {}}
        />);

      selectedDateRange.start.add(1, 'y');
      currYear.add(1, 'y');

      wrapper.setProps({
        selectedDateRange,
        restrictionRange,
        currYear,
        onSelect: () => {},
      });
      expect(wrapper.state().currYear).to.equal(currYear.format('YYYY'));
      expect(wrapper.node.datePoint).to.equal(selectedDateRange.end);
    });

    it('next year cannot go beyond restrictionRange.end', () => {
      const selectedDateRange = moment.range(yearStart, yearEnd);
      const currYear = moment(new Date());

      const onYearChange = sinon.spy();

      const customRestrictionRange = selectedDateRange.clone();


      const wrapper = mount(
        <YearEnd
          selectedDateRange={selectedDateRange}
          restrictionRange={customRestrictionRange}
          currYear={currYear}
          onSelect={() => {}}
          onYearChange={onYearChange}
        />);

      wrapper.find('.year-up').simulate('click');

      expect(onYearChange).to.have.property('callCount', 0);
    });
    it('month selection should correspond to the end moment range', () => {
      const selectedDateRange = moment.range(yearStart, yearEnd);
      const currYear = moment(new Date());


      const wrapper = mount(
        <YearEnd
          selectedDateRange={selectedDateRange.clone()}
          restrictionRange={restrictionRange}
          currYear={currYear}
          onSelect={() => {}}
        />);
      expect(wrapper.find('.highlight')).to.have.length(11);
      expect(wrapper.find('.selected').text()).to.equal(selectedDateRange.end.format('MMM'));
    });
  });
});
