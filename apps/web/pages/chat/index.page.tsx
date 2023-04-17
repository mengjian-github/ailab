import { useEffect, useState } from "react";
import { ConfigModal, ModalMode, SessionConfig } from "./config-modal";
import { SideBar } from "./sidebar";
import { ChatPanel } from "./chat-panel";
import { setOpenAIToken } from "../../global-store";
import Head from "next/head";
import { RootState, store } from "./store";
import { Provider, useDispatch, useSelector } from "react-redux";
import { addSession, getSessionList, removeSessionById, setSessionList, updateSession } from "./store/session-list";

/**
 * 会话页面
 * @returns
 */
export function Chat() {
  const { sessionList } = useSelector((state: RootState) => state.sessionList)
  const dispatch = useDispatch()
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [configModalMode, setConfigModalMode] = useState(ModalMode.Create);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  // 获取会话列表, 并设置当前会话为第一个会话
  useEffect(() => {
    const list = getSessionList();
    dispatch(setSessionList(list));
      if (list.length > 0) {
        setActiveSessionId(list[0].id);
      }
  }, []);

  // 创建新会话
  const createNewSession = (values: SessionConfig) => {
   dispatch(addSession(values))
    // 设置当前会话为新创建的会话
    setActiveSessionId(values.id);
  };

  // 编辑会话
  const editSession = (values: SessionConfig) => {
    dispatch(updateSession(values))
  };

  // 创建新会话按钮点击
  const onCreateBtnClick = () => {
    setConfigModalOpen(true);
    setConfigModalMode(ModalMode.Create);
  };

  // 会话菜单被选中
  const onMenuSelect = (id: string) => {
    setActiveSessionId(id);
  };

  // 会话菜单编辑
  const onMenuEdit = (id: string) => {
    setConfigModalOpen(true);
    setConfigModalMode(ModalMode.Edit);
  };

  // 会话菜单删除
  const onMenuDelete = (id: string) => {
    dispatch(removeSessionById(id))
    // 如果删除的是当前会话, 则设置当前会话为第一个会话
    if (id === activeSessionId) {
      setActiveSessionId(sessionList[0]?.id ?? null);
    }
  };

  // 会话配置弹窗确定
  const onConfigModalOk = (values: SessionConfig) => {
    // 如果设置了openAI token, 则更新全局openAI token
    if (values.openAIToken) {
      setOpenAIToken(values.openAIToken);
    }

    // 关闭会话配置弹窗
    setConfigModalOpen(false);

    // 根据会话配置弹窗模式, 创建新会话或编辑会话
    if (configModalMode === ModalMode.Edit) {
      editSession(values);
    } else {
      createNewSession(values);
    }
  };

  return (
    <>
      <Head>
        <title>聊天助手（普通版）</title>
      </Head>
      <div className="flex">
        <SideBar
          onCreateBtnClick={onCreateBtnClick}
          onMenuSelect={onMenuSelect}
          onMenuEdit={onMenuEdit}
          onMenuDelete={onMenuDelete}
          sessionList={sessionList}
          selectedKeys={activeSessionId ? [activeSessionId] : []}
        />
        <ChatPanel
          sessionConfig={sessionList.find(
            (item) => item.id === activeSessionId
          )}
        />
      </div>
      <ConfigModal
        mode={configModalMode}
        initialSessionConfig={sessionList.find(
          (item) => item.id === activeSessionId
        )}
        open={configModalOpen}
        onOk={onConfigModalOk}
        onCancel={() => setConfigModalOpen(false)}
      />
    </>
  );
}

export default function ChatWrapper() {
  return <Provider store={store}>
    <Chat />
  </Provider>
}
