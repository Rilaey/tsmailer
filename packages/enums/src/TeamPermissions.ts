enum TeamPermissions {
  READ = "read", // Can view resources
  WRITE = "write", // Can create or modify resources
  DELETE = "delete", // Can delete resources
  ADMIN = "admin", // Full access, including managing users and settings
  MANAGE_USERS = "manage_users", // Can manage users (invite, remove, assign roles)
  VIEW_ANALYTICS = "view_analytics", // Can view analytics data
  MANAGE_SETTINGS = "manage_settings", // Can adjust system settings
  EXPORT_DATA = "export_data", // Can export data from the system
  MANAGE_BRANDING = "manage_branding" // Can modify branding settings (custom logos, etc.)
}

export { TeamPermissions };
