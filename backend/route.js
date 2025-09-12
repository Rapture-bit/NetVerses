const route = {
  API: [
    {
      name: "Ping",
      path: "/ping",
      allowedMethods: ["*"],
      functionFile: "../API/ping.js",
      authRequired: false,
      rateLimit: {
        max: 100,
      },
    },
    {
      name: "Check Email",
      path: "/users/check-email",
      allowedMethods: ["GET"],
      functionFile: "../API/users/checkEmail.js",
      authRequired: false,
      rateLimit: {
        max: 10,
      },
    },
    {
      name: "Check Username",
      path: "/users/check-username",
      allowedMethods: ["GET"],
      functionFile: "../API/users/checkUsername.js",
      authRequired: false,
      rateLimit: {
        max: 15,
      },
    },
    {
      name: "Register",
      path: "/auth/register",
      allowedMethods: ["POST"],
      functionFile: "../API/auth/register.js",
      authRequired: false,
      rateLimit: {
        max: 8,
      },
    },
    {
      name: "Login",
      path: "/auth/login",
      allowedMethods: ["POST"],
      functionFile: "../API/auth/login.js",
      authRequired: false,
      rateLimit: {
        max: 4,
      },
    },
    {
      name: "Authentication Status",
      path: "/auth/status",
      allowedMethods: ["*"],
      functionFile: "../API/auth/status.js",
      authRequired: false,
      rateLimit: {
        max: 20,
      },
    },
    {
      name: "Check Country",
      path: "/check-country",
      allowedMethods: ["GET"],
      functionFile: "../API/checkCountry.js",
      authRequired: false,
      rateLimit: {
        max: 25,
      },
    },
    {
      name: "Get Self Information",
      path: "/users/self",
      allowedMethods: ["POST"],
      functionFile: "../API/users/self.js",
      authRequired: true,
      rateLimit: {
        max: 20,
      },
    },
    {
      name: "User Details",
      path: "/users/:username",
      allowedMethods: ["GET"],
      functionFile: "../API/users/user.js",
      authRequired: false,
      rateLimit: {
        max: 50,
      },
    },
  ],
  Default: [],
};

export default route;
