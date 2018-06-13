import { Block } from '../block'
import * as Messages from '../messages/messages';
import * as MessagesHandler from '../messages/messageshandler';
import TSMAP from 'ts-map'

type jsonBlock = {id: number, type?: string, properties?: {name:string, text?:string}, geom?: {x: number, y: number, expanded?:boolean}, inputs?: Array<{id: string}>, outputs?: Array<{id: string}>};
type blockState = { value? : number , enabled? : boolean };

class BlockArithmetic extends Block {

    private numberInputs: Array<number> = new Array();
    private inputsMap: TSMAP<string, blockState> = new TSMAP<string, blockState>();
    private operator: string;

    constructor(info: jsonBlock) {
        super(info);
        this.operator = info.properties.name;
    }

    public run(topic: string, message: string) : void
    {
        if(MessagesHandler.getMessageType(topic) == MessagesHandler.MessageType.REACHEDMYINPUT) {
            const key:string = MessagesHandler.getNodeFromTopic(topic);
            const value:number = MessagesHandler.getValueFromMessage(message);
            const enabled:boolean = MessagesHandler.getEnabledFromMessage(message);

            if(!isNaN(value)){       
                this.inputsMap.set(key, { value : value , enabled : enabled });
            }
        }

        if (this.inputsMap.size == this.Inputs.length) {
            //if the map has all the necessary inputs, send message
            let res:number = 0;
            let firstValue:boolean = true;
            this.inputsMap.forEach((blockState, key) => {
                // If block is inactive it doesn't use its value
                if(blockState.enabled == false) {
                    return; 
                }                            
                
                if(firstValue){
                    res = blockState.value;
                    firstValue = false;
                } else {
                    res = this.makeOperation(res, blockState.value);
                }
            })
            this.publishFromOutputs(res.toString());
        } else {
            //if map is missing any inputs -> pull from any missing inputs
            for(let i = 0; i < this.Inputs.length; i++){
                if(this.inputsMap.get(this.Inputs[i].id) == undefined){
                    this.publishFromInput(this.Inputs[i].id, Messages.pullInputs());
                }
            }
        }  
    }

    private makeOperation(res: number, value :number) : number {
        switch(this.operator){
            case "+": return res + value;
            case "-": return res - value;
            case "*": return res * value;
            case "/": return res / value;
            default: return res;
        }
    }
}

export { BlockArithmetic }