/**
 * File: giaohang.js
 * Quản lý giỏ hàng, địa chỉ và thời gian giao hàng
 */

// 1. Dữ liệu menu (Khớp chính xác với thứ tự các nút "+ Thêm" trong HTML)
const menuData = [
    { id: 1, name: 'Phở Bò Tái', price: 55000 },
    { id: 2, name: 'Cơm Tấm Sườn Bì Chả', price: 55000 },
    { id: 3, name: 'Bún Bò Huế', price: 65000 },
    { id: 4, name: 'Hủ Tiếu', price: 55000 }
];

// 2. Trạng thái ứng dụng
let state = {
    cart: [

    ],
    shippingFee: 15000,
    deliveryInfo: {
        address: '',
        timeType: 'now', // 'now' hoặc 'later'
        date: '',
        timeSlot: ''
    }
};

const DeliveryApp = {
    /**
     * Khởi tạo ứng dụng
     */
    init() {
        console.log("Ứng dụng Quán Anh 3 đã sẵn sàng!");

        // --- A. XỬ LÝ ĐỊA CHỈ & THỜI GIAN ---
        const radioNow = document.getElementById('now');
        const radioLater = document.getElementById('later');
        const dateSelect = document.getElementById('delivery-date');
        const timeSelect = document.getElementById('delivery-time');

        // Hàm ẩn/hiện chọn thời gian dựa trên Radio
        const toggleTimeFields = () => {
            const isLater = radioLater.checked;
            dateSelect.disabled = !isLater;
            timeSelect.disabled = !isLater;
            state.deliveryInfo.timeType = isLater ? 'later' : 'now';
        };

        if (radioNow) radioNow.onchange = toggleTimeFields;
        if (radioLater) radioLater.onchange = toggleTimeFields;

        // Thiết lập trạng thái ban đầu cho các ô select
        if (radioNow && radioLater) toggleTimeFields();

        // --- B. XỬ LÝ CHỌN MÓN ---
        // Tìm tất cả các nút "+ Thêm" trong Cột 2
        const addButtons = document.querySelectorAll('.col-lg-5 .btn-warning');
        addButtons.forEach((btn, index) => {
            btn.onclick = () => this.addToCart(menuData[index]);
        });

        // --- C. RÀNG BUỘC NÚT THANH TOÁN ---
        const checkoutBtn = document.querySelector('.col-lg-3 .btn');
        if (checkoutBtn) {
            checkoutBtn.onclick = (e) => {
                const addressInput = document.getElementById('delivery-address');

                if (state.cart.length === 0) {
                    alert("Giỏ hàng của bạn đang trống!");
                    e.preventDefault();
                    return;
                }

                if (!addressInput.value.trim()) {
                    alert("Vui lòng nhập địa chỉ giao hàng!");
                    addressInput.focus();
                    e.preventDefault();
                    return;
                }

                // 1. Lưu địa chỉ và giỏ hàng (từ state.cart) xuống localStorage
                localStorage.setItem("deliveryAddress", addressInput.value.trim());
                localStorage.setItem("cart", JSON.stringify(state.cart));

                // 2. Chuyển sang trang checkout
                window.location.href = "checkout.html";
            };
        }

        this.render(); // Vẽ giỏ hàng lần đầu
    },

    /**
     * Hàm lưu thông tin địa chỉ (Dùng cho cả nút "Lưu" và khi Thanh toán)
     * @param {boolean} showAlert - Có hiện thông báo alert hay không
     */
    saveDeliveryDetails(showAlert = true) {
        const addrField = document.getElementById('delivery-address');
        const dateField = document.getElementById('delivery-date');
        const timeField = document.getElementById('delivery-time');

        if (!addrField.value.trim()) {
            alert("Vui lòng nhập địa chỉ nhận hàng!");
            addrField.focus();
            return;
        }

        state.deliveryInfo.address = addrField.value.trim();
        state.deliveryInfo.date = dateField.value;
        state.deliveryInfo.timeSlot = timeField.value;

        if (showAlert) {
            alert("Thông tin giao hàng đã được lưu!");
        }
    },

    /**
     * Thêm món ăn vào giỏ
     */
    addToCart(product) {
        const existingItem = state.cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            // Lấy ảnh từ card tương ứng trong HTML
            const cards = document.querySelectorAll('.col-lg-5 .card');
            const imgPath = cards[product.id - 1].querySelector('img').src;
            state.cart.push({ ...product, quantity: 1, img: imgPath });
        }
        this.render();
    },

    /**
     * Thay đổi số lượng món ăn
     */
    changeQty(id, delta) {
        const item = state.cart.find(i => i.id === id);
        if (item) {
            item.quantity += delta;
            if (item.quantity <= 0) {
                state.cart = state.cart.filter(i => i.id !== id);
            }
        }
        this.render();
    },

    /**
     * Cập nhật giao diện Giỏ hàng (Cột 3)
     */
    render() {
        const cartContainer = document.querySelector('.col-lg-3 .flex-grow-1');
        const subtotalEl = document.querySelector('.col-lg-3 .border-top div:nth-child(1) span:last-child');
        const totalEl = document.querySelector('.col-lg-3 .fs-5 .text-success');

        if (!cartContainer) return;

        if (state.cart.length === 0) {
            cartContainer.innerHTML = '<p class="text-center text-muted small">Giỏ hàng trống</p>';
        } else {
            cartContainer.innerHTML = state.cart.map(item => `
                <div class="d-flex align-items-center mb-3 border-bottom pb-2">
                    <img src="${item.img}" class="rounded me-2" width="50" height="50" style="object-fit: cover;">
                    <div class="flex-grow-1">
                        <div class="fw-bold" style="font-size: 0.8rem;">${item.name}</div>
                        <div class="d-flex justify-content-between align-items-center mt-1">
                            <div class="btn-group btn-group-sm">
                                <button class="btn btn-light border" onclick="DeliveryApp.changeQty(${item.id}, -1)">-</button>
                                <span class="px-2">${item.quantity}</span>
                                <button class="btn btn-light border" onclick="DeliveryApp.changeQty(${item.id}, 1)">+</button>
                            </div>
                            <span class="small fw-bold">${(item.price * item.quantity).toLocaleString()}đ</span>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        // Tính toán số tiền
        const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const total = subtotal > 0 ? subtotal + state.shippingFee : 0;

        // Cập nhật UI tiền tệ
        if (subtotalEl) subtotalEl.innerText = `${subtotal.toLocaleString()}đ`;
        if (totalEl) totalEl.innerText = `${total.toLocaleString()}đ`;
    }
};

// Khởi chạy khi tài liệu sẵn sàng
document.addEventListener('DOMContentLoaded', () => DeliveryApp.init());