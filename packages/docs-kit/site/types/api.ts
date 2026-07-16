export interface ApiSourceLocation {
  column: number;
  file: string;
  line: number;
}

export interface ApiProperty {
  defaultValue?: string;
  deprecated?: string;
  description?: string;
  inheritedFrom?: string;
  name: string;
  required: boolean;
  since?: string;
  source: ApiSourceLocation;
  type: string;
}

export interface ApiComponent {
  deprecated?: string;
  description?: string;
  name: string;
  properties: ApiProperty[];
  since?: string;
  source: ApiSourceLocation;
}

export interface ApiRequest {
  documentPath: string;
  from?: string;
  name: string;
  tsconfigPath?: string;
}
