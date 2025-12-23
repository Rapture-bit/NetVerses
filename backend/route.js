const route = {
  API: [
    {
      name: "Check Email",
      path: "/users/check-email",
      allowedMethods: ["GET"],
      functionFile: "../API/users/checkEmail.js",
      csrfRequired: false,
      rateLimit: {
        max: 10,
      },
    },
    {
      name: "Refresh Token",
      path: "/auth/refresh",
      allowedMethods: ["POST"],
      functionFile: "../API/auth/rotate-token.js",
      csrfRequired: true,
      rateLimit: {
        max: 9000,
      },
    },
    {
      name: "Confirm OTP",
      path: "/otp/confirm",
      allowedMethods: ["POST"],
      functionFile: "../API/otp/otp-confirm.js",
      rateLimit: {
        max: 9000,
      },
    },
    {
      name: "Confirm OTP",
      path: "/otp/request",
      allowedMethods: ["POST"],
      functionFile: "../API/otp/otp-request.js",
      rateLimit: {
        max: 9000,
      },
    },
    {
      name: "Retrieve Feed",
      path: "/feed/retrieve",
      allowedMethods: ["GET"],
      functionFile: "../API/feed/get-feed.js",
      csrfRequired: true,
      rateLimit: {
        max: 100000,
      },
    },
    {
      name: "Check Username",
      path: "/users/check-username",
      allowedMethods: ["GET"],
      functionFile: "../API/users/checkUsername.js",
      rateLimit: {
        max: 15,
      },
    },
    {
      name: "Login",
      path: "/auth/login",
      allowedMethods: ["POST"],
      functionFile: "../API/auth/login.js",
      rateLimit: {
        max: 10,
      },
    },
    {
      name: "Check Country",
      path: "/check-country",
      allowedMethods: ["GET"],
      functionFile: "../API/checkRegion.js",
      rateLimit: {
        max: 25,
      },
    },
    {
      name: "Get Self Information",
      path: "/self",
      allowedMethods: ["POST"],
      functionFile: "../API/users/self.js",
      csrfRequired: false,
      rateLimit: {
        max: 10000,
      },
    },
    {
      name: "Get CSRF Token",
      path: "/security/get-csrf",
      allowedMethods: ["POST"],
      functionFile: "../API/security/get-csrf.js",
      csrfRequired: false,
    },
    {
      name: "User Details",
      path: "/users/:username",
      allowedMethods: ["GET"],
      functionFile: "../API/users/user.js",
      rateLimit: {
        max: 50,
      },
    },
  ],
  Default: [],
};

export default route;
