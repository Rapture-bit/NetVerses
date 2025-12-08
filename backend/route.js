const route = {
  API: [
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
      name: "Refresh Token",
      path: "/auth/refresh",
      allowedMethods: ["POST"],
      functionFile: "../API/auth/rotate-token.js",
      authRequired: false,
      rateLimit: {
        max: 9000,
      },
    },
    {
      name: "Retrieve Feed",
      path: "/feeds",
      allowedMethods: ["GET"],
      functionFile: "../API/feed/get-feed.js",
      authRequired: false,
      rateLimit: {
        max: 9000,
      },
    },
    {
      name: "Confirm OTP",
      path: "/otp/confirm",
      allowedMethods: ["POST"],
      functionFile: "../API/otp/otp-confirm.js",
      authRequired: false,
      rateLimit: {
        max: 9000,
      },
    },
    {
      name: "Confirm OTP",
      path: "/otp/request",
      allowedMethods: ["POST"],
      functionFile: "../API/otp/otp-request.js",
      authRequired: false,
      rateLimit: {
        max: 9000,
      },
    },
    {
      name: "Retrieve Feed",
      path: "/feed/retrieve",
      allowedMethods: ["GET"],
      functionFile: "../API/feed/get-feed.js",
      authRequired: false,
      rateLimit: {
        max: 10000000000000,
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
      name: "Login",
      path: "/auth/login",
      allowedMethods: ["POST"],
      functionFile: "../API/auth/login.js",
      authRequired: false,
      rateLimit: {
        max: 10,
      },
    },
    {
      name: "Check Country",
      path: "/check-country",
      allowedMethods: ["GET"],
      functionFile: "../API/checkRegion.js",
      authRequired: false,
      rateLimit: {
        max: 25,
      },
    },
    {
      name: "Get Self Information",
      path: "/self",
      allowedMethods: ["GET"],
      functionFile: "../API/users/self.js",
      authRequired: true,
      rateLimit: {
        max: 10000,
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
    {
      name: "Translate Content",
      path: "/services/translate",
      allowedMethods: ["GET"],
      functionFile: "../API/services/translate.js",
      authRequired: false,
      rateLimit: {
        max: 10000000000000,
      },
    },
  ],
  Default: [],
};

export default route;
