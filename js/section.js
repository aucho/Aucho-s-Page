  'use strict'

  // 保持每个section高度和窗口一致
  $('.fullscreen').css('height',`${window.innerHeight}`)
  $(window).resize(()=>{
    $('.fullscreen').css('height',`${window.innerHeight}`)
  })

//-----------------------首页文字动画--------------------------
let stringArr = [
  'It\'s great to see you!',
  'I stored some demos here',
  'No Plug-ins. All the effects were made myself',
  'The website is still under construction '
]
let StrArrCounter = 0
swap()
let swapInterval = setInterval(swap,8000)


// 进入--执行内部定时器-等**秒钟-取消定时器--离开  
// 等待小于外层定时器时间间隔 差值为动画时间
function swap(){
  let i = 0   //用于控制字符串显示长度
  let pre = 4 //用作提前显示 ‘|’ 的标记
  let p = $('.title p')
  let n = StrArrCounter % stringArr.length
  p.text('')
  // 进入 执行css动画
  p.removeClass('swapout')
  // p.addClass('swapin')
  // 执行定时器
  let strInterval = setInterval(typeEffect(stringArr[n]), 125)
  let lineInterval = setInterval(line ,500)
  function typeEffect(string){
    return ()=>{
      if (pre)  
        return
      let showStr = string.substring(0,i)
      p.text(showStr+'|')
      i++
      if (i > string.length)
        clearInterval(strInterval)
    }
  }
  function line(){
    if (!pre && i <= stringArr[n].length)
      return
    let flashLine = i%2 ? '' : '|'
    let showStr = pre? flashLine : (stringArr[n] + flashLine)
    p.text(showStr)
    if (pre) pre--
    i++
  }
  // 等待后取消定时器
  setTimeout(() => {
    clearInterval(lineInterval)
    p.addClass('swapout')
    // p.removeClass('swapin')
  }, 7500);
  return (function(){ StrArrCounter++ })()
}


// 文字浮动

$(window).bind('mousemove',textMove()) 
function textMove(){
  let running = false
  return function(event){
    if (running) return
    running = true
    
    let translateX = -(event.clientX - $(this).width()/2)/20
    let translateY = -(event.clientY - $(this).height()/2)/12
    $('.archive-list').css('transform',`translate(${translateX}px,${translateY}px)`)
    setTimeout(()=>{
      running = false
    },200)
  }
}


// 文字

// $('.li-name')
// .mouseenter( (function(){
  // //let running = true
//   return function(){

//     $(this).animate({
//       fontSize: Math.floor(parseInt($(this).css('font-size'))*1.2) // + 'px'
//     },{
//       duration: 200,
//       easing:'linear'
//     })
//   }
// })())
// .mouseleave((function(){
//   let 
//   return function(){
//     $(this).animate({
//       fontSize: Math.ceil(parseInt($(this).css('font-size'))/1.2) // + 'px'
//     },{
//       duration: 200,
//       easing:'linear'
//     })    
//   }
// })())


//文字点击 
function wordClick(itemName,disp){
  $('.li-'+itemName).click(function(){
    $('.archive-list').css('left','-120%')
    $('.'+itemName).css('display',disp)
    setTimeout(()=>{
      $('.'+itemName).addClass('slideIn')
    },100)
  })
}
wordClick('snake','flex')
wordClick('tetris','block')
wordClick('sketchpad','block')

// ---------------section3-------------
// 反馈
$('.feedback input').click(function(){
  $('.alert').text('')
  $('.feedback .feedback-email').css('visibility','visible')
  $('.feedback button').css('visibility','visible')
})

// ajax 
$('.feedback .submit').click(submition())
function submition(){
  let time = 0
  return function() {
    let timePassed = (Date.now()-time)/1000
    let feedBack = $('.feedback-content')[0].value
    let contactMethod = $('.feedback-email')[0].value
    let alertText = $('.alert') 
    let re = /[\`\{\}\*\+\'\"\<\>\.\/\\]+/
    if (!feedBack || !contactMethod){
      alertText.text('请填写信息')
      return
    }
    else if(re.test(feedBack) || re.test(contactMethod)){
      alertText.text('检测到非法字符')
      return
    }
    if (timePassed <30){
      alertText.text(`try it ${30-timePassed}s later`)
      return
    }
    $.post('/api/feedBack',{
      content:  feedBack,
      email:  contactMethod
    },(params)=>{
      time = Date.now()
      if (params !== 'succeed')
        alertText.text('发送错误')
      else
        alertText.text('发送成功')
    })
    .catch(err=>{
      alertText.text('发送失败 请检查网络')
    })
  }
}