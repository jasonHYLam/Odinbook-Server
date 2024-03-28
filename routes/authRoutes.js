const router = express.Router();
const authController = require("../controller/authController");

router.post("/signup", authController.signup);
