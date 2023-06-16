export const environment = {
  production: true,
  Urls:{
    Baseurl: 'http://petronanoriental.dyndns.org:7000/',
    MicroDashboardApi : 'http://petronanoriental.dyndns.org:7900',  
    MicroTankStatusApi : 'http://petronanoriental.dyndns.org:8200', 
    HubUrl : 'http://petronanoriental.dyndns.org:7100/',
    SmartApiUrl : 'http://petronanoriental.dyndns.org:9300',
    PaymentGatewayApi : 'http://petronanoriental.dyndns.org:5001/api/',
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
