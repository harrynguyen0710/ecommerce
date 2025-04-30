"use strict";

const AuthService = require("../../src/services/auth.service");
const TokenService = require("../../src/services/token.service");

const prisma = require("../../src/configs/prismaClient");

const bcrypt = require("bcrypt");
const { BadRequestError, ForbiddenError } = require("../../src/helpers/errors.response");

jest.mock("../../src/configs/prismaClient", () => ({
  users: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock("../../src/services/token.service");
jest.mock("bcrypt");

describe("AuthService", () => {
  // clear all mocks before each test to avoid side effects
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("signup should return a new user successfully", async () => {
    const mockUser = {
      email: "testAccount@example.com",
      password: "password",
    };

    // findUnique returns null as expected
    prisma.users.findUnique.mockResolvedValue(null);

    // hash password
    bcrypt.hash.mockResolvedValue(mockUser.password);

    // create user
    prisma.users.create.mockResolvedValue(mockUser);

    const result = await AuthService.signup({
      email: mockUser.email,
      password: "password123",
    });

    expect(result).toBe(mockUser.email);
    expect(prisma.users.create).toHaveBeenCalledWith({
      data: {
        email: mockUser.email,
        password: mockUser.password,
      },
    });
  });

  test("signup - existing user", async () => {
    prisma.users.findUnique.mockResolvedValue({ email: "test@example.com" });

    await expect(
        AuthService.signup({
        email: "test@example.com",
        password: "password123",
      })
    ).rejects.toThrow(BadRequestError);
  });

  test("signup - invalid email", async () => {
    prisma.users.findUnique.mockResolvedValue({ email: "", password: "password123" });

    await expect(
        AuthService.signup({
            email: "",
            password: "password123",
          })
    ).rejects.toThrow(BadRequestError);
  });

  test("signup - create user fails", async () => {
    prisma.users.findUnique.mockResolvedValue({
      email: 'test@example.comm'
    });

    await expect(
        AuthService.signup({
            email: "test@example.com",
            password: "password123",
        })
    ).rejects.toThrow(BadRequestError);

  });

  test("signup - invalid password", async () => {
    prisma.users.findUnique.mockResolvedValue({ email: "test@example.com", password: "" });

    await expect(
        AuthService.signup({
            email: "test@example.com",
            password: "",
          })
    ).rejects.toThrow(BadRequestError);
  });

  test("login - successfully", async () => {
    const mockUser = {
      id: "user123",
      email: "test@example.com",
      password: "password123",
      sessions: [],
    };

    prisma.users.findUnique.mockResolvedValue(mockUser);

    // mock compare hashed password
    bcrypt.compare.mockResolvedValue(true);

    // mock generate tokens
    TokenService.generateTokens.mockReturnValue({
      accessToken: "access",
      refreshToken: "refresh",
    });

    const result = await AuthService.login({
      email: "test@example.com",
      password: "password123",
      deviceId: "device123",
    });

    expect(result).toEqual({
      accessToken: "access",
      refreshToken: "refresh",
    });
  });

  test("login - wrong password", async () => {
    prisma.users.findUnique.mockResolvedValue({
      email: "test@example.com",
      password: "hashedPassword",
    });

    bcrypt.compare.mockResolvedValue(false);

    await expect(
        AuthService.login({
            email: "test@example.com",
            password: "wrongPassword",
            deviceId: "device123",
          })
    ).rejects.toThrow(BadRequestError);
  });

  test("login - wrong email", async () => {
    prisma.users.findUnique.mockResolvedValue({ email: "test@example.com" });

    await expect(AuthService.login({
        email: "new@example.com",
        password: "password123",
        deviceId: "device123",
      })).rejects.toThrow(BadRequestError);
  });


  test("login - wrong account", async () => {
    prisma.users.findUnique.mockResolvedValue(null);

    await expect(AuthService.login({
        email: "new@example.com",
        password: "password123",
        deviceId: "device123",
      })).rejects.toThrow(BadRequestError);
  });

  test("logout - success", async () => {
    // set black list token
    TokenService.setBlacklistToken.mockResolvedValue();

    // delete refresh token
    TokenService.deleteRefreshToken.mockResolvedValue();

    const mockData = {
        refreshToken: "refresh",
        deviceId: "device123",
        userId: "user123",
    };

    await AuthService.logout(mockData);

    expect(TokenService.setBlacklistToken).toHaveBeenCalledWith(mockData.refreshToken);
    expect(TokenService.deleteRefreshToken).toHaveBeenCalledWith(mockData.userId, mockData.deviceId);
    
  });

  test('get access token - success', async () => {
    TokenService.validateRefreshToken.mockResolvedValue(true);

    // mock returned access token
    TokenService.generateAccessToken.mockReturnValue('access');

    const result = await AuthService.getAccessToken({
        refreshToken: 'refresh',
        userId: 'user123',
        deviceId: 'device123',
    });

    expect(result).toEqual('access');
  })

  test('get access token - invalid refresh token', async () => {
    TokenService.validateRefreshToken.mockResolvedValue(false);

    await expect(
        AuthService.getAccessToken({
            refreshToken: 'refresh',
            userId: 'user123',
            deviceId: 'device123',
        })
    ).rejects.toThrow();

  });

  test('get access token - fails to get one', async () => {
    TokenService.generateAccessToken.mockReturnValue(null);

    await expect(
        AuthService.getAccessToken({
            refreshToken: 'refresh',
            userId: 'user123',
            deviceId: 'device123',           
        })
    ).rejects.toThrow(ForbiddenError);

  });

  test('logout all - success', async () => {
    await TokenService.deleteAllRefreshTokens.mockResolvedValue();

    const userId = 'user123'

    await AuthService.logoutAll({ userId: userId });

    await expect(TokenService.deleteAllRefreshTokens).toHaveBeenCalledWith(userId);

  })

});
