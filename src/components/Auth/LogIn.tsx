import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import { Container, Avatar, Typography, TextField, FormControlLabel, Grid, Link } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { RouteComponentProps } from '@reach/router';
import { useAuth } from './useAuth';
import { useForm } from '../../hooks/useForm';
import { useLoginStyles } from './Login.styles';

export const LogIn: React.FC<RouteComponentProps> = React.memo(() => {
  const initialData = { username: '', password: '' };

  const classes = useLoginStyles();
  const { formData, setFormField, resetForm } = useForm(initialData);
  const { logIn, operationLoading, error } = useAuth();

  useEffect(() => {
    if (error) {
      resetForm();
    }
  }, [error, resetForm]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    logIn(formData.username, formData.password);
  };

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
            disabled={operationLoading}
          >
            {operationLoading && <CircularProgress size={24} className={classes.loader} />}
            Log In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
});
