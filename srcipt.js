
const pages = [
    "homePage",
    "allFeatures",
    "pricing",
    "enterprise",
    "team",
    "signin",
    "signup",
    "solution",
    "whygit-hub"
];

console.log("huu")



const inputBox = document.getElementById("searchBox");
inputBox.addEventListener("input", ()=> {
    console.log(inputBox)
    console.log(inputBox.value)
    let value = inputBox.value.trim();
    console.log(value)
    if (pages.includes(value)) {

        window.location.href = value + ".html"

    }
});


const inputBox1 = document.getElementById("searchBox1");
inputBox1.addEventListener("input", ()=> {
    console.log(inputBox1)
    console.log(inputBox1.value)
    let value = inputBox1.value.trim();
    console.log(value)
    if (pages.includes(value)) {

        window.location.href = value + ".html"

    }
});