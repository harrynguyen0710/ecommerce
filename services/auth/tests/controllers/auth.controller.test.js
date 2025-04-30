"use strict";

const request = require("supertest");
const app = require("../../src/app");

const prismaClient = require("../../src/configs/__mocks__/prismaClient");

const AuthService = require("../../src/services/auth.service");

jest.mock("../../src/services/auth.service");

describe("AuthController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("POST /auth/signup - success", async () => {
    AuthService.signup.mockResolvedValue("test@example.com");

    const response = await request(app).post("/v1/api/auth/signup").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("signed up successfully");
    expect(response.body.metadata).toBe("test@example.com");
    expect(response.body.status).toBe(201);
  });

  test("POST /auth/login - success", async () => {
    const mockData = {
      accessToken: "accessToken",
      refreshToken: "refreshToken",
    };

    AuthService.login.mockResolvedValue(mockData);

    const response = await request(app).post("/v1/api/auth/login").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("logged in successfully");
    expect(response.body.metadata).toStrictEqual(mockData);
    expect(response.body.status).toBe(200);
  });

  test("POST /auth/logout - success", async () => {
    AuthService.logout.mockResolvedValue();

    const response = await request(app).post("/v1/api/auth/logout").send({
      userId: "user123",
      deviceId: "device123",
      refreshToken: "refresh",
    });

    expect(response.status).toBe(204);
    expect(response.body).toEqual({});
  });
});
