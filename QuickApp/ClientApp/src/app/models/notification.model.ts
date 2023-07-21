// ======================================
// Author: Ebenezer Monney
// Copyright (c) 2023 www.ebenmonney.com
// 
// ==> Gun4Hire: contact@ebenmonney.com
// ======================================

import { Utilities } from '../services/utilities';


export class Notification {
  public id = 0;
  public header = '';
  public body = '';
  public date = new Date();
  public isRead = false;
  public isPinned = false;

  public static Create(data: object) {
    const n = new Notification();
    Object.assign(n, data);

    if (n.date) {
      n.date = Utilities.parseDate(n.date);
    }

    return n;
  }
}
