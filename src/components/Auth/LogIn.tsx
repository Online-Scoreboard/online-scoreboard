import React, { useEffect, useState, useCallback, memo } from 'react';
import {
  Container,
  Avatar,
  Typography,
  TextField,
  FormControlLabel,
  Grid,
  Button,
  Checkbox,
  CircularProgress,
  Link as StyledLink,
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { RouteComponentProps, Link } from '@reach/router';

import { useAuth } from './useAuth';
import { useForm } from '../../hooks/useForm';
import useStyles from './Auth.styles';

const LogInComponent: React.FC<RouteComponentProps> = () => {
  const initialData = { username: '', password: '' };

  const classes = useStyles();
  const { formData, setFormField, resetForm } = useForm(initialData);
  const { logIn, operationLoading, error } = useAuth();
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

      const { username, password } = formData;

      logIn(username, password);
    },
    [formData, logIn]
  );

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Log In
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="email"
            value={formData.username}
            onChange={setFormField}
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={setFormField}
          />
          <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={operationLoading || !isFormValid}
          >
            {operationLoading && <CircularProgress size={24} className={classes.loader} />}
            Log In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link to="/forgot-password">
                <StyledLink component="span" color="textSecondary" variant="caption">
                  Forgot password?
                </StyledLink>
              </Link>
            </Grid>
            <Grid item>
              <Link to="/register">
                <StyledLink component="span" color="textSecondary" variant="caption">
                  Don't have an account? Sign Up
                </StyledLink>
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

export const LogIn = memo(LogInComponent);
