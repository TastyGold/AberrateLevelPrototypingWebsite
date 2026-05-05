import { Component } from "./Component.js";


export class SignalSenderComponent extends Component {
  constructor({ receiverComponents = [] } = {}) {
    super();
    this.receiverComponents = receiverComponents;
  }

  sendSignal(strength) {
    this.receiverComponents.forEach(receiver => {
      receiver.receiveSignal(strength);
    });
  }

  addReceiver(receiverComponent) {
    if (!this.receiverComponents.includes(receiverComponent)) {
      this.receiverComponents.push(receiverComponent);
    }
  }

  removeReceiver(receiverComponent) {
    this.receiverComponents.filter(c => c !== receiverComponent);
  }

  removeAllReceivers() {
    this.receiverComponents = [];
  }
}
