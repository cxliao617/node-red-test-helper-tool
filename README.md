# node-red-test-helper-tool
Make node-red-node-test-helper easier to use

# Dependencies
node-red >= 3.0.1
node-red-node-test-helper >= 0.3.0

# Usage
##  Setup nodered server with node-red-test-helper-tool
```javascript
const testServer = new NodeRedTestServer(NodeRedServer) 
```

## healthCheck

**nodeArray**: all the nodes in flow(you can get from [node-red-node-loader](https://www.npmjs.com/package/node-red-node-loader))

**flow**: flow from node-red

**NodeId**: the node you want to test

**return value**: boolean

```javascript
const testOuput = await testServer.testFlow(nodeArray,flow,inputNode,outputNode,mockInput)
```
### Example
```javascript
import {NodeLoader} from 'node-red-node-loader'
import helper from 'node-red-node-test-helper'
import {NodeRedTestServer} from 'node-red-test-helper-tool'
import fs from 'fs/promises'
helper.init(require.resolve('node-red'))

describe("healthCheck",()=>{
    const FILENAME = __dirname+"/flows/flow.json"
    // const nodeLoader = new NodeLoader()
    beforeAll((done)=>{
        helper.startServer(done)
    })
    afterAll((done)=>{
        helper.stopServer(done)
    })
    afterEach(()=>{
        
    })
    it("test node loader with node-red-node-loader, node-red-test-helper-tool and using async. healthCheck",async()=>{
        const testServer = new NodeRedTestServer(helper)
        await fs.readFile(FILENAME,'utf-8').then(async(res)=>{
            const flow = JSON.parse(res)
            const nodeArr = new NodeLoader().getNodeArray(res)
             
            const health = await testServer.healthCheck(nodeArr,flow,'n0')

        })
    })
} )
```

## testFlow

**nodeArray**: all the nodes in flow(you can get from [node-red-node-loader](https://www.npmjs.com/package/node-red-node-loader))

**flow**: flow from node-red

**inputNode**: the node you want to mock input from

**outputNode**: the node you want to get mock output

**mockInput**: provide with the input data for input node

**testOutput**: get the mock output to test

```javascript
const testOuput = await testServer.testFlow(nodeArray,flow,inputNode,outputNode,mockInput)
```

### Logic
```javascript
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
```
### Example
```javascript
import {NodeLoader} from 'node-red-node-loader'
import helper from 'node-red-node-test-helper'
import {NodeRedTestServer} from 'node-red-test-helper-tool'
import fs from 'fs/promises'
helper.init(require.resolve('node-red'))

describe("testFlow",()=>{
    const FILENAME = __dirname+"/flows/flow.json"
    // const nodeLoader = new NodeLoader()
    beforeAll((done)=>{
        helper.startServer(done)
    })
    afterAll((done)=>{
        helper.stopServer(done)
    })
    afterEach(()=>{
        
    })
    it("test node loader",async()=>{
        const testServer = new NodeRedTestServer(helper) //Setup nodered server
        await fs.readFile(FILENAME,'utf-8').then(async(res)=>{
            console.log(res)
            const flow = JSON.parse(res)
            const nodeArr = new NodeLoader().getNodeArray(res)
            const testOuput = await testServer.testFlow(nodeArr,flow,'n0','n1',{payload:"UpperCase"})//given input data
        })
    })
} )
```

## testFlowReceive

**nodeArray**: all the nodes in flow(you can get from [node-red-node-loader](https://www.npmjs.com/package/node-red-node-loader))

**flow**: flow from node-red

**inputNode**: the node you want to mock input from

**outputNode**: the node you want to get mock output

**mockInput**: provide with the input data for input node

**testOutput**: get the mock output to test

```javascript
const testOuput = await testServer.testFlowReceive(nodeArray,flow,inputNode,outputNode,mockInput)
```
### Logic
```javascript
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
```
### Example
```javascript
import {NodeLoader} from 'node-red-node-loader'
import helper from 'node-red-node-test-helper'
import {NodeRedTestServer} from 'node-red-test-helper-tool'
import fs from 'fs/promises'
helper.init(require.resolve('node-red'))

describe("testFlowReceive",()=>{
    const FILENAME = __dirname+"/flows/flow.json"
    // const nodeLoader = new NodeLoader()
    beforeAll((done)=>{
        helper.startServer(done)
    })
    afterAll((done)=>{
        helper.stopServer(done)
    })
    afterEach(()=>{
        
    })
    it("test node loader with node-red-node-loader, node-red-test-helper-tool and using async",async()=>{
        const flow = [{id:'n0',type:'lower-case',wire:[['n1']]},{id:'n1',type:'debug',wire:[[]]}]
        const testServer = new NodeRedTestServer(helper)
        const nodeArr = new NodeLoader().getNodeArrayFromFlow(flow)
            
        const testOuput = await testServer.testFlowReceive([...nodeArr,lowerNode],flow,'n0','n0',{payload:"UpperCase"})
    })
} )
```
[Example Repo](https://github.com/cxliao617/node-red-node-loader-example)