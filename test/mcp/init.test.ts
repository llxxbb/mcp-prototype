import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { globalConfig } from "../../src/mcp/init.js";

// Mock directory utils
jest.mock("../../src/utils/directory", () => ({
  checkDirectory: jest.fn().mockResolvedValue({
    isOk: () => true,
    isErr: () => false,
    value: true,
  }),
  ensureDirectory: jest.fn().mockResolvedValue({
    isOk: () => true,
    isErr: () => false,
    value: undefined,
  }),
}));


describe("initTool", () => {
  let initTool;

  beforeEach(async () => {
    // Dynamically import the module after mocks are set up
    const initModule = await import("../../src/mcp/init.js");
    initTool = initModule.initTool;
    // Reset globalConfig before each test
    Object.keys(globalConfig).forEach((key) => delete globalConfig[key]);
  });

  it("should require projectPath", async () => {
    const result = await initTool({});
    expect(result.content[0].text).toContain(`Initialization failed:`);
  });


  it("projectPath path invalid", async () => {
    const result = await initTool({
      projectPath: "/test/path"
    });
    expect(result.content[0].text).toContain(`Invalid project path: /test/path`);
  });

  it("projectPath ok", async () => {
    var path = process.cwd()
    const result = await initTool({
      projectPath: path
    });
    expect(result.content[0].text).toContain(`\"Initialization succeeded\"`);
    expect(globalConfig.projectPath).toBe(path);
  });

  

  it("should accept valid prototypeRoot", async () => {
    const args = { projectPath: "/test/path", prototypeRoot: "prototypes" };
    const result = await initTool(args);
    expect(result.content[0].text).toContain("Initialization succeeded");
    expect(globalConfig.prototypeRoot).toBe(args.prototypeRoot);
  });

  it("should set default logDisable to false", async () => {
    const args = { projectPath: "/test/path" };
    const result = await initTool(args);
    expect(result.content[0].text).toContain("Initialization succeeded");
    expect(globalConfig.logDisable).toBe(false);
  });

  it("should accept logDisable", async () => {
    const args = { projectPath: "/test/path", logDisable: true };
    const result = await initTool(args);
    expect(result.content[0].text).toContain("Initialization succeeded");
    expect(globalConfig.logDisable).toBe(true);
  });

  it("should set default logFile", async () => {
    const args = { projectPath: "/test/path" };
    const result = await initTool(args);
    expect(result.content[0].text).toContain("Initialization succeeded");
    expect(globalConfig.logFile).toBe("mcp-prototype.log");
  });

  it("should accept custom logFile", async () => {
    const args = { projectPath: "/test/path", logFile: "custom.log" };
    const result = await initTool(args);
    expect(result.content[0].text).toContain("Initialization succeeded");
    expect(globalConfig.logFile).toBe("custom.log");
  });

  it("should set default port", async () => {
    const args = { projectPath: "/test/path" };
    const result = await initTool(args);
    expect(result.content[0].text).toContain("Initialization succeeded");
    expect(globalConfig.port).toBe(3000);
  });

  it("should accept custom port", async () => {
    const args = { projectPath: "/test/path", port: 4000 };
    const result = await initTool(args);
    expect(result.content[0].text).toContain("Initialization succeeded");
    expect(globalConfig.port).toBe(4000);
  });

  it("should set default marker position", async () => {
    const args = { projectPath: "/test/path" };
    const result = await initTool(args);
    expect(result.content[0].text).toContain("Initialization succeeded");
    expect(globalConfig.marker?.position).toBe(0);
  });

  it("should accept marker position", async () => {
    const args = { projectPath: "/test/path", marker: { position: 1 } };
    const result = await initTool(args);
    expect(result.content[0].text).toContain("Initialization succeeded");
    expect(globalConfig.marker?.position).toBe(1);
  });

  it("should set default marker disable", async () => {
    const args = { projectPath: "/test/path" };
    const result = await initTool(args);
    expect(result.content[0].text).toContain("Initialization succeeded");
    expect(globalConfig.marker?.disable).toBe(false);
  });

  it("should accept marker disable", async () => {
    const args = { projectPath: "/test/path", marker: { disable: true } };
    const result = await initTool(args);
    expect(result.content[0].text).toContain("Initialization succeeded");
    expect(globalConfig.marker?.disable).toBe(true);
  });

  // Integration tests
  it("should initialize with empty config", async () => {
    const args = { projectPath: "/test/path" };
    const result = await initTool(args);
    expect(result.content[0].text).toContain("Initialization succeeded");
    expect(globalConfig.projectPath).toBe(args.projectPath);
  });

  it("should update config partially with valid args", async () => {
    // First full update
    const args1 = { projectPath: "/test/path", port: 3000 };
    const result1 = await initTool(args1);
    expect(result1.content[0].text).toContain("Initialization succeeded");
    expect(globalConfig.projectPath).toBe(args1.projectPath);
    expect(globalConfig.port).toBe(args1.port);

    // Second partial update
    const args2 = { projectPath: "/test/path", logDisable: true };
    const result2 = await initTool(args2);
    expect(result2.content[0].text).toContain("Initialization succeeded");
    expect(globalConfig.logDisable).toBe(args2.logDisable);
    // Verify previous values are preserved
    expect(globalConfig.projectPath).toBe(args1.projectPath);
    expect(globalConfig.port).toBe(args1.port);
  });
});
