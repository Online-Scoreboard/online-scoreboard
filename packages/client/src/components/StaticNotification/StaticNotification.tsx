import React, { memo } from 'react';
import { Snackbar, SnackbarContent, Button } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';

import { useStyles } from './StaticNotification.styles';

interface SnackbarContentWrapperProps {
  message: string;
  handleOk?: () => void;
  handleCancel?: () => void;
}

const NotificationContent: React.FC<SnackbarContentWrapperProps> = ({ message, handleOk, handleCancel }) => {
  const classes = useStyles();

  return (
    <SnackbarContent
      className={`StaticNotificationBar ${classes.info}`}
      classes={{ root: classes.notificationRoot }}
      aria-describedby="client-static-snackbar"
      message={
        <span id="client-static-snackbar" className={`StaticNotificationBarMessage ${classes.message}`}>
          <InfoIcon className={classes.iconVariant} />
          {message}
        </span>
      }
      action={[
        <Button key="ok" color="default" size="small" onClick={handleOk}>
          Accept
        </Button>,
        <Button key="cancel" color="default" size="small" onClick={handleCancel}>
          Cancel
        </Button>,
      ]}
    />
  );
};

interface NotificationProps {
  message: string | null | undefined;
  open: boolean;
  handleOk?: any;
  handleCancel?: any;
}

const Component: React.FC<NotificationProps> = ({ message, open, handleOk, handleCancel }) => {
  const { notificationRoot } = useStyles();

  if (!message) {
    return null;
  }

  return (
    <Snackbar open={open} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} classes={{ root: notificationRoot }}>
      <NotificationContent message={message} handleOk={handleOk} handleCancel={handleCancel} />
    </Snackbar>
  );
};

export const StaticNotification = memo(Component);
