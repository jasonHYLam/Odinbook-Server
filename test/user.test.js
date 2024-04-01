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
const { userIDs } = require("./testData/ids");

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

describe.skip("user tests", () => {
  describe("view profile", () => {
    test("view personal profile", async () => {
      const personalProfileResponse = await agent.get(
        "/user/view_personal_profile"
      );
      expect(personalProfileResponse.status).toBe(200);

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

      const { following } = getFollowingResponse.body;
      expect(following).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            username: users[2].username,
            profilePicURL: users[2].profilePicURL,
          }),
        ])
      );
    });

    // This test fails, currently unknown why.
    test("follow a user", async () => {
      const user_1_ID = userIDs[3];
      const followUserResponse = await agent.post(`/user/${user_1_ID}/follow`);
      expect(followUserResponse.status).toBe(201);

      const { loggedInUser, userFollowing } = followUserResponse.body;
      const loggedInUserFollowing = loggedInUser.following;
      const userFollowingFollowers = userFollowing.followers;

      expect(loggedInUserFollowing).toEqual(
        expect.arrayContaining([userIDs[3]])
      );
      expect(userFollowingFollowers).toEqual(
        expect.arrayContaining([userIDs[0]])
      );
    });

    // unfollow
    test("unfollow a user", async () => {
      const user_2_ID = userIDs[2];
      const unfollowUserResponse = await agent.post(
        `/user/${user_2_ID}/unfollow`
      );
      expect(unfollowUserResponse.status).toBe(201);
      // test that the corresponding user objects lists have removed objects
      const { loggedInUser, userUnfollowed } = unfollowUserResponse.body;
      const loggedInUserFollowing = loggedInUser.following;
      const userUnfollowedFollowers = userUnfollowed.followers;

      expect(loggedInUserFollowing).toEqual(
        expect.not.arrayContaining([userIDs[3]])
      );
      expect(userUnfollowedFollowers).toEqual(
        expect.not.arrayContaining([userIDs[0]])
      );
    });

    test("trying to follow someone who is already followed results in an error", async () => {
      const user_2_ID = userIDs[2];
      const unfollowUserResponse = await agent.post(
        `/user/${user_2_ID}/follow`
      );
      expect(unfollowUserResponse.status).toBe(400);
    });
    test("trying to unfollow someone who is not already followed results in an error", async () => {
      const user_3_ID = userIDs[3];
      const unfollowUserResponse = await agent.post(
        `/user/${user_3_ID}/unfollow`
      );
      expect(unfollowUserResponse.status).toBe(400);
    });
    // cannot follow own account
  });
});
