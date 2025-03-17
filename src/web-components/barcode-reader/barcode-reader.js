import { Html5Qrcode } from "html5-qrcode";

class BarcodeScanner extends HTMLElement {
  //static observedAttributes = ["camera"];
  #barcodeScanner;

  constructor() {
    super();
  }

  connectedCallback() {
    this.renderMarkup();
    this.connectCameras();
  }

  //attributeChangedCallback(name, oldValue, newValue) {
  //}

  renderMarkup() {
    this.innerHTML = `
      {{gulp-markup}}
      <style>
          {{gulp-style}}
      </style>
    `;
  }

  connectCameras() {
    Html5Qrcode.getCameras() // https://scanapp.org/html5-qrcode-docs/docs/intro
      .then((cameras) => {
        const event = new CustomEvent("camerasConnected", {
          detail: {
            cameras: cameras,
          },
        });

        this.dispatchEvent(event);
      })
      .catch((err) => {
        console.error(`ERROR Getting Camera's: ${err}`);
      });
  }

  stopScanner() {
    this.#barcodeScanner
      .stop()
      .then((ignore) => {
        this.scannerStopped = true; //prevent stopping scanner that already stopped
        console.log("SCANNER STOPPED");
      })
      .catch((err) => {
        console.log(`ERROR Stopping Scanner: ${err}`);
      });
  }

  startScanner(cameraId) {
    if (this.#barcodeScanner && !this.lastStartFailed && !this.scannerStopped) {
      console.log("A barcode scanner is already running, stopping scanner...");
      this.stopScanner();
    }

    console.log(`STARTING SCANNER WITH CAMERA ID: ${cameraId}`);

    this.#barcodeScanner = new Html5Qrcode("camera");
    const qrBoxWidth = this.offsetWidth / 2;
    const qrBoxHeight = qrBoxWidth;

    this.#barcodeScanner
      .start(
        cameraId,
        {
          fps: 10,
          qrbox: { width: qrBoxWidth, height: qrBoxHeight },
        },
        (decodedText, decodedResult) => {
          console.log(decodedText);

          const textDecodedEvent = new CustomEvent("textDecoded", {
            detail: {
              decodedText: decodedText,
            },
          });

          this.dispatchEvent(textDecodedEvent);
        },
        (errorMessage) => {
          //console.log(errorMessage);
        },
      )
      .catch((err) => {
        console.error(`ERROR Starting Scanner: ${err}`);
        this.lastStartFailed = true; //prevent stopping scanner that failed
      });

    this.lastStartFailed = false; //prevent stopping scanner that failed
  }
}

customElements.define("ce-barcode-scanner", BarcodeScanner);
