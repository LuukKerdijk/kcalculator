import { Component, input } from '@angular/core';
import { User } from '../../../types';
import { RouterModule } from '@angular/router';
import { BtnComponent } from '../btn/btn.component';
import { NotionApiService } from '../../services/notionApi.service';

@Component({
  selector: 'app-nav',
  imports: [RouterModule, BtnComponent],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent {
  authorized = input<boolean>(false);
  user = input<User>();
  opened = false;
  refreshingAppData = false;

  constructor(private notionApiService: NotionApiService) {}

  async refreshAppData() {
    this.refreshingAppData = true;
    sessionStorage.removeItem('recipes');
    // sessionStorage.removeItem("dailymacros");
    // sessionStorage.removeItem("ingredients");
    await this.notionApiService.fetchAppdata();
    this.refreshingAppData = false;
  }
}
