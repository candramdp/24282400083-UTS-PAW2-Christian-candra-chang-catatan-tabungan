function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validasi database gagal',
      errors: Object.values(error.errors).map((item) => item.message)
    });
  }

  if (error.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Format data atau ID tidak valid'
    });
  }

  console.error(error);
  return res.status(500).json({
    success: false,
    message: 'Terjadi kesalahan pada server'
  });
}

export default errorHandler;
