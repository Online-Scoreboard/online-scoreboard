import React, { useEffect, useState, useCallback, memo } from 'react';
import {
  Container,
  Avatar,
  Typography,
  TextField,
  Grid,
  Button,
  CircularProgress,
  Link as StyledLink,
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { RouteComponentProps, Link, navigate } from '@reach/router';

import { useAuth } from './useAuth';
import { useForm } from '../../hooks/useForm';
import useStyles from './Auth.styles';

const ForgottenPasswordComponent: React.FC<RouteComponentProps> = () => {
  const initialData = { email: '', newPassword: '', code: '' };

  const classes = useStyles();
  const { formData, setFormField } = useForm(initialData);
  const { forgottenPassword, operationLoading, showResetPassword, resetPassword } = useAuth();
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    let _isFormValid;

    if (showResetPassword) {
      _isFormValid = Object.values(formData).reduce((acc, curr) => Boolean(acc && curr), true);
    } else {
      _isFormValid = Boolean(formData.email);
    }
    setIsFormValid(_isFormValid);
  }, [formData, showResetPassword]);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const { email, newPassword, code } = formData;

      if (showResetPassword) {
        try {
          await resetPassword(email, code, newPassword);
        } catch (err) {
          return;
        }

        navigate('/login');
        return;
      }

      try {
        await forgottenPassword(email);
      } catch (err) {
        navigate('/login');
        return;
      }
    },
    [formData, forgottenPassword, resetPassword, showResetPassword]
  );

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Forgot your password?
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            placeholder="Enter your Email address"
            type="email"
            id="email"
            name="email"
            label="Email"
            value={formData.email}
            onChange={setFormField}
            required
            fullWidth
            autoFocus
          />
          {showResetPassword && (
            <TextField
              variant="outlined"
              margin="normal"
              placeholder="Enter your verification code"
              id="code"
              name="code"
              label="Verification Code"
              value={formData.code}
              onChange={setFormField}
              autoFocus={showResetPassword}
              required
              fullWidth
            />
          )}
          {showResetPassword && (
            <TextField
              variant="outlined"
              margin="normal"
              type="password"
              placeholder="Enter your new password"
              id="newPassword"
              name="newPassword"
              label="New Password"
              value={formData.newPassword}
              onChange={setFormField}
              required
              fullWidth
            />
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={operationLoading || !isFormValid}
          >
            {operationLoading && <CircularProgress size={24} className={classes.loader} />}
            Reset Password
          </Button>
          <Grid container>
            <Grid item xs />
            <Grid item>
              <Link to="/login">
                <StyledLink component="span" color="textSecondary" variant="caption">
                  Back to Log In
                </StyledLink>
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

export const ForgottenPassword = memo(ForgottenPasswordComponent);