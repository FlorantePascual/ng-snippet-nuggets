import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [MatToolbarModule, MatButtonModule, RouterLink],
    templateUrl: './home.component.html',
})
export class HomeComponent {
    title = 'Angular Snippet Nuggets';

}
