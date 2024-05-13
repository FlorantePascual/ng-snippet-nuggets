import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [MatToolbarModule, MatButtonModule, RouterLink],
    templateUrl: './navbar.component.html',
})
export class NavbarComponent {

    openExternalLink(path: string) {
        window.open(path, '_blank');
    }

}
