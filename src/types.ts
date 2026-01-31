export interface Service {
  name: string;
  type: string;
  port: number;
  host?: string;
  domain?: string;
  text?: string[];
}

export interface Config {
  services: Service[];
}
