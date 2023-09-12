const c = (el) => document.createElement(el)
const g = (tag) => document.querySelector(tag)
const gall = (tag) => document.querySelectorAll(tag)

function showLoading() {
    const div = c('div')
    div.classList.add("loading", "centralize")
    document.body.appendChild(div)

    const label = c('label')
    label.innerHTML = "Carregando..."
    div.appendChild(label)
    
}

function hideLoading() {
    const loadings = gall('.loading')
    if(loadings.length){
        loadings[0].remove()
    }
}