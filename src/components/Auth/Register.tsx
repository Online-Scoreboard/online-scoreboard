import React, { useEffect, useState, useCallback } from 'react';
import {
  Button,
  Container,
  Avatar,
  Typography,
  TextField,
  Grid,
  Link as StyledLink,
  CircularProgress,
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { RouteComponentProps, Link } from '@reach/router';

import { useAuth } from './useAuth';
import { useForm } from '../../hooks/useForm';
import { useAuthStyles } from './Auth.styles';

export const Register: React.FC<RouteComponentProps> = React.memo(() => {
  const initialData = { username: '', password: '' };

  const classes = useAuthStyles();
  const { formData, setFormField, resetForm } = useForm(initialData);
  const { register, operationLoading, error } = useAuth();
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

      register(username, password);
    },
    [register, formData]
  );

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Register
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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={operationLoading || !isFormValid}
          >
            {operationLoading && <CircularProgress size={24} className={classes.loader} />}
            Register
          </Button>
          <Grid container>
            <Grid item xs />
            <Grid item>
              <Link to="/login">
                <StyledLink component="span" variant="body2">
                  Already registered? Log In
                </StyledLink>
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
});
