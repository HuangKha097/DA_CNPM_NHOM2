import * as BusService from '../service/BusService.js';

export const UseSearchBus = async (ActiveSecondTitle, valueSearch) => {
  if (!valueSearch.trim()) {
    return null;
  }
  try {
    let res;
    ActiveSecondTitle
      ? (res = await BusService.getBusesByRouteNumber(valueSearch))
      : (res = await BusService.getBusesByBusNumber(valueSearch));
    if (res?.success) return res?.data;
  } catch (error) {
    return error;
  }
};