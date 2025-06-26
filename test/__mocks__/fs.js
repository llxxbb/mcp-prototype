const fs = jest.createMockFromModule('fs');

fs.promises = {
  stat: jest.fn().mockResolvedValue({ isDirectory: () => true })
};

module.exports = fs;