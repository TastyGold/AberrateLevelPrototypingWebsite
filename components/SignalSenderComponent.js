import { Component } from "./Component";


export class SignalSenderComponent extends Component {
  constructor({ receiverComponents = [] } = {}) {
    super();
    this.receiverComponents = [];
  }

  sendSignal(strength) {
    this.receiverComponents.forEach(receiver => {
      receiver.receiveSignal(strength);
    });
  }

  addReceiver(receiverComponent) {
    this.receiverComponents.push(receiverComponent);
  }

  removeReceiver(receiverComponent) {
    this.receiverComponents.filter(c => c !== receiverComponent);
  }

  removeAllReceivers() {
    this.receiverComponents = [];
  }
}
