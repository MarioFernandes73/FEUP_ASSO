const WSS = require('ws').Server;
const wss = new WSS({ port: 8081 });
const EventBus = require('./eventbus').EventBus;
const Model = require('./model');
const ModelDispatcher = require('./modeldispatcher');

function loadmodel(socket) {
  const domainEventBus = new EventBus();
  const actionBus = new EventBus();
  const model = new Model(domainEventBus);
  const bch = new ModelDispatcher(model, actionBus);

  actionBus.replay([
    {event: 'CREATE_TYPE', data: {id: "input", icon: "fa-wifi"}},
    {event: 'CREATE_TYPE', data: {id: "console", icon: "fa-terminal", style: "red-block console-block"}},
    {event: 'CREATE_TYPE', data: {id: "random", icon: "fa-random", style: "red-block" }},
    {event: 'CREATE_TYPE', data: {id: "slider", icon: "fa-sliders", style: "green-block" }},
    {event: 'CREATE_TYPE', data: {id: "anonymous" }},
    {event: 'CREATE_TYPE', data: {id: "comment", style: "gray-block" }},

    {event: 'CREATE_BLOCK', data: {id: "blockA", type: "input", properties: {name: "Block"}}},
    {event: 'CHANGE_BLOCK_GEOMETRY', data: {id: "blockA", geom: {x: 100, y: 100}}},
    {event: 'CHANGE_BLOCK_OUTPUTS', data: {id: "blockA", outputs: [{id: "node_1"}]}},

    {event: 'CREATE_BLOCK', data: {id: "blockB", type: "console"}},
    {event: 'CHANGE_BLOCK_PROPERTIES', data: {id: "blockB", properties: {name: "Output", text: "-rw-r--r---rw--------rw-r--r--@drwxr-xr-xdrwx------"}}},
    {event: 'CHANGE_BLOCK_GEOMETRY', data: {id: "blockB", geom: {x: 200, y: 300, expanded: true, width: 150, height: 150 }}},
    {event: 'CHANGE_BLOCK_INPUTS', data: {id: "blockB", inputs: [{id: "node_2"}]}},
    {event: 'CHANGE_BLOCK_OUTPUTS', data: {id: "blockB", outputs: [{id: "node_4"}, {id: "node_5"}]}},

    {event: 'CREATE_BLOCK', data: {
      id: "blockC", type: "slider",
      properties: { name: "Cenas" },
      geom: { x: 300, y: 100 },
      inputs: [ { id: "node_3" } ] }},

    {event: 'CREATE_BLOCK', data: {
      id: "blockD", type: "anonymous",
      properties: { name: "Waat?" },
      geom: { x: 400, y: 200 },
      inputs: [ { id: "node_6" } ] }},

    {event: 'CREATE_BLOCK', data: {
      id: "commentA", type: "comment",
      properties: { name: "Attention!", text: "This is a very big comment." },
      geom: { x: 450, y: 30, expanded: true }}},

    {event: 'CREATE_LINK', data: {id: "node_1_node_2", from: {node: "node_1"}, to: {node: "node_2"}}},
    {event: 'CREATE_LINK', data: {id: "node_1_node_3", from: {node: "node_1"}, to: {node: "node_3"}}},
    {event: 'CREATE_LINK', data: {id: "node_4_node_3", from: {node: "node_4"}, to: {node: "node_3"}}},
    {event: 'CREATE_LINK', data: {id: "node_5_node_6", from: {node: "node_5"}, to: {node: "node_6"}}},

    {event: 'COMMIT', data: {}}
  ]);

  const json = JSON.stringify({ event: 'DOMAIN_EVENT', data: { event: 'SNAPSHOT', data: model }});

  try {
    socket.send(json);
    console.log(`Sent: ${json}`);
  } catch(e) {
    console.log("Error while deserializing the model.");
  }
}

function parseMessage(message) {
  console.log(`Received: ${message}`);
}

wss.on('connection', (socket) => {
  console.log('Opened connection 🎉');

  socket.send(JSON.stringify({ event: 'DEBUG', data: 'ack' }));

  loadmodel(socket);

  socket.on('message', parseMessage);
  socket.on('close', () => console.log('Closed Connection 😱'));
});

let toggle = false;

setInterval(() => {
  toggle = !toggle;
  /* const json = JSON.stringify({ event: 'DOMAIN_EVENT', data: { event: toggle?'select-block':'unselect-block', id: 'blockB' } });

  wss.clients.forEach((client) => {
    client.send(json);
    console.log(`Sent: ${json}`);
  }); */
}, 2000);