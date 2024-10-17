// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2024 www.ebenmonney.com/mit-license
// ---------------------------------------

import { Component } from '@angular/core';
import { fadeInOut } from '../../services/animations';
import { TodoDemoComponent } from '../controls/todo-demo.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-customers',
    templateUrl: './customers.component.html',
    styleUrl: './customers.component.scss',
    animations: [fadeInOut],
    standalone: true,
    imports: [TodoDemoComponent, TranslateModule]
})
export class CustomersComponent {

}
