const supabaseUrl = 'https://lzedjixhemobpcxymauj.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6ZWRqaXhoZW1vYnBjeHltYXVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2Nzg0NTEsImV4cCI6MjA3MzI1NDQ1MX0.LN-iJTKwARf36DD5c--hljbImEv1i95jCxluXsSF2OI"
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey)
// console.log(supabase);
// console.log(supabase.storage);


// =====================   Sign in  =====================

// document.getElementById("signin").addEventListener("submit", (e) => {
//     getData(e)
// });

function signin(event) {
    event.preventDefault()
    getData(event)
}


document.addEventListener("DOMContentLoaded", () => {

    if ((null == localStorage.getItem("signin")) && (!window.location.href.endsWith("signin.html")) && (!window.location.href.endsWith("signup.html"))) {

        window.location.href = "signin.html"

        // showFolder()
    }
    // let leangth = document.querySelector(".repositorys").children
    // console.log(leangth.length, leangth);
    // leangth = Array.from(leangth)
    // leangth.forEach(a => {
    //     console.log(a);
    // })
    // console.log("lengsdkjgiusagiudsgifgasiufgasdu   :dfgjkagjfgiuafudsauifu  :" + document.querySelector(".repositorys").children.length);

    if (document.querySelector(".repositorys").children.length <= 1) {

        showFolder()
    }



})

// ========================== get user data ===========================

async function getData(e) {
    e.preventDefault()
    const { data, error } = await supabase
        .from("Users")
        .select("*");

    console.log("this is inside the file uploading ")
    let userName = document.getElementById("userName")
    let password = document.getElementById("Password")
    if (error) {
        console.error("Error:", error.message);
    } else {
        console.log("Data:", data);
        let obj = data.filter(userObj => userObj.name == userName.value && userObj.password == password.value)
        if (obj.length != 0) {
            console.log(JSON.stringify(obj[0]));

            localStorage.setItem("signin", JSON.stringify(obj[0]))
            window.location.href = "fileManagement.html"
            // showTheProject()
        }
        else {

            alert("enter the valid user name or password")
        }
    }
}

function signup(event) {
    event.preventDefault()
    console.log("ajfgkjasgfjaf");
    if (form.checkValidity()) {
        let signupUserName = document.getElementById("signupName").value
        let signupPassword = document.getElementById("signupPassword").value
        let signupEmail = document.getElementById("signupEmail").value
        console.log(signupUserName, signupPassword, signupEmail);

        insertData(signupUserName, signupPassword, signupEmail);
    } else {
        // This will trigger the browser's native validation messages
        // if any required fields are empty.
        console.log("Form is invalid. Please fill out all required fields.");
    }
}



// ================= insert user =====================

async function insertData(userName, password, email) {
    const { data, error } = await supabase
        .from("Users")
        .insert([{ name: userName, email: email, age: 18, password: password }]);

    if (error) {
        console.error("Error:", error.message);
    } else {
        console.log("Data:", data);
        window.location.href = "signin.html"
    }
}

// ==================== delete data ====================
async function deleteData(path) {

    // let userName = JSON.parse(localStorage.getItem("signin"))["name"]
    let currentProject = localStorage.getItem("currentProject")
    console.log("path", path.trim());

    const { data, error } = await supabase.storage
        .from(bucketName)
        .remove([path])

    if (error) {
        console.log("error to delete : ", error);
    }
    else {
        showTheProject(currentProject)
    }
}

// =================== show the folder =========================

async function showFolder() {
    let userId = JSON.parse(localStorage.getItem("signin")).userId

    const { data, error } = await supabase
        .from("projects")
        .select('*')
        .eq('userId', userId)

    if (error) {
        console.error('Error fetching data:', error);
        return null;
    }

    let reposities = document.querySelector(".repositorys");
    // console.log(reposities);
    // console.log("d", data);
    data.forEach(a => {
        let btn = document.createElement("button");
        btn.innerHTML = `<i class="fa-solid fa-folder"></i>  ${a.project}`;
        reposities.appendChild(btn);
    })
    // console.log("addd : ", reposities.childNodes.length);

    localStorage.setItem("projects", JSON.stringify(data))
    return data;
}



//   insertData();
// =========== user icon ==============

document.getElementById("userData").addEventListener("click", (e) => {
    userInfo(e)
})

document.addEventListener("click", (e) => {

    // if(e.target.id != "userData"){
    //     document.getElementById("userData").children[0].style.display = "none";
    // }
    if (e.target.id == "userData") {
        document.getElementById("userData").children[0].style.display = "flex";
    }
    else if (e.target.id == "userLogin") {
        console.log("super");
        document.getElementById("userData").removeEventListener("click", (e) => {
            userInfo(e)
        })
    }
    else {
        document.getElementById("userData").children[0].style.display = "none";

    }
})

