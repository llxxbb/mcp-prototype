export default {
  preset: "ts-jest",
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    '^(\.{1,2}/.*)\.js$': '$1', // 移除斜杠，保留捕获组
  },
  roots: ["src", "test"],
  detectOpenHandles: true,
  forceExit: true,
};
