// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================

import { animate, state, style, transition, trigger } from '@angular/animations';



export const fadeInOut = trigger('fadeInOut', [
  transition(':enter', [style({ opacity: 0 }), animate('0.4s ease-in', style({ opacity: 1 }))]),
  transition(':leave', [animate('0.4s 10ms ease-out', style({ opacity: 0 }))])
]);



export function flyInOut(duration: number = 0.2) {
  return trigger('flyInOut', [
    state('in', style({ opacity: 1, transform: 'translateX(0)' })),
    transition('void => *', [style({ opacity: 0, transform: 'translateX(-100%)' }), animate(`${duration}s ease-in`)]),
    transition('* => void', [animate(`${duration}s 10ms ease-out`, style({ opacity: 0, transform: 'translateX(100%)' }))])
  ]);
}
