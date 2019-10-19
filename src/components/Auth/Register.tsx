import React, { useEffect, useState, useCallback, memo } from 'react';
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

import { useForm } from '../../hooks/useForm';
import { useData } from '../../hooks/useData';
import useStyles from './Auth.styles';

const RegisterComponent: React.FC<RouteComponentProps> = () => {
  const initialData = { username: '', password: '' };

  const classes = useStyles();
  const { formData, setFormField, resetForm } = useForm(initialData);
  const { register, operationLoading, error } = useData();
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
            id="username"
            name="username"
            autoComplete="username"
            label="Email"
            placeholder="Your email address"
            value={formData.username}
            onChange={setFormField}
            required
            fullWidth
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="password"
            placeholder="Enter a password (min. 6 characters)"
            value={formData.password}
            onChange={setFormField}
            required
            fullWidth
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
                <StyledLink component="span" color="textSecondary" variant="caption">
                  Already registered? Log In
                </StyledLink>
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

export const Register = memo(RegisterComponent);
