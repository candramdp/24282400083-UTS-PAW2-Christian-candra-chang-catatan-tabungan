function requestLogger(req, res, next) {
  const timeStart = new Date();

  res.on('finish', () => {
    const timeEnd = new Date();
    const duration = timeEnd.getTime() - timeStart.getTime();

    console.log({
      method: req.method,
      url: req.originalUrl,
      timeStart: timeStart.toISOString(),
      timeEnd: timeEnd.toISOString(),
      duration: `${duration} ms`,
      statusCode: res.statusCode
    });
  });

  next();
}

export default requestLogger;
