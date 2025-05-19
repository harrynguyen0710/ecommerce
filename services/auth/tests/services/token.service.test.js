"use strict";

const redis = require("../../src/configs/redis");
const prisma = require("../../src/configs/__mocks__/prismaClient");
const jwt = require("jsonwebtoken");

const TokenService = require("../../src/services/token.service");

jest.mock("../../src/configs/redis");
jest.mock("../../src/configs/prismaClient");
jest.mock("jsonwebtoken");

describe("TokenService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("generate tokens", () => {
    jwt.sign
      .mockReturnValueOnce("accessToken")
      .mockReturnValueOnce("refreshToken");

    const result = TokenService.generateTokens("user123", process.env.ACCESS_TOKEN_LASTING, process.env.REFRESH_TOKEN_LASTING);

    expect(result).toEqual({
      accessToken: "accessToken",
      refreshToken: "refreshToken",
    });
  });

  test("generate access token", () => {
    jwt.sign.mockReturnValueOnce({
      accessToken: "accessToken",
    });

    const result = TokenService.generateAccessToken("user123");

    expect(result).toEqual({
      accessToken: "accessToken",
    });
  });

  test("store refresh token - success", async () => {
    redis.set.mockResolvedValue();

    prisma.sessions.upsert.mockResolvedValue();

    await expect(
      TokenService.storeRefreshToken("user123", "refreshToken", "device123")
    ).resolves.toBeUndefined();
  });

  test("validate refresh token - valid", async () => {
    redis.get.mockReturnValue("refreshToken");

    prisma.sessions.findUnique.mockReturnValue({
      refreshToken: "refreshToken",
    });

    jest.spyOn(TokenService, "isTokenBlacklisted").mockResolvedValue(null);

    const mockData = {
      userId: "user123",
      deviceId: "device123",
      refreshToken: "refreshToken",
    };

    const result = await TokenService.validateRefreshToken(
      mockData.userId,
      mockData.deviceId,
      mockData.refreshToken
    );

    expect(result).toBe(true);
  });

  test("delete refresh token - success", async () => {
    const mockData = {
      userId: "user123",
      deviceId: "device123",
    };

    await redis.del.mockResolvedValue();
    await prisma.sessions.deleteMany.mockResolvedValue({});

    await expect(
      TokenService.deleteRefreshToken(mockData.userId, mockData.deviceId)
    ).resolves.toBeUndefined();
  });

  test("blacklist token - success", async () => {
    redis.set.mockResolvedValue();

    await expect(
      TokenService.setBlacklistToken("refreshToken")
    ).resolves.toBeUndefined();
  });

  test("get refresh token exists in blacklist - failed", async () => {
    await redis.get.mockReturnValue('refreshToken');

    jest.spyOn(TokenService, "isTokenBlacklisted").mockResolvedValue(true);

    const result = await TokenService.getRefreshToken('user123', 'device123');

    expect(result).toBeNull();
  });


  test("validate token exists in blaclist - failed", async () => {
    jest.spyOn(TokenService, "isTokenBlacklisted").mockResolvedValue(true);

    const result = await TokenService.validateRefreshToken('user123', 'device123');

    expect(result).toBe(false);

  });

  test("validate token exists in database - failed", async () => {
    await prisma.sessions.findUnique.mockReturnValue({
      refreshToken: 'storedRefreshToken',
      expiresAt: new Date(new Date().getTime() + 1000 * 60 * 60) 
    });
  
    const result = await TokenService.validateRefreshToken('user123', 'device123', 'token123');
    
    expect(result).toBe(false);
  });
  
  test("validate token in database - failed due to expiry", async () => {
    await prisma.sessions.findUnique.mockReturnValue({
      refreshToken: 'refreshToken', 
      expiresAt: new Date(new Date().getTime() - 1000 * 60 * 60) 
    });
  
    const result = await TokenService.validateRefreshToken('user123', 'device123', 'refreshToken');
    
    expect(result).toBe(false);
  });
  

});
