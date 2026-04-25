export default function rateLimiter(options = {}) {
  const {
    windowMs = 60 * 1000,
    max = 60,
    keyGenerator = (req) => req.ip,
  } = options;

  const store = new Map();

  return (req, res, next) => {
    const key = keyGenerator(req);
    const now = Date.now();

    let record = store.get(key);

    if (!record) {
      record = {
        count: 1,
        startTime: now,
      };
      store.set(key, record);
      return next();
    }

    const elapsed = now - record.startTime;

    if (elapsed > windowMs) {
      record.count = 1;
      record.startTime = now;
      store.set(key, record);
      return next();
    }

    record.count++;

    if (record.count > max) {
      return res.status(429).json({
        success: false,
        message: "Too many requests. Please slow down.",
      });
    }

    return next();
  };
}
