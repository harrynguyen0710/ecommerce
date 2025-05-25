module.exports = async (params, next) => {
    const start = Date.now();
    const result = await next(params);
    const duration = Date.now() - start;
  
    if (duration > 100) {
      console.warn(`[SLOW QUERY] ${params.model}.${params.action} took ${duration}ms`);
    }
  
    return result;
  };
  