const express = require("express");
const multer = require("multer");
const storage = multer.memoryStorage();
const limits = {
  fieldSize: 1024 * 1024 * 30, // limit to 30MB
};
const upload = multer({ storage, limits });
const auth = require("../middleware/auth");
const {
  createUSer,
  loadUser,
  login,
  logout,
  updateAccount,
  follow,
  unFollow,
  getByUserName,
  getAllUsers,
  getUserById,
  getUserSuggestions,
  deleteUser,
} = require("../controllers/userControllers");

const router = express.Router();

router.post("/create", createUSer);
router.get("/loadUser", loadUser);
router.post("/login", login);
router.get("/logout", auth, logout);
router.put("/:userId/update", upload.single("image"), updateAccount);
router.put("/:userId/follow", follow);
router.put("/:userId/unfollow", unFollow);
router.get("/:userName", getByUserName);
router.get("/", getAllUsers);
router.get("/:userId/userId", getUserById);
router.get("/:userLoggedIn/suggestions", getUserSuggestions);
router.delete("/:userId/delete", deleteUser);

module.exports = router;
