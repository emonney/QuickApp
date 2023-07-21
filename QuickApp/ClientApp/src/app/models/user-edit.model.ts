// ======================================
// Author: Ebenezer Monney
// Copyright (c) 2023 www.ebenmonney.com
// 
// ==> Gun4Hire: contact@ebenmonney.com
// ======================================

import { User } from './user.model';

export class UserEdit extends User {
  constructor(
    public currentPassword?: string,
    public newPassword?: string,
    public confirmPassword?: string) {
    super();
  }
}
