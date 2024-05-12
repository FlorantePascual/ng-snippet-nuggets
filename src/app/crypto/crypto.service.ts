import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, firstValueFrom, switchMap, tap, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MarketChartHistoryDto, MarketDataDto, RawDataDto, WatchListDto, COINS } from './crypto.types';

const URL = {
    coinGeckoProxyLocal: 'http://127.0.0.1:5001/florante-pascual/us-central1/coinGeckoProxy',
    coinGeckoProxy: 'https://your-project-name.cloudfunctions.net/coinGeckoProxy',
}

@Injectable({
    providedIn: 'root'
})
export class CryptoService {

    private _data: BehaviorSubject<any> = new BehaviorSubject(null);

    private _marketHistory: MarketChartHistoryDto;
    private _marketHistoryAll: {
        [key: string]: MarketChartHistoryDto
    } = {};

    private _marketData: MarketDataDto[];
    private _lastData: RawDataDto = null;

    private _apiUrl = window.location.hostname === 'localhost' ? URL.coinGeckoProxyLocal : URL.coinGeckoProxy;

    constructor(
        private _httpClient: HttpClient,
    ) { }


    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for data
     */
    get data$(): Observable<any> {
        return this._data.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get data
     */

    getData(id: string = 'bitcoin'): Observable<any> {
        return this._getMarketChartHistory(id).pipe(
            switchMap(marketChartHistory => {
                this._marketHistoryAll[id] = marketChartHistory;
                this._marketHistory = marketChartHistory;
                return this._httpClient.post<MarketDataDto[]>(this._apiUrl, {
                    currency: 'usd',
                    overrideKey: 'YOUR_OVERRIDE_KEY_HERE'
                });
            }),
            tap(marketData => {
                this._marketData = marketData;
                const processedData = this._processData();
                this._lastData = processedData;
                this._data.next(processedData);
            }),
            catchError((error): any => {
                this._handleError(error);
            }),
        );


    }

    private _processData(symbol = 'btc'): RawDataDto {

        let finalData: RawDataDto = {};
        const coinData = this._marketData.find(data => data.symbol === symbol);

        finalData = {
            currentCoin: {
                name: coinData.name,
                symbol: coinData.symbol,
                allTimeHigh: coinData.ath,
                amount: coinData.current_price,
                marketCap: coinData.market_cap,
                price: {
                    series: [{
                        name: 'Price',
                        data: this._marketHistory.prices.map(price => {
                            return { x: price[0], y: price[1] };
                        })
                    }]
                },
                supply: coinData.total_supply,
                trend: {
                    dir: coinData.price_change_24h > 0 ? 'up' : 'down',
                    amount: coinData.price_change_percentage_24h
                },
                volume: coinData.total_volume
            },
            watchlist: this._getWatchList()
        }
        return finalData;
    }

    async getHistoryByItem(item: WatchListDto) {
        const coin = this._resolveIdBySymbol(item);
        const id = coin.id;
        if (!item.series.length) {
            const history = await firstValueFrom(this._getMarketChartHistory(id));
            this._marketHistoryAll[history.id] = history;
        }
        this._marketHistory = this._marketHistoryAll[id];
        this._lastData = this._processData(coin.symbol);
        this._data.next(this._lastData);
    }

    private _resolveIdBySymbol(item: WatchListDto) {
        return COINS.find(coin => {
            return coin.symbol === item.iso;
        })
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------
    private _getWatchList() {
        const watchList: WatchListDto[] = [];

        COINS.forEach(coin => {
            const marketData = this._marketData.find((data) => data.symbol === coin.symbol);
            let series;
            if (this._marketHistoryAll[coin.id]) {
                series = {
                    name: 'Price',
                    data: this._marketHistoryAll[coin.id].prices.map(price => {
                        return { x: price[0], y: price[1] };
                    })
                }
            }

            watchList.push({
                title: coin.name,
                iso: coin.symbol,
                amount: marketData.current_price,
                trend: {
                    dir: marketData.price_change_24h > 0 ? 'up' : 'down',
                    amount: marketData.price_change_percentage_24h
                },
                series: series ? [series] : []
            })
        })
        return watchList;
    }

    private _getMarketChartHistory(id: string): Observable<MarketChartHistoryDto> {
        return this._httpClient.post<MarketChartHistoryDto>(this._apiUrl, {
            currency: 'usd',
            coinId: id,
            overrideKey: 'YOUR_OVERRIDE_KEY_HERE'
        }).pipe(
            map(result => {
                return {
                    ...result,
                    id
                }
            })
        )
    }

    private _handleError(error: any) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            // Client-side error
            errorMessage = `Error: ${error.error.message}`;
        } else {
            // Server-side error
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        // You can handle the error as per your requirements, for now, we'll just log it
        console.error(errorMessage);

    }

}
