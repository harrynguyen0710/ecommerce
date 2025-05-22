module.exports = function requestTimer(req, res, next) {
  const start = process.hrtime();

  const log = () => {
    const [seconds, nanoseconds] = process.hrtime(start);
    const durationMs = (seconds * 1000 + nanoseconds / 1e6).toFixed(2);
    console.log(`🕒 ${req.method} ${req.originalUrl} - ${res.statusCode} - ${durationMs}ms`);
  };

  res.on('finish', log);
  res.on('close', log); 

  next();
};
