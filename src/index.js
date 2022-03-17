document.addEventListener("DOMContentLoaded", () => {
    // The DOM's initial render starts with the good
    // dog filter set to OFF.
    // the first thing that should happen is to
    // fetch the collection of all the dogs
    fetchAllDogs()

    // Grab all neccessary buttons and elements
    const filterBtn = document.getElementById("good-dog-filter")

    // Add event listener
    filterBtn.addEventListener("click", filterDogs)
})

function fetchAllDogs() {
    // Start the json server to watch the db.json file
    // Fetch to the database to GET the array of dog objects
    fetch("http://localhost:3000/pups")
    .then( res => res.json())
    // Pass the array to a callback function
    .then( dogs => renderDogBar(dogs))
}

function renderDogBar(dogs) {
    // Grab the dog bar and clear it first, just
    // to get rid of any changes and start fresh
    // before rendering.
    const dogBar = document.getElementById("dog-bar")
    dogBar.innerHTML = ""
    // Now that the dog bar has been cleared
    // we can iterate through the collection and
    // render a span for each dog
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
    h2.id = dog.id
    btn.id = "dog-button"
    // Conditional to handle btn text
    if (dog.isGoodDog === true) {
        btn.innerText = "Good Dog!"
    } else {
        btn.innerText = "Bad Dog!"
    }
    // add eventListener to handle PATCH request
    btn.addEventListener("click", updateDog)
    // Append elements to DOM
    dogCard.appendChild(img)
    dogCard.appendChild(h2)
    dogCard.appendChild(btn)
}

function updateDog(e) {
    const dogId = e.target.previousElementSibling.id
    let btnStatus = e.target.innerText
    let dogStatus;
    if (btnStatus === "Bad Dog!") {
        let updateBtn = document.getElementById("dog-button")
        updateBtn.innerText = "Good Dog!"
        dogStatus = true
    } else {
        let updateBtn = document.getElementById("dog-button")
        updateBtn.innerText = "Bad Dog!"
        dogStatus = false
    }
    fetch(`http://localhost:3000/pups/${dogId}`, {
        method: "PATCH",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            isGoodDog: dogStatus
        })
    })
    .then(res => res.json())
    .then(data => console.log(data))
}

function filterDogs(e) {
    // The event target is the good dog filter button element
    // and this is what it looks like for reference:
    // <button id="good-dog-filter">Filter good dogs: OFF</button>
    const filterBtn = document.getElementById("good-dog-filter")
    const filterStatus = e.target.innerText
    // console.log(filterStatus)
    if (filterStatus === "Filter good dogs: OFF") {
        filterBtn.innerText = "Filter good dogs: ON";
        fetchGoodDogs()
    } else {
        filterBtn.innerText = "Filter good dogs: OFF"
        fetchAllDogs()
    }
}

function fetchGoodDogs() {
    fetch("http://localhost:3000/pups")
    .then( res => res.json())
    // Pass the raw collection to the callback that will
    // filter it and create a new collection of only good dogs
    .then( dogs => createGoodDogCollection(dogs))
}

function createGoodDogCollection(dogs) {
    // Create a new collection of dogs to only include
    // dog objects where the "isGoodDog" key's value
    // is set to true (grabbing only good bois)
    let goodDogCollection = dogs.filter(dog => dog.isGoodDog === true)
    // pass the new collection to the renderDogBar function to
    // re render the bar and have spans that reflect only the good dogs
    renderDogBar(goodDogCollection)
}