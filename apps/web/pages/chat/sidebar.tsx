import { Button, Menu, MenuProps, Popconfirm } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { SessionConfig } from "./config-modal";
import { useState } from "react";

// 会话侧边栏属性
interface SideBarProps {
  onCreateBtnClick: () => void;
  onMenuSelect: (id: string) => void;
  onMenuEdit: (id: string) => void;
  onMenuDelete: (id: string) => void;
  sessionList: SessionConfig[];
  selectedKeys: string[];
}

// 会话侧边栏
type MenuItem = Required<MenuProps>["items"][number];

/**
 * 获取菜单项
 */
function getItem(
  label: React.ReactNode,
  key?: React.Key | null,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

/**
 * 会话侧边栏
 * @param props
 * @returns
 */
export function SideBar(props: SideBarProps) {
  const { sessionList, onMenuEdit, onMenuDelete, selectedKeys } = props;
  return (
    <div className="w-64  flex flex-col h-screen overflow-y-auto bg-slate-900">
      <Button className="m-4" ghost onClick={props.onCreateBtnClick}>
        新建会话
      </Button>
      <Menu
        theme="dark"
        mode="vertical"
        selectedKeys={selectedKeys}
        items={sessionList.map((session) =>
          getItem(
            <div className="flex items-center justify-between overflow-hidden w-full">
              <h2 className="text-sm font-normal text-white flex-1 min-w-0 max-w-full overflow-hidden text-ellipsis">
                {session.sessionName}
              </h2>
              <div>
                <EditOutlined
                  onClick={() => onMenuEdit(session.id)}
                  className="text-white"
                />
                <Popconfirm
                  title="确认删除"
                  description="您是否确认删除当前会话？"
                  onConfirm={() => onMenuDelete(session.id)}
                  okText="确认"
                  cancelText="取消"
                >
                  <DeleteOutlined className="text-white" />
                </Popconfirm>
              </div>
            </div>,
            session.id
          )
        )}
        onSelect={(menuInfo) => {
          props.onMenuSelect(menuInfo.key);
        }}
      />
    </div>
  );
}
