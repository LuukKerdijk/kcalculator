import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotionApiService } from './services/notionApi.service';
import { User } from '../types';
import { CardComponent } from './card/card.component';
import { BtnComponent } from './components/btn/btn.component';
import { LoadingScreenComponent } from './animations/loading-screen/loading-screen.component';
import { firstValueFrom } from 'rxjs';
import { NavComponent } from './components/nav/nav.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NavComponent,
    CardComponent,
    BtnComponent,
    LoadingScreenComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class AppComponent {
  phase:
    | 'authenticating'
    | 'authprompting'
    | 'authorizing'
    | 'fetching'
    | 'routing';
  user: User;
  refreshingAppData = false;

  constructor(private notionApiService: NotionApiService) {}

  async ngOnInit() {
    if (this.notionApiService.user) {
      console.log('USER HAS ALREADY AUTHENTICATED...');
      this.user = this.notionApiService.user;
    } else {
      this.phase = 'authenticating';
      console.log('AUTHENTICATING...');
      await this.authenticate(); //authenticates if session cookie is already available
    }

    if (this.notionApiService.user) {
      console.log('USER HAS ALREADY AUTHORIZED...');
    } else {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const code = urlParams.get('code') as string;

      if (code) {
        this.phase = 'authorizing';
        console.log('AUTHORIZING...');
        await this.authorize(code); //server returns session cookie

        this.phase = 'authenticating';
        await this.authenticate(); //authenticates using session cookie
      } else {
        this.phase = 'authprompting';
        console.log('AUTHPROMPTING (NO CODE PROVIDED)...');
      }
      console.log('AUTHENTICATING...');
    }

    if (this.notionApiService.recipes && this.notionApiService.ingredients) {
      console.info('APPDATA ALREADY FETCHED...');
      this.phase = 'routing';
      console.log('ROUTING...');
    } else if (this.notionApiService.user) {
      this.phase = 'fetching';
      await this.notionApiService.fetchAppdata();
      this.phase = 'routing';
      console.log('ROUTING...');
    }
  }

  async authenticate() {
    try {
      const observable = this.notionApiService.authenticate();
      const user = await firstValueFrom(observable);

      this.notionApiService.user = {
        username: user.username,
        avatarUrl: '',
      };
      this.user = this.notionApiService.user;
      console.log(this.notionApiService.user);

      if (!sessionStorage.getItem('avatarImage')) {
        console.log(
          'NO SESSION AVATAR IMAGE AVAILABLE, FETCHING AVATAR IMAGE...',
        );

        const avatarImage = await fetch(user.avatarUrl);
        const avatarBlob = await avatarImage.blob();

        const avatarUrl = URL.createObjectURL(avatarBlob);
        this.user.avatarUrl = avatarUrl;
        this.notionApiService.user.avatarUrl = avatarUrl;

        const avatarB64 = await this.blobToBase64(avatarBlob); //save to session storage to limit gapi requests
        sessionStorage.setItem(
          'avatarImage',
          avatarB64.split(',').pop() as string, // https://stackoverflow.com/questions/54168933/reader-readasdataurl-resulting-in-a-defectuous-base64-string
        );
      } else {
        console.log('SESSION AVATAR IMAGE AVAILABLE, RENDERING...');

        const avatarB64 = sessionStorage.getItem('avatarImage') as string;
        const avatarBlob = this.b64toBlob(avatarB64);

        const avatarUrl = URL.createObjectURL(avatarBlob);
        this.user.avatarUrl = avatarUrl;
        this.notionApiService.user.avatarUrl = avatarUrl;
      }
    } catch (err: any) {
      console.error(`AUTHENTICATION ERROR: ${err.error}`);
    }
  }

  blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => resolve(reader.result as string);
    });
  }

  b64toBlob(b64Data: string, contentType = 'image/png', sliceSize = 512) {
    // https://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
  }

  async authorize(code: string) {
    try {
      const observable = this.notionApiService.authorize({ code: code });
      const msg = await firstValueFrom(observable);
      console.log(msg);
      window.history.replaceState({}, '', '/'); // clear url query params
    } catch (err: any) {
      console.error(`AUTHORIZATION ERROR: ${err.error}`);
    }
  }
}
