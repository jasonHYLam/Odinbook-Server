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

describe.skip("post tests", () => {
  test("view individual post, which contains comments", async () => {
    const post_0_ID = postIDs[0];
    const getPostResponse = await agent.get(`/post/${post_0_ID}`);
    expect(getPostResponse.status).toBe(201);

    const { post, comments } = getPostResponse.body;

    // expect post to have text, a creator
    expect(post.text).toBe(posts[0].text);
    expect(post.creator).toBe(userIDs[0].toString());
    expect(post.likedBy).toEqual([
      userIDs[1].toString(),
      userIDs[2].toString(),
      userIDs[3].toString(),
    ]);
    // expect comments to have text (author object is hard to test)
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

  test("view all posts of user's feed, earliest first", async () => {
    const getAllPostsResponse = await agent.get(`/post/all_posts`);
    expect(getAllPostsResponse.status).toBe(201);
    const { allPosts } = getAllPostsResponse.body;

    // Correct order. Do not use arrayContaining() as it ignores order.
    expect(allPosts).toEqual([
      expect.objectContaining({
        text: posts[2].text,
        likesCount: 2,
      }),
      expect.objectContaining({
        text: posts[1].text,
        likesCount: 3,
      }),
    ]);

    // Incorrect order
    expect(allPosts).not.toEqual([
      expect.objectContaining({
        text: posts[1].text,
      }),
      expect.objectContaining({
        text: posts[2].text,
      }),
    ]);
  });

  describe("creating post", () => {
    test("sucessfully create post", async () => {
      const createPostResponse = await agent
        .post("/post/create_post")
        .send({ text: "4th post!" });
      expect(createPostResponse.status).toBe(201);

      const { newPost } = createPostResponse.body;
      expect(newPost).toEqual(
        expect.objectContaining({
          text: "4th post!",
        })
      );
    });

    test.skip("successfully create post with image uploads", async () => {
      const createPostResponse = await agent
        .post("/post/create_post_with_image")
        .attach("image", IMAGE_2_PATH);
      // .field("text", "4th post with image!");

      expect(createPostResponse.status).toBe(201);

      const { newPost } = createPostResponse.body;
      expect(newPost).toEqual(
        expect.objectContaining({
          imageURL: expect.arrayContaining([expect.any(String)]),
          // text: "4th post with image!",
        })
      );
    });
  });

  describe("editing post", () => {
    test("successfully edit post", async () => {
      const editPostResponse = await agent
        .put(`/post/${postIDs[0]}/edit`)
        .send({ text: "4th post, with an edit!" });
      expect(editPostResponse.status).toBe(201);

      const { editedPost } = editPostResponse.body;
      expect(editedPost).toEqual(
        expect.objectContaining({ text: "4th post, with an edit!" })
      );
    });

    test("send error if postID is invalid", async () => {
      const editPostResponse = await agent
        .put(`/post/bad_post_ID/edit`)
        .send({ text: "4th post, with an edit!" });
      expect(editPostResponse.status).toBe(400);
    });

    test("send error if postID doesn't correspond with existing document", async () => {
      const editPostResponse = await agent
        .put(`/post/${userIDs[0]}/edit`)
        .send({ text: "4th post, with an edit!" });
      expect(editPostResponse.status).toBe(400);
    });
  });

  describe("deleting post", () => {
    test("successfully delete post", async () => {
      const deletePostResponse = await agent.delete(
        `/post/${postIDs[0]}/delete`
      );
      expect(deletePostResponse.status).toBe(201);

      const { deletedPost } = deletePostResponse.body;
      expect(deletedPost).toEqual(
        expect.objectContaining({
          isDeleted: true,
        })
      );
    });

    test("send error if postID is invalid", async () => {
      const deletePostResponse = await agent.delete(`/post/bad_post_ID/delete`);
      expect(deletePostResponse.status).toBe(400);
    });

    test("send error if postID doesn't correspond with existing document", async () => {
      const deletePostResponse = await agent.delete(
        `/post/${userIDs[0]}/delete`
      );
      expect(deletePostResponse.status).toBe(400);
    });
  });

  describe("like/unlike post", () => {
    test("successfully like post", async () => {
      const likePostResponse = await agent.put(`/post/${postIDs[2]}/like`);
      expect(likePostResponse.status).toBe(201);

      const { likedPost } = likePostResponse.body;
      expect(likedPost.likedBy).toContain(userIDs[0].toString());
    });

    test("send error if invalid postID", async () => {
      const likePostResponse = await agent.put(`/post/bad_post_ID/like`);
      expect(likePostResponse.status).toBe(400);
    });

    test("send error if postID doesn't match existing document", async () => {
      const likePostResponse = await agent.put(`/post/${userIDs[0]}/like`);
      expect(likePostResponse.status).toBe(400);
    });

    test("send error if user attempts to like a post that is already liked", async () => {
      const likePostResponse = await agent.put(`/post/${postIDs[1]}/like`);
      expect(likePostResponse.status).toBe(400);
    });

    test("successfully unlike post", async () => {
      const unlikePostResponse = await agent.put(`/post/${postIDs[1]}/unlike`);
      expect(unlikePostResponse.status).toBe(201);

      const { unlikedPost } = unlikePostResponse.body;
      expect(unlikedPost.likedBy).not.toContain(userIDs[0].toString());
    });

    test("send error if invalid postID", async () => {
      const unlikePostResponse = await agent.put(`/post/bad_post_ID/unlike`);
      expect(unlikePostResponse.status).toBe(400);
    });

    test("send error if postID doesn't match existing document", async () => {
      const unlikePostResponse = await agent.put(`/post/${userIDs[0]}/unlike`);
      expect(unlikePostResponse.status).toBe(400);
    });

    test("send error if user attempts to unlike a post that has not been liked", async () => {
      const unlikePostResponse = await agent.put(`/post/${postIDs[2]}/unlike`);
      expect(unlikePostResponse.status).toBe(400);
    });
  });
});
