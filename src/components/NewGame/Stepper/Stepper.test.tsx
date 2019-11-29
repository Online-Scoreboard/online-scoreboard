import React from 'react';
import { shallow, mount } from 'enzyme';

import { Stepper } from './Stepper';
import { StepButton } from '@material-ui/core';

describe('Stepper', () => {
  it('should render without crashing', () => {
    const activeStep = 0;
    const steps = ['first'];
    const completedSteps: number[] = [];
    const onStepClick = jest.fn();

    shallow(<Stepper activeStep={activeStep} steps={steps} completed={completedSteps} onStepClick={onStepClick} />);

    expect(true).toBeTruthy();
  });

  it.each`
    activeStep | label
    ${0}       | ${'first'}
    ${1}       | ${'second'}
    ${2}       | ${'third'}
  `('should display the "$label" label when the step "$activeStep" is selected', ({ label, activeStep }) => {
    const steps = ['first', 'second', 'third'];
    const completedSteps: number[] = [];
    const onStepClick = jest.fn();

    const wrapper = mount(
      <Stepper activeStep={activeStep} steps={steps} completed={completedSteps} onStepClick={onStepClick} />
    );

    expect(wrapper.find('span.MuiStepLabel-label.MuiStepLabel-active').text()).toBe(label);
  });

  it('should allow clicking on a specific step', () => {
    const steps = ['first', 'second', 'third'];
    const activeStep = 0;
    const completedSteps: number[] = [];
    const onStepClickCallBack = jest.fn();
    const onStepClick = (step: number) => onStepClickCallBack;
    const mockMouseEvent = {} as any;

    const wrapper = mount(
      <Stepper activeStep={activeStep} steps={steps} completed={completedSteps} onStepClick={onStepClick} />
    );

    const secondStepBtn = wrapper
      .find(StepButton)
      .at(1)
      .props();

    secondStepBtn && secondStepBtn.onClick && secondStepBtn.onClick(mockMouseEvent);

    expect(onStepClickCallBack).toBeCalledWith(mockMouseEvent);
  });

  it.each`
    step | label
    ${1} | ${'one'}
    ${2} | ${'second'}
    ${3} | ${'iii'}
  `('should render a "$step" as a step number and a "$label" as label', ({ step, label }) => {
    const steps = ['one', 'second', 'iii'];
    const activeStep = 0;
    const completedSteps: number[] = [];
    const onStepClick = jest.fn();

    const wrapper = mount(
      <Stepper activeStep={activeStep} steps={steps} completed={completedSteps} onStepClick={onStepClick} />
    );

    const stepButton = wrapper.find(StepButton).at(step - 1);
    const buttonProps = stepButton.props();
    const buttonLabel = stepButton.find('span.MuiStepLabel-label').text();

    expect(buttonProps.icon).toBe(step);
    expect(buttonProps.children).toBe(label);
    expect(buttonLabel).toBe(label);
  });
});
