// test setup
const {
  initializeMongoServer,
  dropDB,
  closeMongoServer,
} = require("./testConfig/mongo");
const populateTestDB = require("./testConfig/populateTestDB");
const request = require("supertest");
const app = require("./testConfig/testApp");
const users = require("./testData/users");

let agent;
beforeAll(async () => await initializeMongoServer());
afterAll(async () => await closeMongoServer());
beforeEach(async () => {
  await populateTestDB();
  agent = request.agent(app);
});
afterEach(async () => await dropDB());

const loginData = {
  username: users[0].username,
  password: users[0].password,
};

console.log("checking loginData");
console.log(loginData);

describe("login tests", () => {
  describe("signup", () => {
    test("successful sign up", async () => {
      const signUpData = {
        username: "newUser",
        password: "Abc123",
        confirmPassword: "Abc123",
      };
      const signupResponse = await agent.post("/auth/signup").send(signUpData);
      expect(signupResponse.status).toBe(200);
    });
    describe("unsuccessful signups", () => {
      test("username too short", async () => {
        const signUpData = {
          username: "newU",
          password: "Abc123",
          confirmPassword: "Abc123",
        };
        const signupResponse = await agent
          .post("/auth/signup")
          .send(signUpData);
        expect(signupResponse.status).toBe(400);
      });

      test("password too short", async () => {
        const signUpData = {
          username: "newUser",
          password: "Abc1",
          confirmPassword: "Abc1",
        };
        const signupResponse = await agent
          .post("/auth/signup")
          .send(signUpData);
        expect(signupResponse.status).toBe(400);
      });

      test("passwords don't match", async () => {
        const signUpData = {
          username: "newUser",
          password: "Abc123",
          confirmPassword: "Abc1234",
        };
        const signupResponse = await agent
          .post("/auth/signup")
          .send(signUpData);
        expect(signupResponse.status).toBe(400);
      });

      test("being logged in before attempting signup causes authentication error", async () => {
        const signUpData = {
          username: "newUser",
          password: "Abc123",
          confirmPassword: "Abc123",
        };
        const loginResponse = await agent.post("/auth/login").send(loginData);
        const signupResponse = await agent
          .post("/auth/signup")
          .send(signUpData);
        expect(signupResponse.status).toBe(401);
      });
    });
  });

  describe("login", () => {
    test("successful login (valid credentials)", async () => {
      const loginResponse = await agent.post("/auth/login").send(loginData);
      expect(loginResponse.status).toBe(201);
    });

    describe("unsuccessful logins", () => {
      test("non-existing username", async () => {
        const badLoginData = { username: "badUser", password: "Abc123" };
        const loginResponse = await agent
          .post("/auth/login")
          .send(badLoginData);
        expect(loginResponse.status).toBe(401);
      });

      test("non-matching password", async () => {
        const badLoginData = {
          username: users[0].username,
          password: "notRealPassword",
        };
        const loginResponse = await agent
          .post("/auth/login")
          .send(badLoginData);
        expect(loginResponse.status).toBe(401);
      });

      test("attempting second login after already being logged in causes authentication error", async () => {
        const loginResponse = await agent.post("/auth/login").send(loginData);
        const secondLoginResponse = await agent
          .post("/auth/login")
          .send(loginData);
        expect(secondLoginResponse.status).toBe(401);
      });
    });
  });

  describe("logout", () => {
    test("successful logout (after logout)", async () => {
      const loginResponse = await agent.post("/auth/login").send(loginData);
      expect(loginResponse.status).toBe(201);
      const logoutResponse = await agent.delete("/auth/logout");
      expect(logoutResponse.status).toBe(200);
    });
  });

  // describe("isAuthenticated");
});
