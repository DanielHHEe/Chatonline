const login = document.querySelector(".login")
const loginForm = document.querySelector(".login__form")
const loginIput = document.querySelector(".login__input")

const chat = document.querySelector(".chat")
const chatform = document.querySelector(".chat__form")
const chatIput = document.querySelector(".chat__input")
const chatMessages = document.querySelector(".chat__messages")

const user = { id: "", name: "", color: "" }

let websocket

const createMessageSelfElement = (content) => {
    const div = document.createElement("div")

    div.classList.add("message--self")
    div.innerHTML = content

    return div
}

const createMessageOtherElement = (content, sender, senderColor) => {
    const div = document.createElement("div")
    const span = document.createElement("span")

    div.classList.add("message--other")
    div.classList.add("message--self")
    span.classList.add("message--sender")
    span.style.color = senderColor

    div.appendChild(span)
    span.innerHTML = sender
    div.innerHTML += content

    return div
}

const colors = ["#e2411e", "#90da38", 
    "#31b8ca", "#e23445", 
    "#9f35ec", "#9695b8",
    "#eaba21", "#14daa2",
    "#14daa2", "#277da1"]

const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length)
    return colors[randomIndex]
}

const scroolScreen = () => {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
    })
}

const processMessage = ({ data }) => {
    const { userId, userName, userColor, content } = JSON.parse(data)

    const message = userId == user.id? createMessageSelfElement(content) : createMessageOtherElement(content, userName, userColor)
    chatMessages.appendChild(message)

    scroolScreen()

}


const handleLogin = (event) => {
    event.preventDefault()
    user.name = loginIput.value
    user.id = crypto.randomUUID()
    user.color = getRandomColor()

    login.style.display = "none"
    chat.style.display = "flex"
    websocket = new WebSocket("ws://localhost:8080")
    websocket.onmessage = processMessage 
}

const sendMessage = (event) => {
    event.preventDefault()

    const message = {
        userId: user.id,
        userName: user.name,
        userColor: user.color,
        content: chatIput.value
    }

    websocket.send(JSON.stringify(message)) 
    chatIput.value = "" 
}

loginForm.addEventListener("submit", handleLogin) 
chatform.addEventListener("submit", sendMessage) 
