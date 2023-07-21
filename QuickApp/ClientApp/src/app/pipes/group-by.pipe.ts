// ======================================
// Author: Ebenezer Monney
// Copyright (c) 2023 www.ebenmonney.com
// 
// ==> Gun4Hire: contact@ebenmonney.com
// ======================================

import { Pipe, PipeTransform } from '@angular/core';

type Any = { [key: string | number]: string | number };
type Result = { key: string, value: Any[] }[] | null;


@Pipe({ name: 'groupBy' })
export class GroupByPipe implements PipeTransform {
  transform(collection: unknown, property: string): Result {
    if (!collection) {
      return null;
    }

    const groupedCollection = (collection as Any[]).reduce((previous, current) => {
      if (!previous[current[property]]) {
        previous[current[property]] = [current];
      } else {
        previous[current[property]].push(current);
      }

      return previous;
    }, {} as { [key: string]: Any[] });

    return Object.keys(groupedCollection)
      .map(key => ({ key, value: groupedCollection[key] }));
  }
}
