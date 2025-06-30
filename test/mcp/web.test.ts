import { startTool, stopTool } from "../../src/mcp/web.js";
import { initTool } from "../../src/mcp/init.js";
import { join, dirname } from "path";
import { mkdirSync, writeFileSync, rmSync } from "fs";
import { fileURLToPath } from "url";

describe("web.ts", () => {
  const testPort = 3001;
  const currentDir = dirname(fileURLToPath(import.meta.url));
  const testRoot = join(currentDir, "..", "..", "test-static");

  beforeAll(async () => {
    // 创建测试静态文件目录
    mkdirSync(testRoot, { recursive: true });
    writeFileSync(join(testRoot, "index.html"), "<h1>Test</h1>");

    // 初始化配置
    await initTool({
      projectPath: testRoot,
      port: testPort,
      marker: {
        disable: true,
      },
    });
  });

  afterAll(async () => {
    // 清理测试目录
    try {
      await stopTool();
      rmSync(testRoot, { recursive: true, force: true });
    } catch (e) {
      console.error("Cleanup error:", e);
    }
  });

  describe("startTool", () => {
    it("should return error when not initialized", async () => {
      const result = await startTool();
      expect(result.isError).toBe(true);
      // expect(result.content[0].text).toContain("服务未初始化");
    });

    it("should return error when prototypeRoot not configured", async () => {
      const result = await startTool();
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain("prototypeRoot未配置");
    });

    it("should start server successfully", async () => {
      const result = await startTool();
      expect(result.isError).toBe(false);
      expect(result.content[0].text).toContain("http://localhost:3000");
    });

    it("should handle server start error", async () => {
      const result = await startTool();
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain("Start failed");
    });
  });

  describe("stopTool", () => {
    it("should stop server successfully", async () => {
      const result = await stopTool();
      expect(result.isError).toBe(false);
      expect(result.content[0].text).toContain("服务已停止");
    });

    it("should handle stop error", async () => {
      const result = await stopTool();
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain("Stop failed");
    });

    it("should succeed when no server instance", async () => {
      serverInstance = null;
      const result = await stopTool();
      expect(result.isError).toBe(false);
    });
  });
});
