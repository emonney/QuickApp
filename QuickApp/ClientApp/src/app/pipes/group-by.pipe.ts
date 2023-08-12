// ======================================
// Author: Ebenezer Monney
// Copyright (c) 2023 www.ebenmonney.com
// 
// ==> Gun4Hire: contact@ebenmonney.com
// ======================================

import { Pipe, PipeTransform } from '@angular/core';


@Pipe({ name: 'groupBy' })
export class GroupByPipe implements PipeTransform {
  transform<T>(collection: T[], property: keyof T) {
    if (!collection) {
      return null;
    }

    const groupedCollection = collection.reduce((previous, current) => {
      const groupKey = current[property] as string;

      if (!previous[groupKey]) {
        previous[groupKey] = [current];
      } else {
        previous[groupKey].push(current);
      }

      return previous;
    }, {} as Record<string, T[]>);

    return Object.keys(groupedCollection)
      .map(key => ({ key, value: groupedCollection[key] }));
  }
}
