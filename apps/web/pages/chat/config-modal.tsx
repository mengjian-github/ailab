import { Form, Input, Modal } from "antd";
import { useEffect } from "react";
import { uuid } from "uuidv4";
import { getOpenAIToken } from "../../global-store";

/**
 * 会话配置弹窗模式
 */
export enum ModalMode {
  Create, // 创建
  Edit, // 修改
}

/**
 * 会话配置弹窗属性
 */
interface ConfigModalProps {
  mode: ModalMode;
  open: boolean;
  onOk: (values: SessionConfig) => void;
  onCancel: () => void;
  initialSessionConfig?: SessionConfig;
}

/**
 * 会话配置
 */
export interface SessionConfig {
  // 会话id
  id: string;
  // openAI token
  openAIToken: string;
  // 会话名称
  sessionName: string;
  // 采样温度
  temperature: number;
  // 模型参数
  topP: number;
  // 模型参数
  frequencyPenalty: number;
  // 模型参数
  presencePenalty: number;
  // 模型参数
  n: number;
  // 模型名称
  modelName: string;
  // 系统设定的提示语
  systemPrompt?: string;
  // 模型参数
  stop?: string[];
  // 模型参数
  timeout?: number;
  // 模型参数
  maxTokens?: number;
}

/**
 * 会话配置弹窗
 * @param props
 * @returns
 */
export function ConfigModal(props: ConfigModalProps) {
  const { mode, open, onOk, onCancel, initialSessionConfig } = props;
  const [form] = Form.useForm<SessionConfig>();

  /**
   * 默认会话配置
   */
  const DEFAULT_SESSION_CONFIG: SessionConfig = {
    id: uuid(),
    sessionName: "",
    systemPrompt: "",
    openAIToken: "",
    temperature: 1,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0,
    n: 1,
    modelName: "gpt-3.5-turbo",
  };

  // 如果是修改模式, 则设置为当前会话配置(为了回显), 否则设置为默认会话配置
  const initialValues =
    mode === ModalMode.Edit ? initialSessionConfig : DEFAULT_SESSION_CONFIG;

  useEffect(() => {
    // 重置表单, 并设置初始值
    if (initialValues) {
      const values = { ...initialValues };

      if (!values.openAIToken) {
        // 如果没有设置openAI token, 则设置为全局的openAI token
        values.openAIToken = getOpenAIToken() || "";
      }

      form.setFieldsValue(values);
    }
  }, [initialSessionConfig, mode]);

  return (
    <Modal
      title={mode === ModalMode.Create ? "创建会话配置" : "修改会话配置"}
      open={open}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            onOk(values);
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
      onCancel={onCancel}
    >
      <Form
        form={form}
        layout="vertical"
        name="session-config"
        initialValues={initialValues}
      >
        <Form.Item name="id" label="会话id">
          <Input readOnly disabled />
        </Form.Item>
        <Form.Item
          name="openAIToken"
          label="openAI Token"
          rules={[{ required: true, message: "请输入openAI Token" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="sessionName"
          label="会话名称"
          rules={[{ required: true, message: "请输入会话名称" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="systemPrompt"
          label="系统设定"
          tooltip="这里你可以设定AI的角色，整个会话都将保持这个设定。"
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="temperature"
          label="temperature"
          tooltip="采样温度应该在0和2之间，如果未指定，则默认为1。"
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="topP"
          label="topP"
          tooltip="每个步骤要考虑的标记的总概率质量介于0和1之间，默认为1。"
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="frequencyPenalty"
          label="frequencyPenalty"
          tooltip="根据频率惩罚重复的标记。"
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="presencePenalty"
          label="presencePenalty"
          tooltip="惩罚重复的令牌"
        >
          <Input />
        </Form.Item>
        <Form.Item name="n" label="n" tooltip="每个提示产生的聊天完成次数">
          <Input />
        </Form.Item>
        <Form.Item name="modelName" label="modelName" tooltip="使用的型号名称">
          <Input />
        </Form.Item>
        <Form.Item name="stop" label="stop" tooltip="生成时使用的停用词列表">
          <Input />
        </Form.Item>
        <Form.Item
          name="timeout"
          label="timeout"
          tooltip="请求 OpenAI 时使用的超时时间"
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="maxTokens"
          label="maxTokens"
          tooltip="在完成时生成的令牌最大数量。如果未指定，则默认为最大数量。"
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
