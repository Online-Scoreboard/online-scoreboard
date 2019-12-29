import React, { memo } from 'react';
import { Typography, Link, Container, Grid } from '@material-ui/core';
import useStyles from './Footer.styles';

export const footers = [
  {
    title: 'Company',
    description: ['Team', 'History', 'Contact us', 'Locations'],
  },
  {
    title: 'Features',
    description: ['Cool stuff', 'Random feature', 'Team feature', 'Developer stuff', 'Another one'],
  },
  {
    title: 'Resources',
    description: ['Resource', 'Resource name', 'Another resource', 'Final resource'],
  },
  {
    title: 'Legal',
    description: ['Privacy policy', 'Terms of use'],
  },
];

const FooterComponent: React.FC = () => {
  const classes = useStyles();

  return (
    <Container maxWidth="lg" component="footer" className={classes.footer}>
      <Grid container spacing={4} justify="space-evenly">
        {footers.map(footer => (
          <Grid item xs={6} sm={3} key={footer.title}>
            <Typography variant="h6" color="textPrimary" gutterBottom>
              {footer.title}
            </Typography>
            <ul>
              {footer.description.map(item => (
                <li key={item}>
                  <Link href="#" variant="subtitle1" color="textSecondary">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </Grid>
        ))}
      </Grid>
      <div className={`copyright ${classes.copyright}`}>
        <Typography variant="body2" color="textSecondary" align="center">
          {'Copyright © '}
          <Link color="inherit" href="https://github.com/andreasonny83/">
            @andreasonny83
          </Link>
          {' ' + new Date().getFullYear()}. Built with ❤️.
        </Typography>
      </div>
    </Container>
  );
};

export const Footer = memo(FooterComponent);
