import { Alert, Avatar, Button, Card, Empty, Input, List } from "antd";
import cn from "classnames";
import { SessionConfig } from "./config-modal";
import { useEffect, useState } from "react";
import { addMessage as addMessageToStore, getMessageList } from "./store/chat";
import { uuid } from "uuidv4";

// 会话面板属性
interface ChatPanelProps {
  sessionConfig?: SessionConfig;
}

// 消息类型
enum MessageType {
  Send,
  Reply,
}

// 消息
export interface Message {
  id: string;
  type: MessageType;
  text: string;
}

// 消息配置
const messageConf = {
  [MessageType.Send]: {
    classNames: {
      list: ["flex-row-reverse"],
      avatar: ["bg-teal-600", "ml-4"],
      card: ["bg-teal-600"],
    },
    avatar: "You",
    justify: "end",
  },
  [MessageType.Reply]: {
    classNames: {
      list: ["flex-row"],
      avatar: ["bg-indigo-600", "mr-4"],
      card: ["bg-indigo-600"],
    },
    avatar: "AI",
    justify: "start",
  },
};

/**
 * 会话面板
 * @param props
 * @returns
 */
export function ChatPanel(props: ChatPanelProps) {
  const { sessionConfig } = props;

  // 如果没有会话配置，则显示空
  if (!sessionConfig) {
    return (
      <div className="flex justify-center items-center w-full">
        <Empty />
      </div>
    );
  }

  const { systemPrompt, id } = sessionConfig;
  const [messageList, setMessageList] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>("");

  // 获取消息列表
  useEffect(() => {
    getMessageList(id).then((messageList) => {
      if (messageList.length > 0) {
        setMessageList(messageList);
        // 滚动到底部
        scrollToEnd();
      } else {
        // 如果没有消息，则发送欢迎语
        addMessage({
          id: uuid(),
          type: MessageType.Reply,
          text: "您好，欢迎来到AI实验室，请问有什么可以帮您？",
        });
      }
    });
  }, [id]);

  // 滚动到底部
  const scrollToEnd = () => {
    const chatList = document.getElementById("chat-list");
    if (chatList) {
      chatList.scrollTop = chatList.scrollHeight;
    }
  };

  const addMessage = (message: Message) => {
    setMessageList((prev) => {
      const index = prev.findIndex((item) => item.id === message.id);
      // 如果已经存在，则替换
      if (prev[index]) {
        prev[index] = message;
        return [...prev];
      }
      return [...prev, message];
    });
    addMessageToStore(id, message);
  };

  const sendMessage = async () => {
    // 首先，当前消息上屏
    addMessage({
      type: MessageType.Send,
      text: inputValue,
      id: uuid(),
    });

    // 然后，清空输入框
    setInputValue("");

    // 最后，发送消息
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: inputValue, ...sessionConfig }),
      });

      // 处理SSE的返回
      const streamReader = response.body!.getReader();
      const utf8Decoder = new TextDecoder("utf-8");
      let dataBuffer = "";
      // 先生成一个消息id
      const messageId = uuid();
      const readStream = async () => {
        const { done, value } = await streamReader.read();

        if (done) {
          console.error("Stream closed");
          return;
        }

        dataBuffer += utf8Decoder.decode(value);
        // 这里，我们需要将消息上屏
        addMessage({
          id: messageId,
          type: MessageType.Reply,
          text: dataBuffer,
        });

        scrollToEnd();
        readStream();
      };

      readStream();
    } catch (e) {
      console.error(e);
      alert("发送消息失败");
    }
  };

  return (
    <div className="flex relative justify-center flex-1">
      <div className="min-w-[80%] max-w-[80%] shrink-0">
        <List
          id="chat-list"
          className="h-[80vh] overflow-y-auto"
          dataSource={messageList}
          renderItem={(item) => {
            const conf = messageConf[item.type];
            return (
              <List.Item
                style={{ justifyContent: conf.justify }}
                className={cn("flex", conf.classNames.list)}
              >
                <Avatar
                  size="large"
                  className={cn("shrink-0", conf.classNames.avatar)}
                >
                  {conf.avatar}
                </Avatar>
                <Card
                  size="small"
                  className={cn("text-white", conf.classNames.card)}
                >
                  {item.text}
                </Card>
              </List.Item>
            );
          }}
        ></List>
      </div>

      <div className="absolute  bottom-8 left-16 right-16">
        {systemPrompt && (
          <Alert
            className="mb-4"
            message={`您当前存在AI系统设定(扮演角色), Prompt是"${systemPrompt}"`}
            type="info"
            showIcon
            closable
          />
        )}
        <div className="flex items-center space-x-4">
          <Input.TextArea
            rows={1}
            placeholder="请输入内容"
            value={inputValue}
            onChange={(event) => {
              setInputValue(event.target.value);
            }}
            onPressEnter={(event) => {
              event.preventDefault();
              if (!inputValue) {
                return alert("请输入内容");
              }
              sendMessage();
            }}
          />
          <Button
            type="primary"
            onClick={() => {
              if (!inputValue) {
                return alert("请输入内容");
              }
              sendMessage();
            }}
          >
            发送
          </Button>
        </div>
      </div>
    </div>
  );
}