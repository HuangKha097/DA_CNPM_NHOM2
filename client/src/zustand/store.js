import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const createThemeSlice = (set) => ({
  theme: 'light',
  setTheme: (newTheme) => set({ theme: newTheme }),
});

const createBusDetailSlice = (set) => ({
  busDetail: {
    _id: '',
    driver: {},
    routeNumber: '',
    licensePlate: '',
    busStatus: '',
    capacity: 0,
    currentStudents: 0,
    lastUpdate: null,
    students: [],
  },
  setBusDetail: (value) => set((state) => ({ busDetail: { ...state.busDetail, ...value } })),

  busesList:[],
  setBusesList: (value) => set((state) => ({busesList: { ...state.busesList, ...value } })),
});

const createDriverDetailSlice = (set) => ({
  driverDetail: {
    _id: '',
    driverNumber: '',
    fullName: '',
    phone: '',
    licenseNumber: '',
    licenseClass: '',
    status: '',
    assignedBus: '',
  },
  setDriverDetail: (value) =>
    set((state) => ({ driverDetail: { ...state.driverDetail, ...value } })),
});

const createStudentDetailSlice = (set) => ({
  studentDetail: {
    _id: '',
    studentNumber: '',
    parentId: '',
    fullName: '',
    className: '',
    status: '',
    parentName: '',
    parentPhone: '',
    registeredBus: '',
  },
  setStudentDetail: (value) =>
    set((state) => ({ studentDetail: { ...state.studentDetail, ...value } })),
});
const createRouteDetailSlice = (set) => ({
  routeDetail: {
    _id: '',
    routeNumber: '',
    name: '',
    startLocation: '',
    endLocation: '',
    totalDistance: '',
    totalTime: '',
    status: '',
  },
  setRouteDetail: (value) => set((state) => ({ routeDetail: { ...state.routeDetail, ...value } })),
});

const initialMessageState = {
  messageType: '',
  targetRole: '',
  targetRecipient: '',
  customMessage: '',
  recipientList: [],

  isAiLoading: false,
  isSending: false,
  aiError: null,
  sendError: null,
};

const createMessageSlice = (set) => ({
  ...initialMessageState,
  historyMessage: [],

  setMessageState: (update) => {
    set((state) => ({ ...state, ...update }));
  },
  setHistoryMessage: (history) => set({ historyMessage: history }),

  resetMessageForm: () => set({ ...initialMessageState }),
});
export const useStore = create(
  persist(
    (set, get, api) => ({
      ...createThemeSlice(set, get, api),
      ...createBusDetailSlice(set, get, api),
      ...createDriverDetailSlice(set, get, api),
      ...createStudentDetailSlice(set, get, api),
      ...createRouteDetailSlice(set, get, api),
      ...createMessageSlice(set, get, api),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
      }),
    }
  )
);

export default useStore;
