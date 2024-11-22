// routes/permissionRoutes.js
const express = require('express')
const router = express.Router()
const Permission = require('../model/PermissionsModel')

// Get all permissions
router.get('/', async (req, res) => {
  try {
    // Populate the permissions field
    const permissions = await Permission.find().populate('permissions');
    res.json(permissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Create or Update a permission
router.post('/', async (req, res) => {
  try {
    const { group, permissions } = req.body;

    // Validate input
    if (!group || !permissions || !Array.isArray(permissions)) {
      return res.status(400).json({ message: 'Invalid input: group and permissions are required' });
    }

    // Find existing group
    let existingPermission = await Permission.findOne({ group });

    if (existingPermission) {
      // Update existing group's permissions
      // Merge new permissions, avoiding duplicates
      const updatedPermissions = [
        ...existingPermission.permissions,
        ...permissions.filter(newPerm => 
          !existingPermission.permissions.some(
            existingPerm => existingPerm.name === newPerm.name
          )
        )
      ];

      existingPermission.permissions = updatedPermissions;
      
      const updatedDoc = await existingPermission.save();
      return res.status(200).json(updatedDoc);
    } else {
      // Create new permission group
      const newPermission = new Permission({
        group,
        permissions
      });

      const savedPermission = await newPermission.save();
      return res.status(201).json(savedPermission);
    }
  } catch (error) {
    console.error('Error in permission creation/update:', error);
    res.status(400).json({ message: error.message })
  }
})

// Update a permission within a group
// Backend Route
router.put('/:groupId/:id', async (req, res) => {
  try {
    const { groupId, id } = req.params;
    const { name, description } = req.body;
    
    // Find the permission group
    const permissionGroup = await Permission.findById(groupId);
    
    if (!permissionGroup) {
      return res.status(404).json({ message: 'Permission group not found' });
    }
    
    // Find and update the specific permission
    const permissionIndex = permissionGroup.permissions.findIndex(
      p => p._id.toString() === id
    );
    
    if (permissionIndex === -1) {
      return res.status(404).json({ message: 'Permission not found in the group' });
    }
    
    // Update the permission
    permissionGroup.permissions[permissionIndex] = {
      ...permissionGroup.permissions[permissionIndex],
      name,
      description
    };
    
    // Save the updated group
    const updatedGroup = await permissionGroup.save();
    
    res.json({
      message: 'Permission updated successfully',
      group: updatedGroup,
      updatedPermission: updatedGroup.permissions[permissionIndex]
    });
    
  } catch (error) {
    console.error('Update permission error:', error);
    res.status(400).json({ message: error.message });
  }
});

// Delete a permission group or individual permission
router.delete('/:groupId/:id', async (req, res) => {
  try {
    const { groupId, id } = req.params;

    // Find the permission group
    const permissionGroup = await Permission.findById(groupId);

    if (!permissionGroup) {
      return res.status(404).json({ message: 'Permission group not found' });
    }

    // Find and remove the specific permission using its ID
    const permissionIndex = permissionGroup.permissions.findIndex(
      p => p._id.toString() === id
    );

    if (permissionIndex === -1) {
      return res.status(404).json({ message: 'Permission not found in the group' });
    }

    // Remove the permission from the array
    permissionGroup.permissions.splice(permissionIndex, 1);

    // If no permissions remain, delete the entire group
    if (permissionGroup.permissions.length === 0) {
      await Permission.findByIdAndDelete(groupId);
      return res.json({ 
        message: 'Permission group deleted as no permissions remain',
        deleted: true,
        groupDeleted: true
      });
    }

    // Save the updated permission group
    const updatedPermissionGroup = await permissionGroup.save();
    
    return res.json({
      message: 'Permission deleted successfully',
      deleted: true,
      groupDeleted: false,
      group: updatedPermissionGroup
    });

  } catch (error) {
    console.error('Delete permission error:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
});

module.exports = router