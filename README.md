# node-red-test-helper-tool
Make node-red-node-test-helper easier to use

# Usage
## Step 1. Setup nodered server with node-red-test-helper-tool
```javascript=
const testServer = new NodeRedTestServer(NodeRedServer) 
```
## Step 2.
### nodeArray: all the nodes in flow(you can get from [node-red-node-loader](https://www.npmjs.com/package/node-red-node-loader))
### flow: flow from node-red
### inputNode: the node you want to mock input from
### outputNode: the node you want to get mock output
### mockInput: provide with the input data for input node
### testOutput: get the mock output to test
```javascript=
const testOuput = await testServer.testFlow(nodeArray,flow,inputNode,outputNode,mockInput)
```
# Example
```javascript=
import {NodeLoader} from 'node-red-node-loader'
import helper from 'node-red-node-test-helper'
import {NodeRedTestServer} from 'node-red-test-helper-tool'
import fs from 'fs/promises'
helper.init(require.resolve('node-red'))

describe("test node red flow",()=>{
    const FILENAME = __dirname+"/flows/flow.json"
    // const nodeLoader = new NodeLoader()
    beforeAll((done)=>{
        helper.startServer(done)
    })
    afterAll((done)=>{
        helper.stopServer(done)
    })
    afterEach(()=>{
        helper.unload()
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