// ======================================
// Author: Ebenezer Monney
// Copyright (c) 2023 www.ebenmonney.com
// 
// ==> Gun4Hire: contact@ebenmonney.com
// ======================================

import { Permission } from './permission.model';

export class Role {
  constructor(
    public name = '',
    public description = '',
    public permissions: Permission[] = []
  ) { }

  public id = '';
  public usersCount = 0;
}
