import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

@Component({
    selector: 'app-features',
    standalone: true,
    imports: [MatListModule, MatIconModule],
    templateUrl: './features.component.html',
})
export class FeaturesComponent {

}
