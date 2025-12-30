'use client';

import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';

export function SpeechToTextButton({ onTranscribed, className = '' }) {
    const [isListening, setIsListening] = useState(false);
    const [recognition, setRecognition] = useState(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                const instance = new SpeechRecognition();
                instance.continuous = true;
                instance.interimResults = true;
                instance.lang = 'en-US';

                instance.onstart = () => setIsListening(true);
                instance.onend = () => setIsListening(false);
                instance.onerror = (event) => {
                    console.error('Speech recognition error', event.error);
                    setIsListening(false);

                    if (event.error === 'network') {
                        let message = 'Speech recognition network error. This often happens if:';
                        message += '\n1. You are not on a secure connection (HTTPS).';
                        message += '\n2. You are using an IP address instead of "localhost".';
                        message += '\n3. There is no internet connection.';

                        if (window.location.hostname !== 'localhost' && !window.location.protocol.includes('https')) {
                            message += '\n\nTIP: Try accessing the site via http://localhost:3000 instead of your IP.';
                        }

                        alert(message);
                    } else if (event.error === 'not-allowed') {
                        alert('Microphone access denied. Please check your browser permissions.');
                    }
                };

                instance.onresult = (event) => {
                    let finalTranscript = '';
                    for (let i = event.resultIndex; i < event.results.length; i++) {
                        if (event.results[i].isFinal) {
                            finalTranscript += event.results[i][0].transcript;
                        }
                    }
                    if (finalTranscript) {
                        onTranscribed(finalTranscript);
                    }
                };
                setRecognition(instance);
            }
        }
    }, [onTranscribed]);

    const toggleListening = () => {
        if (!recognition) {
            alert('Speech recognition not supported in this browser.');
            return;
        }

        if (isListening) {
            recognition.stop();
        } else {
            try {
                recognition.start();
            } catch (err) {
                console.error('Failed to start recognition:', err);
            }
        }
    };

    return (
        <Button
            type="button"
            variant={isListening ? "destructive" : "outline"}
            size="sm"
            onClick={toggleListening}
            className={`flex items-center gap-2 ${className}`}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={isListening ? 'animate-pulse' : ''}
            >
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" x2="12" y1="19" y2="22" />
            </svg>
            {isListening ? 'Stop' : 'Dictate'}
        </Button>
    );
}
