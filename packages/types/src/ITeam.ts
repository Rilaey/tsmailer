import { Role, TeamPermissions } from "@repo/enums";
import { ObjectId } from "mongoose";

interface ITeamMember {
  userId: ObjectId;
  role: Role;
  permissions: TeamPermissions[];
}

interface ITeam {
  _id: ObjectId;
  name: string;
  description: string;
  members: ITeamMember[];
  createdAt: string;
  updatedAt: string;
}

export type { ITeam };
