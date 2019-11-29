import React from 'react';
import { Stepper as StepperUI, Step, StepButton } from '@material-ui/core';
import { useStyles } from '../NewGame.styles';

interface StepperProps {
  activeStep: number;
  steps: string[];
  completed: number[];
  onStepClick: (step: number) => (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export const Stepper: React.FC<StepperProps> = ({ activeStep, steps, onStepClick, completed }) => {
  const { stepper } = useStyles();

  return (
    <StepperUI alternativeLabel nonLinear activeStep={activeStep} className={stepper}>
      {steps.map((label: string, index: number) => (
        <Step key={label}>
          <StepButton completed={completed.indexOf(index) >= 0} onClick={onStepClick(index)}>
            {label}
          </StepButton>
        </Step>
      ))}
    </StepperUI>
  );
};
