import React, { memo } from 'react';
import { RouteComponentProps } from '@reach/router';

const NotFoundComponent: React.FC<RouteComponentProps> = () => <p>Sorry, nothing here</p>;

export const NotFound = memo(NotFoundComponent);
