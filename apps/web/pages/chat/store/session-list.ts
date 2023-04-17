import { createSlice } from "@reduxjs/toolkit";
import { SessionConfig } from "../config-modal";

const SESSION_LIST_KEY = "SESSION_LIST_KEY";

export interface SessionListState {
  sessionList: SessionConfig[];
}

const initialState: SessionListState = {
  sessionList: [],
};

export const sessionListSlice = createSlice({
  name: "sessionList",
  initialState,
  reducers: {
    setSessionList: (state, action) => {
      state.sessionList = action.payload;
      localStorage.setItem(SESSION_LIST_KEY, JSON.stringify(state.sessionList));
    },

    addSession: (state, action) => {
      state.sessionList.push(action.payload);
      localStorage.setItem(SESSION_LIST_KEY, JSON.stringify(state.sessionList));
    },
    updateSession: (state, action) => {
      const index = state.sessionList.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) {
        state.sessionList[index] = action.payload;
      }
      localStorage.setItem(SESSION_LIST_KEY, JSON.stringify(state.sessionList));
    },
    removeSessionById: (state, action) => {
      const index = state.sessionList.findIndex(
        (item) => item.id === action.payload
      );
      if (index !== -1) {
        state.sessionList.splice(index, 1);
      }
      localStorage.setItem(SESSION_LIST_KEY, JSON.stringify(state.sessionList));
    },
  },
});

export const { setSessionList } = sessionListSlice.actions;

export default sessionListSlice.reducer;

/**
 * 获取会话列表
 * @returns
 */
export async function getSessionList(): Promise<SessionConfig[]> {
  const sessionList = await localStorage.getItem(SESSION_LIST_KEY);
  try {
    return JSON.parse(sessionList || "[]");
  } catch (e) {
    return [];
  }
}

/**
 * 根据id获取会话
 * @param id
 * @returns
 */
export async function getSessionById(
  id: string
): Promise<SessionConfig | undefined> {
  const sessionList = await getSessionList();
  return sessionList.find((item) => item.id === id);
}
