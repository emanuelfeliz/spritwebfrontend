import { Injectable, EventEmitter } from '@angular/core';
import * as signalR from "@aspnet/signalr";
import { environment } from 'environments/environment';
import { IPump } from 'app/models/smart_console_models/IPump';
import { ISale } from 'app/models/smart_console_models/ISale';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  constructor(){

  }
  private hubConnection: signalR.HubConnection;

  public pumps: EventEmitter<Array<IPump>> = new EventEmitter<Array<IPump>>();
  public pumpsSales: EventEmitter<Array<Array<ISale>>> = new EventEmitter<Array<Array<ISale>>>();

  private pumpsData: Array<IPump> = [
    { priceLevel: 0, pumpNo: 1, saleProgress: 0, status: 'OFFLINE', salePrice: 0, volume: 0, grade: { id: 0, blue: 0, green: 0, red: 0, rbg: '', description: '', prices:[] }, isAuthored: false, hoses:[] },
    { priceLevel: 0, pumpNo: 1, saleProgress: 0, status: 'OFFLINE', salePrice: 0, volume: 0, grade: { id: 0, blue: 0, green: 0, red: 0, rbg: '', description: '', prices:[] }, isAuthored: false, hoses:[] },
  ];

  private hubListenersParameters: Array<HubParameters> = [
    {
      endpoint: 'PumpStatusChange', hubCallback: (data: IPump) => {
        console.log('PumpStatusChange');
        this.pumpsData[data.pumpNo - 1].status = data.status;
        this.pumps.emit(this.pumpsData);
      }
    },
    {
      endpoint: 'PumpDeliveryProgress', hubCallback: (data: IPump) => {
        console.log('PumpDeliveryProgress');
        this.pumpsData[data.pumpNo - 1] = data;
        this.pumps.emit(this.pumpsData);
      }
    },
    {
      endpoint: 'LoadPumps', hubCallback: (data: Array<IPump>) => {
        console.log('LoadPumps');
        this.pumpsData = data;
        this.pumps.emit(this.pumpsData);
      }
    },
    {
      endpoint: 'LoadLatestPumpSales', hubCallback: (data: Array<Array<ISale>>) => {
        this.pumpsSales.emit(data);
      }
    },
  ];
  // private hubInvokeParameters: Array<HubParameters> = [{}, {}];

  public init() {
    this.createConnection();
    this.startConnection();
  }

  private createConnection(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.Urls.SmartApiUrl}/Hub/SmartPump`)
      .configureLogging(signalR.LogLevel.Debug)
      .build();

    this.hubConnection.onclose(error => {
      console.log('Hub connection closed.');
      this.restartConnection(error);
    })
  }

  private startConnection(): void {
    this.hubConnection
      .start().then(() => {
        console.log('Connection started');

        this.startHubAllListeners();
        this.requestLoadPumps();
        this.requestLoadLatestPumpSales();

      }).catch(error => {
        this.restartConnection(error);
      })
  }

  private restartConnection(err: Error): void {
    console.log(`Error ${err}`);
    console.log('Retrying connection to SignalR Hub ...');
    setTimeout(() => {
      this.startConnection();
    }, 10000);
  }

  public stopConnection(): void {
    this.hubConnection.off('PumpStatusChange');
    this.hubConnection.off('PumpDeliveryProgress');
    this.hubConnection.off('LoadPumps');
    this.hubConnection.off('LoadLatestPumpSales');
    this.hubConnection.stop().then(() => {
      console.log('Hub connection stopped...');
    });
  }

  private startHubAllListeners() {
    this.hubListenersParameters.forEach(hubListenerParameter => {
      this.addHubListener(hubListenerParameter);
    });
  }

  //TODO: Create a method for receive the endpoint and anonymous function for add the listeners...
  private addHubListener(hubParameters: HubParameters): void {
    this.hubConnection.on(hubParameters.endpoint, (data) => hubParameters.hubCallback(data));
  }

  public requestLoadLatestPumpSales(): void {
    this.hubConnection.invoke('LoadLatestPumpSales').then(success => {
      console.log('Message sended...');
    }, error => {
      console.log(`Error: ${error}`)
    });
  }

  public requestLoadPumps(): void {
    this.hubConnection.invoke('LoadPumps').then(success => {
      console.log('Message sended...');
    }, error => {
      console.log(`Error: ${error}`)
    });
  }
}

export interface HubParameters {
  endpoint: string;
  hubCallback: (data) => void;
}

