
export class NodeRedTestServer{
    server
    constructor(server){
        this.server = server
    }
    async healthCheck(nodeArray,flow,testNodeId){
        let result = false
        await this.server.load(nodeArray,flow,async()=>{
            const n0 = this.server.getNode(testNodeId)
            // console.log(n0)
            result = n0!==null
        })
        this.server.unload()
        return result
    }
    async testFlow(nodeArray,flow,inputNodeId,outputNodeId,testInput){
        let testOutput = undefined
        await this.server.load(nodeArray,flow,()=>{
            const inputNode = this.server.getNode(inputNodeId)
            const outputNode = this.server.getNode(outputNodeId)
            console.log('Got input: ',testInput)
            await inputNode.send(testInput)
            await outputNode.on('input',(msg)=>{
                testOutput = msg
                console.log(msg)
            })
        })
        this.server.unload()
        return testOutput
    }
}