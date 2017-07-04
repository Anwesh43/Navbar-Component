const w = window.innerWidth,const h = window.innerHeight
class NavbarLinkComponent extends HTMLElement {
    constructor() {
        super()
        this.div = document.createElement('div')
        this.color = this.getAttribute('color')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.div)
        const children = this.children
        this.links = []
        for(var i=0;i<children.length;i++) {
            const child = children[i]
            this.links.push({title:child.getAttribute('title'),href:child.getAttribute('href')})
        }
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h/12
        this.div.style.width = canvas.width
        this.div.style.height = canvas.height
        const context = canvas.getContext('2d')
        context.fillStyle = this.color
        context.fillRect(0,0,w,canvas.height)
        this.div.style.background = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
    }
}
