import { describe, it, expect, beforeEach } from "@jest/globals";
import { globalConfig, initialized, resetConfig } from "../../src/mcp/init.js";
import * as fs from "fs/promises";
import * as path from "path";
import os, { tmpdir } from "os";
describe("initTool", () => {
    var currentPath = process.cwd();
    var prototypeRoot = "tmp/prototype";
    var tempDir = path.join(currentPath, prototypeRoot);
    afterEach(async () => {
        // Clean up temp directory
        await fs.rm(tempDir, { recursive: true, force: true });
    });
    let initTool;
    beforeEach(async () => {
        // Dynamically import the module after mocks are set up
        const initModule = await import("../../src/mcp/init.js");
        initTool = initModule.initTool;
        // Reset globalConfig before each test
        resetConfig();
    });
    it("should require projectPath", async () => {
        const result = await initTool({});
        expect(result.content[0].text).toContain(`[projectPath] must be set for first time`);
    });
    it("projectPath path invalid", async () => {
        const result = await initTool({
            projectPath: "/test/path",
        });
        expect(result.content[0].text).toContain(`Invalid project path: /test/path`);
    });
    it("should require prototypeRoot", async () => {
        expect(initialized).toBe(false);
        const result = await initTool({
            projectPath: currentPath,
        });
        expect(result.content[0].text).toContain("[prototypeRoot] must be set for first time");
    });
    it("prototypeRoot is absolute path", async () => {
        expect(initialized).toBe(false);
        let absolutePath = "/tmp/test-mcp-prototypes";
        const result = await initTool({
            projectPath: currentPath,
            prototypeRoot: absolutePath,
        });
        await fs.rm(absolutePath, { recursive: true, force: true });
        expect(result.content[0].text).toContain(`Initialization succeeded`);
        expect(globalConfig.projectPath).toBe(currentPath);
        expect(globalConfig.prototypeRoot).toBe(absolutePath);
        expect(initialized).toBe(true);
    });
    it("prototypeRoot is relative path", async () => {
        expect(initialized).toBe(false);
        const result = await initTool({
            projectPath: currentPath,
            prototypeRoot: prototypeRoot,
        });
        expect(result.content[0].text).toContain(`Initialization succeeded`);
        expect(globalConfig.projectPath).toBe(currentPath);
        expect(globalConfig.prototypeRoot).toBe(tempDir);
        expect(initialized).toBe(true);
    });
    it("old should be retain", async () => {
        const result = await initTool({
            projectPath: currentPath,
            prototypeRoot: prototypeRoot,
        });
        await initTool();
        expect(globalConfig.projectPath).toBe(currentPath);
        expect(globalConfig.prototypeRoot).toBe(tempDir);
        expect(initialized).toBe(true);
    });
});
//# sourceMappingURL=init.test.js.map