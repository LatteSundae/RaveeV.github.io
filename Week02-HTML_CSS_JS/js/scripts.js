function getCompanyName() {
    let c = document.getElementById("companyName")
    let name = prompt("Enter Company Name")
    console.log("User has input ",name)
    c.innerText = name
}