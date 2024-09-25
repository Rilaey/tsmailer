enum Role {
  OWNER = "owner", // Full control over the team and settings
  ADMIN = "admin", // Can manage the team, settings, and members
  MEMBER = "member", // Regular member with basic permissions
  GUEST = "guest" // Limited access to team features, view-only in most cases
}

export { Role };
