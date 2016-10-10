import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow, mount } from 'enzyme';
import moment from 'moment';

import Picker from '../../src/picker';


require('moment-range');

describe('<Picker/>', () => {
  const thisYear = moment.range(new Date(2016, 0, 1), new Date(2016, 11, 1));

  it('renders the component', () => {
    const wrapper = shallow(<Picker selectedDateRange={thisYear} onClick={() => {}} />);

    expect(wrapper.find('.picker')).to.have.length(1);
    expect(wrapper.find('.btn')).to.have.length(1);
    expect(wrapper.find('.date-str')).to.have.length(1);
  });

  it('matches the prop selectedDateRange', () => {
    const wrapper = shallow(<Picker selectedDateRange={thisYear} onClick={() => {}} />);

    expect(wrapper.contains(<strong className="date">Jan, 2016</strong>)).to.equal(true);
    expect(wrapper.contains(<strong className="date">Dec, 2016</strong>)).to.equal(true);
  });

  it('click event to propogate the callback', () => {
    const onButtonClick = sinon.spy();
    const wrapper = mount(<Picker selectedDateRange={thisYear} onClick={onButtonClick} />);
    wrapper.find('button').simulate('click');
    expect(onButtonClick).to.have.property('callCount', 1);
  });
});
