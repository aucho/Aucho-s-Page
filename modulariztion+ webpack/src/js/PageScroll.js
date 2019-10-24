/**
 * 页面window.scrolltop/window.innerHeight
 * section1: [0 , 1)
 * s2:[1 , 2)
 * s3:[ 2 ]
 */
import $ from 'jquery'

function init(){
  let catmag = $('.list-item-home').offset().left-$('.catalog').offset().left + ($('.list-item-home').width()- $('.text-bottom-line').width())/2
  $('.text-bottom-line').css('margin-left',`${catmag}px`)
}
init()

// 页面滚动效果
function scrollto(dst){
  $('html,body').animate(
    { scrollTop:$(dst).offset().top },
    {
      duration:500, 
      easing:'swing'
    })
}
// 绿条滚动效果
function greenline(marg){
  $('.text-bottom-line').animate(
    { marginLeft: marg },
    {
      duration: 500,
      easing: 'swing'
    },
    )
}
//标签切换效果 参0为目标list-item
function tagSwitchTo(listItem){
  $('.header-container ul li').removeClass('active')
  $(listItem).addClass('active')
  var marg = $(listItem).offset().left-$('.catalog').offset().left + ($(listItem).width()- $('.text-bottom-line').width())/2
  greenline(marg)
}

// 滚轮导致的页面上下滑动效果
document.addEventListener('wheel', wheel)
function wheel(event){
  if (event.deltaY===0)
    return 
  // 当前出于第sectionN个section
  // section1状态 全1屏幕   section2状态 部分1+部分2或全2 section3...
  // 共有 totalN 个section
  let totalN = document.body.clientHeight/window.innerHeight 
  let sectionN = $(window).scrollTop()/window.innerHeight + 1
  let toN = event.deltaY>0 ? Math.ceil(sectionN) : Math.floor(sectionN)
  if(toN === sectionN) 
    toN = event.deltaY>0 ? sectionN+1 : sectionN-1
  // 如果滑动处于边界状态 就别动了
  if(toN <1 || toN>totalN ) 
    return
  scrollto(`#section${toN}`)
}

// 点击目录标签实现滑动
function catScroll(catitem, to){
  $(catitem)
  .click(function(e){
    tagSwitchTo(this)
    scrollto(to)
  })
  .mouseenter(function(e){
    // 计算底部绿条偏移量
    var marg = $(this).offset().left-$('.catalog').offset().left + ($(this).width()- $('.text-bottom-line').width())/2
    greenline(marg, to)
  })
  .mouseleave(function(){
    let sectionN = $(window).scrollTop()/window.innerHeight
    switch(sectionN){
      case 0:
        tagSwitchTo('.list-item-home')
        break
      case 1:
        tagSwitchTo('.list-item-archives')
        break
      case 2:
        tagSwitchTo('.list-item-about')
        break
    }
  })
}
catScroll('.list-item-home','#section1')
catScroll('.list-item-archives','#section2')
catScroll('.list-item-about','#section3')

// 页面滑动导致标签变化
document.addEventListener('scroll', changeTags())
function changeTags(){
  let sn = $(window).scrollTop()/window.innerHeight
  let oldSection = sn < 1 ? 0 : (sn<2?1:2)
  return function(){
    let sn = $(window).scrollTop()/window.innerHeight
    let sectionN = sn < 1 ? 0 : (sn<2?1:2)
    if(sectionN===oldSection)
      return
    switch(sectionN){
      case 0:
        tagSwitchTo('.list-item-home')
        $('header').css('opacity',0)
        break
      case 1:
        tagSwitchTo('.list-item-archives')
        $('header').css('opacity',1)
        break
      case 2:
        tagSwitchTo('.list-item-about')
        $('header').css('opacity',1)
        break
    }
    oldSection = sectionN
  }
}
// header到section2出现
document.addEventListener('scroll', showHeader)
function showHeader(){
  let scrollTop = $(window).scrollTop()
  let windowHeight = window.innerHeight
  let header = $('header.header')
  let opacityRange = windowHeight - scrollTop
  if(opacityRange<=2*header.height() && opacityRange>=0)
  {
    header.css('opacity', 1-opacityRange/(1*header.height()))
  }
}


/*------ 移动端 控制菜单出现 ------*/
//  css执行无线循环动画 js通过设置相同频率的动画暂停和继续控制按键按到菜单的动作 
// 但是 即使设置settimeout频率与动画循环频率相同 仍然存在时间差 差值虽然小但不固定 
// 多次操作后 会出现动画播放到一般的情况
//修正方案
//css动画只执行一次 包括进出 每次循环开始和结束（一开一关算一次循环）时 addclass，removeclass  更新状态 中途暂停控制
// 会有误差但不会堆叠 在通过时间差修正

// 流程 点击按钮 添加class 下移 动画暂停 点击 动画继续 动画停止、动画移除 --循环
$('.menu-icon,.catalog').click((function(){
  let isRunning = false
  let counter = 0
  return function(){
    if (!isRunning){
      isRunning = true
      counter ++
      if (counter%2){
        $('.menu-icon').addClass('menu-enter')  
        $('.catalog').addClass('catdown')
        $('.menu-enter span:nth-child(n)').css('animation-play-state','running')
        $('.catdown').css('animation-play-state','running')
        setTimeout(()=>{
          $('.catdown').css('animation-play-state','paused')
          $('.menu-enter span:nth-child(n)').css('animation-play-state','paused')
          isRunning = false
        },500)
      }
      else{
        $('.menu-enter span:nth-child(n)').css('animation-play-state','running')
        $('.catdown').css('animation-play-state','running')
        setTimeout(()=>{
          $('.menu-icon').removeClass('menu-enter')  
          $('.catalog').removeClass('catdown')
          isRunning = false
        },500)
      }
    }
  }
})())
