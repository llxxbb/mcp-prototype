import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

export const response = {
  /**
   * 生成错误响应
   * @param message 错误信息
   */
  error: (message: string): CallToolResult => {
    return {
      content: [
        {
          type: "text",
          text: message,
        },
      ],
      isError: true,
    };
  },

  /**
   * 生成成功响应
   * @param data 响应数据
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  success: (data: any): CallToolResult => {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
        },
      ],
      isError: false,
    };
  },
};
