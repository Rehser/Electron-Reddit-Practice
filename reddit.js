const axios = require('axios')
const {remote, ipcRenderer} = require('electron')
const {BrowserWindow, Menu} = remote

let posts = []
this.initMenu();

axios.get('https://www.reddit.com/r/aww.json')
    .then(response => {
        posts = response.data.data.children
        this.renderPosts(posts)
    })
    .catch(error => {
        console.log(error)
    })

function renderPosts(posts){
    posts.forEach(element => {
        document.getElementById('posts').innerHTML = document.getElementById('posts').innerHTML + 
        `
        <li class="list-group-item d-flex align-items-center" data-image="${element.data.preview.images[0].source.url}">
            <img src="${element.data.thumbnail}" alt="pic" class="thumbnail">
            <div>${element.data.title}</div>
        </li>
        `
    })

    this.addEventListeners()
}

function addEventListeners(){
    document.querySelectorAll('.list-group-item').forEach(element => {
        element.addEventListener('click', function () {

            let imageWindow = new BrowserWindow({
                width: 500,
                height: 500
            })

            imageWindow.on('close', () => {
                imageWindow = null
            })

            imageWindow.loadURL('file://' + __dirname + '/image.html?image=' + this.getAttribute('data-image'))
            imageWindow.show()
        })
    })
}

function initMenu(){
    const menu = Menu.buildFromTemplate([
        {
            label: 'File',
            submenu: [
                {
                    label: 'New Window', 
                    accelarator: 'CmdOrCtrl+W'
                },
                {
                    label: 'Settings', 
                    accelarator: 'CmdOrCtrl+,',
                    click: () => {
                        ipcRenderer.send('toggle-settings')
                    }
                },
                {type: 'separator'},
                {
                    label: 'Quit', 
                    accelarator: 'CmdOrCtrl+Q'
                }
            ]
        },
        {
            label: 'Edit',
            submenu: [
                {label: 'Item 1'},
                {label: 'Item 2'},
                {label: 'Item 3'}
            ]
        }
    ])

    Menu.setApplicationMenu(menu)
}