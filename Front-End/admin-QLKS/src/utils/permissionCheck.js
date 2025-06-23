// Permission check utility

// Check if user has specific permission
export const hasPermission = (userPermissions, permissionName) => {
  if (!userPermissions || !Array.isArray(userPermissions)) {
    return false;
  }
  
  return userPermissions.some(permission => 
    permission.permissionName === permissionName
  );
};

// Check if user has any permission for a resource
export const hasResourcePermission = (userPermissions, resource) => {
  if (!userPermissions || !Array.isArray(userPermissions)) {
    return false;
  }
  
  return userPermissions.some(permission => 
    permission.resource === resource
  );
};

// Check if user can create items for a resource
export const canCreate = (userPermissions, resource) => {
  if (!userPermissions || !Array.isArray(userPermissions)) {
    return false;
  }
  
  return userPermissions.some(permission => 
    permission.resource === resource && 
    permission.action === 'create'
  );
};

// Check if user can read items for a resource
export const canRead = (userPermissions, resource) => {
  if (!userPermissions || !Array.isArray(userPermissions)) {
    return false;
  }
  
  return userPermissions.some(permission => 
    permission.resource === resource && 
    permission.action === 'read'
  );
};

// Check if user can update items for a resource
export const canUpdate = (userPermissions, resource) => {
  if (!userPermissions || !Array.isArray(userPermissions)) {
    return false;
  }
  
  return userPermissions.some(permission => 
    permission.resource === resource && 
    permission.action === 'update'
  );
};

// Check if user can delete items for a resource
export const canDelete = (userPermissions, resource) => {
  if (!userPermissions || !Array.isArray(userPermissions)) {
    return false;
  }
  
  return userPermissions.some(permission => 
    permission.resource === resource && 
    permission.action === 'delete'
  );
}; 