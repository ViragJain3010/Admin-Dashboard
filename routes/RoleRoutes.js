// routes/RoleRoutes.js
const express = require("express");
const router = express.Router();
const Role = require("../model/RolesModel");
const User = require("../model/UsersModel");
const Permission = require("../model/PermissionsModel");

// Get all roles with populated permissions
router.get("/", async (req, res) => {
  try {
    const roles = await Role.find().lean().exec();
    
    // Get all unique permission IDs from all roles
    const permissionIds = [...new Set(roles.flatMap(role => role.permissions))];
    
    // Get all permission groups that contain our permission IDs
    const permissionGroups = await Permission.find({
      "permissions._id": { $in: permissionIds }
    }).lean().exec();
    
    // Create a map of permission IDs to their full permission objects
    const permissionMap = new Map();
    permissionGroups.forEach(group => {
      group.permissions.forEach(permission => {
        permissionMap.set(permission._id.toString(), {
          id: permission._id.toString(),
          name: permission.name,
          description: permission.description,
          group: group.group // Including the group name can be helpful
        });
      });
    });
    
    // Transform roles with populated permissions
    const transformedRoles = roles.map(role => ({
      id: role._id.toString(),
      name: role.name,
      permissions: role.permissions
        .map(permId => permissionMap.get(permId.toString()))
        .filter(Boolean), // Remove any null values if permission wasn't found
      createdAt: role.createdAt,
      updatedAt: role.updatedAt
    }));

    res.json(transformedRoles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, permissions } = req.body;
    const role = new Role({
      name,
      permissions: permissions.map(p => p.id || p)
    });
    
    const savedRole = await role.save();
    
    // Fetch permissions for the new role
    const permissionGroups = await Permission.find({
      "permissions._id": { $in: savedRole.permissions }
    }).lean().exec();
    
    // Create permission map
    const permissionMap = new Map();
    permissionGroups.forEach(group => {
      group.permissions.forEach(permission => {
        permissionMap.set(permission._id.toString(), {
          id: permission._id.toString(),
          name: permission.name,
          description: permission.description,
          group: group.group
        });
      });
    });
    
    // Transform the response
    const transformedRole = {
      id: savedRole._id.toString(),
      name: savedRole.name,
      permissions: savedRole.permissions
        .map(permId => permissionMap.get(permId.toString()))
        .filter(Boolean),
      createdAt: savedRole.createdAt,
      updatedAt: savedRole.updatedAt
    };

    res.status(201).json(transformedRole);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { name, permissions } = req.body;
    const updatedRole = await Role.findByIdAndUpdate(
      req.params.id,
      { 
        name, 
        permissions: permissions.map(p => p.id || p)
      },
      { new: true }
    ).lean().exec();
    
    // Fetch permissions for the updated role
    const permissionGroups = await Permission.find({
      "permissions._id": { $in: updatedRole.permissions }
    }).lean().exec();
    
    // Create permission map
    const permissionMap = new Map();
    permissionGroups.forEach(group => {
      group.permissions.forEach(permission => {
        permissionMap.set(permission._id.toString(), {
          id: permission._id.toString(),
          name: permission.name,
          description: permission.description,
          group: group.group
        });
      });
    });
    
    // Transform the response
    const transformedRole = {
      id: updatedRole._id.toString(),
      name: updatedRole.name,
      permissions: updatedRole.permissions
        .map(permId => permissionMap.get(permId.toString()))
        .filter(Boolean),
      createdAt: updatedRole.createdAt,
      updatedAt: updatedRole.updatedAt
    };

    res.json(transformedRole);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete route remains the same
router.delete("/:id", async (req, res) => {
  try {
    const usersWithRole = await User.find({ role: req.params.id });
    if (usersWithRole.length > 0) {
      return res
        .status(400)
        .json({ message: "Cannot delete role assigned to users" });
    }
    await Role.findByIdAndDelete(req.params.id);
    res.json({ message: "Role deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;