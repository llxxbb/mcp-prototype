import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

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
    // 如果 data 是字符串，那么就直接返回，否则就将其转换为字符串
    let content: string;
    if (typeof data === "string") {
      content = data;
    } else {
      content = JSON.stringify(data, null, 2);
    }
    return {
      content: [
        {
          type: "text",
          text: content,
        },
      ],
      isError: false,
    };
  },
};