function userInfo(e) {
    let user = JSON.parse(localStorage.getItem("signin"))
    let div = e.target.children[0];
    // div.innerHTML =""
    let p = document.getElementById("userLoginName")
    console.log(e.target.children[0].style.display = "flex");
    // let p = document.createElement("p")
    p.innerHTML = `<i id="userData" class="fa-solid fa-user"></i>  ${user.name}`
}

// =================== log out ==============================

document.getElementById("userLogOut").addEventListener("click", () => {
    if (confirm("are you sure?")) {

        localStorage.clear();
        window.location.href = "homePage.html"
    }

})

// =========================  New edition  upload files ============================


// ====================== take html ========================

const uploadForm = document.getElementById('upload-form');
const fileInput = document.getElementById('file-input');
const gallery = document.getElementById('gallery');

// ===================== bugget and file =================

const bucketName = 'Upload';
const folderName = 'myfolder';



// ============================ upload files ================================
async function handleUpload(event) {
    event.preventDefault();
    console.log(event.target);

    let userName = JSON.parse(localStorage.getItem("signin"))["name"]
    let currentProject = localStorage.getItem("currentProject")
    const file = event.target.files[0];
    if (!file) {
        alert('Please select a file to upload.');
        return;
    }

    const filePath = `${folderName}/${userName}/${currentProject}/${file.name}`;


    const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
            upsert: true // Set to true if you want to overwrite a file with the same name
        });

    if (error) {
        console.error('Error during upload:', error);
        alert('Upload failed: ' + error.message);
    } else {
        console.log('File uploaded successfully!', data);
        showTheProject(currentProject)
        alert('File uploaded successfully!');
    }
}

// ================================== show the image ==================================
async function displayImages() {
    gallery.innerHTML = '';

    const { data, error } = await supabase.storage
        .from(bucketName)
        .list(folderName);

    if (error) {
        console.error('Error listing files:', error);
        return;
    }

    const pngFiles = data.filter(file => file.name.endsWith('.png') || file.name.endsWith('.jpg'));

    if (pngFiles.length === 0) {
        gallery.innerHTML = '<p>No PNG images found.</p>';
        return;
    }

    pngFiles.forEach(file => {
        const { data: { publicUrl } } = supabase.storage
            .from(bucketName)
            .getPublicUrl(`${folderName}/${file.name}`);

        const imgElement = document.createElement('img');
        imgElement.src = publicUrl;
        imgElement.alt = `Image of ${file.name}`;

        gallery.appendChild(imgElement);
    });
}

// =================================== create folder ==========================================

document.getElementById("create").addEventListener("click", (e) => {
    e.preventDefault()
    document.getElementById("create-file").style.display = "flex"
})


document.getElementById("create-file").addEventListener("submit", (e) => {
    e.preventDefault()
    let value = document.getElementById("file").value
    console.log(value);

    createFolder(value)
})



async function createFolder(val) {
    let userName = JSON.parse(localStorage.getItem("signin"))
    const filePath = `${folderName}/${userName["name"]}/${val}`;
    console.log(filePath);

    const { data3, error3 } = await supabase.storage
        .from(bucketName)
        .upload(`${filePath}/.keep`, new File([], '.keep', { type: 'text/plain' }), {
            cacheControl: "3600",
            upsert: false
        });

    if (error3) {
        console.error('Error during upload:', error3);
        console.log('Upload failed: ' + error3.message);

    } else {
        let newProject = [{ userId: userName.userId, project: val }];
        const { data, error } = await supabase
            .from("projects")
            .insert(newProject)
            .select();

        if (error) {
            console.error("Error:", error.message);
        } else {
            console.log("Data:", data);
        }
        console.log('File uploaded successfully!', data3);
        alert('File uploaded successfully!');
    }
}


document.querySelector(".repositorys").addEventListener("click", (e) => {
    e.preventDefault()
    let data = JSON.parse(localStorage.getItem("projects"))
    let root = JSON.parse(localStorage.getItem("signin"))

    data = data.filter(a => a.project == (e.target.innerText).trim())

    if (data.length > 0) {
        document.querySelector(".repositoriesProject").style.display = 'flex'
        document.querySelector(".repoTitle").innerText = `${root.name}/${data[0].project}`
        showTheProject(data[0].project)
        localStorage.setItem("currentProject", data[0].project)

    }
    document.getElementById("create-file").style.display = "none"
})


//  ===== call the upload function =======

document.querySelector('.repositoriesProject>div>input').addEventListener('input', handleUpload);




// ====== display the image =========

// document.getElementById("view").addEventListener("click" ,displayImages)




//  ===== view file =========

