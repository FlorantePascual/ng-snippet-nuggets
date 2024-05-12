// Result from https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1
export interface MarketChartHistoryDto {
    id?: string;
    prices: number[][];
    market_caps: number[][];
    total_volumes: number[][];
}

export interface MarketDataDto {
    id: string;
    symbol: string;
    name: string;
    image: string;
    current_price: number;
    market_cap: number;
    market_cap_rank: number;
    fully_diluted_valuation: null | number;
    total_volume: number;
    high_24h: number;
    low_24h: number;
    price_change_24h: number;
    price_change_percentage_24h: number;
    market_cap_change_24h: number;
    market_cap_change_percentage_24h: number;
    circulating_supply: number;
    total_supply: null | number;
    max_supply: null | number;
    ath: number;
    ath_change_percentage: number;
    ath_date: string;
    atl: number;
    atl_change_percentage: number;
    atl_date: string;
    roi: RoiType | null;
    last_updated: string;
}

type RoiType = {
    times: number;
    currency: string;
    percentage: number;
}

export const COINS = [
    {
        "id": "bitcoin",
        "symbol": "btc",
        "name": "Bitcoin",
    },
    {
        "id": "ethereum",
        "symbol": "eth",
        "name": "Ethereum",
    },
    {
        "id": "ripple",
        "symbol": "xrp",
        "name": "XRP",
    },
    {
        "id": "litecoin",
        "symbol": "ltc",
        "name": "Litecoin",
    },
    {
        "id": "bitcoin-cash",
        "symbol": "bch",
        "name": "Bitcoin Cash"
    },
    {
        "id": "binancecoin",
        "symbol": "bnb",
        "name": "BNB",
    },
    {
        "id": "solana",
        "symbol": "sol",
        "name": "Solana",
    },
    {
        "id": "staked-ether",
        "symbol": "steth",
        "name": "Lido Staked Ether",
    },
    {
        "id": "singularitynet",
        "symbol": "agix",
        "name": "SingularityNET",

    }
]



export interface CoinChartDto {
    amount: number;
    trend: Trend;
    marketCap: number;
    volume: number;
    supply: number;
    allTimeHigh: number;
    price: Price;
    name: string;
    symbol: string;
}

type Price = {
    series: Series[];
}

type Series = {
    name: string;
    data: Datum[];
}

type Datum = {
    x: string | number;
    y: number;
}

type Trend = {
    dir: 'up' | 'down' | 'flat';
    amount: number;
}


export interface WatchListDto {
    title: string;
    iso: string;
    amount: number;
    trend: Trend;
    series: Series[];
}

export interface RawDataDto {
    currentCoin?: CoinChartDto;
    prices?: {
        [key: string]: number;
    };
    wallets?: {
        [key: string]: number;
    };
    watchlist?: WatchListDto[];
}
