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

import { useForm } from '../../hooks/useForm';
import { useAuth } from '../../hooks/Auth';
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
    <Container component="main" maxWidth="xs" className={`${classes.root} ForgottenPassword`}>
      <Grid container direction="column" alignItems="center">
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h4">
          Forgot your password?
        </Typography>
      </Grid>

      <div className={classes.paper}>
        <form className={classes.form} onSubmit={handleSubmit} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            placeholder="Your Email address"
            type="email"
            id="email"
            name="email"
            label="Email"
            autoComplete="username"
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
              placeholder="Your new password"
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
