const w = window.innerWidth, h = window.innerHeight,fontSize = h/30
class NavbarLinkComponent extends HTMLElement {
    constructor() {
        super()
        this.div = document.createElement('div')
        this.color = this.getAttribute('color') || '#c62828'
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
        context.font = context.font.replace(/\d{2}/,canvas.height/2)
        context.fillStyle = this.color
        context.fillRect(0,0,w,canvas.height)
        if(!this.elements) {
            this.elements = []
            var tw = 0
            this.links.forEach((link,index) => {
                link.tw = (context.measureText(link.title).width)*2
                tw += link.tw
            })
            var x = w - tw
            this.links.forEach((link,index) => {
                this.elements.push(new NavbarElement(x,canvas.height/2,link)
                x += link.tw
            })
        }
        this.elements.draw(context)
        this.div.style.background = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
        this.animationHandler = new AnimationHandler(this)
        this.div.onmousedown = (event) => {
            const x = event.offsetX
            this.animationHandler.handleTap(x)
        }
    }
    handleTap(x) {
        const tappedElements = this.elements.filter((element)=>element.handleTap(x))
        if(tappedElements.length == 1) {
            return tappedElements[0]
        }
    }
}
class NavbarElement {
    constructor(x,y,link,size) {
        this.x = x
        this.y = y
        this.link = link
        this.scale = 0
        this.dir = 0
    }
    draw(context) {
        const size = this.link.tw
        context.fillStyle = 'white'
        context.fillText(this.link.text,size/4,this.y)
        context.strokeStyle = '#00838F'
        const mx = this.x+size/2
        for(var i=0;i<2;i++) {
            context.beginPath()
            context.moveTo(mx,this.y+fontSize/2)
            context.lineTo(mx-(2*i-1)*(size/2)*this.scale,this.y+fontSize/2)
            context.stroke()
        }
    }
    startUpdating() {
        if(this.scale <= 0) {
            this.dir = 1
        }
        if(this.scale >= 1) {
            this.dir = -1
        }
    }
    handleTap(x) {
        const size = this.link.tw
        const condition = x>=this.x && x<=this.x+size && dir == 0
        if(condition) {
            this.startUpdating()
        }
        return condition
    }
    update() {
        this.scale += this.dir * 0.2
        if(this.scale > 1) {
            this.scale = 1
            this.dir = 0
        }
        if(this.scale < 0) {
            this.scale = 0
            this.dir = 0
        }
    }
    stopped() {
        return this.dir == 0
    }
}
class AnimationHandler {
    constructor(component) {
        this.component.render()
        this.animated = false
        this.elements = []
    }
    handleTap(x) {
        const tappedElement = this.component.handleTap(x)
        if(tappedElement) {
            this.elements.push(tappedElement)
            if(this.animated == false) {
                const interval = setInterval(()=>{
                    if(this.animated == true) {
                        this.component.render()
                        this.elements.forEach((element,index)=>{
                            element.update()
                            if(element.stopped() == true) {
                                this.elements.splice(index,1)
                                if(this.elements.length == 0) {
                                    this.animated = false
                                    clearInterval(interval)
                                }
                            }
                        })
                    }
              },50)
            }
        }
    }
}
customElements.define('nav-bar-link',NavbarLinkComponent)
