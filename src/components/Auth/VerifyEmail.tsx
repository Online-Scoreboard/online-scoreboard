import React, { useEffect, useState, useCallback } from 'react';
import { Button, Container, Avatar, Typography, TextField, Grid, Link, CircularProgress } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { navigate } from '@reach/router';

import { useAuth } from './useAuth';
import { useForm } from '../../hooks/useForm';
import { useAuthStyles } from './Auth.styles';

const VerifyEmailComponent: React.FC = () => {
  const initialData = { code: '' };

  const classes = useAuthStyles();
  const { formData, setFormField, resetForm } = useForm(initialData);
  const { verifyEmail, resendCode, operationLoading, error } = useAuth();
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
    const { code } = formData;
    setIsFormValid(Boolean(code && code.length === 6));
  }, [formData]);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const { code } = formData;

      await verifyEmail(code);
      navigate('/login');
    },
    [verifyEmail, formData]
  );

  const resendCodeHandler = useCallback(
    async (event: any) => {
      event.preventDefault();

      resendCode();
    },
    [resendCode]
  );

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Verify Email
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            id="code"
            label="Verification Code"
            name="code"
            value={formData.code}
            onChange={setFormField}
            required
            fullWidth
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
            Verify Code
          </Button>
          <Grid container>
            <Grid item xs>
              <Link variant="body2" component="button" onClick={resendCodeHandler}>
                Send another code
              </Link>
            </Grid>
            <Grid item>
              <Link href="/login">Back to Log In</Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

export const VerifyEmail = React.memo(VerifyEmailComponent);
