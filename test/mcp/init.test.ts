import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { globalConfig } from "../../src/mcp/init.js";

// Automatically mock fs module using __mocks__/fs.js
jest.mock("fs");

describe("initTool", () => {
  let initTool;

  beforeEach(async () => {
    // Dynamically import the module after mocks are set up
    const initModule = await import("../../src/mcp/init.js");
    initTool = initModule.initTool;
    // Reset globalConfig before each test
    Object.keys(globalConfig).forEach(key => delete globalConfig[key]);
  });

  // Schema field tests
  it("should require projectPath", async () => {
    const result = await initTool({ port: 3000 });
    const response = JSON.parse(result.content[0].text);
    expect(response.isOk).toBe(false);
  });

  it("should accept valid prototypeRoot", async () => {
    const args = { projectPath: "/test/path", prototypeRoot: "prototypes" };
    await initTool(args);
    expect(globalConfig.prototypeRoot).toBe(args.prototypeRoot);
  });

  it("should set default logDisable to false", async () => {
    const args = { projectPath: "/test/path", prototypeRoot: "" };
    await initTool(args);
    expect(globalConfig.logDisable).toBe(false);
  });

  it("should accept logDisable", async () => {
    const args = { projectPath: "/test/path", prototypeRoot: "", logDisable: true };
    await initTool(args);
    expect(globalConfig.logDisable).toBe(true);
  });

  it("should set default logFile", async () => {
    const args = { projectPath: "/test/path", prototypeRoot: "" };
    await initTool(args);
    expect(globalConfig.logFile).toBe("mcp-prototype.log");
  });

  it("should accept custom logFile", async () => {
    const args = { projectPath: "/test/path", prototypeRoot: "", logFile: "custom.log" };
    await initTool(args);
    expect(globalConfig.logFile).toBe("custom.log");
  });

  it("should set default port", async () => {
    const args = { projectPath: "/test/path", prototypeRoot: "" };
    await initTool(args);
    expect(globalConfig.port).toBe(3000);
  });

  it("should accept custom port", async () => {
    const args = { projectPath: "/test/path", prototypeRoot: "", port: 4000 };
    await initTool(args);
    expect(globalConfig.port).toBe(4000);
  });

  it("should set default marker position", async () => {
    const args = { projectPath: "/test/path", prototypeRoot: "" };
    await initTool(args);
    expect(globalConfig.marker?.position).toBe(0);
  });

  it("should accept marker position", async () => {
    const args = { projectPath: "/test/path", prototypeRoot: "", marker: { position: 1 } };
    await initTool(args);
    expect(globalConfig.marker?.position).toBe(1);
  });

  it("should set default marker disable", async () => {
    const args = { projectPath: "/test/path", prototypeRoot: "" };
    await initTool(args);
    expect(globalConfig.marker?.disable).toBe(false);
  });

  it("should accept marker disable", async () => {
    const args = { projectPath: "/test/p path", prototypeRoot: "", marker: { disable: true } };
    await initTool(args);
    expect(globalConfig.marker?.disable).toBe(true);
  });

  // Integration tests
  it("should initialize with empty config", async () => {
    const args = { projectPath: "/test/path", prototypeRoot: "" };
    await initTool(args);
    expect(globalConfig.projectPath).toBe(args.projectPath);
  });

  it("should update config partially with valid args", async () => {
    // First full update
    const args1 = { projectPath: "/test/path", prototypeRoot: "", port: 3000 };
    await initTool(args1);
    expect(globalConfig.projectPath).toBe(args1.projectPath);
    expect(globalConfig.port).toBe(args1.port);

    // Second partial update
    const args2 = { projectPath: "/test/path", prototypeRoot: "", logDisable: true };
    await initTool(args2);
    expect(globalConfig.logDisable).toBe(args2.logDisable);
    // Verify previous values are preserved
    expect(globalConfig.projectPath).toBe(args1.projectPath);
    expect(globalConfig.port).toBe(args1.port);
  });
});