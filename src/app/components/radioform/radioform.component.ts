import { Component, input, output } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { FormItem } from '../../../types';

@Component({
    selector: 'app-radioform',
    imports: [ReactiveFormsModule],
    templateUrl: './radioform.component.html',
    styleUrl: './radioform.component.scss'
})
export class RadioformComponent {
  list = input<FormItem[]>();
  formControl = new FormControl('');
  listItemSelected = output<string | null>();

  ngOnInit() {
    this.formControl.valueChanges.subscribe((selectedListItem) => {
      this.listItemSelected.emit(selectedListItem);
    });
  }
}
