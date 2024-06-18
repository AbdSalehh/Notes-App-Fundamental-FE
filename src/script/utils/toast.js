import Toastify from "toastify-js";
export const Toast = (message, bgcolor) => {
    Toastify({
        text: `${message}`,
        duration: 3000,
        gravity: "bottom",
        position: "center",
        stopOnFocus: true,
        style: {
            background: `${bgcolor}`,
            borderRadius: "6px",
        },
        onClick: function () {},
    }).showToast();
};
