export const environment = {
  production: true,
  Urls:{
    Baseurl: 'http://pos00001:9000/',
    MicroDashboardApi : 'http://pos00001:4501',  
    MicroTankStatusApi : 'http://pos00001:4502', 
    HubUrl : 'http://pos00001:8080/',
    SmartApiUrl : 'http://pos00001:9400',
    PaymentGatewayApi : 'http://pos00001:5001/api/',
  },
  FeatureFlags: {
    Dashboard: true,
    TankStatus: true
  },
  Settings: {
    Version: 'v3.0.5',
    DashboardSecondsTimer: 15,
    TankStatusSecondsTimer: 15,
  }
};


