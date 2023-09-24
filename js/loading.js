const c = (el) => document.createElement(el)
const g = (tag) => document.querySelector(tag)
const gAll = (tag) => document.querySelectorAll(tag)

function showLoading() {
    const div = c('div')
    div.classList.add("loading", "centralize")
    document.body.appendChild(div)

    const span = c('span')
    span.classList.add('loadingAnimation')
    div.appendChild(span)
    
}

function hideLoading() {
    const loadings = gAll('.loading')
    if(loadings.length){
        loadings[0].remove()
    }
}