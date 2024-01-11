// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2024 www.ebenmonney.com/mit-license
// ---------------------------------------

export class User {
  constructor(
    public id = '',
    public userName = '',
    public fullName = '',
    public email = '',
    public jobTitle = '',
    public phoneNumber = '',
    roles: string[] = []
  ) {
    if (roles)
      this.roles = roles;
  }

  get friendlyName() {
    let name = this.fullName || this.userName;

    if (this.jobTitle) {
      name = this.jobTitle + ' ' + name;
    }

    return name;
  }

  public isEnabled = true;
  public isLockedOut = false;
  public roles: string[] = [];
}
