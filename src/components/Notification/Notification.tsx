import React, { memo, useMemo } from 'react';
import { Snackbar, SnackbarContent } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import WarningIcon from '@material-ui/icons/Warning';
import InfoIcon from '@material-ui/icons/Info';
import { useStyles } from './Notification.styles';
import withWidth, { WithWidth, isWidthDown } from '@material-ui/core/withWidth';

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

interface SnackbarContentWrapperProps {
  message: string;
  variant: 'error' | 'info' | 'success' | 'warning';
}

const NotificationContent: React.FC<SnackbarContentWrapperProps> = ({ message, variant }) => {
  const classes = useStyles();
  const Icon = variantIcon[variant];

  return (
    <SnackbarContent
      className={classes[variant]}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <Icon className={classes.iconVariant} />
          {message}
        </span>
      }
    />
  );
};

export type NotificationVariant = 'error' | 'info' | 'success' | 'warning';

interface NotificationProps extends WithWidth {
  message: string | null | undefined;
  variant: NotificationVariant;
  open: boolean;
  handleClose?: () => void;
}

const NotificationComponent: React.FC<NotificationProps> = ({ message, variant, open, width }) => {
  const isMobile = useMemo(() => isWidthDown('sm', width), [width]);

  if (!message) {
    return null;
  }

  return (
    <Snackbar open={open} anchorOrigin={{ vertical: isMobile ? 'bottom' : 'top', horizontal: 'center' }}>
      <NotificationContent message={message} variant={variant} />
    </Snackbar>
  );
};

export const Notification = memo(withWidth()(NotificationComponent));
