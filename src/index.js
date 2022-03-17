document.addEventListener("DOMContentLoaded", () => {
    fetchDogs()
})

function fetchDogs() {
    fetch("http://localhost:3000/pups")
    .then( res => res.json())
    .then( dogs => renderDogBar(dogs))
}

function renderDogBar(dogs) {
    dogs.forEach((dog) => {
        const dogBar = document.getElementById("dog-bar")
        const span = document.createElement("span")
        span.innerText = dog.name
        dogBar.appendChild(span)
    })
}