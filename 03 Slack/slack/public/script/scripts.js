const socket = io('http://localhost:8000');
let nsSocket = "";

// Listen for namespace's List
socket.on('nsList', (nsData) => {
    console.log("The list of namespaces has been arrived.");
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
            console.log(`Change the namespace to the ${endpoint}`);
        });
    });
    joinNamespace('/wiki');
});
