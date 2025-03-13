import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotionApiService } from './services/notionApi.service';
import { User } from '../types';
import { CardComponent } from './card/card.component';
import { BtnComponent } from './components/btn/btn.component';
import { LoadingScreenComponent } from "./animations/loading-screen/loading-screen.component";
import { firstValueFrom } from 'rxjs';
import { NavComponent } from './components/nav/nav.component';

@Component({
    selector: 'app-root',
    imports: [ RouterOutlet, NavComponent, CardComponent, BtnComponent, LoadingScreenComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
  authenticated = false;
  authorized = false;
  appDataFetched = false;
  user: User;
  refreshingAppData = false;

  constructor(private notionApiService: NotionApiService) {}

  async ngOnInit() {
    // AUTHENTICATION WITH SESSION COOKIE
    if (this.notionApiService.user) {
      console.log("USER HAS ALREADY AUTHENTICATED, RENDERING...");
      this.user = this.notionApiService.user; // render user info
      this.authorized = true; // skip authorization
      this.authenticated = true; // skip authentication
    } else {
      await this.authenticateUser(); // try authenticating with sessionid cookie
    } 

    // AUTHORIZATION TO USER'S NOTION
    if (this.notionApiService.user) {
      console.log("USER HAS ALREADY AUTHORIZED, FETCHING...");
      this.authorized = true; // skip authorization
    } else {
      await this.authorizeApp(); // server creates session and returns session cookie
    }

    // FETCH APPDATA FROM USER'S NOTION
    if (this.notionApiService.appData) {
      console.info("APPDATA ALREADY FETCHED, ROUTING...");
      this.appDataFetched = true; // skip fetching
    } else if (this.notionApiService.user) {
      this.fetchAppData();
    }
  }

  async authenticateUser() {
    try {
      const observable = this.notionApiService.authenticate(`${this.notionApiService.fqdm}/api/authenticate`, {withCredentials: true});
      const user = await firstValueFrom(observable);

      // log api response
      console.log("USER AUTHENTICATION SUCCESS!");

      // authenticate user
      this.notionApiService.user = { // remember user in this session
        username: user.username,
        avatarUrl: '',
      };
      
      this.user = { // render user in this component
        username: user.username,
        avatarUrl: '',
      };
      console.log(this.notionApiService.user);

      // render avatar image (use session storage to limit api requests)
      if (!sessionStorage.getItem("avatarImage")) {
        // save avatar image to session storage https://stackoverflow.com/questions/18650168/convert-blob-to-base64 
        console.log("NO SESSION IMAGE AVAILABLE, FETCHING AVATAR IMAGE...");
        
        // fetch avatar as blob
        const image = await fetch(user.avatarUrl);
        const avatarBlob = await image.blob();

        // convert blob to object url and render
        const avatarUrl = URL.createObjectURL(avatarBlob);
        this.user.avatarUrl = avatarUrl;
        this.notionApiService.user.avatarUrl = avatarUrl;

        // save to session storage as base64 string
        const avatarB64 = await this.blobToBase64(avatarBlob);
        sessionStorage.setItem("avatarImage", avatarB64.split (",").pop() as string); // https://stackoverflow.com/questions/54168933/reader-readasdataurl-resulting-in-a-defectuous-base64-string

      } else {
        // render existing avatar image
        console.log("SESSION IMAGE AVAILABLE, RENDERING...");

        // convert base64 to blob
        const avatarB64 = sessionStorage.getItem("avatarImage") as string;
        const avatarBlob = this.b64toBlob(avatarB64);

        // convert blob to object url and render
        const avatarUrl = URL.createObjectURL(avatarBlob);
        this.user.avatarUrl = avatarUrl;
        this.notionApiService.user.avatarUrl = avatarUrl;
      }

      // skip authentication and authorization
      this.authenticated = true;
      this.authorized = true;
      
    } catch (err: any) {
      console.error(`AUTHENTICATION ERROR: ${err.error.error}`);
      this.authenticated = true; // if authenticateUser() throws error, still go to authorization step
    }
  }

  blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => resolve(reader.result as string);
    });
  }

  b64toBlob(b64Data: string, contentType='image/png', sliceSize=512) { // https://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
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
      
    return new Blob(byteArrays, {type: contentType});
  }

  async authorizeApp() {
    // grab authorization code query param from url
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const code = urlParams.get('code') as string;
    console.log(code);

    // fetch access token from notion, if code available
    if (code) {
      this.authenticated = true;
      console.log("USER HAS GIVEN PERMISSION, AUTHORIZING KCALCULATOR...");

      try {
        // authorize user against api using code
        const observable = this.notionApiService.authorize(`${this.notionApiService.fqdm}/api/authorize`, {code: code}, {withCredentials: true})
        await firstValueFrom(observable);
  
        console.info("APP AUTHORIZATION SUCCESS!");
        window.history.replaceState({}, "", "/"); // clear url query params
        await this.authenticateUser();

      } catch (err: any) {
        console.error(`AUTHENTICATION ERROR: ${err.error.error}`);
        // this.authenticated = true; // if authenticateUser() throws error, still go to authorization step
      }
    } else {
      console.error("AUTHORIZATION ERROR: No code provided, cannot authorize");
    }
  }

  async fetchAppData() {
    await this.notionApiService.fetchAppData();
    this.appDataFetched = true;
    // console.info("FETCHING APPDATA FROM NOTION...");

    // // if (!sessionStorage.getItem("recipes")) {
    // //   console.log("FETCHING DAILY MACROS...");
    // // }

    // if (!sessionStorage.getItem("recipes")) {
    //   console.log("FETCHING RECIPES..."); 
    //   try {
    //     const observable = this.notionApiService.getRecipes(`${this.notionApiService.fqdm}/api/getrecipes`, {withCredentials: true});
    //     const recipes: Recipe[] = await firstValueFrom(observable);
    //     console.log("FETCHING RECIPES SUCCESS!");

    //     this.notionApiService.appData = {recipes: recipes};
    //     console.log(recipes)

    //     const recipesB64 = JSON.stringify(recipes);
    //     sessionStorage.setItem("recipes", recipesB64);
    //     this.appDataFetched = true;
    //   } 
    //   catch (err: any) {
    //     console.error(`FETCHING ERROR: ${JSON.stringify(err.error.errors)}`);
    //   }
    // } else {
    //   console.log("RECIPES ALREADY FETCHED, SKIPPING...");
    //   const recipes: Recipe[] = JSON.parse(sessionStorage.getItem("recipes") as string);

    //   this.notionApiService.appData = {recipes: recipes};
    //   console.log(recipes)

    //   this.appDataFetched = true;
    // }

    // // if(!sessionStorage.getItem("ingredients")) {
    // //   console.log("FETCHING INGREDIENTS");
    // // }
  }
}
