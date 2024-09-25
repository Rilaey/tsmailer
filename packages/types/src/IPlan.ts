import { TeamPermissions } from "@repo/enums";

interface ITeamManagement {
  description: string;
  numberOfUsers: number;
  roles: string[];
  permissions: TeamPermissions[];
  teamActivityLogs: boolean;
  canUseService: boolean;
}

interface IIpBlackListing {
  description: string;
  canUseService: boolean;
  numberOfIps: number;
}

interface IIpWhiteListing {
  description: string;
  canUseService: boolean;
  numberOfIps: number;
}

interface IDynamicVariables {
  description: string;
  canUseService: boolean;
  listOfVariables: string[];
}

interface IMonthlyRequests {
  description: string;
  numberOfRequests: number;
}

interface ITemplates {
  description: string;
  numberOfTemplates: number;
}

interface IContacts {
  description: string;
  numberOfContacts: number;
}

interface IEmailProviders {
  description: string;
  numberOfProviders: number;
}

interface IAttachmentSize {
  description: string;
  sizeInMb: number;
}

interface IBranding {
  description: string;
  customLogo: boolean;
  removeTsmailerLogo: boolean;
}

interface IDataRetention {
  description: string;
  retentionPeriodInDays: number;
  canUseService: boolean;
}

interface IAnalytics {
  description: string;
  metrics: string[];
  canUseService: boolean;
}

interface ISupport {
  description: string;
  type: string;
  canUseService: boolean;
}

interface IPlan {
  name: string;
  monthlyRequest: IMonthlyRequests;
  templates: ITemplates;
  contacts: IContacts;
  emailProviders: IEmailProviders;
  attachmentSize: IAttachmentSize;
  branding: IBranding;
  dataRetention: IDataRetention;
  analytics: IAnalytics;
  dynamicVariables: IDynamicVariables;
  support: ISupport;
  teamManagement: ITeamManagement;
  ipWhiteListing: IIpWhiteListing;
  ipBlackListing: IIpBlackListing;
  createdDate: string;
  lastModifiedDate: string;
}

export type { IPlan };
