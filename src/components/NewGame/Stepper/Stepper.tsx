import React from 'react';
import { Stepper as StepperUI, Step, StepLabel } from '@material-ui/core';
import { useStyles } from '../NewGame.styles';

interface StepperProps {
  activeStep: number;
  steps: string[];
}

export const Stepper: React.FC<StepperProps> = ({ activeStep, steps }) => {
  const { stepper } = useStyles();

  return (
    <StepperUI alternativeLabel activeStep={activeStep} className={stepper}>
      {steps.map((label: string, index: number) => {
        const stepProps = {};
        const labelProps = {};

        return (
          <Step key={label} {...stepProps}>
            <StepLabel {...labelProps}>{label}</StepLabel>
          </Step>
        );
      })}
    </StepperUI>
  );
};
