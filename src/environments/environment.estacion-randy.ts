export const environment = {
  production: true,
  Urls:{
    Baseurl: 'http://localhost:9000/',
    MicroDashboardApi : 'http://localhost:44369',  
    MicroTankStatusApi : 'http://localhost:8200', 
    HubUrl : 'http://localhost:7000/',
    SmartApiUrl : 'http://localhost:44389/',
    PaymentGatewayApi : 'http://localhost:5001/api/',
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
