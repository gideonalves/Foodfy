const hideShow = document.querySelectorAll(".hideShow")
const detailsContent = document.querySelectorAll(".content")

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