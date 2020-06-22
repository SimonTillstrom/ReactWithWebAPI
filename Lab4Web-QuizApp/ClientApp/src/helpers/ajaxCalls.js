import { Component } from 'react'

export class ajaxCalls extends Component {
    async genericFetch(target, method, token) {
        let resolvedData = "";

        await fetch(target, {
            method: method,
            headers: !token ?
                {} : { "Content-Type": "application/json", 'Authorization': `Bearer ${token}` }
        })
            .then(response => response.json())
            .then(data => {
                resolvedData = data;
            })
            .catch(error => {
                return error
            });
        return resolvedData
    }
}

const apiCalls = new ajaxCalls();

export default apiCalls