// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2024 www.ebenmonney.com/mit-license
// ---------------------------------------

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'groupBy',
  standalone: true
})
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
