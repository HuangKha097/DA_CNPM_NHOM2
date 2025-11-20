export  const initState = {
  loading: false,
  isRefreshing: false,
  data: [],
  error: null,
};

const dataReducer = (state = initState, action) => {
  switch (action.type) {
    case 'GET_DATA_REQUEST':
      return {
        ...state,
        loading: true,
      };
    case 'GET_DATA_SUCCESS':
      return {
        ...state,
        loading: false,
        data: action.data,
      };
    case 'UPDATE_DATA':
      return {
        ...state,
        isRefreshing: true,
      };
    case 'DONE_UPDATE_DATA':
      return {
        ...state,
        isRefreshing: false,
      };
    case 'GET_DATA_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.error,
      };
  }
};

export { dataReducer };
