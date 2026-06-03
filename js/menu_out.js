// ==============================================
// 1. 商品数据源（整个系统唯一的数据源）
// ==============================================
const menus = [
  { id: 1, name: "面包", price: 5, img: "/images/Bread - 77x49.jpg" },
  { id: 2, name: "豆浆", price: 3, img:"/images/soy_milk 77x112.jpg"},
  { id: 3, name: "卤蛋", price: 2, img:"/images/egg 77x59.jpg"},
  { id: 4, name: "打包费", price: 1, img:"/images/package 70x70.jpg"},
  { id: 5, name: "运费", price: 3, img:"/images/delivery 70x70.jpg"},
]

// ==============================================
// 2. 购物车（JSON数组）
// ==============================================
let cart = []

// ==============================================
// 3. 页面加载时执行：读取缓存 + 渲染页面
// ==============================================
window.onload = function () {
  // 从sessionStorage读取之前的购物车
  const savedCart = sessionStorage.getItem('cart_out')
  if (savedCart) {
    cart = JSON.parse(savedCart)
  }

  renderMenu()   // 渲染商品菜单
  renderCart()   // 渲染购物车
  calcTotal()    // 计算总价
}

// ==============================================
// 4. 渲染商品菜单（HTML自动生成）
// ==============================================
function renderMenu() {
  const menuEl = document.getElementById('menu-list')
  let html = ''

  menus.forEach(item => {
    html += `
      <div>
        <img src="${item.img}">
        ${item.name} —— ${item.price}元
        <button onclick="addToCart(${item.id})">加入购物车</button>
      </div>
    `
  })

  menuEl.innerHTML = html
}

// ==============================================
// 5. 加入购物车
// ==============================================
function addToCart(id) {
  const goods = menus.find(m => m.id === id)

  // 检查是否已在购物车
  const found = cart.find(item => item.id === id)
  if (found) {
    found.count++
    found.total = found.count * found.price
  } else {
    cart.push({
      id: goods.id,
      name: goods.name,
      price: goods.price,
      count: 1,
      total: goods.price
    })
  }

  // 保存到缓存并刷新页面
  saveCartToSession()
  renderCart()
  calcTotal()
}

// ==============================================
// 6. 渲染购物车表格
// ==============================================
function renderCart() {
  const body = document.getElementById('cart-body')
  let html = ''

  cart.forEach((item, index) => {
    html += `
      <tr>
        <td>${index + 1}</td>
        <td>${item.name}</td>
        <td>${item.price}</td>
        <td>
            <button onclick="changeCount(${index}, -1)">-</button>
        ${item.count}
            <button onclick="changeCount(${index}, +1)">+</button>
        </td>
        <td>${item.total}</td>
        <td><button onclick='deleteItem(${index})'>删除</button></td>
      </tr>
    `
  })

  body.innerHTML = html
}

function changeCount(index,num){
    cart[index].count += num;
    if (cart[index].count < 1) {
        cart[index].count = 1;
    }
    cart[index].total = cart[index].count * cart[index].price;
    saveCartToSession();
    renderCart();
    calcTotal();
}
function deleteItem(index) {
    cart.splice(index, 1);
    saveCartToSession();
    renderCart();
    calcTotal();
}

// ==============================================
// 7. 计算总价
// ==============================================
function calcTotal() {
  let total = cart.reduce((sum, item) => sum + item.total, 0)
  document.getElementById('total-price').innerText = total
  return total
}

// ==============================================
// 8. 购物车保存到 sessionStorage
// ==============================================
function saveCartToSession() {
  sessionStorage.setItem('cart_out', JSON.stringify(cart))
}

// ==============================================