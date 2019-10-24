import $ from 'jquery'
var canvas = document.getElementById('canvas')
    var ctxt = canvas.getContext('2d')
    canvas.width = 0.7 * window.innerWidth
    canvas.height = 0.7 * window.innerHeight

    /* 由于每次监听mousemove在指定位置画圆点的频率不是很够
      如果鼠标移动的快的话，会形成很多点，因此考虑如果把这些点
      连起来 应该会好一点*/
      
    var pen = {
      radius: 3,
      rgb: 'rgb(0,0,0,1)',
      x: 0,
      y: 0,
      lastX: 0,
      lastY: 0,
      isMouseDown: false,
      isEraser: false,
      draw: function (){
        ctxt.fillStyle = this.rgb
        ctxt.beginPath()
        ctxt.moveTo(this.lastX,this.lastY)
        ctxt.lineTo(this.x, this.y)
        ctxt.closePath()
        ctxt.stroke()

        // 将本次x,y存到lastXY中
        this.lastX = this.x
        this.lastY = this.y
      },
      clear: function(){
        ctxt.clearRect(this.x-10,this.y-10,20,20)

        // 将本次x,y存到lastXY中
        this.lastX = this.x
        this.lastY = this.y
      }
    }
    // 移动端
    canvas.addEventListener('touchmove',event=>{
      pen.x = event.offsetX
      pen.y = event.offsetY
      console.log()
      if (pen.isEraser) 
        pen.clear()
      else 
        pen.draw()
    })

    // 判断鼠标是否按下
    canvas.addEventListener('mousedown', event=>{
      pen.isMouseDown = true
      pen.lastX = event.offsetX
      pen.lastY = event.offsetY
    })
    canvas.addEventListener('mouseup', ()=>{
      pen.isMouseDown = false
    })
    // 离开画板 跟鼠标取消点击一样
    canvas.addEventListener('mouseout', ()=>{
      pen.isMouseDown = false
    })
    
    // 按下鼠标时 画图
    canvas.addEventListener('mousemove', event=>{
      if (!pen.isMouseDown) return
      pen.x = event.offsetX
      pen.y = event.offsetY
      if (pen.isEraser) 
        pen.clear()
      else 
        pen.draw()
    })

    /*工具栏*/
    document.getElementById('toEraser').addEventListener('click',()=>{
      pen.isEraser = true
    })
    document.getElementById('toPen').addEventListener('click',()=>{
      pen.isEraser = false
    })
    document.getElementById('new').addEventListener('click',()=>{
      ctxt.clearRect(0,0,canvas.width,canvas.height)
    })

    $('.sketchpad a').click(function(){
      $('.archive-list').css('left','0')
      $('.sketchpad').removeClass('slideIn')
      setTimeout(()=>{
        $('.sketchpad').css('display','none')
      },1000)
    })