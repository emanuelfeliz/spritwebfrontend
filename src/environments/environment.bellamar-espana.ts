export const environment = {
  production: true,
  Urls:{
    Baseurl: 'http://192.168.1.59:9000/',
    MicroDashboardApi : 'http://192.168.1.59:8100',  
    MicroTankStatusApi : 'http://192.168.1.59:8200/', 
    HubUrl : 'http://192.168.1.59:7000/',
    SmartApiUrl : 'http://192.168.1.59:44389/',
    PaymentGatewayApi : 'http://192.168.1.59:5001/api/',
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
