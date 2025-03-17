import { Component, ViewChild, input, output } from '@angular/core';
import { BtnComponent } from '../btn/btn.component';
import { CardComponent } from '../../card/card.component';
import { RadioformComponent } from '../radioform/radioform.component';
import { FormItem } from '../../../types';

@Component({
  selector: 'app-cameraselector',
  imports: [BtnComponent, CardComponent, RadioformComponent],
  templateUrl: './cameraselector.component.html',
  styleUrl: './cameraselector.component.css',
})
export class CameraselectorComponent {
  cameras = input<FormItem[]>();
  cameraChosenEvent = output<string | null>();
  @ViewChild('radioform') radioform: RadioformComponent;
  listOpen = false;
  selectedCamera: string | null;

  ToggleOpened() {
    if (!this.listOpen) {
      this.listOpen = true;
    } else {
      this.listOpen = false;
    }
  }

  setSelectedCamera(cameraId: string | null) {
    this.selectedCamera = cameraId;
  }

  emitEventCameraChosen() {
    this.cameraChosenEvent.emit(this.selectedCamera);
    console.log(`camera emitted: ${this.selectedCamera}`);
  }
}
