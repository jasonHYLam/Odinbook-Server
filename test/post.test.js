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
const comments = require("./testData/comments");

const { postIDs } = require("./testData/ids");
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

describe("post tests", () => {
  test("view individual post, which contains comments", async () => {
    const post_0_ID = postIDs[0];
    const getPostResponse = await agent.get(`/post/${post_0_ID}`);
    expect(getPostResponse.status).toBe(201);

    const { post, comments } = getPostResponse.body;

    // expect post to have text, a creator
    expect(post.text).toBe("Test post yup yup");
    expect(post.creator).toBe(userIDs[0].toString());
    expect(post.likedBy).toEqual([
      userIDs[1].toString(),
      userIDs[2].toString(),
      userIDs[3].toString(),
    ]);
    // expect comments to have text and an author
    console.log("checking comments");
    console.log(comments);
    expect(comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          author: userIDs[1],
          post: postIDs[0],
          text: comments[0].text,

          // text:
        }),
      ])
    );
  });
});
