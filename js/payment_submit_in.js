
// ==============================================
// 1. 页面加载时执行：读取缓存 + 渲染页面
// ==============================================
window.onload = function () {
  // 从sessionStorage读取之前的购物车
  const savedCart = sessionStorage.getItem('cart_in')
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

// 初始化客户端
const supabaseUrl = 'https://vslbcwnuqlgegvfnrfej.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzbGJjd251cWxnZWd2Zm5yZmVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwMzY0NjIsImV4cCI6MjA5NTYxMjQ2Mn0.tSKIrkx4VoAzxllVq34Xme8ToAP1yHLDI_rCMDWykEQ';
const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);



// 提交逻辑（包含验证 + 直接读取缓存）
async function submitInfo() {
  try {
    // 1. 获取提示元素
    const tip = document.getElementById('tip');

    // 2. 从当前页面输入框取值
    const pay_order = document.getElementById('payment_number').value.trim();
    const eat_type = document.getElementById('eat_type').value.trim();
    const address = 10 ;
    const name = 'clientEatIn';
    const phone = 19900000000 ;

    // 3. 表单验证
    if(!/^(\d{28}|\d{31})$/.test(pay_order)){
        tip.innerText = '支付单号不能为空，且必须为28位或31位数字';
        tip.style.color = 'red';
        return;
    }


    // 4. 保存当前页数据到缓存
    sessionStorage.setItem('eat_type', eat_type);
    sessionStorage.setItem('pay_order', pay_order);

    // 5. 直接读取上一页的缓存
    const total_price = sessionStorage.getItem('total_price');
    const cart_list = sessionStorage.getItem('cart_in');


    // 提交到 Edge Function
    const formData = {
      eat_type,
      address,
      pay_order,
      total_price,
      cart_list,
      name,
      phone,
    };
    const res = await fetch('https://vslbcwnuqlgegvfnrfej.supabase.co/functions/v1/clientIP_agent', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + supabaseKey
       },
      body: JSON.stringify(formData),
    })

    // 2. 【核心修改】：先读取响应体，再判断状态
    // 无论状态码是多少，都先把后端返回的 JSON 拿到手
    const result = await res.json(); 

    // 3. 根据 HTTP 状态码或业务字段进行分发
    if (res.ok) { 
      // ✅ 状态码为 2xx，说明一切正常
      console.log('提交成功:', result.message);
      alert(result.message); // 提示：提交成功！
      sessionStorage.removeItem('cart_in');
      sessionStorage.removeItem('total_price');
      sessionStorage.removeItem('eat_type');
      sessionStorage.removeItem('pay_order');        
    } else { 
        // ❌ 状态码为 4xx/5xx，但我们已经拿到了后端精心准备的提示信息
        console.warn('业务拦截:', result.message);
        alert(result.message); // 提示：提交失败，原因：数据审核未通过...
    }

  } catch (err) {
      // 💥 真正的系统级错误（如断网、跨域被拒等）
      console.error('提交失败。网络或系统异常:', err);
      alert('提交失败。网络连接失败，请稍后重试');
  }
}
