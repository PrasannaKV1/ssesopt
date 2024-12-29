import { Dispatch } from 'redux';

export const apiMiddleware = ({ dispatch }: { dispatch: Dispatch }) => (next: any) => (action: any) => {
  if (typeof action === 'function') {
    return action(dispatch);
  }

  return next(action);
};
