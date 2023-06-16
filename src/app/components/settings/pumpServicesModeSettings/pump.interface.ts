export interface IPump {
    grade: IGrade;
    status: string;
    pumpNo: number;
    volume: number;
    salePrice: number;
    saleProgress: number;
  }
  
  export interface IGrade {
    red: number;
    blue: number;
    green: number;
    rbg: string;
    description: string;
  }
  
  export interface IGradePrice {
    price: number;
    priceLevel: number;
  }
  
  
  export interface IPumpServiceMode {
    id: number;
    pump: number;
    serviceMode: string;
  }
