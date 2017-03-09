import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import moment from 'moment';

import App from '../../src/app';

require('moment-range');

describe('<app/>', () => {
  describe('props check', () => {
    it('new props should make component re-render', () => {
      const dateRange = moment.range(new Date(2016, 0, 1), new Date(2016, 11, 31));
      const changeDateRange = moment.range(new Date(2016, 1, 1), new Date(2016, 11, 31));
      const wrapper = mount(
        <App
          selectedDateRange={dateRange}
        />
      );
      expect(wrapper.find('.year-start .month').at(0).hasClass('selected')).to.equal(true);
      wrapper.setProps({ selectedDateRange: changeDateRange });
      expect(wrapper.find('.year-start .month').at(1).hasClass('selected')).to.equal(true);
    });
  });
  describe('check callbacks', () => {
    it('onRender', () => {
      const onRender = sinon.spy();

      mount(<App
        onRender={onRender}
      />);

      expect(onRender).to.have.property('callCount', 1);
    });
    it('onSelect', () => {
      const onSelect = sinon.spy();

      const wrapper = mount(<App
        onSelect={onSelect}
      />);

      wrapper.find('.year-start .cal-month').at(0).simulate('click');
      expect(onSelect).to.have.property('callCount', 1);
    });
    it('onApply', () => {
      const onApply = sinon.spy();

      const wrapper = mount(<App
        onApply={onApply}
      />);

      wrapper.find('.shortcuts .btn-success').simulate('click');
      expect(onApply).to.have.property('callCount', 1);
    });
    it('onCancel', () => {
      const onCancel = sinon.spy();

      const wrapper = mount(<App
        onCancel={onCancel}
      />);

      wrapper.find('.shortcuts .btn-default').at(0).simulate('click');
      expect(onCancel).to.have.property('callCount', 1);
    });
  });
  describe('calendar display', () => {
    it('display none initial', () => {
      const wrapper = mount(<App />);
      wrapper.find('.popover').render();
      expect(wrapper.find('.popover').node.style.display).to.equal('none');
    });
    it('display block on picker click', () => {
      const wrapper = mount(<App />);
      wrapper.find('.picker .btn').simulate('click');
      wrapper.find('.popover').render();
      expect(wrapper.find('.popover').node.style.display).to.equal('block');
      wrapper.find('.picker .btn').simulate('click');
      expect(wrapper.find('.popover').node.style.display).to.equal('block');
    });
  });
});
