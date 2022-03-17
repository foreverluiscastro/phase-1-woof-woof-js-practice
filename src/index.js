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
    // We need the dog's id if we are going to
    // want to send a PATCH to the correct dog object.
    // I went back and added an id property to the
    // h2 in the dog card since the button already
    // had an id property set to "dog-button "for CSS purposes.
    // Since we have access to the button through the event,
    // we can use event.target.previousElementSibling.id
    // to grab the id of the h2 which is the dog's id 
    const dogId = e.target.previousElementSibling.id
    let btnStatus = e.target.innerText
    // the reason we initialized dogStatus without any
    // value is so that the value may be assigned based on 
    // a conditional statement before it is passed to the body
    // of the PATCH request
    let dogStatus;

    if (btnStatus === "Bad Dog!") {
        // Grab the element from the DOM to use good
        // old DOM manipulation to upodate it's inner Text
        let updateBtn = document.getElementById("dog-button")
        updateBtn.innerText = "Good Dog!"
        // Assign value to dogstatus
        dogStatus = true
    } else {
        let updateBtn = document.getElementById("dog-button")
        updateBtn.innerText = "Bad Dog!"
        dogStatus = false
    }

    // Now that dogStatus has been assigned, we can use it
    // to build the body of our PATCH request by passing it as
    // the value of the isGoodDog key.
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
    // The second response handler is for Developer purposes
    // so that we may see the PATCH return a successful response
    // object with isGoodDog value updated
    // .then(data => console.log(data))
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
        // Trigger the fetch that returns only good dogs
        fetchGoodDogs()
    } else {
        filterBtn.innerText = "Filter good dogs: OFF"
        // The filter is off so return all dogs
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