import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DateTime } from 'luxon';
import { ApexOptions, ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { CurrencyPipe, DecimalPipe, NgClass, NgFor, NgIf, UpperCasePipe } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { CryptoService } from './crypto.service';
import { WatchListDto } from './crypto.types';
import { BreakpointObserver, BreakpointState, Breakpoints } from '@angular/cdk/layout';

@Component({
    selector: 'app-crypto',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    templateUrl: './crypto.component.html',
    imports: [RouterOutlet, MatToolbarModule, MatButtonModule,
        MatSidenavModule, MatOptionModule, MatIconModule, MatInputModule, MatSelectModule,
        NgFor, NgIf, NgClass, UpperCasePipe, DecimalPipe, CurrencyPipe,
        NgApexchartsModule
    ],
    providers: [CurrencyPipe],

})
export class CryptoComponent implements OnInit, OnDestroy {

    @ViewChild('coinChartComponent') coinChartComponent: ChartComponent;
    appConfig: any;
    chartOptions: ApexOptions = {};
    data: any;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    watchlistChartOptions: ApexOptions = {};
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _cryptoService: CryptoService,
        private _currencyPipe: CurrencyPipe,
        private _breakpointObserver: BreakpointObserver,
    ) { }
    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Subscribe to the breakpoint observer
        this._breakpointObserver.observe([
            Breakpoints.Handset,
            Breakpoints.Tablet,
            Breakpoints.Web,
        ]).subscribe((state: BreakpointState) => {
            if (
                state.breakpoints[Breakpoints.HandsetPortrait] || state.breakpoints[Breakpoints.HandsetLandscape] ||
                state.breakpoints[Breakpoints.TabletPortrait] || state.breakpoints[Breakpoints.TabletLandscape]) {
                this.drawerMode = 'over';
                this.drawerOpened = false;
            } else {
                this.drawerMode = 'side';
                this.drawerOpened = true;
            }

        });

        // Get the data
        this._cryptoService.data$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => {
                // Store the data
                this.data = data;

                // Prepare the chart data
                this._prepareChartData();
            });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    /**
     * Get history by item
     * @param item 
     */
    async getHistoryByItem(item: WatchListDto) {

        // Delay to allow the loading bar to show
        setTimeout(async () => {
            try {
                await this._cryptoService.getHistoryByItem(item);
            } catch (error) {
                console.log({ error })
                this._showErrorDialog();
            }
        }, 100);

    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Prepare the chart data from the data
     *
     * @private
     */
    private _prepareChartData(): void {
        // BTC
        this.chartOptions = {
            chart: {
                animations: {
                    enabled: false
                },
                fontFamily: 'inherit',
                foreColor: 'inherit',
                width: '100%',
                height: '100%',
                type: 'line',
                toolbar: {
                    show: false,
                },
                zoom: {
                    enabled: false,
                },
            },
            colors: ['#5A67D8'],
            dataLabels: {
                enabled: false,
            },
            grid: {
                borderColor: 'silver',
                position: 'back',
                show: true,
                strokeDashArray: 6,
                xaxis: {
                    lines: {
                        show: true,
                    },
                },
                yaxis: {
                    lines: {
                        show: true,
                    },
                },
            },
            legend: {
                show: false,
            },
            series: this.data.currentCoin.price.series,
            stroke: {
                width: 2,
                curve: 'straight',
            },
            tooltip: {
                shared: true,
                theme: 'dark',
                y: {
                    formatter: (value: number): string => this._currencyTransform(value), // formatter: (value: number): string => '$' + value.toFixed(2),
                },
            },
            xaxis: {
                type: 'numeric',
                crosshairs: {
                    show: true,
                    position: 'back',
                    fill: {
                        type: 'color',
                        color: 'silver',
                    },
                    width: 3,
                    stroke: {
                        dashArray: 0,
                        width: 0,
                    },
                    opacity: 0.9,
                },
                tickAmount: 12,
                axisTicks: {
                    show: true,
                    color: 'silver',
                },
                axisBorder: {
                    show: false,
                },
                tooltip: {
                    enabled: false,
                },
                labels: {
                    show: true,
                    trim: false,
                    rotate: 0,
                    minHeight: 40,
                    hideOverlappingLabels: true,
                    formatter: (value): string => DateTime.fromMillis(parseInt(value)).toFormat('EEE HH:mm'),
                    style: {
                        colors: 'currentColor',
                    },
                },
            },
            yaxis: {
                axisTicks: {
                    show: true,
                    color: 'silver',
                },
                axisBorder: {
                    show: false,
                },
                forceNiceScale: true,
                labels: {
                    minWidth: 40,
                    formatter: (value: number): string => this._currencyTransform(value, '1.0-0'), // '$' + value.toFixed(0),
                    style: {
                        colors: 'currentColor',
                    },
                },
            },
        };

        // Watchlist options
        this.watchlistChartOptions = {
            chart: {
                animations: {
                    enabled: false,
                },
                width: '100%',
                height: '100%',
                type: 'line',
                sparkline: {
                    enabled: true,
                },
            },
            colors: ['#A0AEC0'],
            stroke: {
                width: 2,
                curve: 'smooth',
            },
            tooltip: {
                enabled: false,
            },
            xaxis: {
                type: 'category',
            },
        };
    }

    private _currencyTransform(value: number, precision = '1.2-2', currency = 'USD'): string {
        return this._currencyPipe.transform(value, currency, 'symbol', precision)
    }

    private _showErrorDialog(): void {
        alert(`An error was encountered. Please try again later.`);
    }

}
