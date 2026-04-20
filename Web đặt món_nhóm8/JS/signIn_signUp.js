$(document).ready(function () {

    $("#userIcon").click(function () {
        var currentUser = localStorage.getItem("currentUser");
        if (!currentUser) {
            $("#authModal").modal("show");
        } else {
            window.location.href = "informationUser.html";
        }
    });

    $("#showRegister").click(function (e) {
        e.preventDefault();
        $("#helpRegister").hide();
        $("#loginName, #pwd, #btnLogin").hide();
        $("#registerForm").show();
        $("#pwdError").hide();
        $("#modalTitle").text("Đăng ký");
    });

    $("#showLogin").click(function (e) {
        e.preventDefault();
        $("#loginName, #pwd, #btnLogin").show();
        $("#helpRegister").show();
        $("#modalTitle").text("Đăng nhập");
        $("#registerForm").hide();
        $("#pwdError").show();
    });

    $("#btnLogin").click(function () {
        let user = JSON.parse(localStorage.getItem("user"));
        let name = $("#loginName").val();
        let pwd = $("#pwd").val();

        $("#loginError").text("");
        $("#pwdError").text("");
        if (!user || user.username !== name || user.password !== pwd) {
            $("#pwdError").text("Sai tài khoản hoặc mật khẩu!");
            return;
        }

        localStorage.setItem("currentUser", name);
        alert("Đăng nhập thành công!");
        $("#authModal").modal("hide");
    });

    $("#btnRegister").click(function () {

        var regRegisterName = /^[A-Za-z\d]+$/;
        var regRegisterPWD = /^(?=.*[A-Z]).{8,}$/;

        let name = $("#registerName").val();
        let pwd = $("#registerPWD").val();
        let rePwd = $("#registerRePWD").val();

        // reset lỗi
        $("#registerError").text("");
        $("#registerPWDError").text("");
        $("#RePWDError").text("");

        // check rỗng
        if (name === "") {
            $("#registerError").text("Chưa nhập tên đăng nhập!");
            return;
        }

        if (pwd === "") {
            $("#registerPWDError").text("Chưa nhập mật khẩu!");
            return;
        }

        if (rePwd === "") {
            $("#RePWDError").text("Chưa nhập xác nhận mật khẩu!");
            return;
        }

        // regex username
        if (!regRegisterName.test(name)) {
            $("#registerError").text("Tên đăng nhập không chứa ký tự đặc biệt!");
            return;
        }

        // regex password
        if (!regRegisterPWD.test(pwd)) {
            $("#registerPWDError").text("Mật khẩu ≥ 8 ký tự và có ít nhất 1 chữ hoa!");
            return;
        }

        // check trùng mật khẩu
        if (pwd !== rePwd) {
            $("#RePWDError").text("Mật khẩu không khớp!");
            return;
        }

        // lưu
        localStorage.setItem("user", JSON.stringify({
            username: name,
            password: pwd
        }));


        let existingUser = JSON.parse(localStorage.getItem("user"));
        if (existingUser && existingUser.username === name) {
            $("#registerError").text("Tài khoản đã tồn tại!");
            return;
        }

        localStorage.setItem("currentUser", name);

        alert("Đăng ký thành công!");
        $("#authModal").modal("hide");
    });

});

$('#authModal').on('show.bs.modal', function () {
    $(this).find("input").val("");
    $(this).find("span").text("");
    $("#registerForm").hide();
    $("#loginName, #pwd, #btnLogin").show();
    $("#helpRegister").show();
    $("#modalTitle").text("Đăng nhập");
});