import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FooterComponent } from '../common/footer/footer.component';
import { NavbarComponent } from '../common/navbar/navbar.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [RouterLink, NavbarComponent, FooterComponent, MatButtonModule],
    templateUrl: './home.component.html',
})
export class HomeComponent {
    title = 'Angular Snippet Nuggets';

}
