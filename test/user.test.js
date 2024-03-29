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
const loginData = {
  username: users[0].username,
  password: users[0].password,
};
beforeAll(async () => await initializeMongoServer());
afterAll(async () => await closeMongoServer());
beforeEach(async () => {
  await populateTestDB();
  agent = request.agent(app);
  await agent.post("/auth/login").send(loginData);
});
afterEach(async () => await dropDB());

describe("user tests", () => {
  describe("view profile", () => {
    test("view personal profile", async () => {
      const personalProfileResponse = await agent.get(
        "/user/view_personal_profile"
      );
      expect(personalProfileResponse.status).toBe(200);

      const personalProfileBody = personalProfileResponse.body;
      expect(personalProfileBody).toHaveProperty("username", users[0].username);
      expect(personalProfileBody).toHaveProperty("id", users[0].password);
      expect(personalProfileBody).toHaveProperty("password", users[0].password);
      expect(personalProfileBody).toHaveProperty(
        "profilePicURL",
        users[0].profilePicURL
      );
    });
  });
});
