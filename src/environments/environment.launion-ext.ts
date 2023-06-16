export const environment = {
  production: true,
  Urls: {
    Baseurl: "http://pos00001:9000/",
    MicroDashboardApi: "http://pos00001:8100",
    MicroTankStatusApi: "http://pos00001:8200",
    HubUrl: "http://pos00001:7000/",
    SmartApiUrl: "http://pos00001:9300",
    PaymentGatewayApi: "http://pos00001:5001/api/"
  },
  FeatureFlags: {
    Dashboard: true,
    TankStatus: true
  },
  Settings: {
    Version: 'v3.1.0',
    DashboardSecondsTimer: 15,
    TankStatusSecondsTimer: 15,
  }
};
