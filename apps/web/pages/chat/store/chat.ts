import { storage } from "../../../global-store";
import { Message } from "../chat-panel";

const MESSAGE_LIST_KEY = "MESSAGE_LIST_KEY";

/**
 * 获取消息列表
 * @param sessionId
 * @returns
 */
export async function getMessageList(sessionId: string): Promise<Message[]> {
  return (storage.get(`${MESSAGE_LIST_KEY}_${sessionId}`) as Message[]) || [];
}

/**
 * 设置消息列表
 * @param sessionId
 * @param messageList
 */
export async function setMessageList(
  sessionId: string,
  messageList: Message[]
) {
  storage.set(`${MESSAGE_LIST_KEY}_${sessionId}`, messageList);
}

/**
 * 添加消息
 * @param sessionId
 * @param message
 */
export async function addMessage(sessionId: string, message: Message) {
  const messageList = await getMessageList(sessionId);
  const index = messageList.findIndex((item) => item.id === message.id);

  // 如果已经存在，则更新消息
  if (index !== -1) {
    messageList[index] = message;
    setMessageList(sessionId, messageList);
    return;
  }

  messageList.push(message);
  setMessageList(sessionId, messageList);
}
