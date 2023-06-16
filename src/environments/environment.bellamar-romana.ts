export const environment = {
  production: true,
  Urls:{
    Baseurl: 'http://10.200.33.219:9000/',
    MicroDashboardApi : 'http://10.200.33.219:8100',  
    MicroTankStatusApi : 'http://10.200.33.219:8200/', 
    HubUrl : 'http://10.200.33.219:7000/',
    SmartApiUrl : 'http://10.200.33.219:44389/',
    PaymentGatewayApi : 'http://10.200.33.219:5001/api/',
  },
  FeatureFlags: {
    Dashboard: true,
    TankStatus: true
  },
  Settings: {
    Version: 'v3.0.4',
    DashboardSecondsTimer: 5,
    TankStatusSecondsTimer: 10,
  },

};

