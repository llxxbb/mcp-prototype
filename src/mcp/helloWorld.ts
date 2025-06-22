export function callTool(args: any): any {
  if (!args || typeof args.name !== 'string') {
    return {
      content: [{
        type: 'text',
        text: 'Invalid arguments: name is required',
      }],
      isError: true,
    };
  }

  return {
    content: [{
      type: 'text',
      text: `Hello, ${args.name}!`,
    }],
  };
}