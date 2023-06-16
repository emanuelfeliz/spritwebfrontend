export const environment = {
  production: false,
  Urls:{
    Baseurl: 'http://petronanelplay.dyndns.org:9000/',
    MicroDashboardApi : 'http://petronanelplay.dyndns.org:8100/',  
    MicroTankStatusApi : 'http://petronanelplay.dyndns.org:8200/', 
    HubUrl : 'http://localhost:7000/',
    SmartApiUrl : 'https://localhost:44389/',
    PaymentGatewayApi : 'https://localhost:5001/api/',
  },
  FeatureFlags: {
    Dashboard: true,
    TankStatus: true
  },
  Settings: {
    Version: 'v3.0.4',
    DashboardSecondsTimer: 5,
    TankStatusSecondsTimer: 5,
  },

};
