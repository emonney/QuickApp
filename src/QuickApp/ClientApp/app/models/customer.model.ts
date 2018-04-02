export class Customer {

  // Note: Using only optional constructor properties
  // without backing store disables typescript's type checking for the type
  constructor(
    id?: string, name?: string, serviceExpireDate?: Date, serviceMaxUsers?: number,
    ) {

    this.Id = id;
    this.Name = name;
    this.ServiceExpireDate = serviceExpireDate;
    this.ServiceMaxUsers = serviceMaxUsers;
  }

  public Id: string;
  public Name: string;
  public Comment: string;

  public ServiceExpireDate: Date;
  public ServiceMaxUsers: number;
  public ServiceMaxStorageMegabytes: number;

  public PrimaryContactName: string;
  public PrimaryContactEmail: string;
  public PrimaryContactPhoneNumber: string;

  public AlternameContactName: string;
  public AlternateContactEmail: string;
  public AlternateContactPhoneNumber: string;

  public Address: string;
  public City: string;
}