// document.getElementById("viewFile").addEventListener("click",(e)=>{
// fetchAndDisplayText("index.html")
// })





//  ===============  call show the project  ============

// document.getElementById("project").addEventListener("click",(e)=>{
//     showTheProject()
// })

// ================= show the project =============


async function showTheProject(folder) {
    console.log("i am in");
    let userName = JSON.parse(localStorage.getItem("signin"))["name"]
    const filePath = `${folderName}/${userName}/${folder}`;
    const { data, error } = await supabase.storage
        .from(bucketName)
        .list(filePath);

    if (error) {
        console.error('Error listing files:', error);
        return;
    }
    // console.log("data : " + JSON.stringify(data));

    let table = document.querySelector("table")
    // let tbody = table.querySelector("tbody")
    // console.log(table.children,table.children.length)
    // let cla = document.getElementsByClassName("asfjsd");

    // console.log(cla);
    // console.log(document.querySelectorAll(".asfjsd").forEach((arr)=>{
    //     arr.remove();
    // }));

    // table.appendChild(tbody)
    let show = document.querySelector(".showFileContent")
    show.innerHTML = "";
    let rowClasss = document.querySelectorAll(".asfjsd")
    console.log(rowClasss.forEach((arr) => {
        arr.remove();
    }));
    data.forEach(file => {

        if (file.name[0] != ".") {
            let tr = document.createElement("tr")
            tr.className = "asfjsd"

            table.appendChild(tr)
            console.log("file name : ", file.name);

            let td = document.createElement("td")
            // console.log(file.name);
            // let i = document.createElement("i")
            // i.classList.add("fa-light","fa-file")
            td.innerHTML = `<i class="fa-solid fa-file"></i> ${file.name}`
            // let p=document.createElement("p")
            // p.innerText="a"
            tr.appendChild(td)
            // tr.appendChild(p)
            // tr.appendChild(p)
        }
    });
    let datas = document.querySelector("table").childNodes;
    console.log("datas : ", datas);


    datas.forEach(a => {
        console.log(a);

        if (a.className == "asfjsd") {
            a.addEventListener("click", (e) => {
                console.log(e.target.innerHTML)
                fetchAndDisplayText(filePath, (e.target.innerText).trim())
            })
        }

    })


}








// ======================================== create file =========================================

// document.getElementById("create").addEventListener("click",(e)=>{
//     document.getElementById("create-file").style.display= "flex"
// })




// document.getElementById("create-file").addEventListener("submit",()=>{
//     let value = document.getElementById("file").value
//     console.log(value);

//     createFolder(value)
// })




// ======================================== show the file content ===================================================

async function fetchAndDisplayText(filePath, file) {
    const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(`${filePath}/${file}`);

    console.log(publicUrl);


    try {
        const response = await fetch(publicUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let a = document.createElement("a")
        let a1 = document.createElement("a")
        a1.innerHTML = `<i class="fa-solid fa-trash"></i>`
        a.innerHTML = `<i class="fa-solid fa-download"></i>`
        console.log(typeof file, response);

        a.href = file
        a.download = file
        const fileContent = await response.text();
        let div = document.createElement("div")
        div.style.display = "flex";
        div.style.padding = "10px"
        div.style.border = "2px solid #3d444d"
        div.style.justifyContent = "space-between"
        div.style.alignItems = "center"
        div.style.backgroundColor = "#151B23"
        document.querySelector(".showFileContent").innerHTML = ""
        let title = document.createElement("h1")
        title.innerHTML = file;
        const contentContainer = document.createElement('pre');
        contentContainer.textContent = fileContent;
        contentContainer.style.border = "1px solid #3d444d"
        contentContainer.style.padding = "10px"
        contentContainer.style.overflow = "scroll"
        console.log("div width : ", div.clientHeight)
        contentContainer.style.height = "90%"
        contentContainer.style.scrollbarWidth = "none"
        contentContainer.style.backgroundColor = "#0D1117"
        let div1 = document.createElement("div")
        div1.style.width = "60px";
        div1.style.display = "flex"
        div1.style.justifyContent = "space-between"
        a1.addEventListener("click", (e) => {
            deleteData(`${filePath}/${file}`)
        })
        div1.append(a1, a)
        div.append(title, div1)
        // document.querySelector(".showFileContent").appendChild(title)
        // document.querySelector(".showFileContent").appendChild(a)
        document.querySelector(".showFileContent").append(div, contentContainer);
    } catch (error) {
        console.error('Error fetching file content:', error);
    }
}


async function downlaodFile(filepath, fileName) {
    const { data, error } = await supabase.storage
        .from(bucketName)
        .download(`${filepath}/${fileName}`);

    if (error) {
        console.error('Error downloading file:', error);
    } else {
        const url = URL.createObjectURL(data);
        return url;
    }
}