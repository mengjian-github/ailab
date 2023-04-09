import { SessionConfig } from "../config-modal";

const SESSION_LIST_KEY = "SESSION_LIST_KEY";

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
 * 设置会话列表
 * @param sessionList
 */
export async function setSessionList(sessionList: SessionConfig[]) {
  await localStorage.setItem(SESSION_LIST_KEY, JSON.stringify(sessionList));
}

/**
 * 添加会话
 * @param session
 */
export async function addSession(session: SessionConfig) {
  const sessionList = await getSessionList();
  sessionList.push(session);
  await setSessionList(sessionList);
}

/**
 * 根据id删除会话
 * @param session
 */
export async function removeSessionById(id: string) {
  const sessionList = await getSessionList();
  const index = sessionList.findIndex((item) => item.id === id);
  if (index !== -1) {
    sessionList.splice(index, 1);
  }
  await setSessionList(sessionList);
}

/**
 * 更新会话
 * @param session
 */
export async function updateSession(session: SessionConfig) {
  const sessionList = await getSessionList();
  const index = sessionList.findIndex((item) => item.id === session.id);
  if (index !== -1) {
    sessionList[index] = session;
  }
  await setSessionList(sessionList);
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
