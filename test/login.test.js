// test setup
const {
  initializeMongoServer,
  closeMongoServer,
} = require("./testConfig/mongo");
const app = require("./testConfig/testApp");

beforeAll(async () => await initializeMongoServer());
afterAll(async () => await closeMongoServer());
