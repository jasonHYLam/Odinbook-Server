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

console.log("checking users");
console.log(users);

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
  describe("login", () => {
    test("successful login (valid credentials)", async () => {
      const loginResponse = await agent.post("/login").send(loginData);
      expect(loginResponse.status).toBe(200);
    });
  });
});
