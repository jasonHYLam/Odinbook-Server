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

describe("login tests", () => {
  describe("signup", () => {
    test("successful sign up", async () => {
      const signUpData = { username: "newUser", password: "Abc123" };
      const signupResponse = await agent.post("/auth/signup").send(signUpData);
      expect(signupResponse.status).toBe(200);
    });
  });
  describe.skip("login", () => {
    test("successful login (valid credentials)", async () => {
      const loginResponse = await agent.post("/auth/login").send(loginData);
      expect(loginResponse.status).toBe(200);
    });
  });
});
