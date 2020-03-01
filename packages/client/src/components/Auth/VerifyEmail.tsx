import React, { useEffect, useState, useCallback, memo } from 'react';
import { Button, Container, Avatar, Typography, TextField, Grid, Link, CircularProgress } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { navigate, RouteComponentProps } from '@reach/router';

import { useForm } from '../../hooks/useForm';
import { useAuth } from '../../hooks/Auth';
import useStyles from './Auth.styles';

const VerifyEmailComponent: React.FC<RouteComponentProps> = () => {
  const initialData = { code: '' };

  const classes = useStyles();
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
    <Container component="main" maxWidth="xs" className={`${classes.root} VerifyEmail`}>
      <Grid container direction="column" alignItems="center">
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h2" variant="h4">
          Verify Email
        </Typography>
      </Grid>

      <div className={classes.paper}>
        <form className={classes.form} onSubmit={handleSubmit} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            id="code"
            label="Verification Code"
            placeholder="Enter your verification code"
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
              <Link variant="caption" color="textSecondary" component="button" onClick={resendCodeHandler}>
                Send another code
              </Link>
            </Grid>
            <Grid item>
              <Link variant="caption" color="textSecondary" href="/login">
                Back to Log In
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

export const VerifyEmail = memo(VerifyEmailComponent);
