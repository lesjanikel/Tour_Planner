import {Component, input} from '@angular/core';

@Component({
  selector: 'app-error-list',
  imports: [],
  templateUrl: './error-list.html',
})
export class ErrorList {
  errors = input<string[]>([]);
}
