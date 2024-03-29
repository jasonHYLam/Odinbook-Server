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
const posts = require("./testData/posts");

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

      // const personalProfileBody = personalProfileResponse.body;
      const { user, posts } = personalProfileResponse.body;
      expect(user).toHaveProperty("id", users[0]._id.toString());
      expect(user).toHaveProperty("username", users[0].username);
      expect(user).toHaveProperty("profilePicURL", users[0].profilePicURL);

      // this is not the way to use arrayContaining, find another way soon
      // expect(posts).arrayContaining(posts[0]);
    });
  });

  describe("changing properties", () => {
    test("change username", async () => {
      const newUsername = { username: "reallyNewUser" };
      const changeUsernameResponse = await agent
        .put("/user/change_username")
        .send(newUsername);
      expect(changeUsernameResponse.status).toBe(200);

      const personalProfileResponse = await agent.get(
        "/user/view_personal_profile"
      );
      const { user } = personalProfileResponse.body;
      expect(user).toHaveProperty("username", "reallyNewUser");
    });

    test("change password", async () => {
      const newPassword = { password: "reallyNewPassword" };
      const changePasswordResponse = await agent
        .put("/user/change_password")
        .send(newPassword);
      expect(changePasswordResponse.status).toBe(200);

      const personalProfileResponse = await agent.get(
        "/user/view_personal_profile"
      );
      const { user } = personalProfileResponse.body;
      expect(user).toHaveProperty("password", "reallyNewPassword");
    });
  });

  describe("followers list", () => {
    test("getting followers list", async () => {
      const getFollowersResponse = await agent.get("/user/get_followers");
      expect(getFollowersResponse.status).toBe(201);

      const { followers } = getFollowersResponse.body;
      // let's test that this contains array of users
      expect(followers).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            username: users[1].username,
            profilePicURL: users[1].profilePicURL,
          }),
        ])
      );
    });

    test("getting following list", async () => {
      const getFollowingResponse = await agent.get("/user/get_following");
      expect(getFollowingResponse.status).toBe(201);
    });
  });
});
