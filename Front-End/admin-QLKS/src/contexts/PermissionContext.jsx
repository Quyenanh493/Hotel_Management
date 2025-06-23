import { createContext, useState, useEffect, useContext } from 'react';
import { getUserPermissions } from '../services/userService';
import { 
  hasPermission, 
  hasResourcePermission, 
  canCreate, 
  canRead, 
  canUpdate, 
  canDelete 
} from '../utils/permissionCheck';

const PermissionContext = createContext();

export const usePermissions = () => useContext(PermissionContext);

export const PermissionProvider = ({ children }) => {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUserPermissions = async () => {
      try {
        setLoading(true);
        // Get current user ID from localStorage
        const userData = JSON.parse(localStorage.getItem('user'));
        
        if (!userData || !userData.accountId) {
          setLoading(false);
          return;
        }
        
        // Check if user is admin first - prioritize this condition
        if (userData.accountType === 'admin') {
          // Set admin as having all permissions by default
          const adminPermissions = [
            // Users
            { permissionId: 1, permissionName: 'create_user', resource: 'users', action: 'create' },
            { permissionId: 2, permissionName: 'read_user', resource: 'users', action: 'read' },
            { permissionId: 3, permissionName: 'update_user', resource: 'users', action: 'update' },
            { permissionId: 4, permissionName: 'delete_user', resource: 'users', action: 'delete' },
            // Roles
            { permissionId: 5, permissionName: 'create_role', resource: 'roles', action: 'create' },
            { permissionId: 6, permissionName: 'read_role', resource: 'roles', action: 'read' },
            { permissionId: 7, permissionName: 'update_role', resource: 'roles', action: 'update' },
            { permissionId: 8, permissionName: 'delete_role', resource: 'roles', action: 'delete' },
            // Rooms
            { permissionId: 9, permissionName: 'create_room', resource: 'rooms', action: 'create' },
            { permissionId: 10, permissionName: 'read_room', resource: 'rooms', action: 'read' },
            { permissionId: 11, permissionName: 'update_room', resource: 'rooms', action: 'update' },
            { permissionId: 12, permissionName: 'delete_room', resource: 'rooms', action: 'delete' },
            // Hotel
            { permissionId: 13, permissionName: 'create_hotel', resource: 'hotel', action: 'create' },
            { permissionId: 14, permissionName: 'read_hotel', resource: 'hotel', action: 'read' },
            { permissionId: 15, permissionName: 'update_hotel', resource: 'hotel', action: 'update' },
            { permissionId: 16, permissionName: 'delete_hotel', resource: 'hotel', action: 'delete' },
            // Customers
            { permissionId: 17, permissionName: 'create_customer', resource: 'customers', action: 'create' },
            { permissionId: 18, permissionName: 'read_customer', resource: 'customers', action: 'read' },
            { permissionId: 19, permissionName: 'update_customer', resource: 'customers', action: 'update' },
            { permissionId: 20, permissionName: 'delete_customer', resource: 'customers', action: 'delete' },
            // Bookings
            { permissionId: 21, permissionName: 'create_booking', resource: 'bookings', action: 'create' },
            { permissionId: 22, permissionName: 'read_booking', resource: 'bookings', action: 'read' },
            { permissionId: 23, permissionName: 'update_booking', resource: 'bookings', action: 'update' },
            { permissionId: 24, permissionName: 'delete_booking', resource: 'bookings', action: 'delete' },
            // Payments
            { permissionId: 25, permissionName: 'create_payment', resource: 'payments', action: 'create' },
            { permissionId: 26, permissionName: 'read_payment', resource: 'payments', action: 'read' },
            { permissionId: 27, permissionName: 'update_payment', resource: 'payments', action: 'update' },
            { permissionId: 28, permissionName: 'delete_payment', resource: 'payments', action: 'delete' },
            // Amenities
            { permissionId: 29, permissionName: 'create_amenity', resource: 'amenities', action: 'create' },
            { permissionId: 30, permissionName: 'read_amenity', resource: 'amenities', action: 'read' },
            { permissionId: 31, permissionName: 'update_amenity', resource: 'amenities', action: 'update' },
            { permissionId: 32, permissionName: 'delete_amenity', resource: 'amenities', action: 'delete' }
          ];
          setPermissions(adminPermissions);
          setLoading(false);
          return;
        }
        
        // For non-admin users, fetch permissions from API
        const response = await getUserPermissions(userData.accountId);
        
        if (response && response.DT && response.DT.permissions) {
          setPermissions(response.DT.permissions);
        } else {
          console.log("DEBUG - No permissions found in response");
        }
      } catch (error) {
        console.error('Error fetching user permissions:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserPermissions();
  }, []);
  
  // Debug permission checks
  const debugPermissionCheck = (resource, action, result) => {
    console.log(`DEBUG - Permission check: ${action} ${resource} = ${result}`);
    console.log(`DEBUG - Current permissions:`, permissions);
    return result;
  };
  
  const permissionUtils = {
    hasPermission: (permissionName) => hasPermission(permissions, permissionName),
    hasResourcePermission: (resource) => hasResourcePermission(permissions, resource),
    canCreate: (resource) => debugPermissionCheck(resource, 'create', canCreate(permissions, resource)),
    canRead: (resource) => debugPermissionCheck(resource, 'read', canRead(permissions, resource)),
    canUpdate: (resource) => debugPermissionCheck(resource, 'update', canUpdate(permissions, resource)),
    canDelete: (resource) => debugPermissionCheck(resource, 'delete', canDelete(permissions, resource)),
    permissionsList: permissions,
    isLoading: loading
  };
  
  return (
    <PermissionContext.Provider value={permissionUtils}>
      {children}
    </PermissionContext.Provider>
  );
}; 