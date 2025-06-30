import { initTool } from "../../src/mcp/init.js";
import { response } from "../../src/utils/response.js";
import * as fs from "fs/promises";
import * as path from "path";
import os from "os";

describe("initTool", () => {
  let tempDir: string;

  beforeEach(async () => {
    // Create a temp directory for tests
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "mcp-test-"));
  });

  afterEach(async () => {
    // Clean up temp directory
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  it("should convert relative prototypeRoot to absolute path", async () => {
    const relativePath = "test-prototype";
    const result = await initTool({
      projectPath: tempDir,
      prototypeRoot: relativePath,
    });

    expect(result).toEqual(response.success("Initialization succeeded"));

    // Verify directory was created
    const dirExists = await fs
      .access(path.join(tempDir, relativePath))
      .then(() => true)
      .catch(() => false);
    expect(dirExists).toBe(true);
  });

  it("should keep absolute prototypeRoot unchanged", async () => {
    const absolutePath = path.join(tempDir, "absolute-path");
    const result = await initTool({
      projectPath: tempDir,
      prototypeRoot: absolutePath,
    });

    expect(result).toEqual(response.success("Initialization succeeded"));

    // Verify directory was created at exact path
    const dirExists = await fs
      .access(absolutePath)
      .then(() => true)
      .catch(() => false);
    expect(dirExists).toBe(true);
  });

  it("should handle directory creation error", async () => {
    // Create a file with the same name to force error
    const conflictPath = path.join(tempDir, "conflict");
    await fs.writeFile(conflictPath, "test");

    const result = await initTool({
      projectPath: tempDir,
      prototypeRoot: conflictPath,
    });

    expect(result.content[0].text).toContain("Failed to process prototypeRoot");
  });

  it("should skip directory creation if already exists", async () => {
    const existingDir = path.join(tempDir, "existing");
    await fs.mkdir(existingDir);

    const result = await initTool({
      projectPath: tempDir,
      prototypeRoot: existingDir,
    });

    expect(result).toEqual(response.success("Initialization succeeded"));
  });

  // 41-65行相关测试
  it("should handle path normalization for relative paths", async () => {
    const relativePath = "../test-prototype";
    const normalizedPath = path.normalize(path.join(tempDir, relativePath));

    const result = await initTool({
      projectPath: tempDir,
      prototypeRoot: relativePath,
    });

    expect(result).toEqual(response.success("Initialization succeeded"));
    await fs.access(normalizedPath); // 验证路径已创建
  });

  it("should reject invalid path characters", async () => {
    const invalidPath = path.join(tempDir, "invalid*path");

    const result = await initTool({
      projectPath: tempDir,
      prototypeRoot: invalidPath,
    });

    expect(result.content[0].text).toContain("Invalid path");
  });

  it("should handle empty prototypeRoot", async () => {
    const result = await initTool({
      projectPath: tempDir,
      prototypeRoot: "",
    });

    expect(result.content[0].text).toContain("Path cannot be empty");
  });
});
