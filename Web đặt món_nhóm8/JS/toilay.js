const menuData = [
    { id: 1, name: 'Phở Bò Tái', price: 55000, img: '../IMG/HomePage/pho.png' },
    { id: 2, name: 'Cơm Tấm Sườn Bì Chả', price: 55000, img: '../IMG/HomePage/comtam.jpg' },
    { id: 3, name: 'Bún Bò Huế', price: 65000, img: '../IMG/HomePage/bunbo.jpg' },
    { id: 4, name: 'Hủ Tiếu', price: 55000, img: '../IMG/HomePage/hutieu.png' }
];

let cart = [];

const PickupApp = {
    init() {
        this.renderMenu();
        this.renderCart();
    },

    renderMenu() {
        const menuList = document.getElementById('menu-list');
        menuList.innerHTML = menuData.map(item => `
            <div class="col-6">
                <div class="card border p-2 h-100 shadow-sm">
                    <img src="${item.img}" class="card-img-top rounded mb-2" style="height: 100px; object-fit: cover;">
                    <div class="small fw-bold text-truncate">${item.name}</div>
                    <div class="text-danger fw-bold mb-2">${item.price.toLocaleString()}đ</div>
                    <button class="btn btn-warning btn-sm text-white fw-bold" onclick="PickupApp.addToCart(${item.id})">+ Thêm</button>
                </div>
            </div>
        `).join('');
    },

    addToCart(id) {
        const product = menuData.find(p => p.id === id);
        const existing = cart.find(i => i.id === id);
        if (existing) {
            existing.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        this.renderCart();
    },

    renderCart() {
        const container = document.getElementById('cart-container');
        const totalEl = document.getElementById('total-price');

        if (cart.length === 0) {
            container.innerHTML = '<p class="text-center text-muted small">Chưa có món nào</p>';
            totalEl.innerText = '0đ';
            return;
        }

        container.innerHTML = cart.map(item => `
            <div class="d-flex align-items-center mb-3 border-bottom pb-2">
                <div class="flex-grow-1">
                    <div class="fw-bold small">${item.name}</div>
                    <div class="small text-muted">SL: ${item.quantity} x ${item.price.toLocaleString()}đ</div>
                </div>
                <div class="fw-bold small">${(item.price * item.quantity).toLocaleString()}đ</div>
            </div>
        `).join('');

        const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
        totalEl.innerText = total.toLocaleString() + 'đ';
    },

    goToCheckout() {
        if (cart.length === 0) {
            alert("Vui lòng chọn món!");
            return;
        }

        // Lưu dữ liệu vào LocalStorage
        localStorage.setItem("cart", JSON.stringify(cart));
        localStorage.setItem("serviceType", "pickup"); // Đánh dấu là Tới Lấy
        localStorage.setItem("deliveryAddress", "Nhận tại cửa hàng: 1 Nguyễn Văn Bảo, Gò Vấp");

        window.location.href = "checkout.html";
    }
};

document.addEventListener('DOMContentLoaded', () => PickupApp.init());