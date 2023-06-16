export const environment = {
  production: true,
  Urls:{
    Baseurl: 'http://pos00001:9000/',
    MicroTankStatusApi : 'http://pos00001:8200/', 
    HubUrl : 'http://pos00001:7000/',
    SmartApiUrl : 'http://pos00001:44389/',
    PaymentGatewayApi : 'http://pos00001:5001/api/',
    MicroDashboardApi : 'http://pos00001:8100/',  
  },
  FeatureFlags: {
    Dashboard: true,
    TankStatus: true
  },
  Settings: {
    Version:'v3.0.4',
    DashboardSecondsTimer: 5,
    TankStatusSecondsTimer: 15,
  },

};
