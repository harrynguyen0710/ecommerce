const prismaMock = {
    users: {
        findUnique: jest.fn(),
        create: jest.fn(),
    },
    
    sessions: {
        deleteMany: jest.fn(),
        upsert: jest.fn(),
        findUnique: jest.fn(),
    }
};

module.exports = prismaMock;
