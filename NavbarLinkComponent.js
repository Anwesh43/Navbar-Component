const w = window.innerWidth, h = window.innerHeight,fontSize = h/30
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
class NavbarElement {
    constructor(x,y,link,size) {
        this.x = x
        this.y = y
        this.link = link
        this.size = size
        this.scale = 0
        this.dir = 0
    }
    draw(context) {
        context.fillStyle = 'white'
        const tw = context.measureText(this.link.title).width
        context.fillText(this.link.text,this.x+this.size/2-tw/2,this.y)
        context.strokeStyle = '#00838F'
        const mx = this.x+this.size/2
        for(var i=0;i<2;i++) {
            context.beginPath()
            context.moveTo(mx,this.y+fontSize/2)
            context.lineTo(mx-(2*i-1)*(this.size/2)*this.scale,this.y+fontSize/2)
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
        const condition = x>=this.x && x<=this.x+this.size && dir == 0
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
