# @/is05

[![npm](https://img.shields.io/npm/v/@astronautlabs/is05)](https://npmjs.com/package/@astronautlabs/is05)
[![CircleCI](https://circleci.com/gh/astronautlabs/is05.svg?style=svg)](https://circleci.com/gh/astronautlabs/is05)

> **[📜 NMOS IS-05](https://specs.amwa.tv/is-05/)**  
> AMWA IS-05 NMOS Device Connection Management Specification (Stable)

> 📺 Part of the **Astronaut Labs Broadcast Suite**  
> [@/is04](https://github.com/astronautlabs/is04) |
> [@/is05](https://github.com/astronautlabs/is05) |
> [@/is07](https://github.com/astronautlabs/is07) |
> [@/rfc8331](https://github.com/astronautlabs/rfc8331) |
> [@/rtp](https://github.com/astronautlabs/rtp) |
> [@/scte104](https://github.com/astronautlabs/scte104) | 
> [@/scte35](https://github.com/astronautlabs/scte35) | 
> [@/st2010](https://github.com/astronautlabs/st2010) | 
> [@/st291](https://github.com/astronautlabs/st291)

> ⚠ **Alpha Quality**  
> This library is still in development and is subject to change

---

Implementation of AMWA's NMOS IS-05 standard for Connection Management

# Usage

```
npm install @astronautlabs/is04 @astronautlabs/is05
```

First, set up @astronautlabs/is04 as indicated by that package, including registering your senders and receivers.

Now, mount the `ConnectionApi`:

```typescript
@Mount() connectionApi : ConnectionApi
```

For each sender/receiver, use the `ConnectionService` to set up its _state_:

```typescript
let sender = this.registryService.addSender({
    // ...
});
let senderState = this.connectionService.getSenderState(sender.id);

senderState.activate = () => {
    let incomingChanges = senderState.staged;
    // use incomingChanges to modify the configuration of the sender
};
```

The library will call `activate()` whenever a staged change is set to be applied (immediately). The library will 
also handle relative and absolute timed activations for you, but you should note that it does so using regular Javascript
timers (`setTimeout`). If you need more accuracy for your activation scheduling, you can implement it yourself however 
you deem necessary:

```typescript
senderState.scheduleActivation = (completed) => {
    let activationDetails = senderState.staged.activation;
    // implement the various kinds of activation however you wish
    // when the moment of activation comes, you can execute the change 
    // however you want

    // ...

    // once the activation is completed, you must call the completed() 
    // callback. This allows the library to update the state of the 
    // Connection API as well as the state of the Node API (IS-04) for 
    // you.

    completed();

    // When you specify scheduleActivation, the "activate" callback is 
    // ignored, you do not have to call it, nor will the library call
    // it.
};
```

# Transport Types and Files 

When serving the `/transporttype` endpoint of the Connection API, this library
consults the registration information for the related resource (sender or receiver). The value of `transport` on that resource is sent back in the API response.

IS-05 also lets you indicate the _transport file_ for a sender. For RTP / ST 2110 this would be the SDP, for instance. To specify this, there is a `transportFile` property on the `ResourceState` object you get back from the `ConnectionService.getState()` family of methods.

```typescript
import { Sender } from "@astronautlabs/is04";
import { SenderState } from "@astronautlabs/is05";

// ...

let sender : Sender;
let senderState = connectionService.getSenderState(sender.id);

senderState.transportFile = {
    contentType: 'application/sdp',
    content: '...' // can also be a Node.js Buffer
};
```