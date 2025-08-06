import { create } from 'zustand';

export enum PageState {
  LOADING = 'loading',
  READY = 'ready',
  ENTERING = 'entering',
  EXTERED = 'entered',
  EXITING = 'exiting',
  EXITED = 'exited',
  ERROR = 'error',
}

type State = {
  pageState: PageState;
};

type Actions = {
  actions: {
    setPageState: (pageState: PageState) => void;

    reset: () => void;
  };
};

const initialState: State = {
  pageState: PageState.LOADING,
};

const usePageStateStore = create<State & Actions>((set) => ({
  ...initialState,

  actions: {
    setPageState: (pageState: PageState) => set({ pageState }),

    reset: () => set(initialState),
  },
}));

export default usePageStateStore;
