import React from 'react';
import { shallow, mount } from 'enzyme';

import { Stepper } from './Stepper';

describe('Stepper', () => {
  it('should render without crashing', () => {
    const activeStep = 0;
    const steps = ['first'];

    shallow(<Stepper activeStep={activeStep} steps={steps} />);

    expect(true).toBeTruthy();
  });

  it.each`
    activeStep | label
    ${0}       | ${'first'}
    ${1}       | ${'second'}
    ${2}       | ${'third'}
  `('should display the "$label" label when the step "$activeStep" is selected', ({ label, activeStep }) => {
    const steps = ['first', 'second', 'third'];

    const wrapper = mount(<Stepper activeStep={activeStep} steps={steps} />);

    expect(wrapper.find('span.MuiStepLabel-label.MuiStepLabel-active').text()).toBe(label);
  });
});
