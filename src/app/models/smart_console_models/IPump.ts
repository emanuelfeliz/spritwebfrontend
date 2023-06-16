export interface IGrade {
  id: number;
  red: number;
  blue: number;
  green: number;
  rbg: string;
  description: string;
  prices: Array<IGradePrice>
}

export interface IHose {
  hoseId: number;
  totalizerMoney: number;
  totalizerVolume: number;
  grades: Array<IGrade>;
}

export interface IGradePrice {
  price: number;
  priceLevel: number;
}

export interface IPumpAction {
  pump: number;
  action: string;
}

export interface IPump {
  grade: IGrade;
  status: string;
  pumpNo: number;
  volume: number;
  salePrice: number;
  saleProgress: number;
  isAuthored: boolean;
  hoses: Array<IHose>;
  priceLevel: number;
}
