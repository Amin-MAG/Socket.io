// Prompt to get the username
const username = prompt("Please enter your username.");
// const socket = io('http://localhost:8000');
const socket = io('http://localhost:8000');
let nsSocket = undefined;

// Listen for namespace's List
socket.on('nsList', (nsData) => {
    // Update namespaces
    let namespacesDiv = document.querySelector('.namespaces');
    namespacesDiv.innerHTML = "";
    nsData.forEach((data) => {
        let newDivNamespace = `<div class="mt-4 namespace" ns="${data.endpoint}"><img src="${data.image}"></div>`;
        namespacesDiv.innerHTML += newDivNamespace;
    });
    // Set click listener for each namespace item
    Array.from(document.getElementsByClassName('namespace')).forEach((element) => {
        element.addEventListener('click', (e) => {
            const endpoint = element.getAttribute('ns');
            joinNamespace(endpoint);
        });
    });
    // As the first page namespace
    joinNamespace('/wiki');
});
