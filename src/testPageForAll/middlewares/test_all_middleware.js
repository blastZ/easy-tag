
const testAllMiddleware = store => next => action => {
  const type = action.type;
  if(type === '') {

  } else {
    next(action);
  }
}

export default testAllMiddleware;
