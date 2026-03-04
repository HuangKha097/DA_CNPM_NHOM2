import * as BusService from '../service/BusService.js';

export const fetchDriverBus = async (assignedBus) => {
  if (!assignedBus?.length) return;
  try {
    const busRefs = assignedBus;

    const results = await Promise.all(
      busRefs.map((busRef) => BusService.getBusesByBusId(busRef.busId))
    );

    const fetchedBuses = results.map((res) => (Array.isArray(res.data) ? res.data[0] : res.data));

    return fetchedBuses;
  } catch (error) {
    return error;
  }
};

export const fetchBusById = async (busId) => {
  if (!busId) return;
  try {
    const result = await BusService.getBusesByBusId(busId);
    const busData = result?.data?.[0];
    return busData;
  } catch (error) {
    return error;
  }
};
