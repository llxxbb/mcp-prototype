export interface TreeNode {
	path: string;
	name: string;
	children: TreeNode[];
	isLeaf: boolean;
	navName?: string;
}

export interface TreeItem {
	relativePath: string;
	navName: string;
}
