import nodeResolve from "@rollup/plugin-node-resolve"

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
        await this.server.load(nodeArray,flow)
        const inputNode = this.server.getNode(inputNodeId)
        const outputNode = this.server.getNode(outputNodeId)

        await new Promise((resolve,reject) => {
            outputNode.on('input',(msg)=>{
                try{
                    testOutput = msg
                    resolve(msg)
                }
                catch(err)
                {
                    reject(err)
                }
                
            })
            inputNode.send(testInput)
        })
        this.server.unload()
        return testOutput
    }
    async testFlowReceive(nodeArray,flow,inputNodeId,outputNodeId,testInput)
    {
        let testOutput = undefined
        await this.server.load(nodeArray,flow)
        const inputNode = this.server.getNode(inputNodeId)
        const outputNode = this.server.getNode(outputNodeId)

        await new Promise((resolve,reject) => {
            outputNode.on('input',(msg)=>{
                try{
                    testOutput = msg
                    resolve(msg)
                }
                catch(err)
                {
                    reject(err)
                }
                
            })
            inputNode.receive(testInput)
        })
        this.server.unload()
        return testOutput
    }
}