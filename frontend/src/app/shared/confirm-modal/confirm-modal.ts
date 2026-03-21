import {Component, input, output} from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  templateUrl: './confirm-modal.html',
})
export class ConfirmModal {
  visible = input(false);
  message = input('Are you sure?');
  yes = output();
  no = output();
}
