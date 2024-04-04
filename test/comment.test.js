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
const { commentIDs } = require("./testData/ids");

const IMAGE_1_PATH = "test/testConfig/testUploadImages/weepinbell.png";
const IMAGE_2_PATH = "./testConfig/testUploadImages/lapras.png";

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

describe("comment tests", () => {
  test("get comments for a post", async () => {
    const post_0_ID = postIDs[0];
    const getPostResponse = await agent.get(`/post/${post_0_ID}`);
    expect(getPostResponse.status).toBe(201);

    const { comments } = getPostResponse.body;
    expect(comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          text: comments[0].text,
        }),
        expect.objectContaining({
          text: comments[1].text,
        }),
        expect.objectContaining({
          text: comments[2].text,
        }),
      ])
    );
  });

  describe("write comment", () => {
    test("successfully write comment", async () => {
      const post_0_ID = postIDs[0];
      const writeCommentResponse = await agent
        .post(`/comment/${post_0_ID}/comment`)
        .send({ text: "new comment woo" });
      expect(writeCommentResponse.status).toBe(201);
    });

    test("sends error if comment has no text", async () => {
      const post_0_ID = postIDs[0];
      const writeCommentResponse = await agent
        .post(`/comment/${post_0_ID}/comment`)
        .send({ text: "" });
      expect(writeCommentResponse.status).toBe(400);
    });

    test("sends error if postID is invalid", async () => {
      const writeCommentResponse = await agent
        .post(`/comment/bad_post_id/comment`)
        .send({ text: "new comment woo" });
      expect(writeCommentResponse.status).toBe(400);
    });

    test("sends error if postID doesn't match existing post document", async () => {
      const invalid_ID = userIDs[0];
      const writeCommentResponse = await agent
        .post(`/comment/${invalid_ID}/comment`)
        .send({ text: "new comment woo" });
      expect(writeCommentResponse.status).toBe(400);
    });
  });

  describe("edit comment", () => {
    test("successfully edit comment", async () => {
      const editCommentResponse = await agent
        .put(`/comment/${postIDs[0]}/${commentIDs[0]}/edit`)
        .send({
          text: "Edited 1st comment",
        });

      expect(editCommentResponse.status).toBe(201);

      const { editedComment } = editCommentResponse.body;

      expect(editedComment).toEqual(
        expect.objectContaining({
          text: "Edited 1st comment",
        })
      );
    });
  });
});
