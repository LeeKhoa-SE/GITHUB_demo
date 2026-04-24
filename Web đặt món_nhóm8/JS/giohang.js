let cart = JSON.parse(localStorage.getItem("cart")) || [];

const CartPage = {

    init() {
        this.render();
    },

    increase(id) {
        let item = cart.find(i => i.id === id);
        if (item) item.quantity++;

        this.save();
    },

    decrease(id) {
        let item = cart.find(i => i.id === id);

        if (item) {
            item.quantity--;
            if (item.quantity <= 0) {
                cart = cart.filter(i => i.id !== id);
            }
        }

        this.save();
    },

    save() {
        localStorage.setItem("cart", JSON.stringify(cart));
        this.render();
    },

    render() {
        let container = document.querySelector("#cartContainer");
        let totalEl = document.querySelector("#totalPrice");

        if (!container) return;

        if (cart.length === 0) {
            container.innerHTML = `
                <div class="text-center py-5">
                    <h5>Giỏ hàng trống</h5>
                    <a href="menu.html" class="btn btn-secondary">Đi chọn món</a>
                </div>
            `;
            totalEl.innerText = "0đ";
            return;
        }

        let html = "";
        let total = 0;

        cart.forEach(item => {
            total += item.price * item.quantity;

            html += `
                <div class="d-flex align-items-center mb-3 border-bottom pb-3">
                    <img src="${item.img}" style="width:80px;height:80px;object-fit:cover">
                    
                    <div class="ms-3 flex-grow-1">
                        <h6>${item.name}</h6>
                        <div>${item.price.toLocaleString()}đ</div>
                    </div>

                    <div class="quantity-box">
                        <button class="quantity-btn" onclick="CartPage.decrease(${item.id})">−</button>
                        <span class="quantity-number">${item.quantity}</span>
                        <button class="quantity-btn" onclick="CartPage.increase(${item.id})">+</button>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
        totalEl.innerText = total.toLocaleString() + "đ";
    }
};

document.addEventListener("DOMContentLoaded", () => CartPage.init());