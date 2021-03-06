import { Block } from '../block';
import * as Messages from '../messages/messages';

type jsonBlock = {id: number, type?: string, properties?: {name:string, text?:string}, geom?: {x: number, y: number, expanded?:boolean}, inputs?: Array<{id: string}>, outputs?: Array<{id: string}>};

class BlockTrigger extends Block {

    constructor(info: jsonBlock){
        super(info);

        setInterval(() => {
            this.publishFromInputs(Messages.getTriggerMessage());
        }, 2000);
    }

    public run(topic: string, message: string){
        super.run(topic, message);
        this.publishFromOutputs(message);
    }
}

export { BlockTrigger }