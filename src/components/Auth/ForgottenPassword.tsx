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
import { RouteComponentProps, Link } from '@reach/router';

import { useAuth } from './useAuth';
import { useForm } from '../../hooks/useForm';
import useStyles from './Auth.styles';

const ForgottenPasswordComponent: React.FC<RouteComponentProps> = () => {
  const initialData = { email: '' };

  const classes = useStyles();
  const { formData, setFormField, resetForm } = useForm(initialData);
  const { forgottenPassword, operationLoading, error } = useAuth();
  const [errorState, setErrorState] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (!error) {
      setErrorState(false);
    }
    if (error && !errorState) {
      resetForm();
      setErrorState(true);
    }
  }, [error, resetForm, errorState]);

  useEffect(() => {
    const _isFormValid = Object.values(formData).reduce((acc, curr) => Boolean(acc && curr), true);
    setIsFormValid(_isFormValid);
  }, [formData]);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const { email } = formData;

      forgottenPassword(email);
    },
    [formData, forgottenPassword]
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
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            value={formData.email}
            onChange={setFormField}
            autoFocus
          />
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
