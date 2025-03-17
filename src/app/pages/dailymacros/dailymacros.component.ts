// components
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  ViewChild,
} from '@angular/core';
import '../../../web-components/barcode-reader/script.js';
import { CameraselectorComponent } from '../../components/listselector/cameraselector.component.js';
import { OpenFoodFactsApiService } from '../../services/openFoodFactsApi.service.js';
import { FormItem, OpenFoodFactsIngredient } from '../../../types.js';
import { BtnComponent } from '../../components/btn/btn.component.js';
import { LabelComponent } from '../../components/label/label.component.js';

@Component({
  selector: 'app-dailymacros',
  imports: [BtnComponent, CameraselectorComponent, LabelComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './dailymacros.component.html',
  styleUrl: './dailymacros.component.scss',
})
export class DailymacrosComponent {
  @ViewChild('barcodescanner') barcodeScanner: ElementRef;
  barcodeScannerOpened = false;
  cameras: FormItem[];
  cameraId: string | null;
  scannedIngredient: OpenFoodFactsIngredient | null;

  constructor(private openFoodFactsApi: OpenFoodFactsApiService) {}

  ngAfterViewInit() {
    this.getCamerasFromBarcodeScanner();
    this.getDecodedTextFromBarcodeScanner();
  }

  toggleBarcodeScanner() {
    this.barcodeScannerOpened
      ? (this.barcodeScannerOpened = false)
      : (this.barcodeScannerOpened = true);
  }

  getCamerasFromBarcodeScanner() {
    this.barcodeScanner.nativeElement.addEventListener(
      'camerasConnected',
      (event: CustomEvent) => {
        this.cameras = event.detail.cameras.map((camera: any) => {
          return { label: camera.label, value: camera.id };
        });
        console.log(this.cameras);
      },
    );
  }

  getDecodedTextFromBarcodeScanner() {
    this.barcodeScanner.nativeElement.addEventListener(
      'textDecoded',
      (event: CustomEvent) => {
        this.stopScanner();
        this.fetchIngredientFromDecodedText(event.detail.decodedText);
      },
    );
  }

  fetchIngredientFromDecodedText(decodedText: string) {
    this.openFoodFactsApi.fetchIngredientFromBarcode(decodedText).subscribe({
      next: (res: OpenFoodFactsIngredient) => {
        this.scannedIngredient = res;
        console.log(res);
      },
      error: (err) => {
        this.scannedIngredient = err.error;
        console.error(err.error);
      },
    });
  }

  rescanIngredient() {
    this.scannedIngredient = null;
    this.startScanner(this.cameraId);
  }

  confirmIngredient() {}

  startScanner(cameraId: string | null) {
    this.cameraId = cameraId;
    this.barcodeScanner.nativeElement.startScanner(cameraId);
  }

  stopScanner() {
    this.barcodeScanner.nativeElement.stopScanner();
  }
}
