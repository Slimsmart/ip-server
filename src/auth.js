const authenticate = (email, request) => {
  request.session.isLoggedIn = true;
  request.session.email = email;
  return request;
};

const isAuthenticated = (next) => (obj, args, context, info) => {
  if (!context.request.session.isLoggedIn) {
    //check role permissions
    throw new Error("Not Authenticated!");
  }
  return next(obj, args, context, info);
};

module.exports = {
  authenticate,
  isAuthenticated,
};
