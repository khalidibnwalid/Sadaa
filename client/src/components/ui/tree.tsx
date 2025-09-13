import { TreeView, createTreeCollection } from '@ark-ui/react/tree-view'
import type { ReactNode } from 'react'
import { FaChevronDown, FaHashtag, FaVolumeUp } from 'react-icons/fa'
import { PiPlus } from 'react-icons/pi'

export interface Node {
    id: string
    name: string
    icon?: ReactNode
    children?: Node[] | undefined
    indicator?: ReactNode
    endContent?: ReactNode
    onClick?: () => void
}

export const createTreeItems = createTreeCollection<Node>

export interface TreeBodyProps extends TreeView.NodeProviderProps<Node> {
    branchIndicator?: ReactNode
    endContent?: ReactNode
    itemEndContent?: ReactNode
    itemIcon?: ReactNode
}

export function TreeBody({
    node,
    indexPath,
    branchIndicator,
    endContent,
    itemEndContent,
    itemIcon
}: TreeBodyProps) {
    const isGroup = Array.isArray(node.children) && node.children.length > 0

    const BranchIndicator = branchIndicator || node.indicator || <FaChevronDown size={12} />
    const BranchEndContent = endContent || node.endContent || (
        <button
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1"
            title="Add Channel"
        >
            <PiPlus size={12} />
        </button>
    )

    // Customizable icon and end content for item
    const ItemIcon = itemIcon || node.icon || <ChannelIcon name={node.name} />
    const ItemEndContent = itemEndContent || node.endContent || null

    return (
        <TreeView.NodeProvider key={node.id} node={node} indexPath={indexPath}>
            {isGroup ? (
                <TreeView.Branch className="mb-1">
                    <TreeView.BranchControl className="flex items-center gap-x-2 px-2 py-1 cursor-pointer hover:bg-muted-foreground hover:text-background rounded-lg group">
                        <TreeView.BranchIndicator>
                            {BranchIndicator}
                        </TreeView.BranchIndicator>
                        <TreeView.BranchText className="font-bold text-xs uppercase flex-1 text-start">
                            {node.name}
                        </TreeView.BranchText>
                        {BranchEndContent}
                    </TreeView.BranchControl>
                    <TreeView.BranchContent className=" ltr:pl-1 ltr:ml-4 ltr:border-l rtl:pr-1 rtl:mr-4 rtl:border-r border-muted-foreground/30 border-dashed">
                        {/* <TreeView.BranchIndentGuide /> */}
                        {Array.isArray(node.children) && node.children.map((child, index) => (
                            <TreeBody
                                key={child.id}
                                node={child}
                                indexPath={[...indexPath, index]}
                                branchIndicator={branchIndicator}
                                endContent={endContent}
                                itemEndContent={itemEndContent}
                                itemIcon={itemIcon}
                            />
                        ))}
                    </TreeView.BranchContent>
                </TreeView.Branch>
            ) : (
                <TreeView.Item
                    className="group flex items-center gap-x-2 justify-between px-2 py-1 rounded-lg cursor-pointer hover:bg-muted-foreground hover:text-background transition-colors group"
                    onClick={node.onClick}
                >
                    {/* <TreeView.ItemIndicator /> */}
                    <TreeView.ItemText className="flex items-center gap-x-2 text-sm ">
                        {ItemIcon}
                        {node.name}
                    </TreeView.ItemText>
                    <span className='group-hover:opacity-100 opacity-0 transition-opacity'>
                        {ItemEndContent}
                    </span>
                </TreeView.Item>
            )}
        </TreeView.NodeProvider>
    )
}

function ChannelIcon({ name }: { name: string }) {
    if (name.toLowerCase().includes('voice')) return <FaVolumeUp size={16} />
    return <FaHashtag size={16} />
}
