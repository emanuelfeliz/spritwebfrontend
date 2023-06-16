export const environment = {
  production: true,
  Urls: {
    Baseurl: "http://petronanelplay.dyndns.org:9100/",
    MicroDashboardApi: "http://localhost:46393",
    MicroTankStatusApi: "http://petronanelplay.dyndns.org:8200",
    HubUrl: "http://petronanelplay.dyndns.org:7000/",
    SmartApiUrl: "http://petronanelplay.dyndns.org:9300",
    PaymentGatewayApi: "http://petronanelplay.dyndns.org:5001/api/"
  },
  FeatureFlags: {
    Dashboard: true,
    TankStatus: true
  },
  Settings: {
    Version: 'v3.1.0',
    DashboardSecondsTimer: 915,
    TankStatusSecondsTimer: 915,
  }
};
