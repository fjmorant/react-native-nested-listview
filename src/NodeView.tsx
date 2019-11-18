/* @flow */

import React, {useEffect, useState} from 'react'
import isEqual from 'react-fast-compare'
import {FlatList, TouchableWithoutFeedback, View} from 'react-native'

export interface INode {
    _internalId: string
    hidden: boolean
    opened: boolean
    [key: string]: any
}

export interface IProps {
    getChildren?: () => any
    getChildrenName: (item: INode) => any
    node: INode
    oldNode: INode
    level: number
    onNodePressed?: (item: any) => any
    renderNode: (item: any, level: number) => any
    renderChildrenNode?: (item: any) => any
    extraData?: any
}

export interface IState {
    node: INode
    extraData?: any
    opened: boolean
}

const NodeView = React.memo(
    ({
        renderNode,
        extraData,
        level,
        getChildrenName,
        node,
        oldNode,
        onNodePressed,
    }: IProps) => {
        // tslint:disable-next-line:variable-name
        const [_node, setNode]: [INode, any] = useState({
            opened: false,
            ...oldNode,
        })

        useEffect(() => {
            setNode({
                ...node,
                oldItems: node.items,
                opened: oldNode ? oldNode.opened : _node.opened,
            })
        }, [node])

        // tslint:disable-next-line:variable-name
        const _onNodePressed = () => {
            setNode({
                ..._node,
                opened: !_node.opened,
            })

            if (onNodePressed) {
                onNodePressed(_node)
            }
        }

        const renderChildren = (
            item: INode,
            oldItem: INode,
            _level: number // tslint:disable-line:variable-name
        ): any => {
            return (
                <NodeView
                    getChildrenName={getChildrenName}
                    node={item}
                    oldNode={oldItem}
                    level={_level + 1}
                    extraData={extraData}
                    onNodePressed={onNodePressed}
                    renderNode={renderNode}
                />
            )
        }

        const renderItem = ({item, index}: {item: INode; index: number}) =>
            renderChildren(item, _node.oldItems[index], level)

        const rootChildrenName = getChildrenName(_node)
        const rootChildren = _node[rootChildrenName]

        return (
            <>
                {!_node.hidden ? (
                    <TouchableWithoutFeedback onPress={_onNodePressed}>
                        <View>{renderNode(_node, level)}</View>
                    </TouchableWithoutFeedback>
                ) : null}
                {_node.opened && rootChildren ? (
                    <FlatList
                        data={rootChildren}
                        renderItem={renderItem}
                        extraData={extraData}
                        keyExtractor={(item: INode) => item._internalId}
                    />
                ) : null}
            </>
        )
    },
    isEqual
)

export default NodeView
