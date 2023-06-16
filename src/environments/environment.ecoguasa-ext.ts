export const environment = {
  production: true,
  Urls:{
    Baseurl: 'http://anical.dynip.com:9100/',
    MicroDashboardApi : 'http://anical.dynip.com:4501',  
    MicroTankStatusApi : 'http://anical.dynip.com:4502/', 
    HubUrl : 'http://anical.dynip.com:8080/',
    SmartApiUrl : 'http://anical.dynip.com:9400',
    PaymentGatewayApi : 'http://anical.dynip.com:5001/api/',
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


