// ====================================================
// More Templates: https://www.ebenmonney.com/templates
// Email: support@ebenmonney.com
// ====================================================

import { Pipe, PipeTransform } from '@angular/core';



@Pipe({ name: 'groupBy' })
export class GroupByPipe implements PipeTransform {

    transform(value: Array<any>, field: string): Array<any> {

        if (!value)
            return value;

        const groupedObj = value.reduce((prev, cur) => {
            if (!prev[cur[field]]) {
                prev[cur[field]] = [cur];
            }
            else {
                prev[cur[field]].push(cur);
            }

            return prev;
        }, {});

        return Object.keys(groupedObj).map(key => ({ key, value: groupedObj[key] }));
    }
}
