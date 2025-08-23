import { TreeView, createTreeCollection } from '@ark-ui/react/tree-view'
import type { ReactNode } from 'react'
import { FaChevronDown, FaHashtag, FaVolumeUp } from 'react-icons/fa'
import { PiPlus } from 'react-icons/pi'

export interface Node {
    id: string
    name: string
    icon?: ReactNode
    type?: 'text' | 'voice' | 'category'
    children?: Node[] | undefined
}

export const createTreeItems = createTreeCollection<Node>

export function TreeBody(props: TreeView.NodeProviderProps<Node>) {
    const { node, indexPath } = props
    const isGroup = Array.isArray(node.children) && node.children.length > 0

    return (
        <TreeView.NodeProvider key={node.id} node={node} indexPath={indexPath}>
            {isGroup ? (
                <TreeView.Branch className="mb-1">
                    <TreeView.BranchControl className="flex items-center gap-x-2 px-2 py-1 cursor-pointer hover:bg-muted-foreground hover:text-background rounded-lg group">
                        <TreeView.BranchIndicator>
                            <FaChevronDown size={12} />
                        </TreeView.BranchIndicator>
                        <TreeView.BranchText className="font-bold text-xs uppercase flex-1">
                            {node.name}
                        </TreeView.BranchText>
                        <button
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1"
                            title="Add Channel"
                        >
                            <PiPlus size={12} />
                        </button>
                    </TreeView.BranchControl>
                    <TreeView.BranchContent className=" ltr:pl-1 ltr:ml-4 ltr:border-l rtl:pr-1 rtl:mr-4 rtl:border-r border-muted-foreground/30 border-dashed">
                        {/* <TreeView.BranchIndentGuide /> */}
                        {Array.isArray(node.children) && node.children.map((child, index) => (
                            <TreeBody key={child.id} node={child} indexPath={[...indexPath, index]} />
                        ))}
                    </TreeView.BranchContent>
                </TreeView.Branch>
            ) : (
                <TreeView.Item className="flex items-center gap-x-2 px-2 py-1 rounded-lg cursor-pointer hover:bg-muted-foreground hover:text-background transition-colors group">
                    {/* <TreeView.ItemIndicator /> */}
                    <TreeView.ItemText className="flex items-center gap-x-2 text-sm ">
                        <ChannelIcon name={node.name} />
                        {node.name}
                    </TreeView.ItemText>
                </TreeView.Item>
            )}
        </TreeView.NodeProvider>
    )
}

function ChannelIcon({ name }: { name: string }) {
    if (name.toLowerCase().includes('voice')) return <FaVolumeUp size={16} />
    return <FaHashtag size={16} />
}
