# 目录结构规范

/ 项目根目录
  -src 代码目录
  -test 测试目录
  -doc 文档目录
    -codeDict.md 代码字典，对每个代码文件（不含图片等非逻辑文件）进行简要的功能说明
    -tech.md 技术说明。如采用的技术栈，算法等。
    -iterate 迭代目录
      -[迭代版本号] 
        -index.md 此次迭代的入口
        -prototype 原型设计目录
        -ui UI设计目录
        -design 程序设计目录
        -plan.md 开发计划，内有工作项编号的定义。
        -devLog_[工作项编号].txt 开发日志,可多个