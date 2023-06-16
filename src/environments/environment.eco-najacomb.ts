export const environment = {
  production: true,
  Urls:{
    Baseurl: 'http://pos00001:6001/',
    MicroDashboardApi : 'http://pos00001:5100',  
    MicroTankStatusApi : 'http://pos00001:5200/', 
    HubUrl : 'http://pos00001:7000/',
    SmartApiUrl : 'http://localhost:9300',
    PaymentGatewayApi : 'http://pos00001:5001/api/',
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


