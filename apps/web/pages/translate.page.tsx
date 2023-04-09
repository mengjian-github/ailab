import { Button, Input } from "antd";
import Head from "next/head";
import { useEffect, useState } from "react";
import { getOpenAIToken, setOpenAIToken } from "../global-store";

export default function Translate() {
  const [token, setToken] = useState("");
  const [prompt, setPrompt] = useState(
    "Translate the following English text to Chinese, ensuring that the translation is accurate, preserves the original meaning, and uses natural, fluent language:"
  );
  const [sourceText, setSourceText] = useState("");
  const [targetText, setTargetText] = useState("");

  useEffect(() => {
    setToken(getOpenAIToken() || "");
  }, []);

  const translate = async () => {
    if (!token) {
      return alert("请输入Open AI的token！");
    }

    if (!sourceText) {
      return alert("请输入要翻译的文本！");
    }

    const response = await fetch("/api/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: sourceText, token, prompt }),
    });

    // 处理SSE的返回
    const streamReader = response.body!.getReader();
    const utf8Decoder = new TextDecoder("utf-8");
    let dataBuffer = "";
    const readStream = async () => {
      const { done, value } = await streamReader.read();

      if (done) {
        console.error("Stream closed");
        return;
      }

      dataBuffer += utf8Decoder.decode(value);
      setTargetText(dataBuffer);
      const targetElement = document.getElementById("target") as HTMLElement;
      targetElement.scrollTop = targetElement?.scrollHeight;
      readStream();
    };

    readStream();
    setOpenAIToken(token);
  };

  return (
    <div className="p-8 text-xl font-bold">
      <Head>
        <title>AI翻译</title>
      </Head>
      <h1 className="text-lg mb-4">AI翻译</h1>
      <div className="flex flex-row">
        <Input
          placeholder="请输入Open AI的token"
          onChange={(event) => {
            setToken(event.target.value);
          }}
          value={token}
        />
        <Input
          className="ml-4"
          placeholder="请输入翻译的prompt"
          value={prompt}
          onChange={(event) => {
            setPrompt(event.target.value);
          }}
        />
        <div className="ml-4">
          <Button onClick={translate} type="primary">
            翻译
          </Button>
        </div>
      </div>
      <div className="flex flex-row mt-4 space-x-2">
        <div className="flex-1">
          <Input.TextArea
            rows={20}
            onChange={(e) => {
              setSourceText(e.target.value);
            }}
          />
        </div>
        <div className="flex-1">
          <Input.TextArea id="target" rows={20} value={targetText} />
        </div>
      </div>
    </div>
  );
}
