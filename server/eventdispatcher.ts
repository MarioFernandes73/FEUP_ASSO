import { Model } from "./model";
import { EventBus } from "./eventbus";
import { MqttRouter } from "./mqttrouter";

/**
 * 
 */
class EventDispatcher {

  /**
   * 
   * @param model 
   * @param actionBus 
   * @param mqttRouter 
   */
  constructor(model: Model, actionBus: EventBus, mqttRouter: MqttRouter) {

    // ModelDispatcher
    actionBus.on('CREATE_BLOCK', o => model.createBlock(o));
    actionBus.on('DESTROY_BLOCK', o => model.destroyBlock(o));
    actionBus.on('CHANGE_BLOCK_GEOMETRY', o => model.changeBlockGeometry(o));
    actionBus.on('CHANGE_BLOCK_PROPERTIES', o => model.changeBlockProperties(o));
    actionBus.on('CHANGE_BLOCK_INPUTS', o => model.changeBlockInputs(o));
    actionBus.on('CHANGE_BLOCK_INPUT_OPTION', o => model.changeBlockInputOption(o));
    actionBus.on('CHANGE_BLOCK_OUTPUTS', o => model.changeBlockOutputs(o));
    actionBus.on('CREATE_LINK', o => model.createLink(o));
    actionBus.on('CREATE_TYPE', o => model.createType(o));
    actionBus.on('COMMIT', () => model.commit());

    // MqttDispatcher
    actionBus.on('CHANGE_BLOCK_INPUTS', block => mqttRouter.subscribeInputNodes(block));
    actionBus.on('CHANGE_BLOCK_OUTPUTS', block => mqttRouter.subscribeOutputNodes(block));
    actionBus.on('CREATE_LINK', link => mqttRouter.createLink(link))
  }
}

export { EventDispatcher };