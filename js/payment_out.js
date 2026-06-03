// ==============================================
// 1. 页面加载时执行：读取缓存 + 渲染页面
// ==============================================
window.onload = function () {
  // 从sessionStorage读取之前的购物车
  const savedCart = sessionStorage.getItem('cart_out')
  if (savedCart) {
    cart = JSON.parse(savedCart)
  }

  renderCartList()   // 渲染购物车
  calcTotal()    // 计算总价
}

function calcTotal() {
  let total = cart.reduce((sum, item) => sum + item.total, 0)
  document.getElementById('total-price').innerText = total
  sessionStorage.setItem('total_price', total);
  return total
}

function renderCartList() {
  const body = document.getElementById('cart-display')
  let html = ''

  cart.forEach((item, index) => {
    html += `
    <table>
      <tr>
        <td>${index + 1}</td>
        <td>${item.name}</td>
        <td>${item.price}</td>
        <td>${item.count}</td>
        <td>${item.total}</td>
      </tr>
      </table>
    `
  })

  body.innerHTML = html
}

// ==============================================
// 2. 提交按钮时执行：验证 + 存储缓存 + 跳转
// ==============================================
async function submitInfo(){
    // 提取当前页面已生成的支付单号
    const pay_order = document.getElementById('payment_number').value.trim();

    if (!/^\d{28}|\d{31}$/.test(pay_order)) {
      tip.innerText = '支付单号不能为空，请正确填写';
      tip.style.color = 'red'; 
      return;
    }

    sessionStorage.setItem('pay_order', pay_order);
    window.location.href = '../点餐支付/submit_out.html';    
}

