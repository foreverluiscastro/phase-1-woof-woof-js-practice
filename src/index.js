document.addEventListener("DOMContentLoaded", () => {
    fetchDogs()
})

function fetchDogs() {
    fetch("http://localhost:3000/pups")
    .then( res => res.json())
    .then( dogs => renderDogBar(dogs))
}

function renderDogBar(dogs) {
    dogs.map(dog => renderSpan(dog))
}

function renderSpan(dog) {
    const dogBar = document.getElementById("dog-bar")
    const span = document.createElement("span")
    span.innerText = dog.name
    span.addEventListener("click", () => {renderDog(dog)})
    dogBar.appendChild(span)
}

function renderDog(dog) {
    // Grabs the card
    const dogCard = document.getElementById("dog-info")
    // Clear the card (if there is a dog displayed)
    dogCard.innerHTML = ""
    // Create your elements
    const img = document.createElement("img")
    const h2 = document.createElement("h2")
    const btn = document.createElement("button")
    // Add info about dog to elements
    img.src = dog.image
    h2.innerText = dog.name
    // Conditional to handle btn text
    if (dog.isGoodDog === true) {
        btn.innerText = "Good Dog!"
    } else {
        btn.innerText = "Bad Dog!"
    }
    // Append elements to DOM
    dogCard.appendChild(img)
    dogCard.appendChild(h2)
    dogCard.appendChild(btn)
}