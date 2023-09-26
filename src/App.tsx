import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';


function App() {
    const [messages, setMessages] = useState<string[]>([]);

    useEffect(() => {
        console.log("App component mounted");
        const socket = new SockJS('http://localhost:8080/messages');
        const stompClient = new Client({
            webSocketFactory: () => socket,
        });

        stompClient.onConnect = (frame) => {
            console.log("Connected to WebSocket");
            console.log('WebSocket Connection Frame:', frame);
            stompClient.subscribe('/topic/messages', (message) => {
                console.log("Received message", message.body);
                setMessages((prevMessages) => [...prevMessages, message.body as string]);
            });
        };

        stompClient.onStompError = (frame) => {
            console.log('Broker reported error:', frame.headers.message);
            console.log('Additional details:', frame.body);
        };

        stompClient.activate();
        console.log("Stomp client activated");// eslint-disable-line
    }, []); // eslint-disable-line

    return (
        <div className="App">
            <h1>WebSocket Messages</h1>
            <p>This is a static message.</p>
            {messages.map((message, index) => (
                <p key={index}>{message}</p>
            ))}
        </div>
    );
}

export default App;
