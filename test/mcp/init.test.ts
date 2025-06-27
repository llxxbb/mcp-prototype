import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { globalConfig, initialized } from "../../src/mcp/init.js";

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
    expect(result.content[0].text).toContain(
      `[projectPath] must be set for first time`
    );
  });

  it("projectPath path invalid", async () => {
    const result = await initTool({
      projectPath: "/test/path",
    });
    expect(result.content[0].text).toContain(
      `Invalid project path: /test/path`
    );
  });

  it("projectPath ok", async () => {
    expect(initialized).toBe(false);
    var path = process.cwd();
    const result = await initTool({
      projectPath: path,
    });
    expect(result.content[0].text).toContain(`Initialization succeeded`);
    expect(globalConfig.projectPath).toBe(path);
    expect(initialized).toBe(true);
  });

  it("old should be retain", async () => {
    var path = process.cwd();
    await initTool({
      projectPath: path,
    });
    await initTool({
      prototypeRoot: "myTestPrototypes",
    });
    expect(globalConfig.projectPath).toBe(path);
    expect(globalConfig.prototypeRoot).toBe("myTestPrototypes");
  });
});
