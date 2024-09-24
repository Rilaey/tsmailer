interface IPlan {
  name: string;
  monthlyEmails: number;
  templates: number;
  contacts: number;
  emailProviders: number;
  attachmentSize: number;
  branding: string;
  dataRetention: string;
  analytics: string;
  dynamicVariables: boolean;
  support: string;
  teamManagement: string;
  ipWhiteListing: boolean;
  ipBlackListing: boolean;
  createdDate: string;
  lastModifiedDate: string;
}

export type { IPlan };
