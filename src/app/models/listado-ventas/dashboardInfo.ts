export interface DashboardBaseInfo {
     percentage: number;
     betterRate: number;
}

export interface SalesInfo extends DashboardBaseInfo {
     totalSales: number;
}

export interface VolumeInfo extends DashboardBaseInfo {
     volumeTotal: number;
     todayVolumeTotal: number;
     yesterdayVolumeTotal: number;
}

export interface MoneyInfo extends DashboardBaseInfo {
     moneyTotal: number;
}

export interface DashboardModel {
     salesInfo: SalesInfo;
     volumeInfo: VolumeInfo;
     moneyInfo: MoneyInfo;
     product:string;
}