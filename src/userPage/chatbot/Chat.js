import React, { Component } from 'react';

export class Chat extends Component {
    componentDidMount() {
        if (!window.kommunicate) { // Kiểm tra xem Kommunicate đã được load chưa
            (function (d, m) {
                var kommunicateSettings = {
                    "appId": "4dbc4257b16c783c2e85810b380b17fb",
                    "popupWidget": true,
                    "automaticChatOpenOnNavigation": true
                };
                var s = document.createElement("script"); 
                s.type = "text/javascript"; 
                s.async = true;
                s.src = "https://widget.kommunicate.io/v2/kommunicate.app";
                var h = document.getElementsByTagName("head")[0]; 
                h.appendChild(s);
                window.kommunicate = m; 
                m._globals = kommunicateSettings;
            })(document, window.kommunicate || {});
        } else {
            console.log("Kommunicate đã được load trước đó.");
        }
    }

    render() {
        return <div></div>;
    }
}
