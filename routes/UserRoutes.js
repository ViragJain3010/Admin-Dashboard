const express = require("express");
const router = express.Router();
const User = require("../model/UsersModel");
const Role = require("../model/RolesModel");

// Get all users with roles and permissions
router.get("/", async (req, res) => {
  try {
    const users = await User.find().populate({
      path: "role",
      populate: { path: "permissions" },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new user
router.post("/", async (req, res) => {
  try {
    const role = await Role.findById(req.body.role);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }
    const user = new User(req.body);
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a user
router.put("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.body.role) {
      const role = await Role.findById(req.body.role);
      if (!role) {
        return res.status(404).json({ message: "Role not found" });
      }
    }

    Object.assign(user, req.body);
    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a user
router.delete("/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
