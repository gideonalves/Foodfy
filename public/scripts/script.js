cards = document.querySelectorAll(".card")

// GRUPO DE REPETIÇÃO
for (let card of cards) {
    card.addEventListener("click", function () {
        let recipeIndex = card.getAttribute("id")

        console.log(recipeIndex);
        window.location.href = `/recipe/${recipeIndex}`
    })
}

const hideShow = document.querySelectorAll(".hideShow")
const detailsContent = document.querySelectorAll(".details-content")

for (let i = 0; i < hideShow.length; i++) {
    hideShow[i].addEventListener('click', function () {
        if (hideShow[i].innerHTML == 'ESCONDER') {
               detailsContent[i].setAttribute("hidden", true)
            hideShow[i].innerHTML = 'MOSTRAR'
        } else {
            hideShow[i].innerHTML = 'ESCONDER'
            detailsContent[i].removeAttribute('hidden', true)
        }
    })
}



// Paginação
const currentPage = location.pathname
const menuItems = document.querySelectorAll("header .links a")

for (item of menuItems) {
    if(currentPage.includes(item.getAttribute("href"))) {
        item.classList.add("active")
    }
}

function paginate(selectedPage, totalPages) {
        
    let pages = [],
        oldPage

    for(let currentPage = 1; currentPage <= totalPages; currentPage++) {

    const firstAndLastPage = currentPage == 1 || currentPage == totalPages
    const pagesAfterSelectedPage = currentPage <= selectedPage + 2
    const pagesBeforeSelectedPage = currentPage >= selectedPage - 1

        if(firstAndLastPage || pagesBeforeSelectedPage && pagesAfterSelectedPage) {
            
            if (oldPage && currentPage - oldPage > 2) {
                pages.push("...")                
            }

            if (oldPage && currentPage - oldPage == 2) {
                pages.push(oldPage + 1)
            }
                pages.push(currentPage)
                oldPage = currentPage
        }
    }   
    return pages
}

function createPagination(pagination) {
    
    const filter =  pagination.dataset.filter
    const page = +pagination.dataset.page;
    const total = +pagination.dataset.total;
    const pages = paginate(page, total)

    let elements = ""

    for (let page of pages) {
        if(String(page).includes("...")) {
            elements += `<span>${page}"</span>`

        } else {
            if ( filter ) {            
                elements += `<a href="?page=${page}&filter=${filter}">${page}</a>`
            } else {
                elements += `<a href="?page=${page}">${page}</a>`
            }
        }    
    }
    pagination.innerHTML = elements
}

const pagination =  document.querySelector(".pagination")
    if (pagination) {
        createPagination(pagination)
    }


// UPLOAD DE IMAGE
const PhotosUpload = {
    input: "",
    preview: document.querySelector('#photos-preview'),
    uploadLimit: 5, // limite de image
    files: [],
    handleFileInput(event) { 
        const { files: fileList } = event.target
        PhotosUpload.input = event.target
      
        if (PhotosUpload.hasLimit(event)) {
            PhotosUpload.updateInputFiles()
            return
        }

        Array.from(fileList).forEach(file => {

            PhotosUpload.files.push(file)

            const reader = new FileReader()

            reader.onload = () => {
                const image = new Image()
                image.src = String(reader.result)
             
                const div = PhotosUpload.getContainer(image)
                PhotosUpload.preview.appendChild(div)
            }
            reader.readAsDataURL(file)
        })

        PhotosUpload.updateInputFiles()
    },

    getAllFiles() {
        const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer()
        PhotosUpload.files.forEach(file => dataTransfer.items.add(file))
        return dataTransfer.files
    },

    hasLimit(event) {
        const { uploadLimit, input, preview } = PhotosUpload
        const { files: fileList } = input

        if (fileList.length > uploadLimit) {
            alert(`Envie no máximo ${uploadLimit} fotos`)
            event.preventDefault()
            return true
        }

        const photosDiv = []
        preview.childNodes.forEach(item => {
            if (item.classList && item.classList.value == "photo")
                photosDiv.push(item)
        })

        const totalPhotos = fileList.length + photosDiv.length
        if (totalPhotos > uploadLimit) {
            alert("Você atingiu o limite máximo de fotos")
            event.preventDefault()
            return true
        }


        return false
    },

    getContainer(image) {
        const div = document.createElement('div')
        div.classList.add('photo')

        div.onclick = PhotosUpload.removePhoto

        div.appendChild(image)

        div.appendChild(PhotosUpload.getRemoveButton())

        return div
    },

    getRemoveButton() {
        const button = document.createElement('i')
        button.classList.add('material-icons')
        button.innerHTML = "close"
        return button
    },

    removePhoto(event) {
        const photoDiv = event.target.parentNode // = <div class="photo">

        const newFiles = Array.from(PhotosUpload.preview.children).filter(function(file) {
            if(file.classList.contains('photo') && !file.getAttribute('id')) return true
        })
        const index = newFiles.indexOf(photoDiv)
        PhotosUpload.files.splice(index, 1)

        PhotosUpload.updateInputFiles()
        
        photoDiv.remove()
    }, 

      // clica na imagem e exclui
      removeOldPhoto(event) {
        const photoDiv = event.target.parentNode

        if(photoDiv.id) {
            const removedFiles = document.querySelector('input[name="removed_files"]')

            if (removedFiles) {
                removedFiles.value += `${photoDiv.id},`
            }
        }

        photoDiv.remove()
    },

    updateInputFiles() {
        PhotosUpload.input.files = PhotosUpload.getAllFiles()
    }

}

// Galeria de imagem
const ImageGallery = {
    highlight: document.querySelector('.gallery .highlight > img'),
    preview: document.querySelectorAll('.gallery-preview img'),
    setImage(e) {
        const { target } = e
        // Remove as imagem ativa
        ImageGallery.preview.forEach(preview => preview.classList.remove('active'))

        // ativa as imagem com click
        target.classList.add('active')

        // troca da imagem grande
        ImageGallery.highlight.src = target.src
        Lightbox.image.src = target.src
    }
}

const Lightbox = {
    target: document.querySelector('.lightbox-target'),
    image: document.querySelector('.lightbox-target img'),
    //abrir
    closeButton: document.querySelector('.lightbox-target a.lightbox-close'),
    open() {
        Lightbox.target.style.opacity = 1
        Lightbox.target.style.top = 0
        Lightbox.target.style.bottom = 0
        Lightbox.closeButton.style.top = 0
    },
    //fechar
    close() {
        Lightbox.target.style.opacity = 1
        Lightbox.target.style.top = "-100%"
        Lightbox.target.style.bottom = "initial"
        Lightbox.closeButton.style.top = "-80px"
    }
}
            