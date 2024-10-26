// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2024 www.ebenmonney.com/mit-license
// ---------------------------------------

import { Environment } from "../app/models/environment.model";

export const environment: Environment = {
  production: true,
  baseUrl: null, // Set to null to use the current host (i.e if the client app and server api are hosted together)
};
