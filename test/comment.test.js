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

describe.skip("comment tests", () => {
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

    test("sends error if edit text is empty", async () => {
      const editCommentResponse = await agent
        .put(`/comment/${postIDs[0]}/${commentIDs[0]}/edit`)
        .send({ text: "" });
      expect(editCommentResponse.status).toBe(400);
    });

    test("sends error if postID is not a valid objectID", async () => {
      const editCommentResponse = await agent
        .put(`/comment/bad_post_ID/${commentIDs[0]}/edit`)
        .send({ text: "Edited 1st comment" });
      expect(editCommentResponse.status).toBe(400);
    });

    test("sends error if commentID is not a valid objectID", async () => {
      const editCommentResponse = await agent
        .put(`/comment/${postIDs[0]}/bad_comment_ID/edit`)
        .send({ text: "Edited 1st comment" });
      expect(editCommentResponse.status).toBe(400);
    });

    test("sends error if postID doesn't match existing document", async () => {
      const bad_post_ID = userIDs[0];
      const editCommentResponse = await agent
        .put(`/comment/${bad_post_ID}/${commentIDs[0]}/edit`)
        .send({ text: "Edited 1st comment" });
      expect(editCommentResponse.status).toBe(400);
    });

    test("sends error if commentID doesn't match existing document", async () => {
      const bad_post_ID = userIDs[0];
      const editCommentResponse = await agent
        .put(`/comment/${postIDs[0]}/${bad_post_ID}/edit`)
        .send({ text: "Edited 1st comment" });
      expect(editCommentResponse.status).toBe(400);
    });

    test("sends error if comment does not correspond to post comments", async () => {
      const editCommentResponse = await agent
        .put(`/comment/${postIDs[0]}/${commentIDs[3]}/edit`)
        .send({ text: "Edited 1st comment" });
      expect(editCommentResponse.status).toBe(400);
    });
  });

  describe("delete comments", () => {
    test("successfully delete existing comment", async () => {
      const deleteCommentResponse = await agent.delete(
        `/comment/${postIDs[0]}/${commentIDs[0]}/delete`
      );
      expect(deleteCommentResponse.status).toBe(200);
      const { deletedComment } = deleteCommentResponse.body;
      expect(deletedComment).toEqual(
        expect.objectContaining({
          text: "This comment has been deleted",
          isDeleted: true,
        })
      );
    });

    test("send error if postID is invalid", async () => {
      const deleteCommentResponse = await agent.delete(
        `/comment/bad_post_ID/${commentIDs[0]}/delete`
      );
      expect(deleteCommentResponse.status).toBe(400);
    });

    test("sends error if commentID is not a valid objectID", async () => {
      const deleteCommentResponse = await agent.delete(
        `/comment/${postIDs[0]}/bad_comment_ID/delete`
      );
      expect(deleteCommentResponse.status).toBe(400);
    });

    test("sends error if postID doesn't match existing document", async () => {
      const bad_post_ID = userIDs[0];
      const deleteCommentResponse = await agent.delete(
        `/comment/${bad_post_ID}/${commentIDs[0]}/delete`
      );
      expect(deleteCommentResponse.status).toBe(400);
    });

    test("sends error if commentID doesn't match existing document", async () => {
      const bad_post_ID = userIDs[0];
      const deleteCommentResponse = await agent.delete(
        `/comment/${postIDs[0]}/${bad_post_ID}/delete`
      );
      expect(deleteCommentResponse.status).toBe(400);
    });

    test("sends error if comment does not correspond to post comments", async () => {
      const deleteCommentResponse = await agent.delete(
        `/comment/${postIDs[0]}/${commentIDs[3]}/delete`
      );
      expect(deleteCommentResponse.status).toBe(400);
    });
  });
});
