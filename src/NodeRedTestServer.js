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
        await this.server.load(nodeArray,flow)
        const inputNode = this.server.getNode(inputNodeId)
        const outputNode = this.server.getNode(outputNodeId)
        // console.log('Got input: ',testInput)
        // console.log(inputNode,outputNode)
        await new Promise((resolve,reject) => {
            outputNode.on('input',(msg)=>{
                try{
                    resolve(msg)
                }
                catch(err)
                {
                    // console.error(`${err}`)
                    reject(err)
                }
                
            })
            inputNode.send(testInput)
        })
    }
}