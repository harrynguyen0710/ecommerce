module.exports = async (params, next) => {
    const start = Date.now();
    const result = await next(params);
    const duration = Date.now() - start;

    console.log(`[Prisma] ${params.model}.${params.action} - ${duration}ms`)
    
    return result;
}